"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Caret, MenuIcon } from "./icons";

type Area = { title: string; slug: string };

const links = [
  { href: "/firm", label: "The Firm" },
  { href: "/people", label: "Our People" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
];

export default function Header({ areas }: { areas: Area[] }) {
  const pathname = usePathname();
  const [expOpen, setExpOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on navigation (adjust state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setExpOpen(false);
    setMobileOpen(false);
  }

  // Close the dropdown on Escape or outside click.
  useEffect(() => {
    if (!expOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpOpen(false);
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setExpOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [expOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const linkClass = (href: string) => `py-3 no-underline ${isActive(href) ? "text-gold" : "text-ivory"}`;

  return (
    <div className="on-navy relative z-20 border-b border-ivory/15 text-ivory">
      <div className="container-site flex items-center justify-between gap-5 py-5 lg:py-6">
        <Link href="/" aria-label="NOAH LEGAL — home" className="block shrink-0">
          <Image src="/media/logo.svg" alt="NOAH LEGAL" width={119} height={52} priority className="h-11 w-auto lg:h-[52px]" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
          <div ref={menuRef} className="relative" onMouseEnter={() => setExpOpen(true)} onMouseLeave={() => setExpOpen(false)}>
            <button
              type="button"
              aria-expanded={expOpen}
              aria-controls="expertise-menu"
              onClick={() => setExpOpen((o) => !o)}
              className={`inline-flex items-center gap-1.5 py-3 ${isActive("/expertise") ? "text-gold" : "text-ivory"}`}
            >
              Expertise <Caret open={expOpen} />
            </button>
            {expOpen && (
              <div
                id="expertise-menu"
                className="absolute -left-8 top-full z-30 w-[min(720px,92vw)] border border-ivory/15 bg-navy p-8 shadow-[0_24px_48px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold">Practice areas</span>
                  <Link href="/expertise" className="text-sm font-bold text-ivory">
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                  {areas.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/expertise/${a.slug}`}
                      className="flex min-h-[44px] items-center border-b border-ivory/10 py-1.5 text-[15px] font-medium text-ivory no-underline"
                    >
                      {a.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden min-h-[44px] items-center border border-gold px-[22px] text-sm font-semibold tracking-[0.04em] text-ivory no-underline lg:inline-flex"
        >
          Book a consultation
        </Link>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <MenuIcon open={mobileOpen} />
        </button>
      </div>

      {mobileOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="container-site border-t border-ivory/15 bg-navy pb-8 lg:hidden">
          <details className="border-b border-ivory/10">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between text-lg">Expertise</summary>
            <div className="flex flex-col pb-3">
              {areas.map((a) => (
                <Link key={a.slug} href={`/expertise/${a.slug}`} className="py-2 text-[15px] text-muted-light no-underline">
                  {a.title}
                </Link>
              ))}
              <Link href="/expertise" className="py-2 text-[15px] font-bold text-gold">
                View all
              </Link>
            </div>
          </details>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="flex min-h-[52px] items-center border-b border-ivory/10 text-lg text-ivory no-underline">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn mt-6 w-full bg-gold text-navy">
            Book a consultation
          </Link>
        </nav>
      )}
    </div>
  );
}
