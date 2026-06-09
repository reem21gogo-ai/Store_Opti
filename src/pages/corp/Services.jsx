import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { ArrowRight, ArrowLeft, Building2, Users, Target, BookOpen, Wrench, GraduationCap, BarChart2, Compass, Briefcase, Cpu } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const SERVICES = {
  ar: [
    {
      icon: Building2,
      title: 'الاستشارات المؤسسية',
      desc: 'نساعد المؤسسات على تحسين هياكلها التنظيمية وعملياتها وثقافتها لتحقيق الكفاءة والنمو المستدام.',
      audience: 'المؤسسات الحكومية والخاصة والقادة التنفيذيون وأصحاب القرار',
      deliverables: 'تقرير تشخيصي شامل + خارطة طريق استراتيجية + آليات قياس وتقييم',
      outcomes: 'تحسين الكفاءة التشغيلية، تعزيز الأداء المؤسسي، بناء ثقافة مؤسسية فاعلة',
    },
    {
      icon: Users,
      title: 'التدريب التنفيذي والتمكيني',
      desc: 'جلسات تدريب فردي وجماعي مخصصة لتطوير القادة التنفيذيين والناشئين وتمكينهم من قيادة التغيير.',
      audience: 'المدراء التنفيذيون وكبار القادة والقادة الناشئون',
      deliverables: 'تقييم شامل للقيادة + جلسات تدريب فردية + خطة تطوير شخصية مخصصة',
      outcomes: 'تعزيز الكفاءة القيادية، تطوير مهارات اتخاذ القرار، بناء القدرة على التأثير',
    },
    {
      icon: Target,
      title: 'تطوير القيادة',
      desc: 'برامج شاملة لتطوير القدرات القيادية على جميع المستويات الإدارية من خلال أدوات علمية معتمدة.',
      audience: 'مدراء الإدارة الوسطى والمشرفون والقادة الجدد والمرشحون للتقدم الوظيفي',
      deliverables: 'برنامج تطوير قيادي + ورش عمل تطبيقية + أدوات تقييم وقياس الأثر',
      outcomes: 'بناء مخزون قيادي قوي، تطوير مهارات التواصل والإقناع، تعزيز ثقافة القيادة',
    },
    {
      icon: BookOpen,
      title: 'بناء الكفاءات',
      desc: 'تصميم أطر الكفاءات المؤسسية وبناء منظومات متكاملة لتطوير الموظفين بناءً على أحدث المنهجيات.',
      audience: 'إدارات الموارد البشرية والقادة المعنيون والفرق التنفيذية',
      deliverables: 'إطار كفاءات مؤسسي + مسارات تطوير فردية + أدوات قياس وتقييم الكفاءات',
      outcomes: 'تحديد فجوات المهارات، بناء خطط تطوير فعالة، تحسين أداء الفرق',
    },
    {
      icon: Compass,
      title: 'تصميم مسارات التعلم',
      desc: 'تصميم مسارات تعليمية وتطويرية متكاملة تتناسب مع أهداف المؤسسة واحتياجات الموظفين.',
      audience: 'إدارات التدريب والتطوير والموارد البشرية في المؤسسات',
      deliverables: 'خارطة مسار التعلم + محتوى تدريبي مخصص + نظام تقييم ومتابعة',
      outcomes: 'تحسين جودة التدريب، ربط التطوير باحتياجات العمل، تعزيز انخراط الموظفين',
    },
    {
      icon: BarChart2,
      title: 'تقييم الكفاءات والأداء',
      desc: 'تقييمات مؤسسية وفردية شاملة باستخدام منهجية ROUTE™ وHarrison وNCDA للكشف عن نقاط القوة وتحديد أولويات التطوير.',
      audience: 'القيادة العليا وإدارات الموارد البشرية والموظفين على جميع المستويات',
      deliverables: 'تقرير تقييمي تفصيلي + تحليل نقاط القوة والتطوير + توصيات عملية',
      outcomes: 'فهم أعمق لنقاط القوة، تحديد أولويات التطوير، بناء قرارات موارد بشرية مبنية على البيانات',
    },
    {
      icon: GraduationCap,
      title: 'تطوير الموارد البشرية والمواهب',
      desc: 'حلول متكاملة لتطوير الموارد البشرية تشمل بناء الاستراتيجيات واكتشاف المواهب وإدارة مسارات الأداء.',
      audience: 'إدارات الموارد البشرية ومتخصصو التعلم والتطوير',
      deliverables: 'استراتيجية موارد بشرية + برامج اكتشاف المواهب + نظام إدارة الأداء',
      outcomes: 'تعزيز استبقاء الكفاءات، بناء ثقافة التعلم المستمر، تطوير منظومة المواهب',
    },
    {
      icon: Wrench,
      title: 'تصميم الأدوات والتقييمات المخصصة',
      desc: 'تصميم أدوات تقييم وقياس مخصصة تناسب طبيعة ومتطلبات مؤسستك، بعيداً عن الحلول الجاهزة.',
      audience: 'المؤسسات التي تحتاج إلى أدوات قياس مخصصة لتقييم الكفاءات أو الأداء',
      deliverables: 'أداة تقييم مخصصة + دليل الاستخدام + تقرير نتائج تفصيلي',
      outcomes: 'قياس دقيق لما يهم مؤسستك، بيانات أكثر موثوقية، قرارات موارد بشرية أفضل',
    },
    {
      icon: Briefcase,
      title: 'تحسين الأداء المؤسسي',
      desc: 'برامج متكاملة لتشخيص أسباب تراجع الأداء وتصميم تدخلات فعالة لتحقيق نتائج ملموسة وقابلة للقياس.',
      audience: 'الإدارة العليا والمدراء المعنيون بتحسين مؤشرات الأداء المؤسسي',
      deliverables: 'تشخيص شامل + خطة تحسين الأداء + مؤشرات قياس + تقارير متابعة دورية',
      outcomes: 'تحسين مؤشرات الأداء الرئيسية، تعزيز الإنتاجية، رفع مستوى التحفيز والانخراط',
    },
    {
      icon: Cpu,
      title: 'الأدوات الرقمية التطويرية',
      desc: 'تقييمات ومنتجات رقمية تطويرية مصممة لدعم رحلة التطوير الفردي والمؤسسي بشكل مرن وفعال من حيث التكلفة.',
      audience: 'الأفراد والقادة والمؤسسات التي تسعى للتطوير الذاتي أو المؤسسي عبر الفضاء الرقمي',
      deliverables: 'وصول إلى المتجر الرقمي + تقييمات تفاعلية + تقارير PDF + أدلة وأطر عمل',
      outcomes: 'تطوير مرن وبتكلفة مناسبة، وصول في أي وقت ومن أي مكان، نتائج فورية وقابلة للتطبيق',
    },
  ],
  en: [
    {
      icon: Building2,
      title: 'Organizational Consulting',
      desc: 'We help organizations improve their organizational structures, processes, and culture to achieve efficiency and sustainable growth.',
      audience: 'Government and private organizations, C-suite executives, and decision-makers',
      deliverables: 'Comprehensive diagnostic report + Strategic roadmap + Measurement and evaluation mechanisms',
      outcomes: 'Improve operational efficiency, enhance institutional performance, build an effective organizational culture',
    },
    {
      icon: Users,
      title: 'Executive Coaching & Empowerment',
      desc: 'Individual and group coaching sessions tailored to develop and empower executive and emerging leaders to drive change.',
      audience: 'C-suite executives, senior leaders, and emerging leaders',
      deliverables: 'Comprehensive leadership assessment + Individual coaching sessions + Personalized development plan',
      outcomes: 'Enhance leadership competence, develop decision-making skills, build influence capacity',
    },
    {
      icon: Target,
      title: 'Leadership Development',
      desc: 'Comprehensive programs to develop leadership capabilities at all management levels through scientifically validated tools.',
      audience: 'Middle managers, supervisors, new leaders, and career advancement candidates',
      deliverables: 'Leadership development program + Applied workshops + Impact assessment tools',
      outcomes: 'Build a strong leadership pipeline, develop communication and persuasion skills, promote leadership culture',
    },
    {
      icon: BookOpen,
      title: 'Capability Building',
      desc: 'Design organizational competency frameworks and build integrated employee development systems based on latest methodologies.',
      audience: 'HR management, relevant leaders, and executive teams',
      deliverables: 'Institutional competency framework + Individual development pathways + Competency assessment tools',
      outcomes: 'Identify skill gaps, build effective development plans, improve team performance',
    },
    {
      icon: Compass,
      title: 'Learning Journey Design',
      desc: 'Design integrated educational and developmental pathways that align with organizational goals and employee needs.',
      audience: 'Training, development, and HR departments in organizations',
      deliverables: 'Learning pathway map + Customized training content + Assessment and follow-up system',
      outcomes: 'Improve training quality, link development to business needs, enhance employee engagement',
    },
    {
      icon: BarChart2,
      title: 'Competency Assessment',
      desc: 'Comprehensive institutional and individual assessments using ROUTE™, Harrison, and NCDA methodologies to uncover strengths and identify development priorities.',
      audience: 'Senior leadership, HR departments, and employees at all levels',
      deliverables: 'Detailed assessment report + Strengths and development analysis + Practical recommendations',
      outcomes: 'Deeper understanding of strengths, identification of development priorities, data-driven HR decisions',
    },
    {
      icon: GraduationCap,
      title: 'HR & Talent Development Solutions',
      desc: 'Integrated HR development solutions including strategy building, talent discovery, and performance pathway management.',
      audience: 'HR departments and learning & development professionals',
      deliverables: 'HR strategy + Talent discovery programs + Performance management system',
      outcomes: 'Enhance talent retention, build a continuous learning culture, develop the talent ecosystem',
    },
    {
      icon: Wrench,
      title: 'Custom Internal Assessments',
      desc: 'Design customized assessment and measurement tools tailored to your organization\'s nature and requirements, away from off-the-shelf solutions.',
      audience: 'Organizations needing customized measurement tools for competency or performance assessment',
      deliverables: 'Custom assessment tool + User guide + Detailed results report',
      outcomes: 'Precise measurement of what matters to your organization, more reliable data, better HR decisions',
    },
    {
      icon: Briefcase,
      title: 'Performance Improvement',
      desc: 'Integrated programs to diagnose performance decline causes and design effective interventions to achieve tangible, measurable results.',
      audience: 'Senior management and managers responsible for improving institutional performance indicators',
      deliverables: 'Comprehensive diagnosis + Performance improvement plan + KPIs + Periodic follow-up reports',
      outcomes: 'Improve key performance indicators, enhance productivity, boost motivation and engagement',
    },
    {
      icon: Cpu,
      title: 'Digital Development Tools',
      desc: 'Digital development assessments and products designed to support individual and organizational development journeys flexibly and cost-effectively.',
      audience: 'Individuals, leaders, and organizations seeking self or organizational development through digital channels',
      deliverables: 'Digital store access + Interactive assessments + PDF reports + Guides and frameworks',
      outcomes: 'Flexible development at appropriate cost, access anytime anywhere, immediate and applicable results',
    },
  ],
};

