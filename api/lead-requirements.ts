import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SignJWT, importPKCS8 } from "jose";

const allowedIntent = ["Buy", "Rent", "Sell", "Lease out", "Investment", "Commercial requirement"];
const allowedTypes = ["Plot", "House / Villa", "Apartment", "Commercial space", "Warehouse / Industrial", "Agricultural land", "Other"];
const clean = (value: unknown, limit = 500) => typeof value === "string" ? value.trim().slice(0, limit).replace(/^[=+@\-\t\r]/, "'$&") : "";
const cell = (value: string) => value || "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const origin = req.headers.origin || "";
  const host = req.headers.host || "";
  if (origin) {
    try { if (new URL(origin).host !== host) return res.status(403).json({ error: "Invalid origin" }); }
    catch { return res.status(403).json({ error: "Invalid origin" }); }
  }
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });
  const name = clean(b.name, 100), phone = clean(b.phone, 30);
  const intent = clean(b.intent, 50), propertyType = clean(b.propertyType, 80);
  if (!name || !/^[+\d\s()-]{7,25}$/.test(phone) || !allowedIntent.includes(intent) || !allowedTypes.includes(propertyType) || b.consent !== true)
    return res.status(400).json({ error: "Please complete required fields and consent." });
  const sheetId = process.env.ARE_LEADS_SHEET_ID;
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!sheetId || !email || !key) return res.status(503).json({ error: "Lead registration is temporarily unavailable." });
  try {
    const privateKey = await importPKCS8(key, "RS256");
    const jwt = await new SignJWT({ scope: "https://www.googleapis.com/auth/spreadsheets" })
      .setProtectedHeader({ alg: "RS256", typ: "JWT" }).setIssuer(email)
      .setAudience("https://oauth2.googleapis.com/token").setIssuedAt().setExpirationTime("1h").sign(privateKey);
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }) });
    if (!tokenResponse.ok) throw new Error("Google token request failed");
    const { access_token } = await tokenResponse.json();
    const leadId = "WEB-" + Date.now().toString(36).toUpperCase();
    const location = clean(b.location, 250), budget = clean(b.budget, 100), size = clean(b.size, 100);
    const notes = clean(b.notes, 1000), timeline = clean(b.timeline, 80);
    const details = [size && "Size: " + size, timeline && "Timeline: " + timeline, notes].filter(Boolean).join(" | ");
    const values = [[
      "", name, phone, intent.toLowerCase(), propertyType, clean(b.project, 150), location,
      [size, budget].filter(Boolean).join(" / "), details, budget, "New Website Enquiry",
      "", "", "", "New", "Contact lead; verify requirement and match properties.", leadId,
      location, "", "Submitted via /requirements; consent recorded; source: " + clean(b.source, 100), ""
    ]].map(row => row.map(cell));
    const url = "https://sheets.googleapis.com/v4/spreadsheets/" + encodeURIComponent(sheetId) + "/values/" + encodeURIComponent("'Lead Pipeline'!A:U") + ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS";
    const response = await fetch(url, { method: "POST", headers: { Authorization: "Bearer " + access_token, "Content-Type": "application/json" }, body: JSON.stringify({ values }) });
    if (!response.ok) throw new Error("Google Sheets append failed");
    return res.status(201).json({ ok: true, leadId });
  } catch (err) {
    console.error("Lead registration failed", err instanceof Error ? err.message : "Unknown error");
    return res.status(502).json({ error: "Could not save your enquiry. Please try again or call us." });
  }
}
