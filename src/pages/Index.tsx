import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  Handshake,
  Headphones,
  Home,
  Landmark,
  LineChart,
  Mail,
  MapPin,
  Phone,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import logo from "@/assets/logo.png";
import heroImage from "@/assets/hero.png";
import aboutImage from "@/assets/hero-property.jpg";
import houseImage from "@/assets/individual house.jpg";
import { getPublicProperties, propertyCategories } from "@/data/properties";

const featureItems = [
  { icon: ShieldCheck, title: "Trusted Expertise", text: "Clear guidance and practical property support." },
  { icon: Home, title: "Wide Property Options", text: "Plots, homes, land and commercial opportunities." },
  { icon: Users, title: "Client-First Approach", text: "Your requirement stays at the centre of the search." },
  { icon: Headphones, title: "End-to-End Support", text: "From enquiry and site visit to transaction support." },
];

const whyItems = [
  { icon: Landmark, title: "Market Context", text: "Local insights to help you compare opportunities." },
  { icon: FileCheck2, title: "Transparent Process", text: "Property information presented clearly and responsibly." },
  { icon: Handshake, title: "Personal Guidance", text: "A focused approach built around your actual requirement." },
  { icon: LineChart, title: "Long-Term Value", text: "Decisions considered beyond only the immediate transaction." },
];

const serviceItems = [
  { icon: Home, title: "Property Search & Matching", text: "Help finding suitable property options based on your requirement." },
  { icon: Handshake, title: "Buying & Selling Assistance", text: "Support through enquiry, negotiation and transaction coordination." },
  { icon: LineChart, title: "Investment Advisory", text: "Market context and practical comparison for property decisions." },
  { icon: FileCheck2, title: "Documentation Support", text: "Coordination for legal opinion, documentation and registration support." },
];

const testimonials = [
  { name: "Raviteja Chitteti", role: "Client", text: "Professional guidance, responsive communication and a smooth property experience." },
  { name: "Moni Swahith", role: "Client", text: "Clear support throughout the process with genuine attention to the requirement." },
  { name: "Rammohan Rao", role: "Client", text: "A helpful and transparent approach to understanding suitable property options." },
];

