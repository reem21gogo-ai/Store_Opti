import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations, productCategories } from '@/lib/i18n';
import { ArrowRight, ArrowLeft, Download, BarChart2, Package, Sparkles } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function StoreHome() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [featured, setFeatured] = useState([]);
  const [free, setFree] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Product.filter({ is_featured: true, is_published: true }, '-created_date', 6),
      base44.entities.Product.filter({ is_free: true, is_published: true }, '-created_date', 4),
      base44.entities.Assessment.filter({ is_published: true }, '-created_date', 4),
    ]).then(([f, fr, a]) => { setFeatured(f); setFree(fr); setAssessments(a); setLoading(false); });
  }, []);

  return (
    <div className="bg-store-bg min-h-screen">
      <StoreNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 px-6" style={{ background: 'linear-gradient(135deg, #0D1F33, #1A3A5C)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/20 border border-brand-accent/30 mb-5">
            <Sparkles size={14} className="text-brand-accent" />
            <span className="text-brand-accent text-xs font-medium">{lang === 'ar' ? 'أدوات رقمية احترافية' : 'Professional Digital Tools'}</span>
          </div>
          <h1 className="font-heading font-black text-3xl md:text-5xl text-white mb-4">{translations.store.title[lang]}</h1>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">{translations.store.subtitle[lang]}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/store/products" className="btn-catalyst px-7 py-3.5 rounded-xl flex items-center justify-center gap-2">
              <Package size={16} /> {translations.store.products[lang]}
            </Link>
            <Link to="/store/assessments" className="btn-outline-white px-7 py-3.5 rounded-xl flex items-center justify-center gap-2">
              <BarChart2 size={16} /> {translations.store.assessments[lang]}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto no-scrollbar">
          <Link to="/store/products" className="flex-shrink-0 px-4 py-2 rounded-xl bg-brand-primary/5 text-brand-primary text-sm font-medium hover:bg-brand-primary/10 transition-all">{translations.store.allCategories[lang]}</Link>
          {productCategories.map(cat => (
            <Link key={cat.value} to={`/store/products?category=${cat.value}`}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-sm font-medium hover:bg-brand-primary/5 hover:text-brand-primary transition-all">
              {cat[lang]}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-black text-corp-dark text-2xl">{lang === 'ar' ? 'منتجات مميزة' : 'Featured Products'}</h2>
            <Link to="/store/products" className="text-brand-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">{translations.common.viewAll[lang]} <Arrow size={13} /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse"></div>)}</div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(p => <ProductCard key={p.id} product={p} lang={lang} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">{lang === 'ar' ? 'لا توجد منتجات مميزة بعد' : 'No featured products yet'}</div>
          )}
        </div>
      </section>

      {/* Assessments */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading font-black text-corp-dark text-2xl">{lang === 'ar' ? 'التقييمات التفاعلية' : 'Interactive Assessments'}</h2>
              <p className="text-slate-500 text-sm mt-1">{lang === 'ar' ? 'اكتشف واقعك بتقارير مخصصة' : 'Discover your reality with personalized reports'}</p>
            </div>
            <Link to="/store/assessments" className="text-brand-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">{translations.common.viewAll[lang]} <Arrow size={13} /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{[1,2].map(i => <div key={i} className="h-48 bg-slate-50 rounded-3xl animate-pulse"></div>)}</div>
          ) : assessments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {assessments.map(a => (
                <Link key={a.id} to={`/store/assessments/${a.id}`} className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-md transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <BarChart2 size={20} className="text-brand-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-corp-dark text-base mb-1 group-hover:text-brand-primary transition-colors">{a[`title_${lang}`] || a.title_ar}</h3>
                      <p className="text-slate-500 text-xs line-clamp-2 mb-3">{a[`description_${lang}`] || a.description_ar}</p>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{a.duration_minutes} {translations.assessment.minutes[lang]}</span>
                        {a.is_free ? <span className="text-brand-accent font-bold">{translations.store.free[lang]}</span> : <span className="font-bold text-corp-dark">{a.price} {translations.common.currency[lang]}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">{lang === 'ar' ? 'لا توجد تقييمات بعد' : 'No assessments yet'}</div>
          )}
        </div>
      </section>

      {/* Free products */}
      <section className="py-14 px-6" style={{ background: 'linear-gradient(135deg, #f0fdf8, #e8f4fd)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-black text-corp-dark text-2xl">{lang === 'ar' ? 'موارد مجانية' : 'Free Resources'}</h2>
            <Link to="/store/products?category=free" className="text-brand-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">{translations.common.viewAll[lang]} <Arrow size={13} /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse"></div>)}</div>
          ) : free.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {free.map(p => (
                <Link key={p.id} to={`/store/products/${p.id}`} className="bg-white rounded-2xl p-5 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-3"><Download size={16} className="text-brand-accent" /></div>
                  <h4 className="font-heading font-bold text-corp-dark text-sm mb-1 group-hover:text-brand-primary transition-colors">{p[`title_${lang}`] || p.title_ar}</h4>
                  <span className="text-brand-accent text-xs font-bold">{translations.common.free[lang]}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">{lang === 'ar' ? 'لا توجد موارد مجانية بعد' : 'No free resources yet'}</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-corp-dark">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-black text-white text-2xl md:text-3xl mb-3">{lang === 'ar' ? 'لا تجد ما تبحث عنه؟' : "Can't find what you're looking for?"}</h2>
          <p className="text-white/50 mb-6">{lang === 'ar' ? 'تواصل مع فريقنا لحل مخصص' : 'Contact our team for a custom solution'}</p>
          <Link to="/consultation" className="btn-catalyst px-8 py-3 rounded-xl inline-flex items-center gap-2">{translations.nav.consultation[lang]} <Arrow size={15} /></Link>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
}

function ProductCard({ product, lang }) {
  return (
    <Link to={`/store/products/${product.id}`} className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all group">
      <div className="h-40 bg-gradient-to-br from-brand-primary/10 to-brand-accent/5 flex items-center justify-center relative">
        {product.cover_image_url ? <img src={product.cover_image_url} alt="" className="w-full h-full object-cover" /> : <Package size={32} className="text-brand-primary/30" />}
        {product.is_featured && <span className="absolute top-3 start-3 bg-brand-accent text-corp-dark text-xs font-bold px-2.5 py-1 rounded-full">{translations.store.featured[lang]}</span>}
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-corp-dark text-base mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">{product[`title_${lang}`] || product.title_ar}</h3>
        <div className="flex items-center justify-between">
          {product.is_free
            ? <span className="text-brand-accent font-bold text-sm">{translations.store.free[lang]}</span>
            : <span className="font-heading font-black text-corp-dark">{product.price?.toLocaleString()} <span className="text-slate-400 text-xs font-normal">{translations.common.currency[lang]}</span></span>}
        </div>
      </div>
    </Link>
  );
}