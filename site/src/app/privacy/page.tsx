import type { Metadata } from "next";
import Link from "next/link";
import { Lockup } from "@/components/ui/mark";

export const metadata: Metadata = {
  title: "Privacy Notice | reem.solutions",
  robots: { index: false, follow: false },
};

// Launch dependency: replace with the actual Privacy Notice covering the
// enquiry form, hosting and any analytics.
export default function Privacy() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-16 lg:py-24">
      <Link href="/" className="text-ink">
        <Lockup />
      </Link>
      <h1 className="mt-16 text-[44px] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">Privacy Notice</h1>
      <p className="mt-6 text-[18px] leading-[1.6] text-muted">
        This Privacy Notice is being prepared and will be published here before the enquiry form goes live.
      </p>
      <Link href="/" className="mt-10 inline-block text-cobalt underline underline-offset-4">
        Back to reem.solutions
      </Link>
    </main>
  );
}
