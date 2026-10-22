"use client";

import React from "react";
import { Navigation } from "@/components/sections/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col bg-[#0A0A0B] text-white">
      {/* Floating Navigation */}
      <Navigation />

      {/* 1. Full-Viewport Hero with 3D Ambient Canvas */}
      <HeroSection />

      {/* 2. Manifesto / About Section with Pinned Text Reveal & Stat Counters */}
      <AboutSection />

      {/* 3. Work Chapters & Reference Chapter (Restaurant & Fine Dining) */}
      <WorkSection />

      {/* 4. Process Horizontal Scroll-Jacked Strip */}
      <ProcessSection />

      {/* 5. Testimonials & Social Proof Marquee */}
      <TestimonialsSection />

      {/* 6. Contact & Licensing Dossier */}
      <ContactSection />

      {/* 7. Footer with Business Tags Marquee */}
      <Footer />
    </main>
  );
}
