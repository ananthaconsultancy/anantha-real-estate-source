import { ArrowRight, Building2, Check, ChevronRight, MapPin, MessageCircle, Phone, Route, ShieldCheck, Sparkles, Trees } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import "./centralworld.css";

const venturePhoto = "https://d2npdtryso7wvr.cloudfront.net/image/662e1d1f6e39d1036c323f42/fmjsgbad_wamidHBgMOTE5MzkxMTEzOTAzFQIAEhggQTVDODdDOEMxNDZDODMyRDc3NEM0MTQ1MzlCNTA2MDQA";

const phone = "+916302966604";
const visitUrl = "https://calendly.com/jvk-aconsultancy/30min";
const facts = [
  ["125 acres", "Planned township"],
  ["31,000 sq ft", "Clubhouse"],
  ["Kanaparthi Padu", "Nellore"],
  ["NUDA & RERA", "Approval stated in project marketing"],
];
const amenities = ["Planned internal roads", "Clubhouse and community spaces", "Swimming pool", "Gymnasium", "Function hall", "Coffee shop", "Indoor games", "Landscaped open spaces"];
const sections = [["overview", "Overview"], ["highlights", "Highlights"], ["location", "Location"], ["amenities", "Amenities"], ["gallery", "Gallery"], ["visit", "Site visit"]];

