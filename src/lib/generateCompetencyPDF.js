/**
 * generateCompetencyPDF — high-resolution canvas PDF generator
 * Premium infographic-style bilingual report (AR/RTL + EN/LTR)
 */
import jsPDF from 'jspdf';
import { DOMAINS, BAND_CONFIG, getBand, OVERALL_SUMMARIES, LEVEL_LABELS } from './competencyContent';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  primary:    '#1A3A5C',
  accent:     '#05E1AE',
  dark:       '#0D1F33',
  surface:    '#162F4A',
  white:      '#FFFFFF',
  slate50:    '#F8FAFC',
  slate100:   '#F1F5F9',
  slate200:   '#E2E8F0',
  slate300:   '#CBD5E1',
  slate400:   '#94A3B8',
  slate500:   '#64748B',
  slate600:   '#475569',
  slate700:   '#334155',
  strong:     '#05E1AE',
  proficient: '#2E9DB8',
  moderate:   '#F59E0B',
  critical:   '#EF4444',
};

const BAND_COLORS = { Strong: C.strong, Proficient: C.proficient, Moderate: C.moderate, Critical: C.critical };
const bandColor   = (b) => BAND_COLORS[b] || C.slate500;
const bandLabel   = (b, lang) => BAND_CONFIG[b]?.label?.[lang] || b;

// ─── Canvas / dimension helpers ────────────────────────────────────────────────
const W_MM  = 210;
const H_MM  = 297;
const SCALE = 3;           // 3× for crisp PDF
const PX_MM = 3.7795;      // 1 mm → px at 96 dpi

const mm = (v) => v * PX_MM * SCALE;

// ─── Page class ────────────────────────────────────────────────────────────────
class Page {
  constructor() {
    this.canvas        = document.createElement('canvas');
    this.canvas.width  = Math.round(mm(W_MM));
    this.canvas.height = Math.round(mm(H_MM));
    this.ctx           = this.canvas.getContext('2d');
    this._fill('#FFFFFF');
  }

  get c()  { return this.ctx; }
  get cw() { return this.canvas.width; }
  get ch() { return this.canvas.height; }

  px(v)  { return Math.round(mm(v)); }        // mm → canvas px
  pxw(v) { return Math.round(mm(v)); }

  _fill(color) {
    this.c.fillStyle = color;
    this.c.fillRect(0, 0, this.cw, this.ch);
  }