const Index = () => {
  const publicProperties = getPublicProperties().slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-slate-950 overflow-x-hidden">
      <SEO
        title="Real Estate in Nellore | Anantha Real Estate"
        description="Explore residential, plots, projects and commercial real estate opportunities in Nellore with Anantha Real Estate's local guidance and end-to-end support."
        path="/"
      />
      <Navbar />

      <main className="pt-[76px]">
        <section className="relative overflow-hidden bg-[#eef6ff]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.98),transparent_34%),linear-gradient(115deg,#f8fbff_0%,#eef6ff_43%,#d9ecff_100%)]" />
          <div className="container relative mx-auto px-4 grid lg:grid-cols-[0.92fr_1.08fr] min-h-[610px] lg:min-h-[640px]">
            <div className="relative z-10 flex flex-col justify-center py-16 lg:py-20 lg:pr-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-[#38239f]">Spaces for a brighter tomorrow</p>
              <h1 className="max-w-[650px] text-[48px] sm:text-[60px] lg:text-[72px] leading-[0.98] font-black tracking-[-0.045em] text-[#111737]">
                Find More<br />Than <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39179b] to-[#238cf3]">Property</span>
              </h1>
              <p className="mt-7 max-w-xl text-base sm:text-lg leading-7 text-slate-600">
                Real estate consultancy focused on Nellore and beyond — with transparent guidance, practical market context and direct support from search to settlement.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/properties" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#4020a4] to-[#1f88ef] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(45,60,190,0.23)] transition-transform hover:-translate-y-0.5">
                  Explore Properties <ArrowRight size={17} />
                </Link>
                <Link to="/projects" className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2f3] bg-white px-6 py-3.5 text-sm font-bold text-[#30208f] transition-colors hover:bg-slate-50">
                  View Projects <ArrowRight size={17} />
                </Link>
              </div>

              <div className="mt-11 grid grid-cols-3 gap-5 max-w-xl">
                {[['Nellore', 'Primary market'], ['Residential', 'Plots & homes'], ['Commercial', 'Business spaces']].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-lg sm:text-2xl font-black text-[#34219a]">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[430px] lg:min-h-full">
              <div className="absolute inset-y-0 -left-20 right-[-8vw] lg:right-[-10vw] overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#eef6ff] via-[#eef6ff]/25 to-transparent" />
                <img src={heroImage} alt="Premium residential property" className="h-full w-full object-cover object-center" />
              </div>
              <div className="absolute bottom-12 right-2 z-20 hidden md:flex items-center gap-3 rounded-2xl bg-white/92 backdrop-blur px-5 py-4 shadow-[0_16px_45px_rgba(23,35,94,0.18)]">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#eef1ff] text-[#3d20a3]"><Sparkles size={21} /></div>
                <div><p className="text-sm font-bold text-[#161b42]">Homes. Investments. Businesses.</p><p className="text-xs text-slate-500">We help you find what matters.</p></div>
              </div>
            </div>
          </div>

          <div className="container relative z-30 mx-auto px-4 -mt-8 pb-1">
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-[0_18px_50px_rgba(23,40,95,0.13)] border border-white">
              <div className="flex flex-wrap gap-2 pb-4">
                <Link to="/properties" className="rounded-lg bg-[#3c20a2] px-5 py-2 text-xs font-bold text-white">All</Link>
                {propertyCategories.map((category) => (
                  <Link key={category.slug} to={`/properties/${category.slug}`} className="rounded-lg px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">{category.name.replace(' for Sale', '')}</Link>
                ))}
              </div>
              <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3">
                <Link to="/properties" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left">
                  <span><span className="block text-[11px] text-slate-400">Property Type</span><span className="text-sm font-semibold text-slate-700">Browse all property types</span></span>
                  <Home size={19} className="text-[#4d31b0]" />
                </Link>
                <Link to="/projects" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left">
                  <span><span className="block text-[11px] text-slate-400">Projects</span><span className="text-sm font-semibold text-slate-700">Explore represented projects</span></span>
                  <Building2 size={19} className="text-[#4d31b0]" />
                </Link>
                <Link to="/properties" className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4120a4] to-[#2287ef] px-7 py-3 text-sm font-bold text-white"><Search size={18} /> Search</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-9">
            {featureItems.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center px-3">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eff2ff] text-[#38219d]"><Icon size={25} strokeWidth={1.8} /></div>
                <h3 className="mt-4 text-[15px] font-extrabold text-[#161b42]">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#fbfcff]">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between gap-5 mb-8">
              <div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">Featured properties</p><h2 className="mt-2 text-3xl md:text-4xl font-black tracking-[-0.035em] text-[#151a3d]">Handpicked for a Better Tomorrow</h2></div>
              <Link to="/properties" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#4023a4]">View All Properties <ArrowRight size={16} /></Link>
            </div>

            {publicProperties.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {publicProperties.map((property) => (
                  <Link key={property.slug} to={`/property/${property.slug}`} className="group overflow-hidden rounded-xl bg-white border border-slate-200 shadow-[0_8px_25px_rgba(25,36,83,0.06)]">
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={property.image || houseImage} alt={property.imageAlt || property.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                    <div className="p-4"><p className="font-extrabold text-[#171c42]">{property.name}</p><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} /> {property.location}</p><p className="mt-3 text-sm font-black text-[#3d24a1]">{property.priceLabel || 'Price on request'}</p></div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {propertyCategories.slice(0, 4).map((category, i) => (
                  <Link key={category.slug} to={`/properties/${category.slug}`} className="group overflow-hidden rounded-xl bg-white border border-slate-200 shadow-[0_8px_25px_rgba(25,36,83,0.06)]">
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={i % 2 === 0 ? houseImage : aboutImage} alt={category.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                    <div className="p-4"><span className="rounded-full bg-[#f0eeff] px-2.5 py-1 text-[10px] font-bold text-[#4325a3]">Explore</span><h3 className="mt-3 font-extrabold text-[#171c42]">{category.name}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{category.description}</p></div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white">
          <div className="container mx-auto px-4 py-16 md:py-20 grid lg:grid-cols-2 gap-0 items-stretch">
            <div className="flex flex-col justify-center pr-0 lg:pr-14 py-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">About Anantha</p>
              <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-[-0.04em] leading-[1.03] text-[#151a3d]">Building Value<br />For Generations</h2>
              <p className="mt-6 max-w-xl text-sm md:text-base leading-7 text-slate-600">Anantha Real Estate Consultancy helps buyers, property owners and investors navigate real estate with local knowledge, transparent communication and a client-first approach.</p>
              <Link to="/about" className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-[#4020a3] to-[#2787ed] px-5 py-3 text-sm font-bold text-white">Know More About Us <ArrowRight size={16} /></Link>
            </div>
            <div className="relative min-h-[360px] overflow-hidden rounded-2xl lg:rounded-none"><img src={aboutImage} alt="Anantha Real Estate property advisory" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute right-6 top-1/2 -translate-y-1/2 max-w-[210px] rounded-xl bg-white/88 backdrop-blur p-6 shadow-xl"><Quote size={24} className="text-[#4a29a8]" /><p className="mt-4 text-2xl leading-8 text-[#2d3260]">Spaces That Inspire A Brighter Tomorrow.</p></div></div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#1e126f] via-[#3c20ad] to-[#2186e8] text-white">
          <div className="container mx-auto px-4 py-12 md:py-14">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-9"><h2 className="text-3xl font-medium">Why Choose Anantha?</h2><p className="text-sm text-white/80">Your Real Estate Partner, Always</p></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyItems.map(({ icon: Icon, title, text }) => <div key={title} className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10"><Icon size={22} /></div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/70">{text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between gap-4 mb-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">Our services</p><h2 className="mt-2 text-3xl md:text-4xl font-black tracking-[-0.035em] text-[#151a3d]">Complete Real Estate Solutions</h2></div><Link to="/services" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#4023a4]">View All Services <ArrowRight size={16} /></Link></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {serviceItems.map(({ icon: Icon, title, text }) => <Link to="/services" key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(32,42,85,0.05)] hover:-translate-y-1 transition-transform"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#eff1ff] text-[#4024a4]"><Icon size={19} /></div><h3 className="mt-4 font-extrabold text-[#171c42]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></Link>)}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#fbfcff]">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between gap-4 mb-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">Our projects</p><h2 className="mt-2 text-3xl md:text-4xl font-black tracking-[-0.035em] text-[#151a3d]">Featured Projects</h2></div><Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-[#4023a4]">View All Projects <ArrowRight size={16} /></Link></div>
            <div className="grid lg:grid-cols-2 gap-5">
              <Link to="/centralworld" className="group grid sm:grid-cols-[190px_1fr_auto] items-center gap-5 rounded-xl bg-white border border-slate-200 p-3 shadow-sm"><div className="h-28 overflow-hidden rounded-lg"><img src={aboutImage} alt="Central World" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div><h3 className="text-lg font-extrabold text-[#171c42]">Central World</h3><p className="mt-1 text-sm text-slate-500">Premium plotted development · Nellore</p></div><span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-r from-[#4320a7] to-[#2388ee] text-white"><ArrowRight size={17} /></span></Link>
              <Link to="/projects" className="group grid sm:grid-cols-[190px_1fr_auto] items-center gap-5 rounded-xl bg-white border border-slate-200 p-3 shadow-sm"><div className="h-28 overflow-hidden rounded-lg"><img src={houseImage} alt="Anantha Real Estate projects" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div><h3 className="text-lg font-extrabold text-[#171c42]">Explore All Projects</h3><p className="mt-1 text-sm text-slate-500">Project opportunities represented by Anantha Real Estate</p></div><span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-r from-[#4320a7] to-[#2388ee] text-white"><ArrowRight size={17} /></span></Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">Testimonials</p><h2 className="mt-2 text-3xl md:text-4xl font-black tracking-[-0.035em] text-[#151a3d]">What Our Clients Say</h2>
            <div className="mt-8 grid md:grid-cols-3 gap-5">{testimonials.map((item) => <article key={item.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(32,42,85,0.05)]"><Quote size={23} className="text-[#4123a2]" /><p className="mt-4 text-sm leading-6 text-slate-600">“{item.text}”</p><div className="mt-6 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#eeeaff] to-[#dcecff] text-sm font-black text-[#3f25a0]">{item.name.charAt(0)}</div><div><p className="text-sm font-extrabold text-[#171c42]">{item.name}</p><p className="text-xs text-slate-400">{item.role}</p></div></div></article>)}</div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#fbfcff]">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between gap-4 mb-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4324a5]">Property intelligence</p><h2 className="mt-2 text-3xl md:text-4xl font-black tracking-[-0.035em] text-[#151a3d]">Real Estate Insights</h2></div><Link to="/property-intelligence" className="inline-flex items-center gap-2 text-sm font-bold text-[#4023a4]">View Insights <ArrowRight size={16} /></Link></div>
            <div className="grid md:grid-cols-3 gap-5">
              {[['Property Buying Checklist', 'What to review before moving ahead with a property decision.'], ['Understanding Property Documents', 'A practical introduction to common property documentation.'], ['Residential vs Commercial', 'How requirements differ when comparing residential and commercial real estate.']].map(([title, text], i) => <Link key={title} to="/property-intelligence" className="overflow-hidden rounded-xl bg-white border border-slate-200"><div className="aspect-[16/8] overflow-hidden"><img src={i === 1 ? heroImage : i === 2 ? aboutImage : houseImage} alt={title} className="h-full w-full object-cover" /></div><div className="p-4"><h3 className="font-extrabold text-[#171c42]">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div></Link>)}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-r from-[#1d126e] via-[#2c2d9d] to-[#6320b6] text-white">
          <div className="absolute inset-0 opacity-15"><img src={heroImage} alt="" className="h-full w-full object-cover" /></div>
          <div className="container relative mx-auto px-4 py-14 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-7"><div><h2 className="text-3xl md:text-4xl font-black">Let’s Find Your Perfect Property</h2><p className="mt-3 max-w-2xl text-sm md:text-base text-white/75">Share your property requirement and our team can help you understand suitable options and the next steps.</p></div><Link to="/property-consultation" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-[#30208f]">Get a Free Consultation <ArrowRight size={16} /></Link></div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_1fr_1.1fr] gap-10">
          <div><img src={logo} alt="Anantha Real Estate Consultancy" className="h-16 w-auto" /><p className="mt-3 text-xs text-slate-500">Spaces for a Brighter Tomorrow</p><p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">Real estate consultancy for property search, projects, commercial opportunities and transaction support.</p></div>
          <div><h3 className="text-sm font-extrabold text-[#171c42]">Quick Links</h3><div className="mt-4 grid gap-2.5 text-sm text-slate-500"><Link to="/">Home</Link><Link to="/properties">Properties</Link><Link to="/projects">Projects</Link><Link to="/services">Services</Link><Link to="/property-intelligence">Property Intelligence</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></div></div>
          <div><h3 className="text-sm font-extrabold text-[#171c42]">Our Services</h3><div className="mt-4 grid gap-2.5 text-sm text-slate-500"><Link to="/services">Property Search</Link><Link to="/services">Selling Assistance</Link><Link to="/services">Investment Advisory</Link><Link to="/services">Documentation</Link><Link to="/services">Commercial Real Estate</Link><Link to="/property-consultation">Consultation</Link></div></div>
          <div><h3 className="text-sm font-extrabold text-[#171c42]">Contact Us</h3><div className="mt-4 grid gap-3 text-sm text-slate-500"><p className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 text-[#4023a4]" /> Satyanarayana Puram Centre, Mypadu Road, Nellore, Andhra Pradesh 524002</p><a href="tel:+916302966604" className="flex items-center gap-2"><Phone size={16} className="text-[#4023a4]" /> +91 63029 66604</a><a href="mailto:jvk.aconsultancy@gmail.com" className="flex items-center gap-2"><Mail size={16} className="text-[#4023a4]" /> jvk.aconsultancy@gmail.com</a></div></div>
        </div>
        <div className="container mx-auto px-4 py-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-slate-400"><p>© 2026 Anantha Real Estate Consultancy. All Rights Reserved.</p><p>Designed for a Brighter Tomorrow.</p></div>
      </footer>
    </div>
  );
};

export default Index;
