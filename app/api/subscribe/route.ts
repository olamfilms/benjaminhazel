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

  const API = "https://api.resend.com";
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const enc = encodeURIComponent(email);
  const fail = () =>
    NextResponse.json({ message: "That didn’t go through. Try again in a minute." }, { status: 502 });

  try {
    // Already a contact (say, from a film signup)? Add them to the list and topic,
    // but keep their original signup source: it's the consent record.
    const existing = await fetch(`${API}/contacts/${enc}`, { headers });
    if (existing.ok) {
      const steps: [string, RequestInit][] = [
        [`${API}/contacts/${enc}`, { method: "PATCH", headers, body: JSON.stringify({ unsubscribed: false }) }],
        [`${API}/contacts/${enc}/segments/${SEGMENT_ID}`, { method: "POST", headers }],
        [`${API}/contacts/${enc}/topics`, { method: "PATCH", headers, body: JSON.stringify([{ id: TOPIC_ID, subscription: "opt_in" }]) }],
      ];
      for (const [url, init] of steps) {
        const u = await fetch(url, init);
        if (!u.ok) console.error("[subscribe] Resend update error", u.status, url, await u.text());
      }
      return NextResponse.json({ message: "You’re on the list. Thanks." });
    }
    if (existing.status !== 404) {
      console.error("[subscribe] Resend lookup error", existing.status, await existing.text());
      return fail();
    }

    const res = await fetch(`${API}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        unsubscribed: false,
        properties: { source: "benjaminhazel.com" },
        segments: [{ id: SEGMENT_ID }],
        topics: [{ id: TOPIC_ID, subscription: "opt_in" }],
      }),
    });
    if (!res.ok) {
      console.error("[subscribe] Resend returned", res.status, await res.text());
      return fail();
    }

    return NextResponse.json({ message: "Thanks. You’re on the list." });
  } catch (error) {
    console.error("[subscribe] request to Resend failed", error);
    return fail();
  }
}
