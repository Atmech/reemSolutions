"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { deliverables } from "@/lib/content";
import { Reveal } from "./ui/motion-primitives";
import { SectionHead } from "./ui/section-head";

const EASE = [0.22, 1, 0.36, 1] as const;

// Modules extend the mark's construction: a spine plus stacked blocks with
// open channels. One module per deliverable.
const MODULES = [
  { x: 0, y: 0, w: 100, h: 400 },
  { x: 150, y: 0, w: 250, h: 100 },
  { x: 150, y: 150, w: 250, h: 110 },
  { x: 150, y: 310, w: 250, h: 90 },
];

export function Deliverables() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-label="Deliverables" className="relative bg-surface">
      <div className="mx-auto max-w-[1296px] px-6 py-24 lg:px-12 lg:py-36">
        <SectionHead eyebrow="Deliverables" headline={deliverables.headline} intro={deliverables.intro} headlineClassName="max-w-[20ch]" />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(50vh-220px)]">
              <Composition active={active} />
            </div>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7">
            {deliverables.items.map((d, i) => (
              <li
                key={d.label}
                ref={(el) => { items.current[i] = el; }}
                data-i={i}
                className="flex min-h-[38vh] flex-col justify-center border-t border-rule py-10 first:border-ink lg:min-h-[52vh]"
              >
                <Reveal>
                  <div className="flex items-center gap-4 font-mono text-[12px] text-muted">
                    <span className="tabular-nums">0{i + 1} / 04</span>
                    <motion.span
                      aria-hidden="true"
                      className="h-px w-16 origin-left bg-cobalt"
                      animate={{ scaleX: active === i ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </div>
                  <h3
                    className={`mt-5 text-[clamp(30px,3.4vw,48px)] font-semibold leading-[1.04] tracking-[-0.035em] transition-colors duration-500 ${
                      active === i ? "text-ink" : "text-ink/35"
                    }`}
                  >
                    {d.label}
                  </h3>
                  <p className={`mt-4 max-w-[38ch] text-[19px] leading-[1.55] transition-colors duration-500 ${active === i ? "text-muted" : "text-muted/60"}`}>
                    {d.copy}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-16 flex items-center gap-4 border-t border-ink pt-8 lg:mt-20">
          <KeyGlyph />
          <p className="text-[clamp(20px,2vw,26px)] font-medium tracking-[-0.02em] text-ink">{deliverables.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Composition({ active }: { active: number }) {
  return (
    <div aria-hidden="true" className="relative mx-auto max-w-[440px]">
      <svg viewBox="-2 -2 404 404" className="w-full overflow-visible">
        {MODULES.map((m, i) => {
          const built = i < active;
          const current = i === active;
          return (
            <g key={i}>
              <rect x={m.x + 0.75} y={m.y + 0.75} width={m.w - 1.5} height={m.h - 1.5} fill="none" stroke="#202522" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 6" />
              <motion.rect
                x={m.x}
                y={m.y}
                width={m.w}
                height={m.h}
                initial={false}
                animate={{
                  fill: current ? "#244DD8" : "#202522",
                  opacity: built || current ? 1 : 0,
                  scale: built || current ? 1 : 0.92,
                }}
                style={{ transformOrigin: `${m.x + m.w / 2}px ${m.y + m.h / 2}px` }}
                transition={{ duration: 0.7, ease: EASE }}
              />
              <Pattern i={i} m={m} show={built || current} />
            </g>
          );
        })}
      </svg>
      <div className="mt-6 flex items-center justify-between font-mono text-[12px] text-muted">
        <AnimatePresence mode="wait">
          <motion.span key={active} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="text-ink">
            {deliverables.items[active].label}
          </motion.span>
        </AnimatePresence>
        <span className="tabular-nums">0{active + 1} / 04</span>
      </div>
    </div>
  );
}

/** Small white schematic inside each module once it is in place. */
function Pattern({ i, m, show }: { i: number; m: (typeof MODULES)[number]; show: boolean }) {
  const t = { duration: 0.6, ease: EASE, delay: show ? 0.25 : 0 };
  const s = "#FFFFFF";
  if (i === 0) {
    // release steps down the spine
    return (
      <g>
        {[0, 1, 2, 3, 4].map((k) => (
          <motion.rect key={k} x={m.x + 30} y={m.y + 40 + k * 72} width="40" height="40" fill="none" stroke={s} strokeWidth="2" initial={false} animate={{ opacity: show ? (k === 4 ? 0.45 : 1) : 0 }} transition={{ ...t, delay: show ? 0.25 + k * 0.06 : 0 }} />
        ))}
        <motion.path d={`M${m.x + 50} ${m.y + 80}V${m.y + 112}M${m.x + 50} ${m.y + 152}V${m.y + 184}M${m.x + 50} ${m.y + 224}V${m.y + 256}M${m.x + 50} ${m.y + 296}V${m.y + 328}`} stroke={s} strokeWidth="2" initial={false} animate={{ opacity: show ? 1 : 0 }} transition={t} />
      </g>
    );
  }
  if (i === 1) {
    // evaluation ticks
    return (
      <g>
        {Array.from({ length: 8 }, (_, k) => (
          <motion.rect key={k} x={m.x + 24 + k * 27} y={m.y + 38} width="18" height="24" fill={s} initial={false} animate={{ opacity: show ? (k === 6 ? 0.35 : 1) : 0, scaleY: show ? 1 : 0 }} style={{ transformOrigin: `0px ${m.y + 62}px` }} transition={{ ...t, delay: show ? 0.25 + k * 0.04 : 0 }} />
        ))}
      </g>
    );
  }
  if (i === 2) {
    // visibility trace
    return (
      <motion.path d={`M${m.x + 24} ${m.y + 70}H${m.x + 70}V${m.y + 46}H${m.x + 110}V${m.y + 78}H${m.x + 150}V${m.y + 36}H${m.x + 190}V${m.y + 60}H${m.x + 226}`} fill="none" stroke={s} strokeWidth="2.5" initial={false} animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }} transition={{ ...t, duration: 1.1 }} />
    );
  }
  // handover: document lines
  return (
    <g>
      {[0, 1, 2].map((k) => (
        <motion.rect key={k} x={m.x + 24} y={m.y + 24 + k * 16} height="4" fill={s} initial={false} animate={{ width: show ? [180, 140, 100][k] : 0 }} transition={{ ...t, delay: show ? 0.25 + k * 0.08 : 0 }} />
      ))}
    </g>
  );
}

function KeyGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-cobalt" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="10" width="18" height="11" />
      <path d="M7 10V6h10v4" />
      <path d="M12 14v3" />
    </svg>
  );
}
