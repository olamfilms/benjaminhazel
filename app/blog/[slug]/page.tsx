import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Figure from "@/components/Figure";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // The static prefix is what lets the bundler find every candidate at build time.
  const { default: Content } = await import(
    `../../../content/posts/${post.file}`
  );

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 sm:px-8 sm:py-24">
      <header>
        <time
          dateTime={post.date}
          className="font-sans text-xs tracking-[0.14em] text-ink-muted uppercase"
        >
          {formatDate(post.date)}
        </time>
        <h1 className="mt-3 font-serif text-4xl leading-[1.15] font-normal tracking-tight text-ink">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-4 font-serif text-xl leading-relaxed text-ink-soft">
            {post.description}
          </p>
        )}
      </header>

      {post.cover && (
        <Figure
          src={post.cover}
          alt={post.coverAlt ?? ""}
          size="wide"
          priority
        />
      )}

      <div className="prose prose-lg mt-12 max-w-none">
        <Content />
      </div>

      <footer className="mt-20 border-t border-rule pt-8">
        <Link
          href="/blog"
          className="font-sans text-sm text-ink-muted transition-colors hover:text-ink"
        >
          ← All posts
        </Link>
      </footer>
    </article>
  );
}
