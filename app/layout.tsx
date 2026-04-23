import type { Metadata } from "next";
import { Montserrat, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "../lib/i18n/context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsent } from "@/components/CookieConsent";
import { ConsentScripts } from "@/components/ConsentScripts";
import { cn } from "@/lib/utils";
import { getLocalBusinessSchema } from "@/lib/structured-data";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const isProduction = process.env.NODE_ENV === 'production';

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.drivepointexchange.com'),
  title: {
    default: "Drive Point Exchange - Auto Loan Calculator & Refinancing",
    template: "%s | Drive Point Exchange"
  },
  description: "Get instant auto loan estimates with state-specific tax calculations. Competitive rates, fast approval, and exceptional service. Auto refinancing and comprehensive vehicle coverage.",
  keywords: [
    "auto loans",
    "car financing",
    "vehicle loans",
    "auto financing",
    "car loans",
    "refinancing",
    "auto refinance",
    "vehicle coverage",
    "vehicle coverage certifications",
    "home refinance",
    "insurance consultation",
    "nationwide auto loans",
    "online auto financing"
  ],
  authors: [{ name: "Drive Point Exchange" }],
  creator: "Drive Point Exchange",
  publisher: "Drive Point Exchange",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.drivepointexchange.com",
    siteName: "Drive Point Exchange",
    title: "Drive Point Exchange - Auto Loan Calculator & Refinancing",
    description: "Get instant auto loan estimates with state-specific tax calculations. Competitive rates, fast approval, and exceptional service.",
    images: [
      {
        url: "/auto/car-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Drive Point Exchange - Professional auto financing consultation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive Point Exchange - Auto Loan Calculator & Refinancing",
    description: "Get instant auto loan estimates with state-specific tax calculations. Competitive rates, fast approval, and exceptional service.",
    images: ["/auto/car-hero.jpg"],
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
  icons: {
    icon: [{ url: '/favicon.PNG', type: 'image/png' }],
    apple: [{ url: '/favicon.PNG', type: 'image/png' }],
  },
  alternates: {
    canonical: "https://www.drivepointexchange.com",
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessData = getLocalBusinessSchema();

  return (
    <html lang="en-US" className={cn("font-sans", geist.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0E1A56" />
      </head>
      <body className={`${montserrat.variable} ${outfit.variable} font-outfit antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-dpe-navy focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:font-semibold focus:text-sm focus:ring-2 focus:ring-dpe-blue focus:outline-none"
        >
          Skip to main content
        </a>
        <I18nProvider>
          <main id="main-content">
            {children}
          </main>
        </I18nProvider>
        <ConsentScripts />
        <CookieConsent />
        {isProduction && <Analytics />}
        {isProduction && <SpeedInsights />}
      </body>
    </html>
  );
}
