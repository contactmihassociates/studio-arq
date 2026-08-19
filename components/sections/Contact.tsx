"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
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
    <section
      id="contact"
      ref={sectionRef}
      className="px-8 md:px-16 py-32 md:py-56 bg-cream border-t border-ink/10"
    >
      <div className="max-w-screen-xl mx-auto">
        <p className="contact-reveal text-[11px] tracking-[0.3em] uppercase text-muted mb-12">
          Get in touch
        </p>

        <h2 className="contact-reveal font-display text-5xl md:text-8xl font-light text-ink leading-[1.05] mb-16 text-balance">
          Let&rsquo;s build something
          <br />
          <em className="italic">worth remembering</em>.
        </h2>

        <div className="contact-reveal">
          <MagneticButton
            href={`mailto:${site.contact.email}`}
            cursorLabel="Write"
            className="inline-flex items-center gap-4 border border-ink px-10 py-5 font-display text-2xl md:text-3xl font-light text-ink hover:bg-ink hover:text-cream transition-colors duration-300"
          >
            {site.contact.email}
          </MagneticButton>
        </div>

        <div className="contact-reveal mt-16 flex flex-col md:flex-row gap-6 md:gap-16 text-sm text-ink/50 font-sans">
          <span>{site.contact.address}</span>
          <a
            href={site.contact.social.instagram}
            className="hover:text-ink transition-colors"
            data-cursor="↗"
          >
            Instagram
          </a>
          <a
            href={site.contact.social.linkedin}
            className="hover:text-ink transition-colors"
            data-cursor="↗"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
