/**
 * Placeholder content used until a Sanity project is connected.
 * Everything in [brackets] is a stand-in for real copy from the firm.
 */
import type { Body, Insight, Job, Person, PracticeArea, Settings } from "./types";

const block = (text: string, style: "normal" | "h2" = "normal", key = text.slice(0, 12)): Body[number] => ({
  _type: "block",
  _key: key + style,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key + "s", text, marks: [] }],
});

export const fallbackSettings: Settings = {
  address: "[Street address]\nLagos, Nigeria",
  phone: "[+234 000 000 0000]",
  email: "[hello@noahlegal.com]",
  hours: "[Mon – Fri, 8:00 – 17:00 WAT]",
  linkedin: "#",
  instagram: "#",
  x: "#",
  foundedYear: "[YEAR]",
  lawyerCount: "[00]",
  officeCount: "[00]",
  firmIntro: "[Two to three sentences on the firm's history, founding year and the kind of clients it serves.]",
  managingPartnerQuote: "[A short quote from the managing partner on the firm’s approach.]",
};

const areas: [string, string][] = [
  ["Banking, Finance & Capital Markets", "banking-finance-capital-markets"],
  ["Corporate & Commercial", "corporate-commercial"],
  ["Corporate Governance & Regulatory Compliance", "corporate-governance-regulatory-compliance"],
  ["Dispute Resolution & Arbitration", "dispute-resolution-arbitration"],
  ["Data Protection & Privacy", "data-protection-privacy"],
  ["Energy & Natural Resources", "energy-natural-resources"],
  ["Labour & Employment", "labour-employment"],
  ["Maritime & Shipping", "maritime-shipping"],
  ["Taxation", "taxation"],
  ["Technology, Media & Telecoms", "technology-media-telecoms"],
  ["Intellectual Property", "intellectual-property"],
  ["Real Estate & Infrastructure", "real-estate-infrastructure"],
];

export const fallbackPracticeAreas: PracticeArea[] = areas.map(([title, slug], i) => ({
  title,
  slug,
  summary: "[Scope of this practice in one line.]",
  featured: i < 6,
  body: [
    block("[Overview of the practice — the problems it solves and for whom.]", "normal", slug + "1"),
    block("How we help", "h2", slug + "2"),
    block("[Typical mandates — transactions, advisory and disputes work.]", "normal", slug + "3"),
  ],
}));

const roles = ["Managing Partner", "Partner", "Partner", "Partner", "Senior Associate", "Senior Associate", "Associate", "Associate"];

export const fallbackPeople: Person[] = roles.map((role, i) => ({
  name: `[Full Name ${i + 1}]`,
  slug: `person-${i + 1}`,
  role,
  practice: "[Practice]",
  shortBio: "[Two-line bio — practice focus and notable experience.]",
  barAdmission: "[YEAR]",
  featured: i < 4,
  email: "[name@noahlegal.com]",
  bio: [block("[Full biography — experience, notable matters, education and memberships.]", "normal", `p${i}`)],
}));

const author = (i: number) => {
  const p = fallbackPeople[i];
  return { name: p.name, slug: p.slug, role: p.role, practice: p.practice, shortBio: p.shortBio, barAdmission: p.barAdmission };
};

const articleBody: Body = [
  block("[Introductory paragraph — set out the issue plainly and why it matters now.]", "normal", "a1"),
  block("1. [Section heading]", "h2", "a2"),
  block("[Paragraph.]", "normal", "a3"),
  block("2. [Section heading]", "h2", "a4"),
  block("[Paragraph.]", "normal", "a5"),
  { _type: "pullQuote", _key: "pq", text: "[Pull quote — a single line worth remembering from this piece.]" },
  block("3. [Section heading]", "h2", "a6"),
  block("[Paragraph.]", "normal", "a7"),
];

const kinds = ["Article", "Legal update", "Podcast", "Article", "Event", "Newsletter"] as const;

export const fallbackInsights: Insight[] = kinds.map((kind, i) => ({
  title: `[${kind === "Podcast" ? "Episode" : kind === "Event" ? "Event" : "Insight"} title ${i + 1}]`,
  slug: `insight-${i + 1}`,
  kind,
  publishedAt: `2026-10-${String(28 - i * 3).padStart(2, "0")}`,
  standfirst: "[Standfirst — one or two sentences on what changed and who it affects.]",
  practice: { title: fallbackPracticeAreas[i % 6].title, slug: fallbackPracticeAreas[i % 6].slug },
  featured: i === 0,
  authors: [author(1), author(4)],
  readingMinutes: 6,
  body: articleBody,
  takeaways: ["[Takeaway one.]", "[Takeaway two.]", "[Takeaway three.]"],
  footnotes: ["[Citation — statute, section, case or circular reference.]", "[Citation — statute, section, case or circular reference.]"],
}));

export const fallbackJobs: Job[] = [
  { title: "[Senior Associate — Banking & Finance]", location: "Lagos", type: "Full-time", applyUrl: "mailto:careers@noahlegal.com" },
  { title: "[Associate — Dispute Resolution]", location: "Lagos", type: "Full-time", applyUrl: "mailto:careers@noahlegal.com" },
  { title: "[Legal Intern / NYSC]", location: "Lagos", type: "Internship", applyUrl: "mailto:careers@noahlegal.com" },
  { title: "[Business Development Executive]", location: "Lagos", type: "Full-time", applyUrl: "mailto:careers@noahlegal.com" },
];
