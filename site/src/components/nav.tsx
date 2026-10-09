"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { useSite } from "./providers";
import { Cta } from "./ui/cta";
import { Lockup } from "./ui/mark";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const { goTo } = useSite();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 640 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  // Active section tracking
  useEffect(() => {
    const ids = nav.links.map((l) => l.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Mobile menu: Esc closes, focus moves in and back, background inert
  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    main?.setAttribute("inert", "");
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      main?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function go(id: string, source: string) {
    setOpen(false);
    goTo(id, { source });
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || open ? "border-b border-rule bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Primary" className="mx-auto flex h-[72px] max-w-[1296px] items-center justify-between px-6 lg:px-12">
          <a href="#top" onClick={(e) => { e.preventDefault(); go("top", "nav_logo"); }} aria-label="reem.solutions — back to top" className="text-ink">
            <Lockup />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.links.map((l) => (
              <li key={l.id}>
                <a
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); go(l.id, `nav_${l.id}`); }}
                  aria-current={active === l.id ? "location" : undefined}
                  className="relative block px-3.5 py-2 text-[15px] text-ink/80 transition-colors hover:text-ink"
                >
                  {active === l.id ? (
                    <motion.span layoutId="nav-active" className="absolute inset-x-3.5 bottom-1 h-px bg-cobalt" transition={{ duration: 0.5, ease: EASE }} />
                  ) : null}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Cta to="enquiry" source="nav" className="h-10 px-4 text-[15px]">
                {nav.cta}
              </Cta>
            </div>
            <button
              ref={menuBtn}
              type="button"
              className="relative -mr-2 flex size-11 items-center justify-center md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-6">
                <motion.span className="absolute left-0 top-0 h-[1.5px] w-6 bg-ink" animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }} transition={{ duration: 0.4, ease: EASE }} />
                <motion.span className="absolute bottom-0 left-0 h-[1.5px] w-6 bg-ink" animate={open ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }} transition={{ duration: 0.4, ease: EASE }} />
              </span>
            </button>
          </div>
        </nav>
        <motion.div aria-hidden="true" className="h-px origin-left bg-cobalt" style={{ scaleX: progress }} />
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panel}
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-paper md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ul className="flex flex-col px-6 pt-8">
              {[...nav.links, { href: "#enquiry", label: nav.cta, id: "enquiry" }].map((l, i) => (
                <li key={l.id} className="overflow-hidden border-b border-rule">
                  <motion.a
                    href={l.href}
                    onClick={(e) => { e.preventDefault(); go(l.id, `menu_${l.id}`); }}
                    className={`flex items-baseline justify-between py-5 text-[34px] font-medium tracking-[-0.03em] ${l.id === "enquiry" ? "text-cobalt" : "text-ink"}`}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.12 + i * 0.06 }}
                  >
                    {l.label}
                    <span className="font-mono text-[12px] text-muted">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
