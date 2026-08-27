import Link from "next/link";
import type { Metadata } from "next";
import { formatDate, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing from Benjamin Hazel.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 sm:px-8 sm:py-28">
      <h1 className="font-serif text-4xl leading-tight font-normal tracking-tight text-ink">
        Blog
      </h1>
      {posts.length === 0 ? (
        <p className="mt-16 font-sans text-sm text-ink-muted">
          Nothing here yet. Add an .mdx file to content/posts.
        </p>
      ) : (
        <ul className="mt-16 divide-y divide-rule border-t border-rule">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block py-8">
                <time
                  dateTime={post.date}
                  className="font-sans text-xs tracking-[0.14em] text-ink-muted uppercase"
                >
                  {formatDate(post.date)}
                  {post.draft && " · Draft"}
                </time>
                <h2 className="mt-2 font-serif text-2xl leading-snug font-normal text-ink underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-accent-soft">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-2 text-ink-soft">{post.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
