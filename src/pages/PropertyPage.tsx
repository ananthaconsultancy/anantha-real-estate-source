import React, { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, CalendarCheck, Check, MapPin, MessageCircle, Phone, Ruler, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { usePublicProperty } from "@/hooks/usePublicProperties";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import PremiumCTA from "@/components/PremiumCTA";

const PropertyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { property, loading } = usePublicProperty(slug);
  const [enquiry,setEnquiry]=useState({name:"",phone:"",email:"",requirement:"",consent:false});
  const [enquiryState,setEnquiryState]=useState<{busy:boolean;message:string;error:boolean}>({busy:false,message:"",error:false});

  useEffect(() => {
    if (property) trackEvent("property_view", { property_slug: property.slug, property_type: property.type, location: property.location, status: property.status });
  }, [property]);

  if (loading) {
    return <div className="min-h-screen bg-background"><Navbar /><main className="pt-32 pb-24 container mx-auto px-4 text-center">Loading verified property…</main><Footer /></div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Property Not Found | Anantha Real Estate" description="The requested property could not be found. Explore available properties in Nellore." path={`/property/${slug ?? "unknown"}`} />
        <Navbar />
        <main className="pt-32 pb-24 container mx-auto px-4 text-center"><h1 className="font-display text-4xl font-bold mb-4">Property Not Found</h1><p className="text-muted-foreground mb-8">The property may no longer be available at this URL.</p><Button asChild variant="brand"><Link to="/properties">Browse Properties</Link></Button></main>
        <Footer />
      </div>
    );
  }

  const statusLabel = property.status.replace("-", " ");
  const verificationDate = property.lastVerifiedAt ? new Date(property.lastVerifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : undefined;
  const whatsappNumber = (property.whatsappPhone || property.enquiryPhone).replace(/\D/g, "");
  const whatsappText = encodeURIComponent(`Hi Anantha Real Estate, I am interested in ${property.name} at ${property.location}. Please share the current availability and details.`);
  const eventContext = { property_slug: property.slug, property_type: property.type, location: property.location };

  async function submitEnquiry(e: React.FormEvent) {
    e.preventDefault();
    setEnquiryState({busy:true,message:"",error:false});
    try {
      const r=await fetch("/api/property-enquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({propertyPublicId:property.publicId,name:enquiry.name,phone:enquiry.phone,email:enquiry.email,requirement:enquiry.requirement,consent:enquiry.consent})});
      const data=await r.json(); if(!r.ok) throw new Error(data.error||"Could not submit enquiry.");
      setEnquiryState({busy:false,message:`Enquiry received — reference ${data.enquiryRef}.`,error:false});
      setEnquiry({name:"",phone:"",email:"",requirement:"",consent:false});
      trackEvent("property_enquiry_submit",eventContext);
    } catch(err){setEnquiryState({busy:false,message:err instanceof Error?err.message:"Could not submit enquiry.",error:true});}
  }

  const insights = (property.insightSignals || []) as string[];
  const facts = [
    property.area ? ["Area", property.area, Ruler] : null,
    property.priceLabel ? ["Price", property.priceLabel, null] : null,
    property.bedrooms !== undefined ? ["Bedrooms", String(property.bedrooms), null] : null,
    property.bathrooms !== undefined ? ["Bathrooms", String(property.bathrooms), null] : null,
    property.facing ? ["Facing", property.facing, null] : null,
    property.roadWidth ? ["Road width", property.roadWidth, null] : null,
  ].filter(Boolean) as [string, string, typeof Ruler | null][];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={property.seoTitle || `${property.name} | ${property.location} | Anantha Real Estate`} description={property.seoDescription || property.shortDescription} path={`/property/${property.slug}`} image={property.image} />
      <Navbar />
      <main>
        <section className="pt-28 md:pt-32 pb-12 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4">
            <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-purple transition-colors mb-7"><ArrowLeft size={16} /> Back to Properties</Link>
            <div className="max-w-5xl">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-brand-purple text-white text-xs font-semibold uppercase">{statusLabel}</span>
                {property.verified && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold"><BadgeCheck size={14} /> Verified by Anantha Real Estate</span>}
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-950 mb-5">{property.name}</h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground"><span className="inline-flex items-center gap-2"><MapPin size={18} /> {property.location}, {property.city}</span>{verificationDate && <span className="inline-flex items-center gap-2"><CalendarCheck size={17} /> Checked {verificationDate}</span>}</div>
            </div>
          </div>
        </section>

        {(property.image || (property.gallery && property.gallery.length > 0)) && (
          <section className="py-10 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid gap-4 md:grid-cols-2">
                {property.image && <img src={property.image} alt={property.imageAlt || property.name} className="h-full min-h-80 w-full rounded-xl object-cover" />}
                {property.gallery && property.gallery.length > 0 && <div className="grid grid-cols-2 gap-4">{property.gallery.slice(0, 4).map((image) => <img key={image.src} src={image.src} alt={image.alt} className="h-40 md:h-full md:max-h-64 w-full rounded-xl object-cover" loading="lazy" />)}</div>}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 bg-[#fafafa]">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1.5fr_0.85fr] gap-10 lg:gap-12">
              <article>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {facts.map(([label, value, Icon]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5"><span className="text-xs uppercase tracking-[0.14em] font-semibold text-muted-foreground">{label}</span><p className="font-semibold mt-2 inline-flex items-center gap-2">{Icon && <Icon size={16} />}{value}</p></div>)}
                  {property.projectName && <div className="rounded-xl border border-slate-200 bg-white p-5 sm:col-span-2 lg:col-span-3"><span className="text-xs uppercase tracking-[0.14em] font-semibold text-muted-foreground">Project</span><p className="font-semibold mt-2">{property.projectName}</p></div>}
                </div>

                <div className="rounded-xl bg-white border border-slate-200 p-7 md:p-9">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-brand-purple mb-3"><Sparkles size={15}/> ARE Property Summary</div>
                  <h2 className="font-display text-3xl font-semibold tracking-tight mb-4">The essentials, simplified.</h2>
                  <p className="text-base md:text-lg text-slate-600 leading-8 max-w-3xl">{property.description}</p>

                  {insights.length > 0 && <div className="mt-8 rounded-xl bg-slate-950 p-6 text-white"><p className="text-xs uppercase tracking-[0.18em] text-white/60 font-semibold">Useful signals from the submitted information</p><div className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">{insights.map((x)=><div key={x} className="flex gap-3 text-sm leading-6"><Check size={17} className="mt-0.5 shrink-0"/><span>{x}</span></div>)}</div></div>}

                  {property.highlights.length > 0 && <><h2 className="font-display text-2xl font-semibold tracking-tight mt-10 mb-5">At a glance</h2><div className="divide-y border-y border-slate-200">{property.highlights.map((highlight) => {const parts=highlight.split(":");return <div key={highlight} className="grid grid-cols-[0.8fr_1.2fr] gap-4 py-4 text-sm"><span className="text-slate-500">{parts.length>1?parts.shift():"Detail"}</span><span className="font-medium text-slate-900">{parts.length?parts.join(":").trim():highlight}</span></div>})}</div></>}
                  {property.amenities && property.amenities.length > 0 && <><h2 className="font-display text-2xl md:text-3xl font-bold mt-10 mb-5">Amenities</h2><ul className="grid sm:grid-cols-2 gap-4">{property.amenities.map((amenity) => <li key={amenity} className="rounded-lg bg-slate-50 border border-slate-200 p-4 font-medium">{amenity}</li>)}</ul></>}

                  <div className="mt-10 flex flex-wrap gap-3">{property.sourceRoute && <Button asChild variant="outline"><Link to={property.sourceRoute}>View Project Page</Link></Button>}{property.mapsUrl && <Button asChild variant="outline"><a href={property.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={17} /> View Map</a></Button>}<Button asChild variant="brand"><a href={`tel:${property.enquiryPhone}`} onClick={() => trackEvent("phone_click", eventContext)}><Phone size={17} /> Call Now</a></Button></div>
                </div>
              </article>

              <aside className="rounded-xl border border-slate-200 bg-white p-6 md:p-7 h-fit lg:sticky lg:top-28">
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-accent mb-2">Property Enquiry</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Interested in this property?</h2>
                <p className="text-muted-foreground mb-6">Reconfirm current availability, pricing and arrange a site visit with Anantha Real Estate.</p>
                <form onSubmit={submitEnquiry} className="space-y-3 mb-5"><input required value={enquiry.name} onChange={e=>setEnquiry({...enquiry,name:e.target.value})} placeholder="Your name" className="w-full rounded-xl border p-3"/><input required value={enquiry.phone} onChange={e=>setEnquiry({...enquiry,phone:e.target.value})} placeholder="Phone number" className="w-full rounded-xl border p-3"/><input type="email" value={enquiry.email} onChange={e=>setEnquiry({...enquiry,email:e.target.value})} placeholder="Email (optional)" className="w-full rounded-xl border p-3"/><textarea value={enquiry.requirement} onChange={e=>setEnquiry({...enquiry,requirement:e.target.value})} placeholder="Requirement / preferred site visit time" rows={3} className="w-full rounded-xl border p-3"/><label className="flex items-start gap-2 text-xs text-muted-foreground"><input required type="checkbox" checked={enquiry.consent} onChange={e=>setEnquiry({...enquiry,consent:e.target.checked})} className="mt-0.5"/>I agree that Anantha Real Estate may contact me about this property enquiry.</label><Button disabled={enquiryState.busy} type="submit" variant="brand" className="w-full">{enquiryState.busy?"Submitting…":"Send Enquiry"}</Button>{enquiryState.message&&<p className={`text-xs ${enquiryState.error?"text-rose-600":"text-emerald-700"}`}>{enquiryState.message}</p>}</form><div className="space-y-3"><Button asChild variant="brand" className="w-full"><a href="https://calendly.com/jvk-aconsultancy/30min" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("site_visit_click", eventContext)}>Book a Site Visit</a></Button><Button asChild variant="outline" className="w-full"><a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", eventContext)}><MessageCircle size={17} /> WhatsApp</a></Button><Button asChild variant="outline" className="w-full"><a href={`tel:${property.enquiryPhone}`} onClick={() => trackEvent("phone_click", eventContext)}><Phone size={17} /> Call {property.enquiryPhone.replace("+91", "+91 ")}</a></Button></div>
                <p className="mt-6 text-xs leading-relaxed text-muted-foreground">Availability, price, approvals and property documents can change. Reconfirm material details and complete independent legal/document verification before making a purchase decision.</p>
              </aside>
            </div>
          </div>
        </section>

        <PremiumCTA title="Want to compare this property with other options?" description="Share your requirement and our team can help you shortlist relevant alternatives before your site visit." />
      </main>
      <Footer />
    </div>
  );
};

export default PropertyPage;
