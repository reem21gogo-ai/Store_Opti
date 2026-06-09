import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { ArrowRight, ArrowLeft, Target, Eye, Heart, Zap, Shield, Users, BarChart2, Lightbulb, Award } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const VALUES = {
  ar: [
    { num: '01', icon: Zap, title: 'التمكين', desc: 'نخلق بيئات تُطلق الإمكانات الكاملة للأفراد والمؤسسات، وتمنحهم الأدوات والثقة للنمو.' },
    { num: '02', icon: Lightbulb, title: 'الابتكار', desc: 'نقدم حلولاً إبداعية واستشرافية تتجاوز المألوف وتُحدث تغييراً حقيقياً وملموساً.' },
    { num: '03', icon: Target, title: 'النمو المستدام', desc: 'نعتبر النمو المستدام المقياس الحقيقي لنجاحنا ونجاح شركائنا على المدى البعيد.' },
  ],
  en: [
    { num: '01', icon: Zap, title: 'Empowerment', desc: 'We create environments that unleash the full potential of individuals and organizations, giving them the tools and confidence to grow.' },
    { num: '02', icon: Lightbulb, title: 'Innovation', desc: 'We provide creative, forward-thinking solutions that go beyond convention and drive real, tangible change.' },
    { num: '03', icon: Target, title: 'Sustainable Growth', desc: 'We consider sustainable growth the true measure of our success and that of our partners over the long term.' },
  ],
};

const WHAT_MAKES_US_DIFFERENT = {
  ar: [
    { icon: Award, title: 'منهجية حصرية مسجَّلة', desc: 'منهجية ROUTE° إطار ملكية فكرية مسجل يجمع بين التميز العالمي والرؤى الخليجية.' },
    { icon: BarChart2, title: 'مبني على القياس والبيانات', desc: 'نؤمن بأن ما لا يُقاس لا يُحسَّن. كل حل نقدمه مرتبط بمؤشرات أداء واضحة.' },
    { icon: Users, title: 'تركيز على الإنسان', desc: 'لا نقدم برامج جاهزة. نصمم كل حل بناءً على واقع العميل وثقافته وأهدافه.' },
    { icon: Shield, title: 'اعتمادات دولية موثوقة', desc: 'فريقنا يحمل اعتمادات من Harrison وNCDA وICF وغيرها من المنظمات الدولية المعترف بها.' },
    { icon: Eye, title: 'خبرة خليجية عميقة', desc: 'أكثر من ١٥ عاماً في تقديم الاستشارات والتدريب التنفيذي عبر قطاعات متنوعة في الخليج.' },
    { icon: Lightbulb, title: 'تكامل رقمي وأدوات ذكية', desc: 'نجمع بين الخبرة الاستشارية التقليدية والأدوات الرقمية الحديثة لتحقيق أثر أشمل.' },
  ],
  en: [
    { icon: Award, title: 'Registered Exclusive Methodology', desc: 'ROUTE° is a registered proprietary framework combining global excellence with Gulf-specific insights.' },
    { icon: BarChart2, title: 'Measurement & Data-Driven', desc: 'We believe what cannot be measured cannot be improved. Every solution is tied to clear KPIs.' },
    { icon: Users, title: 'Human-Centered Focus', desc: 'We never deliver off-the-shelf programs. Every solution is designed based on the client\'s reality.' },
    { icon: Shield, title: 'Trusted International Accreditations', desc: 'Our team holds certifications from Harrison, NCDA, ICF, and other globally recognized organizations.' },
    { icon: Eye, title: 'Deep Gulf Expertise', desc: 'Over 15 years delivering consulting and executive coaching across diverse sectors in the GCC.' },
    { icon: Lightbulb, title: 'Digital Integration & Smart Tools', desc: 'We combine traditional consulting expertise with modern digital tools for broader, deeper impact.' },
  ],
};

