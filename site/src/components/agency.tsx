"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { agency } from "@/lib/content";
import { Cta } from "./ui/cta";
import { Mark } from "./ui/mark";
import { Reveal, SplitText } from "./ui/motion-primitives";

const WORDS = ["Deployment", "Validation", "Ongoing operations", "Handover"];

export function Agency() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const clip = useTransform(scrollYProgress, [0, 0.3], ["inset(8% 4% 8% 4%)", "inset(0% 0% 0% 0%)"]);

  return (
    <section ref={ref} aria-label="Agency partners" className="relative overflow-hidden bg-paper">
      <motion.div style={{ clipPath: clip }} className="on-dark relative bg-cobalt text-white">
        <div aria-hidden="true" className="overflow-hidden border-b border-white/15 py-5">
          <div className="marquee flex w-max items-center">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center">
                {WORDS.concat(WORDS).map((w, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center gap-8 pr-8 text-[clamp(22px,2.4vw,32px)] font-medium tracking-[-0.02em] text-white/80">
                    {w}
                    <Mark className="size-5 text-white/60" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-[1296px] gap-10 px-6 py-24 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-32">
          <div className="lg:col-span-7">
            <Reveal y={10}>
              <p className="text-[16px] font-medium leading-snug text-white/80">Agency partners</p>
            </Reveal>
            <h2 tabIndex={-1} data-focus-target className="mt-4 max-w-[16ch] text-[clamp(34px,4.6vw,64px)] font-semibold leading-[1.02] tracking-[-0.04em]">
              <SplitText text={agency.headline} />
            </h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.2}>
              <p className="text-[19px] leading-[1.6] text-white/90">{agency.copy}</p>
            </Reveal>
            <Reveal delay={0.3} className="mt-9">
              <Cta to="enquiry" engagement="partnership" source="agency" variant="inverse">
                {agency.cta}
              </Cta>
            </Reveal>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
