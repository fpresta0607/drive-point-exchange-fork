'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
} from 'framer-motion';
import { useI18n } from '../lib/i18n/context';
import { NavHeader } from './ui/nav-header';

export default function Navigation({ overlay = false }: { overlay?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(!overlay);
  const { ts, language, setLanguage, languages } = useI18n();
  const pathname = usePathname();

  const servicesRef = useRef<HTMLElement>(null);
  const calculatorRef = useRef<HTMLElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const bgOpacity = useTransform(
    scrollY,
    [0, 80],
    overlay ? [0, 0.95] : [0.95, 0.95]
  );
  const blurPx = useTransform(
    scrollY,
    [0, 80],
    overlay ? [0, 16] : [16, 16]
  );
  const shadowAlpha = useTransform(
    scrollY,
    [0, 80],
    overlay ? [0, 0.06] : [0.06, 0.06]
  );
  const lightLogoOpacity = useTransform(
    scrollY,
    [0, 80],
    overlay ? [1, 0] : [0, 0]
  );
  const darkLogoOpacity = useTransform(
    scrollY,
    [0, 80],
    overlay ? [0, 1] : [1, 1]
  );

  const backgroundColor = useMotionTemplate`rgba(255, 255, 255, ${bgOpacity})`;
  const backdropFilter = useMotionTemplate`blur(${blurPx}px)`;
  const boxShadow = useMotionTemplate`0 1px 8px rgba(0, 0, 0, ${shadowAlpha})`;

  // Boolean for child link color switching — driven by the same motion value, flips at midpoint
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!overlay) return;
    const next = latest > 40;
    if (next !== isScrolled) setIsScrolled(next);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (calculatorRef.current && !calculatorRef.current.contains(event.target as Node)) {
        setIsCalculatorOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent, closeFn: () => void) => {
    if (e.key === 'Escape') {
      closeFn();
    }
  }, []);

  const isTransparent = overlay && !isScrolled;

  const navItems = [
    { href: '/', label: ts('navigation.home') },
    { href: '/benefits', label: ts('navigation.benefits') },
    { href: '/contact', label: ts('navigation.contact') },
  ];

  const serviceItems = [
    { href: '/services', label: 'All Services' },
    { href: '/services/auto-refinance', label: ts('home.services.autoRefinance.title') },
    { href: '/services/vehicle-coverage', label: ts('home.services.vehicleCoverage.title') },
    { href: '/services/home-refinance', label: ts('home.services.homeRefinance.title') },
    { href: '/services/auto-insurance', label: ts('home.services.insuranceConsultation.title') },
    { href: '/services/life-insurance', label: ts('home.services.lifeInsurance.title') },
    { href: '/services/credit-consultations', label: ts('home.services.creditSavings.title') }
  ];

  const calculatorItems = [
    { href: '/calculator?type=auto', label: ts('navigation.autoLoanCalculator') },
    { href: '/calculator?type=home', label: ts('navigation.homeLoanCalculator') },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <motion.nav
      style={{
        backgroundColor,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter as unknown as string,
        boxShadow,
        willChange: 'background-color, backdrop-filter',
      }}
      className={`${overlay ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          {/* Logo — two stacked images cross-fading via motion values */}
          <div className="flex-shrink-0 relative">
            <Link href="/" className="relative flex items-center" aria-label="Drive Point Exchange home">
              <div className="relative h-20 w-[200px]">
                <motion.div style={{ opacity: lightLogoOpacity }} className="absolute inset-0">
                  <Image
                    src="/logo-no bg-inverted.png"
                    alt="Drive Point Exchange"
                    fill
                    sizes="200px"
                    className="object-contain object-left"
                    priority
                  />
                </motion.div>
                <motion.div style={{ opacity: darkLogoOpacity }} className="absolute inset-0">
                  <div className="absolute inset-0 bg-slate-950 logo-mask-dark" aria-hidden />
                </motion.div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <NavHeader
              isTransparent={isTransparent}
              tabs={[
                {
                  label: ts('navigation.home'),
                  href: '/',
                  isActive: pathname === '/',
                },
                {
                  label: ts('navigation.services'),
                  isDropdown: true,
                  onClick: () => setIsServicesOpen(!isServicesOpen),
                  isActive: pathname.startsWith('/services'),
                  wrapperRef: servicesRef as React.RefObject<HTMLLIElement | null>,
                  dropdownContent: isServicesOpen ? (
                    <div className="w-60 bg-white shadow-lg py-1 border border-gray-200">
                      {serviceItems.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-slate-900 hover:text-white transition-colors ${index === 0 ? 'font-bold border-b border-gray-100 pb-2 mb-1' : ''}`}
                          onClick={() => setIsServicesOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : undefined,
                },
                {
                  label: ts('navigation.benefits'),
                  href: '/benefits',
                  isActive: pathname === '/benefits',
                },
                {
                  label: ts('navigation.contact'),
                  href: '/contact',
                  isActive: pathname === '/contact',
                },
                {
                  label: ts('navigation.calculators'),
                  isDropdown: true,
                  onClick: () => setIsCalculatorOpen(!isCalculatorOpen),
                  isActive: pathname === '/calculator',
                  wrapperRef: calculatorRef as React.RefObject<HTMLLIElement | null>,
                  dropdownContent: isCalculatorOpen ? (
                    <div className="w-48 bg-white shadow-lg py-1 border border-gray-200">
                      {calculatorItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-900 hover:text-white transition-colors"
                          onClick={() => setIsCalculatorOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : undefined,
                },
              ]}
            />
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center flex-shrink-0 space-x-2">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                onKeyDown={(e) => handleDropdownKeyDown(e, () => setIsLanguageOpen(false))}
                aria-expanded={isLanguageOpen}
                aria-haspopup="true"
                className={`${isTransparent ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'} px-3 py-2 text-sm font-medium transition-colors flex items-center`}
              >
                <span className="mr-2">{currentLanguage?.flag}</span>
                <span className="hidden sm:inline">{currentLanguage?.nativeName}</span>
                <svg className="ml-1 h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg py-1 z-50 border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center ${language === lang.code
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <span className="mr-3">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      {language === lang.code && (
                        <svg className="ml-auto h-4 w-4 text-slate-900" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-center gap-1">
              <a
                href="tel:+18883510782"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all ${
                  isTransparent
                    ? 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-label="Call (888) 351-0782"
              >
                <svg className="h-3.5 w-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden lg:inline">(888) 351-0782</span>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 ml-auto">
            <a
              href="tel:+18883510782"
              className={`flex items-center justify-center p-2.5 border transition-colors ${
                isTransparent
                  ? 'text-white border-white/20 hover:bg-white/[0.06]'
                  : 'text-slate-700 border-slate-300 hover:border-slate-900 hover:text-slate-900'
              }`}
              aria-label="Call us"
            >
              <svg className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              className={`${isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'} inline-flex items-center justify-center p-3 transition-colors`}
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-7 w-7`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-7 w-7`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden overflow-hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-xl">
            <Link
              href={navItems[0].href}
              className="text-gray-500 hover:text-slate-900 hover:bg-gray-50 block px-3 py-2 text-base font-normal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {navItems[0].label}
            </Link>

            <div className="px-3 py-2">
              <div className="text-gray-500 text-sm font-medium mb-2">{ts('navigation.services')}</div>
              {serviceItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-gray-600 hover:text-slate-900 hover:bg-gray-100 block px-3 py-2 text-base transition-colors ml-4 ${index === 0 ? 'font-bold' : 'font-medium'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-500 hover:text-slate-900 hover:bg-gray-50 block px-3 py-2 text-base font-normal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="px-3 py-2">
              <div className="text-gray-500 text-sm font-medium mb-2">{ts('navigation.calculators')}</div>
              {calculatorItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-500 hover:text-slate-900 hover:bg-gray-50 block px-3 py-2 text-base font-normal transition-colors ml-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="px-3 py-2">
              <div className="text-gray-500 text-sm font-medium mb-2">{ts('navigation.language')}</div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-base font-medium transition-colors ml-4 flex items-center ${language === lang.code
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <span className="mr-3">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  {language === lang.code && (
                    <svg className="ml-auto h-4 w-4 text-slate-900" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
