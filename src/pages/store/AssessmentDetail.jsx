import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import {
  Clock, BarChart2, Play, ArrowLeft, ArrowRight, CheckCircle, Lock,
  Star, Users, Brain, Target, FileText, Zap, Award, Layers, Sparkles, X
} from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

const PLANS = {
  quick: {
    id: 'quick',
    ar: {
      name: 'الاستكشافية',
      subtitle: 'لمن يريد فهماً سريعاً',
      duration: '١٠ دقائق',
      questions: '١٥ سؤال',
      badge: 'الأكثر شيوعاً',
      badgeColor: 'bg-blue-100 text-blue-700',
      includes: [
        'ملف شخصية بـ ٤ أنماط رئيسية',
        'أبرز ٣ نقاط قوة',
        'نمط تفكيرك وقراراتك',
        'توصيات تطوير أولية',
        'تقرير PDF مختصر (٥ صفحات)',
      ],
      excludes: [
        'تحليل ١٦ نمطاً',
        'خريطة قيادة تفصيلية',
        'مقارنة بمعايير الصناعة',
        'خطة ٩٠ يوماً',
      ],
      tagline: 'اكتشف أنماطك الأساسية في ١٠ دقائق',
    },
    en: {
      name: 'Explorer',
      subtitle: 'For quick self-discovery',
      duration: '10 min',
      questions: '15 Questions',
      badge: 'Most Popular',
      badgeColor: 'bg-blue-100 text-blue-700',
      includes: [
        '4-type personality profile',
        'Top 3 strength themes',
        'Thinking & decision style',
        'Initial development tips',
        'Concise PDF report (5 pages)',
      ],
      excludes: [
        '16-type deep analysis',
        'Detailed leadership map',
        'Industry benchmark comparison',
        '90-day development plan',
      ],
      tagline: 'Discover your core patterns in 10 minutes',
    },
  },
  full: {
    id: 'full',
    ar: {
      name: 'الاحترافية',
      subtitle: 'للقادة والمهنيين الجادين',
      duration: '٤٥ دقيقة',
      questions: '٤٥ سؤال',
      badge: 'الأشمل والأعمق',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      includes: [
        'ملف شخصية ١٦ نمطاً تفصيلياً',
        'خريطة نقاط القوة الكاملة',
        'أسلوب قيادتك وتأثيرك',
        'مناطق التطوير ذات الأولوية',
        'تقرير PDF شامل (٢٠+ صفحة)',
        'مقارنة مع معايير القطاع',
        'خطة تطوير مقترحة لـ ٩٠ يوماً',
        'جلسة تفسير مجانية (٣٠ دقيقة)',
      ],
      excludes: [],
      tagline: 'تحليل معمّق شامل يُغيّر مسارك المهني',
    },
    en: {
      name: 'Professional',
      subtitle: 'For serious leaders & professionals',
      duration: '45 min',
      questions: '45 Questions',
      badge: 'Most Comprehensive',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      includes: [
        '16-type detailed personality profile',
        'Full strengths landscape map',
        'Leadership & influence style',
        'Priority development areas',
        'Comprehensive PDF (20+ pages)',
        'Industry benchmark comparison',
        'Suggested 90-day development plan',
        'Free interpretation session (30 min)',
      ],
      excludes: [],
      tagline: 'A deep, comprehensive analysis that changes your career path',
    },
  },
};

const COMPARISON_TABLE = {
  ar: [
    { feature: 'عدد الأسئلة', quick: '١٥', full: '٤٥' },
    { feature: 'الوقت التقديري', quick: '١٠ دقائق', full: '٤٥ دقيقة' },
    { feature: 'أنماط الشخصية', quick: '٤ أنماط', full: '١٦ نمطاً' },
    { feature: 'نقاط القوة', quick: 'أبرز ٣', full: 'الخريطة الكاملة' },
    { feature: 'تقرير PDF', quick: '٥ صفحات', full: '٢٠+ صفحة' },
    { feature: 'مقارنة بالصناعة', quick: false, full: true },
    { feature: 'خطة ٩٠ يوماً', quick: false, full: true },
    { feature: 'جلسة تفسير', quick: false, full: true },
  ],
  en: [
    { feature: 'Questions', quick: '15', full: '45' },
    { feature: 'Estimated time', quick: '10 min', full: '45 min' },
    { feature: 'Personality types', quick: '4 types', full: '16 types' },
    { feature: 'Strengths', quick: 'Top 3', full: 'Full map' },
    { feature: 'PDF report', quick: '5 pages', full: '20+ pages' },
    { feature: 'Industry benchmark', quick: false, full: true },
    { feature: '90-day plan', quick: false, full: true },
    { feature: 'Interpretation session', quick: false, full: true },
  ],
};

