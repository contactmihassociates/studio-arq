import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/content/site";
import CursorLoader from "@/components/ui/CursorLoader";

export const metadata: Metadata = {
  title: `${site.name} — Architecture & Interior Design`,
  description: `${site.name} — ${site.tagline} Architecture and interior design practice based in South India.`,
  openGraph: {
    title: site.name,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CursorLoader />
        {children}
      </body>
    </html>
  );
}
