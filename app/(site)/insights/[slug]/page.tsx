import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleActions from "@/components/ArticleActions";
import NavyHeader from "@/components/NavyHeader";
import PortableBody from "@/components/PortableBody";
import ReadingProgress from "@/components/ReadingProgress";
import { NewsletterForm } from "@/components/forms";
import { formatDate, getInsight, getInsights } from "@/lib/content";
import Button from "@/components/Button";

type Props = { params: Promise<{ slug: string }> };

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

export async function generateStaticParams() {
  return (await getInsights()).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const i = await getInsight((await params).slug);
  return { title: i?.title ?? "Insights", description: i?.standfirst };
}

function initials(name: string) {
  return name
    .replace(/[[\]\d]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Simple, single-column reading page (modelled on the "Article — Simple" design). */
export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const [insight, all] = await Promise.all([getInsight(slug), getInsights()]);
  if (!insight) notFound();
  const more = all.filter((i) => i.slug !== slug && (!insight.practice || i.practice?.slug === insight.practice.slug)).slice(0, 3);
  const authors = insight.authors ?? [];

  return (
    <>
      <NavyHeader />
      <ReadingProgress targetId="article" />
      <main>
        <article id="article" className="mx-auto max-w-[720px] px-6 pb-24 pt-[72px] text-lg leading-[1.75] text-[#2A3350]">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-xs text-muted">
            <Link href="/insights" className="text-muted no-underline">Insights</Link>
            {insight.practice && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/expertise/${insight.practice.slug}`} className="text-gold-ink no-underline">
                  {insight.practice.title}
                </Link>
              </>
            )}
          </nav>

          <h1 className="mb-6 font-serif text-[clamp(38px,5vw,56px)] font-normal leading-[1.08] tracking-[-0.015em] text-navy">{insight.title}</h1>
          {insight.standfirst && <p className="mb-8 text-xl leading-relaxed text-muted">{insight.standfirst}</p>}

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-[#DCD8CE] py-[18px] text-sm text-muted">
            <span>
              {authors.map((a, i) => (
                <span key={a.slug}>
                  {i > 0 && (i === authors.length - 1 ? " & " : ", ")}
                  <Link href={`/people/${a.slug}`} className="font-semibold text-navy no-underline">
                    {a.name}
                  </Link>
                </span>
              ))}
            </span>
            <span className="text-xs">
              {insight.kind} · {formatDate(insight.publishedAt)}
              {insight.readingMinutes ? ` · ${insight.readingMinutes} min read` : ""}
            </span>
          </div>

          <ArticleActions slug={insight.slug} title={insight.title} pdfUrl={insight.pdfUrl} />

          {insight.imageUrl && (
            <figure className="relative mb-12 aspect-[16/9] overflow-hidden rounded-md bg-stone">
              <Image src={insight.imageUrl} alt="" fill priority sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
            </figure>
          )}

          <PortableBody value={insight.body} />

          {!!insight.takeaways?.length && (
            <>
              <h2 className="mb-4 mt-12 text-xl font-semibold text-navy">Key takeaways</h2>
              <ul className="mb-7 flex list-disc flex-col gap-2.5 pl-6">
                {insight.takeaways.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          )}

          {!!insight.footnotes?.length && (
            <ol aria-label="Notes" className="mt-12 flex list-none flex-col gap-2.5 border-t border-[#DCD8CE] pt-5 text-sm leading-relaxed text-muted">
              {insight.footnotes.map((f, i) => (
                <li key={i} id={`fn-${i + 1}`} className="italic">
                  <span className="not-italic text-gold-ink">[{ROMAN[i] ?? i + 1}]</span> {f}
                </li>
              ))}
            </ol>
          )}

          {authors.length > 0 && (
            <section aria-label="About the authors" className="mt-14 flex flex-col gap-7">
              {authors.map((a) => (
                <div key={a.slug} className="flex items-start gap-4">
                  <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] text-gold">
                    {initials(a.name) || "NL"}
                  </span>
                  <div className="flex flex-col gap-1 text-[15px] leading-relaxed">
                    <span className="font-semibold text-navy">{a.name}</span>
                    <span className="text-muted">
                      {a.role}
                      {a.shortBio ? ` · ${a.shortBio}` : ""}
                    </span>
                    <span className="flex flex-wrap gap-x-5 gap-y-1">
                      <Link href="/contact" className="text-sm font-semibold">Discuss this with {a.name.split(" ")[0]}</Link>
                      <Link href={`/people/${a.slug}`} className="text-sm font-semibold">View profile</Link>
                    </span>
                  </div>
                </div>
              ))}
            </section>
          )}

          <p className="mt-12 border-t border-[#DCD8CE] pt-5 text-[13px] leading-relaxed text-muted">
            This article is for general information only and is not legal advice.
          </p>
        </article>

        <section className="border-t border-[#DCD8CE]">
          <div className="mx-auto max-w-[720px] px-6 pb-20 pt-16">
            {more.length > 0 && (
              <>
                <h2 className="mb-6 font-serif text-[32px] font-normal leading-tight text-navy">
                  More on {insight.practice?.title ?? "this topic"}
                </h2>
                <ul className="mb-8 border-t border-[#DCD8CE]">
                  {more.map((m) => (
                    <li key={m.slug} className="border-b border-[#DCD8CE]">
                      <Link href={`/insights/${m.slug}`} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-[18px] text-navy no-underline">
                        <span className="text-[17px]">{m.title}</span>
                        <span className="text-xs text-muted">{formatDate(m.publishedAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="flex flex-col gap-6">
              <Button href="/contact" className="self-start">
                Speak with a partner
              </Button>
              <NewsletterForm tone="light" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
