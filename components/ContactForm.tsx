"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";

type Status = "idle" | "sending" | "done" | "error";

const fieldClass =
  "w-full border-b border-rule bg-transparent px-1 py-2 font-sans text-base text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [mailto, setMailto] = useState<string | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
      elapsed: Date.now() - startedAt.current,
    };
    const fallback = `mailto:${site.email}?subject=${encodeURIComponent(
      `Message from ${data.name}`,
    )}&body=${encodeURIComponent(data.message)}`;

    setStatus("sending");
    setMailto(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        if (res.status === 400 && body.error) {
          setMessage(body.error);
        } else {
          setMessage("That didn’t send. You can email it to me instead.");
          setMailto(fallback);
        }
        return;
      }

      setStatus("done");
      setMessage("Got it. I’ll get back to you.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("That didn’t send. You can email it to me instead.");
      setMailto(fallback);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="block font-sans text-sm text-ink-muted"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`mt-1 ${fieldClass}`}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block font-sans text-sm text-ink-muted"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`mt-1 ${fieldClass}`}
          />
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="contact-message"
          className="block font-sans text-sm text-ink-muted"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className={`mt-1 resize-y ${fieldClass}`}
        />
      </div>

      {/* Honeypot: people never see this field, so anything in it is a bot. */}
      <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="contact-gotcha">Leave this empty</label>
        <input
          id="contact-gotcha"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="border border-ink px-5 py-2 font-sans text-sm text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          {status === "sending" ? "Sending" : "Send"}
        </button>

        {status !== "idle" && status !== "sending" && message && (
          <p role="status" className="font-sans text-sm text-ink-muted">
            {message}{" "}
            {mailto && (
              <a href={mailto} className="underline underline-offset-4">
                Email it
              </a>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
