"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ScrollProgress } from "@/components/motion/fx";
import { RestaurantExtras } from "./RestaurantExtras";
import {
  Wine,
  Utensils,
  Star,
  Clock,
  Calendar,
  Sparkles,
  ArrowLeft,
  Check,
  ChevronRight,
  Phone,
  MapPin,
} from "lucide-react";

export const RestaurantDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"degustation" | "alacarte" | "cellar">("degustation");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    date: "Tonight (8:30 PM)",
    guests: "2 Guests",
    seating: "Chef's Counter",
    name: "Eleanor Vance",
    notes: "Anniversary celebration, champagne pairing requested.",
  });

  const degustationMenu = [
    {
      course: "Amuse-Bouche",
      title: "Royal Osetra Caviar & Smoked Brioche",
      desc: "Chive crème fraîche, 30-year balsamic reduction, gold leaf wafer.",
      pairing: "Dom Pérignon Vintage 2013",
      price: "$45",
    },
    {
      course: "Premier",
      title: "Hokkaido Scallop Crudo",
      desc: "Yuzu kosho gel, compressed green apple, sea grapes, shiso oil.",
      pairing: "Puligny-Montrachet 1er Cru 2020",
      price: "$55",
    },
    {
      course: "Deuxième",
      title: "Pan-Seared Brittany Langoustine",
      desc: "Saffron bisque foam, braised fennel bulb, crispy coral tuile.",
      pairing: "Meursault Domaine des Comtes Lafon 2019",
      price: "$68",
    },
    {
      course: "Plat Principal",
      title: "A5 Miyazaki Wagyu Tenderloin",
      desc: "Black winter truffle jus, pomme purée mousseline, charred morels.",
      pairing: "Château Margaux Premier Grand Cru 2015",
      price: "$110",
    },
    {
      course: "Dessert",
      title: "Grand Cru Valrhona Chocolate Sphere",
      desc: "Smoked hazelnut praline, gold leaf, warm spiced salted caramel ganache.",
      pairing: "Château d'Yquem Sauternes 2011",
      price: "$38",
    },
  ];

  const alaCarteMenu = [
    {
      title: "Dry-Aged Duck Breast",
      desc: "Lavender honey glaze, caramelized baby turnips, sour cherry jus.",
      price: "$64",
    },
    {
      title: "Wild Turbot Fillet",
      desc: "Parsnip velvet, sea urchin emulsion, crispy capers.",
      price: "$72",
    },
    {
      title: "Dry-Aged Prime Ribeye (For Two)",
      desc: "Bone marrow butter, roasted shallots, truffled hand-cut frites.",
      price: "$180",
    },
  ];

  const cellarHighlights = [
    {
      name: "Romanée-Conti Grand Cru 2018",
      region: "Côte de Nuits, Burgundy",
      notes: "Dark berries, violet petals, truffled earth, infinite finish.",
      price: "$4,200",
    },
    {
      name: "Château Petrus 2010",
      region: "Pomerol, Bordeaux",
      notes: "Blackberry liqueur, mocha, velvety tannins, exquisite depth.",
      price: "$3,850",
    },
    {
      name: "Krug Clos d'Ambonnay 2002",
      region: "Champagne, France",
      notes: "Brioche, roasted almonds, hazelnut, crystalline acidity.",
      price: "$2,900",
    },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080204] text-white selection:bg-accent-gold/30">
      <ScrollProgress color="#d4af37" />
      {/* Top Floating Control Dock */}
      <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
        <MagneticButton strength={0.3} className="pointer-events-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 rounded-full glass-panel px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 backdrop-blur-xl transition-all hover:text-white hover:border-accent-gold/40 shadow-2xl"
          >
            <ArrowLeft className="h-4 w-4 text-accent-gold" />
            <span>Return to Portfolio</span>
          </Link>
        </MagneticButton>

        <div className="pointer-events-auto flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 rounded-full glass-pill px-3 py-1.5 text-[11px] text-accent-gold border border-accent-gold/30">
            <Sparkles className="h-3 w-3" />
            <span>Interactive Template Demo</span>
          </div>

          <MagneticButton strength={0.3}>
            <button
              onClick={() => setIsReserveModalOpen(true)}
              className="flex items-center space-x-2 rounded-full bg-accent-crimson px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-transform hover:scale-105"
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>Reserve Table</span>
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden px-6 pt-36 pb-16 sm:px-12 lg:px-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop"
            alt="L'Étoile Noir Restaurant"
            fill
            className="object-cover opacity-35 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080204] via-[#080204]/60 to-black/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center my-auto">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-accent-gold mb-6 border border-accent-gold/20 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md">
            <Star className="h-3.5 w-3.5 fill-accent-gold" />
            <span>Three Michelin Stars • Relais &amp; Châteaux</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-extrabold uppercase tracking-tight text-white leading-none">
            L&apos;ÉTOILE NOIR
          </h1>

          <p className="mt-6 mx-auto max-w-xl text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            Where avant-garde culinary alchemy meets timeless Parisian heritage. An intimate
            16-seat gastronomic salon dedicated to the pinnacle of taste.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton strength={0.35}>
              <button
                onClick={() => setIsReserveModalOpen(true)}
                className="rounded-full bg-gradient-to-r from-accent-gold to-accent-champagne px-8 py-4 font-display text-xs font-extrabold uppercase tracking-widest text-black shadow-2xl transition-all hover:scale-105"
              >
                Book An Experience
              </button>
            </MagneticButton>

            <MagneticButton strength={0.25}>
              <a
                href="#menu"
                className="rounded-full glass-pill px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
              >
                Explore Tasting Menus
              </a>
            </MagneticButton>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 text-xs text-zinc-400 gap-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent-gold" />
              <span>8 Place Vendôme, Paris 1er</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Phone className="h-3.5 w-3.5 text-accent-gold" />
              <span>+33 1 42 68 00 00</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-accent-gold">
            <Clock className="h-3.5 w-3.5" />
            <span>Service: Tue – Sat (19:00 – 23:30)</span>
          </div>
        </div>
      </section>

      {/* Interactive Menu Section */}
      <section id="menu" className="relative z-10 w-full px-6 py-28 sm:px-12 lg:px-20 border-t border-white/10">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-gold">
              Culinary Compositions
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              THE TASTING PROGRAM
            </h2>
            <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto">
              Curated seasonally by Executive Chef Antoine Laurent. Each dish is paired with rare
              domaines from our subterranean cellar.
            </p>

            {/* Menu Category Switcher */}
            <div className="mt-8 inline-flex rounded-full glass-panel p-1.5 border border-white/10">
              <button
                onClick={() => setActiveTab("degustation")}
                className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "degustation"
                    ? "bg-accent-gold text-black shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                7-Course Dégustation
              </button>
              <button
                onClick={() => setActiveTab("alacarte")}
                className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "alacarte"
                    ? "bg-accent-gold text-black shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                À La Carte
              </button>
              <button
                onClick={() => setActiveTab("cellar")}
                className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "cellar"
                    ? "bg-accent-gold text-black shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Cellar Reserves
              </button>
            </div>
          </div>

          {/* Tab 1: 7-Course Degustation */}
          {activeTab === "degustation" && (
            <div className="space-y-6">
              {degustationMenu.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCourse(selectedCourse === idx ? null : idx)}
                  className={`group relative rounded-3xl glass-card p-6 sm:p-8 border transition-all duration-300 cursor-pointer ${
                    selectedCourse === idx
                      ? "border-accent-gold bg-accent-burgundy/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-accent-gold font-bold">
                        {item.course}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-accent-champagne transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <div className="font-display text-lg font-bold text-accent-gold">
                      {item.price}
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="mt-4 flex items-center space-x-2 text-xs text-accent-champagne/80 border-t border-white/5 pt-3">
                    <Wine className="h-3.5 w-3.5 text-accent-gold" />
                    <span>Sommelier Pairing: {item.pairing}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: À La Carte */}
          {activeTab === "alacarte" && (
            <div className="space-y-6">
              {alaCarteMenu.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl glass-card p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-light">{item.desc}</p>
                  </div>
                  <div className="font-display text-xl font-bold text-accent-gold shrink-0">
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Cellar Reserves */}
          {activeTab === "cellar" && (
            <div className="space-y-6">
              {cellarHighlights.map((wine, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl glass-card p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-xs uppercase tracking-widest text-accent-gold font-mono">
                      {wine.region}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white">{wine.name}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-light">{wine.notes}</p>
                  </div>
                  <div className="font-display text-xl font-bold text-accent-gold shrink-0">
                    {wine.price}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reservation CTA Bar */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-accent-burgundy to-[#180309] p-8 sm:p-12 border border-accent-gold/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
                Reserve Your Tasting Salon
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300">
                Reservations open 30 days in advance at 00:00 GMT.
              </p>
            </div>

            <MagneticButton strength={0.35}>
              <button
                onClick={() => setIsReserveModalOpen(true)}
                className="rounded-full bg-accent-gold px-8 py-4 font-display text-xs font-bold uppercase tracking-widest text-black shadow-2xl hover:bg-accent-champagne transition-all"
              >
                Secure Table Now
              </button>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Signature scroll moments */}
      <RestaurantExtras onReserve={() => setIsReserveModalOpen(true)} />

      {/* Reservation Modal Drawer */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel p-8 border border-accent-gold/40 shadow-2xl">
            {bookingConfirmed ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/20 text-accent-gold mb-4 animate-bounce">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white">
                  Table Confirmed
                </h3>
                <p className="mt-2 text-xs text-zinc-300">
                  Your reservation dossier has been dispatched to {bookingForm.name}. A concierge
                  will contact you 24 hours prior to confirm dietary preferences.
                </p>
                <button
                  onClick={() => {
                    setBookingConfirmed(false);
                    setIsReserveModalOpen(false);
                  }}
                  className="mt-6 rounded-full bg-accent-gold px-8 py-3 text-xs font-bold uppercase tracking-wider text-black"
                >
                  Close Confirmation
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2">
                    <Utensils className="h-4 w-4 text-accent-gold" />
                    <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
                      Table Reservation
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReserveModalOpen(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="mt-1 w-full rounded-xl bg-black/50 px-4 py-2.5 text-sm text-white border border-white/10 focus:border-accent-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Date &amp; Time
                      </label>
                      <select
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="mt-1 w-full rounded-xl bg-black/70 px-3 py-2.5 text-xs text-white border border-white/10 focus:border-accent-gold focus:outline-none"
                      >
                        <option>Tonight (8:30 PM)</option>
                        <option>Tomorrow (7:00 PM)</option>
                        <option>Saturday (8:00 PM)</option>
                        <option>Sunday (1:00 PM - Lunch)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Party Size
                      </label>
                      <select
                        value={bookingForm.guests}
                        onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                        className="mt-1 w-full rounded-xl bg-black/70 px-3 py-2.5 text-xs text-white border border-white/10 focus:border-accent-gold focus:outline-none"
                      >
                        <option>2 Guests</option>
                        <option>4 Guests</option>
                        <option>6 Guests (Private Room)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Seating Preference
                    </label>
                    <select
                      value={bookingForm.seating}
                      onChange={(e) => setBookingForm({ ...bookingForm, seating: e.target.value })}
                      className="mt-1 w-full rounded-xl bg-black/70 px-3 py-2.5 text-xs text-white border border-white/10 focus:border-accent-gold focus:outline-none"
                    >
                      <option>Chef&apos;s Counter (Open Kitchen View)</option>
                      <option>Main Dining Salon</option>
                      <option>Subterranean Wine Vault</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex items-center space-x-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-accent-gold to-accent-champagne py-3.5 font-display text-xs font-bold uppercase tracking-widest text-black shadow-xl hover:opacity-95"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReserveModalOpen(false)}
                    className="rounded-2xl glass-pill px-5 py-3.5 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
