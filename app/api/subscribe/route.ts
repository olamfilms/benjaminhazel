import { NextResponse } from "next/server";

/*
 * Newsletter signup. Adds the address as a contact in Resend, the same list
 * Salmonberry Studios film updates go to.
 *
 * Needs RESEND_API_KEY (in .env.local for local dev, and in Vercel).
 * Signups join the "Salmonberry Films" segment, subscribed to the
 * "New Salmonberry films" topic. IDs are from the Resend dashboard.
 *
 * Resend holds the list and handles unsubscribes. Nothing is stored here.
 */

const SEGMENT_ID = "d1422630-e3fa-497f-a1ae-bdaf62a8ce35"; // Salmonberry Films
const TOPIC_ID = "6a839e6d-415e-4ef0-bc8f-6699757acd50"; // New Salmonberry films

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

  const payload = {
    email,
    unsubscribed: false,
    properties: { source: "benjaminhazel.com" },
    segments: [{ id: SEGMENT_ID }],
    topics: [{ id: TOPIC_ID, subscription: "opt_in" }],
  };

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
