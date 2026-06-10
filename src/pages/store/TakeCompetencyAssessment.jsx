import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import { base44 } from '@/api/base44Client';

const QUESTIONS = [
  {
    id: 1,
    ar: 'عندما تواجه مشكلة معقدة في العمل، ما إجراؤك الأول؟',
    en: 'When faced with a complex work problem, what is your first action?',
    options: [
      { id: 'a', ar: 'أتصرف فوراً بناءً على خبرتي السابقة', en: 'Act immediately based on past experience', score: 25 },
      { id: 'b', ar: 'أحلل الوضع بعمق قبل أي قرار', en: 'Analyze the situation thoroughly before deciding', score: 80 },
      { id: 'c', ar: 'أستشير زملائي وأجمع آراءهم', en: 'Consult colleagues and gather opinions', score: 55 },
    ],
  },
  {
    id: 2,
    ar: 'كيف تتعامل مع تعارض الأولويات في العمل؟',
    en: 'How do you handle conflicting priorities at work?',
    options: [
      { id: 'a', ar: 'أنجز المهام حسب ترتيب ورودها', en: 'Complete tasks in the order they arrive', score: 30 },
      { id: 'b', ar: 'أصنّف المهام حسب الأهمية والإلحاح', en: 'Classify tasks by importance and urgency', score: 85 },
      { id: 'c', ar: 'أطلب من المدير تحديد الأولويات', en: 'Ask my manager to set priorities', score: 45 },
    ],
  },
  {
    id: 3,
    ar: 'كيف تتعامل مع خلافات الفريق؟',
    en: 'How do you handle team conflicts?',
    options: [
      { id: 'a', ar: 'أتجنب التدخل حفاظاً على العلاقات', en: 'Avoid involvement to preserve relationships', score: 20 },
      { id: 'b', ar: 'أعالجها مباشرة بحوار مفتوح وموضوعي', en: 'Address them directly with open dialogue', score: 85 },
      { id: 'c', ar: 'أحيلها للمدير للتدخل', en: 'Escalate to the manager', score: 40 },
    ],
  },
  {
    id: 4,
    ar: 'كيف تواجه الفشل أو الأخطاء في العمل؟',
    en: 'How do you face failures or mistakes at work?',
    options: [
      { id: 'a', ar: 'أشعر بالإحباط وأحتاج وقتاً لأتعافى', en: 'Feel frustrated and need time to recover', score: 25 },
      { id: 'b', ar: 'أتقبّله كفرصة للتعلم وأبحث عن دروس', en: 'Accept it as a learning opportunity', score: 90 },
      { id: 'c', ar: 'أمضي قدماً دون التوقف عنده كثيراً', en: 'Move forward without dwelling on it', score: 50 },
    ],
  },
  {
    id: 5,
    ar: 'كيف تبني علاقات عمل مع أشخاص مختلفين عنك؟',
    en: 'How do you build working relationships with people different from you?',
    options: [
      { id: 'a', ar: 'أتعامل مع الجميع بنفس الأسلوب', en: 'Treat everyone the same way', score: 35 },
      { id: 'b', ar: 'أتكيّف مع أسلوب كل شخص وأفهم دوافعه', en: 'Adapt my style and understand their motivations', score: 90 },
      { id: 'c', ar: 'أحافظ على علاقات مهنية رسمية فقط', en: 'Keep only formal professional relationships', score: 45 },
    ],
  },
];

const TIMER_SECONDS = 25;

