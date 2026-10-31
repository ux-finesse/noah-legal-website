"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Person } from "@/lib/types";

import { Picture } from "./ui";

const field = "w-full min-w-0 min-h-[48px] border border-[#B9B1A4] bg-white px-4 text-[15px] text-navy";

export default function PeopleDirectory({ people, practices }: { people: Person[]; practices: string[] }) {
  const [q, setQ] = useState("");
  const [practice, setPractice] = useState("");
  const [role, setRole] = useState("");
  const roles = useMemo(() => Array.from(new Set(people.map((p) => p.role))), [people]);

  const filtered = people.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
      (!practice || p.practice === practice || p.practices?.some((x) => x.title === practice)) &&
      (!role || p.role === role),
  );
  const partners = filtered.filter((p) => /partner/i.test(p.role));
  const others = filtered.filter((p) => !/partner/i.test(p.role));

  return (
    <>
      <section aria-label="Filter lawyers" className="container-site flex flex-wrap items-end gap-4 pt-14">
        <div className="flex min-w-0 flex-[2_1_280px] flex-col gap-2">
          <label htmlFor="p-search" className="text-[13px] font-semibold text-muted">Search by name</label>
          <input id="p-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} className={field} />
        </div>
        <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-2">
          <label htmlFor="p-practice" className="text-[13px] font-semibold text-muted">Practice area</label>
          <select id="p-practice" value={practice} onChange={(e) => setPractice(e.target.value)} className={`${field} px-3`}>
            <option value="">All practices</option>
            {practices.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-2">
          <label htmlFor="p-role" className="text-[13px] font-semibold text-muted">Role</label>
          <select id="p-role" value={role} onChange={(e) => setRole(e.target.value)} className={`${field} px-3`}>
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </section>

      {filtered.length === 0 && (
        <p className="container-site pb-28 pt-20 text-lg text-muted" role="status">
          {people.length === 0 ? "Profiles of our team will be published here shortly." : "No one matches those filters."}
        </p>
      )}
      <Group title="Partners" people={partners} />
      <Group title="Associates" people={others} last />
    </>
  );
}

function Group({ title, people, last = false }: { title: string; people: Person[]; last?: boolean }) {
  if (!people.length) return null;
  return (
    <section aria-label={title} className={`container-site ${last ? "pb-28 pt-24" : "pt-[72px]"}`}>
      <h2 className="mb-8 border-b border-line pb-4 font-serif text-4xl">{title}</h2>
      <div className="flex flex-wrap gap-x-6 gap-y-10">
        {people.map((p) => (
          <Link key={p.slug} href={`/people/${p.slug}`} className="flex min-w-0 flex-[1_1_260px] flex-col gap-4 text-navy no-underline">
            <Picture src={p.portraitUrl} alt={`Portrait of ${p.name}`} label="[PORTRAIT]" className="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, 100vw" />
            <span className="flex flex-col gap-1">
              <span className="font-serif text-2xl">{p.name}</span>
              <span className="text-sm text-muted">
                {p.role}
                {p.practice ? ` · ${p.practice}` : ""}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
