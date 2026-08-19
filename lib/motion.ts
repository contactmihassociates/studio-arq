import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });
}

export function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
