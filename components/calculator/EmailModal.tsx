'use client';

import React, { useState, useEffect, useRef } from 'react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    promoCode: string;
    isAgent: boolean;
    smsConsent: boolean;
  }) => Promise<void>;
  calculatorType?: 'auto' | 'home';
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparisonData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs?: any;
  inline?: boolean;
}

export default function EmailModal({
  isOpen,
  onClose,
  onSubmit,
  calculatorType = 'auto',
  className = '',
  inline = false,
}: EmailModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isAgent, setIsAgent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before the modal opened
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      // Focus the name input when modal opens
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    } else {
      // Return focus to the trigger element when modal closes
      previouslyFocusedElement.current?.focus();
      previouslyFocusedElement.current = null;
      // Reset form when modal closes
      setFirstName('');
      setLastName('');
      setEmail('');
      setMobileNumber('');
      setPromoCode('');
      setIsAgent(false);
      setSmsConsent(false);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        return;
      }

      if (e.key === 'Tab' && isOpen && modalRef.current) {
        const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      if (!inline) document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (!inline) document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, inline]);

  const handleAgentChange = (checked: boolean) => {
    setIsAgent(checked);
    if (checked) setSmsConsent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }

    if (!lastName.trim()) {
      setError('Please enter your last name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone format if provided
    if (mobileNumber.trim()) {
      const digitsOnly = mobileNumber.replace(/\D/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 11) {
        setError('Please enter a valid US mobile number (10 digits)');
        return;
      }
    }

    // SMS consent requires a mobile number
    if (smsConsent && !mobileNumber.trim()) {
      setError('A mobile number is required to opt in to text messages.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        promoCode: promoCode.trim(),
        isAgent,
        smsConsent,
      });
      onClose();
    } catch {
      setError('Failed to send quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formContent = (
    <>
      <div className="text-center mb-6">
        <h2 id="modal-title" className="text-2xl text-dpe-navy mb-2">
          Get Your FREE {calculatorType === 'home' ? 'Home Loan' : 'Auto Loan'} Quote
        </h2>
        <p className="text-base text-dpe-slate">
          Fill out the information below and we will follow up fast with your free no-obligation quote.
        </p>
        <p className="text-xs text-dpe-gray-500 mt-2">Fields marked with * are required.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-dpe-gray-700 mb-2">
                First Name *
              </label>
              <input
                ref={nameInputRef}
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-dpe-gray-300 focus:ring-2 focus:ring-dpe-blue focus:border-transparent text-base text-dpe-gray-900"
                placeholder="First Name"
                disabled={isSubmitting}
                aria-required="true"
                aria-describedby="form-error"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-dpe-gray-700 mb-2">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-dpe-gray-300 focus:ring-2 focus:ring-dpe-blue focus:border-transparent text-base text-dpe-gray-900"
                placeholder="Last Name"
                disabled={isSubmitting}
                aria-required="true"
                aria-describedby="form-error"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dpe-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-dpe-gray-300 focus:ring-2 focus:ring-dpe-blue focus:border-transparent text-base text-dpe-gray-900"
              placeholder="Email Address"
              disabled={isSubmitting}
              aria-required="true"
              aria-describedby="form-error"
            />
          </div>

          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-dpe-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-dpe-gray-300 focus:ring-2 focus:ring-dpe-blue focus:border-transparent text-base text-dpe-gray-900"
              placeholder="Mobile Number (Optional)"
              disabled={isSubmitting}
              aria-describedby="form-error"
            />
          </div>

          <div>
            <label htmlFor="promoCode" className="block text-sm font-medium text-dpe-gray-700 mb-2">
              Promo Code
            </label>
            <input
              id="promoCode"
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-dpe-gray-300 focus:ring-2 focus:ring-dpe-blue focus:border-transparent text-base text-dpe-gray-900"
              placeholder="Promo Code (Optional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Agent Disclosure Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              id="isAgent"
              type="checkbox"
              checked={isAgent}
              onChange={(e) => handleAgentChange(e.target.checked)}
              className="mt-1 h-4 w-4 text-dpe-blue focus:ring-dpe-blue border-dpe-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="isAgent" className="text-xs text-dpe-gray-600 leading-relaxed">
              I am an agent or authorized representative submitting this form on behalf of a client.
            </label>
          </div>

          {/* SMS Consent Checkbox */}
          <div className={`flex items-start space-x-3 ${isAgent ? 'opacity-50' : ''}`}>
            <input
              id="smsConsent"
              type="checkbox"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              className="mt-1 h-4 w-4 text-dpe-blue focus:ring-dpe-blue border-dpe-gray-300 rounded"
              disabled={isSubmitting || isAgent}
            />
            <label htmlFor="smsConsent" className="text-xs text-dpe-gray-500 leading-relaxed">
              By checking this box and signing up for texts, you consent to receive Account Notification messages from Drive Point Exchange at the number provided, including messages sent by autodialer. Consent is not a condition of purchase. Msg &amp; data rates may apply. Msg frequency varies. Unsubscribe at any time by replying STOP or clicking the unsubscribe link (where available). Reply HELP for help.{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-dpe-blue hover:text-dpe-navy underline">Privacy Policy</a>.
            </label>
          </div>

          {isAgent && (
            <p className="text-xs text-amber-600 italic ml-7">
              SMS consent must be obtained directly from the client.
            </p>
          )}

          {error && (
            <div id="form-error" role="alert" className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 px-4 rounded-full border border-dpe-gray-300 text-dpe-gray-700 hover:bg-dpe-gray-50 disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glow-cta flex-1 h-10 px-4 text-white font-semibold text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Get Free Quote'}
            </button>
          </div>
        </form>
    </>
  );

  if (inline) {
    return <div ref={modalRef} className={className}>{formContent}</div>;
  }

  return (
    <div className={`fixed inset-0 z-[9999] flex items-start pt-4 sm:items-center sm:pt-0 justify-center ${className}`}>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto z-10 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        style={{ maxHeight: '85dvh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {formContent}
      </div>
    </div>
  );
}
