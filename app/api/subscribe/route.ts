import { NextResponse } from "next/server";

/*
 * Newsletter signup. Adds the address as a contact in Resend, the same list
 * Salmonberry Studios film updates go to.
 *
 * Environment variables (in .env.local for local dev, and in Vercel):
 *   RESEND_API_KEY      required
 *   RESEND_SEGMENT_ID   optional, adds the contact to this segment
 *
 * Resend holds the list and handles unsubscribes. Nothing is stored here.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Bad request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();

  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json(
      { message: "That email address doesn’t look right." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[subscribe] RESEND_API_KEY is not set");
    return NextResponse.json(
      { message: "The newsletter isn’t connected yet." },
      { status: 501 },
    );
  }

  const segmentId = process.env.RESEND_SEGMENT_ID;
  const payload: Record<string, unknown> = { email, unsubscribed: false };
  if (segmentId) payload.segments = [{ id: segmentId }];

  try {
    const res = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      // Someone already on the list signing up again is fine.
      if (/already exists/i.test(text)) {
        return NextResponse.json({ message: "You’re already on the list. Thanks." });
      }
      console.error("[subscribe] Resend returned", res.status, text);
      return NextResponse.json(
        { message: "That didn’t go through. Try again in a minute." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "Thanks. You’re on the list." });
  } catch (error) {
    console.error("[subscribe] request to Resend failed", error);
    return NextResponse.json(
      { message: "That didn’t go through. Try again in a minute." },
      { status: 502 },
    );
  }
}
