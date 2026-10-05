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
        name: name.trim(), phone: phone.trim(), email: "",
        message: "Central World III launch event registration",
        lead_type: "Project Enquiry",
        interest: "Central World III Grand Opening — 11 Oct 2026",
        intent: "Free Launch Event Site Visit",
        source: "Website", source_page: pathname,
        page_url: window.location.href, timestamp: new Date().toISOString(),
      };
      const response = await fetch("https://sheetdb.io/api/v1/5t6g1w4g6wj80", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [payload] }),
      });
      if (!response.ok) throw new Error("Could not register your visit.");
      trackEvent("central_world_launch_registration", { source_page: pathname, intent: payload.intent });
      setDone(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not register your visit. Please try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[190] grid place-items-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <button aria-label="Close launch invitation" onClick={close} className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-slate-900 shadow-lg"><X size={19} /></button>

        <img src={POSTER} alt="Central World III grand opening invitation" className="block w-full bg-slate-100 object-contain" />

        <div className="border-t border-slate-100 bg-white px-4 py-4 sm:px-6 sm:py-5">
          {done ? (
            <div className="flex min-h-[86px] flex-col items-center justify-center text-center">
              <CheckCircle2 className="mb-2 text-emerald-600" size={28} />
              <strong className="text-base text-slate-900">Your free site visit is registered</strong>
              <span className="mt-1 text-sm text-slate-500">Our team will contact you to coordinate your Central World III launch visit.</span>
            </div>
          ) : (
            <form onSubmit={submit} className="mx-auto max-w-xl">
              <div className="mb-3 text-center">
                <h3 className="text-lg font-semibold text-slate-950">Register for Your Free Site Visit</h3>
                <p className="mt-1 text-xs text-slate-500">Enter your details and our team will coordinate your visit to the launch event.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3">
                  <UserRound size={15} className="shrink-0 text-slate-400" />
                  <input required aria-label="Your Name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 w-full bg-transparent text-sm outline-none" />
                </label>
                <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3">
                  <Phone size={15} className="shrink-0 text-slate-400" />
                  <input required inputMode="tel" aria-label="Phone Number" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="min-w-0 w-full bg-transparent text-sm outline-none" />
                </label>
                <button disabled={busy} className="min-h-11 whitespace-nowrap rounded-xl bg-[#5b287b] px-5 text-sm font-semibold text-white transition hover:bg-[#492064] disabled:opacity-60">{busy ? "Registering…" : "Register Free"}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}