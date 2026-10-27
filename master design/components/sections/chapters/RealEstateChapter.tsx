"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUpRight, Building2, MapPin, Bed, Bath, Move, Compass } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
];

const THUMBNAIL_PROPERTIES = [
  {
    title: "The Bel-Air Pavilion",
    price: "$14,500,000",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop",
    specs: "6 Beds • 8 Baths • 9,400 Sq Ft",
  },
  {
    title: "Tribeca Penthouse V",
    price: "$22,800,000",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    specs: "4 Beds • 5.5 Baths • 7,200 Sq Ft",
  },
  {
    title: "Malibu Cliffside Sanctuary",
    price: "$18,200,000",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop",
    specs: "5 Beds • 6 Baths • 8,100 Sq Ft",
  },
  {
    title: "Aspen Alpine Estate",
    price: "$16,900,000",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
    specs: "7 Beds • 9 Baths • 11,000 Sq Ft",
  },
];

export const RealEstateChapter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const paperBgRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const specCardRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const mapPinRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !pinTargetRef.current ||
      !paperBgRef.current ||
      !mainImageRef.current ||
      !specCardRef.current ||
      !filmstripRef.current ||
      !mapPinRef.current
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
      gsap.set(specCardRef.current, {
        y: 80,
        x: 40,
        opacity: 0,
        willChange: "transform, opacity",
      });

      gsap.set(filmstripRef.current, {
        x: "30%",
        opacity: 0,
        willChange: "transform, opacity",
      });

      gsap.set(mapPinRef.current, {
        scale: 0,
        opacity: 0,
      });

      // Phase A: Background flips from dark to light "paper" mode
      tl.to(
        paperBgRef.current,
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0
      )
        // Phase B: Main architectural photo scales into framed aspect
        .to(
          mainImageRef.current,
          {
            scale: 0.92,
            borderRadius: "24px",
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        )
        // Phase C: Drag-behind price/spec card floats in with subtle lag
        .to(
          specCardRef.current,
          {
            y: 0,
            x: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
          },
          0.4
        )
        // Phase D: Horizontal filmstrip scrubs across
        .to(
          filmstripRef.current,
          {
            x: "-25%",
            opacity: 1,
            duration: 1.6,
            ease: "power2.out",
          },
          0.6
        )
        // Phase E: Map pin pulse reveals
        .to(
          mapPinRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(2)",
          },
          0.8
        );
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport */}
      <div
        ref={pinTargetRef}
        className="relative h-screen w-full overflow-hidden text-zinc-900 flex flex-col justify-between"
      >
        {/* Paper Mode Light Background Flip */}
        <div
          ref={paperBgRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-0 bg-[#F4F1EA] transition-opacity duration-700"
        />

        {/* Ambient Paper Noise/Texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-multiply bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px]"
        />

        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-black/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-zinc-900 transition-transform duration-75"
          />
        </div>

        {/* Header Chapter Tracker */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-28 sm:px-10 lg:px-16">
          <div className="flex items-center space-x-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 font-display text-xs font-bold text-[#F4F1EA]">
              02
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-600 font-semibold">
              Vertical Template / Luxury Real Estate
            </span>
          </div>

          <div className="flex items-center space-x-2 rounded-full bg-black/5 px-3 py-1 text-xs text-zinc-800 border border-black/10 font-medium">
            <Building2 className="h-3.5 w-3.5" />
            <span>Paper Mode Edition</span>
          </div>
        </div>

        {/* Center Content Stage */}
        <div className="relative z-10 my-auto grid h-full w-full grid-cols-1 items-center px-6 sm:px-10 lg:grid-cols-12 lg:px-16 gap-6 py-4">
          {/* Left Column: Editorial Headline & Story */}
          <div className="lg:col-span-4 z-20 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-zinc-700 text-xs font-bold uppercase tracking-widest mb-2.5">
              <Compass className="h-3.5 w-3.5 text-zinc-900" />
              <span>Architectural Monograph</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-zinc-950 leading-[0.95]">
              SPACES THAT <br />
              <span className="text-zinc-500">BREATHE ELEGANCE.</span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-zinc-700 font-normal leading-relaxed max-w-sm">
              Designed for ultra-high-net-worth real estate developments and architectural studios.
              Light paper aesthetic, drag-behind spec cards, and scrubbed property filmstrips.
            </p>

            <div className="mt-6 flex items-center space-x-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/work/real-estate"
                  className="group inline-flex items-center space-x-2.5 rounded-full bg-zinc-950 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:bg-zinc-800 hover:scale-105"
                  data-cursor="action"
                  data-cursor-text="Listings"
                >
                  <span>Browse Listings Demo</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </MagneticButton>

              <Link
                href="/work/real-estate/3d"
                className="inline-flex items-center rounded-full border border-zinc-900/25 px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white"
                data-cursor="action"
                data-cursor-text="3D"
              >
                View 3D
              </Link>
            </div>
          </div>

          {/* Center Column: Framed Property Visual & Drag-Behind Spec Card */}
          <div className="relative lg:col-span-5 flex items-center justify-center h-[280px] sm:h-[360px] lg:h-[420px]">
            <div
              ref={mainImageRef}
              className="relative h-full w-full overflow-hidden shadow-2xl border border-black/10 bg-zinc-300 rounded-2xl"
            >
              <Image
                src={PROPERTY_IMAGES[0]}
                alt="Luxury Estate Architecture"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Map Pin Pulse */}
              <div
                ref={mapPinRef}
                className="absolute top-6 right-6 flex items-center space-x-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur-md shadow-lg"
              >
                <MapPin className="h-3.5 w-3.5 text-rose-600" />
                <span>Bel Air, Los Angeles</span>
              </div>

              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white text-xs">
                <span className="font-display font-bold tracking-wider">
                  The Bel-Air Glass Pavilion
                </span>
                <span className="font-mono">$14,500,000</span>
              </div>
            </div>

            {/* Drag-Behind Spec Card */}
            <div
              ref={specCardRef}
              className="absolute -bottom-6 -right-6 z-30 w-64 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-xl border border-black/10 hidden sm:block"
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-2">
                <span className="font-display text-xs font-bold text-zinc-900 uppercase">
                  Property Dossier
                </span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
                  MLS #98412
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-zinc-800">
                <div className="rounded-lg bg-zinc-50 p-2">
                  <Bed className="h-3.5 w-3.5 mx-auto text-zinc-600" />
                  <div className="mt-1 font-display text-xs font-bold">6 Beds</div>
                </div>
                <div className="rounded-lg bg-zinc-50 p-2">
                  <Bath className="h-3.5 w-3.5 mx-auto text-zinc-600" />
                  <div className="mt-1 font-display text-xs font-bold">8 Baths</div>
                </div>
                <div className="rounded-lg bg-zinc-50 p-2">
                  <Move className="h-3.5 w-3.5 mx-auto text-zinc-600" />
                  <div className="mt-1 font-display text-xs font-bold">9.4k sqft</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scroll-Scrubbed Filmstrip of Thumbnail Properties */}
          <div className="lg:col-span-3 z-20 overflow-hidden">
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Curated Portfolio Strip
            </div>

            <div ref={filmstripRef} className="flex flex-col space-y-3">
              {THUMBNAIL_PROPERTIES.slice(1, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-center space-x-3 rounded-2xl bg-white/80 p-3 shadow-md border border-black/5 hover:bg-white transition-colors"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-200">
                    <Image src={item.img} alt={item.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold text-zinc-900 leading-tight">
                      {item.title}
                    </h4>
                    <div className="font-mono text-xs font-semibold text-zinc-800 mt-0.5">
                      {item.price}
                    </div>
                    <div className="text-[10px] text-zinc-500">{item.specs}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer Chapter Tag */}
        <div className="relative z-20 flex items-center justify-between border-t border-black/10 px-6 py-4 sm:px-10 lg:px-16 text-xs text-zinc-600">
          <div className="flex items-center space-x-4">
            <span className="text-zinc-950 font-bold font-mono">02 / 08</span>
            <span className="hidden sm:inline">Chapter 2 of 8: Luxury Real Estate Vertical</span>
          </div>
          <div className="flex items-center space-x-2 font-medium">
            <span>Scroll for SaaS / Tech Vertical</span>
            <span className="text-zinc-950 font-bold">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
