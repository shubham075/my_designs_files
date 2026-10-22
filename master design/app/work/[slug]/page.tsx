import React from "react";
import { notFound } from "next/navigation";
import { VERTICAL_TEMPLATES } from "@/lib/data";
import { RestaurantDemo } from "@/components/templates/RestaurantDemo";
import { RealEstateDemo } from "@/components/templates/RealEstateDemo";
import { SaaSDemo } from "@/components/templates/SaaSDemo";
import { FashionDemo } from "@/components/templates/FashionDemo";
import { FitnessDemo } from "@/components/templates/FitnessDemo";
import { LawDemo } from "@/components/templates/LawDemo";
import { PhotographyDemo } from "@/components/templates/PhotographyDemo";
import { HealthcareDemo } from "@/components/templates/HealthcareDemo";
import { CaseStudyIntro } from "@/components/templates/CaseStudyIntro";

interface WorkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return VERTICAL_TEMPLATES.map((tpl) => ({
    slug: tpl.slug,
  }));
}

export async function generateMetadata({ params }: WorkPageProps) {
  const resolvedParams = await params;
  const template = VERTICAL_TEMPLATES.find((t) => t.slug === resolvedParams.slug);
  if (!template) return { title: "Template Not Found" };

  return {
    title: template.seo.title,
    description: template.seo.description,
    openGraph: {
      title: template.seo.title,
      description: template.seo.description,
      images: [template.heroImage],
      type: "article",
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const resolvedParams = await params;
  const template = VERTICAL_TEMPLATES.find((t) => t.slug === resolvedParams.slug);

  if (!template) {
    notFound();
  }

  let demo: React.ReactNode;

  switch (template.slug) {
    case "restaurant":
      demo = <RestaurantDemo />;
      break;
    case "real-estate":
      demo = <RealEstateDemo />;
      break;
    case "saas":
      demo = <SaaSDemo />;
      break;
    case "fashion":
      demo = <FashionDemo />;
      break;
    case "fitness":
      demo = <FitnessDemo />;
      break;
    case "law":
      demo = <LawDemo />;
      break;
    case "photography":
      demo = <PhotographyDemo />;
      break;
    case "healthcare":
      demo = <HealthcareDemo />;
      break;
    default:
      demo = <RestaurantDemo />;
  }

  return (
    <>
      <CaseStudyIntro template={template} />
      <div id="live-demo">{demo}</div>
    </>
  );
}
