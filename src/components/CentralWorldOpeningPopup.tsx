import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarDays, MapPin, X } from "lucide-react";
import { useLeadEnquiry } from "@/components/LeadEnquiry";

const EVENT_DATE = "11 October 2026";
const POSTER = "/central-world-launch-2026.png.png";

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

  const close = () => {
    sessionStorage.setItem("cw-opening-popup-dismissed", "1");
    setOpen(false);
  };

  const register = () => {
    close();
    openLead("Central World III Grand Opening — 11 Oct 2026", "Free Launch Event Site Visit");
  };

  return (
    <div className="fixed inset-0 z-[190] grid place-items-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[26px] bg-white shadow-2xl">
        <button aria-label="Close launch invitation" onClick={close} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-slate-900 shadow-lg">
          <X size={19} />
        </button>

        <img src={POSTER} alt="Central World III grand opening invitation — 11 October 2026" className="max-h-[62vh] w-full bg-slate-100 object-contain" />

        <div className="space-y-4 p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#605e8a]">Anantha Real Estate · Launch Visit</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950 sm:text-2xl">Join us for the Central World III Grand Opening</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Register your name and phone number and our team will coordinate your free site visit to the launch event.</p>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3"><CalendarDays className="mt-0.5 shrink-0" size={18}/><span><strong>Sunday, {EVENT_DATE}</strong><br/><span className="text-slate-500">Launch event · 10:30 AM</span></span></div>
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3"><MapPin className="mt-0.5 shrink-0" size={18}/><span><strong>Central World site</strong><br/><span className="text-slate-500">Near Kanuparthipadu, Golagamudi Road, Nellore</span></span></div>
          </div>

          <button onClick={register} className="w-full rounded-xl bg-slate-950 px-5 py-4 font-semibold text-white transition hover:bg-slate-800">Register for Free Launch Event Site Visit</button>
          <p className="text-center text-xs text-slate-400">No booking commitment required · Lunch is part of the launch event</p>
        </div>
      </div>
    </div>
  );
}