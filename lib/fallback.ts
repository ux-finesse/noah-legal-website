/**
 * Sample content shown until the firm publishes its own in Sanity, and used by
 * `npm run seed` to pre-fill Sanity. All people, figures and articles are
 * FICTIONAL samples for design and demo purposes — replace before launch.
 */
import type { Body, Insight, Job, Person, PracticeArea, Settings } from "./types";

const block = (text: string, style: "normal" | "h2" = "normal", key = text.slice(0, 12)): Body[number] => ({
  _type: "block",
  _key: (key + style).replace(/[^a-zA-Z0-9]/g, ""),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: (key + "s").replace(/[^a-zA-Z0-9]/g, ""), text, marks: [] }],
});

export const fallbackSettings: Settings = {
  address: "14 Admiralty Way, Lekki Phase 1\nLagos, Nigeria",
  phone: "+234 800 000 0000",
  email: "hello@noahlegal.com",
  hours: "Mon – Fri, 8:00 – 17:00 WAT",
  linkedin: "#",
  instagram: "#",
  x: "#",
  foundedYear: "2012",
  lawyerCount: "24",
  officeCount: "2",
  firmIntro:
    "Founded in Lagos in 2012, NOAH LEGAL advises banks, investors, founders and established companies on transactions, disputes and regulation. Our teams are partner-led and work across practices, so clients get one joined-up answer.",
  managingPartnerQuote: "Clients don’t need more law. They need a clear answer they can act on — and someone who will stand behind it.",
};

const areas: [string, string, string][] = [
  ["Banking, Finance & Capital Markets", "banking-finance-capital-markets", "Lending, project finance, debt and equity capital markets for lenders and borrowers."],
  ["Corporate & Commercial", "corporate-commercial", "Mergers, acquisitions, joint ventures and the commercial contracts that run a business."],
  ["Corporate Governance & Regulatory Compliance", "corporate-governance-regulatory-compliance", "Board advisory, company secretarial work and dealings with regulators."],
  ["Dispute Resolution & Arbitration", "dispute-resolution-arbitration", "Commercial litigation, domestic and international arbitration, and mediation."],
  ["Data Protection & Privacy", "data-protection-privacy", "Compliance programmes, breach response and data-sharing agreements."],
  ["Energy & Natural Resources", "energy-natural-resources", "Power, oil and gas, mining and renewables — from licensing to financing."],
  ["Labour & Employment", "labour-employment", "Employment contracts, restructuring, workplace investigations and disputes."],
  ["Maritime & Shipping", "maritime-shipping", "Cargo claims, vessel arrest, charterparties and ship finance."],
  ["Taxation", "taxation", "Tax structuring, compliance reviews and disputes with tax authorities."],
  ["Technology, Media & Telecoms", "technology-media-telecoms", "Fintech, telecoms licensing, digital platforms and media rights."],
  ["Intellectual Property", "intellectual-property", "Trademarks, copyright, licensing and brand protection."],
  ["Real Estate & Infrastructure", "real-estate-infrastructure", "Land acquisition, development, leasing and public–private partnerships."],
  ["Estate Planning", "estate-planning", "Wills, trusts, succession planning and the administration of estates for individuals and families."],
];

export const fallbackPracticeAreas: PracticeArea[] = areas.map(([title, slug, summary], i) => ({
  title,
  slug,
  summary,
  featured: i < 6,
  body: [
    block(`${summary} We act for local and international clients, combining technical depth with a clear view of the commercial outcome.`, "normal", slug + "1"),
    block("How we help", "h2", slug + "2"),
    block("Typical mandates include advising on structure and risk at the outset, drafting and negotiating the key documents, dealing with regulators, and resolving disputes if they arise.", "normal", slug + "3"),
  ],
}));

const practice = (slug: string) => {
  const a = fallbackPracticeAreas.find((x) => x.slug === slug)!;
  return { title: a.title, slug: a.slug };
};

