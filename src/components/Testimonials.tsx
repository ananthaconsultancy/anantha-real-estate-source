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
  const [viewport, carousel] = useEmblaCarousel({ loop: true, align: "center", slidesToScroll: 1 });
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
    <section id="testimonials" aria-label="Google customer reviews" className="overflow-hidden bg-gradient-to-br from-[#087fc3] via-[#2766b3] to-[#51499b] py-20 text-white md:py-28">
      <div role="region" aria-roledescription="carousel" aria-label="Google customer reviews" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPaused(true)} onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); step(event.key === "ArrowLeft" ? -1 : 1); } }} className="mx-auto max-w-6xl px-0 sm:px-4">
        <div ref={viewport} className="overflow-hidden py-6">
          <div className="flex touch-pan-y items-center">
            {reviews.map((review, index) => {
              const active = selected === index;
              return <article key={review.id} role="group" aria-roledescription="slide" aria-label={(index + 1) + " of " + reviews.length} aria-hidden={!active} className={"min-w-0 flex-[0_0_82%] px-2 transition-all duration-500 sm:flex-[0_0_60%] sm:px-5 " + (active ? "scale-100 opacity-100" : "scale-90 opacity-45")}>
                <div className="flex min-h-[360px] flex-col rounded-2xl bg-white px-7 py-9 text-center text-[#303058] shadow-2xl shadow-[#18306b]/30 sm:min-h-[385px] sm:px-10 sm:py-11">
                  <span aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#12a6dc] to-[#6654af] text-lg font-bold text-white shadow-md">{review.name.charAt(0)}</span>
                  <blockquote className="my-auto whitespace-pre-line break-words font-display text-base leading-7 sm:text-lg sm:leading-8">“{review.content}”</blockquote>
                  <div className="mt-7">
                    <p className="font-semibold">{review.name}</p>
                    <div className="mt-2 flex justify-center gap-1 text-[#296db8]" aria-label={review.rating + " out of 5 stars"}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} aria-hidden="true" className={i < review.rating ? "fill-current" : "opacity-20"} />)}</div>
                  </div>
                </div>
              </article>;
            })}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" aria-label="Previous testimonial" onClick={() => step(-1)} className="rounded-full border border-white/45 bg-white/10 p-3 text-white transition hover:bg-white/20"><ArrowLeft size={18}/></button>
          {!reducedMotion && <button type="button" aria-label={paused ? "Play testimonial rotation" : "Pause testimonial rotation"} onClick={() => setPaused(value => !value)} className="rounded-full border border-white/45 bg-white/10 p-3 text-white transition hover:bg-white/20">{paused ? <Play size={18}/> : <Pause size={18}/>}</button>}
          <button type="button" aria-label="Next testimonial" onClick={() => step(1)} className="rounded-full border border-white/45 bg-white/10 p-3 text-white transition hover:bg-white/20"><ArrowRight size={18}/></button>
        </div>
      </div>
    </section>
  );
}
