"use client";

import React, { useState } from "react";
import { Scale, Building2, Shield, Landmark, Briefcase, Gavel, ArrowRight, Check, ChevronLeft, Quote } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";
import {
  DemoDock,
  ScrollProgress,
  Reveal,
  ClipImage,
  Headline,
  CountUp,
  Marquee,
  Img,
  u,
  useGsap,
} from "@/components/motion/fx";

const BRONZE = "#c4a47c";

const PRACTICES = [
  { icon: Building2, t: "Corporate & M&A", d: "Cross-border acquisitions, private equity, and boardroom governance for companies valued from $50M to $40B.", img: u("1486406146926-c627a92ad1ab", 1200) },
  { icon: Gavel, t: "Litigation", d: "Bet-the-company disputes in federal court and international arbitration. 91% trial win rate since 2010.", img: u("1589829545856-d10d557cf95f", 1200) },
  { icon: Shield, t: "White Collar", d: "Regulatory investigations, SEC enforcement, and internal reviews handled with absolute discretion.", img: u("1505664194779-8beaceb93744", 1200) },
  { icon: Landmark, t: "Private Wealth", d: "Succession, trusts, and family-office structuring across four generations of client families.", img: u("1450101499163-c8848c66ca85", 1200) },
  { icon: Briefcase, t: "Employment", d: "Executive contracts, restrictive covenants, and class-action defence for global employers.", img: u("1497366216548-37526070297c", 1200) },
];

const TIMELINE = [
  { y: "Mar 2021", t: "Retained", d: "A Fortune 100 manufacturer faces a $2.1B patent claim filed in the Eastern District of Texas." },
  { y: "Aug 2021", t: "Discovery", d: "Our forensic team reviews 4.2 million documents and identifies prior art dating back to 1994." },
  { y: "Jan 2022", t: "Motion granted", d: "Three of the five asserted claims are invalidated on summary judgment." },
  { y: "Jun 2022", t: "Trial", d: "Eleven days before a jury. Lead partner Catherine Sterling delivers the closing argument." },
  { y: "Jun 2022", t: "Verdict", d: "Complete defence verdict. Zero liability. Affirmed on appeal by the Federal Circuit in 2023." },
];

const PARTNERS = [
  { n: "Catherine Sterling", r: "Managing Partner · Litigation", img: u("1573496359142-b8d87734a5a2", 800) },
  { n: "Edmund Vanguard", r: "Founding Partner · Corporate", img: u("1560250097-0b93528c311a", 800) },
  { n: "Amara Okonkwo", r: "Partner · White Collar", img: u("1438761681033-6461ffad8d80", 800) },
  { n: "Julian Reyes", r: "Partner · Private Wealth", img: u("1507679799987-c73779587ccf", 800) },
];