export default function CentralWorld() {
  return <div className="central-world min-h-screen bg-[#f8faff] text-[#292947]">
    <SEO title="Central World Nellore | Premium Plots | Anantha Real Estate" description="Explore Central World by Green Home Developers, a 125-acre premium plotted township in Nellore with a 31,000 sq ft clubhouse, NUDA and RERA approvals as stated in project marketing." path="/centralworld"/>
    <Navbar />
    <main>
      <section className="bg-white px-4 pb-12 pt-32 sm:px-6 lg:pb-20 lg:pt-40">
        <div className="container mx-auto grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#5260aa]">Green Home Developers · Nellore</p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-[#303058] sm:text-6xl lg:text-7xl">Central World.<br/><span className="cw-gradient-text">Space for your<br/>next chapter.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#636780]">Explore a premium plotted township at Kanaparthi Padu, Nellore. Discover the project, compare your options and plan a site visit with Anantha Real Estate.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="cw-primary rounded-xl px-6 text-white" asChild><a href={visitUrl} target="_blank" rel="noreferrer">Book a site visit <ArrowRight size={18}/></a></Button>
              <Button size="lg" variant="outline" className="rounded-xl border-[#cfd6ef] bg-white text-[#303058] hover:bg-[#eef0ff]" asChild><a href={`https://wa.me/916302966604?text=${encodeURIComponent("I would like to know more about Central World, Nellore.")}`} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Enquire now</a></Button>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-[#636780]"><MapPin size={16} className="text-[#5260aa]"/>Kanaparthi Padu, Nellore</p>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-[#e3e5f2] bg-[#f0f3ff] shadow-xl shadow-indigo-100/50">
            <img src={venturePhoto} alt="Central World entrance signage and flowers, photographed at the venture" width="1600" height="1067" fetchPriority="high" className="aspect-[3/2] w-full object-cover"/>
            <figcaption className="flex flex-wrap items-center justify-between gap-2 bg-white p-4 text-xs text-[#636780]"><span>Central World · Venture photograph</span></figcaption>
          </figure>
        </div>
      </section>

      <nav aria-label="Central World page sections" className="sticky top-20 z-30 border-b border-[#e3e5f2] bg-[#f8faff]/95 backdrop-blur">
        <div className="container mx-auto flex overflow-x-auto px-4 sm:px-6">{sections.map(([id, label]) => <a key={id} href={`#${id}`} className="shrink-0 border-r border-[#e3e5f2] px-4 py-4 text-xs font-bold uppercase tracking-[.12em] text-[#545475] transition hover:bg-[#eef0ff] hover:text-[#303058] sm:px-6">{label}</a>)}</div>
      </nav>

      <section id="overview" className="scroll-mt-40 border-b border-[#e3e5f2] bg-white py-10 sm:py-12">
        <div className="container mx-auto grid px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">{facts.map(([value, label], index) => <article key={value} className={`border-[#e3e5f2] px-5 py-5 md:border-r ${index === facts.length - 1 ? "md:border-r-0" : ""}`}><p className="font-display text-3xl font-bold text-[#303058]">{value}</p><p className="mt-2 text-sm text-[#646480]">{label}</p></article>)}</div>
      </section>

      <section id="highlights" className="scroll-mt-40 py-20 sm:py-28">
        <div className="container mx-auto grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-[.88fr_1.12fr]">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#5361ae]">The project at a glance</p><h2 className="mt-4 max-w-lg font-display text-4xl font-bold leading-tight text-[#303058] sm:text-5xl">A plotted community with room for your next chapter.</h2><p className="mt-6 max-w-xl text-base leading-8 text-[#5c6078]">Central World is a 125-acre premium township in Nellore. Its scale, community facilities and planned layout give buyers a clear starting point for exploring a plot for future living or investment.</p><a href="#visit" className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#303058] pb-2 text-sm font-bold text-[#303058]">Talk to an advisor <ChevronRight size={17}/></a></div>
          <div className="grid gap-px overflow-hidden border border-[#e3e5f2] bg-[#e3e5f2] sm:grid-cols-2">{[["Scale", "A large planned township setting for a more open, community-led lifestyle.", Building2], ["Convenience", "A major clubhouse and day-to-day amenities within the project environment.", Sparkles], ["Green setting", "Landscaped spaces and internal roads designed around a plotted community.", Trees], ["Clear next step", "Anantha Real Estate can help you confirm current availability and arrange a visit.", ShieldCheck]].map(([title, copy, Icon]: any) => <article key={title} className="bg-[#f8faff] p-7 sm:p-9"><Icon className="text-[#5361ae]" size={25}/><h3 className="mt-8 font-display text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#636780]">{copy}</p></article>)}</div>
        </div>
      </section>

      <section id="location" className="scroll-mt-40 bg-[#393967] py-20 text-white sm:py-28">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#ddecff]">Location</p><h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-6xl">A Nellore address designed around everyday access.</h2><p className="mt-6 max-w-2xl text-base leading-8 text-white/75">Located at Kanaparthi Padu, Central World is positioned within Nellore city limits as stated in the project marketing. A site visit is the best way to understand the approach road, surrounding development and individual plot options.</p></div><div className="border border-white/20 bg-white/5 p-7 backdrop-blur"><Route className="text-[#ddecff]" size={26}/><p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-white/55">Visit before deciding</p><p className="mt-3 text-xl font-semibold leading-8">See the location, road access and community spaces in person.</p><a href={visitUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#ddecff]">Plan your visit <ArrowRight size={17}/></a></div></div>
      </section>

      <section id="amenities" className="scroll-mt-40 bg-white py-20 sm:py-28"><div className="container mx-auto px-4 sm:px-6"><div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#5361ae]">Community amenities</p><h2 className="mt-4 font-display text-4xl font-bold leading-tight text-[#303058] sm:text-5xl">More than a plot.</h2><p className="mt-5 max-w-sm text-base leading-7 text-[#636780]">The project information highlights community spaces and facilities for a more complete township setting.</p></div><div className="grid gap-x-8 border-t border-[#e3e5f2] sm:grid-cols-2">{amenities.map(item => <div key={item} className="flex items-center gap-3 border-b border-[#e3e5f2] py-5 text-sm font-semibold text-[#303453]"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eef0ff] text-[#485aaa]"><Check size={14}/></span>{item}</div>)}</div></div></div></section>

      <section id="gallery" className="scroll-mt-40 bg-[#f0f3ff] py-16 sm:py-24">
        <div className="container mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_.7fr]">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-sm"><img src={venturePhoto} alt="Central World entrance" width="1600" height="1067" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-contain"/><figcaption className="p-4 text-sm text-[#636780]">Central World</figcaption></figure>
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#5260aa]">At the venture</p><h2 className="mt-4 font-display text-4xl font-bold text-[#303058]">Meet Central World<br/>in person.</h2><p className="mt-5 text-base leading-8 text-[#636780]">See the approach road, explore available plots and get a closer look at the development during your site visit.</p><a href={visitUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#5260aa]">Arrange a visit <ArrowRight size={17}/></a></div>
        </div>
      </section>

      <section id="visit" className="scroll-mt-40 bg-[#ddecff] py-20 sm:py-28"><div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#485aaa]">Central World site visit</p><h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-[#303058] sm:text-6xl">See the plots. Ask the right questions. Decide with clarity.</h2><p className="mt-6 max-w-2xl text-base leading-8 text-[#555978]">Book a time with Anantha Real Estate to discuss the project, understand current availability and arrange a Central World site visit.</p></div><div className="border border-[#cfd6ef] bg-[#f8faff] p-7 sm:p-9"><p className="text-sm font-bold text-[#303058]">Speak to Anantha Real Estate</p><a href={`tel:${phone}`} className="mt-5 flex items-center gap-3 text-xl font-bold text-[#303058]"><Phone size={20} className="text-[#485aaa]"/>+91 63029 66604</a><div className="mt-7 grid gap-3"><Button className="rounded-none bg-[#303058] py-6 text-white hover:bg-[#5053a0]" asChild><a href={visitUrl} target="_blank" rel="noreferrer">Book site visit <ArrowRight size={18}/></a></Button><Button variant="outline" className="rounded-none border-[#303058] py-6 text-[#303058]" asChild><a href={`https://wa.me/916302966604?text=${encodeURIComponent("I would like current availability for Central World, Nellore.")}`} target="_blank" rel="noreferrer">WhatsApp for availability <MessageCircle size={18}/></a></Button></div></div></div></section>
    </main>
    <Footer />
  </div>;
}
