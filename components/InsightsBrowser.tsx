"use client";

import Link from "next/link";
import { useState } from "react";

import { formatDate } from "@/lib/format";
import type { InsightCard } from "@/lib/types";

import { Picture } from "./ui";
import Button from "./Button";

const tabs = [
  { label: "All", kinds: null },
  { label: "Articles", kinds: ["Article"] },
  { label: "Legal updates", kinds: ["Legal update"] },
  { label: "Newsletters", kinds: ["Newsletter"] },
  { label: "Podcasts", kinds: ["Podcast"] },
  { label: "Events", kinds: ["Event"] },
] as const;

const PAGE = 6;

export default function InsightsBrowser({ insights }: { insights: InsightCard[] }) {
  const [tab, setTab] = useState(0);
  const [shown, setShown] = useState(PAGE);
  const kinds = tabs[tab].kinds as readonly string[] | null;
  const list = kinds ? insights.filter((i) => kinds.includes(i.kind)) : insights;
  const [lead, ...rest] = list;

  return (
    <>
      <div className="container-site -mt-14 pb-2">
        <div role="tablist" aria-label="Insight types" className="flex flex-wrap gap-2.5">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              type="button"
              aria-selected={tab === i}
              onClick={() => {
                setTab(i);
                setShown(PAGE);
              }}
              className={`min-h-[44px] rounded-md px-5 text-sm font-semibold transition-colors ${tab === i ? "bg-gold text-navy" : "border border-ivory/30 bg-navy text-ivory hover:border-ivory"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {!lead && (
        <p className="container-site pb-28 pt-24 text-lg text-muted" role="status">
          {insights.length === 0 ? "Our first insights are on the way. Subscribe below to get them by email." : "Nothing published in this category yet."}
        </p>
      )}

      {lead && (
        <section aria-label="Featured" className="container-site pt-24">
          <Link href={`/insights/${lead.slug}`} className="flex flex-wrap items-center gap-x-14 gap-y-10 text-navy no-underline">
            <Picture src={lead.imageUrl} alt={lead.title} label="[FEATURED IMAGE]" className="h-[300px] min-w-0 flex-[999_1_560px] sm:h-[420px]" />
            <span className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
                Featured · {lead.kind} · {formatDate(lead.publishedAt)}
              </span>
              <span className="font-serif text-[clamp(32px,3.4vw,44px)] leading-[1.1]">{lead.title}</span>
              {lead.standfirst && <span className="text-base leading-relaxed text-muted">{lead.standfirst}</span>}
            </span>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section aria-label="Latest" className="container-site pb-28 pt-24">
          <h2 className="mb-8 border-b border-line pb-4 font-serif text-4xl">Latest</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-x-6 gap-y-12">
            {rest.slice(0, shown).map((i) => (
              <Link key={i.slug} href={`/insights/${i.slug}`} className="flex min-w-0 flex-col gap-4 text-navy no-underline">
                <Picture src={i.imageUrl} alt={i.title} label="[IMAGE]" className="h-[220px]" sizes="(min-width: 1024px) 33vw, 100vw" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
                  {i.kind} · {formatDate(i.publishedAt)}
                </span>
                <span className="font-serif text-[26px] leading-[1.2]">{i.title}</span>
              </Link>
            ))}
          </div>
          {rest.length > shown && (
            <div className="mt-16 flex justify-center">
              <Button variant="outline" onClick={() => setShown((n) => n + PAGE)}>
                Load more
              </Button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
