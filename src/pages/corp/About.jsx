import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { Target, Eye, Heart, Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

export default function About() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const values = lang === 'ar'
    ? [{ icon: Target, title: 'التميز', desc: 'نسعى دائماً للتفوق في كل ما نقدمه' }, { icon: Heart, title: 'الإنسانية', desc: 'نضع الإنسان في قلب كل قرار' }, { icon: Lightbulb, title: 'الابتكار', desc: 'نؤمن بالبحث المستمر عن حلول جديدة' }, { icon: Eye, title: 'الشفافية', desc: 'نعمل بوضوح وصدق تام مع عملائنا' }]
    : [{ icon: Target, title: 'Excellence', desc: 'We always strive to excel in everything we do' }, { icon: Heart, title: 'Humanity', desc: 'We place people at the heart of every decision' }, { icon: Lightbulb, title: 'Innovation', desc: 'We continuously seek new and better solutions' }, { icon: Eye, title: 'Transparency', desc: 'We work with complete honesty with our clients' }];

  const approach = lang === 'ar'
    ? [{ title: 'الناس', desc: 'لأن التغيير الحقيقي يبدأ بالأفراد — قادةً وفرقاً ومنظمات.' }, { title: 'الاستراتيجية', desc: 'لأن الأهداف بدون خارطة طريق واضحة تبقى أمنيات.' }, { title: 'القياس', desc: 'لأن ما لا يُقاس لا يُحسَّن — ونحن نقيس كل خطوة.' }]
    : [{ title: 'People', desc: 'Because real change starts with individuals — leaders, teams, and organizations.' }, { title: 'Strategy', desc: 'Because goals without a clear roadmap remain wishes.' }, { title: 'Measurement', desc: 'Because what cannot be measured cannot be improved.' }];

  return (
    <div className="bg-corp-dark min-h-screen">
      <CorpNavbar />
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{translations.nav.about[lang]}</p>
          <h1 className="font-heading font-black text-4xl md:text-6xl text-white leading-tight mb-6">{lang === 'ar' ? 'نحن أوبتيفانس' : 'We Are OPTIVANCE'}</h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'شركة استشارية متخصصة في بناء المؤسسات الرائدة وتطوير القادة المؤثرين. نجمع بين عمق الخبرة الاستراتيجية وروح الابتكار والمنهجية المبنية على القياس.'
              : 'A consulting firm specialized in building leading organizations and developing impactful leaders. We combine strategic expertise, innovation, and measurement-based methodology.'}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-corp-surface/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { icon: Eye, title: lang === 'ar' ? 'رؤيتنا' : 'Our Vision', text: lang === 'ar' ? 'أن نكون الشريك الاستشاري الأول في المنطقة لبناء المؤسسات القادرة على التكيف والنمو المستدام.' : 'To be the premier consulting partner in the region for building organizations capable of adaptation and sustainable growth.' },
            { icon: Target, title: lang === 'ar' ? 'رسالتنا' : 'Our Mission', text: lang === 'ar' ? 'تمكين المؤسسات والقادة من تحقيق أعلى مستويات الأداء والأثر من خلال حلول استشارية مبتكرة.' : 'Empowering organizations and leaders to achieve peak performance and impact through innovative consulting solutions.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-8 rounded-3xl bg-corp-dark border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-5">
                  <Icon size={18} className="text-brand-accent" />
                </div>
                <h2 className="font-heading font-black text-white text-2xl mb-4">{item.title}</h2>
                <p className="text-white/60 leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white">{lang === 'ar' ? 'قيمنا' : 'Our Values'}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-7 rounded-3xl border border-white/10 bg-corp-surface/40 hover:border-brand-accent/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-all">
                    <Icon size={18} className="text-brand-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-xl mb-2">{v.title}</h3>
                  <p className="text-white/50 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-corp-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'فلسفتنا' : 'Our Philosophy'}</p>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-12">
            {lang === 'ar' ? 'ثلاثة محاور لا تنفصل' : 'Three Inseparable Pillars'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approach.map((a, i) => (
              <div key={i} className="p-7 rounded-3xl bg-corp-dark border border-white/10 hover:border-brand-accent/30 transition-all">
                <div className="font-heading font-black text-6xl gradient-text mb-4">{i + 1}</div>
                <h3 className="font-heading font-bold text-white text-xl mb-3">{a.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-black text-3xl text-white mb-4">{lang === 'ar' ? 'هل نحن شريكك القادم؟' : 'Are We Your Next Partner?'}</h2>
          <p className="text-white/50 mb-8">{lang === 'ar' ? 'دعنا نتعرف على احتياجاتك' : 'Let us learn about your needs'}</p>
          <Link to="/consultation" className="btn-catalyst px-8 py-4 rounded-2xl inline-flex items-center gap-2">
            {translations.nav.consultation[lang]} <Arrow size={16} />
          </Link>
        </div>
      </section>
      <CorpFooter />
    </div>
  );
}