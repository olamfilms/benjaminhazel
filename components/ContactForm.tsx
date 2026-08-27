"use client";

import { useState } from "react";
import { contact } from "@/site.config";

type Status = "idle" | "sending" | "done" | "error";

const fieldClass =
  "w-full border-b border-rule bg-transparent px-1 py-2 font-sans text-base text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!contact.formAction) {
      setStatus("error");
      setMessage("The contact form isn’t connected yet.");
      return;
    }

    setStatus("sending");
    try {
      // Formspree takes the form as FormData and answers JSON when asked to.
      const res = await fetch(contact.formAction, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          errors?: { message?: string }[];
        } | null;
        throw new Error(body?.errors?.[0]?.message ?? "That didn’t send.");
      }

      setStatus("done");
      setMessage("Got it. I’ll get back to you.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "That didn’t send.");
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

      {/* _gotcha is Formspree's honeypot: anything that fills it is discarded silently. */}
      <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="contact-gotcha">Leave this empty</label>
        <input
          id="contact-gotcha"
          name="_gotcha"
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
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
