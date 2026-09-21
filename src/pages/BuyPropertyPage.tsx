import { FormEvent, useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const BuyPropertyPage = () => {
  const [form, setForm] = useState({ name: "", phone: "", type: "Plots", location: "", budget: "", notes: "" });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    trackEvent("buyer_requirement_submit", { property_type: form.type, preferred_location: form.location, budget: form.budget });
    const message = `Hi Anantha Real Estate, I am looking to buy a property.\nName: ${form.name}\nPhone: ${form.phone}\nProperty type: ${form.type}\nPreferred location: ${form.location || "Open"}\nBudget: ${form.budget || "Not specified"}\nRequirement: ${form.notes || "Please suggest suitable options."}`;
    window.open(`https://wa.me/916302966604?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen">
      <SEO title="Buy Property in Nellore | Anantha Real Estate" description="Share your property requirement with Anantha Real Estate and get matched with suitable plots, apartments, villas, land and commercial properties in Nellore." path="/buy-property" />
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-to-b from-brand-dark to-brand-purple py-16 text-cream">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Buyer requirement</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">Tell us what you want to buy.</h1>
            <p className="text-cream/75 mt-5 text-lg">We’ll use your requirement to shortlist suitable approved inventory instead of pushing random listings.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl grid lg:grid-cols-[0.8fr_1.2fr] gap-10">
            <div>
              <Search className="w-12 h-12 text-accent mb-5" />
              <h2 className="font-display text-3xl font-bold">How matching works</h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">Share your property type, preferred locality and budget. Our team checks current inventory, confirms availability and then contacts you with relevant options.</p>
            </div>
            <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-border bg-background px-4 py-3" />
                <input required placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border border-border bg-background px-4 py-3" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl border border-border bg-background px-4 py-3">
                  <option>Plots</option><option>Apartments</option><option>Villas</option><option>Commercial</option><option>Land</option>
                </select>
                <input placeholder="Preferred location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-xl border border-border bg-background px-4 py-3" />
              </div>
              <input placeholder="Approximate budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              <textarea rows={5} placeholder="Tell us more about your requirement" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              <Button type="submit" variant="brand" className="w-full"><MessageCircle size={18} /> Send requirement on WhatsApp</Button>
              <p className="text-xs text-muted-foreground">Submitting opens WhatsApp with your requirement. No private seller information is exposed.</p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BuyPropertyPage;
