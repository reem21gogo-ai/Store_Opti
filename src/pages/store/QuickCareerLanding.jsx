/**
 * QuickCareerLanding — the entry page of the quick assessment.
 * Built for phone traffic: promise + button on the first screen and a single
 * action on the whole page — start the test.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { QUICK_SAVE_KEY, QUICK_PROFILE_KEY } from '@/lib/quickCareerQuestions';
import QuickHero from '@/components/store/quick/QuickHero';
import QuickStickyCta from '@/components/store/quick/QuickStickyCta';

const LOGO = 'https://media.base44.com/images/public/6a27c58ce09a421d00c705cf/91b07a8e4_logoVectorized.svg';

export default function QuickCareerLanding() {
  const { lang, isRTL, toggleLang } = useLang();
  const navigate = useNavigate();

  const start = () => {
    localStorage.removeItem(QUICK_SAVE_KEY);
    localStorage.removeItem(QUICK_PROFILE_KEY);
    navigate('/store/career/quick/assessment');
  };

  return (
    <div className="min-h-screen bg-store-bg pb-24 md:pb-0 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Brand bar */}
      <div className="bg-corp-dark px-5 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <img src={LOGO} alt="OPTIVANCE" className="h-6 w-auto brightness-0 invert" />
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors"
          >
            <Globe size={13} />
            {lang === 'ar' ? 'EN' : 'عر'}
          </button>
        </div>
      </div>

      <QuickHero lang={lang} onStart={start} />

      {/* Footer */}
      <footer className="mt-auto px-5 py-6 border-t border-slate-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <img src={LOGO} alt="OPTIVANCE" className="h-6 w-auto" />
          <span className="text-xs text-slate-300">
            {lang === 'ar' ? 'أداة من أوبتيفانس' : 'An OPTIVANCE tool'}
          </span>
        </div>
      </footer>

      <QuickStickyCta lang={lang} onStart={start} />
    </div>
  );
}