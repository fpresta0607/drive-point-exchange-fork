import type { Metadata } from "next";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/structured-data";

const BASE_URL = "https://www.drivepointexchange.com";

export const metadata: Metadata = {
  title: "Auto Insurance Consulting - Optimize Your Coverage",
  description:
    "Drive Point Exchange auto insurance consulting analyzes your policy line-by-line to find savings. Deductible optimization, multi-policy discounts, uninsured motorist safeguards, and teen driver strategies.",
  keywords: [
    "auto insurance consulting",
    "car insurance optimization",
    "auto insurance savings",
    "multi-policy discount",
    "uninsured motorist coverage",
    "auto insurance nationwide",
  ],
  openGraph: {
    title: "Auto Insurance Consulting - Optimize Your Coverage | Drive Point Exchange",
    description:
      "Expert auto insurance consulting. Policy audits, deductible optimization, multi-policy discounts, and direct connections to top-tier underwriters.",
    images: [{ url: "/auto/hero-auto-insurance-v2.webp", width: 1200, height: 630, alt: "Auto insurance consulting" }],
  },
  twitter: {
    title: "Auto Insurance Consulting - Optimize Your Coverage",
    description:
      "Expert auto insurance consulting. Policy audits, deductible optimization, and multi-policy discounts.",
  },
  alternates: { canonical: `${BASE_URL}/services/auto-insurance` },
};

export default function AutoInsuranceLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Services", url: `${BASE_URL}/services` },
    { name: "Auto Insurance Consulting", url: `${BASE_URL}/services/auto-insurance` },
  ]);
  const service = getServiceSchema({
    name: "Auto Insurance Consulting",
    description:
      "In-depth policy audit and optimization, uninsured/underinsured motorist safeguards, multi-policy discount leveraging, and direct connections to top-tier underwriters.",
    url: `${BASE_URL}/services/auto-insurance`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
