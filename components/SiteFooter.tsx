import Link from "next/link";
import { company, site, socialLinks } from "@/site.config";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
        <div className="flex flex-col gap-8 font-sans text-sm text-ink-muted sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <p className="text-ink">{site.name}</p>
            <p className="mt-1">{site.location}</p>
            <p className="mt-3">
              Client work goes through{" "}
              <a
                href={company.href}
                className="text-ink underline decoration-accent-soft underline-offset-4 transition-colors hover:text-accent"
              >
                {company.label}
              </a>
              .
            </p>
          </div>

          <nav aria-label="Elsewhere">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-ink"
                    rel="me noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/blog" className="transition-colors hover:text-ink">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-10 font-sans text-xs text-ink-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
