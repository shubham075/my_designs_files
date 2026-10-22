"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUpRight, HeartPulse, Stethoscope, Calendar, Clock, Check, Sparkles } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export const HealthcareChapter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !pinTargetRef.current ||
      !card1Ref.current ||
      !card2Ref.current ||
      !card3Ref.current
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
          end: "+=240%",
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Initial state: disassembled pieces
      gsap.set(card1Ref.current, { y: 60, opacity: 0, scale: 0.95 });
      gsap.set(card2Ref.current, { y: 80, opacity: 0, scale: 0.95 });
      gsap.set(card3Ref.current, { y: 100, opacity: 0, scale: 0.95 });

      // Gentle piece-by-piece assembly (sine.inOut)
      tl.to(card1Ref.current, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "sine.out" }, 0)
        .to(card2Ref.current, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "sine.out" }, 0.4)
        .to(card3Ref.current, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "sine.out" }, 0.8);
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport */}
      <div
        ref={pinTargetRef}
        className="relative h-screen w-full overflow-hidden bg-[#0a1215] text-white flex flex-col justify-between"
      >
        {/* Soft Pastel Ambient Aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[700px] rounded-full bg-emerald-500/10 blur-[160px] z-0"
        />

        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-emerald-400 transition-transform duration-75"
          />
        </div>

        {/* Header Chapter Tracker */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-28 sm:px-10 lg:px-16">
          <div className="flex items-center space-x-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 font-display text-xs font-bold text-emerald-400">
              08
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Vertical Template / Healthcare &amp; Elite Longevity Clinic
            </span>
          </div>

          <div className="flex items-center space-x-2 rounded-full glass-pill px-3 py-1 text-xs text-emerald-400 border border-emerald-500/30">
            <HeartPulse className="h-3.5 w-3.5" />
            <span>Aura Longevity Clinic</span>
          </div>
        </div>

        {/* Center Content Stage */}
        <div className="relative z-10 my-auto grid h-full w-full grid-cols-1 items-center px-6 sm:px-10 lg:grid-cols-12 lg:px-16 gap-8 py-4">
          {/* Left Column: Headline */}
          <div className="lg:col-span-5 z-20 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2.5">
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Evidence-Based Medicine</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              HEALTHCARE, <br />
              <span className="text-emerald-400">HUMANIZED.</span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-sm">
              Calm, trustworthy, and intuitive digital experiences for private wellness clinics and
              precision diagnostics. Piece-by-piece assembling appointment booking flows.
            </p>

            <div className="mt-6 flex items-center space-x-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/work/healthcare"
                  className="group inline-flex items-center space-x-2.5 rounded-full bg-emerald-400 px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-xl transition-all hover:bg-emerald-300 hover:scale-105"
                  data-cursor="action"
                  data-cursor-text="Book"
                >
                  <span>Book Consultation Demo</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </MagneticButton>

              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                /work/healthcare
              </span>
            </div>
          </div>

          {/* Right Column: Piece-by-Piece Assembling Appointment Booking UI */}
          <div className="lg:col-span-7 relative flex flex-col space-y-4 max-w-lg mx-auto w-full">
            {/* Piece 1: Physician / Specialty Selector */}
            <div
              ref={card1Ref}
              className="rounded-2xl glass-panel p-4 border border-emerald-500/20 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase text-zinc-400 font-mono">Step 1</div>
                  <div className="font-display text-sm font-bold text-white">
                    Dr. Julian Hayes • Cellular Longevity
                  </div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-mono">Selected ✓</span>
            </div>

            {/* Piece 2: Date & Available Slots */}
            <div
              ref={card2Ref}
              className="rounded-2xl glass-panel p-4 border border-emerald-500/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-zinc-400 font-mono">
                  Step 2 • Select Date
                </span>
                <span className="text-xs text-white font-semibold">Friday, 28 Aug 2026</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-emerald-500/20 text-emerald-300 p-2 text-center text-xs font-mono border border-emerald-500/30">
                  09:30 AM
                </div>
                <div className="rounded-xl bg-black/40 text-zinc-400 p-2 text-center text-xs font-mono">
                  11:00 AM
                </div>
                <div className="rounded-xl bg-black/40 text-zinc-400 p-2 text-center text-xs font-mono">
                  02:15 PM
                </div>
              </div>
            </div>

            {/* Piece 3: Instant Confirmation Card */}
            <div
              ref={card3Ref}
              className="rounded-2xl bg-emerald-950/40 p-4 border border-emerald-500/40 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-white font-medium">HIPAA Compliant Booking Ready</span>
              </div>
              <span className="rounded-full bg-emerald-400 text-black px-3 py-1 text-[11px] font-bold uppercase">
                Instant Confirm
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Chapter Tag */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 px-6 py-4 sm:px-10 lg:px-16 text-xs text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="text-emerald-400 font-bold font-mono">08 / 08</span>
            <span className="hidden sm:inline">Chapter 8 of 8: Healthcare &amp; Longevity Vertical</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Scroll for Process Strip</span>
            <span className="text-emerald-400">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
