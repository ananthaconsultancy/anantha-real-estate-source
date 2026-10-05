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
    const dismissed = sessionStorage.getItem("cw-opening-popup-dismissed");
    if (dismissed) return;
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
    <div className="fixed inset-0 z-[190] grid place-items-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <button aria-label="Close launch invitation" onClick={close} className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-slate-900 shadow-lg"><X size={19} /></button>

        <div className="relative">
          <img src={POSTER} alt="Central World III grand opening invitation" className="max-h-[90vh] w-full bg-slate-100 object-contain" />

          <div className="absolute bottom-[3.2%] left-[51.2%] z-20 w-[43.2%] rounded-xl bg-white/98 px-2 pb-2 pt-1 shadow-sm sm:px-3 sm:pb-3">
            {done ? (
              <div className="flex min-h-[82px] flex-col items-center justify-center text-center text-slate-800">
                <CheckCircle2 className="mb-1 text-emerald-600" size={24} />
                <strong className="text-xs sm:text-sm">Visit registered</strong>
                <span className="text-[9px] text-slate-500 sm:text-[11px]">Our team will contact you to coordinate.</span>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <label className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1.5">
                    <UserRound size={12} className="shrink-0 text-slate-400" />
                    <input required aria-label="Your Name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 w-full bg-transparent text-[9px] outline-none sm:text-[11px]" />
                  </label>
                  <label className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1.5">
                    <Phone size={12} className="shrink-0 text-slate-400" />
                    <input required inputMode="tel" aria-label="Phone Number" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="min-w-0 w-full bg-transparent text-[9px] outline-none sm:text-[11px]" />
                  </label>
                </div>
                <button disabled={busy} className="w-full rounded-md bg-[#5b287b] px-2 py-1.5 text-[9px] font-semibold text-white disabled:opacity-60 sm:text-[11px]">{busy ? "Registering…" : "Register for Free Site Visit"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}