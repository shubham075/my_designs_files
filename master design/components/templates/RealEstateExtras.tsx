"use client";

/**
 * Signature scroll moments for the Aura Estates demo:
 * day-to-night pin, zoom-parallax tour, interactive floor plan, mortgage calc, neighbourhood map.
 */
import React, { useState } from "react";
import { Sun, Moon, MapPin, Coffee, Trees, GraduationCap, Waves, ShoppingBag } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { Headline, Marquee, ScrubWords, Img, u, useGsap } from "@/components/motion/fx";

/* ------------------- Day → night as you scroll -------------------- */
function DayToNight() {
  const [p, setP] = useState(0);
  const ref = useGsap((root) => {
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "+=200%", pin: true, scrub: 0.6, onUpdate: (s) => setP(s.progress) } });
  }, []);
  const hour = 6 + p * 16; // 06:00 → 22:00
  const hh = Math.floor(hour);
  const mm = Math.floor((hour - hh) * 60);
  const dusk = Math.max(0, (p - 0.45) / 0.55); // 0 during the day, 1 at night
  const golden = Math.max(0, 1 - Math.abs(p - 0.6) / 0.2);
  const angle = Math.PI * (1 - p); // sun travels across the arc
  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-black text-white">
      <Img
        src={u("1613490493576-7fde63acd811", 2200)}
        alt="Residence exterior"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: `brightness(${1 - dusk * 0.7}) saturate(${1 + golden * 0.5 - dusk * 0.4}) hue-rotate(${dusk * -15}deg)` }}
      />
      <div className="absolute inset-0 mix-blend-soft-light" style={{ background: "linear-gradient(180deg,#ff9a3c,#ff5e62)", opacity: golden * 0.7 }} />
      <div className="absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(180deg,#0b1d4a,#1c2a52)", opacity: dusk * 0.85 }} />
      {/* Interior lights switch on at dusk */}
      {[
        { l: "30%", t: "52%", s: 180 },
        { l: "55%", t: "58%", s: 220 },
        { l: "72%", t: "50%", s: 160 },
      ].map((g, i) => (
        <div key={i} className="absolute rounded-full mix-blend-screen blur-2xl" style={{ left: g.l, top: g.t, width: g.s, height: g.s * 0.6, background: "#ffb347", opacity: Math.max(0, dusk - 0.25 - i * 0.08) * 1.2 }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      {/* Sun / moon arc */}
      <svg className="absolute right-6 top-24 h-32 w-64 sm:right-16" viewBox="0 0 260 130">
        <path d="M10 125 A120 120 0 0 1 250 125" stroke="rgba(255,255,255,0.3)" strokeDasharray="4 6" fill="none" />
        <circle cx={130 + Math.cos(angle) * 120} cy={125 - Math.sin(angle) * 115} r="9" fill={dusk > 0.6 ? "#e5e7eb" : "#fcd34d"} style={{ filter: `drop-shadow(0 0 12px ${dusk > 0.6 ? "#fff" : "#fbbf24"})` }} />
      </svg>
      <div className="absolute right-6 top-60 font-mono text-4xl tabular-nums sm:right-16">{String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}</div>
      <div className="absolute bottom-12 left-6 right-6 sm:left-12 lg:left-20">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">
          {dusk > 0.5 ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} A day at the Bel-Air Pavilion
        </div>
        <h3 className="mt-3 font-serif text-5xl sm:text-7xl leading-[0.95]">
          {dusk < 0.2 ? "Morning light, east terrace." : dusk < 0.6 ? "Golden hour, west lawn." : "Evening, every room aglow."}
        </h3>
        <p className="mt-3 text-sm text-white/70">Scroll to move the sun. Orientation designed by Kappe &amp; Associates for 11 hours of direct light.</p>
      </div>
    </section>
  );
}

/* ------------- Zoom parallax: centre image grows to full-bleed ---------- */
const TOUR = [
  u("1600566753190-17f0baa2a6c3", 1400),
  u("1600210492486-724fe5c67fb0", 900),
  u("1616594039964-ae9021a400a0", 900),
  u("1600566753086-00f18fb6b3ea", 900),
  u("1600585154340-be6161a56a0c", 900),
  u("1600607687939-ce8a6c25118c", 900),
  u("1512917774080-9991f1c4c750", 900),
];
const POS = [
  "left-[37.5%] top-[30%] w-[25%] h-[40%]",
  "left-[8%] top-[10%] w-[24%] h-[30%]",
  "left-[68%] top-[8%] w-[22%] h-[34%]",
  "left-[5%] top-[58%] w-[26%] h-[32%]",
  "left-[70%] top-[55%] w-[25%] h-[36%]",
  "left-[38%] top-[4%] w-[18%] h-[20%]",
  "left-[40%] top-[76%] w-[20%] h-[20%]",
];

function ZoomTour() {
  const ref = useGsap((root) => {
    const items = gsap.utils.toArray<HTMLElement>(".zt", root);
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "+=200%", pin: true, scrub: 0.6 } });
    items.forEach((el, i) => {
      // Each full-screen wrapper scales from the screen centre, so satellites fly outward
      // while the centred hero image grows to fill the viewport.
      tl.to(el, { scale: i === 0 ? 4 : 2.6 + i * 0.5, ease: "power1.in" }, 0);
    });
    tl.fromTo(root.querySelector(".zt-caption"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.7);
  }, []);
  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-[#F4F1EA]">
      {TOUR.map((src, i) => (
        <div key={src} className="zt absolute inset-0 will-change-transform" style={{ zIndex: i === 0 ? 2 : 1 }}>
          <div className={`absolute overflow-hidden rounded-xl ${POS[i]}`}>
            <Img src={src} alt="Interior" className="h-full w-full object-cover" />
          </div>
        </div>
      ))}
      <div className="zt-caption absolute inset-x-0 bottom-12 z-10 text-center text-white drop-shadow-lg">
        <div className="text-[11px] font-bold uppercase tracking-[0.3em]">Step inside</div>
        <div className="mt-2 font-serif text-5xl sm:text-7xl">The great room</div>
      </div>
    </section>
  );
}

