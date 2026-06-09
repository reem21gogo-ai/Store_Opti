import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { Mail, Phone, Linkedin, Twitter, Instagram } from 'lucide-react';

export default function CorpFooter() {
  const { lang } = useLang();
  const t = translations.nav;

  return (
    <footer className="bg-corp-dark text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #05E1AE, #1A3A5C)' }}>
                <span className="text-white font-heading font-black text-sm">O</span>
              </div>
              <span className="font-heading font-black text-2xl tracking-wider">OPTIVANCE</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              {lang === 'ar' ? 'شركاؤك في بناء المؤسسات الرائدة وتطوير القادة المؤثرين.' : 'Your partners in building leading organizations and developing impactful leaders.'}
            </p>
            <div className="flex gap-3 mt-4">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-accent/20 flex items-center justify-center transition-all">
                  <Icon size={15} className="text-white/60" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold text-white mb-4 text-sm">{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
            <div className="flex flex-col gap-2">
              {[{ to: '/about', label: t.about[lang] }, { to: '/services', label: t.services[lang] }, { to: '/methodology', label: t.methodology[lang] }, { to: '/consultation', label: t.consultation[lang] }, { to: '/store', label: t.store[lang] }].map(l => (
                <Link key={l.to} to={l.to} className="text-white/50 hover:text-brand-accent text-sm transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold text-white mb-4 text-sm">{t.contact[lang]}</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:info@optivance.sa" className="flex items-center gap-2 text-white/50 hover:text-brand-accent text-sm transition-colors"><Mail size={13} /> info@optivance.sa</a>
              <a href="tel:+966500000000" className="flex items-center gap-2 text-white/50 hover:text-brand-accent text-sm transition-colors"><Phone size={13} /> +966 50 000 0000</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6">
          <p className="text-white/30 text-xs text-center">© {new Date().getFullYear()} OPTIVANCE. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}