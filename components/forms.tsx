"use client";

import { useId, useRef, useState } from "react";

import { contactFieldError, contactFields, emailError, HONEYPOT, type ContactField, type FieldErrors } from "@/lib/validation";

import Button from "./Button";
import Select, { fieldClass } from "./Select";

type Status = "idle" | "sending" | "sent" | "error";

class RequestError extends Error {
  constructor(
    message: string,
    public fields: FieldErrors = {},
  ) {
    super(message);
  }
}

async function post(url: string, data: Record<string, FormDataEntryValue>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new RequestError(body.error || "Request failed", body.fields || {});
  }
}

/** Off-screen field for spam bots. Hidden from people and screen readers. */
function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function ErrorText({ id, children, dark = false }: { id: string; children?: string; dark?: boolean }) {
  if (!children) return null;
  return (
    <p id={id} className={`flex items-start gap-1.5 text-sm ${dark ? "text-red-300" : "text-[#B42318]"}`}>
      <svg className="mt-[3px] h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 4.5v4M8 11v.01" />
      </svg>
      {children}
    </p>
  );
}

const invalidRing = "!border-[#B42318] focus:!ring-[#B42318]/25";

/* ───────────────────────── Newsletter ───────────────────────── */

export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dark = tone === "dark";
  const id = `nl-email-${tone}-${useId().replace(/:/g, "")}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const err = emailError(data.email);
    setTouched(true);
    setError(err);
    if (err) {
      inputRef.current?.focus();
      return;
    }
    setStatus("sending");
    try {
      await post("/api/subscribe", data);
      setStatus("sent");
    } catch (err) {
      const fieldErr = err instanceof RequestError ? err.fields.email : undefined;
      if (fieldErr) setError(fieldErr);
      setStatus(fieldErr ? "idle" : "error");
    }
  }

  if (status === "sent") {
    return <p className={`text-[15px] ${dark ? "text-ivory" : "text-navy"}`} role="status">Thank you — you’re subscribed.</p>;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex max-w-[460px] flex-wrap gap-2.5">
      <Honeypot />
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        ref={inputRef}
        id={id}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="Email address"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onBlur={(e) => e.target.value && (setTouched(true), setError(emailError(e.target.value)))}
        onChange={(e) => touched && setError(emailError(e.target.value))}
        className={`min-h-[48px] min-w-0 flex-[1_1_220px] rounded-md border px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-gold/40 ${
          dark ? "border-ivory/30 bg-transparent text-ivory placeholder:text-muted-lighter" : "border-[#B9B1A4] bg-white text-navy"
        } ${error ? (dark ? "!border-red-300 focus:!ring-red-300/30" : invalidRing) : ""}`}
      />
      <Button type="submit" size="md" variant={dark ? "gold" : "navy"} disabled={status === "sending"} className="min-h-[48px]">
        {status === "sending" ? "Subscribing…" : "Subscribe"}
      </Button>
      <div className="w-full" aria-live="polite">
        <ErrorText id={`${id}-error`} dark={dark}>
          {error}
        </ErrorText>
        {status === "error" && (
          <p role="alert" className={`text-sm ${dark ? "text-red-300" : "text-[#B42318]"}`}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}

/* ───────────────────────── Contact ───────────────────────── */

const field = `${fieldClass} min-h-[52px] text-base`;

export function ContactForm({ areas }: { areas: string[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>();
  const [errors, setErrors] = useState<FieldErrors<ContactField>>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const valueOf = (el: HTMLInputElement | HTMLTextAreaElement) => (el.type === "checkbox" ? ((el as HTMLInputElement).checked ? "on" : "") : el.value);

  const check = (name: ContactField, value: unknown) => setErrors((prev) => ({ ...prev, [name]: contactFieldError(name, value) }));

  // Validate a field when the person leaves it, then live as they fix it.
  const fieldProps = (name: ContactField) => ({
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `c-${name}-error` : undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = valueOf(e.target);
      if (!v && !touched[name]) return; // don't nag just for tabbing past an empty field
      setTouched((t) => ({ ...t, [name]: true }));
      check(name, v);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (touched[name] || errors[name]) check(name, valueOf(e.target));
    },
  });

  function focusFirstError(errs: FieldErrors<ContactField>) {
    const first = contactFields.find((f) => errs[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (!form.querySelector<HTMLInputElement>('[name="consent"]')?.checked) delete data.consent;

    const errs: FieldErrors<ContactField> = {};
    for (const f of contactFields) {
      const msg = contactFieldError(f, data[f]);
      if (msg) errs[f] = msg;
    }
    setErrors(errs);
    setTouched(Object.fromEntries(contactFields.map((f) => [f, true])));
    setServerMessage(undefined);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }

    setStatus("sending");
    try {
      await post("/api/contact", data);
      setStatus("sent");
    } catch (err) {
      const fields = (err instanceof RequestError ? err.fields : {}) as FieldErrors<ContactField>;
      if (Object.keys(fields).length) {
        setErrors(fields);
        focusFirstError(fields);
        setStatus("idle");
      } else {
        setServerMessage(err instanceof Error && err.message !== "Request failed" ? err.message : undefined);
        setStatus("error");
      }
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

  const cls = (name: ContactField, base = field) => `${base} ${errors[name] ? invalidRing : ""}`;
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Consultation request" className="relative flex min-w-0 flex-[999_1_560px] flex-col gap-6">
      <Honeypot />
      <p className="text-sm text-muted">
        Fields marked <span aria-hidden="true" className="text-[#B42318]">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="flex flex-wrap gap-6">
        <div className="flex flex-[1_1_240px] flex-col gap-2">
          <label htmlFor="c-name" className="text-sm font-semibold">
            Full name <Req />
          </label>
          <input id="c-name" autoComplete="name" aria-required="true" className={cls("name")} {...fieldProps("name")} />
          <ErrorText id="c-name-error">{errors.name}</ErrorText>
        </div>
        <div className="flex flex-[1_1_240px] flex-col gap-2">
          <label htmlFor="c-company" className="text-sm font-semibold">Company</label>
          <input id="c-company" autoComplete="organization" className={cls("company")} {...fieldProps("company")} />
          <ErrorText id="c-company-error">{errors.company}</ErrorText>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex flex-[1_1_240px] flex-col gap-2">
          <label htmlFor="c-email" className="text-sm font-semibold">
            Email <Req />
          </label>
          <input id="c-email" type="email" inputMode="email" autoComplete="email" aria-required="true" className={cls("email")} {...fieldProps("email")} />
          <ErrorText id="c-email-error">{errors.email}</ErrorText>
        </div>
        <div className="flex flex-[1_1_240px] flex-col gap-2">
          <label htmlFor="c-phone" className="text-sm font-semibold">Phone</label>
          <input id="c-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+234" className={cls("phone")} {...fieldProps("phone")} />
          <ErrorText id="c-phone-error">{errors.phone}</ErrorText>
        </div>
      </div>

      <Select
        id="c-practice"
        name="practice"
        label="Area of interest"
        placeholder="Select a practice area"
        options={[...areas, "Other"].map((a) => ({ value: a, label: a }))}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="c-message" className="text-sm font-semibold">
          How can we help? <Req />
        </label>
        <textarea id="c-message" rows={6} aria-required="true" className={cls("message", `${fieldClass} resize-y py-3.5 text-base`)} {...fieldProps("message")} />
        <ErrorText id="c-message-error">{errors.message}</ErrorText>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 text-sm leading-normal text-muted">
          <input
            type="checkbox"
            aria-required="true"
            className={`mt-0.5 h-5 w-5 shrink-0 accent-navy ${errors.consent ? "outline outline-2 outline-offset-1 outline-[#B42318]" : ""}`}
            {...fieldProps("consent")}
            onChange={(e) => check("consent", e.target.checked ? "on" : "")}
          />
          <span>
            I agree that NOAH LEGAL may use these details to respond to my enquiry, as set out in the Privacy Policy. <Req />
          </span>
        </label>
        <ErrorText id="c-consent-error">{errors.consent}</ErrorText>
      </div>

      <div aria-live="polite" className="empty:hidden">
        {errorCount > 1 && <p className="text-sm font-semibold text-[#B42318]">Please fix the {errorCount} fields highlighted above.</p>}
        {status === "error" && (
          <p role="alert" className="text-sm text-[#B42318]">
            {serverMessage ?? "We couldn’t send your request."} Please try again or email us directly.
          </p>
        )}
      </div>

      <Button type="submit" disabled={status === "sending"} className="self-start">
        {status === "sending" ? "Sending…" : "Send request"}
      </Button>
    </form>
  );
}

function Req() {
  return (
    <span aria-hidden="true" className="text-[#B42318]">
      *
    </span>
  );
}
