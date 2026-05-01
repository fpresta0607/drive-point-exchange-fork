import type { Metadata } from "next";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/structured-data";

const BASE_URL = "https://www.drivepointexchange.com";

export const metadata: Metadata = {
  title: "Vehicle Coverage & Certifications - Verified Protection",
  description:
    "Get authentic vehicle coverage and certifications from Drive Point Exchange. We audit your current coverage, expose gaps from invalid third-party protections, and provide genuine extended warranty options.",
  keywords: [
    "vehicle coverage",
    "extended warranty",
    "vehicle certification",
    "auto protection plan",
    "car warranty",
    "vehicle coverage audit",
  ],
  openGraph: {
    title: "Vehicle Coverage & Certifications | Drive Point Exchange",
    description:
      "Authentic vehicle coverage and certifications. Comprehensive roadside assistance, zero-deductible options, rental car reimbursement.",
    images: [{ url: "/auto/hero-vehicle-coverage-v2.webp", width: 1200, height: 630, alt: "Vehicle coverage and protection services" }],
  },
  twitter: {
    title: "Vehicle Coverage & Certifications - Verified Protection",
    description:
      "Authentic vehicle coverage and certifications with comprehensive roadside assistance and zero-deductible options.",
  },
  alternates: { canonical: `${BASE_URL}/services/vehicle-coverage` },
};

export default function VehicleCoverageLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Services", url: `${BASE_URL}/services` },
    { name: "Vehicle Coverage & Certifications", url: `${BASE_URL}/services/vehicle-coverage` },
  ]);
  const service = getServiceSchema({
    name: "Vehicle Coverage & Certifications",
    description:
      "Authentic vehicle coverage and certifications with thorough coverage audits, genuine extended warranty options, 24/7 roadside assistance, and nationwide repair facility acceptance.",
    url: `${BASE_URL}/services/vehicle-coverage`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
