"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShoppingBag, X, ArrowUpRight, Plus, Minus } from "lucide-react";
import { gsap } from "@/lib/gsap";
import {
  DemoDock,
  ScrollProgress,
  Reveal,
  ClipImage,
  ScrubWords,
  Headline,
  Marquee,
  HScroll,
  Img,
  u,
  useGsap,
  prefersReduced,
} from "@/components/motion/fx";

const INK = "#e5e5e5";

const LOOKS = [
  { n: "01", title: "The Structured Trench", img: u("1490481651871-ab68de25d43d"), note: "Virgin wool · Horn" },
  { n: "02", title: "Organza Bias Gown", img: u("1445205170230-053b83016050"), note: "Mulberry silk" },
  { n: "03", title: "Sculptural Leather", img: u("1469334031218-e382a71b716b"), note: "Calfskin · Cupro" },
  { n: "04", title: "Monochrome Tailoring", img: u("1509631179647-0177331693ae"), note: "Wool crêpe" },
  { n: "05", title: "Evening Noir", img: u("1515886657613-9f3515b0c78f"), note: "Duchess satin" },
];

type Product = {
  id: string;
  title: string;
  price: number;
  cat: string;
  img: string;
  alt: string;
  swatches: { name: string; hue: number; sat: number }[];
};

const PRODUCTS: Product[] = [
  { id: "trench", title: "Double-Breasted Trench", price: 1850, cat: "Outerwear", img: u("1490481651871-ab68de25d43d", 900), alt: u("1539109136881-3be0616acf4b", 900), swatches: [{ name: "Camel", hue: 0, sat: 1 }, { name: "Slate", hue: 180, sat: 0.4 }, { name: "Noir", hue: 0, sat: 0 }] },
  { id: "gown", title: "Silk Organza Gown", price: 3200, cat: "Evening", img: u("1445205170230-053b83016050", 900), alt: u("1496747611176-843222e1e57c", 900), swatches: [{ name: "Ivory", hue: 0, sat: 1 }, { name: "Rose", hue: 320, sat: 1.3 }, { name: "Onyx", hue: 0, sat: 0 }] },
  { id: "blazer", title: "Boxy Leather Blazer", price: 2400, cat: "Leather", img: u("1469334031218-e382a71b716b", 900), alt: u("1529139574466-a303027c1d8b", 900), swatches: [{ name: "Cognac", hue: 0, sat: 1 }, { name: "Olive", hue: 60, sat: 0.8 }, { name: "Ink", hue: 210, sat: 0.5 }] },
  { id: "knit", title: "Cashmere Rib Knit", price: 980, cat: "Knitwear", img: u("1515886657613-9f3515b0c78f", 900), alt: u("1485968579580-b6d095142e6e", 900), swatches: [{ name: "Oat", hue: 0, sat: 1 }, { name: "Moss", hue: 90, sat: 0.9 }, { name: "Smoke", hue: 0, sat: 0.2 }] },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

/* --------------------------- Hero ---------------------------------- */
function Hero() {
  const ref = useGsap((root) => {
    gsap.from(root.querySelectorAll(".hero-letter"), {
      yPercent: 120,
      rotate: 8,
      duration: 1.4,
      stagger: 0.06,
      ease: "expo.out",
      delay: 0.2,
    });
    // Portrait grows from a small frame into full-bleed while letters drift apart
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=140%", scrub: 0.8, pin: true },
    });
    tl.fromTo(
      root.querySelector(".hero-frame"),
      { clipPath: "inset(28% 38% 22% 38% round 999px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut" },
      0
    )
      .fromTo(root.querySelector(".hero-frame img"), { scale: 1.4 }, { scale: 1, ease: "none" }, 0)
      .to(root.querySelector(".hero-left"), { xPercent: -60, opacity: 0, ease: "none" }, 0)
      .to(root.querySelector(".hero-right"), { xPercent: 60, opacity: 0, ease: "none" }, 0)
      .fromTo(root.querySelector(".hero-caption"), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.6);
  }, []);

  const word = (w: string, cls: string) => (
    <span className={`${cls} flex overflow-hidden`}>
      {w.split("").map((c, i) => (
        <span key={i} className="hero-letter inline-block">
          {c}
        </span>
      ))}
    </span>
  );

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-[#0a0a0c]">
      <div className="hero-frame absolute inset-0 z-0">
        <Img src={u("1509631179647-0177331693ae", 2000)} alt="Maison V campaign" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-4 sm:px-10 font-display font-extrabold uppercase leading-none tracking-tighter text-white mix-blend-difference text-[18vw] sm:text-[16vw]">
        {word("MAI", "hero-left")}
        {word("SON", "hero-right")}
      </div>
      <div className="absolute bottom-10 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
        <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-300">Autumn / Winter 2026 — Collection No. 7</div>
        <div className="hero-caption max-w-sm text-sm font-light text-zinc-200">
          High-contrast silhouettes and sculptural outerwear. A study in geometry and tactile luxury.
        </div>
      </div>
    </section>
  );
}

