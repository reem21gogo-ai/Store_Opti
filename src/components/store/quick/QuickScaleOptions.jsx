import React from 'react';
import { Check } from 'lucide-react';

/**
 * QuickScaleOptions — 5 large tap-friendly options, most liked first.
 * The selected state fills with the brand gradient for a satisfying tap.
 */
export default function QuickScaleOptions({ options = [], lang = 'ar', value, onSelect }) {
  const ordered = [...options].reverse();

  return (
    <div className="space-y-2.5">
      {ordered.map(option => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 text-start transition-all active:scale-[0.98] ${
              active
                ? 'border-transparent text-white shadow-lg shadow-brand-primary/20'
                : 'border-slate-100 bg-white hover:border-brand-primary/30 hover:bg-brand-primary/[0.02]'
            }`}
            style={active ? { background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' } : undefined}
          >
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                active ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'
              }`}
            >
              {option.value}
            </span>
            <span className={`text-sm font-semibold flex-1 ${active ? 'text-white' : 'text-corp-dark'}`}>
              {option[`label_${lang}`] || option.label_en}
            </span>
            {active && <Check size={16} className="text-white flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}