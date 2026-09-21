import { FormEvent, useRef, useState } from "react";
import { CheckCircle2, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { getAttribution, trackEvent } from "@/lib/analytics";

const initialForm = { name: "", phone: "", requirement: "Buy a property", propertyType: "Plot", location: "", budget: "", timeline: "Within 3 months", consent: false };

const PropertyConsultationPage = () => {
  const [form, setForm] = useState(initialForm);
  const started = useRef(false);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("lead_form_start", { form_name: "property_consultation" });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const attribution = getAttribution();
    trackEvent("lead_submit", { form_name: "property_consultation", requirement: form.requirement, property_type: form.propertyType, purchase_timeline: form.timeline, destination: "whatsapp" });
    const campaign = [attribution.utm_source, attribution.utm_campaign].filter(Boolean).join(" / ");
    const message = ["Hi Anantha Real Estate, I would like a property consultation.", `Name: ${form.name}`, `Phone: ${form.phone}`, `Requirement: ${form.requirement}`, `Property type: ${form.propertyType}`, `Preferred location: ${form.location || "Open to suggestions"}`, `Budget: ${form.budget || "To be discussed"}`, `Timeline: ${form.timeline}`, campaign ? `Campaign: ${campaign}` : ""].filter(Boolean).join("\n");
    window.open(`https://wa.me/916302966604?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const inputClass = "rounded-xl border border-border bg-white px-4 py-3.5 font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition";

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Free Property Consultation in Nellore | Anantha Real Estate" description="Tell Anantha Real Estate what you want to buy, sell or invest in. Get a focused property consultation and relevant options across Nellore." path="/property-consultation" />
      <Navbar />
      <main>
        <section className="pt-28 md:pt-32 pb-16 md:pb-20 bg-[radial-gradient(circle_at_80%_15%,rgba(94,177,227,0.2),transparent_28%),linear-gradient(135deg,#ffffff,#f4f7ff)] border-b border-border">
          <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-14 items-start">
            <div className="pt-4">
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-accent">Property Consultation</p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mt-4 leading-[1.03] text-foreground">Get property options matched to your actual requirement.</h1>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-2xl">Share your budget, preferred area and timeline. Our team will review the requirement and help you plan the next step.</p>
              <div className="mt-8 grid gap-4">
                {["Local guidance focused on Nellore", "Residential, plots, land and commercial requirements", "Clear next steps for shortlisting and site visits"].map((item) => <p key={item} className="flex gap-3 items-start"><span className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0"><CheckCircle2 size={18} /></span><span className="pt-1 font-medium">{item}</span></p>)}
              </div>
              <a href="tel:+916302966604" onClick={() => trackEvent("phone_click", { placement: "consultation_hero", phone_number: "primary" })} className="inline-flex items-center gap-2 mt-9 text-brand-purple font-semibold hover:text-accent transition-colors"><Phone size={18} /> Prefer to call? +91 63029 66604</a>
            </div>

            <form onSubmit={submit} onFocus={markStarted} className="rounded-3xl bg-white text-card-foreground p-6 md:p-8 border border-border shadow-2xl space-y-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Free Consultation</p><h2 className="font-display text-2xl md:text-3xl font-bold mt-2">Tell us what you need</h2><p className="text-sm text-muted-foreground mt-2">Your details will open in WhatsApp ready for you to send.</p></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="grid gap-2 text-sm font-medium">Name<input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Your name" /></label>
                <label className="grid gap-2 text-sm font-medium">Phone<input required type="tel" inputMode="tel" autoComplete="tel" minLength={7} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+91 phone number" /></label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="grid gap-2 text-sm font-medium">I want to<select value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} className={inputClass}><option>Buy a property</option><option>Sell a property</option><option>Invest in property</option><option>Find commercial space</option></select></label>
                <label className="grid gap-2 text-sm font-medium">Property type<select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className={inputClass}><option>Plot</option><option>Apartment</option><option>House / Villa</option><option>Commercial property</option><option>Agricultural land</option><option>Other</option></select></label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="grid gap-2 text-sm font-medium">Preferred location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="Preferred area" /></label>
                <label className="grid gap-2 text-sm font-medium">Approximate budget<input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inputClass} placeholder="Example: ₹30–50 lakh" /></label>
              </div>
              <label className="grid gap-2 text-sm font-medium">When are you planning?<select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className={inputClass}><option>Immediately</option><option>Within 1 month</option><option>Within 3 months</option><option>Within 6 months</option><option>Just researching</option></select></label>
              <label className="flex gap-3 text-xs leading-relaxed text-muted-foreground"><input required type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1" /><span>I agree that Anantha Real Estate may contact me about this property requirement.</span></label>
              <Button type="submit" variant="brand" size="lg" className="w-full"><MessageCircle size={18} /> Continue on WhatsApp</Button>
              <p className="text-center text-xs text-muted-foreground">Your name and phone number are not sent to advertising analytics.</p>
            </form>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-white to-[#f7f9ff]">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10"><p className="text-xs uppercase tracking-[0.2em] font-bold text-accent">How It Works</p><h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Simple from requirement to site visit</h2></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[["01", "Share the requirement", "Tell us the property type, preferred area, budget and timeline."], ["02", "Receive a focused shortlist", "We check current information and contact you with relevant options."], ["03", "Plan the next step", "Compare options, clarify details and arrange a site visit when ready."]].map(([number, title, copy]) => <div key={number} className="rounded-2xl border border-border bg-white p-7 shadow-sm"><span className="text-brand-purple text-sm font-bold">{number}</span><h2 className="font-display text-xl font-bold mt-3">{title}</h2><p className="text-muted-foreground mt-3 leading-relaxed">{copy}</p></div>)}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl text-center"><div className="w-14 h-14 mx-auto rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center"><ShieldCheck size={28} /></div><h2 className="font-display text-3xl font-bold mt-5">Clear guidance before commitment</h2><p className="text-muted-foreground mt-4 leading-relaxed">Property availability, pricing and approvals can change. We help you reconfirm material details and recommend independent legal and document verification before a purchase decision.</p></div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyConsultationPage;
