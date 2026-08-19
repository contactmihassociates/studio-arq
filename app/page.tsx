"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import HeroLogo from "@/components/hero/HeroLogo";
import Nav from "@/components/sections/Nav";
import Intro from "@/components/sections/Intro";
import WorkGrid from "@/components/work/WorkGrid";
import Approach from "@/components/sections/Approach";
import Recognition from "@/components/sections/Recognition";
import LiquidDivider from "@/components/ui/LiquidDivider";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

const HeroCanvas = dynamic(() => import("@/components/hero/HeroCanvas"), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const rafFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafFn);
    };
  }, []);

  return (
    <main>
      <Nav />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden bg-navy flex flex-col justify-end pb-20 md:pb-28 px-8 md:px-16">
        <HeroCanvas />

        <div className="relative z-10 max-w-screen-xl">
          <HeroLogo />
          <p className="mt-5 text-[11px] tracking-[0.35em] uppercase text-cream/50 font-sans">
            {site.tagline}
          </p>
          <div className="mt-16 flex items-center gap-4">
            <div className="w-8 h-px bg-cream/30 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-cream/30 font-sans">
              Scroll to explore
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream/5 to-transparent pointer-events-none z-10" />
      </section>

      <LiquidDivider />
      <Intro />
      <LiquidDivider />
      <WorkGrid />
      <LiquidDivider />
      <Approach />
      <Recognition />
      <LiquidDivider />
      <Contact />
      <Footer />
    </main>
  );
}
