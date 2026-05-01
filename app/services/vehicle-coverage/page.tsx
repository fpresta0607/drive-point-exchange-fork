'use client';

import React from 'react';
import ServiceLayout from '../../../components/ServiceLayout';

export default function Page() {
  return (
    <ServiceLayout
      title={`Vehicle Coverage & Certifications`}
      description={[
        `In today's unpredictable automotive market, true peace of mind comes from knowing your vehicle is comprehensively protected against the unexpected. Since the post-COVID dealership inventory changes, many drivers are paying for certified coverage through third-party providers without their vehicle actually being verified on the dealer's paperwork. This loop-hole leaves you dangerously under-protected.`,
        `At Drive Point Exchange, we specialize in authentic Vehicle Coverage and Certifications. We conduct a thorough audit of your current coverage to expose any hidden gaps or invalid protections. We then provide you with genuine, iron-clad extended warranty options that pick up exactly where your manufacturer warranty leaves off, ensuring you are never blindsided by exorbitant repair bills.`,
        `From major engine block faults to electrical system failures and advanced driver-assistance systems (ADAS) calibrations, our premier protection plans cover the critical components that modern vehicles rely on.`
      ]}
      features={[
        `Comprehensive roadside assistance (24/7)`,
        `Zero-deductible options available on major repairs`,
        `Rental car reimbursement up to $50/day`,
        `Trip interruption overnight stipends`,
        `Nationwide repair facility acceptance`,
        `Coverage for high-tech electrical systems`
      ]}
      imageSrc="/auto/hero-vehicle-coverage-v2.webp"
    />
  );
}
