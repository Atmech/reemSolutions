"use client";

import { useRef } from "react";
import { engagements } from "@/lib/content";
import { Cta } from "./ui/cta";
import { Odometer, Reveal } from "./ui/motion-primitives";
import { SectionHead } from "./ui/section-head";

type Offer = (typeof engagements.offers)[number];

export function Engagements() {
  return (
    <section id="services" aria-label="Engagements" className="relative border-t border-rule">
      <div className="mx-auto max-w-[1296px] px-6 py-24 lg:px-12 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead eyebrow="Engagements" headline={engagements.headline} className="lg:col-span-7" />
          <Reveal delay={0.2} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[18px] leading-[1.6] text-muted">{engagements.intro}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {engagements.offers.map((o, i) => (
            <Reveal key={o.n} delay={i * 0.1} y={40} className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""}>
              <OfferCard offer={o} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 grid gap-4 border-t border-rule pt-6 lg:grid-cols-12">
          <p className="text-[15px] font-medium text-ink lg:col-span-3">Pricing notes</p>
          <p className="max-w-[80ch] text-[15px] leading-[1.65] text-muted lg:col-span-9">{engagements.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

function OfferCard({ offer: o }: { offer: Offer }) {
  const ref = useRef<HTMLElement>(null);

  // Cursor-tracked light on the card edge and surface.
  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      aria-labelledby={`offer-${o.n}`}
      className="group relative h-full p-px [--mx:50%] [--my:0%]"
      style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgba(36,77,216,0.9), transparent 45%), var(--color-rule)" }}
    >
      <div
        className="relative flex h-full flex-col bg-paper p-7 lg:p-8"
        style={{ backgroundImage: "radial-gradient(520px circle at var(--mx) var(--my), rgba(36,77,216,0.06), transparent 50%)" }}
      >
        <div className="flex items-center justify-between font-mono text-[12px] text-muted">
          <span className="tabular-nums">Offer {o.n}</span>
          <span aria-hidden="true" className="flex gap-1">
            {[0, 1, 2].map((k) => (
              <span key={k} className={`size-2 transition-colors duration-300 ${k < Number(o.n) ? "bg-ink group-hover:bg-cobalt" : "ring-1 ring-inset ring-rule"}`} style={{ transitionDelay: `${k * 60}ms` }} />
            ))}
          </span>
        </div>

        <h3 id={`offer-${o.n}`} className="mt-10 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
          {o.name}
        </h3>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-2 text-ink">
          {o.pricePrefix ? <span className="text-[16px] text-muted">{o.pricePrefix}</span> : null}
          <Odometer value={o.price} className="text-[clamp(44px,4.4vw,60px)] font-semibold tracking-[-0.045em]" delay={0.2} />
          {o.priceSuffix ? <span className="text-[16px] text-muted">{o.priceSuffix}</span> : null}
        </p>
        <p className="mt-2 font-mono text-[12.5px] leading-[1.5] text-muted">{o.timing}</p>

        <p className="mt-7 text-[17px] leading-[1.6] text-ink/85">{o.description}</p>

        <ul className="mt-7 flex flex-col gap-3 border-t border-rule pt-6">
          {o.included.map((item) => (
            <li key={item} className="flex gap-3 text-[16px] leading-[1.5] text-ink">
              <span aria-hidden="true" className="mt-[9px] inline-block size-1.5 shrink-0 bg-cobalt" />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-7 border-l-2 border-ink pl-4 text-[14.5px] leading-[1.55] text-muted">
          <span className="sr-only">Scope: </span>
          {o.scope}
        </p>

        <div className="mt-auto pt-9">
          <Cta to="enquiry" engagement={o.engagement} source={`offer_${o.engagement}`} variant={o.n === "01" ? "primary" : "secondary"} magnetic={false} className="w-full justify-between">
            {o.cta}
          </Cta>
        </div>
      </div>
    </article>
  );
}
