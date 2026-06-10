/**
 * CompetencyReport — fully dynamic bilingual report viewer.
 * Pulls report_data from AssessmentAttempt entity (or localStorage fallback).
 * All content sourced from competencyContent.js content library.
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle,
  TrendingUp, Users, Brain, Target, BarChart2, Zap, Home,
  ChevronRight, BookOpen, Star, Award, Compass } from
'lucide-react';
import { generateCompetencyPDF } from '@/lib/generateCompetencyPDF';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';
import { DOMAINS, BAND_CONFIG, getBand, OVERALL_SUMMARIES, LEVEL_LABELS } from '@/lib/competencyContent';

// ─── helpers ──────────────────────────────────────────────────────────────────
const bandColor = (band) => BAND_CONFIG[band]?.color || '#64748b';
const bandBg = (band) => BAND_CONFIG[band]?.bg || '#64748b12';
const bandBorder = (band) => BAND_CONFIG[band]?.border || '#64748b30';
const bandLabel = (band, lang) => BAND_CONFIG[band]?.label?.[lang] || band;

const DOMAIN_ICONS = {
  thought_analysis: Brain,
  results_execution: Target,
  people_collaboration: Users,
  self_leadership: Compass,
  customer_value: Star,
  digital_compliance: Zap
};

// ─── sub-components ────────────────────────────────────────────────────────────
function ScoreBar({ score, color, animate }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {if (animate) setTimeout(() => setWidth(score), 100);}, [score, animate]);
  return (
    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000"
      style={{ width: `${animate ? width : score}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
    </div>);

}

function BandBadge({ band, lang, size = 'sm' }) {
  const color = bandColor(band);
  const label = bandLabel(band, lang);
  return (
    <span className={`inline-flex items-center font-bold rounded-full px-2.5 py-1 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}
    style={{ background: bandBg(band), color, border: `1px solid ${bandBorder(band)}` }}>
      {label}
    </span>);

}

function DomainSection({ domain, domainData, lang, sectionRef }) {
  const lang_key = lang === 'ar' ? 'ar' : 'en';
  const band = domainData?.band || 'Moderate';
  const score = domainData?.score || 0;
  const content = domain.content[band]?.[lang_key];
  const color = bandColor(band);
  const Icon = DOMAIN_ICONS[domain.id] || BarChart2;

  return (
    <div ref={sectionRef} className="mb-10 pb-10 border-b border-slate-100 last:border-b-0">
      {/* Domain header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bandBg(band), border: `1px solid ${bandBorder(band)}` }}>
            <Icon size={18} style={{ color }} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-corp-dark text-lg leading-tight">
              {domain.name[lang_key]}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">{domain.description[lang_key]}</p>
          </div>
        </div>
        <div className="text-end flex-shrink-0">
          <div className="font-heading font-black text-3xl" style={{ color }}>{score}%</div>
          <BandBadge band={band} lang={lang} />
        </div>
      </div>

      <ScoreBar score={score} color={color} animate />

      {content &&
      <div className="mt-5 space-y-4">
          {/* Summary */}
          <p className="text-slate-600 text-sm leading-relaxed">{content.summary}</p>

          {/* Strengths or signs */}
          {content.strengths?.length > 0 &&
        <div className="rounded-xl p-4" style={{ background: bandBg(band), border: `1px solid ${bandBorder(band)}` }}>
              <div className="font-semibold text-xs mb-2.5" style={{ color }}>
                {lang === 'ar' ? 'نقاط القوة / المؤشرات' : 'Strengths / Indicators'}
              </div>
              <ul className="space-y-1.5">
                {content.strengths.map((s, i) =>
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 size={12} style={{ color, flexShrink: 0, marginTop: 1 }} />{s}
                  </li>
            )}
              </ul>
            </div>
        }

          {/* Recommendations */}
          {content.recommendations?.length > 0 &&
        <div className="rounded-xl p-4 bg-white border border-slate-100">
              <div className="font-semibold text-xs text-slate-500 mb-2.5">
                {lang === 'ar' ? 'التوصيات' : 'Recommendations'}
              </div>
              <ul className="space-y-1.5">
                {content.recommendations.map((r, i) =>
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <ChevronRight size={12} className="text-brand-primary flex-shrink-0 mt-0.5" />{r}
                  </li>
            )}
              </ul>
            </div>
        }

          {/* Goals */}
          {content.goals &&
        <div className="grid grid-cols-3 gap-3">
              {[
          { key: 'short', label: { ar: '٠–٣٠ يوم', en: '0–30 days' } },
          { key: 'mid', label: { ar: '٣٠–٩٠ يوم', en: '30–90 days' } },
          { key: 'long', label: { ar: '٩٠+ يوم', en: '90+ days' } }].
          map((g) =>
          <div key={g.key} className="rounded-xl p-3 bg-slate-50 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 mb-1">{g.label[lang_key]}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{content.goals[g.key]}</p>
                </div>
          )}
            </div>
        }
        </div>
      }
    </div>);

}

