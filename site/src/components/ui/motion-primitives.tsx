"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Seconds to hold hero animations while the first-load intro plays. */
export function introDelay() {
  if (typeof window === "undefined") return 0;
  return (window as unknown as { __reemIntro?: boolean }).__reemIntro ? 1.3 : 0;
}

/** Masked word-by-word rise. Text stays real text for assistive tech. */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.055,
  immediate = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const show = immediate || inView;
  const words = text.split(" ");
  return (
    <Tag ref={ref as never} className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "108%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/** Fade + lift when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  immediate = false,
  ...rest
}: { delay?: number; y?: number; immediate?: boolean } & HTMLMotionProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={immediate || inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Pulls toward the pointer on fine-pointer devices. */
export function Magnetic({ children, strength = 0.28, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }
  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className={`inline-block ${className ?? ""}`}>
      {children}
    </motion.div>
  );
}

/** Digits roll into place like a split-flap counter. */
export function Odometer({ value, className, delay = 0 }: { value: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  let digitIndex = 0;
  return (
    <span ref={ref} className={`relative inline-flex leading-none ${className ?? ""}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {value.split("").map((ch, i) => {
          if (!/\d/.test(ch)) {
            return (
              <span key={i} className="inline-block h-[1em] leading-none">
                {ch}
              </span>
            );
          }
          const d = Number(ch);
          const order = digitIndex++;
          return (
            <span key={i} className="relative inline-block h-[1em] overflow-hidden leading-none tabular-nums">
              <span className="invisible">{ch}</span>
              <motion.span
                className="absolute left-0 top-0 flex flex-col"
                initial={{ y: "0em" }}
                animate={inView ? { y: `${-(d + 10)}em` } : undefined}
                transition={{ duration: 1.6, ease: EASE, delay: delay + order * 0.08 }}
              >
                {Array.from({ length: 20 }, (_, n) => (
                  <span key={n} className="block h-[1em]">
                    {n % 10}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

/** Quiet sentence-case label above a headline. */
export function Eyebrow({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return <p className={`text-[16px] font-medium leading-snug ${tone === "dark" ? "text-ink-muted" : "text-muted"}`}>{children}</p>;
}
