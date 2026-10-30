import type { PortableTextBlock } from "@portabletext/react";

export type Body = Array<PortableTextBlock | { _type: "pullQuote"; _key: string; text: string }>;

export type PracticeArea = {
  title: string;
  slug: string;
  summary?: string;
  featured?: boolean;
  imageUrl?: string;
  body?: Body;
};

export type PersonLite = {
  name: string;
  slug: string;
  role: string;
  practice?: string;
  portraitUrl?: string;
  shortBio?: string;
  barAdmission?: string;
};

export type Person = PersonLite & {
  email?: string;
  featured?: boolean;
  bio?: Body;
  practices?: { title: string; slug: string }[];
};

export type InsightKind = "Article" | "Legal update" | "Newsletter" | "Podcast" | "Event";

export type InsightCard = {
  title: string;
  slug: string;
  kind: InsightKind;
  publishedAt: string;
  standfirst?: string;
  imageUrl?: string;
  practice?: { title: string; slug: string };
  featured?: boolean;
};

export type Insight = InsightCard & {
  authors: PersonLite[];
  readingMinutes?: number;
  body?: Body;
  takeaways?: string[];
  footnotes?: string[];
  pdfUrl?: string;
};

export type Job = {
  title: string;
  slug: string;
  location?: string;
  type?: string;
  applyUrl?: string;
  department?: string;
  experience?: string;
  closingDate?: string;
  summary?: string;
  description?: Body;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
};

export type Settings = {
  address: string;
  phone: string;
  email: string;
  hours: string;
  linkedin?: string;
  instagram?: string;
  x?: string;
  foundedYear: string;
  lawyerCount: string;
  officeCount: string;
  firmIntro: string;
  managingPartnerQuote: string;
};
