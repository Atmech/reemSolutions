// Minimal event hook. Pushes to window.dataLayer only if an analytics
// integration has been configured. Never pass form text or email addresses.

type EventName = "cta_click" | "engagement_select" | "enquiry_success";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: EventName, props: Record<string, string> = {}) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ event, ...props });
}
