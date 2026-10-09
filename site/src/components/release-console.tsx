"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Illustrative only: a schematic of the release path, not client results.
const STAGES = ["Prototype", "Evaluate", "Release", "Operate"];
const CHECKS = [
  { label: "Agreed behaviours tested", stage: 1 },
  { label: "Latency and failure paths reviewed", stage: 1 },
  { label: "Rollback path rehearsed", stage: 2 },
  { label: "Usage-cost alerts configured", stage: 3 },
  { label: "Runbook handed over", stage: 3 },
];
const TOTAL = CHECKS.length;

export function ReleaseConsole({ startDelay = 0 }: { startDelay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [tick, setStep] = useState(0); // number of checks complete
  const step = reduce ? TOTAL : tick;

  useEffect(() => {
    if (reduce || !inView) return;
    let t: ReturnType<typeof setTimeout>;
    const tick = (s: number) => {
      setStep(s);
      const next = s >= TOTAL ? 0 : s + 1;
      const wait = s >= TOTAL ? 3200 : s === 0 ? 900 : 1150;
      t = setTimeout(() => tick(next), wait);
    };
    t = setTimeout(() => tick(0), startDelay * 1000 + 400);
    return () => clearTimeout(t);
  }, [inView, reduce, startDelay]);

  // Prototype already exists; the running check decides the current stage.
  const done = step >= TOTAL;
  const stage = done ? STAGES.length - 1 : CHECKS[step].stage;

  return (
    <div ref={ref} className="relative bg-surface shadow-[0_1px_0_var(--color-rule),0_30px_60px_-30px_rgba(32,37,34,0.25)] ring-1 ring-rule">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rule px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-[11.5px] text-muted">
          <span aria-hidden="true" className="flex gap-1">
            <span className="size-1.5 bg-rule" />
            <span className="size-1.5 bg-rule" />
            <span className="size-1.5 bg-rule" />
          </span>
          <span className="ml-2">release-path</span>
        </div>
        <span className="text-[12.5px] text-muted">Illustrative example</span>
      </div>

      {/* Stage track */}
      <div className="px-5 pt-6 pb-5">
        <div className="relative grid grid-cols-4 gap-2" aria-hidden="true">
          <div className="absolute left-[12.5%] right-[12.5%] top-[19px] h-px bg-rule" />
          <motion.div
            className="absolute left-[12.5%] top-[19px] h-px origin-left bg-cobalt"
            style={{ width: "75%" }}
            animate={{ scaleX: stage / 3 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          {STAGES.map((s, i) => {
            const reached = i <= stage;
            const current = i === stage && !done;
            return (
              <div key={s} className="relative flex flex-col items-center gap-2.5">
                <motion.div
                  className="relative z-10 grid size-10 place-items-center"
                  animate={{
                    backgroundColor: reached ? (current ? "#244DD8" : "#202522") : "#FFFFFF",
                    color: reached ? "#FFFFFF" : "#626862",
                    boxShadow: `inset 0 0 0 1px ${reached ? (current ? "#244DD8" : "#202522") : "#D2D5CF"}`,
                  }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className="font-mono text-[11px]">0{i + 1}</span>
                  {current ? (
                    <motion.span
                      className="absolute -inset-1.5 ring-1 ring-cobalt/50"
                      animate={{ opacity: [0.9, 0], scale: [1, 1.35] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    />
                  ) : null}
                </motion.div>
                <span className={`text-[12.5px] transition-colors duration-300 ${reached ? "text-ink" : "text-muted"}`}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checks */}
      <ul className="border-t border-rule">
        {CHECKS.map((c, i) => {
          const state = i < step ? "done" : i === step && !done ? "running" : "pending";
          return (
            <li key={c.label} className="flex items-center gap-3 border-b border-rule/70 px-5 py-3 last:border-b-0">
              <span aria-hidden="true" className="relative grid size-4 place-items-center">
                <AnimatePresence mode="popLayout" initial={false}>
                  {state === "done" ? (
                    <motion.svg key="d" viewBox="0 0 16 16" className="size-4 text-cobalt" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                      <rect width="16" height="16" fill="currentColor" />
                      <motion.path d="M4 8.2 6.8 11 12 5.4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="square" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.1 }} />
                    </motion.svg>
                  ) : state === "running" ? (
                    <motion.span key="r" className="block size-3 border-[1.5px] border-cobalt border-t-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }} transition={{ rotate: { duration: 0.9, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.2 } }} />
                  ) : (
                    <motion.span key="p" className="block size-3 ring-1 ring-rule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                  )}
                </AnimatePresence>
              </span>
              <span className={`text-[14.5px] leading-snug transition-colors duration-300 ${state === "pending" ? "text-muted" : "text-ink"}`}>{c.label}</span>
              <span className="ml-auto font-mono text-[11px] text-muted">{STAGES[c.stage].toLowerCase()}</span>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 bg-paper/60 px-5 py-3 font-mono text-[11px] text-muted">
        <span>owner: named technical owner</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={done ? "ready" : "progress"}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={done ? "text-cobalt" : ""}
          >
            {done ? "● ready for acceptance" : `${Math.min(step, TOTAL)}/${TOTAL} checks`}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