// Fictional sample people.
const team: [string, string, string, string[], string][] = [
  ["Adaora Nwachukwu", "Managing Partner", "2001", ["energy-natural-resources", "corporate-commercial"], "Leads the firm and its energy practice, advising sponsors and lenders on power and infrastructure projects."],
  ["Olumide Adeyemi", "Partner", "2005", ["banking-finance-capital-markets", "data-protection-privacy"], "Advises banks and fintechs on lending, payments regulation and data protection."],
  ["Folake Ogunleye", "Partner", "2006", ["corporate-governance-regulatory-compliance", "taxation"], "Works with boards and finance teams on governance, regulatory filings and tax."],
  ["Kelechi Nwosu", "Partner", "2008", ["dispute-resolution-arbitration", "maritime-shipping"], "Represents clients in commercial arbitration, litigation and maritime claims."],
  ["Zainab Abdullahi", "Senior Associate", "2013", ["banking-finance-capital-markets", "energy-natural-resources"], "Focuses on project finance and syndicated lending."],
  ["Temitope Ajayi", "Senior Associate", "2014", ["data-protection-privacy", "taxation"], "Advises on privacy compliance programmes and tax reviews."],
  ["Chinedu Okeke", "Associate", "2018", ["dispute-resolution-arbitration", "labour-employment"], "Supports disputes and employment matters, including workplace investigations."],
  ["Halima Bello", "Associate", "2020", ["maritime-shipping"], "Works on cargo claims, charterparty disputes and vessel arrests."],
];

export const fallbackPeople: Person[] = team.map(([name, role, bar, practiceSlugs, shortBio], i) => {
  const practices = practiceSlugs.map(practice);
  return {
    name,
    slug: name.toLowerCase().replace(/[^a-z]+/g, "-"),
    role,
    practice: practices[0].title,
    practices,
    shortBio,
    barAdmission: bar,
    featured: i < 4,
    email: `${name.split(" ")[0].toLowerCase()}@noahlegal.com`,
    bio: [
      block(`${name} is a ${role.toLowerCase()} at NOAH LEGAL. ${shortBio}`, "normal", `pb${i}a`),
      block("Before joining the firm, they practised with leading commercial firms in Lagos and are a member of the Nigerian Bar Association.", "normal", `pb${i}b`),
    ],
  };
});

const author = (i: number) => {
  const p = fallbackPeople[i];
  return { name: p.name, slug: p.slug, role: p.role, practice: p.practice, shortBio: p.shortBio, barAdmission: p.barAdmission };
};

