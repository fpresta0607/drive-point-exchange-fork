'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import ShaderBackground from './ui/shader-background';
import { CTAButton } from './ui/cta-button';

interface ServiceLayoutProps {
  title: string;
  description: string | string[];
  features: string[];
  imageSrc: string;
}

export default function ServiceLayout({ title, description, features, imageSrc }: ServiceLayoutProps) {
  const prefersReducedMotion = useReducedMotion();

  const fadeIn = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  const stagger = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.08 } } };

  const descriptions = Array.isArray(description) ? description : [description];

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <ShaderBackground />
      <Navigation overlay />

      {/* Centered layout */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 pt-24">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="w-full max-w-5xl bg-white rounded-2xl border border-dpe-green/30 shadow-2xl p-8 md:p-10"
          style={{ boxShadow: '0 0 60px 10px rgba(45, 184, 67, 0.25), 0 0 120px 20px rgba(45, 184, 67, 0.1)' }}
        >
          {/* Title */}
          <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl text-dpe-blue-800 mb-6">
            {title}
          </motion.h1>

          {/* Two-column body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: description */}
            <div>
              <motion.h2 variants={fadeIn} className="text-sm font-semibold uppercase tracking-widest text-dpe-green mb-3">
                Overview
              </motion.h2>
              <div className="space-y-3">
                {descriptions.map((paragraph, idx) => (
                  <motion.p key={idx} variants={fadeIn} className="text-base text-dpe-blue-800 leading-relaxed">
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Right: features + buttons */}
            <div className="flex flex-col">
              {imageSrc && (
                <motion.div variants={fadeIn} className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
                  <Image src={imageSrc} alt={title} fill className="object-cover" />
                </motion.div>
              )}
              <motion.h2 variants={fadeIn} className="text-sm font-semibold uppercase tracking-widest text-dpe-green mb-3">
                Key Benefits
              </motion.h2>
              <motion.div variants={fadeIn} className="grid grid-cols-1 gap-2 mb-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-dpe-green" />
                    <span className="text-base text-dpe-blue-800 font-medium">{feature}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeIn} className="flex mt-auto pt-4 border-t border-dpe-blue-800/10">
                <CTAButton href="/contact" variant="primary-dark" size="lg">
                  Contact Us
                </CTAButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
