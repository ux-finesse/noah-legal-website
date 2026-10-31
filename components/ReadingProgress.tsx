"use client";

import { useEffect, useRef } from "react";

/** Thin gold bar fixed to the top of the page that fills as the reader moves through the article. */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById(targetId);
    const bar = barRef.current;
    if (!el || !bar) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const read = total > 0 ? -rect.top / total : rect.top <= 0 ? 1 : 0;
      const pct = Math.min(1, Math.max(0, read));
      bar.style.transform = `scaleX(${pct})`;
      bar.parentElement?.setAttribute("aria-valuenow", String(Math.round(pct * 100)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-navy/10"
    >
      <div ref={barRef} className="h-full origin-left scale-x-0 bg-gold" />
    </div>
  );
}
