"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const reveals = sectionRef.current?.querySelectorAll(".reveal");
      if (!reveals?.length) return;

      gsap.from(Array.from(reveals), {
        y: 30,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative px-8 md:px-16 py-32 md:py-48 bg-cream"
    >
      <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32 items-start">
        <div>
          <p className="reveal text-[11px] tracking-[0.3em] uppercase text-muted mb-8">
            About the studio
          </p>
          <h2 className="reveal font-display text-5xl md:text-7xl font-light leading-[1.1] text-ink text-balance">
            Space with{" "}
            <em className="italic">purpose</em>.
          </h2>
        </div>

        <div className="pt-4 md:pt-16">
          {site.intro.map((para, i) => (
            <p
              key={i}
              className={`reveal text-base md:text-lg leading-relaxed text-ink/75 font-sans ${
                i > 0 ? "mt-6" : ""
              }`}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
