import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Loan Services - Refinancing & Vehicle Coverage",
  description: "Comprehensive auto financing services including auto loan refinancing, vehicle coverage, vehicle coverage certifications, and home refinancing.",
  keywords: [
    "auto loan refinancing",
    "vehicle coverage",
    "vehicle coverage certifications", 
    "home refinancing",
    "insurance consultation",
    "auto financing services"
  ],
  openGraph: {
    title: "Auto Loan Services - Refinancing & Vehicle Coverage",
    description: "Comprehensive auto financing services including auto loan refinancing and vehicle coverage.",
    images: [
      {
        url: "/auto/hero-auto-refinance-v2.webp",
        width: 1200,
        height: 630,
        alt: "Professional financial services",
      },
    ],
  },
  twitter: {
    title: "Auto Loan Services - Refinancing & Vehicle Coverage",
    description: "Comprehensive auto financing services including auto loan refinancing and vehicle coverage.",
  },
  alternates: {
    canonical: "https://www.drivepointexchange.com/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
