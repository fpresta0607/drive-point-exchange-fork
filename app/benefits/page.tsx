'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { SectionKicker } from '../../components/ui/section-kicker';

interface BenefitItem {
  title: string;
  description: string;
  features: string[];
}

const BENEFIT_IMAGES = [
  '/auto/benefit-roadside.webp',
  '/auto/benefit-road-hazard.webp',
  '/auto/benefit-rental.webp',
  '/auto/benefit-trip.webp',
  '/auto/benefit-maintenance.webp',
  '/auto/benefit-extended.webp',
];

export default function Benefits() {
  const { t, ts } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.05 } } };

  const itemVariants = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  const benefits = t('benefits.benefits') as BenefitItem[];

  return (
    <div className="min-h-screen bg-white selection:bg-dpe-blue/30 selection:text-white">
      <Navigation overlay />

      {/* ─── HERO ─── editorial dark, sharp */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden pt-32 pb-20 bg-slate-950">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/auto/hero-benefits-page.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/85" />
          <div className="absolute top-1/3 left-[-10%] w-[640px] h-[640px] bg-dpe-blue/15 rounded-full blur-[160px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-dpe-green/12 rounded-full blur-[140px] mix-blend-screen" />
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
                Vehicle coverage benefits
              </SectionKicker>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] text-white font-bold tracking-[-0.03em] leading-[0.98] mb-7"
            >
              {ts('benefits.hero.titleLine1')}<br />
              <span className="text-white">{ts('benefits.hero.titleLine2')}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/65 font-light max-w-xl leading-relaxed mb-10"
            >
              {ts('benefits.hero.subtitle')}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-slate-950 text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors"
              >
                {ts('benefits.hero.getCoverage')}
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
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white text-sm font-medium hover:bg-white/[0.04] hover:border-white/30 transition-colors"
              >
                Explore services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── INTRO ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <SectionKicker align="left" tone="green">
                Why coverage matters
              </SectionKicker>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl text-slate-950 mb-6 tracking-[-0.025em] leading-[1.02]"
            >
              {ts('benefits.intro.title')}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl"
            >
              {ts('benefits.intro.description')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── BENEFITS LIST ─── alternating image/text rows, sharp */}
      <section className="bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="px-4 sm:px-6 lg:px-8 pt-24 pb-10"
          >
            <motion.div variants={itemVariants}>
              <SectionKicker align="left" tone="green">
                Coverage benefits
              </SectionKicker>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl text-slate-950 tracking-[-0.025em] leading-[1.02] max-w-3xl"
            >
              {ts('benefits.section.title')}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-500 font-light mt-5 max-w-2xl leading-relaxed"
            >
              {ts('benefits.section.subtitle')}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200">
            {benefits.map((benefit, index) => {
              const image = BENEFIT_IMAGES[index] ?? BENEFIT_IMAGES[0];
              return (
                <motion.article
                  key={benefit.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: (index % 2) * 0.05 }}
                  className="bg-white p-8 md:p-10 flex flex-col gap-6"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden border border-slate-200/70">
                    <Image
                      src={image}
                      alt={benefit.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-slate-950/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                      <span aria-hidden className="block w-0.5 h-3 bg-dpe-green" />
                      Benefit {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl text-slate-950 font-bold tracking-[-0.02em] leading-[1.05] mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-500 text-base font-light leading-relaxed mb-6">
                      {benefit.description}
                    </p>

                    <div className="border-t border-slate-200 pt-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-3">
                        {benefit.features.length} {ts('benefits.section.countLabel')}
                      </p>
                      <ul className="grid grid-cols-1 gap-2">
                        {benefit.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                            <span aria-hidden className="mt-1.5 flex-shrink-0 w-3 h-px bg-dpe-green" />
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-16" />
        </div>
      </section>

      {/* ─── CTA ─── editorial close */}
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
                  Get protected
                </SectionKicker>
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl text-slate-950 mb-6 tracking-[-0.025em] leading-[1.02]"
              >
                {ts('benefits.cta.title')}
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg text-slate-500 font-light leading-relaxed mb-9 max-w-xl"
              >
                {ts('benefits.cta.subtitle')}
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-slate-950 text-white text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors"
                >
                  {ts('benefits.cta.getCoverage')}
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
                  {ts('benefits.cta.learnMore')}
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
                Nationwide vehicle coverage — no obligations, no fees.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
