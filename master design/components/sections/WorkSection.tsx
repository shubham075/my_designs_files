"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RestaurantChapter } from "./chapters/RestaurantChapter";
import { RealEstateChapter } from "./chapters/RealEstateChapter";
import { SaaSChapter } from "./chapters/SaaSChapter";
import { FashionChapter } from "./chapters/FashionChapter";
import { FitnessChapter } from "./chapters/FitnessChapter";
import { LawChapter } from "./chapters/LawChapter";
import { PhotographyChapter } from "./chapters/PhotographyChapter";
import { HealthcareChapter } from "./chapters/HealthcareChapter";
import { VERTICAL_TEMPLATES } from "@/lib/data";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

export const WorkSection: React.FC = () => {
  return (
    <section id="work" className="relative w-full bg-[#0A0A0B]">
      {/* 8 Continuous Pinned Scrollytelling Vertical Chapters */}
      <RestaurantChapter />
      <RealEstateChapter />
      <SaaSChapter />
      <FashionChapter />
      <FitnessChapter />
      <LawChapter />
      <PhotographyChapter />
      <HealthcareChapter />

      {/* Verticals Catalog & Template Roster */}
      <div className="relative z-10 w-full px-6 py-28 sm:px-10 lg:px-16 border-t border-white/10 bg-gradient-to-b from-[#0A0A0B] via-[#0d0d11] to-[#0A0A0B]">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-accent-gold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The Master Roster</span>
              </div>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
                ALL VERTICAL TEMPLATES
              </h2>
            </div>
            <p className="max-w-md text-sm text-zinc-400 font-light">
              Each vertical template is engineered with custom micro-interactions, distinct typography hierarchies, and zero-jank conversion funnels.
            </p>
          </div>

          {/* Verticals Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VERTICAL_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="group relative flex flex-col justify-between rounded-lg glass-card overflow-hidden transition-all duration-500 hover:border-white/20 hover:-translate-y-1.5"
                data-cursor="action"
                data-cursor-text="View Case"
              >
                {/* Top Image Preview with Badge */}
                <div className="relative h-64 w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={tpl.heroImage}
                    alt={tpl.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Top Row: Number & Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-accent-gold bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {tpl.number}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md border bg-accent-gold/20 text-accent-gold border-accent-gold/30">
                      {tpl.projectType}
                    </span>
                  </div>

                  {/* Bottom Image Tagline */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                      {tpl.vertical}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                      {tpl.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content & Features */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>

                    {/* Feature Bullets */}
                    <ul className="mt-4 space-y-1.5 border-t border-white/5 pt-4">
                      {tpl.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-[11px] text-zinc-400">
                          <CheckCircle2 className="h-3 w-3 text-accent-gold shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats & Action */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                      {tpl.metrics[0].label}
                      </div>
                      <div className="font-display text-sm font-bold text-white">
                        {tpl.metrics[0].value}
                      </div>
                    </div>

                    <MagneticButton strength={0.3}>
                      <Link
                        href={`/work/${tpl.slug}`}
                        className="inline-flex items-center space-x-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-accent-gold"
                      >
                        <span>Case Study</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
