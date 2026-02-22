import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://odmgroove.com"),
  title: {
    default: "ODM Groove Hotel & Event Hall | Ijoko, Ogun State Nigeria",
    template: "%s | ODM Groove Hotel",
  },
  description:
    "ODM Groove Limited — a premium boutique hotel and event hall in Ijoko Ogbayo, Ogun State, near Lagos. Rooms from ₦30,000/night with free breakfast, WiFi, Netflix & DSTV. Book your stay today!",
  keywords: [
    "hotel in Ijoko Ogbayo",
    "hotel in Ijoko Ogbayo",
    "hotel near Lagos Nigeria",
    "affordable hotel Ogun State",
    "boutique hotel Ijoko",
    "event hall Ogun State",
    "wedding venue near Lagos",
    "conference hall Nigeria",
    "swimming pool hotel Nigeria",
    "ODM Groove Hotel",
    "ODM Groove Limited",
    "Ijoko hotel",
    "Ogun State accommodation",
    "hotel with pool Nigeria",
    "budget hotel near Lagos",
  ],
  authors: [{ name: "ODM Groove Limited" }],
  creator: "ODM Groove Limited",
  publisher: "ODM Groove Limited",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://odmgroove.com",
    siteName: "ODM Groove Hotel & Event Hall",
    title: "ODM Groove Hotel & Event Hall | Ijoko Ogbayo, Ogun State",
    description:
      "Experience modern comfort at ODM Groove — a premium boutique hotel in Ijoko, Ogun State. Free breakfast, WiFi, Netflix, swimming pool & event hall. Rooms from ₦30,000/night.",
    images: [
      {
        url: "/odm-groove-hotel-exterior-daytime.jpg",
        width: 1200,
        height: 630,
        alt: "ODM Groove Hotel exterior view - premium boutique hotel in Ijoko Ogbayo, Ogun State",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ODM Groove Hotel & Event Hall | Ijoko, Ogun State Nigeria",
    description:
      "Where luxury meets affordability. Book a room from ₦30,000/night with free breakfast, WiFi, Netflix & an event hall near Lagos.",
    images: ["/odm-groove-hotel-exterior-daytime.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
  alternates: {
    canonical: "https://odmgroove.com",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["Hotel", "LocalBusiness"],
  name: "ODM Groove Hotel & Event Hall",
  alternateName: "ODM Groove Limited",
  legalName: "ODM Groove Limited",
  url: "https://odmgroove.com",
  logo: "https://odmgroove.com/logo.png",
  image: [
    "https://odmgroove.com/odm-groove-hotel-exterior-daytime.jpg",
    "https://odmgroove.com/odm-groove-hotel-front-view.jpg",
    "https://odmgroove.com/Room/odm-groove-hotel-room-1.jpg",
  ],
  description:
    "ODM Groove Limited is a premium boutique hotel and event hall located in Ijoko Ogbayo, Ogun State, Nigeria. Offering comfortable standard and deluxe rooms with free breakfast, WiFi, Netflix, DSTV, swimming pool, outdoor bar, rooftop lounge, and a versatile event hall.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ola-Oparun, After Aboki Ifa Villa",
    addressLocality: "Ijoko Ogbayo",
    addressRegion: "Ogun State",
    addressCountry: "NG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "6.8969",
    longitude: "3.2066",
  },
  priceRange: "₦₦",
  currenciesAccepted: "NGN",
  paymentAccepted: "Cash, Bank Transfer",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Swimming Pool", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free Breakfast", value: true },
    { "@type": "LocationFeatureSpecification", name: "Netflix", value: true },
    { "@type": "LocationFeatureSpecification", name: "DSTV", value: true },
    { "@type": "LocationFeatureSpecification", name: "Event Hall", value: true },
    { "@type": "LocationFeatureSpecification", name: "Outdoor Bar", value: true },
    { "@type": "LocationFeatureSpecification", name: "Rooftop Lounge", value: true },
    { "@type": "LocationFeatureSpecification", name: "24/7 Security", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Snooker", value: true },
    { "@type": "LocationFeatureSpecification", name: "Football", value: true },
  ],
  numberOfRooms: "Multiple",
  starRating: { "@type": "Rating", ratingValue: "4" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    reviewCount: "124",
    bestRating: "5",
    worstRating: "1",
  },
  foundingDate: "2024",
  sameAs: [],
};

import { ThemeProvider } from "./components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="geo.region" content="NG-OG" />
        <meta name="geo.placename" content="Ijoko Ogbayo, Ogun State, Nigeria" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[var(--black)] text-[var(--off-white)] transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
