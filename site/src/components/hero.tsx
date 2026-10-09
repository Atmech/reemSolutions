"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { hero } from "@/lib/content";
import { GridField } from "./grid-field";
import { ReleaseConsole } from "./release-console";
import { Cta } from "./ui/cta";
import { Eyebrow, Reveal, SplitText, introDelay } from "./ui/motion-primitives";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [d] = useState(introDelay);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yHead = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const yConsole = useTransform(scrollYProgress, [0, 1], ["0%", "-34%"]);
  const fade = useTransform(scrollYProgress, [0.4, 0.95], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative isolate overflow-hidden pt-[72px]">
      <GridField className="-z-10" />

      <div className="mx-auto max-w-[1296px] px-6 pb-20 pt-14 lg:px-12 lg:pb-28 lg:pt-24">
        <Reveal immediate delay={d} y={12}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </Reveal>

        <motion.div style={{ y: yHead, opacity: fade }}>
          <SplitText
            as="h1"
            immediate
            delay={d + 0.1}
            stagger={0.07}
            text={hero.headline}
            className="mt-7 max-w-[13ch] text-[clamp(44px,7.2vw,104px)] font-semibold leading-[0.96] tracking-[-0.045em] text-ink"
          />
        </motion.div>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <motion.div style={{ opacity: fade }} className="lg:col-span-5 lg:pt-2">
            <Reveal immediate delay={d + 0.55}>
              <p className="max-w-[46ch] text-[19px] leading-[1.6] text-ink/85 lg:text-[20px]">{hero.copy}</p>
            </Reveal>
            <Reveal immediate delay={d + 0.68} className="mt-9 flex flex-wrap items-center gap-3">
              <Cta to="enquiry" source="hero_primary">{hero.primary}</Cta>
              <Cta to="how-we-work" source="hero_secondary" variant="secondary" down>
                {hero.secondary}
              </Cta>
            </Reveal>
            <Reveal immediate delay={d + 0.8}>
              <ul className="mt-10 flex flex-col gap-2.5 border-t border-rule pt-6 text-[15px] text-ink/80 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {hero.support.map((s) => (
                  <li key={s} className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="inline-block size-1.5 bg-cobalt" />
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </motion.div>

          <motion.div style={{ y: yConsole }} className="lg:col-span-6 lg:col-start-7 lg:-mt-6">
            <Reveal immediate delay={d + 0.4} y={40}>
              <ReleaseConsole startDelay={d + 0.6} />
            </Reveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
