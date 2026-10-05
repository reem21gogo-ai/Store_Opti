/**
 * QuickCareerResult — the unlocked preliminary Career Interest Profile.
 * Reached only after the data gate, followed by the ad offer.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLang } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';
import {
  Wrench, FlaskConical, Palette, Users, Briefcase, Calculator,
  Globe, Sparkles, ArrowLeft, ArrowRight, Lock, FileText, BarChart2, Target, RefreshCw,
} from 'lucide-react';
import QuickOfferCard from '@/components/store/quick/QuickOfferCard';
import {
  QUICK_SAVE_KEY, QUICK_PROFILE_KEY, QUICK_LEAD_KEY, FULL_ANSWERS_KEY, QUICK_TOTAL,
} from '@/lib/quickCareerQuestions';

const LOGO = 'https://media.base44.com/images/public/6a27c58ce09a421d00c705cf/91b07a8e4_logoVectorized.svg';

const TYPE_ICONS = { R: Wrench, I: FlaskConical, A: Palette, S: Users, E: Briefcase, C: Calculator };

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
};

export default function QuickCareerResult() {
  const { lang, isRTL, toggleLang } = useLang();
  const navigate = useNavigate();
  const t = (ar, en) => (lang === 'ar' ? ar : en);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [profile, setProfile] = useState(null);
  const [lead, setLead] = useState(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const stored = read(QUICK_PROFILE_KEY);
    if (!stored) { navigate('/store/career/quick', { replace: true }); return; }

    const savedLead = read(QUICK_LEAD_KEY);
    if (!savedLead?.saved) { navigate('/store/career/quick/unlock', { replace: true }); return; }

    setProfile(stored);
    setLead(savedLead);

    // Carry the quick answers into the full assessment so they aren't asked twice.
    const quick = read(QUICK_SAVE_KEY) || {};
    const existing = read(FULL_ANSWERS_KEY) || {};
    localStorage.setItem(FULL_ANSWERS_KEY, JSON.stringify({ ...quick, ...existing }));

    base44.auth.isAuthenticated().then(setAuthed).catch(() => setAuthed(false));

    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.25 },
      colors: ['#05E1AE', '#4ca9fa', '#1A3A5C'],
    });
  }, [navigate]);

  const handleContinue = () => {
    if (authed) navigate('/store/career/intake');
    else navigate('/store/login?redirect=' + encodeURIComponent('/store/career/intake'));
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-store-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  const strongest = profile.strongestTypes || [];
  const strongestNames = strongest.map(item => item.name[lang] || item.name.en).join(t(' و', ' and '));
  const primaryColor = strongest[0]?.color || '#05E1AE';

  const fullBenefits = [
    { icon: BarChart2, text: t('كل أبعاد ميولك المهنية الستة', 'All six career-interest dimensions') },
    { icon: Target, text: t('دقة أعلى عبر 150 سؤالًا', 'Higher accuracy across 150 questions') },
    { icon: Sparkles, text: t('تفسير أعمق لنتيجتك', 'Deeper interpretation of your result') },
    { icon: Briefcase, text: t('مسارات مهنية مطابقة لك', 'Career paths matched to you') },
    { icon: FileText, text: t('تقرير مفصل من 9 صفحات', 'A detailed 9-page report') },
  ];

  return (
    <div className="min-h-screen bg-store-bg" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Minimal top bar */}
      <div className="bg-white border-b border-slate-100 px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link to="/store">
            <img src={LOGO} alt="OPTIVANCE" className="h-7 w-auto" />
          </Link>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-slate-400 hover:text-brand-primary text-xs transition-colors"
          >
            <Globe size={13} />
            {lang === 'ar' ? 'EN' : 'عر'}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-8 space-y-5">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
            {t('ملفك المهني الأولي', 'Preliminary Career Interest Profile')}
          </span>
          <h1 className="font-heading font-black text-corp-dark text-xl mt-2">
            {lead?.first_name
              ? t(`${lead.first_name}، هذا ملفك المهني`, `${lead.first_name}, this is your career profile`)
              : t('هذا ملفك المهني', 'This is your career profile')}
          </h1>
          <p className="text-slate-400 text-xs mt-2">
            {t('نتيجة أولية من المقياس السريع', 'A preliminary result from the quick assessment')}
          </p>
        </motion.div>

        {/* Strongest interest */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl p-6 text-white"
          style={{ background: `linear-gradient(135deg, #0D1F33, ${primaryColor})` }}
        >
          <p className="text-white/60 text-xs mb-2">{t('أقوى ميولك', 'Your strongest interest')}</p>
          <h2 className="font-heading font-black text-2xl mb-3">{strongestNames}</h2>
          <p className="text-white/80 text-sm leading-relaxed">{strongest[0]?.description[lang]}</p>
          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-white/50 text-xs">{t('رمز هولاند الأولي', 'Preliminary Holland Code')}</span>
            <span className="font-heading font-black text-lg tracking-widest" dir="ltr">{profile.hollandCode}</span>
          </div>
        </motion.div>

        {/* Top interests */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-100 p-6"
        >
          <h2 className="font-heading font-bold text-corp-dark text-base mb-5">
            {t('أبرز ميولك المهنية', 'Your top career interests')}
          </h2>
          <div className="space-y-4">
            {profile.top3.map((item, index) => {
              const Icon = TYPE_ICONS[item.code] || Sparkles;
              return (
                <div key={item.code}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-5 text-xs font-bold text-slate-300">{index + 1}</span>
                    <Icon size={15} style={{ color: item.color }} />
                    <span className="text-sm font-semibold text-corp-dark flex-1">
                      {item.name[lang] || item.name.en}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden ms-7">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.relative}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {strongest[0]?.careers && (
            <div className="mt-6 pt-5 border-t border-slate-50">
              <p className="text-xs text-slate-400 mb-3">
                {t('أمثلة على مسارات قد تناسبك', 'Examples of paths that may suit you')}
              </p>
              <div className="flex flex-wrap gap-2">
                {(strongest[0].careers[lang] || strongest[0].careers.en).slice(0, 4).map((career, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium">
                    {career}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Why the full assessment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-slate-100 p-6"
        >
          <h2 className="font-heading font-bold text-corp-dark text-base mb-2">
            {t('هل تريد صورة أدق؟', 'Want a more accurate picture?')}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-5">
            {t(
              'هذا المقياس يعطيك مؤشرًا أوليًا على ميولك المهنية. أكمل المقياس الكامل لتستكشف كل أبعاد ميولك وتحصل على تقرير أدق ومخصص.',
              'This quick assessment gives you an initial indication of your career interests. Complete the full assessment to explore all your dimensions and receive a more accurate, personalized report.'
            )}
          </p>

          <div className="space-y-3 mb-5">
            {fullBenefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <Icon size={15} className="text-brand-accent flex-shrink-0" />
                  <span className="text-sm text-slate-600">{benefit.text}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-2.5 bg-brand-primary/5 rounded-2xl p-3.5">
            <RefreshCw size={15} className="text-brand-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-brand-primary leading-relaxed">
              {t(
                `لقد أكملت أول ${QUICK_TOTAL} سؤالًا — إجاباتك محفوظة وستُرحّل تلقائيًا إلى المقياس الكامل، فلن تجيب عليها مرة أخرى.`,
                `You've already completed the first ${QUICK_TOTAL} questions — your answers are saved and carry over to the full assessment, so you won't answer them again.`
              )}
            </p>
          </div>
        </motion.div>

        {/* Offer */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <QuickOfferCard lang={lang} isRTL={isRTL} />
        </motion.div>

        <div className="flex items-center justify-center gap-2 pb-6">
          <Lock size={12} className="text-slate-300" />
          <Link to="/store/career" className="text-slate-400 hover:text-brand-primary text-xs transition-colors">
            {t('تعرّف على المقياس الكامل', 'Learn about the full assessment')}
          </Link>
        </div>
      </div>
    </div>
  );
}