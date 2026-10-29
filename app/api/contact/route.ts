import { NextResponse } from "next/server";

import { clean, isEmail, sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !isEmail(body.email) || !clean(body.name) || !clean(body.message)) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }
  const text = [
    `Name: ${clean(body.name, 200)}`,
    `Company: ${clean(body.company, 200)}`,
    `Email: ${body.email}`,
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
    return NextResponse.json({ error: "Could not send right now." }, { status: 502 });
  }
}
