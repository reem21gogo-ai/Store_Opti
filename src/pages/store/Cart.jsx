import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Package } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function Cart() {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async authed => {
      if (!authed) { navigate('/store/login?redirect=/store/cart'); return; }
      const me = await base44.auth.me();
      const carts = await base44.entities.Cart.filter({ user_id: me.id });
      setCart(carts[0] || null); setLoading(false);
    });
  }, []);

  const removeItem = async (productId) => {
    if (!cart) return;
    const items = (cart.items || []).filter(i => i.product_id !== productId);
    await base44.entities.Cart.update(cart.id, { items });
    setCart({ ...cart, items });
  };

  const items = cart?.items || [];
  const total = items.reduce((s, i) => s + (i.price || 0), 0);

  if (loading) return <div className="min-h-screen bg-store-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-store-bg min-h-screen">
      <StoreNavbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-heading font-black text-corp-dark text-3xl mb-8 flex items-center gap-3"><ShoppingCart size={26} /> {translations.store.cart[lang]}</h1>
        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart size={40} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-400 mb-5">{lang === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}</p>
            <Link to="/store/products" className="btn-authority px-6 py-3 rounded-xl text-sm">{translations.store.products[lang]}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center"><Package size={18} className="text-brand-primary" /></div>
                    <div>
                      <div className="font-medium text-corp-dark text-sm">{item[`title_${lang}`] || item.title_ar}</div>
                      <div className="text-slate-400 text-xs">{item.price?.toLocaleString()} {translations.common.currency[lang]}</div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product_id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-24">
                <h3 className="font-heading font-bold text-corp-dark text-base mb-5">{lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h3>
                <div className="flex justify-between text-sm text-slate-600 mb-2"><span>{lang === 'ar' ? 'المجموع' : 'Subtotal'}</span><span>{total.toLocaleString()} {translations.common.currency[lang]}</span></div>
                <div className="border-t border-slate-100 my-4"></div>
                <div className="flex justify-between font-heading font-black text-corp-dark mb-6"><span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span><span>{total.toLocaleString()} {translations.common.currency[lang]}</span></div>
                <Link to="/store/checkout" className="btn-catalyst w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm">{translations.store.checkout[lang]} <Arrow size={14} /></Link>
                <Link to="/store/products" className="mt-3 w-full py-2.5 text-center text-slate-500 text-sm hover:text-brand-primary block transition-colors">{lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}</Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <StoreFooter />
    </div>
  );
}