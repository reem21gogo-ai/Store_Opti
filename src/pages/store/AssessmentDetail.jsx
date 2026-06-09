import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { Clock, BarChart2, Play, ArrowLeft, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function AssessmentDetail() {
  const { id } = useParams();
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.Assessment.filter({ id }),
      base44.auth.isAuthenticated().then(async authed => authed ? base44.auth.me() : null),
    ]).then(([asmts, me]) => { if (asmts[0]) setAssessment(asmts[0]); setUser(me); setLoading(false); });
  }, [id]);

  const handleStart = () => {
    if (!user) { navigate('/store/login?redirect=' + encodeURIComponent(`/store/assessments/${id}/take`)); return; }
    navigate(`/store/assessments/${id}/take`);
  };

  if (loading) return <div className="min-h-screen bg-store-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div></div>;
  if (!assessment) return null;

  const title = assessment[`title_${lang}`] || assessment.title_ar;
  const description = assessment[`description_${lang}`] || assessment.description_ar || '';

  return (
    <div className="bg-store-bg min-h-screen">
      <StoreNavbar />
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <Link to="/store/assessments" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary text-sm transition-colors">
            <BackArrow size={14} />{lang === 'ar' ? 'العودة للتقييمات' : 'Back to Assessments'}
          </Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-brand-primary/10 to-brand-accent/5 rounded-3xl p-8 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center mb-6">
                <BarChart2 size={24} className="text-brand-primary" />
              </div>
              <h1 className="font-heading font-black text-corp-dark text-3xl md:text-4xl mb-4">{title}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-slate-600 text-sm"><Clock size={15} className="text-brand-accent" />{assessment.duration_minutes} {translations.assessment.minutes[lang]}</div>
                <div className="flex items-center gap-2 text-slate-600 text-sm"><BarChart2 size={15} className="text-brand-accent" />{assessment.question_count} {translations.assessment.questions[lang]}</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 mb-5">
              <h2 className="font-heading font-bold text-corp-dark text-lg mb-3">{lang === 'ar' ? 'عن هذا التقييم' : 'About This Assessment'}</h2>
              <p className="text-slate-600 leading-relaxed">{description || (lang === 'ar' ? 'تقييم شامل ومتكامل يساعدك على فهم واقعك الحالي وتحديد مسار تطورك.' : 'A comprehensive assessment helping you understand your current reality and define your development path.')}</p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-heading font-bold text-corp-dark text-lg mb-4">{lang === 'ar' ? 'ما ستحصل عليه' : 'What You Get'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(lang === 'ar'
                  ? ['نقاط إجمالية ومستوى', 'تحليل شامل للنتائج', 'نقاط القوة', 'مجالات التحسين', 'توصيات عملية', 'تقرير PDF قابل للتحميل']
                  : ['Overall score and level', 'Comprehensive results analysis', 'Strengths', 'Areas for improvement', 'Practical recommendations', 'Downloadable PDF report']
                ).map((item, i) => (
                  <div key={i} className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-accent flex-shrink-0" /><span className="text-slate-600 text-sm">{item}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-24">
              <div className="text-center mb-6">
                {assessment.is_free
                  ? <div className="text-3xl font-heading font-black text-brand-accent">{translations.store.free[lang]}</div>
                  : <><div className="text-4xl font-heading font-black text-corp-dark">{assessment.price?.toLocaleString()}</div><div className="text-slate-400 text-sm">{translations.common.currency[lang]}</div></>}
              </div>
              {user ? (
                <button onClick={handleStart} className="btn-catalyst w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base mb-4">
                  <Play size={16} fill="currentColor" />{translations.assessment.startBtn[lang]}
                </button>
              ) : (
                <div>
                  <button onClick={handleStart} className="btn-authority w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base mb-3">
                    <Lock size={15} />{lang === 'ar' ? 'سجّل دخولك لتبدأ' : 'Login to Start'}
                  </button>
                  <p className="text-xs text-center text-slate-400">{lang === 'ar' ? 'يحتاج إلى حساب' : 'Requires an account'}</p>
                </div>
              )}
              <Link to="/consultation" className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm text-center flex items-center justify-center gap-2 hover:border-brand-primary/50 hover:text-brand-primary transition-all">
                {translations.assessment.consultCTA[lang]}
              </Link>
              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{translations.assessment.duration[lang]}</span>
                  <span className="font-medium text-corp-dark">{assessment.duration_minutes} {translations.assessment.minutes[lang]}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{lang === 'ar' ? 'عدد الأسئلة' : 'Questions'}</span>
                  <span className="font-medium text-corp-dark">{assessment.question_count}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}