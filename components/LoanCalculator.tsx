'use client';

import React, { useState, useEffect, useMemo } from 'react';
import EmailModal from './calculator/EmailModal';
import MoneyInput from './calculator/MoneyInput';
import { trackLeadSubmitted } from '../lib/gtm';
import { useI18n } from '../lib/i18n/context';

interface CalcInputs {
  // Current Loan - user enters monthly payment directly
  currentMonthlyPayment: number;
  balanceLeft: number;
  currentApr: number; // Annual APR as percentage (mandatory)
  remainingTermYears: number; // Remaining term in years (decimal allowed)
  // New Offer
  newApr: number;
  newTermYears: number; // New term in years (decimal allowed)
}

interface CalcResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  currentTotalInterestRemaining: number;
  newTotalInterest: number;
  interestSavings: number;
  remainingMonths: number;
  balanceLeft: number;
  hasPaymentWarning: boolean;
  hasPaymentValidationWarning: boolean;
}

// Pure utility functions

// Convert annual APR to monthly rate
function calculateMonthlyRate(aprAnnual: number): number {
  return aprAnnual / 100 / 12;
}


// Calculate monthly payment using amortization formula
// PMT(P, r_new, n_new) = P * [ r_new*(1+r_new)^n_new / ((1+r_new)^n_new - 1) ]
function calculatePayment(principal: number, r: number, n: number): number {
  if (principal <= 0 || n <= 0) return 0;
  
  // Edge case: if r === 0, then PMT = P / n
  if (r === 0) {
    return principal / n;
  }
  
  // Standard amortization formula
  const numerator = r * Math.pow(1 + r, n);
  const denominator = Math.pow(1 + r, n) - 1;
  return principal * (numerator / denominator);
}

// Calculate total interest: Interest = M * n - P
function calculateInterest(M: number, n: number, P: number): number {
  if (M <= 0 || n <= 0 || P <= 0) return 0;
  return M * n - P;
}

// Format currency using toLocaleString with USD
function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

// Validate user's payment matches calculated payment
function validatePayment(P: number, aprPct: number, M: number, nMonths: number): { 
  isValid: boolean; 
  calculatedPayment: number; 
  difference: number 
} {
  const calculatedPayment = calculatePayment(P, calculateMonthlyRate(aprPct), nMonths);
  const difference = Math.abs(calculatedPayment - M);
  return {
    isValid: difference <= 1,
    calculatedPayment,
    difference,
  };
}

