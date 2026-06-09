import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';

export default function CorpFooter() {
  const { lang, isRTL } = useLang();

  const companyLinks = [
    { to: '/about',        en: 'About Us',             ar: 'من نحن' },
    { to: '/services',     en: 'Services',             ar: 'الخدمات' },
    { to: '/methodology',  en: 'How We Work',          ar: 'كيف نعمل' },
    { to: '/contact',      en: 'Contact',              ar: 'تواصل معنا' },
  ];

  const serviceLinks = [
    { to: '/services', en: 'Organizational Consulting', ar: 'الاستشارات المؤسسية' },
    { to: '/services', en: 'Executive Coaching',        ar: 'التوجيه التنفيذي' },
    { to: '/services', en: 'Leadership Development',    ar: 'تطوير القيادة' },
    { to: '/services', en: 'Competency Assessment',     ar: 'تقييم الكفاءات' },
  ];

  const storeLinks = [
    { to: '/store',              en: 'All Products',      ar: 'جميع المنتجات' },
    { to: '/store/assessments',  en: 'Assessments',       ar: 'التقييمات' },
    { to: '/store/products',     en: 'Leadership Tools',  ar: 'أدوات القيادة' },
    { to: '/store/products',     en: 'Free Resources',    ar: 'الموارد المجانية' },
  ];

  return (
    <footer dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#0D1F33', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand col — spans 2 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-heading font-black text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #05E1AE, #1A3A5C)' }}>O</div>
              <div>
                <div className="font-heading font-black text-white text-lg tracking-wider leading-none">OPTIVANCE</div>
                <div className="text-white/35 text-xs">Consulting</div>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-5">
              {lang === 'ar'
                ? 'استشارات استراتيجية، تدريب تنفيذي، وأدوات رقمية للتطوير للقادة والمهنيين والمؤسسات.'
                : 'Strategic consulting, executive coaching, and digital development tools for leaders, professionals, and organizations.'}
            </p>
            <div className="flex flex-col gap-2 mb-5">
              <a href="mailto:info@optivance.com" className="flex items-center gap-2 text-white/40 hover:text-brand-accent text-xs transition-colors">
                <Mail size={12} /> info@optivance.com
              </a>
              <a href="tel:+966500000000" className="flex items-center gap-2 text-white/40 hover:text-brand-accent text-xs transition-colors">
                <Phone size={12} /> +966 50 000 0000
              </a>
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <MapPin size={12} /> {lang === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
              </div>
            </div>
            <div className="flex gap-2">
              {([Linkedin, Twitter, Instagram]).map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon size={13} className="text-white/50" />
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-heading font-bold text-white/80 text-xs uppercase tracking-widest mb-5">
              {lang === 'ar' ? 'الشركة' : 'Company'}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((l, i) => (
                <li key={i}><Link to={l.to} className="text-white/40 hover:text-white/80 text-sm transition-colors">{l[lang]}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services links */}
          <div>
            <h4 className="font-heading font-bold text-white/80 text-xs uppercase tracking-widest mb-5">
              {lang === 'ar' ? 'الخدمات' : 'Services'}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map((l, i) => (
                <li key={i}><Link to={l.to} className="text-white/40 hover:text-white/80 text-sm transition-colors">{l[lang]}</Link></li>
              ))}
            </ul>
          </div>

          {/* Store links */}
          <div>
            <h4 className="font-heading font-bold text-white/80 text-xs uppercase tracking-widest mb-5">
              {lang === 'ar' ? 'المتجر الرقمي' : 'Digital Store'}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {storeLinks.map((l, i) => (
                <li key={i}><Link to={l.to} className="text-white/40 hover:text-white/80 text-sm transition-colors">{l[lang]}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} OPTIVANCE CONSULTING.{' '}
            {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'ALL RIGHTS RESERVED.'}
          </p>
          <div className="flex gap-4">
            {[
              { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
              { en: 'Terms of Use',   ar: 'شروط الاستخدام' },
            ].map((l, i) => (
              <span key={i} className="text-white/20 hover:text-white/45 text-xs cursor-pointer transition-colors">{l[lang]}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}