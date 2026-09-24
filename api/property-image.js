import { get } from "@vercel/blob";
import { Readable } from "node:stream";
export default async function handler(req,res){
 if(req.method!=="GET"){res.statusCode=405;res.setHeader("Allow","GET");return res.end("Method not allowed");}
 const pathname=String(req.query?.path||"");
 if(!pathname.startsWith("property-images/")){res.statusCode=400;return res.end("Invalid image path");}
 try{
  const result=await get(pathname,{access:"private"});
  if(!result||result.statusCode!==200){res.statusCode=404;return res.end("Image not found");}
  res.statusCode=200;
  res.setHeader("Content-Type",result.blob.contentType||"image/jpeg");
  res.setHeader("Cache-Control","public, max-age=86400, s-maxage=31536000, immutable");
  res.setHeader("X-Content-Type-Options","nosniff");
  Readable.fromWeb(result.stream).pipe(res);
 }catch(e){console.error("property-image",e);res.statusCode=404;res.end("Image not found");}
}