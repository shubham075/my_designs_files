export type ProjectStatus = "concept" | "in-progress" | "live";

export interface ProjectCaseStudy {
  problem: string;
  solution: string;
  designDirection: string;
  nextStep: string;
}

export interface VerticalTemplate {
  id: string;
  slug: string;
  number: string;
  name: string;
  vertical: string;
  tagline: string;
  description: string;
  heroImage: string;
  mockupImage: string;
  screenshots: string[];
  themeColor: string;
  accentColor: string;
  badge: string;
  projectType: "Concept Template" | "Client Project" | "Design Exploration";
  status: ProjectStatus;
  liveUrl?: string;
  repositoryUrl?: string;
  services: string[];
  techStack: string[];
  features: string[];
  metrics: { label: string; value: string }[];
  caseStudy: ProjectCaseStudy;
  seo: {
    title: string;
    description: string;
  };
}

export const VERTICAL_TEMPLATES: VerticalTemplate[] = [
  {
    id: "restaurant",
    slug: "restaurant",
    number: "01",
    name: "L'Etoile Noir",
    vertical: "Restaurant & Fine Dining",
    tagline: "Taste, Reimagined.",
    description:
      "A cinematic fine-dining concept for premium restaurants, chef-led bistros, and cocktail bars that need a high-emotion reservation experience.",
    heroImage: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    mockupImage: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop",
    ],
    themeColor: "#23050c",
    accentColor: "#d4af37",
    badge: "Concept Template",
    projectType: "Concept Template",
    status: "concept",
    services: ["Experience Design", "Reservation Flow", "Menu Storytelling", "Motion System"],
    techStack: ["Next.js", "GSAP", "Lenis", "Tailwind CSS"],
    features: ["Interactive tasting menu", "Table booking flow", "Wine cellar showcase", "Chef story section"],
    metrics: [
      { label: "Current Stage", value: "Concept" },
      { label: "Primary Goal", value: "Bookings" },
      { label: "Motion Level", value: "High" },
    ],
    caseStudy: {
      problem:
        "Premium restaurants often look generic online and fail to make the dining experience feel valuable before a guest books.",
      solution:
        "Build a rich editorial journey with a clear reservation path, immersive food imagery, and motion that supports appetite and trust.",
      designDirection:
        "Dark cinematic color, gold accents, full-bleed food photography, slow reveal typography, and high-contrast booking CTAs.",
      nextStep: "Connect the booking flow to a real reservation provider and replace concept images with venue-owned photography.",
    },
    seo: {
      title: "Fine Dining Website Concept | Aethelgard Studio",
      description: "A premium restaurant website concept with interactive menu storytelling and reservation-focused UX.",
    },
  },
  {
    id: "real-estate",
    slug: "real-estate",
    number: "02",
    name: "Aura Estates",
    vertical: "Luxury Real Estate & Architecture",
    tagline: "Spaces That Breathe Elegance.",
    description:
      "A calm luxury property concept with editorial listing pages, floorplan moments, private-viewing CTAs, and image-led storytelling.",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    mockupImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    ],
    themeColor: "#f4f1ea",
    accentColor: "#1a1a1a",
    badge: "Paper Mode Concept",
    projectType: "Concept Template",
    status: "concept",
    services: ["Listing UX", "Lead Capture", "Property Gallery", "CMS Structure"],
    techStack: ["Next.js", "Framer Motion", "GSAP", "Tailwind CSS"],
    features: ["Interactive floorplan section", "Property filmstrip", "Viewing scheduler", "Neighborhood highlights"],
    metrics: [
      { label: "Current Stage", value: "Concept" },
      { label: "Primary Goal", value: "Leads" },
      { label: "Motion Level", value: "Medium" },
    ],
    caseStudy: {
      problem: "Luxury listings need more than static cards; buyers need space, rhythm, and clear private inquiry routes.",
      solution: "Use calm editorial pacing, large imagery, and structured property data that can later come from a CMS.",
      designDirection: "Paper-toned surfaces, architectural spacing, refined typography, and subtle scroll-scrubbed media.",
      nextStep: "Connect real listing data, property availability, and CRM lead routing.",
    },
    seo: {
      title: "Luxury Real Estate Website Concept | Aethelgard Studio",
      description: "A luxury real estate website concept for property galleries, floorplans, and private viewing leads.",
    },
  },
  {
    id: "saas",
    slug: "saas",
    number: "03",
    name: "Hyperion Cloud",
    vertical: "SaaS & AI Infrastructure",
    tagline: "Autonomous Compute at Scale.",
    description:
      "A high-energy SaaS concept with layered dashboard visuals, developer-led CTAs, pricing structure, and realtime product storytelling.",
    heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    mockupImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    ],
    themeColor: "#050b14",
    accentColor: "#00f0ff",
    badge: "Glass UI Concept",
    projectType: "Concept Template",
    status: "concept",
    services: ["Product Landing", "Pricing UX", "Dashboard Mockups", "Developer CTA"],
    techStack: ["Next.js", "Three.js", "GSAP", "Tailwind CSS"],
    features: ["Command palette concept", "Live metric simulation", "Pricing matrix", "API code preview"],
    metrics: [
      { label: "Current Stage", value: "Concept" },
      { label: "Primary Goal", value: "Demos" },
      { label: "Motion Level", value: "High" },
    ],
    caseStudy: {
      problem: "Technical SaaS products often struggle to explain value quickly without looking like a generic dashboard template.",
      solution: "Combine product narrative, realistic interface surfaces, and a direct path to demos, docs, and pricing.",
      designDirection: "Deep black base, neon cyan accents, layered glass panels, terminal cues, and fast product-led transitions.",
      nextStep: "Replace simulated metrics with live product data and connect signup/demo booking workflows.",
    },
    seo: {
      title: "SaaS Website Concept | Aethelgard Studio",
      description: "A SaaS and AI infrastructure website concept with product storytelling, dashboard visuals, and demo CTAs.",
    },
  },
  {
    id: "fashion",
    slug: "fashion",
    number: "04",
    name: "Maison V",
    vertical: "Fashion & Haute Couture",
    tagline: "Form Follows Desire.",
    description:
      "An editorial commerce concept with lookbook pacing, product hotspots, high-contrast imagery, and runway-inspired transitions.",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    mockupImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    ],
    themeColor: "#0f0f11",
    accentColor: "#e5e5e5",
    badge: "Editorial Concept",
    projectType: "Concept Template",
    status: "concept",
    services: ["Lookbook UX", "Commerce Flow", "Art Direction", "Motion Design"],
    techStack: ["Next.js", "Framer Motion", "GSAP", "Tailwind CSS"],
    features: ["Scroll-driven lookbook", "Product hotspot tags", "Runway media section", "Quick checkout concept"],
    metrics: [
      { label: "Current Stage", value: "Concept" },
      { label: "Primary Goal", value: "Product Desire" },
      { label: "Motion Level", value: "High" },
    ],
    caseStudy: {
      problem: "Fashion sites can become either too plain for a premium brand or too experimental for shopping.",
      solution: "Balance editorial drama with clear product discovery, collection hierarchy, and purchase moments.",
      designDirection: "Monochrome editorial layout, sharp crop imagery, magnetic details, and runway-style section rhythm.",
      nextStep: "Connect real product inventory, collection CMS, cart, and checkout provider.",
    },
    seo: {
      title: "Fashion Website Concept | Aethelgard Studio",
      description: "An editorial fashion website concept for lookbooks, product discovery, and premium commerce.",
    },
  },
  {
    id: "fitness",
    slug: "fitness",
    number: "05",
    name: "Kinetix Lab",
    vertical: "Performance Fitness & Athletics",
    tagline: "Unleash Pure Velocity.",
    description:
      "A kinetic fitness concept with bold typography, class scheduling, trainer previews, and membership-focused interaction design.",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    mockupImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
    ],
    themeColor: "#0d1109",
    accentColor: "#bcfd00",
    badge: "Kinetic Concept",
    projectType: "Concept Template",
    status: "concept",
    services: ["Membership UX", "Schedule Design", "Trainer Profiles", "Performance Motion"],
    techStack: ["Next.js", "GSAP", "Lenis", "Tailwind CSS"],
    features: ["Velocity typography", "Class schedule grid", "Trainer cards", "Membership enrollment concept"],
    metrics: [
      { label: "Current Stage", value: "Concept" },
      { label: "Primary Goal", value: "Memberships" },
      { label: "Motion Level", value: "High" },
    ],
    caseStudy: {
      problem: "Fitness brands need energy, but users still need fast access to schedules, trainers, and membership options.",
      solution: "Use high-impact motion in hero and campaign sections while keeping conversion flows direct and scannable.",
      designDirection: "Black base, electric lime accents, compressed athletic typography, and velocity-reactive transitions.",
      nextStep: "Connect class schedule APIs, trainer CMS, and payment provider.",
    },
    seo: {
      title: "Fitness Website Concept | Aethelgard Studio",
      description: "A performance fitness website concept with kinetic typography, schedules, and membership conversion UX.",
    },
  },
  {
    id: "law",
    slug: "law",
    number: "06",
    name: "Vanguard & Sterling",
    vertical: "Corporate & Elite Law Practice",
    tagline: "Prestige. Precision. Proven.",
    description:
      "A restrained legal concept with strong credibility structure, practice-area pages, attorney profiles, and consultation routing.",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    mockupImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop",
    ],
    themeColor: "#0a0c10",
    accentColor: "#c4a47c",
    badge: "Prestige Concept",
    projectType: "Concept Template",
    status: "concept",
    services: ["Trust Architecture", "Practice Pages", "Consultation UX", "Content Structure"],
    techStack: ["Next.js", "Framer Motion", "Tailwind CSS", "Schema Metadata"],
    features: ["Partner profiles", "Consultation request", "Practice area dossiers", "Case archive structure"],
    metrics: [
      { label: "Current Stage", value: "Concept" },
      { label: "Primary Goal", value: "Consultations" },
      { label: "Motion Level", value: "Low" },
    ],
    caseStudy: {
      problem: "Legal sites must communicate trust and authority without feeling outdated or visually flat.",
      solution: "Prioritize credibility, clear practice navigation, and confident editorial presentation over excessive decoration.",
      designDirection: "Deep neutral palette, architectural photography, serif-like display rhythm, and measured transitions.",
      nextStep: "Add attorney bios, real credentials, jurisdiction disclaimers, and compliant contact handling.",
    },
    seo: {
      title: "Law Firm Website Concept | Aethelgard Studio",
      description: "A premium law firm website concept for practice areas, attorney profiles, and consultation inquiries.",
    },
  },
  {
    id: "photography",
    slug: "photography",
    number: "07",
    name: "Monolith Studio",
    vertical: "Fine Art Photography & Studio",
    tagline: "Capturing the Ineffable.",
    description:
      "A gallery-forward photography concept with full-bleed imagery, series presentation, inquiry routing, and print-order structure.",
    heroImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    mockupImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1200&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    ],
    themeColor: "#070709",
    accentColor: "#ffffff",
    badge: "Gallery Concept",
    projectType: "Concept Template",
    status: "concept",
    services: ["Portfolio UX", "Gallery System", "Inquiry Flow", "Visual Direction"],
    techStack: ["Next.js", "GSAP", "Lenis", "Tailwind CSS"],
    features: ["Masonry gallery concept", "Print inquiry route", "Series detail pages", "Image zoom concept"],
    metrics: [
      { label: "Current Stage", value: "Concept" },
      { label: "Primary Goal", value: "Inquiries" },
      { label: "Motion Level", value: "Medium" },
    ],
    caseStudy: {
      problem: "Creative portfolios need immersive presentation while still guiding visitors toward booking or buying.",
      solution: "Build a restrained gallery system where imagery leads and interaction supports discovery.",
      designDirection: "Full-bleed black gallery, minimal chrome, soft parallax, and quiet collector-focused CTAs.",
      nextStep: "Add real photo series, image licensing rules, print SKUs, and inquiry handling.",
    },
    seo: {
      title: "Photography Portfolio Concept | Aethelgard Studio",
      description: "A fine art photography portfolio concept with gallery storytelling and inquiry-focused UX.",
    },
  },
  {
    id: "healthcare",
    slug: "healthcare",
    number: "08",
    name: "Aura Longevity Clinic",
    vertical: "Precision Medicine & Longevity",
    tagline: "Healthcare, Humanized.",
    description:
      "A healthcare concept focused on calm trust, service clarity, physician credibility, and appointment conversion.",
    heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
    mockupImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1200&auto=format&fit=crop",
    ],
    themeColor: "#0a1215",
    accentColor: "#10b981",
    badge: "Clinical Concept",
    projectType: "Concept Template",
    status: "concept",
    services: ["Healthcare UX", "Appointment Flow", "Service Pages", "Trust Design"],
    techStack: ["Next.js", "Framer Motion", "Tailwind CSS", "Schema Metadata"],
    features: ["Appointment flow concept", "Physician profile structure", "Diagnostics panel", "Service education pages"],
    metrics: [
      { label: "Current Stage", value: "Concept" },
      { label: "Primary Goal", value: "Appointments" },
      { label: "Motion Level", value: "Low" },
    ],
    caseStudy: {
      problem: "Healthcare websites must feel modern while staying calm, accessible, and easy to navigate.",
      solution: "Use service clarity, professional imagery, strong hierarchy, and gentle interactions focused on appointments.",
      designDirection: "Dark clinical palette, green trust accent, soft motion, accessible spacing, and clear contact routes.",
      nextStep: "Add verified providers, service content, compliance review, and secure appointment integrations.",
    },
    seo: {
      title: "Healthcare Website Concept | Aethelgard Studio",
      description: "A precision healthcare website concept for services, provider trust, and appointment conversion.",
    },
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discover & Deconstruct",
    subtitle: "Brand DNA & Audience Psychology",
    description:
      "Map the client vertical, buyer intent, core conversion path, and content model before visual design starts.",
    tags: ["Market Scan", "Content Model", "Wireframing"],
  },
  {
    number: "02",
    title: "Editorial Design System",
    subtitle: "Typography, Space & Visual Weight",
    description:
      "Create a distinct visual system with reusable sections, real image slots, clear hierarchy, and project-specific art direction.",
    tags: ["Design Tokens", "Responsive Layout", "Visual Assets"],
  },
  {
    number: "03",
    title: "Kinetic Motion Engine",
    subtitle: "GSAP, Lenis & Performance Budgets",
    description:
      "Use high-impact motion where it matters most while keeping transforms GPU-friendly and reducing background work on small devices.",
    tags: ["ScrollTrigger", "Lenis", "Reduced Motion"],
  },
  {
    number: "04",
    title: "Production & Conversion",
    subtitle: "Dynamic Next.js Portfolio",
    description:
      "Ship with dynamic project data, SEO metadata, contact capture, responsive QA, and a clear path to CMS or database content.",
    tags: ["App Router", "SEO", "Contact Flow"],
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Concept review note: the strongest parts are the vertical-specific art direction, motion quality, and clear path from demo to client pitch.",
    author: "Internal Design Review",
    role: "Portfolio Concept Audit",
    rating: 5,
    tag: "Concept Note",
  },
  {
    quote:
      "This format is designed to become real case studies later. Replace the concept notes with verified client quotes only after projects launch.",
    author: "Content System",
    role: "Dynamic Project Guidance",
    rating: 5,
    tag: "Honest Proof",
  },
  {
    quote:
      "Each template now has a reusable project structure: problem, solution, design direction, services, tech stack, and next implementation step.",
    author: "Case Study Model",
    role: "Portfolio Data Layer",
    rating: 5,
    tag: "Dynamic Data",
  },
];

export const STATS = [
  { number: "8", suffix: "", label: "Concept Verticals" },
  { number: "4", suffix: "", label: "Case Study Fields" },
  { number: "60", suffix: " FPS", label: "Animation Target" },
  { number: "1", suffix: "", label: "Dynamic Data Source" },
];

export const VERTICAL_TAGS = [
  "RESTAURANT & FINE DINING",
  "LUXURY REAL ESTATE",
  "SAAS & TECH STARTUP",
  "FASHION & HAUTE COUTURE",
  "PERFORMANCE FITNESS",
  "CORPORATE & LAW",
  "CREATIVE STUDIO",
  "CLINIC & HEALTHCARE",
  "BOUTIQUE HOSPITALITY",
  "AI & DEEP TECH",
];
