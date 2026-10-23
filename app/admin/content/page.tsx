"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  FileEdit,
  Loader2,
  Save,
} from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";
import {
  serviceClientOutcomes,
  serviceLifecycleCopy,
  servicePillars,
} from "@/lib/service-pillars";

type FieldType = "text" | "textarea" | "image" | "video" | "url" | "icon";
type ContentItem = {
  id?: number;
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  bodyText: string | null;
  imageUrl: string | null;
  contentJson?: string | null;
};
type SectionField = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  initial?: string;
};
type HomeSection = {
  key: string;
  label: string;
  fields: SectionField[];
};

const text = (name: string, label: string, initial = ""): SectionField => ({ name, label, type: "text", initial });
const paragraph = (name: string, label: string, initial = ""): SectionField => ({ name, label, type: "textarea", initial });
const image = (name: string, label: string, initial = ""): SectionField => ({ name, label, type: "image", initial });
const url = (name: string, label: string, initial = ""): SectionField => ({ name, label, type: "url", initial });
const icon = (name: string, label: string, initial = "ShieldCheck"): SectionField => ({ name, label, type: "icon", initial });

const homeSections: HomeSection[] = [
  {
    key: "home_hero",
    label: "Hero",
    fields: [
      text("subtitle", "Eyebrow label", "Kenya's Premier Elevator & Lift Engineering Partner"),
      text("title", "Main heading", "Vertical Transportation Engineered for Excellence"),
      paragraph("bodyText", "Paragraph", "Specialized Engineering Kenya Ltd. delivers world-class elevator design, installation, modernization, and 24/7 preventative maintenance across commercial, residential, and industrial developments in East Africa."),
      image("imageUrl", "Hero image", "/uploads/hero1.jpg"),
      text("buttonLabel", "Button label", "Get Started"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
  {
    key: "home_metrics",
    label: "Impact Metrics",
    fields: [
      text("subtitle", "Eyebrow label", "OUR IMPACT"),
      text("title", "Section heading", "Engineering movement at every level"),
      text("metric1Value", "Metric 1 value", "54+"),
      text("metric1Label", "Metric 1 label", "Engineers"),
      text("metric2Value", "Metric 2 value", "10+"),
      text("metric2Label", "Metric 2 label", "Elevator Manufacturing Companies"),
      text("metric3Value", "Metric 3 value", "500+"),
      text("metric3Label", "Metric 3 label", "Elevators Installed"),
      text("metric4Value", "Metric 4 value", "10+"),
      text("metric4Label", "Metric 4 label", "Years of Experience"),
    ],
  },
  {
    key: "home_systems",
    label: "Vertical Transport Carousel",
    fields: [
      text("subtitle", "Eyebrow label", "VERTICAL TRANSPORT SYSTEMS"),
      text("title", "Section heading", "Engineered for every journey"),
      ...[1, 2, 3, 4].flatMap((number) => [
        text(`product${number}Title`, `System ${number} title`),
        paragraph(`product${number}Description`, `System ${number} description`),
        image(`product${number}Image`, `System ${number} image`),
        url(`product${number}Href`, `System ${number} destination`),
      ]),
    ],
  },
  {
    key: "home_commitment",
    label: "Commitment",
    fields: [
      text("subtitle", "Eyebrow label", "OUR COMMITMENT"),
      paragraph("bodyText", "Commitment statement", "Specialized Engineering is committed to providing the highest engineering rigor in meeting your vertical transportation needs for the future."),
    ],
  },
  {
    key: "home_services",
    label: "Services",
    fields: [
      text("subtitle", "Eyebrow label", "END-TO-END LIFT LIFECYCLE"),
      text("title", "Section heading", "Three services. One accountable partner."),
      paragraph("bodyText", "Lifecycle narrative", serviceLifecycleCopy),
      ...servicePillars.flatMap((service, index) => [
        text(`service${index + 1}Title`, `Service ${index + 1} title`, service.title),
        paragraph(`service${index + 1}Description`, `Service ${index + 1} description`, service.description),
        icon(`service${index + 1}Icon`, `Service ${index + 1} icon`, service.icon),
        ...service.features.map((feature, featureIndex) =>
          text(`service${index + 1}Feature${featureIndex + 1}`, `${service.title} feature ${featureIndex + 1}`, feature)
        ),
      ]),
      text("maintenancePartsTitle", "Maintenance parts subsection heading", servicePillars[2].partsTitle || ""),
      paragraph("maintenancePartsDescription", "Maintenance parts subsection description", servicePillars[2].partsDescription || ""),
      ...(servicePillars[2].partsFeatures || []).map((feature, index) =>
        text(`maintenancePartsFeature${index + 1}`, `Maintenance parts feature ${index + 1}`, feature)
      ),
      ...serviceClientOutcomes.map((outcome, index) =>
        text(`serviceOutcome${index + 1}`, `Client outcome ${index + 1}`, outcome)
      ),
    ],
  },
  {
    key: "home_projects",
    label: "Selected Projects",
    fields: [
      text("subtitle", "Eyebrow label", "SELECTED PROJECTS"),
      text("title", "Section heading", "Our Projects"),
    ],
  },
  {
    key: "home_video_banner",
    label: "Video Banner",
    fields: [
      text("subtitle", "Eyebrow label", "BEYOND THE STANDARD RANGE"),
      text("title", "Banner heading", "Elevator solutions, engineered for every journey."),
      paragraph("bodyText", "Banner paragraph", "From a single home lift to high-capacity commercial systems, we tailor complete vertical transport solutions to the people and places they serve."),
      { name: "videoUrl", label: "Background video source", type: "video", initial: "https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4" },
      text("buttonLabel", "Button label", "Get started"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
  {
    key: "home_standards",
    label: "Standards Bento",
    fields: [
      text("subtitle", "Eyebrow label", "THE SE STANDARD"),
      text("title", "Section heading", "Standards built into every project"),
      text("certificationTitle", "Certifications cell heading", "Certified installation & quality standards"),
      paragraph("certificationDescription", "Certifications cell copy", "Factory-aligned procedures, documented checks, and in-house technical oversight from assembly through handover."),
      icon("certificationIcon", "Certifications icon"),
      text("commissioningTitle", "Commissioning cell heading", "Commissioning timelines"),
      paragraph("commissioningDescription", "Commissioning cell copy", "Clear milestones and coordinated site teams keep delivery aligned with project schedules."),
      icon("commissioningIcon", "Commissioning icon", "Clock3"),
      text("emergencyTitle", "Emergency response cell heading", "Rapid 24/7 emergency response"),
      paragraph("emergencyDescription", "Emergency response cell copy", "Standby technical support for urgent lift issues, day or night."),
      icon("emergencyIcon", "Emergency response icon", "Headphones"),
      text("buttonLabel", "Certifications button label", "View our certifications"),
      url("buttonHref", "Certifications button destination", "/about#certifications"),
    ],
  },
  {
    key: "home_partners",
    label: "Partners Network",
    fields: [
      text("subtitle", "Eyebrow label", "TRUSTED COLLABORATION"),
      text("title", "Section heading", "Our Partners Network"),
      ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((number) => [
        text(`partner${number}Name`, `Partner ${number} name`, number === 1 ? "XIZI" : ""),
        text(`partner${number}Description`, `Partner ${number} descriptor`, number === 1 ? "Elevator manufacturing partner" : ""),
        image(`partner${number}Image`, `Partner ${number} logo image`),
        url(`partner${number}Href`, `Partner ${number} link`),
      ]),
    ],
  },
  {
    key: "home_testimonials",
    label: "Testimonials",
    fields: [
      text("subtitle", "Eyebrow label", "CLIENT PERSPECTIVES"),
      text("title", "Section heading", "Trusted by professionals"),
      ...[1, 2, 3].flatMap((number) => [
        paragraph(`quote${number}`, `Testimonial ${number} quote`),
        text(`name${number}`, `Testimonial ${number} name`),
        text(`role${number}`, `Testimonial ${number} role`),
        image(`image${number}`, `Testimonial ${number} photo`),
      ]),
    ],
  },
  {
    key: "home_faq",
    label: "FAQ",
    fields: [
      text("subtitle", "Eyebrow label", "COMMON INQUIRIES"),
      text("title", "Section heading", "Frequently asked questions"),
      ...[1, 2, 3, 4].flatMap((number) => [
        text(`question${number}`, `Question ${number}`),
        paragraph(`answer${number}`, `Answer ${number}`),
      ]),
    ],
  },
  {
    key: "home_contact",
    label: "Contact",
    fields: [
      text("subtitle", "Eyebrow label", "CONSULTATION AND QUOTE"),
      text("title", "Section heading", "Let’s plan your next lift."),
      paragraph("bodyText", "Introductory paragraph", "Share a few project details and our engineers will help define the right system and next steps."),
    ],
  },
];

const aboutSections: HomeSection[] = [
  {
    key: "about_intro",
    label: "Hero",
    fields: [
      text("subtitle", "Eyebrow label", "CORPORATE PROFILE"),
      text("title", "Main heading", "About Specialized Engineering."),
      paragraph("bodyText", "Introductory copy", "Kenya's trusted vertical transportation engineering firm since 2016. Delivering international ISO safety, direct factory supply, and unwavering reliability."),
      image("imageUrl", "Hero background image"),
      text("buttonLabel", "Button label", "Contact Our Team"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
  {
    key: "about_overview",
    label: "Corporate Overview",
    fields: [
      text("badge", "Badge label", "Established 2016 · Kilimani"),
      text("title", "Section heading", "Pioneering Lift Engineering in East Africa."),
      paragraph("bodyText", "Overview copy"),
      text("subheading", "Supporting heading", "Precision Standards & Certified Execution"),
      paragraph("supportingCopy", "Supporting paragraph"),
      paragraph("secondaryCopy", "Additional paragraph"),
      image("imageUrl", "Overview image"),
      text("buttonLabel", "Button label", "Contact Our Team"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
  {
    key: "about_profile",
    label: "Partnerships",
    fields: [
      text("partnershipLabel", "Partnership eyebrow", "GLOBAL MANUFACTURING NETWORK"),
      text("partnershipTitle", "Partnership heading", "A trusted network of 10+ leading manufacturers"),
      paragraph("partnershipDescription", "Partnership description", "Our relationships with more than 10 international elevator manufacturing companies give clients access to carefully sourced systems, dependable components, and long-term technical support."),
      text("partnershipCount", "Partnership statistic", "10+"),
      text("partnershipProof", "Partnership detail", "Leading international manufacturing companies"),
      ...[1, 2, 3].flatMap((number) => [
        text(`benefit${number}Title`, `Partnership benefit ${number} heading`),
        paragraph(`benefit${number}Description`, `Partnership benefit ${number} copy`),
      ]),
    ],
  },
  {
    key: "about_timeline",
    label: "Company Journey",
    fields: [
      text("badge", "Badge label", "Corporate Milestones"),
      text("title", "Section heading", "The Journey of Excellence"),
      ...[1, 2, 3, 4, 5, 6].flatMap((number) => [
        text(`milestone${number}Year`, `Milestone ${number} year`),
        paragraph(`milestone${number}Event`, `Milestone ${number} description`),
      ]),
    ],
  },
  {
    key: "about_certifications",
    label: "Certifications",
    fields: [
      text("badge", "Badge label", "Quality, safety & compliance"),
      text("title", "Section heading", "Our Certifications"),
      paragraph("bodyText", "Section description"),
      ...[1, 2, 3, 4].flatMap((number) => [
        image(`image${number}`, `Certification image ${number}`),
        text(`caption${number}`, `Certification caption ${number}`),
      ]),
    ],
  },
  {
    key: "about_team",
    label: "Team & Leadership",
    fields: [
      text("badge", "Eyebrow label", "People & practice"),
      text("title", "Team gallery heading", "Our people in practice"),
      paragraph("bodyText", "Team introduction"),
      text("galleryTitle", "Team gallery heading", "Our people in practice"),
      ...[1, 2, 3, 4].flatMap((number) => [
        image(`galleryImage${number}`, `Team gallery image ${number}`),
        text(`galleryCaption${number}`, `Team gallery caption ${number}`),
      ]),
      text("leader1Title", "Leadership position 1", "Head of Sales"),
      text("leader1Name", "Leadership name 1"),
      image("leader1Image", "Leadership portrait 1"),
      text("leader2Title", "Leadership position 2", "Lead Engineer / Managing Director"),
      text("leader2Name", "Leadership name 2"),
      image("leader2Image", "Leadership portrait 2"),
      text("leader3Title", "Leadership position 3", "Operations Manager"),
      text("leader3Name", "Leadership name 3"),
      image("leader3Image", "Leadership portrait 3"),
    ],
  },
  {
    key: "about_careers",
    label: "Careers",
    fields: [
      text("badge", "Eyebrow label", "CAREERS"),
      text("title", "Section heading", "Build your career with us"),
      paragraph("bodyText", "Section introduction"),
      text("buttonLabel", "Button label", "Explore opportunities"),
      url("buttonHref", "Button destination", "#join-us"),
    ],
  },
  {
    key: "about_cta",
    label: "Project Consultation",
    fields: [
      text("subtitle", "Eyebrow label", "Specialized Engineering Kenya Ltd."),
      text("title", "Section heading", "Ready to move your next project forward?"),
      paragraph("bodyText", "Section copy", "Let’s find the right lift or elevator solution for your building."),
      text("buttonLabel", "Button label", "Talk to our team"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
];

const projectsSections: HomeSection[] = [
  {
    key: "projects_hero",
    label: "Hero",
    fields: [
      text("subtitle", "Eyebrow label", "INSTALLATION SHOWCASE"),
      text("title", "Main heading", "Success Projects."),
      paragraph("bodyText", "Introductory copy"),
      image("imageUrl", "Hero background image"),
      { name: "videoUrl", label: "Background video source", type: "video" },
    ],
  },
  {
    key: "projects_gallery",
    label: "Projects Gallery",
    fields: [
      text("badge", "Badge label", "Flagship Portfolio"),
      text("title", "Gallery heading", "Our Projects"),
      paragraph("bodyText", "Gallery introduction"),
      text("buttonLabel", "Button label", "Discuss a project"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
  {
    key: "projects_map",
    label: "Project Map",
    fields: [
      text("title", "Map heading", "Projects across Kenya"),
      paragraph("bodyText", "Map introduction"),
      text("buttonLabel", "Map link label", "View map"),
      url("buttonHref", "Map link destination", "#project-map"),
    ],
  },
];

const elevatorsSections: HomeSection[] = [
  {
    key: "elevators_hero",
    label: "Hero",
    fields: [
      text("subtitle", "Eyebrow label", "CATALOG RANGE"),
      text("title", "Main heading", "Elevator Solutions."),
      paragraph("bodyText", "Introductory copy"),
      image("imageUrl", "Hero background image"),
      { name: "videoUrl", label: "Background video source", type: "video" },
    ],
  },
  {
    key: "elevators_catalog",
    label: "Product Catalogue",
    fields: [
      text("badge", "Badge label", "Product catalogue"),
      text("title", "Section heading", "Find the right system."),
      paragraph("bodyText", "Section introduction"),
    ],
  },
  {
    key: "elevators_spare_parts",
    label: "Spare Parts",
    fields: [
      text("badge", "Badge label", "Parts & components"),
      text("title", "Section heading", "Spare parts."),
      paragraph("bodyText", "Section introduction"),
      text("buttonLabel", "Button label", "Request a spare part"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
  {
    key: "elevators_cta",
    label: "Engineering Consultation",
    fields: [
      text("badge", "Badge label", "ENGINEERING SPECIFICATION"),
      text("title", "Section heading", "Need Custom Dimensions or Low Pit Shafts?"),
      paragraph("bodyText", "Section copy"),
      text("buttonLabel", "Primary button label", "Consult an Engineer"),
      url("buttonHref", "Primary button destination", "/contact"),
      text("secondaryButtonLabel", "Secondary button label", "View Installed Projects"),
      url("secondaryButtonHref", "Secondary button destination", "/projects"),
    ],
  },
];

const servicesSections: HomeSection[] = [
  {
    key: "services_hero",
    label: "Hero",
    fields: [
      text("subtitle", "Eyebrow label", "ENGINEERING & LIFECYCLE"),
      text("title", "Main heading", "Lift services, end to end."),
      paragraph("bodyText", "Introductory copy"),
      image("imageUrl", "Hero background image"),
      { name: "videoUrl", label: "Background video source", type: "video" },
      text("buttonLabel", "Button label", "Explore our services"),
      url("buttonHref", "Button destination", "#supply"),
    ],
  },
  {
    key: "services_lifecycle",
    label: "Lifecycle",
    fields: [
      text("subtitle", "Eyebrow label", "ENGINEERED THROUGH THE LIFECYCLE"),
      text("title", "Section heading", "Every stage strengthens the next."),
      paragraph("bodyText", "Lifecycle introduction"),
      ...[1, 2, 3].flatMap((number) => [
        text(`stage${number}Title`, `Stage ${number} heading`),
        paragraph(`stage${number}Description`, `Stage ${number} description`),
      ]),
      text("assuranceTitle", "Quality assurance heading"),
      paragraph("assuranceCopy", "Quality assurance copy"),
      text("buttonLabel", "Button label", "Plan a service programme"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
  {
    key: "services_outcomes",
    label: "Client Outcomes",
    fields: [
      text("subtitle", "Eyebrow label", "ONE ENGINEERING PARTNER"),
      text("title", "Section heading", "A better lifecycle starts with a conversation."),
      paragraph("bodyText", "Section introduction"),
      text("buttonLabel", "Button label", "Request a consultation"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
];

const newsSections: HomeSection[] = [
  {
    key: "news_hero",
    label: "Hero",
    fields: [
      text("subtitle", "Eyebrow label", "EDITORIAL & INSIGHTS"),
      text("title", "Main heading", "News & Insights."),
      paragraph("bodyText", "Introductory copy"),
      image("imageUrl", "Hero background image"),
      { name: "videoUrl", label: "Background video source", type: "video" },
    ],
  },
  {
    key: "news_featured",
    label: "Featured Stories",
    fields: [
      text("badge", "Badge label", "Featured Coverage"),
      text("title", "Section heading", "Featured Stories."),
    ],
  },
  {
    key: "news_archive",
    label: "Article Archive",
    fields: [
      text("badge", "Badge label", "Industry Archive"),
      text("title", "Section heading", "Archive & Insights."),
    ],
  },
  {
    key: "news_cta",
    label: "Media Inquiries",
    fields: [
      text("badge", "Badge label", "Direct Press & Media"),
      text("title", "Section heading", "Media & Technical Inquiries."),
      paragraph("bodyText", "Section copy"),
      text("buttonLabel", "Button label", "Contact Press Desk"),
      url("buttonHref", "Button destination", "/contact"),
    ],
  },
];

const contactSections: HomeSection[] = [
  {
    key: "contact_hero",
    label: "Hero",
    fields: [
      text("subtitle", "Eyebrow label", "DIRECT COMMUNICATIONS"),
      text("title", "Main heading", "LET’S BUILD TOGETHER."),
      paragraph("bodyText", "Introductory copy"),
      image("imageUrl", "Hero background image"),
      { name: "videoUrl", label: "Background video source", type: "video" },
    ],
  },
  {
    key: "contact_details",
    label: "Contact Details & Inquiry",
    fields: [
      text("badge", "Badge label", "Kilimani Headquarters"),
      text("title", "Section heading", "Consult Our Engineering Team"),
      paragraph("bodyText", "Section introduction"),
      text("formBadge", "Form eyebrow", "Inquiry Portal"),
      text("formTitle", "Form heading", "Send an Inquiry"),
      paragraph("formDescription", "Form description"),
      text("submitLabel", "Submit button label", "Submit Inquiry"),
      ...[1, 2, 3, 4, 5].flatMap((number) => [
        text(`contact${number}Label`, `Contact ${number} label`),
        text(`contact${number}Value`, `Contact ${number} value`),
        url(`contact${number}Href`, `Contact ${number} link`),
      ]),
    ],
  },
];

const legalSections = (page: "privacy" | "terms", legalItems: string[]): HomeSection[] => [
  {
    key: `${page}_hero`,
    label: "Hero",
    fields: [
      text("subtitle", "Eyebrow label", "LEGAL & COMPLIANCE"),
      text("title", "Main heading", page === "privacy" ? "Privacy Policy" : "Terms of Service"),
      text("updatedAt", "Last updated label", "Last updated: October 2026 · Specialized Engineering Kenya Ltd."),
      image("imageUrl", "Hero background image"),
    ],
  },
  ...legalItems.map((item, index): HomeSection => ({
    key: `${page}_section_${index + 1}`,
    label: item,
    fields: [
      text("title", "Section heading", item),
      paragraph("bodyText", "Section copy"),
    ],
  })),
];

const privacySections = legalSections("privacy", [
  "1. Overview",
  "2. Information We Collect",
  "3. How Information is Used",
  "4. Recruitment Applications",
  "5. Contact Information",
]);
const termsSections = legalSections("terms", [
  "1. Engineering Mandate",
  "2. Quotations & Tenders",
  "3. Warranty & Guarantees",
  "4. Jurisdiction",
]);

const contentSections = [
  ...homeSections,
  ...aboutSections,
  ...projectsSections,
  ...elevatorsSections,
  ...servicesSections,
  ...newsSections,
  ...contactSections,
  ...privacySections,
  ...termsSections,
];

const pages = [
  { name: "Home", href: "/", sections: homeSections },
  { name: "Projects", href: "/projects", sections: projectsSections },
  { name: "Elevators", href: "/elevators", sections: elevatorsSections },
  { name: "Services", href: "/lift-services", sections: servicesSections },
  { name: "About", href: "/about", sections: aboutSections },
  { name: "News", href: "/news", sections: newsSections },
  { name: "Contact", href: "/contact", sections: contactSections },
  { name: "Privacy", href: "/privacy", sections: privacySections },
  { name: "Terms", href: "/terms", sections: termsSections },
];

const iconOptions = ["PackageCheck", "Wrench", "Settings", "ShieldCheck", "Clock3", "Headphones", "BadgeCheck", "ClipboardCheck", "DraftingCompass"];

function getInitialValues(section: HomeSection, item?: ContentItem): Record<string, string> {
  const values = Object.fromEntries(section.fields.map((field) => [field.name, field.initial || ""]));
  const savedValues: Record<string, string> = {};
  if (item?.contentJson) {
    try {
      const parsed: unknown = JSON.parse(item.contentJson);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value === "string") {
            values[key] = value;
            savedValues[key] = value;
          }
        }
      } else {
        console.error(`Invalid saved content for ${item.sectionKey}.`);
      }
    } catch (error) {
      console.error(`Failed to parse saved content for ${item.sectionKey}:`, error);
    }
  }
  for (const key of ["title", "subtitle", "bodyText", "imageUrl"]) {
    const value = item?.[key as keyof ContentItem];
    if (typeof value === "string" && !Object.hasOwn(savedValues, key)) values[key] = value;
  }
  if (section.key === "home_projects" && values.title === "Projects in motion") {
    values.title = "Our Projects";
  }
  return values;
}

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, Record<string, string>>>(() =>
    Object.fromEntries(contentSections.map((section) => [section.key, getInitialValues(section)]))
  );
  const [selectedPage, setSelectedPage] = useState("Home");
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const requestedSection = new URLSearchParams(window.location.search).get("section");
    if (requestedSection && contentSections.some((section) => section.key === requestedSection)) {
      // Read the query after hydration so the server and browser render the same initial accordion state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenSection(requestedSection);
    }

    fetch("/api/admin/content")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load content sections.");
        return data;
      })
      .then((data) => {
        if (!active) return;
        if (!Array.isArray(data.contents)) {
          throw new Error("The content service returned an invalid response.");
        }
        const items = data.contents as ContentItem[];
        setValues(Object.fromEntries(
          contentSections.map((section) => [
            section.key,
            getInitialValues(section, items.find((item) => item.sectionKey === section.key)),
          ])
        ));
        setError(null);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load content sections.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateField = (sectionKey: string, field: string, value: string) => {
    setValues((current) => ({
      ...current,
      [sectionKey]: { ...current[sectionKey], [field]: value },
    }));
  };

  const saveSection = async (section: HomeSection) => {
    const sectionValues = values[section.key] || {};
    setSavingKey(section.key);
    setError(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: section.key,
          title: sectionValues.title || null,
          subtitle: sectionValues.subtitle || null,
          bodyText: sectionValues.bodyText || null,
          imageUrl: sectionValues.imageUrl || null,
          contentJson: JSON.stringify(sectionValues),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save changes.");
      setSavedKey(section.key);
      window.setTimeout(() => setSavedKey((current) => current === section.key ? null : current), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving content.");
    } finally {
      setSavingKey(null);
    }
  };

  const renderField = (section: HomeSection, field: SectionField) => {
    const value = values[section.key]?.[field.name] || "";
    const inputClass = "w-full border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]";

    return (
      <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
        <label htmlFor={`${section.key}-${field.name}`} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#475569]">
          {field.label}
        </label>
        {field.type === "image" ? (
          <ImageDropzone value={value} onChange={(next) => updateField(section.key, field.name, next)} />
        ) : field.type === "textarea" ? (
          <textarea
            id={`${section.key}-${field.name}`}
            rows={4}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => updateField(section.key, field.name, event.target.value)}
            className={inputClass}
          />
        ) : field.type === "icon" ? (
          <select
            id={`${section.key}-${field.name}`}
            value={value}
            onChange={(event) => updateField(section.key, field.name, event.target.value)}
            className={inputClass}
          >
            {iconOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        ) : (
          <input
            id={`${section.key}-${field.name}`}
            type="text"
            value={value}
            placeholder={field.placeholder || (field.type === "video" ? "https://example.com/video.mp4" : undefined)}
            onChange={(event) => updateField(section.key, field.name, event.target.value)}
            className={inputClass}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 p-12 text-[#64748B]">
        <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
        <span>Loading site content…</span>
      </div>
    );
  }

  const currentPage = pages.find((page) => page.name === selectedPage) || pages[0];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-6 md:p-8">
      <header className="border-b border-[#E2E8F0] pb-6">
        <div className="mb-2 inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
          <FileEdit className="h-3.5 w-3.5" />
          Site &amp; Content
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] md:text-3xl">Manage website content</h1>
        <p className="mt-2 text-sm text-[#475569]">Edit homepage copy and media without changing the site’s layout or design system.</p>
      </header>

      {error && <div role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-2">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Pages</h2>
          {pages.map((page) => (
            <div key={page.name}>
              <button
                type="button"
                onClick={() => {
                  setSelectedPage(page.name);
                  setOpenSection(null);
                }}
                className={`flex w-full items-center justify-between border px-3 py-3 text-left text-sm font-semibold transition-colors ${
                  selectedPage === page.name
                    ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                    : "border-[#E2E8F0] bg-white text-[#334155] hover:border-[#94A3B8]"
                }`}
              >
                {page.name}
                {page.sections && <ChevronDown className={`h-4 w-4 transition-transform ${selectedPage === page.name ? "rotate-180" : ""}`} />}
              </button>
              {selectedPage === page.name && page.sections && (
                <div className="ml-3 space-y-1 border-l border-[#CBD5E1] py-2 pl-3">
                  {page.sections.map((section) => (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setOpenSection(section.key)}
                      className={`block w-full border-l-2 py-2 pl-3 text-left text-xs transition-colors ${
                        openSection === section.key
                          ? "border-[#2563EB] font-semibold text-[#2563EB]"
                          : "border-transparent text-[#475569] hover:text-[#2563EB]"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        <div className="min-w-0">
          <h2 className="mb-4 text-xl font-semibold text-[#0F172A]">{currentPage.name} page sections</h2>
          {currentPage.sections ? (
            <div className="space-y-3">
              {currentPage.sections.map((section) => {
                const isOpen = openSection === section.key;
                return (
                  <section key={section.key} className="border border-[#E2E8F0] bg-white">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenSection(isOpen ? null : section.key)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                    >
                      <span className="font-semibold text-[#0F172A]">{section.label}</span>
                      <ChevronDown className={`h-4 w-4 text-[#64748B] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#E2E8F0] p-4 md:p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                          {section.fields.map((field) => renderField(section, field))}
                        </div>
                        <div className="mt-6 flex justify-end border-t border-[#E2E8F0] pt-5">
                          <button
                            type="button"
                            onClick={() => saveSection(section)}
                            disabled={savingKey === section.key}
                            className="inline-flex min-h-11 items-center gap-2 bg-[#2563EB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
                          >
                            {savingKey === section.key ? <Loader2 className="h-4 w-4 animate-spin" /> : savedKey === section.key ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {savingKey === section.key ? "Saving…" : savedKey === section.key ? "Saved" : "Save section"}
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="border border-[#E2E8F0] bg-white p-5 text-sm leading-6 text-[#475569]">
              This page’s structured records are managed in its dedicated admin area. Homepage content is edited section by section here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
