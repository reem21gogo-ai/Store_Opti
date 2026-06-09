import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function CompetencyReport() {
  const { attemptId } = useParams();
  const { lang, isRTL } = useLang();
  const [activeNav, setActiveNav] = useState(1);
  const [reportData, setReportData] = useState(null);

  // Mock data - يتم استبداله ببيانات حقيقية من الـ API
  const mockData = {
    userName: 'Reema Almatrafi',
    professionalLevel: 'Leadership',
    assessmentDate: '04/12/2025',
    reportId: '04122025',
    overallScore: 78,
    domains: {
      thoughtAnalysis: 73,
      resultsExecution: 40,
      peoplecollaboration: 15,
      selfLeadership: 20,
      customerValue: 56,
      digitalCompliance: 73,
    },
  };

  const pages = [
    { id: 1, titleEn: 'Cover Page', titleAr: 'الغلاف', iconClass: 'fa-book-open' },
    { id: 2, titleEn: 'Welcome', titleAr: 'الترحيب', iconClass: 'fa-hand-wave' },
    { id: 3, titleEn: 'About', titleAr: 'حول التقييم', iconClass: 'fa-info-circle' },
    { id: 4, titleEn: 'Snapshot', titleAr: 'النتائج العامة', iconClass: 'fa-chart-pie' },
    { id: 5, titleEn: 'Insights 1', titleAr: 'الرؤى 1', iconClass: 'fa-lightbulb' },
    { id: 6, titleEn: 'Insights 2', titleAr: 'الرؤى 2', iconClass: 'fa-users' },
    { id: 7, titleEn: 'Insights 3', titleAr: 'الرؤى 3', iconClass: 'fa-star' },
    { id: 8, titleEn: 'Dev Plan', titleAr: 'خطة التطوير', iconClass: 'fa-map' },
    { id: 9, titleEn: 'Next Steps', titleAr: 'الخطوات القادمة', iconClass: 'fa-arrow-right' },
    { id: 10, titleEn: 'About Us', titleAr: 'عن أوبتيفانس', iconClass: 'fa-building' },
    { id: 11, titleEn: 'Back Cover', titleAr: 'الغلاف الخلفي', iconClass: 'fa-book-bookmark' },
  ];

  const downloadPDF = async () => {
    const element = document.getElementById('page-content');
    const canvas = await html2canvas(element, { scale: 2 });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    pdf.save('competency-report.pdf');
  };

  // Page 1: Cover
  const CoverPage = () => (
    <div id="page-content" className="bg-white rounded-2xl shadow-2xl mx-auto mb-8 max-w-4xl min-h-screen flex flex-col items-center justify-between p-16 text-center" style={{ background: 'linear-gradient(135deg, #132D46 0%, #0F2741 50%, #00E29C 100%)' }}>
      <div className="mb-8">
        <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
          <div className="text-white text-sm font-semibold">OPTIVANCE</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-black text-white mb-6 leading-tight">Optivance Competency<br/>& Growth Report</h1>
        <div className="w-32 h-1 bg-yellow-400 mx-auto mb-6"></div>
        <p className="text-2xl text-white/90 font-medium mb-16">Employee Core Competency Assessment</p>

        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-10 max-w-2xl border border-white/20 shadow-2xl">
          <p className="text-xl text-white/90 mb-10 italic font-light">From awareness to sustainable professional growth.</p>
          <div className="space-y-5 text-left">
            <div className="flex justify-between items-center border-b border-white/20 pb-4">
              <span className="text-white/70 font-medium">Prepared for:</span>
              <span className="text-white font-semibold text-lg">{mockData.userName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-4">
              <span className="text-white/70 font-medium">Professional Level:</span>
              <span className="text-white font-semibold text-lg">{mockData.professionalLevel}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-white/70 font-medium">Date:</span>
              <span className="text-white font-semibold text-lg">{mockData.assessmentDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-white/60 text-sm font-light">Powered by Optivance – Based on the ROUTE™ Leadership & Competency Methodology</p>
      </div>
    </div>
  );

  // Page 4: Snapshot
  const SnapshotPage = () => (
    <div id="page-content" className="bg-white rounded-2xl shadow-2xl mx-auto mb-8 max-w-4xl p-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">Your Overall Competency Snapshot</h1>
        <div className="w-32 h-1 bg-gradient-to-r from-teal-400 to-blue-600 mx-auto"></div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-12 mb-12 border border-teal-100">
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="w-56 h-56 mx-auto rounded-full bg-white shadow-2xl flex items-center justify-center mb-6 relative border-8 border-teal-200">
              <div className="text-center">
                <div className="text-7xl font-black bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">{mockData.overallScore}%</div>
                <div className="text-sm text-slate-500 font-medium mt-2">Overall Score</div>
              </div>
            </div>
            <div className="inline-block bg-gradient-to-r from-teal-400 to-blue-600 text-white px-6 py-2 rounded-full font-semibold text-lg shadow-lg">
              Proficient
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-slate-600 text-center leading-relaxed text-lg">
            Your overall score suggests that you have solid foundations in several core competencies, with clear strengths you can leverage and specific areas that, if developed, will significantly enhance your effectiveness at work.
          </p>
        </div>
      </div>

      {/* Domain Scores Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Domain Scores</h2>

        <div className="grid grid-cols-2 gap-6 mb-10">
          {[
            { name: 'Thought & Analysis', color: '#00E29C', score: 73, status: 'Strong' },
            { name: 'Results & Execution', color: '#F4B255', score: 40, status: 'Needs Work' },
            { name: 'People & Collaboration', color: '#FF5C35', score: 15, status: 'Critical' },
            { name: 'Self-Leadership & Growth', color: '#FF5C35', score: 20, status: 'Critical' },
            { name: 'Customer & Stakeholder Value', color: '#1A6FA8', score: 56, status: 'Moderate' },
            { name: 'Digital, Sustainability & Compliance', color: '#00E29C', score: 73, status: 'Strong' },
          ].map((domain, i) => (
            <div key={i} className="rounded-2xl p-8 border-l-4" style={{ background: `${domain.color}12`, borderColor: domain.color }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-lg">{domain.name}</h3>
                <div className="text-4xl font-bold" style={{ color: domain.color }}>{domain.score}%</div>
              </div>
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white" style={{ background: domain.color }}>
                {domain.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex h-screen bg-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white shadow-xl border-r border-slate-200 overflow-y-auto">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-teal-400 to-blue-600">
          <h2 className="text-xl font-bold text-white mb-1">Report Navigation</h2>
          <p className="text-sm text-white/80">Browse Your Assessment</p>
        </div>

        <nav className="p-4">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setActiveNav(page.id)}
              className={`nav-btn w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
                activeNav === page.id
                  ? 'bg-gradient-to-r from-teal-400 to-blue-600 text-white'
                  : 'hover:bg-teal-50 text-slate-800'
              }`}
            >
              <i className={`fa-solid ${page.iconClass} w-6 ${isRTL ? 'mr-3' : 'ml-3'}`}></i>
              <span className="ml-3 font-medium">{page[lang === 'ar' ? 'titleAr' : 'titleEn']}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={downloadPDF}
            className="w-full bg-gradient-to-r from-teal-400 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download Full PDF
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100">
        <div className="h-screen overflow-y-auto p-8">
          {activeNav === 1 && <CoverPage />}
          {activeNav === 4 && <SnapshotPage />}
          {activeNav !== 1 && activeNav !== 4 && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <h1 className="text-3xl font-bold text-slate-800 mb-4">Page {activeNav}</h1>
              <p className="text-slate-600">
                {lang === 'ar' ? 'سيتم إضافة محتوى هذه الصفحة قريباً' : 'Coming soon...'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}