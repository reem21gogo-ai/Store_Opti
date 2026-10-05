/**
 * TakeQuickCareerAssessment — mobile-first quick player.
 * One question per screen, live discount timer, progress nudges and a staged
 * analysis screen, then the unlock gate.
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { SCALES } from '@/lib/careerQuestions';
import { QUICK_QUESTIONS, QUICK_TOTAL, QUICK_SAVE_KEY, QUICK_PROFILE_KEY } from '@/lib/quickCareerQuestions';
import { buildQuickProfile } from '@/lib/quickCareerScoring';
import QuickProgress from '@/components/store/quick/QuickProgress';
import QuickScaleOptions from '@/components/store/quick/QuickScaleOptions';
import QuickAnalyzing from '@/components/store/quick/QuickAnalyzing';
import QuickCountdown from '@/components/store/quick/QuickCountdown';

const readAnswers = () => {
  try { return JSON.parse(localStorage.getItem(QUICK_SAVE_KEY) || '{}'); } catch { return {}; }
};

const NUDGES = {
  ar: [
    'بداية قوية — تابع، ملامح ميلك بدأت تتضح.',
    'أنت في منتصف الطريق — نتيجتك الأولية تقترب.',
    'اقتربت جدًا — بقيت أسئلة قليلة فقط.',
    'السؤال الأخير تقريبًا — نجهّز ملفك الآن.',
  ],
  en: [
    'Strong start — the shape of your profile is already forming.',
    'You are halfway there — your preliminary result is close.',
    'Almost done — only a few questions left.',
    'Last question — we are getting your profile ready.',
  ],
};

const nudgeFor = (index, total, lang) => {
  const ratio = index / total;
  const band = ratio < 0.25 ? 0 : ratio < 0.5 ? 1 : ratio < 0.8 ? 2 : 3;
  return NUDGES[lang === 'ar' ? 'ar' : 'en'][band];
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
      <QuickAnalyzing
        lang={lang}
        isRTL={isRTL}
        onDone={() => navigate('/store/career/quick/unlock', { replace: true })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-store-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top bar + urgency + progress */}
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
            <span className="text-xs font-semibold text-slate-400">{t('المقياس السريع', 'Quick Assessment')}</span>
            <span className="w-[18px]" />
          </div>

          <div className="flex justify-center mb-3">
            <QuickCountdown lang={lang} tone="light" />
          </div>

          <QuickProgress current={current + 1} total={QUICK_TOTAL} />

          <div className="flex items-center gap-1.5 mt-2.5">
            <Sparkles size={12} className="text-brand-accent flex-shrink-0" />
            <p className="text-[11px] text-slate-500 font-medium">{nudgeFor(current, QUICK_TOTAL, lang)}</p>
          </div>
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
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-heading font-black text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
                >
                  {current + 1}
                </span>
                <span className="text-xs text-slate-400">
                  {t(`من أصل ${QUICK_TOTAL} أسئلة`, `of ${QUICK_TOTAL} questions`)}
                </span>
              </div>

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
          {t('اختيارك ينقلك تلقائيًا للسؤال التالي — أجب بصدق', 'Your choice moves you straight on — answer honestly')}
        </span>
      </div>
    </div>
  );
}