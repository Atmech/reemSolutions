"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { footer } from "@/lib/content";
import { useSite } from "./providers";
import { Lockup } from "./ui/mark";

const LINKS = [
  { id: "services", label: "Services" },
  { id: "how-we-work", label: "How we work" },
  { id: "enquiry", label: "Discuss your project" },
];

export function Footer() {
  const { goTo } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const spine = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const blkA = useTransform(scrollYProgress, [0.35, 0.9], [40, 0]);
  const blkB = useTransform(scrollYProgress, [0.45, 1], [40, 0]);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-paper">
      <div className="mx-auto max-w-[1296px] px-6 pt-20 lg:px-12 lg:pt-28">
        <div className="grid gap-12 border-b border-rule pb-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <Lockup />
            <p className="mt-5 max-w-[32ch] text-[17px] text-muted">{footer.descriptor}</p>
          </div>
          <nav aria-label="Footer" className="md:col-span-5 md:col-start-8">
            <ul className="grid gap-3 text-[16px] sm:grid-cols-2">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); goTo(l.id, { source: `footer_${l.id}` }); }} className="group inline-flex items-center gap-2 text-ink">
                    <span aria-hidden="true" className="inline-block size-1.5 bg-rule transition-colors group-hover:bg-cobalt" />
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">{l.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href="/privacy" className="group inline-flex items-center gap-2 text-ink">
                  <span aria-hidden="true" className="inline-block size-1.5 bg-rule transition-colors group-hover:bg-cobalt" />
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">Privacy Notice</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 font-mono text-[12px] text-muted">
          <span>© 2026 reem.solutions</span>
          <span>Preview build</span>
        </div>
      </div>

      {/* Oversized sign-off: the mark assembles as the page ends */}
      <div aria-hidden="true" className="mx-auto max-w-[1296px] overflow-hidden px-6 pb-8 lg:px-12 lg:pb-12">
        <motion.div style={{ y }} className="flex items-end gap-[1.6vw] text-ink">
          <svg viewBox="8 8 48 48" className="h-[min(8.3vw,110px)] shrink-0 overflow-visible">
            <motion.rect x="8" y="8" width="16" height="48" fill="currentColor" style={{ scaleY: spine, transformOrigin: "16px 56px" }} />
            <motion.rect x="32" y="8" width="24" height="16" fill="currentColor" style={{ x: blkA }} />
            <motion.rect x="32" y="32" width="24" height="24" fill="currentColor" style={{ x: blkB }} />
          </svg>
          <span className="-mb-[0.19em] block whitespace-nowrap text-[min(11.6vw,152px)] font-semibold leading-none tracking-[-0.06em]">
            reem.solutions
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
