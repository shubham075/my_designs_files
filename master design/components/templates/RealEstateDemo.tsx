"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ScrollProgress } from "@/components/motion/fx";
import { RealEstateExtras } from "./RealEstateExtras";
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Move,
  ArrowLeft,
  Calendar,
  Check,
  Compass,
  Phone,
  Layers,
  Sparkles,
} from "lucide-react";

const LISTINGS = [
  {
    id: "bel-air",
    title: "The Bel-Air Glass Pavilion",
    location: "Bel Air, Los Angeles",
    price: "$14,500,000",
    beds: 6,
    baths: 8,
    sqft: "9,400",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    desc: "A modernist architectural triumph featuring seamless indoor-outdoor living, infinity edge reflecting pool, and 360° city-to-ocean vistas.",
    architect: "Kappe & Associates",
  },
  {
    id: "tribeca",
    title: "Tribeca Penthouse V",
    location: "Tribeca, New York City",
    price: "$22,800,000",
    beds: 4,
    baths: 5.5,
    sqft: "7,200",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    desc: "A bespoke triplex crowning an iconic cast-iron landmark with private elevator, 2,000 sq ft wraparound terrace, and custom Boffi kitchen.",
    architect: "Studio Sofield",
  },
  {
    id: "malibu",
    title: "Malibu Cliffside Sanctuary",
    location: "Malibu, California",
    price: "$18,200,000",
    beds: 5,
    baths: 6,
    sqft: "8,100",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    desc: "Perched above El Matador Beach with private funicular access, cantilevered glass decks, and geothermal climate control.",
    architect: "Olson Kundig",
  },
];

