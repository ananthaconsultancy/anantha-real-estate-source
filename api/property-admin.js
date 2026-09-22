import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION = "__Host-property-admin";
const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  Object.entries(JSON_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  res.end(JSON.stringify(body));
}

function equal(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

function cookie(req, name) {
  return (req.headers.cookie || "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(name + "="))
    ?.slice(name.length + 1);
}

function origin() {
  return String(process.env.PROPERTY_ADMIN_ORIGIN || process.env.GBP_APP_ORIGIN || "https://www.anantharealestate.in").replace(/\/$/, "");
}

function allowedEmails() {
  return String(process.env.PROPERTY_ADMIN_EMAILS || process.env.GBP_ADMIN_EMAILS || "info@anantharealestate.in")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function sessionSecret() {
  return String(
    process.env.PROPERTY_ADMIN_SESSION_SECRET ||
      process.env.PROPERTY_GOOGLE_CLIENT_SECRET ||
      process.env.GBP_GOOGLE_CLIENT_SECRET ||
      "",
  );
}

function requireAdmin(req) {
  const token = cookie(req, SESSION);
  const secret = sessionSecret();
  if (!token || secret.length < 16) return null;
  const [body, sig] = String(token).split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  if (!equal(sig, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!session?.email || !session?.csrf || !session?.exp || session.exp < Date.now()) return null;
    if (!allowedEmails().includes(String(session.email).toLowerCase())) return null;
    return session;
  } catch {
    return null;
  }
}

function databaseUrl() {
  return process.env.ANANTHA_DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
}

export default async function handler(req, res) {
  try {
    if (!databaseUrl()) return send(res, 503, { error: "Inventory database is not configured." });
    const session = requireAdmin(req);
    if (!session) return send(res, 401, { error: "Administrator SSO sign-in required." });
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl());

    if (req.method === "GET") {
      const rows = await sql`SELECT * FROM property_listings ORDER BY created_at DESC LIMIT 250`;
      return send(res, 200, { email: session.email, csrf: session.csrf, listings: rows });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return send(res, 405, { error: "Method not allowed." });
    }
    if (req.headers.origin !== origin() || !equal(req.headers["x-csrf-token"], session.csrf)) {
      return send(res, 403, { error: "Request verification failed. Reload the admin page." });
    }

    const body = req.body || {};
    const publicId = String(body.publicId || "").trim();
    const verificationStatus = String(body.verificationStatus || "").trim().toUpperCase();
    const adminNotes = String(body.adminNotes || "").trim().slice(0, 1500);
    if (!publicId || !["PENDING", "APPROVED", "NEEDS_CORRECTION", "REJECTED"].includes(verificationStatus)) {
      return send(res, 400, { error: "Invalid property or verification status." });
    }

    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS admin_notes TEXT`;
    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS verified_by TEXT`;
    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ`;
    await sql`CREATE TABLE IF NOT EXISTS property_audit_logs (id BIGSERIAL PRIMARY KEY, property_public_id TEXT NOT NULL, action TEXT NOT NULL, actor_email TEXT NOT NULL, previous_verification_status TEXT, new_verification_status TEXT, notes TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    const previous = await sql`SELECT verification_status FROM property_listings WHERE public_id=${publicId} LIMIT 1`;
    const status = verificationStatus === "APPROVED" ? "VERIFIED" : verificationStatus === "REJECTED" ? "REJECTED" : "NEW";
    const result = await sql`
      UPDATE property_listings
      SET verification_status=${verificationStatus}, status=${status}, admin_notes=${adminNotes}, verified_by=${session.email}, verified_at=NOW(), updated_at=NOW()
      WHERE public_id=${publicId}
      RETURNING public_id, verification_status, status, admin_notes, verified_by, verified_at
    `;
    if (!result.length) return send(res, 404, { error: "Property not found." });
    await sql`INSERT INTO property_audit_logs(property_public_id,action,actor_email,previous_verification_status,new_verification_status,notes) VALUES(${publicId},${"VERIFICATION_STATUS_CHANGED"},${session.email},${previous[0]?.verification_status || null},${verificationStatus},${adminNotes})`;
    return send(res, 200, { ok: true, listing: result[0] });
  } catch (error) {
    console.error("property-admin error", error);
    return send(res, 500, { error: "Could not load or update property verification." });
  }
}
