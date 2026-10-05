import React from 'react';
import { motion } from 'framer-motion';
import { Play, Check, Clock, Users, Star, Sparkles } from 'lucide-react';
import { QUICK_TOTAL } from '@/lib/quickCareerQuestions';
import QuickCountdown from '@/components/store/quick/QuickCountdown';

/**
 * QuickHero — the ad hook: promise, micro-commitment bullets, proof and the first CTA.
 */
export default function QuickHero({ lang = 'ar', isRTL = true, onStart }) {
  const t = (ar, en) => (lang === 'ar' ? ar : en);

  const bullets = [
    t(`${QUICK_TOTAL} سؤالًا فقط — بلا تسجيل`, `Only ${QUICK_TOTAL} questions — no sign-up`),
    t('نتيجة أولية فورية بعد الاختبار', 'Instant preliminary result when you finish'),
    t('مجاني بالكامل ولا يحتاج تحميل أي تطبيق', 'Completely free, nothing to download'),
  ];

  const stats = [
    { value: QUICK_TOTAL, label: t('سؤالًا', 'questions') },
    { value: '2', label: t('دقيقة', 'minutes') },
    { value: '6', label: t('أبعاد مهنية', 'career dimensions') },
    { value: '9', label: t('صفحات في تقريرك', 'report pages') },
  ];

  return (
    <section
      className="relative overflow-hidden px-5 pt-10 pb-14 lg:pt-16 lg:pb-20"
      style={{ background: 'linear-gradient(150deg, #0D1F33, #1A3A5C 60%, #326EA3)' }}
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      <div className="relative max-w-5xl mx-auto lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center lg:text-start"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-accent/15 border border-brand-accent/25 mb-6">
            <Sparkles size={13} className="text-brand-accent" />
            <span className="text-brand-accent text-xs font-semibold">
              {t('تقييم مهني مجاني لزوار الإعلان', 'Free career check for ad visitors')}
            </span>
          </div>

          <h1 className="font-heading font-black text-white text-3xl sm:text-4xl lg:text-5xl leading-[1.15] mb-4">
            {t('هل تعمل في المجال الذي يناسبك فعلًا؟', 'Are you really working in the field that fits you?')}
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-7 max-w-xl lg:mx-0 mx-auto">
            {t(
              'المشكلة ليست في قدراتك، بل في أن أحدًا لم يخبرك أين تناسبها. اكتشف ميلك المهني الحقيقي في دقيقتين.',
              "The problem isn't your abilities — it's that no one told you where they fit. Discover your real career interest in two minutes."
            )}
          </p>

          <div className="space-y-2.5 mb-8 text-start max-w-xs mx-auto lg:mx-0">
            {bullets.map((bullet, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-brand-accent" />
                </span>
                <span className="text-white/80 text-sm">{bullet}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onStart}
            className="w-full sm:w-auto sm:px-10 py-4 rounded-2xl font-heading font-black text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] mx-auto lg:mx-0"
            style={{ background: 'linear-gradient(135deg, #05E1AE, #4ca9fa)', color: '#0D1F33' }}
          >
            <Play size={17} fill="currentColor" />
            {t('ابدأ الاختبار المجاني الآن', 'Start the free test now')}
          </button>

          <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 mt-5">
            {[[Users, t('+1,000 مستخدم', '+1,000 users')], [Star, t('4.8 تقييم', '4.8 rating')], [Clock, t('نتائج فورية', 'Instant results')]].map(([Icon, label], i) => (
              <span key={i} className="flex items-center gap-1.5 text-white/50 text-xs">
                <Icon size={12} className="text-brand-accent" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 lg:mt-0"
        >
          <div className="rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-5">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.05] border border-white/5 px-4 py-3.5 text-center">
                  <div className="font-heading font-black text-2xl text-brand-accent tabular-nums">{stat.value}</div>
                  <div className="text-white/50 text-[11px] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <QuickCountdown lang={lang} tone="dark" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}