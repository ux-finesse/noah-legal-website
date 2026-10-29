import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type { Body } from "@/lib/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-7">{children}</p>,
    h2: ({ children }) => <h2 className="mb-4 mt-12 text-xl font-semibold leading-snug text-navy">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-3 mt-10 text-lg font-semibold text-navy">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="my-10 border-l-2 border-gold pl-8 font-serif text-3xl italic leading-snug text-navy">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="mb-7 flex list-disc flex-col gap-2.5 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="mb-7 flex list-decimal flex-col gap-2.5 pl-6">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="underline" rel="noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    pullQuote: ({ value }: { value: { text: string } }) => (
      <blockquote className="my-10 border-l-2 border-gold pl-8 font-serif text-3xl italic leading-snug text-navy">“{value.text}”</blockquote>
    ),
  },
};

export default function PortableBody({ value }: { value?: Body }) {
  if (!value?.length) return null;
  return <PortableText value={value as never} components={components} />;
}
