import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

const LOGO = 'https://media.base44.com/images/public/6a27c58ce09a421d00c705cf/91b07a8e4_logoVectorized.svg';
const CORP = 'https://opti-company-landeing-page.base44.app';

const SOCIALS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/optivn/', path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z' },
  { name: 'WhatsApp', url: 'https://wa.me/97333800163', path: 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5a9.42 9.42 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 0 1 9.43 9.44c0 5.2-4.23 9.42-9.44 9.42zM20.5 3.49A11.85 11.85 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88c0 2.1.55 4.14 1.59 5.94L0 24l6.33-1.66a11.83 11.83 0 0 0 5.71 1.46h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.43-8.43z' },
  { name: 'X', url: 'https://x.com/optiv_n', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { name: 'Instagram', url: 'https://www.instagram.com/optiv_n/', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' },
];

const CONTENT = {
  en: {
    desc: 'Strategic consulting, executive coaching, and digital development tools for leaders, professionals, and organizations.',
    company: 'Company',
    services: 'Services',
    store: 'Store',
    careers: 'Careers',
    companyLinks: [
      { label: 'About Us', href: `${CORP}/about` },
      { label: 'Services', href: `${CORP}/services` },
      { label: 'How We Work', href: `${CORP}/methodology` },
      { label: 'Contact', href: `${CORP}/contact` },
    ],
    serviceLinks: [
      { label: 'Organizational Consulting', href: `${CORP}/services` },
      { label: 'Executive Coaching', href: `${CORP}/services` },
      { label: 'Leadership Development', href: `${CORP}/services` },
      { label: 'Competency Assessment', href: `${CORP}/services` },
    ],
    storeLinks: [
      { label: 'All Products', to: '/store/products' },
      { label: 'Assessments', to: '/store/assessments' },
      { label: 'Leadership Tools', to: '/store/products?category=leadership' },
      { label: 'Free Resources', to: '/store/products?category=free' },
    ],
    careerLinks: [
      { label: 'Join Our Team', href: 'https://www.optivn.com/sign-up' },
      { label: 'Join as an Expert', href: 'https://docs.google.com/forms/d/e/1FAIpQLSfj7Nnl6xFm5_uQjzbIgCbbDsE6OEhPvV8ELqnL_H50DuYfzg/viewform' },
      { label: 'Partnerships', href: 'mailto:info@optivn.com?subject=Partnerships' },
    ],
    contact: { email: 'info@optivn.com', phone: '+966 55 501 6604', location: 'Riyadh, Saudi Arabia' },
    rights: 'OPTIVANCE CONSULTING. ALL RIGHTS RESERVED.',
    privacy: 'PRIVACY', terms: 'TERMS', cookies: 'COOKIES',
  },
  ar: {
    desc: 'استشارات استراتيجية وتدريب تنفيذي وأدوات تطوير رقمية للقادة والمحترفين والمؤسسات.',
    company: 'الشركة',
    services: 'الخدمات',
    store: 'المتجر',
    careers: 'فرص الانضمام',
    companyLinks: [
      { label: 'عن الشركة', href: `${CORP}/about` },
      { label: 'الخدمات', href: `${CORP}/services` },
      { label: 'كيف نعمل', href: `${CORP}/methodology` },
      { label: 'تواصل معنا', href: `${CORP}/contact` },
    ],
    serviceLinks: [
      { label: 'الاستشارة المؤسسية', href: `${CORP}/services` },
      { label: 'التدريب التنفيذي', href: `${CORP}/services` },
      { label: 'تطوير القيادة', href: `${CORP}/services` },
      { label: 'تقييم الكفاءات', href: `${CORP}/services` },
    ],
    storeLinks: [
      { label: 'جميع المنتجات', to: '/store/products' },
      { label: 'التقييمات', to: '/store/assessments' },
      { label: 'أدوات القيادة', to: '/store/products?category=leadership' },
      { label: 'موارد مجانية', to: '/store/products?category=free' },
    ],
    careerLinks: [
      { label: 'انضم لفريقنا', href: 'https://www.optivn.com/sign-up' },
      { label: 'انضم كخبير', href: 'https://docs.google.com/forms/d/e/1FAIpQLSfj7Nnl6xFm5_uQjzbIgCbbDsE6OEhPvV8ELqnL_H50DuYfzg/viewform' },
      { label: 'شراكات', href: 'mailto:info@optivn.com?subject=Partnerships' },
    ],
    contact: { email: 'info@optivn.com', phone: '+966 55 501 6604', location: 'الرياض، المملكة العربية السعودية' },
    rights: 'أوبتيفانس للاستشارات. جميع الحقوق محفوظة.',
    privacy: 'الخصوصية', terms: 'الشروط', cookies: 'الكوكيز',
  },
};

const linkCls = 'text-sm text-slate-500 hover:text-brand-primary transition-colors';

function Links({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i}>
          {item.to
            ? <Link to={item.to} className={linkCls}>{item.label}</Link>
            : <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkCls}>{item.label}</a>}
        </li>
      ))}
    </ul>
  );
}

function Column({ title, items }) {
  return (
    <div>
      <h4 className="text-xs font-bold mb-5 tracking-[0.15em] uppercase text-brand-primary">{title}</h4>
      <Links items={items} />
    </div>
  );
}

export default function StoreFooter() {
  const { lang, isRTL } = useLang();
  const c = CONTENT[lang === 'ar' ? 'ar' : 'en'];

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">

          <div className="lg:col-span-2">
            <Link to="/store" className="inline-block mb-6">
              <img src={LOGO} alt="OPTIVANCE" className="h-9 w-auto" />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">{c.desc}</p>
            <div className="space-y-3">
              <a href={`mailto:${c.contact.email}`} className="flex items-center gap-3 text-slate-500 hover:text-brand-primary text-sm transition-colors">
                <Mail size={15} className="text-corp-blue" />{c.contact.email}
              </a>
              <a href={`tel:${c.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-slate-500 hover:text-brand-primary text-sm transition-colors">
                <Phone size={15} className="text-corp-blue" />{c.contact.phone}
              </a>
              <span className="flex items-center gap-3 text-slate-500 text-sm">
                <MapPin size={15} className="text-corp-blue" />{c.contact.location}
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-6">
              {SOCIALS.map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-corp-blue hover:border-brand-primary/40 transition-all">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          <Column title={c.company} items={c.companyLinks} />
          <Column title={c.services} items={c.serviceLinks} />
          <Column title={c.store} items={c.storeLinks} />
          <Column title={c.careers} items={c.careerLinks} />
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} {c.rights}</p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span>{c.privacy}</span>
            <span>{c.terms}</span>
            <span>{c.cookies}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}