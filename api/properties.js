const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };
const send=(res,status,body)=>{res.statusCode=status;res.setHeader("Cache-Control","public, max-age=0, s-maxage=30, stale-while-revalidate=60");Object.entries(JSON_HEADERS).forEach(([k,v])=>res.setHeader(k,v));res.end(JSON.stringify(body));};
async function getSql(){const url=process.env.ANANTHA_DATABASE_URL||process.env.POSTGRES_URL||process.env.DATABASE_URL;if(!url)return null;const {neon}=await import("@neondatabase/serverless");return neon(url);}
const typeMap={Plot:"plots",Flat:"apartments",House:"villas",Godown:"commercial",Other:"land"};
const slugify=(v)=>String(v||"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
function seoSlug(row){const p=row.property_type==="Flat"&&row.bedrooms?row.bedrooms+"-bhk-flat":row.property_type==="House"&&row.bedrooms?row.bedrooms+"-bhk-house":row.property_type;return slugify(p+"-"+row.location+"-nellore");}
function publicListing(row){
  const type=typeMap[row.property_type]||"land";
  const slug=seoSlug(row);
  const photos=Array.isArray(row.photos)?row.photos:[];
  const publicIndexes=Array.isArray(row.public_photo_indexes)?row.public_photo_indexes:photos.map((_,i)=>i);
  const primaryIndex=Number.isInteger(row.primary_photo_index)&&publicIndexes.includes(row.primary_photo_index)?row.primary_photo_index:(publicIndexes[0]??null);
  const altTexts=row.photo_alt_texts&&typeof row.photo_alt_texts==="object"?row.photo_alt_texts:{};
  const publicPhotos=publicIndexes.filter(i=>Number.isInteger(i)&&photos[i]).map(i=>({src:photos[i],alt:altTexts[String(i)]||`${row.property_type} in ${row.location} - property photo`}));
  const primaryPhoto=primaryIndex===null?undefined:publicPhotos.find((_,j)=>publicIndexes[j]===primaryIndex)||{src:photos[primaryIndex],alt:altTexts[String(primaryIndex)]||`${row.property_type} in ${row.location}`};
  const condition=row.property_age||undefined;
  const detailBits=[row.bedrooms&&`${row.bedrooms} bedroom${Number(row.bedrooms)===1?"":"s"}`,row.area&&`${row.area} ${row.area_unit||""}`,row.facing&&`${row.facing}-facing`,condition&&condition].filter(Boolean);
  const title=row.property_type==="Flat"?`${row.bedrooms?`${row.bedrooms} BHK `:""}Flat in ${row.location}`:`${row.property_type} in ${row.location}`;
  const cleanNote=String(row.notes||"").replace(/\s+/g," ").trim();
  const noteLower=cleanNote.toLowerCase();
  const signals=[];
  if(/ready|immediate|move.?in/.test(noteLower))signals.push("Suitable for buyers looking for near-term possession");
  if(/new|brand.?new|unused/.test(noteLower)||/new/i.test(String(row.property_age||"")))signals.push("Presented as a newer property");
  if(/corner/.test(noteLower))signals.push("Corner-position detail mentioned by the owner");
  if(/lift|elevator/.test(noteLower))signals.push("Lift access mentioned");
  if(/parking/.test(noteLower)||row.parking)signals.push(row.parking?`Parking: ${row.parking}`:"Parking mentioned");
  if(/gated|security/.test(noteLower))signals.push("Community/security feature mentioned");
  if(/balcony/.test(noteLower))signals.push("Balcony feature mentioned");
  const overviewParts=[`${title}${row.apartment_name?` in ${row.apartment_name}`:""}.`,row.area?`The property offers ${row.area} ${row.area_unit||""}${row.bedrooms?` with ${row.bedrooms} bedroom${Number(row.bedrooms)===1?"":"s"}`:""}.`:"",row.facing?`${row.facing}-facing configuration.`:"",row.property_age?`Property condition/age: ${row.property_age}.`:"",row.parking?`Parking: ${row.parking}.`:""].filter(Boolean);
  const overview=overviewParts.join(" ");
  return {
    slug,
    publicId:row.public_id,
    name:title,
    type,
    status:"available",
    verified:true,
    lastVerifiedAt:row.verified_at||row.updated_at,
    location:row.location,
    city:"Nellore",
    area:row.area?`${row.area} ${row.area_unit||""}`.trim():undefined,
    areaValue:Number(row.area)||undefined,
    areaUnit:row.area_unit||undefined,
    priceLabel:row.total_valuation||"Price on request",
    priceType:row.total_valuation?"fixed":"on-request",
    bedrooms:row.bedrooms?Number(row.bedrooms):undefined,
    facing:row.facing||undefined,
    shortDescription:detailBits.join(" · "),
    description:overview,
    highlights:[row.apartment_name&&`Apartment: ${row.apartment_name}`,row.property_age&&`Condition: ${row.property_age}`,row.floors&&`Floors: ${row.floors}`,row.constructed_area&&`Built-up area: ${row.constructed_area}`,row.parking&&`Parking: ${row.parking}`,row.godown_plot_type&&`Property classification: ${row.godown_plot_type}`,row.per_unit_valuation&&`Indicative rate: ${row.per_unit_valuation} per ${row.area_unit||"unit"}`].filter(Boolean),
    insightSignals:signals.slice(0,4),
    ownerNote:cleanNote||undefined,
    enquiryPhone:"+916302966604",
    whatsappPhone:"+916302966604",
    image:primaryPhoto?.src,
    imageAlt:primaryPhoto?.alt,
    gallery:publicPhotos.filter(p=>p.src!==primaryPhoto?.src),
    publishedAt:row.published_at||row.verified_at||row.updated_at,
    updatedAt:row.updated_at
  };
}
export function createPropertiesHandler(loadSql = getSql) { return async function handler(req,res){
  if(req.method!=="GET"){res.setHeader("Allow","GET");return send(res,405,{error:"Method not allowed"});}
  const sql=await loadSql();if(!sql)return send(res,503,{error:"Public property inventory is not configured."});
  try{
    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS publish_status TEXT NOT NULL DEFAULT 'DRAFT'`;
    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ`;
    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ`;
    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS availability_status TEXT NOT NULL DEFAULT 'AVAILABLE'`;
    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS public_photo_indexes JSONB`;
    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS primary_photo_index INTEGER`;
    await sql`ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS photo_alt_texts JSONB`;
    const lookup=String(req.query?.id||req.query?.slug||"").trim();
    const id=/^PROP-/i.test(lookup)?lookup.toUpperCase():"";
    const rows=id
      ? await sql`SELECT public_id,property_type,location,area,area_unit,facing,total_valuation,per_unit_valuation,bedrooms,apartment_name,property_age,floors,constructed_area,parking,godown_plot_type,notes,photos,public_photo_indexes,primary_photo_index,photo_alt_texts,verified_at,published_at,updated_at FROM property_listings WHERE public_id=${id} AND verification_status='APPROVED' AND status='VERIFIED' AND publish_status='PUBLISHED' AND availability_status='AVAILABLE' LIMIT 1`
      : await sql`SELECT public_id,property_type,location,area,area_unit,facing,total_valuation,per_unit_valuation,bedrooms,apartment_name,property_age,floors,constructed_area,parking,godown_plot_type,notes,photos,public_photo_indexes,primary_photo_index,photo_alt_texts,verified_at,updated_at FROM property_listings WHERE verification_status='APPROVED' AND status='VERIFIED' AND publish_status='PUBLISHED' AND availability_status='AVAILABLE' ORDER BY verified_at DESC NULLS LAST,updated_at DESC LIMIT ${lookup ? null : 250}`;
    const listings=rows.map(publicListing);
    if (lookup) {
      const listing = id ? listings[0] : listings.find(item => item.slug === lookup.toLowerCase());
      if (!listing) return send(res,404,{error:"Property not found."});
      return send(res,200,{listing});
    }
    return send(res,200,{listings});
  }catch(e){console.error("public-properties error",e);return send(res,500,{error:"Could not load public properties."});}
}; }
export default createPropertiesHandler();
