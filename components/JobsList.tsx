"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { formatDate } from "@/lib/format";
import type { Job } from "@/lib/types";

import PortableBody from "./PortableBody";
import { ArrowRight } from "./icons";
import Button from "./Button";

const DURATION = 300; // ms — keep in sync with duration-300 below

/** Open-roles list; each row opens a side drawer with the full job description. */
export default function JobsList({ jobs }: { jobs: Job[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // `shown` drives the slide/fade; the drawer stays mounted until the exit animation ends.
  const [shown, setShown] = useState(false);
  const job = jobs.find((j) => j.slug === openSlug) ?? null;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const open = (slug: string, el: HTMLElement) => {
    lastTrigger.current = el;
    show(slug);
    history.replaceState(null, "", `#${slug}`);
  };

  const show = useCallback((slug: string) => {
    if (timer.current) clearTimeout(timer.current);
    setOpenSlug(slug);
    // Mount first, then flip on the next frame so the transition runs.
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  }, []);

  const close = useCallback(() => {
    setShown(false);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenSlug(null), DURATION);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Open from a shared link (#job-slug).
  useEffect(() => {
    const fromHash = () => {
      const s = decodeURIComponent(window.location.hash.slice(1));
      if (jobs.some((j) => j.slug === s)) show(s);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [jobs, show]);

  // Escape to close, lock page scroll, focus the close button.
  useEffect(() => {
    if (!job) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [job, close]);

  if (jobs.length === 0) {
    return <p className="border-t border-[#B9B1A4] pt-8 text-lg text-muted">No open roles right now — we still welcome speculative applications.</p>;
  }

  return (
    <>
      <ul className="border-t border-[#B9B1A4]">
        {jobs.map((j) => (
          <li key={j.slug} className="border-b border-[#B9B1A4]">
            <button
              type="button"
              onClick={(e) => open(j.slug, e.currentTarget)}
              aria-haspopup="dialog"
              className="flex w-full flex-wrap items-center gap-x-8 gap-y-3 py-7 text-left text-navy hover:text-gold-ink"
            >
              <span className="flex-[999_1_320px] font-serif text-[28px]">{j.title}</span>
              <span className="flex-[1_1_140px] text-[15px] text-muted">{j.location}</span>
              <span className="flex-[1_1_140px] text-[15px] text-muted">{j.type}</span>
              <span className="inline-flex items-center gap-2 text-[15px] font-bold">
                View role <ArrowRight />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {job && (
        <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
          <div
            aria-hidden="true"
            onClick={close}
            className={`absolute inset-0 bg-navy/60 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
              shown ? "opacity-100" : "opacity-0"
            }`}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-drawer-title"
            className={`relative flex h-full w-full max-w-[640px] flex-col overflow-hidden bg-ivory shadow-[-24px_0_48px_rgba(0,0,0,0.25)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              shown ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 motion-reduce:translate-x-0"
            }`}
          >
            <header className="on-navy bg-navy px-6 pb-8 pt-6 text-ivory sm:px-10">
              <div className="mb-8 flex items-center justify-between gap-4">
                <span className="eyebrow text-gold">{job.department ?? "Open role"}</span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close job details"
                  className="inline-flex h-11 w-11 items-center justify-center border border-ivory/30 text-ivory hover:border-gold hover:text-gold"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M5 5l14 14M19 5 5 19" />
                  </svg>
                </button>
              </div>
              <h2 id="job-drawer-title" className="display text-[clamp(32px,4vw,44px)] leading-[1.08]">
                {job.title}
              </h2>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                {[
                  ["Location", job.location],
                  ["Type", job.type],
                  ["Experience", job.experience],
                  ["Closes", job.closingDate ? formatDate(job.closingDate) : undefined],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1">
                      <dt className="text-xs uppercase tracking-[0.18em] text-muted-lighter">{k}</dt>
                      <dd className="font-semibold">{v}</dd>
                    </div>
                  ))}
              </dl>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-10 text-[17px] leading-[1.7] text-[#2A3350] sm:px-10">
              {job.summary && <p className="mb-8 font-serif text-2xl leading-snug text-navy">{job.summary}</p>}
              <PortableBody value={job.description} />
              <List title="What you’ll do" items={job.responsibilities} />
              <List title="What we’re looking for" items={job.requirements} />
              <List title="What we offer" items={job.benefits} />
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-ivory px-6 py-5 sm:px-10">
              <span className="text-sm text-muted">Questions? careers@noahlegal.com</span>
              <Button href={job.applyUrl || "mailto:careers@noahlegal.com"}>Apply for this role</Button>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-10">
      <h3 className="mb-4 border-b border-line pb-3 text-lg font-semibold text-navy">{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((it) => (
          <li key={it} className="flex gap-3">
            <span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 shrink-0 bg-gold" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
