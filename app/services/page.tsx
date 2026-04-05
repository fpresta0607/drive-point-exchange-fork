'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { NebulaBg } from '../../components/ui/nebula-bg';
import { ArrowUpRight, Sparkles, Shield, TrendingUp, HandCoins, Activity, Landmark } from 'lucide-react';

export default function ServicesHub() {
  const { ts } = useI18n();
  const prefersReducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerVariants = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.1 } } };

  const itemVariants = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

  const servicesList = [
    {
      title: ts('home.services.autoRefinance.title'),
      description: ts('home.services.autoRefinance.description'),
      icon: <Activity className="w-8 h-8 md:w-12 md:h-12 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200",
      href: "/services/auto-refinance",
      category: ts('services.hub.categories.autoRefinance'),
      accent: "from-emerald-500 to-teal-700",
    },
    {
      title: ts('home.services.vehicleCoverage.title'),
      description: ts('home.services.vehicleCoverage.description'),
      icon: <Shield className="w-8 h-8 md:w-12 md:h-12 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=1200",
      href: "/services/vehicle-coverage",
      category: ts('services.hub.categories.coverage'),
      accent: "from-blue-500 to-indigo-700",
    },
    {
      title: ts('home.services.homeRefinance.title'),
      description: ts('home.services.homeRefinance.description'),
      icon: <Landmark className="w-8 h-8 md:w-12 md:h-12 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      href: "/services/home-refinance",
      category: ts('services.hub.categories.homeLoans'),
      accent: "from-purple-500 to-fuchsia-700",
    },
    {
      title: ts('home.services.insuranceConsultation.title'),
      description: ts('home.services.insuranceConsultation.description'),
      icon: <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
      href: "/services/auto-insurance",
      category: ts('services.hub.categories.consulting'),
      accent: "from-amber-500 to-orange-700",
    },
    {
      title: ts('home.services.lifeInsurance.title'),
      description: ts('home.services.lifeInsurance.description'),
      icon: <HandCoins className="w-8 h-8 md:w-12 md:h-12 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=1200",
      href: "/services/life-insurance",
      category: ts('services.hub.categories.consulting'),
      accent: "from-rose-500 to-red-700",
    },
    {
      title: ts('home.services.creditSavings.title'),
      description: ts('home.services.creditSavings.description'),
      icon: <TrendingUp className="w-8 h-8 md:w-12 md:h-12 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
      href: "/services/credit-consultations",
      category: ts('services.hub.categories.financial'),
      accent: "from-cyan-500 to-blue-700",
    }
  ];

  return (
    <div className="min-h-screen bg-[#020813] selection:bg-dpe-green/30 selection:text-white">
      <Navigation overlay />
      
      {/* ─── PREMIUM HERO SECTION ─── */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-white/5">
        {/* Nebula Shader Background */}
        <NebulaBg />

        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[5]" style={{ background: 'linear-gradient(to bottom, transparent, #020813)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center mt-20">
          <motion.div initial="initial" animate="animate" variants={containerVariants} className="max-w-4xl">

            <motion.h1 variants={itemVariants} className="text-6xl sm:text-7xl md:text-[8rem] text-white mb-8 leading-[0.92]">
              {ts('services.hub.heroTitle1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                {ts('services.hub.heroTitle2')}
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              {ts('services.hub.heroSubtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── DYNAMIC BENTO ARCHITECTURE ─── */}
      <section className="py-32 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {servicesList.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group w-full h-[400px] relative rounded-[2rem] overflow-hidden"
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                {/* Background Image that fades in on hover */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
                  />
                  {/* Glassmorphism Dark Overlay */}
                  <div className="absolute inset-0 bg-[#050b14]/85 group-hover:bg-black/50 transition-colors duration-700 backdrop-blur-[2px] group-hover:backdrop-blur-0" />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-40 bg-gradient-to-tr ${service.accent} mix-blend-overlay transition-opacity duration-700`} />
                </div>

                {/* Content Container */}
                <div className="relative h-full flex flex-col p-8 md:p-10 z-10 border border-white/5 rounded-[2rem] group-hover:border-white/20 transition-colors duration-500">
                  {/* Header row with Icon and Label */}
                  <div className="flex justify-between items-start mb-auto">
                    <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:bg-white/20 transition-colors duration-500 group-hover:-translate-y-1 transform">
                      {service.icon}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/50 group-hover:text-white/90 transition-colors bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {service.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <h3 className="text-2xl md:text-3xl text-white mb-4 drop-shadow-md">
                      {service.title}
                    </h3>
                    <AnimatePresence>
                      <motion.p 
                        initial={{ opacity: 0.6, height: 'auto' }}
                        animate={{ opacity: hoveredIndex === index ? 1 : 0.6 }}
                        className="text-gray-300/80 text-sm sm:text-base leading-relaxed line-clamp-2 md:line-clamp-3 group-hover:text-white"
                      >
                        {service.description}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── IMMERSIVE CTA ─── */}
      <section className="relative py-32 overflow-hidden border-t border-white/5">
         <div className="absolute inset-0 bg-[#020813]">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502877338535-34b1591b7300?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-[0.15] mix-blend-luminosity" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#020813] via-transparent to-[#020813]" />
         </div>
         
         <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl text-white mb-6">
                {ts('services.hub.ctaTitle1')} <span className="text-dpe-green">{ts('services.hub.ctaTitle2')}</span>
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                {ts('services.hub.ctaSubtitle')}
              </motion.p>

              <motion.div variants={itemVariants} className="flex justify-center">
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-4 bg-white text-black font-semibold py-5 px-10 rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-dpe-green translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                  <span className="relative z-10 text-overline group-hover:text-white transition-colors duration-500">
                    {ts('services.hub.ctaButton')}
                  </span>
                  <div className="relative z-10 w-10 h-10 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
                    <ArrowUpRight className="w-5 h-5 group-hover:text-white transition-colors duration-500" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
         </div>
      </section>
      
      <Footer />
    </div>
  );
}