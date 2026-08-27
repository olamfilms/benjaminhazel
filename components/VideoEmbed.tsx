type Props = {
  /** Any normal YouTube or Vimeo URL. Watch links, share links, and embed links all work. */
  url: string;
  title?: string;
  caption?: string;
  /** Defaults to 16:9. Pass "4/3" or "1/1" for older or square material. */
  ratio?: string;
};

type Parsed = { src: string; provider: "YouTube" | "Vimeo" } | null;

function parse(url: string): Parsed {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return id ? { src: `https://www.youtube-nocookie.com/embed/${id}`, provider: "YouTube" } : null;
  }

  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    const id =
      parsed.searchParams.get("v") ??
      parsed.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
    return id ? { src: `https://www.youtube-nocookie.com/embed/${id}`, provider: "YouTube" } : null;
  }

  if (host.endsWith("vimeo.com")) {
    // Unlisted Vimeo links look like /123456789/abcdef1234 — the second part is the hash.
    const [, id, hash] = parsed.pathname.match(/^\/(?:video\/)?(\d+)(?:\/(\w+))?/) ?? [];
    if (!id) return null;
    const src = `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}`;
    return { src, provider: "Vimeo" };
  }

  return null;
}

export default function VideoEmbed({ url, title, caption, ratio = "16/9" }: Props) {
  const video = parse(url);

  if (!video) {
    return (
      <p className="font-sans text-sm text-ink-muted">
        Couldn&apos;t read that video link.{" "}
        <a href={url} className="underline underline-offset-4">
          Open it directly
        </a>
        .
      </p>
    );
  }

  return (
    <figure className="not-prose my-10">
      <div
        className="w-full overflow-hidden bg-paper-sunk"
        style={{ aspectRatio: ratio }}
      >
        <iframe
          src={video.src}
          title={title ?? `${video.provider} video`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 font-sans text-sm text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
