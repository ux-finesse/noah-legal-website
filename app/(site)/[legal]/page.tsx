import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NavyHeader from "@/components/NavyHeader";
import { PageHero } from "@/components/ui";

const pages = {
  privacy: { title: "Privacy Policy", body: "[Privacy policy text — to be supplied by the firm.]" },
  terms: { title: "Terms", body: "[Website terms of use — to be supplied by the firm.]" },
} as const;

type Props = { params: Promise<{ legal: string }> };

export function generateStaticParams() {
  return Object.keys(pages).map((legal) => ({ legal }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = pages[(await params).legal as keyof typeof pages];
  return { title: p?.title };
}

export default async function LegalPage({ params }: Props) {
  const page = pages[(await params).legal as keyof typeof pages];
  if (!page) notFound();
  return (
    <>
      <NavyHeader>
        <PageHero eyebrow="Legal" title={page.title} />
      </NavyHeader>
      <main className="mx-auto max-w-[720px] px-6 py-24 text-lg leading-[1.75] text-muted">{page.body}</main>
    </>
  );
}
