'use client';

import React from 'react';
import ServiceLayout from '../../../components/ServiceLayout';

export default function Page() {
  return (
    <ServiceLayout
      title={`Credit Consultations`}
      description={[
        `Your credit score is the foundational metric that dictates your borrowing power, interest rates, and overall financial mobility. At Drive Point Exchange, our expert Credit Consultation service empowers you to take control of your financial narrative by systematically identifying and disputing inaccuracies, while building a roadmap toward prime credit tiers.`,
        `We perform an exhaustive tri-bureau analysis to pinpoint exactly what is pulling your score down. From late payment negations to high credit utilization ratios, our experienced advisors walk you through aggressive yet verified tactics to rapidly boost your FICO scores. We don't just tell you what's wrong; we help you fix it.`,
        `Ultimately, a higher credit score saves you tens of thousands of dollars over your lifetime in reduced interest margins on vehicles, mortgages, and personal loans. Let us give you the strategic playbook to achieve elite credit standing.`
      ]}
      features={[
        `Tri-bureau (Equifax, Experian, TransUnion) analysis`,
        `Aggressive dispute of inaccuracies and collections`,
        `Credit utilization optimization strategies`,
        `Debt-to-income (DTI) ratio improvement plans`,
        `Negotiation assistance for outstanding debts`,
        `Long-term wealth building roadmaps`
      ]}
      imageSrc="/auto/hero-credit-calculator-v2.webp"
    />
  );
}
