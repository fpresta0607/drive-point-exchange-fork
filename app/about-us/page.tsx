'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';

export default function AboutUs() {
  const prefersReducedMotion = useReducedMotion();
  const { ts } = useI18n();

  const fadeInUp = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  const fadeInLeft = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, x: -24 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 } };

  const fadeInRight = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 } };

  const staggerChildren = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.05 } } };
  
  const values = [
    {
      title: ts('about.values.transparency.title'),
      description: ts('about.values.transparency.description')
    },
    {
      title: ts('about.values.speed.title'),
      description: ts('about.values.speed.description')
    },
    {
      title: ts('about.values.partnership.title'),
      description: ts('about.values.partnership.description')
    },
    {
      title: ts('about.values.excellence.title'),
      description: ts('about.values.excellence.description')
    }
  ];

  const team = [
    {
      name: "Michael Rodriguez",
      title: ts('about.team.michael.title'),
      description: ts('about.team.michael.description')
    },
    {
      name: "Sarah Johnson", 
      title: ts('about.team.sarah.title'),
      description: ts('about.team.sarah.description')
    },
    {
      name: "David Chen",
      title: ts('about.team.david.title'),
      description: ts('about.team.david.description')
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation overlay />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/auto/car-loan4.jpg"
            alt="Professional team meeting"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 md:pt-0">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            >
              {ts('about.hero.title')}
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto"
            >
              {ts('about.hero.subtitle')}
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/calculator"
                className="bg-slate-950 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {ts('about.hero.getQuote')}
              </Link>
              <Link
                href="/contact"
                className="bg-slate-950 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {ts('about.hero.contactTeam')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInLeft}>
              <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-white shadow-lg shadow-blue-500/5 flex items-center justify-center p-12">
                <div className="text-center space-y-8">
                  <h3 className="text-2xl font-bold text-gray-900">{ts('about.trusted')}</h3>
                  <p className="text-gray-600 text-lg">{ts('about.mission.description')}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInRight}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 ">{ts('about.mission.title')}</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {ts('about.mission.description')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {ts('about.mission.description2')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 ">
              {ts('about.story.title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600">
              {ts('about.story.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInLeft}>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg leading-relaxed">
                  {ts('about.story.paragraph1')}
                </p>
                <p className="text-lg leading-relaxed">
                  {ts('about.story.paragraph2')}
                </p>
                <p className="text-lg leading-relaxed">
                  {ts('about.story.paragraph3')}
                </p>
              </div>
            </motion.div>
          
            <motion.div variants={fadeInRight}>
          <div className="bg-dpe-navy rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">{ts('about.statistics.title')}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="opacity-90">{ts('about.statistics.customersServed')}</span>
                <span className="text-2xl font-bold">10,000+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-90">{ts('about.statistics.yearsInBusiness')}</span>
                <span className="text-2xl font-bold">12+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-90">{ts('about.statistics.averageSavings')}</span>
                <span className="text-2xl font-bold">$2,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-90">{ts('about.statistics.customerSatisfaction')}</span>
                <span className="text-2xl font-bold">98%</span>
              </div>
            </div>
          </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

        {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 ">
              {ts('about.values.title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600">
              {ts('about.values.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
              </p>
            </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

        {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 ">
              {ts('about.team.title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600">
              {ts('about.team.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-dpe-blue mb-3 font-medium">
                    {member.title}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
              </p>
            </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

        {/* CTA Section */}
      <section className="py-20 bg-dpe-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-6 ">
              {ts('about.cta.title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-blue-100 mb-8">
              {ts('about.cta.subtitle')}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/calculator"
                className="bg-white text-slate-950 hover:bg-slate-100 hover:text-slate-950 font-semibold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {ts('about.cta.getQuote')}
              </Link>
              <Link
                href="/contact"
                className="bg-slate-950 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {ts('about.cta.contactTeam')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}