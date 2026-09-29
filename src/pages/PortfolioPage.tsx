import React from "react";
import Navbar from "@/components/Navbar";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PremiumPageHero from "@/components/PremiumPageHero";
import { Button } from "@/components/ui/button";
import { useLeadEnquiry } from "@/components/LeadEnquiry";

const PortfolioPage: React.FC = () => {
  const { openLead } = useLeadEnquiry();
  return <div className="min-h-screen bg-background">
    <SEO title="Properties in Nellore | Anantha Real Estate Portfolio" description="Explore residential and land property opportunities through Anantha Real Estate. View selected properties and arrange a site visit with our team." path="/portfolio"/>
    <Navbar/><main><PremiumPageHero eyebrow="Our Portfolio" title="Selected work, properties and project activity." description="Explore a curated view of the properties, projects and real estate work represented by Anantha Real Estate."/>
    <Portfolio buttonText="View Property Opportunities" buttonLink="/properties" external={false}/>
    <section className="bg-[#17152d] py-16 text-white"><div className="container mx-auto px-4 text-center"><h2 className="font-display text-3xl md:text-5xl font-semibold">Want to discuss one of these opportunities?</h2><p className="mx-auto mt-4 max-w-2xl text-white/65">Register your requirement and choose a callback, availability check or site visit.</p><Button onClick={()=>openLead("Property Opportunities","Schedule Site Visit")} className="mt-7 bg-white text-slate-950 hover:bg-white/90">Start Enquiry</Button></div></section>
    </main><Footer/></div>;
};
export default PortfolioPage;
