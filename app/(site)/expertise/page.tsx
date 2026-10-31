import type { Metadata } from "next";
import Link from "next/link";

import NavyHeader from "@/components/NavyHeader";
import { ArrowRight } from "@/components/icons";
import { Accent, CtaBand, PageHero } from "@/components/ui";
import { getPracticeAreas } from "@/lib/content";

export const metadata: Metadata = { title: "Expertise" };

const sectors = ["Financial services", "Fintech", "Oil & gas", "Power & renewables", "Telecoms", "Real estate", "Aviation", "Manufacturing", "Public sector"];

export default async function ExpertisePage() {
  const areas = await getPracticeAreas();
  return (
    <>
      <NavyHeader>
        <PageHero
          eyebrow="Expertise"
          title={areas.length ? <>{areas.length} practices. <Accent>One</Accent> standard.</> : <>Our <Accent>expertise</Accent></>}
          intro="Partner-led teams that work across practices, so clients get one joined-up answer rather than a dozen separate opinions."
        />
      </NavyHeader>
      <main>
        <section aria-label="Practice areas" className="container-site pb-28 pt-24">
          {areas.length === 0 && (
            <p role="status" className="border-t border-line pt-8 text-lg text-muted">
              Our practice areas will be listed here shortly. In the meantime, <Link href="/contact" className="underline">tell us what you need</Link>.
            </p>
          )}
          <div className="flex flex-wrap gap-x-12 border-t border-line empty:hidden">
            {areas.map((a, i) => (
              <Link key={a.slug} href={`/expertise/${a.slug}`} className="flex min-w-0 flex-[1_1_520px] items-start gap-6 border-b border-line py-8 text-navy no-underline">
                <span className="w-7 pt-1.5 font-serif text-lg text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-1 flex-col gap-2">
                  <span className="font-serif text-[28px] leading-[1.15]">{a.title}</span>
                  {a.summary && <span className="text-[15px] leading-relaxed text-muted">{a.summary}</span>}
                </span>
                <ArrowRight className="mt-2.5 h-5 w-5" />
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-sand">
          <div className="container-site flex flex-wrap gap-x-20 gap-y-12 py-28">
            <div className="min-w-0 flex-[1_1_300px]">
              <p className="eyebrow mb-4 text-gold-ink">Sectors</p>
              <h2 className="display text-[clamp(36px,4vw,52px)] leading-[1.05]">
                Industries we <Accent gold={false}>know well</Accent>
              </h2>
            </div>
            <ul className="flex min-w-0 flex-[999_1_560px] flex-wrap content-start gap-3">
              {sectors.map((s) => (
                <li key={s} className="border border-[#B9B1A4] px-5 py-3 text-[15px]">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CtaBand divider title={<>Not sure which practice fits? <span className="italic text-gold-ink">Start with a conversation.</span></>} />
      </main>
    </>
  );
}
