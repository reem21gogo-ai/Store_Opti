import React from 'react';
import { useLang } from '@/lib/LanguageContext';
import { DOMAINS } from '@/lib/competencyContent';

const NAVY = '#0f2942';
const BLUE_DEEP = '#4f7fae';
const TEAL = '#64ddb1';
const LINE = '#dce5eb';
const MUTED = '#788894';

const LEVELS = {
  strong: { color: '#4bb98e', bar: '#4bb98e', ar: 'قوة', en: 'Strength' },
  moderate: { color: '#6f98bf', bar: '#6f98bf', ar: 'متوسط', en: 'Moderate' },
  needs: { color: '#b67921', bar: '#e7a54b', ar: 'يحتاج تطوير', en: 'Needs Development' },
  critical: { color: '#d85c5c', bar: '#d85c5c', ar: 'أولوية عاجلة', en: 'Urgent Priority' },
};

const PREVIEW_DOMAINS = [
  { id: 'thought_analysis', score: 73, level: 'strong' },
  { id: 'results_execution', score: 40, level: 'needs' },
  { id: 'people_collaboration', score: 15, level: 'critical' },
  { id: 'self_leadership', score: 20, level: 'critical' },
  { id: 'customer_value', score: 56, level: 'moderate' },
  { id: 'digital_compliance', score: 73, level: 'strong' },
];

const HIGHLIGHTS = [
  { name: 'Digital Tool Proficiency', value: '75%', color: '#4bb98e' },
  { name: 'Emotional Intelligence', value: '13%', color: '#d85c5c' },
];

const COPY = {
  ar: {
    label: 'معاينة التقرير',
    kicker: 'مستوى الكفاءة عبر المجالات الرئيسية',
    overallMini: 'النتيجة الإجمالية',
    overallState: 'أساس مهني قوي',
    strengthLabel: 'أبرز نقطة قوة',
    priorityLabel: 'أولوية التطوير',
    insightTitle: 'يشمل التقرير أيضًا',
    chips: ['تحليل كل مجال', 'الكفاءات الفرعية', 'فرص التطوير', 'خطة النمو'],
    note: 'معاينة مختصرة من التقرير الكامل',
  },
  en: {
    label: 'Report Preview',
    kicker: 'Competency level across key domains',
    overallMini: 'Overall Score',
    overallState: 'Strong professional foundation',
    strengthLabel: 'Top strength',
    priorityLabel: 'Development priority',
    insightTitle: 'The report also includes',
    chips: ['Domain deep-dive', 'Sub-competencies', 'Development opportunities', 'Growth plan'],
    note: 'Short preview from the full report',
  },
};

