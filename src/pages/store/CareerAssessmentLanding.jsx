/**
 * CareerAssessmentLanding — Product landing page for the Career Orientation assessment.
 * Mirrors the CompetencyAssessmentLanding layout: hero, how-it-works, model, preview, pricing CTA.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import {
  Compass, Heart, Zap, Users, Star, Building2,
  Clock, BarChart2, Play, ArrowLeft, ArrowRight, CheckCircle, Lock,
  FileText, Target, Sparkles, ChevronRight
} from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';
import { PRODUCT_INFO, SECTIONS } from '@/lib/careerContent';

const SECTION_ICONS = { riasec: Compass, work_values: Heart, skills: Zap, personality: Users, strengths: Star, environment: Building2 };

const WHAT_TO_EXPECT = {
  ar: [
    { icon: Compass, title: '٦ أبعاد مهنية', desc: 'ميول، قيم، مهارات، شخصية، قوة، بيئة' },
    { icon: Clock, title: '٢٥ ثانية لكل سؤال', desc: 'وقت مناسب للإجابة الصادقة والتلقائية' },
    { icon: Target, title: 'نتائج فورية', desc: 'تقريرك يظهر مباشرة بعد الانتهاء' },
    { icon: FileText, title: 'تقرير PDF', desc: '٩ صفحات تحليلية قابلة للتحميل' },
  ],
  en: [
    { icon: Compass, title: '6 Career Dimensions', desc: 'Interests, values, skills, personality, strengths, environment' },
    { icon: Clock, title: '25 Seconds Per Question', desc: 'Time for natural, honest responses' },
    { icon: Target, title: 'Instant Results', desc: 'Your report appears immediately after completion' },
    { icon: FileText, title: 'PDF Report', desc: '9 analytical pages, downloadable' },
  ],
};

export default function CareerAssessmentLanding() {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
      setLoading(false);
    });
  }, []);

  const handleStart = () => {
    if (!user) {
      navigate('/store/login?redirect=' + encodeURIComponent('/store/career/intake'));
      return;
    }
    navigate('/store/career/intake');
  };

  if (loading) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
    </div>
  );

  const title = lang === 'ar' ? PRODUCT_INFO.name_ar : PRODUCT_INFO.name_en;
  const description = lang === 'ar' ? PRODUCT_INFO.subtitle_ar : PRODUCT_INFO.subtitle_en;

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
              <Sparkles size={13} className="text-brand-accent" />
              <span className="text-brand-accent text-xs font-semibold uppercase tracking-wide">
                {lang === 'ar' ? 'منتج جديد' : 'New Product'}
              </span>
            </div>
            <h1 className="font-heading font-black text-white text-3xl md:text-4xl mb-4 leading-tight">{title}</h1>
            <p className="text-white/65 text-base leading-relaxed max-w-xl">{description}</p>
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                { icon: Users, label: lang === 'ar' ? '+١,٠٠٠ مستخدم' : '+1,000 Users' },
                { icon: Star, label: lang === 'ar' ? '٤.٨ تقييم' : '4.8 Rating' },
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
          {/* Quick visual */}
          <div className="hidden md:flex flex-col items-center justify-center w-36 h-36 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="font-heading font-black text-4xl text-brand-accent">١٥٠</span>
            <span className="text-white/50 text-xs mt-1 text-center">{lang === 'ar' ? 'سؤال • ٦ أبعاد' : 'Questions • 6 Dimensions'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* LEFT: Details */}
          <div className="lg:col-span-3 space-y-8">

            {/* How it works */}
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

            {/* Six dimensions */}
            <div className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-2xl p-6 border border-brand-primary/10">
              <h2 className="font-heading font-bold text-corp-dark text-lg mb-3">
                {lang === 'ar' ? 'مبني على نموذج RIASEC ومعايير عالمية' : 'Built on RIASEC Model & Global Standards'}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {lang === 'ar'
                  ? 'يقيس المقياس ٦ أبعاد رئيسية: الميول المهنية (RIASEC)، قيم العمل، المهارات، الشخصية، نقاط القوة، وتفضيلات بيئة العمل — لإعطائك صورة متكاملة عن توجّهك المهني.'
                  : 'The assessment measures 6 core dimensions: Occupational Interests (RIASEC), Work Values, Skills, Personality, Strengths, and Environment Preferences — giving you a complete picture of your career orientation.'}
              </p>
              <div className="space-y-2">
                {SECTIONS.map((s, i) => {
                  const Icon = SECTION_ICONS[s.id] || BarChart2;
                  return (
                    <div key={s.id} className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 px-4 py-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={15} className="text-brand-primary" />
                      </div>
                      <span className="font-medium text-corp-dark text-sm flex-1">{lang === 'ar' ? s.name.ar : s.name.en}</span>
                      <span className="text-xs text-slate-400 font-semibold">{s.questionCount} {lang === 'ar' ? 'سؤال' : 'Q'}</span>
                    </div>
                  );
                })}
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
                  {(lang === 'ar'
                    ? [
                        { label: 'الميول الاستكشافية (Investigative)', pct: 85 },
                        { label: 'الميول الاجتماعية (Social)', pct: 72 },
                        { label: 'قيم العمل: الاستقلالية', pct: 90 },
                        { label: 'المهارات التحليلية', pct: 78 },
                      ]
                    : [
                        { label: 'Investigative Interests', pct: 85 },
                        { label: 'Social Interests', pct: 72 },
                        { label: 'Work Value: Autonomy', pct: 90 },
                        { label: 'Analytical Skills', pct: 78 },
                      ]
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
                    <span className="font-heading font-black text-3xl text-corp-dark">149</span>
                    <span className="text-slate-500 text-sm">{lang === 'ar' ? ' ر.س' : ' SAR'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {lang === 'ar' ? 'تقييم شامل مع تقرير PDF وخطة ٩٠ يوم' : 'Full assessment with PDF report & 90-day plan'}
                  </p>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    lang === 'ar' ? '١٥٠ سؤال عبر ٦ أبعاد' : '150 questions across 6 dimensions',
                    lang === 'ar' ? 'رمز هولاند (Holland Code)' : 'Holland Code (RIASEC)',
                    lang === 'ar' ? 'مسارات مهنية مطابقة' : 'Matched career paths',
                    lang === 'ar' ? 'تقرير PDF من ٩ صفحات' : '9-page PDF report',
                    lang === 'ar' ? 'خطة عمل ٩٠ يوم' : '90-day action plan',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle size={14} className="text-brand-accent flex-shrink-0" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start CTA */}
              {user ? (
                <button onClick={handleStart} className="w-full py-4 rounded-2xl font-heading font-black text-base flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)', color: 'white' }}>
                  <Play size={16} fill="currentColor" />
                  {lang === 'ar' ? 'ابدأ التقييم' : 'Start Assessment'}
                  <Arrow size={16} />
                </button>
              ) : (
                <button onClick={handleStart} className="w-full py-4 rounded-2xl font-heading font-black text-base flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ background: '#1A3A5C', color: 'white' }}>
                  <Lock size={15} />
                  {lang === 'ar' ? 'سجّل دخولك للبدء' : 'Login to Start'}
                </button>
              )}

              <Link to="/store/assessments" className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm text-center flex items-center justify-center gap-2 hover:border-brand-primary/50 hover:text-brand-primary transition-all bg-white">
                {lang === 'ar' ? 'استكشف مقاييس أخرى' : 'Explore Other Assessments'}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}