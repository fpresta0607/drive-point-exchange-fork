'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { SparksCarousel, SparkItem } from '../../components/ui/sparks-carousel';
import { ShieldCheck } from 'lucide-react';
import { CTAButton } from '../../components/ui/cta-button';
import ShaderBackground from '../../components/ui/shader-background';

interface BenefitItem {
  title: string;
  description: string;
  features: string[];
}

export default function Benefits() {
  const { t, ts } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.1 } } };

  const itemVariants = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

  const benefitsRaw = (t('benefits.benefits') as BenefitItem[]);
  
  // Map benefits into the SparkItem format required by SparksCarousel
  const carouselItems: SparkItem[] = benefitsRaw.map((benefit, index) => ({
    id: index,
    title: benefit.title,
    count: benefit.features.length,
    countLabel: ts('benefits.section.countLabel'),
    description: benefit.description,
    features: benefit.features,
    imageSrc: [
      "/auto/benefit-roadside.jpg",
      "/auto/benefit-road-hazard.jpg",
      "/auto/benefit-rental.jpg",
      "/auto/benefit-trip.jpg",
      "/auto/benefit-maintenance.jpg",
      "/auto/benefit-extended.jpg"
    ][index] || "/auto/benefit-extended.jpg"
  }));

  return (
    <div className="min-h-screen relative selection:bg-dpe-blue/30 selection:text-white">
      <ShaderBackground />
      <Navigation overlay />
      
      {/* ─── PREMIUM HERO SECTION ─── */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center pt-28">
        {/* Abstract Dark Glowing Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 -left-1/4 w-[700px] h-[700px] rounded-full bg-dpe-blue/20 blur-[150px] mix-blend-screen"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-[130px] mix-blend-screen"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
          <motion.div initial="initial" animate="animate" variants={containerVariants} className="max-w-4xl">

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl text-white mb-8 leading-[0.95]">
              {ts('benefits.hero.titleLine1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-indigo-400">
                {ts('benefits.hero.titleLine2')}
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              {ts('benefits.hero.subtitle')}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/contact" showArrow variant="hero">
                {ts('benefits.hero.getCoverage')}
              </CTAButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── INTRO SECTION ─── */}
      <section className="py-24 relative z-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl text-white mb-6">
              {ts('benefits.intro.title')}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
              {ts('benefits.intro.description')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── BENEFITS CAROUSEL ─── */}
      <section className="py-20 relative z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mb-8"
          >
             <SparksCarousel
                title={ts('benefits.section.title')}
                subtitle={ts('benefits.section.subtitle')}
                items={carouselItems}
             />
          </motion.div>
        </div>
      </section>

      {/* ─── IMMERSIVE CTA ─── */}
      <section className="relative py-32 overflow-hidden border-t border-white/5">
         <div className="absolute inset-0">
             <div className="absolute inset-0 bg-[url('/auto/car-hero.jpg')] bg-cover bg-center opacity-[0.1] mix-blend-luminosity" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#020720]/50 via-transparent to-[#020720]/50" />
         </div>
         
         <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl text-white mb-6">
                 {ts('benefits.cta.title')}
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                {ts('benefits.cta.subtitle')}
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex justify-center gap-6 flex-col sm:flex-row">
                <CTAButton href="/contact" size="lg" variant="hero">
                  {ts('benefits.cta.getCoverage')}
                </CTAButton>

                <CTAButton href="/services" variant="secondary" size="lg">
                  {ts('benefits.cta.learnMore')}
                </CTAButton>
              </motion.div>
            </motion.div>
         </div>
      </section>
      
      <Footer />
    </div>
  );
}