export default function TakeCompetencyAssessment() {
  const { lang, isRTL } = useLang();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const level   = searchParams.get('level')   || 'operational';
  const version = searchParams.get('version') || 'quick';

  const questions = version === 'quick' ? QUESTIONS.slice(0, 3) : QUESTIONS;
  const total     = questions.length;

  const [current,   setCurrent]   = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [timeLeft,  setTimeLeft]  = useState(TIMER_SECONDS);
  const [selected,  setSelected]  = useState(null);   // highlighted answer before auto-advance
  const [completed, setCompleted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (idx >= total) { setCompleted(true); return; }
    setCurrent(idx);
    setSelected(null);
    setTimeLeft(TIMER_SECONDS);
  }, [total]);

  // Timer
  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-skip if no answer chosen
          setTimeout(() => goTo(current + 1), 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, goTo]);

  // Auto-advance after answer selected (600ms feedback delay)
  const handleSelect = (optionId) => {
    if (selected) return; // prevent double-tap
    setSelected(optionId);
    setAnswers(prev => ({ ...prev, [current]: optionId }));
    clearInterval(timerRef.current);
    setTimeout(() => goTo(current + 1), 700);
  };

  // Submit
  const handleFinish = async () => {
    setLoading(true);
    setTimeout(() => navigate('/store/competency/report/attempt123'), 1200);
  };

  // Completed screen (all questions done)
  useEffect(() => {
    if (completed && !loading) handleFinish();
  }, [completed]);

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
              {lang === 'ar' ? 'أحسنت! تم إكمال التقييم' : 'Well Done! Assessment Complete'}
            </h1>
            <p className="text-slate-500 text-sm mb-8">
              {lang === 'ar' ? 'جاري تحليل إجاباتك وإعداد تقريرك...' : 'Analyzing your answers and preparing your report...'}
            </p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: '#05E1AE', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[current];
  const progressPct = (current / total) * 100;
  const timerPct    = (timeLeft / TIMER_SECONDS) * 100;
  const isWarning   = timeLeft <= 7;

  // Circumference for SVG timer ring
  const radius = 24;
  const circ   = 2 * Math.PI * radius;
  const dash   = (timerPct / 100) * circ;

  return (
    <div className="min-h-screen bg-store-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      <div className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">

          {/* ── Progress Header ── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
            {/* Question dots */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i < current
                      ? 'flex-1 min-w-[8px]'
                      : i === current
                        ? 'flex-[2] min-w-[16px]'
                        : 'flex-1 min-w-[8px]'
                  }`}
                  style={{
                    background: i < current
                      ? '#05E1AE'
                      : i === current
                        ? 'linear-gradient(90deg, #1A3A5C, #05E1AE)'
                        : '#E5E7EB',
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-heading font-bold text-corp-dark text-sm">
                  {lang === 'ar'
                    ? `السؤال ${current + 1} من ${total}`
                    : `Question ${current + 1} of ${total}`}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ar'
                    ? `${total - current - 1} سؤال متبقٍ`
                    : `${total - current - 1} questions remaining`}
                </div>
              </div>

              {/* SVG Countdown Ring */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="4" />
                  <circle
                    cx="32" cy="32" r={radius}
                    fill="none"
                    stroke={isWarning ? '#FF5C35' : '#05E1AE'}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                    style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`font-heading font-black text-sm leading-none ${isWarning ? 'text-red-500' : 'text-corp-dark'}`}>
                    {timeLeft}
                  </span>
                  <span className="text-slate-400" style={{ fontSize: '8px' }}>
                    {lang === 'ar' ? 'ث' : 's'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Question Card ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 mb-6"
            >
              <h2 className="font-heading font-bold text-corp-dark text-lg leading-relaxed mb-7">
                {question[lang === 'ar' ? 'ar' : 'en']}
              </h2>

              <div className="space-y-3">
                {question.options.map(opt => {
                  const isSelected = selected === opt.id;
                  const wasAnswered = answers[current] !== undefined && !selected;
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      disabled={!!selected}
                      whileHover={!selected ? { scale: 1.01 } : {}}
                      whileTap={!selected ? { scale: 0.99 } : {}}
                      className={`w-full text-start p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary/8 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                        <span className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-corp-dark' : 'text-slate-700'}`}>
                          {opt[lang === 'ar' ? 'ar' : 'en']}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Back button only (next is auto) ── */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { clearInterval(timerRef.current); goTo(current - 1); }}
              disabled={current === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <BackArrow size={14} />
              {lang === 'ar' ? 'السابق' : 'Previous'}
            </button>

            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock size={11} />
              {lang === 'ar' ? 'يتقدم تلقائياً عند الاختيار' : 'Auto-advances on selection'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}