'use client';

import React from 'react';

interface PriceSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function PriceSlider({ 
  min, 
  max, 
  step, 
  value, 
  onChange, 
  className = '' 
}: PriceSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-3 bg-dpe-gray-300 rounded-none appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-dpe-green"
        style={{
          background: `linear-gradient(to right, #2DB843 0%, #2DB843 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
        aria-label="Vehicle price slider"
      />
      <div className="flex justify-between text-sm text-dpe-gray-500">
        <span>${min.toLocaleString()}</span>
        <span>${max.toLocaleString()}</span>
      </div>
    </div>
  );
}
