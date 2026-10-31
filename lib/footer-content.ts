import prisma from "@/lib/prisma";

export interface FooterQuickLink {
  label: string;
  href: string;
}

export interface FooterSocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
}

export interface FooterContactInfo {
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber?: string;
  emailPrimary: string;
  emailSupport: string;
  officeAddress: string;
  operatingHours: string;
}

export interface FooterSettingsData {
  tagline: string;
  consultationText: string;
  consultationButtonLabel: string;
  consultationButtonHref: string;
  quickLinksTitle: string;
  quickLinks: FooterQuickLink[];
  contact: FooterContactInfo;
  socials: FooterSocialLinks;
  copyrightText: string;
}

export interface LegalPolicyData {
  title: string;
  subtitle: string;
  updatedAt: string;
  bodyText: string;
}

export const defaultFooterSettings: FooterSettingsData = {
  tagline:
    "Precision vertical engineering & elevator manufacturing. Exclusive XIZI partner delivering ISO-certified installations across East Africa.",
  consultationText:
    "Connect with our Nairobi engineering team for certified shaft planning and tenders.",
  consultationButtonLabel: "Request Consultation",
  consultationButtonHref: "/contact",
  quickLinksTitle: "Elevator Systems",
  quickLinks: [
    { label: "Passenger Elevators", href: "/elevators/passenger-elevator" },
    { label: "Home & Villa Lifts", href: "/elevators/home-lift" },
    { label: "Panoramic Glass Lifts", href: "/elevators/panoramic-elevator" },
    { label: "Escalators & Moving Walks", href: "/elevators/escalator-moving-walk" },
    { label: "Hospital Bed Elevators", href: "/elevators/hospital-elevator" },
    { label: "Freight & Car Lifts", href: "/elevators/freight-car-elevator" },
  ],
  contact: {
    phonePrimary: "+254 (0)116 000100",
    phoneSecondary: "+254 (0)713 104907",
    whatsappNumber: "+254 713 104907",
    emailPrimary: "specializedengineeringltd@gmail.com",
    emailSupport: "info@specializedengineering.co.ke",
    officeAddress: "Kilimani Business Hub, Nairobi, Kenya",
    operatingHours: "Mon – Fri: 8:00 AM – 5:00 PM | 24/7 Emergency Dispatch",
  },
  socials: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    tiktok: "https://www.tiktok.com/",
    linkedin: "https://www.linkedin.com/",
  },
  copyrightText: "Specialized Engineering Kenya Ltd. All rights reserved.",
};

export const defaultPrivacyPolicy: LegalPolicyData = {
  title: "Privacy Policy",
  subtitle: "LEGAL & COMPLIANCE",
  updatedAt: "Last updated: October 2026 · Specialized Engineering Kenya Ltd.",
  bodyText: `1. Overview
Specialized Engineering Kenya Ltd. ("we", "our", or "us") respects your privacy and is committed to protecting personal data collected through our corporate website, inquiry forms, and customer service channels.

2. Information We Collect
When you request a quotation, schedule an inspection, or contact our team in Kilimani, Nairobi, we may collect:
• Full name, corporate organization, and designation
• Contact telephone numbers and corporate email address
• Project building specifications, site location, and elevator requirements
• For recruitment, applicant contact details, the vacancy applied for, resume or portfolio links, and any message submitted

3. How Information is Used
Information collected is strictly utilized to prepare technical tender drawings, issue equipment quotations, coordinate on-site field visits, and deliver 24/7 emergency service dispatch. We do not sell or lease personal details to third parties.

4. Recruitment Applications
Recruitment information is used only to assess applications and contact candidates about relevant opportunities. Access is limited to authorized personnel involved in recruitment. We do not sell applicant information and retain it only for as long as it is reasonably needed for recruitment or legal obligations. Please provide secure HTTPS links and avoid including sensitive personal information that is not relevant to your application.

5. Contact Information
For questions concerning this privacy policy or our data management practices, please contact our operations division at specializedengineeringltd@gmail.com or call +254 116 000 100.`,
};

