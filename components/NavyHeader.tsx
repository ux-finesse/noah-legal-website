import { getPracticeAreas } from "@/lib/content";

import Header from "./Header";

/** Solid navy header block used by inner pages; children render below the nav. */
export default async function NavyHeader({ children }: { children?: React.ReactNode }) {
  const areas = await getPracticeAreas();
  return (
    <header className="on-navy bg-navy text-ivory">
      <Header areas={areas} />
      <div id="main">{children}</div>
    </header>
  );
}
