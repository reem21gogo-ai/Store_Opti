import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { Download, ArrowRight, ArrowLeft, CheckCircle, TrendingUp, Target, Lightbulb, Star, Users, Zap, RefreshCw } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

const DIMENSION_LABELS = {
  decision_style: { ar: 'أسلوب القرار', en: 'Decision Style' },
  self_perception: { ar: 'الإدراك الذاتي', en: 'Self Perception' },
  delegation: { ar: 'التفويض', en: 'Delegation' },
  communication: { ar: 'التواصل', en: 'Communication' },
  people_development: { ar: 'تطوير الآخرين', en: 'People Development' },
  leadership_values: { ar: 'قيم القيادة', en: 'Leadership Values' },
  conflict_resolution: { ar: 'إدارة الصراع', en: 'Conflict Resolution' },
};

const PERSONALITY_TYPES = {
  ar: {
    Advanced: { type: 'القائد الاستراتيجي', icon: '🦁', tagline: 'تفكيرك الكبير يُلهم من حولك', color: '#05E1AE' },
    'Upper Intermediate': { type: 'القائد الاجتماعي', icon: '🦅', tagline: 'تبني الجسور وتحقق النتائج', color: '#3B82F6' },
    Intermediate: { type: 'القائد النامي', icon: '🌱', tagline: 'إمكانياتك الحقيقية في طور الاكتشاف', color: '#F59E0B' },
    Beginner: { type: 'القائد الواعد', icon: '✨', tagline: 'الرحلة بدأت — وأنت على المسار الصحيح', color: '#8B5CF6' },
  },
  en: {
    Advanced: { type: 'Strategic Leader', icon: '🦁', tagline: 'Your big thinking inspires those around you', color: '#05E1AE' },
    'Upper Intermediate': { type: 'Social Leader', icon: '🦅', tagline: 'You build bridges and deliver results', color: '#3B82F6' },
    Intermediate: { type: 'Emerging Leader', icon: '🌱', tagline: 'Your true potential is unfolding', color: '#F59E0B' },
    Beginner: { type: 'Promising Leader', icon: '✨', tagline: "The journey begins — you're on the right path", color: '#8B5CF6' },
  },
};

function DimensionBar({ label, value, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 200 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  const color = value >= 80 ? '#05E1AE' : value >= 60 ? '#3B82F6' : value >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
    </div>
  );
}

