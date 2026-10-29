import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import NavyHeader from "@/components/NavyHeader";
import PortableBody from "@/components/PortableBody";
import { ArrowRight } from "@/components/icons";
import { CtaBand, PageHero } from "@/components/ui";
import { formatDate, getInsights, getPeople, getPracticeArea, getPracticeAreas } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPracticeAreas()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = await getPracticeArea((await params).slug);
  return { title: area?.title ?? "Expertise" };
}

export default async function PracticeAreaPage({ params }: Props) {
  const { slug } = await params;
  const [area, people, insights] = await Promise.all([getPracticeArea(slug), getPeople(), getInsights()]);
  if (!area) notFound();
  const team = people.filter((p) => p.practices?.some((x) => x.slug === slug) || p.practice === area.title).slice(0, 4);
  const related = insights.filter((i) => i.practice?.slug === slug).slice(0, 3);

  return (
    <>
      <NavyHeader>
        <PageHero eyebrow="Expertise" title={area.title} intro={area.summary} />
      </NavyHeader>
      <main>
        <section className="container-site flex flex-wrap gap-x-20 gap-y-12 py-24">
          <aside className="min-w-0 flex-[1_1_280px]">
            <Link href="/expertise" className="link-arrow text-navy">
              <ArrowRight className="h-4 w-4 rotate-180" /> All practice areas
            </Link>
          </aside>
          <article className="min-w-0 max-w-[760px] flex-[999_1_560px] text-lg leading-[1.75] text-[#2A3350]">
            <PortableBody value={area.body} />
          </article>
        </section>

        {team.length > 0 && (
          <section className="bg-sand">
            <div className="container-site py-24">
              <h2 className="display mb-10 text-[clamp(32px,4vw,48px)]">Key contacts</h2>
              <div className="flex flex-wrap gap-6">
                {team.map((p) => (
                  <Link key={p.slug} href={`/people/${p.slug}`} className="flex min-w-0 flex-[1_1_240px] flex-col gap-1 border-t border-navy pt-5 text-navy no-underline">
                    <span className="font-serif text-2xl">{p.name}</span>
                    <span className="text-sm text-muted">{p.role}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="container-site py-24">
            <h2 className="display mb-10 text-[clamp(32px,4vw,48px)]">Related insights</h2>
            <ul className="border-t border-line">
              {related.map((i) => (
                <li key={i.slug} className="border-b border-line">
                  <Link href={`/insights/${i.slug}`} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-5 text-navy no-underline">
                    <span className="font-serif text-2xl">{i.title}</span>
                    <span className="text-sm text-muted">{formatDate(i.publishedAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <CtaBand title={<>Talk to our {area.title} team.</>} />
      </main>
    </>
  );
}
