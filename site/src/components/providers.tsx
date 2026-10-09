"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Engagement } from "@/lib/content";
import { track } from "@/lib/analytics";

type GoToOptions = { engagement?: Engagement; source?: string };

type SiteContext = {
  engagement: Engagement | "";
  setEngagement: (e: Engagement | "") => void;
  goTo: (id: string, opts?: GoToOptions) => void;
};

const Ctx = createContext<SiteContext | null>(null);

export function useSite() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used inside <Providers>");
  return ctx;
}

const NAV_OFFSET = -88;

export function Providers({ children }: { children: React.ReactNode }) {
  const [engagement, setEngagement] = useState<Engagement | "">("");
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const goTo = useCallback((id: string, opts: GoToOptions = {}) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (opts.source) track("cta_click", { cta: opts.source, target: id });
    if (opts.engagement) {
      setEngagement(opts.engagement);
      track("engagement_select", { engagement: opts.engagement, via: "cta" });
    }
    // Focus the section's heading so keyboard and screen-reader users land
    // where the page scrolled to. Headings carry tabIndex={-1}.
    const focusTarget = el.querySelector<HTMLElement>("[data-focus-target]") ?? el;
    const focus = () => focusTarget.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: NAV_OFFSET, duration: 1.4, onComplete: focus });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
      window.scrollTo({ top, behavior: "auto" });
      focus();
    }
  }, []);

  return (
    <Ctx.Provider value={{ engagement, setEngagement, goTo }}>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </MotionConfig>
    </Ctx.Provider>
  );
}
