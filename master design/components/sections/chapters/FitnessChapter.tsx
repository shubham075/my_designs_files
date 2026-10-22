"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUpRight, Flame, Dumbbell, Zap, Timer, ChevronRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const CLASS_SCHEDULE = [
  { time: "06:30 AM", title: "HYPER-HIIT V4", trainer: "Coach Jax", burn: "780 kcal" },
  { time: "08:00 AM", title: "OLYMPIC POWER LIFT", trainer: "Elena Vance", burn: "650 kcal" },
  { time: "12:00 PM", title: "SPRINT MATRIX 360", trainer: "Marcus Cole", burn: "820 kcal" },
  { time: "06:00 PM", title: "ATHLETIC RECOVERY", trainer: "Dr. Aris", burn: "400 kcal" },
];

export const FitnessChapter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const actionImageRef = useRef<HTMLDivElement>(null);
  const scheduleStripRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !pinTargetRef.current ||
      !headlineRef.current ||
      !actionImageRef.current ||
      !scheduleStripRef.current
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

      // Initial state
      gsap.set(headlineRef.current, {
        scale: 0.9,
        skewX: -8,
        opacity: 0.5,
        willChange: "transform, opacity",
      });

      gsap.set(actionImageRef.current, {
        rotate: -6,
        scale: 1.15,
        willChange: "transform",
      });

      gsap.set(scheduleStripRef.current, {
        x: "40%",
        opacity: 0,
      });

      // Timeline choreography
      tl.to(
        headlineRef.current,
        {
          scale: 1,
          skewX: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        0
      )
        .to(
          actionImageRef.current,
          {
            rotate: 0,
            scale: 0.95,
            duration: 1.5,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          scheduleStripRef.current,
          {
            x: "0%",
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
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
        className="relative h-screen w-full overflow-hidden bg-[#0a0f08] text-white flex flex-col justify-between"
      >
        {/* Electric Lime Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#bcfd00]/15 blur-[160px] z-0"
        />

        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-[#bcfd00] transition-transform duration-75"
          />
        </div>

        {/* Header Chapter Tracker */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-28 sm:px-10 lg:px-16">
          <div className="flex items-center space-x-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#bcfd00]/20 font-display text-xs font-bold text-[#bcfd00]">
              05
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Vertical Template / Performance Fitness
            </span>
          </div>

          <div className="flex items-center space-x-2 rounded-full glass-pill px-3 py-1 text-xs text-[#bcfd00] border border-[#bcfd00]/30">
            <Zap className="h-3.5 w-3.5" />
            <span>Kinetic Energy Engine</span>
          </div>
        </div>

        {/* Center Content Stage */}
        <div className="relative z-10 my-auto grid h-full w-full grid-cols-1 items-center px-6 sm:px-10 lg:grid-cols-12 lg:px-16 gap-8 py-4">
          {/* Left Column: Headline */}
          <div ref={headlineRef} className="lg:col-span-5 z-20 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-[#bcfd00] text-xs font-bold uppercase tracking-widest mb-2.5">
              <Flame className="h-3.5 w-3.5" />
              <span>Velocity-Reactive Motion</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              UNLEASH PURE <br />
              <span className="text-[#bcfd00]">VELOCITY.</span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-sm">
              Engineered for athletic performance clubs and elite crossfit franchises. Velocity-tied
              skew transforms, scrubbed schedule matrices, and high-conversion membership passes.
            </p>

            <div className="mt-6 flex items-center space-x-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/work/fitness"
                  className="group inline-flex items-center space-x-2.5 rounded-full bg-[#bcfd00] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-black shadow-xl transition-all hover:scale-105"
                  data-cursor="action"
                  data-cursor-text="Join"
                >
                  <span>Start Your Program</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </MagneticButton>

              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                /work/fitness
              </span>
            </div>
          </div>

          {/* Center/Right Column: Trainer Parallax Visual & Horizontal Schedule Strip */}
          <div className="lg:col-span-7 relative flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Action Photo Frame */}
              <div
                ref={actionImageRef}
                className="sm:col-span-6 relative h-[280px] sm:h-[360px] rounded-3xl overflow-hidden shadow-2xl border border-[#bcfd00]/30 bg-black"
              >
                <Image
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
                  alt="Athletic Performance"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="font-display font-bold text-[#bcfd00]">Coach Jax Miller</span>
                  <span className="text-zinc-400 font-mono">Olympic S&amp;C</span>
                </div>
              </div>

              {/* Scrubbed Schedule Cards */}
              <div ref={scheduleStripRef} className="sm:col-span-6 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Live Class Matrix
                </div>
                {CLASS_SCHEDULE.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl glass-panel p-3.5 border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-mono text-[#bcfd00]">{item.time}</div>
                      <div className="font-display text-xs font-bold text-white mt-0.5">
                        {item.title}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-zinc-400">{item.trainer}</div>
                      <div className="font-mono text-xs font-bold text-white">{item.burn}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Chapter Tag */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 px-6 py-4 sm:px-10 lg:px-16 text-xs text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="text-[#bcfd00] font-bold font-mono">05 / 08</span>
            <span className="hidden sm:inline">Chapter 5 of 8: Performance Athletics Vertical</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Scroll for Corporate &amp; Law Vertical</span>
            <span className="text-[#bcfd00]">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
