'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { Sparkles, Shield, TrendingUp, HandCoins, Activity, Landmark, ArrowUpRight } from 'lucide-react';
import { SectionKicker } from '../../components/ui/section-kicker';

export default function ServicesHub() {
  const { ts } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.05 } } };

  const itemVariants = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  const servicesList = [
    {
      title: ts('home.services.autoRefinance.title'),
      description: ts('home.services.autoRefinance.description'),
      icon: <Activity className="w-5 h-5" />,
      image: "/auto/hero-auto-refinance-v2.webp",
      href: "/services/auto-refinance",
      category: ts('services.hub.categories.autoRefinance'),
    },
    {
      title: ts('home.services.vehicleCoverage.title'),
      description: ts('home.services.vehicleCoverage.description'),
      icon: <Shield className="w-5 h-5" />,
      image: "/auto/hero-vehicle-coverage-v2.webp",
      href: "/services/vehicle-coverage",
      category: ts('services.hub.categories.coverage'),
    },
    {
      title: ts('home.services.homeRefinance.title'),
      description: ts('home.services.homeRefinance.description'),
      icon: <Landmark className="w-5 h-5" />,
      image: "/auto/hero-home-refinance-v2.webp",
      href: "/services/home-refinance",
      category: ts('services.hub.categories.homeLoans'),
    },
    {
      title: ts('home.services.insuranceConsultation.title'),
      description: ts('home.services.insuranceConsultation.description'),
      icon: <Sparkles className="w-5 h-5" />,
      image: "/auto/hero-auto-insurance-v2.webp",
      href: "/services/auto-insurance",
      category: ts('services.hub.categories.consulting'),
    },
    {
      title: ts('home.services.lifeInsurance.title'),
      description: ts('home.services.lifeInsurance.description'),
      icon: <HandCoins className="w-5 h-5" />,
      image: "/auto/hero-life-insurance-v2.webp",
      href: "/services/life-insurance",
      category: ts('services.hub.categories.consulting'),
    },
    {
      title: ts('home.services.creditSavings.title'),
      description: ts('home.services.creditSavings.description'),
      icon: <TrendingUp className="w-5 h-5" />,
      image: "/auto/hero-credit-calculator-v2.webp",
      href: "/services/credit-consultations",
      category: ts('services.hub.categories.financial'),
    },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-dpe-green/30 selection:text-white">
      <Navigation overlay />

      {/* ─── HERO ─── editorial dark, sharp */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden pt-32 pb-20 bg-slate-950">
        {/* Background — soft architectural image + scrims */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/auto/hero-services-page.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/85" />
          <div className="absolute top-1/3 right-[-10%] w-[640px] h-[640px] bg-dpe-blue/15 rounded-full blur-[160px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-dpe-green/12 rounded-full blur-[140px] mix-blend-screen" />
          {/* Hairline grid */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '120px 120px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial="initial" animate="animate" variants={containerVariants} className="max-w-3xl">
            <motion.div variants={itemVariants}>
              <SectionKicker align="left" tone="white">
                Services · Nationwide
              </SectionKicker>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] text-white font-bold tracking-[-0.03em] leading-[0.98] mb-7"
            >
              {ts('services.hub.heroTitle1')}<br />
              <span className="text-white">{ts('services.hub.heroTitle2')}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/65 font-light max-w-xl leading-relaxed mb-10"
            >
              {ts('services.hub.heroSubtitle')}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-slate-950 text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors"
              >
                {ts('services.hub.ctaButton')}
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
          </motion.div>
        </div>
      </section>

      {/* ─── SERVICES GRID ─── sharp hairline cards */}
      <section className="py-28 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="max-w-2xl mb-14"
          >
            <motion.div variants={itemVariants}>
              <SectionKicker align="left" tone="green">
                What we offer
              </SectionKicker>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl text-slate-950 tracking-[-0.025em] leading-[1.02]"
            >
              Six services. <span className="text-dpe-blue">One nationwide partner.</span>
            </motion.h2>
          </motion.div>

          {/* Sharp grid */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200"
          >
            {servicesList.map((service) => (
              <motion.div key={service.title} variants={itemVariants}>
                <Link
                  href={service.href}
                  className="group relative block h-[420px] bg-white overflow-hidden"
                >
                  {/* Image fills the card */}
                  <div className="absolute inset-0">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/20 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/15 transition-colors duration-500" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-7 z-10">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="inline-flex items-center justify-center w-10 h-10 border border-white/20 bg-white/[0.06] backdrop-blur-sm text-white/90">
                        {service.icon}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 border-l border-white/15 pl-3">
                        {service.category}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div>
                      <h3 className="text-2xl md:text-3xl text-white font-bold tracking-[-0.02em] leading-[1.05] mb-3">
                        {service.title}
                      </h3>
                      <p className="text-white/65 text-sm leading-relaxed line-clamp-2 font-light mb-5">
                        {service.description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-white text-xs font-semibold uppercase tracking-[0.14em] border-t border-white/15 pt-4 transition-colors duration-300 group-hover:text-dpe-green">
                        <span>{ts('services.learnMore')}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── editorial close, brand accent on word */}
      <section className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-end"
          >
            <div>
              <motion.div variants={itemVariants}>
                <SectionKicker align="left" tone="green">
                  Ready when you are
                </SectionKicker>
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl text-slate-950 mb-6 tracking-[-0.025em] leading-[1.02]"
              >
                {ts('services.hub.ctaTitle1')} <span className="text-dpe-green">{ts('services.hub.ctaTitle2')}</span>
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg text-slate-500 font-light leading-relaxed mb-9 max-w-xl"
              >
                {ts('services.hub.ctaSubtitle')}
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-slate-950 text-white text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors"
                >
                  {ts('services.hub.ctaButton')}
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
                  href="/benefits"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-300 text-slate-700 text-sm font-medium hover:border-slate-950 hover:text-slate-950 transition-colors"
                >
                  See coverage benefits
                </Link>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="border-l border-slate-200 pl-8 py-2 lg:py-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
                Speak with a specialist
              </p>
              <a
                href="tel:+18883510782"
                className="text-3xl lg:text-4xl font-bold text-slate-950 hover:text-dpe-green transition-colors tracking-[-0.02em]"
              >
                (888) 351-0782
              </a>
              <p className="text-sm text-slate-500 font-light mt-3 leading-relaxed">
                Nationwide auto financing — no obligations, no fees.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
