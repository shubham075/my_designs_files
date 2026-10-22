"use client";

import React, { useEffect, useState } from "react";
import { TESTIMONIALS } from "@/lib/data";
import { Star, Quote, MessageSquare } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const marqueeItems = reducedMotion ? TESTIMONIALS : [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="proof" className="relative z-10 w-full overflow-hidden bg-[#0A0A0B] py-28 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 mb-16">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center space-x-3">
            <span className="font-display text-sm font-bold text-accent-gold">03</span>
            <span className="text-xs uppercase tracking-widest text-zinc-400">
              / Concept Proof &amp; Structure
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-400">
            <MessageSquare className="h-3.5 w-3.5 text-accent-gold" />
            <span>Pitch Notes</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-gold">
              Honest Portfolio Foundation
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white">
              BUILT TO BECOME REAL CASE STUDIES.
            </h2>
          </div>
          <p className="max-w-md text-sm text-zinc-400 font-light">
            These are concept notes for a pitch portfolio. Replace them with verified testimonials,
            outcomes, and client names only after real work is shipped.
          </p>
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0A0A0B] to-transparent" />
        <div className="pointer-events-none absolute top-0 bottom-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0A0A0B] to-transparent" />

        <div
          className={`flex space-x-6 ${reducedMotion ? "mx-auto max-w-6xl flex-wrap px-6 sm:px-10 lg:px-16" : "w-max"} ${
            isPaused || reducedMotion ? "animate-none" : "animate-marquee"
          }`}
        >
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.tag}-${idx}`}
              className="flex h-[260px] w-[340px] sm:w-[420px] flex-col justify-between rounded-lg glass-card p-8 border border-white/10 transition-transform duration-300 hover:border-accent-gold/40 hover:scale-[1.02]"
              data-cursor="hover"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {[...Array(item.rating)].map((_, r) => (
                      <Star key={r} className="h-3.5 w-3.5 fill-accent-gold text-accent-gold" />
                    ))}
                  </div>
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
                    {item.tag}
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-200 font-light leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <div className="font-display text-xs font-bold text-white uppercase tracking-wider">
                    {item.author}
                  </div>
                  <div className="text-[11px] text-zinc-400">{item.role}</div>
                </div>
                <Quote className="h-5 w-5 text-accent-gold/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
