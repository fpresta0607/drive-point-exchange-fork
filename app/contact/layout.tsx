import type { Metadata } from "next";
import { getFAQSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact Drive Point Exchange - Nationwide Auto Financing Experts",
  description: "Contact Drive Point Exchange for personalized auto financing assistance. Call (888) 351-0782 or email support@drivepointexchange.com for expert advice. Nationwide service.",
  keywords: [
    "contact drive point exchange",
    "auto financing assistance",
    "auto loan consultation",
    "nationwide auto loans",
    "auto financing experts",
    "auto loan help",
    "auto refinancing contact"
  ],
  openGraph: {
    title: "Contact Drive Point Exchange - Nationwide Auto Financing Experts",
    description: "Contact Drive Point Exchange for personalized auto financing assistance. Call (888) 351-0782 for expert advice. Nationwide service.",
    images: [
      {
        url: "/auto/hero-credit-calculator-v2.webp",
        width: 1200,
        height: 630,
        alt: "Contact us for auto financing",
      },
    ],
  },
  twitter: {
    title: "Contact Drive Point Exchange - Nationwide Auto Financing Experts",
    description: "Contact Drive Point Exchange for personalized auto financing assistance. Nationwide service.",
  },
  alternates: {
    canonical: "https://www.drivepointexchange.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqSchema = getFAQSchema([
    {
      question: "How quickly can I get approved for auto refinancing?",
      answer:
        "Most auto refinance applications are reviewed and approved within 24-48 hours. Once approved, the transition from your old lender is handled entirely by our team.",
    },
    {
      question: "Will refinancing affect my credit score?",
      answer:
        "A soft credit inquiry is used for initial pre-qualification, which does not affect your score. A hard inquiry is only performed once you choose to proceed with a specific offer.",
    },
    {
      question: "What documents do I need to apply?",
      answer:
        "You'll typically need a valid driver's license, proof of income (recent pay stubs or tax returns), your current loan statement, and vehicle registration.",
    },
    {
      question: "Do you serve customers in all 50 states?",
      answer:
        "Yes, Drive Point Exchange serves customers nationwide across all 50 states. Our lending network and insurance partnerships have nationwide coverage.",
    },
    {
      question: "Is there a fee for your consultation services?",
      answer:
        "Initial consultations for all our services — auto refinancing, vehicle coverage, home refinance, insurance, and credit — are completely free with no obligation.",
    },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
