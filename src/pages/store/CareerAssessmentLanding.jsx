import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { PRODUCT_INFO, USER_STATUSES, SECTIONS, COMPLETION_TIPS } from '@/lib/careerContent';
import { ALL_QUESTIONS } from '@/lib/careerQuestions';
import {
  Compass, Heart, Zap, Users, Star, Building2,
  ArrowLeft, ArrowRight, CheckCircle2, Clock, Save, FileText,
  Sparkles, Target, BookOpen, AlertCircle, ChevronLeft
} from 'lucide-react';

const SECTION_ICONS = { riasec: Compass, work_values: Heart, skills: Zap, personality: Users, strengths: Star, environment: Building2 };

export default function CareerAssessmentLanding() {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState('');

  const tr = (ar, en) => (lang === 'ar' ? ar : en);
  const Back = isRTL ? ArrowRight : ArrowLeft;
  const Next = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (a) => {
      setAuthed(a);
      if (a) setUser(await base44.auth.me());
    });
    // Restore saved status
    const saved = localStorage.getItem('career_status');
    if (saved) setStatus(saved);
  }, []);

  const startAssessment = () => {
    if (!authed) { navigate('/store/login?redirect=/store/career'); return; }
    localStorage.setItem('career_status', status);
    localStorage.setItem('career_lang', lang);
    navigate('/store/career/assessment');
  };

  const steps = [
    // ── Screen 1: Intro ──
    {
      title: PRODUCT_INFO.name_ar,
      subtitle: PRODUCT_INFO.subtitle_ar,
      content: (
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles size={14} /> {tr('منتج Optivance الجديد', 'New Optivance Product')}
          </div>
          <h1 className="font-heading font-black text-3xl md:text-4xl text-corp-dark mb-4 leading-tight">
            {tr(PRODUCT_INFO.name_ar, PRODUCT_INFO.name_en)}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8">
            {tr(PRODUCT_INFO.subtitle_ar, PRODUCT_INFO.subtitle_en)}
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            {[
              { icon: FileText, val: '150', label: tr('سؤال', 'Questions') },
              { icon: Target, val: '6', label: tr('أبعاد', 'Dimensions') },
              { icon: Clock, val: '40-45', label: tr('دقيقة', 'Minutes') },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                  <Icon size={20} className="text-brand-primary mx-auto mb-2" />
                  <div className="font-heading font-black text-xl text-corp-dark">{s.val}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setStep(1)} className="btn-authority text-sm px-8 py-3.5">
            {tr('ابدأ الآن', 'Get Started')} <Next size={16} className="inline ms-2" />
          </button>
        </div>
      ),
    },
    // ── Screen 2: Status Selection ──
    {
      title: tr('ما الذي يصف وضعك الحالي؟', 'What Best Describes Your Current Status?'),
      subtitle: tr('هذا يساعدنا في تخصيص التوصيات وخطة العمل المناسبة لك.', 'This helps us personalize recommendations and your action plan.'),
      content: (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-3">
            {Object.entries(USER_STATUSES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setStatus(key); localStorage.setItem('career_status', key); }}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-start ${
                  status === key
                    ? 'border-brand-primary bg-brand-primary/5 shadow-md'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  status === key ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
                }`}>
                  {status === key && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <span className={`font-heading font-bold text-base ${status === key ? 'text-brand-primary' : 'text-corp-dark'}`}>
                  {tr(val.ar, val.en)}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(0)} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2">
              <Back size={16} /> {tr('رجوع', 'Back')}
            </button>
            <button
              onClick={() => status && setStep(2)}
              disabled={!status}
              className="flex-1 btn-authority text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tr('التالي', 'Next')} <Next size={16} className="inline ms-2" />
            </button>
          </div>
        </div>
      ),
    },
    // ── Screen 3: Info ──
    {
      title: tr('معلومات عن المقياس', 'About This Assessment'),
      subtitle: '',
      content: (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            {[
              { icon: FileText, text: tr('150 سؤال تغطي 6 أبعاد مهنية', '150 questions covering 6 career dimensions') },
              { icon: Clock, text: tr('وقت الإكمال المقدر: 40-45 دقيقة', 'Estimated completion time: 40-45 minutes') },
              { icon: Save, text: tr('حفظ تلقائي بعد كل إجابة', 'Automatic saving after each response') },
              { icon: ArrowLeft, text: tr('إمكانية الخروج والعودة لاحقاً', 'Ability to exit and resume later') },
              { icon: FileText, text: tr('تقرير PDF مخصص قابل للتحميل', 'Personalized downloadable PDF report') },
              { icon: Target, text: tr('مسارات مهنية مطابقة وخطة 90 يوم', 'Career matches and a 90-day action plan') },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-brand-primary" />
                  </div>
                  <span className="text-slate-600 text-sm">{item.text}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2">
              <Back size={16} /> {tr('رجوع', 'Back')}
            </button>
            <button onClick={() => setStep(3)} className="flex-1 btn-authority text-sm">
              {tr('التالي', 'Next')} <Next size={16} className="inline ms-2" />
            </button>
          </div>
        </div>
      ),
    },
    // ── Screen 4: Tips ──
    {
      title: tr('نصائح قبل البدء', 'Tips Before You Begin'),
      subtitle: '',
      content: (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="space-y-3">
              {(lang === 'ar' ? COMPLETION_TIPS.ar : COMPLETION_TIPS.en).map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-accent text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-slate-600 text-sm leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2">
              <Back size={16} /> {tr('رجوع', 'Back')}
            </button>
            <button onClick={() => setStep(4)} className="flex-1 btn-authority text-sm">
              {tr('التالي', 'Next')} <Next size={16} className="inline ms-2" />
            </button>
          </div>
        </div>
      ),
    },
    // ── Screen 5: Sections Overview ──
    {
      title: tr('أقسام المقياس', 'Assessment Sections'),
      subtitle: tr('6 أقسام تغطي جميع أبعاد ميولك المهنية', '6 sections covering all dimensions of your career orientation'),
      content: (
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {SECTIONS.map((s, i) => {
              const Icon = SECTION_ICONS[s.id] || BookOpen;
              return (
                <div key={s.id} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                      <span className="font-heading font-bold text-corp-dark text-sm">{tr(s.name.ar, s.name.en)}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    {s.questionCount} {tr('سؤال', 'Q')}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              {tr(
                'هذا المقياس أداة إرشادية وتطويرية ولا يقدم تشخيصاً طبياً أو نفسياً أو توظيفياً.',
                'This assessment is a guidance and development tool and does not provide medical, psychological, or recruitment diagnosis.'
              )}
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(3)} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2">
              <Back size={16} /> {tr('رجوع', 'Back')}
            </button>
            <button onClick={startAssessment} className="flex-1 btn-authority text-sm">
              {tr('ابدأ المقياس', 'Start Assessment')} <Next size={16} className="inline ms-2" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen bg-store-bg" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-brand-primary' : i < step ? 'w-4 bg-brand-primary/40' : 'w-4 bg-slate-200'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {current.title && (
              <div className="text-center mb-8">
                <h2 className="font-heading font-black text-2xl md:text-3xl text-corp-dark mb-2">{current.title}</h2>
                {current.subtitle && <p className="text-slate-500 text-sm md:text-base">{current.subtitle}</p>}
              </div>
            )}
            {current.content}
          </motion.div>
        </AnimatePresence>
      </div>
      <StoreFooter />
    </div>
  );
}