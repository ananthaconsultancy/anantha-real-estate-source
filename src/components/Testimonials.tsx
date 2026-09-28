import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react";

type Review = { id: string; name: string; content: string; rating: number };
const reviews: Review[] = [
  { id: "google-ram-babu", name: "ram babu", content: "From the beginning of my house-buying journey, Anatha Real Estate Consultancy supported me with professionalism and care. Their team helped me find the best options for lands, apartments, and individual houses according to my needs and budget. The entire process was smooth, transparent, and stress-free because of their trustworthy and customer-friendly approach. I truly appreciate their dedication, guidance, and excellent support until the final handover. Thanks to Anatha Real Estate, my dream of owning a perfect home became a reality, and I highly recommend them to anyone looking for their dream property.", rating: 5 },
  { id: "google-mahesh-dema", name: "Mahesh Dema", content: "Anantha Real Estate We had a very good experience with the house consultancy of Anantha Real estate . They guided us clearly throughout the process and helped us choose the right property based on our budget and requirements. Their communication was professional and transparent. Highly recommended.with Anantha Real Estate", rating: 5 },
  { id: "google-bandaru-saisree", name: "Bandaru Saisree", content: "\"We have a very good experience with Anantha real estate. They were highly responsive and, as first-time buyers, we really appreciated their patience and expert knowledge in navigating the market. They helped us find a fantastic home within our budget. Highly recommend!\"", rating: 5 },
  { id: "google-chramakirshna-coins", name: "Chramakirshna Coins", content: "ధన్యవాదాలు విజయ్ కుమార్ గారికి మీ చేతి రాశి మీరు ఇప్పించిన ఇల్లు మేము తీసుకున్న వేళా విశేషం చాలా బాగుంది ఇది కొన్న సంవత్సరానికి మళ్లీ ఇంకొక ప్రాపర్టీ కూడా మీ చేతులు గుండానే తీసుకున్నాను మాకు ఎంతో ఆనందంగా ఉంది మాలాగా పదిమందికి మీ చేతులు గుండా ఇప్పించండి వాళ్లు ఆనందంగా సంతోషంగా నీ పేరు చెప్పుకొని పదిమంది ఆనందం వారి సంతోషం నీకు ఆశీస్సులు అవ్వను నీకు వ్యాపారం పెరగాలి మాకు మొట్టమొదటి ఇప్పించిన ఇల్లు ఫోటో", rating: 5 },
  { id: "google-raviteja-chitteti", name: "RAVITEJA CHITTETI", content: "From childhood we have a dream to buy a house. But after visiting Antha real-estate consultancy my dream came true which fulfilled my dreams. Whatever you want to buy like lands, apartments, individual houses consult Anatha real-estate from thereon no need worrie untill you will get the keys of your own house with all\n>> Consult Anatha real-estate consultancy make your own house dreams fulfill.", rating: 5 },
  { id: "google-prasad-cherukuru", name: "prasad cherukuru", content: "మాకు మీరు తిసిఇచ్చిన ఇల్లు బాగుంది నా తరుపున ఏమైనా కొనటం కానీ అమ్మటం కాని ఉంటే మీకే చెప్తాను అన్న.All the from ur new beginnings", rating: 5 },
  { id: "google-ramamohan-gandikota", name: "Ramamohan Gandikota", content: "Quiet Good", rating: 5 },
];

export default function Testimonials() {
  const [viewport, carousel] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
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
    if (!carousel || paused || hovered || reducedMotion) return;
    const timer = window.setInterval(() => carousel.scrollNext(), 7000);
    return () => window.clearInterval(timer);
  }, [carousel, paused, hovered, reducedMotion]);

  const step = (direction: number) => {
    setPaused(true);
    direction < 0 ? carousel?.scrollPrev() : carousel?.scrollNext();
  };

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-[#f5f6fc] py-20 text-[#303058] md:py-28">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-[#5260aa]">Google reviews</p>
          <h2 id="testimonials-title" className="max-w-lg font-display text-3xl font-semibold leading-tight md:text-5xl">The relationship matters as much as the transaction.</h2>
          <p className="mt-6 max-w-md leading-7 text-[#636780]">Verified feedback from customers of Anantha Real Estate.</p>
          <div className="mt-6 text-sm"><p className="font-semibold">5.0 / 5 · 11 Google reviews</p><p className="mt-2 text-[#636780]">Customer feedback from Anantha’s Google Business Profile</p></div>
        </div>
        <div role="region" aria-roledescription="carousel" aria-label="Google customer reviews" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPaused(true)} onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); step(event.key === "ArrowLeft" ? -1 : 1); } }} className="min-w-0">
          <div ref={viewport} className="overflow-hidden rounded-2xl border border-[#e3e5f2] bg-white">
            <div className="flex touch-pan-y">
              {reviews.map((review, index) => <article key={review.id} role="group" aria-roledescription="slide" aria-label={(index + 1) + " of " + reviews.length} aria-hidden={selected !== index} className="min-w-0 flex-[0_0_100%] p-7 sm:p-10">
                <div className="mb-6 flex gap-1 text-[#5260aa]" aria-label={review.rating + " out of 5 stars"}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={18} aria-hidden="true" className={i < review.rating ? "fill-current" : "opacity-20"} />)}</div>
                <blockquote className="whitespace-pre-line break-words font-display text-xl leading-relaxed md:text-2xl">“{review.content}”</blockquote>
                <div className="mt-8 flex items-center gap-3"><span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eef0ff] font-semibold text-[#51499b]">{review.name.charAt(0)}</span><div><p className="font-semibold">{review.name}</p><p className="mt-1 text-xs text-[#636780]">Google review</p></div></div>
              </article>)}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm text-[#636780]" aria-live={paused || reducedMotion ? "polite" : "off"}>{selected + 1} / {reviews.length}</span><div className="flex gap-2"><button type="button" aria-label="Previous testimonial" onClick={() => step(-1)} className="rounded-full border border-[#d6d9ec] bg-white p-3 hover:bg-[#eef0ff]"><ArrowLeft size={18}/></button>{!reducedMotion && <button type="button" aria-label={paused ? "Play testimonial rotation" : "Pause testimonial rotation"} onClick={() => setPaused(value => !value)} className="rounded-full border border-[#d6d9ec] bg-white p-3 hover:bg-[#eef0ff]">{paused ? <Play size={18}/> : <Pause size={18}/>}</button>}<button type="button" aria-label="Next testimonial" onClick={() => step(1)} className="rounded-full border border-[#d6d9ec] bg-white p-3 hover:bg-[#eef0ff]"><ArrowRight size={18}/></button></div></div>
        </div>
      </div>
    </section>
  );
}
