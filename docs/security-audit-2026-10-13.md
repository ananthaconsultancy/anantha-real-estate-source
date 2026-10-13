# Anantha Real Estate security audit — preliminary (13 October 2026)

This is a repository review, **not** a completed Strix penetration test. Do not run automated exploitation against the live customer-facing website or production customer data. Perform Strix testing against an isolated preview/staging deployment populated with synthetic data, and obtain explicit approval from any third-party service providers before scanning their endpoints.

## Findings

### High: Public SheetDB intake URL in website bundles
- Files: `src/components/LeadEnquiry.tsx`, `src/components/Contact.tsx`, `src/components/CentralWorldOpeningPopup.tsx`
- The same external endpoint is used directly by visitors' browsers. The endpoint is publicly discoverable and client-side consent/validation does not prevent automated abuse. Whether SheetDB grants write or read access without additional authorization has **not** been verified.
- Remediate by accepting leads at a same-origin serverless endpoint with length/type validation, origin and content-type checks, bot challenge, **distributed** rate limiting, plus a server-held SheetDB credential or database write. Never place write secrets into `VITE_*` variables. Rotate external credentials if any have been exposed. Add monitoring and alerting for unusually high submission volumes.
- **Do not just proxy an unauthenticated POST without server-side protection.** Keep the current intake working until a tested migration is ready.

### Medium: Admin password login lacks distributed brute-force controls
- File: `api/property-auth.js`.
- Fixed in this branch: per-instance failed-login throttling (6 failures / 15 minutes). This is only defense-in-depth for warm serverless instances, **not reliable distributed brute-force protection**. Add a Vercel WAF rule or Redis-backed shared limiter before treating this as fully resolved.
- Existing implementation correctly requires server-side password hash, HMAC-signed HttpOnly Secure cookie and same-origin login POST. Check for weak/reused admin passwords and configure MFA at your identity provider.

### Medium: Admin API session configuration can drift
- `api/property-auth.js` and `api/property-admin.js` have different fallbacks for session keys and authorized emails. Standardize to a shared session verifier and consistently require a minimum 32-byte secret. Perform integration tests before modifying authentication to avoid locking out administrators.

### Medium: Data exposure controls and access reviews
- Review `api/properties.js`, admin endpoints and document/photo return fields with realistic synthetic test data. Ensure public inventory does not expose owner contact information, undisclosed prices or private photos; avoid returning all columns from admin tables unnecessarily. Review all admin role permissions, not just presence of a session.
- Run `npm audit --omit=dev`, source-secret scanning, dependency pinning checks, and SAST in CI. These have not yet been run.

### Third-party scripts / privacy
- Inventory Google Tag Manager, Meta Pixel, image/CDN resources and their consent behavior. Audit security headers and deploy a tested CSP for public routes rather than copying the restrictive admin CSP.

## Strix staging procedure
1. Create a separate Vercel preview deployment with a fresh database and dummy contacts only.
2. Enable least-privilege test credentials; ensure it does not share live CRM, SheetDB, Google Ads, WhatsApp or GBP credentials.
3. Run Strix through its documented CLI/Cloud setup against the test code or staging URL, with testing scope confined to those assets.
4. Review each finding, patch in a GitHub branch, run unit/security/regression tests and re-scan.
5. Merge to main only when reviewed and then verify Vercel production deployment.

Official Strix: https://github.com/usestrix/strix

No production test, exploit, full dependency audit, or complete vulnerability assessment is claimed here.
