import fs from "node:fs";
import path from "node:path";

const SITE = "https://www.anantharealestate.in";
const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  "/", "/about", "/services", "/properties",
  "/properties/plots", "/properties/apartments", "/properties/villas",
  "/properties/commercial", "/properties/land", "/projects",
  "/property-intelligence", "/portfolio", "/property-consultation",
  "/contact", "/centralworld"
];

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const projectSource = read("src/data/projects.ts");
const propertySource = read("src/data/properties.ts");

const projectRoutes = [...projectSource.matchAll(/marketingPath:\s*"([^"]+)"/g)]
  .map((m) => m[1])
  .filter((route) => route.startsWith("/"));

const propertyRoutes = [...propertySource.matchAll(/slug:\s*"([^"]+)"/g)]
  .map((m) => m[1])
  .filter((slug) => !["plots","apartments","villas","commercial","land"].includes(slug))
  .map((slug) => `/property/${slug}`);

const routes = [...new Set([...staticRoutes, ...projectRoutes, ...propertyRoutes])];

const escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((route) => `  <url><loc>${escapeXml(SITE + route)}</loc><lastmod>${today}</lastmod></url>`),
  "</urlset>",
  ""
].join("\n");

fs.writeFileSync(path.join(root, "public/sitemap.xml"), xml);
console.log(`Generated sitemap.xml with ${routes.length} public URLs.`);
