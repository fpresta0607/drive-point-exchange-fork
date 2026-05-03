'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../lib/i18n/context';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { ts } = useI18n();

  const footerLinks = {
    services: [
      { name: ts('home.services.autoRefinance.title'), href: '/services/auto-refinance' },
      { name: ts('home.services.vehicleCoverage.title'), href: '/services/vehicle-coverage' },
      { name: ts('home.services.homeRefinance.title'), href: '/services/home-refinance' },
      { name: ts('home.services.insuranceConsultation.title'), href: '/services/auto-insurance' },
      { name: 'Life Insurance', href: '/services/life-insurance' },
      { name: 'Credit Consultations', href: '/services/credit-consultations' }
    ],
    calculators: [
      { name: ts('navigation.autoLoanCalculator'), href: '/calculator?type=auto' },
      { name: ts('navigation.homeLoanCalculator'), href: '/calculator?type=home' }
    ],
    company: [
      { name: ts('navigation.benefits'), href: '/benefits' },
      { name: ts('navigation.contact'), href: '/contact' },
      { name: ts('footer.termsOfService'), href: '/terms' }
    ]
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white border-t border-white/[0.08]">
      {/* Decorative top edge - subtle navy glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-dpe-blue/30 to-transparent" />

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 lg:justify-between lg:items-center">
          {/* Company Info */}
          <div className="flex flex-row items-center gap-8 shrink-0">
            <Link href="/" className="inline-flex items-center shrink-0">
              <Image
                src="/logo-no-bg-inverted.webp"
                alt="Drive Point Exchange Logo"
                width={300}
                height={110}
                className="h-24 w-auto"
                loading="lazy"
              />
            </Link>
            <div>
              <p className="text-slate-300 mb-4 leading-relaxed text-[15px] max-w-xs">
                {ts('footer.description')}
              </p>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1.5 h-1.5 bg-dpe-blue rounded-full animate-pulse" />
                <span className="text-sm text-slate-400">{ts('footer.nationwideCoverage')}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-10 lg:gap-16">
            {/* Services */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-5">
                {ts('footer.ourServices')}
              </h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-slate-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Calculators */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-5">
                {ts('footer.calculators')}
              </h3>
              <ul className="space-y-3">
                {footerLinks.calculators.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-slate-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-5">
                {ts('footer.company')}
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-slate-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-slate-500 text-sm">
              © {currentYear} Drive Point Exchange. {ts('footer.copyright')}
            </p>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <Link href="/terms" className="hover:text-slate-300 transition-colors duration-200">
                {ts('footer.termsOfService')}
              </Link>
              <Link href="/privacy" className="hover:text-slate-300 transition-colors duration-200">
                {ts('footer.privacyPolicy')}
              </Link>
              <Link href="/privacy#do-not-sell" className="hover:text-slate-300 transition-colors duration-200">
                {ts('footer.doNotSell')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
