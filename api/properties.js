const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };
const send=(res,status,body)=>{res.statusCode=status;res.setHeader("Cache-Control","public, max-age=60, s-maxage=300, stale-while-revalidate=600");Object.entries(JSON_HEADERS).forEach(([k,v])=>res.setHeader(k,v));res.end(JSON.stringify(body));};
async function getSql(){const url=process.env.ANANTHA_DATABASE_URL||process.env.POSTGRES_URL||process.env.DATABASE_URL;if(!url)return null;const {neon}=await import("@neondatabase/serverless");return neon(url);}
const typeMap={Plot:"plots",Flat:"apartments",House:"villas",Godown:"commercial",Other:"land"};
function publicListing(row){
  const type=typeMap[row.property_type]||"land";
  const slug=String(row.public_id||"").toLowerCase();
  const photos=Array.isArray(row.photos)?row.photos:[];
  return {
    slug,
    publicId:row.public_id,
    name:`${row.property_type} in ${row.location}`,
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
    shortDescription:[row.property_type,row.area&&`${row.area} ${row.area_unit||""}`,row.facing&&`${row.facing} facing`].filter(Boolean).join(" · "),
    description:row.notes||`Verified ${row.property_type.toLowerCase()} opportunity in ${row.location}. Contact Anantha Real Estate for current availability, pricing and site visit coordination.`,
    highlights:[row.property_age&&`Condition: ${row.property_age}`,row.floors&&`Floors: ${row.floors}`,row.constructed_area&&`Constructed area: ${row.constructed_area}`,row.parking&&`Parking: ${row.parking}`,row.godown_plot_type&&`Classification: ${row.godown_plot_type}`].filter(Boolean),
    enquiryPhone:"+916302966604",
    whatsappPhone:"+916302966604",
    image:photos[0],
    gallery:photos.slice(1).map((src,i)=>({src,alt:`Property photo ${i+2}`})),
    publishedAt:row.verified_at||row.updated_at,
    updatedAt:row.updated_at
  };
}
export default async function handler(req,res){
  if(req.method!=="GET"){res.setHeader("Allow","GET");return send(res,405,{error:"Method not allowed"});}
  const sql=await getSql();if(!sql)return send(res,503,{error:"Public property inventory is not configured."});
  try{
    const id=String(req.query?.id||"").trim().toUpperCase();
    const rows=id
      ? await sql`SELECT public_id,property_type,location,area,area_unit,facing,total_valuation,bedrooms,property_age,floors,constructed_area,parking,godown_plot_type,photos,notes,verified_at,updated_at FROM property_listings WHERE public_id=${id} AND verification_status='APPROVED' AND status='VERIFIED' LIMIT 1`
      : await sql`SELECT public_id,property_type,location,area,area_unit,facing,total_valuation,bedrooms,property_age,floors,constructed_area,parking,godown_plot_type,photos,notes,verified_at,updated_at FROM property_listings WHERE verification_status='APPROVED' AND status='VERIFIED' ORDER BY verified_at DESC NULLS LAST,updated_at DESC LIMIT 250`;
    const listings=rows.map(publicListing);
    if(id&&!listings.length)return send(res,404,{error:"Property not found."});
    return send(res,200,id?{listing:listings[0]}:{listings});
  }catch(e){console.error("public-properties error",e);return send(res,500,{error:"Could not load public properties."});}
}
