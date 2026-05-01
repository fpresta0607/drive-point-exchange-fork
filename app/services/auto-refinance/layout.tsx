import type { Metadata } from "next";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/structured-data";

const BASE_URL = "https://www.drivepointexchange.com";

export const metadata: Metadata = {
  title: "Auto Loan Refinance - Lower Your Monthly Payments",
  description:
    "Refinance your auto loan with Drive Point Exchange. Get lower interest rates, reduced monthly payments, flexible terms from 12-84 months, and skip up to 2 payments during transition.",
  keywords: [
    "auto loan refinance",
    "car refinancing",
    "lower auto loan rate",
    "refinance car loan",
    "auto refinance savings",
    "auto loan refinancing online",
  ],
  openGraph: {
    title: "Auto Loan Refinance - Lower Your Monthly Payments | Drive Point Exchange",
    description:
      "Refinance your auto loan with Drive Point Exchange. Lower rates, flexible terms, seamless lender transition.",
    images: [{ url: "/auto/hero-auto-refinance-v2.webp", width: 1200, height: 630, alt: "Auto loan refinancing consultation" }],
  },
  twitter: {
    title: "Auto Loan Refinance - Lower Your Monthly Payments",
    description:
      "Refinance your auto loan with Drive Point Exchange. Lower rates, flexible terms, seamless lender transition.",
  },
  alternates: { canonical: `${BASE_URL}/services/auto-refinance` },
};

export default function AutoRefinanceLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Services", url: `${BASE_URL}/services` },
    { name: "Auto Loan Refinance", url: `${BASE_URL}/services/auto-refinance` },
  ]);
  const service = getServiceSchema({
    name: "Auto Loan Refinance",
    description:
      "Refinance your auto loan with lower interest rates, reduced monthly payments, flexible terms from 12-84 months, no early payoff penalties, and seamless lender transition.",
    url: `${BASE_URL}/services/auto-refinance`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
