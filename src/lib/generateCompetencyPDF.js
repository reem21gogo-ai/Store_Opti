/**
 * generateCompetencyPDF — canvas-based multi-page PDF generator
 * Produces a visually rich, bilingual (AR RTL / EN LTR) infographic report.
 */
import jsPDF from 'jspdf';
import { DOMAINS, BAND_CONFIG, getBand, OVERALL_SUMMARIES, LEVEL_LABELS } from './competencyContent';

// ─── brand tokens ─────────────────────────────────────────────────────────────
const C = {
  primary:   '#1A3A5C',
  accent:    '#05E1AE',
  dark:      '#0D1F33',
  surface:   '#162F4A',
  white:     '#FFFFFF',
  slate50:   '#F8FAFC',
  slate100:  '#F1F5F9',
  slate300:  '#CBD5E1',
  slate400:  '#94A3B8',
  slate500:  '#64748B',
  slate600:  '#475569',
  slate700:  '#334155',
  slate900:  '#0F172A',
  strong:    '#05E1AE',
  proficient:'#3a9abf',
  moderate:  '#F59E0B',
  critical:  '#EF4444',
};

const BAND_COLORS = {
  Strong:     C.strong,
  Proficient: C.proficient,
  Moderate:   C.moderate,
  Critical:   C.critical,
};
const BAND_BG = {
  Strong:     '#05e1ae18',
  Proficient: '#3a9abf18',
  Moderate:   '#f59e0b18',
  Critical:   '#ef444418',
};

const bandColor = (band) => BAND_COLORS[band] || C.slate500;
const bandLabel = (band, lang) => BAND_CONFIG[band]?.label?.[lang] || band;

// ─── canvas helpers ────────────────────────────────────────────────────────────
const W = 210; // A4 mm width
const H = 297; // A4 mm height
const PX = 3.7795; // 1 mm in px at 96dpi

function mm(v) { return v * PX; }

class Page {
  constructor(isRTL) {
    this.isRTL = isRTL;
    this.canvas = document.createElement('canvas');
    this.canvas.width  = Math.round(mm(W));
    this.canvas.height = Math.round(mm(H));
    this.ctx = this.canvas.getContext('2d');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  get c() { return this.ctx; }
  get cw() { return this.canvas.width; }
  get ch() { return this.canvas.height; }

  // convert mm coords
  x(mmVal) { return Math.round(mm(mmVal)); }
  y(mmVal) { return Math.round(mm(mmVal)); }
  w(mmVal) { return Math.round(mm(mmVal)); }
  h(mmVal) { return Math.round(mm(mmVal)); }

  // RTL-aware x: from right edge
  rx(mmVal) { return this.cw - Math.round(mm(mmVal)); }

  // text helpers
  text(txt, mmX, mmY, opts = {}) {
    const { size = 10, color = C.slate700, weight = 'normal', align = 'start', maxWidth } = opts;
    const c = this.ctx;
    c.save();
    c.fillStyle = color;
    c.font = `${weight} ${Math.round(size * PX * 0.4)}px Arial, sans-serif`;
    c.textAlign = align;
    if (maxWidth) c.fillText(String(txt), this.x(mmX), this.y(mmY), this.w(maxWidth));
    else c.fillText(String(txt), this.x(mmX), this.y(mmY));
    c.restore();
  }

  wrapText(txt, mmX, mmY, mmMaxW, mmLineH, opts = {}) {
    const { size = 9, color = C.slate600, weight = 'normal' } = opts;
    const c = this.ctx;
    c.save();
    c.fillStyle = color;
    c.font = `${weight} ${Math.round(size * PX * 0.4)}px Arial, sans-serif`;
    const words = String(txt).split(' ');
    let line = '';
    let y = this.y(mmY);
    const maxW = this.w(mmMaxW);
    words.forEach((word, i) => {
      const test = line ? line + ' ' + word : word;
      if (c.measureText(test).width > maxW && i > 0) {
        c.fillText(line, this.x(mmX), y);
        line = word;
        y += this.h(mmLineH);
      } else {
        line = test;
      }
    });
    if (line) c.fillText(line, this.x(mmX), y);
    c.restore();
    return (y - this.y(mmY)) / this.h(mmLineH) + 1; // lines used
  }

  rect(mmX, mmY, mmW, mmH, fill, stroke, radius = 0) {
    const c = this.ctx;
    c.save();
    const x = this.x(mmX), y = this.y(mmY), w = this.w(mmW), h = this.h(mmH);
    c.beginPath();
    if (radius) {
      const r = this.w(radius);
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
    } else {
      c.rect(x, y, w, h);
    }
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
    c.restore();
  }

  circle(mmCX, mmCY, mmR, fill, stroke, strokeW = 1) {
    const c = this.ctx;
    c.save();
    c.beginPath();
    c.arc(this.x(mmCX), this.y(mmCY), this.w(mmR), 0, Math.PI * 2);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = strokeW * PX * 0.3; c.stroke(); }
    c.restore();
  }

  arc(mmCX, mmCY, mmR, startAngle, endAngle, color, strokeW = 3) {
    const c = this.ctx;
    c.save();
    c.beginPath();
    c.arc(this.x(mmCX), this.y(mmCY), this.w(mmR), startAngle, endAngle);
    c.strokeStyle = color;
    c.lineWidth = strokeW * PX * 0.3;
    c.lineCap = 'round';
    c.stroke();
    c.restore();
  }

  line(mmX1, mmY1, mmX2, mmY2, color, width = 0.3) {
    const c = this.ctx;
    c.save();
    c.beginPath();
    c.moveTo(this.x(mmX1), this.y(mmY1));
    c.lineTo(this.x(mmX2), this.y(mmY2));
    c.strokeStyle = color;
    c.lineWidth = width * PX * 0.3;
    c.stroke();
    c.restore();
  }

