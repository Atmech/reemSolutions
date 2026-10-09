"use client";

import { useEffect, useRef } from "react";

/**
 * A field of grid modules that light up under the pointer and fade like
 * phosphor. Idle cells occasionally blink so the field reads as "live".
 * Decorative; paused off-screen and disabled for reduced motion.
 */
export function GridField({ cell = 44, className }: { cell?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
    let energy = new Float32Array(0);
    let px = -9999, py = -9999;
    let raf = 0;
    let visible = true;
    let lastBlink = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      energy = new Float32Array(cols * rows);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const onLeave = () => { px = py = -9999; };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);

      // Pointer excitation
      if (px > -999) {
        const cx = Math.floor(px / cell), cy = Math.floor(py / cell);
        const R = 3;
        for (let y = cy - R; y <= cy + R; y++) {
          for (let x = cx - R; x <= cx + R; x++) {
            if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
            const d = Math.hypot(x + 0.5 - px / cell, y + 0.5 - py / cell);
            const v = Math.max(0, 1 - d / R);
            const i = y * cols + x;
            energy[i] = Math.min(1, Math.max(energy[i], v * v));
          }
        }
      }
      // Ambient blink
      if (t - lastBlink > 420) {
        lastBlink = t;
        const i = (Math.random() * energy.length) | 0;
        energy[i] = Math.max(energy[i], 0.55);
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const e = energy[i];
          if (e < 0.01) { energy[i] = 0; continue; }
          const gx = x * cell, gy = y * cell;
          ctx.fillStyle = `rgba(36,77,216,${e * 0.16})`;
          ctx.fillRect(gx + 1, gy + 1, cell - 1, cell - 1);
          if (e > 0.35) {
            ctx.fillStyle = `rgba(36,77,216,${(e - 0.35) * 0.9})`;
            const s = 4;
            ctx.fillRect(gx + cell / 2 - s / 2, gy + cell / 2 - s / 2, s, s);
          }
          energy[i] = e * 0.94;
        }
      }
    };

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [cell]);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-rule) 1px, transparent 1px), linear-gradient(to bottom, var(--color-rule) 1px, transparent 1px)",
          backgroundSize: `${cell}px ${cell}px`,
          maskImage: "radial-gradient(ellipse 80% 70% at 70% 40%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 70% 40%, #000 20%, transparent 75%)",
        }}
      />
      <canvas
        ref={ref}
        className="absolute inset-0 size-full"
        style={{
          maskImage: "radial-gradient(ellipse 85% 75% at 65% 40%, #000 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 65% 40%, #000 30%, transparent 80%)",
        }}
      />
    </div>
  );
}
