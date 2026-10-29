import Footer from "@/components/Footer";
import { getPracticeAreas, getSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, areas] = await Promise.all([getSettings(), getPracticeAreas()]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-navy">
        Skip to content
      </a>
      {children}
      <Footer settings={settings} areas={areas} />
    </>
  );
}
