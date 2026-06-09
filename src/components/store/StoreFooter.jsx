import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';

export default function StoreFooter() {
  const { lang } = useLang();
  return (
    <footer className="bg-white border-t border-slate-100 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/store" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-primary flex items-center justify-center">
            <span className="text-white font-heading font-black text-xs">O</span>
          </div>
          <span className="font-heading font-black text-corp-dark text-sm tracking-wider">OPTIVANCE Store</span>
        </Link>
        <div className="flex gap-4 text-xs text-slate-400">
          <Link to="/store/products" className="hover:text-brand-primary">{translations.store.products[lang]}</Link>
          <Link to="/store/assessments" className="hover:text-brand-primary">{translations.store.assessments[lang]}</Link>
          <Link to="/store/account" className="hover:text-brand-primary">{translations.nav.account[lang]}</Link>
          <Link to="/" className="hover:text-brand-primary">{lang === 'ar' ? 'الموقع الرئيسي' : 'Main Site'}</Link>
        </div>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} OPTIVANCE</p>
      </div>
    </footer>
  );
}