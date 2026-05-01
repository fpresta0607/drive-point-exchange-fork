import type { Metadata } from "next";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/structured-data";

const BASE_URL = "https://www.drivepointexchange.com";

export const metadata: Metadata = {
  title: "Home Refinance - Lower Mortgage Payments & Access Equity",
  description:
    "Refinance your home with Drive Point Exchange. Drop PMI, access cash-out equity, consolidate debt, and transition from adjustable to fixed rates with flexible 15, 20, and 30-year terms.",
  keywords: [
    "home refinance",
    "mortgage refinancing",
    "drop PMI",
    "cash-out refinance",
    "lower mortgage payments",
    "home equity loan",
  ],
  openGraph: {
    title: "Home Refinance - Lower Mortgage Payments & Access Equity | Drive Point Exchange",
    description:
      "Refinance your home with Drive Point Exchange. Drop PMI, cash-out refinancing, debt consolidation, and flexible fixed-rate terms.",
    images: [{ url: "/auto/hero-home-refinance-v2.webp", width: 1200, height: 630, alt: "Home refinancing consultation" }],
  },
  twitter: {
    title: "Home Refinance - Lower Mortgage Payments & Access Equity",
    description:
      "Refinance your home with Drive Point Exchange. Drop PMI, cash-out refinancing, and flexible fixed-rate terms.",
  },
  alternates: { canonical: `${BASE_URL}/services/home-refinance` },
};

export default function HomeRefinanceLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Services", url: `${BASE_URL}/services` },
    { name: "Home Refinance", url: `${BASE_URL}/services/home-refinance` },
  ]);
  const service = getServiceSchema({
    name: "Home Refinance",
    description:
      "Home refinancing to drop PMI, access cash-out equity, consolidate high-interest debts, and transition from adjustable to fixed rates with 15, 20, and 30-year terms.",
    url: `${BASE_URL}/services/home-refinance`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
