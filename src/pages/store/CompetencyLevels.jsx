import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';

export default function CompetencyLevels() {
  const { lang, isRTL } = useLang();
  const [searchParams] = useSearchParams();
  const selectedLevel = searchParams.get('level') || null;
  const [selected, setSelected] = useState(selectedLevel);
  const [versionSelected, setVersionSelected] = useState(null);

  const levels = [
    {
      level: 'operational',
      titleAr: 'المستوى التشغيلي',
      titleEn: 'Operational Level',
      descAr: 'للموظفين والأخصائيين والمنفذين',
      descEn: 'For staff, specialists, and implementers',
      quickPrice: 99,
      fullPrice: 199,
    },
    {
      level: 'supervisory',
      titleAr: 'المستوى الإشرافي',
      titleEn: 'Supervisory Level',
      descAr: 'لقادة الفرق والمشرفين',
      descEn: 'For team leaders and supervisors',
      quickPrice: 129,
      fullPrice: 249,
    },
    {
      level: 'leadership',
      titleAr: 'المستوى القيادي',
      titleEn: 'Leadership Level',
      descAr: 'للمديرين والقيادات التنفيذية',
      descEn: 'For managers and executives',
      quickPrice: 159,
      fullPrice: 299,
    },
  ];

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 mb-4">
              {lang === 'ar' ? 'اختر مستواك الوظيفي' : 'Select Your Professional Level'}
            </h1>
            <p className="text-lg text-slate-600">
              {lang === 'ar' ? 'سيتم تخصيص الأسئلة والسيناريوهات حسب مستواك' : 'Questions will be tailored to your level'}
            </p>
          </motion.div>

          {/* Level Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {levels.map((l, i) => (
              <motion.div
                key={i}
                onClick={() => {
                  setSelected(l.level);
                  setVersionSelected(null);
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-2xl cursor-pointer transition-all border-2 ${
                  selected === l.level
                    ? 'border-brand-accent bg-blue-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-brand-primary'
                }`}
              >
                <h3 className="text-2xl font-black text-slate-900 mb-2">{l[lang === 'ar' ? 'titleAr' : 'titleEn']}</h3>
                <p className="text-slate-600 mb-4">{l[lang === 'ar' ? 'descAr' : 'descEn']}</p>

                {selected === l.level && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-3">
                    <div className="font-bold text-slate-900 mb-3">
                      {lang === 'ar' ? 'اختر النسخة:' : 'Choose Version:'}
                    </div>

                    <button
                      onClick={() => setVersionSelected('quick')}
                      className={`w-full p-4 rounded-xl transition-all font-bold flex justify-between items-center ${
                        versionSelected === 'quick'
                          ? 'bg-brand-accent text-white'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <span>{lang === 'ar' ? 'نسخة سريعة' : 'Quick Version'}</span>
                      <span className="text-lg">{l.quickPrice} ر.س</span>
                    </button>

                    <button
                      onClick={() => setVersionSelected('full')}
                      className={`w-full p-4 rounded-xl transition-all font-bold flex justify-between items-center ${
                        versionSelected === 'full'
                          ? 'bg-brand-primary text-white'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <span>{lang === 'ar' ? 'نسخة شاملة' : 'Full Version'}</span>
                      <span className="text-lg">{l.fullPrice} ر.س</span>
                    </button>

                    {versionSelected && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Link
                          to={`/store/competency/assessment?level=${l.level}&version=${versionSelected}`}
                          className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all text-center block mt-4"
                        >
                          {lang === 'ar' ? 'ابدأ التقييم' : 'Start Assessment'}
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
}