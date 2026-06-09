import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import {
  Clock, BarChart2, Play, ArrowLeft, ArrowRight, CheckCircle, Lock,
  Star, Users, Brain, FileText, Zap, Layers, X, TrendingUp, Shield, Award
} from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

/* ─── Data ─────────────────────────────────────────────────── */

const PLANS = {
  quick: {
    ar: {
      name: 'التقييم السريع',
      subtitle: 'لمن يريد رؤية سريعة وعملية',
      duration: '١٠ دقائق',
      questions: '١٥ سؤالاً',
      badge: 'الأكثر شيوعاً',
      includes: [
        'ملف شخصية بـ ٤ أنماط رئيسية',
        'أبرز ٣ نقاط قوة شخصية',
        'نمط تفكيرك واتخاذ قراراتك',
        'توصيات تطوير أولية',
        'تقرير PDF مختصر (٥ صفحات)',
      ],
      excludes: [
        'تحليل ١٦ نمطاً تفصيلياً',
        'خريطة القيادة الكاملة',
        'مقارنة بمعايير الصناعة',
        'خطة تطوير ٩٠ يوماً',
        'جلسة تفسير مع خبير',
      ],
    },
    en: {
      name: 'Quick Assessment',
      subtitle: 'For fast, practical self-insight',
      duration: '10 min',
      questions: '15 Questions',
      badge: 'Most Popular',
      includes: [
        '4-type personality profile',
        'Top 3 personal strength themes',
        'Thinking & decision-making style',
        'Initial development recommendations',
        'Concise PDF report (5 pages)',
      ],
      excludes: [
        '16-type detailed analysis',
        'Full leadership map',
        'Industry benchmark comparison',
        '90-day development plan',
        'Expert interpretation session',
      ],
    },
  },
  full: {
    ar: {
      name: 'التقييم الكامل',
      subtitle: 'للقادة والمهنيين الجادين في تطوير أنفسهم',
      duration: '٤٥ دقيقة',
      questions: '٤٥ سؤالاً',
      badge: 'الأشمل والأعمق',
      includes: [
        'ملف شخصية ١٦ نمطاً تفصيلياً',
        'خريطة نقاط القوة الكاملة',
        'أسلوب قيادتك ومصادر تأثيرك',
        'مناطق التطوير ذات الأولوية',
        'تقرير PDF شامل (٢٠+ صفحة)',
        'مقارنة مع معايير القطاع',
        'خطة تطوير مقترحة لـ ٩٠ يوماً',
        'جلسة تفسير مع خبير (٣٠ دقيقة)',
      ],
      excludes: [],
    },
    en: {
      name: 'Full Assessment',
      subtitle: 'For leaders and professionals serious about growth',
      duration: '45 min',
      questions: '45 Questions',
      badge: 'Most Comprehensive',
      includes: [
        '16-type detailed personality profile',
        'Full strengths landscape map',
        'Leadership style & influence sources',
        'Priority development areas',
        'Comprehensive PDF report (20+ pages)',
        'Industry benchmark comparison',
        'Suggested 90-day development plan',
        'Expert interpretation session (30 min)',
      ],
      excludes: [],
    },
  },
};

const COMPARISON = {
  ar: [
    { feature: 'عدد الأسئلة', quick: '١٥ سؤالاً', full: '٤٥ سؤالاً' },
    { feature: 'المدة الزمنية', quick: '١٠ دقائق', full: '٤٥ دقيقة' },
    { feature: 'أنماط الشخصية', quick: '٤ أنماط', full: '١٦ نمطاً' },
    { feature: 'تحليل نقاط القوة', quick: 'أبرز ٣ نقاط', full: 'الخريطة الكاملة' },
    { feature: 'حجم تقرير PDF', quick: '٥ صفحات', full: '٢٠+ صفحة' },
    { feature: 'مقارنة بمعايير الصناعة', quick: false, full: true },
    { feature: 'خطة تطوير ٩٠ يوماً', quick: false, full: true },
    { feature: 'جلسة تفسير مع خبير', quick: false, full: true },
  ],
  en: [
    { feature: 'Number of questions', quick: '15 questions', full: '45 questions' },
    { feature: 'Duration', quick: '10 minutes', full: '45 minutes' },
    { feature: 'Personality types', quick: '4 types', full: '16 types' },
    { feature: 'Strengths analysis', quick: 'Top 3', full: 'Full map' },
    { feature: 'PDF report size', quick: '5 pages', full: '20+ pages' },
    { feature: 'Industry benchmark', quick: false, full: true },
    { feature: '90-day development plan', quick: false, full: true },
    { feature: 'Expert interpretation session', quick: false, full: true },
  ],
};

