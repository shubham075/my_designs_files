"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUpRight, Wine, Utensils, Star, Clock, Calendar, ChevronRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export const RestaurantChapter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const menuCardRef = useRef<HTMLDivElement>(null);
  const garnishRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !pinTargetRef.current ||
      !heroImageRef.current ||
      !headlineRef.current ||
      !menuCardRef.current ||
      !garnishRef.current ||
      !widgetRef.current ||
      !bgOverlayRef.current
    )
      return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Master Scrollytelling Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinTargetRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // 1. Initial state setup
      gsap.set(heroImageRef.current, {
        scale: 1.25,
        rotate: 2,
        borderRadius: "0px",
        willChange: "transform, border-radius",
      });

      gsap.set(menuCardRef.current, {
        y: 120,
        opacity: 0,
        rotate: -4,
        willChange: "transform, opacity",
      });

      gsap.set(garnishRef.current, {
        y: 180,
        x: -40,
        opacity: 0,
        scale: 0.8,
        willChange: "transform, opacity",
      });

      gsap.set(widgetRef.current, {
        x: "110%",
        opacity: 0,
        willChange: "transform, opacity",
      });

      // 2. Timeline Choreography
      // Phase A: Background morphs to deep burgundy & dish image scales down into framed position
      tl.to(
        bgOverlayRef.current,
        {
          opacity: 0.95,
          duration: 1.5,
          ease: "power2.inOut",
        },
        0
      )
        .to(
          heroImageRef.current,
          {
            scale: 0.88,
            rotate: 0,
            borderRadius: "28px",
            duration: 1.5,
            ease: "power3.inOut",
          },
          0
        )
        // Phase B: Floating Menu card parallaxes up
        .to(
          menuCardRef.current,
          {
            y: -20,
            opacity: 1,
            rotate: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          0.5
        )
        // Phase C: Floating Garnish ingredient layer parallaxes faster
        .to(
          garnishRef.current,
          {
            y: -60,
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1.3,
            ease: "power2.out",
          },
          0.6
        )
        // Phase D: Reservation widget slides in from right
        .to(
          widgetRef.current,
          {
            x: "0%",
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
          },
          1.0
        );
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport Container */}
      <div
        ref={pinTargetRef}
        className="relative h-screen w-full overflow-hidden bg-[#0A0A0B] text-white flex flex-col justify-between"
      >
        {/* Dynamic Background Morph to Deep Burgundy */}
        <div
          ref={bgOverlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-700 bg-gradient-to-b from-[#180309] via-[#2d0713] to-[#0d0104]"
        />

        {/* Ambient Warm Vignette & Radial Light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-accent-burgundy/25 blur-[160px] z-0"
        />

        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-accent-gold to-accent-crimson transition-transform duration-75"
          />
        </div>

        {/* Header Chapter Tracker */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-28 sm:px-10 lg:px-16">
          <div className="flex items-center space-x-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-gold/20 font-display text-xs font-bold text-accent-gold">
              01
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400">
              Vertical Template / Fine Dining
            </span>
          </div>

          <div className="flex items-center space-x-2 rounded-full glass-pill px-3 py-1 text-xs text-accent-gold">
            <Wine className="h-3.5 w-3.5" />
            <span>L&apos;Étoile Noir Edition</span>
          </div>
        </div>

        {/* Main Center Scrollytelling Stage */}
        <div className="relative z-10 my-auto grid h-full w-full grid-cols-1 items-center px-6 sm:px-10 lg:grid-cols-12 lg:px-16 gap-6 py-4">
          {/* Left Column: Editorial Headline & Story */}
          <div ref={headlineRef} className="lg:col-span-4 z-20 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-accent-gold text-xs font-bold uppercase tracking-widest mb-2.5">
              <Star className="h-3 w-3 fill-accent-gold" />
              <span>Michelin-Caliber Web Design</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              TASTE, <br />
              <span className="text-gradient-burgundy">REIMAGINED.</span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-sm">
              Engineered for Michelin-starred venues and bespoke culinary studios. Features
              dynamic wine cellar curation, multi-course degustation storytelling, and seamless table booking.
            </p>

            <div className="mt-6 flex items-center space-x-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/work/restaurant"
                  className="group inline-flex items-center space-x-2.5 rounded-full bg-gradient-to-r from-accent-gold to-accent-champagne px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-xl transition-all hover:scale-105"
                  data-cursor="action"
                  data-cursor-text="Live Demo"
                >
                  <span>Launch Live Demo</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </MagneticButton>

              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                /work/restaurant
              </span>
            </div>
          </div>

          {/* Center Column: Framed Dish Visual & Parallax Layers */}
          <div className="relative lg:col-span-5 flex items-center justify-center h-[280px] sm:h-[360px] lg:h-[420px]">
            {/* Main Dish Photograph Frame */}
            <div
              ref={heroImageRef}
              className="relative h-full w-full overflow-hidden shadow-2xl border border-white/15 bg-black"
            >
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop"
                alt="Fine Dining Gastronomy"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px]">
                <span className="font-display font-semibold tracking-wider text-accent-champagne">
                  Plat Signature No. 7
                </span>
                <span className="text-zinc-400 font-mono">Truffle &amp; Aged Wagyu</span>
              </div>
            </div>

            {/* Parallax Layer 1: Floating Degustation Price List */}
            <div
              ref={menuCardRef}
              className="absolute -bottom-8 -left-6 z-30 w-56 rounded-2xl glass-panel-gold p-4 shadow-2xl backdrop-blur-xl border border-accent-gold/30 hidden sm:block"
            >
              <div className="flex items-center justify-between border-b border-accent-gold/20 pb-2">
                <span className="font-display text-xs font-bold text-accent-gold uppercase tracking-wider">
                  Menu Dégustation
                </span>
                <span className="font-mono text-xs text-white font-bold">$185</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-zinc-300">
                <li className="flex justify-between">
                  <span>Hokkaido Scallop</span>
                  <span className="text-accent-gold font-mono">I</span>
                </li>
                <li className="flex justify-between">
                  <span>A5 Miyazaki Ribeye</span>
                  <span className="text-accent-gold font-mono">II</span>
                </li>
                <li className="flex justify-between">
                  <span>Grand Cru Chocolate</span>
                  <span className="text-accent-gold font-mono">III</span>
                </li>
              </ul>
            </div>

            {/* Parallax Layer 2: Floating Garnish / Sommelier Badge */}
            <div
              ref={garnishRef}
              className="absolute -top-6 -right-6 z-30 rounded-2xl glass-panel p-3.5 shadow-2xl backdrop-blur-xl border border-white/10 hidden sm:flex items-center space-x-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-burgundy/60 text-accent-gold">
                <Wine className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-400">Cellar Reserve</div>
                <div className="font-display text-xs font-bold text-white">450+ Grand Cru Vintages</div>
              </div>
            </div>
          </div>

          {/* Right Column: Slide-in Reservation Widget Mockup */}
          <div className="lg:col-span-3 z-20 flex justify-end">
            <div
              ref={widgetRef}
              className="w-full max-w-sm rounded-3xl glass-panel p-6 shadow-2xl border border-white/15 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2">
                  <Utensils className="h-4 w-4 text-accent-gold" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-white">
                    Table Reservation
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Instant Confirm
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-black/40 p-3 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <Calendar className="h-3.5 w-3.5 text-accent-gold" />
                    <span>Friday, 28 Aug</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                </div>

                <div className="rounded-xl bg-black/40 p-3 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <Clock className="h-3.5 w-3.5 text-accent-gold" />
                    <span>08:30 PM (Dinner)</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                </div>

                <div className="rounded-xl bg-black/40 p-3 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <Star className="h-3.5 w-3.5 text-accent-gold" />
                    <span>2 Guests (Chef Table)</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                </div>
              </div>

              <MagneticButton strength={0.3} className="w-full mt-5">
                <Link
                  href="/work/restaurant"
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-accent-crimson py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:bg-accent-crimson/90 hover:scale-[1.02]"
                  data-cursor="hover"
                >
                  <span>Reserve Table Demo</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </MagneticButton>

              <div className="mt-3 text-center text-[10px] text-zinc-400">
                Full POS &amp; OpenTable / Resy Integration Ready
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Chapter Tag */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 px-6 py-4 sm:px-10 lg:px-16 text-xs text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="text-accent-gold font-mono">01 / 08</span>
            <span className="hidden sm:inline">Chapter 1 of 8: Fine Dining Vertical</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Scroll for Next Vertical</span>
            <span className="text-accent-gold">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
