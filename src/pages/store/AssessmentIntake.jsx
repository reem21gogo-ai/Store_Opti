/**
 * AssessmentIntake — collects user profile data before starting the competency assessment.
 * Saves info to localStorage so report can use it. Language is fixed here (chosen by user).
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Target, ArrowLeft, ArrowRight, Globe, ChevronRight } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

const PROFESSIONAL_LEVELS = [
  { id: 'operational',  ar: 'تشغيلي',  en: 'Operational'  },
  { id: 'specialist',   ar: 'متخصص',   en: 'Specialist'   },
  { id: 'supervisory',  ar: 'إشرافي',  en: 'Supervisory'  },
  { id: 'managerial',   ar: 'مدير',    en: 'Manager'      },
  { id: 'leadership',   ar: 'قيادي',   en: 'Leadership'   },
];

const MOTIVATIONS = {
  ar: ['التطوير الشخصي', 'متطلبات الترقية', 'توصية من المدير', 'الفضول المهني', 'التحضير لمسار جديد'],
  en: ['Personal development', 'Promotion requirements', 'Manager recommendation', 'Professional curiosity', 'Preparing for a new path'],
};

export default function AssessmentIntake() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const version = searchParams.get('version') || 'quick';
  const level   = searchParams.get('level')   || 'operational';

  const [assessmentLang, setAssessmentLang] = useState('ar');
  const isRTL = assessmentLang === 'ar';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const [form, setForm] = useState({
    fullName: '', preferredName: '', email: '',
    professionalLevel: level,
    motivation: '', customMotivation: '', role: '',
  });
  const [user, setUser]       = useState(null);
  const [step, setStep]       = useState(1); // 1=lang, 2=profile, 3=motivation
  const [errors, setErrors]   = useState({});

  useEffect(() => {
    base44.auth.isAuthenticated().then(async ok => {
      if (ok) {
        const u = await base44.auth.me();
        setUser(u);
        setForm(f => ({
          ...f,
          fullName: u.full_name || '',
          preferredName: u.full_name?.split(' ')[0] || '',
          email: u.email || '',
        }));
      }
    });
  }, []);

  const validate2 = () => {
    const e = {};
    if (!form.fullName.trim())       e.fullName = true;
    if (!form.email.trim())          e.email    = true;
    if (!form.professionalLevel)     e.professionalLevel = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1) { setStep(2); return; }
    if (step === 2) { if (!validate2()) return; setStep(3); return; }
    if (step === 3) {
      // Save to localStorage for report
      const intake = {
        ...form,
        assessmentLang,
        version,
        levelId: level,
        startedAt: new Date().toISOString(),
      };
      localStorage.setItem('optivance_intake', JSON.stringify(intake));
      navigate(`/store/competency/assessment?level=${level}&version=${version}&lang=${assessmentLang}`);
    }
  };

  const t = (ar, en) => assessmentLang === 'ar' ? ar : en;

  return (
    <div className="bg-store-bg min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-2xl mx-auto">
          <Link to={`/store/competency/levels?version=${version}`}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-primary text-sm transition-colors w-fit">
            <BackArrow size={14} />
            {t('العودة', 'Back')}
          </Link>
        </div>
      </div>

      {/* Step progress */}
      <div className="bg-white border-b border-slate-50 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            {[1,2,3].map(s => (
              <React.Fragment key={s}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s <= step ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'
                }`}>{s}</div>
                {s < 3 && <div className={`flex-1 h-0.5 transition-all ${s < step ? 'bg-brand-primary' : 'bg-slate-100'}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-slate-400">{t('اللغة', 'Language')}</span>
            <span className="text-xs text-slate-400">{t('ملفك', 'Your Profile')}</span>
            <span className="text-xs text-slate-400">{t('الدافع', 'Motivation')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>

          {/* ── STEP 1: Language ── */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe size={24} className="text-brand-primary" />
                </div>
                <h1 className="font-heading font-black text-corp-dark text-2xl mb-2">
                  {t('اختر لغة المقياس والتقرير', 'Choose Assessment & Report Language')}
                </h1>
                <p className="text-slate-500 text-sm">
                  {t('ستظهر الأسئلة والتقرير بالكامل باللغة التي تختارها', 'All questions and the report will appear in your chosen language')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {[
                  { id: 'ar', label: 'العربية', sub: 'Arabic', dir: 'rtl' },
                  { id: 'en', label: 'English', sub: 'الإنجليزية', dir: 'ltr' },
                ].map(l => (
                  <button key={l.id} onClick={() => setAssessmentLang(l.id)}
                    className={`rounded-2xl border-2 p-5 text-center transition-all ${
                      assessmentLang === l.id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                    <div className="font-heading font-black text-corp-dark text-xl mb-1">{l.label}</div>
                    <div className="text-slate-400 text-xs">{l.sub}</div>
                    {assessmentLang === l.id && (
                      <div className="mt-3 w-5 h-5 rounded-full bg-brand-primary mx-auto flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Profile ── */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User size={24} className="text-brand-primary" />
                </div>
                <h1 className="font-heading font-black text-corp-dark text-2xl mb-2">
                  {t('بياناتك الشخصية', 'Your Profile')}
                </h1>
                <p className="text-slate-500 text-sm">
                  {t('تظهر هذه البيانات في التقرير الشخصي', 'This information will appear in your personalized report')}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('الاسم الكامل *', 'Full Name *')}</label>
                  <input type="text" value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder={t('مثال: محمد الأحمد', 'e.g. Ahmed Al-Shammari')}
                    className={`w-full rounded-xl border ${errors.fullName ? 'border-red-400' : 'border-slate-200'} px-4 py-3 text-sm text-corp-dark focus:outline-none focus:border-brand-primary`} />
                </div>

                {/* Preferred Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('الاسم المفضل', 'Preferred Name')}</label>
                  <input type="text" value={form.preferredName}
                    onChange={e => setForm(f => ({ ...f, preferredName: e.target.value }))}
                    placeholder={t('الاسم الذي يظهر في تقريرك', 'Name shown in your report')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-corp-dark focus:outline-none focus:border-brand-primary" />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('البريد الإلكتروني *', 'Email *')}</label>
                  <input type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className={`w-full rounded-xl border ${errors.email ? 'border-red-400' : 'border-slate-200'} px-4 py-3 text-sm text-corp-dark focus:outline-none focus:border-brand-primary`} />
                </div>

                {/* Professional Level */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">{t('المستوى المهني *', 'Professional Level *')}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PROFESSIONAL_LEVELS.map(l => (
                      <button key={l.id} onClick={() => setForm(f => ({ ...f, professionalLevel: l.id }))}
                        className={`rounded-xl border-2 py-2.5 px-3 text-xs font-semibold transition-all text-center ${
                          form.professionalLevel === l.id ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}>
                        {assessmentLang === 'ar' ? l.ar : l.en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('المسمى الوظيفي (اختياري)', 'Job Title (Optional)')}</label>
                  <input type="text" value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    placeholder={t('مثال: مدير مشاريع', 'e.g. Project Manager')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-corp-dark focus:outline-none focus:border-brand-primary" />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Motivation ── */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target size={24} className="text-brand-primary" />
                </div>
                <h1 className="font-heading font-black text-corp-dark text-2xl mb-2">
                  {t('دافعك للتطوير', 'Your Motivation')}
                </h1>
                <p className="text-slate-500 text-sm">
                  {t('يظهر ذلك في خطة التطوير الشخصية بتقريرك', 'This will appear in your personal development plan')}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <div className="grid grid-cols-1 gap-2.5">
                  {MOTIVATIONS[assessmentLang].map((m, i) => (
                    <button key={i} onClick={() => setForm(f => ({ ...f, motivation: m }))}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-medium text-start transition-all ${
                        form.motivation === m ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                      }`}>
                      {m}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    {t('أو أخبرنا بكلماتك الخاصة (اختياري)', 'Or tell us in your own words (optional)')}
                  </label>
                  <textarea value={form.customMotivation}
                    onChange={e => setForm(f => ({ ...f, customMotivation: e.target.value }))}
                    rows={2}
                    placeholder={t('ما الذي تأمل أن يحقق لك هذا التقييم؟', 'What do you hope this assessment will achieve for you?')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-corp-dark focus:outline-none focus:border-brand-primary resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all">
                <BackArrow size={14} />
                {t('السابق', 'Back')}
              </button>
            ) : <div />}

            <button onClick={handleNext}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-heading font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}>
              {step < 3 ? t('التالي', 'Next') : t('ابدأ المقياس', 'Start Assessment')}
              <ChevronRight size={15} />
            </button>
          </div>
        </motion.div>
      </div>
      <StoreFooter />
    </div>
  );
}