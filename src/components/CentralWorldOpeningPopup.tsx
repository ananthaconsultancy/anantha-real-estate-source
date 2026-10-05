import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useLeadEnquiry } from "@/components/LeadEnquiry";

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
    <div
      className="fixed inset-0 z-[190] grid place-items-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <button
          aria-label="Close launch invitation"
          onClick={close}
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-slate-900 shadow-lg"
        >
          <X size={19} />
        </button>

        <div className="relative">
          <img
            src={POSTER}
            alt="Central World III grand opening invitation — register with your name and phone number"
            className="max-h-[90vh] w-full bg-slate-100 object-contain"
          />

          {/* The poster already contains the Name / Phone CTA. This transparent hotspot makes that CTA interactive without adding a second CTA below the artwork. */}
          <button
            type="button"
            onClick={register}
            aria-label="Register using the name and phone number section shown on the launch poster"
            title="Tap here to enter your name and phone number"
            className="absolute bottom-[3%] left-[7%] z-10 h-[18%] w-[86%] cursor-pointer rounded-xl bg-transparent focus:outline-none focus-visible:ring-4 focus-visible:ring-white/80"
          />
        </div>
      </div>
    </div>
  );
}