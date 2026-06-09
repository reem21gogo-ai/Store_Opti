import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { Download, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';

export default function CompetencyReport() {
  const { attemptId } = useParams();
  const { lang, isRTL } = useLang();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const [activeNav, setActiveNav] = useState('snapshot');

  const mockData = {
    userName: lang === 'ar' ? 'ريما المطرفي' : 'Reema Almatrafi',
    professionalLevel: lang === 'ar' ? 'قيادي' : 'Leadership',
    assessmentDate: '09/06/2026',
    overallScore: 78,
    domains: [
      { name: lang === 'ar' ? 'التفكير والتحليل' : 'Thought & Analysis', score: 73, status: lang === 'ar' ? 'قوي' : 'Strong', color: '#05E1AE' },
      { name: lang === 'ar' ? 'النتائج والتنفيذ' : 'Results & Execution', score: 40, status: lang === 'ar' ? 'يحتاج عمل' : 'Needs Work', color: '#F4B255' },
      { name: lang === 'ar' ? 'الأشخاص والتعاون' : 'People & Collaboration', score: 15, status: lang === 'ar' ? 'حرج' : 'Critical', color: '#FF5C35' },
      { name: lang === 'ar' ? 'القيادة الذاتية والنمو' : 'Self-Leadership', score: 20, status: lang === 'ar' ? 'حرج' : 'Critical', color: '#FF5C35' },
      { name: lang === 'ar' ? 'قيمة العميل' : 'Customer Value', score: 56, status: lang === 'ar' ? 'معتدل' : 'Moderate', color: '#1A6FA8' },
      { name: lang === 'ar' ? 'الرقمية والامتثال' : 'Digital & Compliance', score: 73, status: lang === 'ar' ? 'قوي' : 'Strong', color: '#05E1AE' },
    ],
  };

  const downloadPDF = async () => {
    const element = document.getElementById('report-content');
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }
    pdf.save('competency-report.pdf');
  };

  const RatingBadge = ({ score, status, color }) => {
    let ratingColor = '#05E1AE';
    let ratingText = lang === 'ar' ? 'متفوق' : 'Excellent';
    
    if (score >= 75) {
      ratingColor = '#05E1AE';
      ratingText = lang === 'ar' ? 'قوي جداً' : 'Very Strong';
    } else if (score >= 50) {
      ratingColor = '#3a9abf';
      ratingText = lang === 'ar' ? 'جيد' : 'Good';
    } else if (score >= 25) {
      ratingColor = '#F4B255';
      ratingText = lang === 'ar' ? 'متوسط' : 'Average';
    } else {
      ratingColor = '#FF5C35';
      ratingText = lang === 'ar' ? 'يحتاج تطوير' : 'Needs Development';
    }
    
    return (
      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: ratingColor }}>
        {ratingText}
      </div>
    );
  };

  return (
    <div className="bg-store-bg min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link to="/store/competency" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary text-sm transition-colors mb-6">
            <BackArrow size={14} />
            {lang === 'ar' ? 'العودة للمقياس' : 'Back to Assessment'}
          </Link>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {lang === 'ar' ? 'تقريرك' : 'Your Report'}
                </div>
                <h1 className="font-heading font-black text-corp-dark text-2xl mb-2">
                  {lang === 'ar' ? 'تقرير مقياس الكفاءات الأساسية' : 'Core Competency Assessment Report'}
                </h1>
                <p className="text-slate-500 text-sm">{lang === 'ar' ? `الاسم: ${mockData.userName} • المستوى: ${mockData.professionalLevel}` : `Name: ${mockData.userName} • Level: ${mockData.professionalLevel}`}</p>
              </div>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
              >
                <Download size={16} />
                {lang === 'ar' ? 'تحميل PDF' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'snapshot', label: lang === 'ar' ? 'النتائج العامة' : 'Your Snapshot', icon: '📊' },
            { id: 'domains', label: lang === 'ar' ? 'تحليل المجالات' : 'Domain Analysis', icon: '📈' },
            { id: 'recommendations', label: lang === 'ar' ? 'التوصيات' : 'Recommendations', icon: '💡' },
            { id: 'nextSteps', label: lang === 'ar' ? 'الخطوات القادمة' : 'Next Steps', icon: '🎯' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveNav(tab.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeNav === tab.id
                  ? 'bg-white text-brand-primary border-2 border-brand-primary'
                  : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-slate-200'
              }`}
            >
              <span className="inline-block mr-2">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div id="report-content" className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Snapshot Page */}
          {activeNav === 'snapshot' && (
            <div className="p-8 md:p-12 space-y-10">
              <div className="text-center mb-12">
                <h2 className="font-heading font-black text-corp-dark text-2xl mb-6">
                  {lang === 'ar' ? 'نتائجك الإجمالية' : 'Your Overall Results'}
                </h2>

                {/* Overall Score Circle */}
                <div className="flex justify-center mb-10">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#E5E7EB" strokeWidth="15" />
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="url(#grad)"
                        strokeWidth="15"
                        strokeDasharray={`${(mockData.overallScore / 100) * 565} 565`}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1A3A5C" />
                          <stop offset="100%" stopColor="#05E1AE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="font-heading font-black text-4xl text-corp-dark">{mockData.overallScore}%</div>
                      <div className="text-xs text-slate-500 mt-1">{lang === 'ar' ? 'النتيجة العامة' : 'Overall Score'}</div>
                    </div>
                  </div>
                </div>

                <RatingBadge score={mockData.overallScore} status="" color="" />

                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto mt-8">
                  {lang === 'ar'
                    ? 'نتيجتك تشير إلى أن لديك أساسيات قوية في عدة كفاءات أساسية مع نقاط قوة واضحة يمكنك الاستفادة منها.'
                    : 'Your score suggests that you have solid foundations in several core competencies with clear strengths you can leverage.'}
                </p>
              </div>

              {/* Domain Scores */}
              <div>
                <h3 className="font-heading font-bold text-corp-dark text-xl mb-6 text-center">
                  {lang === 'ar' ? 'نتائج المجالات الستة' : 'Six Domain Scores'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {mockData.domains.map((domain, i) => (
                    <div key={i} className="rounded-xl p-5 border border-slate-100" style={{ borderLeftColor: domain.color, borderLeftWidth: 4 }}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-corp-dark text-sm">{domain.name}</h4>
                        <div className="text-2xl font-heading font-black" style={{ color: domain.color }}>{domain.score}%</div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${domain.score}%`,
                            background: `linear-gradient(90deg, ${domain.color}, ${domain.color}88)`,
                          }}
                        />
                      </div>
                      <RatingBadge score={domain.score} status={domain.status} color={domain.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Domain Analysis Page */}
          {activeNav === 'domains' && (
            <div className="p-8 md:p-12 space-y-10">
              <h2 className="font-heading font-black text-corp-dark text-2xl">
                {lang === 'ar' ? 'تحليل كل مجال' : 'Detailed Domain Analysis'}
              </h2>
              <div className="space-y-8">
                {mockData.domains.map((domain, i) => (
                  <div key={i} className="pb-8 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: domain.color }} />
                      <h3 className="font-heading font-bold text-corp-dark text-lg">{domain.name}</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {lang === 'ar'
                        ? `${domain.name} هو مجال مهم في الكفاءات المهنية. نتيجتك في هذا المجال هي ${domain.score}% مما يشير إلى أداء ${domain.status.toLowerCase()}.`
                        : `${domain.name} is an important area of professional competencies. Your score of ${domain.score}% indicates a ${domain.status.toLowerCase()} performance.`}
                    </p>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${domain.score}%`,
                          background: `linear-gradient(90deg, ${domain.color}, ${domain.color}88)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Page */}
          {activeNav === 'recommendations' && (
            <div className="p-8 md:p-12 space-y-8">
              <h2 className="font-heading font-black text-corp-dark text-2xl">
                {lang === 'ar' ? 'التوصيات الموصى بها' : 'Recommended Development Areas'}
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h3 className="font-semibold text-corp-dark mb-2">
                      {lang === 'ar' ? `التوصية ${i}` : `Recommendation ${i}`}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {lang === 'ar'
                        ? 'هذا مثال على التوصيات المخصصة لتطويرك المهني بناءً على نتائج التقييم.'
                        : 'This is an example of personalized development recommendations based on your assessment results.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps Page */}
          {activeNav === 'nextSteps' && (
            <div className="p-8 md:p-12 space-y-8">
              <h2 className="font-heading font-black text-corp-dark text-2xl">
                {lang === 'ar' ? 'الخطوات القادمة' : 'Your Next Steps'}
              </h2>
              <div className="space-y-4">
                {[
                  { title: lang === 'ar' ? 'حدد أولوياتك' : 'Set Your Priorities', desc: lang === 'ar' ? 'اختر أهم مجالات التطوير' : 'Choose the most important development areas' },
                  { title: lang === 'ar' ? 'ضع خطة عمل' : 'Create an Action Plan', desc: lang === 'ar' ? 'طور خطة محددة وقابلة للقياس' : 'Develop a specific and measurable plan' },
                  { title: lang === 'ar' ? 'طلب الدعم' : 'Request Support', desc: lang === 'ar' ? 'استشر مع مدرب متخصص' : 'Get coaching from a specialist' },
                  { title: lang === 'ar' ? 'تابع التقدم' : 'Track Progress', desc: lang === 'ar' ? 'قيم نموك بشكل دوري' : 'Evaluate your growth regularly' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-corp-dark">{step.title}</h3>
                      <p className="text-slate-600 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-brand-primary/5 rounded-xl p-6 border border-brand-primary/10 mt-8">
                <p className="text-corp-dark font-semibold mb-4">
                  {lang === 'ar' ? 'تحتاج إلى مساعدة متخصصة؟' : 'Need expert guidance?'}
                </p>
                <Link
                  to="/consultation"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
                >
                  {lang === 'ar' ? 'اطلب استشارة' : 'Request Consultation'}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <StoreFooter />
    </div>
  );
}