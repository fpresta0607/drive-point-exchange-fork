'use client';

import React from 'react';
import ServiceLayout from '../../../components/ServiceLayout';

export default function Page() {
  return (
    <ServiceLayout
      title={`Life Insurance Solutions`}
      description={[
        `Protecting your loved ones against life's uncertainties is the foundation of true financial planning. Drive Point Exchange offers bespoke life insurance consulting designed to safeguard your family's future, ensuring that your financial obligations - from mortgage payouts to childhood education - are completely secured in the event of tragedy.`,
        `We help you decode the complexities of Term Life, Whole Life, and Universal Life policies. By analyzing your long-term liabilities, current assets, and dependent timeline, we calculate the exact death benefit required to keep your family comfortable, mitigating the risk of being under-insured or over-paying for unnecessary riders.`,
        `Beyond basic death benefits, we explore cash-value accumulation strategies and living benefits, enabling your life insurance policy to function as a dynamic tax-advantaged asset within your broader financial portfolio.`
      ]}
      features={[
        `Term life policies customized (10, 20, 30 years)`,
        `Whole life guidance for permanent protection`,
        `Living benefit riders for critical illnesses`,
        `Tax-advantaged cash value accumulation`,
        `No-medical-exam approval options`,
        `Coverage calculation against major debts (mortgages)`
      ]}
      imageSrc="/auto/hero-life-insurance-v2.webp"
    />
  );
}