const SCIENCE_REFS = {
  ar: [
    { icon: '📊', title: 'مستوحى من Gallup CliftonStrengths', desc: 'نهج القوة المبنية على أبحاث ٤٠ عاماً مع ٣٧ مليون مستخدم' },
    { icon: '🧠', title: 'مرجعية MBTI و16Personalities', desc: 'أكثر من ١٠٠ مليون شخص أجروا اختبار الشخصية المبني على علم نفس يونغ' },
    { icon: '🌍', title: 'معدّل للسياق الخليجي', desc: 'سيناريوهات وأمثلة معدّلة خصيصاً لبيئات العمل الخليجية والعربية' },
  ],
  en: [
    { icon: '📊', title: 'Inspired by Gallup CliftonStrengths', desc: 'Strengths-based approach backed by 40 years of research and 37M+ users' },
    { icon: '🧠', title: 'Referenced from MBTI & 16Personalities', desc: '100M+ people took personality tests built on Jungian psychology' },
    { icon: '🌍', title: 'Adapted for GCC Context', desc: 'Scenarios and examples tailored specifically for Gulf and Arab work environments' },
  ],
};

const TESTIMONIALS = {
  ar: [
    { name: 'محمد العتيبي', role: 'مدير تنفيذي – الرياض', text: 'المقياس الكامل غيّر نظرتي لأسلوب قيادتي تماماً. التقرير كان أعمق مما توقعت.', stars: 5 },
    { name: 'سارة الغامدي', role: 'مديرة موارد بشرية – جدة', text: 'استخدمنا النسخة الاحترافية لفريق القيادة كله. الفرق في الأداء ظهر خلال ٣ أشهر.', stars: 5 },
    { name: 'خالد المنصور', role: 'رائد أعمال – دبي', text: 'النسخة الاستكشافية كانت بداية رائعة لفهم نفسي بسرعة قبل جلسة الكوتشينج.', stars: 4 },
  ],
  en: [
    { name: 'Mohammed Al-Otaibi', role: 'CEO – Riyadh', text: 'The full assessment completely changed my perspective on my leadership style. The report was deeper than expected.', stars: 5 },
    { name: 'Sara Al-Ghamdi', role: 'HR Director – Jeddah', text: 'We used the professional version for our entire leadership team. Performance improvement showed within 3 months.', stars: 5 },
    { name: 'Khalid Al-Mansour', role: 'Entrepreneur – Dubai', text: 'The explorer version was a great starting point for quick self-understanding before my coaching session.', stars: 4 },
  ],
};

const SAMPLE_BARS = {
  ar: [
    { label: 'القيادة الاستراتيجية', val: 88 },
    { label: 'بناء العلاقات', val: 73 },
    { label: 'التنفيذ والإنجاز', val: 65 },
    { label: 'التفكير التحليلي', val: 91 },
    { label: 'التأثير والإقناع', val: 79 },
  ],
  en: [
    { label: 'Strategic Leadership', val: 88 },
    { label: 'Relationship Building', val: 73 },
    { label: 'Execution & Delivery', val: 65 },
    { label: 'Analytical Thinking', val: 91 },
    { label: 'Influence & Persuasion', val: 79 },
  ],
};

