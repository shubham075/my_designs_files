import React from "react";
import { notFound } from "next/navigation";
import { Fashion3D } from "@/components/templates/Fashion3D";
import { RealEstate3D } from "@/components/templates/RealEstate3D";
import { Photography3D } from "@/components/templates/Photography3D";

interface Props {
  params: Promise<{ slug: string }>;
}

const EXPERIENCES: Record<string, { title: string; description: string; page: React.ReactNode }> = {
  fashion: {
    title: "Maison V — 3D Atelier",
    description: "A WebGL fashion experience: silk curtain, spiral runway, live fabric lab and particle monogram.",
    page: <Fashion3D />,
  },
  "real-estate": {
    title: "Aura Estates — Casa Lumen 3D",
    description: "A WebGL villa tour: blueprint build, sun study, exploded floor plan, live configurator and neighbourhood isochrones.",
    page: <RealEstate3D />,
  },
  photography: {
    title: "Monolith Studio — 3D Darkroom",
    description: "A WebGL photography experience: lens dive, depth-of-field archive, darkroom developing and long-exposure light painting.",
    page: <Photography3D />,
  },
};

export function generateStaticParams() {
  return Object.keys(EXPERIENCES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const exp = EXPERIENCES[(await params).slug];
  return exp ? { title: exp.title, description: exp.description } : { title: "Not Found" };
}

export default async function Work3DPage({ params }: Props) {
  const exp = EXPERIENCES[(await params).slug];
  if (!exp) notFound();
  return exp.page;
}
