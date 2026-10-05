/**
 * QuickCareerUnlock — the exchange gate of the ad funnel.
 * The preliminary profile stays locked until the visitor leaves one contact
 * detail; the ad offer is presented right below at peak momentum.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';
import QuickLeadForm from '@/components/store/quick/QuickLeadForm';
import QuickLockedPreview from '@/components/store/quick/QuickLockedPreview';
import QuickOfferCard from '@/components/store/quick/QuickOfferCard';
import { QUICK_PROFILE_KEY, QUICK_LEAD_KEY } from '@/lib/quickCareerQuestions';

const LOGO = 'https://media.base44.com/images/public/6a27c58ce09a421d00c705cf/91b07a8e4_logoVectorized.svg';

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
};

export default function QuickCareerUnlock() {
  const { lang, isRTL, toggleLang } = useLang();
  const navigate = useNavigate();
  const t = (ar, en) => (lang === 'ar' ? ar : en);

  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = read(QUICK_PROFILE_KEY);
    if (!stored) { navigate('/store/career/quick', { replace: true }); return; }
    if (read(QUICK_LEAD_KEY)?.saved) { navigate('/store/career/quick/result', { replace: true }); return; }
    setProfile(stored);
  }, [navigate]);

  const handleUnlock = async (values) => {
    setSaving(true);
    setError('');
    const res = await base44.functions
      .invoke('submitQuickCareerLead', {
        ...values,
        language: lang,
        strongest_interest: profile.strongest[0],
        top_interests: profile.top3.map(item => item.code),
        holland_code: profile.hollandCode,
      })
      .catch(() => null);
    setSaving(false);

    if (res?.data?.saved) {
      localStorage.setItem(QUICK_LEAD_KEY, JSON.stringify({ ...values, saved: true }));
      navigate('/store/career/quick/result');
    } else {
      setError(t('تعذّر حفظ بياناتك، يرجى المحاولة مرة أخرى.', 'Could not save your details, please try again.'));
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-store-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

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
        {/* Celebration header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-accent/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={26} className="text-brand-accent" />
          </div>
          <h1 className="font-heading font-black text-corp-dark text-xl mb-2">
            {t('تم تحليل إجاباتك ✓ وملفك جاهز', 'Your answers are analyzed ✓ and your profile is ready')}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            {t(
              'أدخل بياناتك الآن لعرض أبرز ميولك المهنية ورمز هولاند الأولي.',
              'Enter your details now to reveal your top career interests and preliminary Holland Code.'
            )}
          </p>
        </motion.div>

        {/* Locked profile */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <QuickLockedPreview
            lang={lang}
            title={t('نتيجتك محفوظة ومقفلة مؤقتًا', 'Your result is saved and temporarily locked')}
            note={t(
              'اكتمل تحليل 12 إجابة. النتيجة تظهر تلقائيًا بمجرد تأكيد بياناتك.',
              'Analysis of your 12 answers is complete. Your result appears the moment you confirm your details.'
            )}
          />
        </motion.div>

        {/* Unlock form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-100 p-6"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
              <Lock size={15} className="text-brand-primary" />
            </div>
            <h2 className="font-heading font-bold text-corp-dark text-base">
              {t('افتح ملفي المهني', 'Unlock my career profile')}
            </h2>
          </div>

          <QuickLeadForm
            lang={lang}
            isRTL={isRTL}
            saving={saving}
            onSave={handleUnlock}
            note={t(
              'لا نشارك بياناتك مع أي طرف آخر، وسيتم ترحيل إجاباتك إلى المقياس الكامل إن أكملته.',
              'We never share your details, and your answers carry over if you continue to the full assessment.'
            )}
          />
          {error && <p className="text-xs text-destructive mt-3 text-center">{error}</p>}

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
            <ShieldCheck size={13} className="text-slate-400 flex-shrink-0" />
            <span className="text-[11px] text-slate-400">
              {t('بياناتك تُستخدم لعرض نتيجتك وحفظ ملفك فقط.', 'Your details are used only to show your result and save your profile.')}
            </span>
          </div>
        </motion.div>

        {/* Offer at peak momentum */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <QuickOfferCard lang={lang} isRTL={isRTL} />
        </motion.div>

        <p className="text-center text-xs text-slate-400 pb-4">
          {t(
            'نتيجتك الأولية مؤشر عام من 12 سؤالًا — المقياس الكامل يقيسها بدقة عبر 150 سؤالًا.',
            'Your preliminary result is a general indication from 12 questions — the full assessment measures it precisely across 150.'
          )}
        </p>
      </div>
    </div>
  );
}