"use client";

import React, { useState } from "react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { CheckCircle, Mail, Sparkles, Send } from "lucide-react";

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    vertical: "Restaurant & Fine Dining",
    scope: "Concept Template Customization",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section
      id="contact"
      className="relative z-10 w-full overflow-hidden bg-[#0A0A0B] px-6 py-28 sm:px-10 lg:px-16 border-t border-white/10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-tr from-accent-burgundy/25 via-accent-gold/15 to-transparent blur-[160px] motion-reduce:hidden"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center space-x-3">
            <span className="font-display text-sm font-bold text-accent-gold">04</span>
            <span className="text-xs uppercase tracking-widest text-zinc-400">
              / Pitch &amp; Implementation
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-400">
            <Mail className="h-3.5 w-3.5 text-accent-gold" />
            <span>Project Inquiry</span>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-accent-gold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Turn Concepts Into Client Work</span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
                READY TO TURN A <br />
                <span className="text-gradient-gold">CONCEPT REAL?</span>
              </h2>

              <p className="mt-6 text-sm text-zinc-300 font-light leading-relaxed">
                Use these concept templates as pitch starters, then replace the data, visuals,
                integrations, and case-study copy with real client content as each project ships.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Dynamic project data structure ready for CMS or database migration",
                  "GSAP, Lenis, and Framer Motion tuned around high-impact sections",
                  "Clear path for real assets, SEO metadata, contact handling, and analytics",
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3 text-xs text-zinc-300">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-gold/20 text-accent-gold">
                      <CheckCircle className="h-3.5 w-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-lg glass-pill p-4 text-xs text-zinc-400">
              <span className="font-mono text-accent-gold">Direct Contact:</span>{" "}
              <a href="mailto:studio@aethelgard.agency" className="text-white underline ml-1">
                studio@aethelgard.agency
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-lg glass-card p-8 sm:p-12 border border-white/15 backdrop-blur-2xl">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/20 text-accent-gold mb-6 motion-safe:animate-bounce">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-white tracking-tight">
                    Inquiry Prepared
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-zinc-300">
                    This demo stores the form state locally for now. Connect it to an email
                    service, CRM, or API route before using it in production.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-full glass-pill px-6 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Alexander Wright"
                        className="mt-1.5 w-full rounded-lg bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 border border-white/10 focus:border-accent-gold focus:outline-none focus:ring-1 focus:ring-accent-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="alexander@brand.com"
                        className="mt-1.5 w-full rounded-lg bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 border border-white/10 focus:border-accent-gold focus:outline-none focus:ring-1 focus:ring-accent-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Target Vertical
                      </label>
                      <select
                        value={formState.vertical}
                        onChange={(e) => setFormState({ ...formState, vertical: e.target.value })}
                        className="mt-1.5 w-full rounded-lg bg-black/70 px-4 py-3 text-sm text-white border border-white/10 focus:border-accent-gold focus:outline-none transition-colors"
                      >
                        <option value="Restaurant & Fine Dining">Restaurant &amp; Fine Dining</option>
                        <option value="Luxury Real Estate">Luxury Real Estate</option>
                        <option value="SaaS & Startup">SaaS &amp; Startup</option>
                        <option value="Fashion & E-Commerce">Fashion &amp; Haute Couture</option>
                        <option value="Performance Fitness">Performance Fitness</option>
                        <option value="Corporate & Law">Corporate &amp; Law</option>
                        <option value="Creative Studio">Creative Studio</option>
                        <option value="Healthcare & Clinic">Healthcare &amp; Clinic</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Project Scope
                      </label>
                      <select
                        value={formState.scope}
                        onChange={(e) => setFormState({ ...formState, scope: e.target.value })}
                        className="mt-1.5 w-full rounded-lg bg-black/70 px-4 py-3 text-sm text-white border border-white/10 focus:border-accent-gold focus:outline-none transition-colors"
                      >
                        <option value="Concept Template Customization">Concept Template Customization</option>
                        <option value="Full Client Website Build">Full Client Website Build</option>
                        <option value="CMS / Dynamic Data Setup">CMS / Dynamic Data Setup</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Project Vision &amp; Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell us about the brand, real content sources, integrations, timeline, or launch goal..."
                      className="mt-1.5 w-full rounded-lg bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-600 border border-white/10 focus:border-accent-gold focus:outline-none focus:ring-1 focus:ring-accent-gold transition-colors resize-none"
                    />
                  </div>

                  <MagneticButton strength={0.35} className="w-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group flex w-full items-center justify-center space-x-3 rounded-lg bg-gradient-to-r from-accent-gold via-accent-champagne to-accent-gold px-8 py-4 font-display text-xs font-extrabold uppercase tracking-widest text-black shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-accent-gold/30 disabled:opacity-50"
                      data-cursor="action"
                      data-cursor-text="Send"
                    >
                      {isSubmitting ? (
                        <span>Preparing Inquiry...</span>
                      ) : (
                        <>
                          <span>Submit Pitch Inquiry</span>
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
