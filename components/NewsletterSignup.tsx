"use client";

import { useState } from "react";
import { newsletter } from "@/site.config";

type Status = "idle" | "sending" | "done" | "error";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  /*
   * If `newsletter.action` is set in site.config.ts the form posts straight to the
   * provider the way their embed code does, and this component gets out of the way.
   * Otherwise it posts to /api/subscribe, which is a stub.
   */
  if (newsletter.action) {
    return (
      <form
        action={newsletter.action}
        method="post"
        target="_blank"
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <EmailField name={newsletter.emailFieldName} />
        <SubmitButton>Subscribe</SubmitButton>
      </form>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");

    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { message?: string };

      if (!res.ok) throw new Error(data.message ?? "That didn't go through.");

      setStatus("done");
      setMessage(data.message ?? "You're on the list.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "That didn't go through.",
      );
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <EmailField name="email" />
        <SubmitButton disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Subscribe"}
        </SubmitButton>
      </form>

      {status !== "idle" && status !== "sending" && message && (
        <p
          role="status"
          className={`mt-3 font-sans text-sm ${
            status === "error" ? "text-ink" : "text-ink-muted"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

function EmailField({ name }: { name: string }) {
  return (
    <>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name={name}
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="w-full min-w-0 border-b border-rule bg-transparent px-1 py-2 font-sans text-base text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none sm:max-w-xs"
      />
    </>
  );
}

function SubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="shrink-0 border border-ink px-5 py-2 font-sans text-sm text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink"
    >
      {children}
    </button>
  );
}
