"use client";

/**
 * Signature scroll moments for the L'Etoile Noir demo:
 * deconstructed-dish assembly, candle-lit room, scroll-poured wine, chef timeline.
 */
import React, { useEffect, useRef, useState } from "react";
import { Flame, Wine } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ClipImage, Headline, HScroll, Marquee, ScrubWords, Img, u, useGsap, prefersReduced } from "@/components/motion/fx";

const GOLD = "#d4af37";

/* -------- Deconstructed dish: ingredients orbit in and land on the plate -------- */
const INGREDIENTS = [
  { t: "A5 Miyazaki Wagyu", s: "Kagoshima, Japan", x: -38, y: -30 },
  { t: "Périgord Truffle", s: "Shaved tableside", x: 36, y: -34 },
  { t: "Morel Mushrooms", s: "Charred in beef fat", x: -42, y: 22 },
  { t: "Pomme Mousseline", s: "50% Normandy butter", x: 40, y: 26 },
  { t: "Bordelaise Jus", s: "Reduced 72 hours", x: 0, y: 44 },
];

function DeconstructedDish() {
  const [stage, setStage] = useState(0);
  const ref = useGsap((root) => {
    const chips = gsap.utils.toArray<HTMLElement>(".ing", root);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=220%",
        pin: true,
        scrub: 0.7,
        onUpdate: (s) => setStage(Math.min(INGREDIENTS.length, Math.floor(s.progress * (INGREDIENTS.length + 1)))),
      },
    });
    tl.fromTo(root.querySelector(".plate"), { rotate: -90, scale: 0.6 }, { rotate: 0, scale: 1, ease: "power2.out", duration: 1 }, 0);
    chips.forEach((c, i) => {
      tl.fromTo(
        c,
        { xPercent: INGREDIENTS[i].x * 6, yPercent: INGREDIENTS[i].y * 6, opacity: 0, scale: 1.4 },
        { xPercent: INGREDIENTS[i].x * 2.2, yPercent: INGREDIENTS[i].y * 2.6, opacity: 1, scale: 1, ease: "power3.out", duration: 1 },
        0.4 + i * 0.5
      );
    });
    tl.to(root.querySelector(".plate-glow"), { opacity: 1, scale: 1.2, duration: 1 }, 2.8);
  }, []);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-[#080204]">
      <div className="absolute left-6 top-28 z-20 sm:left-12 lg:left-20">
        <div className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>Plat principal · Deconstructed</div>
        <h3 className="mt-3 font-serif text-4xl sm:text-6xl">
          Five elements,
          <br />
          <span className="italic text-gradient-gold">one bite.</span>
        </h3>
        <div className="mt-6 font-mono text-xs text-zinc-500">{stage}/{INGREDIENTS.length} elements plated</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="plate-glow absolute h-[60vmin] w-[60vmin] rounded-full opacity-0 blur-3xl" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.35), transparent 70%)" }} />
        <div className="plate relative h-[46vmin] w-[46vmin] overflow-hidden rounded-full border-[10px] border-[#1b1214] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.9)]">
          <Img src={u("1544025162-d76694265947", 1200)} alt="A5 Wagyu tenderloin" className="h-full w-full object-cover" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]" />
        </div>
        {INGREDIENTS.map((g) => (
          <div key={g.t} className="ing absolute z-10 rounded-2xl border border-accent-gold/30 bg-black/70 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />{g.t}</div>
            <div className="text-[11px] text-zinc-400">{g.s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------ Candle-lit room: cursor is the light ------------------ */
function CandleRoom() {
  const box = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 50, y: 55 });
  const flick = useRef(1);
  useEffect(() => {
    if (prefersReduced()) return;
    const id = setInterval(() => {
      flick.current = 0.92 + Math.random() * 0.12;
      box.current?.style.setProperty("--r", `${260 * flick.current}px`);
    }, 120);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="px-4 py-24 sm:px-10">
      <div
        ref={box}
        onMouseMove={(e) => {
          const r = box.current!.getBoundingClientRect();
          setP({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        className="relative mx-auto h-[85vh] max-w-7xl cursor-none overflow-hidden rounded-[2rem]"
        data-cursor="hide"
      >
        <Img src={u("1517248135467-4c7edcad34c4", 2000)} alt="Dining room" className="absolute inset-0 h-full w-full object-cover brightness-[0.12] saturate-50" />
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `radial-gradient(var(--r,260px) circle at ${p.x}% ${p.y}%, black 0%, transparent 70%)`,
            maskImage: `radial-gradient(var(--r,260px) circle at ${p.x}% ${p.y}%, black 0%, transparent 70%)`,
          }}
        >
          <Img src={u("1517248135467-4c7edcad34c4", 2000)} alt="" className="absolute inset-0 h-full w-full object-cover sepia-[.25] saturate-150" />
        </div>
        <div className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <Flame className="h-6 w-6 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse" />
        </div>
        <div className="pointer-events-none absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>The dining room after dark</div>
            <div className="mt-2 font-serif text-4xl sm:text-6xl">Twelve tables. <span className="italic">Candlelight only.</span></div>
          </div>
          <div className="text-xs text-zinc-400">Move your cursor — you are the candle.</div>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Wine pours as you scroll --------------------- */
const PAIRINGS = [
  { course: "Amuse", wine: "Dom Pérignon 2013", note: "Brioche, citrus pith, chalk." , color: "#f3e5ab" },
  { course: "Langoustine", wine: "Meursault 2019", note: "Hazelnut, lemon curd, flint.", color: "#e9c46a" },
  { course: "Wagyu", wine: "Château Margaux 2015", note: "Cassis, violet, cedar box.", color: "#6b0f1a" },
];

function WinePour() {
  const [fill, setFill] = useState(0);
  const ref = useGsap((root) => {
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "+=200%", pin: true, scrub: 0.6, onUpdate: (s) => setFill(s.progress) } });
  }, []);
  const idx = Math.min(PAIRINGS.length - 1, Math.floor(fill * PAIRINGS.length));
  const w = PAIRINGS[idx];
  // Each pairing gets its own pour: the glass refills from empty for every course.
  const pour = Math.min(1, fill * PAIRINGS.length - idx);
  const level = 170 - pour * 110;
  return (
    <section ref={ref} className="relative flex h-screen items-center overflow-hidden bg-gradient-to-b from-[#080204] to-[#16040a] px-6 sm:px-12 lg:px-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}><Wine className="h-4 w-4" />Sommelier pairing</div>
          <div key={idx} className="mt-6 animate-[fadeUp_.6s_ease-out]">
            <div className="font-mono text-xs text-zinc-500">Course {idx + 1} — {w.course}</div>
            <div className="mt-2 font-serif text-5xl sm:text-6xl">{w.wine}</div>
            <p className="mt-4 text-lg italic text-zinc-300">{w.note}</p>
          </div>
          <div className="mt-10 flex gap-3">
            {PAIRINGS.map((x, i) => (
              <span key={x.wine} className="h-1 flex-1 rounded-full transition-colors duration-500" style={{ background: i <= idx ? GOLD : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <svg viewBox="0 0 200 320" className="h-[60vh] max-h-[520px]">
            <defs>
              <clipPath id="bowl">
                <path d="M40 20 Q30 140 100 170 Q170 140 160 20 Z" />
              </clipPath>
              <linearGradient id="shine" x1="0" x2="1">
                <stop offset="0" stopColor="white" stopOpacity="0.25" />
                <stop offset="0.3" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g clipPath="url(#bowl)">
              <rect x="0" y={level} width="200" height="200" fill={w.color} style={{ transition: "fill .8s" }} />
              <path d={`M0 ${level} Q50 ${level - 6} 100 ${level} T200 ${level} V${level + 8} H0 Z`} fill="white" opacity=".15">
                <animateTransform attributeName="transform" type="translate" values="0 0;-30 0;0 0" dur="3s" repeatCount="indefinite" />
              </path>
            </g>
            <path d="M40 20 Q30 140 100 170 Q170 140 160 20" fill="url(#shine)" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
            <path d="M100 170 V285 M60 295 Q100 280 140 295" stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}

/* ------------------------- Chef timeline ---------------------------- */
const CHEF = [
  { y: "2004", t: "Paris", d: "Commis at Le Grand Véfour, peeling 40kg of shallots a day.", img: u("1577219491135-ce391730fb2c", 900) },
  { y: "2011", t: "Kyoto", d: "Three years under a kaiseki master learning restraint.", img: u("1414235077428-338989a2e8c0", 900) },
  { y: "2017", t: "First star", d: "L'Etoile Noir opens with 12 tables and no à la carte.", img: u("1550966871-3ed3cdb5ed0c", 900) },
  { y: "2024", t: "Third star", d: "One of 142 restaurants in the world with three Michelin stars.", img: u("1559339352-11d035aa65de", 900) },
];

function ChefTimeline() {
  return (
    <HScroll className="h-screen bg-[#0c0306]" trackClassName="gap-10 pl-6 sm:pl-20 pr-[15vw]">
      <div className="w-[80vw] sm:w-[36vw] shrink-0">
        <div className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>Chef Aurélien Noir</div>
        <h3 className="mt-4 font-serif text-5xl sm:text-7xl leading-[0.95]">Twenty years <span className="italic text-gradient-gold">to one menu.</span></h3>
      </div>
      {CHEF.map((c, i) => (
        <div key={c.y} className="flex w-[75vw] sm:w-[30vw] shrink-0 flex-col">
          <div className="font-serif text-8xl text-white/10">{c.y}</div>
          <div className={`relative overflow-hidden rounded-3xl ${i % 2 ? "h-[42vh]" : "h-[52vh]"}`}>
            <Img src={c.img} alt={c.t} className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 font-serif text-2xl">{c.t}</div>
          <p className="mt-1 text-sm text-zinc-400">{c.d}</p>
        </div>
      ))}
    </HScroll>
  );
}

/* ============================ Export ================================ */
export const RestaurantExtras: React.FC<{ onReserve: () => void }> = ({ onReserve }) => (
  <>
    <Marquee
      className="border-y border-accent-gold/20 bg-[#0c0306] py-5"
      itemClassName="px-10 font-serif text-2xl italic text-accent-gold/70"
      items={["★★★ Guide Michelin", "·", "World's 50 Best — No. 14", "·", "Gault & Millau 19/20", "·", "La Liste 98 pts", "·"]}
    />
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <ScrubWords className="font-serif text-3xl sm:text-5xl leading-[1.25]" text="We source from eleven farms within a day's drive and change the menu the morning the produce arrives. Nothing is frozen. Nothing is rushed." />
      </div>
    </section>
    <DeconstructedDish />
    <CandleRoom />
    <WinePour />
    <ChefTimeline />
    <section className="px-4 py-24 sm:px-10">
      <ClipImage src={u("1414235077428-338989a2e8c0", 2000)} alt="Dessert course" from="circle" scrub className="h-[75vh] rounded-[2rem]">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <Headline lines={["Your table", "is waiting."]} className="font-serif text-5xl sm:text-8xl leading-[0.95]" />
          <MagneticButton strength={0.35} className="mt-10">
            <button onClick={onReserve} className="rounded-full bg-accent-gold px-8 py-4 text-xs font-bold uppercase tracking-widest text-black">Reserve tonight</button>
          </MagneticButton>
        </div>
      </ClipImage>
    </section>
  </>
);
