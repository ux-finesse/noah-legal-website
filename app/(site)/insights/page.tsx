import type { Metadata } from "next";

import InsightsBrowser from "@/components/InsightsBrowser";
import NavyHeader from "@/components/NavyHeader";
import { NewsletterForm } from "@/components/forms";
import { Accent } from "@/components/ui";
import { getInsights } from "@/lib/content";

export const metadata: Metadata = { title: "Insights" };

export default async function InsightsPage() {
  const insights = await getInsights();
  return (
    <>
      <NavyHeader>
        <div className="container-site pb-28 pt-16 lg:pt-24">
          <p className="eyebrow mb-6 text-gold">Insights</p>
          <h1 className="display text-[clamp(44px,6vw,88px)]">
            Thinking ahead of <Accent>the market.</Accent>
          </h1>
        </div>
      </NavyHeader>
      <main>
        <InsightsBrowser insights={insights} />
        <section className="bg-sand">
          <div className="container-site flex flex-wrap items-center gap-x-20 gap-y-8 py-24">
            <h2 className="display min-w-0 flex-[999_1_480px] text-[clamp(32px,3.6vw,48px)] leading-[1.1]">
              Get insights in your inbox, <span className="italic text-gold-ink">monthly.</span>
            </h2>
            <div className="flex-[1_1_380px]">
              <NewsletterForm tone="light" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
