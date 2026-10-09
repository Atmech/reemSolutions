"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { useSite } from "./providers";
import { Arrow } from "./ui/cta";

/** Keeps the primary CTA in reach on small screens between hero and form. */
export function MobileCta() {
  const { goTo } = useSite();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const form = document.getElementById("enquiry");
    let pastHero = false;
    let atForm = false;
    const update = () => setShow(pastHero && !atForm);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === form) atForm = e.isIntersecting;
      });
      update();
    });
    if (hero) io.observe(hero);
    if (form) io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden"
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="#enquiry"
            onClick={(e) => { e.preventDefault(); goTo("enquiry", { source: "mobile_sticky" }); }}
            className="group flex h-14 items-center justify-between rounded-[3px] bg-cobalt px-5 text-[16px] font-medium text-white shadow-[0_12px_30px_-10px_rgba(32,37,34,0.5)]"
          >
            {nav.cta}
            <Arrow />
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
