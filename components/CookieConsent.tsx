'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { hasConsent, setConsent } from '@/lib/consent';

function useHasConsent() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('consent-updated', callback);
      return () => window.removeEventListener('consent-updated', callback);
    },
    () => hasConsent(),
    () => true,
  );
}

export function CookieConsent() {
  const consentExists = useHasConsent();
  const [isDismissed, setIsDismissed] = useState(false);

  if (consentExists || isDismissed) return null;

  const handleAcceptAll = () => {
    setConsent({ functional: true, marketing: true });
    setIsDismissed(true);
  };

  const handleNecessaryOnly = () => {
    setConsent({ functional: false, marketing: false });
    setIsDismissed(true);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
      className="fixed bottom-0 inset-x-0 z-[9998] p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-lg text-gray-900 mb-1">
              We value your privacy
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use cookies and similar technologies for essential site functionality
              and analytics. You can accept all or choose necessary cookies only.{' '}
              <Link href="/privacy" className="text-dpe-blue hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleNecessaryOnly}
              className="px-6 py-3 rounded-xl border-2 border-dpe-navy text-dpe-navy font-semibold text-sm hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Necessary Only
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-6 py-3 bg-slate-950 text-white font-semibold text-sm hover:bg-slate-800 transition-colors w-full sm:w-auto"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
