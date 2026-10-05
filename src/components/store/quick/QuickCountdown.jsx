import React from 'react';
import { Timer } from 'lucide-react';
import useOfferCountdown from '@/hooks/useOfferCountdown';

/**
 * QuickCountdown — urgency chip showing how long the visitor's discount stays valid.
 * `tone="dark"` for dark backgrounds, `tone="light"` for white surfaces.
 */
export default function QuickCountdown({ lang = 'ar', tone = 'dark' }) {
  const { minutes, seconds, urgent } = useOfferCountdown();
  const t = (ar, en) => (lang === 'ar' ? ar : en);
  const dark = tone === 'dark';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 ${
        dark ? 'bg-white/10 border border-white/15' : 'bg-red-50 border border-red-100'
      }`}
    >
      <Timer size={13} className={dark ? 'text-brand-accent' : 'text-red-500'} />
      <span className={`text-xs ${dark ? 'text-white/70' : 'text-slate-500'}`}>
        {t('صلاحية خصمك تنتهي خلال', 'Your discount is valid for')}
      </span>
      <span
        dir="ltr"
        className={`font-heading font-black text-sm tabular-nums ${
          urgent ? 'text-red-400' : dark ? 'text-white' : 'text-brand-primary'
        }`}
      >
        {minutes}:{seconds}
      </span>
    </div>
  );
}