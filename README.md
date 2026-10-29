# NOAH LEGAL — website

Next.js 15 (App Router) + Tailwind CSS + Sanity CMS. The design follows **Iteration 1** from the NOAH LEGAL design canvas (navy `#16213D`, gold `#C9A85B`, Newsreader + Manrope).

## Run it

```bash
npm install
cp .env.example .env.local   # optional until Sanity is set up
npm run dev                  # http://localhost:3000
```

The site works straight away with placeholder content from `lib/fallback.ts` (everything in `[brackets]`).

## Connect the CMS (Sanity)

1. Create a project at <https://www.sanity.io/manage> and copy its **Project ID**.
2. Put it in `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID` (and on your host, e.g. Vercel).
3. In the Sanity project settings → **API → CORS origins**, add `http://localhost:3000` and your live domain (allow credentials).
4. Open `/studio` on the site and sign in. Content types:
   - **Site settings** — address, phone, email, hours, socials, firm intro, stats, managing-partner quote
   - **Practice areas** — tick *Show on homepage* for the six featured ones; set *Display order*
   - **People** — role, practice areas, portrait, bios; *Show on homepage* for the four featured
   - **Insights** — Article / Legal update / Newsletter / Podcast / Event, authors, practice area, body, key takeaways, footnotes, optional PDF
   - **Job openings** — only *Currently open* roles show on Careers

Pages refresh from Sanity every 60 seconds. Anything left empty falls back to the placeholders.

## Forms

`/api/contact` and `/api/subscribe` email the firm through [Resend](https://resend.com) when `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are set; otherwise they just log to the server. Swap `/api/subscribe` for a mailing-list provider when one is chosen.

## Structure

```
app/(site)/          public pages: home, expertise(+[slug]), firm, people(+[slug]), insights(+[slug]), careers, contact, privacy, terms
app/studio/          embedded Sanity Studio at /studio
app/api/             contact + newsletter endpoints
components/          Header (with Expertise dropdown + mobile menu), Footer, forms, UI pieces
lib/content.ts       all data fetching (Sanity → fallback)
sanity/schemaTypes/  CMS content models
public/media/        hero video and logos
```

## Still to supply

Real copy, photos and portraits, membership/award logos, office address and map, privacy policy and terms text, and the domain.

## Deploy

Push to GitHub and import the repo in [Vercel](https://vercel.com). Add the env vars above in the Vercel project settings.
