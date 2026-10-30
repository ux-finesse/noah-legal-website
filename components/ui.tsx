import Image from "next/image";

import Button, { ArrowLink } from "./Button";

/** Navy page header used by every inner page (Iteration 1 pattern). */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-site flex flex-wrap items-end gap-x-20 gap-y-10 pb-24 pt-16 lg:pb-28 lg:pt-24">
      <div className="min-w-0 flex-[999_1_560px]">
        <p className="eyebrow mb-6 text-gold">{eyebrow}</p>
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

/** Sanity image if present, otherwise a labelled placeholder box. */
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
      <span className={`relative block overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </span>
    );
  }
  return (
    <span role="img" aria-label={alt} className={`placeholder-box ${dark ? "bg-navy-800 text-[#8E95AA]" : "bg-stone text-[#5E625F]"} ${className}`}>
      {label}
    </span>
  );
}

export function CtaBand({ title }: { title: React.ReactNode }) {
  return (
    <section className="container-site flex flex-wrap items-end gap-x-20 gap-y-10 py-28">
      <h2 className="display min-w-0 flex-[999_1_600px] text-[clamp(36px,4.6vw,64px)] leading-[1.05]">{title}</h2>
      <Button href="/contact">Book a consultation</Button>
    </section>
  );
}
