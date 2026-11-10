import { NextResponse } from "next/server";

import { clean, sendMail } from "@/lib/mail";
import { emailError, HONEYPOT } from "@/lib/validation";

// Notifies the firm of a new subscriber. Swap for a mailing-list provider (e.g. Mailchimp) when one is chosen.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Something went wrong. Please refresh and try again." }, { status: 400 });
  }
  if (clean(body[HONEYPOT])) return NextResponse.json({ ok: true });

  const err = emailError(body.email);
  if (err) return NextResponse.json({ error: err, fields: { email: err } }, { status: 400 });

  try {
    await sendMail("New insights subscriber", `Email: ${clean(body.email, 200)}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 502 });
  }
}
