import React, { useEffect, useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { translations, productCategories } from '@/lib/i18n';
import { Plus, Edit2, Trash2, Package, X, Save } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const EMPTY = { title_ar: '', title_en: '', description_ar: '', description_en: '', category: 'leadership', product_type: 'digital_file', price: 0, is_free: false, is_featured: false, is_published: false, cover_image_url: '', file_url: '' };

export default function AdminProducts() {
  const { lang } = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.Product.list('-created_date', 100).then(data => { setProducts(data); setLoading(false); });
  }, []);

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); };
  const closeForm = () => setEditing(null);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    if (editing === 'new') {
      const created = await base44.entities.Product.create(form);
      setProducts(prev => [created, ...prev]);
    } else {
      const updated = await base44.entities.Product.update(editing, form);
      setProducts(prev => prev.map(p => p.id === editing ? updated : p));
    }
    setSaving(false); closeForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return;
    await base44.entities.Product.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-black text-corp-dark text-2xl">{translations.admin.products[lang]}</h1>
          <p className="text-slate-500 text-sm">{products.length} {lang === 'ar' ? 'منتج' : 'products'}</p>
        </div>
        <button onClick={openNew} className="btn-catalyst px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm"><Plus size={16} /> {translations.common.add[lang]}</button>
      </div>

      {loading ? (
        <div className="grid gap-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse"></div>)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-400"><Package size={28} className="mx-auto mb-3 opacity-30" /><p>{lang === 'ar' ? 'لا توجد منتجات' : 'No products'}</p></div>
      ) : (
        <div className="grid gap-3">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0"><Package size={16} className="text-brand-primary" /></div>
                <div className="min-w-0">
                  <div className="font-medium text-corp-dark text-sm truncate">{p[`title_${lang}`] || p.title_ar}</div>
                  <div className="text-slate-400 text-xs flex items-center gap-2">
                    <span>{p.category}</span>
                    {p.is_free ? <span className="text-brand-accent font-bold">{translations.common.free[lang]}</span> : <span>{p.price?.toLocaleString()} {translations.common.currency[lang]}</span>}
                    <span className={`px-1.5 py-0.5 rounded text-xs ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{p.is_published ? (lang === 'ar' ? 'منشور' : 'Published') : (lang === 'ar' ? 'مسودة' : 'Draft')}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-brand-primary transition-all"><Edit2 size={15} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/New Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeForm}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-black text-corp-dark text-xl">{editing === 'new' ? (lang === 'ar' ? 'منتج جديد' : 'New Product') : (lang === 'ar' ? 'تعديل المنتج' : 'Edit Product')}</h2>
              <button onClick={closeForm}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{ k: 'title_ar', label: 'العنوان (عربي)' }, { k: 'title_en', label: 'Title (English)' }].map(f => (
                <div key={f.k}><label className="block text-xs font-bold text-slate-500 mb-1">{f.label}</label>
                  <input value={form[f.k]} onChange={e => set(f.k, e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" /></div>
              ))}
              <div><label className="block text-xs font-bold text-slate-500 mb-1">{lang === 'ar' ? 'الفئة' : 'Category'}</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary">
                  {productCategories.map(c => <option key={c.value} value={c.value}>{c[lang]}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">{lang === 'ar' ? 'السعر' : 'Price'}</label>
                <input type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">{lang === 'ar' ? 'رابط الغلاف' : 'Cover Image URL'}</label>
                <input value={form.cover_image_url} onChange={e => set('cover_image_url', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">{lang === 'ar' ? 'رابط الملف' : 'File URL'}</label>
                <input value={form.file_url} onChange={e => set('file_url', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary" /></div>
            </div>
            <div className="flex gap-3 mt-4">
              {[{ k: 'is_free', label: lang === 'ar' ? 'مجاني' : 'Free' }, { k: 'is_featured', label: lang === 'ar' ? 'مميز' : 'Featured' }, { k: 'is_published', label: lang === 'ar' ? 'منشور' : 'Published' }].map(f => (
                <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[f.k]} onChange={e => set(f.k, e.target.checked)} className="rounded" />
                  <span className="text-sm text-slate-600">{f.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[{ k: 'description_ar', label: 'الوصف (عربي)', rows: 2 }, { k: 'description_en', label: 'Description (English)', rows: 2 }].map(f => (
                <div key={f.k}><label className="block text-xs font-bold text-slate-500 mb-1">{f.label}</label>
                  <textarea value={form[f.k]} onChange={e => set(f.k, e.target.value)} rows={f.rows} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary resize-none" /></div>
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