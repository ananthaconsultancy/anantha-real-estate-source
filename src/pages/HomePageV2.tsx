import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileCheck2,
  Handshake,
  Headphones,
  Home,
  Landmark,
  LineChart,
  MapPin,
  Quote,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Testimonials from "@/components/Testimonials";
import { propertyCategories } from "@/data/properties";
import { usePublicProperties } from "@/hooks/usePublicProperties";
import { projects } from "@/data/projects";
import { propertyFallbackImage, stockImages } from "@/data/stockImages";

const slides = [
  {
    eyebrow: "Spaces for a brighter tomorrow",
    title: "Find More Than Property",
    description: "Real estate consultancy focused on Nellore and beyond — with transparent guidance, market context and direct support from search to settlement.",
    image: stockImages.villa,
    alt: "Premium modern villa",
    primaryLabel: "Explore Properties",
    primaryHref: "/properties",
    secondaryLabel: "View Projects",
    secondaryHref: "/projects",
  },
  {
    eyebrow: "Residential property",
    title: "Homes That Match How You Want to Live",
    description: "Explore apartments, villas and residential opportunities with a clear process built around your budget, location and long-term needs.",
    image: stockImages.apartment,
    alt: "Modern apartment building",
    primaryLabel: "Browse Residential",
    primaryHref: "/properties",
    secondaryLabel: "Get Consultation",
    secondaryHref: "/property-consultation",
  },
  {
    eyebrow: "Land & plotted development",
    title: "Choose Land With Better Context",
    description: "Compare plots and land opportunities with practical guidance on location, development potential and the next verification steps.",
    image: stockImages.land,
    alt: "Aerial view of land parcels",
    primaryLabel: "Explore Land & Plots",
    primaryHref: "/properties/plots",
    secondaryLabel: "Talk to Our Team",
    secondaryHref: "/contact",
  },
  {
    eyebrow: "Anantha Commercials",
    title: "Business Spaces for the Next Move",
    description: "Office, retail, commercial land and business property support for companies, investors and owners looking at Nellore and surrounding markets.",
    image: stockImages.commercial,
    alt: "Modern commercial office building",
    primaryLabel: "Commercial Property",
    primaryHref: "/properties/commercial",
    secondaryLabel: "Discuss Requirement",
    secondaryHref: "/property-consultation",
  },
  {
    eyebrow: "Client-first advisory",
    title: "Clear Guidance Before You Commit",
    description: "From shortlisting to site visits and transaction support, our role is to help you make a better-informed property decision.",
    image: stockImages.consultation,
    alt: "Real estate consultation meeting",
    primaryLabel: "Get Free Consultation",
    primaryHref: "/property-consultation",
    secondaryLabel: "About Anantha",
    secondaryHref: "/about",
  },
];

const features = [
  { icon: ShieldCheck, title: "Trusted Expertise", text: "Clear guidance and practical property support." },
  { icon: Home, title: "Wide Property Options", text: "Plots, homes, land and commercial opportunities." },
  { icon: Users, title: "Client-First Approach", text: "Your requirement stays at the centre of the search." },
  { icon: Headphones, title: "End-to-End Support", text: "From enquiry and site visit to transaction support." },
];

const whyItems = [
  { icon: Landmark, title: "Market Context", text: "Local insights to help compare opportunities." },
  { icon: FileCheck2, title: "Transparent Process", text: "Property information presented clearly and responsibly." },
  { icon: Handshake, title: "Personal Guidance", text: "A focused approach built around your actual requirement." },
  { icon: LineChart, title: "Long-Term Value", text: "Decisions considered beyond only the immediate transaction." },
];

