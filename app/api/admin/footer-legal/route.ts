import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import {
  defaultPrivacyPolicy,
  defaultTermsOfService,
  getFooterSettings,
  getPrivacyPolicy,
  getTermsOfService,
  FooterSettingsData,
  LegalPolicyData,
} from "@/lib/footer-content";

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [footer, privacy, terms] = await Promise.all([
      getFooterSettings(),
      getPrivacyPolicy(),
      getTermsOfService(),
    ]);

    return NextResponse.json({
      footer,
      privacy,
      terms,
    });
  } catch (error) {
    console.error("Failed to load footer and legal settings:", error);
    return NextResponse.json(
      { error: "Failed to load footer & legal settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Request body must be an object" }, { status: 400 });
  }

  const { footer, privacy, terms } = body as {
    footer?: Partial<FooterSettingsData>;
    privacy?: Partial<LegalPolicyData>;
    terms?: Partial<LegalPolicyData>;
  };

  try {
    // 1. Upsert Footer Settings
    if (footer) {
      const currentFooter = await getFooterSettings();
      const updatedFooter: FooterSettingsData = {
        tagline: footer.tagline ?? currentFooter.tagline,
        consultationText: footer.consultationText ?? currentFooter.consultationText,
        consultationButtonLabel: footer.consultationButtonLabel ?? currentFooter.consultationButtonLabel,
        consultationButtonHref: footer.consultationButtonHref ?? currentFooter.consultationButtonHref,
        quickLinksTitle: footer.quickLinksTitle ?? currentFooter.quickLinksTitle,
        quickLinks: Array.isArray(footer.quickLinks) ? footer.quickLinks : currentFooter.quickLinks,
        contact: {
          phonePrimary: footer.contact?.phonePrimary ?? currentFooter.contact.phonePrimary,
          phoneSecondary: footer.contact?.phoneSecondary ?? currentFooter.contact.phoneSecondary,
          whatsappNumber: footer.contact?.whatsappNumber ?? currentFooter.contact.whatsappNumber,
          emailPrimary: footer.contact?.emailPrimary ?? currentFooter.contact.emailPrimary,
          emailSupport: footer.contact?.emailSupport ?? currentFooter.contact.emailSupport,
          officeAddress: footer.contact?.officeAddress ?? currentFooter.contact.officeAddress,
          operatingHours: footer.contact?.operatingHours ?? currentFooter.contact.operatingHours,
        },
        socials: {
          facebook: footer.socials?.facebook ?? currentFooter.socials.facebook,
          instagram: footer.socials?.instagram ?? currentFooter.socials.instagram,
          youtube: footer.socials?.youtube ?? currentFooter.socials.youtube,
          tiktok: footer.socials?.tiktok ?? currentFooter.socials.tiktok,
          linkedin: footer.socials?.linkedin ?? currentFooter.socials.linkedin,
        },
        copyrightText: footer.copyrightText ?? currentFooter.copyrightText,
      };

      await prisma.siteContent.upsert({
        where: { sectionKey: "footer_settings" },
        update: {
          title: "Global Footer Configuration",
          contentJson: JSON.stringify(updatedFooter),
        },
        create: {
          sectionKey: "footer_settings",
          title: "Global Footer Configuration",
          contentJson: JSON.stringify(updatedFooter),
        },
      });
    }

    // 2. Upsert Privacy Policy
    if (privacy) {
      const currentPrivacy = await getPrivacyPolicy();
      const updatedPrivacy: LegalPolicyData = {
        title: privacy.title?.trim() || currentPrivacy.title || defaultPrivacyPolicy.title,
        subtitle: privacy.subtitle?.trim() || currentPrivacy.subtitle || defaultPrivacyPolicy.subtitle,
        updatedAt: privacy.updatedAt?.trim() || currentPrivacy.updatedAt || defaultPrivacyPolicy.updatedAt,
        bodyText: privacy.bodyText !== undefined ? privacy.bodyText : (currentPrivacy.bodyText || defaultPrivacyPolicy.bodyText),
      };

      await prisma.siteContent.upsert({
        where: { sectionKey: "legal_privacy" },
        update: {
          title: updatedPrivacy.title,
          subtitle: updatedPrivacy.subtitle,
          bodyText: updatedPrivacy.bodyText,
          contentJson: JSON.stringify(updatedPrivacy),
        },
        create: {
          sectionKey: "legal_privacy",
          title: updatedPrivacy.title,
          subtitle: updatedPrivacy.subtitle,
          bodyText: updatedPrivacy.bodyText,
          contentJson: JSON.stringify(updatedPrivacy),
        },
      });
    }

    // 3. Upsert Terms & Conditions
    if (terms) {
      const currentTerms = await getTermsOfService();
      const updatedTerms: LegalPolicyData = {
        title: terms.title?.trim() || currentTerms.title || defaultTermsOfService.title,
        subtitle: terms.subtitle?.trim() || currentTerms.subtitle || defaultTermsOfService.subtitle,
        updatedAt: terms.updatedAt?.trim() || currentTerms.updatedAt || defaultTermsOfService.updatedAt,
        bodyText: terms.bodyText !== undefined ? terms.bodyText : (currentTerms.bodyText || defaultTermsOfService.bodyText),
      };

      await prisma.siteContent.upsert({
        where: { sectionKey: "legal_terms" },
        update: {
          title: updatedTerms.title,
          subtitle: updatedTerms.subtitle,
          bodyText: updatedTerms.bodyText,
          contentJson: JSON.stringify(updatedTerms),
        },
        create: {
          sectionKey: "legal_terms",
          title: updatedTerms.title,
          subtitle: updatedTerms.subtitle,
          bodyText: updatedTerms.bodyText,
          contentJson: JSON.stringify(updatedTerms),
        },
      });
    }

    // Trigger revalidations
    try {
      revalidatePath("/", "layout");
      revalidatePath("/privacy");
      revalidatePath("/terms");
      revalidatePath("/contact");
    } catch (e) {
      console.warn("Path revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Footer & Legal policies successfully updated",
    });
  } catch (error) {
    console.error("Failed to save footer and legal settings:", error);
    return NextResponse.json(
      { error: "Failed to save changes to the database" },
      { status: 500 }
    );
  }
}
