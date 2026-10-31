import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFooterSettings } from "@/lib/footer-content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerData = await getFooterSettings();

  return (
    <div className="public-site">
      <Navbar />
      <main className="bg-[#f5f5f5] text-[#0a0a0a]">{children}</main>
      <Footer data={footerData} />
    </div>
  );
}
