"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/content/projects";
import ProjectCard from "./ProjectCard";

export default function WorkGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".project-card");
      if (!cards?.length) return;

      gsap.from(Array.from(cards), {
        y: 50,
        opacity: 0,
        duration: 0.85,
        stagger: { amount: 0.8, from: "start" },
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="works" ref={sectionRef} className="px-8 md:px-16 py-24 md:py-40 bg-cream">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-muted mb-3">
              Selected works
            </p>
            <h2 className="font-display text-5xl md:text-7xl font-light text-ink">
              {projects.length} projects
            </h2>
          </div>
          <p className="hidden md:block text-sm text-ink/40 font-sans text-right max-w-xs leading-relaxed">
            A selection of completed and ongoing work across South India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
