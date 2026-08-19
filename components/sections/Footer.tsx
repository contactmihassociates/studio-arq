import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="px-8 md:px-16 py-8 bg-ink border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-[11px] tracking-[0.25em] uppercase text-cream/40 font-sans">
        {site.copyright}
      </p>
      <p className="text-[11px] tracking-[0.2em] uppercase text-cream/30 font-sans">
        Architecture &amp; Interior Design
      </p>
    </footer>
  );
}
