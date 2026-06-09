import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { Package, Download, ShoppingCart, ArrowLeft, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function ProductDetail() {
  const { id } = useParams();
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.Product.filter({ id }),
      base44.auth.isAuthenticated().then(async authed => authed ? base44.auth.me() : null),
    ]).then(([prods, me]) => { if (prods[0]) setProduct(prods[0]); setUser(me); setLoading(false); });
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/store/login?redirect=' + encodeURIComponent(`/store/products/${id}`)); return; }
    const carts = await base44.entities.Cart.filter({ user_id: user.id });
    const items = carts[0]?.items || [];
    if (!items.find(i => i.product_id === product.id)) {
      const newItems = [...items, { product_id: product.id, title_ar: product.title_ar, title_en: product.title_en, price: product.price, quantity: 1 }];
      if (carts[0]) await base44.entities.Cart.update(carts[0].id, { items: newItems });
      else await base44.entities.Cart.create({ user_id: user.id, user_email: user.email, items: newItems });
    }
    setAddedToCart(true);
  };

  const handleFreeDownload = async () => {
    if (!user) { navigate('/store/login?redirect=' + encodeURIComponent(`/store/products/${id}`)); return; }
    setDownloading(true);
    await base44.entities.FreeDownload.create({ user_id: user.id, user_email: user.email, product_id: product.id, product_title_ar: product.title_ar, product_title_en: product.title_en });
    if (product.file_url) window.open(product.file_url, '_blank');
    setDownloading(false);
  };

  if (loading) return <div className="min-h-screen bg-store-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div></div>;
  if (!product) return null;

  const title = product[`title_${lang}`] || product.title_ar;
  const description = product[`description_${lang}`] || product.description_ar || '';
  const targetAudience = product[`target_audience_${lang}`] || product.target_audience_ar || '';
  const deliverables = product[`deliverables_${lang}`] || product.deliverables_ar || '';

  return (
    <div className="bg-store-bg min-h-screen">
      <StoreNavbar />
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <Link to="/store/products" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary text-sm transition-colors">
            <BackArrow size={14} />{lang === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
          </Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-64 rounded-3xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/5 flex items-center justify-center mb-6 overflow-hidden">
              {product.cover_image_url ? <img src={product.cover_image_url} alt={title} className="w-full h-full object-cover" /> : <Package size={48} className="text-brand-primary/20" />}
            </div>
            <h1 className="font-heading font-black text-corp-dark text-3xl mb-4">{title}</h1>
            <p className="text-slate-600 leading-relaxed mb-6">{description}</p>
            {targetAudience && (
              <div className="bg-white rounded-2xl p-5 mb-4">
                <h3 className="font-heading font-bold text-corp-dark text-sm mb-2">{lang === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}</h3>
                <p className="text-slate-600 text-sm">{targetAudience}</p>
              </div>
            )}
            {deliverables && (
              <div className="bg-white rounded-2xl p-5">
                <h3 className="font-heading font-bold text-corp-dark text-sm mb-3">{lang === 'ar' ? 'ما ستحصل عليه' : 'What You Get'}</h3>
                <div className="flex flex-col gap-2">
                  {deliverables.split('\n').filter(Boolean).map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle size={13} className="text-brand-accent flex-shrink-0" /> {d}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-24">
              <div className="text-center mb-5">
                {product.is_free
                  ? <div className="text-3xl font-heading font-black text-brand-accent">{translations.common.free[lang]}</div>
                  : <><div className="text-4xl font-heading font-black text-corp-dark">{product.price?.toLocaleString()}</div><div className="text-slate-400 text-sm">{translations.common.currency[lang]}</div></>}
              </div>
              {product.is_free ? (
                <button onClick={handleFreeDownload} disabled={downloading} className="btn-catalyst w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base mb-4 disabled:opacity-70">
                  <Download size={16} />{downloading ? '...' : translations.store.freeDownload[lang]}
                </button>
              ) : (
                <div className="space-y-3 mb-4">
                  {addedToCart
                    ? <Link to="/store/cart" className="btn-catalyst w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base">{lang === 'ar' ? 'عرض السلة' : 'View Cart'} <Arrow size={15} /></Link>
                    : <button onClick={handleAddToCart} className="btn-catalyst w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base"><ShoppingCart size={16} /> {translations.store.addToCart[lang]}</button>}
                  {!user && <p className="text-xs text-center text-slate-400"><Lock size={10} className="inline me-1" />{lang === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Login required'}</p>}
                </div>
              )}
              <Link to="/consultation" className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm text-center flex items-center justify-center gap-2 hover:border-brand-primary/50 hover:text-brand-primary transition-all">
                {lang === 'ar' ? 'استشر خبيراً' : 'Consult an Expert'}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}