import React, { useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { CheckCircle, Mail, Phone, MessageCircle, Clock, Shield, Users } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';
import { base44 } from '@/api/base44Client';

const CLIENT_TYPES = [
  { value: 'individual', ar: 'فرد', en: 'Individual' },
  { value: 'leader', ar: 'قائد / مدير تنفيذي', en: 'Leader / Executive' },
  { value: 'company', ar: 'شركة', en: 'Company' },
  { value: 'government', ar: 'جهة حكومية', en: 'Government Entity' },
  { value: 'nonprofit', ar: 'منظمة غير ربحية', en: 'Non-profit Organization' },
  { value: 'hr', ar: 'متخصص موارد بشرية', en: 'HR Department' },
];

const NEED_TYPES = [
  { value: 'org-consulting', ar: 'استشارات مؤسسية', en: 'Organizational Consulting' },
  { value: 'exec-coaching', ar: 'تدريب تنفيذي', en: 'Executive Coaching' },
  { value: 'leadership', ar: 'برنامج قيادة', en: 'Leadership Program' },
  { value: 'competency', ar: 'تقييم الكفاءات', en: 'Competency Assessment' },
  { value: 'tool-design', ar: 'تصميم أداة أو تقييم مخصص', en: 'Custom Tool or Assessment' },
  { value: 'training', ar: 'تدريب / ورشة عمل', en: 'Training / Workshop' },
  { value: 'unsure', ar: 'لست متأكداً بعد', en: 'Not Sure Yet' },
];

export default function Consultation() {
  const { lang, isRTL } = useLang();
  const t = translations.consultation;
  const [form, setForm] = useState({
    full_name: '', email: '', mobile: '', organization: '', job_title: '',
    client_type: '', need_type: '', description: '', budget: '', preferred_time: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ConsultationRequest.create({ ...form, status: 'new' });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return (
    <div className="bg-corp-dark min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <CorpNavbar />
      <div className="flex items-center justify-center min-h-screen px-6 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 rounded-full bg-brand-accent/20 border-2 border-brand-accent/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-brand-accent" />
          </div>
          <h2 className="font-heading font-black text-white text-3xl mb-3">{t.successTitle[lang]}</h2>
          <p className="text-white/60 text-lg mb-6">{t.successMsg[lang]}</p>
          <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
            <Clock size={14} />
            <span>{lang === 'ar' ? 'سيتواصل معك فريقنا خلال ٢٤ ساعة' : 'Our team will contact you within 24 hours'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-corp-dark min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <CorpNavbar />

      {/* Hero */}
      <section className="pt-28 pb-10 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'}</p>
          <h1 className="font-heading font-black text-4xl md:text-5xl text-white mb-4">{t.title[lang]}</h1>
          <p className="text-white/60">{t.subtitle[lang]}</p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-4 px-6">
        <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-4">
          {[
            { icon: Clock, ar: 'رد خلال ٢٤ ساعة', en: 'Response within 24 hours' },
            { icon: Shield, ar: 'معلوماتك محمية وسرية', en: 'Your info is private & confidential' },
            { icon: Users, ar: 'خبرة +١٥ سنة', en: '+15 years experience' },
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-corp-surface/30">
                <Icon size={13} className="text-brand-accent" />
                <span className="text-white/60 text-xs">{b[lang]}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Form */}
      <section className="py-8 px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-corp-surface/40 rounded-3xl p-8 border border-white/10 space-y-6">

            {/* Personal Info */}
            <div>
              <h3 className="font-heading font-bold text-white mb-4">{lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'full_name', label: { ar: 'الاسم الكامل *', en: 'Full Name *' }, req: true },
                  { key: 'email', label: { ar: 'البريد الإلكتروني *', en: 'Email *' }, type: 'email', req: true },
                  { key: 'mobile', label: { ar: 'رقم الجوال', en: 'Mobile Number' } },
                  { key: 'job_title', label: { ar: 'المسمى الوظيفي', en: 'Job Title' } },
                  { key: 'organization', label: { ar: 'الشركة / المنظمة', en: 'Company / Organization' }, full: true },
                ].map(f => (
                  <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                    <label className="block text-white/70 text-sm font-medium mb-2">{f.label[lang]}</label>
                    <input type={f.type || 'text'} value={form[f.key]} onChange={e => set(f.key, e.target.value)} required={f.req}
                      className="w-full bg-corp-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-accent/50 placeholder:text-white/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Client Type */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-3">{lang === 'ar' ? 'نوع العميل' : 'Client Type'}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CLIENT_TYPES.map(c => (
                  <button key={c.value} type="button" onClick={() => set('client_type', c.value)}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-start ${form.client_type === c.value ? 'border-brand-accent bg-brand-accent/10 text-white' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'}`}>
                    {c[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Need Type */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-3">{lang === 'ar' ? 'نوع الاحتياج' : 'Type of Need'}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NEED_TYPES.map(n => (
                  <button key={n.value} type="button" onClick={() => set('need_type', n.value)}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-start ${form.need_type === n.value ? 'border-brand-accent bg-brand-accent/10 text-white' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'}`}>
                    {n[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                {lang === 'ar' ? 'وصف مختصر للاحتياج' : 'Brief Description of the Need'}
              </label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
                className="w-full bg-corp-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-brand-accent/50 placeholder:text-white/20 transition-colors"
                placeholder={lang === 'ar' ? 'شاركنا تحديك أو فرصتك بإيجاز...' : 'Share your challenge or opportunity briefly...'} />
            </div>

            {/* Budget & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {lang === 'ar' ? 'الميزانية التقريبية (إن وُجدت)' : 'Approximate Budget (if available)'}
                </label>
                <input value={form.budget} onChange={e => set('budget', e.target.value)}
                  className="w-full bg-corp-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-accent/50 placeholder:text-white/20 transition-colors"
                  placeholder={lang === 'ar' ? 'مثال: ٥٠,٠٠٠ - ١٠٠,٠٠٠ ر.س' : 'e.g. 50,000 - 100,000 SAR'} />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {lang === 'ar' ? 'وقت التواصل المفضل' : 'Preferred Contact Time'}
                </label>
                <input value={form.preferred_time} onChange={e => set('preferred_time', e.target.value)}
                  className="w-full bg-corp-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-accent/50 placeholder:text-white/20 transition-colors"
                  placeholder={lang === 'ar' ? 'مثال: صباحاً أيام الأسبوع' : 'e.g. Weekday mornings'} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-catalyst w-full py-4 rounded-2xl font-heading font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2 transition-all">
              {loading
                ? <div className="w-5 h-5 border-2 border-corp-dark/30 border-t-corp-dark rounded-full animate-spin"></div>
                : (lang === 'ar' ? 'إرسال طلب الاستشارة' : 'Submit Consultation Request')}
            </button>
          </form>

          {/* Direct Contact */}
          <div className="mt-6">
            <p className="text-white/30 text-xs text-center mb-4">{lang === 'ar' ? 'أو تواصل معنا مباشرة' : 'Or contact us directly'}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="mailto:info@optivance.sa" className="flex-1 flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-corp-surface/30 hover:border-brand-accent/30 transition-all group">
                <Mail size={16} className="text-brand-accent" />
                <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">info@optivance.sa</span>
              </a>
              <a href="tel:+966500000000" className="flex-1 flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-corp-surface/30 hover:border-brand-accent/30 transition-all group">
                <Phone size={16} className="text-brand-accent" />
                <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">+966 50 000 0000</span>
              </a>
              <a href="https://wa.me/966500000000" className="flex-1 flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-corp-surface/30 hover:border-brand-accent/30 transition-all group">
                <MessageCircle size={16} className="text-brand-accent" />
                <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <CorpFooter />
    </div>
  );
}