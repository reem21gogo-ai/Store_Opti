/**
 * QuickCareerLanding — ad-friendly hook screen for the Quick Career Interest Assessment.
 * No navbar clutter, no sign-up: one clear CTA on a mobile-first layout.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';
import { Globe, Sparkles, Clock, Zap, ShieldCheck, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { QUICK_TOTAL, QUICK_SAVE_KEY, QUICK_PROFILE_KEY } from '@/lib/quickCareerQuestions';

const LOGO = 'https://media.base44.com/images/public/6a27c58ce09a421d00c705cf/91b07a8e4_logoVectorized.svg';

export default function QuickCareerLanding() {
  const { lang, isRTL, toggleLang } = useLang();
  const navigate = useNavigate();
  const t = (ar, en) => (lang === 'ar' ? ar : en);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const start = () => {
    localStorage.removeItem(QUICK_SAVE_KEY);
    localStorage.removeItem(QUICK_PROFILE_KEY);
    navigate('/store/career/quick/assessment');
  };

  const badges = [
    { icon: Zap, label: t('نتيجة فورية', 'Instant result') },
    { icon: ShieldCheck, label: t('بدون تسجيل', 'No sign-up') },
    { icon: Clock, label: t('أقل من دقيقة', 'Under a minute') },
  ];

  return (
    <div className="min-h-screen bg-corp-dark flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Minimal top bar */}
      <div className="px-5 py-4 flex items-center justify-between">
        <Link to="/store">
          <img src={LOGO} alt="OPTIVANCE" className="h-7 w-auto brightness-0 invert" />
        </Link>
        <button onClick={toggleLang} className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors">
          <Globe size={13} />
          {lang === 'ar' ? 'EN' : 'عر'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-accent/15 border border-brand-accent/25 mb-6">
            <Sparkles size={13} className="text-brand-accent" />
            <span className="text-brand-accent text-xs font-medium">
              {t('تقييم مهني سريع', 'Quick Career Check')}
            </span>
          </div>

          <h1 className="font-heading font-black text-white text-3xl sm:text-4xl mb-4 leading-tight">
            {t('اكتشف اتجاهك المهني', 'Discover Your Career Direction')}
          </h1>

          <p className="text-white/60 text-base leading-relaxed mb-7">
            {t(
              'أجب عن بضعة أسئلة سريعة واكتشف الميول المهنية التي قد تناسبك.',
              'Answer a few quick questions and discover the career interests that may fit you best.'
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {badges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                  <Icon size={12} className="text-brand-accent" />
                  <span className="text-white/70 text-xs">{badge.label}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={start}
            className="w-full py-4 rounded-2xl font-heading font-black text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #05E1AE, #4ca9fa)', color: '#0D1F33' }}
          >
            <Play size={17} fill="currentColor" />
            {t('ابدأ المقياس السريع', 'Start Quick Assessment')}
          </button>

          <p className="text-white/35 text-xs mt-4">
            {t(`${QUICK_TOTAL} أسئلة • بدون بيانات شخصية`, `${QUICK_TOTAL} questions • No personal details`)}
          </p>

          <Link
            to="/store/career"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-brand-accent text-xs mt-8 transition-colors"
          >
            {t('أو ابدأ المقياس الكامل', 'Or start the full assessment')}
            <Arrow size={12} />
          </Link>
        </motion.div>
      </div>

      <div className="px-5 pb-6 text-center">
        <span className="text-white/25 text-xs">{t('أداة من أوبتيفانس', 'An OPTIVANCE tool')}</span>
      </div>
    </div>
  );
}