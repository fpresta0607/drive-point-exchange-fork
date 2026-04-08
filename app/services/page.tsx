'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { NebulaBg } from '../../components/ui/nebula-bg';
import { Sparkles, Shield, TrendingUp, HandCoins, Activity, Landmark, ArrowUpRight } from 'lucide-react';
import { CTAButton } from '../../components/ui/cta-button';
import Link from 'next/link';

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
      icon: <Activity className="w-6 h-6 md:w-8 md:h-8 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "/auto/car-loan.jpg",
      href: "/services/auto-refinance",
      category: ts('services.hub.categories.autoRefinance'),
      accent: "from-emerald-500 to-teal-700",
    },
    {
      title: ts('home.services.vehicleCoverage.title'),
      description: ts('home.services.vehicleCoverage.description'),
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "/auto/porsche-garage.jpg",
      href: "/services/vehicle-coverage",
      category: ts('services.hub.categories.coverage'),
      accent: "from-blue-500 to-indigo-700",
    },
    {
      title: ts('home.services.homeRefinance.title'),
      description: ts('home.services.homeRefinance.description'),
      icon: <Landmark className="w-6 h-6 md:w-8 md:h-8 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "/auto/svc-home-refinance.jpg",
      href: "/services/home-refinance",
      category: ts('services.hub.categories.homeLoans'),
      accent: "from-purple-500 to-fuchsia-700",
    },
    {
      title: ts('home.services.insuranceConsultation.title'),
      description: ts('home.services.insuranceConsultation.description'),
      icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "/auto/svc-auto-insurance.jpg",
      href: "/services/auto-insurance",
      category: ts('services.hub.categories.consulting'),
      accent: "from-amber-500 to-orange-700",
    },
    {
      title: ts('home.services.lifeInsurance.title'),
      description: ts('home.services.lifeInsurance.description'),
      icon: <HandCoins className="w-6 h-6 md:w-8 md:h-8 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "/auto/svc-life-insurance.jpg",
      href: "/services/life-insurance",
      category: ts('services.hub.categories.consulting'),
      accent: "from-rose-500 to-red-700",
    },
    {
      title: ts('home.services.creditSavings.title'),
      description: ts('home.services.creditSavings.description'),
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-dpe-green group-hover:text-white transition-colors duration-500" />,
      image: "/auto/car-loan3.jpg",
      href: "/services/credit-consultations",
      category: ts('services.hub.categories.financial'),
      accent: "from-cyan-500 to-blue-700",
    }
  ];

  return (
    <div className="min-h-screen bg-[#020720] selection:bg-dpe-green/30 selection:text-white">
      <Navigation overlay />
      
      {/* ─── PREMIUM HERO SECTION ─── */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Nebula Shader Background */}
        <NebulaBg />

        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[5]" style={{ background: 'linear-gradient(to bottom, transparent, #020720)' }} />

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
              >
                <Link
                  href={service.href}
                  className="group block w-full h-[400px] relative rounded-[2rem] overflow-hidden border border-white/[0.08] hover:border-white/20 transition-colors duration-500"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
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
                    <div className="absolute inset-0 bg-[#050928]/85 group-hover:bg-black/50 transition-colors duration-700 backdrop-blur-[2px] group-hover:backdrop-blur-0" />
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-40 bg-gradient-to-tr ${service.accent} mix-blend-overlay transition-opacity duration-700`} />
                  </div>

                  {/* Content Container */}
                  <div className="relative h-full flex flex-col justify-between p-7 md:p-8 z-10">
                    {/* Header row with Icon and Label */}
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:bg-white/20 transition-colors duration-500 group-hover:-translate-y-1 transform">
                        {service.icon}
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/50 group-hover:text-white/90 transition-colors bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {service.category}
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      <h3 className="text-2xl md:text-3xl text-white mb-3 drop-shadow-md">
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
                      <div className="flex items-center gap-2 mt-4 text-white/40 group-hover:text-white/80 transition-colors duration-500">
                        <span className="tracking-wide uppercase text-xs font-medium">{ts('services.learnMore')}</span>
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── IMMERSIVE CTA ─── */}
      <section className="relative py-32 overflow-hidden border-t border-white/5">
         <div className="absolute inset-0 bg-[#020720]">
             <div className="absolute inset-0 bg-[url('/auto/car-hero.jpg')] bg-cover bg-center opacity-[0.15] mix-blend-luminosity" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#020720] via-transparent to-[#020720]" />
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
                <CTAButton href="/contact" size="lg" showArrow variant="hero">
                  {ts('services.hub.ctaButton')}
                </CTAButton>
              </motion.div>
            </motion.div>
         </div>
      </section>
      
      <Footer />
    </div>
  );
}