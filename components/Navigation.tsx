'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useI18n } from '../lib/i18n/context';
import { NavHeader, type NavTab } from './ui/nav-header';

export default function Navigation({ overlay = false }: { overlay?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { ts, language, setLanguage, languages } = useI18n();
  const pathname = usePathname();

  const servicesRef = useRef<HTMLElement>(null);
  const calculatorRef = useRef<HTMLElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlay) return;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [overlay]);

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
    <nav className={`${overlay ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-200 ease-out ${isTransparent
        ? 'bg-gradient-to-b from-black/40 to-transparent border-b-0 shadow-none pb-8 -mb-8'
        : 'bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.06)]'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src={isTransparent ? "/logo-no bg-inverted.png" : "/logo-no bg.png"}
                alt="Drive Point Exchange Logo"
                width={200}
                height={80}
                className={`h-20 w-auto ${isTransparent ? '' : 'mix-blend-multiply'}`}
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Pill Nav */}
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
                    <div className="w-60 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                      {serviceItems.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-dpe-blue transition-colors ${index === 0 ? 'font-bold border-b border-gray-100 pb-2 mb-1' : ''}`}
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
                    <div className="w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                      {calculatorItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-dpe-blue transition-colors"
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

            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                onKeyDown={(e) => handleDropdownKeyDown(e, () => setIsLanguageOpen(false))}
                aria-expanded={isLanguageOpen}
                aria-haspopup="true"
                className={`${isTransparent ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-dpe-blue'} px-3 py-2 text-sm font-medium transition-colors flex items-center`}
              >
                <span className="mr-2">{currentLanguage?.flag}</span>
                <span className="hidden sm:inline">{currentLanguage?.nativeName}</span>
                <svg className="ml-1 h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center ${language === lang.code
                          ? 'bg-blue-50 text-dpe-blue'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <span className="mr-3">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      {language === lang.code && (
                        <svg className="ml-auto h-4 w-4 text-dpe-blue" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Numbers */}
            <div className="flex items-center gap-1">
              <a
                href="tel:+18889907112"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isTransparent
                    ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                    : 'text-gray-600 hover:text-dpe-blue hover:bg-dpe-blue/5'
                }`}
                aria-label="Call (888) 990-7112"
              >
                <svg className="h-3.5 w-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden lg:inline">(888) 990-7112</span>
              </a>
              <span className={`hidden xl:block text-xs ${isTransparent ? 'text-gray-300' : 'text-gray-300'}`}>|</span>
              <a
                href="tel:+17737821005"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isTransparent
                    ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Customer Service (773) 782-1005"
              >
                <span className="hidden xl:inline">24/7</span>
                <span className="hidden lg:inline">(773) 782-1005</span>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Phone Button */}
            <a
              href="tel:+18889907112"
              className="flex items-center justify-center text-white bg-dpe-green hover:bg-dpe-green-600 p-2.5 rounded-lg transition-colors"
              aria-label="Call us"
            >
              <svg className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              className={`text-gray-600 hover:text-dpe-blue inline-flex items-center justify-center p-3 rounded-md transition-colors`}
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-xl">
            <Link
              href={navItems[0].href}
              className="text-gray-500 hover:text-dpe-blue hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-normal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {navItems[0].label}
            </Link>

            {/* Mobile Services Options */}
            <div className="px-3 py-2">
              <div className="text-gray-500 text-sm font-medium mb-2">{ts('navigation.services')}</div>
              {serviceItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-gray-600 hover:text-dpe-blue hover:bg-gray-100 block px-3 py-2 rounded-md text-base transition-colors ml-4 ${index === 0 ? 'font-bold' : 'font-medium'}`}
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
                className="text-gray-500 hover:text-dpe-blue hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-normal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Calculator Options */}
            <div className="px-3 py-2">
              <div className="text-gray-500 text-sm font-medium mb-2">{ts('navigation.calculators')}</div>
              {calculatorItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-500 hover:text-dpe-blue hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-normal transition-colors ml-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Language Options */}
            <div className="px-3 py-2">
              <div className="text-gray-500 text-sm font-medium mb-2">{ts('navigation.language')}</div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ml-4 flex items-center ${language === lang.code
                      ? 'bg-blue-50 text-dpe-blue'
                      : 'text-gray-600 hover:text-dpe-blue hover:bg-gray-100'
                    }`}
                >
                  <span className="mr-3">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  {language === lang.code && (
                    <svg className="ml-auto h-4 w-4 text-dpe-blue" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="px-3 py-3 border-t border-gray-200 mt-2">
              <p className="text-xs text-gray-500 mb-2">Customer Service - 24/7</p>
              <a href="tel:+17737821005" className="text-dpe-blue font-semibold text-lg hover:text-dpe-navy">(773) 782-1005</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}