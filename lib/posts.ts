import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  /** Filename inside content/posts, e.g. "first-post.mdx". */
  file: string;
  title: string;
  /** ISO date string, e.g. "2026-03-14". */
  date: string;
  description?: string;
  cover?: string;
  coverAlt?: string;
  draft?: boolean;
};

/**
 * Reads frontmatter straight off disk. This never compiles the MDX, so the
 * index page stays cheap no matter how long the posts get.
 */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    // A leading underscore marks a file as not-a-post (the template lives here
    // too, and keeps the folder non-empty so the dynamic import always resolves).
    .filter((file) => /\.mdx?$/.test(file) && !file.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data } = matter(raw);
      const fallbackSlug = file.replace(/\.mdx?$/, "");

      if (!data.title || !data.date) {
        throw new Error(
          `content/posts/${file} is missing a title or date in its frontmatter.`,
        );
      }

      return {
        ...data,
        file,
        slug: String(data.slug ?? fallbackSlug),
        title: String(data.title),
        date: toISODate(data.date),
      } as PostMeta;
    })
    .filter((post) => process.env.NODE_ENV === "development" || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): PostMeta | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** gray-matter parses unquoted YAML dates into Date objects; normalise both forms. */
function toISODate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
