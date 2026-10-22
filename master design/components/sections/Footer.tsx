"use client";

import React from "react";
import Link from "next/link";
import { VERTICAL_TAGS } from "@/lib/data";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 w-full overflow-hidden bg-black text-white pt-16 pb-12 border-t border-white/10">
      {/* Huge Rolling Marquee of Vertical Tags */}
      <div className="relative w-full overflow-hidden border-b border-white/10 py-6">
        <div className="flex space-x-12 animate-marquee w-max">
          {[...VERTICAL_TAGS, ...VERTICAL_TAGS].map((tag, idx) => (
            <div key={idx} className="flex items-center space-x-8">
              <span className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-zinc-700 transition-colors hover:text-accent-gold select-none">
                {tag}
              </span>
              <span className="text-accent-gold text-xl">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gold/20 font-display text-base font-bold text-accent-gold border border-accent-gold/30">
                Ω
              </div>
              <span className="font-display text-lg font-bold tracking-wider uppercase">
                Aethelgard Agency
              </span>
            </div>

            <p className="mt-4 max-w-sm text-xs text-zinc-400 font-light leading-relaxed">
              Pioneering high-frequency editorial web architecture. Built with Next.js 15, GSAP
              ScrollTrigger, and Lenis inertia physics.
            </p>

            <div className="mt-6 flex items-center space-x-2 text-[11px] text-zinc-500 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>ALL SYSTEMS OPERATIONAL (240 FPS)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-accent-gold">
              Masterworks
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/work/restaurant" className="hover:text-white transition-colors">
                  01. Restaurant &amp; Fine Dining
                </Link>
              </li>
              <li>
                <span className="text-zinc-600">02. Luxury Real Estate (Coming Soon)</span>
              </li>
              <li>
                <span className="text-zinc-600">03. SaaS &amp; AI Startup (Coming Soon)</span>
              </li>
              <li>
                <span className="text-zinc-600">04. Fashion &amp; Lookbook (Coming Soon)</span>
              </li>
              <li>
                <span className="text-zinc-600">05. Fitness &amp; Athletics (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Architecture Specs & Top Button */}
          <div className="md:col-span-4 flex flex-col justify-between items-start md:items-end">
            <div className="text-left md:text-right">
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-accent-gold">
                Architecture Specs
              </h4>
              <p className="mt-2 text-xs text-zinc-400">
                Next.js 15 App Router • React 19 • Tailwind CSS • Lenis SmoothScroll • GSAP 3.12
              </p>
            </div>

            <div className="mt-8 md:mt-0">
              <MagneticButton strength={0.4}>
                <button
                  onClick={scrollToTop}
                  className="flex h-12 w-12 items-center justify-center rounded-full glass-card border border-white/20 text-white transition-transform hover:border-accent-gold hover:text-accent-gold"
                  aria-label="Back to Top"
                  data-cursor="hover"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-8 text-[11px] text-zinc-500">
          <div>© {new Date().getFullYear()} Aethelgard Studio. All rights reserved.</div>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of License</span>
            <span>Motion System Specs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