/* ------------------------- Floor plan ------------------------------ */
const ROOMS = [
  { id: "living", n: "Great Room", d: "42' × 28'", x: 20, y: 20, w: 300, h: 180, img: u("1600210492486-724fe5c67fb0", 900), note: "Retractable 40' glass wall to the infinity pool." },
  { id: "kitchen", n: "Chef's Kitchen", d: "24' × 18'", x: 330, y: 20, w: 170, h: 120, img: u("1600566753086-00f18fb6b3ea", 900), note: "Gaggenau suite, butler's pantry, wine wall for 600." },
  { id: "dining", n: "Dining", d: "20' × 16'", x: 330, y: 150, w: 170, h: 100, img: u("1600566753190-17f0baa2a6c3", 900), note: "Seats 14 beneath a hand-blown glass chandelier." },
  { id: "primary", n: "Primary Suite", d: "30' × 22'", x: 20, y: 210, w: 200, h: 170, img: u("1616594039964-ae9021a400a0", 900), note: "Dual dressing rooms and a private garden courtyard." },
  { id: "spa", n: "Spa Bath", d: "18' × 14'", x: 230, y: 260, w: 120, h: 120, img: u("1600607687939-ce8a6c25118c", 900), note: "Steam, sauna, and a carved travertine soaking tub." },
  { id: "terrace", n: "Terrace", d: "60' × 18'", x: 360, y: 260, w: 140, h: 120, img: u("1600596542815-ffad4c1539a9", 900), note: "Outdoor kitchen with views from downtown to the Pacific." },
];

