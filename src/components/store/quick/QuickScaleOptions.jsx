import React from 'react';

/**
 * QuickScaleOptions — 5 large tap-friendly options (most liked first).
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
              active ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                active ? 'bg-brand-primary text-white' : 'bg-slate-50 text-slate-400'
              }`}
            >
              {option.value}
            </span>
            <span className={`text-sm font-semibold ${active ? 'text-brand-primary' : 'text-corp-dark'}`}>
              {option[`label_${lang}`] || option.label_en}
            </span>
          </button>
        );
      })}
    </div>
  );
}