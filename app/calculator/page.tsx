'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import HomeLoanCalculator from '../../components/HomeLoanCalculator';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { SectionKicker } from '../../components/ui/section-kicker';

const AutoLoanRefinanceCalculator = dynamic(
  () => import('../../components/ui/auto-loan-refinance-calculator').then(m => m.AutoLoanRefinanceCalculator),
  { ssr: false }
);

function CalculatorContent() {
  const prefersReducedMotion = useReducedMotion();

  const fadeInUp = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  const staggerChildren = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.05 } } };

  const searchParams = useSearchParams();
  const initialType = searchParams.get('type');
  const [calculatorType, setCalculatorType] = useState<'auto' | 'home'>(
    initialType === 'home' || initialType === 'auto' ? initialType : 'auto'
  );
  const { ts } = useI18n();

  const urlType = searchParams.get('type');

  useEffect(() => {
    if ((urlType === 'home' || urlType === 'auto')) {
      setCalculatorType(urlType);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlType]);

  return (
    <div className="min-h-screen">
      <Navigation overlay />
      
      {/* Hero — editorial dark, sharp */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0">
          <Image
            src="/auto/hero-credit-calculator-v2.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/95" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <motion.div initial="initial" animate="animate" variants={staggerChildren} className="max-w-3xl">
            <motion.div variants={fadeInUp}>
              <SectionKicker align="left" tone="white">
                Calculators
              </SectionKicker>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl text-white font-bold tracking-[-0.025em] leading-[1.02] mb-5"
            >
              {ts('calculator.page.title')}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/65 font-light max-w-xl leading-relaxed"
            >
              {ts('calculator.page.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Calculator section — sharp segmented tabs + flat panel */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sharp segmented switcher */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex border border-slate-300 mb-10"
          >
            <button
              type="button"
              onClick={() => setCalculatorType('auto')}
              className={`px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors border-r border-slate-300 ${
                calculatorType === 'auto'
                  ? 'bg-slate-950 text-white'
                  : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              {ts('navigation.autoLoanCalculator')}
            </button>
            <button
              type="button"
              onClick={() => setCalculatorType('home')}
              className={`px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                calculatorType === 'home'
                  ? 'bg-slate-950 text-white'
                  : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              {ts('navigation.homeLoanCalculator')}
            </button>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerChildren}
            className="max-w-3xl mb-10"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-950 tracking-[-0.02em] leading-tight mb-3">
              {calculatorType === 'auto' ? ts('navigation.autoLoanCalculator') : ts('navigation.homeLoanCalculator')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-slate-500 font-light leading-relaxed">
              {calculatorType === 'auto'
                ? ts('calculator.page.autoDescription')
                : ts('calculator.page.homeDescription')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className={calculatorType === 'auto' ? 'w-full' : 'max-w-4xl'}
          >
            {calculatorType === 'auto' ? (
              <AutoLoanRefinanceCalculator />
            ) : (
              <HomeLoanCalculator />
            )}
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

function CalculatorLoading() {
  const { ts } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dpe-blue mx-auto"></div>
        <p className="mt-4 text-dpe-gray-600">{ts('calculator.page.loading')}</p>
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<CalculatorLoading />}>
      <CalculatorContent />
    </Suspense>
  );
}
