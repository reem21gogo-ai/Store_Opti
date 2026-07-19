import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { Clock, BarChart2, Play, ArrowLeft, ArrowRight, CheckCircle, Lock, Brain, Target, FileText, Users, Star, ChevronRight } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

const PLANS = {
  quick: {
    ar: {
      name: 'النسخة السريعة',
      badge: 'الأكثر شيوعاً',
      tagline: 'تقييم في 15 دقيقة',
      questions: '20 سؤال',
      duration: '15 دقيقة',
      price_suffix: ' ر.س',
      outputs: [
      'تقييم الكفاءات الأساسية',
      'ملخص النتائج',
      'نقاط القوة الرئيسية',
      'توصيات تطوير سريعة',
      'تقرير PDF'],

      note: 'مثالي لفهم سريع لكفاءاتك'
    },
    en: {
      name: 'Quick Version',
      badge: 'Most Popular',
      tagline: 'Assessment in 15 minutes',
      questions: '20 Questions',
      duration: '15 min',
      price_suffix: ' SAR',
      outputs: [
      'Core Competency Assessment',
      'Results Summary',
      'Key Strengths',
      'Quick Development Tips',
      'PDF Report'],

      note: 'Ideal for quick competency understanding'
    }
  },
  full: {
    ar: {
      name: 'النسخة الكاملة',
      badge: 'الأعمق والأشمل',
      tagline: 'تحليل معمّق في 30 دقيقة',
      questions: '45 سؤال',
      duration: '30 دقيقة',
      price_suffix: ' ر.س',
      outputs: [
      'تقييم 20 جدارة أساسية',
      'تحليل 6 مجالات رئيسية',
      'تقرير PDF شامل (15+ صفحة)',
      'مقارنة مع معايير القطاع',
      'خطة تطوير 90 يوم مقترحة',
      'توصيات تطوير مفصلة'],

      note: 'للمهنيين الجادين في تطوير أنفسهم'
    },
    en: {
      name: 'Full Version',
      badge: 'Most Comprehensive',
      tagline: 'Deep-dive analysis in 30 minutes',
      questions: '45 Questions',
      duration: '30 min',
      price_suffix: ' SAR',
      outputs: [
      '20 Core Competencies Assessment',
      '6 Domain Analysis',
      'Comprehensive PDF report (15+ pages)',
      'Industry benchmark comparison',
      'Suggested 90-day development plan',
      'Detailed development recommendations'],

      note: 'For professionals serious about growth'
    }
  }
};

const WHAT_TO_EXPECT = {
  ar: [
  { icon: Brain, title: 'أسئلة سيناريو واقعية', desc: 'أسئلة مصممة من سياقات عمل حقيقية' },
  { icon: Clock, title: '25 ثانية لكل سؤال', desc: 'وقت مناسب للإجابة الصادقة والتلقائية' },
  { icon: Target, title: 'نتائج فورية', desc: 'تقريرك يظهر مباشرة بعد الانتهاء' },
  { icon: FileText, title: 'تقرير PDF', desc: 'احتفظ بتقريرك وشاركه مع مدربك' }],

  en: [
  { icon: Brain, title: 'Real-world Scenarios', desc: 'Questions designed from real workplace contexts' },
  { icon: Clock, title: '25 Seconds Per Question', desc: 'Time for natural, honest responses' },
  { icon: Target, title: 'Instant Results', desc: 'Your report appears immediately after completion' },
  { icon: FileText, title: 'PDF Report', desc: 'Keep and share your report with your coach' }]

};

