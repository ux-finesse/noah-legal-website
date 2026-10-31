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
import Button, { ArrowLink } from "@/components/Button";
import { Picture } from "@/components/ui";
import { ArrowRight } from "@/components/icons";

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
  // Related: same practice area first, topped up with the latest others so there are always 3.
  const others = all.filter((i) => i.slug !== slug);
  const samePractice = insight.practice ? others.filter((i) => i.practice?.slug === insight.practice?.slug) : [];
  const more = [...samePractice, ...others.filter((i) => !samePractice.includes(i))].slice(0, 3);
  const authors = insight.authors ?? [];
  // Insights are sorted newest first: "previous" is the older article, "next" the newer one.
  const idx = all.findIndex((i) => i.slug === slug);
  const prev = idx >= 0 ? all[idx + 1] : undefined;
  const next = idx > 0 ? all[idx - 1] : undefined;

  return (
    <>
      <NavyHeader />
      <ReadingProgress targetId="article" />
      <main>
        <article id="article" className="mx-auto max-w-[1024px] px-6 pb-24 pt-[72px] text-lg leading-[1.75] text-[#2A3350]">
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

          {(prev || next) && (
            <nav aria-label="More articles" className="mt-12 flex flex-wrap gap-4">
              {prev && (
                <Link
                  href={`/insights/${prev.slug}`}
                  rel="prev"
                  className="group flex min-w-0 flex-[1_1_260px] flex-col gap-2 rounded-md border border-[#DCD8CE] p-5 text-navy no-underline transition-colors hover:border-navy"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">
                    <ArrowRight className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                    Previous
                  </span>
                  <span className="font-serif text-xl leading-snug">{prev.title}</span>
                </Link>
              )}
              {next && (
                <Link
                  href={`/insights/${next.slug}`}
                  rel="next"
                  className="group ml-auto flex min-w-0 flex-[1_1_260px] flex-col items-end gap-2 rounded-md border border-[#DCD8CE] p-5 text-right text-navy no-underline transition-colors hover:border-navy"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">
                    Next
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="font-serif text-xl leading-snug">{next.title}</span>
                </Link>
              )}
            </nav>
          )}
        </article>

        {more.length > 0 && (
          <section aria-labelledby="more-heading" className="bg-sand">
            <div className="container-site py-24 lg:py-[104px]">
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                <h2 id="more-heading" className="display text-[clamp(40px,4.4vw,60px)]">
                  More on <span className="italic text-gold-ink">{samePractice.length ? insight.practice?.title : "this topic"}</span>
                </h2>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Button href="/contact">Speak with a partner</Button>
                  <ArrowLink href="/insights">All insights</ArrowLink>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                {more.map((m) => (
                  <Link key={m.slug} href={`/insights/${m.slug}`} className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 text-navy no-underline">
                    <Picture src={m.imageUrl} alt={m.title} label="[IMAGE]" className="h-[220px]" sizes="(min-width: 1024px) 33vw, 100vw" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
                      {m.kind} · {formatDate(m.publishedAt)}
                    </span>
                    <span className="font-serif text-[28px] leading-[1.15]">{m.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section aria-label="Subscribe" className="container-site flex flex-wrap items-center gap-x-20 gap-y-8 py-[88px]">
          <h2 className="display min-w-0 flex-[999_1_480px] text-[clamp(32px,3.6vw,48px)] leading-[1.1]">
            Get insights like this <span className="italic text-gold-ink">in your inbox.</span>
          </h2>
          <div className="min-w-0 flex-[1_1_380px]">
            <NewsletterForm tone="light" />
          </div>
        </section>
      </main>
    </>
  );
}
