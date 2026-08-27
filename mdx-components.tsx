import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Figure from "@/components/Figure";
import VideoEmbed from "@/components/VideoEmbed";

/**
 * Everything here is available inside a post without importing it, so a post
 * file stays close to plain Markdown:
 *
 *   <Figure src="/photos/name.jpg" alt="..." caption="..." size="wide" />
 *   <VideoEmbed url="https://vimeo.com/123456789" caption="..." />
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Figure,
    VideoEmbed,

    // Internal links get client-side navigation; external ones open in a new tab.
    a: ({ href = "", children, ...props }) => {
      if (href.startsWith("/") || href.startsWith("#")) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noreferrer" {...props}>
          {children}
        </a>
      );
    },

    // A bare Markdown image still gets the caption treatment, using its alt text.
    img: ({ src, alt }) =>
      typeof src === "string" ? <Figure src={src} alt={alt ?? ""} /> : null,

    ...components,
  };
}
