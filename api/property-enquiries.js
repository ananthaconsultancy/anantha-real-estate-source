const JSON_HEADERS={"Content-Type":"application/json; charset=utf-8"};
const send=(res,status,body)=>{res.statusCode=status;res.setHeader("Cache-Control","no-store");Object.entries(JSON_HEADERS).forEach(([k,v])=>res.setHeader(k,v));res.end(JSON.stringify(body));};
const clean=(v,max=500)=>String(v??"").trim().slice(0,max);
const validPhone=(v)=>/^[+0-9][0-9\s-]{7,17}$/.test(v);
async function getSql(){const url=process.env.ANANTHA_DATABASE_URL||process.env.POSTGRES_URL||process.env.DATABASE_URL;if(!url)return null;const {neon}=await import("@neondatabase/serverless");return neon(url);}
async function ensureSchema(sql){
 await sql`CREATE TABLE IF NOT EXISTS enquiries(id BIGSERIAL PRIMARY KEY,enquiry_ref TEXT UNIQUE NOT NULL,property_public_id TEXT,name TEXT NOT NULL,phone TEXT NOT NULL,email TEXT,requirement TEXT,source TEXT NOT NULL DEFAULT 'website',status TEXT NOT NULL DEFAULT 'NEW',consent BOOLEAN NOT NULL DEFAULT FALSE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
 await sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS requirement TEXT`;
 await sql`CREATE INDEX IF NOT EXISTS enquiries_property_idx ON enquiries(property_public_id)`;
 await sql`CREATE INDEX IF NOT EXISTS enquiries_phone_idx ON enquiries(phone)`;
}
export default async function handler(req,res){
 if(req.method!=="POST"){res.setHeader("Allow","POST");return send(res,405,{error:"Method not allowed"});}
 const b=req.body||{};const d={propertyPublicId:clean(b.propertyPublicId,80).toUpperCase(),name:clean(b.name,120),phone:clean(b.phone,30),email:clean(b.email,180),requirement:clean(b.requirement,1000),consent:b.consent===true};
 if(!d.propertyPublicId||!d.name||!d.phone)return send(res,400,{error:"Property, name and phone are required."});
 if(!validPhone(d.phone))return send(res,400,{error:"Please enter a valid phone number."});
 if(!d.consent)return send(res,400,{error:"Consent is required before enquiry submission."});
 const sql=await getSql();if(!sql)return send(res,503,{error:"Enquiry database is not configured."});
 try{await ensureSchema(sql);
  const property=await sql`SELECT public_id FROM property_listings WHERE public_id=${d.propertyPublicId} AND verification_status='APPROVED' AND status='VERIFIED' AND publish_status='PUBLISHED' LIMIT 1`;
  if(!property.length)return send(res,404,{error:"This property is not currently available for public enquiry."});
  const enquiryRef=`ENQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  await sql`INSERT INTO enquiries(enquiry_ref,property_public_id,name,phone,email,requirement,consent) VALUES(${enquiryRef},${d.propertyPublicId},${d.name},${d.phone},${d.email},${d.requirement},${d.consent})`;
  return send(res,201,{ok:true,enquiryRef,message:"Enquiry received. Anantha Real Estate will contact you."});
 }catch(e){console.error("property-enquiry error",e);return send(res,500,{error:"Could not save your enquiry. Please try again."});}
}
