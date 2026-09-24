import { createHmac, randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

const SESSION_COOKIE = "__Host-property-admin";
const FLOW_COOKIE = "__Host-property-admin-flow";
const SESSION_MAX_AGE = 8 * 60 * 60;
const FLOW_MAX_AGE = 10 * 60;
const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function redirect(res, url) {
  res.statusCode = 303;
  res.setHeader("Location", url);
  res.end();
}

function config() {
  const clientId = String(process.env.PROPERTY_GOOGLE_CLIENT_ID || process.env.GBP_GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = String(process.env.PROPERTY_GOOGLE_CLIENT_SECRET || process.env.GBP_GOOGLE_CLIENT_SECRET || "").trim();
  const origin = String(process.env.PROPERTY_ADMIN_ORIGIN || process.env.GBP_APP_ORIGIN || "https://www.anantharealestate.in").replace(/\/$/, "");
  const emails = String(process.env.PROPERTY_ADMIN_EMAILS || process.env.GBP_ADMIN_EMAILS || "shashankjanapati@gmail.com")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const sessionSecret = String(process.env.PROPERTY_ADMIN_SESSION_SECRET || clientSecret);
  if (!clientId || !clientSecret || !emails.length || sessionSecret.length < 16) return null;
  return {
    clientId,
    clientSecret,
    origin,
    emails,
    sessionSecret,
    callback: `${origin}/api/property-auth?action=callback`,
  };
}

function equal(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

function sign(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token, secret) {
  if (!token) return null;
  const [body, sig] = String(token).split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  if (!equal(sig, expected)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function cookie(req, name) {
  return (req.headers.cookie || "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(name + "="))
    ?.slice(name.length + 1);
}

function setCookie(res, name, value, maxAge, sameSite = "Lax") {
  const existing = res.getHeader("Set-Cookie");
  const next = `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=${sameSite}; Max-Age=${maxAge}`;
  res.setHeader("Set-Cookie", existing ? (Array.isArray(existing) ? [...existing, next] : [existing, next]) : next);
}

function allowed(email, emails) {
  return typeof email === "string" && emails.includes(email.toLowerCase());
}

export default async function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  const cfg = config();
  if (!cfg) {
    return send(res, 503, {
      error: "Property admin SSO is not configured. Add Google OAuth client credentials for the property admin.",
    });
  }

  const q = new URL(req.url, cfg.origin).searchParams;
  const action = q.get("action") || "session";

  if (action === "login") {
    if (req.method !== "GET") return send(res, 405, { error: "Method not allowed." });
    const state = randomBytes(32).toString("base64url");
    const verifier = randomBytes(32).toString("base64url");
    const nonce = randomBytes(32).toString("base64url");
    const flow = sign({ state, verifier, nonce, exp: Date.now() + FLOW_MAX_AGE * 1000 }, cfg.sessionSecret);
    setCookie(res, FLOW_COOKIE, flow, FLOW_MAX_AGE, "Lax");
    const params = new URLSearchParams({
      client_id: cfg.clientId,
      redirect_uri: cfg.callback,
      response_type: "code",
      scope: "openid email profile",
      state,
      nonce,
      code_challenge: createHash("sha256").update(verifier).digest("base64url"),
      code_challenge_method: "S256",
      prompt: "select_account",
    });
    return redirect(res, `https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  }

  if (action === "callback") {
    if (req.method !== "GET") return send(res, 405, { error: "Method not allowed." });
    if (q.has("error")) return redirect(res, `${cfg.origin}/admin/properties?auth=cancelled`);
    const flow = verify(cookie(req, FLOW_COOKIE), cfg.sessionSecret);
    if (!flow || flow.exp < Date.now() || !equal(q.get("state"), flow.state)) {
      return redirect(res, `${cfg.origin}/admin/properties?auth=expired`);
    }
    const code = q.get("code");
    if (!code) return redirect(res, `${cfg.origin}/admin/properties?auth=missing_code`);

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        code,
        code_verifier: flow.verifier,
        grant_type: "authorization_code",
        redirect_uri: cfg.callback,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!tokenResponse.ok) return redirect(res, `${cfg.origin}/admin/properties?auth=token_error`);
    const tokens = await tokenResponse.json();
    if (!tokens.id_token) return redirect(res, `${cfg.origin}/admin/properties?auth=id_token_missing`);

    const { payload } = await jwtVerify(tokens.id_token, JWKS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: cfg.clientId,
      algorithms: ["RS256"],
    });
    if (!equal(payload.nonce, flow.nonce) || payload.email_verified !== true || !allowed(payload.email, cfg.emails)) {
      return redirect(res, `${cfg.origin}/admin/properties?auth=unauthorized`);
    }

    const session = {
      email: String(payload.email).toLowerCase(),
      csrf: randomBytes(24).toString("base64url"),
      exp: Date.now() + SESSION_MAX_AGE * 1000,
    };
    setCookie(res, SESSION_COOKIE, sign(session, cfg.sessionSecret), SESSION_MAX_AGE, "Strict");
    setCookie(res, FLOW_COOKIE, "", 0, "Lax");
    return redirect(res, `${cfg.origin}/admin/properties`);
  }

  if (action === "logout") {
    if (req.method !== "POST") return send(res, 405, { error: "Method not allowed." });
    if (req.headers.origin !== cfg.origin) return send(res, 403, { error: "Invalid request origin." });
    setCookie(res, SESSION_COOKIE, "", 0, "Strict");
    return send(res, 200, { ok: true });
  }

  if (req.method !== "GET") return send(res, 405, { error: "Method not allowed." });
  const session = verify(cookie(req, SESSION_COOKIE), cfg.sessionSecret);
  if (!session || session.exp < Date.now() || !allowed(session.email, cfg.emails)) {
    return send(res, 401, { error: "Administrator SSO sign-in required." });
  }
  return send(res, 200, { ok: true, email: session.email, csrf: session.csrf });
}
