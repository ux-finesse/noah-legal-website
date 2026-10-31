import Link from "next/link";

import Header from "@/components/Header";
import { Accent, Picture, SectionHead } from "@/components/ui";
import { formatDate, getInsights, getPeople, getPracticeAreas, getSettings } from "@/lib/content";
import Button, { ArrowLink } from "@/components/Button";

export default async function HomePage() {
  const [areas, people, insights, settings] = await Promise.all([getPracticeAreas(), getPeople(), getInsights(), getSettings()]);
  const featuredAreas = (areas.filter((a) => a.featured).length ? areas.filter((a) => a.featured) : areas).slice(0, 6);
  const featuredPeople = (people.filter((p) => p.featured).length ? people.filter((p) => p.featured) : people).slice(0, 4);
  const [lead, ...rest] = [...insights.filter((i) => i.featured), ...insights.filter((i) => !i.featured)];

  return (
    <>
      {/* HERO — full-bleed video with the header over it */}
      <header className="on-navy relative flex min-h-[820px] flex-col overflow-hidden bg-navy text-ivory">
        <video
          className="absolute inset-0 h-full w-full bg-navy-800 object-cover"
          src="/media/noah-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,33,61,0.72)_0%,rgba(22,33,61,0.45)_45%,rgba(22,33,61,0.85)_100%)]"
        />
        <div className="relative z-10 flex min-h-[820px] flex-col">
          <Header areas={areas} />
          <div id="main" className="container-site mt-auto flex flex-wrap items-end gap-14 pb-[120px] pt-24">
            <div className="min-w-0 flex-[999_1_560px]">
              <p className="eyebrow mb-7 text-gold">Commercial law · Lagos, Nigeria</p>
              <h1 className="display text-[clamp(52px,7vw,104px)] leading-[0.98]">
                Clear counsel.
                <br />
                <Accent>Steady</Accent> outcomes.
              </h1>
            </div>
            <div className="min-w-0 flex-[1_1_320px] pb-3">
              <p className="mb-8 text-lg leading-relaxed text-muted-light">
                NOAH LEGAL advises businesses, lenders and investors on the transactions, disputes and regulation that shape their growth.
              </p>
              <Button variant="gold" href="/expertise">
                Our expertise
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* FIRM INTRO */}
        <section className="container-site flex flex-wrap gap-x-20 gap-y-12 py-28">
          <div className="min-w-0 flex-[1_1_300px]">
            <p className="eyebrow text-gold-ink">The Firm</p>
          </div>
          <div className="min-w-0 flex-[999_1_560px]">
            <h2 className="display mb-8 text-[clamp(34px,4vw,52px)] leading-[1.12] tracking-[-0.01em]">
              We take on complex matters and make them <Accent gold={false}>simple to act on</Accent> — with discretion, rigour and a commercial eye.
            </h2>
            <p className="text-[17px] leading-[1.7] text-muted">{settings.firmIntro}</p>
            <ArrowLink href="/firm" className="mt-7">
              About the firm
            </ArrowLink>
          </div>
        </section>

        {/* EXPERTISE */}
        {featuredAreas.length > 0 && (
        <section className="bg-sand">
          <div className="container-site py-28">
            <SectionHead eyebrow="Expertise" title={<>Where we <Accent gold={false}>practise</Accent></>} href="/expertise" linkLabel="All practice areas" />
            <div className="flex flex-wrap border-t border-line">
              {featuredAreas.map((a, i) => (
                <Link
                  key={a.slug}
                  href={`/expertise/${a.slug}`}
                  className="flex min-w-0 flex-[1_1_360px] gap-6 border-b border-line py-8 pr-6 text-navy no-underline"
                >
                  <span className="pt-1.5 font-serif text-lg text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-col gap-2.5">
                    <span className="font-serif text-[28px] leading-[1.15]">{a.title}</span>
                    {a.summary && <span className="text-[15px] leading-relaxed text-muted">{a.summary}</span>}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* PEOPLE */}
        {featuredPeople.length > 0 && (
        <section className="container-site py-28">
          <SectionHead eyebrow="Our People" title={<>The <Accent gold={false}>counsel</Accent> behind the work</>} href="/people" linkLabel="All lawyers" />
          <div className="flex flex-wrap gap-x-6 gap-y-8">
            {featuredPeople.map((p) => (
              <Link key={p.slug} href={`/people/${p.slug}`} className="flex min-w-0 flex-[1_1_260px] flex-col gap-[18px] text-navy no-underline">
                <Picture src={p.portraitUrl} alt={`Portrait of ${p.name}`} label="[PORTRAIT]" className="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, 100vw" />
                <span className="flex flex-col gap-1.5">
                  <span className="font-serif text-2xl">{p.name}</span>
                  <span className="text-sm text-muted">{p.role}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
        )}

        {/* INSIGHTS */}
        {lead && (
          <section className="on-navy bg-navy text-ivory">
            <div className="container-site py-28">
              <SectionHead dark eyebrow="Insights" title={<>Thinking ahead of <Accent>the market</Accent></>} href="/insights" linkLabel="All insights" />
              <div className="flex flex-wrap gap-6">
                <Link href={`/insights/${lead.slug}`} className="flex min-w-0 flex-[999_1_520px] flex-col gap-5 text-ivory no-underline">
                  <Picture src={lead.imageUrl} alt={lead.title} label="[FEATURE IMAGE]" className="h-80" dark />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-lighter">
                    {lead.kind} · {formatDate(lead.publishedAt)}
                  </span>
                  <span className="font-serif text-[32px] leading-[1.15]">{lead.title}</span>
                </Link>
                <div className="flex min-w-0 flex-[1_1_340px] flex-col">
                  {rest.slice(0, 3).map((i, idx) => (
                    <Link
                      key={i.slug}
                      href={`/insights/${i.slug}`}
                      className={`flex flex-col gap-3 text-ivory no-underline ${idx === 0 ? "pb-7" : "py-7"} ${idx < 2 ? "border-b border-ivory/15" : ""}`}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-lighter">
                        {i.kind} · {formatDate(i.publishedAt)}
                      </span>
                      <span className="font-serif text-2xl leading-[1.2]">{i.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* RECOGNITION — replace placeholders with real logos */}
        <section aria-label="Memberships and recognition" className="container-site flex flex-wrap items-center gap-x-12 gap-y-6 border-b border-[#D6D0C6] py-[72px]">
          <p className="eyebrow flex-[1_1_200px] text-muted">Memberships &amp; recognition</p>
          <div className="flex flex-[999_1_640px] flex-wrap gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="flex h-14 flex-[1_1_140px] items-center justify-center border border-dashed border-[#B9B1A4] text-xs text-[#5E625F]">
                [Logo]
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container-site flex flex-wrap items-end gap-x-20 gap-y-12 py-32">
          <h2 className="display min-w-0 flex-[999_1_600px] text-[clamp(40px,5.4vw,76px)] leading-[1.02]">
            Bring us the hard question. We’ll bring a <span className="italic text-gold-ink">clear answer.</span>
          </h2>
          <div className="flex flex-[1_1_280px] flex-wrap gap-3">
            <Button href="/contact">Book a consultation</Button>
            <Button variant="outline" href="/contact">
              Contact us
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
