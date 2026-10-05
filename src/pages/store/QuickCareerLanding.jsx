/**
 * QuickCareerLanding — ad landing page for the Quick Career Interest Assessment.
 * Built as a conversion funnel: hook → value → curiosity gap → offer → objections.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ListChecks, UserCheck, FileText, Wrench, FlaskConical, Palette, Users, Briefcase, Calculator } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { QUICK_TOTAL, QUICK_SAVE_KEY, QUICK_PROFILE_KEY } from '@/lib/quickCareerQuestions';
import { RIASEC_TYPES } from '@/lib/careerContent';
import QuickHero from '@/components/store/quick/QuickHero';
import QuickLockedPreview from '@/components/store/quick/QuickLockedPreview';
import QuickOfferCard from '@/components/store/quick/QuickOfferCard';
import QuickFaq from '@/components/store/quick/QuickFaq';
import QuickStickyCta from '@/components/store/quick/QuickStickyCta';

const LOGO = 'https://media.base44.com/images/public/6a27c58ce09a421d00c705cf/91b07a8e4_logoVectorized.svg';
const TYPE_ICONS = { R: Wrench, I: FlaskConical, A: Palette, S: Users, E: Briefcase, C: Calculator };

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
      title: t(`أجب عن ${QUICK_TOTAL} سؤالًا`, `Answer ${QUICK_TOTAL} questions`),
      desc: t('اختر ما ينطبق عليك — لا توجد إجابة صحيحة أو خاطئة.', 'Pick what applies to you — there are no right or wrong answers.'),
    },
    {
      icon: UserCheck,
      title: t('أدخل بياناتك لعرض النتيجة', 'Enter your details to reveal it'),
      desc: t('الاسم ووسيلة تواصل واحدة فقط لحفظ ملفك.', 'Just your name and one contact detail to save your profile.'),
    },
    {
      icon: FileText,
      title: t('استلم ملفك المهني', 'Get your career profile'),
      desc: t('نتيجة أولية فورية، وخصم خاص على المقياس الكامل.', 'An instant preliminary result, plus an exclusive discount on the full assessment.'),
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-28 md:pb-0" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top bar */}
      <div className="bg-corp-dark px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img src={LOGO} alt="OPTIVANCE" className="h-7 w-auto brightness-0 invert" />
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors"
          >
            <Globe size={13} />
            {lang === 'ar' ? 'EN' : 'عر'}
          </button>
        </div>
      </div>

      <QuickHero lang={lang} isRTL={isRTL} onStart={start} />

      {/* What you will discover */}
      <section className="px-5 py-12 bg-store-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading font-black text-corp-dark text-xl sm:text-2xl mb-2">
              {t('ما الذي سيكشفه عنك هذا الاختبار؟', 'What will this test reveal about you?')}
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              {t(
                'ستعرف أي من الأنماط المهنية الستة يغلب عليك، وأمثلة المسارات التي تناسبه.',
                'You will learn which of the six career patterns dominates your profile, and example paths that fit it.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
            {['R', 'I', 'A', 'S', 'E', 'C'].map((code, i) => {
              const type = RIASEC_TYPES[code];
              const Icon = TYPE_ICONS[code];
              return (
                <motion.div
                  key={code}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="rounded-2xl border border-slate-100 bg-white p-4"
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${type.color}1a`, color: type.color }}
                  >
                    <Icon size={16} />
                  </span>
                  <h3 className="font-heading font-bold text-corp-dark text-sm mb-1">{type.name[lang] || type.name.en}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {t('مثال: ', 'e.g. ')}
                    {type.careers[lang]?.[0] || type.careers.en[0]}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curiosity gap + how it works */}
      <section className="px-5 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <QuickLockedPreview
            lang={lang}
            title={t('هذا هو تقريرك الكامل', 'This is your full report')}
            note={t(
              'تقرير من 9 صفحات: مسارات مطابقة بالاسم وخطة 90 يومًا. يُفتح مع المقياس الكامل.',
              'A 9-page report: paths matched by name and a 90-day plan. It unlocks with the full assessment.'
            )}
          />

          <div>
            <h2 className="font-heading font-black text-corp-dark text-xl sm:text-2xl mb-6">
              {t('كيف يعمل؟ ثلاث خطوات فقط', 'How it works: three steps')}
            </h2>
            <div className="space-y-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-brand-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-brand-accent tabular-nums">{i + 1}</span>
                        <h3 className="font-heading font-bold text-corp-dark text-sm">{step.title}</h3>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={start}
              className="w-full sm:w-auto sm:px-8 mt-7 py-4 rounded-2xl font-heading font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
            >
              {t('ابدأ الاختبار المجاني', 'Start the free test')}
            </button>
          </div>
        </div>
      </section>

      {/* Offer */}
      <section className="px-5 py-12 bg-store-bg">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-heading font-black text-corp-dark text-xl sm:text-2xl mb-2">
              {t('عرض خاص لفترة محدودة', 'A special offer, for a limited time')}
            </h2>
            <p className="text-slate-500 text-sm">
              {t(
                'لمن يريد الصورة الكاملة: المقياس المهني الشامل بسعر مخفّض، وصلاحيته مرتبطة بالمهلة داخل العرض.',
                'For the full picture: the complete career assessment at a reduced price, valid while the offer countdown lasts.'
              )}
            </p>
          </div>
          <QuickOfferCard lang={lang} isRTL={isRTL} />
        </div>
      </section>

      <QuickFaq lang={lang} />

      {/* Footer */}
      <footer className="px-5 py-8 border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={LOGO} alt="OPTIVANCE" className="h-7 w-auto" />
          <span className="text-xs text-slate-300">{t('أداة من أوبتيفانس', 'An OPTIVANCE tool')}</span>
        </div>
      </footer>

      <QuickStickyCta lang={lang} onStart={start} />
    </div>
  );
}