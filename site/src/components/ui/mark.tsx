// The Working Grid mark. Geometry from .branding/outputs/logos/mark-*.svg —
// do not rearrange modules, close the channels or add a container.

export const MARK_PATH = "M8 8h16v48H8Z M32 8h24v16H32Z M32 32h24v24H32Z";

export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d={MARK_PATH} fill="currentColor" />
    </svg>
  );
}

export function Lockup({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Mark className="size-6 shrink-0" />
      <span className="text-[19px] font-semibold tracking-[-0.04em] leading-none">reem.solutions</span>
    </span>
  );
}

/** First-load intro. CSS-driven (see globals.css) so it can never trap content. */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="flex items-center gap-4 text-paper">
        <svg viewBox="0 0 64 64">
          <rect className="spine" x="8" y="8" width="16" height="48" fill="currentColor" />
          <rect className="blk-a" x="32" y="8" width="24" height="16" fill="currentColor" />
          <rect className="blk-b" x="32" y="32" width="24" height="24" fill="currentColor" />
        </svg>
        <span className="wordmark text-[40px] font-semibold tracking-[-0.045em] leading-none">reem.solutions</span>
      </div>
    </div>
  );
}
