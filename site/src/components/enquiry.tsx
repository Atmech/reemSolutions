"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { enquiry, engagementOptions, type Engagement } from "@/lib/content";
import { track } from "@/lib/analytics";
import { useSite } from "./providers";
import { Arrow } from "./ui/cta";
import { Reveal, SplitText, Eyebrow } from "./ui/motion-primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

// Launch dependency: a real destination that confirms receipt with a 2xx.
const ENDPOINT = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? "";

type Status = "idle" | "pending" | "success" | "error";
type Fields = { name: string; email: string; company: string; details: string; timeline: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Enter your name.";
  if (!f.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL.test(f.email.trim())) e.email = "Enter an email address in the format name@example.com.";
  if (!f.company.trim()) e.company = "Enter your company or product name.";
  if (!f.details.trim()) e.details = "Tell us what you’re building and what is blocking progress.";
  return e;
}

export function Enquiry() {
  const { engagement, setEngagement } = useSite();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", company: "", details: "", timeline: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const inflight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inflight.current || status === "success") return;
    const errs = validate(fields);
    setErrors(errs);
    const first = (Object.keys(errs) as (keyof Fields)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    inflight.current = true;
    setStatus("pending");
    try {
      if (!ENDPOINT) throw new Error("No enquiry destination configured");
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...fields, engagement: engagement || null }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      track("enquiry_success", { engagement: engagement || "unspecified" });
    } catch {
      setStatus("error");
    } finally {
      inflight.current = false;
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  return (
    <section id="enquiry" aria-label="Project enquiry" className="on-dark relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse 60% 60% at 15% 30%,#000,transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 15% 30%,#000,transparent 70%)" }} />
      <div className="relative mx-auto grid max-w-[1296px] gap-14 px-6 py-24 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-36">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal y={10}>
              <Eyebrow tone="dark">Project enquiry</Eyebrow>
            </Reveal>
            <h2 tabIndex={-1} data-focus-target className="mt-4 max-w-[14ch] text-[clamp(38px,5vw,72px)] font-semibold leading-[1] tracking-[-0.045em]">
              <SplitText text={enquiry.headline} />
            </h2>
            <Reveal delay={0.25}>
              <p className="mt-7 max-w-[42ch] text-[19px] leading-[1.6] text-ink-muted">{enquiry.copy}</p>
            </Reveal>
            {!ENDPOINT ? (
              <Reveal delay={0.35}>
                <p className="mt-10 max-w-[44ch] border-l-2 border-white/50 pl-4 font-mono text-[12px] leading-[1.6] text-ink-muted">
                  Preview build: no enquiry destination is connected yet, so submissions will not be sent.
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>

        <Reveal delay={0.15} y={40} className="lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            {status === "success" ? (
              <motion.div
                key="ok"
                ref={statusRef}
                tabIndex={-1}
                role="status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="bg-paper p-8 text-ink outline-none lg:p-12"
              >
                <svg viewBox="0 0 48 48" className="size-12 text-cobalt" aria-hidden="true">
                  <rect width="48" height="48" fill="currentColor" />
                  <motion.path d="M13 24.5 21 32.5 35 17" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="square" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
                </svg>
                <p className="mt-8 max-w-[34ch] text-[26px] font-semibold leading-[1.25] tracking-[-0.03em]">{enquiry.success}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                noValidate
                onSubmit={onSubmit}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="on-light bg-paper p-6 text-ink sm:p-8 lg:p-12"
                aria-describedby="enquiry-privacy"
              >
                <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
                  <Field label="Name" name="name" required value={fields.name} onChange={set("name")} error={errors.name} autoComplete="name" />
                  <Field label="Work email" name="email" type="email" required value={fields.email} onChange={set("email")} error={errors.email} autoComplete="email" hint="Personal email addresses are fine too." />
                  <div className="sm:col-span-2">
                    <Field label="Company or product" name="company" required value={fields.company} onChange={set("company")} error={errors.company} autoComplete="organization" />
                  </div>
                </div>

                <EngagementPicker value={engagement} onChange={(v) => { setEngagement(v); track("engagement_select", { engagement: v, via: "form" }); }} />

                <div className="mt-7 grid gap-y-7">
                  <Field label="What are you building, and what is blocking progress?" name="details" multiline required value={fields.details} onChange={set("details")} error={errors.details} />
                  <Field label="Target timeline" name="timeline" value={fields.timeline} onChange={set("timeline")} optional />
                </div>

                <div className="mt-10 flex flex-col gap-5 border-t border-rule pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <p id="enquiry-privacy" className="max-w-[40ch] text-[14px] leading-[1.55] text-muted">
                    We’ll use these details to respond to your enquiry. See our{" "}
                    <a href="/privacy" className="text-ink underline decoration-rule underline-offset-4 hover:decoration-cobalt">Privacy Notice</a>.
                  </p>
                  <SubmitButton pending={status === "pending"} />
                </div>

                <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="outline-none">
                  <AnimatePresence>
                    {status === "error" ? (
                      <motion.p
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <span className="mt-6 flex items-start gap-3 bg-[#FBEDEC] p-4 text-[15px] text-[#8A1C14]">
                          <span aria-hidden="true" className="mt-1.5 inline-block size-2 shrink-0 bg-[#B42318]" />
                          {enquiry.error}
                        </span>
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  required,
  optional,
  multiline,
  type = "text",
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
  hint?: string;
}) {
  const id = useId();
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(" ") || undefined;
  const base =
    "peer block w-full rounded-[3px] border bg-surface px-4 text-[17px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:border-cobalt focus:shadow-[0_0_0_3px_rgba(36,77,216,0.18)]";
  const border = error ? "border-[#B42318]" : "border-[#8E948D]";
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[15px] font-medium text-ink">
        <span>
          {label}
          {required ? <span className="sr-only"> (required)</span> : null}
        </span>
        {optional ? <span className="text-[14px] font-normal text-muted">Optional</span> : null}
      </label>
      {multiline ? (
        <textarea id={id} name={name} rows={5} value={value} onChange={onChange} required={required} aria-required={required} aria-invalid={!!error} aria-describedby={describedBy} className={`${base} ${border} min-h-[148px] resize-y py-3 leading-[1.55]`} />
      ) : (
        <input id={id} name={name} type={type} value={value} onChange={onChange} required={required} aria-required={required} aria-invalid={!!error} aria-describedby={describedBy} autoComplete={autoComplete} className={`${base} ${border} h-12`} />
      )}
      {hint ? <p id={hintId} className="mt-2 text-[13px] text-muted">{hint}</p> : null}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p id={errId} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-2 flex items-center gap-2 text-[14px] text-[#B42318]">
            <span aria-hidden="true" className="inline-block size-1.5 bg-current" />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function EngagementPicker({ value, onChange }: { value: Engagement | ""; onChange: (v: Engagement) => void }) {
  return (
    <fieldset className="mt-8">
      <legend className="mb-3 flex w-full items-baseline justify-between text-[15px] font-medium text-ink">
        What do you need?
      </legend>
      <LayoutGroup id="engagement">
        <div className="flex flex-wrap gap-2">
          {engagementOptions.map((o) => {
            const checked = value === o.value;
            return (
              <label key={o.value} className="relative cursor-pointer">
                <input type="radio" name="engagement" value={o.value} checked={checked} onChange={() => onChange(o.value)} className="peer sr-only" />
                <span className={`relative z-10 flex h-11 items-center rounded-[3px] px-4 text-[15px] transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt ${checked ? "text-white" : "text-ink ring-1 ring-inset ring-[#8E948D] hover:ring-ink"}`}>
                  {checked ? (
                    <motion.span layoutId="engagement-pill" className="absolute inset-0 -z-10 rounded-[3px] bg-cobalt" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  ) : null}
                  {o.label}
                </span>
              </label>
            );
          })}
        </div>
      </LayoutGroup>
    </fieldset>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="group relative inline-flex h-13 min-w-[230px] items-center justify-between gap-4 overflow-hidden rounded-[3px] bg-cobalt px-5 text-[16px] font-medium text-white transition-colors hover:bg-cobalt-deep disabled:cursor-progress"
    >
      <AnimatePresence mode="wait" initial={false}>
        {pending ? (
          <motion.span key="p" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.25 }} className="flex items-center gap-3">
            <span aria-hidden="true" className="flex gap-1">
              {[0, 1, 2].map((k) => (
                <motion.span key={k} className="block size-1.5 bg-white" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 0.9, repeat: Infinity, delay: k * 0.15 }} />
              ))}
            </span>
            Sending…
          </motion.span>
        ) : (
          <motion.span key="i" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.25 }}>
            {enquiry.submit}
          </motion.span>
        )}
      </AnimatePresence>
      {!pending ? <Arrow /> : null}
    </button>
  );
}