  // ── primitives ──────────────────────────────────────────────────────────────
  rect(x, y, w, h, fill, stroke, r = 0, strokeW = 0.5) {
    const c = this.c;
    c.save();
    const [px, py, pw, ph] = [this.px(x), this.px(y), this.px(w), this.px(h)];
    const pr = r ? this.px(r) : 0;
    c.beginPath();
    if (pr) {
      c.moveTo(px + pr, py);
      c.lineTo(px + pw - pr, py);
      c.quadraticCurveTo(px + pw, py, px + pw, py + pr);
      c.lineTo(px + pw, py + ph - pr);
      c.quadraticCurveTo(px + pw, py + ph, px + pw - pr, py + ph);
      c.lineTo(px + pr, py + ph);
      c.quadraticCurveTo(px, py + ph, px, py + ph - pr);
      c.lineTo(px, py + pr);
      c.quadraticCurveTo(px, py, px + pr, py);
      c.closePath();
    } else {
      c.rect(px, py, pw, ph);
    }
    if (fill)   { c.fillStyle   = fill;   c.fill();   }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = this.px(strokeW); c.stroke(); }
    c.restore();
  }

  gradRect(x, y, w, h, c1, c2, dir = 'h', r = 0) {
    const c  = this.c;
    const px = this.px(x), py = this.px(y), pw = this.px(w), ph = this.px(h);
    const g  = dir === 'h' ? c.createLinearGradient(px, py, px + pw, py)
                            : c.createLinearGradient(px, py, px, py + ph);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    this.rect(x, y, w, h, g, null, r);
  }

  circle(cx, cy, r, fill, stroke, sw = 0.5) {
    const c = this.c;
    c.save();
    c.beginPath();
    c.arc(this.px(cx), this.px(cy), this.px(r), 0, Math.PI * 2);
    if (fill)   { c.fillStyle   = fill;   c.fill();   }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = this.px(sw); c.stroke(); }
    c.restore();
  }

  scoreArc(cx, cy, r, pct, trackColor, arcColor, sw = 4) {
    const c   = this.c;
    const pcx = this.px(cx), pcy = this.px(cy), pr = this.px(r);
    const lw  = this.px(sw);
    // track
    c.save();
    c.beginPath();
    c.arc(pcx, pcy, pr, 0, Math.PI * 2);
    c.strokeStyle = trackColor;
    c.lineWidth   = lw;
    c.stroke();
    c.restore();
    // arc
    if (pct > 0) {
      const end = -Math.PI / 2 + (pct / 100) * Math.PI * 2;
      const g   = c.createLinearGradient(pcx - pr, pcy, pcx + pr, pcy);
      g.addColorStop(0, arcColor);
      g.addColorStop(1, C.proficient);
      c.save();
      c.beginPath();
      c.arc(pcx, pcy, pr, -Math.PI / 2, end);
      c.strokeStyle = g;
      c.lineWidth   = lw;
      c.lineCap     = 'round';
      c.stroke();
      c.restore();
    }
  }

  bar(x, y, w, h, pct, fg, bg = C.slate200, r = 1) {
    this.rect(x, y, w, h, bg, null, r);
    if (pct > 0) {
      const filled = Math.max(w * (pct / 100), r * 2);
      this.rect(x, y, filled, h, fg, null, r);
    }
  }

  gradBar(x, y, w, h, pct, c1, c2, bg = C.slate200, r = 1) {
    this.rect(x, y, w, h, bg, null, r);
    if (pct > 0) {
      const filled = Math.max(w * (pct / 100), r * 2);
      this.gradRect(x, y, filled, h, c1, c2, 'h', r);
    }
  }

  line(x1, y1, x2, y2, color, w = 0.3) {
    const c = this.c;
    c.save();
    c.beginPath();
    c.moveTo(this.px(x1), this.px(y1));
    c.lineTo(this.px(x2), this.px(y2));
    c.strokeStyle = color;
    c.lineWidth   = this.px(w);
    c.stroke();
    c.restore();
  }

  // ── text ────────────────────────────────────────────────────────────────────
  // Proper RTL Arabic text rendering using canvas direction
  txt(text, x, y, { size = 10, color = C.slate700, weight = 'normal', align = 'left', maxW, isRTL = false } = {}) {
    const c  = this.c;
    const fs = Math.round(size * PX_MM * SCALE * 0.38);
    c.save();
    c.fillStyle    = color;
    c.font         = `${weight === 'bold' ? '700' : '400'} ${fs}px Arial, sans-serif`;
    c.textAlign    = align;
    c.direction    = isRTL ? 'rtl' : 'ltr';
    c.textBaseline = 'middle';
    const px = this.px(x), py = this.px(y);
    if (maxW) c.fillText(String(text), px, py, this.px(maxW));
    else      c.fillText(String(text), px, py);
    c.restore();
  }

  // Word-wrap with proper direction
  wrap(text, x, y, maxW, lineH, { size = 9, color = C.slate600, weight = 'normal', isRTL = false } = {}) {
    const c  = this.c;
    const fs = Math.round(size * PX_MM * SCALE * 0.38);
    c.save();
    c.fillStyle    = color;
    c.font         = `${weight === 'bold' ? '700' : '400'} ${fs}px Arial, sans-serif`;
    c.textBaseline = 'middle';
    c.direction    = isRTL ? 'rtl' : 'ltr';

    const words  = String(text).split(' ');
    const maxPx  = this.px(maxW);
    let line     = '';
    let curY     = this.px(y);
    const lineHpx = this.px(lineH);

    words.forEach((word, i) => {
      const test = line ? line + ' ' + word : word;
      if (c.measureText(test).width > maxPx && i > 0) {
        c.fillText(line, this.px(x), curY);
        line  = word;
        curY += lineHpx;
      } else {
        line = test;
      }
    });
    if (line) c.fillText(line, this.px(x), curY);
    c.restore();
    const linesUsed = (curY - this.px(y)) / lineHpx + 1;
    return linesUsed * lineH; // mm height used
  }

  // ── shared header / footer ──────────────────────────────────────────────────
  pageHeader(title, pageNum, lang) {
    const isRTL = lang === 'ar';
    const t     = (ar, en) => lang === 'ar' ? ar : en;
    // Gradient header bar
    this.gradRect(0, 0, W_MM, 18, C.dark, C.primary, 'h');
    this.rect(0, 18, W_MM, 1.5, C.accent);

    // Brand pill
    this.rect(isRTL ? W_MM - 38 : 5, 4, 33, 9, C.accent + '22', C.accent + '66', 4.5);
    this.txt('OPTIVANCE', isRTL ? W_MM - 21 : 21.5, 8.5, { size: 7.5, color: C.accent, weight: 'bold', align: 'center', isRTL });

    // Page title
    this.txt(title, isRTL ? W_MM - 43 : 43, 9, { size: 10, color: C.white, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });

    // Page number badge
    const badge = `${pageNum} / 10`;
    this.rect(isRTL ? 4 : W_MM - 20, 5, 16, 8, C.accent, null, 4);
    this.txt(badge, isRTL ? 12 : W_MM - 12, 9, { size: 7, color: C.dark, weight: 'bold', align: 'center', isRTL });
  }

  pageFooter(lang) {
    const t = (ar, en) => lang === 'ar' ? ar : en;
    this.rect(0, H_MM - 7, W_MM, 7, C.dark);
    this.line(0, H_MM - 7, W_MM, H_MM - 7, C.accent + '55', 0.4);
    this.txt('OPTIVANCE  •  www.optivance.com  •  info@optivance.com',
      W_MM / 2, H_MM - 3.5, { size: 6, color: C.white + '66', align: 'center', isRTL: false });
    this.txt(t('تقرير الكفاءات المهنية — سري وشخصي', 'Professional Competency Report — Confidential'),
      W_MM / 2, H_MM - 3.5, { size: 6, color: C.white + '00', align: 'center' }); // invisible spacer
  }

  dotPattern(alpha = 0.035) {
    const c = this.c;
    c.save();
    c.globalAlpha = alpha;
    c.fillStyle   = C.accent;
    for (let xi = 0; xi < this.cw; xi += this.px(8)) {
      for (let yi = 0; yi < this.ch; yi += this.px(8)) {
        c.beginPath();
        c.arc(xi, yi, this.px(0.5), 0, Math.PI * 2);
        c.fill();
      }
    }
    c.restore();
  }

  toDataURL() { return this.canvas.toDataURL('image/png', 1.0); }
}

