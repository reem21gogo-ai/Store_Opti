import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import {
  ArrowRight, ArrowLeft, ChevronDown,
  Award, TrendingUp, Users, Zap, Globe,
  Target, BarChart2, Lightbulb, Shield,
  CheckCircle, Building2, BookOpen, Star
} from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

// ─── Data ───────────────────────────────────────────────────────────────────

const STATS = [
  { ar: '+٤,٧٠٠', en: '+4,700', label: { ar: 'ساعة تدريب واستشارة', en: 'Coaching & Consulting Hours' } },
  { ar: '+٢٠٠',   en: '+200',   label: { ar: 'قائد وتنفيذي',          en: 'Executives & Leaders' } },
  { ar: '+٣٥,٠٠٠',en: '+35,000',label: { ar: 'مدرَّب ومستفيد',        en: 'Trainees & Beneficiaries' } },
  { ar: '+١٥٠',   en: '+150',   label: { ar: 'مشروع تم تسليمه',       en: 'Projects Delivered' } },
];

const ROUTE_STEPS = [
  {
    letter: 'R', word: 'Reflect',
    ar: { title: 'التفكر والتبصر',        desc: 'بناء الوعي الذاتي والرقابة الداخلية، وتحديد القيم والدوافع الحقيقية.' },
    en: { title: 'Self-Awareness',         desc: 'Build self-awareness and internal clarity — understanding your values, strengths, and true motivations.' },
  },
  {
    letter: 'O', word: 'Orient',
    ar: { title: 'التوجيه الاستراتيجي',   desc: 'تحديد الاتجاه الصحيح وترجمة الرؤية إلى مسار واضح قابل للتنفيذ.' },
    en: { title: 'Strategic Direction',    desc: 'Define the right direction and translate vision into a clear, actionable roadmap.' },
  },
  {
    letter: 'U', word: 'Upskill',
    ar: { title: 'تطوير القدرات',          desc: 'تعزيز المهارات القيادية والمؤسسية من خلال برامج مُصممة وفق أحدث المعايير الدولية.' },
    en: { title: 'Capability Development', desc: 'Elevate leadership and organizational skills through programs designed to international standards.' },
  },
  {
    letter: 'T', word: 'Track',
    ar: { title: 'القياس والمتابعة',       desc: 'رصد التقدم بمؤشرات واضحة وتصحيح المسار باستمرار لضمان الأثر الفعلي.' },
    en: { title: 'Measure & Monitor',      desc: 'Track progress with clear KPIs and continuously course-correct to ensure real impact.' },
  },
  {
    letter: 'E', word: 'Embed',
    ar: { title: 'التمكين والترسيخ',       desc: 'دمج التغيير في ثقافة المنظمة وضمان الاستدامة والنمو طويل الأمد.' },
    en: { title: 'Sustain & Integrate',    desc: 'Embed change into organizational culture and ensure long-term sustainability and growth.' },
  },
];

const SERVICES = {
  ar: [
    { icon: Users,     title: 'التدريب التنفيذي والقيادي',         desc: 'برامج متكاملة لتطوير القادة والمدراء على المستوى التنفيذي.' },
    { icon: Target,    title: 'التوجيه والإرشاد التنفيذي',          desc: 'جلسات فردية وجماعية لدعم القادة في مواجهة تحدياتهم.' },
    { icon: BarChart2, title: 'الاستشارات المؤسسية',               desc: 'حلول شاملة لتطوير الهياكل التنظيمية وتحسين الأداء.' },
    { icon: Lightbulb, title: 'تطوير الكفاءات والتقييمات',          desc: 'أدوات علمية لقياس الكفاءات وبناء خرائط التطوير.' },
    { icon: TrendingUp,title: 'استراتيجيات النمو والتحول',          desc: 'مرافقة مؤسسية في رحلات التحول وتحقيق الأهداف الاستراتيجية.' },
    { icon: Shield,    title: 'الأدوات الرقمية للتطوير',            desc: 'مقاييس ونماذج رقمية متخصصة للتطوير القيادي والمؤسسي.' },
  ],
  en: [
    { icon: Users,     title: 'Executive & Leadership Training',    desc: 'Comprehensive programs to develop executives and leaders at all levels.' },
    { icon: Target,    title: 'Executive Coaching & Mentoring',     desc: 'Individual and group sessions to support leaders through their challenges.' },
    { icon: BarChart2, title: 'Institutional Consulting',           desc: 'End-to-end solutions to develop org structures and improve performance.' },
    { icon: Lightbulb, title: 'Competency Development & Assessments', desc: 'Scientific tools to measure competencies and build development roadmaps.' },
    { icon: TrendingUp,title: 'Growth & Transformation Strategies', desc: 'Organizational accompaniment through transformation and strategic goal achievement.' },
    { icon: Shield,    title: 'Digital Development Tools',          desc: 'Specialized digital assessments and frameworks for leadership development.' },
  ],
};

