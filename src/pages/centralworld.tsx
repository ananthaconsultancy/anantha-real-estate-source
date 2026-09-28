import { ArrowRight, Building2, Check, ChevronRight, MapPin, MessageCircle, Phone, Route, ShieldCheck, Sparkles, Trees } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import hero from "@/assets/central-world/central-world-hero-v2-web.jpg";
import entrance from "@/assets/central-world/central-world-entrance-v2-web.jpg";
import clubhouse from "@/assets/central-world/central-world-clubhouse-v2-web.jpg";

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
  return <div className="min-h-screen bg-[#f8f7f2] text-[#18251f]">
    <SEO title="Central World Nellore | Premium Plots | Anantha Real Estate" description="Explore Central World by Green Home Developers, a 125-acre premium plotted township in Nellore with a 31,000 sq ft clubhouse, NUDA and RERA approvals as stated in project marketing." path="/centralworld"/>
    <Navbar />
    <main>
      <section className="relative min-h-[680px] overflow-hidden bg-[#10251c] pt-24 text-white">
        <img src={hero} alt="Aerial view of a planned Central World township setting" className="absolute inset-0 h-full w-full object-cover opacity-80"/>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,31,22,.94)_0%,rgba(10,31,22,.78)_38%,rgba(10,31,22,.18)_74%,rgba(10,31,22,.3)_100%)]"/>
        <div className="container relative mx-auto flex min-h-[680px] items-end px-4 pb-14 pt-24 sm:px-6 lg:items-center lg:pb-0">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#d5efc5]">Green Home Developers · Nellore</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[.96] sm:text-6xl lg:text-8xl">Central<br/><span className="text-[#d5efc5]">World.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">A premium plotted township planned for people who want more room to grow, more everyday convenience and a more connected Nellore address.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Button size="lg" className="rounded-none bg-[#d5efc5] px-6 text-[#10251c] hover:bg-white" asChild><a href={visitUrl} target="_blank" rel="noreferrer">Book a site visit <ArrowRight size={18}/></a></Button><Button size="lg" variant="outline" className="rounded-none border-white/45 bg-white/5 px-6 text-white hover:bg-white hover:text-[#10251c]" asChild><a href={`https://wa.me/${phone}?text=${encodeURIComponent("I would like to know more about Central World, Nellore.")}`} target="_blank" rel="noreferrer"><MessageCircle size={18}/> WhatsApp us</a></Button></div>
          </div>
        </div>
        <div className="absolute bottom-5 right-5 hidden items-center gap-2 border border-white/20 bg-[#10251c]/80 px-4 py-3 text-sm backdrop-blur md:flex"><MapPin size={16} className="text-[#d5efc5]"/> Kanaparthi Padu, Nellore</div>
      </section>

      <nav aria-label="Central World page sections" className="sticky top-0 z-30 border-b border-[#dfe5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="container mx-auto flex overflow-x-auto px-4 sm:px-6">{sections.map(([id, label]) => <a key={id} href={`#${id}`} className="shrink-0 border-r border-[#dfe5dc] px-4 py-4 text-xs font-bold uppercase tracking-[.12em] text-[#4b5c51] transition hover:bg-[#e7f0df] hover:text-[#10251c] sm:px-6">{label}</a>)}</div>
      </nav>

      <section id="overview" className="scroll-mt-16 border-b border-[#dfe5dc] bg-white py-10 sm:py-12">
        <div className="container mx-auto grid px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">{facts.map(([value, label], index) => <article key={value} className={`border-[#dfe5dc] px-5 py-5 md:border-r ${index === facts.length - 1 ? "md:border-r-0" : ""}`}><p className="font-display text-3xl font-bold text-[#10251c]">{value}</p><p className="mt-2 text-sm text-[#69776e]">{label}</p></article>)}</div>
      </section>

      <section id="highlights" className="scroll-mt-16 py-20 sm:py-28">
        <div className="container mx-auto grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-[.88fr_1.12fr]">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#64844f]">The project at a glance</p><h2 className="mt-4 max-w-lg font-display text-4xl font-bold leading-tight text-[#10251c] sm:text-5xl">A plotted community with room for your next chapter.</h2><p className="mt-6 max-w-xl text-base leading-8 text-[#526157]">Central World is a 125-acre premium township in Nellore. Its scale, community facilities and planned layout give buyers a clear starting point for exploring a plot for future living or investment.</p><a href="#visit" className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#10251c] pb-2 text-sm font-bold text-[#10251c]">Talk to an advisor <ChevronRight size={17}/></a></div>
          <div className="grid gap-px overflow-hidden border border-[#dfe5dc] bg-[#dfe5dc] sm:grid-cols-2">{[["Scale", "A large planned township setting for a more open, community-led lifestyle.", Building2], ["Convenience", "A major clubhouse and day-to-day amenities within the project environment.", Sparkles], ["Green setting", "Landscaped spaces and internal roads designed around a plotted community.", Trees], ["Clear next step", "Anantha Real Estate can help you confirm current availability and arrange a visit.", ShieldCheck]].map(([title, copy, Icon]: any) => <article key={title} className="bg-[#f8f7f2] p-7 sm:p-9"><Icon className="text-[#64844f]" size={25}/><h3 className="mt-8 font-display text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#647168]">{copy}</p></article>)}</div>
        </div>
      </section>

      <section id="location" className="scroll-mt-16 bg-[#173326] py-20 text-white sm:py-28">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#d5efc5]">Location</p><h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-6xl">A Nellore address designed around everyday access.</h2><p className="mt-6 max-w-2xl text-base leading-8 text-white/75">Located at Kanaparthi Padu, Central World is positioned within Nellore city limits as stated in the project marketing. A site visit is the best way to understand the approach road, surrounding development and individual plot options.</p></div><div className="border border-white/20 bg-white/5 p-7 backdrop-blur"><Route className="text-[#d5efc5]" size={26}/><p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-white/55">Visit before deciding</p><p className="mt-3 text-xl font-semibold leading-8">See the location, road access and community spaces in person.</p><a href={visitUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#d5efc5]">Plan your visit <ArrowRight size={17}/></a></div></div>
      </section>

      <section id="amenities" className="scroll-mt-16 bg-white py-20 sm:py-28"><div className="container mx-auto px-4 sm:px-6"><div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#64844f]">Community amenities</p><h2 className="mt-4 font-display text-4xl font-bold leading-tight text-[#10251c] sm:text-5xl">More than a plot.</h2><p className="mt-5 max-w-sm text-base leading-7 text-[#647168]">The project information highlights community spaces and facilities for a more complete township setting.</p></div><div className="grid gap-x-8 border-t border-[#dfe5dc] sm:grid-cols-2">{amenities.map(item => <div key={item} className="flex items-center gap-3 border-b border-[#dfe5dc] py-5 text-sm font-semibold text-[#26362c]"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e7f0df] text-[#487335]"><Check size={14}/></span>{item}</div>)}</div></div></div></section>

      <section id="gallery" className="scroll-mt-16 bg-[#edece4] py-20 sm:py-28"><div className="container mx-auto px-4 sm:px-6"><div className="mb-9 flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#64844f]">Gallery</p><h2 className="mt-4 font-display text-4xl font-bold text-[#10251c] sm:text-5xl">Imagine the setting.</h2></div><p className="max-w-md text-sm leading-6 text-[#647168]">Illustrative project imagery showing the intended character of a premium planned township.</p></div><div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]"><figure className="relative overflow-hidden bg-[#173326]"><img src={entrance} alt="Illustrative entrance for a premium planned township" className="h-full min-h-[360px] w-full object-cover"/><figcaption className="absolute bottom-0 left-0 bg-[#10251c]/85 px-5 py-4 text-sm font-semibold text-white">A considered arrival experience</figcaption></figure><figure className="relative overflow-hidden bg-[#173326]"><img src={clubhouse} alt="Illustrative clubhouse and pool setting for a planned township" className="h-full min-h-[360px] w-full object-cover"/><figcaption className="absolute bottom-0 left-0 bg-[#10251c]/85 px-5 py-4 text-sm font-semibold text-white">Community spaces for everyday life</figcaption></figure></div></div></section>

      <section id="visit" className="scroll-mt-16 bg-[#d5efc5] py-20 sm:py-28"><div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#487335]">Central World site visit</p><h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-[#10251c] sm:text-6xl">See the plots. Ask the right questions. Decide with clarity.</h2><p className="mt-6 max-w-2xl text-base leading-8 text-[#405045]">Book a time with Anantha Real Estate to discuss the project, understand current availability and arrange a Central World site visit.</p></div><div className="border border-[#a8ca91] bg-[#f8f7f2] p-7 sm:p-9"><p className="text-sm font-bold text-[#10251c]">Speak to Anantha Real Estate</p><a href={`tel:${phone}`} className="mt-5 flex items-center gap-3 text-xl font-bold text-[#10251c]"><Phone size={20} className="text-[#487335]"/>+91 63029 66604</a><div className="mt-7 grid gap-3"><Button className="rounded-none bg-[#10251c] py-6 text-white hover:bg-[#284b36]" asChild><a href={visitUrl} target="_blank" rel="noreferrer">Book site visit <ArrowRight size={18}/></a></Button><Button variant="outline" className="rounded-none border-[#10251c] py-6 text-[#10251c]" asChild><a href={`https://wa.me/${phone}?text=${encodeURIComponent("I would like current availability for Central World, Nellore.")}`} target="_blank" rel="noreferrer">WhatsApp for availability <MessageCircle size={18}/></a></Button></div></div></div></section>
    </main>
    <Footer />
  </div>;
}

