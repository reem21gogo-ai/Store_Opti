import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations, assessmentCategories } from '@/lib/i18n';
import { BarChart2, Clock } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function Assessments() {
  const { lang } = useLang();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    base44.entities.Assessment.filter({ is_published: true }, '-created_date', 50)
      .then(data => { setAssessments(data); setLoading(false); });
  }, []);

  const filtered = activeCategory === 'all' ? assessments : assessments.filter(a => a.category === activeCategory);

  return (
    <div className="bg-store-bg min-h-screen">
      <StoreNavbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-heading font-black text-corp-dark text-3xl mb-2">{translations.store.assessments[lang]}</h1>
          <p className="text-slate-500">{lang === 'ar' ? 'تقييمات تفاعلية مع تقارير تحليلية مخصصة' : 'Interactive assessments with personalized analytical reports'}</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-brand-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-primary/50'}`}>
            {translations.store.allCategories[lang]}
          </button>
          {assessmentCategories.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.value ? 'bg-brand-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-primary/50'}`}>
              {cat[lang]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3,4,5,6].map(i => <div key={i} className="h-56 bg-white rounded-3xl animate-pulse"></div>)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24"><BarChart2 size={36} className="mx-auto mb-4 text-slate-300" /><p className="text-slate-400">{lang === 'ar' ? 'لا توجد تقييمات' : 'No assessments found'}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(a => (
              <Link key={a.id} to={`/store/assessments/${a.id}`} className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all group border border-slate-100">
                <div className="h-36 bg-gradient-to-br from-brand-primary/10 to-brand-accent/5 flex items-center justify-center relative">
                  {a.cover_image_url ? <img src={a.cover_image_url} alt="" className="w-full h-full object-cover" /> : <BarChart2 size={32} className="text-brand-primary/30" />}
                  {a.is_free && <span className="absolute top-3 start-3 bg-brand-accent text-corp-dark text-xs font-bold px-2.5 py-1 rounded-full">{translations.common.free[lang]}</span>}
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-corp-dark text-base mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">{a[`title_${lang}`] || a.title_ar}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-3">{a[`description_${lang}`] || a.description_ar}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-400 text-xs"><Clock size={11} /> {a.duration_minutes} {translations.assessment.minutes[lang]}</div>
                    {a.is_free ? <span className="text-brand-accent font-bold text-xs">{translations.common.free[lang]}</span> : <span className="font-bold text-corp-dark text-sm">{a.price} {translations.common.currency[lang]}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <StoreFooter />
    </div>
  );
}