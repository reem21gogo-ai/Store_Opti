import React, { useEffect, useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { ShoppingBag } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminOrders() {
  const { lang } = useLang();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Order.list('-created_date', 100).then(data => { setOrders(data); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.Order.update(id, { status });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const statusColor = (s) => s === 'paid' ? 'bg-green-100 text-green-700' : s === 'pending' ? 'bg-yellow-100 text-yellow-700' : s === 'failed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600';

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading font-black text-corp-dark text-2xl">{translations.admin.orders[lang]}</h1>
        <p className="text-slate-500 text-sm">{orders.length} {lang === 'ar' ? 'طلب' : 'orders'}</p>
      </div>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse"></div>)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400"><ShoppingBag size={28} className="mx-auto mb-3 opacity-30" /><p>{lang === 'ar' ? 'لا توجد طلبات' : 'No orders'}</p></div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100">
              {[lang === 'ar' ? 'رقم الطلب' : 'Order ID', lang === 'ar' ? 'العميل' : 'Client', lang === 'ar' ? 'المبلغ' : 'Amount', lang === 'ar' ? 'الحالة' : 'Status', lang === 'ar' ? 'التاريخ' : 'Date'].map(h => (
                <th key={h} className="text-start px-5 py-3 text-xs font-bold text-slate-400 uppercase">{h}</th>
              ))}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{o.id?.slice(-8)}</td>
                  <td className="px-5 py-3"><div className="font-medium text-corp-dark">{o.user_name || o.user_email}</div><div className="text-slate-400 text-xs">{o.user_email}</div></td>
                  <td className="px-5 py-3 font-bold text-corp-dark">{o.total_amount?.toLocaleString()} {translations.common.currency[lang]}</td>
                  <td className="px-5 py-3">
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-none focus:outline-none cursor-pointer ${statusColor(o.status)}`}>
                      {['pending', 'paid', 'failed', 'refunded'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{new Date(o.created_date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}