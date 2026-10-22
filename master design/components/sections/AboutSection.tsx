"use client";

import React, { useRef, useEffect } from "react";
import { StatCounter } from "@/components/ui/StatCounter";
import { STATS } from "@/lib/data";
import { gsap } from "@/lib/gsap";
import { Compass } from "lucide-react";

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!wordsRef.current || !sectionRef.current) return;
    const words = wordsRef.current.querySelectorAll(".manifesto-word");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { color: "rgba(255, 255, 255, 0.18)", y: 6 },
        {
          color: "#ffffff",
          y: 0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wordsRef.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.8,
          },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const manifestoText =
    "We believe that a website should never be an afterthought. In an era of generic templates and bloated frameworks, we shape focused digital experiences. Every layout is an editorial statement. Every scroll interaction is calibrated with purpose. When your audience visits, they do not merely browse - they understand the brand faster.";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 w-full bg-[#0A0A0B] px-6 py-28 sm:px-10 lg:px-16 border-t border-white/5"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center space-x-3">
            <span className="font-display text-sm font-bold text-accent-gold">00</span>
            <span className="text-xs uppercase tracking-widest text-zinc-400">/ The Philosophy</span>
          </div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-400">
            <Compass className="h-3.5 w-3.5 text-accent-gold" />
            <span>Form Follows Emotion</span>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-accent-gold">
              The Agency Standard
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
              WHY WE REJECT THE AVERAGE.
            </h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
              Standard web themes look like carbon copies of each other. These concept templates
              show how each vertical can own a stronger visual system, clearer content, and motion
              that supports the pitch instead of distracting from it.
            </p>
          </div>

          <div className="lg:col-span-8 lg:pl-8">
            <p
              ref={wordsRef}
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-snug select-none"
            >
              {manifestoText.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="manifesto-word inline-block mr-[0.28em] transition-colors duration-300"
                >
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-8 rounded-lg glass-card p-8 sm:p-12 lg:grid-cols-4 border border-white/10">
          {STATS.map((stat, index) => (
            <StatCounter
              key={index}
              value={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              className={index !== 0 ? "border-l border-white/10 pl-6 sm:pl-8" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
