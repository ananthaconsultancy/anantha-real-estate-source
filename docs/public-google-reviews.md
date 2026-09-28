# Public Google review carousel

The homepage testimonial component uses GET /api/gbp?action=public-reviews. It fetches on load, every five minutes while visible, and when the visitor returns to the tab. The server keeps Google results for at most five minutes and coalesces concurrent requests. Google publication delays and browser refresh timing mean changes are not instantaneous.

The latest 50 reviews are requested in update-time descending order, without rating filters. Author names, full comments, ratings and dates are preserved. Rating-only reviews are supported. The aggregate rating/count are Google's totals, not a calculation from the displayed subset.

## Activation required

The production GBP endpoint reported incomplete configuration on 28 September 2026. The carousel therefore uses the existing, explicitly labelled client testimonials until the Google connection is configured. These fallback testimonials are not presented as synced Google reviews.

Set these server-only production environment variables in the existing Vercel project:

- GBP_GOOGLE_CLIENT_ID and GBP_GOOGLE_CLIENT_SECRET: an approved Google OAuth web client.
- GBP_REVIEWS_REFRESH_TOKEN: an offline OAuth refresh token granted by an owner/manager of Anantha's verified Google Business Profile, with https://www.googleapis.com/auth/business.manage scope.
- GBP_REVIEWS_ACCOUNT_ID and GBP_REVIEWS_LOCATION_ID: numeric IDs for Anantha's profile, confirmed through Google's accounts and locations APIs.

Use a Google Cloud project approved for the Business Profile APIs. Do not put credentials in chat, source control, or any VITE_ variable. Redeploy after setting the variables. This public endpoint is read-only; it cannot write replies or alter the business listing. It does not require re-enabling the old GBP administration UI.

Validate that the endpoint returns source: google and that author names, review count and recent reviews match Anantha's profile. Changes to reviews should appear after Google publishes them and the next refresh. Revoked authorization or upstream failure falls back to existing client feedback, never stale content labelled live.

The carousel rotates every seven seconds, pauses on hover, permanently pauses on focus or swipe until Play is pressed, and disables automatic motion for reduced-motion users. Arrow keys and Previous/Next buttons are supported.

References: https://developers.google.com/my-business/content/review-data and https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
