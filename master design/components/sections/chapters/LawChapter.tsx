"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUpRight, Scale, Shield, Landmark } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export const LawChapter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const archImageRef = useRef<HTMLDivElement>(null);
  const statBoxRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !pinTargetRef.current ||
      !archImageRef.current ||
      !statBoxRef.current
    )
      return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinTargetRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 1.0,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Initial state
      gsap.set(archImageRef.current, {
        scale: 1.0,
        willChange: "transform",
      });

      gsap.set(statBoxRef.current, {
        y: 60,
        opacity: 0,
      });

      // Slow Ken Burns-style architectural zoom & stat reveal
      tl.to(
        archImageRef.current,
        {
          scale: 1.15,
          duration: 2.0,
          ease: "none",
        },
        0
      ).to(
        statBoxRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0.4
      );
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport */}
      <div
        ref={pinTargetRef}
        className="relative h-screen w-full overflow-hidden bg-[#0a0c10] text-white flex flex-col justify-between"
      >
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-[#c4a47c] transition-transform duration-75"
          />
        </div>

        {/* Header Chapter Tracker */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-28 sm:px-10 lg:px-16">
          <div className="flex items-center space-x-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c4a47c]/20 font-display text-xs font-bold text-[#c4a47c]">
              06
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Vertical Template / Corporate Law &amp; Counsel
            </span>
          </div>

          <div className="flex items-center space-x-2 rounded-full glass-pill px-3 py-1 text-xs text-[#c4a47c] border border-[#c4a47c]/30 font-serif">
            <Landmark className="h-3.5 w-3.5" />
            <span>Vanguard &amp; Sterling</span>
          </div>
        </div>

        {/* Center Content Stage */}
        <div className="relative z-10 my-auto grid h-full w-full grid-cols-1 items-center px-6 sm:px-10 lg:grid-cols-12 lg:px-16 gap-8 py-4">
          {/* Left Column: Headline with Serif display override */}
          <div className="lg:col-span-5 z-20 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-[#c4a47c] text-xs font-bold uppercase tracking-widest mb-2.5">
              <Scale className="h-3.5 w-3.5" />
              <span>Institutional Prestige</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.05] tracking-tight">
              Prestige. Precision. <br />
              <span className="italic text-[#c4a47c]">Proven.</span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-sm">
              Restrained, confident typography tailored for elite legal partnerships and corporate
              counsel. Ken Burns architectural scale, case verdict dossiers, and confidential intake.
            </p>

            <div className="mt-6 flex items-center space-x-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/work/law"
                  className="group inline-flex items-center space-x-2.5 rounded-full bg-[#c4a47c] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-xl transition-all hover:bg-[#b59266] hover:scale-105"
                  data-cursor="action"
                  data-cursor-text="Counsel"
                >
                  <span>Schedule Consultation</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </MagneticButton>

              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                /work/law
              </span>
            </div>
          </div>

          {/* Center/Right Column: Architectural Image & Case Verdict Counters */}
          <div className="lg:col-span-7 relative flex items-center justify-center h-[300px] sm:h-[380px] lg:h-[440px]">
            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900">
              <div ref={archImageRef} className="relative h-full w-full">
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
                  alt="Corporate Law Architecture"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Case Result Stat Box */}
              <div
                ref={statBoxRef}
                className="absolute bottom-6 left-6 right-6 z-30 rounded-2xl glass-panel p-6 border border-[#c4a47c]/30 backdrop-blur-xl"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#c4a47c]">
                      $14.2B+
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-400 mt-1">
                      Transactions Closed
                    </div>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-white">99.4%</div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-400 mt-1">
                      Verdict Success
                    </div>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#c4a47c]">
                      42 Yrs
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-400 mt-1">
                      Institutional Trust
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Chapter Tag */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 px-6 py-4 sm:px-10 lg:px-16 text-xs text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="text-[#c4a47c] font-bold font-mono">06 / 08</span>
            <span className="hidden sm:inline">Chapter 6 of 8: Corporate &amp; Law Vertical</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Scroll for Process &amp; Deliverables</span>
            <span className="text-[#c4a47c]">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
