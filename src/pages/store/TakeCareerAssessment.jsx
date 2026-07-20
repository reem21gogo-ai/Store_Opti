import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';
import StoreNavbar from '@/components/store/StoreNavbar';
import { ALL_QUESTIONS, SCALES, SECTION_ORDER, getQuestionsBySection, getSectionStartIndex } from '@/lib/careerQuestions';
import { SECTIONS, USER_STATUSES } from '@/lib/careerContent';
import { calculateCareerScores, getCompletionStats } from '@/lib/careerScoring';
import {
  ArrowLeft, ArrowRight, Save, CheckCircle2, AlertCircle,
  ChevronLeft, X, Loader2, FileCheck,
  Compass, Heart, Zap, Users, Star, Building2
} from 'lucide-react';

const SECTION_ICONS = { riasec: Compass, work_values: Heart, skills: Zap, personality: Users, strengths: Star, environment: Building2 };

const STORAGE_KEY = 'career_assessment_session';

export default function TakeCareerAssessment() {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('job_seeker');

  const tr = (ar, en) => (lang === 'ar' ? ar : en);
  const Back = isRTL ? ArrowRight : ArrowLeft;
  const Next = isRTL ? ArrowLeft : ArrowRight;

  // ── Load session ──
  useEffect(() => {
    const init = async () => {
      // Check auth
      const authed = await base44.auth.isAuthenticated();
      if (!authed) { navigate('/store/login?redirect=/store/career/assessment'); return; }
      const me = await base44.auth.me();
      setUser(me);

      // Load status
      const savedStatus = localStorage.getItem('career_status') || 'job_seeker';
      setStatus(savedStatus);

      // Load saved session
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const session = JSON.parse(saved);
          setAnswers(session.answers || {});
          setCurrentIdx(session.currentIdx || 0);
        } catch {}
      }
      setLoading(false);
    };
    init();
  }, [navigate]);

  // ── Autosave ──
  const saveSession = useCallback((ans, idx) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: ans, currentIdx: idx, savedAt: Date.now() }));
  }, []);

  useEffect(() => {
    if (!loading) saveSession(answers, currentIdx);
  }, [answers, currentIdx, loading, saveSession]);

  const question = ALL_QUESTIONS[currentIdx];
  const totalQuestions = ALL_QUESTIONS.length;
  const sectionId = question?.section;
  const section = SECTIONS.find(s => s.id === sectionId);
  const sectionQuestions = getQuestionsBySection(sectionId);
  const sectionStartIdx = getSectionStartIndex(sectionId);
  const questionInSection = currentIdx - sectionStartIdx + 1;
  const sectionProgress = Math.round((questionInSection / sectionQuestions.length) * 100);
  const overallProgress = Math.round(((currentIdx + 1) / totalQuestions) * 100);
  const isAnswered = !!answers[question?.id];

  const handleAnswer = (value, score) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: { value, score, timestamp: Date.now() },
    }));
  };

  const goNext = () => {
    if (!isAnswered) return;
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowReview(true);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const goToQuestion = (idx) => {
    setCurrentIdx(idx);
    setShowReview(false);
  };

  const saveAndExit = () => {
    saveSession(answers, currentIdx);
    navigate('/store/account');
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    try {
      const userProfile = {
        name: user?.full_name || user?.email || '—',
        email: user?.email || '',
        status,
        statusLabel: USER_STATUSES[status]?.[lang] || status,
        language: lang,
        completion_date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US'),
      };

      const reportData = calculateCareerScores(answers, userProfile);

      // Save to entity
      const attempt = await base44.entities.AssessmentAttempt.create({
        assessment_id: `career_${Date.now()}`,
        product_type: 'career_orientation',
        user_id: user?.id,
        user_email: user?.email,
        user_name: user?.full_name,
        status: 'completed',
        answers,
        current_question_index: totalQuestions,
        report_data: reportData,
        completed_at: new Date().toISOString(),
      });

      // Cache report data
      localStorage.setItem(`career_report_${attempt.id}`, JSON.stringify(reportData));
      // Clear session
      localStorage.removeItem(STORAGE_KEY);

      navigate(`/store/career/report/${attempt.id}`);
    } catch (err) {
      console.error(err);
      alert(tr('حدث خطأ. حاول مرة أخرى.', 'An error occurred. Please try again.'));
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-store-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  // ── REVIEW SCREEN ──
  if (showReview) {
    const stats = getCompletionStats(answers);
    return (
      <div className="min-h-screen bg-store-bg" dir={isRTL ? 'rtl' : 'ltr'}>
        <StoreNavbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="font-heading font-black text-2xl text-corp-dark mb-2 text-center">
            {tr('مراجعة الإجابات', 'Review Your Answers')}
          </h1>
          <p className="text-slate-500 text-sm text-center mb-8">
            {tr('راجع أقسامك قبل الإرسال النهائي', 'Review your sections before final submission')}
          </p>

          {/* Completion bar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-corp-dark">{tr('نسبة الإكمال', 'Completion')}</span>
              <span className="font-heading font-black text-2xl text-brand-primary">{stats.percentage}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full assessment-progress rounded-full transition-all" style={{ width: `${stats.percentage}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              {stats.answered} / {stats.total} {tr('سؤال مجاب', 'questions answered')}
            </p>
          </div>

          {/* Sections status */}
          <div className="space-y-3 mb-6">
            {SECTIONS.map((s, i) => {
              const secStats = stats.sections[s.id];
              const Icon = SECTION_ICONS[s.id];
              return (
                <div key={s.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    secStats.complete ? 'bg-brand-accent/15' : 'bg-amber-50'
                  }`}>
                    {secStats.complete ? <CheckCircle2 size={18} className="text-brand-accent" /> : <AlertCircle size={18} className="text-amber-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-heading font-bold text-corp-dark text-sm">{tr(s.name.ar, s.name.en)}</div>
                    <div className="text-xs text-slate-400">{secStats.answered} / {secStats.total} {tr('مجاب', 'answered')}</div>
                  </div>
                  <button onClick={() => goToQuestion(getSectionStartIndex(s.id))} className="text-xs text-brand-primary font-semibold hover:underline">
                    {tr('مراجعة', 'Review')}
                  </button>
                </div>
              );
            })}
          </div>

          {stats.answered < stats.total && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                {tr(`لديك ${stats.total - stats.answered} سؤال بدون إجابة. يمكنك مراجعتها أو الإرسال كما هو.`, `You have ${stats.total - stats.answered} unanswered questions. You can review them or submit as is.`)}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setShowReview(false)} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2">
              <Back size={16} /> {tr('رجوع', 'Back')}
            </button>
            <button onClick={submitAssessment} disabled={submitting} className="flex-1 btn-authority text-sm disabled:opacity-60">
              {submitting ? (
                <><Loader2 size={16} className="inline me-2 animate-spin" /> {tr('جاري الحساب...', 'Calculating...')}</>
              ) : (
                <><FileCheck size={16} className="inline me-2" /> {tr('إرسال وعرض النتائج', 'Submit & View Results')}</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTION SCREEN ──
  const renderQuestion = () => {
    if (!question) return null;

    // Scale questions (preference, importance, ability, agreement)
    if (question.type === 'scale_5') {
      const scale = SCALES[question.scale];
      const currentVal = answers[question.id]?.value;
      return (
        <div className="space-y-2.5">
          {scale.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-start ${
                currentVal === opt.value
                  ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                currentVal === opt.value ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
              }`}>
                {currentVal === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className={`text-sm font-medium ${currentVal === opt.value ? 'text-brand-primary' : 'text-slate-600'}`}>
                {tr(opt.label_ar, opt.label_en)}
              </span>
            </button>
          ))}
        </div>
      );
    }

    // Forced choice A/B
    if (question.type === 'forced_choice') {
      const currentVal = answers[question.id]?.value;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className={`p-5 rounded-2xl border-2 transition-all text-start min-h-[100px] flex items-center ${
                currentVal === opt.value
                  ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                  currentVal === opt.value ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300 text-slate-400'
                }`}>
                  {opt.value}
                </div>
                <span className={`text-sm font-medium leading-relaxed ${currentVal === opt.value ? 'text-brand-primary' : 'text-slate-600'}`}>
                  {tr(opt.label_ar, opt.label_en)}
                </span>
              </div>
            </button>
          ))}
        </div>
      );
    }

    // Situational
    if (question.type === 'situational') {
      const currentVal = answers[question.id]?.value;
      return (
        <div className="space-y-2.5">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value, opt.score)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-start ${
                currentVal === opt.value
                  ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                currentVal === opt.value ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
              }`}>
                {currentVal === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className={`text-sm font-medium ${currentVal === opt.value ? 'text-brand-primary' : 'text-slate-600'}`}>
                {tr(opt.label_ar, opt.label_en)}
              </span>
            </button>
          ))}
        </div>
      );
    }

    // Paired preference
    if (question.type === 'paired') {
      const currentVal = answers[question.id]?.value;
      return (
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className={`p-5 rounded-2xl border-2 transition-all text-center min-h-[100px] flex flex-col items-center justify-center ${
                currentVal === opt.value
                  ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold mb-2 ${
                currentVal === opt.value ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300 text-slate-400'
              }`}>
                {opt.value}
              </div>
              <span className={`text-sm font-medium ${currentVal === opt.value ? 'text-brand-primary' : 'text-slate-600'}`}>
                {tr(opt.label_ar, opt.label_en)}
              </span>
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-store-bg" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Top bar: section + save & exit */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
              {tr(section?.name.ar, section?.name.en)}
            </span>
            <span className="text-xs text-slate-400">
              {tr('سؤال', 'Q')} {questionInSection} / {sectionQuestions.length}
            </span>
          </div>
          <button onClick={saveAndExit} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-primary transition-colors">
            <Save size={13} /> {tr('حفظ وخروج', 'Save & Exit')}
          </button>
        </div>

        {/* Progress bars */}
        <div className="space-y-2 mb-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{tr('تقدم القسم', 'Section Progress')}</span>
              <span>{sectionProgress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full transition-all" style={{ width: `${sectionProgress}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{tr('التقدم الإجمالي', 'Overall Progress')}</span>
              <span>{overallProgress}% • {currentIdx + 1} / {totalQuestions}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full assessment-progress rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: isRTL ? -15 : 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 15 : -15 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary text-xs font-bold">{currentIdx + 1}</span>
                </div>
                <h2 className="font-heading font-bold text-corp-dark text-lg leading-relaxed pt-0.5">
                  {tr(question.question_ar, question.question_en || question.question_ar)}
                </h2>
              </div>
              {renderQuestion()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Back size={16} /> {tr('السابق', 'Previous')}
          </button>
          <button
            onClick={goNext}
            disabled={!isAnswered}
            className="flex items-center gap-2 btn-authority text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentIdx === totalQuestions - 1 ? tr('مراجعة', 'Review') : tr('التالي', 'Next')}
            <Next size={16} />
          </button>
        </div>
        {!isAnswered && (
          <p className="text-center text-xs text-slate-400 mt-3">
            {tr('يجب الإجابة قبل المتابعة', 'Answer required to continue')}
          </p>
        )}
      </div>
    </div>
  );
}