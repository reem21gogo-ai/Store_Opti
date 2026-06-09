import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { Download, ArrowRight, ArrowLeft, CheckCircle, TrendingUp, Target, Lightbulb } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function AssessmentResults() {
  const { id, attemptId } = useParams();
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [attempt, setAttempt] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.AssessmentAttempt.filter({ id: attemptId }),
      base44.entities.Assessment.filter({ id }),
    ]).then(([attempts, asmts]) => { setAttempt(attempts[0] || null); setAssessment(asmts[0] || null); setLoading(false); });
  }, [attemptId]);

  if (loading) return <div className="min-h-screen bg-store-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div></div>;
  if (!attempt) return null;

  const report = attempt.report_data || {};
  const title = assessment?.[`title_${lang}`] || assessment?.title_ar || (lang === 'ar' ? 'تقييمك' : 'Your Assessment');
  const pct = attempt.percentage || 72;
  const levelColor = pct >= 80 ? 'text-green-600 bg-green-50' : pct >= 60 ? 'text-blue-600 bg-blue-50' : pct >= 40 ? 'text-yellow-600 bg-yellow-50' : 'text-orange-600 bg-orange-50';

  return (
    <div className="bg-store-bg min-h-screen">
      <StoreNavbar />
      <div className="bg-gradient-to-r from-brand-primary to-corp-surface py-12 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="w-16 h-16 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-brand-accent" />
          </div>
          <h1 className="font-heading font-black text-3xl md:text-4xl mb-2">{translations.assessment.resultTitle[lang]}</h1>
          <p className="text-white/70">{title}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl p-8 mb-6 text-center shadow-sm">
          <div className="text-7xl font-heading font-black gradient-text mb-2">{pct}%</div>
          <div className="text-slate-400 text-sm mb-4">{translations.assessment.score[lang]}</div>
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${levelColor}`}>{attempt.level || 'Advanced'}</span>
          <div className="mt-6 max-w-sm mx-auto">
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-3 rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #1A3A5C, #05E1AE)' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center"><TrendingUp size={16} className="text-green-600" /></div>
              <h3 className="font-heading font-bold text-corp-dark">{translations.assessment.strengths[lang]}</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {(report.strengths || [lang === 'ar' ? 'اتخاذ القرار' : 'Decision making', lang === 'ar' ? 'التواصل' : 'Communication']).map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-600 text-sm"><CheckCircle size={13} className="text-green-500 flex-shrink-0" /> {s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center"><Target size={16} className="text-orange-600" /></div>
              <h3 className="font-heading font-bold text-corp-dark">{translations.assessment.improvements[lang]}</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {(report.improvements || [lang === 'ar' ? 'التفويض' : 'Delegation', lang === 'ar' ? 'التفكير الاستراتيجي' : 'Strategic thinking']).map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-600 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></div> {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-brand-accent/10 flex items-center justify-center"><Lightbulb size={16} className="text-brand-accent" /></div>
            <h3 className="font-heading font-bold text-corp-dark">{translations.assessment.recommendations[lang]}</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {(report.recommendations || []).map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="btn-catalyst flex-1 py-3 rounded-xl flex items-center justify-center gap-2"><Download size={15} /> {translations.assessment.downloadPDF[lang]}</button>
        </div>

        <div className="bg-corp-dark rounded-3xl p-8 text-center">
          <h3 className="font-heading font-black text-white text-2xl mb-3">{lang === 'ar' ? 'هل تريد تفسيراً متعمقاً لتقريرك؟' : 'Want an in-depth interpretation of your report?'}</h3>
          <p className="text-white/50 mb-5 text-sm">{lang === 'ar' ? 'احجز جلسة مع أحد خبراء أوبتيفانس' : 'Book a session with an OPTIVANCE expert'}</p>
          <Link to="/consultation" className="btn-catalyst inline-flex items-center gap-2 px-8 py-3 rounded-full">
            {translations.assessment.consultCTA[lang]} <Arrow size={15} />
          </Link>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}