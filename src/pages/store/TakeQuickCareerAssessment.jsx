/**
 * TakeQuickCareerAssessment — mobile-first quick player.
 * One question per screen, large tap targets, auto-advance, then a brief
 * "analyzing" transition before the preliminary result.
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { SCALES } from '@/lib/careerQuestions';
import { QUICK_QUESTIONS, QUICK_TOTAL, QUICK_SAVE_KEY, QUICK_PROFILE_KEY } from '@/lib/quickCareerQuestions';
import { buildQuickProfile } from '@/lib/quickCareerScoring';
import QuickProgress from '@/components/store/quick/QuickProgress';
import QuickScaleOptions from '@/components/store/quick/QuickScaleOptions';

const readAnswers = () => {
  try { return JSON.parse(localStorage.getItem(QUICK_SAVE_KEY) || '{}'); } catch { return {}; }
};

export default function TakeQuickCareerAssessment() {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const t = (ar, en) => (lang === 'ar' ? ar : en);
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(readAnswers);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('quiz');
  const [direction, setDirection] = useState(1);
  const lockRef = useRef(false);

  const question = QUICK_QUESTIONS[current];

  const finish = (finalAnswers) => {
    const profile = buildQuickProfile(finalAnswers, lang);
    localStorage.setItem(QUICK_PROFILE_KEY, JSON.stringify(profile));
    setPhase('analyzing');
    setTimeout(() => navigate('/store/career/quick/result'), 1500);
  };

  const goTo = (index) => {
    if (index < 0) return;
    if (index >= QUICK_TOTAL) { finish(answers); return; }
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setSelected(answers[QUICK_QUESTIONS[index].id]?.value ?? null);
  };

  const handleSelect = (value) => {
    if (lockRef.current) return;
    lockRef.current = true;

    setSelected(value);
    const nextAnswers = { ...answers, [question.id]: { value, timestamp: Date.now() } };
    setAnswers(nextAnswers);
    localStorage.setItem(QUICK_SAVE_KEY, JSON.stringify(nextAnswers));

    setTimeout(() => {
      lockRef.current = false;
      if (current + 1 >= QUICK_TOTAL) finish(nextAnswers);
      else goTo(current + 1);
    }, 320);
  };

  if (phase === 'analyzing') {
    return (
      <div className="min-h-screen bg-corp-dark flex flex-col items-center justify-center px-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="w-7 h-7 rounded-full border-2 border-brand-accent/25 border-t-brand-accent"
            />
          </div>
          <h2 className="font-heading font-black text-white text-xl mb-2">
            {t('جاري تحليل ميولك المهنية…', 'Analyzing your career interests…')}
          </h2>
          <p className="text-white/40 text-sm">
            {t('لحظات قليلة ونعرض نتيجتك الأولية', 'Just a moment while we prepare your preliminary result')}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-store-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top bar + progress */}
      <div className="bg-white border-b border-slate-100 px-5 py-3.5">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/store/career/quick')}
              className="p-1.5 -m-1.5 text-slate-400 hover:text-corp-dark transition-colors"
              aria-label={t('إغلاق', 'Close')}
            >
              <X size={18} />
            </button>
            <span className="text-xs font-semibold text-slate-400">
              {t('المقياس السريع', 'Quick Assessment')}
            </span>
            <span className="w-[18px]" />
          </div>
          <QuickProgress current={current + 1} total={QUICK_TOTAL} />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-5 py-8">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <h1 className="font-heading font-black text-corp-dark text-xl sm:text-2xl leading-snug mb-7">
                {question[`question_${lang}`] || question.question_en}
              </h1>

              <QuickScaleOptions
                options={SCALES[question.scale] || SCALES.preference}
                lang={lang}
                value={selected}
                onSelect={handleSelect}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-7">
            {current > 0 ? (
              <button
                onClick={() => goTo(current - 1)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-brand-primary text-sm transition-colors"
              >
                <BackArrow size={14} />
                {t('السابق', 'Previous')}
              </button>
            ) : <span />}

            {selected && (
              <button
                onClick={() => goTo(current + 1)}
                className="flex items-center gap-1 text-brand-primary text-sm font-semibold"
              >
                {t('التالي', 'Next')}
                <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-6 text-center">
        <span className="text-slate-300 text-xs">
          {t('أجب بصدق — لا توجد إجابة صحيحة أو خاطئة', 'Answer honestly — there are no right or wrong answers')}
        </span>
      </div>
    </div>
  );
}