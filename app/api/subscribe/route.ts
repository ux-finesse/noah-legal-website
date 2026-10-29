import { NextResponse } from "next/server";

import { isEmail, sendMail } from "@/lib/mail";

// Notifies the firm of a new subscriber. Swap for a mailing-list provider (e.g. Mailchimp) when one is chosen.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !isEmail(body.email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  try {
    await sendMail("New insights subscriber", `Email: ${body.email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 502 });
  }
}
