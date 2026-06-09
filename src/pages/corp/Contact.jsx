import React, { useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const FAQS = {
  ar: [
    { q: 'ما مدة تنفيذ المشاريع الاستشارية؟', a: 'تتفاوت المدة بحسب نطاق المشروع، من أسابيع للتقييمات القصيرة إلى أشهر للبرامج الشاملة.' },
    { q: 'هل تعملون مع الأفراد أم المؤسسات فقط؟', a: 'نعمل مع الطرفين — القادة الأفراد والمؤسسات بمختلف أحجامها وقطاعاتها.' },
    { q: 'ما الفرق بين أوبتيفانس والشركات الاستشارية التقليدية؟', a: 'نجمع بين الخبرة الاستراتيجية والأدوات الرقمية والتركيز على القياس الحقيقي.' },
    { q: 'هل تتوفر برامج التدريب عن بُعد؟', a: 'نعم، نقدم برامجنا وجاهياً وعن بُعد بنفس الجودة العالية.' },
    { q: 'كيف أبدأ؟', a: 'ببساطة، أرسل لنا طلب استشارة وسيتواصل معك فريقنا خلال 24 ساعة.' },
  ],
  en: [
    { q: 'How long does a consulting project take?', a: 'Duration varies by scope, from weeks for short assessments to months for comprehensive programs.' },
    { q: 'Do you work with individuals or only organizations?', a: 'We work with both — individual leaders and organizations of all sizes and sectors.' },
    { q: 'What differentiates OPTIVANCE from traditional consulting firms?', a: 'We combine strategic expertise, digital tools, and a focus on real measurement.' },
    { q: 'Are remote training programs available?', a: 'Yes, we deliver programs both in-person and remotely with the same high quality.' },
    { q: 'How do I get started?', a: 'Simply send us a consultation request and our team will contact you within 24 hours.' },
  ],
};

export default function Contact() {
  const { lang } = useLang();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-corp-dark min-h-screen">
      <CorpNavbar />
      <section className="pt-28 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{translations.nav.contact[lang]}</p>
          <h1 className="font-heading font-black text-4xl md:text-5xl text-white mb-4">{lang === 'ar' ? 'تواصل معنا' : 'Get in Touch'}</h1>
        </div>
      </section>

      <section className="py-10 px-6 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-heading font-bold text-white text-xl mb-6">{lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}</h2>
            <div className="space-y-4 mb-8">
              {[
                { Icon: Mail, label: 'info@optivance.sa', href: 'mailto:info@optivance.sa' },
                { Icon: Phone, label: '+966 50 000 0000', href: 'tel:+966500000000' },
                { Icon: MapPin, label: lang === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia', href: '#' },
              ].map((item, i) => (
                <a key={i} href={item.href} className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-corp-surface/40 hover:border-brand-accent/30 transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-brand-accent/10 flex items-center justify-center">
                    <item.Icon size={15} className="text-brand-accent" />
                  </div>
                  <span className="text-white/70 text-sm group-hover:text-white transition-colors">{item.label}</span>
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-accent/20 flex items-center justify-center transition-all">
                  <Icon size={15} className="text-white/60" />
                </a>
              ))}
            </div>
          </div>

          <div>
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle size={40} className="text-brand-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold text-white text-xl mb-2">{lang === 'ar' ? 'تم إرسال رسالتك!' : 'Message Sent!'}</h3>
                <p className="text-white/50 text-sm">{lang === 'ar' ? 'سنتواصل معك قريباً' : "We'll get back to you soon"}</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
                {[{ k: 'name', label: lang === 'ar' ? 'الاسم' : 'Name' }, { k: 'email', label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', type: 'email' }].map(f => (
                  <div key={f.k}>
                    <label className="block text-white/70 text-sm font-medium mb-2">{f.label}</label>
                    <input type={f.type || 'text'} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} required
                      className="w-full bg-corp-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-accent/50" />
                  </div>
                ))}
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">{lang === 'ar' ? 'رسالتك' : 'Your Message'}</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} required
                    className="w-full bg-corp-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-brand-accent/50" />
                </div>
                <button type="submit" className="btn-catalyst w-full py-3 rounded-xl">{translations.common.submit[lang]}</button>
              </form>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="font-heading font-black text-white text-2xl text-center mb-8">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</h2>
          <div className="space-y-3">
            {FAQS[lang].map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-start hover:bg-corp-surface/40 transition-all">
                  <span className="font-medium text-white text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-brand-accent flex-shrink-0" /> : <ChevronDown size={16} className="text-white/40 flex-shrink-0" />}
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-3">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CorpFooter />
    </div>
  );
}