"use client";

/**
 * Shared chrome for the scroll-driven WebGL demo pages (Fashion3D, RealEstate3D):
 * sticky stations, loader, chapter rail and film overlay.
 */
import React from "react";

/** Each station is SECTION_VH screens tall; its content sticks while the camera lingers. */
export const SECTION_VH = 1.6;

export const scrollToStation = (i: number) =>
  window.scrollTo({ top: i * window.innerHeight * SECTION_VH, behavior: "smooth" });

/** Scroll position in station units, clamped to [0, max]. */
export const stationProgress = (max: number) =>
  Math.min(Math.max(window.scrollY / (window.innerHeight * SECTION_VH), 0), max);

export const Station: React.FC<{ children: React.ReactNode; last?: boolean }> = ({ children, last }) => (
  <section style={{ height: last ? "100vh" : `${SECTION_VH * 100}vh` }}>
    <div className="sticky top-0 h-screen">{children}</div>
  </section>
);

export const PanelLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-2 mt-5 text-[10px] font-semibold uppercase tracking-widest text-white/40">{children}</p>
);

export const FilmOverlay: React.FC = () => (
  <>
    <div
      className="pointer-events-none fixed inset-0 z-[5] opacity-[0.07] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
    <div className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65))]" />
  </>
);

export const Loader: React.FC<{
  title: React.ReactNode;
  note: string;
  progress: number;
  loaded: boolean;
  accent: string;
  bg: string;
}> = ({ title, note, progress, loaded, accent, bg }) => (
  <div
    className={`fixed inset-0 z-[60] flex flex-col items-center justify-center transition-all duration-1000 ${
      loaded ? "pointer-events-none opacity-0" : "opacity-100"
    }`}
    style={{ background: bg }}
  >
    {title}
    <div className="mt-8 h-px w-56 bg-white/10">
      <div className="h-full transition-[width] duration-300" style={{ width: `${progress * 100}%`, background: accent }} />
    </div>
    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
      {note} · {Math.round(progress * 100)}%
    </p>
  </div>
);

export const ChapterRail: React.FC<{ chapters: string[]; active: number; accent: string }> = ({
  chapters,
  active,
  accent,
}) => (
  <nav className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex">
    {chapters.map((c, i) => (
      <button key={c} onClick={() => scrollToStation(i)} className="group flex items-center justify-end gap-3">
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.3em] transition-opacity ${
            active === i ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          }`}
          style={active === i ? { color: accent } : undefined}
        >
          {String(i + 1).padStart(2, "0")} {c}
        </span>
        <span
          className={`block h-px transition-all ${active === i ? "w-10" : "w-4 bg-white/30"}`}
          style={active === i ? { background: accent } : undefined}
        />
      </button>
    ))}
  </nav>
);