// ---------------------------------------------------------------------------
// SAMPLE INSIGHTS — realistic dummy articles for design and demo purposes.
// They are illustrative only, not legal advice, and should be replaced with
// the firm's own published pieces (via Sanity) before launch.
// Images are hot-linked from Unsplash (free licence); swap for the firm's own.
// ---------------------------------------------------------------------------

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=70`;
const area = (slug: string) => {
  const a = fallbackPracticeAreas.find((p) => p.slug === slug)!;
  return { title: a.title, slug: a.slug };
};
let k = 0;
const p = (text: string): Body[number] => block(text, "normal", `b${k++}`);
const h = (text: string): Body[number] => block(text, "h2", `h${k++}`);
const quote = (text: string): Body[number] => ({ _type: "pullQuote", _key: `q${k++}`, text });

export const fallbackInsights: Insight[] = [
  {
    title: "Your customer data is now a board-level risk: what the Nigeria Data Protection Act asks of you",
    slug: "nigeria-data-protection-act-board-level-risk",
    kind: "Article",
    publishedAt: "2026-10-27",
    standfirst:
      "Data protection has moved from the IT department to the boardroom. We set out what organisations that collect personal data in Nigeria should have in place, and where we see companies falling short.",
    practice: area("data-protection-privacy"),
    featured: true,
    imageUrl: unsplash("photo-1563986768609-322da13575f3"),
    authors: [author(1), author(5)],
    readingMinutes: 7,
    body: [
      p("Most businesses now hold more personal data than they realise — customer records, employee files, CCTV footage, app analytics. The Nigeria Data Protection Act 2023 places clear duties on the organisations that collect and use that data, and regulators have shown a growing willingness to investigate complaints and breaches."),
      p("For boards, the practical question is no longer whether the law applies, but whether the company can show — with documents — that it has taken its obligations seriously."),
      h("1. Know what you hold, and why"),
      p("Compliance starts with a data map: what personal data the business collects, where it is stored, who can access it, and the lawful basis for each use. Without this, privacy notices, retention policies and breach responses are guesswork."),
      h("2. Put the paperwork where the risk is"),
      p("Privacy notices, consent wording, data processing agreements with vendors and internal access policies should be proportionate to the volume and sensitivity of data handled. A fintech processing payment data needs more than a retailer running a loyalty scheme."),
      quote("Regulators rarely ask whether a breach happened. They ask what you had done before it happened."),
      h("3. Treat vendors as part of your perimeter"),
      p("Cloud providers, payroll bureaus and marketing agencies often process data on your behalf. Contracts should set out security standards, breach notification timelines and what happens to data when the relationship ends."),
      h("4. Rehearse the breach before it happens"),
      p("A short, tested incident-response plan — who decides, who notifies, and who speaks to customers — is often the difference between a contained incident and a reputational crisis."),
    ],
    takeaways: [
      "Map the personal data you hold before drafting policies.",
      "Review vendor contracts for security and breach-notification terms.",
      "Agree, document and rehearse an incident-response plan at board level.",
    ],
    footnotes: ["Nigeria Data Protection Act 2023.", "See also the regulator’s published guidance on compliance audits and registration of data controllers."],
  },
  {
    title: "Annual returns and beneficial ownership: a filing checklist for company secretaries",
    slug: "annual-returns-beneficial-ownership-checklist",
    kind: "Legal update",
    publishedAt: "2026-10-22",
    standfirst: "Late or incomplete filings remain one of the most common — and avoidable — compliance gaps we see in due diligence. A short checklist for the year ahead.",
    practice: area("corporate-governance-regulatory-compliance"),
    imageUrl: unsplash("photo-1450101499163-c8848c66ca85"),
    authors: [author(2)],
    readingMinutes: 4,
    body: [
      p("When we act on acquisitions and financings, one of the first things we review is the target’s filing history at the Corporate Affairs Commission. Gaps in annual returns or outdated shareholder records can delay a transaction by weeks."),
      h("1. Diarise the deadlines"),
      p("Set a single calendar for annual returns, changes in directors and changes in share capital, owned by one person in the company secretariat."),
      h("2. Keep the register of persons with significant control current"),
      p("Ownership changes — including indirect changes higher up a group structure — should be captured and filed promptly."),
      h("3. Reconcile statutory books with filings"),
      p("Minute books, share registers and filed records should tell the same story. Discrepancies are easier to fix now than in the middle of a deal."),
    ],
    takeaways: ["Assign one owner for all statutory filing deadlines.", "Update ownership records as soon as changes occur.", "Reconcile internal registers with filed records annually."],
    footnotes: ["Companies and Allied Matters Act 2020."],
  },
  {
    title: "Choosing arbitration in Nigerian commercial contracts: five clauses worth a second look",
    slug: "arbitration-clauses-nigerian-commercial-contracts",
    kind: "Article",
    publishedAt: "2026-10-16",
    standfirst: "A dispute-resolution clause is usually the last thing negotiated and the first thing read when a deal goes wrong. Here is what we check before clients sign.",
    practice: area("dispute-resolution-arbitration"),
    imageUrl: unsplash("photo-1589829545856-d10d557cf95f"),
    authors: [author(3), author(6)],
    readingMinutes: 6,
    body: [
      p("Arbitration offers confidentiality, party choice of decision-maker and, in many cases, easier enforcement across borders. But a poorly drafted clause can undo those advantages and lead to costly satellite litigation."),
      h("1. Seat"),
      p("The seat determines which courts supervise the arbitration. It should be chosen deliberately, not copied from a precedent."),
      h("2. Rules and institution"),
      p("Naming a set of institutional rules brings administrative support and a clear procedure for appointing arbitrators if the parties cannot agree."),
      quote("The best time to agree how a dispute will be resolved is before there is one."),
      h("3. Number of arbitrators"),
      p("A sole arbitrator is faster and cheaper; a three-member tribunal may suit high-value or technical disputes."),
      h("4. Escalation steps"),
      p("Negotiation or mediation steps can be valuable, but they should have clear time limits so they do not become a trap."),
      h("5. Interim relief"),
      p("Make sure the clause does not prevent a party from seeking urgent protective orders from a court where needed."),
    ],
    takeaways: ["Choose the seat deliberately.", "Name institutional rules to avoid appointment deadlock.", "Put time limits on any pre-arbitration steps."],
    footnotes: ["Arbitration and Mediation Act 2023."],
  },
  {
    title: "Maritime Practice Newsletter — Volume 1",
    slug: "maritime-practice-newsletter-volume-1",
    kind: "Newsletter",
    publishedAt: "2026-10-09",
    standfirst: "Our first maritime round-up: port operations, cargo claims, vessel financing and what shipowners and charterers should watch over the coming quarter.",
    practice: area("maritime-shipping"),
    imageUrl: unsplash("photo-1494412574643-ff11b0a5c1c3"),
    authors: [author(3), author(7)],
    readingMinutes: 5,
    body: [
      p("In this edition we look at recurring issues in cargo claims, practical points on vessel arrest, financing structures for coastal fleets, and the contract terms that most often decide demurrage disputes."),
      h("In this edition"),
      p("Cargo claims: documents that win or lose a case · Vessel arrest: speed and security · Financing coastal fleets · Demurrage: reading the charterparty."),
      p("The full newsletter is available as a PDF download."),
    ],
    takeaways: ["Preserve shipping documents early in any cargo dispute.", "Review charterparty laytime and demurrage clauses before fixtures."],
  },
  {
    title: "Financing power projects: the five contract terms lenders look at first",
    slug: "financing-power-projects-five-contract-terms",
    kind: "Article",
    publishedAt: "2026-10-02",
    standfirst: "Embedded generation and mini-grid projects are attracting new capital. Whether that capital arrives often depends on a handful of clauses in the project documents.",
    practice: area("energy-natural-resources"),
    imageUrl: unsplash("photo-1473341304170-971dccb5ac1e"),
    authors: [author(0), author(4)],
    readingMinutes: 8,
    body: [
      p("Lenders to power projects take long-term risk on assets that are hard to repurpose. Before committing, they test the project documents to see who bears which risk and whether revenue is secure."),
      h("1. Offtake and payment security"),
      p("The strength of the offtaker and any payment support — guarantees, letters of credit or escrow — is usually the first question."),
      h("2. Tariff and currency"),
      p("How tariffs are set and adjusted, and how currency movements are handled, directly affect debt service."),
      quote("Bankability is less about the technology and more about the paperwork around it."),
      h("3. Change in law"),
      p("Clear allocation of the cost of regulatory change protects both sponsors and lenders."),
      h("4. Step-in rights"),
      p("Lenders will expect the right to step in and cure defaults before contracts are terminated."),
      h("5. Termination payments"),
      p("What is paid, by whom, if the project ends early is often the most negotiated term in the package."),
    ],
    takeaways: ["Payment security drives lender appetite.", "Address currency risk explicitly.", "Expect lenders to require step-in and termination protections."],
    footnotes: ["Electricity Act 2023."],
  },
  {
    title: "Year-end tax housekeeping for growing companies",
    slug: "year-end-tax-housekeeping-growing-companies",
    kind: "Legal update",
    publishedAt: "2026-09-25",
    standfirst: "A short list of tax checks that finance teams can complete before the financial year closes — and that save time and penalties later.",
    practice: area("taxation"),
    imageUrl: unsplash("photo-1554224155-6726b3ff858f"),
    authors: [author(2), author(5)],
    readingMinutes: 4,
    body: [
      p("Tax disputes often start with record-keeping rather than interpretation. A little housekeeping before year-end makes filings simpler and audits shorter."),
      h("1. Reconcile withholding tax credits"),
      p("Match credit notes received against invoices so credits are not lost."),
      h("2. Review related-party transactions"),
      p("Intra-group charges should be documented and priced consistently."),
      h("3. Check incentive conditions"),
      p("If the company relies on any tax incentive or exemption, confirm that its conditions are still being met."),
    ],
    takeaways: ["Reconcile withholding tax credits.", "Document intra-group charges.", "Confirm incentive conditions are still met."],
  },
  {
    title: "In conversation: structuring syndicated loans in a volatile currency market",
    slug: "podcast-syndicated-loans-volatile-currency",
    kind: "Podcast",
    publishedAt: "2026-09-18",
    standfirst: "Two of our finance lawyers discuss how lenders and borrowers are adapting loan structures, hedging and pricing to currency volatility.",
    practice: area("banking-finance-capital-markets"),
    imageUrl: unsplash("photo-1486406146926-c627a92ad1ab"),
    authors: [author(1), author(4)],
    readingMinutes: 28,
    body: [
      p("In this episode we discuss multi-currency facilities, hedging requirements in loan documents, and how pricing and covenants are being renegotiated as market conditions change."),
      p("Listen on your preferred podcast platform, or read the highlights below."),
      h("Highlights"),
      p("Why lenders are asking for more detailed hedging undertakings · How borrowers can build flexibility into currency clauses · What changes when a facility is refinanced."),
    ],
  },
  {
    title: "Breakfast briefing: managing workforce changes lawfully",
    slug: "breakfast-briefing-workforce-changes",
    kind: "Event",
    publishedAt: "2026-09-10",
    standfirst: "An in-person briefing for HR leaders and general counsel on restructuring, redundancy and employee consultation. Lagos office, 8:00–10:00.",
    practice: area("labour-employment"),
    imageUrl: unsplash("photo-1521791136064-7986c2920216"),
    authors: [author(2), author(6)],
    readingMinutes: 2,
    body: [
      p("Join our employment team for a practical session on planning workforce changes: consultation, documentation, communicating with staff and managing disputes."),
      h("Who should attend"),
      p("HR directors, general counsel and finance leads involved in restructuring decisions."),
      h("Registering"),
      p("Places are limited. Contact us to reserve a seat."),
    ],
  },
];

const jobBenefits = [
  "Competitive salary reviewed annually",
  "Health insurance (HMO) for you and your dependants",
  "Funded CPD, conferences and professional exams",
  "Partner mentorship and a clear progression path",
];

export const fallbackJobs: Job[] = [
  {
    title: "Senior Associate — Banking & Finance",
    slug: "senior-associate-banking-finance",
    department: "Banking, Finance & Capital Markets",
    location: "Lagos",
    type: "Full-time",
    experience: "5–7 years’ post-call",
    closingDate: "2026-12-15",
    applyUrl: "mailto:careers@noahlegal.com?subject=Senior%20Associate%20%E2%80%94%20Banking%20%26%20Finance",
    summary:
      "We are looking for a senior associate to run lending and project finance transactions day to day, working closely with partners and clients.",
    description: [
      block("You will join a busy team advising banks, development finance institutions and borrowers on bilateral and syndicated facilities, project finance and security packages.", "normal", "jd1a"),
      block("The role offers real ownership of transactions and direct client contact from day one.", "normal", "jd1b"),
    ],
    responsibilities: [
      "Lead the drafting and negotiation of facility agreements and security documents",
      "Run conditions precedent, perfection of security and closing processes",
      "Supervise and train associates on transactions",
      "Contribute to client updates and the firm’s insights",
    ],
    requirements: [
      "LL.B and B.L, with 5–7 years’ post-call experience",
      "Strong banking or project finance experience at a commercial firm",
      "Excellent drafting and organisational skills",
      "Ability to manage several transactions at once",
    ],
    benefits: jobBenefits,
  },
  {
    title: "Associate — Dispute Resolution",
    slug: "associate-dispute-resolution",
    department: "Dispute Resolution & Arbitration",
    location: "Lagos",
    type: "Full-time",
    experience: "2–4 years’ post-call",
    closingDate: "2026-12-01",
    applyUrl: "mailto:careers@noahlegal.com?subject=Associate%20%E2%80%94%20Dispute%20Resolution",
    summary: "Join our disputes team working on commercial litigation and arbitration for corporate and financial-institution clients.",
    description: [
      block("You will support partners on commercial claims from first instructions through to hearing, in court and in arbitration.", "normal", "jd2a"),
    ],
    responsibilities: [
      "Research and draft pleadings, written addresses and submissions",
      "Prepare witness statements and manage document review",
      "Attend court and arbitral hearings",
      "Keep clients updated on matter progress",
    ],
    requirements: [
      "LL.B and B.L, with 2–4 years’ post-call experience",
      "Litigation or arbitration experience",
      "Strong research and writing skills",
    ],
    benefits: jobBenefits,
  },
  {
    title: "Legal Intern / NYSC",
    slug: "legal-intern-nysc",
    department: "Firm-wide",
    location: "Lagos",
    type: "Internship",
    experience: "Recent Law School graduates",
    applyUrl: "mailto:careers@noahlegal.com?subject=Legal%20Intern%20%2F%20NYSC",
    summary: "A structured placement rotating through our transactional and disputes teams.",
    description: [block("Interns and corps members spend time in at least two practice groups and work on live matters under supervision.", "normal", "jd3a")],
    responsibilities: ["Legal research and first drafts", "Support on due diligence and filings", "Attend client meetings and hearings"],
    requirements: ["Called to the Nigerian Bar (or awaiting call)", "Strong academic record", "Curiosity and attention to detail"],
    benefits: ["Monthly stipend", "Mentorship from a senior associate", "Exposure to several practice areas"],
  },
  {
    title: "Business Development Executive",
    slug: "business-development-executive",
    department: "Business Services",
    location: "Lagos",
    type: "Full-time",
    experience: "3+ years in professional services marketing or BD",
    closingDate: "2026-11-30",
    applyUrl: "mailto:careers@noahlegal.com?subject=Business%20Development%20Executive",
    summary: "Help the firm win and grow client relationships through pitches, events and content.",
    description: [block("You will work with partners to plan business development activity, prepare pitches and run client events.", "normal", "jd4a")],
    responsibilities: ["Prepare pitch documents and credentials", "Coordinate client events and seminars", "Manage the firm’s CRM and directory submissions", "Support the insights and newsletter programme"],
    requirements: ["Degree in marketing, communications or a related field", "Experience in a law firm or professional services firm", "Excellent writing and organisation"],
    benefits: jobBenefits,
  },
];
