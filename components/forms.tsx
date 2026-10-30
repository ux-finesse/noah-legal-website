"use client";

import { useState } from "react";
import Button from "./Button";

type Status = "idle" | "sending" | "sent" | "error";

async function post(url: string, data: Record<string, FormDataEntryValue>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Request failed");
}

export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [status, setStatus] = useState<Status>("idle");
  const dark = tone === "dark";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      await post("/api/subscribe", Object.fromEntries(new FormData(e.currentTarget)));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className={`text-[15px] ${dark ? "text-ivory" : "text-navy"}`} role="status">Thank you — you’re subscribed.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-[460px] flex-wrap gap-2.5">
      <label htmlFor={`nl-email-${tone}`} className="sr-only">
        Email address
      </label>
      <input
        id={`nl-email-${tone}`}
        name="email"
        type="email"
        required
        placeholder="Email address"
        className={`min-h-[48px] min-w-0 flex-[1_1_220px] px-4 text-[15px] ${
          dark ? "border border-ivory/30 bg-transparent text-ivory placeholder:text-muted-lighter" : "border border-[#B9B1A4] bg-white text-navy"
        }`}
      />
      <Button type="submit" size="md" variant={dark ? "gold" : "navy"} disabled={status === "sending"} className="min-h-[48px]">
        {status === "sending" ? "Subscribing…" : "Subscribe"}
      </Button>
      {status === "error" && (
        <p role="alert" className="w-full text-sm text-red-300">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

const field = "min-h-[52px] border border-[#B9B1A4] bg-white px-4 text-base text-navy";

export function ContactForm({ areas }: { areas: string[] }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      await post("/api/contact", Object.fromEntries(new FormData(e.currentTarget)));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex-[999_1_560px] border-t border-navy pt-6">
        <p className="display text-4xl">Thank you.</p>
        <p className="mt-4 text-[17px] text-muted">We’ve received your request and a member of the team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} aria-label="Consultation request" className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-[1_1_240px] flex-col gap-2">
          <label htmlFor="c-name" className="text-sm font-semibold">Full name</label>
          <input id="c-name" name="name" required className={field} />
        </div>
        <div className="flex flex-[1_1_240px] flex-col gap-2">
          <label htmlFor="c-company" className="text-sm font-semibold">Company</label>
          <input id="c-company" name="company" className={field} />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-[1_1_240px] flex-col gap-2">
          <label htmlFor="c-email" className="text-sm font-semibold">Email</label>
          <input id="c-email" name="email" type="email" required className={field} />
        </div>
        <div className="flex flex-[1_1_240px] flex-col gap-2">
          <label htmlFor="c-phone" className="text-sm font-semibold">Phone</label>
          <input id="c-phone" name="phone" type="tel" className={field} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="c-practice" className="text-sm font-semibold">Area of interest</label>
        <select id="c-practice" name="practice" className={`${field} px-3`} defaultValue="">
          <option value="" disabled>Select a practice area</option>
          {areas.map((a) => (
            <option key={a}>{a}</option>
          ))}
          <option>Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="c-msg" className="text-sm font-semibold">How can we help?</label>
        <textarea id="c-msg" name="message" rows={6} required className="resize-y border border-[#B9B1A4] bg-white px-4 py-3.5 text-base text-navy" />
      </div>
      <label className="flex items-start gap-3 text-sm leading-normal text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-5 w-5 shrink-0" />
        I agree that NOAH LEGAL may use these details to respond to my enquiry, as set out in the Privacy Policy.
      </label>
      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          We couldn’t send your request. Please try again or email us directly.
        </p>
      )}
      <Button type="submit" disabled={status === "sending"} className="self-start">
        {status === "sending" ? "Sending…" : "Send request"}
      </Button>
    </form>
  );
}
