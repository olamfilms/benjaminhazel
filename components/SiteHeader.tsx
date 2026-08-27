import Link from "next/link";
import { site } from "@/site.config";

export default function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-6 px-6 py-5 sm:px-8">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-ink no-underline"
        >
          {site.name}
        </Link>
        <nav className="font-sans text-sm">
          <ul className="flex items-baseline gap-6">
            <li>
              <Link
                href="/#about"
                className="text-ink-muted transition-colors hover:text-ink"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-ink-muted transition-colors hover:text-ink"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="text-ink-muted transition-colors hover:text-ink"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
