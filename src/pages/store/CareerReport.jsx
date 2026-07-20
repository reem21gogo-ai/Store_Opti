import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { generateCareerPDF } from '@/lib/generateCareerPDF';
import {
  RIASEC_TYPES, WORK_VALUES, SKILLS, PERSONALITY_AXES, STRENGTHS, ENVIRONMENT_AXES,
  OCCUPATIONS, ACTION_PLAN_PHASES, USER_STATUSES, DISCLAIMER, PRODUCT_INFO
} from '@/lib/careerContent';
import {
  Download, ArrowLeft, ArrowRight, BarChart2, Compass, Heart, Zap,
  Users, Star, Briefcase, Calendar, CheckCircle2, ChevronRight,
  TrendingUp, Target, Sparkles, AlertCircle, BookOpen, Award
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'summary', label: { ar: 'ملخص', en: 'Summary' }, icon: BarChart2 },
  { id: 'riasec', label: { ar: 'ملف RIASEC', en: 'RIASEC Profile' }, icon: Compass },
  { id: 'values', label: { ar: 'قيم العمل', en: 'Work Values' }, icon: Heart },
  { id: 'skills', label: { ar: 'المهارات وأسلوب العمل', en: 'Skills & Style' }, icon: Zap },
  { id: 'strengths', label: { ar: 'نقاط القوة', en: 'Strengths' }, icon: Star },
  { id: 'careers', label: { ar: 'المسارات المهنية', en: 'Career Paths' }, icon: Briefcase },
  { id: 'plan', label: { ar: 'خطة 90 يومًا', en: '90-Day Plan' }, icon: Calendar },
];

