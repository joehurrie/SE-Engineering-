import type { SiteContent } from "@prisma/client";
import prisma from "@/lib/prisma";

export type HomeContentSection = Record<string, string> & { _entryCount?: number };
export type HomeContentMap = Record<string, HomeContentSection>;

export function getContentValue(section: HomeContentSection | undefined, key: string, fallback: string): string {
  return section?.[key]?.trim() || fallback;
}

export function getSiteContentMap(contents: SiteContent[]): HomeContentMap {
  const sections: HomeContentMap = {};

  for (const item of contents) {
    let section: HomeContentSection = {};

    if (item.contentJson) {
      try {
        const parsed: unknown = JSON.parse(item.contentJson);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          section = Object.fromEntries(
            Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string")
          ) as HomeContentSection;
          // Preserve numeric _entryCount for repeatable sections
          const countVal = (parsed as Record<string, unknown>)["_entryCount"];
          if (typeof countVal === "number" && countVal > 0) {
            section._entryCount = countVal;
          }
        } else {
          console.error(`Invalid site content format for "${item.sectionKey}".`);
        }
      } catch (error) {
        console.error(`Failed to parse site content for "${item.sectionKey}":`, error);
      }
    }

    if (item.title && !section.title) section.title = item.title;
    if (item.subtitle && !section.subtitle) section.subtitle = item.subtitle;
    if (item.bodyText && !section.bodyText) section.bodyText = item.bodyText;
    if (item.imageUrl && !section.imageUrl) section.imageUrl = item.imageUrl;

    sections[item.sectionKey] = section;
  }

  return sections;
}

export function getHomeContentMap(contents: SiteContent[]): HomeContentMap {
  return getSiteContentMap(contents);
}

export async function loadSiteContentMap(sectionKeys: string[]): Promise<HomeContentMap> {
  if (sectionKeys.length === 0) return {};
  const contents = await prisma.siteContent.findMany({
    where: { sectionKey: { in: sectionKeys } },
  });
  return getSiteContentMap(contents);
}