  progressBar(mmX, mmY, mmW, mmH, pct, fg, bg = C.slate100, radius = 1) {
    this.rect(mmX, mmY, mmW, mmH, bg, null, radius);
    if (pct > 0) this.rect(mmX, mmY, mmW * (pct / 100), mmH, fg, null, radius);
  }

  // header / footer shared
  pageFooter(lang, pageNum, total) {
    const t = (ar, en) => lang === 'ar' ? ar : en;
    this.rect(0, H - 8, W, 8, C.primary);
    const leftTxt  = t('مقياس الكفاءات الأساسية | تقرير سري', 'Core Competency Assessment | Confidential Report');
    const rightTxt = t(`صفحة ${pageNum} من ${total}`, `Page ${pageNum} of ${total}`);
    this.text('OPTIVANCE', 8, H - 3, { size: 7, color: C.accent, weight: 'bold' });
    this.text(leftTxt, 28, H - 3, { size: 6, color: C.white + 'aa' });
    this.text(rightTxt, W - 8, H - 3, { size: 6, color: C.white + 'aa', align: 'end' });
  }

  toDataURL() { return this.canvas.toDataURL('image/png', 1.0); }
}

// ─── page builders ─────────────────────────────────────────────────────────────

function buildCover(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const user = rpt.user || {};
  const overall = rpt.overall || { score: 0, band: 'Moderate' };
  const levelLabel = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '';

  // Dark gradient bg
  const grd = p.c.createLinearGradient(0, 0, p.cw, p.ch);
  grd.addColorStop(0, C.dark);
  grd.addColorStop(0.6, C.primary);
  grd.addColorStop(1, C.surface);
  p.c.fillStyle = grd;
  p.c.fillRect(0, 0, p.cw, p.ch);

  // Grid overlay
  p.c.save();
  p.c.globalAlpha = 0.04;
  p.c.strokeStyle = C.accent;
  p.c.lineWidth = 0.5;
  for (let i = 0; i < p.cw; i += mm(10)) { p.c.beginPath(); p.c.moveTo(i, 0); p.c.lineTo(i, p.ch); p.c.stroke(); }
  for (let j = 0; j < p.ch; j += mm(10)) { p.c.beginPath(); p.c.moveTo(0, j); p.c.lineTo(p.cw, j); p.c.stroke(); }
  p.c.restore();

  // Accent bars at top
  p.rect(0, 0, W, 2, C.accent);
  p.rect(0, 2, 20, 2, C.primary + 'cc');

  // Logo pill
  p.rect(isRTL ? W - 55 : 8, 12, 48, 10, C.accent + '22', C.accent + '55', 5);
  p.text('OPTIVANCE', isRTL ? W - 52 : 11, 18.5, { size: 9, color: C.accent, weight: 'bold' });

  // Report type badge
  const badgeTxt = t('تقرير الكفاءات المهنية', 'Professional Competency Report');
  p.rect(isRTL ? W - 100 : 8, 28, 92, 8, C.white + '14', C.white + '30', 4);
  p.text(badgeTxt, isRTL ? W - 52 : 12, 33.5, { size: 7, color: C.white + 'bb', align: isRTL ? 'end' : 'start' });

  // Main title
  const title1 = t('تقرير الجدارات', 'Competency');
  const title2 = t('والنمو المهني', 'Growth Report');
  p.text(title1, isRTL ? W - 8 : 8, 60, { size: 24, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });
  p.text(title2, isRTL ? W - 8 : 8, 76, { size: 24, color: C.accent, weight: 'bold', align: isRTL ? 'end' : 'start' });

  const tagline = t('تقييم علمي معمّق يقيس جداراتك في ٦ مجالات رئيسية', 'A deep scientific assessment measuring your competencies across 6 key domains');
  p.wrapText(tagline, isRTL ? 8 : 8, 86, 130, 5, { size: 8, color: C.white + '88' });

  // Divider
  p.line(8, 96, W - 8, 96, C.accent + '44', 0.5);

  // Score circle
  const cx = isRTL ? 45 : W - 45, cy = 130, r = 22;
  p.c.save();
  p.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2, C.white + '18', 5);
  const pct = overall.score / 100;
  const endA = -Math.PI / 2 + pct * Math.PI * 2;
  // gradient arc
  const g2 = p.c.createLinearGradient(p.x(cx) - p.w(r), p.y(cy), p.x(cx) + p.w(r), p.y(cy));
  g2.addColorStop(0, C.accent);
  g2.addColorStop(1, C.proficient);
  p.c.save();
  p.c.beginPath();
  p.c.arc(p.x(cx), p.y(cy), p.w(r), -Math.PI / 2, endA);
  p.c.strokeStyle = g2;
  p.c.lineWidth = mm(4);
  p.c.lineCap = 'round';
  p.c.stroke();
  p.c.restore();

  p.text(overall.score + '%', cx, cy + 1.5, { size: 16, color: C.white, weight: 'bold', align: 'center' });
  p.text(t('النتيجة الإجمالية', 'Overall Score'), cx, cy + 7, { size: 6, color: C.white + '88', align: 'center' });

  // Band badge
  const bColor = bandColor(overall.band);
  p.rect(cx - 15, cy + 11, 30, 7, bColor + '33', bColor + '66', 3.5);
  p.text(bandLabel(overall.band, lang), cx, cy + 16, { size: 7, color: bColor, weight: 'bold', align: 'center' });
  p.c.restore();

  // Profile info block
  const infoX = isRTL ? W - 8 : 8;
  const infoAlign = isRTL ? 'end' : 'start';
  let iy = 108;
  [
    { label: t('الاسم', 'Name'), value: user.name || '—' },
    { label: t('المستوى المهني', 'Professional Level'), value: levelLabel || '—' },
    { label: t('نسخة المقياس', 'Assessment Version'), value: rpt.version === 'full' ? t('الكاملة', 'Full') : t('السريعة', 'Quick') },
    { label: t('تاريخ الإكمال', 'Completion Date'), value: user.completion_date || '—' },
    { label: t('رقم التقرير', 'Report ID'), value: rpt.report_id || '—' },
    { label: t('لغة التقرير', 'Report Language'), value: lang === 'ar' ? 'العربية' : 'English' },
  ].forEach(row => {
    p.text(row.label + ': ', infoX, iy, { size: 7, color: C.accent + 'bb', weight: 'bold', align: infoAlign });
    const labelW = lang === 'ar' ? 0 : 35;
    p.text(row.value, isRTL ? infoX - 40 : 8 + labelW, iy, { size: 7, color: C.white + 'cc', align: infoAlign });
    iy += 7;
  });

  // Decorative bottom section
  p.rect(0, H - 50, W, 50, C.dark + 'cc');
  p.line(8, H - 48, W - 8, H - 48, C.accent + '33', 0.3);

  const taglineBottom = t(
    'بناء المهنيين المتميزين عبر التقييم الدقيق والتطوير المستهدف',
    'Building distinguished professionals through precise assessment and targeted development'
  );
  p.wrapText(taglineBottom, 8, H - 40, W - 16, 6, { size: 8, color: C.white + '55' });
  p.text('www.optivance.com', W / 2, H - 20, { size: 8, color: C.accent + '99', align: 'center' });
  p.text(t('جميع الحقوق محفوظة © OPTIVANCE', '© OPTIVANCE All Rights Reserved'), W / 2, H - 14, { size: 6.5, color: C.white + '44', align: 'center' });

  return p;
}

