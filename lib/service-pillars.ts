export type ServicePillar = {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
  partsTitle?: string;
  partsDescription?: string;
  partsFeatures?: string[];
};

export const servicePillars: ServicePillar[] = [
  {
    slug: "supply",
    number: "01",
    title: "Supply",
    tagline: "Global systems, selected for your project",
    description:
      "We source and deliver high-quality elevator systems through trusted global manufacturing partners, matching capacity, performance and finishes to each building.",
    icon: "PackageCheck",
    features: [
      "Systems matched to traffic and building requirements",
      "Access to established global manufacturing partners",
      "Coordinated delivery and project planning",
    ],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=85&w=1200",
  },
  {
    slug: "installation",
    number: "02",
    title: "Installation",
    tagline: "Precision engineering, professionally installed",
    description:
      "Our team of 54+ certified local and international engineers installs, tests and commissions each system to project specifications and applicable safety requirements.",
    icon: "Wrench",
    features: [
      "Experienced local and international engineering team",
      "Documented installation, testing and commissioning",
      "Safety checks and coordinated handover",
    ],
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=85&w=1200",
  },
  {
    slug: "maintenance",
    number: "03",
    title: "Maintenance",
    tagline: "Proactive care throughout the equipment lifecycle",
    description:
      "Planned servicing and responsive technical support help keep equipment safe, dependable and available long after installation.",
    icon: "Settings",
    features: [
      "Preventive inspections and scheduled servicing",
      "Responsive fault-finding and technical support",
      "Maintenance records and clear recommendations",
    ],
    image:
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=85&w=1200",
    partsTitle: "Genuine parts, built into maintenance",
    partsDescription:
      "Certified components and genuine spares support reliable repairs, reduce downtime and help extend equipment life.",
    partsFeatures: [
      "Genuine and certified lift components",
      "Parts selected for the installed equipment",
      "Technical support for repair and replacement",
    ],
  },
];

export const serviceLifecycleCopy =
  "One accountable engineering partner takes your project from system selection and supply, through precision installation and commissioning, to proactive maintenance with certified parts. That continuity helps reduce downtime, extend equipment lifespan and keep safety requirements in view.";

export const serviceClientOutcomes = [
  "Reduced unplanned downtime",
  "Longer equipment lifespan",
  "Safety-focused installation and servicing",
  "Single-source accountability",
] as const;

export const serviceFeatures = [
  "Systems selected for project requirements",
  "Coordinated delivery and project planning",
  "Experienced local and international engineers",
  "Documented testing and commissioning",
  "Preventive inspections and scheduled servicing",
  "Responsive fault-finding and technical support",
  "Genuine and certified lift components",
  "Parts selected for the installed equipment",
  "Technical support for repair and replacement",
] as const;
