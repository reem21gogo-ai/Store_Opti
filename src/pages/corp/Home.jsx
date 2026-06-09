import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import {
  ArrowRight, ArrowLeft, ChevronDown, Users, Target, BarChart2,
  Lightbulb, TrendingUp, BookOpen, Building2, Globe, Shield,
  CheckCircle, Zap, Star, Brain, Compass, Layers, Activity,
  Anchor, Wrench
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';
import RouteInfographic from '@/components/corp/RouteInfographic';

// ─── ANIMATION HELPERS ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} className={className}
      variants={variants} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function CountUp({ target, inView }) {
  const [val, setVal] = React.useState(0);
  const num = parseInt(target.replace(/\D/g, ''));
  const suffix = target.replace(/[0-9]/g, '');
  React.useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setVal(num); clearInterval(timer); }
      else setVal(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, num]);
  return <>{val}{suffix}</>;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: Building2, en: { title: 'Organizational Consulting', desc: 'Strategic advisory support to help organizations understand their current state, define direction, and implement effective change.' }, ar: { title: 'الاستشارات المؤسسية', desc: 'دعم استراتيجي لمساعدة المؤسسات على فهم واقعها وتحديد اتجاهها وتنفيذ التغيير الفعّال.' } },
  { icon: Target,    en: { title: 'Executive Coaching',        desc: 'One-on-one coaching journeys designed for senior leaders who want to grow, lead more effectively, and navigate complexity.' },         ar: { title: 'التوجيه التنفيذي',      desc: 'رحلات تدريب فردية مصممة للقادة الكبار الراغبين في النمو والقيادة الأكثر فاعلية.' } },
  { icon: TrendingUp,en: { title: 'Leadership Development',   desc: 'Structured programs and learning journeys that build leadership capability at all levels of the organization.' },                     ar: { title: 'تطوير القيادة',          desc: 'برامج منظمة ورحلات تعلّم تبني الكفاءة القيادية على جميع مستويات المؤسسة.' } },
  { icon: Layers,    en: { title: 'Capability Building',       desc: 'Targeted development programs that strengthen specific competencies, skills, and behavioral capabilities across teams.' },             ar: { title: 'بناء القدرات',           desc: 'برامج تطوير مستهدفة تعزز الكفاءات والمهارات والسلوكيات عبر الفرق والوظائف.' } },
  { icon: BookOpen,  en: { title: 'Learning Journey Design',  desc: 'End-to-end design of learning experiences, development programs, and capability curriculums tailored to your context.' },             ar: { title: 'تصميم مسارات التعلم',   desc: 'تصميم شامل لتجارب التعلم وبرامج التطوير والمناهج المصممة وفق سياقك المؤسسي.' } },
  { icon: BarChart2, en: { title: 'Competency Assessment',    desc: 'Structured assessments that measure individual and team competencies to identify strengths and gaps.' },                               ar: { title: 'تقييم الكفاءات',         desc: 'تقييمات منظمة تقيس كفاءات الأفراد والفرق لتحديد نقاط القوة ومجالات التطوير.' } },
];