export const defaultTermsOfService: LegalPolicyData = {
  title: "Terms of Service",
  subtitle: "LEGAL & COMPLIANCE",
  updatedAt: "Last updated: October 2026 · Specialized Engineering Kenya Ltd.",
  bodyText: `1. Engineering Mandate
Specialized Engineering Kenya Ltd. provides vertical transportation engineering, procurement, installation, commissioning, modernization, and preventative maintenance services in compliance with Kenyan building standards and international BS EN 81 safety codes.

2. Quotations & Tenders
All preliminary quotations and technical specifications provided via this portal are valid for 30 calendar days from the date of issuance and remain subject to physical site structural verification by our certified field engineering corps.

3. Warranty & Guarantees
All new installations carry our standard 10-year structural workmanship guarantee alongside original manufacturer warranties on certified traction motors, microprocessors, and drive controllers.

4. Jurisdiction
These terms are governed by the laws of the Republic of Kenya. For inquiries, reach out to our legal department at Kilimani Business Hub, Nairobi, Kenya.`,
};

export async function getFooterSettings(): Promise<FooterSettingsData> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { sectionKey: "footer_settings" },
    });

    if (!record || !record.contentJson) {
      return defaultFooterSettings;
    }

    const parsed = JSON.parse(record.contentJson);
    return {
      tagline: parsed.tagline || defaultFooterSettings.tagline,
      consultationText: parsed.consultationText || defaultFooterSettings.consultationText,
      consultationButtonLabel: parsed.consultationButtonLabel || defaultFooterSettings.consultationButtonLabel,
      consultationButtonHref: parsed.consultationButtonHref || defaultFooterSettings.consultationButtonHref,
      quickLinksTitle: parsed.quickLinksTitle || defaultFooterSettings.quickLinksTitle,
      quickLinks: Array.isArray(parsed.quickLinks) && parsed.quickLinks.length > 0
        ? parsed.quickLinks
        : defaultFooterSettings.quickLinks,
      contact: {
        phonePrimary: parsed.contact?.phonePrimary || defaultFooterSettings.contact.phonePrimary,
        phoneSecondary: parsed.contact?.phoneSecondary || defaultFooterSettings.contact.phoneSecondary,
        whatsappNumber: parsed.contact?.whatsappNumber || defaultFooterSettings.contact.whatsappNumber,
        emailPrimary: parsed.contact?.emailPrimary || defaultFooterSettings.contact.emailPrimary,
        emailSupport: parsed.contact?.emailSupport || defaultFooterSettings.contact.emailSupport,
        officeAddress: parsed.contact?.officeAddress || defaultFooterSettings.contact.officeAddress,
        operatingHours: parsed.contact?.operatingHours || defaultFooterSettings.contact.operatingHours,
      },
      socials: {
        facebook: parsed.socials?.facebook ?? defaultFooterSettings.socials.facebook,
        instagram: parsed.socials?.instagram ?? defaultFooterSettings.socials.instagram,
        youtube: parsed.socials?.youtube ?? defaultFooterSettings.socials.youtube,
        tiktok: parsed.socials?.tiktok ?? defaultFooterSettings.socials.tiktok,
        linkedin: parsed.socials?.linkedin ?? defaultFooterSettings.socials.linkedin,
      },
      copyrightText: parsed.copyrightText || defaultFooterSettings.copyrightText,
    };
  } catch (error) {
    console.error("Failed to fetch footer settings from database:", error);
    return defaultFooterSettings;
  }
}

