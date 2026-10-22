"use client";

import React, { useEffect, useRef, useState } from "react";
import { Zap, Check, Flame, Clock, Activity, MoveHorizontal } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";
import {
  DemoDock,
  ScrollProgress,
  Reveal,
  Headline,
  Marquee,
  Tilt,
  CountUp,
  Img,
  u,
  useGsap,
  prefersReduced,
} from "@/components/motion/fx";

const LIME = "#bcfd00";

const PHASES = [
  { k: "01", name: "Activate", weeks: "Wk 1–2", focus: "Mobility, motor patterns, tendon prep", load: 35, img: u("1518611012118-696072aa579a") },
  { k: "02", name: "Build", weeks: "Wk 3–6", focus: "Hypertrophy blocks, eccentric tempo", load: 65, img: u("1534438327276-14e5300c3a48") },
  { k: "03", name: "Peak", weeks: "Wk 7–9", focus: "Max velocity, plyometrics, contrast sets", load: 95, img: u("1517836357463-d25dfeac3438") },
  { k: "04", name: "Recover", weeks: "Wk 10", focus: "Deload, HRV-guided sessions, cryo", load: 20, img: u("1517838277536-f5f99be501cd") },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SCHEDULE: Record<string, { t: string; c: string; coach: string; spots: number; int: number }[]> = {
  Mon: [
    { t: "06:00", c: "Velocity Sprint", coach: "Elena", spots: 4, int: 5 },
    { t: "12:30", c: "Olympic Lifting", coach: "Jax", spots: 2, int: 4 },
    { t: "18:00", c: "Hyrox Engine", coach: "Mara", spots: 9, int: 5 },
  ],
  Tue: [
    { t: "07:00", c: "Mobility Flow", coach: "Kai", spots: 12, int: 2 },
    { t: "17:30", c: "Strength Block", coach: "Jax", spots: 1, int: 4 },
  ],
  Wed: [
    { t: "06:00", c: "Metcon 45", coach: "Elena", spots: 6, int: 5 },
    { t: "19:00", c: "Boxing Power", coach: "Dre", spots: 3, int: 4 },
  ],
  Thu: [
    { t: "06:30", c: "Zone 2 Ride", coach: "Mara", spots: 14, int: 2 },
    { t: "18:00", c: "Plyo Lab", coach: "Kai", spots: 5, int: 4 },
  ],
  Fri: [
    { t: "07:00", c: "Velocity Sprint", coach: "Elena", spots: 7, int: 5 },
    { t: "17:00", c: "Squad WOD", coach: "Jax", spots: 0, int: 5 },
  ],
  Sat: [{ t: "09:00", c: "Recovery + Cryo", coach: "Kai", spots: 10, int: 1 }],
};

const TRAINERS = [
  { name: "Jax Miller", role: "Olympic Weightlifting", img: u("1534438327276-14e5300c3a48", 800), stat: "245kg", statL: "Clean & jerk PR", bio: "Former national-team S&C coach. Specialises in explosive power output." },
  { name: "Elena Vance", role: "Metabolic Conditioning", img: u("1517838277536-f5f99be501cd", 800), stat: "2:41", statL: "Marathon PB", bio: "Endurance scientist focused on lactate tolerance and VO₂ max." },
  { name: "Dre Okafor", role: "Combat & Power", img: u("1549060279-7e168fcee0c2", 800), stat: "27–2", statL: "Amateur record", bio: "Boxing coach blending footwork drills with rotational strength." },
];

/* -------------- Hero: velocity-skewed kinetic type + ECG ------------ */
function Hero() {
  const [bpm, setBpm] = useState(62);
  const ref = useGsap((root) => {
    gsap.from(root.querySelectorAll(".k-line"), { xPercent: (i) => (i % 2 ? 100 : -100), opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" });
    const lines = root.querySelectorAll<HTMLElement>(".k-line");
    // Velocity skew: faster scroll = more skew, springs back when you stop.
    const skewTo = gsap.quickTo(lines, "skewX", { duration: 0.5, ease: "power3" });
    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom top",
      onUpdate: (s) => skewTo(gsap.utils.clamp(-25, 25, s.getVelocity() / -150)),
    });
    gsap.to(lines[0], { xPercent: -20, scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(lines[1], { xPercent: 15, scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(lines[2], { xPercent: -30, scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(root.querySelector(".hero-bg"), { scale: 1.25, scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
  }, []);

  // BPM rises as the user scrolls (feels like effort)
  useEffect(() => {
    const onScroll = () => setBpm(Math.round(62 + Math.min(1, window.scrollY / 5000) * 120));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} className="relative h-[110vh] w-full overflow-hidden bg-[#0a0f08]">
      <div className="hero-bg absolute inset-0">
        <Img src={u("1571019613454-1cb2f99b2d8b", 2000)} alt="Athlete training" className="h-full w-full object-cover opacity-40 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f08]/30 via-[#0a0f08]/60 to-[#0a0f08]" />
      </div>
      <div className="relative z-10 flex h-screen flex-col justify-center gap-1 font-display font-black uppercase italic leading-[0.82] tracking-tighter">
        <div className="k-line whitespace-nowrap pl-[5vw] text-[17vw] text-white">Unleash</div>
        <div className="k-line whitespace-nowrap pl-[20vw] text-[17vw] text-transparent" style={{ WebkitTextStroke: `2px ${LIME}` }}>
          Pure
        </div>
        <div className="k-line whitespace-nowrap pl-[8vw] text-[17vw]" style={{ color: LIME }}>
          Velocity
        </div>
      </div>
      {/* Live ECG widget */}
      <div className="absolute bottom-[14vh] right-6 z-20 w-[280px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <span className="flex items-center gap-1.5"><Activity className="h-3 w-3" style={{ color: LIME }} /> Live heart rate</span>
          <span>scroll = effort</span>
        </div>
        <div className="mt-2 flex items-end gap-2">
          <span className="font-display text-5xl font-black tabular-nums" style={{ color: LIME }}>{bpm}</span>
          <span className="mb-2 text-xs text-zinc-400">BPM</span>
        </div>
        <svg viewBox="0 0 280 50" className="mt-2 h-12 w-full overflow-visible">
          <path
            d="M0 25 L40 25 L50 25 L58 8 L66 42 L74 25 L120 25 L130 25 L138 5 L146 45 L154 25 L200 25 L210 25 L218 10 L226 40 L234 25 L280 25"
            fill="none"
            stroke={LIME}
            strokeWidth="2"
            className="ecg-path"
            style={{ animationDuration: `${Math.max(0.5, 60 / bpm) * 2}s` }}
          />
        </svg>
      </div>
      <div className="absolute bottom-[14vh] left-6 z-20 max-w-sm">
        <p className="text-sm text-zinc-300">Performance lab for athletes who measure everything. Force plates, VO₂ testing, and coaches who program from your data.</p>
        <MagneticButton strength={0.4} className="mt-6">
          <a href="#membership" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-black uppercase tracking-wider text-black" style={{ background: LIME }}>
            <Zap className="h-4 w-4" /> Claim free assessment
          </a>
        </MagneticButton>
      </div>
      <style>{`.ecg-path{stroke-dasharray:400;stroke-dashoffset:400;animation:ecg linear infinite}@keyframes ecg{to{stroke-dashoffset:-400}}`}</style>
    </section>
  );
}

/* ---------------- Pinned program phases with load ring ------------- */
function ProgramPhases() {
  const [i, setI] = useState(0);
  const ringRef = useRef<SVGCircleElement>(null);
  const ref = useGsap((root) => {
    const imgs = gsap.utils.toArray<HTMLElement>(".ph-img", root);
    gsap.set(imgs.slice(1), { clipPath: "inset(100% 0 0 0)" });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: `+=${PHASES.length * 80}%`,
        pin: true,
        scrub: 0.6,
        onUpdate: (s) => setI(Math.min(PHASES.length - 1, Math.floor(s.progress * PHASES.length * 0.999))),
      },
    });
    imgs.slice(1).forEach((img, k) => tl.to(img, { clipPath: "inset(0% 0 0 0)", ease: "power2.inOut" }, k + 0.3));
    tl.to({}, { duration: 0.5 });
  }, []);

  const C = 2 * Math.PI * 70;
  useEffect(() => {
    if (ringRef.current) gsap.to(ringRef.current, { strokeDashoffset: C * (1 - PHASES[i].load / 100), duration: 0.8, ease: "power3.out" });
  }, [i, C]);

  const p = PHASES[i];
  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-[#0a0f08]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center px-6 pt-24 sm:px-12 lg:px-20 lg:pt-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: LIME }}>The 10-week Kinetix protocol</div>
          <div className="mt-6 flex items-center gap-8">
            <svg width="170" height="170" viewBox="0 0 170 170" className="-rotate-90 shrink-0">
              <circle cx="85" cy="85" r="70" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
              <circle ref={ringRef} cx="85" cy="85" r="70" stroke={LIME} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} />
            </svg>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-zinc-500">Training load</div>
              <div className="font-display text-6xl font-black tabular-nums">{p.load}%</div>
            </div>
          </div>
          <div key={p.k} className="mt-10 animate-[fadeUp_.6s_ease-out]">
            <div className="font-mono text-sm text-zinc-500">{p.k} / 04 · {p.weeks}</div>
            <div className="font-display text-6xl sm:text-8xl font-black uppercase italic tracking-tighter">{p.name}</div>
            <p className="mt-3 max-w-md text-zinc-300">{p.focus}</p>
          </div>
          <div className="mt-10 flex gap-2">
            {PHASES.map((x, k) => (
              <div key={x.k} className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: k <= i ? "100%" : "0%", background: LIME }} />
              </div>
            ))}
          </div>
        </div>
        <div className="relative hidden lg:block">
          {PHASES.map((x) => (
            <div key={x.k} className="ph-img absolute inset-0">
              <Img src={x.img} alt={x.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f08] via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}

/* --------------------- Before/after drag slider -------------------- */
function Transformation() {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Headline lines={["12 weeks.", "Measured, not guessed."]} className="font-display text-4xl sm:text-6xl font-black uppercase italic tracking-tight leading-[0.95]" />
        <div
          ref={box}
          className="relative mt-12 aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl"
          onMouseMove={(e) => e.buttons === 1 && drag(e.clientX)}
          onMouseDown={(e) => drag(e.clientX)}
          onTouchMove={(e) => drag(e.touches[0].clientX)}
        >
          <Img src={u("1583454110551-21f2fa2afe61", 1800)} alt="After" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <Img src={u("1583454110551-21f2fa2afe61", 1800)} alt="Before" className="absolute inset-0 h-full w-full object-cover grayscale contrast-75 brightness-75 blur-[1px]" />
          </div>
          <div className="absolute inset-y-0 w-[3px]" style={{ left: `${pos}%`, background: LIME }}>
            <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-black" style={{ background: LIME }}>
              <MoveHorizontal className="h-5 w-5" />
            </div>
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Week 0</span>
          <span className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black" style={{ background: LIME }}>Week 12</span>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { v: 18, s: "%", l: "Body fat drop" },
            { v: 34, s: "kg", l: "Squat increase" },
            { v: 22, s: "%", l: "VO₂ max gain" },
            { v: 0.4, s: "s", l: "Faster 40m", d: 1 },
          ].map((m) => (
            <div key={m.l} className="border-t border-white/10 pt-4">
              <div className="font-display text-4xl font-black" style={{ color: LIME }}>
                <CountUp to={m.v} suffix={m.s} decimals={m.d ?? 0} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-zinc-500">{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Macro / calorie calculator ----------------- */
function FuelCalculator() {
  const [weight, setWeight] = useState(78);
  const [goal, setGoal] = useState<"cut" | "maintain" | "build">("build");
  const [days, setDays] = useState(4);
  const base = weight * 22 * (1.2 + days * 0.075);
  const kcal = Math.round(base * (goal === "cut" ? 0.8 : goal === "build" ? 1.12 : 1));
  const protein = Math.round(weight * (goal === "cut" ? 2.4 : 2));
  const fat = Math.round((kcal * 0.25) / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const total = protein * 4 + carbs * 4 + fat * 9;
  const bars = [
    { l: "Protein", g: protein, c: LIME, pct: (protein * 4) / total },
    { l: "Carbs", g: carbs, c: "#ffffff", pct: (carbs * 4) / total },
    { l: "Fat", g: fat, c: "#71717a", pct: (fat * 9) / total },
  ];
  return (
    <section className="bg-[#10160c] px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 items-center">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: LIME }}>Fuel lab</div>
          <h3 className="mt-4 font-display text-4xl sm:text-6xl font-black uppercase italic tracking-tight">Build your plate.</h3>
          <div className="mt-10 space-y-8">
            <label className="block">
              <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400"><span>Body weight</span><span className="text-white font-mono">{weight} kg</span></div>
              <input type="range" min={45} max={130} value={weight} onChange={(e) => setWeight(+e.target.value)} className="mt-3 w-full accent-[#bcfd00]" />
            </label>
            <label className="block">
              <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400"><span>Training days / week</span><span className="text-white font-mono">{days}</span></div>
              <input type="range" min={1} max={7} value={days} onChange={(e) => setDays(+e.target.value)} className="mt-3 w-full accent-[#bcfd00]" />
            </label>
            <div className="flex gap-2">
              {(["cut", "maintain", "build"] as const).map((g) => (
                <button key={g} onClick={() => setGoal(g)} className={`flex-1 rounded-full border py-3 text-xs font-black uppercase tracking-wider transition-all ${goal === g ? "text-black border-transparent" : "border-white/15 text-zinc-300"}`} style={goal === g ? { background: LIME } : undefined}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Tilt max={6} className="rounded-3xl border border-white/10 bg-black/40 p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400"><Flame className="h-4 w-4" style={{ color: LIME }} /> Daily target</div>
          <div className="mt-2 font-display text-7xl font-black tabular-nums">{kcal.toLocaleString()}<span className="ml-2 text-xl text-zinc-500">kcal</span></div>
          <div className="mt-8 flex h-4 w-full overflow-hidden rounded-full">
            {bars.map((b) => (
              <div key={b.l} className="h-full transition-all duration-700" style={{ width: `${b.pct * 100}%`, background: b.c }} />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {bars.map((b) => (
              <div key={b.l}>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-400"><span className="h-2 w-2 rounded-full" style={{ background: b.c }} />{b.l}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">{b.g}g</div>
              </div>
            ))}
          </div>
        </Tilt>
      </div>
    </section>
  );
}

/* ============================ Page ================================ */
export const FitnessDemo: React.FC = () => {
  const [day, setDay] = useState("Mon");
  const [booked, setBooked] = useState<string[]>([]);
  const [annual, setAnnual] = useState(true);
  const [plan, setPlan] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current || prefersReduced()) return;
    gsap.fromTo(listRef.current.children, { x: 40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: "power3.out" });
  }, [day]);

  const plans = [
    { n: "Pulse", m: 89, f: ["Open gym 5am–11pm", "2 classes / week", "Quarterly InBody scan"] },
    { n: "Velocity", m: 159, f: ["Unlimited classes", "Monthly VO₂ + force-plate test", "App programming", "Recovery suite"], hot: true },
    { n: "Pro Lab", m: 349, f: ["1:1 coaching 3× week", "Bloodwork + DEXA", "Nutritionist", "Everything in Velocity"] },
  ];

  return (
    <div className="relative w-full bg-[#0a0f08] text-white selection:bg-[#bcfd00] selection:text-black">
      <ScrollProgress color={LIME} />
      <DemoDock
        label="Kinetix Lab — Performance"
        accent={LIME}
        right={
          <a href="#membership" className="rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider text-black" style={{ background: LIME }}>
            Join
          </a>
        }
      />
      <Hero />

      <Marquee
        className="-rotate-2 scale-105 bg-[#bcfd00] py-4 text-black"
        itemClassName="px-6 font-display text-3xl sm:text-5xl font-black uppercase italic"
        items={["Strength", "⚡", "Speed", "⚡", "Endurance", "⚡", "Recovery", "⚡", "Data", "⚡"]}
      />

      <ProgramPhases />

      {/* Schedule */}
      <section className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <Headline lines={["This week", "on the floor"]} className="font-display text-4xl sm:text-6xl font-black uppercase italic tracking-tight leading-[0.95]" />
            <div className="flex flex-wrap gap-1 rounded-full border border-white/10 p-1">
              {DAYS.map((d) => (
                <button key={d} onClick={() => setDay(d)} className={`rounded-full px-4 py-2 text-xs font-bold uppercase transition-all ${day === d ? "text-black" : "text-zinc-400 hover:text-white"}`} style={day === d ? { background: LIME } : undefined}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div ref={listRef} className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {SCHEDULE[day].map((s) => {
              const id = `${day}-${s.t}`;
              const isBooked = booked.includes(id);
              const full = s.spots === 0 && !isBooked;
              return (
                <div key={id} className="group grid grid-cols-[70px_1fr_auto] sm:grid-cols-[100px_1fr_160px_140px_auto] items-center gap-4 py-6 transition-colors hover:bg-white/[0.03]">
                  <div className="font-mono text-lg flex items-center gap-2"><Clock className="h-4 w-4 text-zinc-600 hidden sm:block" />{s.t}</div>
                  <div>
                    <div className="font-display text-xl sm:text-2xl font-bold uppercase group-hover:translate-x-2 transition-transform">{s.c}</div>
                    <div className="text-xs text-zinc-500">with {s.coach}</div>
                  </div>
                  <div className="hidden sm:flex gap-1">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <span key={k} className="h-4 w-1.5 rounded-sm" style={{ background: k < s.int ? LIME : "rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <div className="hidden sm:block text-xs text-zinc-400">{full ? "Waitlist" : `${s.spots - (isBooked ? 1 : 0)} spots left`}</div>
                  <button
                    disabled={full}
                    onClick={() => setBooked((b) => (isBooked ? b.filter((x) => x !== id) : [...b, id]))}
                    className={`rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${isBooked ? "text-black" : full ? "border border-white/10 text-zinc-600" : "border border-white/20 hover:border-white"}`}
                    style={isBooked ? { background: LIME } : undefined}
                  >
                    {isBooked ? <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" />Booked</span> : full ? "Full" : "Book"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Transformation />

      {/* Coaches: tilt + flip */}
      <section className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <Headline lines={["Coaches"]} className="font-display text-5xl sm:text-7xl font-black uppercase italic tracking-tight" />
          <Reveal each className="mt-12 grid gap-6 md:grid-cols-3">
            {TRAINERS.map((t) => (
              <div key={t.name} className="group h-[460px] [perspective:1200px]">
                <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 overflow-hidden rounded-3xl [backface-visibility:hidden]">
                    <Img src={t.img} alt={t.name} className="h-full w-full object-cover grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: LIME }}>{t.role}</div>
                      <div className="font-display text-3xl font-black uppercase">{t.name}</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-between rounded-3xl p-8 text-black [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ background: LIME }}>
                    <div className="text-[11px] font-bold uppercase tracking-widest">{t.role}</div>
                    <div>
                      <div className="font-display text-7xl font-black">{t.stat}</div>
                      <div className="text-xs font-bold uppercase tracking-widest">{t.statL}</div>
                    </div>
                    <p className="text-sm font-medium">{t.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <FuelCalculator />

      {/* Membership */}
      <section id="membership" className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <Headline lines={["Pick your engine"]} className="font-display text-4xl sm:text-6xl font-black uppercase italic tracking-tight" />
            <button onClick={() => setAnnual((a) => !a)} className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
              <span className={annual ? "text-zinc-500" : ""}>Monthly</span>
              <span className="relative h-7 w-14 rounded-full border border-white/20">
                <span className="absolute top-1 h-5 w-5 rounded-full transition-all duration-300" style={{ left: annual ? 30 : 4, background: LIME }} />
              </span>
              <span className={annual ? "" : "text-zinc-500"}>Annual <span style={{ color: LIME }}>-20%</span></span>
            </button>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <Tilt key={p.n} max={5} className={`flex flex-col rounded-3xl border p-8 ${p.hot ? "border-transparent bg-[#bcfd00] text-black" : "border-white/10 bg-white/[0.02]"}`}>
                <div className="flex items-center justify-between">
                  <div className="font-display text-2xl font-black uppercase italic">{p.n}</div>
                  {p.hot && <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: LIME }}>Most picked</span>}
                </div>
                <div className="mt-6 font-display text-6xl font-black tabular-nums">
                  €{Math.round(annual ? p.m * 0.8 : p.m)}
                  <span className={`text-base font-medium ${p.hot ? "text-black/60" : "text-zinc-500"}`}>/mo</span>
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {p.f.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 shrink-0" style={{ color: p.hot ? "#000" : LIME }} />{f}</li>
                  ))}
                </ul>
                <button onClick={() => setPlan(p.n)} className={`mt-8 rounded-full py-4 text-xs font-black uppercase tracking-wider ${p.hot ? "bg-black text-white" : "text-black"}`} style={p.hot ? undefined : { background: LIME }}>
                  {plan === p.n ? "✓ Assessment booked" : "Start 7-day trial"}
                </button>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden border-t border-white/10 px-6 pb-10 pt-20 sm:px-12 lg:px-20">
        <div className="font-display text-[20vw] font-black uppercase italic leading-[0.8] tracking-tighter" style={{ color: LIME }}>Kinetix</div>
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 text-xs text-zinc-500">
          <span>Unit 4, Velocity Yard · Open 05:00–23:00</span>
          <span>© 2026 Kinetix Lab — concept template</span>
        </div>
      </footer>
    </div>
  );
};
