"use client";

import { useSite } from "@/components/providers";
import type { Engagement } from "@/lib/content";
import { Magnetic } from "./motion-primitives";

type Variant = "primary" | "secondary" | "inverse" | "ghost-dark";

const styles: Record<Variant, string> = {
  primary: "bg-cobalt text-white hover:bg-cobalt-deep",
  secondary: "text-ink ring-1 ring-inset ring-ink/80 hover:bg-ink hover:text-paper",
  inverse: "bg-white text-ink hover:bg-paper",
  "ghost-dark": "text-white ring-1 ring-inset ring-white/60 hover:bg-white hover:text-ink",
};

/**
 * In-page CTA. Renders a real anchor so it works without JS, then upgrades
 * to smooth scroll + focus + engagement preselection.
 */
export function Cta({
  to,
  engagement,
  source,
  variant = "primary",
  children,
  className,
  magnetic = true,
  arrow = true,
  down = false,
}: {
  to: string;
  engagement?: Engagement;
  source: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  magnetic?: boolean;
  arrow?: boolean;
  down?: boolean;
}) {
  const { goTo } = useSite();
  const link = (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        goTo(to, { engagement, source });
      }}
      className={`group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-[3px] px-5 text-[16px] font-medium tracking-[-0.01em] transition-colors duration-200 ease-out ${styles[variant]} ${className ?? ""}`}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {arrow ? <Arrow down={down} /> : null}
    </a>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}

export function Arrow({ down = false }: { down?: boolean }) {
  const path = down ? "M7 1v11M2.5 7.5 7 12l4.5-4.5" : "M1 7h11M7.5 2.5 12 7l-4.5 4.5";
  const out = down ? "group-hover:translate-y-full" : "group-hover:translate-x-full";
  const inn = down ? "-translate-y-full group-hover:translate-y-0" : "-translate-x-full group-hover:translate-x-0";
  const cls = "absolute inset-0 size-3.5 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]";
  return (
    <span aria-hidden="true" className="relative inline-block size-3.5 overflow-hidden">
      <svg viewBox="0 0 14 14" className={`${cls} ${out}`} fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d={path} strokeLinecap="square" />
      </svg>
      <svg viewBox="0 0 14 14" className={`${cls} ${inn}`} fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d={path} strokeLinecap="square" />
      </svg>
    </span>
  );
}
