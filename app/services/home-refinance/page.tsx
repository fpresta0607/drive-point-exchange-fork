'use client';

import React from 'react';
import ServiceLayout from '../../../components/ServiceLayout';

export default function Page() {
  return (
    <ServiceLayout
      title={`Home Refinance`}
      description={[
        `Your home is likely your most valuable asset. Drive Point Exchange offers tailored Home Refinancing programs designed to help you tap into your home's equity, consolidate high-interest debts, or simply lower your monthly mortgage payments in an evolving economic landscape.`,
        `Are you paying for expensive Private Mortgage Insurance (PMI)? If your home has appreciated in value, a home refinance can strip that unnecessary cost entirely. Looking to remodel, pay for a child's education, or consolidate credit cards? Cash-out refinancing gives you access to a lump sum of capital using the equity you've built over time.`,
        `Our dedicated mortgage specialists review your current housing situation and long-term financial goals to structure a loan that saves you the maximum amount of money over the life of your mortgage, streamlining the application and appraisal processes to close faster than big-box banks.`
      ]}
      features={[
        `Drop Private Mortgage Insurance (PMI)`,
        `Cash-out refinancing for major life expenses`,
        `Transition from an Adjustable Rate (ARM) to Fixed-Rate`,
        `Streamlined credit and appraisal processes`,
        `Debt consolidation at lower interest rates`,
        `Flexible 15, 20, and 30-year fixed terms`
      ]}
      imageSrc="/auto/hero-home-refinance-v2.webp"
    />
  );
}
