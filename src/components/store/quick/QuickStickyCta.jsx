import React from 'react';
import { Play } from 'lucide-react';
import { OFFER, currencyLabel } from '@/lib/quickCareerOffer';
import useOfferCountdown from '@/hooks/useOfferCountdown';

/**
 * QuickStickyCta — mobile-only bar that keeps the price and the timer in view
 * while the visitor scrolls the ad page.
 */
export default function QuickStickyCta({ lang = 'ar', onStart }) {
  const { minutes, seconds } = useOfferCountdown();
  const t = (ar, en) => (lang === 'ar' ? ar : en);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-slate-100 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-col leading-tight flex-shrink-0">
          <span className="text-[10px] text-slate-400 line-through tabular-nums">{OFFER.regularPrice}</span>
          <span className="font-heading font-black text-corp-dark text-base tabular-nums">
            {OFFER.offerPrice}
            <span className="text-[10px] font-medium text-slate-400"> {currencyLabel(lang)}</span>
          </span>
        </div>
        <button
          onClick={onStart}
          className="flex-1 py-3.5 rounded-xl font-heading font-black text-sm flex items-center justify-center gap-2 text-white transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
        >
          <Play size={15} fill="currentColor" />
          {t('ابدأ مجانًا الآن', 'Start free now')}
        </button>
        <span dir="ltr" className="text-xs font-black text-red-500 tabular-nums w-11 text-center flex-shrink-0">
          {minutes}:{seconds}
        </span>
      </div>
    </div>
  );
}