'use client';

import React from 'react';
import ServiceLayout from '../../../components/ServiceLayout';

export default function Page() {
  return (
    <ServiceLayout
      title={`Auto Insurance Consulting`}
      description={[
        `Navigating the complexities of auto insurance can feel overwhelming, with countless carriers offering policies that are often laden with confusing jargon and hidden exclusions. Drive Point Exchange acts as your dedicated advocate, analyzing your current policy line-by-line to ensure you hold the right coverage at the best possible price.`,
        `We don't sell direct-to-consumer cookie-cutter policies. Instead, we consult and connect you with bespoke insurance frameworks tailored to your driving habits, vehicle type, and risk profile. By identifying overlapping coverage areas and optimizing your deductibles, we consistently help our clients save hundreds of dollars annually without sacrificing protection.`,
        `Whether you're insuring a daily-commuter sedan, a high-value sports car, or setting up a multi-vehicle family policy, our consulting guarantees you remain compliant, fully protected against uninsured motorists, and financially shielded from catastrophic liability claims.`
      ]}
      features={[
        `In-depth policy audit and overlap identification`,
        `Uninsured/Underinsured motorist safeguards`,
        `Comprehensive and collision optimization`,
        `Multi-policy discount leveraging`,
        `Teen driver cost mitigation strategies`,
        `Direct connections to top-tier underwriters`
      ]}
      imageSrc="/auto/hero-auto-insurance-v2.webp"
    />
  );
}
