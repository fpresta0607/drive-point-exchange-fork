'use client';

import React from 'react';
import ServiceLayout from '../../../components/ServiceLayout';

export default function Page() {
  return (
    <ServiceLayout
      title={`Auto Loan Refinance`}
      description={[
        `Refinancing your auto loan with Drive Point Exchange can be one of the most effective ways to lower your monthly expenses and improve your financial standing. Our auto refinance solutions are designed to help you secure a better interest rate, reduce your monthly payments, or adjust your loan term to better fit your current lifestyle and budget.`,
        `Whether your credit score has improved since you first purchased your vehicle, or general market interest rates have dropped, you shouldn't be stuck paying more than you have to. We work closely with a nationwide network of top-rated lenders to find the most competitive rates available for your specific profile.`,
        `The process is fast, transparent, and completely hassle-free. We handle the heavy lifting, from paying off your old lender to transferring the title. Experience the peace of mind that comes with knowing you're getting the best possible deal on your automotive financing.`
      ]}
      features={[
        `Significantly lower monthly payments`,
        `Reduced interest rates based on updated credit`,
        `Flexible terms ranging from 12 to 84 months`,
        `No hidden penalties for early payoff`,
        `Seamless transition from your previous lender`,
        `Skip up to two payments during the transition`
      ]}
      imageSrc="/auto/hero-auto-refinance-v2.webp"
    />
  );
}