const WHO_WE_SERVE = {
  ar: [
    { icon: Users,     label: 'القادة التنفيذيون والمدراء' },
    { icon: Star,      label: 'أعضاء مجالس الإدارة' },
    { icon: TrendingUp,label: 'القادة الناشئون' },
    { icon: BookOpen,  label: 'المتخصصون والمهنيون' },
    { icon: Building2, label: 'الشركات والمؤسسات' },
    { icon: Shield,    label: 'الجهات الحكومية وشبه الحكومية' },
    { icon: Target,    label: 'إدارات الموارد البشرية' },
    { icon: Globe,     label: 'المنظمات غير الربحية' },
  ],
  en: [
    { icon: Users,     label: 'Executives & Senior Managers' },
    { icon: Star,      label: 'Board Members & Directors' },
    { icon: TrendingUp,label: 'Emerging & High-Potential Leaders' },
    { icon: BookOpen,  label: 'Professionals & Specialists' },
    { icon: Building2, label: 'Companies & Corporations' },
    { icon: Shield,    label: 'Government & Semi-Government' },
    { icon: Target,    label: 'HR Departments' },
    { icon: Globe,     label: 'Non-Profit Organizations' },
  ],
};

const ACCREDITATIONS = [
  'Harrison Assessments', 'NCDA', 'ICF Coaching', 'CliftonStrengths',
  'DISC Behavioral', 'PMP Certified', 'Kaizen Institute', 'ATD Member',
  'Saville Assessment', 'EQ-i 2.0', 'TKI Conflict', 'GCF Facilitation',
];

const IMPACT_STATS = [
  { ar: '+٤,٧٠٠', en: '+4,700', label: { ar: 'ساعة تدريب واستشارة',   en: 'Coaching & Consulting Hours' } },
  { ar: '+٢٠٠',   en: '+200',   label: { ar: 'قائد وتنفيذي',            en: 'Executives & Leaders' } },
  { ar: '+٣٥,٠٠٠',en: '+35,000',label: { ar: 'مدرَّب ومستفيد',          en: 'Trainees & Beneficiaries' } },
  { ar: '+١٥٠',   en: '+150',   label: { ar: 'مشروع منجز',              en: 'Projects Delivered' } },
  { ar: '+٨٧',    en: '+87',    label: { ar: 'شراكة استراتيجية',        en: 'Strategic Partnerships' } },
  { ar: '+٥٥٠',   en: '+550',   label: { ar: 'محتوى تدريبي قيادي',     en: 'Leadership Training Modules' } },
];

const WHY_US = {
  ar: [
    { icon: Award,     title: 'ملكية فكرية حصرية',         desc: 'منهجية ROUTE° المسجلة كإطار استشاري متكامل لا مثيل له في المنطقة.' },
    { icon: Globe,     title: 'خبرة تنفيذية في الخليج',    desc: 'أكثر من ١٥ عاماً من العمل الميداني مع مؤسسات حكومية وخاصة كبرى.' },
    { icon: Shield,    title: 'اعتمادات دولية موثوقة',     desc: 'فريقنا يحمل أكثر من ١٢ اعتماداً دولياً من أعرق الجهات العالمية.' },
    { icon: Target,    title: 'حلول عملية وقابلة للقياس', desc: 'كل تدخل مبني على مؤشرات قياس واضحة ونتائج موثقة ومُراجَعة.' },
  ],
  en: [
    { icon: Award,     title: 'Exclusive Intellectual Property', desc: 'The proprietary ROUTE° methodology — a fully integrated consulting framework unique to the region.' },
    { icon: Globe,     title: 'Proven GCC Executive Experience',  desc: '15+ years of hands-on work with major government and private sector organizations.' },
    { icon: Shield,    title: 'Trusted International Accreditations', desc: 'Our team holds 12+ international accreditations from the world\'s most respected bodies.' },
    { icon: Target,    title: 'Practical, Measurable Solutions', desc: 'Every intervention is built on clear KPIs, documented outcomes, and peer-reviewed results.' },
  ],
};