// ─── main component ────────────────────────────────────────────────────────────
export default function CompetencyReport() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('snapshot');

  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Try localStorage first (immediate after submit)
      const cached = localStorage.getItem(`optivance_report_${attemptId}`);
      if (cached) {
        try {setAttempt({ report_data: JSON.parse(cached), id: attemptId });setLoading(false);return;}
        catch {}
      }
      // Fallback: fetch from entity
      try {
        const data = await base44.entities.AssessmentAttempt.filter({ id: attemptId });
        if (data?.[0]) {
          setAttempt(data[0]);
          if (data[0].report_data) localStorage.setItem(`optivance_report_${attemptId}`, JSON.stringify(data[0].report_data));
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [attemptId]);

  const rpt = attempt?.report_data || {};
  const lang = rpt.language || 'ar';
  const isRTL = lang === 'ar';
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const domainScores = rpt.domain_scores || {};
  const overall = rpt.overall || { score: 0, band: 'Moderate' };
  const user = rpt.user || {};

  // Sorted domains: worst first (for dev plan), best first (for strengths)
  const sortedDomains = DOMAINS.map((d) => ({
    ...d,
    score: domainScores[d.id]?.score || 0,
    band: domainScores[d.id]?.band || 'Critical'
  }));
  const priorityDomains = [...sortedDomains].sort((a, b) => a.score - b.score).slice(0, 3);
  const topDomains = [...sortedDomains].sort((a, b) => b.score - a.score).slice(0, 2);
  const overallSummary = OVERALL_SUMMARIES[overall.band]?.[lang] || '';
  const levelLabel = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '';

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      await generateCompetencyPDF(rpt, attemptId);
    } catch (err) {console.error(err);}
    setPdfLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
    </div>);


  if (!attempt) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center">
        <p className="text-slate-500 mb-4">{t('التقرير غير متوفر', 'Report not found')}</p>
        <Link to="/store/competency" className="text-brand-primary text-sm font-medium">{t('العودة', 'Go back')}</Link>
      </div>
    </div>);


  const NAV_ITEMS = [
  { id: 'snapshot', label: t('النتائج العامة', 'Overall Results'), icon: BarChart2 },
  { id: 'domains', label: t('تحليل المجالات', 'Domain Analysis'), icon: TrendingUp },
  { id: 'devplan', label: t('خطة التطوير', 'Development Plan'), icon: Target },
  { id: 'nextsteps', label: t('الخطوات القادمة', 'Next Steps'), icon: ChevronRight },
  { id: 'about', label: t('عن أوبتيفانس', 'About Optivance'), icon: BookOpen }];


  return (
    <div className="bg-store-bg min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Link to="/store/account" className="flex items-center gap-2 text-slate-400 hover:text-brand-primary text-xs mb-3 transition-colors w-fit">
                <BackArrow size={12} /> {t('لوحتي', 'My Dashboard')}
              </Link>
              <h1 className="font-heading font-black text-corp-dark text-xl mb-1">
                {t('تقرير مقياس الكفاءات الأساسية', 'Core Competency Assessment Report')}
              </h1>
              <p className="text-slate-400 text-xs">
                {t(`أُعدّ لـ: ${user.name}`, `Prepared for: ${user.name}`)}
                {levelLabel && ` • ${levelLabel}`}
                {user.completion_date && ` • ${user.completion_date}`}
                {rpt.report_id && ` • ID: ${rpt.report_id}`}
              </p>
            </div>
            <button onClick={downloadPDF} disabled={pdfLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#1A3A5C,#05E1AE)' }}>
              <Download size={14} />
              {pdfLoading ? t('جاري التحميل...', 'Generating...') : t('تحميل PDF', 'Download PDF')}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-3 sticky top-24">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 text-start ${
                  activeSection === item.id ? 'bg-brand-primary/8 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`
                  }>
                    <Icon size={15} className={activeSection === item.id ? 'text-brand-primary' : 'text-slate-400'} />
                    {item.label}
                  </button>);

              })}
            </div>
          </aside>

          {/* Report content */}
          <main className="flex-1 min-w-0">

            {/* ══ SNAPSHOT ══ */}
            {activeSection === 'snapshot' &&
            <div className="space-y-6">
                {/* Cover */}
                <div className="bg-gradient-to-br from-corp-dark via-brand-primary/90 to-corp-surface rounded-2xl p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 text-[hsl(var(--background))]"
                style={{ backgroundImage: 'linear-gradient(rgba(5,225,174,1) 1px, transparent 1px), linear-gradient(90deg,rgba(5,225,174,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-accent/15 border border-brand-accent/25 rounded-full px-3 py-1 mb-4">
                      <span className="font-heading font-black text-xs tracking-widest text-[hsl(var(--foreground))]">OPTIVANCE</span>
                    </div>
                    <h2 className="font-heading font-black text-2xl mb-1 text-[hsl(var(--foreground))]">
                      {t('تقرير الكفاءات والنمو المهني', 'Competency & Growth Report')}
                    </h2>
                    <p className="text-white/60 text-sm mb-6">
                      {t('مقياس الجدارات الأساسية للموظف', 'Employee Core Competency Assessment')}
                    </p>
                    {/* Overall score circle */}
                    <div className="flex justify-center mb-6">
                      <div className="relative w-36 h-36">
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" />
                          <circle cx="100" cy="100" r="85" fill="none"
                        stroke="url(#rGrad)" strokeWidth="14"
                        strokeDasharray={`${overall.score / 100 * 534} 534`}
                        strokeLinecap="round" transform="rotate(-90 100 100)" />
                          <defs>
                            <linearGradient id="rGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#05E1AE" />
                              <stop offset="100%" stopColor="#3a9abf" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="font-heading font-black text-4xl text-[hsl(var(--foreground))]">{overall.score}%</div>
                          <div className="text-xs text-[hsl(var(--foreground))]">{t('النتيجة الإجمالية', 'Overall Score')}</div>
                        </div>
                      </div>
                    </div>
                    <BandBadge band={overall.band} lang={lang} size="lg" />
                    <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-white/60 max-w-xs mx-auto">
                      <div><span className="block text-white/40">{t('الاسم', 'Name')}</span>{user.preferred_name || user.name}</div>
                      <div><span className="block text-white/40">{t('المستوى', 'Level')}</span>{levelLabel}</div>
                      <div><span className="block text-white/40">{t('التاريخ', 'Date')}</span>{user.completion_date}</div>
                    </div>
                  </div>
                </div>

                {/* Overall summary */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="font-heading font-bold text-corp-dark text-base mb-3">
                    {t('تفسير نتيجتك', 'Your Score Interpretation')}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{overallSummary}</p>
                </div>

                {/* Domain score cards */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="font-heading font-bold text-corp-dark text-base mb-5">
                    {t('نتائج المجالات الستة', 'Six Domain Scores')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedDomains.map((d, i) => {
                    const Icon = DOMAIN_ICONS[d.id] || BarChart2;
                    return (
                      <div key={i} className="rounded-xl p-4 border border-slate-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Icon size={14} style={{ color: bandColor(d.band) }} />
                              <span className="font-semibold text-corp-dark text-sm">{d.name[lang === 'ar' ? 'ar' : 'en']}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-black text-lg" style={{ color: bandColor(d.band) }}>{d.score}%</span>
                              <BandBadge band={d.band} lang={lang} />
                            </div>
                          </div>
                          <ScoreBar score={d.score} color={bandColor(d.band)} animate />
                        </div>);

                  })}
                  </div>
                </div>

                {/* Strengths & Priorities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <h4 className="font-heading font-bold text-corp-dark text-sm mb-4 flex items-center gap-2">
                      <Award size={15} className="text-brand-accent" />
                      {t('أبرز نقاط القوة', 'Key Strengths')}
                    </h4>
                    <div className="space-y-2.5">
                      {topDomains.map((d, i) =>
                    <div key={i} className="flex items-center gap-2.5 rounded-xl p-3" style={{ background: bandBg(d.band) }}>
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: bandColor(d.band) }} />
                          <span className="text-sm font-medium text-slate-700">{d.name[lang === 'ar' ? 'ar' : 'en']}</span>
                          <span className="ms-auto font-heading font-bold text-sm" style={{ color: bandColor(d.band) }}>{d.score}%</span>
                        </div>
                    )}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <h4 className="font-heading font-bold text-corp-dark text-sm mb-4 flex items-center gap-2">
                      <AlertTriangle size={15} className="text-amber-500" />
                      {t('أولويات التطوير', 'Development Priorities')}
                    </h4>
                    <div className="space-y-2.5">
                      {priorityDomains.map((d, i) =>
                    <div key={i} className="flex items-center gap-2.5 rounded-xl p-3" style={{ background: bandBg(d.band) }}>
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: bandColor(d.band) }} />
                          <span className="text-sm font-medium text-slate-700">{d.name[lang === 'ar' ? 'ar' : 'en']}</span>
                          <span className="ms-auto font-heading font-bold text-sm" style={{ color: bandColor(d.band) }}>{d.score}%</span>
                        </div>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* ══ DOMAIN ANALYSIS ══ */}
            {activeSection === 'domains' &&
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
                <h2 className="font-heading font-black text-corp-dark text-xl mb-2">
                  {t('تحليل مفصّل لكل مجال', 'Detailed Domain Analysis')}
                </h2>
                <p className="text-slate-400 text-sm mb-8">
                  {t('كل مجال يعكس مجموعة من الكفاءات الأساسية وأدائك فيها', 'Each domain reflects a group of core competencies and your performance in them')}
                </p>
                {DOMAINS.map((domain) =>
              <DomainSection
                key={domain.id}
                domain={domain}
                domainData={domainScores[domain.id]}
                lang={lang} />

              )}
              </div>
            }

            {/* ══ DEVELOPMENT PLAN ══ */}
            {activeSection === 'devplan' &&
            <div className="space-y-5">
                {/* Profile card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h2 className="font-heading font-black text-corp-dark text-xl mb-5">
                    {t('خطة التطوير الشخصية', 'Personal Development Plan')}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 mb-4">
                    {[
                  { label: t('الاسم المفضل', 'Preferred Name'), value: user.preferred_name || user.name },
                  { label: t('المستوى المهني', 'Professional Level'), value: levelLabel },
                  { label: t('تاريخ الإكمال', 'Completion Date'), value: user.completion_date },
                  { label: t('رقم التقرير', 'Report ID'), value: rpt.report_id }].
                  map((item, i) =>
                  <div key={i}>
                        <div className="text-xs text-slate-400 mb-0.5">{item.label}</div>
                        <div className="text-sm font-semibold text-corp-dark">{item.value || '—'}</div>
                      </div>
                  )}
                  </div>
                  {(user.motivation || user.customMotivation) &&
                <div className="bg-brand-primary/5 border border-brand-primary/15 rounded-xl p-4">
                      <div className="text-xs text-brand-primary font-semibold mb-1">
                        {t('دافعك للتطوير', 'Your Motivation')}
                      </div>
                      <p className="text-sm text-slate-600">{user.customMotivation || user.motivation}</p>
                    </div>
                }
                </div>

                {/* Priority domains */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="font-heading font-bold text-corp-dark text-base mb-4">
                    {t('أولويات التطوير المقترحة', 'Suggested Development Priorities')}
                  </h3>
                  <div className="space-y-4">
                    {priorityDomains.map((d, i) => {
                    const lang_key = lang === 'ar' ? 'ar' : 'en';
                    const content = d.content[d.band]?.[lang_key];
                    const goals = content?.goals;
                    return (
                      <div key={i} className="rounded-xl border border-slate-100 overflow-hidden">
                          <div className="flex items-center justify-between px-5 py-3.5" style={{ background: bandBg(d.band) }}>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-8 rounded-full" style={{ background: bandColor(d.band) }} />
                              <div>
                                <div className="font-heading font-bold text-corp-dark text-sm">{d.name[lang_key]}</div>
                                <div className="text-xs" style={{ color: bandColor(d.band) }}>{d.score}% — {bandLabel(d.band, lang)}</div>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ background: bandColor(d.band) }}>
                              {t(`أولوية ${i + 1}`, `Priority ${i + 1}`)}
                            </span>
                          </div>
                          {goals &&
                        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {[
                          { key: 'short', label: { ar: 'هدف قصير (٠–٣٠ يوم)', en: 'Short-Term (0–30 days)' } },
                          { key: 'mid', label: { ar: 'هدف متوسط (٣٠–٩٠ يوم)', en: 'Mid-Term (30–90 days)' } },
                          { key: 'long', label: { ar: 'هدف طويل (٩٠+ يوم)', en: 'Long-Term (90+ days)' } }].
                          map((g) =>
                          <div key={g.key} className="rounded-lg p-3 bg-slate-50 border border-slate-100">
                                  <div className="text-xs font-semibold text-slate-400 mb-1.5">{g.label[lang_key]}</div>
                                  <p className="text-xs text-slate-600 leading-relaxed">{goals[g.key]}</p>
                                </div>
                          )}
                            </div>
                        }
                        </div>);

                  })}
                  </div>
                </div>

                {/* Monthly reflection template */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="font-heading font-bold text-corp-dark text-base mb-4">
                    {t('التأمل الشهري', 'Monthly Reflection')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                  { q: { ar: 'ماذا تحسّن هذا الشهر؟', en: 'What improved this month?' } },
                  { q: { ar: 'ما التحديات التي واجهتني؟', en: 'What challenges did I face?' } },
                  { q: { ar: 'ما الذي يجب تعديله؟', en: 'What should I adjust?' } },
                  { q: { ar: 'ما ركيزتي للشهر القادم؟', en: 'What is my next month focus?' } }].
                  map((item, i) =>
                  <div key={i} className="rounded-xl border border-dashed border-slate-200 p-4 min-h-[80px]">
                        <div className="text-xs font-semibold text-slate-400 mb-2">{item.q[lang === 'ar' ? 'ar' : 'en']}</div>
                        <div className="h-px bg-slate-100 w-full mt-4" />
                        <div className="h-px bg-slate-100 w-3/4 mt-3" />
                      </div>
                  )}
                  </div>
                </div>
              </div>
            }

            {/* ══ NEXT STEPS ══ */}
            {activeSection === 'nextsteps' &&
            <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h2 className="font-heading font-black text-corp-dark text-xl mb-6">
                    {t('خطواتك القادمة', 'Your Next Steps')}
                  </h2>
                  <div className="space-y-4">
                    {[
                  { icon: BookOpen, label: { ar: 'راجع تقريرك', en: 'Review Your Report' },
                    desc: { ar: 'اقرأ التحليل التفصيلي لكل مجال وافهم ما تعنيه نتيجتك', en: 'Read the detailed analysis for each domain and understand what your score means' } },
                  { icon: Target, label: { ar: 'حدد أهدافك', en: 'Set Your Goals' },
                    desc: { ar: 'اختر هدفين أو ثلاثة من خطة التطوير تبدأ بها هذا الشهر', en: 'Choose two or three goals from the development plan to start this month' } },
                  { icon: Users, label: { ar: 'شارك مع مشرفك أو مرشدك', en: 'Share with Your Manager or Mentor' },
                    desc: { ar: 'ناقش نتائجك مع مشرفك المباشر أو مرشدك المهني', en: 'Discuss your results with your direct manager or professional mentor' } },
                  { icon: CheckCircle2, label: { ar: 'تابع تقدمك شهريًا', en: 'Track Monthly Progress' },
                    desc: { ar: 'استخدم صفحة التأمل الشهري لتقييم تطورك وتعديل خطتك', en: 'Use the monthly reflection page to evaluate growth and adjust your plan' } }].
                  map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: '#1A3A5C' }}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-corp-dark text-sm mb-1">{step.label[lang === 'ar' ? 'ar' : 'en']}</div>
                            <p className="text-xs text-slate-500 leading-relaxed">{step.desc[lang === 'ar' ? 'ar' : 'en']}</p>
                          </div>
                        </div>);

                  })}
                  </div>
                </div>

                {/* Recommended resources based on priority domains */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="font-heading font-bold text-corp-dark text-base mb-4">
                    {t('الموارد المقترحة لأولوياتك', 'Recommended Resources for Your Priorities')}
                  </h3>
                  <div className="space-y-3">
                    {priorityDomains.map((d, i) => {
                    const lang_key = lang === 'ar' ? 'ar' : 'en';
                    const recs = d.content[d.band]?.[lang_key]?.recommendations || [];
                    return (
                      <div key={i} className="rounded-xl border border-slate-100 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full" style={{ background: bandColor(d.band) }} />
                            <span className="font-semibold text-sm text-corp-dark">{d.name[lang_key]}</span>
                          </div>
                          <ul className="space-y-1.5">
                            {recs.slice(0, 2).map((r, j) =>
                          <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                                <ChevronRight size={11} className="text-brand-primary flex-shrink-0 mt-0.5" />{r}
                              </li>
                          )}
                          </ul>
                        </div>);

                  })}
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <Link to="/consultation"
                  className="flex-1 py-3 rounded-xl font-heading font-bold text-white text-sm text-center transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#1A3A5C,#05E1AE)' }}>
                      {t('اطلب جلسة استشارية', 'Request a Consultation')}
                    </Link>
                    <Link to="/store/assessments"
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-heading font-bold text-sm text-center hover:bg-slate-50 transition-all">
                      {t('استكشف المزيد من المقاييس', 'Explore More Assessments')}
                    </Link>
                  </div>
                </div>
              </div>
            }

            {/* ══ ABOUT OPTIVANCE ══ */}
            {activeSection === 'about' &&
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center">
                    <span className="text-white font-heading font-black text-base">O</span>
                  </div>
                  <div>
                    <div className="font-heading font-black text-corp-dark text-lg">OPTIVANCE</div>
                    <div className="text-xs text-slate-400">{t('استشارات وتطوير المواهب', 'Consulting & Talent Development')}</div>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {t(
                  'تساعد Optivance الأفراد والمنظمات على تحويل الوعي إلى نمو مهني قابل للقياس، من خلال مقاييس تحليلية، تقارير ذكية، وخطط تطوير عملية.',
                  'Optivance helps individuals and organizations turn awareness into measurable professional growth through analytical assessments, intelligent reports, and practical development plans.'
                )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                { icon: BarChart2, label: { ar: 'مقاييس تحليلية', en: 'Analytical Assessments' },
                  desc: { ar: 'مقاييس علمية دقيقة لقياس الكفاءات المهنية', en: 'Accurate scientific assessments for professional competencies' } },
                { icon: Target, label: { ar: 'خطط تطوير مخصصة', en: 'Personalized Development Plans' },
                  desc: { ar: 'خطط مبنية على نتائجك الفعلية ومستواك المهني', en: 'Plans built on your actual results and professional level' } },
                { icon: Users, label: { ar: 'تدريب واستشارات', en: 'Training & Consulting' },
                  desc: { ar: 'برامج تدريبية وجلسات استشارية مع خبراء متخصصين', en: 'Training programs and consulting sessions with specialized experts' } },
                { icon: TrendingUp, label: { ar: 'قياس الأثر والتطور', en: 'Impact & Growth Tracking' },
                  desc: { ar: 'متابعة مستمرة لقياس تطورك ومواءمة خطتك', en: 'Continuous tracking to measure growth and align your plan' } }].
                map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="rounded-xl p-4 bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon size={14} className="text-brand-primary" />
                          <span className="font-semibold text-corp-dark text-sm">{item.label[lang === 'ar' ? 'ar' : 'en']}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc[lang === 'ar' ? 'ar' : 'en']}</p>
                      </div>);

                })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/consultation"
                className="flex-1 py-3 rounded-xl font-heading font-bold text-white text-sm text-center"
                style={{ background: 'linear-gradient(135deg,#1A3A5C,#05E1AE)' }}>
                    {t('تواصل مع فريقنا', 'Get in Touch')}
                  </Link>
                  <Link to="/"
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm text-center hover:bg-slate-50 flex items-center justify-center gap-2">
                    <Home size={14} /> {t('الموقع الرئيسي', 'Main Website')}
                  </Link>
                </div>
              </div>
            }
          </main>
        </div>
      </div>
      <StoreFooter />
    </div>);

}