export default function CompetencyAssessmentLanding() {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('full');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
      setLoading(false);
    });
  }, []);

  const handleStart = () => {
    if (!user) {
      navigate('/store/login?redirect=' + encodeURIComponent(`/store/competency/levels?plan=${selectedPlan}`));
      return;
    }
    navigate(`/store/competency/levels?plan=${selectedPlan}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
    </div>);


  const title = lang === 'ar' ? 'مقياس الكفاءات الأساسية' : 'Core Competency Assessment';
  const description = lang === 'ar' ?
  'تقييم شامل لكفاءاتك المهنية والسلوكية من خلال أسئلة مصممة علمياً تقيس 20 جدارة أساسية في 6 مجالات رئيسية' :
  'A comprehensive assessment of your professional competencies through scientifically-designed questions measuring 20 core competencies across 6 key domains';

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
      <div className="from-corp-dark via-brand-primary to-corp-surface py-14 px-6 bg-[hsl(var(--sidebar-foreground))]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-brand-accent/15 border border-brand-accent/25 rounded-full px-3 py-1 mb-5">
              <BarChart2 size={13} className="text-brand-accent" />
              <span className="text-brand-accent text-xs font-semibold uppercase tracking-wide">
                {lang === 'ar' ? 'مقياس معتمد علمياً' : 'Scientifically Validated Assessment'}
              </span>
            </div>
            <h1 className="font-heading font-black text-white text-3xl md:text-4xl mb-4 leading-tight">{title}</h1>
            <p className="text-white/65 text-base leading-relaxed max-w-xl">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              {[
              { icon: Users, label: lang === 'ar' ? '+٥,٠٠٠ مستخدم' : '+5,000 Users' },
              { icon: Star, label: lang === 'ar' ? '٤.٩ تقييم' : '4.9 Rating' },
              { icon: Clock, label: lang === 'ar' ? 'نتائج فورية' : 'Instant Results' }].
              map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                    <Icon size={12} className="text-brand-accent" />
                    <span className="text-white/80 text-xs">{badge.label}</span>
                  </div>);

              })}
            </div>
          </div>
          {/* Quick score visual */}
          <div className="hidden md:flex flex-col items-center justify-center w-36 h-36 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="font-heading font-black text-4xl text-brand-accent">٢٠</span>
            <span className="text-white/50 text-xs mt-1">{lang === 'ar' ? 'جدارة أساسية' : 'Core Competencies'}‌</span>
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
                    </div>);

                })}
              </div>
            </div>

            {/* About the model */}
            <div className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-2xl p-6 border border-brand-primary/10">
              <h2 className="font-heading font-bold text-corp-dark text-lg mb-3">
                {lang === 'ar' ? 'مبني على أحدث المعايير العالمية' : 'Built on Global Best Standards'}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {lang === 'ar' ?
                'يقيس المقياس 20 جدارة موزعة على 6 مجالات رئيسية مثل القيادة والتفكير الاستراتيجي وبناء العلاقات والتنفيذ والابتكار والتطوير الذاتي.' :
                'The assessment measures 20 competencies across 6 key domains: Leadership, Strategic Thinking, Relationship Building, Execution, Innovation, and Self-Development.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(lang === 'ar' ?
                ['القيادة', 'التفكير الاستراتيجي', 'بناء العلاقات', 'التنفيذ', 'الابتكار', 'التطوير الذاتي'] :
                ['Leadership', 'Strategic Thinking', 'Relationships', 'Execution', 'Innovation', 'Self-Development']).
                map((tag, i) =>
                <span key={i} className="bg-white border border-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-full font-medium">{tag}</span>
                )}
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
                  {(lang === 'ar' ?
                  [{ label: 'القيادة الاستراتيجية', pct: 88 }, { label: 'بناء العلاقات', pct: 73 }, { label: 'التنفيذ والإنجاز', pct: 65 }, { label: 'التفكير التحليلي', pct: 91 }] :
                  [{ label: 'Strategic Leadership', pct: 88 }, { label: 'Relationship Building', pct: 73 }, { label: 'Executing & Delivering', pct: 65 }, { label: 'Analytical Thinking', pct: 91 }]).
                  map((bar, i) =>
                  <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-slate-700">{bar.label}</span>
                        <span className="text-sm font-bold text-brand-primary">{bar.pct}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, background: 'linear-gradient(90deg, #1A3A5C, #05E1AE)' }} />
                      </div>
                    </div>
                  )}
                  <div className="pt-2 text-xs text-slate-400 text-center">
                    {lang === 'ar' ? 'معاينة توضيحية فقط' : 'Illustrative preview only'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CTA Card */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-xs text-slate-500">{lang === 'ar' ? 'يبدأ من' : 'Starting from'}</span>
                    <span className="font-heading font-black text-3xl text-corp-dark">99</span>
                    <span className="text-slate-500 text-sm">{lang === 'ar' ? ' ر.س' : ' SAR'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {lang === 'ar' ? 'يختلف السعر حسب مستواك ونسخة المقياس' : 'Price varies by level and version'}
                  </p>
                </div>
                <div className="p-6 space-y-3">
                  {[
                  lang === 'ar' ? 'نتائج فورية عند الإنهاء' : 'Instant results on completion',
                  lang === 'ar' ? 'تقرير PDF احترافي' : 'Professional PDF report',
                  lang === 'ar' ? 'ضمان الرضا الكامل' : 'Full satisfaction guarantee',
                  lang === 'ar' ? 'خطة تطوير 90 يوم (شاملة)' : '90-day dev plan (full version)'].
                  map((item, i) =>
                  <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle size={14} className="text-brand-accent flex-shrink-0" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Start CTA */}
              {user ?
              <button onClick={handleStart} className="w-full py-4 rounded-2xl font-heading font-black text-base flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)', color: 'white' }}>
                  <Play size={16} fill="currentColor" />
                  {lang === 'ar' ? 'ابدأ التقييم' : 'Start Assessment'}
                  <Arrow size={16} />
                </button> :

              <button onClick={handleStart} className="w-full py-4 rounded-2xl font-heading font-black text-base flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ background: '#1A3A5C', color: 'white' }}>
                  <Lock size={15} />
                  {lang === 'ar' ? 'سجّل دخولك للبدء' : 'Login to Start'}
                </button>
              }

              <Link to="/consultation" className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm text-center flex items-center justify-center gap-2 hover:border-brand-primary/50 hover:text-brand-primary transition-all bg-white">
                {lang === 'ar' ? 'تحتاج مساعدة؟ تواصل معنا' : 'Need help? Contact us'}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>);

}