export default function Services() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [expanded, setExpanded] = useState(null);
  const srvs = SERVICES[lang];

  return (
    <div className="bg-corp-dark min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <CorpNavbar />
      <section className="pt-28 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{lang === 'ar' ? 'خدماتنا' : 'Our Services'}</p>
          <h1 className="font-heading font-black text-4xl md:text-6xl text-white mb-6">
            {lang === 'ar' ? 'خدماتنا الاستشارية' : 'Our Consulting Services'}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            {lang === 'ar'
              ? 'عشرة محاور استشارية متكاملة تغطي احتياجات مؤسستك من التشخيص إلى التطوير إلى القياس والأثر.'
              : 'Ten integrated consulting pillars covering your organization\'s needs from diagnosis to development to measurement and impact.'}
          </p>
        </div>
      </section>

      <section className="py-12 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {srvs.map((s, i) => {
              const Icon = s.icon;
              const isOpen = expanded === i;
              return (
                <div key={i}
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className={`p-6 rounded-3xl border bg-corp-surface/40 transition-all cursor-pointer group ${isOpen ? 'border-brand-accent/50 bg-corp-surface/80' : 'border-white/10 hover:border-brand-accent/30'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all">
                      <Icon size={18} className="text-brand-accent" />
                    </div>
                    <span className="text-white/20 text-xs font-mono">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg mb-3">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>

                  {isOpen && (
                    <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                      <div>
                        <span className="text-brand-accent text-xs font-bold uppercase tracking-wider block mb-1">{lang === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}</span>
                        <p className="text-white/60 text-sm">{s.audience}</p>
                      </div>
                      <div>
                        <span className="text-brand-accent text-xs font-bold uppercase tracking-wider block mb-1">{lang === 'ar' ? 'المخرجات' : 'Deliverables'}</span>
                        <p className="text-white/60 text-sm">{s.deliverables}</p>
                      </div>
                      <div>
                        <span className="text-brand-accent text-xs font-bold uppercase tracking-wider block mb-1">{lang === 'ar' ? 'النتائج المتوقعة' : 'Expected Outcomes'}</span>
                        <p className="text-white/60 text-sm">{s.outcomes}</p>
                      </div>
                      <Link to="/consultation" onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-brand-accent text-sm font-medium hover:gap-3 transition-all mt-1">
                        {lang === 'ar' ? 'اطلب هذه الخدمة' : 'Request This Service'} <Arrow size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="inline-block p-8 rounded-3xl border border-brand-accent/20 bg-corp-surface/40 max-w-xl">
              <h3 className="font-heading font-black text-white text-2xl mb-3">
                {lang === 'ar' ? 'لا تجد ما تبحث عنه؟' : 'Can\'t Find What You\'re Looking For?'}
              </h3>
              <p className="text-white/50 text-sm mb-5">
                {lang === 'ar' ? 'نصمم حلولاً مخصصة لاحتياجاتك. تحدث معنا وسنبني الحل المناسب.' : 'We design custom solutions for your needs. Talk to us and we\'ll build the right solution.'}
              </p>
              <Link to="/consultation" className="btn-catalyst px-6 py-3 rounded-xl inline-flex items-center gap-2">
                {lang === 'ar' ? 'طلب استشارة' : 'Request Consultation'} <Arrow size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CorpFooter />
    </div>
  );
}