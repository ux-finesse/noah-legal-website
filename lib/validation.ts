/**
 * Form rules shared by the browser (instant feedback) and the API routes (final check),
 * so both always agree on what is valid and say it the same way.
 */

export type ContactField = "name" | "company" | "email" | "phone" | "message" | "consent";
export type FieldErrors<F extends string = string> = Partial<Record<F, string>>;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function emailError(value: unknown): string | undefined {
  const v = str(value);
  if (!v) return "Please enter your email address.";
  if (v.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address, like name@company.com.";
}

export function contactFieldError(field: ContactField, value: unknown): string | undefined {
  const v = str(value);
  switch (field) {
    case "name":
      if (!v) return "Please enter your full name.";
      if (v.length < 2) return "Please enter your full name.";
      if (v.length > 200) return "Please keep your name under 200 characters.";
      return;
    case "company":
      if (v.length > 200) return "Please keep the company name under 200 characters.";
      return;
    case "email":
      return emailError(v);
    case "phone": {
      if (!v) return; // optional
      const digits = v.replace(/\D/g, "").length;
      if (!/^\+?[\d\s()-]+$/.test(v) || digits < 7 || digits > 15) return "Please enter a valid phone number, like +234 800 000 0000.";
      return;
    }
    case "message":
      if (!v) return "Please tell us a little about how we can help.";
      if (v.length < 10) return "Please add a little more detail (at least 10 characters).";
      if (v.length > 5000) return "Please keep your message under 5,000 characters.";
      return;
    case "consent":
      return value === "on" || value === true ? undefined : "Please confirm you agree so we can reply to you.";
  }
}

export const contactFields: ContactField[] = ["name", "company", "email", "phone", "message", "consent"];

export function validateContact(data: Record<string, unknown>): FieldErrors<ContactField> {
  const errors: FieldErrors<ContactField> = {};
  for (const f of contactFields) {
    const e = contactFieldError(f, data[f]);
    if (e) errors[f] = e;
  }
  return errors;
}

/** Hidden "website" field: real people never see or fill it, spam bots usually do. */
export const HONEYPOT = "website";
