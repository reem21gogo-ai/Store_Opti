import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { Clock, BarChart2, Play, ArrowLeft, ArrowRight, CheckCircle, Lock, Zap, Star, FileText, Users, Brain, Target, ChevronRight } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

const PLANS = {
  quick: {
    ar: {
      name: 'النسخة السريعة',
      badge: 'الأكثر شيوعاً',
      tagline: 'اكتشف أنماطك في ١٠ دقائق',
      questions: '15 سؤال',
      duration: '١٠ دقائق',
      price_suffix: ' ر.س',
      outputs: [
        'ملف شخصية بـ ٤ أنماط رئيسية',
        'نقاط قوتك الأبرز (Top 3)',
        'نمط تفكيرك وقراراتك',
        'توصيات تطوير سريعة',
        'تقرير PDF مختصر',
      ],
      note: 'مثالي لمن يريد فهماً سريعاً وعملياً',
    },
    en: {
      name: 'Quick Version',
      badge: 'Most Popular',
      tagline: 'Discover your patterns in 10 minutes',
      questions: '15 Questions',
      duration: '10 min',
      price_suffix: ' SAR',
      outputs: [
        'Personality profile with 4 core types',
        'Top 3 strength themes',
        'Your thinking & decision style',
        'Quick development tips',
        'Concise PDF report',
      ],
      note: 'Ideal for fast, actionable self-awareness',
    },
  },
  full: {
    ar: {
      name: 'النسخة الكاملة',
      badge: 'الأعمق والأشمل',
      tagline: 'تحليل معمّق بـ ٤٥ دقيقة',
      questions: '45 سؤال',
      duration: '٤٥ دقيقة',
      price_suffix: ' ر.س',
      outputs: [
        'ملف شخصية ١٦ نمطاً تفصيلياً',
        'خريطة نقاط القوة الكاملة',
        'أسلوب قيادتك وتأثيرك',
        'مناطق التطوير ذات الأولوية',
        'تقرير PDF شامل (٢٠+ صفحة)',
        'مقارنة مع معايير القطاع',
        'خطة تطوير مقترحة لـ ٩٠ يوماً',
      ],
      note: 'للقادة والمهنيين الجادين في تطوير أنفسهم',
    },
    en: {
      name: 'Full Version',
      badge: 'Most Comprehensive',
      tagline: 'Deep-dive analysis in 45 minutes',
      questions: '45 Questions',
      duration: '45 min',
      price_suffix: ' SAR',
      outputs: [
        '16-type detailed personality profile',
        'Full strengths landscape',
        'Your leadership & influence style',
        'Priority development areas',
        'Comprehensive PDF report (20+ pages)',
        'Industry benchmark comparison',
        'Suggested 90-day development plan',
      ],
      note: 'For serious leaders and professionals',
    },
  },
};

const WHAT_TO_EXPECT = {
  ar: [
    { icon: Brain, title: 'أسئلة سيناريو واقعية', desc: 'أسئلة مصممة من بيئات عمل حقيقية' },
    { icon: Clock, title: '٢٥ ثانية لكل سؤال', desc: 'وقت مناسب للإجابة الصادقة التلقائية' },
    { icon: Target, title: 'نتائج فورية', desc: 'تقريرك يظهر مباشرة بعد الانتهاء' },
    { icon: FileText, title: 'تقرير PDF', desc: 'احتفظ بتقريرك وشاركه مع مدربك' },
  ],
  en: [
    { icon: Brain, title: 'Real-world Scenarios', desc: 'Questions designed from real workplace contexts' },
    { icon: Clock, title: '25 Seconds Per Question', desc: 'Time for natural, honest responses' },
    { icon: Target, title: 'Instant Results', desc: 'Your report appears immediately after completion' },
    { icon: FileText, title: 'PDF Report', desc: 'Keep and share your report with your coach' },
  ],
};

