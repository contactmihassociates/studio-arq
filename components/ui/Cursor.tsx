"use client";

import { useEffect, useRef } from "react";
import { useMouse } from "@/lib/mouse";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let follower = { x: -100, y: -100 };
    let dot = { x: -100, y: -100 };
    let isHover = false;
    let currentLabel = "";

    const setMouse = useMouse.getState().setMouse;
    const setLabel = useMouse.getState().setLabel;

    function onMove(e: MouseEvent) {
      dot.x = e.clientX;
      dot.y = e.clientY;
      setMouse(
        e.clientX / window.innerWidth,
        e.clientY / window.innerHeight,
        e.clientX,
        e.clientY
      );
    }

    function onEnter(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const label = target.closest("[data-cursor]")?.getAttribute("data-cursor") ?? "";
      isHover = !!label;
      currentLabel = label;
      setLabel(label);
    }

    function onLeave() {
      isHover = false;
      currentLabel = "";
      setLabel("");
    }

    function tick() {
      follower.x += (dot.x - follower.x) * 0.12;
      follower.y += (dot.y - follower.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.x}px, ${dot.y}px)`;
      }
      if (ringRef.current) {
        const scale = isHover ? 2.8 : 1;
        ringRef.current.style.transform = `translate(${follower.x}px, ${follower.y}px) scale(${scale})`;
        ringRef.current.style.opacity = isHover ? "0.85" : "1";
      }
      if (labelRef.current) {
        labelRef.current.textContent = currentLabel;
        labelRef.current.style.opacity = currentLabel ? "1" : "0";
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onEnter, { passive: true });
    document.addEventListener("mouseout", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <>
      {/* Exact dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ transform: "translate(-100px, -100px)" }}
        aria-hidden
      >
        <div className="w-1.5 h-1.5 rounded-full bg-cream -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />
      </div>

      {/* Laggy ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none transition-[opacity] duration-200"
        style={{ transform: "translate(-100px, -100px)" }}
        aria-hidden
      >
        <div className="w-10 h-10 rounded-full border border-cream -translate-x-1/2 -translate-y-1/2 mix-blend-difference flex items-center justify-center overflow-hidden">
          <span
            ref={labelRef}
            className="text-cream text-[9px] tracking-widest uppercase font-sans opacity-0 transition-opacity duration-150 select-none"
          />
        </div>
      </div>
    </>
  );
}