const PILLARS = {
  ar: [
    { num: '01', title: 'التطوير البشري', desc: 'لأن التغيير الحقيقي يبدأ بالأفراد — قادةً وفرقاً ومنظمات. نضع الإنسان في قلب كل حل نقدمه.' },
    { num: '02', title: 'الاستشارة الاستراتيجية', desc: 'لأن الأهداف بدون خارطة طريق واضحة تبقى أمنيات. نساعدك على بناء رؤية قابلة للتنفيذ.' },
    { num: '03', title: 'القياس والأثر', desc: 'لأن ما لا يُقاس لا يُحسَّن. نقيس كل خطوة ونُبلِّغ بنتائج واضحة وقابلة للتحقق.' },
  ],
  en: [
    { num: '01', title: 'Human Development', desc: 'Because real change starts with individuals — leaders, teams, and organizations. We place people at the heart of every solution.' },
    { num: '02', title: 'Strategic Consulting', desc: 'Because goals without a clear roadmap remain wishes. We help you build a vision that is executable.' },
    { num: '03', title: 'Measurement & Impact', desc: 'Because what cannot be measured cannot be improved. We measure every step and report clear, verifiable results.' },
  ],
};

export default function About() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-corp-dark min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <CorpNavbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{lang === 'ar' ? 'من نحن' : 'About Us'}</p>
          <h1 className="font-heading font-black text-4xl md:text-6xl text-white leading-tight mb-6">
            {lang === 'ar' ? 'نحن أوبتيفانس' : 'We Are OPTIVANCE'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl mx-auto">
            {lang === 'ar'
              ? 'شركة استشارية متخصصة في بناء المؤسسات الرائدة وتطوير القادة المؤثرين. نجمع بين عمق الخبرة الاستراتيجية وروح الابتكار والمنهجية المبنية على القياس والأثر الحقيقي.'
              : 'A specialized consulting firm in building leading organizations and developing impactful leaders. We combine strategic expertise depth, innovation spirit, and a methodology built on measurement and real impact.'}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 px-6 bg-corp-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{lang === 'ar' ? 'نبذتنا' : 'Our Overview'}</p>
              <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-6">
                {lang === 'ar' ? 'أكثر من مجرد استشارات' : 'More Than Just Consulting'}
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  {lang === 'ar'
                    ? 'أوبتيفانس ليست شركة استشارية تقليدية. نحن شريك استراتيجي متكامل يجمع بين التطوير البشري والاستشارة المؤسسية والأدوات الرقمية تحت مظلة واحدة.'
                    : 'OPTIVANCE is not a traditional consulting company. We are an integrated strategic partner that combines human development, institutional consulting, and digital tools under one roof.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? 'لا نقدم فقط تدريباً نظرياً — بل نصمم حلولاً استشارية عملية وتقييمات ذكية وتقارير ومسارات تطوير تناسب واقع مؤسستك ورؤيتها.'
                    : 'We don\'t only provide theoretical training — we design practical consulting solutions, smart assessments, reports, and development journeys tailored to your organization\'s reality and vision.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? 'بخبرة تمتد لأكثر من ١٥ عاماً عبر قطاعات متنوعة في دول الخليج، نفهم تحديات القيادة والتطوير في السياق الخليجي والعربي.'
                    : 'With over 15 years of experience across diverse sectors in Gulf countries, we understand leadership and development challenges in the Gulf and Arab context.'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '+١٥', en: '+15', label: { ar: 'سنة خبرة', en: 'Years Experience' } },
                { num: '+١٥٠', en: '+150', label: { ar: 'مشروع مُنجز', en: 'Projects Delivered' } },
                { num: '+٨٧', en: '+87', label: { ar: 'شريك استراتيجي', en: 'Strategic Partners' } },
                { num: '+٣٥٠٠٠', en: '+35K', label: { ar: 'مستفيد', en: 'Beneficiaries' } },
              ].map((s, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-corp-dark text-center">
                  <div className="font-heading font-black text-3xl gradient-text mb-2">{lang === 'ar' ? s.num : s.en}</div>
                  <div className="text-white/50 text-sm">{s.label[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Eye,
                titleAr: 'رؤيتنا', titleEn: 'Our Vision',
                textAr: 'أن نكون الشريك الاستشاري الأول في منطقة الخليج لبناء المؤسسات القادرة على التكيف والنمو المستدام، وتطوير جيل من القادة المؤثرين القادرين على قيادة مستقبل أفضل.',
                textEn: 'To be the premier consulting partner in the Gulf region for building organizations capable of adaptation and sustainable growth, and developing a generation of impactful leaders capable of leading a better future.',
              },
              {
                icon: Target,
                titleAr: 'رسالتنا', titleEn: 'Our Mission',
                textAr: 'تمكين المؤسسات والقادة من تحقيق أعلى مستويات الأداء والأثر من خلال حلول استشارية مبتكرة، وأدوات قياس دقيقة، وتطوير بشري مستدام مبني على التجربة والعلم والممارسة.',
                textEn: 'Empowering organizations and leaders to achieve peak performance and impact through innovative consulting solutions, precise measurement tools, and sustainable human development built on experience, science, and practice.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-8 rounded-3xl bg-corp-surface/40 border border-white/10 hover:border-brand-accent/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-6">
                    <Icon size={20} className="text-brand-accent" />
                  </div>
                  <h2 className="font-heading font-black text-white text-2xl mb-4">{lang === 'ar' ? item.titleAr : item.titleEn}</h2>
                  <p className="text-white/60 leading-relaxed">{lang === 'ar' ? item.textAr : item.textEn}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-corp-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'قيمنا' : 'Our Values'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white">{lang === 'ar' ? 'المبادئ التي تُشكِّل هويتنا' : 'The Principles That Shape Our Identity'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES[lang].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-8 rounded-3xl border border-white/10 bg-corp-dark hover:border-brand-accent/30 transition-all group">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="font-heading font-black text-4xl gradient-text opacity-40">{v.num}</div>
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all">
                      <Icon size={18} className="text-brand-accent" />
                    </div>
                  </div>
                  <h3 className="font-heading font-black text-white text-xl mb-3">{v.title}</h3>
                  <p className="text-white/50 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'ما يُميزنا' : 'What Makes Us Different'}</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-white">
              {lang === 'ar' ? 'أوبتيفانس لا تُشبه أي شركة أخرى' : 'OPTIVANCE Is Unlike Any Other Company'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHAT_MAKES_US_DIFFERENT[lang].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-corp-surface/40 hover:border-brand-accent/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-all">
                    <Icon size={18} className="text-brand-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 px-6 bg-corp-surface/30">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-3">{lang === 'ar' ? 'فلسفتنا' : 'Our Philosophy'}</p>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-12">
            {lang === 'ar' ? 'ثلاثة محاور لا تنفصل' : 'Three Inseparable Pillars'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS[lang].map((p, i) => (
              <div key={i} className="p-8 rounded-3xl bg-corp-dark border border-white/10 hover:border-brand-accent/30 transition-all">
                <div className="font-heading font-black text-6xl gradient-text mb-4 opacity-40">{p.num}</div>
                <h3 className="font-heading font-bold text-white text-xl mb-3">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-black text-3xl text-white mb-4">
            {lang === 'ar' ? 'هل نحن شريكك القادم؟' : 'Are We Your Next Partner?'}
          </h2>
          <p className="text-white/50 mb-8">
            {lang === 'ar' ? 'دعنا نتعرف على احتياجاتك ونبني معك رحلة التطوير المناسبة' : 'Let us learn about your needs and build the right development journey together'}
          </p>
          <Link to="/consultation" className="btn-catalyst px-8 py-4 rounded-2xl inline-flex items-center gap-2">
            {lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'} <Arrow size={16} />
          </Link>
        </div>
      </section>

      <CorpFooter />
    </div>
  );
}