import Image from "next/image";
import Link from "next/link";

import type { PracticeArea, Settings } from "@/lib/types";

import { NewsletterForm } from "./forms";

export default function Footer({ settings, areas }: { settings: Settings; areas: PracticeArea[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="on-navy bg-navy text-muted-light">
      <div className="container-wide pb-10 pt-[88px]">
        <div className="flex flex-wrap gap-14 border-b border-ivory/15 pb-16">
          <div className="min-w-0 flex-[2_1_340px]">
            <Image src="/media/logo.svg" alt="NOAH LEGAL" width={119} height={52} className="mb-5 h-9 w-auto" />
            <p className="mb-6 text-[15px] leading-relaxed">Legal updates and insights, delivered monthly.</p>
            <NewsletterForm />
          </div>
          {areas.length > 0 && (
          <nav aria-label="Practice areas" className="flex flex-[1_1_200px] flex-col gap-3 text-[15px]">
            <span className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ivory">Expertise</span>
            {areas.slice(0, 5).map((a) => (
              <Link key={a.slug} href={`/expertise/${a.slug}`} className="text-muted-light no-underline">
                {a.title}
              </Link>
            ))}
          </nav>
          )}
          <nav aria-label="Firm" className="flex flex-[1_1_160px] flex-col gap-3 text-[15px]">
            <span className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ivory">Firm</span>
            <Link href="/firm" className="text-muted-light no-underline">About</Link>
            <Link href="/people" className="text-muted-light no-underline">Our People</Link>
            <Link href="/insights" className="text-muted-light no-underline">Insights</Link>
            <Link href="/careers" className="text-muted-light no-underline">Careers</Link>
            <Link href="/contact" className="text-muted-light no-underline">Contact</Link>
          </nav>
          <div className="flex flex-[1_1_200px] flex-col gap-3 text-[15px] leading-relaxed">
            <span className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ivory">Office</span>
            <span className="whitespace-pre-line">{settings.address}</span>
            <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="text-muted-light no-underline">{settings.phone}</a>
            <a href={`mailto:${settings.email.replace(/[[\]]/g, "")}`} className="text-muted-light no-underline">{settings.email}</a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 pt-8 text-[13px]">
          <span>© {year} NOAH LEGAL. All rights reserved.</span>
          <div className="flex flex-wrap gap-6">
            {settings.linkedin && <a href={settings.linkedin} className="text-muted-light">LinkedIn</a>}
            {settings.instagram && <a href={settings.instagram} className="text-muted-light">Instagram</a>}
            {settings.x && <a href={settings.x} className="text-muted-light">X</a>}
            <Link href="/privacy" className="text-muted-light">Privacy Policy</Link>
            <Link href="/terms" className="text-muted-light">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
