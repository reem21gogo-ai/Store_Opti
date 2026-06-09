import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { ArrowRight, ArrowLeft, ChevronDown, Award, TrendingUp, Users, Zap, Globe, Target, BarChart2, Lightbulb, Shield } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const STATS_ROW = [
  { ar: '+٤,٧٠٠', en: '+4,700', label: { ar: 'ساعات تدريب واستشارات', en: 'Coaching & Consulting Hours' } },
  { ar: '+٢٠٠', en: '+200', label: { ar: 'قادة وتنفيذيين', en: 'Executives & Leaders' } },
  { ar: '+٣٥,٠٠٠', en: '+35,000', label: { ar: 'مدربين ومستفيدين', en: 'Trainees & Beneficiaries' } },
  { ar: '+١٥٠', en: '+150', label: { ar: 'مشاريع منجزة', en: 'Projects Delivered' } },
];

const ROUTE_STEPS = [
  { letter: 'R', word: 'Reflect', desc: { ar: 'التفكر والتبصر', en: 'Self-awareness and insight' } },
  { letter: 'O', word: 'Orient', desc: { ar: 'التوجيه والتركيز', en: 'Strategic direction and clarity' } },
  { letter: 'U', word: 'Upskill', desc: { ar: 'الارتقاء بالمؤهلات', en: 'Capability and skill development' } },
  { letter: 'T', word: 'Track', desc: { ar: 'النتج والقياس', en: 'Continuous progress monitoring' } },
  { letter: 'E', word: 'Embed', desc: { ar: 'التمكين والدمج', en: 'Sustainable change and cultural integration' } },
];

const SERVICES_OVERVIEW = {
  ar: [
    { icon: Users, num: '1', title: 'تدريب القيادة والتنفيذيين' },
    { icon: Target, num: '2', title: 'التدريب والتوجيه التنفيذي' },
    { icon: BarChart2, num: '3', title: 'الاستشارات المؤسسية' },
    { icon: Lightbulb, num: '4', title: 'تطوير الكفاءات والتقييمات' },
    { icon: TrendingUp, num: '5', title: 'استراتيجيات النمو والتحول' },
    { icon: Shield, num: '6', title: 'أدوات التطوير الرقمي' },
  ],
  en: [
    { icon: Users, num: '1', title: 'Executive & Leadership Training' },
    { icon: Target, num: '2', title: 'Executive Coaching & Empowerment' },
    { icon: BarChart2, num: '3', title: 'Institutional Consulting' },
    { icon: Lightbulb, num: '4', title: 'Competency Development & Assessments' },
    { icon: TrendingUp, num: '5', title: 'Growth & Transformation Strategies' },
    { icon: Shield, num: '6', title: 'Digital Development Tools' },
  ],
};

const WHO_WE_SERVE = {
  ar: ['القادة التنفيذيون وإدارة العليا', 'المؤهلون والمتخصصون', 'المؤهلون والمتخصصون', 'التنفيذيون وقيادة الإدارة العليا', 'الفرق التنظيمية', 'إدارات الموارد البشرية', 'إدارة الموارد البشرية', 'الجهات الحكومية وشبه الحكومية'],
  en: ['Executives & C-Suite Leaders', 'Professionals & Specialists', 'Emerging Leaders', 'Board Members & Directors', 'Organizational Teams', 'HR Departments', 'Companies & Corporations', 'Government & Semi-Government Entities'],
};

const ACCREDITATIONS = [
  { name: 'Harrison Assessments', short: 'H' },
  { name: 'NCDA', short: 'NC' },
  { name: 'Coaching Federation', short: 'CF' },
  { name: 'Strengths Assessment', short: 'GA' },
  { name: 'Behavioral Analysis', short: 'BH' },
  { name: 'Professional Certification', short: 'PF' },
  { name: 'Continuous Improvement', short: 'KI' },
  { name: 'Talent Development', short: 'AT' },
  { name: 'Emotional Intelligence', short: 'S' },
  { name: '360 Assessment', short: 'EQ' },
  { name: 'Conflict Management', short: 'TK' },
  { name: 'Career Facilitation', short: 'GC' },
];

const IMPACT_STATS = [
  { ar: '+٤,٧٠٠', en: '+4,700', label: { ar: 'ساعات تدريب واستشارات', en: 'Coaching and Consulting Hours' } },
  { ar: '+٢٠٠', en: '+200', label: { ar: 'قادة وتنفيذيين', en: 'Executives & Leaders' } },
  { ar: '+٣٥,٠٠٠', en: '+35,000', label: { ar: 'مدربين ومستفيدين', en: 'Trainees and Beneficiaries' } },
  { ar: '+١٥٠', en: '+150', label: { ar: 'مشاريع منجزة', en: 'Projects Delivered' } },
  { ar: '+٨٧', en: '+87', label: { ar: 'شراكة استراتيجية', en: 'Strategic Partnerships' } },
  { ar: '+٥٥٠', en: '+550', label: { ar: 'محتوى تدريبي للقيادة', en: 'Leadership Training Contents' } },
];