/* ------------------------ Runway deck ------------------------------ */
function RunwayDeck() {
  const [active, setActive] = useState(0);
  const ref = useGsap((root) => {
    const cards = gsap.utils.toArray<HTMLElement>(".deck-card", root);
    cards.forEach((c, i) => gsap.set(c, { zIndex: cards.length - i, rotate: i * 2.5 - 4, y: i * 14, scale: 1 - i * 0.04 }));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: `+=${cards.length * 70}%`,
        scrub: 0.6,
        pin: true,
        onUpdate: (s) => setActive(Math.min(cards.length - 1, Math.floor(s.progress * cards.length))),
      },
    });
    cards.slice(0, -1).forEach((c, i) => {
      tl.to(c, { yPercent: -130, rotate: -18 + i * 9, x: i % 2 ? 160 : -160, opacity: 0, ease: "power2.in" }, i);
      cards.slice(i + 1).forEach((rest, j) =>
        tl.to(rest, { rotate: j * 2.5 - 4, y: j * 14, scale: 1 - j * 0.04, ease: "power2.out" }, i)
      );
    });
  }, []);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-[#f1efe9] text-black">
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 items-center px-6 sm:px-12 lg:px-20 gap-10">
        <div className="pt-24 lg:pt-0">
          <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">The Runway — scroll to walk</div>
          <div className="mt-6 font-display font-extrabold text-[22vw] lg:text-[13vw] leading-none tracking-tighter">
            {LOOKS[active].n}
          </div>
          <div className="mt-2 font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight">{LOOKS[active].title}</div>
          <div className="mt-2 text-sm text-zinc-600">{LOOKS[active].note}</div>
          <div className="mt-8 flex gap-2">
            {LOOKS.map((_, i) => (
              <span key={i} className={`h-[3px] rounded-full transition-all duration-500 ${i === active ? "w-14 bg-black" : "w-6 bg-black/20"}`} />
            ))}
          </div>
        </div>
        <div className="relative mx-auto h-[52vh] w-[70vw] max-w-[380px] lg:h-[70vh] lg:w-[26vw]">
          {LOOKS.map((l) => (
            <div key={l.n} className="deck-card absolute inset-0 overflow-hidden rounded-[2rem] bg-zinc-300 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45)]">
              <Img src={l.img} alt={l.title} className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold tracking-widest">LOOK {l.n}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------- Hover index with image trail ------------------ */
function LookIndex() {
  const box = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!preview.current) return;
    const xTo = gsap.quickTo(preview.current, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(preview.current, "y", { duration: 0.6, ease: "power3" });
    const rTo = gsap.quickTo(preview.current, "rotate", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    const move = (e: MouseEvent) => {
      const r = box.current?.getBoundingClientRect();
      if (!r) return;
      xTo(e.clientX - r.left - 140);
      yTo(e.clientY - r.top - 180);
      rTo(gsap.utils.clamp(-15, 15, (e.clientX - lastX) * 0.8));
      lastX = e.clientX;
    };
    const el = box.current;
    el?.addEventListener("mousemove", move);
    return () => el?.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative bg-[#0a0a0c] px-6 py-32 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between border-b border-white/10 pb-6">
          <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Index of Looks</div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 hidden sm:block">Hover to preview</div>
        </div>
        <div ref={box} className="relative" onMouseLeave={() => setHover(null)}>
          <div
            ref={preview}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[360px] w-[280px] overflow-hidden rounded-2xl transition-[opacity,transform] duration-300 md:block"
            style={{ opacity: hover === null ? 0 : 1, scale: hover === null ? "0.8" : "1" }}
          >
            {LOOKS.map((l, i) => (
              <Img
                key={l.n}
                src={l.img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
                style={{ opacity: hover === i ? 1 : 0, transform: hover === i ? "scale(1)" : "scale(1.2)" }}
              />
            ))}
          </div>
          {LOOKS.map((l, i) => (
            <div
              key={l.n}
              onMouseEnter={() => setHover(i)}
              className="group relative flex items-baseline justify-between border-b border-white/10 py-7 sm:py-9 transition-colors"
              data-cursor="action"
            >
              <span className="font-mono text-xs text-zinc-500">{l.n}</span>
              <span
                className={`font-display text-3xl sm:text-5xl lg:text-7xl font-extrabold uppercase tracking-tight transition-all duration-500 ${
                  hover !== null && hover !== i ? "text-white/15" : "text-white"
                } group-hover:translate-x-4`}
              >
                {l.title}
              </span>
              <span className="text-xs text-zinc-500 hidden sm:block">{l.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Shop --------------------------------- */
function ProductCard({ p, onQuick }: { p: Product; onQuick: (p: Product) => void }) {
  const [sw, setSw] = useState(0);
  const s = p.swatches[sw];
  const filter = `hue-rotate(${s.hue}deg) saturate(${s.sat})`;
  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900">
        <Img src={p.img} alt={p.title} style={{ filter }} className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0" />
        <Img src={p.alt} alt="" style={{ filter }} className="absolute inset-0 h-full w-full object-cover scale-110 opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">{p.cat}</span>
        <button
          onClick={() => onQuick(p)}
          className="absolute bottom-3 left-3 right-3 translate-y-[140%] rounded-full bg-white py-3 text-xs font-bold uppercase tracking-wider text-black transition-transform duration-500 group-hover:translate-y-0"
        >
          Quick View
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{p.title}</div>
          <div className="mt-1 text-xs text-zinc-500">{s.name}</div>
        </div>
        <div className="font-mono text-sm">€{p.price.toLocaleString()}</div>
      </div>
      <div className="mt-3 flex gap-2">
        {p.swatches.map((x, i) => (
          <button
            key={x.name}
            aria-label={x.name}
            onClick={() => setSw(i)}
            className={`h-5 w-5 rounded-full border transition-transform ${i === sw ? "scale-125 border-white" : "border-white/20"}`}
            style={{ background: `hsl(${30 + x.hue} ${Math.round(x.sat * 45)}% 45%)` }}
          />
        ))}
      </div>
    </div>
  );
}

/* --------------------- Atelier horizontal ------------------------- */
const ATELIER = [
  { k: "I", t: "Sketch", d: "Every silhouette begins as charcoal on Florentine paper.", img: u("1558769132-cb1aea458c5e", 1100) },
  { k: "II", t: "Pattern", d: "Hand-drafted blocks, graded across eleven sizes.", img: u("1434389677669-e08b4cac3105", 1100) },
  { k: "III", t: "Cut", d: "Single-ply cutting for perfect grain alignment.", img: u("1483985988355-763728e1935b", 1100) },
  { k: "IV", t: "Finish", d: "Forty hours of hand-stitching per outerwear piece.", img: u("1539109136881-3be0616acf4b", 1100) },
];

function Atelier() {
  const [p, setP] = useState(0);
  return (
    <HScroll className="h-screen bg-[#0a0a0c]" trackClassName="gap-8 pl-6 sm:pl-20 pr-[20vw]" onProgress={setP}>
      <div className="w-[80vw] sm:w-[40vw] shrink-0">
        <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">The Atelier</div>
        <h3 className="mt-4 font-display text-5xl sm:text-7xl font-extrabold uppercase leading-[0.9] tracking-tight">
          Made by
          <br />
          <span className="italic font-light text-zinc-500">hand,</span>
          <br />
          slowly.
        </h3>
        <div className="mt-10 h-px w-full bg-white/10">
          <div className="h-full origin-left bg-white" style={{ transform: `scaleX(${p})` }} />
        </div>
      </div>
      {ATELIER.map((a, i) => (
        <div key={a.k} className={`relative h-[70vh] w-[80vw] sm:w-[34vw] shrink-0 overflow-hidden rounded-3xl ${i % 2 ? "mt-24" : "-mt-24"}`}>
          <Img src={a.img} alt={a.t} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="font-display text-7xl font-extrabold text-white/20">{a.k}</div>
            <div className="font-display text-3xl font-bold uppercase">{a.t}</div>
            <p className="mt-2 max-w-xs text-sm text-zinc-300">{a.d}</p>
          </div>
        </div>
      ))}
    </HScroll>
  );
}

/* --------------------- Parallax editorial ------------------------- */
function Editorial() {
  const ref = useGsap((root) => {
    gsap.utils.toArray<HTMLElement>(".ed-col", root).forEach((col, i) => {
      gsap.fromTo(col, { yPercent: [10, -12, 18][i] }, {
        yPercent: [-18, 12, -24][i],
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }, []);
  const cols = [
    [u("1496747611176-843222e1e57c", 700), u("1485968579580-b6d095142e6e", 700)],
    [u("1529139574466-a303027c1d8b", 700), u("1515886657613-9f3515b0c78f", 700)],
    [u("1539109136881-3be0616acf4b", 700), u("1509631179647-0177331693ae", 700)],
  ];
  return (
    <section ref={ref} className="relative overflow-hidden bg-[#f1efe9] py-40 text-black">
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <h3 className="font-display text-[14vw] font-extrabold uppercase leading-none tracking-tighter text-black mix-blend-difference invert">
          Editorial
        </h3>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 sm:gap-8 px-4">
        {cols.map((c, i) => (
          <div key={i} className="ed-col flex flex-col gap-4 sm:gap-8">
            {c.map((src) => (
              <div key={src} className="aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl">
                <Img src={src} alt="Editorial" className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================ Page ================================ */
export const FashionDemo: React.FC = () => {
  const [bag, setBag] = useState<{ p: Product; size: string; qty: number }[]>([]);
  const [quick, setQuick] = useState<Product | null>(null);
  const [size, setSize] = useState("M");
  const [bagOpen, setBagOpen] = useState(false);
  const bagBtn = useRef<HTMLButtonElement>(null);
  const bagCount = bag.reduce((a, b) => a + b.qty, 0);

  const flyToBag = (from: HTMLElement, img: string) => {
    if (!bagBtn.current || prefersReduced()) return;
    const a = from.getBoundingClientRect();
    const b = bagBtn.current.getBoundingClientRect();
    const dot = document.createElement("div");
    Object.assign(dot.style, {
      position: "fixed", left: `${a.left + a.width / 2 - 40}px`, top: `${a.top - 40}px`, width: "80px", height: "100px",
      borderRadius: "14px", backgroundImage: `url(${img})`, backgroundSize: "cover", zIndex: "999", pointerEvents: "none",
    });
    document.body.appendChild(dot);
    gsap.to(dot, {
      left: b.left + b.width / 2 - 10, top: b.top + b.height / 2 - 10, width: 20, height: 20, borderRadius: 999, rotate: 360,
      duration: 0.9, ease: "power3.inOut",
      onComplete: () => {
        dot.remove();
        gsap.fromTo(bagBtn.current, { scale: 1.3 }, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.4)" });
      },
    });
  };

  const add = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!quick) return;
    flyToBag(e.currentTarget, quick.img);
    setBag((b) => {
      const i = b.findIndex((x) => x.p.id === quick.id && x.size === size);
      if (i >= 0) return b.map((x, j) => (j === i ? { ...x, qty: x.qty + 1 } : x));
      return [...b, { p: quick, size, qty: 1 }];
    });
    setTimeout(() => setQuick(null), 250);
  };

  const total = bag.reduce((a, b) => a + b.p.price * b.qty, 0);

  return (
    <div className="relative w-full bg-[#0a0a0c] text-white selection:bg-white selection:text-black">
      <ScrollProgress color={INK} />
      <DemoDock
        label="Maison V — Editorial Commerce"
        accent={INK}
        right={
          <button
            ref={bagBtn}
            onClick={() => setBagOpen(true)}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-xl"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Bag ({bagCount})
          </button>
        }
      />

      <Hero />

      <Marquee
        className="border-y border-white/10 bg-white py-5 text-black"
        itemClassName="px-8 font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight"
        items={["New Arrivals", "✦", "AW26 Runway", "✦", "Made in Florence", "✦", "Complimentary Tailoring", "✦"]}
      />

      <section className="px-6 py-32 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Manifesto</div>
          <ScrubWords
            className="mt-8 font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
            text="We cut garments the way architects draw buildings — every seam load-bearing, every fold intentional, nothing decorative that does not also hold."
          />
        </div>
      </section>

      <RunwayDeck />
      <LookIndex />

      {/* Shop grid */}
      <section className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <Headline lines={["Shop the", "Collection"]} className="font-display text-5xl sm:text-7xl font-extrabold uppercase leading-[0.9] tracking-tight" />
            <p className="max-w-xs text-sm text-zinc-400">Tap a swatch to re-dye the garment live. Hover for the alternate angle.</p>
          </div>
          <Reveal each className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} p={p} onQuick={(x) => { setQuick(x); setSize("M"); }} />
            ))}
          </Reveal>
        </div>
      </section>

      <Atelier />
      <Editorial />

      {/* Campaign full-bleed clip reveal */}
      <section className="px-4 py-24 sm:px-10">
        <ClipImage src={u("1529139574466-a303027c1d8b", 2000)} alt="Campaign" from="circle" scrub className="h-[80vh] w-full rounded-3xl">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-[11px] uppercase tracking-[0.3em]">The Campaign Film</div>
            <div className="mt-4 font-display text-5xl sm:text-8xl font-extrabold uppercase tracking-tighter">Noir Season</div>
          </div>
        </ClipImage>
      </section>

      {/* Footer / newsletter */}
      <footer className="border-t border-white/10 px-6 pt-24 pb-10 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Private Client List</div>
            <h4 className="mt-4 font-display text-4xl sm:text-5xl font-bold">First access to every drop.</h4>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex items-end gap-3 border-b border-white/30 pb-3 self-end">
            <input placeholder="your@email.com" className="flex-1 bg-transparent text-lg outline-none placeholder:text-zinc-600" />
            <button className="rounded-full bg-white p-3 text-black"><ArrowUpRight className="h-5 w-5" /></button>
          </form>
        </div>
        <div className="mt-24 font-display text-[22vw] font-extrabold uppercase leading-[0.75] tracking-tighter text-white/[0.06] select-none">Maison V</div>
      </footer>

      {/* Quick view drawer */}
      <div className={`fixed inset-0 z-[70] transition-opacity duration-500 ${quick ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setQuick(null)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-3xl bg-[#f1efe9] text-black transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${quick ? "translate-x-0" : "translate-x-full"}`}>
          {quick && (
            <div className="grid h-full grid-cols-1 sm:grid-cols-2">
              <div className="relative hidden sm:block"><Img src={quick.img} alt={quick.title} className="absolute inset-0 h-full w-full object-cover" /></div>
              <div className="flex flex-col p-8 overflow-y-auto">
                <button onClick={() => setQuick(null)} className="self-end rounded-full border border-black/20 p-2" aria-label="Close"><X className="h-4 w-4" /></button>
                <div className="mt-8 text-[11px] uppercase tracking-[0.3em] text-zinc-500">{quick.cat}</div>
                <h3 className="mt-2 font-display text-3xl font-bold">{quick.title}</h3>
                <div className="mt-2 font-mono text-lg">€{quick.price.toLocaleString()}</div>
                <p className="mt-6 text-sm text-zinc-600 leading-relaxed">Cut in Florence from deadstock Italian cloth. Fully canvassed, with hand-finished buttonholes and a cupro lining. Complimentary alterations within 60 days.</p>
                <div className="mt-8 text-xs font-bold uppercase tracking-widest">Size</div>
                <div className="mt-3 flex gap-2">
                  {SIZES.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`h-11 w-11 rounded-full border text-xs font-bold transition-all ${s === size ? "bg-black text-white border-black" : "border-black/20 hover:border-black"}`}>{s}</button>
                  ))}
                </div>
                <button onClick={add} className="mt-auto rounded-full bg-black py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-zinc-800 transition-colors">
                  Add to Bag — {size}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bag drawer */}
      <div className={`fixed inset-0 z-[70] transition-opacity duration-500 ${bagOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-black/70" onClick={() => setBagOpen(false)} />
        <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#0f0f11] p-8 transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${bagOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-bold">Your Bag</h3>
            <button onClick={() => setBagOpen(false)} aria-label="Close bag"><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-8 flex-1 space-y-5 overflow-y-auto">
            {bag.length === 0 && <p className="text-sm text-zinc-500">Your bag is empty. Open Quick View on any piece to add it.</p>}
            {bag.map((b, i) => (
              <div key={i} className="flex gap-4">
                <Img src={b.p.img} alt="" className="h-24 w-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{b.p.title}</div>
                  <div className="text-xs text-zinc-500">Size {b.size}</div>
                  <div className="mt-3 flex items-center gap-3">
                    <button aria-label="Decrease" onClick={() => setBag((x) => x.flatMap((y, j) => (j === i ? (y.qty > 1 ? [{ ...y, qty: y.qty - 1 }] : []) : [y])))}><Minus className="h-3.5 w-3.5" /></button>
                    <span className="font-mono text-sm">{b.qty}</span>
                    <button aria-label="Increase" onClick={() => setBag((x) => x.map((y, j) => (j === i ? { ...y, qty: y.qty + 1 } : y)))}><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="font-mono text-sm">€{(b.p.price * b.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-mono">€{total.toLocaleString()}</span></div>
            <button className="mt-6 w-full rounded-full bg-white py-4 text-xs font-bold uppercase tracking-widest text-black">Checkout (demo)</button>
          </div>
        </aside>
      </div>
    </div>
  );
};