function FloorPlan() {
  const [r, setR] = useState(ROOMS[0]);
  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <Headline lines={["Explore the", "floor plan"]} className="font-serif text-5xl sm:text-7xl leading-[0.95] text-zinc-900" />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="rounded-3xl border border-zinc-300 bg-white p-6">
            <svg viewBox="0 0 520 400" className="w-full">
              <defs>
                <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#18181b" strokeOpacity=".08" strokeWidth="3" />
                </pattern>
              </defs>
              {ROOMS.map((room) => {
                const on = room.id === r.id;
                return (
                  <g key={room.id} onMouseEnter={() => setR(room)} onClick={() => setR(room)} className="cursor-pointer">
                    <rect x={room.x} y={room.y} width={room.w} height={room.h} fill={on ? "#18181b" : "url(#hatch)"} stroke="#18181b" strokeWidth={on ? 3 : 1.5} style={{ transition: "fill .4s" }} />
                    <text x={room.x + 12} y={room.y + 24} fontSize="13" fontFamily="serif" fill={on ? "#F4F1EA" : "#18181b"}>{room.n}</text>
                    <text x={room.x + 12} y={room.y + 42} fontSize="10" fontFamily="monospace" fill={on ? "#a1a1aa" : "#71717a"}>{room.d}</text>
                  </g>
                );
              })}
              <text x="20" y="396" fontSize="9" fontFamily="monospace" fill="#a1a1aa">LEVEL 1 · 9,400 SQ FT · N ↑</text>
            </svg>
          </div>
          <div key={r.id} className="animate-[fadeUp_.5s_ease-out]">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl"><Img src={r.img} alt={r.n} className="h-full w-full object-cover" /></div>
            <div className="mt-6 flex items-baseline justify-between">
              <div className="font-serif text-3xl text-zinc-900">{r.n}</div>
              <div className="font-mono text-sm text-zinc-500">{r.d}</div>
            </div>
            <p className="mt-2 text-zinc-600">{r.note}</p>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}