function ScoreBar({ score, color, animate }) {
  const [w, setW] = useState(0);
  useEffect(() => { if (animate) setTimeout(() => setW(score), 100); }, [score, animate]);
  return (
    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${animate ? w : score}%`, background: color }} />
    </div>
  );
}

export default function CareerReport() {
  const { attemptId } = useParams();
  const { lang, isRTL } = useLang();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [planTasks, setPlanTasks] = useState({});

  const tr = (ar, en) => (lang === 'ar' ? ar : en);
  const Back = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    const load = async () => {
      const cached = localStorage.getItem(`career_report_${attemptId}`);
      if (cached) {
        try { setAttempt({ report_data: JSON.parse(cached), id: attemptId }); setLoading(false); return; }
        catch {}
      }
      try {
        const data = await base44.entities.AssessmentAttempt.filter({ id: attemptId });
        if (data?.[0]) {
          setAttempt(data[0]);
          if (data[0].report_data) localStorage.setItem(`career_report_${attemptId}`, JSON.stringify(data[0].report_data));
        }
      } catch {}
      setLoading(false);
    };
    load();
    // Load plan tasks
    const savedTasks = localStorage.getItem(`career_plan_${attemptId}`);
    if (savedTasks) setPlanTasks(JSON.parse(savedTasks));
  }, [attemptId]);

  const rpt = attempt?.report_data || {};
  const user = rpt.user || {};
  const isAr = lang === 'ar';

  const downloadPDF = async () => {
    setPdfLoading(true);
    try { await generateCareerPDF(rpt, attemptId); } catch (err) { console.error(err); }
    setPdfLoading(false);
  };

  const toggleTask = (phaseId, taskIdx) => {
    const key = `${phaseId}_${taskIdx}`;
    setPlanTasks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`career_plan_${attemptId}`, JSON.stringify(next));
      return next;
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
    </div>
  );

  if (!attempt) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center">
        <p className="text-slate-500 mb-4">{tr('التقرير غير متوفر', 'Report not found')}</p>
        <Link to="/store/career" className="text-brand-primary text-sm font-medium">{tr('العودة', 'Go back')}</Link>
      </div>
    </div>
  );

  const holland = rpt.holland || { hollandCode: '---', top3: [] };
  const riasec = rpt.riasec || {};
  const workValues = rpt.workValues || {};
  const skills = rpt.skills || {};
  const personality = rpt.personality || {};
  const strengths = rpt.strengths || {};
  const environment = rpt.environment || {};
  const careerMatches = rpt.careerMatches || [];
  const top3Careers = rpt.top3Careers || careerMatches.slice(0, 3);
  const top6Careers = rpt.top6Careers || careerMatches.slice(0, 6);
  const altCareers = rpt.alternativeCareers || careerMatches.slice(6, 9);
  const insights = rpt.insights || [];
  const topFamilies = rpt.topFamilies || [];
  const userStatus = user.status || 'job_seeker';

  return (
    <div className="bg-store-bg min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Link to="/store/account" className="flex items-center gap-2 text-slate-400 hover:text-brand-primary text-xs mb-3 transition-colors w-fit">
                <Back size={12} /> {tr('لوحتي', 'My Dashboard')}
              </Link>
              <h1 className="font-heading font-black text-corp-dark text-xl mb-1">
                {tr(PRODUCT_INFO.name_ar, PRODUCT_INFO.name_en)}
              </h1>
              <p className="text-slate-400 text-xs">
                {tr(`أُعدّ لـ: ${user.name}`, `Prepared for: ${user.name}`)}
                {user.completion_date && ` • ${user.completion_date}`}
              </p>
            </div>
            <button onClick={downloadPDF} disabled={pdfLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#336fa3,#05e1ae)' }}>
              <Download size={14} />
              {pdfLoading ? tr('جاري التحميل...', 'Generating...') : tr('تحميل PDF', 'Download PDF')}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-3 sticky top-24">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 text-start ${
                      activeTab === item.id ? 'bg-brand-primary/8 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'
                    }`}>
                    <Icon size={15} className={activeTab === item.id ? 'text-brand-primary' : 'text-slate-400'} />
                    {tr(item.label.ar, item.label.en)}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

              {/* ══ SUMMARY ══ */}
              {activeTab === 'summary' && (
                <div className="space-y-5">
                  {/* Holland Code Hero */}
                  <div className="bg-gradient-to-br from-corp-dark via-brand-primary/90 to-corp-surface rounded-2xl p-8 text-center relative overflow-hidden">
                    <div className="relative z-10">
                      <span className="text-xs text-white/50 font-semibold tracking-widest mb-2 block">{tr('رمز هولاند', 'HOLLAND CODE')}</span>
                      <div className="font-heading font-black text-5xl text-white mb-3 tracking-wider">{holland.hollandCode}</div>
                      <div className="flex justify-center gap-2 flex-wrap">
                        {holland.top3?.map((t, i) => (
                          <span key={i} className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-white">
                            {RIASEC_TYPES[t.code]?.name[lang]} • {t.score}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key highlights grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top work values */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                      <h4 className="font-heading font-bold text-corp-dark text-sm mb-3 flex items-center gap-2">
                        <Heart size={15} className="text-brand-primary" /> {tr('أهم قيم العمل', 'Top Work Values')}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(workValues).sort((a, b) => b[1].normalized - a[1].normalized).slice(0, 3).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">{WORK_VALUES[k]?.name[lang]}</span>
                            <span className="font-heading font-bold text-sm text-brand-primary">{v.normalized}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Top strengths */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                      <h4 className="font-heading font-bold text-corp-dark text-sm mb-3 flex items-center gap-2">
                        <Star size={15} className="text-brand-accent" /> {tr('أبرز نقاط القوة', 'Top Strengths')}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(strengths).sort((a, b) => b[1].normalized - a[1].normalized).slice(0, 3).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">{STRENGTHS[k]?.name[lang]}</span>
                            <span className="font-heading font-bold text-sm text-brand-accent">{v.normalized}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top 6 careers */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <h4 className="font-heading font-bold text-corp-dark text-sm mb-4 flex items-center gap-2">
                      <Briefcase size={15} className="text-brand-primary" /> {tr('أفضل 6 مسارات مهنية', 'Top 6 Career Matches')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {top6Careers.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl p-3 bg-slate-50 border border-slate-100">
                          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-corp-dark text-sm truncate">{tr(m.occupation.title_ar, m.occupation.title_en)}</div>
                            <div className="text-xs text-slate-400">{tr(m.occupation.family_ar, m.occupation.family_en)}</div>
                          </div>
                          <span className="font-heading font-black text-sm text-brand-primary">{m.fitScore}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <h4 className="font-heading font-bold text-corp-dark text-sm mb-4 flex items-center gap-2">
                      <Sparkles size={15} className="text-brand-accent" /> {tr('رؤى مخصصة', 'Personalized Insights')}
                    </h4>
                    <div className="space-y-3">
                      {insights.map((ins, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl p-3 bg-brand-accent/5 border border-brand-accent/10">
                          <ChevronRight size={14} className="text-brand-accent flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-600 leading-relaxed">{ins}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ RIASEC ══ */}
              {activeTab === 'riasec' && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h2 className="font-heading font-black text-corp-dark text-xl mb-2">{tr('ملف الميول المهنية', 'RIASEC Interest Profile')}</h2>
                    <p className="text-slate-400 text-sm mb-6">{tr('ستة أبعاد ميول مهنية مرتبة حسب قوتها', 'Six career interest dimensions ranked by strength')}</p>
                    <div className="space-y-4">
                      {Object.entries(riasec).sort((a, b) => b[1].normalized - a[1].normalized).map(([code, data]) => {
                        const type = RIASEC_TYPES[code];
                        return (
                          <div key={code}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: type?.color }}>
                                  {code}
                                </div>
                                <span className="font-semibold text-corp-dark text-sm">{type?.name[lang]}</span>
                              </div>
                              <span className="font-heading font-black text-sm" style={{ color: type?.color }}>{data.normalized}%</span>
                            </div>
                            <ScoreBar score={data.normalized} color={type?.color} animate />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top 3 detailed cards */}
                  <div className="space-y-4">
                    {holland.top3?.map((t, i) => {
                      const type = RIASEC_TYPES[t.code];
                      return (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: type?.color }}>
                              {t.code}
                            </div>
                            <div>
                              <h3 className="font-heading font-bold text-corp-dark text-base">{type?.name[lang]}</h3>
                              <span className="text-xs text-slate-400">{t.score}% {tr('تطابق', 'match')}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed mb-3">{type?.description[lang]}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-xl p-3 bg-slate-50">
                              <div className="text-xs font-semibold text-slate-400 mb-1.5">{tr('الأنشطة المفضلة', 'Preferred Activities')}</div>
                              <ul className="space-y-1">
                                {type?.activities[lang].slice(0, 3).map((a, j) => (
                                  <li key={j} className="text-xs text-slate-600 flex items-start gap-1.5">
                                    <CheckCircle2 size={11} className="text-brand-accent flex-shrink-0 mt-0.5" /> {a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-xl p-3 bg-slate-50">
                              <div className="text-xs font-semibold text-slate-400 mb-1.5">{tr('المسارات المرتبطة', 'Related Careers')}</div>
                              <div className="flex flex-wrap gap-1.5">
                                {type?.careers[lang].map((c, j) => (
                                  <span key={j} className="text-xs bg-white border border-slate-100 rounded-full px-2.5 py-1 text-slate-600">{c}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ══ WORK VALUES ══ */}
              {activeTab === 'values' && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h2 className="font-heading font-black text-corp-dark text-xl mb-2">{tr('قيم العمل والتحفيزات', 'Work Values & Motivations')}</h2>
                  <p className="text-slate-400 text-sm mb-6">{tr('ما يحفزك ويهمك في بيئة العمل', 'What motivates and matters to you at work')}</p>
                  <div className="space-y-4">
                    {Object.entries(workValues).sort((a, b) => b[1].normalized - a[1].normalized).map(([k, v]) => (
                      <div key={k} className="rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-heading font-bold text-corp-dark text-sm">{WORK_VALUES[k]?.name[lang]}</span>
                          <span className="font-heading font-black text-sm text-brand-primary">{v.normalized}%</span>
                        </div>
                        <ScoreBar score={v.normalized} color="#336fa3" animate />
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{WORK_VALUES[k]?.description[lang]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ SKILLS & STYLE ══ */}
              {activeTab === 'skills' && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h2 className="font-heading font-black text-corp-dark text-xl mb-2">{tr('المهارات والقدرات', 'Skills & Abilities')}</h2>
                    <p className="text-slate-400 text-sm mb-6">{tr('تقييمك الذاتي لقدراتك الأساسية', 'Your self-assessed core abilities')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(skills).map(([k, v]) => (
                        <div key={k} className="rounded-xl p-4 border border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-corp-dark text-sm">{SKILLS[k]?.name[lang]}</span>
                            <span className="font-heading font-bold text-sm text-brand-primary">{v.normalized}%</span>
                          </div>
                          <ScoreBar score={v.normalized} color="#05e1ae" animate />
                          <p className="text-xs text-slate-400 mt-2">{SKILLS[k]?.description[lang]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h3 className="font-heading font-bold text-corp-dark text-base mb-4">{tr('أسلوب العمل والشخصية', 'Work Style & Personality')}</h3>
                    <div className="space-y-4">
                      {Object.entries(personality).map(([k, v]) => {
                        const axis = PERSONALITY_AXES[k];
                        const leftPct = 100 - v.normalized;
                        return (
                          <div key={k}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-slate-500">{axis?.left[lang]}</span>
                              <span className="text-xs text-slate-400">{axis?.name[lang]}</span>
                              <span className="text-xs font-semibold text-slate-500">{axis?.right[lang]}</span>
                            </div>
                            <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="absolute top-0 bottom-0 bg-brand-primary/30 rounded-full" style={{ left: `${Math.min(leftPct, v.normalized)}%`, width: `${Math.abs(v.normalized - 50) * 2}%` }} />
                              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-primary border-2 border-white shadow" style={{ left: `${v.normalized}%`, transform: 'translate(-50%, -50%)' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ STRENGTHS ══ */}
              {activeTab === 'strengths' && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h2 className="font-heading font-black text-corp-dark text-xl mb-2">{tr('نقاط القوة المهنية', 'Natural Professional Strengths')}</h2>
                  <p className="text-slate-400 text-sm mb-6">{tr('نقاط قوتك الطبيعية المرتبطة بالأداء المهني', 'Your natural strengths linked to professional performance')}</p>
                  <div className="space-y-4">
                    {Object.entries(strengths).sort((a, b) => b[1].normalized - a[1].normalized).map(([k, v]) => (
                      <div key={k} className="rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-heading font-bold text-corp-dark text-sm">{STRENGTHS[k]?.name[lang]}</span>
                            <p className="text-xs text-slate-400 mt-0.5">{STRENGTHS[k]?.description[lang]}</p>
                          </div>
                          <span className="font-heading font-black text-lg text-brand-accent">{v.normalized}%</span>
                        </div>
                        <ScoreBar score={v.normalized} color="#05e1ae" animate />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ CAREERS ══ */}
              {activeTab === 'careers' && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h2 className="font-heading font-black text-corp-dark text-xl mb-2">{tr('المسارات المهنية المطابقة', 'Matching Career Paths')}</h2>
                    <p className="text-slate-400 text-sm mb-4">{tr('مسارات مهنية مختارة بناءً على ميولك ومهاراتك وقيمك', 'Careers selected based on your interests, skills, and values')}</p>
                    {topFamilies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {topFamilies.map((f, i) => (
                          <span key={i} className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Top 6 matches */}
                  <div className="space-y-3">
                    {top6Careers.map((m, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold">
                              {i + 1}
                            </div>
                            <div>
                              <h3 className="font-heading font-bold text-corp-dark text-base">{tr(m.occupation.title_ar, m.occupation.title_en)}</h3>
                              <p className="text-xs text-slate-400">{tr(m.occupation.family_ar, m.occupation.family_en)}</p>
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="font-heading font-black text-2xl text-brand-primary">{m.fitScore}%</div>
                            <div className="text-xs text-slate-400">{tr('تطابق', 'fit')}</div>
                          </div>
                        </div>
                        {/* Component scores */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                          {[
                            { label: tr('الميول', 'Interests'), val: m.components.riasec },
                            { label: tr('المهارات', 'Skills'), val: m.components.skills },
                            { label: tr('القيم', 'Values'), val: m.components.values },
                            { label: tr('القوة', 'Strengths'), val: m.components.strengths },
                            { label: tr('الأسلوب', 'Style'), val: m.components.style },
                            { label: tr('البيئة', 'Environment'), val: m.components.environment },
                          ].map((c, j) => (
                            <div key={j} className="text-center bg-slate-50 rounded-lg p-2">
                              <div className="text-xs text-slate-400 mb-0.5">{c.label}</div>
                              <div className="text-xs font-bold text-corp-dark">{c.val}%</div>
                            </div>
                          ))}
                        </div>
                        {/* Why it fits + gap */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-xl p-3 bg-brand-accent/5 border border-brand-accent/10">
                            <div className="text-xs font-semibold text-brand-accent mb-1">{tr('لماذا يناسبك', 'Why It Fits')}</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {tr(
                                `يتوافق مع ميولك ${RIASEC_TYPES[holland.top3[0]?.code]?.name[lang]} ومهاراتك في ${SKILLS[Object.entries(skills).sort((a,b)=>b[1].normalized-a[1].normalized)[0]?.[0]]?.name[lang]}.`,
                                `Matches your ${RIASEC_TYPES[holland.top3[0]?.code]?.name[lang]} interests and your ${SKILLS[Object.entries(skills).sort((a,b)=>b[1].normalized-a[1].normalized)[0]?.[0]]?.name[lang]} skills.`
                              )}
                            </p>
                          </div>
                          <div className="rounded-xl p-3 bg-amber-50 border border-amber-100">
                            <div className="text-xs font-semibold text-amber-600 mb-1">{tr('فجوة التطوير', 'Development Gap')}</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {tr(m.occupation.education_ar, m.occupation.education_en)}
                            </p>
                          </div>
                        </div>
                        {/* Next step */}
                        <div className="mt-3 flex items-start gap-2 rounded-xl p-3 bg-brand-primary/5">
                          <Target size={14} className="text-brand-primary flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-600">
                            <span className="font-semibold text-brand-primary">{tr('الخطوة التالية: ', 'Next Step: ')}</span>
                            {tr(m.occupation.pathways_ar[0], m.occupation.pathways_en[0])}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Alternative careers */}
                  {altCareers.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                      <h3 className="font-heading font-bold text-corp-dark text-sm mb-3">{tr('مسارات بديلة ومجاورة', 'Alternative & Adjacent Careers')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {altCareers.map((m, i) => (
                          <div key={i} className="rounded-xl p-3 bg-slate-50 border border-slate-100">
                            <div className="font-semibold text-corp-dark text-sm mb-1">{tr(m.occupation.title_ar, m.occupation.title_en)}</div>
                            <div className="text-xs text-slate-400 mb-2">{tr(m.occupation.family_ar, m.occupation.family_en)}</div>
                            <div className="flex items-center gap-2">
                              <ScoreBar score={m.fitScore} color="#336fa3" animate={false} />
                              <span className="text-xs font-bold text-brand-primary">{m.fitScore}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══ 90-DAY PLAN ══ */}
              {activeTab === 'plan' && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h2 className="font-heading font-black text-corp-dark text-xl mb-2">{tr('خطة 90 يومًا', '90-Day Action Plan')}</h2>
                    <p className="text-slate-400 text-sm mb-2">
                      {tr('مخصصة لـ: ', 'Personalized for: ')}
                      <span className="font-semibold text-brand-primary">{USER_STATUSES[userStatus]?.[lang]}</span>
                    </p>
                  </div>

                  {ACTION_PLAN_PHASES.map((phase, pi) => {
                    const tasks = phase.tasks[userStatus] || phase.tasks.job_seeker;
                    const completedCount = tasks.filter((_, ti) => planTasks[`${phase.id}_${ti}`]).length;
                    const phaseProgress = Math.round((completedCount / tasks.length) * 100);
                    return (
                      <div key={pi} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: phase.color }}>
                              {pi + 1}
                            </div>
                            <div>
                              <h3 className="font-heading font-bold text-corp-dark text-base">{tr(phase.name.ar, phase.name.en)}</h3>
                              <span className="text-xs text-slate-400">{tr(phase.days.ar, phase.days.en)}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-400">{completedCount}/{tasks.length}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                          <div className="h-full rounded-full transition-all" style={{ width: `${phaseProgress}%`, background: phase.color }} />
                        </div>
                        <div className="space-y-2">
                          {tasks.map((task, ti) => {
                            const done = planTasks[`${phase.id}_${ti}`];
                            return (
                              <button key={ti} onClick={() => toggleTask(phase.id, ti)}
                                className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-start ${
                                  done ? 'bg-brand-accent/5 border-brand-accent/20' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                                }`}>
                                <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                                  done ? 'bg-brand-accent border-brand-accent' : 'border-slate-300'
                                }`}>
                                  {done && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                                <span className={`text-sm ${done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{tr(task.ar || task, task.en || task)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Disclaimer */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 leading-relaxed">{DISCLAIMER[lang]}</p>
                  </div>
                </div>
              )}

            </motion.div>
          </main>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}