/* ---------------- Hero: pillars draw in, serif rises ---------------- */
function Hero() {
  const ref = useGsap((root) => {
    const paths = root.querySelectorAll<SVGPathElement>(".pillar path");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.to(paths, { strokeDashoffset: 0, duration: 2.4, stagger: 0.05, ease: "power2.inOut", delay: 0.3 });
    gsap.from(root.querySelectorAll(".h-rise"), { yPercent: 110, duration: 1.4, stagger: 0.15, ease: "expo.out", delay: 0.6 });
    gsap.to(root.querySelector(".pillar"), { yPercent: 20, opacity: 0.2, scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
  }, []);

  const cols = [0, 1, 2, 3, 4, 5];
  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-[#0a0c10] px-6 pt-36 pb-16 sm:px-12 lg:px-20">
      {/* Neoclassical facade drawn as you load */}
      <svg className="pillar pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[75vh] w-full max-w-6xl opacity-60" viewBox="0 0 1000 600" fill="none" stroke={BRONZE} strokeWidth="1">
        <path d="M60 140 L500 20 L940 140 Z" />
        <path d="M40 150 H960 M40 165 H960" />
        {cols.map((i) => {
          const x = 110 + i * 156;
          return (
            <g key={i}>
              <path d={`M${x - 26} 180 H${x + 26} M${x - 20} 190 H${x + 20}`} />
              <path d={`M${x - 18} 190 V540 M${x + 18} 190 V540 M${x - 6} 195 V535 M${x + 6} 195 V535`} />
              <path d={`M${x - 26} 550 H${x + 26} M${x - 32} 560 H${x + 32}`} />
            </g>
          );
        })}
        <path d="M20 570 H980 M0 590 H1000" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/40 to-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: BRONZE }}>
          <Scale className="h-4 w-4" /> Est. 1962 · New York · London · Singapore
        </div>
        <h1 className="mt-10 font-serif text-[13vw] sm:text-[9vw] lg:text-[7.5rem] leading-[0.95] tracking-tight">
          <span className="block overflow-hidden"><span className="h-rise block">Prestige.</span></span>
          <span className="block overflow-hidden"><span className="h-rise block italic" style={{ color: BRONZE }}>Precision.</span></span>
          <span className="block overflow-hidden"><span className="h-rise block">Proven.</span></span>
        </h1>
        <div className="mt-14 grid gap-8 sm:grid-cols-[1fr_auto] items-end">
          <p className="max-w-lg text-base text-zinc-400 leading-relaxed">
            Vanguard &amp; Sterling represents boards, founders, and families when the outcome cannot be left to chance.
          </p>
          <MagneticButton strength={0.3}>
            <a href="#consult" className="inline-flex items-center gap-3 rounded-full border px-7 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-[#c4a47c] hover:text-black" style={{ borderColor: BRONZE, color: BRONZE }}>
              Request a confidential consultation <ArrowRight className="h-4 w-4" />
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ------------- Redacted document: bars slide away on scroll --------- */
function Declassified() {
  const ref = useGsap((root) => {
    gsap.to(root.querySelectorAll(".redact"), {
      scaleX: 0,
      stagger: 0.15,
      ease: "power2.inOut",
      scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 60%", scrub: 0.8 },
    });
  }, []);
  const R = ({ children }: { children: React.ReactNode }) => (
    <span className="relative inline-block">
      {children}
      <span className="redact absolute inset-x-[-4px] inset-y-[8%] origin-right bg-zinc-100" />
    </span>
  );
  return (
    <section ref={ref} className="bg-[#f3efe7] px-6 py-32 text-zinc-900 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between border-b border-zinc-300 pb-4 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          <span>Privileged &amp; Confidential</span>
          <span>File No. VS-2026-0417</span>
        </div>
        <p className="mt-12 font-serif text-3xl sm:text-5xl leading-[1.3]">
          In sixty years we have <R>never disclosed</R> a client relationship without consent. We have defended <R>forty-one</R> companies on the
          Fortune 500, recovered <R>$12.4 billion</R> for plaintiffs, and taken <R>three cases</R> to the Supreme Court.
        </p>
        <div className="mt-10 font-mono text-xs text-zinc-500">↓ Scroll to declassify</div>
      </div>
    </section>
  );
}

/* ---------------- Expanding horizontal practice accordion ----------- */
function Practices() {
  const [open, setOpen] = useState(0);
  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <Headline lines={["Areas of", "practice"]} className="font-serif text-5xl sm:text-7xl leading-[0.95]" />
          <p className="max-w-sm text-sm text-zinc-400">Hover or tap a panel to open it. Each practice is led by a partner with 20+ years in the field.</p>
        </div>
        <div className="mt-14 flex h-[560px] flex-col gap-3 lg:flex-row">
          {PRACTICES.map((p, i) => {
            const active = i === open;
            const Icon = p.icon;
            return (
              <button
                key={p.t}
                onMouseEnter={() => setOpen(i)}
                onClick={() => setOpen(i)}
                className="relative overflow-hidden rounded-2xl border border-white/10 text-left transition-[flex] duration-700 ease-[cubic-bezier(.7,0,.2,1)]"
                style={{ flex: active ? 5 : 1 }}
              >
                <Img src={p.img} alt={p.t} className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${active ? "scale-100 opacity-50" : "scale-110 opacity-15 grayscale"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/50 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-6">
                  <Icon className="h-6 w-6" style={{ color: BRONZE }} />
                  <div>
                    <div className={`font-serif text-2xl sm:text-3xl whitespace-nowrap transition-all duration-700 ${active ? "" : "lg:[writing-mode:vertical-rl] lg:rotate-180"}`}>{p.t}</div>
                    <p className={`mt-3 max-w-md text-sm text-zinc-300 transition-all duration-500 ${active ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-4 h-0"}`}>{p.d}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pinned case file: line draws, milestones light ---- */
function CaseStudy() {
  const [step, setStep] = useState(0);
  const ref = useGsap((root) => {
    gsap.fromTo(
      root.querySelector(".tl-fill"),
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 0.5,
          onUpdate: (s) => setStep(Math.min(TIMELINE.length - 1, Math.floor(s.progress * TIMELINE.length))),
        },
      }
    );
  }, []);
  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-[#0d1016]">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 lg:grid-cols-2 gap-12 px-6 sm:px-12 lg:px-20 items-center">
        <div className="pt-24 lg:pt-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: BRONZE }}>Landmark matter</div>
          <h3 className="mt-4 font-serif text-4xl sm:text-6xl leading-[1.05]">
            Re: <span className="italic">Hollis Industries</span>
            <br />v. Meridian Tech
          </h3>
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-6">
            <div className="font-mono text-xs text-zinc-500">Exposure at stake</div>
            <div className="mt-1 font-serif text-5xl" style={{ color: step === TIMELINE.length - 1 ? "#10b981" : BRONZE }}>
              {step === TIMELINE.length - 1 ? "$0" : "$2.1B"}
            </div>
            <div className="mt-2 text-xs text-zinc-400">{step === TIMELINE.length - 1 ? "Liability after verdict" : "Claimed damages"}</div>
          </div>
        </div>
        <div className="relative pl-10">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10">
            <div className="tl-fill h-full w-full origin-top" style={{ background: BRONZE }} />
          </div>
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <div key={t.t} className={`relative transition-all duration-500 ${i <= step ? "opacity-100" : "opacity-20"}`}>
                <span className="absolute -left-[46px] top-1.5 h-3 w-3 rounded-full border-2 transition-colors duration-500" style={{ borderColor: BRONZE, background: i <= step ? BRONZE : "#0d1016" }} />
                <div className="font-mono text-xs text-zinc-500">{t.y}</div>
                <div className="font-serif text-2xl">{t.t}</div>
                <p className={`mt-1 max-w-md text-sm text-zinc-400 transition-all duration-500 ${i === step ? "max-h-24" : "max-h-0 overflow-hidden lg:max-h-24"}`}>{t.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Multi-step confidential intake wizard ------------- */
function Intake() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ matter: "", urgency: "", name: "", email: "" });
  const steps = ["Matter", "Urgency", "Contact", "Done"];
  const choice = (key: "matter" | "urgency", v: string) => {
    setData((d) => ({ ...d, [key]: v }));
    setTimeout(() => setStep((s) => s + 1), 250);
  };
  return (
    <section id="consult" className="bg-[#f3efe7] px-6 py-28 text-zinc-900 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8b6f47]">Confidential intake</div>
          <h3 className="mt-4 font-serif text-5xl leading-[1.05]">
            Tell us what&apos;s at stake. <span className="italic">We&apos;ll call within the hour.</span>
          </h3>
          <p className="mt-6 text-sm text-zinc-600">All submissions are encrypted and reviewed by a partner — never an assistant. No attorney-client relationship is formed until engagement.</p>
        </div>
        <div className="rounded-3xl border border-zinc-300 bg-white p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div className="h-1 rounded-full bg-zinc-200 overflow-hidden"><div className="h-full bg-[#8b6f47] transition-all duration-500" style={{ width: i <= step ? "100%" : "0%" }} /></div>
                <div className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${i <= step ? "text-zinc-900" : "text-zinc-400"}`}>{s}</div>
              </div>
            ))}
          </div>
          <div key={step} className="mt-10 min-h-[260px] animate-[fadeUp_.5s_ease-out]">
            {step === 0 && (
              <>
                <div className="font-serif text-2xl">What type of matter?</div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {PRACTICES.map((p) => (
                    <button key={p.t} onClick={() => choice("matter", p.t)} className={`rounded-xl border p-4 text-left text-sm transition-all hover:border-[#8b6f47] hover:-translate-y-0.5 ${data.matter === p.t ? "border-[#8b6f47] bg-[#8b6f47]/5" : "border-zinc-200"}`}>
                      <p.icon className="mb-2 h-4 w-4 text-[#8b6f47]" />{p.t}
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <div className="font-serif text-2xl">How urgent is it?</div>
                <div className="mt-6 space-y-3">
                  {["Within 24 hours — active proceedings", "This week — deadline approaching", "Planning ahead — no immediate deadline"].map((v) => (
                    <button key={v} onClick={() => choice("urgency", v)} className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-4 text-left text-sm transition-all hover:border-[#8b6f47]">
                      {v} <ArrowRight className="h-4 w-4 text-zinc-400" />
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-5">
                <div className="font-serif text-2xl">How do we reach you?</div>
                <input required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Full name" className="w-full border-b border-zinc-300 bg-transparent py-3 outline-none focus:border-[#8b6f47]" />
                <input required type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="Email" className="w-full border-b border-zinc-300 bg-transparent py-3 outline-none focus:border-[#8b6f47]" />
                <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-500">{data.matter} · {data.urgency}</div>
                <button className="w-full rounded-full bg-zinc-900 py-4 text-xs font-bold uppercase tracking-widest text-white">Submit securely</button>
              </form>
            )}
            {step === 3 && (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8b6f47] text-white"><Check className="h-8 w-8" /></div>
                <div className="mt-6 font-serif text-3xl">Received, {data.name.split(" ")[0] || "thank you"}.</div>
                <p className="mt-2 text-sm text-zinc-500">A partner from our {data.matter} group will call you shortly. (Demo — nothing was sent.)</p>
              </div>
            )}
          </div>
          {step > 0 && step < 3 && (
            <button onClick={() => setStep((s) => s - 1)} className="mt-4 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900"><ChevronLeft className="h-3 w-3" /> Back</button>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}

/* ============================ Page ================================ */
export const LawDemo: React.FC = () => {
  const [q, setQ] = useState(0);
  const quotes = [
    { t: "They saw the case we would win before we did — and then they won it.", a: "General Counsel, Fortune 50 Energy Company" },
    { t: "The most discreet, most prepared room I have ever walked into.", a: "Founder & CEO, Series F Fintech" },
    { t: "Three generations of my family have trusted them. There is no fourth option.", a: "Principal, Single-Family Office" },
  ];
  return (
    <div className="relative w-full bg-[#0a0c10] text-white selection:bg-[#c4a47c] selection:text-black">
      <ScrollProgress color={BRONZE} />
      <DemoDock
        label="Vanguard & Sterling LLP"
        accent={BRONZE}
        right={<a href="#consult" className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-black" style={{ background: BRONZE }}>Consult</a>}
      />
      <Hero />

      <Marquee
        className="border-y border-white/10 py-6"
        itemClassName="px-10 font-serif text-2xl italic text-zinc-500"
        items={["Chambers Band 1", "·", "The Legal 500", "·", "Am Law 100", "·", "Benchmark Litigation", "·", "Best Lawyers 2026", "·"]}
      />

      {/* Stats */}
      <section className="px-6 py-24 sm:px-12 lg:px-20">
        <Reveal each className="mx-auto grid max-w-6xl grid-cols-2 gap-10 lg:grid-cols-4">
          {[
            { v: 12.4, p: "$", s: "B", d: 1, l: "Recovered for clients" },
            { v: 91, s: "%", l: "Trial win rate" },
            { v: 64, l: "Years of practice" },
            { v: 340, l: "Attorneys worldwide" },
          ].map((m) => (
            <div key={m.l} className="border-l pl-6" style={{ borderColor: `${BRONZE}55` }}>
              <div className="font-serif text-5xl sm:text-6xl" style={{ color: BRONZE }}>
                <CountUp to={m.v} prefix={m.p} suffix={m.s} decimals={m.d ?? 0} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-widest text-zinc-500">{m.l}</div>
            </div>
          ))}
        </Reveal>
      </section>

      <Declassified />
      <Practices />
      <CaseStudy />

      {/* Partners */}
      <section className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <Headline lines={["The partners"]} className="font-serif text-5xl sm:text-7xl" />
          <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {PARTNERS.map((p, i) => (
              <div key={p.n} className={`group ${i % 2 ? "lg:mt-16" : ""}`}>
                <ClipImage src={p.img} alt={p.n} from={i % 2 ? "top" : "bottom"} className="aspect-[3/4] rounded-2xl" imgClassName="grayscale transition-[filter] duration-700 group-hover:grayscale-0" />
                <div className="mt-4 font-serif text-xl">{p.n}</div>
                <div className="text-xs text-zinc-500">{p.r}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-white/10 px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <Quote className="mx-auto h-10 w-10" style={{ color: BRONZE }} />
          <div className="relative mt-8 min-h-[200px] sm:min-h-[160px]">
            {quotes.map((x, i) => (
              <div key={i} className={`absolute inset-0 transition-all duration-700 ${i === q ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
                <p className="font-serif text-3xl sm:text-4xl italic leading-snug">&ldquo;{x.t}&rdquo;</p>
                <div className="mt-6 text-xs uppercase tracking-widest text-zinc-500">{x.a}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center gap-3">
            {quotes.map((_, i) => (
              <button key={i} aria-label={`Quote ${i + 1}`} onClick={() => setQ(i)} className="h-1.5 rounded-full transition-all duration-500" style={{ width: i === q ? 40 : 12, background: i === q ? BRONZE : "rgba(255,255,255,0.2)" }} />
            ))}
          </div>
        </div>
      </section>

      <Intake />

      <footer className="px-6 pb-10 pt-20 sm:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="font-serif text-5xl sm:text-7xl leading-none">Vanguard <span className="italic" style={{ color: BRONZE }}>&amp;</span> Sterling</div>
          <div className="grid grid-cols-3 gap-8 text-xs text-zinc-500">
            <div><div className="text-white">New York</div>One Vanderbilt, 58F</div>
            <div><div className="text-white">London</div>22 Bishopsgate</div>
            <div><div className="text-white">Singapore</div>Marina Bay Fin. Ctr</div>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-[11px] text-zinc-600">Attorney advertising. Prior results do not guarantee a similar outcome. Concept template.</div>
      </footer>
    </div>
  );
};
