import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, UserRound, Phone, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const POSTER = "/central-world-launch-2026.png.png";

export default function CentralWorldOpeningPopup() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const eligible = pathname === "/" || pathname === "/projects" || pathname === "/centralworld";

  useEffect(() => {
    if (!eligible) return;
    if (sessionStorage.getItem("cw-opening-popup-dismissed")) return;
    const timer = window.setTimeout(() => setOpen(true), pathname === "/centralworld" ? 700 : 1400);
    return () => window.clearTimeout(timer);
  }, [eligible, pathname]);

  if (!eligible || !open) return null;

  const close = () => {
    sessionStorage.setItem("cw-opening-popup-dismissed", "1");
    setOpen(false);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, "").length < 7) {
      alert("Please enter your name and a valid phone number.");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: "",
        message: "Central World III launch event registration",
        lead_type: "Project Enquiry",
        interest: "Central World III Grand Opening — 11 Oct 2026",
        intent: "Free Launch Event Site Visit",
        source: "Website",
        source_page: pathname,
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
      };
      const response = await fetch("https://sheetdb.io/api/v1/5t6g1w4g6wj80", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [payload] }),
      });
      if (!response.ok) throw new Error("Could not register your visit.");
      trackEvent("central_world_launch_registration", { source_page: pathname, intent: payload.intent });
      setDone(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not register your visit. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[190] grid place-items-center overflow-y-auto bg-slate-950/75 p-2 backdrop-blur-sm sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="relative my-auto w-full max-w-[1100px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <button aria-label="Close launch invitation" onClick={close} className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-slate-900 shadow-lg"><X size={19} /></button>

        <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
          <img src={POSTER} alt="Central World III grand opening invitation" className="absolute inset-0 h-full w-full object-cover" />

          <div className="absolute bottom-[5.5%] left-[46%] z-20 w-[48%] sm:bottom-[6%] sm:left-[45.5%] sm:w-[48.5%]">
            {done ? (
              <div className="rounded-2xl border border-white/70 bg-white/95 px-4 py-5 text-center shadow-xl backdrop-blur-sm sm:px-6 sm:py-7">
                <CheckCircle2 className="mx-auto mb-2 text-emerald-600" size={28} />
                <strong className="block text-sm text-slate-950 sm:text-xl">Your free site visit is registered</strong>
                <span className="mt-1 block text-[10px] text-slate-500 sm:text-sm">Our team will contact you to coordinate your Central World III launch visit.</span>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-2xl border border-white/70 bg-white/95 p-2.5 shadow-xl backdrop-blur-sm sm:p-5">
                <div className="mb-2 text-center sm:mb-4">
                  <h3 className="text-xs font-semibold text-slate-950 sm:text-xl">Register for Your Free Site Visit</h3>
                  <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">Enter your details and our team will coordinate your visit to the launch event.</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                  <label className="flex min-h-8 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 sm:min-h-12 sm:gap-2 sm:rounded-xl sm:px-3">
                    <UserRound size={14} className="shrink-0 text-slate-400" />
                    <input required aria-label="Your Name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 w-full bg-transparent text-[10px] outline-none sm:text-sm" />
                  </label>
                  <label className="flex min-h-8 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 sm:min-h-12 sm:gap-2 sm:rounded-xl sm:px-3">
                    <Phone size={14} className="shrink-0 text-slate-400" />
                    <input required inputMode="tel" aria-label="Phone Number" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="min-w-0 w-full bg-transparent text-[10px] outline-none sm:text-sm" />
                  </label>
                </div>
                <button disabled={busy} className="mt-1.5 min-h-8 w-full rounded-lg bg-[#5b287b] px-3 text-[10px] font-semibold text-white transition hover:bg-[#492064] disabled:opacity-60 sm:mt-3 sm:min-h-12 sm:rounded-xl sm:text-sm">{busy ? "Registering…" : "Register for Free Site Visit"}</button>
                <p className="mt-1 hidden text-center text-[11px] text-slate-500 sm:block">Limited seats · No cost to attend · Our team will confirm your visit</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}