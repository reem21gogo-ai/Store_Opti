import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { ShoppingCart, User, Menu, X, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function StoreNavbar({ cartCount = 0 }) {
  const { lang, isRTL, toggleLang } = useLang();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const t = translations.nav;

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  const links = [
    { to: '/store', label: t.store[lang] },
    { to: '/store/products', label: translations.store.products[lang] },
    { to: '/store/assessments', label: translations.store.assessments[lang] },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/store" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-brand-primary flex items-center justify-center">
            <span className="text-white font-heading font-black text-xs">O</span>
          </div>
          <span className="font-heading font-black text-corp-dark text-base tracking-wider">OPTIVANCE</span>
          <span className="text-brand-accent text-xs font-medium hidden sm:block">{lang === 'ar' ? 'المتجر' : 'Store'}</span>
        </Link>
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === l.to ? 'text-brand-primary bg-brand-primary/5' : 'text-slate-600 hover:text-corp-dark hover:bg-slate-50'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={toggleLang} className="hidden md:flex items-center gap-1 text-slate-400 hover:text-brand-primary text-xs transition-colors">
            <Globe size={13} />{lang === 'ar' ? 'EN' : 'عر'}
          </button>
          <Link to="/store/cart" className="relative p-2 rounded-xl hover:bg-slate-50 transition-all">
            <ShoppingCart size={18} className="text-slate-600" />
            {cartCount > 0 && <span className="absolute -top-0.5 -end-0.5 w-4 h-4 rounded-full bg-brand-accent text-corp-dark text-xs font-bold flex items-center justify-center">{cartCount}</span>}
          </Link>
          {user ? (
            <Link to="/store/account" className="flex items-center gap-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-xl text-sm font-medium transition-all">
              <User size={14} /><span className="hidden sm:block">{user.full_name?.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link to="/store/login" className="btn-authority text-xs px-4 py-2 rounded-xl">{t.login[lang]}</Link>
          )}
          <button onClick={() => setOpen(!open)} className="md:hidden p-1 text-slate-600">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 pb-4 pt-2 flex flex-col gap-2">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2.5 text-slate-600 hover:text-brand-primary text-sm font-medium border-b border-slate-50">{l.label}</Link>
          ))}
          <button onClick={toggleLang} className="py-2 text-slate-500 text-sm text-start">{lang === 'ar' ? 'English' : 'عربي'}</button>
        </div>
      )}
    </header>
  );
}