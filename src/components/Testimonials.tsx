import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react";

type Review = { id: string; name: string; content: string; rating: number; date?: string | null };
type Feed = { source: string; reviews: Review[]; averageRating?: number; totalReviewCount?: number };
const feedback: Review[] = [
  { id: "client-1", name: "RAVITEJA CHITTETI", content: "From childhood we have a dream to buy a house. But after visiting Anantha Real Estate Consultancy my dream came true.", rating: 5 },
  { id: "client-2", name: "Moni Swahith", content: "If you are looking for properties and don't know how to identify good opportunities, this consultancy helps you understand what to look for.", rating: 5 },
  { id: "client-3", name: "Rammohan Rao", content: "Good experience.", rating: 5 },
];

export default function Testimonials() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [viewport, carousel] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const google = feed?.source === "google";
  const reviews = google ? feed.reviews : feedback;

  useEffect(() => {
    let controller: AbortController | undefined;
    let active = true;
    let inFlight = false;
    async function refresh() {
      if (document.hidden || inFlight) return;
      inFlight = true;
      const requestController = new AbortController();
      controller = requestController;
      const timeout = window.setTimeout(() => requestController.abort(), 18000);
      try {
        const response = await fetch("/api/gbp?action=public-reviews", { signal: requestController.signal });
        if (!response.ok) throw new Error("Reviews unavailable");
        const data = await response.json();
        if (active) setFeed(data.source === "google" && Array.isArray(data.reviews) ? data : null);
      } catch { if (active) setFeed(null); }
      finally { window.clearTimeout(timeout); inFlight = false; }
    }
    void refresh();
    const timer = window.setInterval(refresh, 5 * 60 * 1000);
    const onVisibility = () => { setVisible(!document.hidden); if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { active = false; controller?.abort(); window.clearInterval(timer); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!carousel) return;
    const update = () => setSelected(carousel.selectedScrollSnap());
    const stop = () => setPaused(true);
    carousel.on("select", update).on("reInit", update).on("pointerDown", stop);
    update();
    return () => { carousel.off("select", update).off("reInit", update).off("pointerDown", stop); };
  }, [carousel]);

  useEffect(() => {
    if (!carousel || paused || hovered || reducedMotion || !visible || reviews.length < 2) return;
    const timer = window.setInterval(() => carousel.scrollNext(), 7000);
    return () => window.clearInterval(timer);
  }, [carousel, paused, hovered, reducedMotion, visible, reviews.length]);

  const step = (direction: number) => { setPaused(true); direction < 0 ? carousel?.scrollPrev() : carousel?.scrollNext(); };
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-[#f5f6fc] py-20 text-[#303058] md:py-28">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-[#5260aa]">{google ? "Google reviews" : "Client feedback"}</p>
          <h2 id="testimonials-title" className="max-w-lg font-display text-3xl font-semibold leading-tight md:text-5xl">The relationship matters as much as the transaction.</h2>
          <p className="mt-6 max-w-md leading-7 text-[#636780]">Experiences shared by people who have worked with Anantha Real Estate.</p>
          {google && <div className="mt-6 text-sm"><p className="font-semibold">{typeof feed.averageRating === "number" ? feed.averageRating.toFixed(1) + " / 5" : "Customer reviews"}{typeof feed.totalReviewCount === "number" ? " · " + feed.totalReviewCount + " Google reviews" : ""}</p><p className="mt-2 text-[#636780]">Latest reviews · refreshed automatically</p></div>}
        </div>
        <div role="region" aria-roledescription="carousel" aria-label={google ? "Google customer reviews" : "Client testimonials"} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPaused(true)} onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); step(event.key === "ArrowLeft" ? -1 : 1); } }} className="min-w-0">
          <div ref={viewport} className="overflow-hidden rounded-2xl border border-[#e3e5f2] bg-white">
            <div className="flex touch-pan-y">
              {reviews.map((review, index) => <article key={review.id} role="group" aria-roledescription="slide" aria-label={(index + 1) + " of " + reviews.length} aria-hidden={selected !== index} className="min-w-0 flex-[0_0_100%] p-7 sm:p-10">
                <div className="mb-6 flex gap-1 text-[#5260aa]" aria-label={review.rating + " out of 5 stars"}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={18} aria-hidden="true" className={i < review.rating ? "fill-current" : "opacity-20"}/>)}</div>
                {review.content ? <blockquote className="whitespace-pre-line break-words font-display text-xl leading-relaxed md:text-2xl">“{review.content}”</blockquote> : <p className="text-[#636780]">This customer left a star rating.</p>}
                <div className="mt-8 flex items-center gap-3"><span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eef0ff] font-semibold text-[#51499b]">{review.name.charAt(0)}</span><div><p className="font-semibold">{review.name}</p><p className="mt-1 text-xs text-[#636780]">{google ? "Google review" : "Client testimonial"}{review.date && Number.isFinite(Date.parse(review.date)) ? " · " + new Date(review.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}</p></div></div>
              </article>)}
              {!reviews.length && <p className="p-10 text-[#636780]">Customer reviews will appear here when available.</p>}
            </div>
          </div>
          {reviews.length > 1 && <div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm text-[#636780]" aria-live={paused || reducedMotion ? "polite" : "off"}>{selected + 1} / {reviews.length}</span><div className="flex gap-2"><button type="button" aria-label="Previous testimonial" onClick={() => step(-1)} className="rounded-full border border-[#d6d9ec] bg-white p-3 hover:bg-[#eef0ff]"><ArrowLeft size={18}/></button>{!reducedMotion && <button type="button" aria-label={paused ? "Play testimonial rotation" : "Pause testimonial rotation"} onClick={() => setPaused(value => !value)} className="rounded-full border border-[#d6d9ec] bg-white p-3 hover:bg-[#eef0ff]">{paused ? <Play size={18}/> : <Pause size={18}/>}</button>}<button type="button" aria-label="Next testimonial" onClick={() => step(1)} className="rounded-full border border-[#d6d9ec] bg-white p-3 hover:bg-[#eef0ff]"><ArrowRight size={18}/></button></div></div>}
        </div>
      </div>
    </section>
  );
}
