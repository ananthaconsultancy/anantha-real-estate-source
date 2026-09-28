import test from "node:test";
import assert from "node:assert/strict";
import { createReviewHandler, normalizeReviews } from "../server/public-reviews.mjs";

const env = { GBP_GOOGLE_CLIENT_ID: "client", GBP_GOOGLE_CLIENT_SECRET: "secret", GBP_REVIEWS_REFRESH_TOKEN: "refresh", GBP_REVIEWS_ACCOUNT_ID: "123", GBP_REVIEWS_LOCATION_ID: "456" };
const review = { reviewId: "r1", starRating: "TWO", comment: "An honest review", reviewer: { displayName: "Customer" }, reviewReply: { comment: "private extra" } };
async function invoke(handler, method = "GET") {
  const headers = {};
  const res = { setHeader(k, v) { headers[k] = v; }, end(value) { this.data = JSON.parse(value); } };
  await handler({ method, url: "/api/gbp?action=public-reviews&location=999" }, res);
  return { status: res.statusCode, data: res.data, headers };
}
test("missing setup is honest and does not request Google", async () => {
  const result = await invoke(createReviewHandler({ env: {}, request: () => assert.fail("unexpected fetch") }));
  assert.equal(result.data.source, "unavailable");
  assert.deepEqual(result.data.reviews, []);
});
test("normalization retains low ratings and rating-only reviews, omits private fields", () => {
  const result = normalizeReviews({ reviews: [review, { reviewId: "r2", starRating: "FIVE", reviewer: { isAnonymous: true, displayName: "Hidden" } }] });
  assert.equal(result.reviews[0].rating, 2);
  assert.equal(result.reviews[1].name, "Google reviewer");
  assert.equal(result.reviews[1].content, "");
  assert.equal(JSON.stringify(result).includes("private extra"), false);
});
test("fixed location, concurrent requests coalesce, cache expires and deleted reviews disappear", async () => {
  let clock = 1000000, calls = 0, rows = [review];
  const handler = createReviewHandler({ env, now: () => clock, request: async (url) => {
    calls++;
    if (url.includes("oauth2")) return { ok: true, json: async () => ({ access_token: "access" }) };
    assert.match(url, /accounts\/123\/locations\/456\/reviews/);
    assert.match(url, /orderBy=updateTime%20desc/);
    return { ok: true, json: async () => ({ reviews: rows, totalReviewCount: rows.length, averageRating: 2 }) };
  } });
  const results = await Promise.all([invoke(handler), invoke(handler)]);
  assert.equal(calls, 2);
  assert.equal(results[0].data.source, "google");
  assert.equal(JSON.stringify(results).includes("refresh"), false);
  await invoke(handler); assert.equal(calls, 2);
  rows = []; clock += 300001;
  assert.deepEqual((await invoke(handler)).data.reviews, []);
  assert.equal(calls, 4);
  assert.equal((await invoke(handler, "POST")).status, 405);
});
test("upstream failures hide expired content and back off without leaking errors", async () => {
  let calls = 0;
  const handler = createReviewHandler({ env, request: async () => { calls++; throw new Error("secret token"); } });
  const result = await invoke(handler);
  assert.equal(result.status, 503);
  assert.equal(JSON.stringify(result).includes("secret"), false);
  await invoke(handler); assert.equal(calls, 1);
});
