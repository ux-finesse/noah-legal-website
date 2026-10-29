"use client";

import { useSyncExternalStore } from "react";

const KEY = "noah-saved";
const listeners = new Set<() => void>();

function readSaved(): string {
  try {
    return localStorage.getItem(KEY) || "[]";
  } catch {
    return "[]";
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Download / Save / Share row. "Save" is remembered in this browser only. */
export default function ArticleActions({ slug, title, pdfUrl }: { slug: string; title: string; pdfUrl?: string }) {
  const raw = useSyncExternalStore(subscribe, readSaved, () => "[]");
  const saved = (JSON.parse(raw) as string[]).includes(slug);

  function toggle() {
    try {
      const list = new Set<string>(JSON.parse(readSaved()));
      if (saved) list.delete(slug);
      else list.add(slug);
      localStorage.setItem(KEY, JSON.stringify([...list]));
    } catch {
      /* storage unavailable */
    }
    listeners.forEach((l) => l());
  }

  // Build share links at click time so the current URL is always used.
  function share(e: React.MouseEvent<HTMLAnchorElement>, network: "linkedin" | "x") {
    const url = encodeURIComponent(window.location.href);
    e.currentTarget.href =
      network === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        : `https://x.com/intent/post?url=${url}&text=${encodeURIComponent(title)}`;
  }

  const linkCls = "inline-flex min-h-[44px] items-center font-semibold text-navy";

  return (
    <div className="mb-12 mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
      {pdfUrl && (
        <a href={pdfUrl} className={linkCls} download>
          Download PDF
        </a>
      )}
      <button type="button" aria-pressed={saved} onClick={toggle} className={`${linkCls} underline`}>
        {saved ? "Saved" : "Save"}
      </button>
      <a className={linkCls} target="_blank" rel="noreferrer" href="https://www.linkedin.com/" onClick={(e) => share(e, "linkedin")}>
        Share on LinkedIn
      </a>
      <a className={linkCls} target="_blank" rel="noreferrer" href="https://x.com/" onClick={(e) => share(e, "x")}>
        Share on X
      </a>
    </div>
  );
}
