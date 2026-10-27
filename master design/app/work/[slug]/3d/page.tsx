import { notFound } from "next/navigation";
import { Fashion3D } from "@/components/templates/Fashion3D";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [{ slug: "fashion" }];
}

export const metadata = {
  title: "Maison V — 3D Atelier",
  description: "A WebGL fashion experience: silk curtain, spiral runway, live fabric lab and particle monogram.",
};

export default async function Work3DPage({ params }: Props) {
  const { slug } = await params;
  if (slug !== "fashion") notFound();
  return <Fashion3D />;
}