// ─── Page 1: Cover ─────────────────────────────────────────────────────────────
function buildCover(rpt, lang) {
  const p      = new Page();
  const isRTL  = lang === 'ar';
  const t      = (ar, en) => isRTL ? ar : en;
  const user   = rpt.user || {};
  const overall = rpt.overall || { score: 0, band: 'Moderate' };
  const bc      = bandColor(overall.band);
  const lbl     = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '—';

  // BG gradient — dark to brand
  p.gradRect(0, 0, W_MM, H_MM, C.dark, C.surface, 'v');
  p.dotPattern(0.04);

  // Accent top bar
  p.gradRect(0, 0, W_MM, 2.5, C.accent, C.proficient, 'h');

  // Decorative right panel (light strip)
  p.gradRect(W_MM - 65, 0, 65, H_MM, '#ffffff06', '#ffffff00', 'h');
  p.line(W_MM - 65, 0, W_MM - 65, H_MM, C.accent + '18', 0.4);

  // Large score circle — right side
  const circX = isRTL ? 45 : W_MM - 35;
  const circY = 75;
  p.circle(circX, circY, 28, C.white + '08');
  p.circle(circX, circY, 24, C.white + '06');
  p.scoreArc(circX, circY, 20, overall.score, C.white + '15', bc, 4.5);
  p.txt(overall.score + '%', circX, circY - 1.5, { size: 18, color: C.white, weight: 'bold', align: 'center', isRTL });
  p.txt(t('النتيجة', 'Score'), circX, circY + 6, { size: 7, color: C.white + '77', align: 'center', isRTL });
  p.rect(circX - 14, circY + 12, 28, 7, bc + '33', bc, 3.5);
  p.txt(bandLabel(overall.band, lang), circX, circY + 15.5, { size: 7, color: bc, weight: 'bold', align: 'center', isRTL });

  // OPTIVANCE logo
  p.rect(isRTL ? W_MM - 52 : 8, 12, 44, 11, C.accent + '1a', C.accent + '55', 5.5);
  p.txt('OPTIVANCE', isRTL ? W_MM - 30 : 30, 17.5, { size: 9, color: C.accent, weight: 'bold', align: 'center', isRTL });

  // Badge
  const badgeTxt = t('تقرير الكفاءات المهنية', 'Professional Competency Report');
  p.rect(isRTL ? W_MM - 8 - 90 : 8, 30, 90, 8, C.white + '10', C.white + '25', 4);
  p.txt(badgeTxt, isRTL ? W_MM - 53 : 53, 34, { size: 7, color: C.white + 'bb', align: 'center', isRTL });

  // Main title
  const ta = t('تقرير', 'Competency');
  const tb = t('الجدارات المهنية', 'Growth Report');
  p.txt(ta, isRTL ? W_MM - 8 : 8, 55, { size: 26, color: C.white, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
  p.txt(tb, isRTL ? W_MM - 8 : 8, 70, { size: 26, color: C.accent, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });

  // Tagline
  const tag = t('تقييم علمي معمّق لجداراتك المهنية في ٦ مجالات رئيسية', 'A science-backed assessment of your professional competencies across 6 key domains');
  p.wrap(tag, isRTL ? W_MM - 8 : 8, 83, isRTL ? W_MM - 16 : W_MM - 75, 5,
    { size: 8, color: C.white + '77', isRTL });

  // Divider
  p.gradRect(8, 96, W_MM - 16, 0.7, C.accent + '66', C.primary + '22', 'h');

  // Profile info grid
  const fields = [
    [t('الاسم', 'Name'),             user.name || '—'],
    [t('المستوى المهني', 'Level'),   lbl],
    [t('نسخة المقياس', 'Version'),   rpt.version === 'full' ? t('الكاملة', 'Full') : t('السريعة', 'Quick')],
    [t('تاريخ الإكمال', 'Date'),     user.completion_date || '—'],
    [t('رقم التقرير', 'Report ID'),  rpt.report_id || '—'],
    [t('اللغة', 'Language'),         lang === 'ar' ? 'العربية' : 'English'],
  ];

  const colW = (W_MM - 24) / 2;
  fields.forEach(([lbl2, val], i) => {
    const col = isRTL ? 1 - (i % 2) : i % 2;
    const row = Math.floor(i / 2);
    const fx  = 8 + col * (colW + 4);
    const fy  = 101 + row * 20;
    p.rect(fx, fy, colW, 17, C.white + '0c', C.white + '18', 3);
    p.txt(lbl2, isRTL ? fx + colW - 4 : fx + 4, fy + 6, { size: 6.5, color: C.accent + 'bb', align: isRTL ? 'right' : 'left', isRTL });
    p.txt(val, isRTL ? fx + colW - 4 : fx + 4, fy + 12.5, { size: 8, color: C.white + 'dd', weight: 'bold', align: isRTL ? 'right' : 'left', isRTL, maxW: colW - 8 });
  });

  // Bottom section
  p.gradRect(0, H_MM - 45, W_MM, 45, C.dark + 'cc', C.dark, 'v');
  p.line(8, H_MM - 43, W_MM - 8, H_MM - 43, C.accent + '22', 0.4);

  // 3 stat pills
  const stats = [
    t('٢٠ جدارة أساسية', '20 Core Competencies'),
    t('٦ مجالات رئيسية', '6 Key Domains'),
    t('نتائج فورية', 'Instant Results'),
  ];
  const pillW = (W_MM - 32) / 3;
  stats.forEach((s, i) => {
    const px2 = 8 + i * (pillW + 4);
    p.rect(px2, H_MM - 38, pillW, 10, C.white + '0a', C.white + '20', 5);
    p.txt(s, px2 + pillW / 2, H_MM - 33, { size: 7, color: C.white + 'cc', align: 'center', isRTL });
  });

  p.txt(t('بناء المهنيين المتميزين عبر التقييم الدقيق والتطوير المستهدف',
          'Building distinguished professionals through precise assessment and targeted development'),
    W_MM / 2, H_MM - 18, { size: 7.5, color: C.white + '55', align: 'center', isRTL });
  p.txt('www.optivance.com  •  © 2025 OPTIVANCE',
    W_MM / 2, H_MM - 11, { size: 6.5, color: C.accent + '66', align: 'center', isRTL });

  return p;
}

// ─── Page 2: Profile & Summary ──────────────────────────────────────────────────
function buildProfileSummary(rpt, lang) {
  const p     = new Page();
  const isRTL = lang === 'ar';
  const t     = (ar, en) => isRTL ? ar : en;
  const user  = rpt.user || {};
  const lbl   = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '—';

  p.pageHeader(t('ملف المستخدم وملخص التقرير', 'User Profile & Report Summary'), 2, lang);

  let y = 24;

  // Profile cards
  const cards = [
    { label: t('الاسم الكامل', 'Full Name'),           value: user.name || '—' },
    { label: t('الاسم المفضل', 'Preferred Name'),      value: user.preferred_name || user.name?.split(' ')[0] || '—' },
    { label: t('المستوى المهني', 'Professional Level'), value: lbl },
    { label: t('المسمى الوظيفي', 'Job Title'),         value: user.role || '—' },
    { label: t('تاريخ الإكمال', 'Completion Date'),    value: user.completion_date || '—' },
    { label: t('رقم التقرير', 'Report ID'),            value: rpt.report_id || '—' },
  ];

  const cw = (W_MM - 24) / 2;
  cards.forEach((card, i) => {
    const col = isRTL ? 1 - (i % 2) : i % 2;
    const row = Math.floor(i / 2);
    const cx2 = 8 + col * (cw + 4);
    const cy2 = y + row * 20;
    p.rect(cx2, cy2, cw, 17, C.slate50, C.slate200, 3);
    p.rect(cx2, cy2, 2.5, 17, C.primary + 'cc', null, 1.5);
    p.txt(card.label, isRTL ? cx2 + cw - 5 : cx2 + 6, cy2 + 5.5, { size: 6.5, color: C.slate400, align: isRTL ? 'right' : 'left', isRTL });
    p.txt(card.value, isRTL ? cx2 + cw - 5 : cx2 + 6, cy2 + 12, { size: 8.5, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL, maxW: cw - 10 });
  });

  y += 66;

  // Motivation box
  const motiv = user.customMotivation || user.motivation;
  if (motiv) {
    p.gradRect(8, y, W_MM - 16, 20, C.primary + '15', C.accent + '08', 'h', 3);
    p.rect(isRTL ? W_MM - 10.5 : 8, y, 2.5, 20, C.accent, null, 1.5);
    p.txt(t('دافع التطوير', 'Development Motivation'), isRTL ? W_MM - 14 : 14, y + 6.5, { size: 7, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
    p.wrap(motiv, isRTL ? W_MM - 14 : 14, y + 14, W_MM - 26, 4.5, { size: 7.5, color: C.slate600, isRTL });
    y += 25;
  }

  y += 3;
  // Section title
  p.txt(t('محتويات التقرير', 'Report Contents'), isRTL ? W_MM - 8 : 8, y + 3, { size: 11, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
  y += 8;
  p.gradRect(8, y, W_MM - 16, 1, C.accent, C.primary, 'h');
  y += 5;

  const sections = [
    { n: '01', lbl: t('لمحة النتائج العامة', 'Overall Results Snapshot'),    desc: t('النتيجة الإجمالية والمستوى ونقاط القوة الرئيسية', 'Overall score, band, and key strengths')       , color: C.accent      },
    { n: '02', lbl: t('نظرة عامة على الدرجات', 'Scores Overview'),           desc: t('تصنيف المجالات الستة بالدرجات والمستويات', 'Six domains ranked by score and level')               , color: C.proficient  },
    { n: '03', lbl: t('تحليل نقاط القوة', 'Strengths Analysis'),             desc: t('أعلى المجالات وكيفية الاستفادة منها', 'Top domains and how to leverage them')                    , color: C.accent      },
    { n: '04', lbl: t('أولويات التطوير', 'Development Priorities'),          desc: t('المجالات التي تحتاج اهتمامًا وخطوات التحسين', 'Domains needing attention and improvement steps')   , color: C.moderate    },
    { n: '05', lbl: t('التفصيل الكامل للمجالات', 'Full Domain Breakdown'),  desc: t('تفاصيل كل مجال والجدارات الفرعية', 'Each domain with sub-competency details')                    , color: C.proficient  },
    { n: '06', lbl: t('خطة التطوير الشخصية', 'Development Plan'),           desc: t('أهداف ٠–٣٠ و٣٠–٩٠ و٩٠+ يوم', 'Goals for 0–30 / 30–90 / 90+ days')                               , color: C.accent      },
    { n: '07', lbl: t('الموارد والخطوات القادمة', 'Resources & Next Steps'), desc: t('موارد مقترحة وإجراءات فورية للتطوير', 'Recommended resources and immediate actions')              , color: C.moderate    },
  ];

  sections.forEach((s, i) => {
    const sy = y + i * 15;
    const isEven = i % 2 === 0;
    p.rect(8, sy, W_MM - 16, 13, isEven ? C.slate50 : C.white, C.slate200, 2.5);
    p.circle(isRTL ? W_MM - 16 : 16, sy + 6.5, 5, s.color + '33', s.color, 0.5);
    p.txt(s.n, isRTL ? W_MM - 16 : 16, sy + 6.5, { size: 6, color: s.color, weight: 'bold', align: 'center', isRTL });
    p.txt(s.lbl, isRTL ? W_MM - 25 : 25, sy + 5, { size: 8, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
    p.txt(s.desc, isRTL ? W_MM - 25 : 25, sy + 10.5, { size: 6.5, color: C.slate400, align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 36 });
  });

  p.pageFooter(lang);
  return p;
}

// ─── Page 3: Overall Snapshot ──────────────────────────────────────────────────
function buildOverallSnapshot(rpt, lang) {
  const p       = new Page();
  const isRTL   = lang === 'ar';
  const t       = (ar, en) => isRTL ? ar : en;
  const overall = rpt.overall || { score: 0, band: 'Moderate' };
  const ds      = rpt.domain_scores || {};
  const bc      = bandColor(overall.band);
  const lk      = lang;
  const summary = OVERALL_SUMMARIES[overall.band]?.[lang] || '';

  p.pageHeader(t('لمحة النتائج العامة', 'Overall Results Snapshot'), 3, lang);

  // Score hero section
  p.rect(0, 19.5, W_MM, 68, C.slate50);
  p.line(0, 87.5, W_MM, 87.5, C.slate200, 0.4);

  // Large arc
  const cx = W_MM / 2, cy = 55;
  p.circle(cx, cy, 26, C.white, C.slate200, 0.5);
  p.scoreArc(cx, cy, 22, overall.score, C.slate200, bc, 5);
  p.txt(overall.score + '%', cx, cy - 1, { size: 20, color: C.primary, weight: 'bold', align: 'center', isRTL });
  p.txt(t('النتيجة الإجمالية', 'Overall Score'), cx, cy + 7, { size: 7, color: C.slate400, align: 'center', isRTL });
  // Band badge
  p.rect(cx - 20, cy + 14, 40, 9, bc + '22', bc, 4.5);
  p.txt(bandLabel(overall.band, lang), cx, cy + 18.5, { size: 8, color: bc, weight: 'bold', align: 'center', isRTL });

  // Summary box
  let y = 93;
  p.rect(8, y, W_MM - 16, 28, C.white, C.slate200, 3);
  p.gradRect(8, y, 3, 28, bc, bc + '44', 'v', 1.5);
  p.txt(t('تفسير نتيجتك', 'Your Score Interpretation'), isRTL ? W_MM - 14 : 14, y + 7, { size: 9, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
  p.wrap(summary, isRTL ? W_MM - 14 : 14, y + 16, W_MM - 26, 5, { size: 8, color: C.slate600, isRTL });
  y += 34;

  // Top & Bottom 3 domains
  const sorted = DOMAINS.map(d => ({
    ...d, score: ds[d.id]?.score || 0, band: ds[d.id]?.band || 'Critical',
  }));
  const top3 = [...sorted].sort((a, b) => b.score - a.score).slice(0, 3);
  const bot3 = [...sorted].sort((a, b) => a.score - b.score).slice(0, 3);
  const colW = (W_MM - 24) / 2;

  const cols = [
    { title: t('نقاط القوة الرئيسية', 'Key Strengths'),    items: top3, headerBg: C.accent },
    { title: t('أولويات التطوير', 'Development Priorities'), items: bot3, headerBg: C.critical },
  ];

  cols.forEach((col, ci) => {
    const cx2 = isRTL ? (ci === 0 ? W_MM - 8 - colW : 8) : 8 + ci * (colW + 4);
    // Fix column positions for RTL
    const actualX = ci === 0 ? 8 : 8 + colW + 4;

    p.gradRect(actualX, y, colW, 10, col.headerBg, col.headerBg + 'bb', 'h', 2);
    p.txt(col.title, isRTL ? actualX + colW - 4 : actualX + 4, y + 5, { size: 8, color: C.white, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });

    col.items.forEach((d, di) => {
      const iy = y + 12 + di * 19;
      const bc2 = bandColor(d.band);
      p.rect(actualX, iy, colW, 16, C.white, C.slate200, 2);
      p.rect(isRTL ? actualX + colW - 2.5 : actualX, iy, 2.5, 16, bc2, null, 1.5);
      p.txt(d.name[lk], isRTL ? actualX + colW - 6 : actualX + 5, iy + 5.5, { size: 7.5, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL, maxW: colW - 20 });
      p.txt(d.score + '%', isRTL ? actualX + 4 : actualX + colW - 4, iy + 5.5, { size: 9, color: bc2, weight: 'bold', align: isRTL ? 'left' : 'right', isRTL });
      p.gradBar(actualX + 3, iy + 11, colW - 6, 3, d.score, bc2, bc2 + '44', C.slate100, 1.5);
    });
  });

  p.pageFooter(lang);
  return p;
}

// ─── Page 4: Scores Overview ───────────────────────────────────────────────────
function buildScoresOverview(rpt, lang) {
  const p     = new Page();
  const isRTL = lang === 'ar';
  const t     = (ar, en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  p.pageHeader(t('نظرة عامة على درجات الكفاءات', 'Competency Scores Overview'), 4, lang);

  const sorted = DOMAINS
    .map(d => ({ ...d, score: ds[d.id]?.score || 0, band: ds[d.id]?.band || 'Critical' }))
    .sort((a, b) => b.score - a.score);

  let y = 24;

  sorted.forEach((d, i) => {
    const bc = bandColor(d.band);
    const isTop = i < 2;

    // Card background
    p.rect(8, y, W_MM - 16, 34, isTop ? bc + '0a' : C.white, C.slate200, 3);

    // Rank badge (left for LTR, right for RTL)
    const rankX = isRTL ? W_MM - 18 : 18;
    p.circle(rankX, y + 17, 8, isTop ? bc : C.slate100, C.slate200, 0.5);
    p.txt(String(i + 1), rankX, y + 17, { size: 9, color: isTop ? C.white : C.slate500, weight: 'bold', align: 'center', isRTL });

    // Domain name & description
    const textX = isRTL ? W_MM - 30 : 30;
    const textA = isRTL ? 'right' : 'left';
    p.txt(d.name[lk], textX, y + 9, { size: 9.5, color: C.primary, weight: 'bold', align: textA, isRTL, maxW: W_MM - 70 });
    p.txt(d.description[lk], textX, y + 16, { size: 6.5, color: C.slate400, align: textA, isRTL, maxW: W_MM - 70 });

    // Score number
    const scoreX = isRTL ? 28 : W_MM - 28;
    p.txt(d.score + '%', scoreX, y + 11, { size: 14, color: bc, weight: 'bold', align: isRTL ? 'left' : 'right', isRTL });

    // Band badge
    const badgeX = isRTL ? 8 : W_MM - 46;
    p.rect(badgeX, y + 20, 38, 7, bc + '22', bc + '66', 3.5);
    p.txt(bandLabel(d.band, lang), badgeX + 19, y + 23.5, { size: 6.5, color: bc, weight: 'bold', align: 'center', isRTL });

    // Progress bar
    p.gradBar(30, y + 27, W_MM - 60, 4.5, d.score, bc, bc + '55', C.slate100, 2.5);

    y += 38;
  });

  p.pageFooter(lang);
  return p;
}

// ─── Page 5: Strengths ────────────────────────────────────────────────────────
function buildStrengthsAnalysis(rpt, lang) {
  const p     = new Page();
  const isRTL = lang === 'ar';
  const t     = (ar, en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  p.pageHeader(t('تحليل نقاط القوة', 'Strengths Analysis'), 5, lang);

  const top = DOMAINS
    .map(d => ({ ...d, score: ds[d.id]?.score || 0, band: ds[d.id]?.band || 'Moderate' }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  let y = 24;

  top.forEach((d, i) => {
    const bc      = bandColor(d.band);
    const content = d.content[d.band]?.[lk];
    if (!content) return;

    const cardH = 80;
    // Card base
    p.rect(8, y, W_MM - 16, cardH, C.white, C.slate200, 3);

    // Colored header bar
    p.gradRect(8, y, W_MM - 16, 12, bc, C.primary, 'h', 3);
    p.rect(8, y + 9, W_MM - 16, 3, C.primary, null); // bottom of header

    p.txt(d.name[lk], isRTL ? W_MM - 14 : 14, y + 6, { size: 9, color: C.white, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
    p.txt(d.score + '%', isRTL ? 22 : W_MM - 22, y + 6, { size: 10, color: C.white + 'dd', weight: 'bold', align: isRTL ? 'left' : 'right', isRTL });

    // Summary
    p.wrap(content.summary, isRTL ? W_MM - 14 : 14, y + 19, W_MM - 28, 4.5, { size: 8, color: C.slate600, isRTL });

    // Strengths list
    p.txt(t('نقاط القوة', 'Strengths'), isRTL ? W_MM - 14 : 14, y + 38, { size: 7.5, color: bc, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
    (content.strengths || []).slice(0, 2).forEach((s, j) => {
      const sy = y + 44 + j * 7;
      p.circle(isRTL ? W_MM - 17 : 17, sy, 2, bc, null);
      p.txt(s, isRTL ? W_MM - 21 : 21, sy, { size: 7, color: C.slate600, align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 32 });
    });

    // Recs
    p.txt(t('التوصيات', 'Recommendations'), isRTL ? W_MM - 14 : 14, y + 58, { size: 7.5, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
    (content.recommendations || []).slice(0, 2).forEach((r, j) => {
      const ry = y + 64 + j * 7;
      p.rect(isRTL ? W_MM - 13 : 13, ry - 2.5, 2, 5, C.primary, null, 1);
      p.txt(r, isRTL ? W_MM - 17 : 17, ry, { size: 7, color: C.slate600, align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 28 });
    });

    y += cardH + 5;
  });

  p.pageFooter(lang);
  return p;
}

// ─── Page 6: Development Priorities ───────────────────────────────────────────
function buildDevelopmentPriorities(rpt, lang) {
  const p     = new Page();
  const isRTL = lang === 'ar';
  const t     = (ar, en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  p.pageHeader(t('أولويات التطوير', 'Development Priorities'), 6, lang);

  const priority = DOMAINS
    .map(d => ({ ...d, score: ds[d.id]?.score || 0, band: ds[d.id]?.band || 'Critical' }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  let y = 24;

  priority.forEach((d, i) => {
    const bc      = bandColor(d.band);
    const content = d.content[d.band]?.[lk];
    if (!content) return;

    const cardH = 80;
    p.rect(8, y, W_MM - 16, cardH, C.white, bc + '66', 3);

    // Gradient header
    p.gradRect(8, y, W_MM - 16, 12, C.primary, bc, 'h', 3);
    p.rect(8, y + 9, W_MM - 16, 3, bc + 'bb', null);

    // Priority badge
    const badgeTxt = t(`أولوية ${i + 1}`, `Priority ${i + 1}`);
    p.rect(isRTL ? 14 : W_MM - 38, y + 2, 24, 8, C.white + '22', C.white + '44', 4);
    p.txt(badgeTxt, isRTL ? 26 : W_MM - 26, y + 6, { size: 6, color: C.white, weight: 'bold', align: 'center', isRTL });

    p.txt(d.name[lk], isRTL ? W_MM - 14 : 14, y + 6, { size: 9, color: C.white, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 55 });
    p.txt(d.score + '%', isRTL ? 50 : W_MM - 50, y + 6, { size: 10, color: C.white + 'cc', weight: 'bold', align: isRTL ? 'left' : 'right', isRTL });

    // Summary
    p.wrap(content.summary, isRTL ? W_MM - 14 : 14, y + 19, W_MM - 28, 4.5, { size: 8, color: C.slate600, isRTL });

    // Progress bar with score
    p.txt(t('مستوى الأداء الحالي', 'Current Performance Level'), isRTL ? W_MM - 14 : 14, y + 36, { size: 6.5, color: C.slate400, align: isRTL ? 'right' : 'left', isRTL });
    p.gradBar(14, y + 40, W_MM - 28, 5, d.score, bc, bc + '44', C.slate100, 2.5);
    p.txt(d.score + '%', isRTL ? 14 : W_MM - 14, y + 42, { size: 6.5, color: bc, weight: 'bold', align: isRTL ? 'left' : 'right', isRTL });

    // Recs
    p.txt(t('التوصيات العملية', 'Practical Recommendations'), isRTL ? W_MM - 14 : 14, y + 51, { size: 7.5, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
    (content.recommendations || []).slice(0, 3).forEach((r, j) => {
      const ry = y + 57 + j * 7;
      p.circle(isRTL ? W_MM - 17 : 17, ry, 2, bc + 'aa', null);
      p.txt(r, isRTL ? W_MM - 21 : 21, ry, { size: 7, color: C.slate600, align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 32 });
    });

    y += cardH + 5;
  });

  p.pageFooter(lang);
  return p;
}

// ─── Page 7: Domain Breakdown ─────────────────────────────────────────────────
function buildDomainBreakdown(rpt, lang) {
  const p     = new Page();
  const isRTL = lang === 'ar';
  const t     = (ar, en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const subs  = rpt.sub_competency_scores || {};
  const lk    = lang;

  p.pageHeader(t('التفصيل الكامل للمجالات', 'Full Domain Breakdown'), 7, lang);

  let y = 24;

  DOMAINS.forEach((d, di) => {
    if (y > H_MM - 15) return;
    const domData = ds[d.id] || { score: 0, band: 'Critical' };
    const bc      = bandColor(domData.band);

    // Domain header
    p.gradRect(8, y, W_MM - 16, 12, C.primary, bc + 'cc', 'h', 3);
    p.txt(d.name[lk], isRTL ? W_MM - 14 : 14, y + 6, { size: 9, color: C.white, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
    p.txt(domData.score + '%', isRTL ? 22 : W_MM - 22, y + 6, { size: 10, color: C.accent, weight: 'bold', align: isRTL ? 'left' : 'right', isRTL });
    y += 14;

    // Sub-competencies
    d.sub_competencies.forEach((sc) => {
      if (y > H_MM - 15) return;
      const key   = `${d.id}__${sc.id}`;
      const scData = subs[key] || { score: 0, band: 'Critical' };
      const sbc   = bandColor(scData.band);

      p.rect(8, y, W_MM - 16, 14, C.white, C.slate200, 2);
      p.rect(isRTL ? W_MM - 10.5 : 8, y, 2.5, 14, sbc + 'aa', null, 1.5);

      p.txt(sc.name[lk], isRTL ? W_MM - 14 : 14, y + 5.5, { size: 8, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 55 });
      p.txt(scData.score + '%', isRTL ? 28 : W_MM - 28, y + 5.5, { size: 8.5, color: sbc, weight: 'bold', align: isRTL ? 'left' : 'right', isRTL });

      // Band badge small
      const bandBadgeX = isRTL ? 14 : W_MM - 42;
      p.rect(bandBadgeX, y + 1.5, 28, 6, sbc + '1a', sbc + '55', 3);
      p.txt(bandLabel(scData.band, lang), bandBadgeX + 14, y + 4.5, { size: 6, color: sbc, weight: 'bold', align: 'center', isRTL });

      p.gradBar(14, y + 10, W_MM - 28, 2.5, scData.score, sbc, sbc + '44', C.slate100, 1.5);
      y += 16;
    });
    y += 5;
  });

  p.pageFooter(lang);
  return p;
}

// ─── Page 8: Development Plan ─────────────────────────────────────────────────
function buildDevPlan(rpt, lang) {
  const p     = new Page();
  const isRTL = lang === 'ar';
  const t     = (ar, en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  p.pageHeader(t('خطة التطوير الشخصية', 'Personalized Development Plan'), 8, lang);

  const priority = DOMAINS
    .map(d => ({ ...d, score: ds[d.id]?.score || 0, band: ds[d.id]?.band || 'Critical' }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const phases = [
    { key: 'short', label: t('٠ – ٣٠ يوم', '0 – 30 Days'),   desc: t('ابدأ الآن', 'Start Now'),        c1: C.critical,   c2: '#ff6b6b' },
    { key: 'mid',   label: t('٣٠ – ٩٠ يوم', '30 – 90 Days'), desc: t('ابنِ المهارة', 'Build Skills'),  c1: C.moderate,   c2: '#fbbf24' },
    { key: 'long',  label: t('٩٠+ يوم', '90+ Days'),          desc: t('النمو المستدام', 'Sustained Growth'), c1: C.accent, c2: C.proficient },
  ];

  // Timeline line
  const lineX = isRTL ? W_MM - 18 : 18;
  p.line(lineX, 26, lineX, H_MM - 25, C.slate200, 0.7);

  let y = 24;

  phases.forEach((phase, pi) => {
    // Node on timeline
    p.circle(lineX, y + 6, 6, phase.c1, C.white, 0.7);
    p.txt(String(pi + 1), lineX, y + 6, { size: 7.5, color: C.white, weight: 'bold', align: 'center', isRTL });

    // Phase header bar
    const barX = isRTL ? 8 : 28;
    const barW = W_MM - barX - 8;
    p.gradRect(barX, y, barW, 11, phase.c1, phase.c2, 'h', 3);
    p.txt(phase.label, isRTL ? barX + barW - 4 : barX + 4, y + 5.5, { size: 9.5, color: C.white, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
    p.txt(phase.desc, isRTL ? barX + 4 : barX + barW - 4, y + 5.5, { size: 7, color: C.white + 'cc', align: isRTL ? 'left' : 'right', isRTL });
    y += 13;

    // Goals for each priority domain
    priority.forEach((d) => {
      const content  = d.content[d.band]?.[lk];
      const goalTxt  = content?.goals?.[phase.key];
      if (!goalTxt) return;

      const bc = bandColor(d.band);
      const cardX = isRTL ? 12 : 30;
      const cardW = W_MM - cardX - 8;

      p.rect(cardX, y, cardW, 18, phase.c1 + '08', phase.c1 + '33', 2.5);
      p.txt(d.name[lk], isRTL ? cardX + cardW - 4 : cardX + 4, y + 6, { size: 7.5, color: bc, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL, maxW: cardW - 20 });
      p.txt(d.score + '%', isRTL ? cardX + 4 : cardX + cardW - 4, y + 6, { size: 7, color: bc, align: isRTL ? 'left' : 'right', isRTL });
      p.wrap(goalTxt, isRTL ? cardX + cardW - 4 : cardX + 4, y + 13, cardW - 8, 4, { size: 7, color: C.slate600, isRTL });
      y += 22;
    });
    y += 5;
  });

  // Reminder box
  p.gradRect(8, H_MM - 24, W_MM - 16, 15, C.primary, C.accent, 'h', 4);
  p.txt(t('تذكير: راجع خطتك كل ٣٠ يومًا وتعقّب تقدمك باستمرار', 'Reminder: Review your plan every 30 days and consistently track your progress'),
    W_MM / 2, H_MM - 17, { size: 8, color: C.white, weight: 'bold', align: 'center', isRTL });
  p.txt(t('التطوير المستمر هو مفتاح النجاح المهني', 'Continuous development is the key to professional success'),
    W_MM / 2, H_MM - 11, { size: 7, color: C.white + 'aa', align: 'center', isRTL });

  p.pageFooter(lang);
  return p;
}

// ─── Page 9: Resources ────────────────────────────────────────────────────────
function buildResources(rpt, lang) {
  const p     = new Page();
  const isRTL = lang === 'ar';
  const t     = (ar, en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  p.pageHeader(t('الموارد والمحتوى المقترح', 'Recommended Resources'), 9, lang);

  const priority = DOMAINS
    .map(d => ({ ...d, score: ds[d.id]?.score || 0, band: ds[d.id]?.band || 'Critical' }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  let y = 24;

  // Intro
  p.rect(8, y, W_MM - 16, 14, C.slate50, C.slate200, 3);
  p.gradRect(8, y, 3, 14, C.accent, C.proficient, 'v', 1.5);
  p.wrap(
    t('اختيار الموارد التالية بناءً على أدنى مجالاتك لدعم تطورك المهني المستهدف بشكل فعّال.',
      'The following resources were selected based on your lowest-scoring domains to effectively support your targeted professional growth.'),
    isRTL ? W_MM - 14 : 14, y + 8, W_MM - 26, 5, { size: 8, color: C.slate600, isRTL }
  );
  y += 18;

  const resTypes = {
    Strong:     t('دليل متقدم', 'Advanced Guide'),
    Proficient: t('ورقة عمل', 'Worksheet'),
    Moderate:   t('برنامج تدريبي', 'Training Program'),
    Critical:   t('جلسة تدريب فردي', 'Coaching Session'),
  };

  priority.forEach((d, i) => {
    const bc      = bandColor(d.band);
    const content = d.content[d.band]?.[lk];
    const recs    = content?.recommendations || [];
    const rType   = resTypes[d.band] || t('مورد', 'Resource');

    const cardH = 58;
    p.rect(8, y, W_MM - 16, cardH, C.white, C.slate200, 3);

    // Left/right color strip
    p.gradRect(isRTL ? W_MM - 10.5 : 8, y, 2.5, cardH, bc, bc + '55', 'v', 1.5);

    // Tag
    p.rect(isRTL ? 14 : W_MM - 44, y + 3, 30, 7, bc + '22', bc + '66', 3.5);
    p.txt(rType, isRTL ? 29 : W_MM - 29, y + 6.5, { size: 6.5, color: bc, weight: 'bold', align: 'center', isRTL });

    // Domain name
    p.txt(d.name[lk], isRTL ? W_MM - 14 : 14, y + 8, { size: 9.5, color: C.primary, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 65 });

    // Score + band
    p.txt(d.score + '%  •  ' + bandLabel(d.band, lang), isRTL ? W_MM - 14 : 14, y + 15.5, { size: 7, color: bc, align: isRTL ? 'right' : 'left', isRTL });

    p.line(14, y + 20, W_MM - 14, y + 20, C.slate200, 0.4);

    // Steps
    p.txt(t('خطوات التحسين المقترحة', 'Suggested Improvement Steps'), isRTL ? W_MM - 14 : 14, y + 26, { size: 7.5, color: C.slate500, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
    recs.slice(0, 3).forEach((rec, ri) => {
      const ry = y + 32 + ri * 7;
      p.circle(isRTL ? W_MM - 18 : 18, ry, 2, bc + '99', null);
      p.txt(rec, isRTL ? W_MM - 22 : 22, ry, { size: 7, color: C.slate600, align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 34 });
    });

    // CTA button
    const btnW = 48;
    const btnX = isRTL ? 14 : W_MM - 14 - btnW;
    p.gradRect(btnX, y + cardH - 11, btnW, 8, C.primary, C.accent, 'h', 4);
    p.txt(t('تصفح المتجر ←', '→ Browse Store'), btnX + btnW / 2, y + cardH - 7, { size: 6.5, color: C.white, weight: 'bold', align: 'center', isRTL });

    y += cardH + 6;
  });

  p.pageFooter(lang);
  return p;
}

// ─── Page 10: Next Steps ──────────────────────────────────────────────────────
function buildNextSteps(rpt, lang) {
  const p       = new Page();
  const isRTL   = lang === 'ar';
  const t       = (ar, en) => isRTL ? ar : en;
  const user    = rpt.user || {};
  const overall = rpt.overall || { score: 0, band: 'Moderate' };
  const bc      = bandColor(overall.band);

  // Full dark gradient bg
  p.gradRect(0, 0, W_MM, H_MM, C.dark, C.surface, 'v');
  p.dotPattern(0.035);

  // Top bar
  p.gradRect(0, 0, W_MM, 2, C.accent, C.proficient, 'h');

  // Header
  p.gradRect(0, 2, W_MM, 22, C.primary, C.dark, 'h');
  p.txt(t('الخطوات القادمة', 'Your Next Steps'), W_MM / 2, 13, { size: 14, color: C.white, weight: 'bold', align: 'center', isRTL });
  const greeting = t(
    `مرحبًا ${user.preferred_name || user.name || ''}، هذه خارطة طريقك نحو التميز`,
    `Welcome ${user.preferred_name || user.name || ''}, here is your roadmap to excellence`
  );
  p.txt(greeting, W_MM / 2, 20, { size: 7.5, color: C.white + '88', align: 'center', isRTL });

  let y = 28;

  const steps = [
    { n: '01', c: C.accent,     lbl: t('راجع تقريرك بعمق',  'Review Your Report Deeply'),  desc: t('اقرأ تحليل كل مجال وفهم ما تعنيه نتيجتك', 'Read each domain analysis and understand what your score means') },
    { n: '02', c: C.proficient, lbl: t('حدد هدفين فوريين', 'Set 2 Immediate Goals'),        desc: t('اختر هدفين من قسم ٠–٣٠ يوم وابدأ اليوم', 'Choose two goals from the 0–30 day section and start today') },
    { n: '03', c: C.moderate,   lbl: t('شارك نتائجك',       'Share Your Results'),          desc: t('ناقش التقرير مع مشرفك أو مرشدك المهني', 'Discuss the report with your supervisor or professional mentor') },
    { n: '04', c: C.accent,     lbl: t('ضع تذكير شهري',     'Set a Monthly Reminder'),      desc: t('راجع تقدمك في خطة التطوير كل ٣٠ يومًا', 'Review your development plan progress every 30 days') },
    { n: '05', c: C.proficient, lbl: t('استكشف الموارد',    'Explore Resources'),           desc: t('تصفح متجر Optivance للأدوات والبرامج المخصصة', 'Browse Optivance store for personalized tools and programs') },
  ];

  steps.forEach((step, i) => {
    p.rect(8, y, W_MM - 16, 20, C.white + '0a', C.white + '1a', 3);
    // Numbered node
    p.circle(isRTL ? W_MM - 18 : 18, y + 10, 7, step.c + '33', step.c, 0.5);
    p.txt(step.n, isRTL ? W_MM - 18 : 18, y + 10, { size: 7, color: step.c, weight: 'bold', align: 'center', isRTL });
    const tx = isRTL ? W_MM - 29 : 29;
    p.txt(step.lbl, tx, y + 7.5, { size: 8.5, color: C.white, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 40 });
    p.txt(step.desc, tx, y + 14, { size: 7, color: C.white + '77', align: isRTL ? 'right' : 'left', isRTL, maxW: W_MM - 40 });
    y += 23;
  });

  y += 4;
  p.gradRect(8, y, W_MM - 16, 0.7, C.accent + '55', C.primary + '22', 'h');
  y += 6;

  // Contact
  p.txt(t('للتواصل والاستشارات', 'Contact & Consulting'), W_MM / 2, y, { size: 9, color: C.accent, weight: 'bold', align: 'center', isRTL });
  y += 6;
  p.txt('info@optivance.com  •  www.optivance.com', W_MM / 2, y, { size: 8, color: C.white + 'aa', align: 'center', isRTL });
  y += 8;

  // Overall score mini card
  p.rect(8, y, W_MM - 16, 22, bc + '18', bc + '55', 4);
  p.scoreArc(W_MM / 2 + (isRTL ? 25 : -25), y + 11, 9, overall.score, C.white + '22', bc, 2.5);
  p.txt(overall.score + '%', W_MM / 2 + (isRTL ? 25 : -25), y + 11, { size: 10, color: bc, weight: 'bold', align: 'center', isRTL });
  p.txt(t('نتيجتك الإجمالية', 'Your Overall Score'), isRTL ? W_MM - 14 : 14, y + 8, { size: 7, color: bc, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
  p.txt(bandLabel(overall.band, lang), isRTL ? W_MM - 14 : 14, y + 16, { size: 9, color: bc, weight: 'bold', align: isRTL ? 'right' : 'left', isRTL });
  y += 28;

  // CTA button
  p.gradRect(8, y, W_MM - 16, 14, C.accent, C.proficient, 'h', 4);
  p.txt(t('ابدأ رحلة تطورك مع Optivance اليوم', 'Start Your Growth Journey with Optivance Today'),
    W_MM / 2, y + 7, { size: 9, color: C.dark, weight: 'bold', align: 'center', isRTL });

  // Brand watermark
  p.txt('OPTIVANCE', W_MM / 2, H_MM - 18, { size: 20, color: C.accent + '18', weight: 'bold', align: 'center', isRTL });
  p.txt(t('بناء المهنيين المتميزين', 'Building Distinguished Professionals'),
    W_MM / 2, H_MM - 11, { size: 7, color: C.white + '33', align: 'center', isRTL });

  p.rect(0, H_MM - 7, W_MM, 7, C.dark);
  p.txt('© 2025 OPTIVANCE  •  www.optivance.com  •  All Rights Reserved',
    W_MM / 2, H_MM - 3.5, { size: 6, color: C.white + '55', align: 'center', isRTL: false });

  return p;
}

// ─── Main export ──────────────────────────────────────────────────────────────
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
    // Render at full A4 dimensions — canvas is 3× for sharpness
    pdf.addImage(page.toDataURL(), 'PNG', 0, 0, W_MM, H_MM, '', 'FAST');
  });

  const fileName = `optivance-competency-report-${reportData.report_id || attemptId || 'report'}.pdf`;
  pdf.save(fileName);
  return fileName;
}