const VALUES = {
  ar: [
    { num: '01', title: 'التمكين',         desc: 'نخلق بيئات تُطلق الإمكانات الكاملة للأفراد والمؤسسات وتمنحهم أدوات النمو الحقيقي.' },
    { num: '02', title: 'الابتكار',        desc: 'نقدم حلولاً إبداعية واستشرافية تتجاوز الأساليب التقليدية وتُحدث تغييراً ملموساً ومستداماً.' },
    { num: '03', title: 'النمو المستدام',  desc: 'النجاح الحقيقي هو الذي يمتد مع الزمن — نبني مع شركائنا منظومات قادرة على الازدهار طويل المدى.' },
  ],
  en: [
    { num: '01', title: 'Empowerment',      desc: 'We create environments that unlock the full potential of individuals and organizations, giving them real tools for growth.' },
    { num: '02', title: 'Innovation',       desc: 'We deliver creative, forward-thinking solutions that transcend convention and drive meaningful, lasting change.' },
    { num: '03', title: 'Sustainable Growth', desc: 'True success endures over time — we build with our partners systems capable of long-term flourishing.' },
  ],
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function Home() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen font-body" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#111827' }}>
      <CorpNavbar />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0D1F33 0%, #111827 55%, #0a1628 100%)' }} />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-1/3 end-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]" style={{ background: '#05E1AE' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24">
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

            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              {lang === 'ar'
                ? 'أوبتيفانس شريكك الاستراتيجي في الاستشارات المؤسسية والتدريب التنفيذي وتطوير الأداء — مبنيّاً على القياس والأثر الحقيقي، مع أكثر من ١٥ عاماً من النتائج الموثقة في دول مجلس التعاون الخليجي.'
                : 'OPTIVANCE is your strategic partner in organizational consulting, executive coaching, and performance development — built on measurement and real impact, with 15+ years of documented results across the GCC.'}
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              <Link to="/consultation" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-heading font-bold text-sm transition-all" style={{ background: '#05E1AE', color: '#0D1F33' }}>
                {lang === 'ar' ? 'طلب استشارة مجانية' : 'Request Free Consultation'} <Arrow size={15} />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-heading font-bold text-sm transition-all border border-white/20 text-white hover:bg-white/5">
                {lang === 'ar' ? 'تصفح خدماتنا' : 'Explore Our Services'} <Arrow size={15} />
              </Link>
            </div>

            {/* Trust mini-row */}
            <div className="flex flex-wrap items-center gap-5">
              {[
                lang === 'ar' ? '+١٥ عاماً خبرة' : '15+ Years Experience',
                lang === 'ar' ? '+٣٥,٠٠٠ مستفيد' : '35,000+ Beneficiaries',
                lang === 'ar' ? '١٢+ اعتماداً دولياً' : '12+ Accreditations',
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle size={13} style={{ color: '#05E1AE' }} />
                  <span className="text-white/50 text-xs">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 animate-bounce">
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════ */}
      <section style={{ background: '#0D1F33', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-heading font-black text-3xl md:text-4xl mb-1" style={{ color: '#05E1AE' }}>{s[lang]}</div>
              <div className="text-white/50 text-xs">{s.label[lang]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ROUTE METHODOLOGY
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'منهجيتنا الحصرية' : 'Our Exclusive Methodology'}
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">
              {lang === 'ar' ? 'منهجية ROUTE°' : 'The ROUTE° Methodology'}
            </h2>
            <p className="text-white/45 text-base max-w-2xl mx-auto leading-relaxed">
              {lang === 'ar'
                ? 'إطار استشاري حصري طوّرناه عبر سنوات من العمل الميداني — يأخذ القادة والمؤسسات من الوعي الذاتي إلى التحول المستدام.'
                : 'A proprietary consulting framework developed over years of field work — guiding leaders and organizations from self-awareness to sustainable transformation.'}
            </p>
          </div>

          {/* 5 cards */}
          <div className="grid grid-cols-5 gap-3 mb-8">
            {ROUTE_STEPS.map((step, i) => (
              <div key={i} className="rounded-2xl p-5 text-center transition-all hover:scale-105 hover:border-brand-accent/40 cursor-default"
                style={{ background: '#1a2535', border: '1px solid rgba(5,225,174,0.12)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(5,225,174,0.1)', border: '1px solid rgba(5,225,174,0.2)' }}>
                  <span className="font-heading font-black text-2xl" style={{ color: '#05E1AE' }}>{step.letter}</span>
                </div>
                <div className="font-heading font-bold text-white text-xs mb-1">{step.word}</div>
                <div className="text-white/40 text-xs leading-snug">{step[lang].title}</div>
              </div>
            ))}
          </div>

          {/* Expandable detail — all 5 steps brief */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
            {ROUTE_STEPS.map((step, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(5,225,174,0.04)', border: '1px solid rgba(5,225,174,0.08)' }}>
                <div className="font-heading font-bold text-xs mb-2" style={{ color: '#05E1AE' }}>{step.letter} — {step[lang].title}</div>
                <p className="text-white/40 text-xs leading-relaxed">{step[lang].desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <Link to="/methodology" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all" style={{ borderColor: 'rgba(5,225,174,0.3)', color: '#05E1AE' }}>
              {lang === 'ar' ? 'اكتشف المنهجية كاملة' : 'Explore Full Methodology'} <Arrow size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#0D1F33' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'خدماتنا' : 'Our Services'}
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">
              {lang === 'ar' ? 'حلول القيادة والاستشارات المتكاملة' : 'Integrated Leadership & Consulting Solutions'}
            </h2>
            <p className="text-white/45 text-base max-w-xl mx-auto">
              {lang === 'ar'
                ? 'ست مجالات متكاملة تغطي كل ما تحتاجه المؤسسات والقادة لتحقيق النمو والتحول.'
                : 'Six integrated areas covering everything organizations and leaders need to achieve growth and transformation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {SERVICES[lang].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="rounded-2xl p-6 transition-all hover:scale-[1.02] hover:border-white/15 cursor-default"
                  style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(5,225,174,0.1)' }}>
                      <Icon size={18} style={{ color: '#05E1AE' }} />
                    </div>
                    <span className="text-white/20 font-mono text-xs">0{i + 1}</span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm mb-2 leading-snug">{s.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all" style={{ background: '#05E1AE', color: '#0D1F33' }}>
              {lang === 'ar' ? 'تفاصيل جميع الخدمات' : 'View All Services'} <Arrow size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          IMPACT NUMBERS
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: '#111827' }}>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'أثرنا' : 'Our Impact'}
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">
              {lang === 'ar' ? 'أرقام تروي قصتنا' : 'Numbers That Tell Our Story'}
            </h2>
            <p className="text-white/45 text-base max-w-lg mx-auto">
              {lang === 'ar'
                ? 'كل رقم خلفه فريق حقيقي، ومؤسسة تحوّلت، وقائد اكتشف إمكاناته.'
                : 'Behind every number is a real team, a transformed organization, and a leader who discovered their potential.'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {IMPACT_STATS.map((s, i) => (
              <div key={i} className="rounded-2xl p-6 text-center transition-all hover:border-white/12"
                style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-heading font-black text-3xl md:text-4xl mb-2" style={{ color: '#05E1AE' }}>{s[lang]}</div>
                <div className="text-white/50 text-xs leading-snug">{s.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO WE SERVE
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#0D1F33' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'من نخدم' : 'Who We Serve'}
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">
              {lang === 'ar' ? 'نخدم القادة والمؤسسات في جميع القطاعات' : 'Serving Leaders & Organizations Across All Sectors'}
            </h2>
            <p className="text-white/45 text-base max-w-xl mx-auto">
              {lang === 'ar'
                ? 'سواء كنت فرداً يسعى للتطوير أو مؤسسة تبحث عن التحول — أوبتيفانس معك.'
                : 'Whether you\'re an individual seeking growth or an organization pursuing transformation — OPTIVANCE is with you.'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {WHO_WE_SERVE[lang].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl transition-all hover:border-brand-accent/20"
                  style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(5,225,174,0.08)' }}>
                    <Icon size={14} style={{ color: '#05E1AE' }} />
                  </div>
                  <span className="text-white/70 text-xs font-medium leading-snug">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY US
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'ما الذي يميزنا' : 'What Distinguishes Us'}
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">
              {lang === 'ar' ? 'لماذا أوبتيفانس؟' : 'Why OPTIVANCE?'}
            </h2>
            <p className="text-white/45 text-base max-w-xl mx-auto">
              {lang === 'ar'
                ? 'ليس مجرد اختيار للاستشارة — بل شراكة استراتيجية مبنية على الأثر الحقيقي.'
                : "It's not just a consulting choice — it's a strategic partnership built on real impact."}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {WHY_US[lang].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-2xl p-6 transition-all hover:border-white/12"
                  style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(5,225,174,0.1)', border: '1px solid rgba(5,225,174,0.15)' }}>
                    <Icon size={18} style={{ color: '#05E1AE' }} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm leading-snug mb-2">{item.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#0D1F33' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'قيمنا الجوهرية' : 'Our Core Values'}
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">
              {lang === 'ar' ? 'المبادئ التي تشكّل هويتنا' : 'The Principles That Shape Our Identity'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUES[lang].map((v, i) => (
              <div key={i} className="rounded-2xl p-8 transition-all hover:border-white/12"
                style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-heading font-black text-5xl mb-5" style={{ color: '#05E1AE', opacity: 0.18 }}>{v.num}</div>
                <h3 className="font-heading font-black text-white text-xl mb-3">{v.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ACCREDITATIONS
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'الاعتمادات المهنية' : 'Professional Accreditations'}
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">
              {lang === 'ar' ? 'شهادات دولية يحملها فريقنا' : 'International Certifications Held by Our Team'}
            </h2>
            <p className="text-white/45 text-base max-w-xl mx-auto">
              {lang === 'ar'
                ? 'فريقنا مسلّح باعتمادات من أعرق المؤسسات الأكاديمية والمهنية العالمية.'
                : "Our team is equipped with accreditations from the world's most respected academic and professional bodies."}
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {ACCREDITATIONS.map((name, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:border-brand-accent/20"
                style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black"
                  style={{ background: 'rgba(5,225,174,0.1)', color: '#05E1AE' }}>
                  {name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                </div>
                <span className="text-white/50 text-xs leading-tight">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: '#0D1F33' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at center, #1A3A5C 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-accent/25 bg-brand-accent/8 mb-6">
            <Zap size={12} style={{ color: '#05E1AE' }} />
            <span className="text-brand-accent text-xs font-medium">
              {lang === 'ar' ? 'ابدأ رحلتك اليوم' : 'Start Your Journey Today'}
            </span>
          </div>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-white mb-5">
            {lang === 'ar' ? 'جاهز للخطوة القادمة؟' : 'Ready for the Next Step?'}
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-lg mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'شاركنا تحدياتك وأهدافك، وسنبني معك الحل الاستراتيجي الأمثل — مخصص لك تماماً.'
              : "Share your challenges and goals, and we'll build the optimal strategic solution together — fully tailored to you."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/consultation" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-sm transition-all" style={{ background: '#05E1AE', color: '#0D1F33' }}>
              {lang === 'ar' ? 'طلب استشارة مجانية' : 'Request Free Consultation'} <Arrow size={15} />
            </Link>
            <Link to="/store" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-sm border transition-all text-white border-white/20 hover:bg-white/5">
              {lang === 'ar' ? 'تصفح المتجر الرقمي' : 'Browse Digital Store'} <Arrow size={15} />
            </Link>
          </div>
        </div>
      </section>

      <CorpFooter />
    </div>
  );
}