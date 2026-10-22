"use client";

import React, { useRef, useEffect } from "react";
import { HeroParticles } from "@/components/canvas/HeroParticles";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowDown, Sparkles, Layers, ShieldCheck, Flame } from "lucide-react";
import { gsap } from "@/lib/gsap";

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!badgeRef.current || !ctaRef.current) return;

    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: -20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
    ).fromTo(
      ctaRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    );

    return () => {
      tl.kill();
    };
  }, []);

  const scrollToWork = () => {
    const workEl = document.getElementById("work");
    if (workEl) {
      workEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden px-6 pt-28 pb-8 sm:px-10 lg:px-16"
    >
      {/* 3D Particle Ambient Canvas */}
      <HeroParticles />

      {/* Subtle Background Glow Gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-accent-burgundy/25 via-accent-gold/15 to-transparent blur-[140px]"
      />

      {/* Top Meta Badge */}
      <div ref={badgeRef} className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center space-x-3 rounded-full glass-pill px-4 py-1.5 shadow-xl">
          <Sparkles className="h-3.5 w-3.5 text-accent-gold animate-spin-slow" />
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
            Next-Gen Agency Design System
          </span>
          <span className="rounded-full bg-accent-gold/20 px-2 py-0.5 text-[10px] font-bold text-accent-gold">
            2026 Edition
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-6 text-xs uppercase tracking-widest text-zinc-400">
          <span>Curated Vertical Templates</span>
          <span className="text-zinc-600">•</span>
          <span>Zero Layout Shift</span>
        </div>
      </div>

      {/* Main Hero Typography */}
      <div className="relative z-10 my-auto py-4 max-w-5xl">
        <div className="mb-2.5 inline-flex items-center space-x-2 text-accent-gold text-xs font-bold uppercase tracking-widest">
          <Flame className="h-3.5 w-3.5 text-accent-crimson" />
          <span>The Sovereign Standard in Digital Craft</span>
        </div>

        <SplitTextReveal
          as="h1"
          text="CRAFTING DIGITAL MASTERPIECES"
          mode="words"
          stagger={0.04}
          delay={0.1}
          triggerOnScroll={false}
          className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[0.95]"
          wordClassName="text-gradient-silver"
        />

        <div className="mt-1.5 flex flex-col md:flex-row md:items-baseline md:space-x-6">
          <SplitTextReveal
            as="h2"
            text="THAT COMMAND ATTENTION."
            mode="words"
            stagger={0.04}
            delay={0.25}
            triggerOnScroll={false}
            className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-accent-gold leading-[0.95]"
            wordClassName="text-gradient-gold"
          />
        </div>

        <p className="mt-4 max-w-xl text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed">
          High-performance website templates engineered for elite business verticals.
          Buttery smooth scrollytelling timelines, GPU-accelerated motion systems, and
          obsessive typographical precision.
        </p>

        {/* CTA Actions */}
        <div ref={ctaRef} className="mt-6 flex flex-wrap items-center gap-3.5">
          <MagneticButton strength={0.4}>
            <button
              onClick={scrollToWork}
              className="group relative flex items-center space-x-2.5 rounded-full bg-white px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-black shadow-2xl transition-all duration-300 hover:bg-accent-gold hover:shadow-accent-gold/20 hover:scale-105"
              data-cursor="action"
              data-cursor-text="Experience"
            >
              <span>Explore The Masterworks</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 transition-transform group-hover:translate-x-0.5">
                <ArrowDown className="h-3 w-3 text-black" />
              </div>
            </button>
          </MagneticButton>

          <MagneticButton strength={0.25}>
            <a
              href="#about"
              className="inline-flex items-center space-x-2 rounded-full glass-card px-5 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white hover:border-white/20"
              data-cursor="hover"
            >
              <Layers className="h-3.5 w-3.5 text-accent-gold" />
              <span>Read The Manifesto</span>
            </a>
          </MagneticButton>
        </div>
      </div>

      {/* Bottom Hero Ticker & Magnetic Scroll Down */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 gap-4">
        <div className="flex items-center space-x-8 text-xs text-zinc-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Built on Next.js 15 App Router</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
            <span>Lenis + GSAP ScrollSync</span>
          </div>
        </div>

        <MagneticButton strength={0.35}>
          <button
            onClick={scrollToWork}
            className="flex items-center space-x-3 rounded-full glass-pill px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:text-accent-gold"
            data-cursor="hover"
          >
            <span>Scroll to Discover</span>
            <ArrowDown className="h-3.5 w-3.5 animate-bounce text-accent-gold" />
          </button>
        </MagneticButton>
      </div>
    </section>
  );
};
