'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { SparksCarousel, SparkItem } from '../../components/ui/sparks-carousel';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
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
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center pt-44 border-b border-white/5">
        {/* Abstract Dark Glowing Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-[1]" />
          
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

            <motion.h1 variants={itemVariants} className="text-6xl sm:text-7xl md:text-[8rem] text-white mb-8 leading-[0.92]">
              {ts('benefits.hero.titleLine1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-indigo-400">
                {ts('benefits.hero.titleLine2')}
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              {ts('benefits.hero.subtitle')}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-4 bg-white text-black font-semibold py-4 px-8 rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-dpe-blue translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <span className="relative z-10 text-overline group-hover:text-white transition-colors duration-500">
                  {ts('benefits.hero.getCoverage')}
                </span>
                <div className="relative z-10 w-8 h-8 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
                  <ArrowUpRight className="w-4 h-4 group-hover:text-white transition-colors duration-500" />
                </div>
              </Link>
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
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-[0.1] mix-blend-luminosity" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#020813]/50 via-transparent to-[#020813]/50" />
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
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center gap-4 bg-white text-black font-semibold py-5 px-10 rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-dpe-blue translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                  <span className="relative z-10 text-overline group-hover:text-white transition-colors duration-500">
                    {ts('benefits.cta.getCoverage')}
                  </span>
                </Link>

                <Link
                  href="/services"
                  className="group relative inline-flex items-center justify-center gap-4 bg-white/5 border border-white/10 text-white font-semibold py-5 px-10 rounded-full overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                >
                  <span className="relative z-10 text-overline transition-colors duration-500">
                    {ts('benefits.cta.learnMore')}
                  </span>
                </Link>
              </motion.div>
            </motion.div>
         </div>
      </section>
      
      <Footer />
    </div>
  );
}