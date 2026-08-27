# Personal Site Build Spec — Ben Hazel

## What this is

A personal site for Ben Hazel, the person, not the production company. The company (Salmonberry Studios, formerly Olam Films) does the client work and lead generation. This site does not. It is a home for who Ben is, what he cares about, and his own writing.

Build this as a single long home page plus a blog.

## Goals

- Give people who already know the films a place to find the person behind them.
- Give Ben a home online for his own thinking, in the form of a blog he can add to over time.
- Read as personal and grounded, not corporate. This is a person's site, not a studio's.

## Non-goals (do not build toward these)

- This is not a portfolio or booking site. Ben is not for hire as a director or DOP here. All that work goes through the company. Do not build service pages, "work with me" CTAs, rate sheets, or client-pitch language.
- No SEO-bait or growth mechanics.
- The newsletter (see below) is for following Ben's creative films, not a lead-capture or marketing funnel. Keep it low-key.

## Site structure

### 1. Home page (single long scroll)

One page, scrolling top to bottom. Sections in order:

1. **Intro / who he is.** Short. Ben, based in Port Alberni on Vancouver Island. What he does and what he cares about, in his voice. Lead with the specific before the general.
2. **About.** A longer passage. The person, the path, what pulls him toward the work he does (land, land use, Indigenous sovereignty, conservation, resource policy across BC and the Pacific Northwest). Connect the person to the work without turning it into a company pitch.
3. **Links to work.** A section pointing outward: to Salmonberry Studios (the company), to selected film credits, and to anything else worth surfacing. Treat these as references, not sales links.
4. **Newsletter signup.** A quiet email signup for people who want to follow Ben's creative films. Just an email field and a subscribe button, with a short line saying what they're signing up for. Not a gated popup, not a modal that interrupts reading. A calm inline block near the bottom.
5. **Contact form.** At the very bottom. Name, email, message. Simple. See implementation note below.

Keep the whole thing readable as prose. Do not over-section it into cards and grids. It should feel like a page you read, not a landing page you scan.

### 2. Blog

- Index page listing posts, newest first.
- Individual post pages.
- Posts are primarily text and still images, with the occasional embedded video (YouTube or Vimeo). Build a clean, responsive embed component for both. Text and stills are the default; video is the exception, so do not design the post template around video.
- Author each post in MDX (or Markdown with frontmatter) so Ben can write posts as files without a CMS. Frontmatter: title, date, slug, optional cover image, optional description.
- Support: headings, body prose, inline and full-width still images with captions, and embedded YouTube/Vimeo.

## Outbound links

This site is deliberately connected to the rest of Ben's presence. Include links to:

- **Salmonberry Studios** — the production company (the Olam Films rebrand). This is the client-facing business.
- **Ben's personal social media accounts** (placeholders for now, he'll supply handles).

Put these in the home page work section and/or a simple footer.

## Tech stack

Match Ben's existing setup so he can maintain it:

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Deploy target: Vercel**
- Blog posts as local MDX/Markdown files in the repo (no external CMS).
- Contact form: since this is a static/Vercel deploy, wire the form to a simple handler (a Vercel serverless function or a service like Formspree/Resend). Do not build a database. Leave the sending mechanism as a clearly marked placeholder Ben can fill with his own endpoint or key.
- Newsletter signup: wire to an email service (Buttondown, Mailchimp, ConvertKit, or similar). Leave the provider and API key/form action as a clearly marked placeholder. Do not build subscriber storage yourself.

## Design direction

- Quiet, grounded, coastal. This person works in forests and on the water. The site should feel like that, not like a tech product.
- Typography-led. Good reading typography matters more than any visual gimmick.
- Restraint over decoration. Whitespace, a small type scale, one or two accent choices, not a palette explosion.
- Fully responsive. Most people will read this on a phone.
- Stills should be able to breathe. Give images room; support full-width placement.

## Voice rules for any placeholder copy you write

If you draft any real prose (intro, about, etc.), write it in Ben's voice and flag it clearly as placeholder for him to replace. Follow these rules:

**Do not use:** em dashes (use commas, periods, or two sentences); the words delve, landscape (as metaphor), robust, seamless, leverage, utilize, pivotal, underscores, meticulous, foster, empower, holistic, actionable, impactful, transformative, cornerstone, ecosystem (as metaphor), nuanced, cutting-edge, game-changing, showcase, unpack, deep dive, best practices, thought leader, synergy, "at its core."

**Do not use** hollow intensifiers (truly, quite frankly, to be honest, it's worth noting), transition padding (moreover, furthermore, in today's world, as we move forward), or generic conclusions ("the future looks bright," "only time will tell," "in conclusion").

**Voice:** competent but not formal, human but not casual. Lead with the specific thing (the place, the person, the problem) before the context. Plain nouns: people, land, community, issues. Introduce people by what they care about, not their title. Contractions are fine. No throat-clearing openers, start with the point. No summary conclusions, end on substance. Vary sentence length.

Where you don't have real content, use obvious `[PLACEHOLDER]` markers rather than inventing biographical facts.

## Build order

1. Scaffold Next.js 14 + Tailwind, Vercel-ready.
2. Home page with the four sections and placeholder copy.
3. Blog index + post template + MDX pipeline.
4. YouTube/Vimeo embed component.
5. Newsletter signup block with placeholder provider.
6. Contact form with placeholder handler.
7. Footer with outbound links.
