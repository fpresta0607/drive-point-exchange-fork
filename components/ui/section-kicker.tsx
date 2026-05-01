import type { ReactNode } from 'react';

interface SectionKickerProps {
  children: ReactNode;
  align?: 'left' | 'center';
  tone?: 'green' | 'white';
  className?: string;
}

export function SectionKicker({
  children,
  align = 'center',
  tone = 'green',
  className = '',
}: SectionKickerProps) {
  const barColor = tone === 'green' ? 'bg-dpe-green' : 'bg-white';
  const textColor = tone === 'green' ? 'text-dpe-green' : 'text-white/80';
  const wrapperLayout =
    align === 'center'
      ? 'flex items-center justify-center'
      : 'inline-flex items-center';

  return (
    <div className={`${wrapperLayout} gap-3 mb-4 ${className}`}>
      <span
        aria-hidden
        className={`block w-0.5 h-4 ${barColor}`}
      />
      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${textColor}`}
      >
        {children}
      </span>
    </div>
  );
}