const WHO_WE_SERVE = [
  { icon: Star,      en: { title: 'Executives & CEOs',    desc: 'Strategic clarity, executive coaching, and leadership effectiveness.' },           ar: { title: 'المديرون التنفيذيون',  desc: 'الوضوح الاستراتيجي، التدريب التنفيذي، وفاعلية القيادة.' } },
  { icon: Users,     en: { title: 'Leaders & Managers',   desc: 'Leadership development, team performance, and people management.' },              ar: { title: 'القادة والمدراء',       desc: 'تطوير القيادة، أداء الفريق، وإدارة الأفراد.' } },
  { icon: BookOpen,  en: { title: 'Professionals',         desc: 'Career clarity, competency development, and professional growth.' },              ar: { title: 'المهنيون',               desc: 'وضوح المسار، تطوير الكفاءات، والنمو المهني.' } },
  { icon: Lightbulb, en: { title: 'Entrepreneurs',         desc: 'Business strategy, organizational design, and growth consulting.' },              ar: { title: 'رواد الأعمال',           desc: 'استراتيجية الأعمال، التصميم المؤسسي، واستشارات النمو.' } },
  { icon: Target,    en: { title: 'HR Departments',        desc: 'Talent development, assessment frameworks, and capability building.' },           ar: { title: 'إدارات الموارد البشرية', desc: 'تطوير المواهب، أطر التقييم، وبناء القدرات.' } },
  { icon: Activity,  en: { title: 'Teams & Groups',        desc: 'Team effectiveness, collaboration tools, and performance programs.' },            ar: { title: 'الفرق والمجموعات',      desc: 'فاعلية الفريق، أدوات التعاون، وبرامج الأداء.' } },
  { icon: Building2, en: { title: 'Organizations',         desc: 'Organizational transformation, culture development, and change management.' },   ar: { title: 'المؤسسات',               desc: 'التحول المؤسسي، تطوير الثقافة، وإدارة التغيير.' } },
  { icon: Globe,     en: { title: 'Government Entities',   desc: 'Public sector consulting, capability programs, and leadership development.' },    ar: { title: 'الجهات الحكومية',        desc: 'استشارات القطاع العام، برامج القدرات، وتطوير القيادة.' } },
];

const WHY_US = [
  { num: '01', icon: Compass,   en: { title: 'Strategic Approach',  desc: 'Every engagement starts with understanding your reality before prescribing solutions.' },           ar: { title: 'المنهج الاستراتيجي', desc: 'كل تعاون يبدأ بفهم واقعك قبل وصف الحلول.' } },
  { num: '02', icon: Users,     en: { title: 'Human-Centered',       desc: 'We work with people, not just processes. Real development requires human understanding.' },         ar: { title: 'محورية الإنسان',      desc: 'نعمل مع الناس وليس فقط مع العمليات. التطوير الحقيقي يتطلب فهماً بشرياً.' } },
  { num: '03', icon: Wrench,    en: { title: 'Practical Tools',      desc: 'Our assessments, templates, and frameworks are designed for real-world application.' },             ar: { title: 'أدوات عملية',          desc: 'تقييماتنا ونماذجنا وأطرنا مصممة للتطبيق الفعلي في بيئات العمل.' } },
  { num: '04', icon: BarChart2, en: { title: 'Measurement-First',   desc: 'We define success metrics upfront and track impact throughout the journey.' },                       ar: { title: 'القياس أولاً',         desc: 'نحدد مقاييس النجاح مسبقاً ونتتبع الأثر طوال مسيرة العمل.' } },
  { num: '05', icon: Zap,       en: { title: 'Digital Enablement',   desc: 'Our digital products extend consulting value beyond sessions and workshops.' },                     ar: { title: 'التمكين الرقمي',       desc: 'منتجاتنا الرقمية تمتد بقيمة الاستشارة إلى ما بعد الجلسات والورش.' } },
  { num: '06', icon: Layers,    en: { title: 'Tailored Design',      desc: 'No two organizations are the same. Every solution is built for your specific context.' },           ar: { title: 'التصميم المخصص',       desc: 'لا توجد مؤسستان متشابهتان. كل حل مبني لسياقك الخاص تحديداً.' } },
];

const ROUTE_STEPS = [
  { letter: 'R', word: 'Reflect', icon: Brain,      en: 'Self-awareness & insight',                  ar: 'الوعي الذاتي والبصيرة' },
  { letter: 'O', word: 'Orient',  icon: Compass,    en: 'Strategic direction & clarity',             ar: 'الاتجاه الاستراتيجي والوضوح' },
  { letter: 'U', word: 'Upskill', icon: TrendingUp, en: 'Capability & skill building',              ar: 'بناء القدرات والمهارات' },
  { letter: 'T', word: 'Track',   icon: Activity,   en: 'Continuous progress monitoring',            ar: 'متابعة التقدم باستمرار' },
  { letter: 'E', word: 'Embed',   icon: Anchor,     en: 'Sustainable change & cultural integration', ar: 'التغيير المستدام والاندماج الثقافي' },
];

