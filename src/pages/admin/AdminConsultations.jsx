import React, { useEffect, useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { MessageSquare, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_OPTIONS = [
  { value: 'new', ar: 'جديد', en: 'New', color: 'bg-green-100 text-green-700' },
  { value: 'reviewing', ar: 'قيد المراجعة', en: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'contacted', ar: 'تم التواصل', en: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { value: 'closed', ar: 'مغلق', en: 'Closed', color: 'bg-slate-100 text-slate-600' },
];

export default function AdminConsultations() {
  const { lang } = useLang();
  const t = translations.consultation;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [notes, setNotes] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    base44.entities.ConsultationRequest.list('-created_date', 100).then(data => {
      setRequests(data);
      const notesMap = {};
      data.forEach(r => { notesMap[r.id] = r.internal_notes || ''; });
      setNotes(notesMap);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.ConsultationRequest.update(id, { status });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const saveNotes = async (id) => {
    setSavingId(id);
    await base44.entities.ConsultationRequest.update(id, { internal_notes: notes[id] });
    setSavingId(null);
  };

  const filtered = requests.filter(r => filterStatus === 'all' || r.status === filterStatus);
  const needLabel = v => t.needTypes.find(n => n.value === v)?.[lang] || v;
  const clientLabel = v => t.clientTypes.find(c => c.value === v)?.[lang] || v;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-heading font-black text-corp-dark text-2xl">{lang === 'ar' ? 'طلبات الاستشارة' : 'Consultation Requests'}</h1>
          <p className="text-slate-500 text-sm">{requests.length} {lang === 'ar' ? 'طلب' : 'requests'}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...STATUS_OPTIONS.map(s => s.value)].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? 'bg-brand-primary text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {s === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : (STATUS_OPTIONS.find(o => o.value === s)?.[lang] || s)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse"></div>)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400"><MessageSquare size={28} className="mx-auto mb-3 opacity-30" /><p>{lang === 'ar' ? 'لا توجد طلبات' : 'No requests'}</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => {
            const statusObj = STATUS_OPTIONS.find(s => s.value === req.status) || STATUS_OPTIONS[0];
            const expanded = expandedId === req.id;
            return (
              <div key={req.id} className="bg-white rounded-2xl overflow-hidden">
                <div className="p-5 flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(expanded ? null : req.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-corp-dark">{req.full_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusObj.color}`}>{statusObj[lang]}</span>
                    </div>
                    <div className="text-slate-400 text-xs mt-1">{req.email} · {clientLabel(req.client_type)} · {needLabel(req.need_type)}</div>
                    <div className="text-slate-400 text-xs">{new Date(req.created_date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select value={req.status} onChange={e => { e.stopPropagation(); updateStatus(req.id, e.target.value); }} onClick={e => e.stopPropagation()}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none">
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s[lang]}</option>)}
                    </select>
                    {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>
                {expanded && (
                  <div className="px-5 pb-5 border-t border-slate-50 pt-4">
                    {req.description && <div className="mb-4"><div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{lang === 'ar' ? 'وصف الاحتياج' : 'Need Description'}</div><p className="text-slate-600 text-sm leading-relaxed">{req.description}</p></div>}
                    {req.budget && <div className="mb-3 text-sm"><span className="text-slate-400 text-xs font-bold uppercase">{lang === 'ar' ? 'الميزانية: ' : 'Budget: '}</span><span className="text-slate-600">{req.budget}</span></div>}
                    {req.preferred_time && <div className="mb-4 text-sm"><span className="text-slate-400 text-xs font-bold uppercase">{lang === 'ar' ? 'وقت التواصل: ' : 'Contact Time: '}</span><span className="text-slate-600">{req.preferred_time}</span></div>}
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{translations.admin.notes[lang]}</div>
                      <div className="flex gap-2">
                        <textarea value={notes[req.id] || ''} onChange={e => setNotes(prev => ({ ...prev, [req.id]: e.target.value }))} rows={2}
                          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-brand-primary"
                          placeholder={lang === 'ar' ? 'أضف ملاحظة داخلية...' : 'Add internal note...'} />
                        <button onClick={() => saveNotes(req.id)} disabled={savingId === req.id} className="btn-authority px-3 py-2 rounded-xl text-xs flex items-center gap-1">
                          {savingId === req.id ? '...' : <><Save size={12} /> {translations.common.save[lang]}</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}