import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION = "__Host-property-admin";
const databaseUrl = () => process.env.ANANTHA_DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
const allowedEmails = () => String(process.env.PROPERTY_ADMIN_EMAILS || process.env.GBP_ADMIN_EMAILS || "shashankjanapati@gmail.com").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
const secret = () => String(process.env.PROPERTY_ADMIN_SESSION_SECRET || process.env.PROPERTY_GOOGLE_CLIENT_SECRET || process.env.GBP_GOOGLE_CLIENT_SECRET || "");
const origin = () => String(process.env.PROPERTY_ADMIN_ORIGIN || process.env.GBP_APP_ORIGIN || "https://www.anantharealestate.in").replace(/\/$/, "");
const cookie = (request, name) => (request.headers.cookie || "").split(";").map(value => value.trim()).find(value => value.startsWith(`${name}=`))?.slice(name.length + 1);
const equal = (left, right) => { const a = Buffer.from(String(left)); const b = Buffer.from(String(right)); return a.length === b.length && timingSafeEqual(a, b); };
const send = (response, status, body) => { response.statusCode = status; response.setHeader("Cache-Control", "no-store"); response.setHeader("Content-Type", "application/json; charset=utf-8"); response.end(JSON.stringify(body)); };

function session(request) {
  const token = cookie(request, SESSION), key = secret();
  if (!token || key.length < 16) return null;
  const [body, signature] = String(token).split(".");
  if (!body || !signature || !equal(signature, createHmac("sha256", key).update(body).digest("base64url"))) return null;
  try { const value = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); return value?.email && value?.csrf && value.exp > Date.now() && allowedEmails().includes(String(value.email).toLowerCase()) ? value : null; } catch { return null; }
}

