# benhazel.com

Personal site for Ben Hazel. One long home page plus a blog. Next.js App Router,
Tailwind, MDX posts as files, deployed on Vercel.

This is not the company site. Client work goes through Salmonberry Studios and
is linked from here, not sold here.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Built on the current Next.js (16, App Router) rather than the 14 named in
`Instructions and Copy/personal-site-spec.md`. Same App Router structure, but
Turbopack is the default bundler, which is why the MDX remark plugins in
`next.config.ts` are named as strings instead of imported.

## Where things are

| Path                      | What it holds                                        |
| ------------------------- | ---------------------------------------------------- |
| `site.config.ts`          | Name, URL, email, outbound links, newsletter provider |
| `app/page.tsx`            | Home page layout, one component per section           |
| `content/home/*.mdx`      | The home page prose, one file per section             |
| `content/posts/*.mdx`     | Blog posts                                            |
| `components/`             | Figure, VideoEmbed, the two forms, header, footer     |
| `app/api/contact`         | Contact form handler (stub)                           |
| `app/api/subscribe`       | Newsletter handler (stub)                             |
| `Photos/`                 | Full-size originals, not committed                    |
| `public/photos/`          | Web-sized versions, committed                         |

## Writing a post

There is no CMS and no login. A post is a file in `content/posts/`, and the
filename becomes the URL unless you set `slug` yourself.

`content/posts/_template.mdx` is a fill-in-the-blanks starting point. Copy it.
Any file in that folder starting with an underscore is skipped, so the template
never shows up on the site.

### From a browser, including a phone

Once the repo is on GitHub and connected to Vercel, you never need a terminal:

1. Go to `content/posts/` in the GitHub repo.
2. **Add file → Create new file.** Name it `something-like-this.mdx`.
3. Paste the contents of `_template.mdx` and write.
4. **Commit changes.**

Vercel rebuilds and the post is live in about a minute. Editing an existing post
is the same, using the pencil icon.

The one thing this flow can't do is add photos, because images need resizing
first. See "Adding photos" below.

### The frontmatter

```mdx
---
title: A week on the inlet
date: 2026-08-14
description: One line, shown on the index and in link previews. Optional.
cover: /photos/something.jpg
coverAlt: What is in the photo. Optional, but write it if there is a cover.
draft: true
---

Body text is plain Markdown. Headings, lists, quotes, links, all normal.
```

`draft: true` keeps a post visible while running locally and out of the built
site.

Two components are available in any post without importing them:

```mdx
<Figure
  src="/photos/name.jpg"
  alt="What is in the photo."
  caption="Optional caption."
  size="wide"
/>

<VideoEmbed url="https://vimeo.com/123456789" caption="Optional caption." />
```

`size` on `Figure` is `column` (default, sits in the text), `wide` (breaks out on
large screens), or `full` (edge to edge). You don't pass dimensions; the
component reads them off the file.

`VideoEmbed` takes any normal YouTube or Vimeo URL, including `youtu.be` links,
Shorts, and unlisted Vimeo links with a hash.

## Adding photos

Drop full-size originals in `Photos/`, then:

```bash
npm run photos
```

That writes web-sized JPEGs into `public/photos/` with kebab-case filenames.
Originals stay out of git.

## Before launch

Everything below is still outstanding.

- **Kit credentials.** `KIT_API_KEY` and `KIT_FORM_ID` in `.env.local` and in the
  Vercel project settings. See `app/api/subscribe/route.ts`.
- **Film links.** `The Private Forest` and `The Roundtable` in `site.config.ts`
  have no `href`, so they render as plain text rather than dead links. Add one
  and they become links.
- **A first post.** The blog is empty and reads as such. Nothing is broken.

API keys go in `.env.local` locally and in the Vercel project settings for
production. See `.env.example`. The Formspree URL is not a secret and belongs in
`site.config.ts`.

## Deploying

Import the repo in Vercel. It detects Next.js, and no build settings need
changing. Add any environment variables from `.env.example` that you've filled
in.
