import React, { useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, ChevronDown, ChevronUp, CheckCircle, MessageCircle, Send } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const FAQS = {
  ar: [
    { q: 'ما مدة تنفيذ المشاريع الاستشارية؟', a: 'تتفاوت المدة بحسب نطاق المشروع. من أسبوعين للتقييمات القصيرة إلى ٦ أشهر أو أكثر للبرامج الشاملة والاستشارات المؤسسية الكاملة.' },
    { q: 'هل تعملون مع الأفراد أم المؤسسات فقط؟', a: 'نعمل مع الطرفين — القادة والأفراد الساعون للتطوير الشخصي والمهني، والمؤسسات بمختلف أحجامها وقطاعاتها.' },
    { q: 'ما الفرق بين أوبتيفانس والشركات الاستشارية التقليدية؟', a: 'نجمع بين الخبرة الاستراتيجية العميقة والأدوات الرقمية والتركيز على القياس الحقيقي، مع منهجية ROUTE° الحصرية المسجَّلة التي توجه كل عمل نقوم به.' },
    { q: 'هل تتوفر برامج التدريب عن بُعد؟', a: 'نعم، نقدم برامجنا بثلاثة أشكال: وجاهي بالكامل، عن بُعد بالكامل، أو هجين — بنفس مستوى الجودة والأثر في جميع الحالات.' },
    { q: 'ما هي اعتمادات فريقكم؟', a: 'يحمل فريقنا اعتمادات من أبرز المنظمات العالمية منها: Harrison، NCDA، ICF، Gallup، Six Seconds، ATD، وغيرها.' },
    { q: 'كيف أبدأ؟', a: 'ببساطة، أرسل لنا طلب استشارة من خلال الصفحة المخصصة أو تواصل معنا مباشرة عبر البريد أو الهاتف، وسيتواصل معك فريقنا خلال ٢٤ ساعة.' },
  ],
  en: [
    { q: 'How long does a consulting project take?', a: 'Duration varies by scope — from 2 weeks for short assessments to 6 months or more for comprehensive programs and full institutional consulting.' },
    { q: 'Do you work with individuals or only organizations?', a: 'We work with both — leaders and individuals seeking personal and professional development, and organizations of all sizes and sectors.' },
    { q: 'What differentiates OPTIVANCE from traditional consulting firms?', a: 'We combine deep strategic expertise, digital tools, and a real measurement focus, guided by our registered exclusive ROUTE° methodology.' },
    { q: 'Are remote training programs available?', a: 'Yes, we deliver programs in three formats: fully in-person, fully remote, or hybrid — with the same quality and impact in all cases.' },
    { q: 'What are your team\'s accreditations?', a: 'Our team holds certifications from leading global organizations including: Harrison, NCDA, ICF, Gallup, Six Seconds, ATD, and others.' },
    { q: 'How do I get started?', a: 'Simply submit a consultation request through the dedicated page or contact us directly via email or phone, and our team will reach out within 24 hours.' },
  ],
};

export default function Contact() {
  const { lang, isRTL } = useLang();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="bg-corp-dark min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <CorpNavbar />

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</p>
          <h1 className="font-heading font-black text-4xl md:text-5xl text-white mb-4">
            {lang === 'ar' ? 'نحن هنا لك' : 'We Are Here for You'}
          </h1>
          <p className="text-white/60">
            {lang === 'ar' ? 'لأي سؤال أو استفسار، نحن جاهزون للمساعدة.' : 'For any question or inquiry, we are ready to help.'}
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div>
            <h2 className="font-heading font-bold text-white text-xl mb-6">
              {lang === 'ar' ? 'وسائل التواصل' : 'Contact Information'}
            </h2>
            <div className="space-y-3 mb-8">
              {[
                { Icon: Mail, label: 'info@optivance.sa', href: 'mailto:info@optivance.sa', sub: lang === 'ar' ? 'البريد الإلكتروني' : 'Email' },
                { Icon: Phone, label: '+966 50 000 0000', href: 'tel:+966500000000', sub: lang === 'ar' ? 'الهاتف' : 'Phone' },
                { Icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/966500000000', sub: lang === 'ar' ? 'واتساب' : 'WhatsApp' },
                { Icon: MapPin, label: lang === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia', href: '#', sub: lang === 'ar' ? 'الموقع' : 'Location' },
              ].map((item, i) => (
                <a key={i} href={item.href} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-corp-surface/40 hover:border-brand-accent/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent/20 transition-all">
                    <item.Icon size={16} className="text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">{item.sub}</p>
                    <p className="text-white/80 text-sm group-hover:text-white transition-colors">{item.label}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-white/40 text-xs mb-3">{lang === 'ar' ? 'تابعنا على وسائل التواصل' : 'Follow Us on Social Media'}</p>
              <div className="flex gap-3">
                {[
                  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { Icon: Twitter, href: '#', label: 'Twitter / X' },
                  { Icon: Instagram, href: '#', label: 'Instagram' },
                ].map((s, i) => (
                  <a key={i} href={s.href} title={s.label}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-accent/20 flex items-center justify-center transition-all group">
                    <s.Icon size={15} className="text-white/60 group-hover:text-brand-accent transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-heading font-bold text-white text-xl mb-6">
              {lang === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}
            </h2>
            {sent ? (
              <div className="text-center py-12 px-6 rounded-3xl border border-brand-accent/20 bg-corp-surface/40">
                <CheckCircle size={44} className="text-brand-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold text-white text-xl mb-2">
                  {lang === 'ar' ? 'تم إرسال رسالتك!' : 'Message Sent!'}
                </h3>
                <p className="text-white/50 text-sm">
                  {lang === 'ar' ? 'سنتواصل معك في أقرب وقت ممكن.' : "We'll get back to you as soon as possible."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { k: 'name', label: { ar: 'الاسم', en: 'Name' }, req: true },
                  { k: 'email', label: { ar: 'البريد الإلكتروني', en: 'Email' }, type: 'email', req: true },
                ].map(f => (
                  <div key={f.k}>
                    <label className="block text-white/70 text-sm font-medium mb-2">{f.label[lang]}</label>
                    <input type={f.type || 'text'} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} required={f.req}
                      className="w-full bg-corp-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-accent/50 placeholder:text-white/20 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">{lang === 'ar' ? 'رسالتك' : 'Your Message'}</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} required
                    className="w-full bg-corp-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-brand-accent/50 placeholder:text-white/20 transition-colors"
                    placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'} />
                </div>
                <button type="submit" disabled={loading}
                  className="btn-catalyst w-full py-3.5 rounded-xl font-heading font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-all">
                  {loading
                    ? <div className="w-4 h-4 border-2 border-corp-dark/30 border-t-corp-dark rounded-full animate-spin"></div>
                    : <><Send size={14} /> {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</p>
            <h2 className="font-heading font-black text-white text-2xl md:text-3xl">
              {lang === 'ar' ? 'أسئلة يطرحها عملاؤنا' : 'Questions Our Clients Ask'}
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS[lang].map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-start hover:bg-corp-surface/40 transition-all">
                  <span className="font-medium text-white text-sm leading-relaxed">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={16} className="text-brand-accent flex-shrink-0 ms-3" />
                    : <ChevronDown size={16} className="text-white/40 flex-shrink-0 ms-3" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CorpFooter />
    </div>
  );
}