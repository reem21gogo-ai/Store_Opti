import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Settings, Users, Crown,
  CheckCircle2, Clock, BarChart2, ChevronRight
} from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';

export default function CompetencyLevels() {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const FwdArrow = isRTL ? ArrowLeft : ArrowRight;

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const levels = [
    {
      id: 'operational',
      Icon: Settings,
      color: '#05E1AE',
      titleAr: 'المستوى التشغيلي',
      titleEn: 'Operational Level',
      targetAr: 'للموظفين والأخصائيين والمنفذين',
      targetEn: 'For staff, specialists, and implementers',
      profileAr: 'يُقيّم الكفاءات الأساسية اللازمة لتنفيذ المهام بكفاءة وإنجاز العمل اليومي باحترافية.',
      profileEn: 'Measures core competencies needed for efficient task execution and professional daily performance.',
      traitsAr: ['تنفيذ المهام والمبادرة', 'التواصل الفعّال', 'العمل ضمن الفريق', 'إدارة الوقت والأولويات'],
      traitsEn: ['Task Execution & Initiative', 'Effective Communication', 'Teamwork & Collaboration', 'Time & Priority Management'],
      quick: { price: 99, questionsAr: '20 سؤال', questionsEn: '20 Questions', durationAr: '15 دقيقة', durationEn: '15 min' },
      full:  { price: 199, questionsAr: '45 سؤال', questionsEn: '45 Questions', durationAr: '30 دقيقة', durationEn: '30 min' },
    },
    {
      id: 'supervisory',
      Icon: Users,
      color: '#336fa3',
      titleAr: 'المستوى الإشرافي',
      titleEn: 'Supervisory Level',
      targetAr: 'لقادة الفرق والمشرفين المباشرين',
      targetEn: 'For team leaders and direct supervisors',
      profileAr: 'يُقيّم قدرتك على قيادة الفريق وتوجيهه، واتخاذ القرارات، وتطوير الأداء الجماعي.',
      profileEn: 'Measures your ability to lead, guide a team, make decisions, and develop group performance.',
      traitsAr: ['قيادة الفريق وتطويره', 'اتخاذ القرارات', 'التفكير الاستراتيجي', 'إدارة الأداء والمتابعة'],
      traitsEn: ['Team Leadership & Development', 'Decision Making', 'Strategic Thinking', 'Performance Management'],
      quick: { price: 129, questionsAr: '20 سؤال', questionsEn: '20 Questions', durationAr: '15 دقيقة', durationEn: '15 min' },
      full:  { price: 249, questionsAr: '45 سؤال', questionsEn: '45 Questions', durationAr: '30 دقيقة', durationEn: '30 min' },
    },
    {
      id: 'leadership',
      Icon: Crown,
      color: '#1A3A5C',
      titleAr: 'المستوى القيادي',
      titleEn: 'Leadership Level',
      targetAr: 'للمديرين والقيادات العليا والتنفيذيين',
      targetEn: 'For managers, senior leaders, and executives',
      profileAr: 'يُقيّم الكفاءات القيادية الاستراتيجية كالرؤية والتأثير وقيادة التغيير وبناء الثقافة التنظيمية.',
      profileEn: 'Measures strategic leadership competencies: vision, influence, leading change, and organizational culture.',
      traitsAr: ['الرؤية الاستراتيجية', 'التأثير والإلهام', 'قيادة التغيير والابتكار', 'بناء الثقافة التنظيمية'],
      traitsEn: ['Strategic Vision', 'Influence & Inspiration', 'Leading Change & Innovation', 'Building Org Culture'],
      quick: { price: 159, questionsAr: '20 سؤال', questionsEn: '20 Questions', durationAr: '15 دقيقة', durationEn: '15 min' },
      full:  { price: 299, questionsAr: '45 سؤال', questionsEn: '45 Questions', durationAr: '30 دقيقة', durationEn: '30 min' },
    },
  ];

  const selected = levels.find(l => l.id === selectedLevel);

  const handleStart = () => {
    if (!selectedLevel || !selectedVersion) return;
    navigate(`/store/competency/intake?level=${selectedLevel}&version=${selectedVersion}`);
  };

  return (
    <div className="bg-store-bg min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto">
          <Link to="/store/competency" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary text-sm transition-colors w-fit">
            <BackArrow size={14} />
            {lang === 'ar' ? 'العودة للمقياس' : 'Back to Assessment'}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* ── Step 1: Choose Level ── */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2">
              {lang === 'ar' ? 'الخطوة 1 من 2' : 'Step 1 of 2'}
            </p>
            <h1 className="font-heading font-black text-corp-dark text-3xl md:text-4xl mb-3">
              {lang === 'ar' ? 'ما مستواك الوظيفي؟' : 'What is Your Professional Level?'}
            </h1>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              {lang === 'ar'
                ? 'الأسئلة ستُصمَّم خصيصاً وفق المستوى الذي تختاره لضمان دقة النتائج'
                : 'Questions are tailored to your level to ensure accurate results'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levels.map(level => {
              const { Icon } = level;
              const isActive = selectedLevel === level.id;
              return (
                <motion.div
                  key={level.id}
                  onClick={() => { setSelectedLevel(level.id); setSelectedVersion(null); }}
                  whileHover={{ y: -3 }}
                  className={`rounded-2xl border-2 p-6 cursor-pointer transition-all bg-white ${
                    isActive ? 'border-brand-primary shadow-lg' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${level.color}18`, border: `1px solid ${level.color}30` }}>
                      <Icon size={18} style={{ color: level.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-black text-corp-dark text-base leading-tight">
                        {level[lang === 'ar' ? 'titleAr' : 'titleEn']}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {level[lang === 'ar' ? 'targetAr' : 'targetEn']}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      isActive ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
                    }`}>
                      {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Profile */}
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {level[lang === 'ar' ? 'profileAr' : 'profileEn']}
                  </p>

                  {/* Traits */}
                  <ul className="space-y-1.5">
                    {(lang === 'ar' ? level.traitsAr : level.traitsEn).map((trait, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={11} style={{ color: level.color, flexShrink: 0 }} />
                        {trait}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Step 2: Choose Version — only shows after level selected ── */}
        <AnimatePresence>
          {selectedLevel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="text-center mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2">
                  {lang === 'ar' ? 'الخطوة 2 من 2' : 'Step 2 of 2'}
                </p>
                <h2 className="font-heading font-black text-corp-dark text-2xl mb-2">
                  {lang === 'ar' ? 'اختر نسخة المقياس' : 'Choose Your Assessment Version'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {lang === 'ar' ? 'النسختان تقيسان نفس الكفاءات بمستوى تفصيل مختلف' : 'Both versions measure the same competencies with different detail levels'}
                </p>
              </div>

              {selected && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                  {(['quick', 'full'] ).map(v => {
                    const vData = selected[v];
                    const isQuick = v === 'quick';
                    const isSelectedV = selectedVersion === v;
                    return (
                      <button
                        key={v}
                        onClick={() => setSelectedVersion(v)}
                        className={`rounded-2xl p-5 border-2 text-start transition-all relative ${
                          isSelectedV
                            ? isQuick ? 'border-blue-500 bg-blue-50' : 'border-brand-primary bg-brand-primary/5'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {!isQuick && (
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                            <span className="bg-corp-dark text-white text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                              {lang === 'ar' ? 'الأكثر قيمة' : 'Best Value'}
                            </span>
                          </div>
                        )}
                        <div className={`mt-${isQuick ? 0 : 2}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-heading font-black text-corp-dark text-base">
                              {lang === 'ar' ? (isQuick ? 'النسخة السريعة' : 'النسخة الشاملة') : (isQuick ? 'Quick Version' : 'Full Version')}
                            </span>
                            {isQuick && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                {lang === 'ar' ? 'شهيرة' : 'Popular'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock size={11} /> {lang === 'ar' ? vData.durationAr : vData.durationEn}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <BarChart2 size={11} /> {lang === 'ar' ? vData.questionsAr : vData.questionsEn}
                            </div>
                          </div>
                          <ul className="space-y-1 mb-4">
                            {(isQuick
                              ? (lang === 'ar'
                                ? ['تقرير ملخص للكفاءات', 'أبرز نقاط القوة', 'توصيات تطوير سريعة', 'تقرير PDF']
                                : ['Competency summary', 'Top strengths', 'Quick development tips', 'PDF Report'])
                              : (lang === 'ar'
                                ? ['تحليل 20 جدارة كاملة', 'تقرير 15+ صفحة', 'خطة تطوير 90 يوم', 'مقارنة بمعايير القطاع', 'تقرير PDF شامل']
                                : ['Full 20 competency analysis', '15+ page report', '90-day development plan', 'Industry benchmarks', 'Full PDF report'])
                            ).map((o, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                <CheckCircle2 size={11} className={isQuick ? 'text-blue-500' : 'text-brand-primary'} style={{ flexShrink: 0 }} />
                                {o}
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-baseline gap-1 mt-auto">
                            <span className="font-heading font-black text-2xl text-corp-dark">{vData.price}</span>
                            <span className="text-slate-400 text-sm">{lang === 'ar' ? ' ر.س' : ' SAR'}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => { setSelectedLevel(null); setSelectedVersion(null); }}
                  className="px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
                >
                  {lang === 'ar' ? 'تغيير المستوى' : 'Change Level'}
                </button>
                <button
                  onClick={handleStart}
                  disabled={!selectedVersion}
                  className="flex-1 py-3.5 rounded-xl font-heading font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: selectedVersion ? 'linear-gradient(135deg, #1A3A5C, #05E1AE)' : '#94a3b8' }}
                >
                  {lang === 'ar' ? 'ابدأ التقييم' : 'Start Assessment'}
                  <FwdArrow size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StoreFooter />
    </div>
  );
}