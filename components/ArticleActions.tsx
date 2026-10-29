"use client";

import { useEffect, useState } from "react";

/** Download / Save / Share row. "Save" is remembered in this browser only. */
export default function ArticleActions({ slug, title, pdfUrl }: { slug: string; title: string; pdfUrl?: string }) {
  const [saved, setSaved] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
    try {
      setSaved((JSON.parse(localStorage.getItem("noah-saved") || "[]") as string[]).includes(slug));
    } catch {
      /* storage unavailable */
    }
  }, [slug]);

  function toggle() {
    const next = !saved;
    setSaved(next);
    try {
      const list = new Set<string>(JSON.parse(localStorage.getItem("noah-saved") || "[]"));
      if (next) list.add(slug);
      else list.delete(slug);
      localStorage.setItem("noah-saved", JSON.stringify([...list]));
    } catch {
      /* storage unavailable */
    }
  }

  const enc = encodeURIComponent;
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
      <a className={linkCls} target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}>
        Share on LinkedIn
      </a>
      <a className={linkCls} target="_blank" rel="noreferrer" href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`}>
        Share on X
      </a>
    </div>
  );
}
