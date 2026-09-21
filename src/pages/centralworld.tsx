import { ArrowRight, Building2, CheckCircle2, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const hero = "https://d2xsxph8kpxj0f.cloudfront.net/310519663391327299/ezyUrnvCDk6bwBeavQtnC9/hero-township-aerial-dgMKxYh3fwo5fy9XupPNnh.webp";
const entrance = "https://d2xsxph8kpxj0f.cloudfront.net/310519663391327299/ezyUrnvCDk6bwBeavQtnC9/entrance-gateway-ks4yPE96hAb7UAgFqhQqzJ.webp";
const clubhouse = "https://d2xsxph8kpxj0f.cloudfront.net/310519663391327299/ezyUrnvCDk6bwBeavQtnC9/clubhouse-luxury-bvkgioVZmLV4ZoS5BxBLHS.webp";

const facts = [
  ["125 Acres", "Premium plotted township"],
  ["31,000 Sq Ft", "Clubhouse"],
  ["NUDA & RERA", "Approved project"],
  ["NMC Limits", "Nellore city limits"],
];

const amenities = ["Function hall", "Coffee shop", "Gymnasium", "Swimming pool", "Indoor games", "Overhead water tank", "Wide internal roads", "Nearby international schools"];

export default function CentralWorld() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Central World Nellore | Premium Plots | Anantha Real Estate"
        description="Explore Central World by Green Home Developers, a 125-acre premium plotted township in Nellore with a 31,000 sq ft clubhouse, NUDA and RERA approvals."
        path="/centralworld"
      />
      <Navbar />
      <main>
        <section className="pt-24 relative overflow-hidden bg-[#f7f9ff]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] min-h-[620px]">
            <div className="px-4 sm:px-8 lg:pl-[max(2rem,calc((100vw-1280px)/2))] lg:pr-12 py-16 md:py-20 flex items-center relative z-10">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-4">Green Home · Central World</p>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] text-foreground">Premium plots for a brighter tomorrow.</h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">A 125-acre premium plotted township in Nellore with a 31,000 sq ft clubhouse, strong connectivity and a planned community environment.</p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Button variant="brand" size="lg" asChild><a href="https://calendly.com/jvk-aconsultancy/30min" target="_blank" rel="noopener noreferrer">Book Site Visit <ArrowRight size={18} /></a></Button>
                  <Button variant="outline" size="lg" asChild><a href="https://wa.me/916302966604" target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> WhatsApp</a></Button>
                </div>
                <a href="tel:+916302966604" className="inline-flex items-center gap-2 mt-7 text-brand-purple font-semibold"><Phone size={17} /> +91 63029 66604</a>
              </div>
            </div>
            <div className="relative min-h-[420px] lg:min-h-full">
              <img src={hero} alt="Central World premium plotted township" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f7f9ff] via-transparent to-transparent lg:block hidden" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/92 backdrop-blur p-5 border border-white shadow-xl max-w-md">
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-accent">Project Snapshot</p>
                <div className="flex items-center gap-2 mt-2 text-sm font-medium"><MapPin size={16} className="text-brand-purple" /> Nellore, Andhra Pradesh</div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-6">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 rounded-2xl bg-white border border-border shadow-xl overflow-hidden">
              {facts.map(([value, label]) => <div key={value} className="p-6 md:p-7 border-b sm:border-b-0 sm:border-r last:border-r-0 border-border"><p className="font-display text-2xl md:text-3xl font-bold text-brand-purple">{value}</p><p className="text-sm text-muted-foreground mt-1">{label}</p></div>)}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-[#f7f9ff]">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent">About Central World</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Designed for premium community living.</h2>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">Central World is positioned as a premium plotted development with strong project infrastructure, lifestyle amenities and access to key Nellore growth corridors.</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {amenities.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-white border border-border p-4 shadow-sm"><CheckCircle2 size={18} className="text-brand-purple shrink-0" /><span className="font-medium">{item}</span></div>)}
              </div>
            </div>
            <div className="grid gap-4">
              <img src={entrance} alt="Central World entrance" className="rounded-3xl w-full aspect-[16/10] object-cover shadow-lg" />
              <img src={clubhouse} alt="Central World clubhouse" className="rounded-3xl w-full aspect-[16/7] object-cover shadow-lg" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-10"><p className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Why It Stands Out</p><h2 className="font-display text-3xl md:text-5xl font-bold mt-3">A project built around scale, lifestyle and long-term value.</h2></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[['Scale', 'A large planned township environment designed for a premium plotted community.'], ['Lifestyle', 'A major clubhouse and community amenities create a stronger living experience.'], ['Connectivity', 'Access to Nellore and surrounding growth corridors supports practical end use and investment interest.']].map(([title, copy]) => <article key={title} className="rounded-2xl border border-border bg-[#f7f9ff] p-7"><div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-5"><Sparkles size={22} /></div><h3 className="font-display text-2xl font-bold">{title}</h3><p className="text-muted-foreground mt-3 leading-relaxed">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-to-r from-brand-dark via-brand-purple to-accent text-white">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-3xl"><p className="text-xs uppercase tracking-[0.2em] font-bold text-white/70">Central World Enquiry</p><h2 className="font-display text-3xl md:text-5xl font-bold mt-3">Plan your Central World site visit.</h2><p className="mt-4 text-white/75 text-lg">Speak with Anantha Real Estate to confirm current plot availability and project information.</p></div>
            <div className="flex flex-wrap gap-3"><Button size="lg" className="bg-white text-brand-dark hover:bg-white/90" asChild><a href="https://calendly.com/jvk-aconsultancy/30min" target="_blank" rel="noopener noreferrer">Book Site Visit <ArrowRight size={18} /></a></Button><Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild><a href="tel:+916302966604"><Phone size={18} /> Call Now</a></Button></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
