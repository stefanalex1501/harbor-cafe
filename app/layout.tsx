import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: "Harbor Cafe — Cafea bună. Ritm domol.",
    description: "Harbor Cafe este locul pentru cafea bună, gusturi simple și momente tihnite.",
    icons: { icon: "/harbor-cafe-logo.png", shortcut: "/harbor-cafe-logo.png" },
    openGraph: {
      type: "website",
      locale: "ro_RO",
      siteName: "Harbor Cafe",
      title: "Harbor Cafe — Cafea bună. Ritm domol.",
      description: "Cafea de specialitate, gusturi simple și momente tihnite.",
      images: [{ url: socialImage, width: 1672, height: 941, alt: "Harbor Cafe — Cafea bună. Ritm domol." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Harbor Cafe — Cafea bună. Ritm domol.",
      description: "Cafea de specialitate, gusturi simple și momente tihnite.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
