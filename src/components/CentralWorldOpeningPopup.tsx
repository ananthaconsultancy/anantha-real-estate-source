import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarDays, MapPin, Utensils, X } from "lucide-react";
import { useLeadEnquiry } from "@/components/LeadEnquiry";

const EVENT_DATE = "11 October 2026";

export default function CentralWorldOpeningPopup() {
  const { pathname } = useLocation();
  const { openLead } = useLeadEnquiry();
  const [open, setOpen] = useState(false);
  const eligible = pathname === "/" || pathname === "/centralworld";

  useEffect(() => {
    if (!eligible) return;
    const dismissed = sessionStorage.getItem("cw-opening-popup-dismissed");
    if (dismissed) return;
    const timer = window.setTimeout(() => setOpen(true), pathname === "/centralworld" ? 900 : 1800);
    return () => window.clearTimeout(timer);
  }, [eligible, pathname]);

  if (!eligible || !open) return null;
  const close = () => { sessionStorage.setItem("cw-opening-popup-dismissed", "1"); setOpen(false); };
  const register = () => { close(); openLead("Central World III Grand Opening — 11 Oct 2026", "Free Launch Event Site Visit"); };

  return <div className="fixed inset-0 z-[190] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={e=>e.target===e.currentTarget&&close()}>
    <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-white shadow-2xl">
      <button aria-label="Close" onClick={close} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow"><X size={18}/></button>
      <div className="bg-gradient-to-br from-[#43246f] via-[#684099] to-[#2f245d] px-7 py-8 text-white">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-white/70">Green Home Developers · Central World III</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight">Free Site Visit to the Central World III Grand Opening</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-white/85">Join Anantha Real Estate for the launch event, explore Central World III on-ground and experience the project before making your property decision.</p>
      </div>
      <div className="space-y-5 p-7">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex gap-3 rounded-2xl bg-slate-50 p-4"><CalendarDays className="mt-0.5 shrink-0" size={19}/><div><strong>Sunday, {EVENT_DATE}</strong><p className="text-slate-500">10:30 AM</p></div></div>
          <div className="flex gap-3 rounded-2xl bg-slate-50 p-4"><MapPin className="mt-0.5 shrink-0" size={19}/><div><strong>Central World site</strong><p className="text-slate-500">Near Kanuparthipadu, Golagamudi Road, Nellore</p></div></div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm"><Utensils size={20}/><span><strong>Lunch will be served at the launch event.</strong> Register your name and phone number so our team can coordinate your free site visit.</span></div>
        <button onClick={register} className="w-full rounded-xl bg-slate-950 px-5 py-4 font-semibold text-white">Register for Free Launch Event Site Visit</button>
        <p className="text-center text-xs text-slate-400">No booking commitment required. Registration is for launch-event site-visit coordination.</p>
      </div>
    </div>
  </div>;
}