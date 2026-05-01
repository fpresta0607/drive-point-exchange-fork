'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import dynamic from 'next/dynamic';

const ShaderBackground = dynamic(() => import('./ui/shader-background'), { ssr: false });

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
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  const stagger = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.04 } } };

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
          className="w-full max-w-5xl bg-white border border-slate-200 shadow-2xl p-8 md:p-10"
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
                <motion.div variants={fadeIn} className="relative h-48 w-full overflow-hidden mb-4 border border-slate-200">
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

              <motion.div variants={fadeIn} className="flex mt-auto pt-4 border-t border-slate-200">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-slate-950 text-white text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors"
                >
                  Contact Us
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
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
