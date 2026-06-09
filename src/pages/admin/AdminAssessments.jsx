import React, { useEffect, useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { translations, assessmentCategories } from '@/lib/i18n';
import { Plus, Edit2, Trash2, BarChart2, X, Save } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const EMPTY = { title_ar: '', title_en: '', description_ar: '', description_en: '', category: 'leadership', duration_minutes: 15, question_count: 0, is_free: false, price: 0, is_published: false };

export default function AdminAssessments() {
  const { lang } = useLang();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.Assessment.list('-created_date', 100).then(data => { setAssessments(data); setLoading(false); });
  }, []);

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (a) => { setForm({ ...a }); setEditing(a.id); };
  const closeForm = () => setEditing(null);
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    if (editing === 'new') {
      const created = await base44.entities.Assessment.create(form);
      setAssessments(prev => [created, ...prev]);
    } else {
      const updated = await base44.entities.Assessment.update(editing, form);
      setAssessments(prev => prev.map(a => a.id === editing ? updated : a));
    }
    setSaving(false); closeForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return;
    await base44.entities.Assessment.delete(id);
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-black text-corp-dark text-2xl">{translations.admin.assessments[lang]}</h1>
          <p className="text-slate-500 text-sm">{assessments.length} {lang === 'ar' ? 'تقييم' : 'assessments'}</p>
        </div>
        <button onClick={openNew} className="btn-catalyst px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm"><Plus size={16} /> {translations.common.add[lang]}</button>
      </div>

      {loading ? (
        <div className="grid gap-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse"></div>)}</div>
      ) : assessments.length === 0 ? (
        <div className="text-center py-20 text-slate-400"><BarChart2 size={28} className="mx-auto mb-3 opacity-30" /><p>{lang === 'ar' ? 'لا توجد تقييمات' : 'No assessments'}</p></div>
      ) : (
        <div className="grid gap-3">
          {assessments.map(a => (
            <div key={a.id} className="bg-white rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0"><BarChart2 size={16} className="text-purple-600" /></div>
                <div className="min-w-0">
                  <div className="font-medium text-corp-dark text-sm truncate">{a[`title_${lang}`] || a.title_ar}</div>
                  <div className="text-slate-400 text-xs flex items-center gap-2">
                    <span>{a.category}</span><span>·</span><span>{a.duration_minutes} {translations.assessment.minutes[lang]}</span><span>·</span>
                    {a.is_free ? <span className="text-brand-accent font-bold">{translations.common.free[lang]}</span> : <span>{a.price} {translations.common.currency[lang]}</span>}
                    <span className={`px-1.5 py-0.5 rounded text-xs ${a.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{a.is_published ? (lang === 'ar' ? 'منشور' : 'Published') : (lang === 'ar' ? 'مسودة' : 'Draft')}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(a)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-brand-primary transition-all"><Edit2 size={15} /></button>
                <button onClick={() => handleDelete(a.id)} className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeForm}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-black text-corp-dark text-xl">{editing === 'new' ? (lang === 'ar' ? 'تقييم جديد' : 'New Assessment') : (lang === 'ar' ? 'تعديل التقييم' : 'Edit Assessment')}</h2>
              <button onClick={closeForm}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{ k: 'title_ar', label: 'العنوان (عربي)' }, { k: 'title_en', label: 'Title (English)' }].map(f => (
                <div key={f.k}><label className="block text-xs font-bold text-slate-500 mb-1">{f.label}</label>
                  <input value={form[f.k]} onChange={e => set(f.k, e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" /></div>
              ))}
              <div><label className="block text-xs font-bold text-slate-500 mb-1">{lang === 'ar' ? 'الفئة' : 'Category'}</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary">
                  {assessmentCategories.map(c => <option key={c.value} value={c.value}>{c[lang]}</option>)}
                </select></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">{lang === 'ar' ? 'المدة (دقيقة)' : 'Duration (minutes)'}</label>
                <input type="number" value={form.duration_minutes} onChange={e => set('duration_minutes', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">{lang === 'ar' ? 'السعر' : 'Price'}</label>
                <input type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" /></div>
            </div>
            <div className="flex gap-3 mt-4">
              {[{ k: 'is_free', label: lang === 'ar' ? 'مجاني' : 'Free' }, { k: 'is_published', label: lang === 'ar' ? 'منشور' : 'Published' }].map(f => (
                <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[f.k]} onChange={e => set(f.k, e.target.checked)} className="rounded" />
                  <span className="text-sm text-slate-600">{f.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[{ k: 'description_ar', label: 'الوصف (عربي)' }, { k: 'description_en', label: 'Description (English)' }].map(f => (
                <div key={f.k}><label className="block text-xs font-bold text-slate-500 mb-1">{f.label}</label>
                  <textarea value={form[f.k]} onChange={e => set(f.k, e.target.value)} rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary resize-none" /></div>
              ))}
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={closeForm} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm">{translations.common.cancel[lang]}</button>
              <button onClick={handleSave} disabled={saving} className="btn-catalyst px-6 py-2 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60">
                {saving ? <div className="w-4 h-4 border-2 border-corp-dark/30 border-t-corp-dark rounded-full animate-spin"></div> : <><Save size={14} /> {translations.common.save[lang]}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}