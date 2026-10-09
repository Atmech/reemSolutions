import { faqs } from "@/lib/content";
import { SectionHead } from "./ui/section-head";

// Native <details>: works without JS, keyboard accessible, animated in CSS.
export function Faq() {
  return (
    <section id="faqs" aria-label="FAQs" className="relative border-t border-rule">
      <div className="mx-auto grid max-w-[1296px] gap-12 px-6 py-24 lg:grid-cols-12 lg:px-12 lg:py-36">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHead eyebrow="FAQs" headline="Frequently asked questions." />
          </div>
        </div>
        <div className="border-t border-ink lg:col-span-7 lg:col-start-6">
          {faqs.map((f) => (
            <details key={f.q} className="faq group border-b border-rule">
              <summary className="flex cursor-pointer items-start justify-between gap-6 py-7 text-[clamp(19px,1.8vw,23px)] font-medium leading-[1.3] tracking-[-0.02em] text-ink transition-colors hover:text-cobalt">
                <span>{f.q}</span>
                <svg viewBox="0 0 16 16" className="faq-plus mt-1.5 size-4 shrink-0" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <line x1="0" y1="8" x2="16" y2="8" />
                  <line x1="8" y1="0" x2="8" y2="16" />
                </svg>
              </summary>
              <p className="max-w-[60ch] pb-8 pr-10 text-[17px] leading-[1.65] text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
