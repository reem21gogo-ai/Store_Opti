import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { ArrowRight, ArrowLeft, BarChart2, Users, Target, Lightbulb, ChevronDown } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const stats = [
  { ar: '+٥٠٠', en: '+500', label: { ar: 'قائد ومدير', en: 'Leaders Served' } },
  { ar: '+١٢٠', en: '+120', label: { ar: 'مؤسسة', en: 'Organizations' } },
  { ar: '+٩٠٪', en: '+90%', label: { ar: 'معدل الرضا', en: 'Satisfaction Rate' } },
  { ar: '١٥+', en: '15+', label: { ar: 'سنة خبرة', en: 'Years Experience' } },
];

export default function Home() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-corp-dark min-h-screen">
      <CorpNavbar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #05E1AE, #1A3A5C)' }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></div>
            <span className="text-brand-accent text-sm font-medium">{lang === 'ar' ? 'شركاء النمو المؤسسي' : 'Organizational Growth Partners'}</span>
          </div>
          <h1 className="font-heading font-black text-5xl md:text-7xl text-white leading-tight mb-6">
            {lang === 'ar'
              ? <> بناء <span style={{ color: '#05E1AE' }}>مؤسسات</span> رائدة،<br />تطوير <span style={{ color: '#05E1AE' }}>قادة</span> مؤثرين</>
              : <> Build <span style={{ color: '#05E1AE' }}>Leading</span> Organizations,<br />Develop <span style={{ color: '#05E1AE' }}>Impactful</span> Leaders</>}
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {lang === 'ar'
              ? 'أوبتيفانس شريكك الاستراتيجي في الاستشارات المؤسسية، التدريب التنفيذي، وتطوير القدرات المبنية على القياس والأثر الحقيقي.'
              : 'OPTIVANCE is your strategic partner in organizational consulting, executive coaching, and capability development built on measurement and real impact.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation" className="btn-catalyst px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-2">
              {translations.nav.consultation[lang]} <Arrow size={16} />
            </Link>
            <Link to="/store" className="btn-outline-white px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-2">
              {translations.nav.store[lang]} <Arrow size={16} />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 py-12 px-6 bg-corp-surface/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-heading font-black text-4xl md:text-5xl gradient-text mb-1">{s[lang]}</div>
              <div className="text-white/50 text-sm">{s.label[lang]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who we serve */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'من نخدم' : 'Who We Serve'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white">
              {lang === 'ar' ? 'نخدم المؤسسات والقادة في كل القطاعات' : 'Serving Organizations & Leaders Across All Sectors'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(lang === 'ar'
              ? ['القطاع الحكومي', 'الشركات المدرجة', 'المؤسسات غير الربحية', 'القادة التنفيذيون', 'متخصصو الموارد البشرية', 'رواد الأعمال']
              : ['Government Sector', 'Listed Companies', 'Non-Profits', 'C-Suite Executives', 'HR Professionals', 'Entrepreneurs']
            ).map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-corp-surface/40 hover:border-brand-accent/30 transition-all group">
                <div className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0"></div>
                <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why OPTIVANCE */}
      <section className="py-20 px-6 bg-corp-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white">{lang === 'ar' ? 'لماذا أوبتيفانس؟' : 'Why OPTIVANCE?'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart2, ar: 'مبنية على البيانات', en: 'Data-Driven', desc: { ar: 'نؤمن بالقياس كأساس لكل حل', en: 'We believe in measurement as the foundation' } },
              { icon: Users, ar: 'محورها الإنسان', en: 'Human-Centered', desc: { ar: 'نضع الناس في قلب كل استراتيجية', en: 'People at the heart of every strategy' } },
              { icon: Target, ar: 'موجهة بالأثر', en: 'Impact-Oriented', desc: { ar: 'نقيس النجاح بالتغيير الحقيقي', en: 'Success measured by real change' } },
              { icon: Lightbulb, ar: 'ابتكار متواصل', en: 'Continuous Innovation', desc: { ar: 'نبتكر أدوات ومناهج حديثة', en: 'Modern tools and methodologies' } },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-corp-surface/50 border border-white/5 hover:border-brand-accent/20 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-all">
                    <Icon size={18} className="text-brand-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">{item[lang]}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-12 text-center" style={{ background: 'linear-gradient(135deg, #1A3A5C, #0D1F33)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#05E1AE 1px, transparent 1px), linear-gradient(90deg, #05E1AE 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="relative z-10">
              <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4">
                {lang === 'ar' ? 'هل أنت مستعد للخطوة التالية؟' : 'Ready for the Next Step?'}
              </h2>
              <p className="text-white/60 mb-8 text-lg">{lang === 'ar' ? 'شاركنا تحديك وسنبني معك الحل المناسب' : "Share your challenge and we'll build the right solution together"}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/consultation" className="btn-catalyst px-8 py-4 rounded-2xl flex items-center justify-center gap-2">
                  {translations.nav.consultation[lang]} <Arrow size={16} />
                </Link>
                <Link to="/store" className="btn-outline-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2">
                  {translations.nav.store[lang]}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CorpFooter />
    </div>
  );
}