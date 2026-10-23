import { notFound, redirect } from "next/navigation";

const legacyServiceDestinations: Record<string, string> = {
  "spare-parts": "/lift-services#maintenance",
  "lift-modernization": "/lift-services#maintenance",
  "solution-customization": "/lift-services#supply",
};

type Props = { params: Promise<{ slug: string }> };

export default async function LegacyServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const destination = legacyServiceDestinations[slug];

  if (!destination) notFound();
  redirect(destination);
}