let schemaPromise;
function ensureSchema(sql) {
  schemaPromise ||= Promise.all([
    sql`CREATE TABLE IF NOT EXISTS activities(id BIGSERIAL PRIMARY KEY,activity_ref TEXT UNIQUE NOT NULL,entity_type TEXT NOT NULL,entity_ref TEXT NOT NULL,activity_type TEXT NOT NULL,summary TEXT NOT NULL,created_by TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
    sql`CREATE TABLE IF NOT EXISTS followups(id BIGSERIAL PRIMARY KEY,followup_ref TEXT UNIQUE NOT NULL,entity_type TEXT NOT NULL,entity_ref TEXT NOT NULL,due_at TIMESTAMPTZ NOT NULL,status TEXT NOT NULL DEFAULT 'OPEN',notes TEXT,assigned_to TEXT,created_by TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
  ]);
  return schemaPromise;
}

async function dashboard(sql, admin) {
  const [enquiries, visits, properties, deals, followups, activities, recentEnquiries, recentDeals, recentProperties] = await Promise.all([
    sql`SELECT status, COUNT(*)::int AS count FROM enquiries GROUP BY status`,
    sql`SELECT status, COUNT(*)::int AS count FROM site_visits GROUP BY status`,
    sql`SELECT verification_status, publish_status, COUNT(*)::int AS count FROM property_listings GROUP BY verification_status, publish_status`,
    sql`SELECT status, COUNT(*)::int AS count FROM deals GROUP BY status`,
    sql`SELECT followup_ref,entity_type,entity_ref,due_at,notes,status FROM followups WHERE status='OPEN' ORDER BY due_at ASC LIMIT 12`,
    sql`SELECT activity_ref,entity_type,entity_ref,activity_type,summary,created_at FROM activities ORDER BY created_at DESC LIMIT 12`,
    sql`SELECT e.enquiry_ref,e.name,e.phone,e.email,e.requirement,e.status,e.created_at,e.updated_at,p.property_type,p.location FROM enquiries e LEFT JOIN property_listings p ON p.public_id=e.property_public_id ORDER BY e.updated_at DESC LIMIT 80`,
    sql`SELECT d.deal_ref,d.status,d.agreed_value,d.notes,d.updated_at,b.name AS buyer_name,b.phone AS buyer_phone,p.property_type,p.location FROM deals d LEFT JOIN buyers b ON b.buyer_ref=d.buyer_ref LEFT JOIN property_listings p ON p.public_id=d.property_public_id ORDER BY d.updated_at DESC LIMIT 80`,
    sql`SELECT public_id,owner_name,phone,property_type,location,verification_status,publish_status,availability_status,created_at,updated_at FROM property_listings ORDER BY updated_at DESC LIMIT 80`,
  ]);
  return { email: admin.email, csrf: admin.csrf, metrics: { enquiries, visits, properties, deals }, followups, activities, recentEnquiries, recentDeals, recentProperties };
}

export default async function handler(request, response) {
  try {
    if (!databaseUrl()) return send(response, 503, { error: "Database is not configured." });
    const admin = session(request); if (!admin) return send(response, 401, { error: "Administrator SSO sign-in required." });
    const { neon } = await import("@neondatabase/serverless"); const sql = neon(databaseUrl());
    await ensureSchema(sql);
    if (request.method === "GET") {
      if (String(request.query?.dashboard || "") === "1") return send(response, 200, await dashboard(sql, admin));
      const [activities, followups] = await Promise.all([sql`SELECT * FROM activities ORDER BY created_at DESC LIMIT 250`, sql`SELECT * FROM followups ORDER BY due_at ASC LIMIT 250`]);
      return send(response, 200, { email: admin.email, csrf: admin.csrf, activities, followups });
    }
    if (request.method !== "POST") { response.setHeader("Allow", "GET, POST"); return send(response, 405, { error: "Method not allowed." }); }
    if (request.headers.origin !== origin() || !equal(request.headers["x-csrf-token"], admin.csrf)) return send(response, 403, { error: "Request verification failed." });
    const body = request.body || {}, action = String(body.action || "").toUpperCase(), entityType = String(body.entityType || "").toUpperCase(), entityRef = String(body.entityRef || "").trim();
    if (!["ENQUIRY", "PROPERTY", "DEAL", "BUYER", "SITE_VISIT"].includes(entityType) || !entityRef) return send(response, 400, { error: "Valid entity required." });
    if (action === "ACTIVITY") { const summary = String(body.summary || "").trim().slice(0, 1500); if (!summary) return send(response, 400, { error: "Activity summary required." }); const ref = `ACT-${Date.now().toString(36).toUpperCase()}`; const rows = await sql`INSERT INTO activities(activity_ref,entity_type,entity_ref,activity_type,summary,created_by) VALUES(${ref},${entityType},${entityRef},${String(body.activityType || "NOTE").toUpperCase()},${summary},${admin.email}) RETURNING *`; return send(response, 201, { ok: true, activity: rows[0] }); }
    if (action === "FOLLOWUP") { const due = String(body.dueAt || ""); if (!due) return send(response, 400, { error: "Follow-up due date required." }); const ref = `FUP-${Date.now().toString(36).toUpperCase()}`; const rows = await sql`INSERT INTO followups(followup_ref,entity_type,entity_ref,due_at,notes,assigned_to,created_by) VALUES(${ref},${entityType},${entityRef},${due}::timestamptz,${String(body.notes || "").trim().slice(0,1500)},${String(body.assignedTo || admin.email).trim()},${admin.email}) RETURNING *`; return send(response, 201, { ok: true, followup: rows[0] }); }
    if (action === "FOLLOWUP_STATUS") { const status = String(body.status || "").toUpperCase(); if (!["OPEN", "DONE", "CANCELLED"].includes(status)) return send(response, 400, { error: "Invalid status." }); const rows = await sql`UPDATE followups SET status=${status},updated_at=NOW() WHERE followup_ref=${String(body.followupRef || "")} RETURNING *`; return send(response, rows.length ? 200 : 404, rows.length ? { ok: true, followup: rows[0] } : { error: "Follow-up not found." }); }
    return send(response, 400, { error: "Invalid action." });
  } catch (error) { console.error("activity-ops", error); return send(response, 500, { error: "Could not process activity operations." }); }
}
