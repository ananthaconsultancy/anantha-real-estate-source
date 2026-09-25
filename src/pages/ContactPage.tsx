import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PremiumPageHero from "@/components/PremiumPageHero";

import { useSearchParams } from "react-router-dom";
import { getProjectBySlug } from "@/data/projects";

const ContactPage = () => {
  const [params] = useSearchParams();
  const project = getProjectBySlug(params.get("project") || "");
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Anantha Real Estate | Nellore Property Consultants"
        description="Contact Anantha Real Estate in Nellore for property buying, selling, investment and site-visit assistance. Speak with our local real estate team."
        path="/contact"
      />
      <Navbar />
      <main>
        <PremiumPageHero
          eyebrow="Contact Anantha"
          title="Start with a conversation. We’ll help you plan the next step."
          description="Talk to our Nellore team about a property requirement, project, investment opportunity, commercial space or consultation."
        />
        <div className="bg-gradient-to-b from-white to-[#f7f9ff]">
          <Contact key={project?.slug || "general"} projectName={project?.name} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
