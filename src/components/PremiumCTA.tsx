import { ArrowRight } from "lucide-react";
import { useLeadEnquiry } from "@/components/LeadEnquiry";

const PremiumCTA = ({ title = "Let’s Find the Right Property", description = "Tell us what you are looking for and our team will help you plan the next step.", href: _href = "/property-consultation", label = "Get a Free Consultation", interest, intent = "Request Callback" }: { title?: string; description?: string; href?: string; label?: string; interest?: string; intent?: string }) => {
  const { openLead } = useLeadEnquiry();
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-brand-dark via-brand-purple to-accent text-cream overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_75%_35%,white,transparent_22%)]" />
      <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-cream/70 mb-3">Anantha Real Estate</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">{title}</h2>
          <p className="mt-4 text-cream/75 text-lg leading-relaxed">{description}</p>
        </div>
        <button type="button" onClick={() => openLead(interest, intent)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-dark px-6 py-4 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform shrink-0">
          {label} <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default PremiumCTA;