const FEATURED_PRODUCTS = [
  { tag: { en: 'Assessment', ar: 'تقييم' }, badge: { en: 'Featured', ar: 'مميز' }, badgeColor: '#05E1AE', en: { title: 'Leadership Competency Assessment', desc: 'Measure your leadership competencies and receive a personalized development report.' }, ar: { title: 'مقياس الكفاءات القيادية', desc: 'قِس كفاءاتك القيادية واحصل على تقرير تطوير شخصي.' }, price: { en: '199 SAR', ar: '١٩٩ ر.س' } },
  { tag: { en: 'Template', ar: 'نموذج' },   badge: { en: 'Free', ar: 'مجاني' },    badgeColor: '#336fa3', en: { title: 'Career Clarity Workbook', desc: 'A structured workbook to help you define your professional direction and goals.' },          ar: { title: 'كتاب وضوح المسار المهني', desc: 'كتاب عمل منظم يساعدك على تحديد اتجاهك ومسارك المهني.' },           price: { en: 'Free', ar: 'مجاني' } },
  { tag: { en: 'Tool', ar: 'أداة' },         badge: { en: 'New', ar: 'جديد' },      badgeColor: '#3a9abf', en: { title: 'Team Performance Diagnostic', desc: "Evaluate your team's performance dynamics and identify key development areas." },         ar: { title: 'تشخيص أداء الفريق', desc: 'قيّم ديناميكيات أداء فريقك وحدد مجالات التطوير الرئيسية.' },             price: { en: '299 SAR', ar: '٢٩٩ ر.س' } },
];

const ROUTE_COLORS = ['#05E1AE', '#3a9abf', '#336fa3', '#5bbdd6', '#2ec9a0'];

// ─── STAT CARD WITH COUNTUP ──────────────────────────────────────────────────
function StatCard({ value, label, color, Icon, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-6 text-center" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
      <Icon size={20} className="mx-auto mb-2" style={{ color }} />
      <div className="font-heading font-black text-4xl mb-1" style={{ color }}>
        <CountUp target={value} inView={inView} />
      </div>
      <div className="text-white/45 text-xs">{label}</div>
    </motion.div>
  );
}

