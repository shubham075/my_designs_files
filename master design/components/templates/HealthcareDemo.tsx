"use client";

import React, { useEffect, useRef, useState } from "react";
import { Heart, Brain, Activity, Bone, Leaf, Check, Plus, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";
import {
  DemoDock,
  ScrollProgress,
  Reveal,
  ClipImage,
  Headline,
  ScrubWords,
  Marquee,
  CountUp,
  Img,
  u,
  useGsap,
  prefersReduced,
} from "@/components/motion/fx";

const EM = "#10b981";

/* -------------------- Hero: guided breathing orb -------------------- */
function BreathHero() {
  const [phase, setPhase] = useState<"Breathe in" | "Hold" | "Breathe out">("Breathe in");
  const orb = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!orb.current || prefersReduced()) return;
    // 4-7-8 breathing loop drives the orb
    const tl = gsap.timeline({ repeat: -1 });
    tl.call(() => setPhase("Breathe in"))
      .to(orb.current, { scale: 1.35, duration: 4, ease: "sine.inOut" })
      .call(() => setPhase("Hold"))
      .to(orb.current, { scale: 1.38, duration: 3, ease: "none" })
      .call(() => setPhase("Breathe out"))
      .to(orb.current, { scale: 0.9, duration: 5, ease: "sine.inOut" });
    return () => {
      tl.kill();
    };
  }, []);

  const ref = useGsap((root) => {
    gsap.from(root.querySelectorAll(".rise"), { y: 60, opacity: 0, duration: 1.3, stagger: 0.12, ease: "expo.out", delay: 0.2 });
    gsap.to(root.querySelector(".orb-wrap"), { yPercent: 35, scale: 0.7, scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-[#0a1215] px-6 pt-36 pb-20 sm:px-12 lg:px-20">
      <div className="orb-wrap pointer-events-none absolute right-[-10vw] top-[10vh] h-[80vh] w-[80vh] max-w-[100vw]">
        <div ref={orb} className="absolute inset-[15%] rounded-full blur-2xl" style={{ background: `radial-gradient(circle at 35% 35%, #6ee7b7, ${EM} 40%, #064e3b 75%, transparent 76%)`, animation: "morph 12s ease-in-out infinite" }} />
        <div className="absolute inset-[30%] rounded-full border border-emerald-300/30" />
        <div className="absolute inset-[22%] rounded-full border border-emerald-300/15" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="rise inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300">
          <Leaf className="h-3.5 w-3.5" /> Preventive &amp; longevity medicine
        </div>
        <h1 className="mt-8 font-serif text-[13vw] sm:text-[8vw] lg:text-[7rem] leading-[0.95] tracking-tight">
          <span className="rise block">Healthcare,</span>
          <span className="rise block italic text-emerald-300">humanized.</span>
        </h1>
        <p className="rise mt-8 max-w-lg text-lg text-zinc-300 font-light">
          Ninety-minute appointments. 120 biomarkers. A care team that knows your name and calls you back the same day.
        </p>
        <div className="rise mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton strength={0.35}>
            <a href="#book" className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-wider text-black" style={{ background: EM }}>
              <Calendar className="h-4 w-4" /> Book an assessment
            </a>
          </MagneticButton>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
            <span className="w-28 text-sm text-zinc-200 transition-all">{phase}…</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Breathe with us</span>
          </div>
        </div>
      </div>
      <style>{`@keyframes morph{0%,100%{border-radius:50% 50% 50% 50%}25%{border-radius:58% 42% 55% 45%}50%{border-radius:45% 55% 40% 60%}75%{border-radius:52% 48% 60% 40%}}`}</style>
    </section>
  );
}

/* ---------------------- Interactive body map ------------------------ */
const ZONES = [
  { id: "brain", icon: Brain, x: 50, y: 9, t: "Neurology & Sleep", d: "Cognitive baseline, sleep-lab polysomnography, and migraine programmes.", tests: ["Cognitive panel", "Sleep study", "Neuro-MRI"] },
  { id: "heart", icon: Heart, x: 55, y: 30, t: "Cardiology", d: "Coronary calcium scoring, VO₂ max testing, and continuous ECG monitoring.", tests: ["CAC score", "ApoB & Lp(a)", "Stress echo"] },
  { id: "gut", icon: Leaf, x: 50, y: 45, t: "Metabolic & Gut", d: "Continuous glucose monitoring, microbiome sequencing, and nutrition coaching.", tests: ["CGM 14-day", "Microbiome", "HbA1c"] },
  { id: "joint", icon: Bone, x: 40, y: 72, t: "Musculoskeletal", d: "DEXA body composition, bone density, and physio-led strength rehab.", tests: ["DEXA scan", "Gait analysis", "Grip strength"] },
];

function BodyMap() {
  const [z, setZ] = useState(ZONES[1]);
  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 items-center">
        <div className="relative mx-auto h-[620px] w-[300px]">
          {/* Stylised silhouette */}
          <svg viewBox="0 0 200 420" className="absolute inset-0 h-full w-full" fill="none">
            <defs>
              <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity=".25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity=".05" />
              </linearGradient>
            </defs>
            <path
              d="M100 8c16 0 27 12 27 28s-11 30-27 30-27-14-27-30 11-28 27-28zM70 78h60c20 0 34 14 36 34l8 92c1 9-6 15-14 14-7-1-11-7-12-14l-6-70-2 104 8 168c1 10-7 18-17 18s-16-7-17-16l-14-150-14 150c-1 9-7 16-17 16s-18-8-17-18l8-168-2-104-6 70c-1 7-5 13-12 14-8 1-15-5-14-14l8-92c2-20 16-34 36-34z"
              fill="url(#bodyG)"
              stroke="#10b981"
              strokeOpacity=".5"
            />
          </svg>
          {ZONES.map((zz) => {
            const Icon = zz.icon;
            const active = zz.id === z.id;
            return (
              <button
                key={zz.id}
                onClick={() => setZ(zz)}
                onMouseEnter={() => setZ(zz)}
                aria-label={zz.t}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${zz.x}%`, top: `${zz.y}%` }}
              >
                <span className={`absolute inset-0 rounded-full bg-emerald-400/40 ${active ? "animate-ping" : ""}`} />
                <span className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${active ? "scale-125 border-emerald-300 bg-emerald-500 text-black" : "border-emerald-400/40 bg-[#0a1215] text-emerald-300"}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </button>
            );
          })}
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400">Whole-body care map</div>
          <h3 className="mt-4 font-serif text-4xl sm:text-6xl leading-[1.05]">Every system, <span className="italic">one team.</span></h3>
          <div key={z.id} className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 animate-[fadeUp_.5s_ease-out]">
            <div className="flex items-center gap-3">
              <z.icon className="h-6 w-6 text-emerald-400" />
              <div className="font-serif text-3xl">{z.t}</div>
            </div>
            <p className="mt-4 text-zinc-300">{z.d}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {z.tests.map((t) => (
                <span key={t} className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200">{t}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            {ZONES.map((zz) => (
              <button key={zz.id} onClick={() => setZ(zz)} className={`h-1.5 flex-1 rounded-full transition-colors ${zz.id === z.id ? "bg-emerald-400" : "bg-white/10"}`} aria-label={zz.t} />
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}

/* ---------- Pinned patient journey with phone + live biomarker chart ---------- */
const JOURNEY = [
  { k: "Assess", t: "90-minute intake", d: "Full history, wearable sync, and 120-marker blood panel drawn at home.", chart: [70, 72, 69, 75, 78, 74, 80] },
  { k: "Diagnose", t: "Your baseline", d: "Physicians review imaging and labs together. Nothing is read by an algorithm alone.", chart: [80, 76, 82, 74, 70, 68, 66] },
  { k: "Plan", t: "A protocol for you", d: "Nutrition, training, sleep, and — only if needed — medication, in one plan.", chart: [66, 62, 60, 58, 55, 54, 52] },
  { k: "Thrive", t: "Quarterly re-tests", d: "We measure again every 90 days and adjust. Most members see change within one cycle.", chart: [52, 50, 47, 46, 44, 42, 40] },
];

function Journey() {
  const [i, setI] = useState(0);
  const ref = useGsap((root) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: `+=${JOURNEY.length * 70}%`,
        pin: true,
        scrub: 0.5,
        onUpdate: (s) => setI(Math.min(JOURNEY.length - 1, Math.floor(s.progress * JOURNEY.length))),
      },
    }).fromTo(root.querySelector(".phone"), { rotate: -6, y: 40 }, { rotate: 4, y: -40, ease: "none" });
  }, []);

  const j = JOURNEY[i];
  const pts = j.chart.map((v, k) => `${(k / (j.chart.length - 1)) * 220 + 10},${130 - v}`).join(" ");
  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-gradient-to-b from-[#0a1215] to-[#0c1a1d]">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 lg:grid-cols-2 items-center gap-10 px-6 sm:px-12 lg:px-20">
        <div className="pt-20 lg:pt-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400">Your first year with Aura</div>
          <div className="mt-8 space-y-4">
            {JOURNEY.map((x, k) => (
              <div key={x.k} className={`flex items-start gap-5 transition-all duration-500 ${k === i ? "opacity-100" : "opacity-25"}`}>
                <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${k <= i ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/20"}`}>
                  {k < i ? <Check className="h-4 w-4" /> : k + 1}
                </span>
                <div>
                  <div className="font-serif text-3xl sm:text-4xl">{x.k}</div>
                  <div className={`overflow-hidden transition-all duration-500 ${k === i ? "max-h-32 mt-2" : "max-h-0"}`}>
                    <div className="text-sm font-semibold text-emerald-300">{x.t}</div>
                    <p className="mt-1 max-w-md text-sm text-zinc-400">{x.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex justify-center">
          <div className="phone relative h-[560px] w-[280px] rounded-[44px] border-[10px] border-zinc-800 bg-[#06100f] p-5 shadow-[0_50px_100px_-30px_rgba(16,185,129,0.4)]">
            <div className="mx-auto h-5 w-24 rounded-full bg-zinc-800" />
            <div className="mt-6 text-[10px] uppercase tracking-widest text-zinc-500">Biological age</div>
            <div className="font-serif text-6xl text-emerald-300 tabular-nums transition-all">{[47, 45, 42, 39][i]}</div>
            <div className="text-xs text-zinc-500">Chronological age 46</div>
            <div className="mt-6 rounded-2xl bg-white/5 p-3">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500"><span>Inflammation (hs-CRP)</span><span className="text-emerald-400">↓</span></div>
              <svg viewBox="0 0 240 140" className="mt-2 w-full">
                <polyline points={pts} fill="none" stroke={EM} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" style={{ transition: "all .7s cubic-bezier(.7,0,.2,1)" }} />
                {j.chart.map((v, k) => (
                  <circle key={k} cx={(k / (j.chart.length - 1)) * 220 + 10} cy={130 - v} r="3.5" fill="#06100f" stroke={EM} strokeWidth="2" style={{ transition: "all .7s cubic-bezier(.7,0,.2,1)" }} />
                ))}
              </svg>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[["Sleep", ["6.1h", "6.8h", "7.4h", "7.9h"][i]], ["HRV", ["38", "44", "52", "61"][i]], ["VO₂", ["34", "36", "39", "43"][i]], ["ApoB", ["112", "98", "84", "71"][i]]].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-white/5 p-3">
                  <div className="text-[10px] uppercase text-zinc-500">{l}</div>
                  <div className="font-display text-lg font-bold">{v}</div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-5 left-5 right-5 rounded-full bg-emerald-500 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-black">{j.k} · Step {i + 1}/4</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Biological age estimator -------------------- */
function BioAge() {
  const [age, setAge] = useState(42);
  const [sleep, setSleep] = useState(6.5);
  const [move, setMove] = useState(3);
  const [stress, setStress] = useState(6);
  const bio = Math.round(age + (7.5 - sleep) * 1.6 - (move - 2.5) * 1.3 + (stress - 5) * 0.9);
  const delta = bio - age;
  const angle = Math.max(-90, Math.min(90, delta * 9));
  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 items-center rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-emerald-950/50 to-transparent p-8 sm:p-14">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400">60-second estimate</div>
          <h3 className="mt-4 font-serif text-4xl sm:text-5xl">How old is your body, <span className="italic">really?</span></h3>
          {[
            { l: "Age", v: age, set: setAge, min: 20, max: 80, step: 1, f: (x: number) => `${x}` },
            { l: "Sleep / night", v: sleep, set: setSleep, min: 4, max: 9, step: 0.5, f: (x: number) => `${x}h` },
            { l: "Workouts / week", v: move, set: setMove, min: 0, max: 7, step: 1, f: (x: number) => `${x}` },
            { l: "Stress (1–10)", v: stress, set: setStress, min: 1, max: 10, step: 1, f: (x: number) => `${x}` },
          ].map((c) => (
            <label key={c.l} className="mt-7 block">
              <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400"><span>{c.l}</span><span className="font-mono text-white">{c.f(c.v)}</span></div>
              <input type="range" min={c.min} max={c.max} step={c.step} value={c.v} onChange={(e) => c.set(+e.target.value)} className="mt-3 w-full accent-emerald-500" />
            </label>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 240 140" className="w-full max-w-sm">
            <defs>
              <linearGradient id="gauge" x1="0" x2="1">
                <stop offset="0" stopColor="#10b981" />
                <stop offset=".5" stopColor="#facc15" />
                <stop offset="1" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path d="M20 120 A100 100 0 0 1 220 120" stroke="url(#gauge)" strokeWidth="16" fill="none" strokeLinecap="round" />
            <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "120px 120px", transition: "transform .8s cubic-bezier(.3,1.6,.5,1)" }}>
              <line x1="120" y1="120" x2="120" y2="35" stroke="white" strokeWidth="4" strokeLinecap="round" />
            </g>
            <circle cx="120" cy="120" r="9" fill="white" />
          </svg>
          <div className="mt-4 font-serif text-7xl tabular-nums">{bio}</div>
          <div className={`mt-2 text-sm ${delta <= 0 ? "text-emerald-300" : "text-amber-300"}`}>
            {delta === 0 ? "Right on track" : delta < 0 ? `${Math.abs(delta)} years younger than your age` : `${delta} years older than your age`}
          </div>
          <p className="mt-4 max-w-xs text-center text-xs text-zinc-500">Illustrative only. Not medical advice. Your real number comes from bloodwork and a physician consultation.</p>
        </div>
      </div>
    </section>
  );
}

/* ============================ Page ================================ */
const DOCTORS = [
  { n: "Dr. Priya Raman", r: "Internal Medicine · Longevity", img: u("1559839734-2b71ea197ec2", 800) },
  { n: "Dr. Samuel Hart", r: "Cardiology", img: u("1612349317150-e413f6a5b16d", 800) },
  { n: "Dr. Lena Moreau", r: "Sleep & Neurology", img: u("1594824476967-48c8b964273f", 800) },
];

const FAQ = [
  { q: "Do you accept insurance?", a: "Membership covers unlimited physician access. Most labs and imaging can be billed to insurance; we handle the paperwork." },
  { q: "How long is the first visit?", a: "Ninety minutes with your physician, plus a separate at-home blood draw and a wearable onboarding call." },
  { q: "Can I keep my current doctor?", a: "Yes. Many members use us alongside their GP. With permission, we share results and coordinate care." },
  { q: "What if I need a specialist?", a: "Our in-house cardiology, sleep, and MSK teams see members within a week. For anything else we refer and follow up." },
];

export const HealthcareDemo: React.FC = () => {
  const [faq, setFaq] = useState<number | null>(0);
  const [doc, setDoc] = useState(0);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  // Dates are computed after mount so server and client render the same markup.
  const [days, setDays] = useState<Date[]>(() => Array.from({ length: 7 }).map((_, i) => new Date(2026, 0, 5 + i)));
  useEffect(() => {
    setDays(
      Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
      })
    );
  }, []);
  const slots = ["08:30", "09:45", "11:00", "13:30", "15:00", "16:15"].filter((_, k) => (k + day + doc) % 3 !== 0);

  return (
    <div className="relative w-full bg-[#0a1215] text-white selection:bg-emerald-400 selection:text-black">
      <ScrollProgress color={EM} />
      <DemoDock
        label="Aura Longevity Clinic"
        accent={EM}
        right={<a href="#book" className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-black" style={{ background: EM }}>Book</a>}
      />
      <BreathHero />

      <Marquee
        className="border-y border-white/10 py-5"
        itemClassName="px-10 text-sm uppercase tracking-[0.3em] text-zinc-500"
        items={["Aetna", "✚", "Cigna", "✚", "BlueCross", "✚", "UnitedHealthcare", "✚", "HSA / FSA eligible", "✚"]}
      />

      <section className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <ScrubWords
            className="font-serif text-3xl sm:text-5xl leading-[1.25]"
            text="Most medicine waits for something to break. We start ten years earlier — with data, with time, and with doctors who actually listen."
          />
        </div>
        <Reveal each className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4">
          {[
            { v: 120, s: "+", l: "Biomarkers tracked" },
            { v: 90, s: " min", l: "First appointment" },
            { v: 4.9, d: 1, s: "★", l: "Member rating" },
            { v: 2, s: "h", l: "Median reply time" },
          ].map((m) => (
            <div key={m.l} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="font-serif text-5xl text-emerald-300"><CountUp to={m.v} suffix={m.s} decimals={m.d ?? 0} /></div>
              <div className="mt-2 text-xs uppercase tracking-widest text-zinc-500">{m.l}</div>
            </div>
          ))}
        </Reveal>
      </section>

      <BodyMap />
      <Journey />
      <BioAge />

      {/* Clinic imagery */}
      <section className="px-6 pb-28 sm:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <ClipImage src={u("1519494026892-80bbd2d6fd0d", 1400)} alt="Clinic" className="h-[60vh] rounded-3xl md:col-span-2" from="left" />
          <ClipImage src={u("1544367567-0f2fcb009e0b", 1000)} alt="Wellness" className="h-[60vh] rounded-3xl" from="right">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
              <div className="mt-3 font-serif text-2xl">HIPAA-secure, always.</div>
            </div>
          </ClipImage>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="bg-[#f2f7f5] px-6 py-28 text-zinc-900 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <Headline lines={["Choose your", "physician"]} className="font-serif text-5xl sm:text-6xl leading-[1]" />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-3">
              {DOCTORS.map((d, i) => (
                <button key={d.n} onClick={() => { setDoc(i); setSlot(null); setBooked(false); }} className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all ${doc === i ? "border-emerald-600 bg-white shadow-lg" : "border-zinc-200 hover:border-zinc-400"}`}>
                  <Img src={d.img} alt={d.n} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold">{d.n}</div>
                    <div className="text-xs text-zinc-500">{d.r}</div>
                  </div>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${doc === i ? "border-emerald-600 bg-emerald-600 text-white" : "border-zinc-300"}`}>{doc === i && <Check className="h-3.5 w-3.5" />}</span>
                </button>
              ))}
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
              {booked ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-8 w-8" /></div>
                  <div className="mt-6 font-serif text-3xl">You&apos;re booked.</div>
                  <p className="mt-2 text-sm text-zinc-500">{DOCTORS[doc].n} · {days[day].toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} at {slot}</p>
                  <button onClick={() => { setBooked(false); setSlot(null); }} className="mt-6 text-xs underline text-zinc-500">Change</button>
                </div>
              ) : (
                <>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pick a day</div>
                  <div className="mt-3 grid grid-cols-7 gap-2">
                    {days.map((d, i) => (
                      <button key={i} onClick={() => { setDay(i); setSlot(null); }} className={`rounded-xl py-3 text-center transition-all ${day === i ? "bg-emerald-600 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}>
                        <div className="text-[10px] uppercase">{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
                        <div className="font-display text-lg font-bold">{d.getDate()}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 text-xs font-bold uppercase tracking-widest text-zinc-500">Available times</div>
                  <div key={`${day}-${doc}`} className="mt-3 grid grid-cols-3 gap-2 animate-[fadeUp_.4s_ease-out]">
                    {slots.map((s) => (
                      <button key={s} onClick={() => setSlot(s)} className={`rounded-xl border py-3 font-mono text-sm transition-all ${slot === s ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-zinc-200 hover:border-zinc-400"}`}>{s}</button>
                    ))}
                  </div>
                  <button disabled={!slot} onClick={() => setBooked(true)} className="mt-8 w-full rounded-full bg-zinc-900 py-4 text-xs font-bold uppercase tracking-widest text-white transition-opacity disabled:opacity-30">
                    {slot ? `Confirm ${slot}` : "Select a time"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Sparkles className="h-6 w-6 text-emerald-400" />
            <h3 className="mt-4 font-serif text-4xl sm:text-5xl">Questions, <span className="italic">answered.</span></h3>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between py-6 text-left">
                  <span className="font-serif text-xl sm:text-2xl">{f.q}</span>
                  <Plus className={`h-5 w-5 shrink-0 text-emerald-400 transition-transform duration-500 ${faq === i ? "rotate-45" : ""}`} />
                </button>
                <div className="grid transition-all duration-500" style={{ gridTemplateRows: faq === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden"><p className="pb-6 text-zinc-400">{f.a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 pb-10 pt-16 sm:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="font-serif text-5xl">Aura <span className="italic text-emerald-300">Longevity</span></div>
          <div className="flex items-center gap-2 text-xs text-zinc-500"><Activity className="h-4 w-4 text-emerald-400" /> 14 Harbor Lane · Mon–Sat 7am–8pm · Concept template</div>
        </div>
      </footer>
    </div>
  );
};
