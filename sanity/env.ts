export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-01";

/** True once a Sanity project is configured; until then pages use lib/fallback.ts. */
export const isSanityConfigured = projectId.length > 0;
