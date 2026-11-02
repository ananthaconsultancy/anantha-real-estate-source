import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { CheckCircle2, ArrowRight } from "lucide-react";

const field = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600";
const initial = { name:"", phone:"", email:"", intent:"Buy", propertyType:"Plot", project:"", location:"", size:"", budget:"", timeline:"", notes:"", consent:false, website:"" };
export default function RequirementsPage() {
  const [form,setForm]=useState(initial);
  const [busy,setBusy]=useState(false);
  const [success,setSuccess]=useState("");
  const [error,setError]=useState("");
  const update=(key:keyof typeof initial,value:string|boolean)=>setForm(prev=>({...prev,[key]:value}));
  async function submit(e:FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const params=new URLSearchParams(window.location.search);
      const source=params.get("utm_source")||params.get("source")||"Website";
      const response=await fetch("/api/lead-requirements",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,source})});
      const data=await response.json();
      if(!response.ok||!data.ok) throw new Error(data.error||"Could not save your requirement");
      setSuccess(data.leadId); setForm(initial);
    } catch(err) {setError(err instanceof Error?err.message:"Please try again.");}
    finally {setBusy(false);}
  }
  return <div className="min-h-screen bg-[#f7f9fd]"><SEO title="Share Your Property Requirement | Anantha Real Estate" description="Tell Anantha Real Estate what property you want to buy, sell, rent or lease. We will contact you with relevant next steps." path="/requirements"/><Navbar/>
    <main className="container mx-auto max-w-5xl px-4 pb-20 pt-32 md:pt-40">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div className="pt-4"><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">Anantha Real Estate</p><h1 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-950 md:text-5xl">Tell us what you're looking for.</h1><p className="mt-5 text-lg leading-relaxed text-slate-600">Buying, selling, renting or expanding your business? Share the essentials. Our team will review your requirement and coordinate suitable options.</p><div className="mt-8 space-y-4 text-sm text-slate-700"><p className="flex gap-3"><CheckCircle2 className="shrink-0 text-blue-700"/>One form for residential and commercial requirements</p><p className="flex gap-3"><CheckCircle2 className="shrink-0 text-blue-700"/>No obligation to proceed</p><p className="flex gap-3"><CheckCircle2 className="shrink-0 text-blue-700"/>Your contact details are used to respond to your enquiry</p></div><a className="mt-8 inline-block font-semibold text-blue-800 underline" href="tel:+916302966604">Prefer to call? +91 63029 66604</a></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-9">
          {success?<div role="status" className="py-16 text-center"><CheckCircle2 className="mx-auto text-emerald-700" size={44}/><h2 className="mt-5 text-2xl font-semibold">Requirement received</h2><p className="mt-3 text-slate-600">Thank you. Your reference is {success}. Our team will review your details and contact you.</p><button className="mt-7 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white" onClick={()=>setSuccess("")}>Submit another requirement</button></div>:<form onSubmit={submit} className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-950">Your property requirement</h2>
            <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Full name *<input className={field+" mt-2"} required maxLength={100} autoComplete="name" value={form.name} onChange={e=>update("name",e.target.value)}/></label><label className="text-sm font-semibold">Phone / WhatsApp *<input className={field+" mt-2"} required type="tel" minLength={7} maxLength={25} autoComplete="tel" value={form.phone} onChange={e=>update("phone",e.target.value)}/></label></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">I want to *<select className={field+" mt-2"} value={form.intent} onChange={e=>update("intent",e.target.value)}>{["Buy","Rent","Sell","Lease out","Investment","Commercial requirement"].map(x=><option key={x}>{x}</option>)}</select></label><label className="text-sm font-semibold">Property type *<select className={field+" mt-2"} value={form.propertyType} onChange={e=>update("propertyType",e.target.value)}>{["Plot","House / Villa","Apartment","Commercial space","Warehouse / Industrial","Agricultural land","Other"].map(x=><option key={x}>{x}</option>)}</select></label></div>
            <label className="block text-sm font-semibold">Preferred area / city<input className={field+" mt-2"} maxLength={250} placeholder="e.g. Nellore, Banjara Hills, Madhapur" value={form.location} onChange={e=>update("location",e.target.value)}/></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Area / size<input className={field+" mt-2"} maxLength={100} placeholder="e.g. 4,000–5,000 sq ft" value={form.size} onChange={e=>update("size",e.target.value)}/></label><label className="text-sm font-semibold">Budget / rent<input className={field+" mt-2"} maxLength={100} placeholder="e.g. ₹50 lakh or ₹1 lakh/month" value={form.budget} onChange={e=>update("budget",e.target.value)}/></label></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Project name (optional)<input className={field+" mt-2"} maxLength={150} value={form.project} onChange={e=>update("project",e.target.value)}/></label><label className="text-sm font-semibold">Timeline<select className={field+" mt-2"} value={form.timeline} onChange={e=>update("timeline",e.target.value)}><option value="">Select if known</option>{["Immediately","Within 1 month","Within 3 months","Within 6 months","Just exploring"].map(x=><option key={x}>{x}</option>)}</select></label></div>
            <label className="block text-sm font-semibold">Additional requirements<textarea className={field+" mt-2"} rows={4} maxLength={1000} placeholder="e.g. separate locations, access, facing, ground floor, parking, preferred callback time" value={form.notes} onChange={e=>update("notes",e.target.value)}/></label>
            <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>update("website",e.target.value)}/></label></div>
            <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-600"><input className="mt-1" type="checkbox" required checked={form.consent} onChange={e=>update("consent",e.target.checked)}/><span>I agree that Anantha Real Estate may use my details to respond to this enquiry. This does not subscribe me to marketing. Read our <a href="/privacy-policy" className="font-semibold underline" target="_blank" rel="noreferrer">privacy policy</a>.</span></label>
            {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <button type="submit" disabled={busy||!form.consent} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 font-semibold text-white transition hover:bg-blue-900 disabled:opacity-50">{busy?"Saving your requirement…":"Submit requirement"}<ArrowRight size={18}/></button>
          </form>}
        </div>
      </div>
    </main><Footer/></div>;
}