export default function CompetencyOutputPreview() {
  const { lang, isRTL } = useLang();
  const c = COPY[lang === 'ar' ? 'ar' : 'en'];
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <div className="bg-white border border-[#e3e8ec] rounded-[18px] overflow-hidden" style={{ boxShadow: '0 8px 24px rgba(15,41,66,.035)' }}>

      <div className="h-12 px-[18px] flex items-center justify-between" style={{ background: NAVY }}>
        <span className="text-white text-xs font-extrabold">{c.label}</span>
        <span className="flex items-center gap-[7px] text-[9.5px] whitespace-nowrap" style={{ color: '#a9c0d4' }}>
          <span className="w-[7px] h-[7px] rounded-full flex-none" style={{ background: TEAL }} />
          Employee Core Competency Assessment
        </span>
      </div>

      <div className="p-3.5 grid grid-cols-1 md:grid-cols-[minmax(0,1.38fr)_minmax(205px,0.62fr)] gap-3 items-stretch" dir="ltr">

        {/* Domains */}
        <div className="min-w-0" dir={dir}>
          <div className="text-[10px] font-extrabold mb-2" style={{ color: BLUE_DEEP }}>{c.kicker}</div>
          <div className="grid grid-cols-2 gap-2">
            {PREVIEW_DOMAINS.map(item => {
              const level = LEVELS[item.level];
              const name = DOMAINS.find(d => d.id === item.id)?.name[lang] || '';
              return (
                <div key={item.id} className="flex flex-col justify-between min-w-0 min-h-[67px] rounded-[10px] px-2.5 py-[9px] bg-white" style={{ border: `1px solid ${LINE}` }}>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 items-start">
                    <div>
                      <div className="text-[9.2px] font-extrabold leading-[1.4]" style={{ color: '#253a4d' }}>{name}</div>
                      <div className="text-[6.8px] font-extrabold leading-tight mt-0.5" style={{ color: level.color }}>{level[lang]}</div>
                    </div>
                    <div className="text-[11px] font-black leading-none pt-px" style={{ color: level.color }} dir="ltr">{item.score}%</div>
                  </div>
                  <div className="h-1 mt-2 rounded-full overflow-hidden" style={{ background: '#edf1f4' }} dir="ltr">
                    <span className="block h-full rounded-full" style={{ width: `${item.score}%`, background: level.bar }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <aside className="flex flex-col min-w-0 min-h-[220px] md:min-h-0 rounded-[13px] p-2.5" dir={dir} style={{ border: `1px solid ${LINE}`, background: '#fbfcfd' }}>
          <div className="relative overflow-hidden grid grid-cols-[58px_minmax(0,1fr)] gap-[9px] items-center rounded-[11px] p-2.5" style={{ background: NAVY }} dir="ltr">
            <span className="absolute w-[78px] h-[78px] rounded-full" style={{ left: '-34px', bottom: '-42px', background: 'radial-gradient(circle, rgba(100,221,177,.28), transparent 68%)' }} />
            <div className="relative z-[2] w-[54px] h-[54px] rounded-full grid place-items-center" style={{ background: `conic-gradient(${TEAL} 78%, rgba(255,255,255,.14) 0)` }}>
              <span className="absolute rounded-full" style={{ inset: '7px', background: NAVY }} />
              <span className="relative z-[2] text-center">
                <strong className="block text-[17px] leading-none font-black text-white">78%</strong>
                <span className="block text-[6px] mt-0.5" style={{ color: '#a9c0d4' }}>Overall</span>
              </span>
            </div>
            <div className="relative z-[2] min-w-0" dir={dir}>
              <div className="text-[6.8px] mb-0.5" style={{ color: '#a9c0d4' }}>{c.overallMini}</div>
              <div className="text-[11px] font-black leading-tight text-white">{c.overallState}</div>
              <div className="text-[6.8px] font-extrabold mt-0.5" style={{ color: TEAL }}>Proficient</div>
            </div>
          </div>

          <div className="grid gap-1.5 mt-[7px]">
            {HIGHLIGHTS.map((h, i) => (
              <div key={h.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-[7px] items-center rounded-lg px-2 py-[7px]" style={{ background: '#f4f7f8' }}>
                <div className="min-w-0">
                  <div className="text-[6.5px] font-extrabold mb-0.5" style={{ color: MUTED }}>{i === 0 ? c.strengthLabel : c.priorityLabel}</div>
                  <div className="text-[7.7px] font-extrabold leading-tight" style={{ color: '#394b58' }}>{h.name}</div>
                </div>
                <div className="text-[11px] font-black" style={{ color: h.color }} dir="ltr">{h.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-[7px] pt-[7px]" style={{ borderTop: `1px solid ${LINE}` }}>
            <div className="text-[6.8px] font-extrabold mb-1.5" style={{ color: MUTED }}>{c.insightTitle}</div>
            <div className="grid grid-cols-2 gap-1">
              {c.chips.map(chip => (
                <span key={chip} className="text-[6.4px] leading-tight text-center font-extrabold rounded-full px-[5px] py-1" style={{ background: '#edf4fa', color: BLUE_DEEP }}>{chip}</span>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-1.5 text-center text-[6.6px]" style={{ color: '#93a0a9' }}>{c.note}</div>
        </aside>
      </div>
    </div>
  );
}