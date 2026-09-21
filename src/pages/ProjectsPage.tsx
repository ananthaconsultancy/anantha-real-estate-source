import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import PremiumCTA from "@/components/PremiumCTA";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <SEO title="Real Estate Projects in Nellore | Anantha Real Estate" description="Explore premium residential, plotted and township projects represented by Anantha Real Estate across Nellore." path="/projects" />
      <Navbar />
      <main>
        <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-[#17152d] text-white overflow-hidden relative">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#5eb1e3]/20 blur-3xl" />
          <div className="container mx-auto px-4 relative">
            <p className="text-xs uppercase tracking-[0.28em] font-bold text-white/55 mb-5">Anantha Real Estate · Projects</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold max-w-5xl leading-[0.98]">Creating more than spaces,<br/><span className="text-[#8cccf0]">crafting destinations.</span></h1>
            <p className="mt-7 max-w-2xl text-lg md:text-xl text-white/65 leading-relaxed">Explore selected developments represented by Anantha Real Estate. Project information is presented clearly while live inventory and commercial price sheets remain private.</p>
          </div>
        </section>

        <section className="py-8 bg-white border-b border-black/5">
          <div className="container mx-auto px-4 flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold mr-3">Explore</span>
            <span className="px-5 py-2.5 rounded-full bg-[#17152d] text-white text-sm">All Projects</span>
            <span className="px-5 py-2.5 rounded-full border border-black/10 text-sm">Plots</span>
            <span className="px-5 py-2.5 rounded-full border border-black/10 text-sm">Townships</span>
            <span className="px-5 py-2.5 rounded-full border border-black/10 text-sm">Commercial</span>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 md:flex md:items-end md:justify-between gap-8">
              <div><p className="text-xs uppercase tracking-[0.25em] font-bold text-[#6044b8] mb-3">Ongoing Projects</p><h2 className="font-display text-4xl md:text-6xl font-bold text-[#17152d]">Find your next address.</h2></div>
              <p className="mt-4 md:mt-0 max-w-md text-muted-foreground">Premium projects, local guidance and a direct path from enquiry to site visit.</p>
            </div>

            <div className="space-y-10">
              {projects.map((project, index) => (
                <article key={project.slug} className="group bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="grid lg:grid-cols-[1.15fr_0.85fr] min-h-[420px]">
                    <div className="relative min-h-[320px] lg:min-h-full overflow-hidden bg-gradient-to-br from-[#dcecff] via-[#eeeafa] to-[#d9d5ed]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(94,177,227,.45),transparent_30%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-7 md:p-9 bg-gradient-to-t from-black/55 to-transparent text-white">
                        <span className="text-xs uppercase tracking-[0.22em] font-semibold">{project.companyName}</span>
                        <h3 className="font-display text-3xl md:text-5xl font-bold mt-2">{project.name}</h3>
                      </div>
                      <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-[#17152d]">{index === 0 ? "Featured" : "Ongoing"}</div>
                    </div>

                    <div className="p-7 md:p-10 lg:p-12 flex flex-col justify-center">
                      <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#6044b8] mb-3">{project.projectType}</p>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-6"><MapPin size={17} className="mt-0.5 shrink-0" />{project.location}</div>
                      <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">{project.description}</p>
                      <div className="grid grid-cols-2 gap-3 mb-9">
                        {project.highlights.slice(0,4).map((highlight) => <div key={highlight} className="border-t border-black/10 pt-3 text-sm font-medium text-[#17152d]">{highlight}</div>)}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="brand" size="lg" asChild><Link to={project.marketingPath}>View Project <ArrowRight size={18}/></Link></Button>
                        <Button variant="outline" size="lg" asChild><Link to="/contact">Enquire Now</Link></Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#17152d] text-white overflow-hidden">
          <div className="container mx-auto px-4"><div className="flex whitespace-nowrap font-display text-4xl md:text-7xl font-bold opacity-90 gap-8"><span>LOCAL KNOWLEDGE</span><span>•</span><span>BETTER DECISIONS</span><span>•</span><span>TRUSTED GUIDANCE</span></div></div>
        </section>

        <PremiumCTA title="Found a project you like?" description="Speak with Anantha Real Estate for current project information, document guidance and site-visit coordination." href="/contact" label="Enquire Now" />
      </main>
      <Footer />
    </div>
  );
};
export default ProjectsPage;
