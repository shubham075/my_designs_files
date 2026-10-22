"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUpRight, Sparkles, Tag, ShoppingBag } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LOOKBOOK_OUTFITS = [
  {
    title: "Look 01: The Structured Wool Trench",
    price: "€1,850",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    season: "Autumn / Winter 2026",
  },
  {
    title: "Look 02: Silk Organza Evening Gown",
    price: "€3,200",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
    season: "Capsule No. 4",
  },
  {
    title: "Look 03: Sculptural Leather Blazer",
    price: "€2,400",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
    season: "Runway Exclusive",
  },
];

export const FashionChapter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const look1Ref = useRef<HTMLDivElement>(null);
  const look2Ref = useRef<HTMLDivElement>(null);
  const look3Ref = useRef<HTMLDivElement>(null);
  const priceTagRef = useRef<HTMLDivElement>(null);
  const peelingGridRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !pinTargetRef.current ||
      !look1Ref.current ||
      !look2Ref.current ||
      !look3Ref.current ||
      !priceTagRef.current ||
      !peelingGridRef.current
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
      gsap.set(look2Ref.current, { opacity: 0, scale: 1.1 });
      gsap.set(look3Ref.current, { opacity: 0, scale: 1.1 });
      gsap.set(peelingGridRef.current, { y: 120, opacity: 0 });
      gsap.set(priceTagRef.current, { scale: 0.8, opacity: 0 });

      // Phase 1: Reveal price tag & Look 1 -> Look 2 swap
      tl.to(priceTagRef.current, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }, 0)
        .to(look1Ref.current, { opacity: 0, duration: 1 }, 0.5)
        .to(look2Ref.current, { opacity: 1, scale: 1, duration: 1 }, 0.5)
        // Phase 2: Look 2 -> Look 3 swap
        .to(look2Ref.current, { opacity: 0, duration: 1 }, 1.5)
        .to(look3Ref.current, { opacity: 1, scale: 1, duration: 1 }, 1.5)
        // Phase 3: Peeling product grid slides in
        .to(peelingGridRef.current, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 1.8);
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport */}
      <div
        ref={pinTargetRef}
        className="relative h-screen w-full overflow-hidden bg-[#0a0a0c] text-white flex flex-col justify-between"
      >
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-white transition-transform duration-75"
          />
        </div>

        {/* Header Chapter Tracker */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-28 sm:px-10 lg:px-16">
          <div className="flex items-center space-x-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 font-display text-xs font-bold text-white border border-white/20">
              04
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Vertical Template / Haute Couture &amp; Fashion
            </span>
          </div>

          <div className="flex items-center space-x-2 rounded-full glass-pill px-3 py-1 text-xs text-white">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Maison V Lookbook</span>
          </div>
        </div>

        {/* Center Content Stage */}
        <div className="relative z-10 my-auto grid h-full w-full grid-cols-1 items-center px-6 sm:px-10 lg:grid-cols-12 lg:px-16 gap-8 py-4">
          {/* Left Column: Headline */}
          <div className="lg:col-span-5 z-20 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2.5">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>Editorial Monolith</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              FORM FOLLOWS <br />
              <span className="text-zinc-500">DESIRE.</span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-sm">
              High-contrast lookbook architecture with scroll-scrubbed outfit swaps, magnetic price
              tags, and editorial micro-interactions.
            </p>

            <div className="mt-6 flex items-center space-x-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/work/fashion"
                  className="group inline-flex items-center space-x-2.5 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-xl transition-all hover:scale-105"
                  data-cursor="action"
                  data-cursor-text="Lookbook"
                >
                  <span>Explore Lookbook Demo</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </MagneticButton>

              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                /work/fashion
              </span>
            </div>
          </div>

          {/* Center/Right Column: Pinned Outfit Swap Frame */}
          <div className="lg:col-span-7 relative flex items-center justify-center h-[320px] sm:h-[400px] lg:h-[460px]">
            {/* Outfit 1 */}
            <div
              ref={look1Ref}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <Image
                src={LOOKBOOK_OUTFITS[0].img}
                alt="Fashion Look 1"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Outfit 2 */}
            <div
              ref={look2Ref}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <Image
                src={LOOKBOOK_OUTFITS[1].img}
                alt="Fashion Look 2"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Outfit 3 */}
            <div
              ref={look3Ref}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <Image
                src={LOOKBOOK_OUTFITS[2].img}
                alt="Fashion Look 3"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Floating Magnetic Price Tag */}
            <div
              ref={priceTagRef}
              className="absolute bottom-6 left-6 z-30 rounded-2xl glass-panel px-4 py-2 border border-white/20 shadow-2xl"
            >
              <div className="text-[10px] uppercase text-zinc-400 font-mono">Runway Piece</div>
              <div className="font-display text-sm font-bold text-white">Lookbook Collection 2026</div>
            </div>

            {/* Peeling Product Grid Overlay */}
            <div
              ref={peelingGridRef}
              className="absolute bottom-6 right-6 z-30 hidden sm:flex items-center space-x-3 rounded-2xl glass-panel p-3 border border-white/20"
            >
              <Tag className="h-4 w-4 text-white" />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Scroll to Cycle Looks
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Chapter Tag */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 px-6 py-4 sm:px-10 lg:px-16 text-xs text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold font-mono">04 / 08</span>
            <span className="hidden sm:inline">Chapter 4 of 8: Fashion &amp; E-Commerce Vertical</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Scroll for Fitness Vertical</span>
            <span className="text-white">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
