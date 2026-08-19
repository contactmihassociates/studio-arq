"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Project } from "@/content/projects";

const CATEGORY_GRADIENT: Record<string, string> = {
  Residential: "from-[#1a2a1a] to-[#2d4a2d]",
  Religious:   "from-[#1a1a2a] to-[#2d2d4a]",
  Commercial:  "from-[#2a1a1a] to-[#4a2d2d]",
  Interior:    "from-[#1a2a2a] to-[#2d4a4a]",
};

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  const imgRef = useRef<HTMLDivElement>(null);
  const gradient = CATEGORY_GRADIENT[project.category] ?? "from-navy to-navy-mid";

  return (
    <article
      className="project-card group relative overflow-hidden bg-navy aspect-[4/5]"
      data-cursor="View"
    >
      {/* Image / gradient fallback */}
      <div
        ref={imgRef}
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      >
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
          priority={index < 3}
        />
        {/* Gradient behind image for fallback */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} style={{ zIndex: -1 }} />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

      {/* Info slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 ease-out">
        <p className="text-[10px] tracking-[0.3em] uppercase text-cream/50 font-sans mb-2">
          {project.category} — {project.year}
        </p>
        <h3 className="font-display text-2xl md:text-3xl font-light text-cream leading-tight">
          {project.title}
        </h3>
        <p className="text-xs text-cream/40 font-sans mt-1">{project.location}</p>

        {/* Arrow indicator */}
        <div className="mt-4 w-8 h-px bg-cream/40 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
      </div>

      {/* Index number */}
      <p className="absolute top-5 right-5 text-[11px] text-cream/30 font-sans tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </p>
    </article>
  );
}
