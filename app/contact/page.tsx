'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { trackLeadSubmitted } from '../../lib/gtm';
import { useI18n } from '../../lib/i18n/context';
import { CTAButton } from '../../components/ui/cta-button';

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();

  const fadeInUp = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  const fadeInLeft = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6 } };

  const fadeInRight = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6 } };

  const staggerChildren = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.1 } } };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    loanType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { language, ts, t } = useI18n();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = ts('forms.validation.required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = ts('forms.validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ts('forms.validation.invalidEmail');
    }
    
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = ts('forms.validation.invalidPhone');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = ts('forms.validation.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          loanType: formData.loanType,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      trackLeadSubmitted({
        lead_type: 'contact',
        form_name: 'contact_form',
        calculator_type: 'contact',
        language,
        loan_type: formData.loanType || undefined,
      });

      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '', loanType: '' });
      setErrors({});
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrors({ submit: 'Something went wrong. Please try again or call us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation overlay />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/auto/real-hero-v1.png"
            alt="Contact us for auto financing"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 md:pt-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            >
              {ts('contact.title')}
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto"
            >
              {ts('contact.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInLeft}
            className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 ">{ts('contact.sendMessage')}</h2>
            
            {isSubmitted ? (
              <motion.div
                role="alert"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-dpe-blue mb-2">{ts('contact.messageSent')}</h3>
                <p className="text-gray-600">{ts('contact.messageSentDesc')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {ts('contact.fullName')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-dpe-blue focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={ts('contact.fullName')}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {ts('contact.emailAddress')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-dpe-blue focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={ts('contact.emailAddress')}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {ts('contact.phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-dpe-blue focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={ts('contact.phoneNumber')}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {ts('contact.serviceInterest')}
                  </label>
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-dpe-blue focus:border-transparent"
                    aria-label={ts('contact.serviceInterest')}
                  >
                    <option value="">{ts('contact.serviceOptions.selectService')}</option>
                    <option value="auto-refinance">{ts('contact.serviceOptions.autoRefinance')}</option>
                    <option value="vehicle-coverage">{ts('contact.serviceOptions.vehicleCoverage')}</option>
                    <option value="home-refinance">{ts('contact.serviceOptions.homeRefinance')}</option>
                    <option value="insurance">{ts('contact.serviceOptions.insurance')}</option>
                    <option value="life-insurance">{ts('contact.serviceOptions.lifeInsurance')}</option>
                    <option value="credit-savings">{ts('contact.serviceOptions.creditSavings')}</option>
                    <option value="other">{ts('contact.serviceOptions.other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {ts('contact.message')} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-dpe-blue focus:border-transparent resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={ts('contact.message')}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                {errors.submit && (
                  <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{errors.submit}</p>
                  </div>
                )}

                <CTAButton
                  type="submit"
                  variant="primary-dark"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? ts('contact.sending') : ts('contact.sendMessageButton')}
                </CTAButton>
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInRight}
            className="space-y-8"
          >
            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{ts('contact.businessHours')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>{ts('contact.mondaySaturday')}</span>
                  <span className="text-gray-900 font-medium">9:00 AM - 6:00 PM CST</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{ts('contact.sunday')}</span>
                  <span className="text-gray-900 font-medium">{ts('contact.closed')}</span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{ts('contact.getInTouch')}</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-dpe-blue text-xl mr-4">📞</div>
                  <div>
                    <p className="text-gray-600 text-sm">{ts('contact.phone')}</p>
                    <a href="tel:+18889907112" className="text-gray-900 font-semibold hover:text-dpe-blue transition-colors">(888) 990-7112</a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="text-dpe-blue text-xl mr-4">🕐</div>
                  <div>
                    <p className="text-gray-600 text-sm">Customer Service - 24/7</p>
                    <a href="tel:+17737821005" className="text-gray-900 font-semibold hover:text-dpe-blue transition-colors">(773) 782-1005</a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-dpe-blue text-xl mr-4">📧</div>
                  <div>
                    <p className="text-gray-600 text-sm">{ts('contact.email')}</p>
                    <a href="mailto:support@drivepointexchange.com" className="text-gray-900 font-semibold hover:text-dpe-blue transition-colors">support@drivepointexchange.com</a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-dpe-blue text-xl mr-4">📍</div>
                  <div>
                    <p className="text-gray-600 text-sm">{ts('contact.address')}</p>
                    <p className="text-gray-900 font-semibold">
                      211 W Wacker Drive<br />
                      Suite 120<br />
                      Chicago, IL 60606
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{ts('contact.findUs')}</h3>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.3!2d-87.6364!3d41.8865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca8b34fffff%3A0x6caeb5f721ca846!2s211%20W%20Wacker%20Dr%2C%20Chicago%2C%20IL%2060606!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Drive Point Exchange Location - Chicago"
                ></iframe>
              </div>
            </div>

            
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="mt-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 text-center mb-12 ">
            {ts('contact.faq')}
          </motion.h2>
          <motion.div variants={staggerChildren} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(t('contact.faqItems') as Array<{question: string; answer: string}>).map((faq, index: number) => (
              <motion.div key={index} variants={fadeInUp} className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}