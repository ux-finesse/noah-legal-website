"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Caret } from "./icons";

/** Shared look for text inputs, textareas and the Select trigger. */
export const fieldClass =
  "w-full min-w-0 rounded-md border border-[#B9B1A4] bg-white px-4 text-navy transition-colors " +
  "placeholder:text-[#8A8F9E] hover:border-navy/50 focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/40";

export type SelectOption = { value: string; label: string };

type Props = {
  id?: string;
  /** Form field name — a hidden input carries the value when used inside a <form>. */
  name?: string;
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: "md" | "lg";
  labelClassName?: string;
  className?: string;
};

/**
 * Custom, accessible dropdown (ARIA listbox pattern).
 * Keyboard: ↑/↓ to move, Enter/Space to choose, Esc to close, Home/End, type a letter to jump.
 */
export default function Select({
  id,
  name,
  label,
  options,
  value,
  defaultValue = "",
  onChange,
  placeholder = "Select…",
  size = "lg",
  labelClassName = "text-sm font-semibold",
  className = "",
}: Props) {
  const autoId = useId();
  const baseId = id ?? `select-${autoId}`;
  const listId = `${baseId}-list`;
  const labelId = `${baseId}-label`;

  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const selected = options.find((o) => o.value === current);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const choose = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const openList = () => {
    const i = options.findIndex((o) => o.value === current);
    setActive(i >= 0 ? i : 0);
    setOpen(true);
  };

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the active option in view and focus the list when it opens.
  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function onListKey(e: React.KeyboardEvent) {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((a) => Math.min(a + 1, last)),
      ArrowUp: () => setActive((a) => Math.max(a - 1, 0)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => options[active] && choose(options[active].value),
      " ": () => options[active] && choose(options[active].value),
      Escape: () => {
        setOpen(false);
        buttonRef.current?.focus();
      },
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
      return;
    }
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    if (e.key.length === 1) {
      // Typeahead: typing letters jumps to the first matching option.
      const t = typed.current;
      t.text = (e.timeStamp - t.at > 600 ? "" : t.text) + e.key.toLowerCase();
      t.at = e.timeStamp;
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
      if (hit >= 0) setActive(hit);
    }
  }

  const height = size === "lg" ? "min-h-[52px] text-base" : "min-h-[48px] text-[15px]";

  return (
    <div ref={rootRef} className={`relative flex flex-col gap-2 ${className}`}>
      <span id={labelId} className={labelClassName}>
        {label}
      </span>
      {name && <input type="hidden" name={name} value={current} />}
      <button
        ref={buttonRef}
        id={baseId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${baseId}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
            e.preventDefault();
            openList();
          }
        }}
        className={`${fieldClass} ${height} flex items-center justify-between gap-3 text-left ${open ? "border-navy ring-2 ring-gold/40" : ""}`}
      >
        <span className={`truncate ${selected ? "" : "text-[#8A8F9E]"}`}>{selected?.label ?? placeholder}</span>
        <Caret open={open} />
      </button>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={-1}
        aria-labelledby={labelId}
        aria-activedescendant={open ? `${baseId}-opt-${active}` : undefined}
        onKeyDown={onListKey}
        className={`absolute left-0 right-0 top-full z-40 mt-2 max-h-72 origin-top overflow-y-auto rounded-md border border-line bg-white p-1.5 shadow-[0_16px_40px_rgba(22,33,61,0.16)] outline-none transition duration-150 ease-out ${
          open ? "visible scale-100 opacity-100" : "invisible scale-[0.98] opacity-0"
        }`}
      >
        {options.map((o, i) => {
          const isSel = o.value === current;
          return (
            <li
              key={o.value || "__empty"}
              id={`${baseId}-opt-${i}`}
              data-index={i}
              role="option"
              aria-selected={isSel}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(o.value)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-[5px] px-3 py-2.5 text-[15px] ${
                i === active ? "bg-ivory" : ""
              } ${isSel ? "font-semibold text-navy" : "text-[#2A3350]"}`}
            >
              <span>{o.label}</span>
              {isSel && (
                <svg className="h-4 w-4 shrink-0 text-gold-ink" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 8.5 6.5 12 13 4.5" />
                </svg>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
