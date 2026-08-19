"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";

export default function Recognition() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".stat-item");
      if (!items?.length) return;

      gsap.from(Array.from(items), {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-8 md:px-16 py-24 md:py-40 bg-navy"
    >
      <div className="max-w-screen-xl mx-auto">
        <p className="text-[11px] tracking-[0.3em] uppercase text-cream/40 mb-20">
          By the numbers
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x lg:divide-cream/10">
          {site.recognition.map((item) => (
            <div key={item.label} className="stat-item lg:px-10 first:pl-0 last:pr-0">
              <p className="font-display text-6xl md:text-8xl font-light text-cream leading-none mb-3">
                {item.value}
              </p>
              <p className="text-[11px] tracking-[0.3em] uppercase text-cream/50 font-sans">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