const HOW_IT_WORKS = {
  ar: [
    { icon: Brain, title: 'أسئلة سيناريو واقعية', desc: 'مواقف من بيئات العمل الحقيقية، ٢٥ ثانية لكل سؤال' },
    { icon: Zap, title: 'انتقال تلقائي فوري', desc: 'بمجرد اختيارك ينتقل المقياس للسؤال التالي تلقائياً' },
    { icon: Layers, title: 'تحليل علمي دقيق', desc: 'خوارزمية متخصصة تحلل أنماط إجاباتك وتُولّد ملفك' },
    { icon: FileText, title: 'تقريرك جاهز فوراً', desc: 'تقرير PDF مفصّل يصف نمطك وخطة تطويرك' },
  ],
  en: [
    { icon: Brain, title: 'Real-world Scenarios', desc: 'Workplace situations — 25 seconds per question' },
    { icon: Zap, title: 'Instant Auto-advance', desc: 'Select your answer and the assessment moves forward automatically' },
    { icon: Layers, title: 'Scientific Analysis', desc: 'Specialized algorithm analyzes your response patterns and generates your profile' },
    { icon: FileText, title: 'Instant Report', desc: 'Detailed PDF report describing your type and development plan' },
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

const TESTIMONIALS = {
  ar: [
    { name: 'محمد العتيبي', role: 'مدير تنفيذي — الرياض', text: 'التقييم الكامل غيّر نظرتي لأسلوب قيادتي. التقرير كان أعمق مما توقعت بكثير.', stars: 5 },
    { name: 'سارة الغامدي', role: 'مديرة موارد بشرية — جدة', text: 'استخدمنا النسخة الكاملة لفريق القيادة. أثر إيجابي ملحوظ على الأداء خلال ٣ أشهر.', stars: 5 },
    { name: 'خالد المنصور', role: 'رائد أعمال — دبي', text: 'التقييم السريع كان نقطة انطلاق ممتازة قبل جلسة الكوتشينج. واضح ومباشر.', stars: 4 },
  ],
  en: [
    { name: 'Mohammed Al-Otaibi', role: 'CEO — Riyadh', text: 'The full assessment completely transformed my view of my leadership style. The report was far deeper than I expected.', stars: 5 },
    { name: 'Sara Al-Ghamdi', role: 'HR Director — Jeddah', text: 'We used the full version for our leadership team. A noticeable positive impact on performance within 3 months.', stars: 5 },
    { name: 'Khalid Al-Mansour', role: 'Entrepreneur — Dubai', text: 'The quick assessment was an excellent starting point before my coaching session. Clear and direct.', stars: 4 },
  ],
};

/* ─── Components ────────────────────────────────────────────── */

function AnimatedBar({ val, delay = 0, animate }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setW(val), delay + 200);
    return () => clearTimeout(t);
  }, [val, delay, animate]);
  return (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${w}%`, background: val >= 80 ? '#05E1AE' : val >= 65 ? 'rgba(5,225,174,0.5)' : 'rgba(5,225,174,0.3)' }}
      />
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function AssessmentDetail() {
  const { id } = useParams();
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  const heroRef = useRef(null);
  const reportRef = useRef(null);

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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
      if (!heroRef.current) return;
      setStickyVisible(heroRef.current.getBoundingClientRect().bottom < 0);
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

  const handleStart = (plan) => {
    if (!user) {
      navigate('/store/login?redirect=' + encodeURIComponent(`/store/assessments/${id}/take?plan=${plan}`));
      return;
    }
    navigate(`/store/assessments/${id}/take?plan=${plan}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin" />
    </div>
  );
  if (!assessment) return null;

  const title = assessment[`title_${lang}`] || assessment.title_ar;
  const description = assessment[`description_${lang}`] || assessment.description_ar || '';
  const quickPrice = assessment.price ? Math.round(assessment.price * 0.55) : 49;
  const fullPrice = assessment.price || 149;

  return (
    <div className="bg-white min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      {/* ── Sticky bar ─────────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${stickyVisible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ background: '#0D1F33', borderTop: '1px solid rgba(5,225,174,0.2)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-white font-heading font-bold text-sm truncate">{title}</p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => handleStart('quick')}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/20 text-white/80 hover:border-white/40"
            >
              {PLANS.quick[lang].name} — {quickPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}
            </button>
            <button
              onClick={() => handleStart('full')}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
              style={{ background: '#05E1AE', color: '#0D1F33' }}
            >
              <Play size={13} fill="currentColor" />
              {PLANS.full[lang].name} — {fullPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div className="border-b border-slate-100 px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <Link to="/store/assessments" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-primary text-sm transition-colors">
            <BackArrow size={14} />
            {lang === 'ar' ? 'جميع المقاييس' : 'All Assessments'}
          </Link>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div ref={heroRef} style={{ background: 'linear-gradient(160deg, #0D1F33 0%, #1A3A5C 100%)' }} className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: info */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 text-xs font-semibold"
              style={{ background: 'rgba(5,225,174,0.1)', border: '1px solid rgba(5,225,174,0.25)', color: '#05E1AE' }}
            >
              <BarChart2 size={12} />
              {lang === 'ar' ? 'مقياس نفسي معتمد دولياً' : 'Internationally Certified Psychometric Assessment'}
            </div>

            <h1 className="font-heading font-black text-white text-3xl md:text-4xl leading-tight mb-4">{title}</h1>
            <p className="text-white/55 text-base leading-relaxed mb-8">
              {description || (lang === 'ar'
                ? 'اكتشف نمط شخصيتك وأسلوبك القيادي من خلال مقياس علمي مبني على أحدث أبحاث علم النفس التنظيمي.'
                : 'Discover your personality type and leadership style through a science-backed assessment built on organizational psychology research.'
              )}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-5 mb-10">
              {[
                { icon: Users, label: lang === 'ar' ? '+٥,٠٠٠ مستفيد' : '+5,000 Users' },
                { icon: Star, label: lang === 'ar' ? '٤.٩ / ٥ تقييم' : '4.9 / 5 Rating' },
                { icon: Award, label: lang === 'ar' ? 'معتمد دولياً' : 'Certified' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon size={14} style={{ color: '#05E1AE' }} />
                    <span className="text-white/65 text-sm">{s.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Two buy buttons side by side */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleStart('quick')}
                className="flex-1 flex items-center justify-between gap-3 px-5 py-4 rounded-2xl font-heading font-bold text-sm transition-all border-2 border-white/15 hover:border-white/30 text-white"
              >
                <div className="text-start">
                  <div className="font-black text-sm">{PLANS.quick[lang].name}</div>
                  <div className="text-white/40 text-xs font-normal">{PLANS.quick[lang].duration} · {PLANS.quick[lang].questions}</div>
                </div>
                <div className="text-end flex-shrink-0">
                  <div className="font-black text-lg" style={{ color: '#05E1AE' }}>{quickPrice}</div>
                  <div className="text-white/40 text-xs">{lang === 'ar' ? 'ر.س' : 'SAR'}</div>
                </div>
              </button>

              <button
                onClick={() => handleStart('full')}
                className="flex-1 flex items-center justify-between gap-3 px-5 py-4 rounded-2xl font-heading font-bold text-sm transition-all active:scale-95"
                style={{ background: '#05E1AE', color: '#0D1F33' }}
              >
                <div className="text-start">
                  <div className="font-black text-sm">{PLANS.full[lang].name}</div>
                  <div className="text-corp-dark/50 text-xs font-normal">{PLANS.full[lang].duration} · {PLANS.full[lang].questions}</div>
                </div>
                <div className="text-end flex-shrink-0">
                  <div className="font-black text-lg">{fullPrice}</div>
                  <div className="text-corp-dark/50 text-xs">{lang === 'ar' ? 'ر.س' : 'SAR'}</div>
                </div>
              </button>
            </div>

            {!user && (
              <p className="text-white/30 text-xs mt-4">
                {lang === 'ar' ? 'لا تملك حساباً؟' : "Don't have an account?"}{' '}
                <Link to="/store/login" style={{ color: '#05E1AE' }} className="underline">
                  {lang === 'ar' ? 'أنشئ حساباً مجاناً' : 'Create a free account'}
                </Link>
              </p>
            )}
          </div>

          {/* Right: report preview */}
          <div ref={reportRef} className="hidden lg:block">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#071525', border: '1px solid rgba(5,225,174,0.12)' }}
            >
              {/* Header bar */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#05E1AE' }} />
                  <span className="text-white/30 text-xs font-mono">OPTIVANCE · {lang === 'ar' ? 'معاينة التقرير' : 'Report Preview'}</span>
                </div>
                <span className="text-white/20 text-xs">{lang === 'ar' ? 'توضيحي فقط' : 'Illustrative'}</span>
              </div>

              <div className="p-6">
                {/* Profile */}
                <div className="flex items-start gap-4 mb-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(5,225,174,0.08)', border: '1px solid rgba(5,225,174,0.15)' }}
                  >
                    <TrendingUp size={20} style={{ color: '#05E1AE' }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-heading font-black text-base mb-0.5">
                      {lang === 'ar' ? 'القائد الاستراتيجي' : 'Strategic Leader'}
                    </div>
                    <div className="text-white/35 text-xs mb-2">
                      {lang === 'ar' ? 'نمط ENTJ · المحرك والموجّه' : 'ENTJ Type · The Commander'}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 rounded-full flex-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: '88%', background: '#05E1AE' }} />
                      </div>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: '#05E1AE' }}>88%</span>
                    </div>
                  </div>
                </div>

                {/* Dimension bars */}
                <div className="space-y-4">
                  <div className="text-white/30 text-xs uppercase tracking-widest mb-3">
                    {lang === 'ar' ? 'الأبعاد القيادية' : 'Leadership Dimensions'}
                  </div>
                  {SAMPLE_BARS[lang].map((bar, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-white/50">{bar.label}</span>
                        <span className="text-xs font-bold" style={{ color: bar.val >= 80 ? '#05E1AE' : 'rgba(5,225,174,0.55)' }}>{bar.val}%</span>
                      </div>
                      <AnimatedBar val={bar.val} delay={i * 120} animate={barsVisible} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Plans Section ───────────────────────────────────────── */}
      <div className="bg-slate-50 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-black text-corp-dark text-2xl md:text-3xl mb-3">
              {lang === 'ar' ? 'اختر التقييم المناسب لك' : 'Choose Your Assessment'}
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              {lang === 'ar'
                ? 'كلا التقييمين مبنيان على نفس المنهجية العلمية — الفرق في عمق التحليل وشمولية المخرجات'
                : 'Both assessments are built on the same scientific methodology — the difference is in depth of analysis and comprehensiveness of outputs'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Plan */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
              {/* Plan header */}
              <div className="px-7 py-6" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-black text-corp-dark text-xl">{PLANS.quick[lang].name}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{PLANS.quick[lang].badge}</span>
                    </div>
                    <p className="text-slate-500 text-sm">{PLANS.quick[lang].subtitle}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock size={12} /> {PLANS.quick[lang].duration}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <BarChart2 size={12} /> {PLANS.quick[lang].questions}
                  </div>
                </div>
              </div>

              {/* Includes / Excludes */}
              <div className="px-7 py-6 flex-1">
                <ul className="space-y-3 mb-5">
                  {PLANS.quick[lang].includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#1A3A5C' }} />
                      {item}
                    </li>
                  ))}
                  {PLANS.quick[lang].excludes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300 line-through">
                      <X size={14} className="flex-shrink-0 mt-0.5 text-slate-200" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price + CTA */}
              <div className="px-7 pb-7">
                <div className="flex items-end gap-1 mb-4">
                  <span className="font-heading font-black text-4xl text-corp-dark">{quickPrice}</span>
                  <span className="text-slate-400 text-base mb-1">{lang === 'ar' ? ' ر.س' : ' SAR'}</span>
                </div>
                <button
                  onClick={() => handleStart('quick')}
                  className="w-full py-3.5 rounded-xl font-heading font-bold text-sm transition-all flex items-center justify-center gap-2 border-2"
                  style={{ borderColor: '#1A3A5C', color: '#1A3A5C' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1A3A5C'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1A3A5C'; }}
                >
                  {user ? <Play size={14} fill="currentColor" /> : <Lock size={14} />}
                  {user
                    ? (lang === 'ar' ? `ابدأ ${PLANS.quick[lang].name}` : `Start ${PLANS.quick[lang].name}`)
                    : (lang === 'ar' ? 'سجّل دخولك للبدء' : 'Login to Start')
                  }
                </button>
              </div>
            </div>

            {/* Full Plan */}
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{ background: '#0D1F33', border: '2px solid #05E1AE' }}
            >
              {/* Best value badge */}
              <div className="absolute top-4 end-4">
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: '#05E1AE', color: '#0D1F33' }}
                >
                  {lang === 'ar' ? 'الأكثر قيمة' : 'Best Value'}
                </span>
              </div>

              {/* Plan header */}
              <div className="px-7 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-black text-white text-xl">{PLANS.full[lang].name}</span>
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(5,225,174,0.15)', color: '#05E1AE' }}
                    >
                      {PLANS.full[lang].badge}
                    </span>
                  </div>
                  <p className="text-white/45 text-sm">{PLANS.full[lang].subtitle}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-white/35 text-xs">
                    <Clock size={12} /> {PLANS.full[lang].duration}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/35 text-xs">
                    <BarChart2 size={12} /> {PLANS.full[lang].questions}
                  </div>
                </div>
              </div>

              {/* Includes */}
              <div className="px-7 py-6">
                <ul className="space-y-3 mb-5">
                  {PLANS.full[lang].includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#05E1AE' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price + CTA */}
              <div className="px-7 pb-7">
                <div className="flex items-end gap-1 mb-4">
                  <span className="font-heading font-black text-4xl text-white">{fullPrice}</span>
                  <span className="text-white/40 text-base mb-1">{lang === 'ar' ? ' ر.س' : ' SAR'}</span>
                </div>
                <button
                  onClick={() => handleStart('full')}
                  className="w-full py-3.5 rounded-xl font-heading font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                  style={{ background: '#05E1AE', color: '#0D1F33' }}
                >
                  {user ? <Play size={14} fill="currentColor" /> : <Lock size={14} />}
                  {user
                    ? (lang === 'ar' ? `ابدأ ${PLANS.full[lang].name}` : `Start ${PLANS.full[lang].name}`)
                    : (lang === 'ar' ? 'سجّل دخولك للبدء' : 'Login to Start')
                  }
                </button>
                <p className="text-white/25 text-xs text-center mt-3">
                  {lang === 'ar' ? 'نتائج فورية · تقرير PDF · ضمان الرضا' : 'Instant results · PDF report · Satisfaction guarantee'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Comparison Table ─────────────────────────────────────── */}
      <div className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading font-black text-corp-dark text-2xl mb-8 text-center">
            {lang === 'ar' ? 'مقارنة تفصيلية' : 'Detailed Comparison'}
          </h2>

          <div className="rounded-2xl overflow-hidden border border-slate-100">
            {/* Table header */}
            <div className="grid grid-cols-3">
              <div className="p-4 bg-slate-50" />
              <div className="p-4 bg-slate-50 text-center border-s border-slate-100">
                <div className="font-heading font-black text-corp-dark text-sm">{PLANS.quick[lang].name}</div>
                <div className="font-bold text-slate-400 text-sm mt-0.5">{quickPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>
              </div>
              <div className="p-4 text-center border-s border-slate-100" style={{ background: '#0D1F33' }}>
                <div className="font-heading font-black text-white text-sm">{PLANS.full[lang].name}</div>
                <div className="font-bold text-sm mt-0.5" style={{ color: '#05E1AE' }}>{fullPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>
              </div>
            </div>

            {COMPARISON[lang].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-t border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/40' : 'bg-white'}`}>
                <div className="p-4 text-sm text-slate-700 font-medium">{row.feature}</div>
                <div className="p-4 border-s border-slate-100 flex items-center justify-center">
                  {row.quick === false
                    ? <X size={15} className="text-slate-200" />
                    : <span className="text-sm text-slate-600 font-medium text-center">{row.quick}</span>
                  }
                </div>
                <div className="p-4 border-s border-slate-100 flex items-center justify-center" style={{ background: 'rgba(13,31,51,0.03)' }}>
                  {row.full === false
                    ? <X size={15} className="text-slate-200" />
                    : row.full === true
                      ? <CheckCircle size={15} style={{ color: '#05E1AE' }} />
                      : <span className="text-sm font-semibold text-brand-primary text-center">{row.full}</span>
                  }
                </div>
              </div>
            ))}

            {/* Table footer CTAs */}
            <div className="grid grid-cols-3 border-t border-slate-100">
              <div className="p-4 bg-slate-50" />
              <div className="p-4 border-s border-slate-100 flex items-center justify-center">
                <button
                  onClick={() => handleStart('quick')}
                  className="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all"
                  style={{ borderColor: '#1A3A5C', color: '#1A3A5C' }}
                >
                  {user ? (lang === 'ar' ? 'ابدأ الآن' : 'Start Now') : (lang === 'ar' ? 'تسجيل دخول' : 'Login')}
                </button>
              </div>
              <div className="p-4 border-s border-slate-100 flex items-center justify-center" style={{ background: 'rgba(13,31,51,0.03)' }}>
                <button
                  onClick={() => handleStart('full')}
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                  style={{ background: '#05E1AE', color: '#0D1F33' }}
                >
                  {user ? (lang === 'ar' ? 'ابدأ الآن' : 'Start Now') : (lang === 'ar' ? 'تسجيل دخول' : 'Login')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── How it works ────────────────────────────────────────── */}
      <div className="bg-slate-50 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading font-black text-corp-dark text-2xl mb-10 text-center">
            {lang === 'ar' ? 'كيف تعمل التجربة؟' : 'How Does the Experience Work?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {HOW_IT_WORKS[lang].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 relative">
                  <div
                    className="absolute -top-3 -start-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: '#1A3A5C' }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(5,225,174,0.08)' }}
                  >
                    <Icon size={18} style={{ color: '#05E1AE' }} />
                  </div>
                  <h3 className="font-heading font-bold text-corp-dark text-sm mb-1.5">{s.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <div className="bg-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading font-black text-corp-dark text-2xl mb-10 text-center">
            {lang === 'ar' ? 'ماذا يقول المستفيدون؟' : 'What Users Say'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS[lang].map((t, i) => (
              <div key={i} className="rounded-xl p-6 border border-slate-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={13} fill="#1A3A5C" className="text-brand-primary" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-heading font-black text-sm text-white flex-shrink-0"
                    style={{ background: '#1A3A5C' }}
                  >
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
        </div>
      </div>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <div style={{ background: '#0D1F33' }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 text-xs font-semibold"
            style={{ background: 'rgba(5,225,174,0.1)', border: '1px solid rgba(5,225,174,0.2)', color: '#05E1AE' }}
          >
            <Shield size={12} />
            {lang === 'ar' ? 'ضمان الرضا الكامل أو استرداد المبلغ' : 'Full satisfaction guarantee or money back'}
          </div>
          <h2 className="font-heading font-black text-white text-2xl md:text-3xl mb-3">
            {lang === 'ar' ? 'جاهز لاكتشاف إمكانياتك الحقيقية؟' : 'Ready to Discover Your True Potential?'}
          </h2>
          <p className="text-white/40 text-sm mb-10 max-w-md mx-auto">
            {lang === 'ar'
              ? 'انضم لآلاف القادة والمهنيين الذين طوّروا أنفسهم باستخدام مقاييس OPTIVANCE.'
              : 'Join thousands of leaders and professionals who developed themselves using OPTIVANCE assessments.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <button
              onClick={() => handleStart('quick')}
              className="flex-1 flex items-center justify-between gap-3 px-6 py-4 rounded-2xl font-heading font-bold transition-all border-2 border-white/15 hover:border-white/30 text-white"
            >
              <div className="text-start">
                <div className="font-black text-sm">{PLANS.quick[lang].name}</div>
                <div className="text-white/35 text-xs font-normal">{PLANS.quick[lang].duration}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-black text-lg" style={{ color: '#05E1AE' }}>{quickPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                <ForwardArrow size={14} className="text-white/40" />
              </div>
            </button>

            <button
              onClick={() => handleStart('full')}
              className="flex-1 flex items-center justify-between gap-3 px-6 py-4 rounded-2xl font-heading font-bold transition-all active:scale-95"
              style={{ background: '#05E1AE', color: '#0D1F33' }}
            >
              <div className="text-start">
                <div className="font-black text-sm">{PLANS.full[lang].name}</div>
                <div className="text-corp-dark/45 text-xs font-normal">{PLANS.full[lang].duration}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-black text-lg">{fullPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                <ForwardArrow size={14} style={{ color: '#0D1F33' }} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <StoreFooter />
    </div>
  );
}