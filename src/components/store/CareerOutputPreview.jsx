import React from 'react';
import { useLang } from '@/lib/LanguageContext';

const NAVY = '#0f2942';
const BLUE_DEEP = '#4f7fae';
const TEAL = '#64ddb1';
const LINE = '#dce5eb';
const MUTED = '#788894';
const INK = '#2d2d2d';

const CONTENT = {
  ar: {
    label: 'معاينة التقرير',
    kicker: 'أعلى المسارات المهنية المتوافقة مع ملفك',
    metaLabels: { demand: 'طلب السوق', growth: 'النمو' },
    codeTitle: 'رمز هولاند المهني',
    insightTitle: 'يشمل التقرير أيضًا',
    chips: ['قيم العمل', 'نقاط القوة', 'أسلوب العمل', 'بيئة العمل'],
    note: 'معاينة مختصرة من التقرير الكامل',
  },
  en: {
    label: 'Report Preview',
    kicker: 'Top career paths matching your profile',
    metaLabels: { demand: 'Market demand', growth: 'Growth' },
    codeTitle: 'Holland Career Code',
    insightTitle: 'The report also includes',
    chips: ['Work Values', 'Strengths', 'Work Style', 'Work Environment'],
    note: 'Short preview from the full report',
  },
};

const CAREERS = [
  { rank: '1', name: 'Digital Marketing Manager', score: 92, demand: '9/10', growth: '5/5', holland: 'EAC' },
  { rank: '2', name: 'Graphic / UX Designer', score: 90, demand: '7/10', growth: '4/5', holland: 'AIC' },
  { rank: '3', name: 'Business Development Manager', score: 88, demand: '9/10', growth: '5/5', holland: 'EC' },
];

const TYPES = [
  { pct: '88%', label: 'Artistic' },
  { pct: '82%', label: 'Enterprising' },
  { pct: '72%', label: 'Investigative' },
];

export default function CareerOutputPreview() {
  const { lang, isRTL } = useLang();
  const c = CONTENT[lang === 'ar' ? 'ar' : 'en'];
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <div
      className="bg-white border border-[#e3e8ec] rounded-[18px] overflow-hidden"
      style={{ boxShadow: '0 8px 24px rgba(15,41,66,.035)' }}>

      <div className="h-12 flex items-center justify-between px-5" style={{ background: NAVY }}>
        <span className="text-white text-xs font-extrabold">{c.label}</span>
        <span className="flex items-center gap-2 text-[10px]" style={{ color: '#a9c0d4' }}>
          <span className="w-[7px] h-[7px] rounded-full" style={{ background: TEAL }} />
          Career Orientation Assessment
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.32fr_0.68fr] gap-[13px] p-[15px_18px_14px] md:h-[282px]" dir="ltr">

        <div className="min-w-0" dir={dir}>
          <div className="text-[10px] font-extrabold mb-1.5" style={{ color: BLUE_DEEP }}>{c.kicker}</div>
          <div className="grid gap-2">
            {CAREERS.map(job => (
              <div key={job.rank} className="rounded-[11px] px-2.5 py-2 bg-white" style={{ border: `1px solid ${LINE}` }}>
                <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center" dir={dir}>
                  <span className="w-[21px] h-[21px] rounded-[6px] grid place-items-center text-white text-[10px] font-bold" style={{ background: NAVY }}>{job.rank}</span>
                  <span className="text-[11px] font-extrabold truncate" style={{ color: INK }}>{job.name}</span>
                  <span className="text-xs font-extrabold" style={{ color: BLUE_DEEP }} dir="ltr">{job.score}%</span>
                </div>
                <div className="h-[5px] mt-1.5 rounded-full overflow-hidden" style={{ background: '#edf1f4' }} dir="ltr">
                  <span className="block h-full rounded-full" style={{ width: `${job.score}%`, background: `linear-gradient(90deg, ${BLUE_DEEP}, ${TEAL})` }} />
                </div>
                <div className="flex gap-2.5 mt-1.5 text-[8px]" style={{ color: MUTED }} dir={dir}>
                  <span>{c.metaLabels.demand} <b style={{ color: '#465763' }}>{job.demand}</b></span>
                  <span>{c.metaLabels.growth} <b style={{ color: '#465763' }}>{job.growth}</b></span>
                  <span>Holland <b style={{ color: '#465763' }}>{job.holland}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col rounded-[13px] p-3" dir={dir} style={{ border: `1px solid ${LINE}`, background: '#fbfcfd' }}>
          <div className="relative overflow-hidden rounded-[11px] px-2.5 py-3 text-center" style={{ background: NAVY }}>
            <span className="absolute w-[70px] h-[70px] rounded-full" style={{ left: '-28px', bottom: '-34px', background: 'radial-gradient(circle, rgba(100,221,177,.28), transparent 68%)' }} />
            <div className="text-[8px] mb-1" style={{ color: '#a9c0d4' }}>{c.codeTitle}</div>
            <div className="text-[27px] leading-none font-black text-white" style={{ letterSpacing: '3px' }} dir="ltr">AEI</div>
            <div className="text-[8px] font-extrabold mt-1.5" style={{ color: TEAL }}>Artistic · Enterprising · Investigative</div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-2" dir="ltr">
            {TYPES.map(t => (
              <div key={t.label} className="rounded-lg py-2 px-1 text-center" style={{ background: '#f4f7f8' }}>
                <span className="block text-[11px] font-black" style={{ color: TEAL }}>{t.pct}</span>
                <span className="block text-[7px] truncate" style={{ color: '#64747f' }}>{t.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${LINE}` }}>
            <div className="text-[8px] font-extrabold mb-1.5" style={{ color: MUTED }}>{c.insightTitle}</div>
            <div className="flex flex-wrap gap-1.5">
              {c.chips.map(chip => (
                <span key={chip} className="text-[8px] font-extrabold rounded-full px-2 py-1" style={{ background: '#edf4fa', color: BLUE_DEEP }}>{chip}</span>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-2 text-center text-[8px]" style={{ color: '#93a0a9' }}>{c.note}</div>
        </aside>
      </div>
    </div>
  );
}