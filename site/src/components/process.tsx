"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { process } from "@/lib/content";
import { Reveal } from "./ui/motion-primitives";
import { SectionHead } from "./ui/section-head";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [horizontal, setHorizontal] = useState(false); // desktop + motion allowed
  const [dist, setDist] = useState(0); // horizontal travel in px
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      setHorizontal(mq.matches);
      if (!mq.matches || !track.current) return setDist(0);
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const pinned = horizontal && dist > 0;
  const { scrollYProgress } = useScroll({ target: wrap, offset: pinned ? ["start start", "end end"] : ["start 70%", "end 60%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const x = useTransform(smooth, (v) => (pinned ? -v * dist : 0));

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setCurrent(Math.min(process.stages.length - 1, Math.floor(v * process.stages.length * 0.999)));
  });

  return (
    <section id="how-we-work" aria-label="How we work" className="on-dark relative bg-ink text-white">
      <div className="mx-auto max-w-[1296px] px-6 pt-24 lg:px-12 lg:pt-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead eyebrow="How we work" headline={process.headline} tone="dark" className="lg:col-span-7" />
          <Reveal delay={0.2} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[19px] leading-[1.6] text-ink-muted">{process.intro}</p>
          </Reveal>
        </div>
      </div>

      <div ref={wrap} style={pinned ? { height: `calc(100vh + ${dist}px)` } : undefined} className="relative">
        <div className={horizontal ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : ""}>
          <motion.ol
            ref={track}
            style={{ x }}
            className={
              horizontal
                ? "flex w-max flex-row pl-[max(48px,calc((100vw-1296px)/2+48px))] pr-[max(48px,calc((100vw-1296px)/2+48px))]"
                : "mx-auto flex max-w-[1296px] flex-col px-6 pt-16 lg:grid lg:grid-cols-5 lg:gap-8 lg:px-12"
            }
          >
            {process.stages.map((s, i) => (
              <Stage key={s.n} stage={s} index={i} active={i <= current} isCurrent={i === current} pinned={horizontal} />
            ))}
          </motion.ol>

          {horizontal ? (
            <div aria-hidden="true" className="mx-auto mt-14 w-full max-w-[1296px] px-12">
              <div className="relative h-px bg-ink-rule">
                <motion.div className="absolute -top-px left-0 h-[3px] w-full origin-left bg-white" style={{ scaleX: smooth }} />
              </div>
              <div className="mt-4 grid grid-cols-5 text-[14px]">
                {process.stages.map((s, i) => (
                  <span key={s.n} className={`transition-colors duration-300 ${i <= current ? "text-white" : "text-ink-muted/60"}`}>
                    <span className="mr-2 font-mono text-[12px] tabular-nums opacity-60">{s.n}</span>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-[1296px] px-6 pb-24 pt-16 lg:px-12 lg:pb-32">
        <Reveal className="flex items-start gap-4 border-t border-ink-rule pt-8">
          <span aria-hidden="true" className="mt-2.5 inline-block size-2 shrink-0 bg-white" />
          <p className="max-w-[60ch] text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-white/90">{process.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Stage({
  stage,
  index,
  active,
  isCurrent,
  pinned,
}: {
  stage: (typeof process.stages)[number];
  index: number;
  active: boolean;
  isCurrent: boolean;
  pinned: boolean;
}) {
  const on = pinned ? active : true;
  return (
    <li className={`relative border-t border-ink-rule py-10 lg:border-t-0 lg:py-0 ${pinned ? "w-[min(36vw,520px)] shrink-0 border-t-0 border-l px-10 py-0 first:border-l-0 first:pl-0" : ""}`}>
      <Reveal y={30} delay={pinned ? 0 : 0.05}>
        <div className="flex items-start justify-between gap-6">
          <span
            className="block font-semibold leading-[0.8] tracking-[-0.06em] tabular-nums transition-colors duration-500 text-[clamp(88px,10vw,168px)]"
            style={{
              color: isCurrent && pinned ? "#FFFFFF" : "transparent",
              WebkitTextStroke: `1.5px ${on ? "#FFFFFF" : "#4A514C"}`,
            }}
            aria-hidden="true"
          >
            {stage.n}
          </span>
          <span aria-hidden="true" className="mt-2 flex gap-1">
            {[0, 1, 2, 3, 4].map((k) => (
              <motion.span
                key={k}
                className="block size-2"
                initial={false}
                animate={{ backgroundColor: k <= index && on ? (k === index ? "#FFFFFF" : "#7D847E") : "#3A403C" }}
                transition={{ duration: 0.4, ease: EASE, delay: k * 0.04 }}
              />
            ))}
          </span>
        </div>
        <h3 className={`mt-8 text-[clamp(30px,3vw,44px)] font-semibold tracking-[-0.035em] transition-colors duration-500 ${on ? "text-white" : "text-white/40"}`}>
          <span className="sr-only">Stage {stage.n}: </span>
          {stage.label}
        </h3>
        <p className={`mt-3 max-w-[34ch] text-[18px] leading-[1.55] transition-colors duration-500 ${on ? "text-ink-muted" : "text-ink-muted/50"}`}>{stage.copy}</p>
      </Reveal>
    </li>
  );
}
