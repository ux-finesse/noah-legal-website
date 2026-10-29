import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import NavyHeader from "@/components/NavyHeader";
import PortableBody from "@/components/PortableBody";
import { Picture } from "@/components/ui";
import { getPeople, getPerson } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPeople()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPerson((await params).slug);
  return { title: p?.name ?? "Our People" };
}

export default async function PersonPage({ params }: Props) {
  const person = await getPerson((await params).slug);
  if (!person) notFound();
  const practices = person.practices ?? (person.practice ? [{ title: person.practice, slug: "" }] : []);

  return (
    <>
      <NavyHeader>
        <div className="container-site flex flex-wrap items-end gap-x-16 gap-y-10 pb-20 pt-16 lg:pt-24">
          <Picture src={person.portraitUrl} alt={`Portrait of ${person.name}`} label="[PORTRAIT]" className="aspect-[4/5] w-full max-w-[360px] flex-[0_1_360px]" dark />
          <div className="min-w-0 flex-[999_1_480px]">
            <p className="eyebrow mb-5 text-gold">{person.role}</p>
            <h1 className="display mb-6 text-[clamp(44px,5.6vw,80px)]">{person.name}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted-light">
              {person.barAdmission && <span>Called to the Nigerian Bar {person.barAdmission}</span>}
              {person.email && (
                <a href={`mailto:${person.email.replace(/[[\]]/g, "")}`} className="text-ivory">
                  {person.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </NavyHeader>
      <main className="container-site flex flex-wrap gap-x-20 gap-y-12 py-24">
        <aside className="flex min-w-0 flex-[1_1_260px] flex-col gap-3">
          <span className="eyebrow text-gold-ink">Practice areas</span>
          {practices.map((p) =>
            p.slug ? (
              <Link key={p.title} href={`/expertise/${p.slug}`} className="text-[15px]">
                {p.title}
              </Link>
            ) : (
              <span key={p.title} className="text-[15px]">
                {p.title}
              </span>
            ),
          )}
          <Link href="/contact" className="btn mt-6 self-start bg-navy text-ivory hover:text-gold">
            Contact {person.name.split(" ")[0]}
          </Link>
        </aside>
        <article className="min-w-0 max-w-[760px] flex-[999_1_560px] text-lg leading-[1.75] text-[#2A3350]">
          {person.shortBio && <p className="mb-7 font-serif text-2xl leading-snug text-navy">{person.shortBio}</p>}
          <PortableBody value={person.bio} />
        </article>
      </main>
    </>
  );
}