function AnimatedBar({ val, delay = 0, animate }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setW(val), delay + 200);
    return () => clearTimeout(t);
  }, [val, delay, animate]);
  const color = val >= 80 ? '#05E1AE' : val >= 65 ? '#60A5FA' : '#F59E0B';
  return (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${w}%`, background: color }} />
    </div>
  );
}

function PlanCard({ planKey, price, isSelected, onSelect, lang }) {
  const p = PLANS[planKey][lang];
  const accent = planKey === 'full' ? '#1A3A5C' : '#3B82F6';
  const accentLight = planKey === 'full' ? 'rgba(26,58,92,0.05)' : 'rgba(59,130,246,0.05)';

  return (
    <button
      onClick={() => onSelect(planKey)}
      className="w-full rounded-3xl p-6 text-start transition-all duration-200 relative"
      style={{
        border: `2px solid ${isSelected ? accent : '#E2E8F0'}`,
        background: isSelected ? accentLight : 'white',
        boxShadow: isSelected ? `0 6px 24px ${accent}18` : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {planKey === 'full' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-corp-dark text-white text-xs font-bold px-4 py-1.5 rounded-full shadow whitespace-nowrap">
            {lang === 'ar' ? '⭐ الأكثر قيمة' : '⭐ Best Value'}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4 mt-1">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-heading font-black text-corp-dark text-lg">{p.name}</span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
          </div>
          <p className="text-slate-500 text-xs">{p.subtitle}</p>
        </div>
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all"
          style={{ borderColor: isSelected ? accent : '#CBD5E1', background: isSelected ? accent : 'transparent' }}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Clock size={12} /> {p.duration}</div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500"><BarChart2 size={12} /> {p.questions}</div>
      </div>

      <ul className="space-y-2 mb-5">
        {p.includes.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
            <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: accent }} /> {item}
          </li>
        ))}
        {p.excludes.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 line-through">
            <X size={13} className="flex-shrink-0 mt-0.5 text-slate-200" /> {item}
          </li>
        ))}
      </ul>

      <div className="flex items-end gap-1.5 pt-4 border-t border-slate-100">
        <span className="font-heading font-black text-3xl text-corp-dark">{price}</span>
        <span className="text-slate-400 text-sm mb-1">{lang === 'ar' ? 'ر.س' : 'SAR'}</span>
      </div>
    </button>
  );
}

export default function AssessmentDetail() {
  const { id } = useParams();
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ctaRef = useRef(null);
  const reportRef = useRef(null);

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('full');
  const [stickyVisible, setStickyVisible] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);

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

  useEffect(() => {
    const onScroll = () => {
      if (!ctaRef.current) return;
      setStickyVisible(ctaRef.current.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = reportRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBarsVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading]);

  const handleStart = () => {
    if (!user) {
      navigate('/store/login?redirect=' + encodeURIComponent(`/store/assessments/${id}/take?plan=${selectedPlan}`));
      return;
    }
    navigate(`/store/assessments/${id}/take?plan=${selectedPlan}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
    </div>
  );
  if (!assessment) return null;

  const title = assessment[`title_${lang}`] || assessment.title_ar;
  const description = assessment[`description_${lang}`] || assessment.description_ar || '';
  const quickPrice = assessment.price ? Math.round(assessment.price * 0.55) : 49;
  const fullPrice = assessment.price || 149;
  const currentPrice = selectedPlan === 'full' ? fullPrice : quickPrice;
  const planLabel = PLANS[selectedPlan][lang].name;

  return (
    <div className="bg-slate-50 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      {/* ─── Sticky bottom bar ─────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${stickyVisible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ background: 'rgba(13,31,51,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-white font-heading font-bold text-sm truncate">{title}</p>
            <p className="text-white/40 text-xs">{planLabel} — {PLANS[selectedPlan][lang].duration}</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div>
              <span className="font-heading font-black text-xl" style={{ color: '#05E1AE' }}>{currentPrice}</span>
              <span className="text-white/40 text-xs ms-1">{lang === 'ar' ? 'ر.س' : 'SAR'}</span>
            </div>
            <button onClick={handleStart}
              className="px-5 py-2.5 rounded-xl font-heading font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
              style={{ background: '#05E1AE', color: '#0D1F33' }}>
              <Play size={13} fill="currentColor" />
              {lang === 'ar' ? 'ابدأ الآن' : 'Start Now'}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Breadcrumb ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <Link to="/store/assessments" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-primary text-sm transition-colors">
            <BackArrow size={14} />
            {lang === 'ar' ? 'جميع المقاييس' : 'All Assessments'}
          </Link>
        </div>
      </div>

      {/* ─── Hero ───────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0D1F33 0%, #1A3A5C 55%, #0D2940 100%)' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 text-xs font-semibold"
              style={{ background: 'rgba(5,225,174,0.12)', border: '1px solid rgba(5,225,174,0.25)', color: '#05E1AE' }}>
              <BarChart2 size={12} />
              {lang === 'ar' ? 'مقياس نفسي معتمد دولياً' : 'Internationally Certified Psychometric Assessment'}
            </div>
            <h1 className="font-heading font-black text-white text-3xl md:text-4xl leading-tight mb-4">{title}</h1>
            <p className="text-white/60 text-base leading-relaxed mb-8">
              {description || (lang === 'ar'
                ? 'اكتشف نمط شخصيتك وأسلوبك القيادي من خلال مقياس علمي مبني على أحدث أبحاث علم النفس التنظيمي.'
                : 'Discover your personality type and leadership style through a science-backed assessment built on organizational psychology research.'
              )}
            </p>

            {/* Social proof */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: Users, label: lang === 'ar' ? '+٥,٠٠٠ مستفيد' : '+5,000 Users' },
                { icon: Star, label: lang === 'ar' ? '٤.٩ تقييم' : '4.9 Rating' },
                { icon: Award, label: lang === 'ar' ? 'معتمد دولياً' : 'Certified' },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-center gap-1.5 rounded-xl px-3 py-2"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Icon size={12} style={{ color: '#05E1AE' }} />
                    <span className="text-white/75 text-xs">{b.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Primary CTA */}
            <div ref={ctaRef}>
              <button onClick={handleStart}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-heading font-black text-base transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #05E1AE, #00C49A)', color: '#0D1F33', boxShadow: '0 8px 24px rgba(5,225,174,0.3)' }}>
                {user ? <Play size={18} fill="currentColor" /> : <Lock size={16} />}
                {user
                  ? (lang === 'ar' ? `ابدأ ${planLabel} — ${currentPrice} ر.س` : `Start ${planLabel} — ${currentPrice} SAR`)
                  : (lang === 'ar' ? 'سجّل دخولك للبدء' : 'Login to Start')
                }
                <Arrow size={16} />
              </button>
              {!user && (
                <p className="text-white/35 text-xs mt-3">
                  {lang === 'ar' ? 'لا تملك حساباً؟' : "Don't have an account?"}{' '}
                  <Link to="/store/login" className="text-brand-accent underline">
                    {lang === 'ar' ? 'أنشئ حساباً مجاناً' : 'Create a free account'}
                  </Link>
                </p>
              )}
            </div>
          </div>

          {/* Sample report preview */}
          <div ref={reportRef} className="hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Chrome */}
              <div className="flex items-center gap-2 px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                <span className="text-white/25 text-xs mx-auto">
                  {lang === 'ar' ? 'معاينة التقرير — OPTIVANCE' : 'Report Preview — OPTIVANCE'}
                </span>
              </div>
              <div className="p-6 space-y-4">
                {/* Profile header */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(5,225,174,0.1)', border: '1px solid rgba(5,225,174,0.2)' }}>🦁</div>
                  <div className="flex-1">
                    <div className="text-white font-heading font-black text-sm">
                      {lang === 'ar' ? 'القائد الاستراتيجي' : 'Strategic Leader'}
                    </div>
                    <div className="text-white/40 text-xs">
                      {lang === 'ar' ? 'نمط ENTJ · نتيجة: ٨٨٪' : 'ENTJ Type · Score: 88%'}
                    </div>
                  </div>
                  <span className="font-heading font-black text-2xl" style={{ color: '#05E1AE' }}>88%</span>
                </div>
                {/* Bars */}
                {SAMPLE_BARS[lang].map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-white/60">{bar.label}</span>
                      <span className="text-xs font-bold" style={{ color: bar.val >= 80 ? '#05E1AE' : '#60A5FA' }}>{bar.val}%</span>
                    </div>
                    <AnimatedBar val={bar.val} delay={i * 150} animate={barsVisible} />
                  </div>
                ))}
                <p className="text-center text-xs pt-2" style={{ color: 'rgba(255,255,255,0.18)' }}>
                  {lang === 'ar' ? '⬆ معاينة توضيحية فقط' : '⬆ Illustrative preview only'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main content ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-14 space-y-16">

        {/* Plan Selector */}
        <section>
          <div className="text-center mb-8">
            <h2 className="font-heading font-black text-corp-dark text-2xl md:text-3xl mb-2">
              {lang === 'ar' ? 'اختر النسخة المناسبة لك' : 'Choose Your Version'}
            </h2>
            <p className="text-slate-500 text-sm">
              {lang === 'ar'
                ? 'كلتا النسختين تعطيك رؤى حقيقية — الفرق في العمق والتفصيل'
                : 'Both versions give real insights — the difference is depth and detail'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <PlanCard planKey="quick" price={quickPrice} isSelected={selectedPlan === 'quick'} onSelect={setSelectedPlan} lang={lang} />
            <PlanCard planKey="full" price={fullPrice} isSelected={selectedPlan === 'full'} onSelect={setSelectedPlan} lang={lang} />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button onClick={handleStart}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-heading font-black text-base transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)', color: 'white', boxShadow: '0 8px 28px rgba(26,58,92,0.2)' }}>
              {user ? <Play size={16} fill="currentColor" /> : <Lock size={16} />}
              {user
                ? (lang === 'ar' ? `ابدأ ${planLabel} — ${currentPrice} ر.س` : `Start ${planLabel} — ${currentPrice} SAR`)
                : (lang === 'ar' ? 'سجّل دخولك للبدء' : 'Login to Start')
              }
            </button>
            <p className="text-slate-400 text-xs text-center">
              {lang === 'ar'
                ? '✓ نتائج فورية  ✓ تقرير PDF  ✓ ضمان الرضا أو استرداد المبلغ'
                : '✓ Instant results  ✓ PDF report  ✓ Satisfaction guaranteed or money back'}
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section>
          <h2 className="font-heading font-black text-corp-dark text-2xl mb-6 text-center">
            {lang === 'ar' ? 'مقارنة تفصيلية بين النسختين' : 'Detailed Comparison'}
          </h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100">
              <div className="p-4 text-sm font-bold text-slate-500">{lang === 'ar' ? 'الميزة' : 'Feature'}</div>
              <div className="p-4 text-center border-s border-slate-100">
                <div className="font-heading font-black text-corp-dark text-sm">{PLANS.quick[lang].name}</div>
                <div className="font-black text-blue-600 text-sm">{quickPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>
              </div>
              <div className="p-4 text-center border-s border-slate-100" style={{ background: 'rgba(26,58,92,0.03)' }}>
                <div className="font-heading font-black text-corp-dark text-sm">{PLANS.full[lang].name}</div>
                <div className="font-black text-brand-primary text-sm">{fullPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>
              </div>
            </div>
            {COMPARISON_TABLE[lang].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-b border-slate-50 last:border-0 ${i % 2 !== 0 ? 'bg-slate-50/50' : ''}`}>
                <div className="p-4 text-sm text-slate-700 font-medium">{row.feature}</div>
                <div className="p-4 border-s border-slate-100 flex items-center justify-center">
                  {row.quick === false
                    ? <X size={15} className="text-slate-300" />
                    : row.quick === true
                      ? <CheckCircle size={15} className="text-blue-500" />
                      : <span className="text-sm text-slate-600 font-medium">{row.quick}</span>
                  }
                </div>
                <div className="p-4 border-s border-slate-100 flex items-center justify-center" style={{ background: 'rgba(26,58,92,0.02)' }}>
                  {row.full === false
                    ? <X size={15} className="text-slate-300" />
                    : row.full === true
                      ? <CheckCircle size={15} style={{ color: '#05E1AE' }} />
                      : <span className="text-sm font-semibold text-brand-primary">{row.full}</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Science */}
        <section>
          <div className="text-center mb-8">
            <h2 className="font-heading font-black text-corp-dark text-2xl mb-2">
              {lang === 'ar' ? 'مبني على علم حقيقي' : 'Built on Real Science'}
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              {lang === 'ar'
                ? 'مقياسنا مستوحى من أعرق نماذج قياس الشخصية عالمياً، ومعدّل للسياق الخليجي.'
                : "Our assessment draws from the world's most respected personality models, adapted for the GCC context."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SCIENCE_REFS[lang].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 text-center shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-heading font-bold text-corp-dark text-sm mb-2">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="font-heading font-black text-corp-dark text-2xl mb-8 text-center">
            {lang === 'ar' ? 'كيف تعمل التجربة؟' : 'How Does the Experience Work?'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(lang === 'ar' ? [
              { step: '١', icon: Brain, title: 'أسئلة سيناريو حقيقية', desc: '٢٥ ثانية لكل سؤال — الإجابة التلقائية هي الأصدق' },
              { step: '٢', icon: Zap, title: 'انتقال تلقائي فوري', desc: 'بمجرد اختيارك تنتقل للسؤال التالي تلقائياً' },
              { step: '٣', icon: Layers, title: 'تحليل ذكي فوري', desc: 'خوارزمية تحلل إجاباتك وتُنتج ملفك الشخصي' },
              { step: '٤', icon: FileText, title: 'تقريرك جاهز', desc: 'PDF شامل يصف نمطك وخطة تطويرك' },
            ] : [
              { step: '1', icon: Brain, title: 'Real-world Scenarios', desc: '25 sec per question — instinctive answers are most accurate' },
              { step: '2', icon: Zap, title: 'Instant Auto-advance', desc: 'Select an answer and move to the next question automatically' },
              { step: '3', icon: Layers, title: 'Smart Instant Analysis', desc: 'Algorithm analyzes your responses and generates your profile' },
              { step: '4', icon: FileText, title: 'Your Report is Ready', desc: 'Comprehensive PDF describing your type and development plan' },
            ]).map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative">
                  <div className="absolute -top-3 -start-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}>
                    {s.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(5,225,174,0.08)' }}>
                    <Icon size={18} style={{ color: '#05E1AE' }} />
                  </div>
                  <h3 className="font-heading font-bold text-corp-dark text-sm mb-1.5">{s.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="font-heading font-black text-corp-dark text-2xl mb-8 text-center">
            {lang === 'ar' ? 'ماذا يقول المستفيدون؟' : 'What Users Say'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS[lang].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={13} fill="#F59E0B" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-heading font-black text-sm text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-corp-dark text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-3xl p-10 text-center" style={{ background: 'linear-gradient(135deg, #0D1F33, #1A3A5C)' }}>
          <Sparkles size={28} className="mx-auto mb-4" style={{ color: '#05E1AE' }} />
          <h2 className="font-heading font-black text-white text-2xl md:text-3xl mb-3">
            {lang === 'ar' ? 'مستعد لاكتشاف إمكانياتك الحقيقية؟' : 'Ready to Discover Your True Potential?'}
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            {lang === 'ar'
              ? 'انضم لآلاف القادة والمهنيين الذين استخدموا مقاييس OPTIVANCE لتسريع مسيرتهم.'
              : 'Join thousands of leaders and professionals who used OPTIVANCE assessments to accelerate their careers.'}
          </p>
          {/* Plan toggle */}
          <div className="inline-flex rounded-2xl p-1.5 mb-6 gap-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {(['quick', 'full']).map(pk => (
              <button key={pk} onClick={() => setSelectedPlan(pk)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: selectedPlan === pk ? '#05E1AE' : 'transparent',
                  color: selectedPlan === pk ? '#0D1F33' : 'rgba(255,255,255,0.5)',
                }}>
                {PLANS[pk][lang].name} — {pk === 'quick' ? quickPrice : fullPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}
              </button>
            ))}
          </div>
          <div className="block">
            <button onClick={handleStart}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-heading font-black text-base transition-all active:scale-95"
              style={{ background: '#05E1AE', color: '#0D1F33', boxShadow: '0 8px 28px rgba(5,225,174,0.3)' }}>
              {user ? <Play size={16} fill="currentColor" /> : <Lock size={16} />}
              {user
                ? (lang === 'ar' ? `ابدأ الآن — ${currentPrice} ر.س` : `Start Now — ${currentPrice} SAR`)
                : (lang === 'ar' ? 'سجّل دخولك للبدء' : 'Login to Start')
              }
              <Arrow size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-5 justify-center mt-5">
            {(lang === 'ar' ? ['نتائج فورية', 'تقرير PDF', 'ضمان الرضا'] : ['Instant Results', 'PDF Report', 'Satisfaction Guarantee']).map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <CheckCircle size={11} style={{ color: '#05E1AE' }} /> {b}
              </div>
            ))}
          </div>
        </section>
      </div>

      <StoreFooter />
    </div>
  );
}