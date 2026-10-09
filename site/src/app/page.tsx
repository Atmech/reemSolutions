import { Agency } from "@/components/agency";
import { Deliverables } from "@/components/deliverables";
import { Engagements } from "@/components/engagements";
import { Enquiry } from "@/components/enquiry";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { MobileCta } from "@/components/mobile-cta";
import { Nav } from "@/components/nav";
import { Problems } from "@/components/problems";
import { Process } from "@/components/process";
import { Intro } from "@/components/ui/mark";

export default function Home() {
  return (
    <>
      <Intro />
      <a href="#main" className="sr-only z-110 bg-cobalt px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Problems />
        <Deliverables />
        <Engagements />
        <Process />
        <Agency />
        <Faq />
        <Enquiry />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
