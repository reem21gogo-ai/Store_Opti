import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { ArrowRight, ArrowLeft, Building2, Users, Target, BookOpen, Wrench, GraduationCap, BarChart2, Compass, Briefcase } from 'lucide-react';
import CorpNavbar from '@/components/corp/CorpNavbar';
import CorpFooter from '@/components/corp/CorpFooter';

const SERVICES = {
  ar: [
    { icon: Building2, title: 'الاستشارات المؤسسية', desc: 'نساعد المؤسسات على تحسين بنيتها التنظيمية وعملياتها وثقافتها.', audience: 'المؤسسات الحكومية والخاصة والقادة التنفيذيون', deliverables: 'تقرير تشخيصي + خارطة طريق استراتيجية + آليات قياس' },
    { icon: Users, title: 'التدريب التنفيذي', desc: 'برامج تدريب فردي مخصصة للقادة التنفيذيين.', audience: 'المدراء التنفيذيون وكبار القادة', deliverables: 'تقييم شامل + جلسات فردية + خطة تطوير شخصية' },
    { icon: Target, title: 'تطوير القيادة', desc: 'برامج شاملة لتطوير القدرات القيادية على جميع المستويات.', audience: 'مدراء الإدارة الوسطى والمشرفون والقادة الجدد', deliverables: 'برنامج تطوير + ورش عمل + أدوات تقييم' },
    { icon: BookOpen, title: 'بناء الكفاءات', desc: 'تصميم أطر الكفاءات وبناء منظومات تطوير الموظفين.', audience: 'إدارة الموارد البشرية والقادة المعنيون', deliverables: 'إطار كفاءات + مسارات تطوير + أدوات قياس' },
    { icon: Wrench, title: 'تصميم الأدوات', desc: 'تصميم أدوات تقييم وقياس مخصصة للمؤسسات.', audience: 'إدارة الموارد البشرية والمؤسسات', deliverables: 'أداة تقييم مخصصة + دليل استخدام + تقرير نتائج' },
    { icon: GraduationCap, title: 'التدريب والتطوير', desc: 'برامج تدريبية متكاملة في مجالات القيادة والإدارة.', audience: 'فرق العمل على جميع المستويات', deliverables: 'برنامج تدريبي + مواد تعليمية + تقرير قياس الأثر' },
    { icon: BarChart2, title: 'تقييمات المؤسسات', desc: 'تقييمات مؤسسية شاملة تكشف الواقع الحالي وتحدد أولويات التطوير.', audience: 'القيادة العليا وإدارة الموارد البشرية', deliverables: 'تقرير تقييمي شامل + مصفوفة أولويات' },
    { icon: Compass, title: 'التخطيط الاستراتيجي', desc: 'دعم المؤسسات في بناء رؤيتها الاستراتيجية وخارطة طريقها.', audience: 'القيادة العليا ومجالس الإدارة', deliverables: 'خطة استراتيجية + مؤشرات أداء + آلية متابعة' },
    { icon: Briefcase, title: 'الشراكات الاستراتيجية', desc: 'بناء علاقات شراكة استراتيجية طويلة الأمد مع المؤسسات.', audience: 'المؤسسات الراغبة في شريك استراتيجي دائم', deliverables: 'إطار شراكة + خطة تطوير سنوية + مراجعات دورية' },
  ],
  en: [
    { icon: Building2, title: 'Organizational Consulting', desc: 'We help organizations improve their structure, processes, and culture.', audience: 'Government and private sector organizations, C-suite executives', deliverables: 'Diagnostic report + Strategic roadmap + Measurement frameworks' },
    { icon: Users, title: 'Executive Coaching', desc: 'Customized coaching programs for executive leaders.', audience: 'C-suite executives and senior leaders', deliverables: 'Comprehensive assessment + Individual sessions + Personal development plan' },
    { icon: Target, title: 'Leadership Development', desc: 'Comprehensive programs to develop leadership capabilities at all levels.', audience: 'Middle managers, supervisors, and emerging leaders', deliverables: 'Development program + Workshops + Assessment tools' },
    { icon: BookOpen, title: 'Capability Building', desc: 'Designing competency frameworks and employee development systems.', audience: 'HR management and relevant leadership', deliverables: 'Competency framework + Development pathways + Measurement tools' },
    { icon: Wrench, title: 'Tool Design', desc: 'Designing customized assessment and measurement tools.', audience: 'HR departments and organizations', deliverables: 'Custom tool + User guide + Results report' },
    { icon: GraduationCap, title: 'Training & Development', desc: 'Integrated training programs in leadership and management.', audience: 'Teams at all levels', deliverables: 'Training program + Learning materials + Impact report' },
    { icon: BarChart2, title: 'Organizational Assessments', desc: 'Comprehensive assessments revealing current reality and priorities.', audience: 'Senior leadership and HR management', deliverables: 'Comprehensive report + Priority matrix' },
    { icon: Compass, title: 'Strategic Planning', desc: 'Supporting organizations in building their strategic vision and roadmap.', audience: 'Senior leadership and boards of directors', deliverables: 'Strategic plan + KPIs + Follow-up mechanism' },
    { icon: Briefcase, title: 'Strategic Partnerships', desc: 'Building long-term strategic partnerships for continuous development.', audience: 'Organizations seeking a permanent strategic partner', deliverables: 'Partnership framework + Annual plan + Periodic reviews' },
  ],
};

export default function Services() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [expanded, setExpanded] = useState(null);
  const srvs = SERVICES[lang];

  return (
    <div className="bg-corp-dark min-h-screen">
      <CorpNavbar />
      <section className="pt-28 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-accent text-sm font-medium uppercase tracking-widest mb-4">{translations.nav.services[lang]}</p>
          <h1 className="font-heading font-black text-4xl md:text-6xl text-white mb-6">{lang === 'ar' ? 'خدماتنا الاستشارية' : 'Our Consulting Services'}</h1>
          <p className="text-white/60 text-lg">{lang === 'ar' ? 'تسعة محاور تغطي كل احتياجات مؤسستك' : "Nine pillars covering all your organization's needs"}</p>
        </div>
      </section>
      <section className="py-12 px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {srvs.map((s, i) => {
            const Icon = s.icon;
            const isExpanded = expanded === i;
            return (
              <div key={i} onClick={() => setExpanded(isExpanded ? null : i)}
                className={`p-6 rounded-3xl border bg-corp-surface/40 transition-all cursor-pointer group ${isExpanded ? 'border-brand-accent/50 bg-corp-surface/80' : 'border-white/10 hover:border-brand-accent/30'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all">
                    <Icon size={18} className="text-brand-accent" />
                  </div>
                  <span className="text-white/30 text-xs">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-white/10 space-y-3">
                    <div>
                      <span className="text-brand-accent text-xs font-bold uppercase tracking-wider">{lang === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}</span>
                      <p className="text-white/60 text-sm mt-1">{s.audience}</p>
                    </div>
                    <div>
                      <span className="text-brand-accent text-xs font-bold uppercase tracking-wider">{lang === 'ar' ? 'المخرجات' : 'Deliverables'}</span>
                      <p className="text-white/60 text-sm mt-1">{s.deliverables}</p>
                    </div>
                    <Link to="/consultation" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-2 text-brand-accent text-sm font-medium hover:gap-3 transition-all mt-2">
                      {lang === 'ar' ? 'اطلب هذه الخدمة' : 'Request This Service'} <Arrow size={14} />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <CorpFooter />
    </div>
  );
}