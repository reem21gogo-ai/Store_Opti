import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { ArrowRight, ArrowLeft, Search, Microscope, PenTool, Play, BarChart2, RefreshCw, Shield } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const ROUTE_STEPS = [
  { letter: 'R', word: { ar: 'Reflect', en: 'Reflect' }, color: '#05E1AE', desc: { ar: 'الوعي الذاتي والبصيرة', en: 'Self-awareness and insight' } },
  { letter: 'O', word: { ar: 'Orient', en: 'Orient' }, color: '#1A8FBE', desc: { ar: 'التوجه الاستراتيجي والوضوح', en: 'Strategic direction and clarity' } },
  { letter: 'U', word: { ar: 'Upskill', en: 'Upskill' }, color: '#3B7AE8', desc: { ar: 'بناء القدرات والمهارات', en: 'Capability and skill development' } },
  { letter: 'T', word: { ar: 'Track', en: 'Track' }, color: '#7C5CBF', desc: { ar: 'مراقبة التقدم المستمر', en: 'Continuous progress monitoring' } },
  { letter: 'E', word: { ar: 'Embed', en: 'Embed' }, color: '#C44E9B', desc: { ar: 'التغيير المستدام والتكامل الثقافي', en: 'Sustainable change and cultural integration' } },
];

const STEPS = {
  ar: [
    {
      num: '01', icon: Search,
      title: 'فهم الاحتياج',
      desc: 'نبدأ بالاستماع العميق والحوار المفتوح لفهم طبيعة المؤسسة، التحديات القائمة، الأهداف المستقبلية، والجمهور المستهدف. نجمع المعلومات من خلال جلسات مقابلات هيكلية، استبيانات، ومراجعة الوثائق.',
      what: { ar: 'جلسات استماع + مقابلات + استبيانات + مراجعة وثائق', en: 'Listening sessions + Interviews + Surveys + Document review' },
    },
    {
      num: '02', icon: Microscope,
      title: 'التشخيص والتحليل',
      desc: 'نحلل الوضع الراهن بعمق باستخدام أدوات التقييم المتخصصة — منهجية ROUTE™ وHarrison وNCDA — لتحديد الفجوات ونقاط القوة وأولويات التدخل.',
      what: { ar: 'تقييمات متخصصة + تحليل البيانات + تحديد الفجوات + خارطة أولويات', en: 'Specialized assessments + Data analysis + Gap identification + Priority mapping' },
    },
    {
      num: '03', icon: PenTool,
      title: 'تصميم الحل',
      desc: 'بناءً على التشخيص، نصمم حلاً استشارياً مخصصاً بالكامل — سواء كان برنامجاً قيادياً، رحلة تدريب تنفيذي، مشروعاً استشارياً، أداة تقييم، أو منتجاً رقمياً. لا نستخدم قوالب جاهزة.',
      what: { ar: 'تصميم البرنامج + تخطيط المحتوى + تحديد الأدوات + خارطة الأثر', en: 'Program design + Content planning + Tool selection + Impact mapping' },
    },
    {
      num: '04', icon: Play,
      title: 'التنفيذ والتسليم',
      desc: 'ننفذ الحل المصمم بمرونة واحترافية — جلسات تدريب، ورش عمل، برامج قيادية، مشاريع استشارية، أو منتجات رقمية. نضمن المشاركة الفعلية والتطبيق الحقيقي من اليوم الأول.',
      what: { ar: 'تنفيذ الجلسات + إدارة المشروع + دعم المشاركين + توثيق المخرجات', en: 'Session delivery + Project management + Participant support + Output documentation' },
    },
    {
      num: '05', icon: BarChart2,
      title: 'القياس والتقرير',
      desc: 'نقيس الأثر الفعلي على مؤشرات واضحة ومتفق عليها مسبقاً، ونقدم تقارير تفصيلية بالنتائج والرؤى والتوصيات والخطوات التالية.',
      what: { ar: 'تقارير مفصلة + تحليل الأثر + مقارنة بالمؤشرات + توصيات عملية', en: 'Detailed reports + Impact analysis + KPI comparison + Practical recommendations' },
    },
    {
      num: '06', icon: RefreshCw,
      title: 'المتابعة والاستدامة',
      desc: 'نبقى شركاء في رحلة النمو من خلال مراجعات دورية، جلسات متابعة، وتحديثات تضمن تطبيق المخرجات وقياس الأثر على المدى البعيد.',
      what: { ar: 'جلسات متابعة + مراجعات دورية + تحديث الخطة + قياس الأثر طويل المدى', en: 'Follow-up sessions + Periodic reviews + Plan updates + Long-term impact measurement' },
    },
  ],
  en: [
    {
      num: '01', icon: Search,
      title: 'Understand the Need',
      desc: 'We begin with deep listening and open dialogue to understand the organization\'s nature, existing challenges, future goals, and target audience. We collect information through structured interviews, surveys, and document review.',
      what: { ar: '', en: 'Listening sessions + Interviews + Surveys + Document review' },
    },
    {
      num: '02', icon: Microscope,
      title: 'Diagnose and Analyze',
      desc: 'We deeply analyze the current situation using specialized assessment tools — ROUTE™, Harrison, and NCDA methodologies — to identify gaps, strengths, and intervention priorities.',
      what: { ar: '', en: 'Specialized assessments + Data analysis + Gap identification + Priority mapping' },
    },
    {
      num: '03', icon: PenTool,
      title: 'Design the Solution',
      desc: 'Based on the diagnosis, we design a fully customized consulting solution — whether a leadership program, executive coaching journey, consulting project, assessment tool, or digital product. We never use off-the-shelf templates.',
      what: { ar: '', en: 'Program design + Content planning + Tool selection + Impact mapping' },
    },
    {
      num: '04', icon: Play,
      title: 'Deliver',
      desc: 'We execute the designed solution with flexibility and professionalism — training sessions, workshops, leadership programs, consulting projects, or digital products. We ensure real participation and practical application from day one.',
      what: { ar: '', en: 'Session delivery + Project management + Participant support + Output documentation' },
    },
    {
      num: '05', icon: BarChart2,
      title: 'Measure and Report',
      desc: 'We measure actual impact against clear, pre-agreed indicators, and provide detailed reports with results, insights, recommendations, and next steps.',
      what: { ar: '', en: 'Detailed reports + Impact analysis + KPI comparison + Practical recommendations' },
    },
    {
      num: '06', icon: RefreshCw,
      title: 'Follow Up',
      desc: 'We remain partners in the growth journey through periodic reviews, follow-up sessions, and updates that ensure output application and long-term impact measurement.',
      what: { ar: '', en: 'Follow-up sessions + Periodic reviews + Plan updates + Long-term impact measurement' },
    },
  ],
};

