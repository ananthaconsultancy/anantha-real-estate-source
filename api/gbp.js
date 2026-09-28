import admin from "../server/gbp.mjs";
import publicReviews from "../server/public-reviews.mjs";

export default function handler(req, res) {
  const action = new URL(req.url, "https://www.anantharealestate.in").searchParams.get("action");
  return action === "public-reviews" ? publicReviews(req, res) : admin(req, res);
}
