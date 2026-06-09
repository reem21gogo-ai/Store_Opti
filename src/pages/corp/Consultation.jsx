import React, { useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { CheckCircle, Mail, Phone } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';
import { base44 } from '@/api/base44Client';

export default function Consultation() {
  const { lang } = useLang();
  const t = translations.consultation;
  const [form, setForm] = useState({ full_name: '', email: '', mobile: '', organization: '', job_title: '', client_type: '', need_type: '', description: '', budget: '', preferred_time: '' });
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
    <div className="bg-corp-dark min-h-screen">
      <CorpNavbar />
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-brand-accent/20 border-2 border-brand-accent/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-brand-accent" />
          </div>
          <h2 className="font-heading font-black text-white text-3xl mb-3">{t.successTitle[lang]}</h2>
          <p className="text-white/60 text-lg">{t.successMsg[lang]}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-corp-dark min-h-screen">
      <CorpNavbar />
      <section className="pt-28 pb-8 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{t.title[lang]}</p>
          <h1 className="font-heading font-black text-4xl md:text-5xl text-white mb-4">{t.title[lang]}</h1>
          <p className="text-white/60">{t.subtitle[lang]}</p>
        </div>
      </section>
      <section className="py-10 px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-corp-surface/40 rounded-3xl p-8 border border-white/10 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'full_name', label: t.fullName[lang], req: true },
                { key: 'email', label: t.email[lang], type: 'email', req: true },
                { key: 'mobile', label: t.mobile[lang] },
                { key: 'organization', label: t.organization[lang] },
                { key: 'job_title', label: t.jobTitle[lang] },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-white/70 text-sm font-medium mb-2">{f.label}{f.req ? ' *' : ''}</label>
                  <input type={f.type || 'text'} value={form[f.key]} onChange={e => set(f.key, e.target.value)} required={f.req}
                    className="w-full bg-corp-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-accent/50" />
                </div>
              ))}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">{t.clientType[lang]}</label>
                <select value={form.client_type} onChange={e => set('client_type', e.target.value)}
                  className="w-full bg-corp-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-accent/50">
                  <option value="">--</option>
                  {t.clientTypes.map(c => <option key={c.value} value={c.value}>{c[lang]}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">{t.needType[lang]}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {t.needTypes.map(n => (
                  <button key={n.value} type="button" onClick={() => set('need_type', n.value)}
                    className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all text-start ${form.need_type === n.value ? 'border-brand-accent bg-brand-accent/10 text-white' : 'border-white/10 text-white/50 hover:border-white/30'}`}>
                    {n[lang]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">{t.description[lang]}</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
                className="w-full bg-corp-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-brand-accent/50"
                placeholder={lang === 'ar' ? 'شاركنا تحديك أو فرصتك...' : 'Share your challenge or opportunity...'} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">{t.budget[lang]}</label>
                <input value={form.budget} onChange={e => set('budget', e.target.value)}
                  className="w-full bg-corp-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-accent/50"
                  placeholder={lang === 'ar' ? 'مثال: ٥٠,٠٠٠ - ١٠٠,٠٠٠ ر.س' : 'e.g. 50,000 - 100,000 SAR'} />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">{t.preferredTime[lang]}</label>
                <input value={form.preferred_time} onChange={e => set('preferred_time', e.target.value)}
                  className="w-full bg-corp-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-accent/50"
                  placeholder={lang === 'ar' ? 'مثال: صباحاً أيام الأسبوع' : 'e.g. Weekday mornings'} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-catalyst w-full py-4 rounded-2xl font-heading font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-corp-dark/30 border-t-corp-dark rounded-full animate-spin"></div> : translations.common.submit[lang]}
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <a href="mailto:info@optivance.sa" className="flex-1 flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-corp-surface/30 hover:border-brand-accent/30 transition-all">
              <Mail size={16} className="text-brand-accent" /><span className="text-white/60 text-sm">info@optivance.sa</span>
            </a>
            <a href="tel:+966500000000" className="flex-1 flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-corp-surface/30 hover:border-brand-accent/30 transition-all">
              <Phone size={16} className="text-brand-accent" /><span className="text-white/60 text-sm">+966 50 000 0000</span>
            </a>
          </div>
        </div>
      </section>
      <CorpFooter />
    </div>
  );
}