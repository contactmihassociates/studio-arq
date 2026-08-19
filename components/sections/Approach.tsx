"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Approach() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".pillar-card");
      if (!cards?.length) return;

      gsap.from(Array.from(cards), {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-8 md:px-16 py-24 md:py-40 bg-cream">
      <div className="max-w-screen-xl mx-auto">
        <p className="text-[11px] tracking-[0.3em] uppercase text-muted mb-16">
          Our approach
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10">
          {site.approach.map((pillar) => (
            <MagneticButton
              key={pillar.number}
              wrapClassName="pillar-card"
              className="block w-full h-full bg-cream p-8 md:p-10 group text-left"
              cursorLabel=""
            >
              <p className="text-[11px] tracking-[0.25em] uppercase text-muted mb-8">
                {pillar.number}
              </p>
              <h3 className="font-display text-3xl md:text-4xl font-light text-ink mb-4 group-hover:italic transition-all duration-300">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink/60 font-sans">
                {pillar.body}
              </p>
            </MagneticButton>
          ))}
        </div>
      </div>
    </section>
  );
}
