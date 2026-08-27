import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { imageSize } from "image-size";

type Props = {
  /** Path under /public, e.g. "/photos/easy-rig-ferry-portraits-23.jpg". */
  src: string;
  alt: string;
  caption?: string;
  /**
   * column — sits inside the text measure, the default.
   * wide   — breaks out past the text on larger screens.
   * full   — edge to edge.
   */
  size?: "column" | "wide" | "full";
  priority?: boolean;
};

const widthClass = {
  column: "",
  wide: "lg:-mx-32 xl:-mx-48",
  full: "w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]",
} as const;

const sizesAttr = {
  column: "(max-width: 768px) 100vw, 680px",
  wide: "(max-width: 1024px) 100vw, 1000px",
  full: "100vw",
} as const;

/** Reads the real pixel dimensions off disk so posts only need src and alt. */
function measure(src: string) {
  try {
    const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    const { width, height } = imageSize(fs.readFileSync(file));
    if (width && height) return { width, height };
  } catch {
    // Fall through to a sane default rather than breaking the page.
  }
  return { width: 1600, height: 1067 };
}

export default function Figure({
  src,
  alt,
  caption,
  size = "column",
  priority = false,
}: Props) {
  const { width, height } = measure(src);

  return (
    <figure className={`not-prose my-10 ${widthClass[size]}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizesAttr[size]}
        className="h-auto w-full bg-paper-sunk"
      />
      {caption && (
        <figcaption
          className={`mt-3 font-sans text-sm text-ink-muted ${
            size === "full" ? "mx-auto max-w-2xl px-6 sm:px-8" : ""
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