export default function AssessmentResults() {
  const { id, attemptId } = useParams();
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [attempt, setAttempt] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  useEffect(() => {
    Promise.all([
      base44.entities.AssessmentAttempt.filter({ id: attemptId }),
      base44.entities.Assessment.filter({ id }),
    ]).then(([attempts, asmts]) => {
      setAttempt(attempts[0] || null);
      setAssessment(asmts[0] || null);
      setLoading(false);
    });
  }, [attemptId]);

  // Animate score counter
  useEffect(() => {
    if (!attempt) return;
    const target = attempt.percentage || 0;
    let current = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setScoreDisplay(Math.round(current));
      if (current >= target) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [attempt]);

  if (loading) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
    </div>
  );
  if (!attempt) return null;

  const report = attempt.report_data || {};
  const title = assessment?.[`title_${lang}`] || assessment?.title_ar || (lang === 'ar' ? 'تقييمك' : 'Your Assessment');
  const pct = attempt.percentage || 72;
  const level = attempt.level || 'Advanced';
  const personality = PERSONALITY_TYPES[lang][level] || PERSONALITY_TYPES[lang]['Advanced'];
  const dimensions = report.dimensions || { decision_style: 80, communication: 88, delegation: 65, people_development: 72 };

  const levelBg = pct >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : pct >= 60 ? 'bg-blue-50 text-blue-700 border-blue-200' : pct >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-purple-50 text-purple-700 border-purple-200';

  return (
    <div className="bg-slate-50 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      {/* HERO RESULT BANNER */}
      <div className="py-14 px-6" style={{ background: 'linear-gradient(135deg, #0D1F33 0%, #1A3A5C 60%, #0D2A3F 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-3">{personality.icon}</div>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-bold border" style={{ background: `${personality.color}18`, borderColor: `${personality.color}35`, color: personality.color }}>
            {personality.type}
          </div>
          <h1 className="font-heading font-black text-white text-3xl md:text-4xl mb-2">{title}</h1>
          <p className="text-white/55 text-base italic mb-6">"{personality.tagline}"</p>
          <div className="inline-flex items-center gap-3 bg-white/8 border border-white/12 rounded-2xl px-6 py-3">
            <CheckCircle size={18} className="text-brand-accent" />
            <span className="text-white/80 text-sm">{lang === 'ar' ? 'تم إكمال المقياس بنجاح' : 'Assessment completed successfully'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* SCORE CARD */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circular score */}
            <div className="relative flex-shrink-0">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle cx="80" cy="80" r="68" fill="none" stroke="url(#scoreGrad)" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 68}`}
                  strokeDashoffset={`${2 * Math.PI * 68 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px', transition: 'stroke-dashoffset 1.5s ease' }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1A3A5C" />
                    <stop offset="100%" stopColor="#05E1AE" />
                  </linearGradient>
                </defs>
                <text x="80" y="75" textAnchor="middle" className="font-heading" style={{ fontSize: '32px', fontWeight: 900, fill: '#0D1F33' }}>{scoreDisplay}%</text>
                <text x="80" y="97" textAnchor="middle" style={{ fontSize: '11px', fill: '#94A3B8' }}>{lang === 'ar' ? 'النتيجة الكلية' : 'Total Score'}</text>
              </svg>
            </div>
            <div className="flex-1 text-center md:text-start">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${levelBg}`}>
                  <Star size={12} className="me-1.5" />{level}
                </span>
              </div>
              <h2 className="font-heading font-black text-corp-dark text-2xl mb-2">{personality.type}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {lang === 'ar'
                  ? 'بناءً على إجاباتك، أظهرت نمطاً قيادياً يتسم بالوضوح الاستراتيجي والتوجه نحو النتائج مع قدرة مميزة على إلهام الآخرين.'
                  : 'Based on your responses, you demonstrated a leadership pattern characterized by strategic clarity and results-orientation with a distinctive ability to inspire others.'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {[
                  { label: lang === 'ar' ? 'استراتيجي' : 'Strategic', color: '#05E1AE' },
                  { label: lang === 'ar' ? 'تحليلي' : 'Analytical', color: '#3B82F6' },
                  { label: lang === 'ar' ? 'موجه للنتائج' : 'Results-Driven', color: '#8B5CF6' },
                ].map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ color: tag.color, borderColor: `${tag.color}30`, background: `${tag.color}10` }}>{tag.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DIMENSIONS RADAR */}
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
          <h3 className="font-heading font-bold text-corp-dark text-lg mb-6 flex items-center gap-2">
            <Zap size={18} className="text-brand-accent" />
            {lang === 'ar' ? 'تحليل الأبعاد القيادية' : 'Leadership Dimensions Analysis'}
          </h3>
          <div className="space-y-4">
            {Object.entries(dimensions).map(([key, val], i) => (
              <DimensionBar
                key={key}
                label={DIMENSION_LABELS[key]?.[lang] || key}
                value={val}
                delay={i * 100}
              />
            ))}
          </div>
        </div>

        {/* STRENGTHS + IMPROVEMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-corp-dark text-sm">{lang === 'ar' ? 'نقاط القوة' : 'Strengths'}</h3>
                <p className="text-slate-400 text-xs">{lang === 'ar' ? 'ما تميز به أداؤك' : 'Where you excelled'}</p>
              </div>
            </div>
            <ul className="space-y-3">
              {(report.strengths || []).map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-emerald-500" />
                  </div>
                  <span className="text-slate-700 text-sm leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <Target size={16} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-corp-dark text-sm">{lang === 'ar' ? 'مجالات التطوير' : 'Development Areas'}</h3>
                <p className="text-slate-400 text-xs">{lang === 'ar' ? 'فرصك للنمو' : 'Your growth opportunities'}</p>
              </div>
            </div>
            <ul className="space-y-3">
              {(report.improvements || []).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-xl bg-brand-accent/10 flex items-center justify-center">
              <Lightbulb size={16} className="text-brand-accent" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-corp-dark text-sm">{lang === 'ar' ? 'توصيات التطوير' : 'Development Recommendations'}</h3>
              <p className="text-slate-400 text-xs">{lang === 'ar' ? 'الخطوات المقترحة بناءً على نتائجك' : 'Suggested next steps based on your results'}</p>
            </div>
          </div>
          <div className="space-y-3">
            {(report.recommendations || []).map((rec, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}>
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <span className="text-slate-700 text-sm leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 py-3.5 rounded-2xl font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all" style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)', color: 'white' }}>
            <Download size={15} /> {lang === 'ar' ? 'تحميل التقرير PDF' : 'Download PDF Report'}
          </button>
          <Link to={`/store/assessments/${id}`} className="flex-1 py-3.5 rounded-2xl font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all border border-slate-200 text-slate-700 hover:border-brand-primary/40 hover:text-brand-primary bg-white">
            <RefreshCw size={14} /> {lang === 'ar' ? 'إعادة المقياس' : 'Retake Assessment'}
          </Link>
        </div>

        {/* CTA CONSULTATION */}
        <div className="rounded-3xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #0D1F33, #1A3A5C)' }}>
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-heading font-black text-white text-2xl mb-3">
            {lang === 'ar' ? 'هل تريد تفسيراً معمّقاً لتقريرك؟' : 'Want a deeper interpretation of your report?'}
          </h3>
          <p className="text-white/55 mb-6 text-sm max-w-md mx-auto">
            {lang === 'ar'
              ? 'احجز جلسة مع أحد خبراء أوبتيفانس وحوّل نتائجك إلى خطة تطوير واضحة وقابلة للتنفيذ.'
              : "Book a session with an OPTIVANCE expert and transform your results into a clear, actionable development plan."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/consultation" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-heading font-bold text-sm transition-all" style={{ background: '#05E1AE', color: '#0D1F33' }}>
              <Users size={15} />
              {lang === 'ar' ? 'احجز جلسة تفسير التقرير' : 'Book a Report Interpretation Session'}
              <Arrow size={14} />
            </Link>
            <Link to="/store/assessments" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-heading font-bold text-sm border border-white/20 text-white/80 hover:bg-white/5 transition-all">
              {lang === 'ar' ? 'استكشف مقاييس أخرى' : 'Explore More Assessments'}
            </Link>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}