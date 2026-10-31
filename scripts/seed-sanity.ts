/**
 * Copies the sample content in lib/fallback.ts into Sanity so editors start
 * from real entries instead of a blank Studio.
 *
 *   1. In sanity.io/manage → API → Tokens, create a token with Editor rights.
 *   2. Add it to .env.local as SANITY_WRITE_TOKEN=...
 *   3. npm run seed
 *
 * Safe to re-run: documents use fixed IDs and are replaced, and Sanity
 * de-duplicates identical images.
 */
import { createClient } from "@sanity/client";

import { fallbackInsights, fallbackJobs, fallbackPeople, fallbackPracticeAreas, fallbackSettings } from "../lib/fallback";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-06-01", useCdn: false });

const slug = (current: string) => ({ _type: "slug", current });
const ref = (id: string, key?: string) => ({ _type: "reference", _ref: id, ...(key ? { _key: key } : {}) });
const areaId = (s: string) => `practiceArea-${s}`;
const personId = (s: string) => `person-${s}`;

async function uploadImage(url: string, name: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), { filename: `${name}.jpg` });
    return { _type: "image", asset: ref(asset._id) };
  } catch (err) {
    console.warn(`  ! image skipped for ${name}: ${(err as Error).message}`);
    return undefined;
  }
}

async function main() {
  console.log(`Seeding Sanity project ${projectId} / ${dataset}…`);
  const tx = client.transaction();

  tx.createOrReplace({ _id: "siteSettings", _type: "siteSettings", ...fallbackSettings });

  fallbackPracticeAreas.forEach((a, i) =>
    tx.createOrReplace({
      _id: areaId(a.slug),
      _type: "practiceArea",
      title: a.title,
      slug: slug(a.slug),
      order: i + 1,
      summary: a.summary,
      featured: !!a.featured,
      body: a.body,
    }),
  );

  fallbackPeople.forEach((p, i) =>
    tx.createOrReplace({
      _id: personId(p.slug),
      _type: "person",
      name: p.name,
      slug: slug(p.slug),
      role: p.role,
      order: i + 1,
      practiceAreas: (p.practices ?? []).map((x) => ref(areaId(x.slug), x.slug)),
      barAdmission: p.barAdmission,
      email: p.email,
      shortBio: p.shortBio,
      bio: p.bio,
      featured: !!p.featured,
    }),
  );

  fallbackJobs.forEach((j, i) =>
    tx.createOrReplace({
      _id: `job-${i + 1}`,
      _type: "job",
      title: j.title,
      slug: slug(j.slug),
      open: true,
      department: j.department,
      location: j.location,
      type: j.type,
      experience: j.experience,
      closingDate: j.closingDate,
      applyUrl: j.applyUrl,
      summary: j.summary,
      description: j.description,
      responsibilities: j.responsibilities,
      requirements: j.requirements,
      benefits: j.benefits,
    }),
  );

  console.log("Uploading insight images…");
  for (const ins of fallbackInsights) {
    const image = ins.imageUrl ? await uploadImage(ins.imageUrl, ins.slug) : undefined;
    tx.createOrReplace({
      _id: `insight-${ins.slug}`,
      _type: "insight",
      title: ins.title,
      slug: slug(ins.slug),
      kind: ins.kind,
      publishedAt: ins.publishedAt,
      standfirst: ins.standfirst,
      authors: ins.authors.map((a) => ref(personId(a.slug), a.slug)),
      practiceArea: ins.practice ? ref(areaId(ins.practice.slug)) : undefined,
      featured: !!ins.featured,
      ...(image ? { image } : {}),
      readingMinutes: ins.readingMinutes,
      body: ins.body,
      takeaways: ins.takeaways,
      footnotes: ins.footnotes,
    });
    console.log(`  ✓ ${ins.title}`);
  }

  await tx.commit();
  console.log(
    `Done: settings, ${fallbackPracticeAreas.length} practice areas, ${fallbackPeople.length} people, ${fallbackInsights.length} insights, ${fallbackJobs.length} jobs.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