const WHY_US = {
  ar: [
    { icon: Award, title: 'الملكية الفكرية الحصرية', sub: 'Exclusive Intellectual\nProperty title…' },
    { icon: Globe, title: 'خبرة تنفيذية مثبتة حول مجلس التعاون الخليجي', sub: 'Proven Exec experience\naround the Gulf…' },
    { icon: Shield, title: 'اعتمادات دولية موثوقة', sub: 'Trusted International\nAccreditations…' },
    { icon: Target, title: 'حلول عملية وقابلة للقياس وفاعلة', sub: 'Practical, measurable\nNetwork Solutions…' },
  ],
  en: [
    { icon: Award, title: 'Exclusive Intellectual Property', sub: 'ROUTE° Methodology' },
    { icon: Globe, title: 'Proven Executive Experience', sub: 'Gulf Region GCC' },
    { icon: Shield, title: 'Trusted International Accreditations', sub: 'Global Standards' },
    { icon: Target, title: 'Practical, Measurable Solutions', sub: 'Real Results' },
  ],
};

export default function Home() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen font-body" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#111827' }}>
      <CorpNavbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0D1F33 0%, #111827 50%, #0a1628 100%)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        {/* Glow */}
        <div className="absolute top-1/3 end-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]" style={{ background: '#05E1AE' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-accent/25 bg-brand-accent/8 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              <span className="text-brand-accent text-xs font-medium">
                {lang === 'ar' ? 'شركاء النمو المؤسسي في دول مجلس التعاون الخليجي' : 'Organizational Growth Partners in the GCC'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-black leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff' }}>
              {lang === 'ar'
                ? <><span style={{ color: '#05E1AE' }}>وضوح.</span> نمو. قيادة. <span style={{ color: '#05E1AE' }}>تأثير.</span></>
                : <><span style={{ color: '#05E1AE' }}>Clarity.</span> Growth. Leadership. <span style={{ color: '#05E1AE' }}>Impact.</span></>}
            </h1>

            {/* Sub */}
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              {lang === 'ar'
                ? 'أوبتيفانس هو شريكك الاستراتيجي في الاستشارات التنفيذية والتدريب التنفيذي، ولتطوير الأداء المبنية على القياس والأثر الحقيقي. مع أكثر من ١٥ عاماً من النتائج الموثقة في دول مجلس التعاون الخليجي.'
                : 'OPTIVANCE is your strategic partner in organizational consulting, executive coaching, and capability development built on measurement and real impact — with 15+ years of proven results across the GCC.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link to="/consultation" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all" style={{ background: '#05E1AE', color: '#0D1F33' }}>
                {lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'} <Arrow size={15} />
              </Link>
              <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all border border-white/20 text-white hover:bg-white/5">
                {lang === 'ar' ? 'زيارة المتجر الرقمي' : 'Visit Digital Store'} <Arrow size={15} />
              </Link>
            </div>

            {/* Years badge */}
            <div className="mt-12">
              <span className="font-heading font-black text-6xl md:text-8xl" style={{ color: '#05E1AE', opacity: 0.15 }}>+15 Years</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 animate-bounce">
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ═══════════════ STATS ROW ═══════════════ */}
      <section style={{ background: '#0D1F33', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS_ROW.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-heading font-black text-3xl md:text-4xl mb-1" style={{ color: '#05E1AE' }}>{s[lang]}</div>
              <div className="text-white/50 text-xs leading-snug">{s.label[lang]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ ROUTE METHODOLOGY ═══════════════ */}
      <section className="py-20 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'منهجيتنا الحصرية' : 'Our Exclusive Methodology'}
            </p>
            <h2 className="font-heading font-black text-2xl md:text-4xl text-white mb-2">
              {lang === 'ar' ? 'منهجية ROUTE° الحصرية' : 'The Exclusive ROUTE° Methodology'}
            </h2>
            <p className="text-white/40 text-sm">Proprietary text and strategic partner for the Exclusive ROUTE° Methodology</p>
          </div>

          {/* ROUTE Cards */}
          <div className="grid grid-cols-5 gap-3 mb-10">
            {ROUTE_STEPS.map((step, i) => (
              <div key={i} className="rounded-2xl p-4 text-center transition-all hover:scale-105" style={{ background: '#1a2535', border: '1px solid rgba(5,225,174,0.15)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(5,225,174,0.1)', border: '1px solid rgba(5,225,174,0.2)' }}>
                  <span className="font-heading font-black text-2xl" style={{ color: '#05E1AE' }}>{step.letter}</span>
                </div>
                <div className="font-heading font-bold text-white text-sm mb-1">{step.word}</div>
                <div className="text-white/40 text-xs leading-snug">{step.desc[lang]}</div>
              </div>
            ))}
          </div>

          {/* R – Reflect detail box */}
          <div className="rounded-2xl p-6" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="font-heading font-black text-4xl" style={{ color: '#05E1AE' }}>R –</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg mb-1">
                  {lang === 'ar' ? 'التفكر والتبصر – Reflect' : 'التفكر والتبصر – Reflect'}
                </h3>
                <div className="text-white/50 text-sm mb-3">
                  {lang === 'ar' ? 'برنامج للتوعية والرقابة الذاتية' : 'Self-Awareness & Personal Mastery Program'}
                </div>
                <ul className="space-y-1.5 text-white/40 text-xs">
                  {(lang === 'ar' ? [
                    'يركز على التوعية الذاتية والتفكير النقدي والقيم العلمية',
                    'يدعو المدربين إلى بناء علاقة قوية بين النفس والاتجاهات والحوافز',
                    'يساعد على تطوير الأهداف الشخصية وتعزيز التعلم الذاتي',
                    'يشجع الأفراد على اكتشاف نقاط القوة وتطوير ذكائهم العاطفي',
                    'يمنح المتدربين الأدوات لمواجهة التحديات — نحو التطوير المستمر الذاتي',
                  ] : [
                    'Focuses on self-awareness, critical thinking, and scientific values',
                    'Invites coaches to build strong self-direction and motivational relationships',
                    'Helps develop personal goals and enhance self-directed learning',
                    'Encourages individuals to discover strengths and develop emotional intelligence',
                    'Equips trainees with tools to face challenges — toward continuous self-development',
                  ]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span style={{ color: '#05E1AE' }} className="mt-0.5 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/store" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all" style={{ borderColor: 'rgba(5,225,174,0.3)', color: '#05E1AE' }}>
              {lang === 'ar' ? 'زيارة المتجر الرقمي' : 'Visit Digital Store'} <Arrow size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section className="py-20 px-6" style={{ background: '#0D1F33' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'خبراتنا' : 'Our Expertise'}
            </p>
            <h2 className="font-heading font-black text-2xl md:text-3xl text-white mb-2">
              {lang === 'ar' ? 'حلول القيادة والاستشارات المتكاملة' : 'Integrated Leadership & Consulting Solutions'}
            </h2>
            <p className="text-white/40 text-sm">
              {lang === 'ar' ? 'Integrating Solutions (With years test…)' : 'Integrating Solutions — proven across sectors'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SERVICES_OVERVIEW[lang].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="rounded-2xl p-5 transition-all hover:scale-[1.02] cursor-default" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(5,225,174,0.1)' }}>
                      <Icon size={15} style={{ color: '#05E1AE' }} />
                    </div>
                    <span className="text-white/25 font-mono text-xs">{s.num}</span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm leading-snug">{s.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ CORE VALUES ═══════════════ */}
      <section className="py-20 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'قيمنا الجوهرية' : 'Our Core Values'}
            </p>
            <h2 className="font-heading font-black text-2xl md:text-3xl text-white mb-1">
              {lang === 'ar' ? 'المبادئ التي تشكل هويتنا' : 'The Principles That Shape Our Identity'}
            </h2>
            <p className="text-white/30 text-sm">Values test…</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: '01', ar: { t: 'التمكين', d: 'نخلق بيئات تُطلق الإمكانات الكاملة للأفراد والمؤسسات وتمنحهم أدوات النمو الحقيقي.' }, en: { t: 'Empowerment', d: 'We create environments that unleash the full potential of individuals and organizations.' } },
              { num: '02', ar: { t: 'الابتكار', d: 'نقدم حلولاً إبداعية واستشرافية تتجاوز الأساليب التقليدية وتُحدث تغييراً ملموساً.' }, en: { t: 'Innovation', d: 'We provide creative, forward-thinking solutions that go beyond convention and drive real change.' } },
              { num: '03', ar: { t: 'النمو المستدام', d: 'نعتبر النمو المستدام في مسار ازدهار شركائنا على المدى الطويل المقياس الحقيقي للنجاح.' }, en: { t: 'Sustainable Growth', d: 'We consider sustainable growth the true measure of success for our partners over the long term.' } },
            ].map((v, i) => (
              <div key={i} className="rounded-2xl p-7 transition-all hover:border-teal-500/30" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-heading font-black text-5xl mb-4" style={{ color: '#05E1AE', opacity: 0.2 }}>{v.num}</div>
                <h3 className="font-heading font-black text-white text-xl mb-3">{v[lang].t}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{v[lang].d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHO WE SERVE ═══════════════ */}
      <section className="py-20 px-6" style={{ background: '#0D1F33' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'من نخدم' : 'Who We Serve'}
            </p>
            <h2 className="font-heading font-black text-2xl md:text-3xl text-white mb-1">
              {lang === 'ar' ? 'خدمة المنظمات والقادة في جميع القطاعات' : 'Serving Organizations & Leaders Across All Sectors'}
            </h2>
            <p className="text-white/30 text-sm">Serving Organizations &amp; Leaders</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {WHO_WE_SERVE[lang].map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl transition-all hover:border-teal-500/30" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#05E1AE' }} />
                <span className="text-white/70 text-xs font-medium leading-snug">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ACCREDITATIONS ═══════════════ */}
      <section className="py-20 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'الاعتمادات المهنية' : 'Professional Accreditations'}
            </p>
            <h2 className="font-heading font-black text-2xl md:text-3xl text-white mb-1">
              {lang === 'ar' ? 'شهادات مهنية يحملها فريقنا' : 'Held by Our Team'}
            </h2>
            <p className="text-white/30 text-sm">Backed by Team</p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {ACCREDITATIONS.map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:border-teal-500/20" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: 'rgba(5,225,174,0.1)', color: '#05E1AE' }}>
                  {a.short}
                </div>
                <span className="text-white/50 text-xs leading-tight">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ IMPACT NUMBERS ═══════════════ */}
      <section className="py-20 px-6" style={{ background: '#0D1F33' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'أثرنا' : 'Our Impact'}
            </p>
            <h2 className="font-heading font-black text-2xl md:text-3xl text-white mb-1">
              {lang === 'ar' ? 'أرقام تروي قصتنا' : 'Numbers That Tell Our Story'}
            </h2>
            <p className="text-white/30 text-sm">Numbers That Tell Our Story</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {IMPACT_STATS.map((s, i) => (
              <div key={i} className="rounded-2xl p-6 text-center transition-all hover:border-teal-500/20" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-heading font-black text-3xl md:text-4xl mb-2" style={{ color: '#05E1AE' }}>{s[lang]}</div>
                <div className="text-white/50 text-xs leading-snug">{s.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUSTED PARTNERS ═══════════════ */}
      <section className="py-20 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'شركاؤنا' : 'Our Partners'}
            </p>
            <h2 className="font-heading font-black text-2xl md:text-3xl text-white mb-1">
              {lang === 'ar' ? 'شركاؤنا الموثوقون' : 'Trusted Partners OPTIVANCE'}
            </h2>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-6 gap-3">
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className="aspect-square rounded-xl flex items-center justify-center transition-all hover:border-teal-500/20" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-white/20 text-sm font-bold">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY US ═══════════════ */}
      <section className="py-20 px-6" style={{ background: '#0D1F33' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'ما الذي يميزنا' : 'What Distinguishes Us'}
            </p>
            <h2 className="font-heading font-black text-2xl md:text-3xl text-white">
              {lang === 'ar' ? 'ما الذي يميزنا' : 'What Makes Us Different'}
            </h2>
            <p className="text-white/30 text-sm mt-1">What Makes Us Different</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WHY_US[lang].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-2xl p-6 transition-all hover:border-teal-500/20" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(5,225,174,0.1)' }}>
                    <Icon size={18} style={{ color: '#05E1AE' }} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm leading-snug mb-2">{item.title}</h3>
                  <p className="text-white/35 text-xs leading-relaxed">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: '#111827' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at center, #1A3A5C 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-black text-3xl md:text-5xl text-white mb-4">
            {lang === 'ar' ? 'جاهز للخطوة القادمة؟' : 'Ready for the Next Step?'}
          </h2>
          <p className="text-white/50 text-base mb-2">
            {lang === 'ar' ? 'شارك تحدياتك…' : 'Share your challenges text…'}
          </p>
          <p className="text-white/50 mb-10">
            {lang === 'ar' ? 'شاركنا تحديك وسنبني معك الحل المناسب' : "Share your challenge and we'll build the right solution together"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/consultation" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-heading font-bold text-sm transition-all" style={{ background: '#05E1AE', color: '#0D1F33' }}>
              {lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'} <Arrow size={15} />
            </Link>
            <Link to="/store" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-heading font-bold text-sm border transition-all text-white border-white/20 hover:bg-white/5">
              {lang === 'ar' ? 'تصفح المتجر الرقمي' : 'Browse Digital Store'}
            </Link>
          </div>
        </div>
      </section>

      <CorpFooter />
    </div>
  );
}