// ─── ANIMATED BAR ────────────────────────────────────────────────────────────
function AnimBar({ label, pct, color, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className="mb-2.5 last:mb-0">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/60">{label}</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div className="h-full rounded-full"
          initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
      </div>
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function Home() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen font-body" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#111827' }}>
      <CorpNavbar />

      {/* ══ 1. HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0D1F33 0%, #111827 60%, #0a1628 100%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(5,225,174,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,225,174,1) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        <div className="absolute top-1/3 end-1/5 w-[600px] h-[600px] rounded-full opacity-8 blur-[120px]" style={{ background: '#05E1AE' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8" style={{ background: 'rgba(5,225,174,0.08)', border: '1px solid rgba(5,225,174,0.22)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#05E1AE' }} />
              <span className="text-xs font-semibold" style={{ color: '#05E1AE' }}>
                {lang === 'ar' ? 'الاستشارات الاستراتيجية وتطوير القيادة' : 'Strategic Consulting & Leadership Development'}
              </span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22,1,0.36,1] }}
            className="font-heading font-black leading-tight mb-6 max-w-3xl" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#fff' }}>
            {lang === 'ar'
              ? <><span style={{ color: '#05E1AE' }}>وضوح.</span> نمو. <span style={{ color: '#05E1AE' }}>تأثير.</span></>
              : <><span style={{ color: '#05E1AE' }}>Clarity.</span> Growth. <span style={{ color: '#05E1AE' }}>Impact.</span></>}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
            {lang === 'ar'
              ? 'أوبتيفانس تساعد القادة والفرق والمؤسسات على تحقيق تحوّل قابل للقياس من خلال الاستشارات الاستراتيجية والتدريب التنفيذي وأدوات التقييم والحلول الرقمية للتطوير.'
              : 'OPTIVANCE helps leaders, teams, and organizations achieve measurable transformation through strategic consulting, executive coaching, assessment tools, and digital development solutions.'}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-16">
            <Link to="/consultation" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90" style={{ background: '#05E1AE', color: '#0D1F33' }}>
              {lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'} <Arrow size={15} />
            </Link>
            <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-heading font-bold text-sm border text-white transition-all hover:bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              {lang === 'ar' ? 'استكشف المتجر الرقمي' : 'Explore Digital Store'} <Arrow size={15} />
            </Link>
          </motion.div>

          {/* Hero stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {[
              { value: '200+', label: { ar: 'قائد تم تدريبه', en: 'Leaders Coached' }, icon: Users },
              { value: '85+',  label: { ar: 'مؤسسة', en: 'Organizations' },             icon: Building2 },
              { value: '95%',  label: { ar: 'رضا العملاء', en: 'Client Satisfaction' }, icon: Star },
              { value: '12+',  label: { ar: 'سنة خبرة', en: 'Years Experience' },       icon: Shield },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                  className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon size={16} className="mx-auto mb-2" style={{ color: '#05E1AE' }} />
                  <div className="font-heading font-black text-2xl text-white mb-0.5">{s.value}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label[lang]}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/25">
          <span className="text-xs">{lang === 'ar' ? 'اكتشف المزيد' : 'Scroll to discover'}</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ══ 2. WHO WE ARE ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#0D1F33' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <FadeIn direction="right">
              <div className="relative rounded-3xl overflow-hidden mb-8" style={{ height: '320px' }}>
                <img src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&auto=format&fit=crop&q=80" alt="Executive consulting" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,31,51,0.85) 0%, transparent 55%)' }} />
                <div className="absolute bottom-5 start-5 flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(13,31,51,0.85)', border: '1px solid rgba(5,225,174,0.25)', backdropFilter: 'blur(10px)' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(5,225,174,0.15)' }}>
                    <CheckCircle size={15} style={{ color: '#05E1AE' }} />
                  </div>
                  <div>
                    <div className="font-heading font-black text-white text-sm">15+</div>
                    <div className="text-white/50 text-xs">{lang === 'ar' ? 'سنة من الخبرة الميدانية' : 'Years of Field Experience'}</div>
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>{lang === 'ar' ? 'من نحن' : 'Who We Are'}</p>
              <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-5 leading-tight">
                {lang === 'ar' ? 'شركة استشارية مبنية للأثر الحقيقي' : 'A Consulting Firm Built for Real Impact'}
              </h2>
              <p className="text-white/55 text-base leading-relaxed mb-8">
                {lang === 'ar'
                  ? 'أوبتيفانس تجمع بين خبرة التطوير البشري والاستشارات الاستراتيجية والأدوات الرقمية لمساعدة عملائها على فهم واقعهم واتخاذ قرارات أفضل وتحقيق إجراءات ذات معنى.'
                  : 'OPTIVANCE combines human development expertise, strategic consulting, and digital tools to help clients understand their reality, make better decisions, and take meaningful action.'}
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-sm font-semibold transition-all" style={{ color: '#05E1AE' }}>
                {lang === 'ar' ? 'اعرف المزيد عنّا' : 'Learn More About Us'} <Arrow size={14} />
              </Link>
            </FadeIn>

            {/* Right: stats + bars */}
            <FadeIn direction="left" delay={0.15}>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '200+', label: { ar: 'قائد تم تدريبه', en: 'Leaders Coached' },     color: '#05E1AE', icon: Users },
                    { value: '85+',  label: { ar: 'مؤسسة خدمناها', en: 'Organizations Served' }, color: '#3a9abf', icon: Building2 },
                    { value: '95%',  label: { ar: 'رضا العملاء',   en: 'Client Satisfaction' },  color: '#336fa3', icon: Star },
                    { value: '12+',  label: { ar: 'سنة من الخبرة', en: 'Years of Experience' },  color: '#5bbdd6', icon: Shield },
                  ].map((s, i) => (
                    <StatCard key={i} value={s.value} label={s.label[lang]} color={s.color} Icon={s.icon} delay={i * 0.1} />
                  ))}
                </div>
                {/* Animated bars */}
                <div className="rounded-2xl p-5" style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-white/50 text-xs mb-4">{lang === 'ar' ? 'توزيع الخدمات' : 'Service Distribution'}</div>
                  <AnimBar label={lang === 'ar' ? 'تطوير القيادة' : 'Leadership Development'} pct={42} color="#05E1AE" delay={0.1} />
                  <AnimBar label={lang === 'ar' ? 'الاستشارات المؤسسية' : 'Org Consulting'}   pct={31} color="#3a9abf" delay={0.25} />
                  <AnimBar label={lang === 'ar' ? 'بناء القدرات' : 'Capability Building'}      pct={27} color="#336fa3" delay={0.4} />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ 3. SERVICES ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>{lang === 'ar' ? 'خدماتنا' : 'Our Services'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">{lang === 'ar' ? 'حلول استشارية متكاملة' : 'Comprehensive Consulting Solutions'}</h2>
            <p className="text-white/45 text-base max-w-xl mx-auto">
              {lang === 'ar' ? 'من الاستراتيجية المؤسسية إلى التدريب الفردي، نصمم حلولاً مخصصة تُحدث أثراً دائماً.' : 'From organizational strategy to individual coaching, we design tailored solutions that create lasting impact.'}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              const content = s[lang];
              return (
                <FadeIn key={i} delay={i * 0.07} direction="up">
                  <motion.div whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(5,225,174,0.08)' }}
                    className="rounded-2xl p-6 cursor-default h-full"
                    style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: 'rgba(5,225,174,0.1)', border: '1px solid rgba(5,225,174,0.15)' }}>
                      <Icon size={18} style={{ color: '#05E1AE' }} />
                    </div>
                    <h3 className="font-heading font-bold text-white text-sm mb-2 leading-snug">{content.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{content.desc}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn className="flex justify-center">
            <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90" style={{ background: '#05E1AE', color: '#0D1F33' }}>
              {lang === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'} <Arrow size={14} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ══ 4. WHO WE SERVE ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#0D1F33' }}>
        <div className="max-w-6xl mx-auto">
          {/* Photo strip */}
          <FadeIn>
            <div className="grid grid-cols-3 gap-3 mb-14" style={{ height: '220px' }}>
              {[
                { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=80', label: { ar: 'ورش عمل', en: 'Workshops' } },
                { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=80',   label: { ar: 'جلسات تدريب', en: 'Coaching Sessions' } },
                { src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&auto=format&fit=crop&q=80',  label: { ar: 'استشارات', en: 'Consulting' } },
              ].map((ph, i) => (
                <motion.div key={i} className="relative overflow-hidden rounded-2xl" whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                  <img src={ph.src} alt={ph.label.en} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'rgba(13,31,51,0.4)' }} />
                  <div className="absolute bottom-3 start-3 text-white font-heading font-bold text-xs">{ph.label[lang]}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          <FadeIn className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>{lang === 'ar' ? 'من نخدم' : 'Who We Serve'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">{lang === 'ar' ? 'مبني للقادة في كل المستويات' : 'Built for Leaders at Every Level'}</h2>
            <p className="text-white/45 text-base max-w-xl mx-auto">
              {lang === 'ar' ? 'حلولنا مصممة للأفراد والفرق والمؤسسات في مختلف القطاعات.' : 'Our solutions are designed for individuals, teams, and entire organizations across sectors.'}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHO_WE_SERVE.map((item, i) => {
              const Icon = item.icon;
              const content = item[lang];
              return (
                <FadeIn key={i} delay={i * 0.06}>
                  <motion.div whileHover={{ y: -5, borderColor: 'rgba(5,225,174,0.25)' }}
                    className="rounded-2xl p-5 h-full"
                    style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(5,225,174,0.08)' }}>
                      <Icon size={16} style={{ color: '#05E1AE' }} />
                    </div>
                    <h3 className="font-heading font-bold text-white text-sm mb-1.5 leading-snug">{content.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{content.desc}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 5. WHY OPTIVANCE ═════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>{lang === 'ar' ? 'لماذا أوبتيفانس' : 'Why OPTIVANCE'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">{lang === 'ar' ? 'نوع مختلف من الاستشارات' : 'A Different Kind of Consulting'}</h2>
            <p className="text-white/45 text-base max-w-xl mx-auto">
              {lang === 'ar' ? 'نجمع بين الفهم الإنساني والمنهجية المنظمة لتقديم نتائج عملية وقابلة للقياس.' : 'We combine human insight with structured methodology to deliver practical, measurable results.'}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              const content = item[lang];
              return (
                <FadeIn key={i} delay={i * 0.07}>
                  <motion.div whileHover={{ y: -5 }}
                    className="rounded-2xl p-6 h-full"
                    style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(5,225,174,0.1)', border: '1px solid rgba(5,225,174,0.15)' }}>
                        <Icon size={16} style={{ color: '#05E1AE' }} />
                      </div>
                      <span className="font-heading font-black text-3xl" style={{ color: '#05E1AE', opacity: 0.18 }}>{item.num}</span>
                    </div>
                    <h3 className="font-heading font-bold text-white text-sm mb-2 leading-snug">{content.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{content.desc}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 6. ROUTE° METHOD ═════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: '#0D1F33' }}>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(5,225,174,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,225,174,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>{lang === 'ar' ? 'إطار حصري مُسجَّل' : 'Exclusive Registered Framework'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">{lang === 'ar' ? 'منهجية ROUTE°' : 'The ROUTE° Method'}</h2>
            <p className="text-white/45 text-base max-w-2xl mx-auto">
              {lang === 'ar' ? 'إطار متكامل حصري يمزج بين أفضل الممارسات العالمية والرؤى الخليجية لخلق قيمة حقيقية وأثر دائم.' : 'An exclusive integrated framework blending global best practices with Gulf-specific insights to create real value and lasting impact.'}
            </p>
          </FadeIn>

          {/* ── ROUTE Infographic: Professional Timeline ── */}
          <RouteInfographic steps={ROUTE_STEPS} colors={ROUTE_COLORS} lang={lang} />

          <FadeIn className="flex justify-center">
            <Link to="/methodology" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:opacity-80" style={{ borderColor: 'rgba(5,225,174,0.3)', color: '#05E1AE' }}>
              {lang === 'ar' ? 'اكتشف المنهجية كاملة' : 'Explore Full Methodology'} <Arrow size={13} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ══ 7. DIGITAL STORE PREVIEW ═════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#05E1AE' }}>{lang === 'ar' ? 'المتجر الرقمي' : 'Digital Store'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">{lang === 'ar' ? 'أدوات تعمل بين الجلسات' : 'Tools That Work Between Sessions'}</h2>
            <p className="text-white/45 text-base max-w-xl mx-auto">
              {lang === 'ar' ? 'تصفح مجموعتنا من التقييمات والنماذج وأدوات القيادة وموارد التطوير.' : 'Browse our collection of assessments, templates, leadership tools, and development resources.'}
            </p>
            <Link to="/store" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold" style={{ color: '#05E1AE' }}>
              {lang === 'ar' ? 'زيارة المتجر الرقمي' : 'Visit Digital Store'} <Arrow size={13} />
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_PRODUCTS.map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6, boxShadow: `0 20px 40px ${p.badgeColor}12` }}
                  className="rounded-2xl overflow-hidden h-full"
                  style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${p.badgeColor}, ${p.badgeColor}44)` }} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{p.tag[lang]}</span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${p.badgeColor}18`, color: p.badgeColor, border: `1px solid ${p.badgeColor}30` }}>{p.badge[lang]}</span>
                    </div>
                    <h3 className="font-heading font-bold text-white text-sm mb-2 leading-snug">{p[lang].title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed mb-5">{p[lang].desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-black text-base" style={{ color: '#05E1AE' }}>{p.price[lang]}</span>
                      <Link to="/store/assessments" className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all" style={{ background: 'rgba(5,225,174,0.1)', color: '#05E1AE', border: '1px solid rgba(5,225,174,0.2)' }}>
                        {lang === 'ar' ? 'عرض' : 'View'} <Arrow size={11} className="inline" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7.5 TESTIMONIAL STRIP ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: '340px' }}>
        <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1600&auto=format&fit=crop&q=80" alt="Leadership summit" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,31,51,0.92) 0%, rgba(13,31,51,0.65) 60%, rgba(13,31,51,0.85) 100%)' }} />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <FadeIn className="max-w-3xl text-center">
            <div className="text-4xl mb-4">❝</div>
            <p className="font-heading font-bold text-white text-xl md:text-2xl leading-relaxed mb-5">
              {lang === 'ar'
                ? 'أوبتيفانس لم تقدم لنا تدريباً — قدمت لنا تحولاً حقيقياً في طريقة تفكير قياداتنا وأسلوب اتخاذ قراراتنا.'
                : "OPTIVANCE didn't give us training — they gave us a real transformation in how our leaders think and make decisions."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: '2px solid rgba(5,225,174,0.4)' }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Client" className="w-full h-full object-cover" />
              </div>
              <div className="text-start">
                <div className="text-white font-heading font-bold text-sm">{lang === 'ar' ? 'م. أحمد الشمري' : 'Ahmed Al-Shammari'}</div>
                <div className="text-white/45 text-xs">{lang === 'ar' ? 'المدير التنفيذي، مجموعة الخليج للاستثمار' : 'CEO, Gulf Investment Group'}</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 8. FINAL CTA ═════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: '#0D1F33' }}>
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at center, #1A3A5C 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(5,225,174,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,225,174,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <FadeIn className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(5,225,174,0.08)', border: '1px solid rgba(5,225,174,0.22)' }}>
            <Zap size={12} style={{ color: '#05E1AE' }} />
            <span className="text-xs font-medium" style={{ color: '#05E1AE' }}>{lang === 'ar' ? 'ابدأ رحلة تطورك' : 'Start Your Development Journey'}</span>
          </div>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-white mb-5 leading-tight">
            {lang === 'ar' ? 'جاهز للبدء؟' : 'Ready to Start Your Development Journey?'}
          </h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            {lang === 'ar'
              ? 'تحدث مع فريقنا حول كيف يمكن لأوبتيفانس مساعدتك على تحقيق الوضوح والنمو والأثر القابل للقياس.'
              : 'Talk to our team about how OPTIVANCE can help you achieve clarity, growth, and measurable impact.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/consultation" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90" style={{ background: '#05E1AE', color: '#0D1F33' }}>
              {lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'} <Arrow size={15} />
            </Link>
            <Link to="/store" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-sm border text-white transition-all hover:bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              {lang === 'ar' ? 'استكشف المتجر الرقمي' : 'Explore Digital Store'} <Arrow size={15} />
            </Link>
          </div>
        </FadeIn>
      </section>

      <CorpFooter />
    </div>
  );
}