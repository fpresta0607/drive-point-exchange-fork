'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PriceSlider from './calculator/PriceSlider';
import MoneyInput from './calculator/MoneyInput';
import Select from './calculator/Select';
import EmailModal from './calculator/EmailModal';
import { trackLeadSubmitted } from '../lib/gtm';
import { useI18n } from '../lib/i18n/context';

export default function HomeLoanCalculator() {
  const { ts, language } = useI18n();
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTax, setPropertyTax] = useState(5000);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [pmi, setPmi] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const loanAmount = homePrice - downPayment;
  const downPaymentPercent = (downPayment / homePrice) * 100;

  const monthlyPayment = useMemo(() => {
    if (loanAmount <= 0) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    if (monthlyRate === 0) {
      return loanAmount / numPayments;
    }
    
    const monthlyPrincipalInterest = 
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const monthlyPmi = pmi / 12;
    
    return monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + monthlyPmi;
  }, [loanAmount, interestRate, loanTerm, propertyTax, homeInsurance, pmi]);

  const principalInterest = useMemo(() => {
    if (loanAmount <= 0) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    if (monthlyRate === 0) {
      return loanAmount / numPayments;
    }
    
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  }, [loanAmount, interestRate, loanTerm]);

  const totalInterest = useMemo(() => {
    return (principalInterest * loanTerm * 12) - loanAmount;
  }, [principalInterest, loanTerm, loanAmount]);

  const handleGetEstimate = () => {
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (emailData: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    promoCode: string;
    isAgent: boolean;
    smsConsent: boolean;
  }) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'home_loan_estimate',
          language: language,
          isAgent: emailData.isAgent,
          smsConsent: emailData.smsConsent,
          promoCode: emailData.promoCode,
          inputs: {
            homePrice,
            downPayment,
            loanTerm,
            interestRate,
            propertyTax,
            homeInsurance,
            pmi,
            firstName: emailData.firstName,
            lastName: emailData.lastName,
            email: emailData.email,
            mobileNumber: emailData.mobileNumber,
          },
          result: {
            monthlyPayment: Math.round(monthlyPayment),
            principalInterest: Math.round(principalInterest),
            propertyTax: Math.round(propertyTax / 12),
            homeInsurance: Math.round(homeInsurance / 12),
            pmi: Math.round(pmi / 12),
            totalInterest: Math.round(totalInterest),
            loanAmount,
          }
        }),
      });

      if (response.ok) {
        trackLeadSubmitted({
          lead_type: 'home_loan_quote',
          form_name: 'home_quote_modal',
          calculator_type: 'home',
          language,
          sms_consent: emailData.smsConsent,
          is_agent: emailData.isAgent,
        });

        setShowEmailModal(false);
        alert('Your home loan estimate has been sent to your email!');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  const loanTermOptions = [
    { value: 15, label: ts('homeLoanCalculator.loanTermOptions.15') },
    { value: 20, label: ts('homeLoanCalculator.loanTermOptions.20') },
    { value: 25, label: ts('homeLoanCalculator.loanTermOptions.25') },
    { value: 30, label: ts('homeLoanCalculator.loanTermOptions.30') },
  ];

  const interestRateOptions = [
    { value: 5.5, label: ts('homeLoanCalculator.interestRateOptions.excellent') },
    { value: 6.0, label: ts('homeLoanCalculator.interestRateOptions.good') },
    { value: 6.5, label: ts('homeLoanCalculator.interestRateOptions.fair') },
    { value: 7.0, label: ts('homeLoanCalculator.interestRateOptions.average') },
    { value: 7.5, label: ts('homeLoanCalculator.interestRateOptions.belowAverage') },
  ];

  return (
    <div className="bg-white shadow-2xl p-8 border border-dpe-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-dpe-gray-900 mb-6">{ts('homeLoanCalculator.loanDetails')}</h3>
          
          {/* Home Price */}
          <div>
            <label className="block text-sm font-medium text-dpe-gray-700 mb-3">
              {ts('homeLoanCalculator.homePrice')}: ${homePrice.toLocaleString()}
            </label>
            <PriceSlider
              min={100000}
              max={2000000}
              step={10000}
              value={homePrice}
              onChange={setHomePrice}
            />
          </div>

          {/* Down Payment */}
          <MoneyInput
            label={ts('homeLoanCalculator.downPayment')}
            value={downPayment}
            onChange={setDownPayment}
            max={homePrice}
            placeholder="80000"
          />

          {/* Down Payment Percentage Display */}
          <div className="bg-dpe-blue-50 p-4">
            <p className="text-sm text-dpe-gray-600">
              {ts('homeLoanCalculator.downPayment')}: <span className="font-semibold text-dpe-blue">{downPaymentPercent.toFixed(1)}%</span>
            </p>
            {downPaymentPercent < 20 && (
              <p className="text-xs text-dpe-blue mt-1">
                {ts('homeLoanCalculator.pmiWarning')}
              </p>
            )}
          </div>

          {/* Loan Term */}
          <Select
            label={ts('homeLoanCalculator.loanTerm')}
            value={loanTerm}
            onChange={(value) => setLoanTerm(Number(value))}
            options={loanTermOptions}
            placeholder="Select loan term"
          />

          {/* Interest Rate */}
          <Select
            label={ts('homeLoanCalculator.interestRate')}
            value={interestRate}
            onChange={(value) => setInterestRate(Number(value))}
            options={interestRateOptions}
            placeholder="Select interest rate"
          />

          {/* Property Tax */}
          <MoneyInput
            label={ts('homeLoanCalculator.propertyTax')}
            value={propertyTax}
            onChange={setPropertyTax}
            placeholder="5000"
          />

          {/* Home Insurance */}
          <MoneyInput
            label={ts('homeLoanCalculator.homeInsurance')}
            value={homeInsurance}
            onChange={setHomeInsurance}
            placeholder="1200"
          />

          {/* PMI */}
          <MoneyInput
            label={ts('homeLoanCalculator.pmi')}
            value={pmi}
            onChange={setPmi}
            placeholder="0"
          />
        </motion.div>

        {/* Right Column - Results */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-dpe-gray-900 mb-6">{ts('homeLoanCalculator.paymentBreakdownTitle')}</h3>
          
          {/* Monthly Payment */}
          <div className="bg-gradient-to-br from-dpe-navy to-dpe-navy-deep p-6 text-white">
            <div className="text-center">
              <p className="text-dpe-blue-100 text-sm font-medium mb-2">{ts('homeLoanCalculator.estimatedMonthlyPayment')}</p>
              <p className="text-4xl font-bold">${Math.round(monthlyPayment).toLocaleString()}</p>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-dpe-gray-200">
              <span className="text-dpe-gray-600">{ts('homeLoanCalculator.paymentBreakdown.principalInterest')}</span>
              <span className="font-semibold text-dpe-gray-900">${Math.round(principalInterest).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-dpe-gray-200">
              <span className="text-dpe-gray-600">{ts('homeLoanCalculator.paymentBreakdown.propertyTax')}</span>
              <span className="font-semibold text-dpe-gray-900">${Math.round(propertyTax / 12).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-dpe-gray-200">
              <span className="text-dpe-gray-600">{ts('homeLoanCalculator.paymentBreakdown.homeInsurance')}</span>
              <span className="font-semibold text-dpe-gray-900">${Math.round(homeInsurance / 12).toLocaleString()}</span>
            </div>
            {pmi > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-dpe-gray-200">
                <span className="text-dpe-gray-600">{ts('homeLoanCalculator.paymentBreakdown.pmi')}</span>
                <span className="font-semibold text-dpe-gray-900">${Math.round(pmi / 12).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Loan Summary */}
          <div className="bg-dpe-gray-50 p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-dpe-gray-600">{ts('homeLoanCalculator.paymentBreakdown.loanAmount')}</span>
              <span className="font-semibold">${loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dpe-gray-600">{ts('homeLoanCalculator.paymentBreakdown.totalInterest')}</span>
              <span className="font-semibold">${Math.round(totalInterest).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dpe-gray-600">{ts('homeLoanCalculator.paymentBreakdown.totalCost')}</span>
              <span className="font-semibold">${(loanAmount + totalInterest).toLocaleString()}</span>
            </div>
          </div>

          {/* Get Estimate Button */}
          <button
            onClick={handleGetEstimate}
            className="glow-cta w-full text-white font-semibold py-4 px-6"
          >
            {ts('homeLoanCalculator.getEstimateButton')}
          </button>
        </motion.div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
          calculatorType="home"
        />
      )}
    </div>
  );
}
