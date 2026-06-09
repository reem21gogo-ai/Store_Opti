import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const STEPS = {
  ar: [
    { num: '01', title: 'الفهم', desc: 'نبدأ بالاستماع العميق لفهم واقعك الحالي، احتياجاتك، وأهدافك المستقبلية بشكل شامل.' },
    { num: '02', title: 'التشخيص', desc: 'نحلل الفجوات والتحديات باستخدام أدوات تقييمية متخصصة وبيانات دقيقة.' },
    { num: '03', title: 'التصميم', desc: 'نبني حلولاً مخصصة بالكامل لواقعك وثقافتك وأهدافك، لا نسخ جاهزة.' },
    { num: '04', title: 'التنفيذ', desc: 'ننفذ بمرونة وانضباط، ونضمن التحول الحقيقي مع الفريق وليس بدلاً عنه.' },
    { num: '05', title: 'القياس', desc: 'نقيس الأثر الفعلي على مؤشرات واضحة ومتفق عليها مسبقاً.' },
    { num: '06', title: 'المتابعة', desc: 'نبقى شركاء في رحلة النمو عبر مراجعات دورية وتطوير مستمر.' },
  ],
  en: [
    { num: '01', title: 'Understand', desc: 'We begin with deep listening to comprehensively understand your current reality, needs, and future goals.' },
    { num: '02', title: 'Diagnose', desc: 'We analyze gaps and challenges using specialized assessment tools and precise data.' },
    { num: '03', title: 'Design', desc: 'We build solutions fully customized to your reality, culture, and goals — not off-the-shelf.' },
    { num: '04', title: 'Implement', desc: 'We execute with flexibility and discipline, ensuring real transformation with the team.' },
    { num: '05', title: 'Measure', desc: 'We measure actual impact against clear, pre-agreed indicators.' },
    { num: '06', title: 'Follow Up', desc: 'We remain partners in your growth journey through periodic reviews and continuous development.' },
  ],
};

export default function Methodology() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const steps = STEPS[lang];

  return (
    <div className="bg-corp-dark min-h-screen">
      <CorpNavbar />
      <section className="pt-28 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{translations.nav.methodology[lang]}</p>
          <h1 className="font-heading font-black text-4xl md:text-6xl text-white mb-6">{lang === 'ar' ? 'منهجيتنا في العمل' : 'Our Working Methodology'}</h1>
          <p className="text-white/60 text-lg">{lang === 'ar' ? 'ست خطوات متكاملة تضمن تحولاً حقيقياً ومستداماً' : 'Six integrated steps ensuring real and sustainable transformation'}</p>
        </div>
      </section>

      <section className="py-16 px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 p-8 rounded-3xl border border-white/10 bg-corp-surface/40 hover:border-brand-accent/30 transition-all group">
              <div className="font-heading font-black text-5xl gradient-text leading-none flex-shrink-0">{step.num}</div>
              <div>
                <h3 className="font-heading font-black text-white text-2xl mb-3">{step.title}</h3>
                <p className="text-white/60 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-black text-3xl text-white mb-4">{lang === 'ar' ? 'ابدأ رحلتك معنا' : 'Start Your Journey With Us'}</h2>
          <p className="text-white/50 mb-8">{lang === 'ar' ? 'نطبق هذه المنهجية معك خطوة بخطوة' : 'We apply this methodology with you step by step'}</p>
          <Link to="/consultation" className="btn-catalyst px-8 py-4 rounded-2xl inline-flex items-center gap-2">
            {translations.nav.consultation[lang]} <Arrow size={16} />
          </Link>
        </div>
      </section>
      <CorpFooter />
    </div>
  );
}