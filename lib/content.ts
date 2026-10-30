/**
 * All page data goes through these functions. When Sanity is configured they
 * query it; otherwise (or if the query fails) they return lib/fallback.ts.
 */
import { createClient, groq } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import {
  fallbackInsights,
  fallbackJobs,
  fallbackPeople,
  fallbackPracticeAreas,
  fallbackSettings,
} from "./fallback";
import type { Insight, InsightCard, Job, Person, PracticeArea, Settings } from "./types";

const client = isSanityConfigured ? createClient({ projectId, dataset, apiVersion, useCdn: true }) : null;

async function fetchOr<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!client) return fallback;
  try {
    const data = await client.fetch<T>(query, params, { next: { revalidate: 60 } });
    // An empty Sanity list (nothing published yet) also falls back to sample content.
    if (data == null || (Array.isArray(data) && data.length === 0)) return fallback;
    return data;
  } catch (err) {
    console.error("[sanity] query failed, using fallback content", err);
    return fallback;
  }
}

const personLite = groq`name, "slug": slug.current, role, "practice": practiceAreas[0]->title, "portraitUrl": portrait.asset->url, shortBio, barAdmission`;
const insightCard = groq`title, "slug": slug.current, kind, publishedAt, standfirst, featured, "imageUrl": image.asset->url, "practice": practiceArea->{title, "slug": slug.current}`;

export async function getSettings(): Promise<Settings> {
  const data = await fetchOr<Partial<Settings> | null>(groq`*[_type == "siteSettings"][0]`, {}, null);
  return { ...fallbackSettings, ...(data ?? {}) };
}

export function getPracticeAreas(): Promise<PracticeArea[]> {
  return fetchOr(
    groq`*[_type == "practiceArea"] | order(order asc, title asc){title, "slug": slug.current, summary, featured, "imageUrl": image.asset->url}`,
    {},
    fallbackPracticeAreas,
  );
}

export function getPracticeArea(slug: string): Promise<PracticeArea | null> {
  return fetchOr(
    groq`*[_type == "practiceArea" && slug.current == $slug][0]{title, "slug": slug.current, summary, "imageUrl": image.asset->url, body}`,
    { slug },
    fallbackPracticeAreas.find((p) => p.slug === slug) ?? null,
  );
}

export function getPeople(): Promise<Person[]> {
  return fetchOr(groq`*[_type == "person"] | order(order asc, name asc){${personLite}, featured}`, {}, fallbackPeople);
}

export function getPerson(slug: string): Promise<Person | null> {
  return fetchOr(
    groq`*[_type == "person" && slug.current == $slug][0]{${personLite}, email, bio, "practices": practiceAreas[]->{title, "slug": slug.current}}`,
    { slug },
    fallbackPeople.find((p) => p.slug === slug) ?? null,
  );
}

export function getInsights(): Promise<InsightCard[]> {
  return fetchOr(groq`*[_type == "insight"] | order(publishedAt desc){${insightCard}}`, {}, fallbackInsights);
}

export function getInsight(slug: string): Promise<Insight | null> {
  return fetchOr(
    groq`*[_type == "insight" && slug.current == $slug][0]{${insightCard}, readingMinutes, body, takeaways, footnotes,
      "pdfUrl": pdf.asset->url, "authors": coalesce(authors[]->{${personLite}}, [])}`,
    { slug },
    fallbackInsights.find((i) => i.slug === slug) ?? null,
  );
}

export function getJobs(): Promise<Job[]> {
  return fetchOr(
    groq`*[_type == "job" && open == true] | order(_createdAt desc){
      title, "slug": coalesce(slug.current, _id), location, type, applyUrl, department, experience, closingDate,
      summary, description, responsibilities, requirements, benefits}`,
    {},
    fallbackJobs,
  );
}

export { formatDate } from "./format";