export async function getPrivacyPolicy(): Promise<LegalPolicyData> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { sectionKey: "legal_privacy" },
    });

    if (record) {
      if (record.contentJson) {
        try {
          const parsed = JSON.parse(record.contentJson);
          return {
            title: parsed.title || record.title || defaultPrivacyPolicy.title,
            subtitle: parsed.subtitle || record.subtitle || defaultPrivacyPolicy.subtitle,
            updatedAt: parsed.updatedAt || defaultPrivacyPolicy.updatedAt,
            bodyText: parsed.bodyText || record.bodyText || defaultPrivacyPolicy.bodyText,
          };
        } catch {
          // Fall through
        }
      }

      if (record.bodyText || record.title) {
        return {
          title: record.title || defaultPrivacyPolicy.title,
          subtitle: record.subtitle || defaultPrivacyPolicy.subtitle,
          updatedAt: defaultPrivacyPolicy.updatedAt,
          bodyText: record.bodyText || defaultPrivacyPolicy.bodyText,
        };
      }
    }

    // Fallback: check if legacy privacy_hero / privacy_section_* exist
    const legacyHero = await prisma.siteContent.findUnique({ where: { sectionKey: "privacy_hero" } });
    const legacySections = await prisma.siteContent.findMany({
      where: { sectionKey: { startsWith: "privacy_section_" } },
      orderBy: { sectionKey: "asc" },
    });

    if (legacyHero || legacySections.length > 0) {
      const title = legacyHero?.title || defaultPrivacyPolicy.title;
      const subtitle = legacyHero?.subtitle || defaultPrivacyPolicy.subtitle;
      let updatedAt = defaultPrivacyPolicy.updatedAt;
      if (legacyHero?.contentJson) {
        try {
          const parsed = JSON.parse(legacyHero.contentJson);
          if (parsed.updatedAt) updatedAt = parsed.updatedAt;
        } catch {
          // ignore
        }
      }

      const bodyParts: string[] = [];
      for (const sec of legacySections) {
        const secTitle = sec.title || "";
        const secBody = sec.bodyText || "";
        if (secTitle && secBody) {
          bodyParts.push(`${secTitle}\n${secBody}`);
        } else if (secBody) {
          bodyParts.push(secBody);
        }
      }

      if (bodyParts.length > 0) {
        return {
          title,
          subtitle,
          updatedAt,
          bodyText: bodyParts.join("\n\n"),
        };
      }
    }

    return defaultPrivacyPolicy;
  } catch (error) {
    console.error("Failed to load Privacy Policy:", error);
    return defaultPrivacyPolicy;
  }
}

export async function getTermsOfService(): Promise<LegalPolicyData> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { sectionKey: "legal_terms" },
    });

    if (record) {
      if (record.contentJson) {
        try {
          const parsed = JSON.parse(record.contentJson);
          return {
            title: parsed.title || record.title || defaultTermsOfService.title,
            subtitle: parsed.subtitle || record.subtitle || defaultTermsOfService.subtitle,
            updatedAt: parsed.updatedAt || defaultTermsOfService.updatedAt,
            bodyText: parsed.bodyText || record.bodyText || defaultTermsOfService.bodyText,
          };
        } catch {
          // Fall through
        }
      }

      if (record.bodyText || record.title) {
        return {
          title: record.title || defaultTermsOfService.title,
          subtitle: record.subtitle || defaultTermsOfService.subtitle,
          updatedAt: defaultTermsOfService.updatedAt,
          bodyText: record.bodyText || defaultTermsOfService.bodyText,
        };
      }
    }

    // Fallback: check legacy terms_hero / terms_section_*
    const legacyHero = await prisma.siteContent.findUnique({ where: { sectionKey: "terms_hero" } });
    const legacySections = await prisma.siteContent.findMany({
      where: { sectionKey: { startsWith: "terms_section_" } },
      orderBy: { sectionKey: "asc" },
    });

    if (legacyHero || legacySections.length > 0) {
      const title = legacyHero?.title || defaultTermsOfService.title;
      const subtitle = legacyHero?.subtitle || defaultTermsOfService.subtitle;
      let updatedAt = defaultTermsOfService.updatedAt;
      if (legacyHero?.contentJson) {
        try {
          const parsed = JSON.parse(legacyHero.contentJson);
          if (parsed.updatedAt) updatedAt = parsed.updatedAt;
        } catch {
          // ignore
        }
      }

      const bodyParts: string[] = [];
      for (const sec of legacySections) {
        const secTitle = sec.title || "";
        const secBody = sec.bodyText || "";
        if (secTitle && secBody) {
          bodyParts.push(`${secTitle}\n${secBody}`);
        } else if (secBody) {
          bodyParts.push(secBody);
        }
      }

      if (bodyParts.length > 0) {
        return {
          title,
          subtitle,
          updatedAt,
          bodyText: bodyParts.join("\n\n"),
        };
      }
    }

    return defaultTermsOfService;
  } catch (error) {
    console.error("Failed to load Terms of Service:", error);
    return defaultTermsOfService;
  }
}
