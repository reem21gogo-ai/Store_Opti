import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { CheckCircle, BarChart3, Zap, Users, TrendingUp, Award, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';

export default function CompetencyAssessmentLanding() {
  const { lang, isRTL } = useLang();

  const features = [
    { icon: BarChart3, en: 'Personalized Analysis', ar: 'تحليل شخصي دقيق' },
    { icon: Award, en: '20 Core Competencies', ar: '20 جدارة أساسية' },
    { icon: TrendingUp, en: 'Development Plan', ar: 'خطة تطوير مخصصة' },
    { icon: Users, en: 'Expert Insights', ar: 'رؤى احترافية' },
  ];

  const pricing = [
    { level: 'operational', levelAr: 'التشغيلي', levelEn: 'Operational', quick: 99, full: 199 },
    { level: 'supervisory', levelAr: 'الإشرافي', levelEn: 'Supervisory', quick: 129, full: 249 },
    { level: 'leadership', levelAr: 'القيادي', levelEn: 'Leadership', quick: 159, full: 299 },
  ];

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl font-black text-slate-900 mb-4" style={{ fontFamily: 'Tajawal' }}>
              {lang === 'ar' ? 'مقياس الكفاءات الموظفين' : 'Employee Core Competency'}
            </h1>
            <h2 className="text-2xl font-bold text-brand-accent mb-6">
              {lang === 'ar' ? 'Assessment' : 'تقييم شامل'}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              {lang === 'ar'
                ? 'تقييم رقمي احترافي يساعدك على فهم مستوى كفاءاتك المهنية والسلوكية من خلال سيناريوهات عملية'
                : 'A professional digital assessment that helps you understand your professional competencies through practical scenarios.'}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/store/competency/levels" className="bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all">
                {lang === 'ar' ? 'ابدأ التقييم' : 'Start Assessment'}
              </Link>
              <button className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-xl font-bold hover:bg-brand-primary hover:text-white transition-all">
                {lang === 'ar' ? 'عرض التفاصيل' : 'Learn More'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            {lang === 'ar' ? 'لماذا هذا المقياس؟' : 'Why This Assessment?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                  <Icon className="w-12 h-12 text-brand-accent mx-auto mb-4" />
                  <p className="font-bold text-slate-900">{f[lang]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
            {lang === 'ar' ? 'الأسعار حسب المستوى' : 'Pricing by Level'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-6 text-white">
                  <h3 className="text-2xl font-black">{p[lang === 'ar' ? 'levelAr' : 'levelEn']}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="font-bold text-slate-700">{lang === 'ar' ? 'نسخة سريعة' : 'Quick Version'}</span>
                      <span className="text-2xl font-black text-brand-accent">{p.quick}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">{lang === 'ar' ? 'نسخة شاملة' : 'Full Version'}</span>
                      <span className="text-2xl font-black text-brand-primary">{p.full}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 text-center mb-4">
                    {lang === 'ar' ? 'بـ ر.س' : 'SAR'}
                  </p>
                  <Link to={`/store/competency/levels?level=${p.level}`} className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all text-center block">
                    {lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Preview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-12">
            {lang === 'ar' ? 'ماذا ستحصل عليه' : "What You'll Get"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { en: 'Overall Score & Rating', ar: 'النتيجة العامة والتصنيف', icon: BarChart3 },
              { en: '6 Domain Analysis', ar: 'تحليل المجالات الستة', icon: TrendingUp },
              { en: '20 Competencies Report', ar: 'تقرير الجدارات العشرين', icon: Award },
              { en: '90-Day Dev Plan (Full)', ar: 'خطة تطوير 90 يوم', icon: CheckCircle },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex gap-4 items-start bg-white p-6 rounded-xl border border-slate-200">
                  <Icon className="w-8 h-8 text-brand-accent flex-shrink-0 mt-1" />
                  <p className="font-bold text-slate-900">{item[lang]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
}