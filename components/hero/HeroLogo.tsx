"use client";

import { useRef, useEffect } from "react";
import { useMouse } from "@/lib/mouse";

export default function HeroLogo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let current = { x: 0.5, y: 0.5 };
    let target = { x: 0.5, y: 0.5 };

    function tick() {
      const state = useMouse.getState();
      target.x = state.x;
      target.y = state.y;

      // Ease toward target
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;

      // Displacement scale: subtle offset based on mouse from center
      const dx = (current.x - 0.5) * 18;
      const dy = (current.y - 0.5) * 10;

      const fe = svgRef.current?.querySelector<SVGFEDisplacementMapElement>(
        "feDisplacementMap"
      );
      const feTurb = svgRef.current?.querySelector<SVGFETurbulenceElement>(
        "feTurbulence"
      );

      if (fe) {
        fe.setAttribute("scale", String(8 + Math.abs(dx) * 0.4));
      }
      if (feTurb && svgRef.current) {
        svgRef.current.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="relative select-none pointer-events-none">
      {/* SVG displacement filter definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="logo-distort" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018"
              numOctaves="3"
              seed="5"
            />
            <feDisplacementMap
              in="SourceGraphic"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Logo text with filter */}
      <svg
        ref={svgRef}
        viewBox="0 0 600 100"
        className="w-full max-w-3xl"
        style={{ filter: "url(#logo-distort)", willChange: "transform" }}
        aria-label="Studio Arqs"
      >
        <text
          x="0"
          y="80"
          fontFamily="var(--font-display)"
          fontSize="88"
          fontWeight="300"
          letterSpacing="6"
          fill="#F4F1EC"
        >
          STUDIO ARQS
        </text>
      </svg>
    </div>
  );
}