/* ----------------------- Mortgage calculator ----------------------- */
function Mortgage() {
  const [price, setPrice] = useState(14.5);
  const [down, setDown] = useState(30);
  const [rate, setRate] = useState(6.2);
  const [years, setYears] = useState(30);
  const P = price * 1_000_000 * (1 - down / 100);
  const m = rate / 100 / 12;
  const n = years * 12;
  const pay = m === 0 ? P / n : (P * m) / (1 - Math.pow(1 + m, -n));
  const interest = pay * n - P;
  const prinPct = P / (P + interest);
  return (
    <section className="bg-zinc-900 px-6 py-28 text-white sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 items-center">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">Private financing desk</div>
          <h3 className="mt-4 font-serif text-4xl sm:text-5xl">Model your <span className="italic">acquisition.</span></h3>
          {[
            { l: "Purchase price", v: price, set: setPrice, min: 5, max: 40, step: 0.1, f: (x: number) => `$${x.toFixed(1)}M` },
            { l: "Down payment", v: down, set: setDown, min: 10, max: 80, step: 1, f: (x: number) => `${x}%` },
            { l: "Interest rate", v: rate, set: setRate, min: 3, max: 9, step: 0.05, f: (x: number) => `${x.toFixed(2)}%` },
            { l: "Term", v: years, set: setYears, min: 10, max: 30, step: 5, f: (x: number) => `${x} yrs` },
          ].map((c) => (
            <label key={c.l} className="mt-7 block">
              <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400"><span>{c.l}</span><span className="font-mono text-white">{c.f(c.v)}</span></div>
              <input type="range" min={c.min} max={c.max} step={c.step} value={c.v} onChange={(e) => c.set(+e.target.value)} className="mt-3 w-full accent-white" />
            </label>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <div className="relative h-72 w-72">
            <div className="absolute inset-0 rounded-full transition-all duration-500" style={{ background: `conic-gradient(#F4F1EA ${prinPct * 360}deg, #52525b 0)` }} />
            <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-zinc-900">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">Monthly</div>
              <div className="font-serif text-4xl tabular-nums">${Math.round(pay).toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-8 flex gap-8 text-sm">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#F4F1EA]" />Principal ${(P / 1e6).toFixed(2)}M</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-zinc-600" />Interest ${(interest / 1e6).toFixed(2)}M</div>
          </div>
          <p className="mt-4 text-xs text-zinc-500">Illustrative estimate only. Excludes taxes and insurance.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Neighbourhood --------------------------- */
const PLACES = [
  { icon: Coffee, n: "Bel-Air Hotel", t: "4 min", x: 32, y: 40 },
  { icon: Trees, n: "Stone Canyon Trail", t: "6 min", x: 62, y: 22 },
  { icon: GraduationCap, n: "Brentwood School", t: "9 min", x: 22, y: 70 },
  { icon: ShoppingBag, n: "Rodeo Drive", t: "14 min", x: 78, y: 64 },
  { icon: Waves, n: "Santa Monica Beach", t: "22 min", x: 10, y: 88 },
];

function Neighbourhood() {
  const [h, setH] = useState(0);
  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.3fr] items-center">
        <div>
          <Headline lines={["The", "neighbourhood"]} className="font-serif text-5xl sm:text-6xl leading-[0.95] text-zinc-900" />
          <div className="mt-10 divide-y divide-zinc-300 border-y border-zinc-300">
            {PLACES.map((p, i) => (
              <button key={p.n} onMouseEnter={() => setH(i)} onClick={() => setH(i)} className={`flex w-full items-center gap-4 py-4 text-left transition-all ${h === i ? "pl-3" : ""}`}>
                <p.icon className={`h-5 w-5 ${h === i ? "text-zinc-900" : "text-zinc-400"}`} />
                <span className={`flex-1 font-serif text-xl ${h === i ? "text-zinc-900" : "text-zinc-500"}`}>{p.n}</span>
                <span className="font-mono text-sm text-zinc-500">{p.t}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#e9e4d8]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            {Array.from({ length: 14 }).map((_, i) => (
              <path key={i} d={`M0 ${i * 24 + 10} C 100 ${i * 24 - 20}, 260 ${i * 24 + 40}, 400 ${i * 24}`} stroke="#d6cfbf" fill="none" />
            ))}
            <path d="M0 260 Q120 230 200 250 T400 210" stroke="#bfd7e0" strokeWidth="26" fill="none" opacity=".7" />
            {PLACES.map((p, i) => (
              <line key={p.n} x1="200" y1="150" x2={p.x * 4} y2={p.y * 3} stroke="#18181b" strokeWidth={h === i ? 2 : 0.5} strokeDasharray="4 4" opacity={h === i ? 1 : 0.3} style={{ transition: "all .4s" }} />
            ))}
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-zinc-900/30" />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white"><MapPin className="h-5 w-5" /></span>
          </div>
          {PLACES.map((p, i) => (
            <div key={p.n} className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%,-50%) scale(${h === i ? 1.25 : 1})` }}>
              <span className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs shadow transition-colors ${h === i ? "bg-zinc-900 text-white" : "bg-white text-zinc-700"}`}>
                <p.icon className="h-3.5 w-3.5" />{h === i ? `${p.n} · ${p.t}` : p.t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ Export ================================ */
export const RealEstateExtras: React.FC = () => (
  <>
    <Marquee
      className="border-y border-zinc-300 py-5"
      itemClassName="px-10 font-serif text-2xl italic text-zinc-500"
      items={["Bel Air", "—", "Tribeca", "—", "Malibu", "—", "Mayfair", "—", "Côte d'Azur", "—", "Aspen", "—"]}
    />
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl text-zinc-900">
        <ScrubWords className="font-serif text-3xl sm:text-5xl leading-[1.25]" text="We represent fewer than forty homes a year. Each one is photographed at dawn, walked at dusk, and shown only to buyers we have met in person." />
      </div>
    </section>
    <DayToNight />
    <ZoomTour />
    <FloorPlan />
    <Mortgage />
    <Neighbourhood />
  </>
);
