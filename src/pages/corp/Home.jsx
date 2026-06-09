import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { ArrowRight, ArrowLeft, ChevronDown, Award, TrendingUp, Users, Zap, Globe, Target, BarChart2, Lightbulb, Shield } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const STATS = [
  { ar: '+٤٧٠٠', en: '+4,700', label: { ar: 'ساعات تدريب وتطوير', en: 'Coaching & Consulting Hours' } },
  { ar: '+٢٠٠', en: '+200', label: { ar: 'مدير وقائد تنفيذي', en: 'Executives & Leaders' } },
  { ar: '+٣٥٠٠٠', en: '+35,000', label: { ar: 'متدرب ومستفيد', en: 'Trainees & Beneficiaries' } },
  { ar: '+١٥٠', en: '+150', label: { ar: 'مشروع مُنجز', en: 'Projects Delivered' } },
];

const WHO_WE_SERVE = {
  ar: ['التنفيذيون والمدراء', 'القادة الناشئون', 'المحترفون والمتخصصون', 'رواد الأعمال', 'إدارات الموارد البشرية', 'الفرق المؤسسية', 'المنظمات والشركات', 'الجهات الحكومية وشبه الحكومية'],
  en: ['Executives & C-Suite Leaders', 'Emerging Leaders', 'Professionals & Specialists', 'Entrepreneurs', 'HR Departments', 'Organizational Teams', 'Companies & Corporations', 'Government & Semi-Government Entities'],
};

const ROUTE_STEPS = [
  { letter: 'R', word: { ar: 'Reflect', en: 'Reflect' }, desc: { ar: 'الوعي الذاتي والبصيرة', en: 'Self-awareness and insight' } },
  { letter: 'O', word: { ar: 'Orient', en: 'Orient' }, desc: { ar: 'التوجه الاستراتيجي والوضوح', en: 'Strategic direction and clarity' } },
  { letter: 'U', word: { ar: 'Upskill', en: 'Upskill' }, desc: { ar: 'بناء القدرات والمهارات', en: 'Capability and skill development' } },
  { letter: 'T', word: { ar: 'Track', en: 'Track' }, desc: { ar: 'مراقبة التقدم المستمر', en: 'Continuous progress monitoring' } },
  { letter: 'E', word: { ar: 'Embed', en: 'Embed' }, desc: { ar: 'التغيير المستدام والتكامل الثقافي', en: 'Sustainable change and cultural integration' } },
];

const SERVICES_OVERVIEW = {
  ar: [
    { icon: Users, title: 'التدريب التنفيذي والقيادي', desc: 'برامج متخصصة لتعزيز القيادة والتواصل وإدارة التغيير' },
    { icon: Target, title: 'التدريب التنفيذي والتمكيني', desc: 'جلسات فردية وجماعية لتطوير القادة التنفيذيين والناشئين' },
    { icon: BarChart2, title: 'الاستشارات المؤسسية', desc: 'تصميم الهياكل التنظيمية وتحسين الكفاءة والأداء المؤسسي' },
    { icon: Lightbulb, title: 'بناء الكفاءات والتقييمات', desc: 'باستخدام منهجية ROUTE™ وHarrison وNCDA لتقييم الكفاءات وتطويرها' },
    { icon: TrendingUp, title: 'استراتيجيات النمو والتحول', desc: 'دعم المؤسسات في قيادة التغيير وتحقيق النمو المستدام' },
    { icon: Shield, title: 'الأدوات الرقمية التطويرية', desc: 'أدوات وتقييمات رقمية مصممة لدعم رحلة التطوير الفردي والمؤسسي' },
  ],
  en: [
    { icon: Users, title: 'Executive & Leadership Training', desc: 'Specialized programs to enhance leadership, communication, and change management' },
    { icon: Target, title: 'Executive Coaching & Empowerment', desc: 'Individual and group coaching for senior and emerging leaders' },
    { icon: BarChart2, title: 'Institutional Consulting', desc: 'Designing organizational structures and improving institutional efficiency' },
    { icon: Lightbulb, title: 'Competency Development & Assessments', desc: 'Using ROUTE™, Harrison, and NCDA methodologies to evaluate and develop competencies' },
    { icon: TrendingUp, title: 'Growth & Transformation Strategies', desc: 'Supporting organizations in leading change and achieving sustainable growth' },
    { icon: Shield, title: 'Digital Development Tools', desc: 'Digital tools and assessments designed to support individual and organizational development' },
  ],
};

