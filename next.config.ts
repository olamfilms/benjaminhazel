import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

/*
 * Turbopack serializes loader options, so remark plugins are named as strings
 * rather than imported. remark-frontmatter has to run before
 * remark-mdx-frontmatter, which turns the parsed YAML into an export.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-gfm", {}],
      // Straight quotes and dashes typed in the .mdx files become typographic ones.
      ["remark-smartypants", {}],
      ["remark-frontmatter", "yaml"],
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
  },
});

export default withMDX(nextConfig);
