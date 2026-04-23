"use client";

import * as React from "react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";

const EmailModal = dynamic(() => import("@/components/calculator/EmailModal"), { ssr: false });

function useIsMobile(breakpoint = 768) {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => window.innerWidth < breakpoint,
    () => false,
  );
}

type LoanInputs = {
  currentMonthlyPayment: number;
  loanBalanceRemaining: number;
  currentAPR: number;
  newAPR: number;
  remainingTermYears: number;
  newTermYears: number;
};

const defaultValues: LoanInputs = {
  currentMonthlyPayment: 740,
  loanBalanceRemaining: 30000,
  currentAPR: 8.5,
  newAPR: 4.5,
  remainingTermYears: 4,
  newTermYears: 4,
};

function calculateMonthlyPayment(principal: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function calculateTotalPaid(monthlyPayment: number, years: number) {
  return monthlyPayment * years * 12;
}

function calculateInterest(totalPaid: number, principal: number) {
  return totalPaid - principal;
}

function formatNumberWithCommas(num: number, decimals = 0): string {
  const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  const parts = rounded.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join('.');
}

function parseNumberInput(value: string): number {
  return Number(value.replace(/,/g, ""));
}

type SliderConfig = {
  key: keyof LoanInputs;
  label: string[];
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  inputWidth: string;
  inputWidthSm: string;
  format: (v: number) => string;
  tooltipFormat: (v: number) => string;
};

const sliderConfigs: SliderConfig[] = [
  { key: "currentMonthlyPayment", label: ["CURRENT", "MONTHLY", "PAYMENT"], min: 100, max: 2500, step: 5, prefix: "$", inputWidth: "w-14", inputWidthSm: "w-16", format: (v) => formatNumberWithCommas(v), tooltipFormat: (v) => `$${v}` },
  { key: "loanBalanceRemaining", label: ["LOAN", "BALANCE", "REMAINING"], min: 1000, max: 100000, step: 100, prefix: "$", inputWidth: "w-20", inputWidthSm: "w-24", format: (v) => formatNumberWithCommas(v), tooltipFormat: (v) => `$${v.toLocaleString()}` },
  { key: "currentAPR", label: ["CURRENT", "APR"], min: 0, max: 25, step: 0.1, suffix: "%", inputWidth: "w-10", inputWidthSm: "w-12", format: (v) => v.toFixed(1), tooltipFormat: (v) => `${v}%` },
  { key: "newAPR", label: ["NEW", "APR"], min: 0, max: 25, step: 0.1, suffix: "%", inputWidth: "w-10", inputWidthSm: "w-12", format: (v) => v.toFixed(1), tooltipFormat: (v) => `${v}%` },
  { key: "remainingTermYears", label: ["CURRENT", "TERM"], min: 1, max: 8, step: 1, suffix: "yr", inputWidth: "w-8", inputWidthSm: "w-10", format: (v) => v.toString(), tooltipFormat: (v) => `${v} YRS` },
  { key: "newTermYears", label: ["NEW", "TERM"], min: 1, max: 8, step: 1, suffix: "yr", inputWidth: "w-8", inputWidthSm: "w-10", format: (v) => v.toString(), tooltipFormat: (v) => `${v} YRS` },
];

export function AutoLoanRefinanceCalculator() {
  const [values, setValues] = useState<LoanInputs>(defaultValues);
  const [displayValues, setDisplayValues] = useState<Partial<LoanInputs>>({});
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const isMobile = useIsMobile();

  const updateValue = <K extends keyof LoanInputs>(key: K, value: LoanInputs[K]) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setDisplayValues((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleInputChange = <K extends keyof LoanInputs>(key: K, displayValue: string) => {
    setDisplayValues((prev) => ({ ...prev, [key]: displayValue }));
    const parsed = parseNumberInput(displayValue);
    if (displayValue !== "" && !isNaN(parsed) && parsed >= 0) {
      setValues((prev) => ({ ...prev, [key]: parsed }));
    }
  };

  const handleInputBlur = <K extends keyof LoanInputs>(key: K) => {
    setDisplayValues((prev) => ({ ...prev, [key]: undefined }));
  };

  const results = useMemo(() => {
    const estimatedNewPayment = calculateMonthlyPayment(
      values.loanBalanceRemaining,
      values.newAPR,
      values.newTermYears
    );

    const currentTotalPaid = calculateTotalPaid(
      values.currentMonthlyPayment,
      values.remainingTermYears
    );

    const newTotalPaid = calculateTotalPaid(
      estimatedNewPayment,
      values.newTermYears
    );

    const currentInterest = calculateInterest(
      currentTotalPaid,
      values.loanBalanceRemaining
    );

    const newInterest = calculateInterest(
      newTotalPaid,
      values.loanBalanceRemaining
    );

    const monthlySavings = values.currentMonthlyPayment - estimatedNewPayment;
    const interestSavings = currentInterest - newInterest;

    return {
      estimatedNewPayment,
      monthlySavings,
      interestSavings,
      newTotalInterest: newInterest,
      currentTotalInterestRemaining: currentInterest,
    };
  }, [values]);

  const resetCalculator = () => {
    setValues(defaultValues);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      <EmailModal
        isOpen={showQuoteForm}
        onClose={() => setShowQuoteForm(false)}
        onSubmit={async (data) => {
          const response = await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'auto_loan_estimate',
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
              isAgent: data.isAgent,
              smsConsent: data.smsConsent,
              promoCode: data.promoCode,
              inputs: {
                currentMonthlyPayment: values.currentMonthlyPayment,
                balanceLeft: values.loanBalanceRemaining,
                currentApr: values.currentAPR,
                remainingTermYears: values.remainingTermYears,
                newApr: values.newAPR,
                newTermYears: values.newTermYears,
                mobileNumber: data.mobileNumber || '',
              },
              result: {
                newMonthlyPayment: results.estimatedNewPayment,
                monthlySavings: results.monthlySavings,
                interestSavings: results.interestSavings,
                newTotalInterest: results.newTotalInterest,
                currentTotalInterestRemaining: results.currentTotalInterestRemaining,
                balanceLeft: values.loanBalanceRemaining,
              },
            }),
          });
          if (!response.ok) throw new Error('Failed to send quote request');
        }}
        calculatorType="auto"
      />

      <div className="mx-auto w-full max-w-7xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border border-white/60 p-6 md:px-10 z-10 relative">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Calculate Your Payment
            </h2>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              Get an instant estimate for your auto loan
            </p>
          </div>
          <button
            onClick={() => setShowQuoteForm(true)}
            className="hidden sm:block green-cta-pulse h-12 md:h-14 rounded-full text-white font-bold px-8 text-base md:text-lg whitespace-nowrap shadow-lg"
          >
            Get My Refinance Quote
          </button>
        </div>

        {/* Sliders and output body */}
        <div className="bg-white/85 backdrop-blur-xl rounded-b-3xl shadow-2xl border border-white/60 border-t-0 p-6 sm:p-10 relative z-0">
          <div className="grid gap-6 lg:gap-10 lg:grid-cols-[1fr_minmax(280px,0.8fr)] auto-rows-max lg:auto-rows-fr">
            <div className="flex flex-col bg-transparent h-full">
              {isMobile ? (
                /* ── Mobile: horizontal sliders stacked vertically ── */
                <div className="flex flex-col gap-5 w-full py-2">
                  {sliderConfigs.map((cfg) => (
                    <div key={cfg.key} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`calc-${cfg.key}`} className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                          {cfg.label.join(" ")}
                        </Label>
                        <div className="flex items-center justify-center gap-1 px-3 py-1.5 border-2 border-slate-300 hover:border-slate-400 focus-within:border-slate-600 rounded-lg bg-white/50 transition-colors">
                          {cfg.prefix && <span className="text-sm font-extrabold text-slate-800">{cfg.prefix}</span>}
                          <input
                            id={`calc-${cfg.key}`}
                            type="text"
                            aria-label={cfg.label.join(" ")}
                            value={displayValues[cfg.key] !== undefined ? displayValues[cfg.key] : cfg.format(values[cfg.key])}
                            onChange={(e) => handleInputChange(cfg.key, e.target.value)}
                            onFocus={(e) => e.target.select()}
                            onBlur={() => handleInputBlur(cfg.key)}
                            className={`${cfg.inputWidthSm} text-center text-sm font-extrabold text-slate-800 bg-transparent border-0 focus:ring-0 p-0 m-0`}
                          />
                          {cfg.suffix && <span className="text-sm font-extrabold text-slate-800">{cfg.suffix}</span>}
                        </div>
                      </div>
                      <Slider
                        value={[values[cfg.key]]}
                        min={cfg.min}
                        max={cfg.max}
                        step={cfg.step}
                        onValueChange={(value) => updateValue(cfg.key, value[0])}
                        orientation="horizontal"
                        className="w-full"
                        aria-label={cfg.label.join(" ")}
                        showTooltip
                        tooltipContent={cfg.tooltipFormat}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* ── Desktop: vertical sliders side by side ── */
                <div className="flex flex-1 min-h-0 justify-center gap-6 md:gap-10 lg:gap-14 w-full mt-2 mb-2">
                  {sliderConfigs.map((cfg) => (
                    <div key={cfg.key} className="flex flex-col items-center gap-3 h-full">
                      <Slider
                        value={[values[cfg.key]]}
                        min={cfg.min}
                        max={cfg.max}
                        step={cfg.step}
                        onValueChange={(value) => updateValue(cfg.key, value[0])}
                        orientation="vertical"
                        className="flex-1 min-h-0"
                        aria-label={cfg.label.join(" ")}
                        showTooltip
                        tooltipContent={cfg.tooltipFormat}
                      />
                      <div className="flex flex-col items-center h-20 justify-start">
                        <div className="flex items-center justify-center gap-1 px-3 py-1.5 border-2 border-slate-300 hover:border-slate-400 focus-within:border-slate-600 rounded-lg bg-white/50 transition-colors">
                          {cfg.prefix && <span className="text-xs sm:text-sm font-extrabold text-slate-800">{cfg.prefix}</span>}
                          <input
                            id={`calc-desktop-${cfg.key}`}
                            type="text"
                            aria-label={cfg.label.join(" ")}
                            value={displayValues[cfg.key] !== undefined ? displayValues[cfg.key] : cfg.format(values[cfg.key])}
                            onChange={(e) => handleInputChange(cfg.key, e.target.value)}
                            onFocus={(e) => e.target.select()}
                            onBlur={() => handleInputBlur(cfg.key)}
                            className={`${cfg.inputWidth} sm:${cfg.inputWidthSm} text-center text-xs sm:text-sm font-extrabold text-slate-800 bg-transparent border-0 focus:ring-0 p-0 m-0`}
                          />
                          {cfg.suffix && <span className="text-xs sm:text-sm font-extrabold text-slate-800">{cfg.suffix}</span>}
                        </div>
                        <Label htmlFor={`calc-desktop-${cfg.key}`} className="flex flex-col items-center text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                          {cfg.label.map((line) => <span key={line}>{line}</span>)}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-4 lg:pl-6 lg:border-l lg:border-slate-200 h-full">
              <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-center">
                <CardContent className="space-y-4 lg:space-y-6 pt-6 pb-6 px-4 lg:p-8 text-center">
                  <div>
                    <p className="text-sm lg:text-lg font-semibold text-slate-600">
                      New Monthly Payment
                    </p>
                    <p className="mt-1 lg:mt-2 text-4xl lg:text-5xl font-extrabold tracking-tight text-blue-700 whitespace-nowrap">
                      ${formatNumberWithCommas(results.estimatedNewPayment, 2)}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 lg:pt-6">
                    <p className="text-sm lg:text-lg text-slate-500">Monthly savings</p>
                    <p className={`mt-1 lg:mt-2 text-2xl lg:text-3xl font-bold whitespace-nowrap ${results.monthlySavings >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      ${formatNumberWithCommas(results.monthlySavings, 2)}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 lg:pt-6">
                    <p className="text-sm lg:text-lg text-slate-500">Interest savings</p>
                    <p className={`mt-1 lg:mt-2 text-2xl lg:text-3xl font-bold whitespace-nowrap ${results.interestSavings >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {results.interestSavings >= 0 ? '+' : ''} ${formatNumberWithCommas(Math.abs(results.interestSavings), 2)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <button
                onClick={() => setShowQuoteForm(true)}
                className="sm:hidden green-cta-pulse h-12 rounded-full text-white font-bold px-8 text-base whitespace-nowrap shadow-lg w-full"
              >
                Get My Refinance Quote
              </button>
              <Button
                variant="secondary"
                onClick={resetCalculator}
                className="h-12 lg:h-14 rounded-full bg-slate-100/50 text-base font-semibold text-slate-600 hover:bg-slate-200 w-full transition-transform hover:-translate-y-0.5"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Calculator
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
