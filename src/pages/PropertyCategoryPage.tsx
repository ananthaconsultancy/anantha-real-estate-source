import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PropertyListingCard from "@/components/PropertyListingCard";
import PremiumPageHero from "@/components/PremiumPageHero";
import PremiumCTA from "@/components/PremiumCTA";
import { propertyCategories } from "@/data/properties";
import { usePublicProperties } from "@/hooks/usePublicProperties";

const PropertyCategoryPage: React.FC = () => {
  const { properties, loading, error } = usePublicProperties();
  const { category } = useParams<{ category: string }>();
  const categoryInfo = propertyCategories.find((item) => item.slug === category);
  const listings = properties.filter((property) => property.type === category && property.status !== "unavailable");

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Property Category | Anantha Real Estate" description="Explore property categories in Nellore." path={`/properties/${category ?? "unknown"}`} />
        <Navbar />
        <main className="pt-32 pb-24 container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Category Not Found</h1>
          <Link to="/properties" className="inline-flex items-center gap-2 text-accent font-semibold"><ArrowLeft size={16} /> Browse all properties</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${categoryInfo.name} in Nellore | Anantha Real Estate`}
        description={`${categoryInfo.description} Browse customer-facing ${categoryInfo.name.toLowerCase()} listings from Anantha Real Estate in Nellore.`}
        path={`/properties/${categoryInfo.slug}`}
      />
      <Navbar />
      <main>
        <PremiumPageHero
          eyebrow="Property Category"
          title={`${categoryInfo.name} in Nellore`}
          description={`${categoryInfo.description} Explore approved customer-facing listings and contact our team for current availability.`}
          actions={<Link to="/properties" className="inline-flex items-center gap-2 text-brand-purple font-semibold"><ArrowLeft size={16} /> All Properties</Link>}
        />

        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-[#f7f9ff]">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div><p className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Current Inventory</p><h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Available {categoryInfo.name.toLowerCase()}</h2></div>
              <span className="text-sm text-muted-foreground">{listings.length} listing{listings.length === 1 ? "" : "s"}</span>
            </div>
            {loading ? <div className="rounded-2xl border bg-white p-10 text-center">Loading verified properties…</div> : error ? <div className="rounded-2xl border bg-white p-10 text-center text-muted-foreground">{error}</div> : listings.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-10 text-center max-w-2xl mx-auto shadow-sm">
                <h2 className="font-display text-2xl font-bold mb-3">No public listings published yet</h2>
                <p className="text-muted-foreground mb-6">We publish listings only after relevant public details are confirmed. Share your requirement and our team can check current options.</p>
                <Link to="/property-consultation" className="inline-flex items-center gap-2 text-accent font-semibold">Share your requirement <ArrowRight size={16} /></Link>
              </div>
            ) : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{listings.map((property) => <PropertyListingCard key={property.slug} property={property} />)}</div>}
          </div>
        </section>

        <PremiumCTA title={`Looking for ${categoryInfo.name.toLowerCase()}?`} description="Tell us your budget, preferred area and timeline and we will help you check suitable options." />
      </main>
      <Footer />
    </div>
  );
};

export default PropertyCategoryPage;
