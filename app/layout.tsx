import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://stefanalex1501.github.io/harbor-cafe/";
const mapsUrl = "https://www.google.com/maps/place/Harbor+Cafe/@44.4489541,26.0806877,19z/data=!4m16!1m9!3m8!1s0x40b201004f4513f3:0xc119237662a4b949!2sHarbor+Cafe!8m2!3d44.4489541!4d26.0813495!9m1!1b1!16s%2Fg%2F11x90nxt_4!3m5!1s0x40b201004f4513f3:0xc119237662a4b949!8m2!3d44.4489541!4d26.0813495!16s%2Fg%2F11x90nxt_4?entry=ttu";
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "@id": `${siteUrl}#cafe`,
  name: "Harbor Cafe",
  url: siteUrl,
  image: `${siteUrl}og.png`,
  logo: `${siteUrl}harbor-cafe-round-512.png`,
  description: "Cafea de specialitate, Prosecco, ciabatta și deserturi în București.",
  priceRange: "1–40 RON",
  servesCuisine: ["Specialty coffee", "Cafe", "Ciabatta", "Desserts"],
  acceptsReservations: false,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bulevardul Alexandru Ioan Cuza 13",
    postalCode: "011051",
    addressLocality: "București",
    addressCountry: "RO",
  },
  geo: { "@type": "GeoCoordinates", latitude: 44.4489541, longitude: 26.0813495 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "16:00" },
  ],
  hasMenu: `${siteUrl}#menu`,
  sameAs: ["https://www.instagram.com/harborcafe.bucuresti/", mapsUrl],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#051d2d",
  colorScheme: "dark",
};

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: "Harbor Cafe — Cafea bună. Ritm domol.",
    description: "Harbor Cafe București — specialty coffee, Prosecco și lumină naturală, pe Bulevardul Alexandru Ioan Cuza 13.",
    alternates: { canonical: siteUrl },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/harbor-cafe-round-192.png", sizes: "192x192", type: "image/png" }],
      shortcut: "/harbor-cafe-round-192.png",
      apple: [{ url: "/harbor-cafe-round-180.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: { capable: true, title: "Harbor Cafe", statusBarStyle: "black-translucent" },
    openGraph: {
      type: "website",
      url: siteUrl,
      locale: "ro_RO",
      siteName: "Harbor Cafe",
      title: "Harbor Cafe — Cafea bună. Ritm domol.",
      description: "Specialty coffee, Prosecco și lumină naturală în București.",
      images: [{ url: `${siteUrl}og.png`, width: 1672, height: 941, alt: "Harbor Cafe — Cafea bună. Ritm domol." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Harbor Cafe — Cafea bună. Ritm domol.",
      description: "Specialty coffee, Prosecco și lumină naturală în București.",
      images: [`${siteUrl}og.png`],
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
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      </body>
    </html>
  );
}
