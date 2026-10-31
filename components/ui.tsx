import Image from "next/image";
import Link from "next/link";

import Button, { ArrowLink } from "./Button";

/** Navy page header used by every inner page (Iteration 1 pattern). */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumb,
  children,
}: {
  eyebrow: string;
  /** Optional trail shown above the title instead of the eyebrow, e.g. [{ label: "Expertise", href: "/expertise" }, { label: "Taxation" }]. */
  breadcrumb?: { label: string; href?: string }[];
  title: React.ReactNode;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-site flex flex-wrap items-end gap-x-20 gap-y-10 pb-24 pt-16 lg:pb-28 lg:pt-24">
      <div className="min-w-0 flex-[999_1_560px]">
        {breadcrumb ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold uppercase tracking-eyebrow">
              {breadcrumb.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="text-muted-lighter">/</span>}
                  {c.href ? (
                    <Link href={c.href} className="text-muted-light no-underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-gold">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : (
          <p className="eyebrow mb-6 text-gold">{eyebrow}</p>
        )}
        <h1 className="display text-[clamp(44px,6vw,88px)]">{title}</h1>
      </div>
      {intro && <p className="min-w-0 flex-[1_1_320px] text-lg leading-relaxed text-muted-light">{intro}</p>}
      {children}
    </div>
  );
}

export function Accent({ children, gold = true }: { children: React.ReactNode; gold?: boolean }) {
  return <span className={`italic ${gold ? "text-gold" : ""}`}>{children}</span>;
}

export function SectionHead({
  eyebrow,
  title,
  href,
  linkLabel,
  dark = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  href?: string;
  linkLabel?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className={`eyebrow mb-4 ${dark ? "text-gold" : "text-gold-ink"}`}>{eyebrow}</p>
        <h2 className="display text-[clamp(40px,5vw,64px)] leading-[1.02]">{title}</h2>
      </div>
      {href && linkLabel && (
        <ArrowLink href={href} tone={dark ? "light" : "dark"}>
          {linkLabel}
        </ArrowLink>
      )}
    </div>
  );
}

/** Sanity image if present, otherwise a labelled placeholder box. Both have rounded-md corners. */
export function Picture({
  src,
  alt,
  label,
  className,
  dark = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  src?: string;
  alt: string;
  label: string;
  className: string;
  dark?: boolean;
  sizes?: string;
}) {
  if (src) {
    return (
      <span className={`relative block overflow-hidden rounded-md ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </span>
    );
  }
  return (
    <span role="img" aria-label={alt} className={`placeholder-box rounded-md ${dark ? "bg-navy-800 text-[#8E95AA]" : "bg-stone text-[#5E625F]"} ${className}`}>
      {label}
    </span>
  );
}

/** Grey closing band with a consultation button. `divider` adds a hairline on top when it follows another grey section. */
export function CtaBand({ title, divider = false }: { title: React.ReactNode; divider?: boolean }) {
  return (
    <section className="bg-sand">
      <div className="container-site">
        <div className={`flex flex-wrap items-end gap-x-20 gap-y-10 py-28 ${divider ? "border-t border-line" : ""}`}>
          <h2 className="display min-w-0 flex-[999_1_600px] text-[clamp(36px,4.6vw,64px)] leading-[1.05]">{title}</h2>
          <Button href="/contact">Book a consultation</Button>
        </div>
      </div>
    </section>
  );
}