const HomePageV2 = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { properties: verifiedProperties } = usePublicProperties();
  const publicProperties = verifiedProperties.slice(0, 4);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const current = slides[activeSlide];

  return (
    <div className="min-h-screen bg-white text-slate-950 overflow-x-hidden">
      <SEO
        title="Real Estate in Nellore | Anantha Real Estate"
        description="Explore residential, plots, projects and commercial real estate opportunities in Nellore with Anantha Real Estate's local guidance and end-to-end support."
        path="/"
      />
      <Navbar />

      <main className="pt-[76px]">
        <section className="relative min-h-[620px] md:min-h-[680px] overflow-hidden bg-[#111737]">
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === activeSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111737]/95 via-[#24146f]/76 to-[#1d76d8]/24" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(94,177,227,0.28),transparent_28%)]" />
            </div>
          ))}

          <div className="container relative z-20 mx-auto px-4 min-h-[620px] md:min-h-[680px] flex items-center">
            <div className="max-w-3xl py-16 md:py-20 text-white">
              <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-[#9bd8ff]">{current.eyebrow}</p>
              <h1 className="mt-5 text-[48px] sm:text-[64px] lg:text-[78px] leading-[0.98] font-black tracking-[-0.045em] max-w-3xl">{current.title}</h1>
              <p className="mt-6 max-w-2xl text-base md:text-lg leading-7 text-white/78">{current.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={current.primaryHref} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5eb1e3] to-[#6e4fd2] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-transform hover:-translate-y-0.5">
                  {current.primaryLabel} <ArrowRight size={17} />
                </Link>
                <Link to={current.secondaryHref} className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 backdrop-blur px-6 py-3.5 text-sm font-bold text-white hover:bg-white/15">
                  {current.secondaryLabel}
                </Link>
              </div>
            </div>
          </div>

          <button aria-label="Previous hero slide" onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)} className="absolute left-4 md:left-8 top-1/2 z-30 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur hover:bg-black/30"><ArrowLeft size={20} /></button>
          <button aria-label="Next hero slide" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)} className="absolute right-4 md:right-8 top-1/2 z-30 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur hover:bg-black/30"><ArrowRight size={20} /></button>

          <div className="absolute bottom-7 left-1/2 z-30 -translate-x-1/2 flex gap-2">
            {slides.map((slide, index) => (
              <button key={slide.title} aria-label={`Go to slide ${index + 1}`} onClick={() => setActiveSlide(index)} className={`h-2 rounded-full transition-all ${index === activeSlide ? "w-9 bg-white" : "w-2 bg-white/45"}`} />
            ))}
          </div>
        </section>

        <section className="relative z-30 -mt-7 px-4">
          <div className="container mx-auto rounded-2xl bg-white p-4 sm:p-5 shadow-[0_18px_55px_rgba(23,40,95,0.15)] border border-[#e8ecfb]">
            <div className="flex flex-wrap gap-2 pb-4">
              <Link to="/properties" className="rounded-lg bg-gradient-to-r from-[#4320a8] to-[#2387ef] px-5 py-2 text-xs font-bold text-white">All</Link>
              {propertyCategories.map((category) => <Link key={category.slug} to={`/properties/${category.slug}`} className="rounded-lg px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[#f2f4ff]">{category.name.replace(" for Sale", "")}</Link>)}
            </div>
            <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3">
              <Link to="/properties" className="flex items-center justify-between rounded-xl border border-[#e2e7f5] bg-white px-4 py-3.5"><span><span className="block text-[11px] text-slate-400">Property Type</span><span className="text-sm font-semibold text-slate-700">Browse all property types</span></span><Home size={19} className="text-[#4d31b0]" /></Link>
              <Link to="/projects" className="flex items-center justify-between rounded-xl border border-[#e2e7f5] bg-white px-4 py-3.5"><span><span className="block text-[11px] text-slate-400">Projects</span><span className="text-sm font-semibold text-slate-700">Explore represented projects</span></span><Building2 size={19} className="text-[#4d31b0]" /></Link>
              <Link to="/properties" className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4320a8] to-[#2387ef] px-7 py-3 text-sm font-bold text-white"><Search size={18} /> Search</Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-9">
            {features.map(({ icon: Icon, title, text }) => <div key={title} className="text-center px-3"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#eef4ff] to-[#eee9ff] text-[#4320a8]"><Icon size={25} /></div><h3 className="mt-4 text-[15px] font-extrabold text-[#161b42]">{title}</h3><p className="mt-1.5 text-xs leading-5 text-slate-500">{text}</p></div>)}
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#f8faff]">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between gap-5 mb-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">Featured properties</p><h2 className="mt-2 text-3xl md:text-4xl font-black tracking-[-0.035em] text-[#151a3d]">Handpicked for a Better Tomorrow</h2></div><Link to="/properties" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#4023a4]">View All Properties <ArrowRight size={16} /></Link></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(publicProperties.length > 0 ? publicProperties : propertyCategories.slice(0, 4)).map((item: any, index) => {
                const isProperty = Boolean(item.status);
                const href = isProperty ? `/property/${item.slug}` : `/properties/${item.slug}`;
                const image = isProperty ? (item.image || propertyFallbackImage(item.type)) : propertyFallbackImage(item.slug);
                const title = isProperty ? item.name : item.name;
                const subtitle = isProperty ? item.location : item.description;
                return <Link key={item.slug} to={href} className="group overflow-hidden rounded-2xl bg-white border border-[#e4e8f4] shadow-[0_8px_25px_rgba(25,36,83,0.06)]"><div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-4"><h3 className="font-extrabold text-[#171c42]">{title}</h3><p className="mt-2 flex items-start gap-1 text-xs leading-5 text-slate-500">{isProperty && <MapPin size={13} className="mt-0.5 shrink-0" />}{subtitle}</p>{isProperty && <p className="mt-3 text-sm font-black text-[#3d24a1]">{item.priceLabel || "Price on request"}</p>}</div></Link>;
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">About Anantha</p><h2 className="mt-3 text-4xl md:text-5xl font-black tracking-[-0.04em] leading-[1.03] text-[#151a3d]">Building Value<br />For Generations</h2><p className="mt-6 max-w-xl text-base leading-7 text-slate-600">Anantha Real Estate Consultancy helps buyers, property owners and investors navigate real estate with local knowledge, transparent communication and a client-first approach.</p><Link to="/about" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4320a8] to-[#2387ef] px-5 py-3 text-sm font-bold text-white">Know More About Us <ArrowRight size={16} /></Link></div>
            <div className="relative min-h-[400px] overflow-hidden rounded-3xl"><img src={stockImages.consultation} alt="Anantha Real Estate consultation" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#17154f]/52 to-transparent" /><div className="absolute right-6 bottom-6 max-w-[230px] rounded-2xl bg-white/92 backdrop-blur p-6 shadow-xl"><Quote size={24} className="text-[#4a29a8]" /><p className="mt-4 text-2xl leading-8 text-[#2d3260]">Spaces That Inspire A Brighter Tomorrow.</p></div></div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#1e126f] via-[#4d26b7] to-[#2387ef] text-white"><div className="container mx-auto px-4 py-12 md:py-14"><div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-9"><h2 className="text-3xl font-semibold">Why Choose Anantha?</h2><p className="text-sm text-white/80">Your Real Estate Partner, Always</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">{whyItems.map(({ icon: Icon, title, text }) => <div key={title} className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10"><Icon size={22} /></div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/70">{text}</p></div>)}</div></div></section>

        <section className="py-16 md:py-20 bg-white"><div className="container mx-auto px-4"><div className="flex items-end justify-between gap-4 mb-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">Projects</p><h2 className="mt-2 text-3xl md:text-4xl font-black text-[#151a3d]">Featured Projects</h2></div><Link to="/projects" className="text-sm font-bold text-[#4324a5]">View All Projects</Link></div><div className="grid md:grid-cols-2 gap-6">{projects.slice(0, 2).map((project, index) => <Link key={project.slug} to={project.marketingPath} className="group grid sm:grid-cols-[1fr_1.2fr] overflow-hidden rounded-2xl border border-[#e3e8f5] bg-white shadow-sm"><img src={index === 0 ? stockImages.land : stockImages.villaPool} alt={project.name} className="h-full min-h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="p-6 flex flex-col justify-center"><p className="text-xs uppercase tracking-wider font-bold text-[#4a29a8]">{project.projectType}</p><h3 className="mt-2 text-2xl font-black text-[#171c42]">{project.name}</h3><p className="mt-2 text-sm text-slate-500">{project.location}</p><p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-3">{project.description}</p></div></Link>)}</div></div></section>

        <Testimonials />

        <section className="py-16 md:py-20 bg-[#f8faff]"><div className="container mx-auto px-4"><div className="flex items-end justify-between gap-4 mb-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">Property Intelligence</p><h2 className="mt-2 text-3xl md:text-4xl font-black text-[#151a3d]">Property Resources</h2></div><Link to="/property-intelligence" className="text-sm font-bold text-[#4324a5]">Explore Resources</Link></div><div className="grid md:grid-cols-3 gap-6">{[
          [stockImages.villaPool, "Browse Available Properties", "Explore current property listings and find options for your requirement.", "/properties"],
          [stockImages.commercial, "Explore Represented Projects", "View project locations, highlights and enquiry options.", "/projects"],
          [stockImages.land, "Get Personal Property Guidance", "Share your preferred location, budget and timeline with our team.", "/property-consultation"],
        ].map(([image, title, copy, href]) => <Link key={title} to={href} className="overflow-hidden rounded-2xl border border-[#e3e8f5] bg-white"><img src={image} alt={title} className="aspect-[16/9] w-full object-cover" /><div className="p-5"><h3 className="font-extrabold text-[#171c42]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p></div></Link>)}</div></div></section>

        <section className="relative overflow-hidden bg-gradient-to-r from-[#17105e] via-[#4423b4] to-[#278fe9] text-white"><div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_50%,white,transparent_25%)]" /><div className="container relative mx-auto px-4 py-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7"><div><h2 className="text-3xl md:text-4xl font-black">Let’s Find Your Perfect Property</h2><p className="mt-3 max-w-2xl text-white/75">Whether you’re investing, upgrading or exploring opportunities, our team can help you plan the next step.</p></div><Link to="/property-consultation" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-[#2d1b90]">Get a Free Consultation <ArrowRight size={17} /></Link></div></section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePageV2;
