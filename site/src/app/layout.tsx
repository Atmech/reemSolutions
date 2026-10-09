import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Canonical domain is not yet verified — set metadataBase once it is.
export const metadata: Metadata = {
  title: "reem.solutions | AI Production Engineering",
  description:
    "Turn your AI prototype into a live product with reem.solutions. Production audits, implementation sprints and ongoing engineering support for SaaS teams.",
  robots: { index: false, follow: false }, // preview build; remove at launch
};

export const viewport: Viewport = {
  themeColor: "#F4F3EE",
};

// Runs before paint: marks the session so the intro plays once.
const introScript = `try{var k='reem-intro';if(sessionStorage.getItem(k)){document.documentElement.classList.add('seen')}else{sessionStorage.setItem(k,'1');window.__reemIntro=true}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