// Custom hook for debounced values
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function LoanCalculator() {
  const [inputs, setInputs] = useState<CalcInputs>({
    currentMonthlyPayment: 740,
    balanceLeft: 30000,
    currentApr: 8.5,
    remainingTermYears: 4,
    newApr: 4.5,
    newTermYears: 4,
  });

  const [showEmailModal, setShowEmailModal] = useState(false);
  const { ts, language } = useI18n();

  // Debounce inputs for calculation
  const debouncedInputs = useDebouncedValue(inputs, 150);

  // Calculate refinance comparison
  const result = useMemo((): CalcResult => {
    const { 
      currentMonthlyPayment, 
      balanceLeft, 
      currentApr,
      remainingTermYears, 
      newApr, 
      newTermYears 
    } = debouncedInputs;
    
    // Convert years to months
    const remainingTermMonths = remainingTermYears * 12;
    const newTermMonths = newTermYears * 12;
    
    // Calculate monthly rates
    const rCurrent = calculateMonthlyRate(currentApr);
    const rNew = calculateMonthlyRate(newApr);
    
    // Validate payment: Calculate expected payment and compare with user's payment
    const paymentValidation = validatePayment(
      balanceLeft,
      currentApr,
      currentMonthlyPayment,
      remainingTermMonths
    );
    const hasPaymentValidationWarning = !paymentValidation.isValid;
    
    // Payment warning: if payment is too low to cover interest
    const hasPaymentWarning = currentMonthlyPayment <= rCurrent * balanceLeft;
    
    // Calculate new monthly payment
    const newMonthlyPayment = calculatePayment(balanceLeft, rNew, newTermMonths);
    
    // Calculate interest amounts
    // Interest_current = M_current * remainingTermMonths - P
    const currentTotalInterestRemaining = calculateInterest(
      currentMonthlyPayment, 
      remainingTermMonths, 
      balanceLeft
    );
    
    // Interest_new = M_new * n_new - P
    const newTotalInterest = calculateInterest(newMonthlyPayment, newTermMonths, balanceLeft);
    
    // Monthly savings
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    
    // Interest savings = Interest_current - Interest_new (no fees)
    const interestSavings = currentTotalInterestRemaining - newTotalInterest;
    
    // Output comprehensive calculation breakdown to server terminal (PowerShell/npm run dev)
    if (typeof window !== 'undefined') {
      fetch('/api/log-calculation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentMonthlyPayment,
          balanceLeft,
          currentApr,
          monthlyRate: rCurrent,
          remainingTermYears,
          remainingTermMonths,
          newApr,
          newMonthlyRate: rNew,
          newTermYears,
          newTermMonths,
          calculatedPayment: paymentValidation.calculatedPayment,
          paymentDifference: paymentValidation.difference,
          isPaymentValid: paymentValidation.isValid,
          currentTotalInterest: currentTotalInterestRemaining,
          newMonthlyPayment,
          newTotalInterest,
          monthlySavings,
          interestSavings,
          hasPaymentWarning,
          hasPaymentValidationWarning,
        }),
      }).catch(() => {
        // Silently fail if logging endpoint is unavailable
      });
    }
    
    return {
      currentMonthlyPayment,
      newMonthlyPayment,
      monthlySavings,
      currentTotalInterestRemaining,
      newTotalInterest,
      interestSavings,
      remainingMonths: remainingTermMonths,
      balanceLeft,
      hasPaymentWarning,
      hasPaymentValidationWarning,
    };
  }, [debouncedInputs]);


  const handleInputChange = (field: keyof CalcInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberInput = (field: keyof CalcInputs, rawValue: string) => {
    if (rawValue === '') {
      handleInputChange(field, '' as unknown as number);
      return;
    }
    handleInputChange(field, Number(rawValue));
  };

  const renderStepper = (field: keyof CalcInputs, step: number, min: number, max: number) => (
    <div className="absolute right-0 top-0 bottom-0 flex flex-col border-l border-dpe-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => {
          const current = Number(inputs[field]) || 0;
          handleInputChange(field, Math.min(max, +(current + step).toFixed(2)));
        }}
        className="flex-1 flex items-center justify-center w-7 text-dpe-gray-400 hover:text-dpe-gray-600 hover:bg-dpe-gray-100 transition-colors"
        tabIndex={-1}
        aria-label={`Increase ${field}`}
      >
        <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor"><path d="M4 0l4 5H0z"/></svg>
      </button>
      <div className="border-t border-dpe-gray-200" />
      <button
        type="button"
        onClick={() => {
          const current = Number(inputs[field]) || 0;
          handleInputChange(field, Math.max(min, +(current - step).toFixed(2)));
        }}
        className="flex-1 flex items-center justify-center w-7 text-dpe-gray-400 hover:text-dpe-gray-600 hover:bg-dpe-gray-100 transition-colors"
        tabIndex={-1}
        aria-label={`Decrease ${field}`}
      >
        <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor"><path d="M4 5L0 0h8z"/></svg>
      </button>
    </div>
  );

  const handleEstimate = () => {
    setShowEmailModal(true);
    setTimeout(() => {
      document.getElementById('modal-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setInputs({
      currentMonthlyPayment: 740,
      balanceLeft: 30000,
      currentApr: 8.5,
      remainingTermYears: 4,
      newApr: 4.5,
      newTermYears: 4,
    });
  };

  const handleEmailSubmit = async (data: {
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
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          language: language,
          isAgent: data.isAgent,
          smsConsent: data.smsConsent,
          promoCode: data.promoCode,
          inputs: {
            currentMonthlyPayment: inputs.currentMonthlyPayment,
            balanceLeft: inputs.balanceLeft,
            currentApr: inputs.currentApr,
            remainingTermYears: inputs.remainingTermYears,
            newApr: inputs.newApr,
            newTermYears: inputs.newTermYears,
            mobileNumber: data.mobileNumber || '',
          },
          result: {
            currentMonthlyPayment: result.currentMonthlyPayment,
            newMonthlyPayment: result.newMonthlyPayment,
            monthlySavings: result.monthlySavings,
            currentTotalInterestRemaining: result.currentTotalInterestRemaining,
            newTotalInterest: result.newTotalInterest,
            interestSavings: result.interestSavings,
            remainingMonths: result.remainingMonths,
            balanceLeft: result.balanceLeft,
            hasPaymentWarning: result.hasPaymentWarning,
            hasPaymentValidationWarning: result.hasPaymentValidationWarning,
          },
        }),
      });

      if (!response.ok) {
        // Parse error response to get actual error message
        let errorMessage = 'Failed to send email';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('Email API error response:', errorData);
        } catch (parseError) {
          // If response isn't JSON, use status text
          errorMessage = `${errorMessage}: ${response.statusText}`;
          console.error('Failed to parse error response:', parseError);
        }
        console.error('Email sending failed:', {
          status: response.status,
          statusText: response.statusText,
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }

      trackLeadSubmitted({
        lead_type: 'auto_refinance_quote',
        form_name: 'auto_quote_modal',
        calculator_type: 'auto',
        language,
        sms_consent: data.smsConsent,
        is_agent: data.isAgent,
      });

      alert('Refinance comparison sent successfully! Check your email.');
      setShowEmailModal(false);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  return (
    <>
      {showEmailModal ? (
        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
          calculatorType="auto"
          comparisonData={result}
          inputs={inputs}
          inline
        />
      ) : (
      <div className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl text-dpe-navy mb-2">
            {ts('calculator.title')}
          </h2>
          <p className="text-base text-dpe-slate">
            {ts('calculator.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Section */}
          <div className="space-y-6">
            {/* Current Monthly Payment */}
            <div>
              <MoneyInput
                label={ts('calculator.currentMonthlyPayment')}
                value={inputs.currentMonthlyPayment}
                onChange={(value) => handleInputChange('currentMonthlyPayment', value)}
                max={10000}
                placeholder="650"
              />
              <p className="mt-1 text-xs text-dpe-gray-500">
                Principal & Interest Only
              </p>
            </div>

            {/* Balance Left */}
            <MoneyInput
              label={ts('calculator.balanceLeft')}
              value={inputs.balanceLeft}
              onChange={(value) => handleInputChange('balanceLeft', value)}
              max={500000}
              placeholder="40800"
            />

            {/* Interest Rates - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Current APR */}
              <div>
                <label className="block text-sm font-medium text-dpe-gray-700 mb-2">
                  {ts('calculator.currentApr')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.currentApr}
                    onChange={(e) => handleNumberInput('currentApr', e.target.value)}
                    className="w-full h-10 px-3 pr-14 rounded-none border border-dpe-gray-300 focus:ring-2 focus:ring-dpe-blue focus:border-transparent text-base text-dpe-gray-900"
                    min="0"
                    max="30"
                    step="any"
                    aria-label="Current APR input"
                  />
                  <span className="absolute right-9 top-1/2 transform -translate-y-1/2 text-xs text-dpe-gray-500 font-medium">
                    %
                  </span>
                  {renderStepper('currentApr', 0.25, 0, 30)}
                </div>
                <p className="mt-1 text-xs text-dpe-gray-500">
                  Annual
                </p>
              </div>

              {/* New APR */}
              <div>
                <label className="block text-sm font-medium text-dpe-gray-700 mb-2">
                  {ts('calculator.newApr')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.newApr}
                    onChange={(e) => handleNumberInput('newApr', e.target.value)}
                    className="w-full h-10 px-3 pr-14 rounded-none border border-dpe-gray-300 focus:ring-2 focus:ring-dpe-blue focus:border-transparent text-base text-dpe-gray-900"
                    min="0"
                    max="30"
                    step="any"
                    aria-label="New APR input"
                  />
                  <span className="absolute right-9 top-1/2 transform -translate-y-1/2 text-xs text-dpe-gray-500 font-medium">
                    %
                  </span>
                  {renderStepper('newApr', 0.25, 0, 30)}
                </div>
                <p className="mt-1 text-xs text-dpe-gray-500">
                  Annual
                </p>
              </div>
            </div>

            {/* Loan Terms - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Remaining Term */}
              <div>
                <label className="block text-sm font-medium text-dpe-gray-700 mb-2">
                  {ts('calculator.remainingTermYears') || 'Remaining Term'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.remainingTermYears}
                    onChange={(e) => handleNumberInput('remainingTermYears', e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-none border border-dpe-gray-300 focus:ring-2 focus:ring-dpe-blue focus:border-transparent text-base text-dpe-gray-900"
                    min="0.1"
                    max="30"
                    step="any"
                    placeholder="4"
                    aria-label="Remaining Term in years"
                  />
                  {renderStepper('remainingTermYears', 1, 0.5, 30)}
                </div>
                <p className="mt-1 text-xs text-dpe-gray-500">
                  Years
                </p>
              </div>

              {/* New Term Years */}
              <div>
                <label className="block text-sm font-medium text-dpe-gray-700 mb-2">
                  {ts('calculator.newTermYears')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.newTermYears}
                    onChange={(e) => handleNumberInput('newTermYears', e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-none border border-dpe-gray-300 focus:ring-2 focus:ring-dpe-blue focus:border-transparent text-base text-dpe-gray-900"
                    min="0.1"
                    max="30"
                    step="any"
                    placeholder="4"
                    aria-label="New Term in years"
                  />
                  {renderStepper('newTermYears', 1, 0.5, 30)}
                </div>
                <p className="mt-1 text-xs text-dpe-gray-500">
                  Years
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Output Section */}
          <div className="lg:pl-6 lg:border-l lg:border-dpe-gray-200" aria-live="polite">
            {/* Main Result Card */}
            <div className="bg-dpe-gray-50 p-6 border border-dpe-blue-800/30">
              <div className="text-center mb-4">
                <div className="text-sm font-medium text-dpe-gray-600 mb-2">{ts('calculator.newMonthlyPayment')}</div>
                <div className="text-4xl font-bold text-dpe-blue">
                  ${formatCurrency(result.newMonthlyPayment)}
                </div>
              </div>

              {/* Secondary Summary */}
              <div className="mt-6 space-y-4">
                {/* Monthly Savings */}
                <div className="text-center">
                  <div className="text-sm text-dpe-gray-600 mb-1">Monthly savings</div>
                  <div className={`text-xl font-bold ${result.monthlySavings < 0 ? 'text-red-600' : 'text-dpe-green-500'}`}>
                    {result.monthlySavings < 0 ? '-' : ''}${formatCurrency(Math.abs(result.monthlySavings))}
                  </div>
                </div>

                {/* Interest Savings */}
                <div className="text-center pt-3 border-t border-dpe-gray-300">
                  <div className="text-sm text-dpe-gray-600 mb-1">Interest savings</div>
                  <div className={`text-xl font-bold ${result.interestSavings > 0 ? 'text-dpe-green-500' : result.interestSavings < 0 ? 'text-red-600' : 'text-dpe-gray-600'}`}>
                    {result.interestSavings > 0 ? '+' : result.interestSavings < 0 ? '-' : ''}${formatCurrency(Math.abs(result.interestSavings))}
                  </div>
                </div>
              </div>
            </div>

            {/* Helper Message if Monthly Savings < 0 */}
            {result.monthlySavings < 0 && (
              <div className="mt-4 bg-dpe-blue-50 border border-dpe-blue-200 p-4">
                <p className="text-sm text-dpe-navy">
                  {ts('calculator.monthlyPaymentWarning')}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <button
                onClick={handleEstimate}
                className="glow-cta w-full text-white font-semibold py-4 px-6"
              >
                {ts('calculator.getQuote')}
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-dpe-gray-500 hover:bg-dpe-gray-600 text-white font-medium py-3 px-6 transition-all duration-200"
              >
                {ts('calculator.resetCalculator')}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
