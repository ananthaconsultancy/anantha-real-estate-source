import { neon } from "@neondatabase/serverless";

const SITE = "https://www.anantharealestate.in";
const staticRoutes = [
  "/", "/about", "/services", "/properties",
  "/properties/plots", "/properties/apartments", "/properties/villas",
  "/properties/commercial", "/properties/land", "/projects",
  "/property-intelligence", "/portfolio", "/property-consultation",
  "/contact", "/centralworld",
  "/project/motherland-green-meadows",
  "/project/motherland-crkr-sunrise-city"
];

const esc = (v="") => String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
const date = (v) => { const d = v ? new Date(v) : new Date(); return Number.isNaN(d.getTime()) ? new Date().toISOString().slice(0,10) : d.toISOString().slice(0,10); };\nconst slugify=(v)=>String(v||"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");\nconst seoSlug=(r)=>{const p=r.property_type==="Flat"&&r.bedrooms?String(r.bedrooms)+"-bhk-flat":r.property_type==="House"&&r.bedrooms?String(r.bedrooms)+"-bhk-house":String(r.property_type||"property");return slugify(p+"-"+r.location+"-nellore");};

export default async function handler(req,res){
  if(req.method!=="GET"){res.statusCode=405;res.setHeader("Allow","GET");return res.end("Method not allowed");}
  const urls = staticRoutes.map(route=>({route,lastmod:date()}));
  try{
    const connectionString=process.env.ANANTHA_DATABASE_URL||process.env.POSTGRES_URL||process.env.DATABASE_URL;
    if(connectionString){
      const sql=neon(connectionString);
      const rows=await sql`SELECT public_id, property_type, location, bedrooms, updated_at, published_at FROM property_listings WHERE verification_status='APPROVED' AND COALESCE(publish_status,'DRAFT')='PUBLISHED' AND COALESCE(availability_status,'AVAILABLE')='AVAILABLE' ORDER BY updated_at DESC`;
      for(const row of rows) urls.push({route:`/property/${seoSlug(row)}`,lastmod:date(row.updated_at||row.published_at)});
    }
  }catch(error){console.error("sitemap property query",error);}
  const xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',...urls.map(x=>`  <url><loc>${esc(SITE+x.route)}</loc><lastmod>${x.lastmod}</lastmod></url>`),'</urlset>'].join("\n");
  res.statusCode=200;res.setHeader("Content-Type","application/xml; charset=utf-8");res.setHeader("Cache-Control","public, max-age=0, s-maxage=300, stale-while-revalidate=600");return res.end(xml);
}