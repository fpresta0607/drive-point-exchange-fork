'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { GradientText } from '../../components/ui/gradient-text';
import { CTAButton } from '../../components/ui/cta-button';

const AutoLoanRefinanceCalculator = dynamic(
  () => import('../../components/ui/auto-loan-refinance-calculator').then(m => m.AutoLoanRefinanceCalculator),
  { ssr: false }
);
const ShaderBackground = dynamic(() => import('../../components/ui/shader-background'), { ssr: false });
const TrustpilotReviews = dynamic(() => import('../../components/TrustpilotReviews'), { ssr: false });
const SocialFeed = dynamic(() => import('../../components/SocialFeed'), { ssr: false });

const heroCtaWords = [
  { label: "Start Today", href: "/contact" },
  { label: "Contact Us", href: "/contact" },
  { label: "Calculate Savings", href: "/calculator?type=auto" },
];

function HeroWordCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroCtaWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const current = heroCtaWords[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="flex justify-center"
    >
      <Link
        href={current.href}
        className="group relative inline-flex items-center justify-center gap-3 py-4 px-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:bg-white/15 hover:border-white/40 hero-cta-pulse"
      >
        <div className="relative h-6 overflow-hidden min-w-[180px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center text-overline text-white tracking-[0.15em] font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            >
              {current.label}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="relative z-10 w-7 h-7 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const { ts } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const fadeInUp = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { type: "spring", stiffness: 100, damping: 15 } };

  const staggerChildren = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.12 } } };

  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: ts('home.services.autoRefinance.title'),
      description: ts('home.services.autoRefinance.description'),
      image: "/auto/car-loan.jpg",
      href: "/services/auto-refinance",
      category: "Auto Refinance",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: ts('home.services.vehicleCoverage.title'),
      description: ts('home.services.vehicleCoverage.description'),
      image: "/auto/porsche-garage.jpg",
      href: "/services/vehicle-coverage",
      category: "Coverage & Protection",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: ts('home.services.homeRefinance.title'),
      description: ts('home.services.homeRefinance.description'),
      image: "/auto/svc-home-refinance.jpg",
      href: "/services/home-refinance",
      category: "Home Loans",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: ts('home.services.insuranceConsultation.title'),
      description: ts('home.services.insuranceConsultation.description'),
      image: "/auto/svc-auto-insurance.jpg",
      href: "/services/auto-insurance",
      category: "Auto Insurance",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      title: ts('home.services.lifeInsurance.title'),
      description: ts('home.services.lifeInsurance.description'),
      image: "/auto/svc-life-insurance.jpg",
      href: "/services/life-insurance",
      category: "Life Insurance",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: ts('home.services.creditSavings.title'),
      description: ts('home.services.creditSavings.description'),
      image: "/auto/car-loan3.jpg",
      href: "/services/credit-consultations",
      category: "Credit & Savings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navigation overlay />

      {/* ─── HERO ─── full viewport, nav overlays */}
      <section className="relative min-h-[100svh] w-full flex flex-col justify-center overflow-hidden pt-20 pb-40">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 bg-slate-900 pointer-events-none">
          <motion.div
            animate={{
              scale: [1.02, 1.12, 1.02],
              x: ["0%", "-1%", "0%"],
              y: ["0%", "1%", "0%"],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="/auto/heroGarage2.jpg"
              alt="Garage Background"
              fill
              sizes="100vw"
              className="object-cover opacity-100"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-dpe-green/20 rounded-full blur-[150px] opacity-60 mix-blend-screen translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] text-white leading-[1.08] mb-8 font-heading font-extrabold tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            >
              Your Roadmap to{" "}
              <br className="hidden sm:block" />
              <GradientText>
                Financial Freedom
              </GradientText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Lower your payments, protect your vehicle, and build a stronger financial future - backed by experts who put you first.
            </motion.p>

            <HeroWordCarousel />
          </div>
        </div>
      </section>

      {/* ─── CALCULATOR BODY ─── (Pulled over the hero section fold) */}
      <section className="relative z-20 w-full max-w-7xl mx-auto px-4 -mt-[112px] md:-mt-[128px] pb-24">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="relative w-full"
        >
          <AutoLoanRefinanceCalculator />
        </motion.div>
      </section>

      {/* ─── SERVICES TABS ─── */}
      <section className="py-24 bg-[#0A1340] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-14"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 border border-dpe-green/30 bg-dpe-green/10 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-dpe-green animate-pulse" />
              <span className="text-overline text-dpe-green">Our Services</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl text-white">
              {ts('home.services.title')}
            </motion.h2>
          </motion.div>

          {/* Tab bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveService(index)}
                aria-label={service.category}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeService === index
                    ? 'text-[#0A1340] bg-dpe-green shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                    : 'text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {service.icon}
                <span className="hidden sm:inline">{service.category}</span>
              </button>
            ))}
          </motion.div>

          {/* Feature panel */}
          <div className="relative rounded-2xl overflow-hidden" style={{ height: '520px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0"
              >
                <Image
                  src={services[activeService].image}
                  alt={services[activeService].title}
                  fill
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A1340]/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1340]/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Content overlay */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 max-w-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${activeService}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
                >
                  <span className="inline-flex items-center gap-1.5 text-overline text-dpe-green mb-3">
                    {services[activeService].icon}
                    {services[activeService].category}
                  </span>
                  <h3 className="text-3xl md:text-4xl text-white mb-4 leading-tight">
                    {services[activeService].title}
                  </h3>
                  <p className="text-white/70 text-base leading-relaxed mb-6 font-light">
                    {services[activeService].description}
                  </p>
                  <CTAButton href={services[activeService].href} showArrow>
                    {ts('home.services.learnMore')}
                  </CTAButton>
                </motion.div>
              </AnimatePresence>

              {/* Step indicators */}
              <div className="flex gap-1.5 mt-8">
                {services.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveService(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === activeService ? 'w-8 bg-dpe-green' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to service ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── TRUST ─── */}
      <section className="relative py-24 bg-slate-950 overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 z-0">
          <ShaderBackground className="absolute top-0 left-0 w-full h-full opacity-80" />
          <div className="absolute inset-0 bg-dpe-blue/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/80" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full flex flex-col gap-8 lg:gap-12 items-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-12"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-dpe-green animate-pulse" />
              <span className="text-overline text-white/80">Trusted Nationwide</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl text-white mb-4">
              {ts('home.trust.title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-400 font-light">
              {ts('home.trust.subtitle')}
            </motion.p>
          </motion.div>

          {/* Trustpilot Reviews */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 w-full flex justify-center"
          >
            <div className="w-full max-w-4xl">
               <TrustpilotReviews />
            </div>
          </motion.div>

        </div>
      </section>

      <SocialFeed />

      {/* ─── CTA ─── */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 border border-dpe-green/20 bg-dpe-green/5 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-dpe-green animate-pulse" />
              <span className="text-overline text-dpe-green">Get Started Today</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl text-gray-900 mb-4">
              {ts('home.cta.title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-400 font-light mb-10 max-w-2xl mx-auto">
              {ts('home.cta.subtitle')}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex justify-center mb-12">
              <CTAButton href="/contact" variant="primary">
                Get in Touch
              </CTAButton>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-[#f8fafc] border border-gray-100 rounded-2xl px-8 py-6"
            >
              <div className="text-center sm:text-left">
                <p className="text-overline text-gray-400 mb-1">Main Office</p>
                <a href="tel:+18883510782" className="text-xl font-semibold text-gray-900 hover:text-dpe-green transition-colors tracking-tight">
                  (888) 351-0782
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
