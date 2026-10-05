import React from 'react';
import { Lock } from 'lucide-react';
import { RIASEC_TYPES } from '@/lib/careerContent';

const ORDER = ['R', 'I', 'A', 'S', 'E', 'C'];

/**
 * QuickLockedPreview — blurred mock of the paid report with a lock overlay.
 * Creates the curiosity gap that the ad funnel converts on.
 */
export default function QuickLockedPreview({ lang = 'ar', title, note }) {
  const t = (ar, en) => (lang === 'ar' ? ar : en);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-100 bg-white">
      <div className="blur-[6px] select-none pointer-events-none p-6" aria-hidden="true">
        <div className="flex items-center justify-between mb-5">
          <span className="font-heading font-black text-corp-dark text-sm">
            {t('تقرير الميول المهنية', 'Career Interest Report')}
          </span>
          <span className="text-[10px] text-slate-400">9 {t('صفحات', 'pages')}</span>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs text-slate-400">{t('رمز هولاند', 'Holland Code')}</span>
          <span className="font-heading font-black text-2xl text-corp-dark tracking-[0.3em]" dir="ltr">IAS</span>
        </div>

        <div className="space-y-3">
          {ORDER.slice(0, 4).map((code, i) => (
            <div key={code} className="flex items-center gap-3">
              <span className="w-12 h-2 rounded-full" style={{ backgroundColor: RIASEC_TYPES[code].color }} />
              <div className="flex-1 h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${45 + i * 12}%`, backgroundColor: RIASEC_TYPES[code].color }}
                />
              </div>
              <span className="text-xs text-slate-300 tabular-nums">{90 - i * 9}%</span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-50 space-y-2">
          <span className="block h-2 w-3/4 rounded-full bg-slate-100" />
          <span className="block h-2 w-2/3 rounded-full bg-slate-100" />
          <span className="block h-2 w-4/5 rounded-full bg-slate-100" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-white/25 flex flex-col items-center justify-end px-6 pb-6 text-center">
        <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-3">
          <Lock size={18} className="text-brand-primary" />
        </div>
        <p className="font-heading font-bold text-corp-dark text-sm mb-1">{title}</p>
        <p className="text-slate-500 text-xs leading-relaxed max-w-[17rem]">{note}</p>
      </div>
    </div>
  );
}