'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useI18n } from '../../lib/i18n/context';
import { revokeConsent, getConsent } from '@/lib/consent';

interface PrivacySection {
  title: string;
  content: string;
}

function CcpaOptOutButton() {
  const [isOptedOut, setIsOptedOut] = useState(() => {
    if (typeof window === 'undefined') return false;
    const consent = getConsent();
    return consent !== null && !consent.marketing && !consent.functional;
  });

  const handleOptOut = () => {
    revokeConsent();
    setIsOptedOut(true);
    window.location.reload();
  };

  if (isOptedOut) {
    return (
      <div role="alert" className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
        Your opt-out preference has been saved. Marketing and tracking cookies have been disabled on this device.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOptOut}
      className="mt-4 px-6 py-3 bg-slate-950 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
    >
      Opt Out of Data Sharing
    </button>
  );
}

export default function PrivacyPage() {
  const prefersReducedMotion = useReducedMotion();
  const { t, ts } = useI18n();

  const fadeInUp = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  const staggerChildren = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.05 } } };
  const privacySections = (t('privacy.sections') as PrivacySection[]).map((section: PrivacySection, index: number) => ({
    ...section,
    id: index + 1
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-[#1A2158] py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              {ts('privacy.hero.title')}
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-blue-100 max-w-2xl mx-auto"
            >
              {ts('privacy.hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-8"
          >
            {privacySections.map((section) => (
              <motion.div
                key={section.id}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{section.id}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-blue-600 to-[#1A2158] rounded-2xl p-8 text-white"
            >
              <h2 className="text-3xl font-bold mb-4">{ts('privacy.contact.title')}</h2>
              <p className="text-xl mb-6">
                {ts('privacy.contact.subtitle')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="font-semibold">{ts('privacy.contact.email')}</p>
                  <a href="mailto:support@drivepointexchange.com" className="text-blue-100 hover:text-white transition-colors">support@drivepointexchange.com</a>
                </div>
                <div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <p className="font-semibold">{ts('privacy.contact.phone')}</p>
                  <a href="tel:+18883510782" className="text-blue-100 hover:text-white transition-colors">(888) 351-0782</a>
                </div>
                <div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <p className="font-semibold">{ts('privacy.contact.website')}</p>
                  <p className="text-blue-100">www.drivepointexchange.com</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CCPA Do Not Sell Section */}
      <section id="do-not-sell" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-bold text-gray-900 mb-4"
            >
              Do Not Sell or Share My Personal Information
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Under the California Consumer Privacy Act (CCPA/CPRA) and similar state privacy laws,
                you have the right to opt out of the sale or sharing of your personal information.
                We use certain tracking technologies (such as advertising pixels and social media
                integrations) that may constitute a &quot;sale&quot; or &quot;sharing&quot; of personal
                information under these laws.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By clicking the button below, we will disable all non-essential tracking and marketing
                cookies on this device. You can also contact us at{' '}
                <a href="mailto:support@drivepointexchange.com" className="text-blue-600 hover:underline">
                  support@drivepointexchange.com
                </a>{' '}
                or call{' '}
                <a href="tel:+18883510782" className="text-blue-600 hover:underline">
                  (888) 351-0782
                </a>{' '}
                to submit a privacy rights request.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We will not discriminate against you for exercising your privacy rights.
              </p>
              <CcpaOptOutButton />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Last Updated Section */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-600"
          >
            {ts('privacy.lastUpdated')} {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </motion.p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
