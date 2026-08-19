"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import MagneticButton from "@/components/ui/MagneticButton";

const links = [
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "100px top",
        onEnter: () => gsap.to(navRef.current, { backgroundColor: "rgba(244,241,236,0.85)", backdropFilter: "blur(12px)", duration: 0.4 }),
        onLeaveBack: () => gsap.to(navRef.current, { backgroundColor: "transparent", backdropFilter: "blur(0px)", duration: 0.4 }),
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-8 md:px-16 py-5 flex items-center justify-between transition-none"
      style={{ backgroundColor: "transparent" }}
    >
      <a
        href="#"
        className="font-display text-cream text-lg tracking-[0.2em] uppercase mix-blend-difference"
        style={{ letterSpacing: "0.2em" }}
      >
        {site.name}
      </a>

      <nav className="hidden md:flex items-center gap-10">
        {links.map(({ label, href }, i) => (
          <MagneticButton key={label} href={href} cursorLabel="">
            <span className="text-cream mix-blend-difference text-sm tracking-widest uppercase font-sans opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-[10px] mr-1.5 opacity-50">0{i + 1}</span>
              {label}
            </span>
          </MagneticButton>
        ))}
      </nav>
    </header>
  );
}
