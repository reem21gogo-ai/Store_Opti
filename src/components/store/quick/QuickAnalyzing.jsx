import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

const STEPS = {
  ar: [
    'نجمع إجاباتك الاثنتي عشرة',
    'نحسب ميلك المهني وفق نموذج RIASEC',
    'نطابق ملفك مع المسارات المهنية',
    'نجهّز ملفك المهني الأولي',
  ],
  en: [
    'Collecting your twelve answers',
    'Scoring your interests against RIASEC',
    'Matching your profile with career paths',
    'Preparing your preliminary profile',
  ],
};

/**
 * QuickAnalyzing — staged analysis screen shown after the last answer,
 * then hands control back to the funnel via `onDone`.
 */
export default function QuickAnalyzing({ lang = 'ar', isRTL = true, onDone }) {
  const t = (ar, en) => (lang === 'ar' ? ar : en);
  const steps = STEPS[lang === 'ar' ? 'ar' : 'en'];
  const [done, setDone] = useState(0);

  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    const timers = steps.map((_, i) => setTimeout(() => setDone(i + 1), 450 + i * 620));
    const finish = setTimeout(() => doneRef.current?.(), 450 + steps.length * 620 + 520);
    return () => { timers.forEach(clearTimeout); clearTimeout(finish); };
  }, [steps]);

  const percent = Math.round((done / steps.length) * 100);

  return (
    <div className="min-h-screen bg-corp-dark flex flex-col items-center justify-center px-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center mx-auto mb-5">
            <Loader2 size={26} className="text-brand-accent animate-spin" />
          </div>
          <h2 className="font-heading font-black text-white text-xl mb-2">
            {t('نبني ملفك المهني…', 'Building your career profile…')}
          </h2>
          <p className="text-white/40 text-sm">
            {t('لا تغلق الصفحة — نتيجتك على وشك الظهور', "Don't close this page — your result is almost ready")}
          </p>
        </div>

        <div className="space-y-2.5 mb-6">
          {steps.map((step, i) => {
            const complete = i < done;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-all ${
                  complete ? 'bg-white/10 border-white/15' : 'bg-white/[0.03] border-white/5'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    complete ? 'bg-brand-accent text-corp-dark' : 'bg-white/5 text-white/25'
                  }`}
                >
                  {complete ? <Check size={13} /> : <span className="text-xs font-bold">{i + 1}</span>}
                </span>
                <span className={`text-sm ${complete ? 'text-white' : 'text-white/35'}`}>{step}</span>
              </div>
            );
          })}
        </div>

        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #05E1AE, #4ca9fa)' }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-center text-xs text-white/35 mt-3 tabular-nums">{percent}%</p>
      </motion.div>
    </div>
  );
}