import type { Metadata } from "next";

import NavyHeader from "@/components/NavyHeader";
import PeopleDirectory from "@/components/PeopleDirectory";
import { Accent, PageHero } from "@/components/ui";
import { getPeople, getPracticeAreas } from "@/lib/content";

export const metadata: Metadata = { title: "Our People" };

export default async function PeoplePage() {
  const [people, areas] = await Promise.all([getPeople(), getPracticeAreas()]);
  return (
    <>
      <NavyHeader>
        <PageHero
          eyebrow="Our People"
          title={<>The <Accent>counsel</Accent> behind the work.</>}
          intro="Partners, associates and specialists who stay with a matter from first call to close."
        />
      </NavyHeader>
      <main>
        <PeopleDirectory people={people} practices={areas.map((a) => a.title)} />
      </main>
    </>
  );
}
