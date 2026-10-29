import type { Metadata } from "next";
import Link from "next/link";

import NavyHeader from "@/components/NavyHeader";
import { Accent, Picture } from "@/components/ui";
import { getPeople, getPracticeAreas, getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "The Firm" };

const values = [
  ["Clarity", "Advice a board can act on, written in plain language."],
  ["Discretion", "Client matters stay confidential, always."],
  ["Rigour", "Every position tested before it reaches the client."],
  ["Commercial sense", "The law in service of the deal, not in its way."],
];

export default async function FirmPage() {
  const [settings, areas, people] = await Promise.all([getSettings(), getPracticeAreas(), getPeople()]);
  const mp = people.find((p) => p.role === "Managing Partner");
  const stats = [
    [settings.foundedYear, "Founded"],
    [settings.lawyerCount, "Lawyers"],
    [String(areas.length), "Practice areas"],
    [settings.officeCount, "Offices"],
  ];

  return (
    <>
      <NavyHeader>
        <div className="container-site pt-16 lg:pt-24">
          <p className="eyebrow mb-6 text-gold">The Firm</p>
          <h1 className="display max-w-[1000px] text-[clamp(44px,6vw,88px)]">
            A firm built for the <Accent>long view.</Accent>
          </h1>
        </div>
        <div className="container-site pt-[72px]">
          <Picture alt="Office interior" label="[OFFICE / TEAM PHOTO]" className="h-[280px] border border-dashed border-ivory/20 sm:h-[480px]" dark />
        </div>
        <div className="h-24 bg-[linear-gradient(#16213D_0_50%,#F5F3EF_50%_100%)]" />
      </NavyHeader>
      <main>
        <section className="container-site flex flex-wrap gap-x-20 gap-y-12 pb-28 pt-16">
          <div className="min-w-0 flex-[1_1_300px]">
            <p className="eyebrow text-gold-ink">Our story</p>
          </div>
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
            <h2 className="display text-[clamp(30px,3.6vw,46px)] leading-[1.15]">[One-sentence statement of why the firm was founded and who it serves.]</h2>
            <p className="text-[17px] leading-[1.7] text-muted">{settings.firmIntro}</p>
          </div>
        </section>

        <section className="bg-sand">
          <div className="container-site py-28">
            <p className="eyebrow mb-4 text-gold-ink">What guides us</p>
            <h2 className="display mb-14 text-[clamp(40px,5vw,64px)]">
              Our <Accent gold={false}>values</Accent>
            </h2>
            <div className="flex flex-wrap gap-x-12 border-t border-line">
              {values.map(([t, d], i) => (
                <div key={t} className="flex min-w-0 flex-[1_1_260px] flex-col gap-3 py-8">
                  <span className="font-serif text-lg text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-serif text-[30px] font-normal">{t}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Firm at a glance" className="container-site flex flex-wrap gap-x-6 gap-y-10 py-28">
          {stats.map(([n, l]) => (
            <div key={l} className="flex flex-[1_1_240px] flex-col gap-2 border-t border-navy pt-6">
              <span className="font-serif text-[64px] leading-none">{n}</span>
              <span className="text-[15px] text-muted">{l}</span>
            </div>
          ))}
        </section>

        <section className="on-navy bg-navy text-ivory">
          <div className="container-site flex flex-wrap items-center gap-x-20 gap-y-12 py-28">
            <Picture src={mp?.portraitUrl} alt="Managing partner" label="[MANAGING PARTNER PORTRAIT]" className="aspect-[4/5] w-full max-w-[440px] flex-[1_1_320px]" dark />
            <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-8">
              <p className="eyebrow text-gold">From the managing partner</p>
              <blockquote className="font-serif text-[clamp(28px,3vw,40px)] italic leading-[1.25]">“{settings.managingPartnerQuote}”</blockquote>
              <div className="flex flex-col gap-1">
                <span className="text-[17px] font-semibold">{mp?.name ?? "[Full Name]"}</span>
                <span className="text-[15px] text-muted-lighter">Managing Partner</span>
              </div>
            </div>
          </div>
        </section>

        <section className="container-site flex flex-wrap items-end gap-x-20 gap-y-10 py-28">
          <h2 className="display min-w-0 flex-[999_1_600px] text-[clamp(36px,4.6vw,64px)] leading-[1.05]">
            Meet the people <span className="italic text-gold-ink">behind the work.</span>
          </h2>
          <Link href="/people" className="btn min-h-[52px] bg-navy px-7 text-ivory hover:text-gold">
            Our people
          </Link>
        </section>
      </main>
    </>
  );
}