const WHY_US = {
  ar: [
    { icon: Award, title: 'ملكية فكرية حصرية', sub: 'منهجية ROUTE°', desc: 'إطارنا المسجَّل الذي يجمع بين التميز العالمي والعمق الخليجي.' },
    { icon: Globe, title: 'خبرة تنفيذية مثبتة', sub: 'منطقة الخليج', desc: 'أكثر من ١٥ عاماً في التدريب التنفيذي والاستشارات عبر دول الخليج.' },
    { icon: Shield, title: 'اعتمادات دولية موثوقة', sub: 'معايير عالمية', desc: 'مدعومون بـ Harrison وNCDA وشهادات تدريب دولية معتمدة.' },
    { icon: Target, title: 'حلول عملية وقابلة للقياس', sub: 'نتائج حقيقية', desc: 'كل حل مصمم للتطبيق الفعلي بمؤشرات واضحة وتقدم قابل للتتبع.' },
    { icon: Zap, title: 'سياق خليجي ورؤى وطنية', sub: 'رؤية ٢٠٣٠', desc: 'توافق عميق مع أجندات التحول الإقليمية وفهم المشهد القيادي الخليجي.' },
  ],
  en: [
    { icon: Award, title: 'Exclusive Intellectual Property', sub: 'ROUTE° Methodology', desc: 'Our proprietary, registered framework combining global excellence with Gulf-specific insight.' },
    { icon: Globe, title: 'Proven Executive Experience', sub: 'Gulf Region', desc: 'Over 15 years delivering executive coaching and consulting across the GCC with measurable results.' },
    { icon: Shield, title: 'Trusted International Accreditations', sub: 'Global Standards', desc: 'Backed by Harrison Assessments, NCDA, and international coaching certifications.' },
    { icon: Target, title: 'Practical, Measurable Solutions', sub: 'Real Results', desc: 'Every solution designed for real-world application with clear metrics and trackable progress.' },
    { icon: Zap, title: 'Gulf Context & National Visions', sub: 'Vision 2030', desc: 'Deep alignment with regional transformation agendas and Gulf leadership landscape.' },
  ],
};

const ACCREDITATIONS = [
  { name: 'Harrison', desc: { ar: 'تقييمات Harrison', en: 'Harrison Assessments' } },
  { name: 'NCDA', desc: { ar: 'التطوير المهني', en: 'Career Development' } },
  { name: 'ICF', desc: { ar: 'اتحاد التدريب الدولي', en: 'Coaching Federation' } },
  { name: 'Gallup', desc: { ar: 'تقييم نقاط القوة', en: 'Strengths Assessment' } },
  { name: 'Thomas', desc: { ar: 'التحليل السلوكي', en: 'Behavioral Analysis' } },
  { name: 'CPD', desc: { ar: 'شهادة مهنية', en: 'Professional Certification' } },
  { name: 'Kaizen', desc: { ar: 'التحسين المستمر', en: 'Continuous Improvement' } },
  { name: 'ATD', desc: { ar: 'تطوير المواهب', en: 'Talent Development' } },
  { name: 'Six Seconds', desc: { ar: 'الذكاء العاطفي', en: 'Emotional Intelligence' } },
  { name: 'EQ360', desc: { ar: 'التقييم ٣٦٠ درجة', en: '360 Assessment' } },
  { name: 'TKI', desc: { ar: 'إدارة النزاعات', en: 'Conflict Management' } },
  { name: 'GCDF', desc: { ar: 'تيسير المسار المهني', en: 'Career Facilitation' } },
];

const PARTNERS_COUNT = 30;

