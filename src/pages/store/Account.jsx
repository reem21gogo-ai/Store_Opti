import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { User, Package, BarChart2, FileText, ShoppingBag, Download, LogOut, ArrowRight, ArrowLeft } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';
import { base44 } from '@/api/base44Client';

export default function Account() {
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('assessments');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async authed => {
      if (!authed) { navigate('/store/login'); return; }
      const me = await base44.auth.me();
      setUser(me);
      const [ordersData, attemptsData, downloadsData] = await Promise.all([
        base44.entities.Order.filter({ user_id: me.id }, '-created_date', 20),
        base44.entities.AssessmentAttempt.filter({ user_id: me.id }, '-created_date', 20),
        base44.entities.FreeDownload.filter({ user_id: me.id }, '-created_date', 20),
      ]);
      setOrders(ordersData); setAttempts(attemptsData); setDownloads(downloadsData); setLoading(false);
    });
  }, []);

  const tabs = [
    { id: 'assessments', label: translations.account.assessments[lang], icon: BarChart2 },
    { id: 'purchases', label: translations.account.purchases[lang], icon: Package },
    { id: 'downloads', label: translations.account.freeDownloads[lang], icon: Download },
    { id: 'orders', label: translations.account.orderHistory[lang], icon: ShoppingBag },
  ];

  if (loading) return <div className="min-h-screen bg-store-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-store-bg min-h-screen">
      <StoreNavbar />
      <div className="bg-gradient-to-r from-brand-primary to-corp-surface text-white py-12 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-accent/20 border-2 border-brand-accent/30 flex items-center justify-center"><User size={26} className="text-brand-accent" /></div>
            <div>
              <h1 className="font-heading font-black text-2xl">{translations.account.welcome[lang]}{lang === 'ar' ? '، ' : ', '}{user?.full_name?.split(' ')[0]}</h1>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => base44.auth.logout('/store')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <LogOut size={15} /> {translations.nav.logout[lang]}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: translations.account.purchases[lang], value: orders.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
            { label: translations.account.assessments[lang], value: attempts.length, icon: BarChart2, color: 'bg-purple-50 text-purple-600' },
            { label: translations.account.freeDownloads[lang], value: downloads.length, icon: Download, color: 'bg-green-50 text-green-600' },
            { label: translations.account.reports[lang], value: attempts.filter(a => a.status === 'completed').length, icon: FileText, color: 'bg-brand-accent/10 text-brand-accent' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}><Icon size={16} /></div>
                <div><div className="font-heading font-black text-corp-dark text-2xl">{stat.value}</div><div className="text-slate-400 text-xs">{stat.label}</div></div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium flex-shrink-0 transition-all ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}>
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'assessments' && (
          attempts.length === 0
            ? <EmptyState icon={<BarChart2 size={28} />} title={lang === 'ar' ? 'لم تبدأ أي تقييم بعد' : 'No assessments started yet'} cta={{ label: lang === 'ar' ? 'استكشف التقييمات' : 'Explore Assessments', to: '/store/assessments' }} />
            : <div className="grid gap-4">{attempts.map(attempt => (
              <div key={attempt.id} className="bg-white rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center"><BarChart2 size={16} className="text-brand-primary" /></div>
                  <div>
                    <div className="font-medium text-corp-dark text-sm">
                      {attempt.product_type === 'career_orientation'
                        ? (lang === 'ar' ? 'مقياس الميول والتوجّه المهني' : 'Career Orientation')
                        : attempt.product_type === 'employee_competency'
                        ? (lang === 'ar' ? 'مقياس الكفاءات الأساسية' : 'Core Competency Assessment')
                        : `${lang === 'ar' ? 'تقييم' : 'Assessment'} #${attempt.assessment_id?.slice(-6)}`}
                    </div>
                    <div className="text-slate-400 text-xs">{attempt.status === 'completed' ? translations.account.completed[lang] : translations.account.inProgress[lang]}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {attempt.status === 'completed' && attempt.percentage && <span className="font-heading font-black text-brand-primary">{attempt.percentage}%</span>}
                  {attempt.status === 'completed'
                    ? <Link to={attempt.product_type === 'career_orientation' ? `/store/career/report/${attempt.id}` : attempt.product_type === 'employee_competency' ? `/store/competency/report/${attempt.id}` : `/store/assessments/${attempt.assessment_id}/results/${attempt.id}`} className="text-brand-primary text-xs flex items-center gap-1 hover:gap-1.5 transition-all">{translations.account.viewReport[lang]} <Arrow size={11} /></Link>
                    : attempt.product_type === 'career_orientation'
                    ? <Link to="/store/career/assessment" className="btn-catalyst px-3 py-1.5 rounded-full text-xs">{lang === 'ar' ? 'أكمل' : 'Continue'}</Link>
                    : <Link to={`/store/assessments/${attempt.assessment_id}/take`} className="btn-catalyst px-3 py-1.5 rounded-full text-xs">{lang === 'ar' ? 'أكمل' : 'Continue'}</Link>}
                </div>
              </div>
            ))}</div>
        )}

        {activeTab === 'purchases' && (
          orders.length === 0
            ? <EmptyState icon={<Package size={28} />} title={lang === 'ar' ? 'لا توجد مشتريات بعد' : 'No purchases yet'} cta={{ label: lang === 'ar' ? 'تصفح المنتجات' : 'Browse Products', to: '/store/products' }} />
            : <div className="grid gap-4">{orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-5 flex items-center justify-between">
                <div><div className="font-medium text-corp-dark">#{order.id?.slice(-6)}</div><div className="text-slate-400 text-xs">{new Date(order.created_date).toLocaleDateString()}</div></div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${order.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{order.status}</span>
                <span className="font-heading font-bold text-corp-dark">{order.total_amount?.toLocaleString()} {translations.common.currency[lang]}</span>
              </div>
            ))}</div>
        )}

        {activeTab === 'downloads' && (
          downloads.length === 0
            ? <EmptyState icon={<Download size={28} />} title={lang === 'ar' ? 'لا توجد تحميلات بعد' : 'No downloads yet'} cta={{ label: lang === 'ar' ? 'تصفح المجانيات' : 'Browse Free Products', to: '/store/products?category=free' }} />
            : <div className="grid gap-4">{downloads.map(dl => (
              <div key={dl.id} className="bg-white rounded-2xl p-5 flex items-center justify-between">
                <div className="font-medium text-corp-dark text-sm">{dl[`product_title_${lang}`] || dl.product_title_ar}</div>
                <button className="text-brand-primary text-xs flex items-center gap-1"><Download size={11} /> {translations.account.reDownload[lang]}</button>
              </div>
            ))}</div>
        )}

        {activeTab === 'orders' && (
          orders.length === 0
            ? <EmptyState icon={<ShoppingBag size={28} />} title={lang === 'ar' ? 'لا يوجد سجل' : 'No order history'} cta={{ label: lang === 'ar' ? 'تصفح المتجر' : 'Browse Store', to: '/store' }} />
            : <div className="grid gap-3">{orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 flex items-center justify-between text-sm">
                <span className="text-slate-500">#{order.id?.slice(-8)}</span>
                <span className="text-slate-700">{new Date(order.created_date).toLocaleDateString()}</span>
                <span className="font-bold text-corp-dark">{order.total_amount} {translations.common.currency[lang]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${order.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{order.status}</span>
              </div>
            ))}</div>
        )}
      </div>
      <StoreFooter />
    </div>
  );
}

function EmptyState({ icon, title, cta }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">{icon}</div>
      <p className="text-slate-500 mb-5">{title}</p>
      <Link to={cta.to} className="btn-authority px-6 py-2.5 rounded-full text-sm">{cta.label}</Link>
    </div>
  );
}