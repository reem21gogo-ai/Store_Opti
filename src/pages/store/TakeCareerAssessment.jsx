/**
 * TakeCareerAssessment — timed assessment player mirroring TakeCompetencyAssessment.
 * 25-second timer per question with auto-transition, auto-advance on selection,
 * progress bar, timer ring, section icons, confirm modal, completion screen.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import { base44 } from '@/api/base44Client';
import { ALL_QUESTIONS, SCALES } from '@/lib/careerQuestions';
import { SECTIONS, USER_STATUSES } from '@/lib/careerContent';
import { calculateCareerScores } from '@/lib/careerScoring';
import {
  Compass, Heart, Zap, Users, Star, Building2,
} from 'lucide-react';

const SECTION_ICONS = { riasec: Compass, work_values: Heart, skills: Zap, personality: Users, strengths: Star, environment: Building2 };

const TIMER_SECONDS = 25;
const SAVE_KEY = 'career_assessment_answers';

export default function TakeCareerAssessment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const assessmentLang = (() => {
    const urlLang = searchParams.get('lang');
    if (urlLang) return urlLang;
    try { return JSON.parse(localStorage.getItem('career_intake') || '{}').assessmentLang || 'ar'; } catch { return 'ar'; }
  })();
  const isRTL = assessmentLang === 'ar';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const total = ALL_QUESTIONS.length;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); } catch { return {}; }
  });
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const timerRef = useRef(null);

  const t = (ar, en) => assessmentLang === 'ar' ? ar : en;

  const question = ALL_QUESTIONS[current];
  const sectionId = question?.section;
  const section = SECTIONS.find(s => s.id === sectionId);
  const SectionIcon = SECTION_ICONS[sectionId] || Compass;

  const goTo = useCallback((idx) => {
    if (idx >= total) { setShowConfirm(true); return; }
    if (idx < 0) return;
    setCurrent(idx);
    setSelected(answers[idx] ? answers[idx].value : null);
    setTimeLeft(TIMER_SECONDS);
  }, [total, answers]);

  // Auth check
  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) { navigate('/store/login?redirect=/store/career/intake'); return; }
      setAuthChecked(true);
    });
  }, [navigate]);

  // Timer
  useEffect(() => {
    if (!authChecked || showConfirm || completed || loading) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimeout(() => goTo(current + 1), 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, goTo, showConfirm, completed, loading, authChecked]);

  const handleSelect = (value, score) => {
    if (selected) return;
    setSelected(value);
    const newAnswers = { ...answers, [question.id]: { value, score, timestamp: Date.now() } };
    setAnswers(newAnswers);
    localStorage.setItem(SAVE_KEY, JSON.stringify(newAnswers));
    clearInterval(timerRef.current);
    setTimeout(() => goTo(current + 1), 700);
  };

  const handleFinish = async () => {
    setCompleted(true);
    setLoading(true);

    const intake = (() => {
      try { return JSON.parse(localStorage.getItem('career_intake') || '{}'); } catch { return {}; }
    })();

    const me = await base44.auth.me().catch(() => null);
    const userProfile = {
      name: intake.fullName || me?.full_name || '—',
      preferred_name: intake.preferredName || intake.fullName?.split(' ')[0] || '',
      email: intake.email || me?.email || '',
      status: intake.status || 'job_seeker',
      statusLabel: USER_STATUSES[intake.status]?.[assessmentLang] || intake.status || '',
      motivation: intake.customMotivation || intake.motivation || '',
      language: assessmentLang,
      completion_date: new Date().toLocaleDateString(assessmentLang === 'ar' ? 'ar-SA' : 'en-US'),
    };

    const reportData = calculateCareerScores(answers, userProfile);

    const attemptData = {
      assessment_id: `career_${Date.now()}`,
      product_type: 'career_orientation',
      user_id: me?.id || 'guest',
      user_email: intake.email || me?.email || '',
      user_name: intake.fullName || me?.full_name || '',
      status: 'completed',
      answers,
      current_question_index: total,
      report_data: reportData,
      completed_at: new Date().toISOString(),
    };

    localStorage.removeItem(SAVE_KEY);

    const attempt = await base44.entities.AssessmentAttempt.create(attemptData).catch(() => null);
    const id = attempt?.id || 'local';

    localStorage.setItem(`career_report_${id}`, JSON.stringify(reportData));

    setTimeout(() => navigate(`/store/career/report/${id}`), 800);
  };

  // Loading screen
  if (loading || completed) {
    return (
      <div className="min-h-screen bg-store-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <StoreNavbar />
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(5,225,174,0.1)' }}>
                <CheckCircle2 size={40} style={{ color: '#05E1AE' }} />
              </div>
            </div>
            <h1 className="font-heading font-black text-corp-dark text-2xl mb-3">
              {t('أحسنت! تم إكمال المقياس', 'Well Done! Assessment Complete')}
            </h1>
            <p className="text-slate-500 text-sm mb-8">
              {t('جاري تحليل إجاباتك وإعداد تقريرك الشخصي...', 'Analyzing your answers and generating your personalized report...')}
            </p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: '#05E1AE', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-store-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Confirm submit modal
  if (showConfirm) {
    const answeredCount = Object.keys(answers).length;
    const unanswered = total - answeredCount;
    return (
      <div className="min-h-screen bg-store-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <StoreNavbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={28} className="text-brand-primary" />
            </div>
            <h2 className="font-heading font-black text-corp-dark text-xl mb-3">
              {t('هل أنت مستعد للإرسال؟', 'Ready to Submit?')}
            </h2>
            <p className="text-slate-500 text-sm mb-2">
              {t(`أجبت على ${answeredCount} من ${total} سؤال`, `You answered ${answeredCount} of ${total} questions`)}
            </p>
            {unanswered > 0 && (
              <p className="text-amber-600 text-xs mb-5">
                {t(`${unanswered} سؤال لم تُجب عليه — سيُحسب بدون نقاط`, `${unanswered} unanswered — will count as zero`)}
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowConfirm(false); setCurrent(total - 1); setTimeLeft(TIMER_SECONDS); }}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all">
                {t('مراجعة الإجابات', 'Review Answers')}
              </button>
              <button onClick={handleFinish}
                className="flex-1 py-3 rounded-xl font-heading font-bold text-white text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#1A3A5C,#05E1AE)' }}>
                {t('إرسال التقرير', 'Submit & Get Report')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const isWarning = timeLeft <= 7;
  const radius = 24;
  const circ = 2 * Math.PI * radius;
  const dash = (timerPct / 100) * circ;

  // ── Render question options by type ──
  const renderOptions = () => {
    if (!question) return null;
    const currentVal = answers[question.id]?.value;

    // Scale questions
    if (question.type === 'scale_5') {
      const scale = SCALES[question.scale];
      return (
        <div className="space-y-3">
          {scale.map((opt) => {
            const isSelected = currentVal === opt.value;
            return (
              <motion.button key={opt.value}
                onClick={() => handleSelect(opt.value)}
                disabled={!!selected}
                whileHover={!selected ? { scale: 1.01 } : {}}
                whileTap={!selected ? { scale: 0.99 } : {}}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-start ${
                  isSelected ? 'border-brand-primary bg-brand-primary/8 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
                <span className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-corp-dark' : 'text-slate-700'}`}>
                  {t(opt.label_ar, opt.label_en)}
                </span>
              </motion.button>
            );
          })}
        </div>
      );
    }

    // Forced choice A/B
    if (question.type === 'forced_choice') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((opt) => {
            const isSelected = currentVal === opt.value;
            return (
              <motion.button key={opt.value}
                onClick={() => handleSelect(opt.value)}
                disabled={!!selected}
                whileHover={!selected ? { scale: 1.01 } : {}}
                whileTap={!selected ? { scale: 0.99 } : {}}
                className={`p-5 rounded-xl border-2 transition-all text-start min-h-[100px] flex items-center ${
                  isSelected ? 'border-brand-primary bg-brand-primary/8 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300 text-slate-400'
                  }`}>
                    {opt.value}
                  </div>
                  <span className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-corp-dark' : 'text-slate-700'}`}>
                    {t(opt.label_ar, opt.label_en)}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      );
    }

    // Situational
    if (question.type === 'situational') {
      return (
        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = currentVal === opt.value;
            return (
              <motion.button key={opt.value}
                onClick={() => handleSelect(opt.value, opt.score)}
                disabled={!!selected}
                whileHover={!selected ? { scale: 1.01 } : {}}
                whileTap={!selected ? { scale: 0.99 } : {}}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-start ${
                  isSelected ? 'border-brand-primary bg-brand-primary/8 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
                <span className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-corp-dark' : 'text-slate-700'}`}>
                  {t(opt.label_ar, opt.label_en)}
                </span>
              </motion.button>
            );
          })}
        </div>
      );
    }

    // Paired preference
    if (question.type === 'paired') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt) => {
            const isSelected = currentVal === opt.value;
            return (
              <motion.button key={opt.value}
                onClick={() => handleSelect(opt.value)}
                disabled={!!selected}
                whileHover={!selected ? { scale: 1.01 } : {}}
                whileTap={!selected ? { scale: 0.99 } : {}}
                className={`p-5 rounded-xl border-2 transition-all text-center min-h-[100px] flex flex-col items-center justify-center ${
                  isSelected ? 'border-brand-primary bg-brand-primary/8 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold mb-2 transition-all ${
                  isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300 text-slate-400'
                }`}>
                  {opt.value}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-corp-dark' : 'text-slate-700'}`}>
                  {t(opt.label_ar, opt.label_en)}
                </span>
              </motion.button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-store-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      <div className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">

          {/* Progress Header */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
            {/* Section badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                <SectionIcon size={16} className="text-brand-primary" />
              </div>
              <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                {t(section?.name.ar, section?.name.en)}
              </span>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1 mb-4 overflow-hidden">
              {ALL_QUESTIONS.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
                  i < current ? 'flex-1 min-w-[4px]' : i === current ? 'flex-[2] min-w-[12px]' : 'flex-1 min-w-[4px]'
                }`} style={{
                  background: i < current ? '#05E1AE' : i === current ? 'linear-gradient(90deg,#1A3A5C,#05E1AE)' : '#E5E7EB',
                }} />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-heading font-bold text-corp-dark text-sm">
                  {t(`السؤال ${current + 1} من ${total}`, `Question ${current + 1} of ${total}`)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {t(`${total - current - 1} سؤال متبقٍ`, `${total - current - 1} remaining`)}
                </div>
              </div>
              {/* Timer ring */}
              <div className="relative flex-shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="4" />
                  <circle cx="32" cy="32" r={radius} fill="none"
                    stroke={isWarning ? '#EF4444' : '#05E1AE'}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                    style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`font-heading font-black text-sm leading-none ${isWarning ? 'text-red-500' : 'text-corp-dark'}`}>{timeLeft}</span>
                  <span className="text-slate-400" style={{ fontSize: '8px' }}>{t('ث', 's')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 mb-6">
              <div className="flex items-start gap-3 mb-7">
                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary text-xs font-bold">{current + 1}</span>
                </div>
                <h2 className="font-heading font-bold text-corp-dark text-lg leading-relaxed pt-0.5">
                  {t(question.question_ar, question.question_en || question.question_ar)}
                </h2>
              </div>
              {renderOptions()}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-between">
            <button onClick={() => { clearInterval(timerRef.current); goTo(current - 1); }}
              disabled={current === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <BackArrow size={14} />
              {t('السابق', 'Previous')}
            </button>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock size={11} />
              {t('ينتقل تلقائياً عند الاختيار', 'Auto-advances on selection')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}