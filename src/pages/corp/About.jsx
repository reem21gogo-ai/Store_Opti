import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Award, Users, Zap, Target } from 'lucide-react';
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

export default function About() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const values = [
    {
      ar: { title: 'النزاهة والشفافية', desc: 'نبني علاقات على أساس الثقة والوضوح' },
      en: { title: 'Integrity & Transparency', desc: 'We build relationships on trust and clarity' },
      icon: Award
    },
    {
      ar: { title: 'الابتكار المستمر', desc: 'نتطور باستمرار لتقديم أفضل الحلول' },
      en: { title: 'Continuous Innovation', desc: 'We evolve constantly to deliver excellence' },
      icon: Zap
    },
    {
      ar: { title: 'تمكين الأفراد', desc: 'نؤمن بقوة الإنسان والتطوير المهني' },
      en: { title: 'People Empowerment', desc: 'We believe in human potential and growth' },
      icon: Users
    },
    {
      ar: { title: 'التأثير الإيجابي', desc: 'نسعى لترك أثر دائم في المؤسسات' },
      en: { title: 'Positive Impact', desc: 'We strive for lasting organizational change' },
      icon: Target
    },
  ];

  const milestones = [
    { year: '2010', ar: 'بدء الرحلة', en: 'Journey Begins', desc: 'ar:تأسيس OPTIVANCE|en:Founding OPTIVANCE' },
    { year: '2013', ar: 'التوسع الإقليمي', en: 'Regional Expansion', desc: 'ar:دخول الخليج|en:GCC Entry' },
    { year: '2016', ar: 'الشراكات الاستراتيجية', en: 'Strategic Partnerships', desc: 'ar:تعاون مع الأفضل|en:Collaborating with best' },
    { year: '2020', ar: 'رقمنة الخدمات', en: 'Digital Transformation', desc: 'ar:الحلول الرقمية|en:Digital Solutions' },
    { year: '2024', ar: 'الابتكار والقيادة', en: 'Innovation & Leadership', desc: 'ar:قادة التحول|en:Transformation Leaders' },
  ];

  const team = [
    { ar: 'خبراء استراتيجيون', en: 'Strategy Experts', icon: '🎯' },
    { ar: 'مدربون معتمدون', en: 'Certified Trainers', icon: '👨‍🏫' },
    { ar: 'مستشارون تنظيميون', en: 'Organization Consultants', icon: '🏢' },
    { ar: 'محللون نفسيون', en: 'Psychometricians', icon: '🧠' },
  ];

  return (
    <div className="bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <CorpNavbar />

      {/* HERO */}
      <section className="min-h-[70vh] pt-24 pb-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F6F8FA 0%, #E8F1F5 100%)' }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-brand-primary/20 bg-brand-primary/5">
              <span className="text-brand-primary text-xs font-bold uppercase">{lang === 'ar' ? 'عن أوبتيفانس' : 'About OPTIVANCE'}</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-heading font-black text-corp-dark text-4xl md:text-5xl mb-6 leading-tight">
              {lang === 'ar' ? 'نحن لا ننقل معلومات، نحن نبني قادة' : 'We Don\'t Transfer Information, We Build Leaders'}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-slate-600 text-lg leading-relaxed max-w-2xl mb-8">
              {lang === 'ar'
                ? 'منذ ١٥ سنة، ننقل تجاربنا وخبراتنا لآلاف القادة والمؤسسات في الخليج، نساهم في بناء ثقافات تنظيمية قوية وقيادات فعّالة.'
                : 'For 15 years, we have been transferring our experience and expertise to thousands of leaders and organizations in the GCC, contributing to building strong organizational cultures and effective leadership.'}
            </motion.p>
          </motion.div>
        </div>

        {/* Background shape */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: '#1A3A5C' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </section>

      {/* VISION & MISSION */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-16 px-6 bg-corp-dark text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="relative pl-8 border-l-3 border-brand-accent">
              <h3 className="font-heading font-black text-2xl mb-3">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h3>
              <p className="text-white/70 leading-relaxed">
                {lang === 'ar'
                  ? 'أن نكون الشريك الموثوق به للمؤسسات الخليجية في بناء ثقافات تنظيمية متقدمة وتطوير قيادات مؤثرة تحدث تغييراً إيجابياً مستدام.'
                  : 'To be the trusted partner for GCC organizations in building advanced organizational cultures and developing influential leaders who create lasting positive change.'}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} className="relative pl-8 border-l-3 border-brand-accent">
              <h3 className="font-heading font-black text-2xl mb-3">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h3>
              <p className="text-white/70 leading-relaxed">
                {lang === 'ar'
                  ? 'تمكين المؤسسات والأفراد من خلال حلول تطويرية مبتكرة تدمج العلم والممارسة، لتحقيق تحول تنظيمي حقيقي ومستدام.'
                  : 'Empower organizations and individuals through innovative developmental solutions that blend science and practice, achieving real and sustainable organizational transformation.'}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CORE VALUES */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-black text-corp-dark text-3xl md:text-4xl text-center mb-16">
            {lang === 'ar' ? 'قيمنا الأساسية' : 'Our Core Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              const data = value[lang];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl p-8 border border-slate-200 hover:border-brand-accent/50 hover:shadow-lg transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-brand-accent/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
                    <Icon size={20} className="text-brand-primary group-hover:text-brand-accent transition-colors" />
                  </div>
                  <h3 className="font-heading font-bold text-corp-dark text-lg mb-2">{data.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{data.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* TIMELINE */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-black text-corp-dark text-3xl md:text-4xl text-center mb-16">
            {lang === 'ar' ? 'رحلتنا عبر السنوات' : 'Our Journey Through Years'}
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary via-brand-accent to-brand-primary hidden lg:block" />

            <div className="space-y-8">
              {milestones.map((milestone, i) => {
                const isLeft = i % 2 === 0;
                const descParts = milestone.desc.split('|');
                const descText = lang === 'ar' ? descParts[0].replace('ar:', '') : descParts[1].replace('en:', '');
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className={`flex items-center ${isLeft ? 'lg:flex-row-reverse' : ''} gap-8`}
                  >
                    {/* Content */}
                    <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-200 hover:border-brand-accent/30 transition-all">
                      <div className="text-sm font-bold text-brand-accent mb-1">{milestone.year}</div>
                      <h3 className="font-heading font-bold text-corp-dark text-lg mb-2">{milestone[lang]}</h3>
                      <p className="text-slate-600 text-sm">{descText}</p>
                    </div>
                    {/* Dot */}
                    <div className="hidden lg:flex flex-col items-center">
                      <motion.div
                        className="w-5 h-5 rounded-full border-4 border-white bg-brand-accent"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    {/* Spacer */}
                    <div className="flex-1 hidden lg:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* TEAM CAPABILITIES */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-black text-corp-dark text-3xl md:text-4xl text-center mb-4">
            {lang === 'ar' ? 'فريق متخصص ومتنوع' : 'Specialized & Diverse Team'}
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-16">
            {lang === 'ar'
              ? 'خبراء بمختلف التخصصات يعملون معاً لضمان تقديم أفضل حل لاحتياجاتك'
              : 'Experts in various specialties working together to deliver the best solution for your needs'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-200 text-center hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{role.icon}</div>
                <h3 className="font-heading font-bold text-corp-dark text-base">{role[lang]}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-16 px-6 bg-gradient-to-br from-corp-dark to-brand-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading font-black text-3xl mb-4">
            {lang === 'ar' ? 'هل تريد أن تصبح جزءاً من قصة النجاح؟' : 'Ready to Be Part of Our Success Story?'}
          </h2>
          <p className="text-white/65 mb-8 text-lg max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'دعنا نساعدك على تحقيق أهدافك وبناء مؤسسة قوية.'
              : 'Let us help you achieve your goals and build a strong organization.'}
          </p>
          <Link to="/consultation" className="btn-catalyst px-10 py-4 rounded-2xl inline-flex items-center gap-2 font-heading font-bold text-base">
            {lang === 'ar' ? 'ابدأ الآن' : 'Start Now'} <Arrow size={16} />
          </Link>
        </div>
      </motion.section>

      <CorpFooter />
    </div>
  );
}