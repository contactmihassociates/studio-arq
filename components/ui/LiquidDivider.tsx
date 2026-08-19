"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LiquidDivider() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          const dy = (p - 0.5) * 70;
          if (pathRef.current) {
            pathRef.current.setAttribute(
              "d",
              `M0,50 C160,${50 - dy} 340,${50 + dy} 500,50`
            );
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-16 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 500 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          ref={pathRef}
          d="M0,50 C160,20 340,80 500,50"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="0.6"
          opacity="0.18"
        />
      </svg>
    </div>
  );
}
