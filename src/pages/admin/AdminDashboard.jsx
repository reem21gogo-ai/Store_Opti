import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { Package, BarChart2, ShoppingBag, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminDashboard() {
  const { lang, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [stats, setStats] = useState({ products: 0, assessments: 0, orders: 0, consultations: 0 });
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Product.list(),
      base44.entities.Assessment.list(),
      base44.entities.Order.list(),
      base44.entities.ConsultationRequest.list('-created_date', 5),
    ]).then(([products, assessments, orders, consultations]) => {
      setStats({ products: products.length, assessments: assessments.length, orders: orders.length, consultations: consultations.length });
      setRecentConsultations(consultations);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: lang === 'ar' ? 'المنتجات' : 'Products', value: stats.products, icon: Package, to: '/admin/products', color: 'bg-blue-500' },
    { label: lang === 'ar' ? 'التقييمات' : 'Assessments', value: stats.assessments, icon: BarChart2, to: '/admin/assessments', color: 'bg-purple-500' },
    { label: lang === 'ar' ? 'الطلبات' : 'Orders', value: stats.orders, icon: ShoppingBag, to: '/admin/orders', color: 'bg-green-500' },
    { label: lang === 'ar' ? 'طلبات الاستشارة' : 'Consultations', value: stats.consultations, icon: MessageSquare, to: '/admin/consultations', color: 'bg-brand-accent' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-black text-corp-dark text-3xl mb-1">{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</h1>
        <p className="text-slate-500 text-sm">{lang === 'ar' ? 'نظرة عامة على أوبتيفانس' : 'OPTIVANCE overview'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} to={card.to} className="bg-white rounded-2xl p-5 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-4`}><Icon size={18} className="text-white" /></div>
              <div className="font-heading font-black text-3xl text-corp-dark mb-1">{card.value}</div>
              <div className="text-slate-500 text-sm flex items-center gap-1">{card.label}<Arrow size={12} className="opacity-0 group-hover:opacity-100 transition-all" /></div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-corp-dark text-lg">{lang === 'ar' ? 'آخر طلبات الاستشارة' : 'Recent Consultation Requests'}</h2>
          <Link to="/admin/consultations" className="text-brand-primary text-sm hover:underline">{lang === 'ar' ? 'عرض الكل' : 'View All'}</Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse"></div>)}</div>
        ) : recentConsultations.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">{lang === 'ar' ? 'لا توجد طلبات بعد' : 'No requests yet'}</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentConsultations.map(req => (
              <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-corp-dark text-sm">{req.full_name}</div>
                  <div className="text-slate-400 text-xs">{req.email} · {req.need_type}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${req.status === 'new' ? 'bg-green-100 text-green-700' : req.status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' : req.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  {req.status === 'new' ? (lang === 'ar' ? 'جديد' : 'New') : req.status === 'reviewing' ? (lang === 'ar' ? 'قيد المراجعة' : 'Reviewing') : req.status === 'contacted' ? (lang === 'ar' ? 'تم التواصل' : 'Contacted') : lang === 'ar' ? 'مغلق' : 'Closed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}