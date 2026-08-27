/*
 * One place for the things Ben will want to change without touching components.
 * Anything marked PLACEHOLDER needs a real value before launch.
 */

export const site = {
  name: "Benjamin Hazel",
  url: "https://benjaminhazel.com",
  // Ben's own words, from content/home/intro.mdx. Used for search results and link previews.
  description:
    "Benjamin Hazel is a BC-based documentary filmmaker and the owner of Salmonberry Studios. Ben's work focuses on the politics of lands and resources in British Columbia.",
  location: "British Columbia",
  email: "ben@salmonberrystudios.com",
  /** Thin banner saying the page is unfinished. Off now that the prose is Ben's. */
  showDraftNotice: false,
};

type LinkItem = {
  label: string;
  note?: string;
  /** Leave unset until there's somewhere to send people; the list renders plain text instead of a dead link. */
  href?: string;
};

/** The production company. Used by the Work section and the footer. */
export const company: LinkItem = {
  label: "Salmonberry Studios",
  href: "https://salmonberrystudios.com",
  note: "Client-commissioned work.",
};

/** Selected films. References, not sales links. */
export const films: LinkItem[] = [
  {
    label: "The Private Forest",
    note: "Why is so much of Vancouver Island private forest land?",
    // PLACEHOLDER: href, once there's somewhere to watch it.
  },
  {
    label: "The Roundtable",
    note: "Collaboration as a form of salmon stewardship.",
    // PLACEHOLDER: href, once there's somewhere to watch it.
  },
];

export const workLinks: LinkItem[] = [company, ...films];

export const socialLinks: LinkItem[] = [
  { label: "Instagram", href: "https://instagram.com/benjaminhazelfilm" },
  { label: "YouTube", href: "https://www.youtube.com/@salmonberrystudios" },
];

export const contact = {
  /*
   * Formspree endpoint. Not a secret, so it lives here rather than in an env
   * var. Formspree forwards submissions to site.email and handles spam filtering.
   */
  formAction: "https://formspree.io/f/xoeqagbe" as string | null,
};

export const newsletter = {
  /*
   * The signup posts to /api/subscribe, which talks to Kit. That route needs
   * KIT_API_KEY and KIT_FORM_ID set in .env.local and in Vercel.
   *
   * Escape hatch: set this to Kit's embed form action
   * (https://app.kit.com/forms/<form-id>/subscriptions) and the form posts
   * straight to Kit instead, no API key and no route involved. The tradeoff is
   * that the visitor gets sent to Kit's own confirmation page.
   */
  action: null as string | null,
  emailFieldName: "email_address",
};
