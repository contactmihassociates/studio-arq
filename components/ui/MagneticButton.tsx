"use client";

import { useRef, useCallback, ReactNode } from "react";
import { gsap } from "gsap";

interface Props {
  children: ReactNode;
  className?: string;
  wrapClassName?: string;
  onClick?: () => void;
  href?: string;
  cursorLabel?: string;
}

export default function MagneticButton({
  children,
  className = "",
  wrapClassName = "",
  onClick,
  href,
  cursorLabel = "View",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const initQuickTo = useCallback(() => {
    if (!wrapRef.current || xTo.current) return;
    xTo.current = gsap.quickTo(wrapRef.current, "x", { duration: 0.5, ease: "power3.out" });
    yTo.current = gsap.quickTo(wrapRef.current, "y", { duration: 0.5, ease: "power3.out" });
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    initQuickTo();
    const rect = wrapRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    xTo.current?.((e.clientX - cx) * 0.3);
    yTo.current?.((e.clientY - cy) * 0.3);
  }, [initQuickTo]);

  const onMouseLeave = useCallback(() => {
    xTo.current?.(0);
    yTo.current?.(0);
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={wrapClassName}
      style={{ display: wrapClassName ? undefined : "inline-block", willChange: "transform" }}
    >
      {href ? (
        <a href={href} className={className} data-cursor={cursorLabel}>
          {children}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={className} data-cursor={cursorLabel}>
          {children}
        </button>
      )}
    </div>
  );
}
