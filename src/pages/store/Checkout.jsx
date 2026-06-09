import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { CreditCard, CheckCircle, Lock } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function Checkout() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async authed => {
      if (!authed) { navigate('/store/login?redirect=/store/checkout'); return; }
      const me = await base44.auth.me();
      setUser(me);
      const carts = await base44.entities.Cart.filter({ user_id: me.id });
      if (!carts[0] || !carts[0].items?.length) { navigate('/store/cart'); return; }
      setCart(carts[0]); setLoading(false);
    });
  }, []);

  const handlePlaceOrder = async () => {
    setProcessing(true);
    const total = (cart?.items || []).reduce((s, i) => s + (i.price || 0), 0);
    await base44.entities.Order.create({ user_id: user.id, user_email: user.email, user_name: user.full_name, items: cart.items, total_amount: total, currency: 'SAR', status: 'pending' });
    await base44.entities.Cart.update(cart.id, { items: [] });
    setOrderPlaced(true); setProcessing(false);
  };

  if (loading) return <div className="min-h-screen bg-store-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div></div>;

  if (orderPlaced) return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-10 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-5"><CheckCircle size={30} className="text-brand-accent" /></div>
        <h2 className="font-heading font-black text-corp-dark text-2xl mb-3">{lang === 'ar' ? 'تم استلام طلبك!' : 'Order Received!'}</h2>
        <p className="text-slate-500 text-sm mb-6">{lang === 'ar' ? 'سيتم تفعيل منتجاتك بعد اكتمال الدفع.' : 'Your products will be activated once payment is complete.'}</p>
        <Link to="/store/account" className="btn-authority px-8 py-3 rounded-xl inline-block">{translations.nav.account[lang]}</Link>
      </div>
    </div>
  );

  const items = cart?.items || [];
  const total = items.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <div className="bg-store-bg min-h-screen">
      <StoreNavbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-heading font-black text-corp-dark text-3xl mb-8">{translations.store.checkout[lang]}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-heading font-bold text-corp-dark text-base mb-4">{lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h3>
            <div className="space-y-3 mb-5">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item[`title_${lang}`] || item.title_ar}</span>
                  <span className="font-medium text-corp-dark">{item.price?.toLocaleString()} {translations.common.currency[lang]}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between font-heading font-black text-corp-dark">
              <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <span>{total.toLocaleString()} {translations.common.currency[lang]}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-heading font-bold text-corp-dark text-base mb-4">{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h3>
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-3"><Lock size={12} /> {lang === 'ar' ? 'دفع آمن عبر Tap Payments' : 'Secure payment via Tap Payments'}</div>
              <div className="space-y-3">
                <input placeholder={lang === 'ar' ? 'رقم البطاقة' : 'Card number'} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder={lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry'} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" />
                  <input placeholder="CVV" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" />
                </div>
              </div>
            </div>
            <button onClick={handlePlaceOrder} disabled={processing}
              className="btn-catalyst w-full py-4 rounded-xl flex items-center justify-center gap-2 font-heading font-bold disabled:opacity-60">
              {processing ? <div className="w-5 h-5 border-2 border-corp-dark/30 border-t-corp-dark rounded-full animate-spin"></div> : <><CreditCard size={16} /> {lang === 'ar' ? `ادفع ${total.toLocaleString()} ${translations.common.currency[lang]}` : `Pay ${total.toLocaleString()} ${translations.common.currency[lang]}`}</>}
            </button>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}