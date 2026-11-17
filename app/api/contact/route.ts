// Contact form on the homepage, sent to Ben's inbox through Resend.
// Needs RESEND_API_KEY. Sends from the verified salmonberrystudios.com domain.

import { site } from "@/site.config";

const MIN_FILL_MS = 2500;
const LIMITS = { name: 200, email: 200, message: 5000 };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Spam: the hidden field is filled, or the form was submitted faster than a person types.
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if (str(body.website) || elapsed < MIN_FILL_MS) {
    return Response.json({ ok: true });
  }

  const data = {
    name: str(body.name),
    email: str(body.email),
    message: str(body.message),
  };

  if (!data.name) return Response.json({ error: "Please add your name." }, { status: 400 });
  if (!EMAIL_RE.test(data.email)) return Response.json({ error: "Please check your email address." }, { status: 400 });
  if (!data.message) return Response.json({ error: "Please add a message." }, { status: 400 });
  for (const [key, max] of Object.entries(LIMITS)) {
    if (data[key as keyof typeof data].length > max) {
      return Response.json({ error: "That message is a bit long. Please email me directly." }, { status: 400 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY is not set. Message not sent.");
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Benjamin Hazel website <website@salmonberrystudios.com>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Message from ${data.name} via benjaminhazel.com`,
        text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return Response.json({ error: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] Resend request failed", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
