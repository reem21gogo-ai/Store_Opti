import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { ArrowLeft, ArrowRight, Clock, BarChart2, CheckCircle } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function CompetencyLevels() {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const [user, setUser] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async authed => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  const levels = [
    {
      id: 'operational',
      titleAr: 'المستوى التشغيلي',
      titleEn: 'Operational Level',
      descAr: 'للموظفين والأخصائيين والمنفذين',
      descEn: 'For staff, specialists, and implementers',
      icon: '👨‍💼',
      quick: { price: 99, duration: '15 دقيقة' },
      full: { price: 199, duration: '30 دقيقة' },
    },
    {
      id: 'supervisory',
      titleAr: 'المستوى الإشرافي',
      titleEn: 'Supervisory Level',
      descAr: 'لقادة الفرق والمشرفين',
      descEn: 'For team leaders and supervisors',
      icon: '👔',
      quick: { price: 129, duration: '15 دقيقة' },
      full: { price: 249, duration: '30 دقيقة' },
    },
    {
      id: 'leadership',
      titleAr: 'المستوى القيادي',
      titleEn: 'Leadership Level',
      descAr: 'للمديرين والقيادات التنفيذية',
      descEn: 'For managers and executives',
      icon: '👑',
      quick: { price: 159, duration: '15 دقيقة' },
      full: { price: 299, duration: '30 دقيقة' },
    },
  ];

  const handleStart = () => {
    if (!selectedLevel || !selectedVersion) return;
    navigate(`/store/competency/assessment?level=${selectedLevel}&version=${selectedVersion}`);
  };

  return (
    <div className="bg-store-bg min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto">
          <Link to="/store/competency" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary text-sm transition-colors w-fit">
            <BackArrow size={14} />
            {lang === 'ar' ? 'العودة للمقياس' : 'Back to Assessment'}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="font-heading font-black text-corp-dark text-3xl md:text-4xl mb-3">
            {lang === 'ar' ? 'اختر مستواك الوظيفي' : 'Select Your Professional Level'}
          </h1>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            {lang === 'ar' ? 'سيتم تخصيص الأسئلة والسيناريوهات حسب مستوى الخبرة والمسؤolية' : 'Questions will be tailored to your professional level and responsibilities'}
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 gap-6 mb-10">
          {levels.map(level => (
            <div
              key={level.id}
              onClick={() => {
                setSelectedLevel(level.id);
                setSelectedVersion(null);
              }}
              className={`rounded-2xl border-2 overflow-hidden transition-all cursor-pointer ${
                selectedLevel === level.id
                  ? 'border-brand-primary bg-white shadow-lg'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl">{level.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-heading font-black text-corp-dark text-xl mb-1">
                      {level[lang === 'ar' ? 'titleAr' : 'titleEn']}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      {level[lang === 'ar' ? 'descAr' : 'descEn']}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedLevel === level.id ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
                  }`}>
                    {selectedLevel === level.id && <CheckCircle size={16} className="text-white" />}
                  </div>
                </div>

                {/* Version Selection - Shows when level selected */}
                {selectedLevel === level.id && (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mt-6 space-y-3">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {lang === 'ar' ? 'اختر النسخة' : 'Choose Version'}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Quick Version */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedVersion('quick');
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedVersion === 'quick'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-corp-dark text-sm">
                            {lang === 'ar' ? 'النسخة السريعة' : 'Quick Version'}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {lang === 'ar' ? 'شهيرة' : 'Popular'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={12} /> {level.quick.duration}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <BarChart2 size={12} /> {lang === 'ar' ? '20 سؤال' : '20 questions'}
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-heading font-black text-brand-accent text-lg">{level.quick.price}</span>
                          <span className="text-xs text-slate-500">{lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                        </div>
                      </button>

                      {/* Full Version */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedVersion('full');
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                          selectedVersion === 'full'
                            ? 'border-brand-primary bg-brand-primary/5'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="absolute -top-2 -right-2">
                          <span className="bg-brand-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            ⭐ {lang === 'ar' ? 'الأفضل' : 'Best'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2 mt-2">
                          <span className="font-semibold text-corp-dark text-sm">
                            {lang === 'ar' ? 'النسخة الشاملة' : 'Full Version'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={12} /> {level.full.duration}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <BarChart2 size={12} /> {lang === 'ar' ? '45 سؤال' : '45 questions'}
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-heading font-black text-corp-dark text-lg">{level.full.price}</span>
                          <span className="text-xs text-slate-500">{lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {selectedLevel && selectedVersion && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedLevel(null);
                setSelectedVersion(null);
              }}
              className="flex-1 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
            >
              {lang === 'ar' ? 'اختر مستوى آخر' : 'Choose Different Level'}
            </button>
            <button
              onClick={handleStart}
              className="flex-1 py-3.5 rounded-xl font-heading font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
            >
              {lang === 'ar' ? 'ابدأ التقييم الآن' : 'Start Assessment Now'}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </button>
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
}