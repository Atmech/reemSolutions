"use client";

import { Eyebrow, Reveal, SplitText } from "./motion-primitives";

export function SectionHead({
  eyebrow,
  headline,
  intro,
  tone = "light",
  className,
  headlineClassName,
}: {
  eyebrow: string;
  headline: string;
  intro?: string;
  tone?: "light" | "dark";
  className?: string;
  headlineClassName?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={className}>
      <Reveal y={10}>
        <Eyebrow tone={tone}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <h2 tabIndex={-1} data-focus-target className={`mt-4 ${headlineClassName ?? "max-w-[18ch]"} text-[clamp(34px,4.6vw,64px)] font-semibold leading-[1.02] tracking-[-0.04em] ${dark ? "text-white" : "text-ink"}`}>
        <SplitText text={headline} />
      </h2>
      {intro ? (
        <Reveal delay={0.25}>
          <p className={`mt-6 max-w-[52ch] text-[18px] leading-[1.6] ${dark ? "text-ink-muted" : "text-muted"}`}>{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
