import type { Metadata } from "next";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/structured-data";

const BASE_URL = "https://www.drivepointexchange.com";

export const metadata: Metadata = {
  title: "Life Insurance Solutions - Protect Your Family's Future",
  description:
    "Drive Point Exchange life insurance consulting covers term life (10, 20, 30 year), whole life, living benefit riders, tax-advantaged cash value accumulation, and no-medical-exam options.",
  keywords: [
    "life insurance",
    "term life insurance",
    "whole life insurance",
    "life insurance consulting",
    "living benefit riders",
    "life insurance nationwide",
  ],
  openGraph: {
    title: "Life Insurance Solutions - Protect Your Family's Future | Drive Point Exchange",
    description:
      "Bespoke life insurance consulting. Term life, whole life, living benefit riders, and tax-advantaged cash value accumulation.",
    images: [{ url: "/auto/hero-life-insurance-v2.webp", width: 1200, height: 630, alt: "Life insurance consulting" }],
  },
  twitter: {
    title: "Life Insurance Solutions - Protect Your Family's Future",
    description:
      "Bespoke life insurance consulting. Term life, whole life, and living benefit riders.",
  },
  alternates: { canonical: `${BASE_URL}/services/life-insurance` },
};

export default function LifeInsuranceLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Services", url: `${BASE_URL}/services` },
    { name: "Life Insurance Solutions", url: `${BASE_URL}/services/life-insurance` },
  ]);
  const service = getServiceSchema({
    name: "Life Insurance Solutions",
    description:
      "Customized term life policies (10, 20, 30 year), whole life guidance, living benefit riders for critical illnesses, tax-advantaged cash value accumulation, and no-medical-exam options.",
    url: `${BASE_URL}/services/life-insurance`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