export const RealEstateDemo: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState(LISTINGS[0]);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [viewingConfirmed, setViewingConfirmed] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    name: "Jonathan Drake",
    email: "jdrake@familyoffice.com",
    date: "Thursday, 27 Aug (11:00 AM)",
    type: "Private Broker-Accompanied Tour",
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setViewingConfirmed(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F4F1EA] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <ScrollProgress color="#18181b" />
      {/* Top Floating Control Dock */}
      <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
        <MagneticButton strength={0.3} className="pointer-events-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-900 backdrop-blur-xl border border-black/10 shadow-xl hover:bg-zinc-950 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </Link>
        </MagneticButton>

        <div className="pointer-events-auto flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 rounded-full bg-black/5 px-3 py-1.5 text-[11px] text-zinc-800 border border-black/10">
            <Sparkles className="h-3 w-3 text-zinc-900" />
            <span>Paper Mode Architecture</span>
          </div>

          <MagneticButton strength={0.3}>
            <button
              onClick={() => setIsViewingModalOpen(true)}
              className="flex items-center space-x-2 rounded-full bg-zinc-950 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:bg-zinc-800 transition-all"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Schedule Viewing</span>
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* Hero Showcase */}
      <section className="relative px-6 pt-36 pb-20 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-8 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">
              <Building2 className="h-3.5 w-3.5 text-zinc-900" />
              <span>Aura Estates • Private Client Portfolio</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-extrabold uppercase tracking-tight text-zinc-950">
              AURA ESTATES
            </h1>
          </div>

          <p className="max-w-md text-sm text-zinc-700 font-normal leading-relaxed">
            Representing the world&apos;s most significant architectural residences and private trophy assets.
          </p>
        </div>

        {/* Featured Property Hero View */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual */}
          <div className="lg:col-span-8 relative h-[380px] sm:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-black/10 bg-zinc-300">
            <Image
              src={selectedProperty.image}
              alt={selectedProperty.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <div className="absolute top-6 left-6 flex items-center space-x-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-zinc-900 backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-rose-600" />
              <span>{selectedProperty.location}</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between text-white gap-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-zinc-300 font-mono">
                  Architect: {selectedProperty.architect}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold">
                  {selectedProperty.title}
                </h2>
              </div>
              <div className="font-display text-3xl font-extrabold text-white">
                {selectedProperty.price}
              </div>
            </div>
          </div>

          {/* Property Spec & Booking Card */}
          <div className="lg:col-span-4 rounded-3xl bg-white p-8 shadow-xl border border-black/10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Specification Sheet
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                  Active Listing
                </span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {selectedProperty.desc}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-zinc-50 p-3 border border-black/5">
                  <Bed className="h-4 w-4 mx-auto text-zinc-600" />
                  <div className="mt-1 font-display text-sm font-bold text-zinc-900">
                    {selectedProperty.beds} Beds
                  </div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 border border-black/5">
                  <Bath className="h-4 w-4 mx-auto text-zinc-600" />
                  <div className="mt-1 font-display text-sm font-bold text-zinc-900">
                    {selectedProperty.baths} Baths
                  </div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 border border-black/5">
                  <Move className="h-4 w-4 mx-auto text-zinc-600" />
                  <div className="mt-1 font-display text-sm font-bold text-zinc-900">
                    {selectedProperty.sqft} sqft
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <MagneticButton strength={0.3} className="w-full">
                <button
                  onClick={() => setIsViewingModalOpen(true)}
                  className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-zinc-950 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:bg-zinc-800 transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Request Private Tour</span>
                </button>
              </MagneticButton>

              <div className="text-center text-[11px] text-zinc-500">
                Direct Principal &amp; Verified Broker Representation Only
              </div>
            </div>
          </div>
        </div>

        {/* Property Selector Roster */}
        <div className="mt-16 border-t border-black/10 pt-12">
          <h3 className="font-display text-xl font-bold uppercase text-zinc-950 mb-6">
            Available Residences in Collection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LISTINGS.map((listing) => (
              <div
                key={listing.id}
                onClick={() => setSelectedProperty(listing)}
                className={`group cursor-pointer rounded-2xl p-4 bg-white border transition-all duration-300 shadow-md ${
                  selectedProperty.id === listing.id
                    ? "border-zinc-950 ring-2 ring-zinc-950"
                    : "border-black/5 hover:border-black/20"
                }`}
              >
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-zinc-200">
                  <Image src={listing.image} alt={listing.title} fill className="object-cover" />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h4 className="font-display text-sm font-bold text-zinc-900">{listing.title}</h4>
                  <span className="font-mono text-xs font-bold text-zinc-950">{listing.price}</span>
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">
                  {listing.location} • {listing.sqft} sq ft
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature scroll moments */}
      <RealEstateExtras />

      {/* Private Viewing Modal */}
      {isViewingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#F4F1EA] p-8 border border-black/10 shadow-2xl">
            {viewingConfirmed ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-white mb-4 animate-bounce">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-zinc-950">
                  Tour Requested
                </h3>
                <p className="mt-2 text-xs text-zinc-700">
                  Our private client advisory will confirm gate access codes and confidential NDA
                  dossier with {bookingForm.name}.
                </p>
                <button
                  onClick={() => {
                    setViewingConfirmed(false);
                    setIsViewingModalOpen(false);
                  }}
                  className="mt-6 rounded-full bg-zinc-950 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-zinc-900" />
                    <h3 className="font-display text-base font-bold uppercase tracking-wider text-zinc-950">
                      Private Viewing Request
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsViewingModalOpen(false)}
                    className="text-xs text-zinc-500 hover:text-black"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="mt-1 w-full rounded-xl bg-white px-4 py-2.5 text-sm text-zinc-900 border border-black/10 focus:border-zinc-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      className="mt-1 w-full rounded-xl bg-white px-4 py-2.5 text-sm text-zinc-900 border border-black/10 focus:border-zinc-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      Preferred Tour Window
                    </label>
                    <select
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="mt-1 w-full rounded-xl bg-white px-3 py-2.5 text-xs text-zinc-900 border border-black/10 focus:border-zinc-900 focus:outline-none"
                    >
                      <option>Thursday, 27 Aug (11:00 AM)</option>
                      <option>Friday, 28 Aug (02:00 PM)</option>
                      <option>Saturday, 29 Aug (04:30 PM - Sunset Tour)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex items-center space-x-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-zinc-950 py-3.5 font-display text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:bg-zinc-800"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsViewingModalOpen(false)}
                    className="rounded-2xl bg-white px-5 py-3.5 text-xs text-zinc-600 hover:text-black border border-black/10"
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
