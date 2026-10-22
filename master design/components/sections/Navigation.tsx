"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Sparkles, ArrowUpRight, Menu, X } from "lucide-react";

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 lg:px-16 transition-all duration-500 ${
          isScrolled ? "py-4" : "py-8"
        }`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center space-x-3 text-white transition-opacity hover:opacity-80"
          data-cursor="hover"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-burgundy/40 border border-white/10 shadow-lg backdrop-blur-md">
            <span className="font-display text-lg font-bold tracking-tighter text-accent-gold">Ω</span>
            <div className="absolute -inset-0.5 rounded-xl bg-accent-gold/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-wider uppercase text-white">
              Aethelgard
            </span>
            <span className="text-[10px] tracking-widest uppercase text-zinc-400">
              Agency Masterworks
            </span>
          </div>
        </Link>

        {/* Floating Glassmorphic Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 rounded-full glass-panel px-4 py-2 shadow-2xl">
          <button
            onClick={() => scrollTo("hero")}
            className="px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-zinc-300 transition-colors hover:text-accent-gold"
            data-cursor="hover"
          >
            Overview
          </button>
          <button
            onClick={() => scrollTo("work")}
            className="px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-zinc-300 transition-colors hover:text-accent-gold"
            data-cursor="hover"
          >
            Work Chapters
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-zinc-300 transition-colors hover:text-accent-gold"
            data-cursor="hover"
          >
            Manifesto
          </button>
          <button
            onClick={() => scrollTo("process")}
            className="px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-zinc-300 transition-colors hover:text-accent-gold"
            data-cursor="hover"
          >
            Process
          </button>
          <button
            onClick={() => scrollTo("proof")}
            className="px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-zinc-300 transition-colors hover:text-accent-gold"
            data-cursor="hover"
          >
            Proof
          </button>
        </nav>

        {/* Right Action */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 rounded-full glass-pill px-3 py-1 text-[11px] text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>240 FPS Inertia Active</span>
          </div>

          <MagneticButton strength={0.3}>
            <button
              onClick={() => scrollTo("contact")}
              className="group relative flex items-center space-x-2 rounded-full bg-gradient-to-r from-accent-gold to-accent-champagne px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-transform duration-300 hover:scale-105"
              data-cursor="action"
              data-cursor-text="Inquire"
            >
              <span>Get Templates</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </MagneticButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden rounded-lg p-2 text-zinc-300 hover:text-white glass-pill"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 flex flex-col justify-center bg-black/95 px-8 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col space-y-6 text-center">
            <button
              onClick={() => scrollTo("hero")}
              className="font-display text-2xl font-bold uppercase tracking-widest text-white hover:text-accent-gold"
            >
              Overview
            </button>
            <button
              onClick={() => scrollTo("work")}
              className="font-display text-2xl font-bold uppercase tracking-widest text-white hover:text-accent-gold"
            >
              Work Chapters
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="font-display text-2xl font-bold uppercase tracking-widest text-white hover:text-accent-gold"
            >
              Manifesto
            </button>
            <button
              onClick={() => scrollTo("process")}
              className="font-display text-2xl font-bold uppercase tracking-widest text-white hover:text-accent-gold"
            >
              Process
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="mt-6 inline-flex items-center justify-center space-x-2 rounded-full bg-accent-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-black"
            >
              <span>Get In Touch</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
