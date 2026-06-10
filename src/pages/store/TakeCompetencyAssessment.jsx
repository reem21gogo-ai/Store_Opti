/**
 * TakeCompetencyAssessment — assessment player using real questions from competencyQuestions.js
 * Auto-saves answers to localStorage. Submits to CompetencyAssessmentAttempt entity.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import { base44 } from '@/api/base44Client';
import { getQuestionsForVersion } from '@/lib/competencyQuestions';
import { calculateScores, generateReportId, formatDate } from '@/lib/competencyScoring';

const TIMER_SECONDS = 25;
const SAVE_KEY      = 'optivance_assessment_answers';

export default function TakeCompetencyAssessment() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();

  const level         = searchParams.get('level')   || 'operational';
  const version       = searchParams.get('version') || 'quick';
  const assessmentLang = searchParams.get('lang') || 'ar';
  const isRTL         = assessmentLang === 'ar';
  const BackArrow     = isRTL ? ArrowRight : ArrowLeft;

  const questions = getQuestionsForVersion(version);
  const total     = questions.length;

  const [current,   setCurrent]   = useState(0);
  const [answers,   setAnswers]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); } catch { return {}; }
  });
  const [timeLeft,  setTimeLeft]  = useState(TIMER_SECONDS);
  const [selected,  setSelected]  = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef(null);

  const t = (ar, en) => assessmentLang === 'ar' ? ar : en;

  const goTo = useCallback((idx) => {
    if (idx >= total) { setShowConfirm(true); return; }
    if (idx < 0) return;
    setCurrent(idx);
    setSelected(answers[idx] || null);
    setTimeLeft(TIMER_SECONDS);
  }, [total, answers]);

  // Timer
  useEffect(() => {
    if (showConfirm || completed || loading) return;
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
  }, [current, goTo, showConfirm, completed, loading]);

  const handleSelect = (optionId) => {
    if (selected) return;
    setSelected(optionId);
    const newAnswers = { ...answers, [current]: optionId };
    setAnswers(newAnswers);
    localStorage.setItem(SAVE_KEY, JSON.stringify(newAnswers));
    clearInterval(timerRef.current);
    setTimeout(() => goTo(current + 1), 700);
  };

  const handleFinish = async () => {
    setCompleted(true);
    setLoading(true);

    const intake = (() => {
      try { return JSON.parse(localStorage.getItem('optivance_intake') || '{}'); } catch { return {}; }
    })();

    const { domain_scores, sub_competency_scores, overall_score, overall_band } = calculateScores(answers, questions);
    const reportId    = generateReportId();
    const completedAt = formatDate();

    const reportData = {
      report_id: reportId,
      language: assessmentLang,
      version,
      level,
      user: {
        name:              intake.fullName     || '',
        preferred_name:    intake.preferredName || intake.fullName?.split(' ')[0] || '',
        email:             intake.email        || '',
        professional_level: intake.professionalLevel || level,
        role:              intake.role         || '',
        motivation:        intake.customMotivation || intake.motivation || '',
        completion_date:   completedAt,
      },
      overall: { score: overall_score, band: overall_band },
      domain_scores,
      sub_competency_scores,
      answers_snapshot: answers,
      questions_count:  total,
    };

    const attemptData = {
      user_id:      (await base44.auth.me().catch(() => null))?.id || 'guest',
      user_email:   intake.email || '',
      user_name:    intake.fullName || '',
      assessment_id: `competency_${version}_${level}`,
      status:       'completed',
      answers:      answers,
      total_score:  overall_score,
      percentage:   overall_score,
      level,
      completed_at: new Date().toISOString(),
      report_data:  reportData,
    };

    localStorage.removeItem(SAVE_KEY);

    const attempt = await base44.entities.AssessmentAttempt.create(attemptData).catch(() => null);
    const id = attempt?.id || 'local';

    // save report data by id in localStorage for the report viewer
    localStorage.setItem(`optivance_report_${id}`, JSON.stringify(reportData));

    setTimeout(() => navigate(`/store/competency/report/${id}`), 800);
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
              {[0,1,2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: '#05E1AE', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirm submit modal
  if (showConfirm) {
    const answeredCount = Object.keys(answers).length;
    const unanswered    = total - answeredCount;
    return (
      <div className="min-h-screen bg-store-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <StoreNavbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
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

  const question    = questions[current];
  const timerPct    = (timeLeft / TIMER_SECONDS) * 100;
  const isWarning   = timeLeft <= 7;
  const radius      = 24;
  const circ        = 2 * Math.PI * radius;
  const dash        = (timerPct / 100) * circ;

  return (
    <div className="min-h-screen bg-store-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      <div className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">

          {/* Progress Header */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {questions.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
                  i < current ? 'flex-1 min-w-[8px]' : i === current ? 'flex-[2] min-w-[16px]' : 'flex-1 min-w-[8px]'
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
              initial={{ opacity:0, x: isRTL ? -30 : 30 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x: isRTL ? 30 : -30 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 mb-6">
              <h2 className="font-heading font-bold text-corp-dark text-lg leading-relaxed mb-7">
                {question.text[assessmentLang]}
              </h2>
              <div className="space-y-3">
                {question.options.map(opt => {
                  const isSelected = selected === opt.id;
                  return (
                    <motion.button key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      disabled={!!selected}
                      whileHover={!selected ? { scale: 1.01 } : {}}
                      whileTap={!selected ? { scale: 0.99 } : {}}
                      className={`w-full text-start p-4 rounded-xl border-2 transition-all ${
                        isSelected ? 'border-brand-primary bg-brand-primary/8 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                        <span className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-corp-dark' : 'text-slate-700'}`}>
                          {opt.text[assessmentLang]}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
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