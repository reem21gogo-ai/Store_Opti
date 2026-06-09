import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, ArrowLeft, Zap, Users, Target, TrendingUp, CheckCircle, Play, ChevronDown } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const floatingAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  }
};

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const t = translations.nav;

  const stats = [
    { ar: { label: 'مؤسسة وشركة استفادت', value: 500, suffix: '+' }, en: { label: 'Organizations Transformed', value: 500, suffix: '+' } },
    { ar: { label: 'قائد وموظف طوّرنا قدراتهم', value: 12000, suffix: '+' }, en: { label: 'Professionals Developed', value: 12000, suffix: '+' } },
    { ar: { label: 'سنة من الخبرة المتراكمة', value: 15, suffix: '+' }, en: { label: 'Years of Excellence', value: 15, suffix: '+' } },
    { ar: { label: 'معدل رضا العملاء', value: 98, suffix: '%' }, en: { label: 'Client Satisfaction', value: 98, suffix: '%' } },
  ];

  const services = [
    { ar: 'استشارات تنظيمية', en: 'Organizational Consulting', icon: '🏢' },
    { ar: 'تطوير القيادة', en: 'Leadership Development', icon: '👑' },
    { ar: 'بناء الفريق', en: 'Team Building', icon: '👥' },
    { ar: 'تحول ثقافي', en: 'Cultural Transformation', icon: '🌈' },
    { ar: 'تقييم الكفاءات', en: 'Competency Assessment', icon: '📊' },
    { ar: 'تدريب مخصص', en: 'Customized Training', icon: '🎯' },
  ];

  const routeSteps = [
    { ar: { title: 'التأمل (Reflect)', desc: 'فهم واقعك الحالي بعمق' }, en: { title: 'Reflect', desc: 'Understanding your current reality deeply' } },
    { ar: { title: 'التوجيه (Orient)', desc: 'تحديد الاتجاه المستقبلي' }, en: { title: 'Orient', desc: 'Defining your future direction' } },
    { ar: { title: 'التطوير (Upskill)', desc: 'بناء المهارات المطلوبة' }, en: { title: 'Upskill', desc: 'Building required capabilities' } },
    { ar: { title: 'التتبع (Track)', desc: 'قياس التقدم والتطور' }, en: { title: 'Track', desc: 'Measuring progress and evolution' } },
    { ar: { title: 'التمكين (Embed)', desc: 'ترسيخ التغيير بشكل دائم' }, en: { title: 'Embed', desc: 'Sustaining change permanently' } },
  ];

  return (
    <div className="bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <CorpNavbar />

      {/* HERO SECTION */}
      <section className="min-h-screen pt-20 pb-20 px-6 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0D1F33 0%, #1A3A5C 50%, #0D2A3F 100%)' }}>
        {/* Background animation elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-96 h-96 rounded-full opacity-10"
            style={{ background: '#05E1AE', top: '-100px', right: isRTL ? 'auto' : '-100px', left: isRTL ? '-100px' : 'auto' }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full opacity-5"
            style={{ background: '#05E1AE', bottom: '-50px', left: isRTL ? 'auto' : '20%', right: isRTL ? '20%' : 'auto' }}
            animate={{ y: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div initial="initial" animate="animate" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-brand-accent/25 bg-brand-accent/8">
                <Zap size={14} className="text-brand-accent" />
                <span className="text-brand-accent text-xs font-bold uppercase">{lang === 'ar' ? 'خبرة ١٥+ سنة' : '15+ Years of Excellence'}</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-heading font-black text-white text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                {lang === 'ar'
                  ? 'شركاؤك في بناء <span style={{ background: \'linear-gradient(135deg, #05E1AE, #3B82F6)\', backgroundClip: \'text\', WebkitBackgroundClip: \'text\', WebkitTextFillColor: \'transparent\' }}>مؤسسات رائدة</span>'
                  : 'Your Partner in Building <span style={{ background: \'linear-gradient(135deg, #05E1AE, #3B82F6)\', backgroundClip: \'text\', WebkitBackgroundClip: \'text\', WebkitTextFillColor: \'transparent\' }}>Leading Organizations</span>'
                }
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-white/65 text-lg leading-relaxed max-w-lg mb-8">
                {lang === 'ar'
                  ? 'نحول الرؤى الاستراتيجية إلى واقع عملي، ونطوّر القادة الذين يحفزون التغيير الإيجابي في المؤسسات والأفراد.'
                  : 'We transform strategic visions into actionable reality, developing leaders who drive positive change in organizations and individuals.'}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link to="/consultation" className="btn-catalyst px-8 py-4 rounded-2xl flex items-center gap-2 font-heading font-bold text-base">
                  {lang === 'ar' ? 'ابدأ رحلتك' : 'Start Your Journey'} <Arrow size={16} />
                </Link>
                <button className="btn-outline-white px-8 py-4 rounded-2xl flex items-center gap-2 font-heading font-bold text-base">
                  <Play size={14} fill="white" /> {lang === 'ar' ? 'شاهد الفيديو' : 'Watch Video'}
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-white/10">
                {['ISO Certified', 'GCC Leaders', 'Award Winner'].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                    <CheckCircle size={14} className="text-brand-accent" />
                    {badge}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <div className="relative">
                {/* Main card */}
                <motion.div
                  className="rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                  style={{ background: 'linear-gradient(135deg, rgba(5,225,174,0.1), rgba(59,130,246,0.1))' }}
                  animate={floatingAnimation}
                >
                  <div className="aspect-square bg-gradient-to-br from-brand-accent/20 to-transparent p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🚀</div>
                      <p className="text-white/60 text-sm">{lang === 'ar' ? 'تحول رقمي وتطويري' : 'Digital & Development Transformation'}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-32 h-32 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
                  animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  📈
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6 w-28 h-28 rounded-xl flex items-center justify-center text-3xl shadow-lg bg-white/5"
                  animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  🎯
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-black text-corp-dark text-3xl md:text-4xl text-center mb-16">
            {lang === 'ar' ? 'أرقام تتحدث عن نجاحنا' : 'Numbers That Speak'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const data = stat[lang];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl md:text-5xl font-heading font-black gradient-text mb-2">
                    <AnimatedCounter target={data.value} suffix={data.suffix} />
                  </div>
                  <p className="text-slate-600 text-sm">{data.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* SERVICES GRID */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-brand-accent/25 bg-brand-accent/8">
              <Zap size={12} className="text-brand-accent" />
              <span className="text-brand-accent text-xs font-bold uppercase">{lang === 'ar' ? 'خدماتنا' : 'Our Services'}</span>
            </motion.div>
            <h2 className="font-heading font-black text-corp-dark text-3xl md:text-4xl">
              {lang === 'ar' ? 'حلول شاملة للتحول التنظيمي' : 'Comprehensive Solutions for Organizational Excellence'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl p-7 border border-slate-100 hover:border-brand-accent/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{service.icon}</div>
                <h3 className="font-heading font-bold text-corp-dark text-lg mb-2">{service[lang]}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{lang === 'ar' ? 'نقدم حلولاً مخصصة لتحقيق أهدافك' : 'Customized solutions for your goals'}</p>
                <div className="flex items-center gap-2 text-brand-accent font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {lang === 'ar' ? 'تعرف أكثر' : 'Learn More'} <ArrowRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ROUTE METHODOLOGY */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-20 px-6 bg-corp-dark text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-brand-accent/25 bg-brand-accent/8">
              <TrendingUp size={12} className="text-brand-accent" />
              <span className="text-brand-accent text-xs font-bold uppercase">{lang === 'ar' ? 'منهجيتنا' : 'Our Methodology'}</span>
            </motion.div>
            <h2 className="font-heading font-black text-4xl">
              {lang === 'ar' ? 'منهجية ROUTE°' : 'ROUTE° Methodology'}
            </h2>
            <p className="text-white/50 mt-4 max-w-lg mx-auto">{lang === 'ar' ? 'عملية مثبتة لتحقيق تحول دائم' : 'A proven process for lasting transformation'}</p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent hidden lg:block" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {routeSteps.map((step, i) => {
                const data = step[lang];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    {/* Step number circle */}
                    <motion.div
                      className="w-20 h-20 rounded-full flex items-center justify-center font-heading font-black text-2xl mx-auto mb-4 border-2 border-brand-accent bg-corp-dark relative z-10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    >
                      {i + 1}
                    </motion.div>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                      <h3 className="font-heading font-bold text-brand-accent text-lg mb-2">{data.title}</h3>
                      <p className="text-white/60 text-sm">{data.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-corp-dark to-brand-primary rounded-3xl p-12 text-center text-white border border-brand-accent/20">
          <h2 className="font-heading font-black text-3xl mb-4">{lang === 'ar' ? 'هل أنت جاهز للتغيير؟' : 'Ready for Change?'}</h2>
          <p className="text-white/65 mb-8 text-lg">{lang === 'ar' ? 'دعنا نساعدك على بناء مستقبل أفضل لمؤسستك' : 'Let\'s build a better future for your organization'}</p>
          <Link to="/consultation" className="btn-catalyst px-10 py-4 rounded-2xl inline-flex items-center gap-2 font-heading font-bold text-lg">
            {lang === 'ar' ? 'اطلب استشارة مجانية' : 'Request a Free Consultation'} <Arrow size={18} />
          </Link>
        </div>
      </motion.section>

      <CorpFooter />
    </div>
  );
}