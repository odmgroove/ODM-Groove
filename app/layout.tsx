import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import EventCountdownBanner from "./components/EventCountdownBanner";
import { SITE_URL, getLandingJsonLd } from "./lib/seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "ODM Groove Hotel & Event Hall | Ijoko, Ifo, Ogun State",
    template: "%s | ODM Groove Hotel",
  },
  description:
    "Boutique hotel, swimming pool, nightclub & 200+ guest event hall in Ijoko Ogbayo, Ifo, Ogun State near Lagos. Rooms from ₦30,000/night with free breakfast.",
  keywords: [
    "hotel in Ijoko Ogbayo",
    "hotel in Ogba-Ayo",
    "hotel in Ifo Ogun State",
    "lodge in Ijoko Ifo",
    "hotel near Aboki-Ifa Ijoko",
    "event hall in Ijoko Ifo Ogun State",
    "swimming pool in Ijoko Ogba-Ayo",
    "nightclub and lounge in Ijoko Ifo",
    "fun hangout spot in Ifo Ogun State",
    "wedding and party hall near Lagos",
    "affordable hotel Ogun State",
    "ODM Groove Hotel",
    "ODM Groove Limited",
    "hotel near Lagos Nigeria",
  ],
  authors: [{ name: "ODM Groove Limited" }],
  creator: "ODM Groove Limited",
  publisher: "ODM Groove Limited",
  category: "hospitality",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: `${SITE_URL}/`,
    siteName: "ODM Groove Hotel & Event Hall",
    title: "ODM Groove Hotel & Event Hall | Ijoko Ogbayo, Ogun State",
    description:
      "Experience modern comfort at ODM Groove — a premium boutique hotel in Ijoko, Ogun State. Free breakfast, WiFi, Netflix, swimming pool & event hall. Rooms from ₦30,000/night.",
    images: [
      {
        url: "/odm-groove-hotel-exterior-daytime.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "ODM Groove Hotel exterior view - premium boutique hotel in Ijoko Ogbayo, Ogun State",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ODM Groove Hotel & Event Hall | Ijoko, Ogun State Nigeria",
    description:
      "Where luxury meets affordability. Book a room from ₦30,000/night with free breakfast, WiFi, Netflix & an event hall near Lagos.",
    images: [
      {
        url: "/odm-groove-hotel-exterior-daytime.jpg",
        alt: "ODM Groove Hotel & Event Hall exterior in Ijoko Ogbayo, Ogun State",
      },
    ],
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
  ...(googleVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification
            ? { other: { "msvalidate.01": bingVerification } }
            : {}),
        },
      }
    : {}),
  alternates: {
    canonical: `${SITE_URL}/`,
  },
};

const baseStructuredData = getLandingJsonLd();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NG"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="geo.region" content="NG-OG" />
        <meta name="geo.placename" content="Ijoko Ogbayo, Ogun State, Nigeria" />
        <meta name="geo.position" content="6.8086802;3.2651657" />
        <meta name="ICBM" content="6.8086802, 3.2651657" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(baseStructuredData),
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen bg-[var(--black)] text-[var(--off-white)] transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <EventCountdownBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
