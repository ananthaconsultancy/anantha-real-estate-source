import { put } from "@vercel/blob";
import { createHmac, timingSafeEqual } from "node:crypto";
const SESSION="__Host-property-admin";
const send=(res,status,body)=>{res.statusCode=status;res.setHeader("Cache-Control","no-store");res.setHeader("Content-Type","application/json; charset=utf-8");res.end(JSON.stringify(body));};
const equal=(a,b)=>{const aa=Buffer.from(String(a)),bb=Buffer.from(String(b));return aa.length===bb.length&&timingSafeEqual(aa,bb)};
const cookie=(req,name)=>(req.headers.cookie||"").split(";").map(s=>s.trim()).find(s=>s.startsWith(name+"="))?.slice(name.length+1);
function session(req){const token=cookie(req,SESSION),secret=String(process.env.PROPERTY_ADMIN_SESSION_SECRET||"");if(!token||secret.length<16)return null;const[body,sig]=String(token).split(".");if(!body||!sig)return null;const expected=createHmac("sha256",secret).update(body).digest("base64url");if(!equal(sig,expected))return null;try{const s=JSON.parse(Buffer.from(body,"base64url").toString("utf8"));return s?.email&&s?.csrf&&s?.exp>Date.now()?s:null}catch{return null}}
const slugify=s=>String(s||"property").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70)||"property";
export default async function handler(req,res){
 if(req.method!=="POST"){res.setHeader("Allow","POST");return send(res,405,{error:"Method not allowed."});}
 const s=session(req);if(!s)return send(res,401,{error:"Administrator login required."});
 if(req.headers.origin!==String(process.env.PROPERTY_ADMIN_ORIGIN||"https://www.anantharealestate.in").replace(/\/$/,"")||!equal(req.headers["x-csrf-token"],s.csrf))return send(res,403,{error:"Request verification failed."});
 if(!process.env.BLOB_READ_WRITE_TOKEN)return send(res,503,{error:"Property media storage is not configured."});
 try{
  const {publicId,dataUrl,fileName,altText}=req.body||{};
  if(!publicId||typeof dataUrl!=="string"||!dataUrl.startsWith("data:image/"))return send(res,400,{error:"Invalid image upload."});
  const match=dataUrl.match(/^data:(image\/(?:jpeg|png|webp|avif));base64,(.+)$/);if(!match)return send(res,400,{error:"Use JPEG, PNG, WebP or AVIF images."});
  const buffer=Buffer.from(match[2],"base64");if(buffer.length>5*1024*1024)return send(res,413,{error:"Image must be under 5 MB."});
  const ext={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/avif":"avif"}[match[1]]||"jpg";
  const base=slugify(altText||fileName||"property-photo");
  const pathname=`property-images/${slugify(publicId)}/${base}-${Date.now()}.${ext}`;
  const blob=await put(pathname,buffer,{access:"public",contentType:match[1],addRandomSuffix:false});
  return send(res,201,{ok:true,url:blob.url,pathname:blob.pathname});
 }catch(e){console.error("property-media upload",e);return send(res,500,{error:"Could not upload property image."});}
}