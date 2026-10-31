import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { ArrowRight } from "./icons";

/**
 * One button for the whole site. Change the look here and it updates everywhere.
 *
 *   <Button href="/contact">Book a consultation</Button>
 *   <Button variant="gold" size="lg" href="/expertise">Our expertise</Button>
 *   <Button variant="outline" onClick={…}>Load more</Button>
 *   <Button type="submit" disabled={sending}>Send</Button>
 */
export type ButtonVariant =
  | "navy" // solid navy — default on light backgrounds
  | "gold" // solid gold — main action on navy backgrounds
  | "outline" // navy outline on light backgrounds
  | "outline-light" // light outline on navy backgrounds
  | "outline-gold"; // gold outline on navy backgrounds

export type ButtonSize = "md" | "lg";

const base =
  "btn inline-flex items-center justify-center gap-2.5 rounded-md font-semibold no-underline transition-colors duration-200 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  navy: "bg-navy text-ivory hover:bg-navy-800 hover:text-ivory",
  gold: "bg-gold text-navy hover:bg-[#B8964A] hover:text-navy",
  outline: "border border-navy text-navy hover:bg-navy hover:text-ivory",
  "outline-light": "border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10 hover:text-ivory",
  "outline-gold": "border border-gold text-ivory hover:bg-gold hover:text-navy",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-[44px] px-[22px] text-sm",
  lg: "min-h-[52px] px-7 text-[15px]",
};

export function buttonClasses(variant: ButtonVariant = "navy", size: ButtonSize = "lg", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export default function Button(props: AsLink | AsButton) {
  const { variant, size, className = "", children } = props;
  const cls = buttonClasses(variant, size, className);

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as AsLink;
    // mailto:, tel:, #anchors and external links use a plain <a>; site pages use Next's <Link>.
    if (/^(mailto:|tel:|#|https?:)/.test(href)) {
      return (
        <a href={href} className={cls} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, className: _c, children: _ch, type = "button", ...rest } = props as AsButton;
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}

/** Text link with an arrow, e.g. "All practice areas →". */
export function ArrowLink({
  href,
  children,
  tone = "dark",
  className = "",
  back = false,
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
  back?: boolean;
}) {
  const color = tone === "light" ? "text-ivory hover:text-gold" : "text-navy hover:text-gold-ink";
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[44px] items-center gap-2.5 border-b border-current text-[15px] font-bold no-underline transition-colors ${color} ${className}`}
    >
      {back && <ArrowRight className="h-4 w-4 rotate-180" />}
      {children}
      {!back && <ArrowRight />}
    </Link>
  );
}
