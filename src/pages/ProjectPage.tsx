import { ArrowLeft, ArrowRight, Building2, MapPin, Phone, CheckCircle2, FileText, Trees, Route, Waves, Dumbbell, Gamepad2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PropertyListingCard from "@/components/PropertyListingCard";
import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { getPropertiesByProject } from "@/data/properties";
import PremiumCTA from "@/components/PremiumCTA";

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const inventory = slug ? getPropertiesByProject(slug).filter((property) => property.status !== "unavailable") : [];
  const isMotherlandProject = project?.partnerSlug === "motherland-developers";

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24"><div className="container mx-auto px-4 max-w-3xl text-center"><h1 className="font-display text-4xl font-bold mb-4">Project not found</h1><p className="text-muted-foreground mb-8">The project you are looking for is not currently available.</p><Button variant="brand" asChild><Link to="/projects">Back to Projects</Link></Button></div></main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <SEO title={project.seoTitle} description={project.seoDescription} path={`/project/${project.slug}`} />
      <Navbar />
      <main id="overview">
        <section className="border-b border-slate-200 bg-white pb-16 pt-28 md:pb-20 md:pt-32">
          <div className="container mx-auto px-4">
            <Link to="/projects" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950 transition-colors"><ArrowLeft size={16} /> Back to Projects</Link>
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-end">
              <div>
                <span className="inline-flex border border-slate-300 px-3 py-1 text-xs font-semibold">{project.status}</span>
                <h1 className="mt-5 mb-4 font-display text-4xl font-semibold leading-[1.02] text-slate-950 md:text-6xl lg:text-7xl">{project.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{project.description}</p>
              </div>
              <aside className="border border-slate-200 bg-[#f4f4f2] p-6">
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-accent mb-2">Project Profile</p>
                <h2 className="font-display text-2xl font-bold mb-5">{project.companyName}</h2>
                <div className="grid gap-4 text-sm">
                  <div className="border-t border-slate-300 py-4"><span className="text-muted-foreground block mb-1">Project Type</span><span className="font-semibold">{project.projectType}</span></div>
                  <div className="border-t border-slate-300 py-4"><span className="text-muted-foreground block mb-1">Location</span><span className="font-semibold inline-flex items-center gap-2"><MapPin size={16} /> {project.location}</span></div>
                </div>
                <div className="flex flex-col gap-3 mt-6"><Button variant="brand" asChild><a href="https://calendly.com/jvk-aconsultancy/30min" target="_blank" rel="noopener noreferrer">Book Consultation <ArrowRight size={18} /></a></Button>{project.phone && <Button variant="outline" asChild><a href={`tel:${project.phone.replace(/\s+/g, "")}`}><Phone size={17} /> {project.phone}</a></Button>}</div>
              </aside>
            </div>
          </div>
        </section>

        <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur border-y border-border">
          <div className="container mx-auto px-4 overflow-x-auto">
            <div className="flex min-w-max gap-7 py-4 text-sm font-semibold text-[#17152d]">
              <a href="#overview">Overview</a><a href="#highlights">Highlights</a><a href="#amenities">Amenities</a><a href="#location">Location</a><a href="#documents">Documents</a><a href="#enquire">Enquire</a>
            </div>
          </div>
        </nav>

        <section className="border-b border-slate-200 bg-white py-12">
          <div className="container mx-auto px-4">
            {project.slug === "motherland-green-meadows" ? <div className="space-y-5"><div className="relative aspect-[16/8] overflow-hidden"><img src="/projects/motherland/green-meadows/aerial-01.jpg" alt="Green Meadows aerial view" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/><h2 className="absolute bottom-7 left-7 text-white font-display text-3xl md:text-5xl font-bold">Green Meadows · Brahmadevam</h2></div><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{["aerial-02.jpg","aerial-03.jpg","development.jpg"].map((file,i)=><img key={file} src={`/projects/motherland/green-meadows/${file}`} alt={`Green Meadows project view ${i+2}`} loading="lazy" className="w-full h-52 md:h-64 object-cover"/>)}</div><div className="pt-5"><p className="text-xs uppercase tracking-[0.22em] font-bold text-slate-500 mb-3">Project Video</p><video controls playsInline preload="metadata" poster="/projects/motherland/green-meadows/aerial-01.jpg" className="w-full bg-black"><source src="/projects/motherland/green-meadows/project-video.mp4" type="video/mp4"/></video></div></div> : <div className="aspect-[16/7] md:aspect-[16/6] bg-slate-100 flex items-center justify-center overflow-hidden relative border border-slate-200"><Building2 className="w-24 h-24 text-slate-400" aria-hidden="true"/></div>}
          </div>
        </section>

        <section id="highlights" className="py-16 md:py-24 bg-gradient-to-b from-white to-[#f7f9ff]">
          <div className="container mx-auto px-4">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-2">Project Highlights</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">What defines this project</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{project.highlights.map((highlight) => <div key={highlight} className="bg-white border border-border rounded-2xl p-5 shadow-sm"><p className="text-foreground font-medium">{highlight}</p></div>)}</div>
          </div>
        </section>

        {isMotherlandProject && (
          <>
            <section id="amenities" className="py-16 md:py-24 bg-[#17152d] text-white">
              <div className="container mx-auto px-4">
                <p className="text-xs uppercase tracking-[0.22em] font-bold text-[#8cccf0] mb-3">Lifestyle & Infrastructure</p>
                <h2 className="font-display text-4xl md:text-6xl font-bold max-w-3xl mb-10">Designed around everyday living.</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    [Route,"Internal Roads"],[Trees,"Open & Green Spaces"],[CheckCircle2,"Planned Layout"],[FileText,"Approval Documents"],
                    ...(project.slug === "motherland-crkr-sunrise-city" ? [[Waves,"Swimming Pool"],[Dumbbell,"Indoor Gym"],[Gamepad2,"Indoor Games"],[Building2,"Club House"]] : [])
                  ].map(([Icon,label]: any) => <div key={label} className="rounded-2xl border border-white/15 p-6 bg-white/5"><Icon className="mb-5 text-[#8cccf0]" size={30}/><p className="font-semibold">{label}</p></div>)}
                </div>
              </div>
            </section>

            <section id="location" className="py-16 md:py-24 bg-[#f7f5f0]">
              <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
                <div><p className="text-xs uppercase tracking-[0.22em] font-bold text-[#6044b8] mb-3">Location</p><h2 className="font-display text-4xl md:text-6xl font-bold text-[#17152d] mb-6">Connected to what matters.</h2><p className="text-lg text-muted-foreground leading-relaxed">{project.location}. Contact our team for the exact site location, route guidance and site-visit coordination.</p></div>
                <div className="min-h-[330px] rounded-[2rem] bg-white border border-black/5 shadow-sm flex items-center justify-center"><div className="text-center px-8"><MapPin size={50} className="mx-auto text-[#6044b8] mb-4"/><p className="font-display text-2xl font-bold">{project.location}</p><Button className="mt-6" variant="outline" asChild><Link to={`/contact?project=${encodeURIComponent(project.slug)}`}>Plan a Site Visit</Link></Button></div></div>
              </div>
            </section>

            <section id="documents" className="py-16 md:py-24 bg-white">
              <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10"><p className="text-xs uppercase tracking-[0.22em] font-bold text-[#6044b8] mb-3">Project Documentation</p><h2 className="font-display text-4xl md:text-5xl font-bold">Make an informed property decision.</h2></div>
                <div className="rounded-[2rem] border border-border bg-[#f7f9ff] p-7 md:p-10 flex flex-col md:flex-row gap-7 md:items-center md:justify-between"><div><h3 className="font-display text-2xl font-bold mb-2">Need layout and approval details?</h3><p className="text-muted-foreground max-w-2xl">Anantha Real Estate can provide the relevant project documents for customer verification. Live plot inventory and internal price sheets are intentionally not published online.</p></div><Button variant="brand" size="lg" asChild><Link to={`/contact?project=${encodeURIComponent(project.slug)}`}>Request Details <ArrowRight size={18}/></Link></Button></div>
              </div>
            </section>
          </>
        )}

        {!isMotherlandProject && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between gap-4 mb-8"><div><p className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Customer Inventory</p><h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Available in this project</h2></div><span className="text-sm text-muted-foreground">{inventory.length} listing{inventory.length === 1 ? "" : "s"}</span></div>
              {inventory.length > 0 ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{inventory.map((property) => <PropertyListingCard key={property.slug} property={property} />)}</div> : <div className="rounded-2xl border border-border bg-[#f7f9ff] p-8"><p className="text-muted-foreground">Customer inventory will appear here once individual properties are approved for public listing. Contact us for current availability.</p></div>}
            </div>
          </section>
        )}

        {isMotherlandProject && (
          <section id="enquire" className="py-14 bg-white border-t border-border">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-3">Project Enquiries</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Speak with Anantha Real Estate</h2>
              <p className="text-muted-foreground leading-relaxed">For current plot availability, commercial information, project documents and site visits, contact our team. Live inventory and internal price sheets are not published on this website.</p>
            </div>
          </section>
        )}

        <PremiumCTA title={`Interested in ${project.name}?`} description="Speak with our team to reconfirm current project information, availability and the next step." href={`/contact?project=${encodeURIComponent(project.slug)}`} label="Enquire About This Project" />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectPage;