export default function Methodology() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const steps = STEPS[lang];
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="bg-corp-dark min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <CorpNavbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{lang === 'ar' ? 'منهجيتنا' : 'Our Methodology'}</p>
          <h1 className="font-heading font-black text-4xl md:text-6xl text-white mb-6">
            {lang === 'ar' ? 'كيف نعمل معك' : 'How We Work With You'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            {lang === 'ar'
              ? 'ست خطوات متكاملة تضمن تحولاً حقيقياً ومستداماً — من أول تواصل إلى التسليم والمتابعة.'
              : 'Six integrated steps ensuring real and sustainable transformation — from first contact to delivery and follow-up.'}
          </p>
        </div>
      </section>

      {/* ROUTE Framework */}
      <section className="py-16 px-6 bg-corp-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'الإطار المرجعي' : 'The Reference Framework'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-3">
              {lang === 'ar' ? 'منهجية ROUTE° الحصرية' : 'The Exclusive ROUTE° Methodology'}
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              {lang === 'ar'
                ? 'إطارنا الملكي المسجَّل الذي يُرشد عملنا ويضمن نتائج متكاملة في كل مشروع.'
                : 'Our registered proprietary framework that guides our work and ensures holistic results in every project.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {ROUTE_STEPS.map((step, i) => (
              <div key={i} className="p-6 rounded-3xl border border-white/10 bg-corp-dark hover:border-brand-accent/40 transition-all group text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all"
                  style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                  <span className="font-heading font-black text-3xl" style={{ color: step.color }}>{step.letter}</span>
                </div>
                <h3 className="font-heading font-black text-white text-lg mb-2">{step.word[lang]}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{step.desc[lang]}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-accent/20 text-brand-accent/60 text-xs">
              <Shield size={12} /> {lang === 'ar' ? 'إطار ملكية فكرية مسجَّل' : 'Registered Proprietary Framework'}
            </span>
          </div>
        </div>
      </section>

      {/* How We Work Steps */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'رحلة العمل' : 'The Work Journey'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white">
              {lang === 'ar' ? 'من أول تواصل إلى الأثر المستدام' : 'From First Contact to Lasting Impact'}
            </h2>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isOpen = activeStep === i;
              return (
                <div key={i}
                  onClick={() => setActiveStep(isOpen ? null : i)}
                  className={`p-7 rounded-3xl border transition-all cursor-pointer group ${isOpen ? 'border-brand-accent/50 bg-corp-surface/80' : 'border-white/10 bg-corp-surface/40 hover:border-brand-accent/30'}`}>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center gap-3">
                      <div className="font-heading font-black text-3xl gradient-text leading-none">{step.num}</div>
                      <div className="w-9 h-9 rounded-xl bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all">
                        <Icon size={16} className="text-brand-accent" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-black text-white text-xl mb-2">{step.title}</h3>
                      <p className="text-white/60 leading-relaxed text-sm">{step.desc}</p>
                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <span className="text-brand-accent text-xs font-bold uppercase tracking-wider">{lang === 'ar' ? 'أدوات وأساليب العمل' : 'Tools & Methods'}</span>
                          <p className="text-white/50 text-sm mt-1">{step.what[lang]}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-white/20 group-hover:text-brand-accent/40 transition-colors">
                      <Arrow size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Our Methodology Works */}
      <section className="py-20 px-6 bg-corp-surface/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-black text-3xl text-white mb-3">
              {lang === 'ar' ? 'لماذا تنجح منهجيتنا؟' : 'Why Does Our Methodology Succeed?'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { ar: { t: 'مخصصة، لا جاهزة', d: 'كل حل نصممه من الصفر بناءً على واقع العميل، ثقافته، وأهدافه.' }, en: { t: 'Custom, Not Off-the-Shelf', d: 'Every solution we design from scratch based on the client\'s reality, culture, and goals.' } },
              { ar: { t: 'مبنية على العلم والأداة', d: 'نستخدم منهجيات معتمدة دولياً مثل Harrison وNCDA وأدواتنا الحصرية.' }, en: { t: 'Science & Tool-Based', d: 'We use internationally accredited methodologies like Harrison, NCDA, and our exclusive tools.' } },
              { ar: { t: 'مع العميل لا بدلاً عنه', d: 'نعمل كشريك داخلي، لا كمستشار خارجي. التحول يحدث مع الفريق.' }, en: { t: 'With the Client, Not For Them', d: 'We work as an internal partner, not an external consultant. Transformation happens with the team.' } },
              { ar: { t: 'نتائج قابلة للقياس والتحقق', d: 'كل ما نقدمه مرتبط بمؤشرات أداء واضحة نقيسها ونُبلِّغ عنها.' }, en: { t: 'Measurable & Verifiable Results', d: 'Everything we deliver is tied to clear KPIs we measure and report on.' } },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl border border-white/10 bg-corp-dark hover:border-brand-accent/30 transition-all">
                <div className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0 mt-2"></div>
                <div>
                  <h4 className="font-heading font-bold text-white mb-1">{item[lang].t}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{item[lang].d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-black text-3xl text-white mb-4">
            {lang === 'ar' ? 'ابدأ رحلتك معنا' : 'Start Your Journey With Us'}
          </h2>
          <p className="text-white/50 mb-8">
            {lang === 'ar' ? 'نطبق هذه المنهجية معك خطوة بخطوة من أول يوم' : 'We apply this methodology with you step by step from day one'}
          </p>
          <Link to="/consultation" className="btn-catalyst px-8 py-4 rounded-2xl inline-flex items-center gap-2">
            {lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'} <Arrow size={16} />
          </Link>
        </div>
      </section>

      <CorpFooter />
    </div>
  );
}