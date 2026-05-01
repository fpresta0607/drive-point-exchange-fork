import type { Metadata } from "next";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/structured-data";

const BASE_URL = "https://www.drivepointexchange.com";

export const metadata: Metadata = {
  title: "Credit Consultations - Improve Your Credit Score",
  description:
    "Drive Point Exchange credit consultation with tri-bureau analysis, dispute resolution, credit utilization optimization, DTI improvement plans, and debt negotiation assistance.",
  keywords: [
    "credit consultation",
    "credit repair",
    "improve credit score",
    "credit dispute",
    "FICO score improvement",
    "credit counseling online",
  ],
  openGraph: {
    title: "Credit Consultations - Improve Your Credit Score | Drive Point Exchange",
    description:
      "Expert credit consulting. Tri-bureau analysis, dispute resolution, credit utilization optimization, and long-term wealth building roadmaps.",
    images: [{ url: "/auto/hero-credit-calculator-v2.webp", width: 1200, height: 630, alt: "Credit consultation services" }],
  },
  twitter: {
    title: "Credit Consultations - Improve Your Credit Score",
    description:
      "Expert credit consulting. Tri-bureau analysis, dispute resolution, and credit utilization optimization.",
  },
  alternates: { canonical: `${BASE_URL}/services/credit-consultations` },
};

export default function CreditConsultationsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Services", url: `${BASE_URL}/services` },
    { name: "Credit Consultations", url: `${BASE_URL}/services/credit-consultations` },
  ]);
  const service = getServiceSchema({
    name: "Credit Consultations",
    description:
      "Exhaustive tri-bureau analysis, aggressive dispute of inaccuracies and collections, credit utilization optimization, DTI ratio improvement plans, and long-term wealth building roadmaps.",
    url: `${BASE_URL}/services/credit-consultations`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
