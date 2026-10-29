import type { Metadata } from "next";

import NavyHeader from "@/components/NavyHeader";
import { ContactForm } from "@/components/forms";
import { Accent, Picture } from "@/components/ui";
import { getPracticeAreas, getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const [settings, areas] = await Promise.all([getSettings(), getPracticeAreas()]);
  const details: [string, React.ReactNode][] = [
    ["Office", <span key="a" className="whitespace-pre-line">{settings.address}</span>],
    ["Phone", <a key="p" href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="no-underline">{settings.phone}</a>],
    ["Email", <a key="e" href={`mailto:${settings.email.replace(/[[\]]/g, "")}`} className="no-underline">{settings.email}</a>],
  ];

  return (
    <>
      <NavyHeader>
        <div className="container-site pb-28 pt-16 lg:pt-24">
          <p className="eyebrow mb-6 text-gold">Contact</p>
          <h1 className="display max-w-[980px] text-[clamp(44px,6vw,88px)]">
            Tell us what you’re <Accent>working on.</Accent>
          </h1>
        </div>
      </NavyHeader>
      <main>
        <section className="container-site flex flex-wrap gap-x-24 gap-y-16 pb-28 pt-24">
          <ContactForm areas={areas.map((a) => a.title)} />
          <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-10">
            {details.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-2.5 border-t border-navy pt-6">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">{label}</span>
                <span className="font-serif text-2xl leading-[1.35]">{value}</span>
              </div>
            ))}
            <div className="flex flex-col gap-2.5 border-t border-navy pt-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">Hours</span>
              <span className="text-base leading-relaxed text-muted">{settings.hours}</span>
            </div>
          </aside>
        </section>
        <section aria-label="Map" className="container-site pb-28">
          {/* Swap for an embedded map once the office address is final. */}
          <Picture alt="Map showing the office location" label="[MAP — office location]" className="h-[380px]" />
        </section>
      </main>
    </>
  );
}
