/**
 * CompetencyReport — Premium redesign with dynamic performance colors,
 * animated score arcs, RTL/LTR support, and rich visual hierarchy.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle,
  TrendingUp, Users, Brain, Target, BarChart2, Zap, Home,
  ChevronRight, BookOpen, Star, Award, Compass, Sparkles,
  Clock, FileText, MessageSquare, Calendar, Layers
} from 'lucide-react';
import { generateCompetencyPDF } from '@/lib/generateCompetencyPDF';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';
import { DOMAINS, BAND_CONFIG, OVERALL_SUMMARIES, LEVEL_LABELS } from '@/lib/competencyContent';

// ─── Color helpers ─────────────────────────────────────────────────────────────
const bandColor  = (b) => BAND_CONFIG[b]?.color  || '#64748b';
const bandBg     = (b) => BAND_CONFIG[b]?.bg     || '#64748b12';
const bandBorder = (b) => BAND_CONFIG[b]?.border || '#64748b30';
const bandLabel  = (b, lang) => BAND_CONFIG[b]?.label?.[lang] || b;

// Dynamic color by score percentage
const scoreColor = (score) => {
  if (score >= 80) return '#05E1AE';
  if (score >= 65) return '#2E9DB8';
  if (score >= 45) return '#F59E0B';
  return '#EF4444';
};

const DOMAIN_ICONS = {
  thought_analysis:     Brain,
  results_execution:    Target,
  people_collaboration: Users,
  self_leadership:      Compass,
  customer_value:       Star,
  digital_compliance:   Zap,
};

// ─── Animated score arc ────────────────────────────────────────────────────────
function ScoreArc({ score, size = 120, strokeW = 10, color, label, sublabel }) {
  const [animated, setAnimated] = useState(0);
  const r    = (size / 2) - strokeW / 2 - 2;
  const circ = 2 * Math.PI * r;
  const dash = (animated / 100) * circ;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 120);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={strokeW} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && <div className="font-heading font-black leading-none" style={{ fontSize: size * 0.22, color }}>{label}</div>}
        {sublabel && <div className="text-slate-400 mt-1" style={{ fontSize: size * 0.1 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

// ─── Animated bar ──────────────────────────────────────────────────────────────
function AnimBar({ score, color, height = 8 }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW(score), 150); }, [score]);
  return (
    <div className="rounded-full overflow-hidden" style={{ height, background: 'rgba(0,0,0,0.06)' }}>
      <div className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${w}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }} />
    </div>
  );
}

// ─── Band badge ────────────────────────────────────────────────────────────────
function BandBadge({ band, lang, size = 'sm' }) {
  const color = bandColor(band);
  return (
    <span className={`inline-flex items-center font-bold rounded-full ${size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}`}
      style={{ background: bandBg(band), color, border: `1px solid ${bandBorder(band)}` }}>
      {bandLabel(band, lang)}
    </span>
  );
}

// ─── Domain card ───────────────────────────────────────────────────────────────
function DomainCard({ domain, domainData, lang, index }) {
  const [expanded, setExpanded] = useState(false);
  const lk      = lang === 'ar' ? 'ar' : 'en';
  const band    = domainData?.band || 'Moderate';
  const score   = domainData?.score || 0;
  const content = domain.content[band]?.[lk];
  const color   = scoreColor(score);
  const Icon    = DOMAIN_ICONS[domain.id] || BarChart2;
  const t       = (ar, en) => lang === 'ar' ? ar : en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: `${color}30` }}
    >
      {/* Header strip */}
      <div className="px-5 py-4" style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)` }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}20`, border: `1.5px solid ${color}40` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div className="font-heading font-bold text-corp-dark text-sm leading-tight">{domain.name[lk]}</div>
              <div className="text-slate-400 text-xs mt-0.5">{domain.description[lk]}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-end">
              <div className="font-heading font-black text-2xl leading-none" style={{ color }}>{score}%</div>
              <div className="mt-1"><BandBadge band={band} lang={lang} /></div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <AnimBar score={score} color={color} height={6} />
        </div>
      </div>

      {/* Summary */}
      {content?.summary && (
        <div className="px-5 py-3 bg-white">
          <p className="text-slate-600 text-sm leading-relaxed">{content.summary}</p>
        </div>
      )}

      {/* Expandable details */}
      {content && (
        <>
          <button onClick={() => setExpanded(!expanded)}
            className="w-full px-5 py-2.5 flex items-center justify-between text-xs font-semibold transition-colors bg-white border-t"
            style={{ borderColor: `${color}18`, color }}>
            <span>{expanded ? t('إخفاء التفاصيل', 'Hide Details') : t('عرض التفاصيل والتوصيات', 'View Details & Recommendations')}</span>
            <ChevronRight size={14} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden bg-white"
              >
                <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: `${color}15` }}>
                  {/* Strengths */}
                  {content.strengths?.length > 0 && (
                    <div className="rounded-xl p-4 mt-4" style={{ background: `${color}08`, border: `1px solid ${color}25` }}>
                      <div className="text-xs font-bold mb-3" style={{ color }}>
                        {t('المؤشرات والنقاط الإيجابية', 'Indicators & Strengths')}
                      </div>
                      <ul className="space-y-2">
                        {content.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 size={13} style={{ color, flexShrink: 0, marginTop: 1 }} />{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {content.recommendations?.length > 0 && (
                    <div className="rounded-xl p-4 bg-slate-50 border border-slate-100">
                      <div className="text-xs font-bold text-slate-500 mb-3">
                        {t('التوصيات', 'Recommendations')}
                      </div>
                      <ul className="space-y-2">
                        {content.recommendations.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#1A3A5C' }} />{r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Goals */}
                  {content.goals && (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'short', label: { ar: '٠–٣٠ يوم', en: '0–30 Days' }, c: '#EF4444' },
                        { key: 'mid',   label: { ar: '٣٠–٩٠ يوم', en: '30–90 Days' }, c: '#F59E0B' },
                        { key: 'long',  label: { ar: '٩٠+ يوم', en: '90+ Days' }, c: '#05E1AE' },
                      ].map(g => (
                        <div key={g.key} className="rounded-xl p-3 border" style={{ borderColor: `${g.c}30`, background: `${g.c}06` }}>
                          <div className="text-xs font-bold mb-1.5" style={{ color: g.c }}>{g.label[lk]}</div>
                          <p className="text-xs text-slate-600 leading-relaxed">{content.goals[g.key]}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function CompetencyReport() {
  const { attemptId }  = useParams();
  const [attempt, setAttempt]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeSection, setActiveSection] = useState('snapshot');
  const [pdfLoading, setPdfLoading]       = useState(false);

  useEffect(() => {
    const load = async () => {
      const cached = localStorage.getItem(`optivance_report_${attemptId}`);
      if (cached) {
        try { setAttempt({ report_data: JSON.parse(cached), id: attemptId }); setLoading(false); return; }
        catch {}
      }
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

  const rpt  = attempt?.report_data || {};
  const lang = rpt.language || 'ar';
  const isRTL = lang === 'ar';
  const lk   = lang === 'ar' ? 'ar' : 'en';
  const t    = (ar, en) => isRTL ? ar : en;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const domainScores    = rpt.domain_scores || {};
  const overall         = rpt.overall       || { score: 0, band: 'Moderate' };
  const user            = rpt.user          || {};
  const overallSummary  = OVERALL_SUMMARIES[overall.band]?.[lang] || '';
  const levelLabel      = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '';
  const overallColor    = scoreColor(overall.score);

  const sortedDomains   = DOMAINS.map(d => ({
    ...d, score: domainScores[d.id]?.score || 0, band: domainScores[d.id]?.band || 'Critical',
  }));
  const topDomains      = [...sortedDomains].sort((a, b) => b.score - a.score).slice(0, 3);
  const priorityDomains = [...sortedDomains].sort((a, b) => a.score - b.score).slice(0, 3);

  const downloadPDF = async () => {
    setPdfLoading(true);
    try { await generateCompetencyPDF(rpt, attemptId); } catch (err) { console.error(err); }
    setPdfLoading(false);
  };

  const NAV_ITEMS = [
    { id: 'snapshot',  label: t('النتائج العامة', 'Overview'),          icon: BarChart2   },
    { id: 'domains',   label: t('تحليل المجالات', 'Domain Analysis'),   icon: Layers      },
    { id: 'devplan',   label: t('خطة التطوير', 'Dev Plan'),             icon: Target      },
    { id: 'nextsteps', label: t('الخطوات القادمة', 'Next Steps'),       icon: ChevronRight },
    { id: 'about',     label: t('عن أوبتيفانس', 'About Optivance'),     icon: BookOpen    },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1A3A5C]/20 border-t-[#05E1AE] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">{t('جاري تحميل التقرير...', 'Loading report...')}</p>
      </div>
    </div>
  );

  if (!attempt) return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
        <FileText size={40} className="text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 mb-4 font-medium">{t('التقرير غير متوفر', 'Report not found')}</p>
        <Link to="/store/competency" className="text-[#1A3A5C] text-sm font-semibold hover:text-[#05E1AE] transition-colors">{t('العودة للمقياس', 'Back to Assessment')}</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F4F8]" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      {/* ── Hero header ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D1F33 0%, #1A3A5C 60%, #162F4A 100%)' }}>
        {/* dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `radial-gradient(circle, #05E1AE 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
        {/* glow */}
        <div className="absolute top-0 end-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${overallColor}, transparent 70%)`, transform: 'translate(30%, -30%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Back link */}
          <Link to="/store/account" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs mb-6 transition-colors">
            <BackArrow size={13} /> {t('لوحتي', 'My Dashboard')}
          </Link>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left info */}
            <div className="flex items-center gap-5">
              {/* Score arc */}
              <div className="flex-shrink-0">
                <ScoreArc
                  score={overall.score} size={100} strokeW={9}
                  color={overallColor}
                  label={`${overall.score}%`}
                  sublabel={t('النتيجة', 'Score')}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#05E1AE]/15 border border-[#05E1AE]/30 rounded-full px-3 py-0.5">
                    <span className="text-[#05E1AE] text-xs font-black tracking-widest">OPTIVANCE</span>
                  </div>
                  <BandBadge band={overall.band} lang={lang} size="lg" />
                </div>
                <h1 className="font-heading font-black text-white text-xl sm:text-2xl leading-tight mb-1">
                  {t('تقرير مقياس الكفاءات الأساسية', 'Core Competency Assessment Report')}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-white/50 text-xs mt-2">
                  {user.name && <span className="flex items-center gap-1"><Users size={11} />{user.name}</span>}
                  {levelLabel && <><span>•</span><span>{levelLabel}</span></>}
                  {user.completion_date && <><span>•</span><span className="flex items-center gap-1"><Calendar size={11} />{user.completion_date}</span></>}
                  {rpt.report_id && <><span>•</span><span className="font-mono">{rpt.report_id}</span></>}
                </div>
              </div>
            </div>

            {/* Download button */}
            <button onClick={downloadPDF} disabled={pdfLoading}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-heading font-bold text-[#0D1F33] text-sm transition-all disabled:opacity-60 flex-shrink-0 hover:brightness-110 active:scale-95"
              style={{ background: `linear-gradient(135deg, #05E1AE, #2E9DB8)` }}>
              <Download size={15} />
              {pdfLoading ? t('جاري التوليد...', 'Generating...') : t('تحميل PDF', 'Download PDF')}
            </button>
          </div>

          {/* Domain score pills row */}
          <div className="flex flex-wrap gap-2 mt-6 pb-1">
            {sortedDomains.map((d, i) => {
              const c = scoreColor(d.score);
              return (
                <div key={i} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border"
                  style={{ background: `${c}18`, borderColor: `${c}35`, color: '#fff' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c }} />
                  <span className="text-white/70">{d.name[lk]}</span>
                  <span className="font-bold" style={{ color: c }}>{d.score}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 sticky top-6">
              {NAV_ITEMS.map(item => {
                const Icon  = item.icon;
                const active = activeSection === item.id;
                return (
                  <button key={item.id} onClick={() => setActiveSection(item.id)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 text-start"
                    style={active ? {
                      background: `linear-gradient(135deg, #1A3A5C14, #05E1AE0a)`,
                      color: '#1A3A5C',
                      borderLeft: isRTL ? 'none' : '3px solid #05E1AE',
                      borderRight: isRTL ? '3px solid #05E1AE' : 'none',
                    } : { color: '#64748b' }}>
                    <Icon size={15} style={{ color: active ? '#05E1AE' : '#94a3b8' }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}>

                {/* ══════════ SNAPSHOT ══════════ */}
                {activeSection === 'snapshot' && (
                  <div className="space-y-5">

                    {/* Score hero card */}
                    <div className="rounded-2xl overflow-hidden shadow-sm">
                      <div className="relative p-8 text-center overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #0D1F33, #1A3A5C 55%, #162F4A)' }}>
                        <div className="absolute inset-0 opacity-[0.05]"
                          style={{ backgroundImage: `linear-gradient(rgba(5,225,174,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,225,174,1) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-[0.06]"
                          style={{ background: `radial-gradient(circle, ${overallColor}, transparent 70%)` }} />
                        <div className="relative z-10">
                          <div className="flex justify-center mb-5">
                            <ScoreArc score={overall.score} size={148} strokeW={12} color={overallColor}
                              label={`${overall.score}%`} sublabel={t('النتيجة الإجمالية', 'Overall Score')} />
                          </div>
                          <div className="mb-4"><BandBadge band={overall.band} lang={lang} size="lg" /></div>
                          <h2 className="font-heading font-black text-white text-xl mb-1">
                            {t('تقرير الكفاءات والنمو المهني', 'Competency & Growth Report')}
                          </h2>
                          <p className="text-white/50 text-sm mb-5">{t('مقياس الجدارات الأساسية للموظف', 'Employee Core Competency Assessment')}</p>
                          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                            {[
                              { label: t('الاسم', 'Name'), value: user.preferred_name || user.name },
                              { label: t('المستوى', 'Level'), value: levelLabel },
                              { label: t('التاريخ', 'Date'), value: user.completion_date },
                            ].map((f, i) => (
                              <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                                <div className="text-white/40 text-xs mb-0.5">{f.label}</div>
                                <div className="text-white font-semibold text-xs truncate">{f.value || '—'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Summary strip */}
                      <div className="bg-white px-6 py-5 border-t" style={{ borderColor: `${overallColor}20` }}>
                        <div className="flex items-start gap-3">
                          <Sparkles size={16} style={{ color: overallColor, flexShrink: 0, marginTop: 2 }} />
                          <p className="text-slate-600 text-sm leading-relaxed">{overallSummary}</p>
                        </div>
                      </div>
                    </div>

                    {/* 6 domain scores */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                      <h3 className="font-heading font-bold text-[#1A3A5C] text-base mb-5 flex items-center gap-2">
                        <Layers size={16} className="text-[#05E1AE]" />
                        {t('نتائج المجالات الستة', 'Six Domain Scores')}
                      </h3>
                      <div className="space-y-3">
                        {[...sortedDomains].sort((a, b) => b.score - a.score).map((d, i) => {
                          const c    = scoreColor(d.score);
                          const Icon = DOMAIN_ICONS[d.id] || BarChart2;
                          return (
                            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl transition-colors hover:bg-slate-50"
                              style={{ border: `1px solid ${c}20` }}>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: `${c}15` }}>
                                <Icon size={15} style={{ color: c }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-semibold text-[#1A3A5C] text-sm truncate">{d.name[lk]}</span>
                                  <div className="flex items-center gap-2 flex-shrink-0 ms-3">
                                    <span className="font-heading font-black text-base" style={{ color: c }}>{d.score}%</span>
                                    <BandBadge band={d.band} lang={lang} />
                                  </div>
                                </div>
                                <AnimBar score={d.score} color={c} height={5} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Strengths & Priorities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Strengths */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <h4 className="font-heading font-bold text-[#1A3A5C] text-sm mb-4 flex items-center gap-2">
                          <Award size={15} className="text-[#05E1AE]" />
                          {t('أبرز نقاط القوة', 'Key Strengths')}
                        </h4>
                        <div className="space-y-2.5">
                          {topDomains.map((d, i) => {
                            const c    = scoreColor(d.score);
                            const Icon = DOMAIN_ICONS[d.id] || BarChart2;
                            return (
                              <div key={i} className="rounded-xl p-3 flex items-center gap-3"
                                style={{ background: `${c}0d`, border: `1px solid ${c}25` }}>
                                <Icon size={14} style={{ color: c, flexShrink: 0 }} />
                                <span className="text-sm font-medium text-slate-700 flex-1">{d.name[lk]}</span>
                                <span className="font-heading font-bold text-sm flex-shrink-0" style={{ color: c }}>{d.score}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Priorities */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <h4 className="font-heading font-bold text-[#1A3A5C] text-sm mb-4 flex items-center gap-2">
                          <TrendingUp size={15} className="text-amber-500" />
                          {t('أولويات التطوير', 'Development Priorities')}
                        </h4>
                        <div className="space-y-2.5">
                          {priorityDomains.map((d, i) => {
                            const c    = scoreColor(d.score);
                            const Icon = DOMAIN_ICONS[d.id] || BarChart2;
                            return (
                              <div key={i} className="rounded-xl p-3 flex items-center gap-3"
                                style={{ background: `${c}0d`, border: `1px solid ${c}25` }}>
                                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                                  style={{ background: c }}>{i + 1}</div>
                                <span className="text-sm font-medium text-slate-700 flex-1">{d.name[lk]}</span>
                                <span className="font-heading font-bold text-sm flex-shrink-0" style={{ color: c }}>{d.score}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════════ DOMAINS ══════════ */}
                {activeSection === 'domains' && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5">
                      <h2 className="font-heading font-black text-[#1A3A5C] text-xl mb-1">
                        {t('تحليل مفصّل لكل مجال', 'Detailed Domain Analysis')}
                      </h2>
                      <p className="text-slate-400 text-sm">
                        {t('كل مجال يعكس مجموعة من الكفاءات الأساسية وأدائك فيها', 'Each domain reflects a group of core competencies and your performance in them')}
                      </p>
                    </div>
                    {[...sortedDomains].sort((a, b) => b.score - a.score).map((d, i) => (
                      <DomainCard key={d.id} domain={d} domainData={domainScores[d.id]} lang={lang} index={i} />
                    ))}
                  </div>
                )}

                {/* ══════════ DEV PLAN ══════════ */}
                {activeSection === 'devplan' && (
                  <div className="space-y-5">
                    {/* Profile info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                      <h2 className="font-heading font-black text-[#1A3A5C] text-xl mb-5">
                        {t('خطة التطوير الشخصية', 'Personal Development Plan')}
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {[
                          { label: t('الاسم المفضل', 'Preferred Name'), value: user.preferred_name || user.name, icon: Users },
                          { label: t('المستوى المهني', 'Level'),        value: levelLabel,                       icon: Star },
                          { label: t('تاريخ الإكمال', 'Date'),          value: user.completion_date,             icon: Calendar },
                          { label: t('رقم التقرير', 'Report ID'),       value: rpt.report_id,                    icon: FileText },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} className="rounded-xl p-3.5 bg-[#F6F8FA] border border-slate-100">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Icon size={11} className="text-slate-400" />
                                <div className="text-xs text-slate-400">{item.label}</div>
                              </div>
                              <div className="text-sm font-bold text-[#1A3A5C]">{item.value || '—'}</div>
                            </div>
                          );
                        })}
                      </div>
                      {(user.motivation || user.customMotivation) && (
                        <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #1A3A5C0d, #05E1AE08)', border: '1px solid #1A3A5C20' }}>
                          <div className="text-xs font-bold text-[#1A3A5C] mb-1.5 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-[#05E1AE]" />
                            {t('دافعك للتطوير', 'Your Motivation')}
                          </div>
                          <p className="text-sm text-slate-600">{user.customMotivation || user.motivation}</p>
                        </div>
                      )}
                    </div>

                    {/* Priority domain goals */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                      <h3 className="font-heading font-bold text-[#1A3A5C] text-base mb-5">
                        {t('أولويات التطوير مع خطة الأهداف', 'Development Priorities with Goal Plan')}
                      </h3>
                      <div className="space-y-5">
                        {priorityDomains.map((d, i) => {
                          const c       = scoreColor(d.score);
                          const content = d.content[d.band]?.[lk];
                          const goals   = content?.goals;
                          const Icon    = DOMAIN_ICONS[d.id] || BarChart2;
                          return (
                            <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: `${c}30` }}>
                              <div className="px-5 py-4 flex items-center justify-between gap-3"
                                style={{ background: `linear-gradient(135deg, ${c}12, ${c}06)` }}>
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${c}20`, border: `1.5px solid ${c}40` }}>
                                    <Icon size={16} style={{ color: c }} />
                                  </div>
                                  <div>
                                    <div className="font-heading font-bold text-[#1A3A5C] text-sm">{d.name[lk]}</div>
                                    <div className="text-xs mt-0.5 flex items-center gap-1.5">
                                      <span style={{ color: c }}>{d.score}%</span>
                                      <span className="text-slate-300">•</span>
                                      <BandBadge band={d.band} lang={lang} />
                                    </div>
                                  </div>
                                </div>
                                <div className="px-3 py-1 rounded-full text-xs font-bold text-white flex-shrink-0"
                                  style={{ background: c }}>
                                  {t(`أولوية ${i + 1}`, `Priority ${i + 1}`)}
                                </div>
                              </div>
                              {goals && (
                                <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
                                  {[
                                    { key: 'short', label: t('هدف قصير (٠–٣٠ يوم)', 'Short-Term (0–30 Days)'), c: '#EF4444' },
                                    { key: 'mid',   label: t('هدف متوسط (٣٠–٩٠ يوم)', 'Mid-Term (30–90 Days)'), c: '#F59E0B' },
                                    { key: 'long',  label: t('هدف طويل (٩٠+ يوم)', 'Long-Term (90+ Days)'),   c: '#05E1AE' },
                                  ].map(g => (
                                    <div key={g.key} className="rounded-xl p-3.5 border" style={{ borderColor: `${g.c}25`, background: `${g.c}06` }}>
                                      <div className="text-xs font-bold mb-2" style={{ color: g.c }}>{g.label}</div>
                                      <p className="text-xs text-slate-600 leading-relaxed">{goals[g.key]}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Monthly reflection */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                      <h3 className="font-heading font-bold text-[#1A3A5C] text-base mb-4 flex items-center gap-2">
                        <Clock size={15} className="text-[#05E1AE]" />
                        {t('التأمل الشهري', 'Monthly Reflection')}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          t('ماذا تحسّن هذا الشهر؟', 'What improved this month?'),
                          t('ما التحديات التي واجهتني؟', 'What challenges did I face?'),
                          t('ما الذي يجب تعديله؟', 'What should I adjust?'),
                          t('ما ركيزتي للشهر القادم؟', 'What is my next month focus?'),
                        ].map((q, i) => (
                          <div key={i} className="rounded-xl border border-dashed border-slate-200 p-4 min-h-[90px] hover:border-[#05E1AE]/40 transition-colors">
                            <div className="text-xs font-semibold text-slate-400 mb-3">{q}</div>
                            <div className="space-y-2">
                              <div className="h-px bg-slate-100 rounded" />
                              <div className="h-px bg-slate-100 rounded w-4/5" />
                              <div className="h-px bg-slate-100 rounded w-3/5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════════ NEXT STEPS ══════════ */}
                {activeSection === 'nextsteps' && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                      <h2 className="font-heading font-black text-[#1A3A5C] text-xl mb-6">
                        {t('خطواتك القادمة', 'Your Next Steps')}
                      </h2>
                      <div className="space-y-3">
                        {[
                          { icon: BookOpen,     c: '#05E1AE', label: t('راجع تقريرك بعمق', 'Review Your Report Deeply'),         desc: t('اقرأ التحليل التفصيلي لكل مجال وافهم ما تعنيه نتيجتك', 'Read the detailed analysis for each domain and understand what your score means') },
                          { icon: Target,       c: '#2E9DB8', label: t('حدد هدفين فوريين', 'Set 2 Immediate Goals'),              desc: t('اختر هدفين من قسم ٠–٣٠ يوم وابدأ اليوم', 'Choose two goals from the 0–30 day section and start today') },
                          { icon: Users,        c: '#F59E0B', label: t('شارك نتائجك مع مشرفك', 'Share Results with Your Manager'), desc: t('ناقش التقرير مع مشرفك المباشر أو مرشدك المهني', 'Discuss the report with your supervisor or professional mentor') },
                          { icon: CheckCircle2, c: '#05E1AE', label: t('تابع تقدمك شهريًا', 'Track Monthly Progress'),            desc: t('استخدم صفحة التأمل الشهري لتقييم تطورك وتعديل خطتك', 'Use the monthly reflection page to evaluate growth and adjust your plan') },
                        ].map((step, i) => {
                          const Icon = step.icon;
                          return (
                            <motion.div key={i}
                              initial={{ opacity: 0, x: isRTL ? 15 : -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="flex items-start gap-4 p-4 rounded-2xl transition-colors"
                              style={{ background: `${step.c}08`, border: `1px solid ${step.c}20` }}>
                              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                                style={{ background: `${step.c}20`, border: `1.5px solid ${step.c}40` }}>
                                <Icon size={17} style={{ color: step.c }} />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-[#1A3A5C] text-sm mb-1">{step.label}</div>
                                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                              </div>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{ background: step.c }}>{i + 1}</div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                      <h3 className="font-heading font-bold text-[#1A3A5C] text-base mb-4">
                        {t('الموارد المقترحة لأولوياتك', 'Recommended Resources')}
                      </h3>
                      <div className="space-y-3">
                        {priorityDomains.map((d, i) => {
                          const c    = scoreColor(d.score);
                          const Icon = DOMAIN_ICONS[d.id] || BarChart2;
                          const recs = d.content[d.band]?.[lk]?.recommendations || [];
                          return (
                            <div key={i} className="rounded-xl border p-4" style={{ borderColor: `${c}25`, background: `${c}05` }}>
                              <div className="flex items-center gap-2 mb-3">
                                <Icon size={14} style={{ color: c }} />
                                <span className="font-bold text-sm text-[#1A3A5C]">{d.name[lk]}</span>
                                <span className="ms-auto font-heading font-black text-sm" style={{ color: c }}>{d.score}%</span>
                              </div>
                              <ul className="space-y-1.5">
                                {recs.slice(0, 2).map((r, j) => (
                                  <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                                    <ChevronRight size={11} style={{ color: c, flexShrink: 0, marginTop: 2 }} />{r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
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
                )}

                {/* ══════════ ABOUT ══════════ */}
                {activeSection === 'about' && (
                  <div className="space-y-5">
                    {/* Brand card */}
                    <div className="rounded-2xl overflow-hidden shadow-sm">
                      <div className="p-8 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D1F33, #1A3A5C)' }}>
                        <div className="absolute inset-0 opacity-[0.04]"
                          style={{ backgroundImage: `radial-gradient(circle, #05E1AE 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                        <div className="relative z-10">
                          <div className="w-16 h-16 rounded-2xl bg-[#05E1AE] flex items-center justify-center mx-auto mb-4">
                            <span className="text-[#0D1F33] font-heading font-black text-2xl">O</span>
                          </div>
                          <div className="font-heading font-black text-white text-2xl mb-1">OPTIVANCE</div>
                          <div className="text-[#05E1AE]/70 text-sm">{t('استشارات وتطوير المواهب', 'Consulting & Talent Development')}</div>
                        </div>
                      </div>
                      <div className="bg-white px-6 py-5">
                        <p className="text-slate-600 text-sm leading-relaxed text-center">
                          {t(
                            'تساعد Optivance الأفراد والمنظمات على تحويل الوعي إلى نمو مهني قابل للقياس، من خلال مقاييس تحليلية، تقارير ذكية، وخطط تطوير عملية.',
                            'Optivance helps individuals and organizations turn awareness into measurable professional growth through analytical assessments, intelligent reports, and practical development plans.'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: BarChart2,  c: '#05E1AE', label: t('مقاييس تحليلية', 'Analytical Assessments'),         desc: t('مقاييس علمية دقيقة لقياس الكفاءات المهنية', 'Accurate scientific assessments for professional competencies') },
                        { icon: Target,     c: '#2E9DB8', label: t('خطط تطوير مخصصة', 'Personalized Dev Plans'),        desc: t('خطط مبنية على نتائجك الفعلية ومستواك المهني', 'Plans built on your actual results and professional level') },
                        { icon: Users,      c: '#F59E0B', label: t('تدريب واستشارات', 'Training & Consulting'),          desc: t('برامج تدريبية وجلسات استشارية مع خبراء متخصصين', 'Training programs and consulting sessions with experts') },
                        { icon: TrendingUp, c: '#05E1AE', label: t('قياس الأثر والتطور', 'Impact & Growth Tracking'),   desc: t('متابعة مستمرة لقياس تطورك ومواءمة خطتك', 'Continuous tracking to measure growth and align your plan') },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="rounded-xl p-4 bg-white border border-slate-100 shadow-sm">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                              style={{ background: `${item.c}18`, border: `1.5px solid ${item.c}35` }}>
                              <Icon size={15} style={{ color: item.c }} />
                            </div>
                            <div className="font-semibold text-[#1A3A5C] text-sm mb-1">{item.label}</div>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/consultation"
                        className="flex-1 py-3.5 rounded-xl font-heading font-bold text-white text-sm text-center transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg,#1A3A5C,#05E1AE)' }}>
                        {t('تواصل مع فريقنا', 'Get in Touch')}
                      </Link>
                      <Link to="/"
                        className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-heading font-bold text-sm text-center hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
                        <Home size={14} /> {t('الموقع الرئيسي', 'Main Website')}
                      </Link>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}