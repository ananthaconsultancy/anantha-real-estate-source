import React, { useEffect } from "react";
import { ArrowLeft, BadgeCheck, CalendarCheck, MapPin, MessageCircle, Phone, Ruler } from "lucide-react";
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
        <section className="pt-28 md:pt-32 pb-14 md:pb-18 bg-[radial-gradient(circle_at_80%_15%,rgba(94,177,227,0.22),transparent_28%),linear-gradient(135deg,#fff,#f4f7ff)] border-b border-border">
          <div className="container mx-auto px-4">
            <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-purple transition-colors mb-7"><ArrowLeft size={16} /> Back to Properties</Link>
            <div className="max-w-5xl">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-brand-purple text-white text-xs font-semibold uppercase">{statusLabel}</span>
                {property.verified && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold"><BadgeCheck size={14} /> Listing details checked</span>}
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.03] text-foreground mb-5">{property.name}</h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground"><span className="inline-flex items-center gap-2"><MapPin size={18} /> {property.location}, {property.city}</span>{verificationDate && <span className="inline-flex items-center gap-2"><CalendarCheck size={17} /> Checked {verificationDate}</span>}</div>
            </div>
          </div>
        </section>

        {(property.image || (property.gallery && property.gallery.length > 0)) && (
          <section className="py-10 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid gap-4 md:grid-cols-2">
                {property.image && <img src={property.image} alt={property.imageAlt || property.name} className="h-full min-h-80 w-full rounded-3xl object-cover shadow-sm" />}
                {property.gallery && property.gallery.length > 0 && <div className="grid grid-cols-2 gap-4">{property.gallery.slice(0, 4).map((image) => <img key={image.src} src={image.src} alt={image.alt} className="h-40 md:h-full md:max-h-64 w-full rounded-2xl object-cover shadow-sm" loading="lazy" />)}</div>}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-gradient-to-b from-white to-[#f7f9ff]">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1.5fr_0.85fr] gap-10 lg:gap-12">
              <article>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {facts.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-border bg-white p-5 shadow-sm"><span className="text-xs uppercase tracking-[0.14em] font-semibold text-muted-foreground">{label}</span><p className="font-semibold mt-2 inline-flex items-center gap-2">{Icon && <Icon size={16} />}{value}</p></div>)}
                  {property.projectName && <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-3"><span className="text-xs uppercase tracking-[0.14em] font-semibold text-muted-foreground">Project</span><p className="font-semibold mt-2">{property.projectName}</p></div>}
                </div>

                <div className="rounded-3xl bg-white border border-border p-7 md:p-9 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-2">Property Overview</p>
                  <h2 className="font-display text-3xl font-bold mb-5">About this property</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{property.description}</p>

                  {property.highlights.length > 0 && <><h2 className="font-display text-2xl md:text-3xl font-bold mt-10 mb-5">Property highlights</h2><ul className="grid sm:grid-cols-2 gap-4">{property.highlights.map((highlight) => <li key={highlight} className="rounded-xl bg-[#f7f9ff] border border-border p-4 font-medium">{highlight}</li>)}</ul></>}
                  {property.amenities && property.amenities.length > 0 && <><h2 className="font-display text-2xl md:text-3xl font-bold mt-10 mb-5">Amenities</h2><ul className="grid sm:grid-cols-2 gap-4">{property.amenities.map((amenity) => <li key={amenity} className="rounded-xl bg-[#f7f9ff] border border-border p-4 font-medium">{amenity}</li>)}</ul></>}

                  <div className="mt-10 flex flex-wrap gap-3">{property.sourceRoute && <Button asChild variant="outline"><Link to={property.sourceRoute}>View Project Page</Link></Button>}{property.mapsUrl && <Button asChild variant="outline"><a href={property.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={17} /> View Map</a></Button>}<Button asChild variant="brand"><a href={`tel:${property.enquiryPhone}`} onClick={() => trackEvent("phone_click", eventContext)}><Phone size={17} /> Call Now</a></Button></div>
                </div>
              </article>

              <aside className="rounded-3xl border border-border bg-white p-6 md:p-7 h-fit lg:sticky lg:top-28 shadow-xl">
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-accent mb-2">Property Enquiry</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Interested in this property?</h2>
                <p className="text-muted-foreground mb-6">Reconfirm current availability, pricing and arrange a site visit with Anantha Real Estate.</p>
                <div className="space-y-3"><Button asChild variant="brand" className="w-full"><a href="https://calendly.com/jvk-aconsultancy/30min" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("site_visit_click", eventContext)}>Book a Site Visit</a></Button><Button asChild variant="outline" className="w-full"><a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", eventContext)}><MessageCircle size={17} /> WhatsApp</a></Button><Button asChild variant="outline" className="w-full"><a href={`tel:${property.enquiryPhone}`} onClick={() => trackEvent("phone_click", eventContext)}><Phone size={17} /> Call {property.enquiryPhone.replace("+91", "+91 ")}</a></Button></div>
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
