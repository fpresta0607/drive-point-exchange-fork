'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { SectionKicker } from '../../components/ui/section-kicker';
import { WordRotate } from '../../components/ui/word-rotate';

const AutoLoanRefinanceCalculator = dynamic(
  () => import('../../components/ui/auto-loan-refinance-calculator').then(m => m.AutoLoanRefinanceCalculator),
  { ssr: false }
);
const SocialFeed = dynamic(() => import('../../components/SocialFeed'), { ssr: false });

export default function Home() {
  const { ts } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const fadeInUp = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { type: "spring", stiffness: 260, damping: 20 } };

  const staggerChildren = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.05 } } };

  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: ts('home.services.autoRefinance.title'),
      description: ts('home.services.autoRefinance.description'),
      image: "/auto/hero-auto-refinance-v2.webp",
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
      image: "/auto/hero-vehicle-coverage-v2.webp",
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
      image: "/auto/hero-home-refinance-v2.webp",
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
      image: "/auto/hero-auto-insurance-v2.webp",
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
      image: "/auto/hero-life-insurance-v2.webp",
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
      image: "/auto/hero-credit-calculator-v2.webp",
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

      {/* ─── HERO ─── editorial, sharp, Rogo/Harvey aesthetic */}
      <section className="relative min-h-[100svh] w-full flex flex-col justify-center overflow-hidden pt-32 pb-40">
        {/* Background — static photo, layered scrims */}
        <div className="absolute inset-0 z-0 bg-slate-950 pointer-events-none">
          <Image
            src="/auto/heroGarage2.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/90" />
          <div className="absolute top-1/3 right-[-10%] w-[640px] h-[640px] bg-dpe-green/12 rounded-full blur-[160px] mix-blend-screen" />
          {/* Hairline grid overlay for editorial feel */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '120px 120px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <SectionKicker align="left" tone="white">
                Drive Point Exchange · Nationwide
              </SectionKicker>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] text-white leading-[0.98] font-heading font-bold tracking-[-0.03em] mb-7"
            >
              Your roadmap to<br />
              <span className="text-green-sweep animate-gradient-text-sweep">
                financial freedom.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
            >
              <WordRotate
                words={[
                  'Lower your payments.',
                  'Protect your vehicle.',
                  'Build a stronger financial future.',
                ]}
                className="block text-white font-medium"
              />
              <span className="block text-white/55 font-light mt-1">
                With experts who put you first.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-slate-950 text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors"
              >
                Start your application
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/calculator?type=auto"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white text-sm font-medium hover:bg-white/[0.04] hover:border-white/30 transition-colors"
              >
                Calculate savings
              </Link>
            </motion.div>
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

      {/* ─── SERVICES TABS ─── editorial dark band, sharp panels */}
      <section className="bg-slate-950 overflow-hidden border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

          {/* Header — left-aligned, restrained */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerChildren}
            className="mb-14 max-w-2xl"
          >
            <motion.div variants={fadeInUp}>
              <SectionKicker align="left" tone="white">
                Our services
              </SectionKicker>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.025em] leading-[1.02]"
            >
              {ts('home.services.title')}
            </motion.h2>
          </motion.div>

          {/* Tab bar — sharp segmented */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap gap-0 mb-10 border border-white/10"
          >
            {services.map((service, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveService(index)}
                aria-label={service.category}
                className={`relative flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 border-r border-white/10 last:border-r-0 ${
                  activeService === index
                    ? 'text-slate-950 bg-white'
                    : 'text-white/55 bg-transparent hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {service.icon}
                <span className="hidden sm:inline">{service.category}</span>
              </button>
            ))}
          </motion.div>

          {/* Feature panel — sharp, hairline-bordered */}
          <div
            className="relative overflow-hidden border border-white/10"
            style={{ height: '560px' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={services[activeService].image}
                  alt={services[activeService].title}
                  fill
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#01040E]/75 via-[#01040E]/15 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#01040E]/55 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Content overlay */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-14 max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${activeService}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                >
                  <span className="inline-flex items-center gap-2 text-overline text-dpe-green mb-4">
                    <span aria-hidden className="block w-0.5 h-3.5 bg-dpe-green" />
                    {services[activeService].category}
                  </span>
                  <h3 className="text-3xl md:text-5xl text-white mb-5 leading-[1.04] tracking-[-0.02em] font-bold">
                    {services[activeService].title}
                  </h3>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed mb-7 font-light max-w-lg">
                    {services[activeService].description}
                  </p>
                  <Link
                    href={services[activeService].href}
                    className="group inline-flex items-center gap-2.5 px-6 py-3 bg-white text-slate-950 text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors"
                  >
                    {ts('home.services.learnMore')}
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Step indicators — sharp ticks */}
              <div className="flex gap-1.5 mt-10">
                {services.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveService(i)}
                    className={`h-px transition-all duration-300 ${
                      i === activeService ? 'w-10 bg-dpe-green' : 'w-5 bg-white/25 hover:bg-white/50'
                    }`}
                    aria-label={`Go to service ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ─── TRUSTPILOT REVIEWS BAR — full bleed across bottom of section ─── */}
        <motion.a
          href="https://www.trustpilot.com/review/drivepointexchange.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="group block w-full bg-slate-950 border-t border-white/[0.08] hover:bg-slate-900 transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            {/* Left: Excellent + stars */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="flex items-center justify-center w-6 h-6 bg-dpe-green-500">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                ))}
              </div>
              <span className="text-white text-sm font-semibold tracking-wide">Excellent</span>
            </div>

            {/* Middle: rating + count, separated by hairlines */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
              <div className="flex items-center gap-2 md:border-l md:border-white/[0.1] md:pl-6">
                <span className="text-white font-semibold">4.9</span>
                <span className="text-white/45">out of 5</span>
              </div>
              <div className="flex items-center gap-2 md:border-l md:border-white/[0.1] md:pl-6">
                <span className="text-white/45">Based on</span>
                <span className="text-white font-medium">1,200+ verified reviews</span>
              </div>
            </div>

            {/* Right: Trustpilot wordmark + arrow */}
            <div className="flex items-center gap-3 md:border-l md:border-white/[0.1] md:pl-6 text-sm">
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-white/45">on</span>
              <span className="inline-flex items-center gap-1.5 text-white font-semibold">
                <svg className="w-4 h-4 text-dpe-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Trustpilot
              </span>
              <svg
                className="w-4 h-4 text-white/55 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </motion.a>
      </section>

      <SocialFeed />

      {/* ─── CTA ─── light editorial close */}
      <section className="py-28 bg-white border-t border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerChildren}
            className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-end"
          >
            <div>
              <motion.div variants={fadeInUp}>
                <SectionKicker align="left" tone="green">
                  Get started today
                </SectionKicker>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl text-slate-950 mb-6 tracking-[-0.025em] leading-[1.02]"
              >
                {ts('home.cta.title')}
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-slate-500 font-light leading-relaxed mb-9 max-w-xl"
              >
                {ts('home.cta.subtitle')}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-slate-950 text-white text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors"
                >
                  Get in touch
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-300 text-slate-700 text-sm font-medium hover:border-slate-950 hover:text-slate-950 transition-colors"
                >
                  Explore services
                </Link>
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              className="border-l border-slate-200 pl-8 py-2 lg:py-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
                Main office
              </p>
              <a
                href="tel:+18883510782"
                className="text-3xl lg:text-4xl font-bold text-slate-950 hover:text-dpe-green transition-colors tracking-[-0.02em]"
              >
                (888) 351-0782
              </a>
              <p className="text-sm text-slate-500 font-light mt-3 leading-relaxed">
                Speak with a financing specialist — no obligations, no fees.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
