/**
 * QuickCareerLanding — the entry page of the quick assessment.
 * Built for phone traffic: promise + button on the first screen, one short
 * reassurance block, and a single action (start the test) on the whole page.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ListChecks, UserCheck, FileText } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { QUICK_TOTAL, QUICK_SAVE_KEY, QUICK_PROFILE_KEY } from '@/lib/quickCareerQuestions';
import QuickHero from '@/components/store/quick/QuickHero';
import QuickStickyCta from '@/components/store/quick/QuickStickyCta';

const LOGO = 'https://media.base44.com/images/public/6a27c58ce09a421d00c705cf/91b07a8e4_logoVectorized.svg';

export default function QuickCareerLanding() {
  const { lang, isRTL, toggleLang } = useLang();
  const navigate = useNavigate();
  const t = (ar, en) => (lang === 'ar' ? ar : en);

  const start = () => {
    localStorage.removeItem(QUICK_SAVE_KEY);
    localStorage.removeItem(QUICK_PROFILE_KEY);
    navigate('/store/career/quick/assessment');
  };

  const steps = [
    {
      icon: ListChecks,
      title: t(`أجب عن ${QUICK_TOTAL} أسئلة`, `Answer ${QUICK_TOTAL} questions`),
      desc: t('اختيار واحد لكل سؤال، وينتقل تلقائيًا.', 'One choice per question, it moves on by itself.'),
    },
    {
      icon: UserCheck,
      title: t('اكتب اسمك ووسيلة تواصل', 'Add your name and one contact'),
      desc: t('لعرض نتيجتك وحفظها لك.', 'To show your result and save it for you.'),
    },
    {
      icon: FileText,
      title: t('استلم ملفك المهني', 'Get your career profile'),
      desc: t('نتيجة أولية فورية، وخصم على المقياس الكامل.', 'An instant preliminary result, plus a discount on the full assessment.'),
    },
  ];

  return (
    <div className="min-h-screen bg-store-bg pb-24 md:pb-0" dir={isRTL ? 'rtl' : 'ltr'}>
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

      {/* Three steps */}
      <section className="px-5 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-corp-dark text-base text-center mb-4">
            {t('ثلاث خطوات فقط', 'Just three steps')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-8 h-8 rounded-xl bg-brand-primary/8 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-brand-primary" />
                    </span>
                    <span className="text-[11px] font-black text-brand-accent tabular-nums">{i + 1}</span>
                  </div>
                  <h3 className="font-heading font-bold text-corp-dark text-sm mb-1">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={start}
            className="hidden sm:flex w-full mt-5 py-3.5 rounded-2xl font-heading font-black text-sm text-white items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
          >
            {t('ابدأ الاختبار الآن', 'Start the test now')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-6 border-t border-slate-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <img src={LOGO} alt="OPTIVANCE" className="h-6 w-auto" />
          <span className="text-xs text-slate-300">{t('أداة من أوبتيفانس', 'An OPTIVANCE tool')}</span>
        </div>
      </footer>

      <QuickStickyCta lang={lang} onStart={start} />
    </div>
  );
}