'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import LoanCalculator from '../../components/LoanCalculator';
import HomeLoanCalculator from '../../components/HomeLoanCalculator';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';

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
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/auto/car-loan3.jpg"
            alt="Financial calculator tools"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-36 z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="text-center"
          >
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-white mb-6">
              {ts('calculator.page.title')}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {ts('calculator.page.subtitle')}
            </motion.p>
            
            {/* Calculator Type Selection */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => setCalculatorType('auto')}
                className={`px-8 py-4 rounded-full font-semibold transition-all duration-200 ${
                  calculatorType === 'auto'
                    ? 'bg-dpe-navy text-white shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {ts('navigation.autoLoanCalculator')}
              </button>
              <button
                onClick={() => setCalculatorType('home')}
                className={`px-8 py-4 rounded-full font-semibold transition-all duration-200 ${
                  calculatorType === 'home'
                    ? 'bg-dpe-navy text-white shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {ts('navigation.homeLoanCalculator')}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 bg-dpe-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-8"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl text-dpe-gray-900 mb-4">
              {calculatorType === 'auto' ? ts('navigation.autoLoanCalculator') : ts('navigation.homeLoanCalculator')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-dpe-gray-600 max-w-3xl mx-auto">
              {calculatorType === 'auto' 
                ? ts('calculator.page.autoDescription')
                : ts('calculator.page.homeDescription')
              }
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            {calculatorType === 'auto' ? (
              <LoanCalculator />
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
