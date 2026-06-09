import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { Menu, X, Globe } from 'lucide-react';

export default function CorpNavbar() {
  const { lang, toggleLang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const t = translations.nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: t.home[lang] },
    { to: '/about', label: t.about[lang] },
    { to: '/services', label: t.services[lang] },
    { to: '/methodology', label: t.methodology[lang] },
    { to: '/contact', label: t.contact[lang] },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-corp-dark/95 backdrop-blur-md shadow-xl' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #05E1AE, #1A3A5C)' }}>
            <span className="text-white font-heading font-black text-sm">O</span>
          </div>
          <span className="font-heading font-black text-white text-xl tracking-wider">OPTIVANCE</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link key={link.to} to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === link.to ? 'text-brand-accent' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleLang} className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
            <Globe size={14} />{lang === 'ar' ? 'EN' : 'عر'}
          </button>
          <Link to="/store" className="text-sm px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-all font-medium">
            {t.store[lang]}
          </Link>
          <Link to="/consultation" className="btn-catalyst text-sm px-4 py-2 rounded-xl">
            {t.consultation[lang]}
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleLang} className="text-white/70"><Globe size={16} /></button>
          <button onClick={() => setOpen(!open)} className="text-white p-1">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-corp-dark/98 backdrop-blur-md px-6 pb-6 pt-2 flex flex-col gap-2">
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
              className="py-3 text-white/80 hover:text-brand-accent text-sm font-medium border-b border-white/10">
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 mt-3">
            <Link to="/store" onClick={() => setOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-white/20 text-white/80 text-sm font-medium">{t.store[lang]}</Link>
            <Link to="/consultation" onClick={() => setOpen(false)} className="flex-1 text-center btn-catalyst py-2.5 rounded-xl text-sm">{t.consultation[lang]}</Link>
          </div>
        </div>
      )}
    </header>
  );
}