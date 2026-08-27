import { NextResponse } from "next/server";

/*
 * Newsletter signup, wired to Kit (formerly ConvertKit).
 *
 * Needs two environment variables, in .env.local for local dev and in the
 * Vercel project settings for production:
 *
 *   KIT_API_KEY   Kit dashboard → Settings → Advanced → API → V4 API key
 *   KIT_FORM_ID   the number in the URL when you open the form in Kit
 *
 * No subscriber list is stored in this repo. Kit holds the list, sends the
 * confirmation email, and handles unsubscribes.
 *
 * Endpoint: POST https://api.kit.com/v4/forms/{form_id}/subscribers
 * https://developers.kit.com/api-reference/forms/add-subscriber-to-form-by-email-address
 */

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Bad request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { message: "That email address doesn’t look right." },
      { status: 400 },
    );
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    console.warn("[subscribe] KIT_API_KEY or KIT_FORM_ID is not set");
    return NextResponse.json(
      { message: "The newsletter isn’t connected yet." },
      { status: 501 },
    );
  }

  try {
    const res = await fetch(
      `https://api.kit.com/v4/forms/${formId}/subscribers`,
      {
        method: "POST",
        headers: {
          "X-Kit-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_address: email }),
      },
    );

    // Kit answers 201 for a new subscriber and 200 if they were already on the form.
    if (!res.ok) {
      console.error("[subscribe] Kit returned", res.status, await res.text());
      return NextResponse.json(
        { message: "That didn’t go through. Try again in a minute." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: "Thanks. Check your email to confirm.",
    });
  } catch (error) {
    console.error("[subscribe] request to Kit failed", error);
    return NextResponse.json(
      { message: "That didn’t go through. Try again in a minute." },
      { status: 502 },
    );
  }
}
