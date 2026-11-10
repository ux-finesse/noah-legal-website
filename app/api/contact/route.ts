import { NextResponse } from "next/server";

import { clean, sendMail } from "@/lib/mail";
import { HONEYPOT, validateContact } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Something went wrong with the form. Please refresh and try again." }, { status: 400 });
  }

  // Spam bot filled the hidden field: pretend it worked, send nothing.
  if (clean(body[HONEYPOT])) return NextResponse.json({ ok: true });

  const fields = validateContact(body);
  if (Object.keys(fields).length) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", fields }, { status: 400 });
  }

  const text = [
    `Name: ${clean(body.name, 200)}`,
    `Company: ${clean(body.company, 200)}`,
    `Email: ${clean(body.email, 200)}`,
    `Phone: ${clean(body.phone, 50)}`,
    `Area: ${clean(body.practice, 200)}`,
    "",
    clean(body.message, 5000),
  ].join("\n");
  try {
    await sendMail(`Website enquiry — ${clean(body.name, 100)}`, text);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "We couldn’t send your request right now." }, { status: 502 });
  }
}