export default function Home() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-corp-dark min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <CorpNavbar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #05E1AE, #1A3A5C)' }} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></div>
            <span className="text-brand-accent text-sm font-medium">{lang === 'ar' ? 'شركاء النمو المؤسسي في منطقة الخليج' : 'Organizational Growth Partners Across the Gulf Region'}</span>
          </div>
          <h1 className="font-heading font-black text-5xl md:text-7xl text-white leading-tight mb-6">
            {lang === 'ar'
              ? <> وضوح الرؤية، <span style={{ color: '#05E1AE' }}>نمو حقيقي،</span><br />قيادة مؤثرة، <span style={{ color: '#05E1AE' }}>أثر مستدام</span></>
              : <> Clarity. <span style={{ color: '#05E1AE' }}>Growth.</span><br />Leadership. <span style={{ color: '#05E1AE' }}>Impact.</span></>}
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            {lang === 'ar'
              ? 'أوبتيفانس شريكك الاستراتيجي في الاستشارات المؤسسية، التدريب التنفيذي، وتطوير القدرات المبنية على القياس والأثر الحقيقي. بخبرة تمتد لأكثر من ١٥ عاماً عبر دول الخليج.'
              : 'OPTIVANCE is your strategic partner in organizational consulting, executive coaching, and capability development built on measurement and real impact — with 15+ years of proven results across the GCC.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation" className="btn-catalyst px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-2">
              {lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'} <Arrow size={16} />
            </Link>
            <Link to="/store" className="btn-outline-white px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-2">
              {lang === 'ar' ? 'زيارة المتجر الرقمي' : 'Visit Digital Store'} <Arrow size={16} />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 py-14 px-6 bg-corp-surface/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-heading font-black text-4xl md:text-5xl gradient-text mb-2">{s[lang]}</div>
              <div className="text-white/50 text-sm">{s.label[lang]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ROUTE Methodology */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'منهجيتنا الحصرية' : 'Our Exclusive Methodology'}</p>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-white mb-4">
              {lang === 'ar' ? 'منهجية ROUTE° الحصرية' : 'The Exclusive ROUTE° Methodology'}
            </h2>
            <p className="text-white/50 text-lg max-w-3xl mx-auto">
              {lang === 'ar'
                ? 'إطار متكامل مسجَّل يمزج بين أفضل الممارسات العالمية والرؤى الخليجية لخلق قيمة حقيقية وأثر دائم.'
                : 'A proprietary, integrated registered framework that blends global best practices with Gulf-specific insights to create real value and lasting impact.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {ROUTE_STEPS.map((step, i) => (
              <div key={i} className="relative p-6 rounded-3xl border border-white/10 bg-corp-surface/40 hover:border-brand-accent/40 transition-all group text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-accent/20 transition-all">
                  <span className="font-heading font-black text-2xl text-brand-accent">{step.letter}</span>
                </div>
                <h3 className="font-heading font-black text-white text-lg mb-2">{step.word[lang]}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{step.desc[lang]}</p>
                {i < ROUTE_STEPS.length - 1 && (
                  <div className="hidden md:block absolute -end-2 top-1/2 -translate-y-1/2 z-10">
                    <Arrow size={16} className="text-brand-accent/30" />
                  </div>
                )}
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

      {/* Core Values */}
      <section className="py-20 px-6 bg-corp-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'قيمنا الجوهرية' : 'Our Core Values'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-3">
              {lang === 'ar' ? 'المبادئ التي تُشكِّل هويتنا' : 'The Principles That Shape Our Identity'}
            </h2>
            <p className="text-white/50">{lang === 'ar' ? 'القيم التي توجه قراراتنا اليومية' : 'The values that guide our daily decisions'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', ar: { title: 'التمكين', desc: 'نخلق بيئات تُطلق الإمكانات الكاملة للأفراد والمؤسسات.' }, en: { title: 'Empowerment', desc: 'We create environments that unleash the full potential of individuals and organizations.' } },
              { num: '02', ar: { title: 'الابتكار', desc: 'نقدم حلولاً إبداعية واستشرافية تتجاوز المألوف وتُحدث تغييراً حقيقياً.' }, en: { title: 'Innovation', desc: 'We provide creative, forward-thinking solutions that go beyond convention and drive real change.' } },
              { num: '03', ar: { title: 'النمو المستدام', desc: 'نعتبر النمو المستدام المقياس الحقيقي لنجاحنا ونجاح شركائنا على المدى البعيد.' }, en: { title: 'Sustainable Growth', desc: 'We consider sustainable growth the true measure of our success and that of our partners over the long term.' } },
            ].map((v, i) => (
              <div key={i} className="p-8 rounded-3xl border border-white/10 bg-corp-dark hover:border-brand-accent/30 transition-all group">
                <div className="font-heading font-black text-5xl gradient-text mb-4 opacity-40">{v.num}</div>
                <h3 className="font-heading font-black text-white text-2xl mb-3">{v[lang].title}</h3>
                <p className="text-white/50 leading-relaxed">{v[lang].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'خبراتنا' : 'Our Expertise'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-3">
              {lang === 'ar' ? 'حلول متكاملة للقيادة والاستشارات' : 'Integrated Leadership & Consulting Solutions'}
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              {lang === 'ar'
                ? 'بخبرة سنوات عبر القطاعات في الخليج وما بعده، تدعم أوبتيفانس الشركات والقادة والمهنيين الساعين إلى نمو قابل للقياس.'
                : 'With years of experience across sectors in the GCC and beyond, Optivance supports companies, leaders, and professionals seeking measurable growth aligned with Vision 2030.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES_OVERVIEW[lang].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-corp-surface/40 hover:border-brand-accent/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-all">
                    <Icon size={18} className="text-brand-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="inline-flex items-center gap-2 text-brand-accent font-medium hover:gap-3 transition-all">
              {lang === 'ar' ? 'استعرض جميع الخدمات' : 'View All Services'} <Arrow size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 px-6 bg-corp-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'من نخدم' : 'Who We Serve'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white">
              {lang === 'ar' ? 'نخدم المؤسسات والقادة في جميع القطاعات' : 'Serving Organizations & Leaders Across All Sectors'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WHO_WE_SERVE[lang].map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-corp-dark hover:border-brand-accent/30 transition-all group">
                <div className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0"></div>
                <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'الاعتمادات المهنية' : 'Professional Accreditations'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-3">
              {lang === 'ar' ? 'اعتمادات دولية يحملها فريقنا' : 'Held by Our Team'}
            </h2>
            <p className="text-white/50">{lang === 'ar' ? 'مدعومون بشهادات ومنهجيات معترف بها دولياً' : 'Backed by internationally recognized certifications and methodologies'}</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {ACCREDITATIONS.map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 bg-corp-surface/40 hover:border-brand-accent/30 transition-all text-center group">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all">
                  <span className="text-brand-accent font-heading font-black text-xs">{a.name.substring(0, 2)}</span>
                </div>
                <span className="text-white font-bold text-xs">{a.name}</span>
                <span className="text-white/40 text-xs leading-tight">{a.desc[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-20 px-6 bg-corp-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'أثرنا' : 'Our Impact'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white">
              {lang === 'ar' ? 'أرقام تروي قصتنا' : 'Numbers That Tell Our Story'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { ar: '+٤٧٠٠', en: '+4,700', label: { ar: 'ساعة تدريب واستشارة', en: 'Coaching and Consulting Hours' } },
              { ar: '+٢٠٠', en: '+200', label: { ar: 'مدير وقائد تنفيذي', en: 'Executives and Leaders' } },
              { ar: '+٣٥٠٠٠', en: '+35,000', label: { ar: 'متدرب ومستفيد', en: 'Trainees and Beneficiaries' } },
              { ar: '+١٥٠', en: '+150', label: { ar: 'مشروع مبتكر مُنجز', en: 'Innovative Projects Delivered' } },
              { ar: '+٨٧', en: '+87', label: { ar: 'منظمة وشريك استراتيجي', en: 'Organizations & Strategic Partners' } },
              { ar: '+٥٥٠', en: '+550', label: { ar: 'محتوى تدريب قيادي', en: 'Leadership Training Contents' } },
            ].map((s, i) => (
              <div key={i} className="p-8 rounded-3xl border border-white/10 bg-corp-dark text-center hover:border-brand-accent/20 transition-all">
                <div className="font-heading font-black text-4xl md:text-5xl gradient-text mb-3">{s[lang]}</div>
                <div className="text-white/50 text-sm">{s.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'أثرنا' : 'Our Impact'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-3">
              {lang === 'ar' ? 'شركاء موثوقون' : 'Trusted Partners'}
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              {lang === 'ar'
                ? 'تفخر أوبتيفانس بخدمة جهات حكومية رائدة وشركات كبرى ومؤسسات تعليمية في منطقة الخليج، وقد نجحت في تنفيذ أكثر من ١٥٠ مشروعاً.'
                : 'Optivance is proud to serve leading government entities, major enterprises, and educational institutions across the Gulf region, having successfully delivered more than 150 projects.'}
            </p>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {Array.from({ length: PARTNERS_COUNT }, (_, i) => (
              <div key={i} className="aspect-square rounded-xl border border-white/10 bg-corp-surface/40 flex items-center justify-center hover:border-brand-accent/30 transition-all group">
                <span className="text-white/20 text-xs font-bold group-hover:text-white/40">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 px-6 bg-corp-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'لماذا أوبتيفانس؟' : 'Why Us?'}</p>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-white">
              {lang === 'ar' ? 'ما يجعلنا مختلفين' : 'What Makes Us Different'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US[lang].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`p-8 rounded-3xl border bg-corp-dark hover:border-brand-accent/40 transition-all group ${i === 0 ? 'border-brand-accent/30 md:col-span-2 lg:col-span-1' : 'border-white/10'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-5 group-hover:bg-brand-accent/20 transition-all">
                    <Icon size={20} className="text-brand-accent" />
                  </div>
                  <p className="text-brand-accent text-xs font-medium mb-1">{item.sub}</p>
                  <h3 className="font-heading font-black text-white text-xl mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, #1A3A5C, #0D1F33)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="relative z-10">
              <h2 className="font-heading font-black text-3xl md:text-5xl text-white mb-4">
                {lang === 'ar' ? 'هل أنت مستعد للخطوة التالية؟' : 'Ready for the Next Step?'}
              </h2>
              <p className="text-white/60 mb-10 text-lg">
                {lang === 'ar' ? 'شاركنا تحديك وسنبني معك الحل المناسب لمؤسستك أو رحلتك القيادية.' : "Share your challenge and we'll build the right solution for your organization or leadership journey."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/consultation" className="btn-catalyst px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-base">
                  {lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'} <Arrow size={16} />
                </Link>
                <Link to="/store" className="btn-outline-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-base">
                  {lang === 'ar' ? 'تصفح المتجر الرقمي' : 'Browse Digital Store'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CorpFooter />
    </div>
  );
}