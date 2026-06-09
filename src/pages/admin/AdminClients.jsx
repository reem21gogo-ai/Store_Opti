import React, { useEffect, useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { Users, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminClients() {
  const { lang } = useLang();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    base44.entities.User.list('-created_date', 100).then(data => { setUsers(data); setLoading(false); });
  }, []);

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-heading font-black text-corp-dark text-2xl">{translations.admin.clients[lang]}</h1>
          <p className="text-slate-500 text-sm">{users.length} {lang === 'ar' ? 'مستخدم' : 'users'}</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={translations.common.search[lang]}
            className="ps-9 pe-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-brand-primary w-64" />
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse"></div>)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400"><Users size={28} className="mx-auto mb-3 opacity-30" /><p>{lang === 'ar' ? 'لا يوجد مستخدمون' : 'No users'}</p></div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100">
              {[lang === 'ar' ? 'الاسم' : 'Name', lang === 'ar' ? 'البريد' : 'Email', lang === 'ar' ? 'الدور' : 'Role', lang === 'ar' ? 'تاريخ التسجيل' : 'Registered'].map(h => (
                <th key={h} className="text-start px-5 py-3 text-xs font-bold text-slate-400 uppercase">{h}</th>
              ))}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-xs font-bold text-brand-primary">{u.full_name?.charAt(0) || '?'}</div>
                      <span className="font-medium text-corp-dark">{u.full_name || '-'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span></td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{new Date(u.created_date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}