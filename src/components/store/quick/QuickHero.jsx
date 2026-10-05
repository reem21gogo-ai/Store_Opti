import React from 'react';
import { motion } from 'framer-motion';
import { Play, ListChecks, Timer, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { QUICK_TOTAL } from '@/lib/quickCareerQuestions';
import QuickCountdown from '@/components/store/quick/QuickCountdown';

/**
 * QuickHero — one tight screen: the promise, the button, and the facts.
 * Sized so the CTA is visible on a phone without scrolling.
 */
export default function QuickHero({ lang = 'ar', onStart }) {
  const t = (ar, en) => (lang === 'ar' ? ar : en);

  const facts = [
    { icon: ListChecks, label: t(`${QUICK_TOTAL} سؤالًا`, `${QUICK_TOTAL} questions`) },
    { icon: Timer, label: t('أقل من دقيقتين', 'Under two minutes') },
    { icon: Zap, label: t('نتيجة فورية', 'Instant result') },
    { icon: ShieldCheck, label: t('بدون تسجيل', 'No sign-up') },
  ];

  return (
    <section
      className="px-5 pt-8 pb-10 sm:pt-12 sm:pb-14"
      style={{ background: 'linear-gradient(150deg, #0D1F33, #1A3A5C 60%, #326EA3)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg mx-auto text-center"
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-accent/15 border border-brand-accent/25 mb-5">
          <Sparkles size={13} className="text-brand-accent" />
          <span className="text-brand-accent text-xs font-semibold">
            {t('مجاني تمامًا — بدون تسجيل', 'Completely free — no sign-up')}
          </span>
        </span>

        <h1 className="font-heading font-black text-white text-2xl sm:text-4xl leading-tight mb-3">
          {t('هل تعمل في المجال الذي يناسبك فعلًا؟', 'Are you really working in the field that fits you?')}
        </h1>

        <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-7">
          {t(
            'اكتشف ميلك المهني الحقيقي في أقل من دقيقتين — أسئلة واضحة، واختيار واحد لكل سؤال.',
            'Find your real career interest in under two minutes — clear questions, one choice each.'
          )}
        </p>

        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-heading font-black text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #05E1AE, #4ca9fa)', color: '#0D1F33' }}
        >
          <Play size={17} fill="currentColor" />
          {t('ابدأ الاختبار الآن', 'Start the test now')}
        </button>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-5">
          {facts.map((fact, i) => {
            const Icon = fact.icon;
            return (
              <span key={i} className="flex items-center gap-1.5 text-white/55 text-xs">
                <Icon size={12} className="text-brand-accent" />
                {fact.label}
              </span>
            );
          })}
        </div>

        <div className="flex justify-center mt-5">
          <QuickCountdown lang={lang} tone="dark" />
        </div>
      </motion.div>
    </section>
  );
}