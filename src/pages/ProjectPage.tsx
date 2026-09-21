import { ArrowLeft, ArrowRight, Building2, MapPin, Phone } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <SEO title={project.seoTitle} description={project.seoDescription} path={`/project/${project.slug}`} />
      <Navbar />
      <main>
        <section className="pt-28 md:pt-32 pb-16 md:pb-20 bg-[radial-gradient(circle_at_80%_10%,rgba(94,177,227,0.2),transparent_30%),linear-gradient(135deg,#fff,#f5f7ff)] border-b border-border">
          <div className="container mx-auto px-4">
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-purple transition-colors mb-8"><ArrowLeft size={16} /> Back to Projects</Link>
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-end">
              <div>
                <span className="inline-flex px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold">{project.status}</span>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mt-5 mb-4 leading-[1.02]">{project.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{project.description}</p>
              </div>
              <aside className="rounded-2xl border border-border bg-white p-6 shadow-xl">
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-accent mb-2">Project Profile</p>
                <h2 className="font-display text-2xl font-bold mb-5">{project.companyName}</h2>
                <div className="grid gap-4 text-sm">
                  <div className="rounded-xl bg-[#f7f9ff] p-4"><span className="text-muted-foreground block mb-1">Project Type</span><span className="font-semibold">{project.projectType}</span></div>
                  <div className="rounded-xl bg-[#f7f9ff] p-4"><span className="text-muted-foreground block mb-1">Location</span><span className="font-semibold inline-flex items-center gap-2"><MapPin size={16} /> {project.location}</span></div>
                </div>
                <div className="flex flex-col gap-3 mt-6"><Button variant="brand" asChild><a href="https://calendly.com/jvk-aconsultancy/30min" target="_blank" rel="noopener noreferrer">Book Consultation <ArrowRight size={18} /></a></Button>{project.phone && <Button variant="outline" asChild><a href={`tel:${project.phone.replace(/\s+/g, "")}`}><Phone size={17} /> {project.phone}</a></Button>}</div>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="aspect-[16/7] md:aspect-[16/6] rounded-3xl bg-gradient-to-br from-[#eef4ff] to-[#e9e8ff] flex items-center justify-center overflow-hidden relative shadow-sm border border-border">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(94,177,227,0.26),transparent_28%)]" />
              <Building2 className="w-24 h-24 text-brand-purple/30 relative z-10" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-white to-[#f7f9ff]">
          <div className="container mx-auto px-4">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-2">Project Highlights</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">What defines this project</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{project.highlights.map((highlight) => <div key={highlight} className="bg-white border border-border rounded-2xl p-5 shadow-sm"><p className="text-foreground font-medium">{highlight}</p></div>)}</div>
          </div>
        </section>

        {!isMotherlandProject && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between gap-4 mb-8"><div><p className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Customer Inventory</p><h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Available in this project</h2></div><span className="text-sm text-muted-foreground">{inventory.length} listing{inventory.length === 1 ? "" : "s"}</span></div>
              {inventory.length > 0 ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{inventory.map((property) => <PropertyListingCard key={property.slug} property={property} />)}</div> : <div className="rounded-2xl border border-border bg-[#f7f9ff] p-8"><p className="text-muted-foreground">Customer inventory will appear here once individual properties are approved for public listing. Contact us for current availability.</p></div>}
            </div>
          </section>
        )}

        {isMotherlandProject && (
          <section className="py-14 bg-white border-t border-border">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-3">Project Enquiries</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Speak with Anantha Real Estate</h2>
              <p className="text-muted-foreground leading-relaxed">For current plot availability, commercial information, project documents and site visits, contact our team. Live inventory and internal price sheets are not published on this website.</p>
            </div>
          </section>
        )}

        <PremiumCTA title={`Interested in ${project.name}?`} description="Speak with our team to reconfirm current project information, availability and the next step." href="/contact" label="Enquire About This Project" />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectPage;
