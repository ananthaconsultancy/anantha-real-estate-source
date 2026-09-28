const PROFILE_URL = "https://share.google/87CxiXWo8OARA9nx8";
const TTL = 5 * 60 * 1000;
const ratings = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

// Only public review fields leave the server. Credentials and owner replies never do.
export function normalizeReviews(data, now = Date.now()) {
  return {
    source: "google",
    profileUrl: PROFILE_URL,
    fetchedAt: new Date(now).toISOString(),
    averageRating: Number.isFinite(data.averageRating) ? data.averageRating : null,
    totalReviewCount: Number.isFinite(data.totalReviewCount) ? data.totalReviewCount : null,
    reviews: (Array.isArray(data.reviews) ? data.reviews : []).filter(r => r.reviewId && ratings[r.starRating]).map(r => ({
      id: String(r.reviewId),
      name: r.reviewer?.isAnonymous ? "Google reviewer" : String(r.reviewer?.displayName || "Google reviewer"),
      rating: ratings[r.starRating],
      content: typeof r.comment === "string" ? r.comment : "",
      date: r.createTime || null,
    })),
  };
}

export function createReviewHandler({ env = process.env, request = fetch, now = Date.now } = {}) {
  let cache, expires = 0, pending, retryAfter = 0;
  async function sync() {
    const tokenResponse = await request("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: env.GBP_GOOGLE_CLIENT_ID, client_secret: env.GBP_GOOGLE_CLIENT_SECRET, refresh_token: env.GBP_REVIEWS_REFRESH_TOKEN, grant_type: "refresh_token" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!tokenResponse.ok) throw new Error("authorization");
    const token = await tokenResponse.json();
    if (!token.access_token) throw new Error("authorization");
    const response = await request(`https://mybusiness.googleapis.com/v4/accounts/${env.GBP_REVIEWS_ACCOUNT_ID}/locations/${env.GBP_REVIEWS_LOCATION_ID}/reviews?pageSize=50&orderBy=updateTime%20desc`, {
      headers: { Authorization: `Bearer ${token.access_token}` }, signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("reviews");
    const data = await response.json();
    if (!Array.isArray(data.reviews) && data.totalReviewCount !== 0) throw new Error("invalid response");
    cache = normalizeReviews(data, now());
    expires = now() + TTL;
    retryAfter = 0;
    return cache;
  }
  return async function publicReviews(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const send = (status, data, seconds = 30) => {
      res.statusCode = status;
      res.setHeader("Cache-Control", `public, max-age=0, s-maxage=${seconds}`);
      res.end(JSON.stringify(data));
    };
    if (req.method !== "GET") { res.setHeader("Allow", "GET"); return send(405, { error: "Method not allowed" }, 0); }
    const ready = ["GBP_GOOGLE_CLIENT_ID", "GBP_GOOGLE_CLIENT_SECRET", "GBP_REVIEWS_REFRESH_TOKEN"].every(k => env[k]?.trim()) && /^\d+$/.test(env.GBP_REVIEWS_ACCOUNT_ID || "") && /^\d+$/.test(env.GBP_REVIEWS_LOCATION_ID || "");
    if (!ready) return send(200, { source: "unavailable", reviews: [], profileUrl: PROFILE_URL });
    try {
      if (cache && now() < expires) return send(200, cache, Math.max(1, Math.floor((expires - now()) / 1000)));
      if (now() < retryAfter) return send(503, { source: "unavailable", reviews: [], profileUrl: PROFILE_URL });
      if (!pending) pending = sync().finally(() => { pending = null; });
      return send(200, await pending, 300);
    } catch {
      // No stale reviews after expiry: edits/deletions must disappear on refresh.
      cache = null;
      retryAfter = now() + 30000;
      return send(503, { source: "unavailable", reviews: [], profileUrl: PROFILE_URL });
    }
  };
}

export default createReviewHandler();
