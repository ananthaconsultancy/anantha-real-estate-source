import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION = "__Host-property-admin";
const databaseUrl = () => process.env.ANANTHA_DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
const allowedEmails = () => String(process.env.PROPERTY_ADMIN_EMAILS || process.env.GBP_ADMIN_EMAILS || "shashankjanapati@gmail.com").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
const secret = () => String(process.env.PROPERTY_ADMIN_SESSION_SECRET || process.env.PROPERTY_GOOGLE_CLIENT_SECRET || process.env.GBP_GOOGLE_CLIENT_SECRET || "");
const cookie = (request, name) => (request.headers.cookie || "").split(";").map((value) => value.trim()).find((value) => value.startsWith(`${name}=`))?.slice(name.length + 1);
const equal = (left, right) => { const a = Buffer.from(String(left)); const b = Buffer.from(String(right)); return a.length === b.length && timingSafeEqual(a, b); };
const send = (response, status, body) => { response.statusCode = status; response.setHeader("Cache-Control", "private, max-age=20, stale-while-revalidate=30"); response.setHeader("Content-Type", "application/json; charset=utf-8"); response.end(JSON.stringify(body)); };

function session(request) {
  const token = cookie(request, SESSION); const key = secret();
  if (!token || key.length < 16) return null;
  const [body, signature] = String(token).split(".");
  if (!body || !signature || !equal(signature, createHmac("sha256", key).update(body).digest("base64url"))) return null;
  try { const value = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); return value?.email && value?.csrf && value.exp > Date.now() && allowedEmails().includes(String(value.email).toLowerCase()) ? value : null; } catch { return null; }
}

export default async function handler(request, response) {
  if (request.method !== "GET") { response.setHeader("Allow", "GET"); return send(response, 405, { error: "Method not allowed." }); }
  const admin = session(request); if (!admin) return send(response, 401, { error: "Administrator SSO sign-in required." });
  if (!databaseUrl()) return send(response, 503, { error: "Database is not configured." });
  try {
    const { neon } = await import("@neondatabase/serverless"); const sql = neon(databaseUrl());
    const [enquiries, visits, properties, deals, followups, activities] = await Promise.all([
      sql`SELECT status, COUNT(*)::int AS count FROM enquiries GROUP BY status`,
      sql`SELECT status, COUNT(*)::int AS count FROM site_visits GROUP BY status`,
      sql`SELECT verification_status, publish_status, COUNT(*)::int AS count FROM property_listings GROUP BY verification_status, publish_status`,
      sql`SELECT status, COUNT(*)::int AS count FROM deals GROUP BY status`,
      sql`SELECT followup_ref,entity_type,entity_ref,due_at,notes,status FROM followups WHERE status='OPEN' ORDER BY due_at ASC LIMIT 12`,
      sql`SELECT activity_ref,entity_type,entity_ref,activity_type,summary,created_at FROM activities ORDER BY created_at DESC LIMIT 12`,
    ]);
    return send(response, 200, { email: admin.email, csrf: admin.csrf, metrics: { enquiries, visits, properties, deals }, followups, activities });
  } catch (error) { console.error("admin-dashboard", error); return send(response, 500, { error: "Could not load the operations dashboard." }); }
}