function buildProfileSummary(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const user = rpt.user || {};
  const overall = rpt.overall || { score: 0, band: 'Moderate' };
  const levelLabel = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '';

  p.rect(0, 0, W, 20, C.primary);
  p.rect(0, 20, W, 2, C.accent);
  p.text(t('ملف المستخدم وملخص التقرير', 'User Profile & Report Summary'), isRTL ? W - 8 : 8, 13, { size: 12, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });

  // profile info cards
  let y = 28;
  const cards = [
    { label: t('الاسم الكامل', 'Full Name'), value: user.name },
    { label: t('الاسم المفضل', 'Preferred Name'), value: user.preferred_name || user.name?.split(' ')[0] },
    { label: t('المستوى المهني', 'Professional Level'), value: levelLabel },
    { label: t('الدور / المسمى الوظيفي', 'Role / Job Title'), value: user.role || '—' },
    { label: t('تاريخ الإكمال', 'Completion Date'), value: user.completion_date },
    { label: t('رقم التقرير', 'Report ID'), value: rpt.report_id },
  ];

  const halfW = (W - 24) / 2;
  cards.forEach((card, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 8 + col * (halfW + 4);
    const cy = y + row * 18;
    p.rect(cx, cy, halfW, 15, C.slate50, C.slate100, 2);
    p.text(card.label, isRTL ? cx + halfW - 3 : cx + 3, cy + 6, { size: 7, color: C.slate400, align: isRTL ? 'end' : 'start' });
    p.text(card.value || '—', isRTL ? cx + halfW - 3 : cx + 3, cy + 12, { size: 8.5, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start' });
  });

  y += 60;

  // Motivation
  if (user.motivation || user.customMotivation) {
    p.rect(8, y, W - 16, 18, C.primary + '0d', C.primary + '33', 3);
    p.text(t('دافع التطوير', 'Development Motivation'), isRTL ? W - 12 : 12, y + 7, { size: 7, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start' });
    p.wrapText(user.customMotivation || user.motivation, isRTL ? W - 12 : 12, y + 13, W - 24, 5, { size: 8, color: C.slate600 });
    y += 22;
  }

  y += 4;
  // Report sections overview
  p.text(t('ما يتضمنه هذا التقرير', 'What This Report Includes'), isRTL ? W - 8 : 8, y, { size: 11, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start' });
  y += 7;
  p.line(8, y, W - 8, y, C.slate100);
  y += 5;

  const sections = [
    { n: '01', label: t('لمحة النتائج العامة', 'Overall Results Snapshot'),  desc: t('النتيجة الإجمالية، المستوى، ونقاط القوة الرئيسية', 'Overall score, band, and key strengths') },
    { n: '02', label: t('نظرة عامة على الدرجات', 'Competency Scores Overview'), desc: t('تصنيف المجالات الستة بالدرجات والمستويات', 'All six domains ranked by score and level') },
    { n: '03', label: t('تحليل نقاط القوة', 'Strengths Analysis'),            desc: t('أعلى مجالين وكيفية الاستفادة منهما', 'Top two domains and how to leverage them') },
    { n: '04', label: t('أولويات التطوير', 'Development Priorities'),         desc: t('أدنى مجالين وخطوات التحسين العملية', 'Lowest two domains and practical improvement steps') },
    { n: '05', label: t('التفصيل التام للمجالات', 'Full Domain Breakdown'),   desc: t('تفاصيل كل مجال والجدارات الفرعية', 'Each domain with sub-competency details') },
    { n: '06', label: t('خطة التطوير الشخصية', 'Personalized Dev Plan'),      desc: t('أهداف ٠–٣٠ / ٣٠–٩٠ / ٩٠+ يوم', 'Goals for 0–30 / 30–90 / 90+ days') },
    { n: '07', label: t('الموارد والخطوات القادمة', 'Resources & Next Steps'), desc: t('موارد مقترحة وإجراءات فورية', 'Recommended resources and immediate actions') },
  ];

  sections.forEach((s, i) => {
    const sx = 8, sy = y + i * 14;
    p.rect(sx, sy, W - 16, 12, C.white, C.slate100, 2);
    p.circle(sx + 8, sy + 6, 4, C.primary, null);
    p.text(s.n, sx + 8, sy + 7.5, { size: 6, color: C.white, weight: 'bold', align: 'center' });
    p.text(s.label, isRTL ? W - sx - 16 : sx + 16, sy + 5, { size: 8, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start' });
    p.text(s.desc, isRTL ? W - sx - 16 : sx + 16, sy + 10, { size: 7, color: C.slate400, align: isRTL ? 'end' : 'start' });
  });

  p.pageFooter(lang, 2, 10);
  return p;
}

function buildOverallSnapshot(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const overall = rpt.overall || { score: 0, band: 'Moderate' };
  const domainScores = rpt.domain_scores || {};
  const overallSummary = OVERALL_SUMMARIES[overall.band]?.[lang] || '';

  p.rect(0, 0, W, 20, C.primary);
  p.rect(0, 20, W, 2, C.accent);
  p.text(t('لمحة النتائج العامة', 'Overall Results Snapshot'), isRTL ? W - 8 : 8, 13, { size: 12, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });

  // Score arc center
  const cx = W / 2, cy = 58, r = 22;
  p.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2, C.slate100, 6);
  const endA = -Math.PI / 2 + (overall.score / 100) * Math.PI * 2;
  p.c.save();
  p.c.beginPath();
  p.c.arc(p.x(cx), p.y(cy), p.w(r), -Math.PI / 2, endA);
  const g = p.c.createLinearGradient(0, 0, p.cw, p.ch);
  g.addColorStop(0, C.accent);
  g.addColorStop(1, C.proficient);
  p.c.strokeStyle = g;
  p.c.lineWidth = mm(5);
  p.c.lineCap = 'round';
  p.c.stroke();
  p.c.restore();
  p.text(overall.score + '%', cx, cy + 2, { size: 18, color: C.primary, weight: 'bold', align: 'center' });
  p.text(t('النتيجة الإجمالية', 'Overall Score'), cx, cy + 8, { size: 7, color: C.slate400, align: 'center' });

  const bColor = bandColor(overall.band);
  p.rect(cx - 18, cy + 12, 36, 8, bColor + '22', bColor + '66', 4);
  p.text(bandLabel(overall.band, lang), cx, cy + 17.5, { size: 8, color: bColor, weight: 'bold', align: 'center' });

  // Summary box
  let y = 90;
  p.rect(8, y, W - 16, 26, C.slate50, C.slate100, 3);
  p.text(t('تفسير نتيجتك', 'Your Score Interpretation'), isRTL ? W - 12 : 12, y + 7, { size: 9, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start' });
  p.wrapText(overallSummary, isRTL ? W - 12 : 12, y + 14, W - 24, 5, { size: 8, color: C.slate600 });
  y += 32;

  // Sorted domains
  const sorted = DOMAINS.map(d => ({
    ...d,
    score: domainScores[d.id]?.score || 0,
    band: domainScores[d.id]?.band || 'Critical',
  }));
  const topD = [...sorted].sort((a, b) => b.score - a.score).slice(0, 3);
  const botD = [...sorted].sort((a, b) => a.score - b.score).slice(0, 3);
  const lk = lang === 'ar' ? 'ar' : 'en';

  // Two columns: strengths & priorities
  const colW = (W - 24) / 2;
  const heads = [
    { txt: t('أبرز نقاط القوة', 'Top Strengths'), items: topD, icon: '✦' },
    { txt: t('أولويات التطوير', 'Dev Priorities'), items: botD, icon: '▲' },
  ];

  heads.forEach((col, ci) => {
    const cx2 = 8 + ci * (colW + 4);
    p.rect(cx2, y, colW, 8, C.primary, null, 2);
    p.text(col.txt, isRTL ? cx2 + colW - 3 : cx2 + 3, y + 5.5, { size: 8, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });
    col.items.forEach((d, di) => {
      const ry = y + 10 + di * 16;
      const bc = bandColor(d.band);
      p.rect(cx2, ry, colW, 13, bc + '12', bc + '33', 2);
      p.text(d.name[lk], isRTL ? cx2 + colW - 3 : cx2 + 3, ry + 6, { size: 7.5, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start', maxWidth: colW - 20 });
      p.text(d.score + '%', isRTL ? cx2 + 3 : cx2 + colW - 3, ry + 6, { size: 9, color: bc, weight: 'bold', align: isRTL ? 'start' : 'end' });
      p.progressBar(cx2 + 2, ry + 9, colW - 4, 2.5, d.score, bc);
    });
  });

  p.pageFooter(lang, 3, 10);
  return p;
}

function buildScoresOverview(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const domainScores = rpt.domain_scores || {};
  const lk = lang === 'ar' ? 'ar' : 'en';

  p.rect(0, 0, W, 20, C.primary);
  p.rect(0, 20, W, 2, C.accent);
  p.text(t('نظرة عامة على درجات الكفاءات', 'Competency Scores Overview'), isRTL ? W - 8 : 8, 13, { size: 12, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });

  const sorted = DOMAINS.map(d => ({
    ...d,
    score: domainScores[d.id]?.score || 0,
    band: domainScores[d.id]?.band || 'Critical',
  })).sort((a, b) => b.score - a.score);

  let y = 28;
  sorted.forEach((d, i) => {
    const bc = bandColor(d.band);
    const rankColor = i === 0 ? C.accent : i === 1 ? C.proficient : i < 4 ? C.slate400 : C.critical;

    p.rect(8, y, W - 16, 28, C.white, C.slate100, 3);

    // Rank badge
    p.circle(17, y + 14, 6, i < 3 ? bc : C.slate100, null);
    p.text(String(i + 1), 17, y + 16, { size: 8, color: i < 3 ? C.white : C.slate500, weight: 'bold', align: 'center' });

    // Domain name
    p.text(d.name[lk], isRTL ? W - 28 : 28, y + 9, { size: 9, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start', maxWidth: W - 70 });
    p.text(d.description[lk], isRTL ? W - 28 : 28, y + 15.5, { size: 6.5, color: C.slate400, align: isRTL ? 'end' : 'start', maxWidth: W - 70 });

    // Score
    p.text(d.score + '%', isRTL ? 28 : W - 28, y + 12, { size: 13, color: bc, weight: 'bold', align: isRTL ? 'start' : 'end' });

    // Band badge
    p.rect(isRTL ? 8 : W - 45, y + 19, 37, 6, bc + '22', bc + '55', 3);
    p.text(bandLabel(d.band, lang), isRTL ? 26.5 : W - 26.5, y + 23, { size: 6.5, color: bc, weight: 'bold', align: 'center' });

    // Progress bar
    p.progressBar(28, y + 23, W - 70, 3, d.score, bc, C.slate100, 1.5);

    y += 32;
  });

  p.pageFooter(lang, 4, 10);
  return p;
}

function buildStrengthsAnalysis(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const domainScores = rpt.domain_scores || {};
  const lk = lang === 'ar' ? 'ar' : 'en';

  p.rect(0, 0, W, 20, C.primary);
  p.rect(0, 20, W, 2, C.accent);
  p.text(t('تحليل نقاط القوة', 'Strengths Analysis'), isRTL ? W - 8 : 8, 13, { size: 12, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });

  const topDomains = DOMAINS
    .map(d => ({ ...d, score: domainScores[d.id]?.score || 0, band: domainScores[d.id]?.band || 'Moderate' }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  let y = 28;
  topDomains.forEach((d, i) => {
    const bc = bandColor(d.band);
    const content = d.content[d.band]?.[lk];
    if (!content) return;

    // Card
    p.rect(8, y, W - 16, 74, bc + '08', bc + '33', 3);
    p.rect(8, y, W - 16, 10, bc, null, 3);

    // Header
    p.text(d.name[lk], isRTL ? W - 12 : 12, y + 7, { size: 9, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });
    p.text(d.score + '%', isRTL ? 24 : W - 24, y + 7, { size: 9, color: C.white + 'cc', weight: 'bold', align: isRTL ? 'start' : 'end' });

    // Summary
    p.wrapText(content.summary, isRTL ? W - 12 : 12, y + 17, W - 24, 4.5, { size: 7.5, color: C.slate600 });

    // Strengths
    const strengths = content.strengths || [];
    p.text(t('نقاط القوة', 'Strengths'), isRTL ? W - 12 : 12, y + 35, { size: 7.5, color: bc, weight: 'bold', align: isRTL ? 'end' : 'start' });
    strengths.slice(0, 2).forEach((s, j) => {
      const sy = y + 40 + j * 6;
      p.circle(isRTL ? W - 15 : 15, sy - 1.5, 1.5, bc, null);
      p.text(s, isRTL ? W - 18 : 18, sy, { size: 7, color: C.slate600, align: isRTL ? 'end' : 'start', maxWidth: W - 28 });
    });

    // Recommendations
    const recs = content.recommendations || [];
    p.text(t('التوصيات المتقدمة', 'Advanced Recommendations'), isRTL ? W - 12 : 12, y + 54, { size: 7.5, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start' });
    recs.slice(0, 2).forEach((r, j) => {
      const ry2 = y + 59 + j * 6;
      p.rect(isRTL ? W - 14 : 12, ry2 - 3, 2, 5, C.primary, null, 1);
      p.text(r, isRTL ? W - 18 : 16, ry2, { size: 7, color: C.slate600, align: isRTL ? 'end' : 'start', maxWidth: W - 28 });
    });

    y += 78;
  });

  p.pageFooter(lang, 5, 10);
  return p;
}

function buildDevelopmentPriorities(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const domainScores = rpt.domain_scores || {};
  const lk = lang === 'ar' ? 'ar' : 'en';

  p.rect(0, 0, W, 20, C.primary);
  p.rect(0, 20, W, 2, C.accent);
  p.text(t('أولويات التطوير', 'Development Priorities'), isRTL ? W - 8 : 8, 13, { size: 12, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });

  const priority = DOMAINS
    .map(d => ({ ...d, score: domainScores[d.id]?.score || 0, band: domainScores[d.id]?.band || 'Critical' }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  let y = 28;
  priority.forEach((d, i) => {
    const bc = bandColor(d.band);
    const content = d.content[d.band]?.[lk];
    if (!content) return;

    p.rect(8, y, W - 16, 74, bc + '08', bc + '33', 3);

    // Red/warn header strip
    const grd = p.c.createLinearGradient(p.x(8), 0, p.x(W - 8), 0);
    grd.addColorStop(0, bc);
    grd.addColorStop(1, C.primary);
    p.c.save();
    const rx = p.x(8), ry = p.y(y), rw = p.w(W - 16), rh2 = p.h(10);
    p.c.beginPath();
    p.c.moveTo(rx + p.w(3), ry);
    p.c.lineTo(rx + rw - p.w(3), ry);
    p.c.quadraticCurveTo(rx + rw, ry, rx + rw, ry + p.h(3));
    p.c.lineTo(rx + rw, ry + rh2);
    p.c.lineTo(rx, ry + rh2);
    p.c.lineTo(rx, ry + p.h(3));
    p.c.quadraticCurveTo(rx, ry, rx + p.w(3), ry);
    p.c.closePath();
    p.c.fillStyle = grd;
    p.c.fill();
    p.c.restore();

    p.text(t(`أولوية ${i + 1}: `, `Priority ${i + 1}: `) + d.name[lk], isRTL ? W - 12 : 12, y + 7, { size: 8.5, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });
    p.text(d.score + '%', isRTL ? 24 : W - 24, y + 7, { size: 9, color: C.white + 'cc', weight: 'bold', align: isRTL ? 'start' : 'end' });

    p.wrapText(content.summary, isRTL ? W - 12 : 12, y + 17, W - 24, 4.5, { size: 7.5, color: C.slate600 });

    p.progressBar(12, y + 32, W - 24, 3.5, d.score, bc, C.slate100, 1.5);
    p.text(d.score + '%', isRTL ? W - 12 : W - 12, y + 32, { size: 6, color: bc, align: 'end' });

    p.text(t('التوصيات العملية', 'Practical Recommendations'), isRTL ? W - 12 : 12, y + 42, { size: 7.5, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start' });
    const recs = content.recommendations || [];
    recs.slice(0, 3).forEach((r, j) => {
      const ry3 = y + 48 + j * 6;
      p.rect(isRTL ? W - 12 : 12, ry3 - 3, 3, 5, bc, null, 1.5);
      p.text(r, isRTL ? W - 18 : 17, ry3, { size: 7, color: C.slate600, align: isRTL ? 'end' : 'start', maxWidth: W - 28 });
    });

    y += 78;
  });

  p.pageFooter(lang, 6, 10);
  return p;
}

function buildDomainBreakdown(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const domainScores = rpt.domain_scores || {};
  const subScores = rpt.sub_competency_scores || {};
  const lk = lang === 'ar' ? 'ar' : 'en';

  p.rect(0, 0, W, 20, C.primary);
  p.rect(0, 20, W, 2, C.accent);
  p.text(t('التفصيل الكامل للمجالات', 'Full Domain Breakdown'), isRTL ? W - 8 : 8, 13, { size: 12, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });

  let y = 28;
  DOMAINS.forEach((d, di) => {
    if (y > H - 50) return; // safety
    const domData = domainScores[d.id] || { score: 0, band: 'Critical' };
    const bc = bandColor(domData.band);

    // Domain header
    p.rect(8, y, W - 16, 11, C.primary, null, 3);
    p.text(d.name[lk], isRTL ? W - 12 : 12, y + 7.5, { size: 8.5, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });
    p.text(domData.score + '%', isRTL ? 24 : W - 24, y + 7.5, { size: 9, color: C.accent, weight: 'bold', align: isRTL ? 'start' : 'end' });
    y += 13;

    // Sub-competencies
    d.sub_competencies.forEach((sc, sci) => {
      const key = `${d.id}__${sc.id}`;
      const scData = subScores[key] || { score: 0, band: 'Critical' };
      const sbc = bandColor(scData.band);

      p.rect(8, y, W - 16, 12, C.white, C.slate100, 2);
      p.text(sc.name[lk], isRTL ? W - 14 : 14, y + 5, { size: 7.5, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start' });
      p.text(scData.score + '%', isRTL ? 24 : W - 24, y + 5, { size: 7.5, color: sbc, weight: 'bold', align: isRTL ? 'start' : 'end' });
      p.progressBar(14, y + 8, W - 28, 2.5, scData.score, sbc, C.slate100, 1);

      // Band label inline
      p.text(bandLabel(scData.band, lang), isRTL ? W - 14 : W - 14, y + 5, { size: 6, color: sbc, align: isRTL ? 'end' : 'end' });

      y += 14;
    });
    y += 4;
  });

  p.pageFooter(lang, 7, 10);
  return p;
}

function buildDevPlan(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const domainScores = rpt.domain_scores || {};
  const lk = lang === 'ar' ? 'ar' : 'en';

  p.rect(0, 0, W, 20, C.primary);
  p.rect(0, 20, W, 2, C.accent);
  p.text(t('خطة التطوير الشخصية', 'Personalized Development Plan'), isRTL ? W - 8 : 8, 13, { size: 12, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });

  const priority = DOMAINS
    .map(d => ({ ...d, score: domainScores[d.id]?.score || 0, band: domainScores[d.id]?.band || 'Critical' }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const phases = [
    { key: 'short', label: { ar: '٠ – ٣٠ يوم', en: '0 – 30 Days' }, color: C.critical,   bg: '#ef444415', desc: { ar: 'البداية الفورية', en: 'Immediate Start' } },
    { key: 'mid',   label: { ar: '٣٠ – ٩٠ يوم', en: '30 – 90 Days' }, color: C.moderate, bg: '#f59e0b15', desc: { ar: 'البناء المتوسط',  en: 'Building Phase' } },
    { key: 'long',  label: { ar: '٩٠+ يوم', en: '90+ Days' },         color: C.accent,   bg: '#05e1ae15', desc: { ar: 'النمو المستدام',  en: 'Sustained Growth' } },
  ];

  let y = 28;

  // Timeline connector
  const timelineX = isRTL ? W - 20 : 20;
  p.line(timelineX, y, timelineX, H - 20, C.slate200, 0.5);

  phases.forEach((phase, pi) => {
    // Phase node
    p.circle(timelineX, y + 6, 5, phase.color, null);
    p.text(String(pi + 1), timelineX, y + 7.5, { size: 7, color: C.white, weight: 'bold', align: 'center' });

    // Phase header
    const hx = isRTL ? W - 28 : 28;
    p.rect(hx, y, W - hx - 8, 11, phase.color, null, 3);
    p.text(phase.label[lang === 'ar' ? 'ar' : 'en'], isRTL ? W - 32 : 32, y + 7, { size: 9, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });
    p.text(phase.desc[lang === 'ar' ? 'ar' : 'en'], isRTL ? 16 : W - 16, y + 7, { size: 7, color: C.white + 'bb', align: isRTL ? 'start' : 'end' });
    y += 13;

    // Goals per priority domain
    priority.forEach((d, di) => {
      const content = d.content[d.band]?.[lk];
      const goalTxt = content?.goals?.[phase.key];
      if (!goalTxt) return;

      const bc = bandColor(d.band);
      p.rect(isRTL ? 12 : 28, y, W - 42, 16, phase.bg, phase.color + '44', 2);
      p.text(d.name[lk], isRTL ? W - 32 : 32, y + 6, { size: 7, color: bc, weight: 'bold', align: isRTL ? 'end' : 'start', maxWidth: W - 50 });
      p.wrapText(goalTxt, isRTL ? W - 32 : 32, y + 12, W - 50, 4, { size: 7, color: C.slate600 });
      y += 20;
    });
    y += 6;
  });

  // Monthly reflection reminder
  p.rect(8, H - 28, W - 16, 18, C.primary + '0d', C.primary + '33', 3);
  p.text(t('تذكير: راجع خطتك كل ٣٠ يومًا', 'Reminder: Review your plan every 30 days'), W / 2, H - 19, { size: 8, color: C.primary, weight: 'bold', align: 'center' });
  p.text(t('التطوير المستمر هو مفتاح النجاح المهني', 'Continuous development is the key to professional success'), W / 2, H - 14, { size: 7, color: C.slate400, align: 'center' });

  p.pageFooter(lang, 8, 10);
  return p;
}

function buildResources(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const domainScores = rpt.domain_scores || {};
  const lk = lang === 'ar' ? 'ar' : 'en';

  p.rect(0, 0, W, 20, C.primary);
  p.rect(0, 20, W, 2, C.accent);
  p.text(t('الموارد والمحتوى المقترح', 'Recommended Resources'), isRTL ? W - 8 : 8, 13, { size: 12, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });

  const priority = DOMAINS
    .map(d => ({ ...d, score: domainScores[d.id]?.score || 0, band: domainScores[d.id]?.band || 'Critical' }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  let y = 28;

  // Intro
  p.rect(8, y, W - 16, 12, C.slate50, C.slate100, 3);
  p.wrapText(
    t('تم اختيار الموارد أدناه بناءً على أدنى مجالاتك في المقياس لدعم تطورك المهني المستهدف.',
      'The resources below were selected based on your lowest-scoring domains to support targeted professional growth.'),
    isRTL ? W - 12 : 12, y + 8, W - 24, 5, { size: 7.5, color: C.slate600 }
  );
  y += 16;

  const resourceTypes = {
    Strong:     t('دليل متقدم', 'Advanced Guide'),
    Proficient: t('ورقة عمل', 'Worksheet'),
    Moderate:   t('برنامج تدريبي', 'Training Program'),
    Critical:   t('جلسة تدريب', 'Coaching Session'),
  };

  priority.forEach((d, i) => {
    const bc = bandColor(d.band);
    const content = d.content[d.band]?.[lk];
    const recs = content?.recommendations || [];
    const resType = resourceTypes[d.band] || t('مورد', 'Resource');

    // Card
    p.rect(8, y, W - 16, 52, C.white, C.slate100, 3);

    // Left colored strip
    p.rect(8, y, 3, 52, bc, null, 1.5);

    // Type badge
    p.rect(isRTL ? 14 : W - 45, y + 3, 37, 7, bc + '22', bc + '55', 3.5);
    p.text(resType, isRTL ? 32.5 : W - 26.5, y + 8, { size: 6.5, color: bc, weight: 'bold', align: 'center' });

    // Domain name
    p.text(d.name[lk], isRTL ? W - 14 : 14, y + 8, { size: 9, color: C.primary, weight: 'bold', align: isRTL ? 'end' : 'start', maxWidth: W - 65 });
    p.text(d.score + '%  •  ' + bandLabel(d.band, lang), isRTL ? W - 14 : 14, y + 15, { size: 7, color: bc, align: isRTL ? 'end' : 'start' });

    p.line(14, y + 18, W - 14, y + 18, C.slate100, 0.3);

    p.text(t('خطوات التحسين المقترحة', 'Suggested Improvement Steps'), isRTL ? W - 14 : 14, y + 24, { size: 7.5, color: C.slate500, weight: 'bold', align: isRTL ? 'end' : 'start' });
    recs.slice(0, 3).forEach((rec, ri) => {
      p.circle(isRTL ? W - 17 : 17, y + 29 + ri * 7 - 2, 1.5, bc, null);
      p.text(rec, isRTL ? W - 20 : 20, y + 29 + ri * 7, { size: 7, color: C.slate600, align: isRTL ? 'end' : 'start', maxWidth: W - 32 });
    });

    // CTA row
    p.rect(14, y + 44, (W - 30) / 2, 6, C.primary, null, 3);
    p.text(t('تصفح المتجر', 'Browse Store'), isRTL ? 14 + (W - 30) / 2 - 3 : 14 + 3, y + 48, { size: 6.5, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });

    y += 56;
  });

  p.pageFooter(lang, 9, 10);
  return p;
}

function buildNextSteps(rpt, lang) {
  const p = new Page(lang === 'ar');
  const t = (ar, en) => lang === 'ar' ? ar : en;
  const isRTL = lang === 'ar';
  const user = rpt.user || {};
  const overall = rpt.overall || { score: 0, band: 'Moderate' };

  // Dark closing bg
  const grd = p.c.createLinearGradient(0, 0, 0, p.ch);
  grd.addColorStop(0, C.dark);
  grd.addColorStop(0.5, C.primary);
  grd.addColorStop(1, C.surface);
  p.c.fillStyle = grd;
  p.c.fillRect(0, 0, p.cw, p.ch);

  // Grid
  p.c.save();
  p.c.globalAlpha = 0.03;
  p.c.strokeStyle = C.accent;
  p.c.lineWidth = 0.5;
  for (let i = 0; i < p.cw; i += mm(12)) { p.c.beginPath(); p.c.moveTo(i, 0); p.c.lineTo(i, p.ch); p.c.stroke(); }
  for (let j = 0; j < p.ch; j += mm(12)) { p.c.beginPath(); p.c.moveTo(0, j); p.c.lineTo(p.cw, j); p.c.stroke(); }
  p.c.restore();

  p.rect(0, 0, W, 2, C.accent);

  let y = 18;
  p.text(t('الخطوات القادمة', 'Your Next Steps'), W / 2, y, { size: 16, color: C.white, weight: 'bold', align: 'center' });
  y += 8;
  p.text(t(`مرحبًا ${user.preferred_name || user.name || ''}، هذه خارطة طريقك نحو التميز`, `Welcome ${user.preferred_name || user.name || ''}, here is your roadmap to excellence`), W / 2, y, { size: 8, color: C.white + '88', align: 'center' });
  y += 10;

  const steps = [
    { n: '01', label: t('راجع تقريرك بعمق', 'Review Your Report Deeply'), desc: t('اقرأ تحليل كل مجال وفهم ما تعنيه نتيجتك', 'Read each domain analysis and understand what your score means') },
    { n: '02', label: t('حدد هدفين فوريين', 'Set 2 Immediate Goals'), desc: t('اختر هدفين من قسم ٠–٣٠ يوم وابدأ اليوم', 'Choose two goals from the 0–30 day section and start today') },
    { n: '03', label: t('شارك نتائجك', 'Share Your Results'), desc: t('ناقش التقرير مع مشرفك أو مرشدك المهني', 'Discuss the report with your supervisor or professional mentor') },
    { n: '04', label: t('ضع تذكير شهري', 'Set a Monthly Reminder'), desc: t('راجع تقدمك في خطة التطوير كل ٣٠ يومًا', 'Review your development plan progress every 30 days') },
    { n: '05', label: t('استكشف الموارد', 'Explore Resources'), desc: t('تصفح متجر Optivance للأدوات والبرامج المخصصة لك', 'Browse Optivance store for personalized tools and programs') },
  ];

  steps.forEach((step, i) => {
    p.rect(8, y, W - 16, 18, C.white + '0a', C.white + '18', 3);
    p.circle(18, y + 9, 6, C.accent, null);
    p.text(step.n, 18, y + 11, { size: 7, color: C.dark, weight: 'bold', align: 'center' });
    p.text(step.label, isRTL ? W - 28 : 28, y + 7, { size: 8.5, color: C.white, weight: 'bold', align: isRTL ? 'end' : 'start' });
    p.text(step.desc, isRTL ? W - 28 : 28, y + 13, { size: 7, color: C.white + '88', align: isRTL ? 'end' : 'start', maxWidth: W - 40 });
    y += 22;
  });

  y += 6;
  p.line(8, y, W - 8, y, C.white + '22', 0.5);
  y += 8;

  // Contact info
  p.text(t('للتواصل والاستشارات', 'For Contact & Consulting'), W / 2, y, { size: 9, color: C.accent, weight: 'bold', align: 'center' });
  y += 7;
  p.text('info@optivance.com', W / 2, y, { size: 8, color: C.white + 'bb', align: 'center' });
  y += 6;
  p.text('www.optivance.com', W / 2, y, { size: 8, color: C.white + 'bb', align: 'center' });
  y += 10;

  // Overall reminder card
  const bColor = bandColor(overall.band);
  p.rect(8, y, W - 16, 20, bColor + '18', bColor + '55', 4);
  p.text(t('نتيجتك الإجمالية', 'Your Overall Score'), isRTL ? W - 14 : 14, y + 8, { size: 8, color: bColor, weight: 'bold', align: isRTL ? 'end' : 'start' });
  p.text(overall.score + '%  •  ' + bandLabel(overall.band, lang), isRTL ? W - 14 : 14, y + 15, { size: 9, color: bColor, weight: 'bold', align: isRTL ? 'end' : 'start' });
  y += 26;

  p.rect(8, y, W - 16, 14, C.accent, null, 4);
  p.text(t('ابدأ رحلة تطورك مع Optivance', 'Start Your Growth Journey with Optivance'), W / 2, y + 9, { size: 9, color: C.dark, weight: 'bold', align: 'center' });

  // Bottom branding
  p.text('OPTIVANCE', W / 2, H - 20, { size: 16, color: C.accent + '44', weight: 'bold', align: 'center' });
  p.text(t('بناء المهنيين المتميزين', 'Building Distinguished Professionals'), W / 2, H - 14, { size: 7, color: C.white + '44', align: 'center' });
  p.rect(0, H - 8, W, 8, C.dark + 'cc');
  p.text('© OPTIVANCE  •  www.optivance.com', W / 2, H - 3, { size: 6, color: C.white + '55', align: 'center' });

  return p;
}

// ─── main export ───────────────────────────────────────────────────────────────
export async function generateCompetencyPDF(reportData, attemptId) {
  const lang = reportData.language || 'ar';

  const pages = [
    buildCover(reportData, lang),
    buildProfileSummary(reportData, lang),
    buildOverallSnapshot(reportData, lang),
    buildScoresOverview(reportData, lang),
    buildStrengthsAnalysis(reportData, lang),
    buildDevelopmentPriorities(reportData, lang),
    buildDomainBreakdown(reportData, lang),
    buildDevPlan(reportData, lang),
    buildResources(reportData, lang),
    buildNextSteps(reportData, lang),
  ];

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  pages.forEach((page, idx) => {
    if (idx > 0) pdf.addPage();
    pdf.addImage(page.toDataURL(), 'PNG', 0, 0, W, H);
  });

  const fileName = `optivance-competency-report-${reportData.report_id || attemptId || 'report'}.pdf`;
  pdf.save(fileName);
  return fileName;
}