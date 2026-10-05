import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

const AGE_RANGES = {
  ar: [
    { value: 'under_18', label: 'أقل من 18' },
    { value: '18_24', label: '18 - 24' },
    { value: '25_34', label: '25 - 34' },
    { value: '35_44', label: '35 - 44' },
    { value: '45_54', label: '45 - 54' },
    { value: '55_plus', label: '55 أو أكثر' },
  ],
  en: [
    { value: 'under_18', label: 'Under 18' },
    { value: '18_24', label: '18 - 24' },
    { value: '25_34', label: '25 - 34' },
    { value: '35_44', label: '35 - 44' },
    { value: '45_54', label: '45 - 54' },
    { value: '55_plus', label: '55 or more' },
  ],
};

/**
 * QuickLeadForm — minimal "save your result" form, shown only after the result.
 */
export default function QuickLeadForm({ lang = 'ar', isRTL = true, saving = false, onSave }) {
  const t = (ar, en) => (lang === 'ar' ? ar : en);
  const [firstName, setFirstName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !contact.trim()) {
      setError(t('يرجى إكمال الاسم وبيانات التواصل', 'Please complete your name and contact'));
      return;
    }
    setError('');
    const isEmail = contact.includes('@');
    onSave({
      first_name: firstName.trim(),
      age_range: ageRange || undefined,
      contact: contact.trim(),
      contact_type: isEmail ? 'email' : 'mobile',
    });
  };

  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-corp-dark placeholder:text-slate-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all';

  return (
    <form onSubmit={submit} className="space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('الاسم الأول', 'First name')}</label>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} placeholder={t('مثال: نورة', 'e.g. Nora')} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('الفئة العمرية', 'Age range')}</label>
        <select value={ageRange} onChange={e => setAgeRange(e.target.value)} className={inputCls}>
          <option value="">{t('اختر الفئة العمرية', 'Select age range')}</option>
          {AGE_RANGES[lang === 'ar' ? 'ar' : 'en'].map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('البريد الإلكتروني أو رقم الجوال', 'Email or mobile number')}</label>
        <input
          value={contact}
          onChange={e => setContact(e.target.value)}
          className={inputCls}
          dir="ltr"
          placeholder={t('name@email.com', 'name@email.com')}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-4 rounded-2xl font-heading font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        {t('احفظ نتيجتي', 'Save my result')}
      </button>
    </form>
  );
}