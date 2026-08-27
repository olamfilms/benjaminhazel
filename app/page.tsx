import Figure from "@/components/Figure";
import NewsletterSignup from "@/components/NewsletterSignup";
import ContactForm from "@/components/ContactForm";
import { site, workLinks } from "@/site.config";

/*
 * The prose on this page lives in content/home/*.mdx, one file per section, so
 * it can be written as plain text. This file is layout only.
 */
import Intro from "@/content/home/intro.mdx";
import About from "@/content/home/about.mdx";

export default function Home() {
  return (
    <>
      {site.showDraftNotice && (
        <p className="border-b border-rule bg-paper-sunk px-6 py-3 text-center font-sans text-sm text-ink-muted sm:px-8">
          Placeholder copy. The writing on this page hasn’t been added yet.
        </p>
      )}

      <IntroSection />
      <AboutSection />
      <WorkSection />
      <NewsletterSection />
      <ContactSection />
    </>
  );
}

/* 1. Intro ------------------------------------------------------------------ */

function IntroSection() {
  return (
    <section className="mx-auto max-w-2xl px-6 pt-20 pb-4 sm:px-8 sm:pt-28">
      <h1 className="font-serif text-4xl leading-[1.1] font-normal tracking-tight text-ink sm:text-5xl">
        {site.name}
      </h1>

      {/* first:text-xl lifts the opening paragraph without asking the writer to mark it up */}
      <div className="prose prose-lg mt-8 max-w-none prose-p:first:text-xl prose-p:first:leading-relaxed sm:prose-p:first:text-2xl">
        <Intro />
      </div>

      <Figure
        src="/photos/easy-rig-ferry-portraits-23.jpg"
        alt="A camera operator in a cap and headphones holds a cinema camera on a support rig, against a pastel sunset sky."
        size="wide"
        priority
      />
    </section>
  );
}

/* 2. About ------------------------------------------------------------------ */

function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-2xl scroll-mt-20 px-6 py-16 sm:px-8"
    >
      <SectionLabel>About</SectionLabel>
      <div className="prose prose-lg mt-8 max-w-none">
        <About />
      </div>
    </section>
  );
}

/* 3. Work links ------------------------------------------------------------- */

function WorkSection() {
  return (
    <section
      id="work"
      className="mx-auto max-w-2xl scroll-mt-20 px-6 py-16 sm:px-8"
    >
      <SectionLabel>Work</SectionLabel>

      <ul className="mt-8 divide-y divide-rule border-y border-rule">
        {workLinks.map((link, i) => {
          const body = (
            <>
              <span className="font-serif text-xl text-ink underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-accent-soft">
                {link.label}
              </span>
              {link.note && (
                <span className="mt-1 block font-sans text-sm text-ink-muted">
                  {link.note}
                </span>
              )}
            </>
          );

          return (
            <li key={`${link.label}-${i}`}>
              {/* An entry with nowhere to send people is plain text, not a dead link. */}
              {link.href ? (
                <a
                  href={link.href}
                  className="group block py-5 no-underline"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  {body}
                </a>
              ) : (
                <div className="py-5">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 4. Newsletter ------------------------------------------------------------- */

function NewsletterSection() {
  return (
    <section
      id="newsletter"
      className="mx-auto max-w-2xl scroll-mt-20 px-6 py-16 sm:px-8"
    >
      <SectionLabel>Follow My Work</SectionLabel>
      <NewsletterSignup />
    </section>
  );
}

/* 5. Contact ---------------------------------------------------------------- */

function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-2xl scroll-mt-20 px-6 py-16 sm:px-8"
    >
      <SectionLabel>Contact</SectionLabel>
      <ContactForm />
    </section>
  );
}

/* --------------------------------------------------------------------------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-xs tracking-[0.18em] text-ink-muted uppercase">
      {children}
    </p>
  );
}
