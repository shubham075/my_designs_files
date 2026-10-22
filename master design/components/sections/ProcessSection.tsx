"use client";

import React, { useRef, useEffect, useState } from "react";
import { PROCESS_STEPS } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Sparkles, Workflow, ArrowRight, CheckCircle2 } from "lucide-react";

export const ProcessSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !scrollWrapperRef.current) return;
    const container = containerRef.current;
    const scrollWrapper = scrollWrapperRef.current;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        if (!scrollWrapper) return 0;
        const scrollWidth = scrollWrapper.scrollWidth;
        const viewportWidth = window.innerWidth;
        // Generous right offset (140px) to ensure Phase 4 is fully centered and readable
        return Math.max(0, scrollWidth - viewportWidth + 140);
      };

      gsap.to(scrollWrapper, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1.0,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 3.2, getScrollAmount() * 1.6)}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
            // 0: intro, 1..4: process steps
            const stepIndex = Math.min(
              4,
              Math.max(0, Math.floor(self.progress * 4.99))
            );
            setActiveStep(stepIndex);
          },
        },
      });

      // Refresh ScrollTrigger after initial mount and font rendering
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => clearTimeout(timer);
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} id="process" className="relative w-full bg-[#0A0A0B]">
      {/* Pinned Viewport Container */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col justify-between px-6 pt-28 pb-8 sm:px-10 lg:px-16">
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-accent-gold transition-transform duration-75"
          />
        </div>

        {/* Section Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-3">
            <span className="font-display text-sm font-bold text-accent-gold">02</span>
            <span className="text-xs uppercase tracking-widest text-zinc-400">
              / Engineering Methodology
            </span>
          </div>

          {/* Phase Step Badges */}
          <div className="hidden sm:flex items-center space-x-2">
            {PROCESS_STEPS.map((step, idx) => (
              <span
                key={idx}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono transition-colors ${
                  activeStep === idx + 1
                    ? "bg-accent-gold text-black font-bold"
                    : "bg-white/5 text-zinc-500"
                }`}
              >
                Phase {idx + 1}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-400">
            <Workflow className="h-3.5 w-3.5 text-accent-gold" />
            <span>4-Stage Protocol</span>
          </div>
        </div>

        {/* Horizontal Scrollstrip */}
        <div className="relative z-10 my-auto flex items-center overflow-visible">
          <div
            ref={scrollWrapperRef}
            className="flex items-center space-x-6 sm:space-x-8 pl-4 pr-40 will-change-transform"
          >
            {/* Introductory Card */}
            <div className="flex h-[430px] w-[320px] sm:w-[400px] shrink-0 flex-col justify-between rounded-3xl glass-panel p-8 sm:p-10 border border-accent-gold/20">
              <div>
                <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-accent-gold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>The 4-Stage Protocol</span>
                </div>
                <h3 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold uppercase text-white leading-tight">
                  HOW WE FORGE MASTERWORKS.
                </h3>
                <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  Every template passes through an uncompromising 4-stage engineering pipeline to
                  guarantee instantaneous rendering, mathematical motion timing, and brand prestige.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs text-accent-gold font-mono uppercase tracking-wider">
                <span>Scroll vertically to advance</span>
                <ArrowRight className="h-4 w-4 animate-pulse" />
              </div>
            </div>

            {/* 4 Process Cards */}
            {PROCESS_STEPS.map((step, idx) => {
              const isCurrent = activeStep === idx + 1;

              return (
                <div
                  key={idx}
                  className={`group relative flex h-[430px] w-[320px] sm:w-[440px] shrink-0 flex-col justify-between rounded-3xl glass-card p-8 sm:p-10 border transition-all duration-500 ${
                    isCurrent
                      ? "border-accent-gold/60 shadow-[0_0_40px_rgba(212,175,55,0.15)] bg-white/[0.04]"
                      : "border-white/10 hover:border-accent-gold/40"
                  }`}
                >
                  {/* Top Number & Subtitle */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="font-display text-4xl font-extrabold text-accent-gold">
                        {step.number}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono">
                          Phase {idx + 1} of 4
                        </span>
                        {isCurrent && (
                          <span className="h-2 w-2 rounded-full bg-accent-gold animate-pulse" />
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="text-xs uppercase tracking-widest text-accent-gold/90 font-medium">
                        {step.subtitle}
                      </div>
                      <h4 className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
                        {step.title}
                      </h4>
                      <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {step.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-full glass-pill px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-zinc-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent-gold" />
            <span>4 Distinct Phases • Zero-Jank Delivery</span>
          </div>
          <div className="flex items-center space-x-2 text-accent-gold font-mono">
            <span>
              {activeStep === 0
                ? "Intro Stage"
                : `Phase 0${activeStep}: ${PROCESS_STEPS[activeStep - 1]?.title}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