export default function AssessmentDetail() {
  const { id } = useParams();
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('full');

  useEffect(() => {
    Promise.all([
      base44.entities.Assessment.filter({ id }),
      base44.auth.isAuthenticated().then(async authed => authed ? base44.auth.me() : null),
    ]).then(([asmts, me]) => {
      if (asmts[0]) setAssessment(asmts[0]);
      setUser(me);
      setLoading(false);
    });
  }, [id]);

  const handleStart = () => {
    if (!user) {
      navigate('/store/login?redirect=' + encodeURIComponent(`/store/assessments/${id}/take?plan=${selectedPlan}`));
      return;
    }
    navigate(`/store/assessments/${id}/take?plan=${selectedPlan}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
    </div>
  );
  if (!assessment) return null;

  const title = assessment[`title_${lang}`] || assessment.title_ar;
  const description = assessment[`description_${lang}`] || assessment.description_ar || '';
  const quickPrice = assessment.price ? Math.round(assessment.price * 0.55) : 49;
  const fullPrice = assessment.price || 149;
  const plan = PLANS[selectedPlan][lang];

  return (
    <div className="bg-store-bg min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto">
          <Link to="/store/assessments" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary text-sm transition-colors w-fit">
            <BackArrow size={14} />
            {lang === 'ar' ? 'العودة للمقاييس' : 'Back to Assessments'}
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-corp-dark via-brand-primary to-corp-surface py-14 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-brand-accent/15 border border-brand-accent/25 rounded-full px-3 py-1 mb-5">
              <BarChart2 size={13} className="text-brand-accent" />
              <span className="text-brand-accent text-xs font-semibold uppercase tracking-wide">
                {lang === 'ar' ? 'مقياس نفسي معتمد' : 'Certified Psychometric Assessment'}
              </span>
            </div>
            <h1 className="font-heading font-black text-white text-3xl md:text-4xl mb-4 leading-tight">{title}</h1>
            <p className="text-white/65 text-base leading-relaxed max-w-xl">
              {description || (lang === 'ar'
                ? 'اكتشف نمط شخصيتك وأسلوبك القيادي من خلال مقياس علمي مبني على أحدث أبحاث علم النفس التنظيمي.'
                : 'Discover your personality type and leadership style through a science-backed assessment built on organizational psychology research.'
              )}
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                { icon: Users, label: lang === 'ar' ? '+٥,٠٠٠ مستفيد' : '+5,000 Users' },
                { icon: Star, label: lang === 'ar' ? '٤.٩ تقييم' : '4.9 Rating' },
                { icon: Clock, label: lang === 'ar' ? 'نتائج فورية' : 'Instant Results' },
              ].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                    <Icon size={12} className="text-brand-accent" />
                    <span className="text-white/80 text-xs">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Quick score visual */}
          <div className="hidden md:flex flex-col items-center justify-center w-36 h-36 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="font-heading font-black text-4xl text-brand-accent">٩٧</span>
            <span className="text-white/50 text-xs mt-1">{lang === 'ar' ? 'دقة التحليل' : 'Analysis Accuracy'}%</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* LEFT: Details */}
          <div className="lg:col-span-3 space-y-8">

            {/* What to expect */}
            <div>
              <h2 className="font-heading font-bold text-corp-dark text-xl mb-5">
                {lang === 'ar' ? 'كيف يعمل المقياس؟' : 'How Does the Assessment Work?'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {WHAT_TO_EXPECT[lang].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/8 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-brand-primary" />
                      </div>
                      <div>
                        <div className="font-heading font-semibold text-corp-dark text-sm mb-1">{item.title}</div>
                        <div className="text-slate-500 text-xs leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inspired by: personality models mention */}
            <div className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-2xl p-6 border border-brand-primary/10">
              <h2 className="font-heading font-bold text-corp-dark text-lg mb-3">
                {lang === 'ar' ? 'مبني على أحدث المعايير العالمية' : 'Built on Global Best Standards'}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {lang === 'ar'
                  ? 'مقياسنا مستوحى من أعرق نماذج قياس الشخصية عالمياً مثل Gallup CliftonStrengths وMBTI و16Personalities، مع تعديلات تعكس السياق الثقافي الخليجي.'
                  : 'Our assessment draws inspiration from world-class models like Gallup CliftonStrengths, MBTI, and 16Personalities, adapted for the GCC cultural context.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Gallup CliftonStrengths', 'MBTI Framework', '16Personalities', 'GCC Contextualized'].map((tag, i) => (
                  <span key={i} className="bg-white border border-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-full font-medium">{tag}</span>
                ))}
              </div>
            </div>

            {/* Sample output preview */}
            <div>
              <h2 className="font-heading font-bold text-corp-dark text-xl mb-5">
                {lang === 'ar' ? 'مثال على مخرجات المقياس' : 'Sample Output Preview'}
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="bg-corp-dark px-6 py-4 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-white/40 text-xs mx-auto">{lang === 'ar' ? 'معاينة التقرير' : 'Report Preview'}</span>
                </div>
                <div className="p-6 space-y-4">
                  {/* Fake profile bars */}
                  {(lang === 'ar'
                    ? [{ label: 'القيادة الاستراتيجية', pct: 88 }, { label: 'بناء العلاقات', pct: 73 }, { label: 'التنفيذ والإنجاز', pct: 65 }, { label: 'التفكير التحليلي', pct: 91 }]
                    : [{ label: 'Strategic Leadership', pct: 88 }, { label: 'Relationship Building', pct: 73 }, { label: 'Executing & Delivering', pct: 65 }, { label: 'Analytical Thinking', pct: 91 }]
                  ).map((bar, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-slate-700">{bar.label}</span>
                        <span className="text-sm font-bold text-brand-primary">{bar.pct}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, background: 'linear-gradient(90deg, #1A3A5C, #05E1AE)' }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 text-xs text-slate-400 text-center">
                    {lang === 'ar' ? '⬆ هذه معاينة توضيحية فقط' : '⬆ Illustrative preview only'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Plan Selector + CTA */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <h2 className="font-heading font-bold text-corp-dark text-lg">
                {lang === 'ar' ? 'اختر النسخة المناسبة لك' : 'Choose Your Version'}
              </h2>

              {/* Quick Plan */}
              <button
                onClick={() => setSelectedPlan('quick')}
                className={`w-full rounded-2xl p-5 border-2 text-start transition-all ${selectedPlan === 'quick' ? 'border-brand-accent bg-brand-accent/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-black text-corp-dark text-base">{PLANS.quick[lang].name}</span>
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{PLANS.quick[lang].badge}</span>
                    </div>
                    <div className="text-slate-500 text-xs">{PLANS.quick[lang].tagline}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedPlan === 'quick' ? 'border-brand-accent bg-brand-accent' : 'border-slate-300'}`}>
                    {selectedPlan === 'quick' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> {PLANS.quick[lang].duration}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500"><BarChart2 size={12} /> {PLANS.quick[lang].questions}</div>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {PLANS.quick[lang].outputs.map((o, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle size={12} className="text-brand-accent flex-shrink-0" /> {o}
                    </li>
                  ))}
                </ul>
                <div className="flex items-end gap-1">
                  <span className="font-heading font-black text-2xl text-corp-dark">{quickPrice}</span>
                  <span className="text-slate-400 text-sm mb-0.5">{PLANS.quick[lang].price_suffix}</span>
                </div>
              </button>

              {/* Full Plan */}
              <button
                onClick={() => setSelectedPlan('full')}
                className={`w-full rounded-2xl p-5 border-2 text-start transition-all relative ${selectedPlan === 'full' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="bg-corp-dark text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {lang === 'ar' ? '⭐ الأكثر قيمة' : '⭐ Best Value'}
                  </span>
                </div>
                <div className="flex items-start justify-between mb-3 mt-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-black text-corp-dark text-base">{PLANS.full[lang].name}</span>
                    </div>
                    <div className="text-slate-500 text-xs">{PLANS.full[lang].tagline}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedPlan === 'full' ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'}`}>
                    {selectedPlan === 'full' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> {PLANS.full[lang].duration}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500"><BarChart2 size={12} /> {PLANS.full[lang].questions}</div>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {PLANS.full[lang].outputs.map((o, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle size={12} className="text-brand-primary flex-shrink-0" /> {o}
                    </li>
                  ))}
                </ul>
                <div className="flex items-end gap-1">
                  <span className="font-heading font-black text-2xl text-corp-dark">{fullPrice}</span>
                  <span className="text-slate-400 text-sm mb-0.5">{PLANS.full[lang].price_suffix}</span>
                </div>
              </button>

              {/* Start CTA */}
              {user ? (
                <button onClick={handleStart} className="w-full py-4 rounded-2xl font-heading font-black text-base flex items-center justify-center gap-2 transition-all" style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)', color: 'white' }}>
                  <Play size={16} fill="currentColor" />
                  {lang === 'ar' ? `ابدأ ${plan.name}` : `Start ${plan.name}`}
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleStart} className="w-full py-4 rounded-2xl font-heading font-black text-base flex items-center justify-center gap-2 transition-all" style={{ background: '#1A3A5C', color: 'white' }}>
                  <Lock size={15} />
                  {lang === 'ar' ? 'سجّل دخولك للبدء' : 'Login to Start'}
                </button>
              )}

              <p className="text-center text-xs text-slate-400">
                {lang === 'ar' ? '✓ نتائج فورية  ✓ تقرير PDF  ✓ ضمان الرضا' : '✓ Instant results  ✓ PDF report  ✓ Satisfaction guaranteed'}
              </p>

              <Link to="/consultation" className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm text-center flex items-center justify-center gap-2 hover:border-brand-primary/50 hover:text-brand-primary transition-all bg-white">
                {lang === 'ar' ? 'تحتاج مساعدة في الاختيار؟ تواصل معنا' : 'Need help choosing? Contact us'}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}