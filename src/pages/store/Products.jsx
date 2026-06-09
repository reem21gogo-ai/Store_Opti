import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations, productCategories } from '@/lib/i18n';
import { Package, Search, Download } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function Products() {
  const { lang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const filter = { is_published: true };
    if (activeCategory !== 'all') filter.category = activeCategory;
    base44.entities.Product.filter(filter, '-created_date', 50).then(data => { setProducts(data); setLoading(false); });
  }, [activeCategory]);

  const filtered = products.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.title_ar || '').toLowerCase().includes(q) || (p.title_en || '').toLowerCase().includes(q);
  });

  return (
    <div className="bg-store-bg min-h-screen">
      <StoreNavbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-black text-corp-dark text-3xl">{translations.store.products[lang]}</h1>
            <p className="text-slate-500 text-sm mt-1">{filtered.length} {lang === 'ar' ? 'منتج' : 'products'}</p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={translations.common.search[lang]}
              className="ps-9 pe-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-brand-primary w-full sm:w-64" />
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          <button onClick={() => setSearchParams({})}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-brand-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-primary/50'}`}>
            {translations.store.allCategories[lang]}
          </button>
          {productCategories.map(cat => (
            <button key={cat.value} onClick={() => setSearchParams({ category: cat.value })}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.value ? 'bg-brand-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-primary/50'}`}>
              {cat[lang]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-white rounded-3xl animate-pulse"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24"><Package size={36} className="mx-auto mb-4 text-slate-300" /><p className="text-slate-400">{lang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(p => (
              <Link key={p.id} to={`/store/products/${p.id}`} className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-44 bg-gradient-to-br from-brand-primary/10 to-brand-accent/5 flex items-center justify-center relative">
                  {p.cover_image_url ? <img src={p.cover_image_url} alt="" className="w-full h-full object-cover" /> : <Package size={28} className="text-brand-primary/20" />}
                  {p.is_free && <span className="absolute top-3 start-3 bg-brand-accent text-corp-dark text-xs font-bold px-2.5 py-1 rounded-full">{translations.common.free[lang]}</span>}
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-400 mb-1 capitalize">{p.category}</p>
                  <h3 className="font-heading font-bold text-corp-dark text-sm mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">{p[`title_${lang}`] || p.title_ar}</h3>
                  {p.is_free
                    ? <span className="text-brand-accent font-bold text-sm flex items-center gap-1"><Download size={12} /> {translations.common.free[lang]}</span>
                    : <span className="font-heading font-black text-corp-dark">{p.price?.toLocaleString()} <span className="text-slate-400 text-xs font-normal">{translations.common.currency[lang]}</span></span>}
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