"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUpRight, Camera, Eye, Sparkles } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
];

export const PhotographyChapter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !pinTargetRef.current ||
      !img1Ref.current ||
      !img2Ref.current ||
      !img3Ref.current
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

      // Initial state: alternating directions
      gsap.set(img1Ref.current, { x: -80, y: 40, opacity: 0.3, scale: 0.9 });
      gsap.set(img2Ref.current, { y: 120, opacity: 0.2, scale: 0.85 });
      gsap.set(img3Ref.current, { x: 80, y: -40, opacity: 0.3, scale: 0.9 });

      // Masonry depth parallax scrub
      tl.to(img1Ref.current, { x: 0, y: -20, opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, 0)
        .to(img2Ref.current, { y: 0, opacity: 1, scale: 1.05, duration: 1.5, ease: "power3.out" }, 0.2)
        .to(img3Ref.current, { x: 0, y: 20, opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, 0.4);
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport */}
      <div
        ref={pinTargetRef}
        className="relative h-screen w-full overflow-hidden bg-[#070709] text-white flex flex-col justify-between"
        data-cursor="action"
        data-cursor-text="View Gallery"
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
              07
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Vertical Template / Creative Studio &amp; Photography
            </span>
          </div>

          <div className="flex items-center space-x-2 rounded-full glass-pill px-3 py-1 text-xs text-white">
            <Camera className="h-3.5 w-3.5" />
            <span>Monolith Studio Edition</span>
          </div>
        </div>

        {/* Center Content Stage */}
        <div className="relative z-10 my-auto grid h-full w-full grid-cols-1 items-center px-6 sm:px-10 lg:grid-cols-12 lg:px-16 gap-8 py-4">
          {/* Left Column: Headline */}
          <div className="lg:col-span-4 z-20 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2.5">
              <Eye className="h-3.5 w-3.5 text-white" />
              <span>Full-Bleed Image First</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              CAPTURING THE <br />
              <span className="text-zinc-500">INEFFABLE.</span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-sm">
              Minimal chrome and maximum visual depth. Scroll-scrubbed masonry where images glide
              from alternating axes with multi-plane parallax depth.
            </p>

            <div className="mt-6 flex items-center space-x-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/work/photography"
                  className="group inline-flex items-center space-x-2.5 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-xl transition-all hover:scale-105"
                  data-cursor="action"
                  data-cursor-text="Gallery"
                >
                  <span>Explore Exhibition</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </MagneticButton>

              <Link
                href="/work/photography/3d"
                className="inline-flex items-center rounded-full border border-white/25 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
                data-cursor="action"
                data-cursor-text="3D"
              >
                View 3D
              </Link>
            </div>
          </div>

          {/* Right Column: Multi-Plane Masonry Gallery */}
          <div className="lg:col-span-8 relative grid grid-cols-3 gap-4 h-[320px] sm:h-[400px] lg:h-[460px] items-center">
            {/* Image 1 */}
            <div
              ref={img1Ref}
              className="relative h-[240px] sm:h-[320px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <Image src={GALLERY_IMAGES[0]} alt="Exhibition 01" fill className="object-cover" />
            </div>

            {/* Image 2 (Centerpiece foreground) */}
            <div
              ref={img2Ref}
              className="relative h-[300px] sm:h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 z-20"
            >
              <Image src={GALLERY_IMAGES[1]} alt="Exhibition 02" fill className="object-cover" />
            </div>

            {/* Image 3 */}
            <div
              ref={img3Ref}
              className="relative h-[260px] sm:h-[340px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <Image src={GALLERY_IMAGES[2]} alt="Exhibition 03" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Bottom Footer Chapter Tag */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 px-6 py-4 sm:px-10 lg:px-16 text-xs text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold font-mono">07 / 08</span>
            <span className="hidden sm:inline">Chapter 7 of 8: Creative Studio Vertical</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Scroll for Clinic &amp; Healthcare Vertical</span>
            <span className="text-white">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
