"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { problems } from "@/lib/content";
import { Reveal } from "./ui/motion-primitives";
import { SectionHead } from "./ui/section-head";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Problems() {
  return (
    <section aria-label="Production problems" className="relative border-t border-rule">
      <div className="mx-auto grid max-w-[1296px] gap-14 px-6 py-24 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-36">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHead eyebrow="Production problems" headline={problems.headline} intro={problems.intro} />
          </div>
        </div>
        <ol className="border-t border-ink lg:col-span-7 lg:mt-2">
          {problems.items.map((p, i) => (
            <ProblemRow key={p.label} index={i} label={p.label} copy={p.copy} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProblemRow({ index, label, copy }: { index: number; label: string; copy: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const [hover, setHover] = useState(false);
  const active = inView;
  return (
    <li
      ref={ref}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="group relative border-b border-rule"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-cobalt"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hover ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <Reveal delay={index * 0.06} className="grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 py-9 sm:grid-cols-[48px_1fr_88px] sm:gap-x-8 lg:py-11">
        <span className="pt-2 font-mono text-[12px] tabular-nums text-muted">0{index + 1}</span>
        <div className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-2">
          <h3 className="text-[clamp(28px,3vw,40px)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink">{label}</h3>
          <p className="mt-3 max-w-[40ch] text-[18px] leading-[1.55] text-muted">{copy}</p>
        </div>
        <div className="col-start-2 sm:col-start-3 sm:justify-self-end">
          <Glyph kind={index} active={active} hover={hover} />
        </div>
      </Reveal>
    </li>
  );
}

/** Orthogonal, open-counter glyphs per brand icon rules. */
function Glyph({ kind, active, hover }: { kind: number; active: boolean; hover: boolean }) {
  const ink = "#202522";
  const cobalt = "#244DD8";
  const common = { className: "size-[72px] sm:size-[88px]", viewBox: "0 0 88 88", fill: "none", "aria-hidden": true } as const;

  if (kind === 0) {
    // Quality: a test matrix filling in
    const order = [0, 4, 8, 1, 5, 2, 6, 3, 7];
    return (
      <svg {...common}>
        {Array.from({ length: 9 }, (_, i) => {
          const x = 8 + (i % 3) * 26, y = 8 + Math.floor(i / 3) * 26;
          return (
            <g key={i}>
              <rect x={x + 0.5} y={y + 0.5} width="21" height="21" stroke={ink} strokeOpacity="0.25" />
              <motion.rect
                x={x} y={y} width="22" height="22" fill={i === 4 ? cobalt : ink}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={active ? { opacity: hover ? (i % 2 ? 0.25 : 1) : 1, scale: 1 } : undefined}
                style={{ transformOrigin: `${x + 11}px ${y + 11}px` }}
                transition={{ duration: 0.5, ease: EASE, delay: hover ? 0 : 0.3 + order.indexOf(i) * 0.07 }}
              />
            </g>
          );
        })}
      </svg>
    );
  }
  if (kind === 1) {
    // Performance: a request trace stepping through the path
    const d = "M6 70H26V44H46V58H62V22H82";
    return (
      <svg {...common}>
        <path d="M6 82H82" stroke={ink} strokeOpacity="0.25" />
        <path d="M6 6V82" stroke={ink} strokeOpacity="0.25" />
        <motion.path d={d} stroke={ink} strokeWidth="3" initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : undefined} transition={{ duration: 1.4, ease: EASE, delay: 0.3 }} />
        <motion.rect
          width="8" height="8" fill={cobalt}
          initial={{ x: 2, y: 66 }}
          animate={active ? (hover ? { x: [2, 22, 22, 42, 42, 58, 58, 78], y: [66, 66, 40, 40, 54, 54, 18, 18] } : { x: 78, y: 18 }) : undefined}
          transition={{ duration: hover ? 1.2 : 1.4, ease: hover ? "linear" : EASE, delay: hover ? 0 : 0.3 }}
        />
      </svg>
    );
  }
  if (kind === 2) {
    // Cost: stacked usage modules
    const bars = [
      { x: 8, h: [24, 14] },
      { x: 34, h: [36, 18] },
      { x: 60, h: [20, 30] },
    ];
    return (
      <svg {...common}>
        <path d="M2 82H86" stroke={ink} strokeOpacity="0.25" />
        {bars.map((b, i) => {
          const h1 = hover ? b.h[1] : b.h[0];
          const h2 = hover ? b.h[0] : b.h[1];
          return (
            <g key={i}>
              <motion.rect x={b.x} width="20" fill={ink} initial={{ height: 0, y: 80 }} animate={active ? { height: h1, y: 80 - h1 } : undefined} transition={{ duration: 0.8, ease: EASE, delay: hover ? 0 : 0.3 + i * 0.1 }} />
              <motion.rect x={b.x} width="20" fill={i === 1 ? cobalt : ink} fillOpacity={i === 1 ? 1 : 0.3} initial={{ height: 0, y: 80 }} animate={active ? { height: h2, y: 80 - h1 - 4 - h2 } : undefined} transition={{ duration: 0.8, ease: EASE, delay: hover ? 0.05 : 0.6 + i * 0.1 }} />
            </g>
          );
        })}
      </svg>
    );
  }
  // Operations: a monitored module with an alert pulse
  return (
    <svg {...common}>
      <rect x="20.5" y="20.5" width="47" height="47" stroke={ink} strokeWidth="3" />
      <motion.rect x="34" y="34" width="20" height="20" fill={cobalt} initial={{ scale: 0 }} animate={active ? { scale: 1 } : undefined} style={{ transformOrigin: "44px 44px" }} transition={{ duration: 0.6, ease: EASE, delay: 0.4 }} />
      <motion.rect
        x="20.5" y="20.5" width="47" height="47" stroke={cobalt} strokeWidth="1.5"
        style={{ transformOrigin: "44px 44px" }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: [0.8, 0], scale: [1, 1.75] } : undefined}
        transition={{ duration: hover ? 0.9 : 2.2, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
      />
      <path d="M44 4V14M44 74V84M4 44H14M74 44H84" stroke={ink} strokeOpacity="0.35" strokeWidth="2" />
    </svg>
  );
}
