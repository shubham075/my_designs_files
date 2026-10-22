"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import {
  ArrowUpRight,
  Terminal,
  Cpu,
  Zap,
  Activity,
  Shield,
  Server,
  Code2,
  CheckCircle,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export const SaaSChapter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridLayerRef = useRef<HTMLDivElement>(null);
  const metricCardsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !pinTargetRef.current ||
      !dashboardRef.current ||
      !glowRef.current ||
      !gridLayerRef.current ||
      !metricCardsRef.current
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
      gsap.set(dashboardRef.current, {
        rotateX: 25,
        rotateY: -12,
        scale: 0.85,
        y: 60,
        opacity: 0.4,
        willChange: "transform, opacity",
      });

      gsap.set(glowRef.current, {
        scale: 0.6,
        opacity: 0.2,
      });

      gsap.set(metricCardsRef.current, {
        x: 60,
        opacity: 0,
      });

      // Timeline choreography
      tl.to(
        dashboardRef.current,
        {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
        },
        0
      )
        .to(
          glowRef.current,
          {
            scale: 1.2,
            opacity: 0.8,
            duration: 1.5,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          metricCardsRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
          },
          0.5
        );
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport */}
      <div
        ref={pinTargetRef}
        className="relative h-screen w-full overflow-hidden bg-[#050b14] text-white flex flex-col justify-between"
      >
        {/* Background Grid & Cyber Glow */}
        <div
          ref={gridLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-15 bg-[linear-gradient(to_right,#00f0ff_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff_1px,transparent_1px)] bg-[size:4rem_4rem]"
        />

        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-cyan-500/20 blur-[150px] z-0"
        />

        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-cyan-400 transition-transform duration-75"
          />
        </div>

        {/* Header Chapter Tracker */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-28 sm:px-10 lg:px-16">
          <div className="flex items-center space-x-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 font-display text-xs font-bold text-cyan-400">
              03
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Vertical Template / SaaS &amp; AI Infrastructure
            </span>
          </div>

          <div className="flex items-center space-x-2 rounded-full glass-pill px-3 py-1 text-xs text-cyan-400 border border-cyan-500/30">
            <Cpu className="h-3.5 w-3.5" />
            <span>Hyperion Cloud UI</span>
          </div>
        </div>

        {/* Center Content Stage */}
        <div className="relative z-10 my-auto grid h-full w-full grid-cols-1 items-center px-6 sm:px-10 lg:grid-cols-12 lg:px-16 gap-8 py-4">
          {/* Left Column: Headline & Metrics */}
          <div className="lg:col-span-5 z-20 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2.5">
              <Zap className="h-3.5 w-3.5" />
              <span>Autonomous Cloud Runtime</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              AUTONOMOUS COMPUTE <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                AT SCALE.
              </span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-sm">
              Engineered for developer toolchains and AI infrastructure startups. Glassmorphic 3D
              dashboard stacks, live telemetry metrics, and interactive command interfaces.
            </p>

            <div className="mt-6 flex items-center space-x-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/work/saas"
                  className="group inline-flex items-center space-x-2.5 rounded-full bg-cyan-400 px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-xl transition-all hover:bg-cyan-300 hover:scale-105"
                  data-cursor="action"
                  data-cursor-text="Launch"
                >
                  <span>See The Product</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </MagneticButton>

              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                /work/saas
              </span>
            </div>
          </div>

          {/* Right Column: Floating 3D Dashboard Mockup */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <div
              ref={dashboardRef}
              className="relative w-full max-w-2xl rounded-3xl glass-card p-6 sm:p-8 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl bg-black/60"
            >
              {/* Dashboard Top Chrome */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs font-mono text-zinc-400">
                    cluster://hyperion-prod-eu-west
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>99.99% UPTIME</span>
                </div>
              </div>

              {/* Dashboard Content Grid */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-cyan-950/30 p-4 border border-cyan-500/20">
                  <div className="text-[10px] uppercase text-zinc-400 font-mono">Active Nodes</div>
                  <div className="mt-1 font-display text-2xl font-bold text-cyan-400">1,482</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">+14% this hr</div>
                </div>

                <div className="rounded-2xl bg-indigo-950/30 p-4 border border-indigo-500/20">
                  <div className="text-[10px] uppercase text-zinc-400 font-mono">Latency</div>
                  <div className="mt-1 font-display text-2xl font-bold text-indigo-300">12.4ms</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">Global P99</div>
                </div>

                <div className="rounded-2xl bg-teal-950/30 p-4 border border-teal-500/20">
                  <div className="text-[10px] uppercase text-zinc-400 font-mono">Tokens/Sec</div>
                  <div className="mt-1 font-display text-2xl font-bold text-teal-300">4.8M</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">Zero throttle</div>
                </div>
              </div>

              {/* Terminal Code Mockup */}
              <div className="mt-4 rounded-2xl bg-black/80 p-4 font-mono text-xs text-zinc-300 border border-white/5 space-y-1.5">
                <div className="text-zinc-500">$ hyperion deploy --cluster auto-mesh --redundancy 3x</div>
                <div className="text-cyan-400">✓ Ingesting Dockerfile &amp; vector dependencies...</div>
                <div className="text-emerald-400">✓ Mesh routing established in 18 regions [TLS 1.3]</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Chapter Tag */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 px-6 py-4 sm:px-10 lg:px-16 text-xs text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="text-cyan-400 font-bold font-mono">03 / 08</span>
            <span className="hidden sm:inline">Chapter 3 of 8: SaaS &amp; Deep Tech Vertical</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Scroll for Fashion Vertical</span>
            <span className="text-cyan-400">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
