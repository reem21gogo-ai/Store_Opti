/**
 * OPTIVANCE — Competency Report PDF Engine  v6
 * Clean professional redesign — white base, clear hierarchy, no clutter.
 * A4 @ 3× DPR · 12 pages · Bilingual AR/EN
 */
import jsPDF from 'jspdf';
import { DOMAINS, OVERALL_SUMMARIES, LEVEL_LABELS, BAND_CONFIG, getBand } from './competencyContent';

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  navy:    '#0D1E30',
  blue:    '#1A3A5C',
  teal:    '#05E1AE',
  white:   '#FFFFFF',
  bg:      '#F8FAFC',
  card:    '#FFFFFF',
  border:  '#E2EAF2',
  text:    '#1E2D3D',
  sub:     '#4A6080',
  muted:   '#8EA5BF',
  light:   '#EEF3FA',
};

// Per-domain brand colors (consistent across all pages)
const DOMAIN_COLORS = ['#336FA3','#05C4A0','#7C3AED','#DC6803','#1D7A4A','#0E7490'];

// Band config
const BAND = {
  Strong:     { color:'#1A7A4A', bg:'#E8F8EF', border:'#A8DFC0', labelAr:'متميز',          labelEn:'Strong'     },
  Proficient: { color:'#1558A0', bg:'#EBF3FC', border:'#9EC5EE', labelAr:'كفء',            labelEn:'Proficient' },
  Moderate:   { color:'#B87000', bg:'#FEF5E5', border:'#F5C97A', labelAr:'متوسط',          labelEn:'Moderate'   },
  Critical:   { color:'#B52020', bg:'#FDEAEA', border:'#F0A0A0', labelAr:'أولوية تطوير',   labelEn:'Critical'   },
};
const bColor  = b => BAND[b]?.color  || C.muted;
const bBg     = b => BAND[b]?.bg     || C.light;
const bBorder = b => BAND[b]?.border || C.border;
const bLabel  = (b, lang) => lang === 'ar' ? (BAND[b]?.labelAr || b) : (BAND[b]?.labelEn || b);
const scoreBand = s => s >= 80 ? 'Strong' : s >= 60 ? 'Proficient' : s >= 40 ? 'Moderate' : 'Critical';

// ─── CANVAS SETUP ─────────────────────────────────────────────────────────────
const W = 210, H = 297, DPR = 3;
const PX = v => Math.round(v * 3.7795 * DPR); // mm to px
const CW = PX(W), CH = PX(H);

function newPage(bgColor = C.white) {
  const canvas = document.createElement('canvas');
  canvas.width = CW; canvas.height = CH;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, CW, CH);
  return { canvas, ctx };
}

// ─── DRAWING PRIMITIVES ───────────────────────────────────────────────────────
function rect(ctx, x, y, w, h, fill, stroke, radius = 0, strokeWidth = 0.3) {
  ctx.save(); ctx.beginPath();
  const [X, Y, W2, H2, R] = [PX(x), PX(y), PX(w), PX(h), PX(radius)];
  if (R > 0) {
    ctx.moveTo(X + R, Y); ctx.lineTo(X + W2 - R, Y);
    ctx.arcTo(X + W2, Y, X + W2, Y + R, R);
    ctx.lineTo(X + W2, Y + H2 - R);
    ctx.arcTo(X + W2, Y + H2, X + W2 - R, Y + H2, R);
    ctx.lineTo(X + R, Y + H2);
    ctx.arcTo(X, Y + H2, X, Y + H2 - R, R);
    ctx.lineTo(X, Y + R);
    ctx.arcTo(X, Y, X + R, Y, R);
    ctx.closePath();
  } else {
    ctx.rect(X, Y, W2, H2);
  }
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = PX(strokeWidth); ctx.stroke(); }
  ctx.restore();
}

function line(ctx, x1, y1, x2, y2, color, width = 0.25) {
  ctx.save(); ctx.beginPath();
  ctx.moveTo(PX(x1), PX(y1)); ctx.lineTo(PX(x2), PX(y2));
  ctx.strokeStyle = color; ctx.lineWidth = PX(width); ctx.stroke(); ctx.restore();
}

function circle(ctx, cx, cy, r, fill, stroke, sw = 0.3) {
  ctx.save(); ctx.beginPath(); ctx.arc(PX(cx), PX(cy), PX(r), 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = PX(sw); ctx.stroke(); }
  ctx.restore();
}

function text(ctx, str, x, y, { size = 9, color = C.text, bold = false, align = 'left', rtl = false, maxWidth } = {}) {
  if (str === null || str === undefined) return;
  ctx.save();
  const fs = Math.round(size * PX(1) * 0.37);
  ctx.font = `${bold ? 700 : 400} ${fs}px Arial,sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.textBaseline = 'middle';
  const args = [String(str), PX(x), PX(y)];
  if (maxWidth) args.push(PX(maxWidth));
  ctx.fillText(...args); ctx.restore();
}

function wrapText(ctx, str, x, y, maxW, lineH, opts = {}) {
  if (!str) return y;
  const { size = 8, color = C.sub, bold = false, rtl = false } = opts;
  ctx.save();
  const fs = Math.round(size * PX(1) * 0.37);
  ctx.font = `${bold ? 700 : 400} ${fs}px Arial,sans-serif`;
  ctx.fillStyle = color; ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.textBaseline = 'middle';
  const words = String(str).split(' '), mwPx = PX(maxW);
  let line2 = '', curY = PX(y);
  words.forEach((w, i) => {
    const test = line2 ? line2 + ' ' + w : w;
    if (ctx.measureText(test).width > mwPx && i > 0) {
      ctx.fillText(line2, PX(x), curY); line2 = w; curY += PX(lineH);
    } else line2 = test;
  });
  if (line2) ctx.fillText(line2, PX(x), curY);
  ctx.restore();
  return (curY / PX(1)) + lineH;
}

function gradientRect(ctx, x, y, w, h, c1, c2, dir = 'h', radius = 0) {
  ctx.save();
  const g = dir === 'h'
    ? ctx.createLinearGradient(PX(x), 0, PX(x + w), 0)
    : ctx.createLinearGradient(0, PX(y), 0, PX(y + h));
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.beginPath();
  const [X, Y, W2, H2, R] = [PX(x), PX(y), PX(w), PX(h), PX(radius)];
  if (R > 0) {
    ctx.moveTo(X + R, Y); ctx.lineTo(X + W2 - R, Y);
    ctx.arcTo(X + W2, Y, X + W2, Y + R, R);
    ctx.lineTo(X + W2, Y + H2 - R);
    ctx.arcTo(X + W2, Y + H2, X + W2 - R, Y + H2, R);
    ctx.lineTo(X + R, Y + H2);
    ctx.arcTo(X, Y + H2, X, Y + H2 - R, R);
    ctx.lineTo(X, Y + R);
    ctx.arcTo(X, Y, X + R, Y, R);
    ctx.closePath();
  } else ctx.rect(X, Y, W2, H2);
  ctx.fillStyle = g; ctx.fill(); ctx.restore();
}

// ─── SCORE ARC (half-circle gauge) ───────────────────────────────────────────
function scoreArc(ctx, cx, cy, radius, score, color) {
  const sw = PX(radius * 0.22);
  // track
  ctx.save(); ctx.beginPath();
  ctx.arc(PX(cx), PX(cy), PX(radius), Math.PI, 0);
  ctx.strokeStyle = C.border; ctx.lineWidth = sw; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  // fill
  if (score > 0) {
    const end = Math.PI + (score / 100) * Math.PI;
    ctx.save(); ctx.beginPath();
    ctx.arc(PX(cx), PX(cy), PX(radius), Math.PI, end);
    ctx.strokeStyle = color; ctx.lineWidth = sw; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  }
}

// ─── HORIZONTAL BAR ───────────────────────────────────────────────────────────
function hBar(ctx, x, y, w, h, score, color) {
  rect(ctx, x, y, w, h, C.light, C.border, h / 2, 0.2);
  if (score > 0) {
    const fw = Math.max((score / 100) * w, h);
    gradientRect(ctx, x, y, fw, h, color, color + 'AA', 'h', h / 2);
  }
}

// ─── DOMAIN COLOR STRIP (thin, Gallup-style) ─────────────────────────────────
function domainStrip(ctx, highlightIdx) {
  const slotW = W / 6;
  DOMAIN_COLORS.forEach((clr, i) => {
    const active = highlightIdx < 0 || i === highlightIdx;
    rect(ctx, i * slotW, 0, slotW, 2.5, active ? clr : C.border + '66');
  });
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
function pageHeader(ctx, rpt, pageNum, lang, highlightIdx = -1) {
  const rtl = lang === 'ar';
  const user = rpt.user || {};
  // thin color strip at very top
  domainStrip(ctx, highlightIdx);
  // white header bg
  rect(ctx, 0, 2.5, W, 13, C.white);
  line(ctx, 0, 15.5, W, 15.5, C.border, 0.3);
  // brand
  text(ctx, 'OPTIVANCE', rtl ? W - 12 : 12, 9, { size: 8, color: C.navy, bold: true, align: rtl ? 'right' : 'left' });
  // name + date (other side)
  const info = [user.name, user.completion_date].filter(Boolean).join('  ·  ');
  text(ctx, info, rtl ? 12 : W - 12, 9, { size: 7, color: C.muted, align: rtl ? 'left' : 'right' });
}

// ─── PAGE FOOTER ──────────────────────────────────────────────────────────────
function pageFooter(ctx, pageNum) {
  line(ctx, 0, H - 9, W, H - 9, C.border, 0.25);
  text(ctx, 'OPTIVANCE  ·  www.optivance.com', 12, H - 5, { size: 6, color: C.muted });
  text(ctx, String(pageNum), W - 12, H - 5, { size: 6.5, color: C.sub, bold: true, align: 'right' });
}

// ─── SECTION HEADING ─────────────────────────────────────────────────────────
function sectionHeading(ctx, title, x, y, rtl, accentColor = C.teal) {
  const align = rtl ? 'right' : 'left';
  text(ctx, title, x, y, { size: 10.5, color: C.blue, bold: true, align, rtl });
  line(ctx, rtl ? x - 50 : x, y + 5, rtl ? x : x + 50, y + 5, accentColor, 1.2);
}

// ─── BAND PILL ────────────────────────────────────────────────────────────────
function bandPill(ctx, band, lang, x, y) {
  const label = bLabel(band, lang);
  const pw = lang === 'ar' ? 24 : 28, ph = 6.5;
  rect(ctx, x, y, pw, ph, bBg(band), bColor(band), ph / 2, 0.35);
  text(ctx, label, x + pw / 2, y + ph / 2, { size: 6, color: bColor(band), bold: true, align: 'center' });
  return pw;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ═══════════════════════════════════════════════════════════════════════════════
function buildCover(rpt, lang) {
  const { canvas, ctx } = newPage();
  const rtl = lang === 'ar', tr = (ar, en) => rtl ? ar : en;
  const user = rpt.user || {}, ov = rpt.overall || { score: 0, band: 'Moderate' };
  const band = ov.band || scoreBand(ov.score);
  const lv = LEVEL_LABELS[user.professional_level]?.[lang] || '—';

  // Dark gradient background
  const bg = ctx.createLinearGradient(0, 0, 0, CH);
  bg.addColorStop(0, '#0B1E30'); bg.addColorStop(0.7, '#102540'); bg.addColorStop(1, '#060F18');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);

  // Subtle dot texture
  ctx.save(); ctx.globalAlpha = 0.04; ctx.fillStyle = C.teal;
  for (let xi = 0; xi < CW; xi += PX(9))
    for (let yi = 0; yi < CH; yi += PX(9)) {
      ctx.beginPath(); ctx.arc(xi, yi, PX(0.4), 0, Math.PI * 2); ctx.fill();
    }
  ctx.restore();

  // Color strip at top
  domainStrip(ctx, -1);

  // Teal accent right column (subtle)
  ctx.save(); ctx.globalAlpha = 0.04; rect(ctx, W - 48, 0, 48, H, C.teal); ctx.restore();

  // ── BRAND ──
  const bx = rtl ? W - 12 : 12, ba = rtl ? 'right' : 'left';
  text(ctx, 'OPTIVANCE', bx, 14, { size: 10, color: C.teal, bold: true, align: ba });
  text(ctx, tr('للاستشارات وتطوير المواهب', 'Consulting & Talent Development'),
    bx, 21, { size: 7, color: C.white + '55', align: ba, rtl });

  // ── MAIN TITLE ──
  const ty = 50;
  text(ctx, tr('تقرير', 'Competency'), bx, ty, { size: 36, color: C.white, bold: true, align: ba, rtl });
  text(ctx, tr('الجدارات المهنية', '& Growth Report'), bx, ty + 21, { size: 30, color: C.teal, bold: true, align: ba, rtl });
  text(ctx, tr('مقياس الكفاءات الأساسية للموظف', 'Employee Core Competency Assessment'),
    bx, ty + 33, { size: 9, color: C.white + '55', align: ba, rtl });

  line(ctx, 12, ty + 40, W - 12, ty + 40, C.white + '18', 0.4);

  // ── SCORE CIRCLE ──
  const gcx = rtl ? 32 : W - 32, gcy = 60;
  circle(ctx, gcx, gcy, 18, C.white + '06', C.white + '12', 0.5);
  scoreArc(ctx, gcx, gcy, 13, ov.score, bColor(band));
  text(ctx, ov.score + '%', gcx, gcy - 1, { size: 14, color: C.white, bold: true, align: 'center' });
  text(ctx, tr('نتيجتك', 'Score'), gcx, gcy + 8, { size: 6.5, color: C.white + '55', align: 'center' });
  bandPill(ctx, band, lang, gcx - 13, gcy + 13);

  // ── PARTICIPANT CARD ──
  const cardY = ty + 46;
  rect(ctx, 12, cardY, W - 24, 82, C.white + '08', C.white + '14', 5);
  text(ctx, tr('بيانات المشارك', 'Participant Profile'),
    rtl ? W - 18 : 18, cardY + 9, { size: 9, color: C.teal, bold: true, align: rtl ? 'right' : 'left', rtl });
  line(ctx, 16, cardY + 15, W - 16, cardY + 15, C.white + '15', 0.3);

  const fields = [
    [tr('الاسم الكامل', 'Full Name'), user.name || '—'],
    [tr('الاسم المفضل', 'Preferred Name'), user.preferred_name || user.name || '—'],
    [tr('المستوى المهني', 'Level'), lv],
    [tr('نسخة التقييم', 'Version'), rpt.version === 'full' ? tr('كاملة', 'Full') : tr('سريعة', 'Quick')],
    [tr('تاريخ الإكمال', 'Date'), user.completion_date || '—'],
    [tr('رقم التقرير', 'Report ID'), rpt.report_id || '—'],
  ];
  const cw = (W - 28) / 2;
  fields.forEach(([label, val], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const fx = 14 + col * (cw + 4), fy = cardY + 19 + row * 20;
    rect(ctx, fx, fy, cw, 17, C.white + '08', C.white + '15', 3);
    text(ctx, label, rtl ? fx + cw - 5 : fx + 5, fy + 5.5, { size: 6.5, color: C.teal + 'AA', align: rtl ? 'right' : 'left', rtl });
    text(ctx, val, rtl ? fx + cw - 5 : fx + 5, fy + 12, { size: 8.5, color: C.white + 'DD', bold: true, align: rtl ? 'right' : 'left', rtl, maxWidth: cw - 10 });
  });

  // ── TAGLINE ──
  line(ctx, 14, H - 24, W - 14, H - 24, C.teal + '20', 0.4);
  text(ctx, tr('من الوعي إلى النمو المهني المستدام', 'From awareness to sustainable professional growth.'),
    W / 2, H - 16, { size: 8, color: C.white + '44', align: 'center', rtl });
  text(ctx, 'www.optivance.com', W / 2, H - 9, { size: 6.5, color: C.teal + '44', align: 'center' });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — WELCOME + PROFILE + HOW TO READ
// ═══════════════════════════════════════════════════════════════════════════════
function buildWelcome(rpt, lang) {
  const { canvas, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (ar, en) => rtl ? ar : en;
  const user = rpt.user || {};
  const lv = LEVEL_LABELS[user.professional_level]?.[lang] || '—';
  const ta = rtl ? 'right' : 'left', tx = rtl ? W - 12 : 12;

  pageHeader(ctx, rpt, 2, lang, -1);
  pageFooter(ctx, 2);

  let y = 20;

  // Welcome banner
  gradientRect(ctx, 8, y, W - 16, 26, C.blue, C.navy, 'h', 5);
  text(ctx, tr('مرحباً بك في تقرير الجدارات المهنية', 'Welcome to Your Competency Report'),
    rtl ? W - 16 : 16, y + 9, { size: 10.5, color: C.white, bold: true, align: ta, rtl });
  wrapText(ctx,
    tr('هذا التقرير مُعدّ خصيصاً لك. يقدم نظرة شاملة على ملفك الكفاءاتي، ويُبرز نقاط قوتك، ويرسم فرص التطوير.',
      'This report is prepared exclusively for you. It provides a clear overview of your competency profile, highlights your key strengths, and outlines focused development opportunities.'),
    rtl ? W - 16 : 16, y + 19, W - 32, 4.8,
    { size: 8, color: C.white + 'CC', rtl });
  y += 30;

  // Profile row
  rect(ctx, 8, y, W - 16, 20, C.white, C.border, 4);
  const pf = [
    [tr('الاسم', 'Name'), user.name || '—'],
    [tr('المستوى', 'Level'), lv],
    [tr('تاريخ التقييم', 'Date'), user.completion_date || '—'],
    [tr('رقم التقرير', 'Report ID'), rpt.report_id || '—'],
  ];
  const pw = (W - 20) / 4;
  pf.forEach(([lbl, val], i) => {
    const px2 = 8 + i * (pw + 1.2);
    if (i > 0) line(ctx, px2, y + 4, px2, y + 16, C.border, 0.25);
    text(ctx, lbl, px2 + pw / 2, y + 7, { size: 6.5, color: C.muted, align: 'center' });
    text(ctx, val, px2 + pw / 2, y + 14, { size: 8.5, color: C.blue, bold: true, align: 'center', maxWidth: pw - 4 });
  });
  y += 25;

  // How to read
  rect(ctx, 8, y, W - 16, 80, C.white, C.border, 4);
  sectionHeading(ctx, tr('كيف تقرأ هذا التقرير', 'How to Read This Report'), rtl ? W - 14 : 14, y + 9, rtl);
  const steps = [
    { n: '1', ar: 'النظرة العامة', en: 'Overall Snapshot', da: 'نتيجتك الإجمالية ومقارنة المجالات الستة', de: 'Your total score and comparison across six core domains.' },
    { n: '2', ar: 'تحليل المجالات', en: 'Domain Insights', da: 'تحليل تفصيلي لكل مجال مع نقاط القوة والتوصيات', de: 'Detailed breakdown per domain with strengths and recommendations.' },
    { n: '3', ar: 'خطة التطوير', en: 'Development Plan', da: 'خارطة طريق بأهداف قصيرة ومتوسطة وطويلة المدى', de: 'A practical roadmap with short, mid, and long-term goals.' },
    { n: '4', ar: 'الخطوات القادمة', en: 'Next Steps', da: 'كيف تواصل رحلة نموك مع Optivance', de: 'How to continue your growth journey with Optivance.' },
  ];
  steps.forEach((s, i) => {
    const sy = y + 22 + i * 14;
    circle(ctx, rtl ? W - 20 : 20, sy, 5.5, DOMAIN_COLORS[i] + '20', DOMAIN_COLORS[i], 0.5);
    text(ctx, s.n, rtl ? W - 20 : 20, sy, { size: 7.5, color: DOMAIN_COLORS[i], bold: true, align: 'center' });
    text(ctx, rtl ? s.ar : s.en, rtl ? W - 30 : 30, sy - 3.5, { size: 9, color: C.blue, bold: true, align: ta, rtl });
    text(ctx, rtl ? s.da : s.de, rtl ? W - 30 : 30, sy + 3.5, { size: 7.5, color: C.sub, align: ta, rtl, maxWidth: W - 44 });
  });
  y += 85;

  // Methodology note
  rect(ctx, 8, y, W - 16, 18, C.navy, null, 4);
  text(ctx, tr('المنهجية: إطار ROUTE™ للجدارات والقيادة من Optivance', 'Methodology: ROUTE™ Leadership & Competency Framework by Optivance'),
    W / 2, y + 7, { size: 8, color: C.teal, bold: true, align: 'center', rtl });
  text(ctx, tr('مبني على معايير عالمية وواقع بيئات العمل الإقليمية', 'Built on global standards and regional workplace realities.'),
    W / 2, y + 13.5, { size: 7, color: C.white + '66', align: 'center', rtl });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — ABOUT THE ASSESSMENT
// ═══════════════════════════════════════════════════════════════════════════════
function buildAbout(rpt, lang) {
  const { canvas, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (ar, en) => rtl ? ar : en;
  const ta = rtl ? 'right' : 'left';

  pageHeader(ctx, rpt, 3, lang, -1);
  pageFooter(ctx, 3);

  let y = 20;

  // Intro card
  rect(ctx, 8, y, W - 16, 28, C.white, C.border, 4);
  rect(ctx, rtl ? W - 11 : 8, y, 3, 28, C.teal, null, 1.5);
  text(ctx, tr('ما الذي يقيسه هذا المقياس؟', 'What Does This Assessment Measure?'),
    rtl ? W - 16 : 14, y + 9, { size: 10, color: C.blue, bold: true, align: ta, rtl });
  wrapText(ctx,
    tr('يقيس هذا المقياس الجدارات الأساسية المرتبطة بالأداء الوظيفي الفعّال عبر ستة مجالات رئيسية. يعكس كل مجال مجموعة من السلوكيات والمهارات القابلة للتطوير.',
      'This assessment measures core competencies linked to effective professional performance across six key domains. Each domain reflects a set of developable behaviors and skills.'),
    rtl ? W - 16 : 14, y + 18, W - 30, 4.8,
    { size: 8, color: C.sub, rtl });
  y += 32;

  // 6 Domains grid
  rect(ctx, 8, y, W - 16, 94, C.white, C.border, 4);
  sectionHeading(ctx, tr('المجالات الستة الرئيسية', 'The Six Core Domains'), rtl ? W - 14 : 14, y + 9, rtl);
  const dw = (W - 22) / 3;
  DOMAINS.forEach((d, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const dx = 9 + col * (dw + 2), dy = y + 19 + row * 36;
    rect(ctx, dx, dy, dw - 2, 33, C.bg, C.border, 3);
    // color top bar
    rect(ctx, dx, dy, dw - 2, 7, DOMAIN_COLORS[i], null, 3);
    text(ctx, d.name[lang], dx + (dw - 2) / 2, dy + 3.5, { size: 6.5, color: C.white, bold: true, align: 'center' });
    wrapText(ctx, d.description[lang], rtl ? dx + dw - 5 : dx + 4, dy + 14, dw - 12, 4.2,
      { size: 6.5, color: C.sub, rtl });
  });
  y += 98;

  // How scoring works
  rect(ctx, 8, y, W - 16, 44, C.white, C.border, 4);
  sectionHeading(ctx, tr('كيف تُحسب نتيجتك', 'How Your Score Is Calculated'), rtl ? W - 14 : 14, y + 9, rtl);
  const calcs = lang === 'ar' ? [
    'يستخدم المقياس سيناريوهات سلوكية تعكس مواقف عمل حقيقية.',
    'تُحوَّل إجاباتك إلى مؤشرات مرجَّحة لكل كفاءة.',
    'تُجمَّع النتائج في مجالات ستة ودرجة إجمالية.',
    'تُعرَض الدرجات على أربعة مستويات ملونة.',
  ] : [
    'Uses behavioral scenarios reflecting real work situations.',
    'Responses are converted into weighted indicators per competency.',
    'Results are grouped into six domains and an overall score.',
    'Scores are presented on four color-coded performance bands.',
  ];
  calcs.forEach((c, i) => {
    const cy2 = y + 19 + i * 5.8;
    circle(ctx, rtl ? W - 16 : 16, cy2, 2.5, DOMAIN_COLORS[i], null);
    text(ctx, c, rtl ? W - 22 : 22, cy2, { size: 8, color: C.sub, align: ta, rtl, maxWidth: W - 32 });
  });
  y += 48;

  // Band legend
  rect(ctx, 8, y, W - 16, 26, C.white, C.border, 4);
  text(ctx, tr('مستويات الأداء', 'Performance Bands'), rtl ? W - 14 : 14, y + 7, { size: 9, color: C.blue, bold: true, align: ta, rtl });
  const bands = ['Strong', 'Proficient', 'Moderate', 'Critical'];
  const bw2 = (W - 20) / 4;
  bands.forEach((b, i) => {
    const bx = 8 + i * (bw2 + 1.3);
    rect(ctx, bx, y + 13, bw2, 10, bBg(b), bColor(b) + '66', 3, 0.3);
    text(ctx, bLabel(b, lang), bx + bw2 / 2, y + 18, { size: 7, color: bColor(b), bold: true, align: 'center' });
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — OVERALL SNAPSHOT
// ═══════════════════════════════════════════════════════════════════════════════
function buildSnapshot(rpt, lang) {
  const { canvas, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (ar, en) => rtl ? ar : en;
  const ta = rtl ? 'right' : 'left';
  const ds = rpt.domain_scores || {};
  const ov = rpt.overall || { score: 0, band: 'Moderate' };
  const band = ov.band || scoreBand(ov.score);
  const summary = OVERALL_SUMMARIES[band]?.[lang] || '';

  pageHeader(ctx, rpt, 4, lang, -1);
  pageFooter(ctx, 4);

  let y = 20;

  // Score hero
  gradientRect(ctx, 8, y, W - 16, 28, C.navy, C.blue, 'h', 5);
  scoreArc(ctx, rtl ? W - 28 : 28, y + 14, 11, ov.score, bColor(band));
  text(ctx, ov.score + '%', rtl ? W - 28 : 28, y + 13, { size: 13, color: C.white, bold: true, align: 'center' });
  const lbl_x = rtl ? W - 44 : 44, lbl_a = rtl ? 'right' : 'left';
  text(ctx, tr('النتيجة الإجمالية', 'Overall Score'), lbl_x, y + 7, { size: 8, color: C.white + '88', align: lbl_a, rtl });
  text(ctx, bLabel(band, lang), lbl_x, y + 14.5, { size: 11, color: bColor(band), bold: true, align: lbl_a, rtl });
  wrapText(ctx, summary, lbl_x, y + 22, W - 60, 4.5, { size: 7.5, color: C.white + 'BB', rtl });
  y += 33;

  // Six domain cards
  rect(ctx, 8, y, W - 16, 100, C.white, C.border, 4);
  text(ctx, tr('نتائج المجالات الستة', 'Six Domain Results'), rtl ? W - 14 : 14, y + 8, { size: 9.5, color: C.blue, bold: true, align: ta, rtl });
  line(ctx, 12, y + 13.5, W - 12, y + 13.5, C.border, 0.3);

  DOMAINS.forEach((d, i) => {
    const dd = ds[d.id] || { score: 0, band: 'Critical' };
    const dband = dd.band || scoreBand(dd.score);
    const dClr = DOMAIN_COLORS[i];
    const row = Math.floor(i / 2), col = i % 2;
    const cw = (W - 22) / 2, ch = 18;
    const dx = 9 + col * (cw + 2), dy = y + 16 + row * (ch + 2);

    rect(ctx, dx, dy, cw, ch, C.bg, C.border, 3);
    // left accent
    rect(ctx, rtl ? dx + cw - 3 : dx, dy, 3, ch, dClr, null, 1.5);
    // domain name
    text(ctx, d.name[lang], rtl ? dx + cw - 7 : dx + 7, dy + 6, { size: 8.5, color: C.blue, bold: true, align: ta, rtl, maxWidth: cw - 40 });
    // score
    text(ctx, dd.score + '%', rtl ? dx + 12 : dx + cw - 12, dy + 6, { size: 10, color: dClr, bold: true, align: 'center' });
    // band label
    bandPill(ctx, dband, lang, rtl ? dx + 7 : dx + cw - (lang === 'ar' ? 31 : 35), dy + 10);
    // mini bar
    hBar(ctx, rtl ? dx + (lang === 'ar' ? 34 : 38) : dx + 7, dy + 13, cw - 46, 2.8, dd.score, dClr);
  });
  y += 104;

  // Strengths + priorities summary
  const half = (W - 20) / 2;
  const sorted = DOMAINS.map((d, i) => ({ ...d, i, score: ds[d.id]?.score || 0, band: ds[d.id]?.band || 'Critical' }))
    .sort((a, b) => b.score - a.score);

  // Top 2
  rect(ctx, 8, y, half, 30, C.white, C.border, 4);
  rect(ctx, rtl ? 8 + half - 3 : 8, y, 3, 30, BAND.Strong.color, null, 1.5);
  text(ctx, tr('أبرز نقاط القوة', 'Key Strengths'), rtl ? 8 + half - 7 : 12, y + 7, { size: 8.5, color: BAND.Strong.color, bold: true, align: ta, rtl });
  sorted.slice(0, 2).forEach((d, i) => {
    const iy = y + 15 + i * 9;
    circle(ctx, rtl ? 8 + half - 10 : 12, iy, 2.5, DOMAIN_COLORS[d.i], null);
    text(ctx, d.name[lang], rtl ? 8 + half - 15 : 17, iy, { size: 8, color: C.text, align: ta, rtl, maxWidth: half - 30 });
    text(ctx, d.score + '%', rtl ? 13 : 8 + half - 6, iy, { size: 8.5, color: DOMAIN_COLORS[d.i], bold: true, align: 'center' });
  });

  // Bottom 2
  const rx2 = 10 + half + 2;
  rect(ctx, rx2, y, half, 30, C.white, C.border, 4);
  rect(ctx, rtl ? rx2 + half - 3 : rx2, y, 3, 30, BAND.Critical.color, null, 1.5);
  text(ctx, tr('أولويات التطوير', 'Development Priorities'), rtl ? rx2 + half - 7 : rx2 + 4, y + 7, { size: 8.5, color: BAND.Critical.color, bold: true, align: ta, rtl });
  sorted.slice(-2).reverse().forEach((d, i) => {
    const iy = y + 15 + i * 9;
    circle(ctx, rtl ? rx2 + half - 10 : rx2 + 6, iy, 2.5, DOMAIN_COLORS[d.i], null);
    text(ctx, d.name[lang], rtl ? rx2 + half - 15 : rx2 + 11, iy, { size: 8, color: C.text, align: ta, rtl, maxWidth: half - 30 });
    text(ctx, d.score + '%', rtl ? rx2 + 7 : rx2 + half - 6, iy, { size: 8.5, color: DOMAIN_COLORS[d.i], bold: true, align: 'center' });
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 5–10 — DOMAIN DEEP-DIVE
// ═══════════════════════════════════════════════════════════════════════════════
function buildDomain(rpt, lang, idx, pgNum) {
  const { canvas, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (ar, en) => rtl ? ar : en;
  const ta = rtl ? 'right' : 'left';
  const domain = DOMAINS[idx];
  const ds = rpt.domain_scores || {};
  const dd = ds[domain.id] || { score: 0, band: 'Critical' };
  const band = dd.band || scoreBand(dd.score);
  const dClr = DOMAIN_COLORS[idx];
  const content = domain.content[band]?.[lang] || {};
  const subs = rpt.sub_competency_scores || {};

  pageHeader(ctx, rpt, pgNum, lang, idx);
  pageFooter(ctx, pgNum);

  let y = 19;

  // Domain header card
  rect(ctx, 8, y, W - 16, 24, C.white, C.border, 4);
  rect(ctx, rtl ? W - 11 : 8, y, 3, 24, dClr, null, 1.5);
  circle(ctx, rtl ? W - 22 : 22, y + 12, 8, dClr + '18', dClr, 0.6);
  text(ctx, String(idx + 1), rtl ? W - 22 : 22, y + 12, { size: 9.5, color: dClr, bold: true, align: 'center' });
  text(ctx, domain.name[lang], rtl ? W - 34 : 34, y + 8, { size: 11.5, color: C.blue, bold: true, align: ta, rtl });
  text(ctx, domain.description[lang], rtl ? W - 34 : 34, y + 17, { size: 7.5, color: C.muted, align: ta, rtl, maxWidth: W - 60 });
  y += 28;

  // Score bar
  rect(ctx, 8, y, W - 16, 18, C.white, C.border, 4);
  text(ctx, tr('الدرجة المئوية', 'Percentile Score'), rtl ? W - 14 : 14, y + 5.5, { size: 7, color: C.muted, align: ta, rtl });
  hBar(ctx, 14, y + 10, W - 28, 5, dd.score, dClr);
  text(ctx, dd.score + '%', rtl ? 24 : W - 20, y + 12, { size: 9, color: dClr, bold: true, align: 'center' });
  bandPill(ctx, band, lang, rtl ? W - 44 : 14, y + 5);
  y += 22;

  // What your score means
  rect(ctx, 8, y, W - 16, 22, C.white, C.border, 4);
  rect(ctx, rtl ? W - 11 : 8, y, 3, 22, dClr, null, 1.5);
  text(ctx, tr('ماذا تعني درجتك', 'What Your Score Means'), rtl ? W - 15 : 14, y + 7, { size: 9, color: C.blue, bold: true, align: ta, rtl });
  wrapText(ctx, content.summary || '', rtl ? W - 15 : 14, y + 15, W - 26, 4.5, { size: 8, color: C.sub, rtl });
  y += 26;

  // Sub-competencies
  const subC = domain.sub_competencies || [];
  const subH = 14 + subC.length * 15;
  rect(ctx, 8, y, W - 16, subH, C.white, C.border, 4);
  text(ctx, tr('المقاييس الفرعية', 'Sub-Competencies'), rtl ? W - 14 : 14, y + 7, { size: 9, color: C.blue, bold: true, align: ta, rtl });
  line(ctx, 12, y + 12, W - 12, y + 12, C.border, 0.3);
  subC.forEach((sc, si) => {
    const ky = `${domain.id}__${sc.id}`;
    const sData = subs[ky] || { score: dd.score, band };
    const sBand = sData.band || scoreBand(sData.score);
    const sy = y + 14.5 + si * 15;
    if (si % 2 === 0) rect(ctx, 10, sy - 1, W - 20, 14, C.bg, null, 2);
    text(ctx, sc.name[lang], rtl ? W - 16 : 16, sy + 3.5, { size: 8.5, color: C.text, bold: true, align: ta, rtl });
    hBar(ctx, rtl ? 40 : W - 72, sy + 1, 58, 3.5, sData.score, bColor(sBand));
    text(ctx, sData.score + '%', rtl ? 28 : W - 16, sy + 3, { size: 8, color: bColor(sBand), bold: true, align: 'center' });
  });
  y += subH + 4;

  if (y > H - 62) return canvas;

  // Strengths + Recommendations (2 cols)
  const colW = (W - 20) / 2;
  const str = content.strengths || [];
  const rec = content.recommendations || [];
  const maxRows = Math.min(Math.max(str.length, rec.length), 3);
  const twoH = 13 + maxRows * 9 + 4;

  rect(ctx, 8, y, colW, twoH, C.white, C.border, 4);
  rect(ctx, rtl ? 8 + colW - 3 : 8, y, 3, twoH, BAND.Strong.color, null, 1.5);
  text(ctx, tr('نقاط القوة', 'Strengths'), rtl ? 8 + colW - 7 : 12, y + 7, { size: 8.5, color: BAND.Strong.color, bold: true, align: ta, rtl });
  str.slice(0, 3).forEach((s, si) => {
    const sy = y + 14.5 + si * 9;
    circle(ctx, rtl ? 8 + colW - 10 : 12, sy, 2, BAND.Strong.color, null);
    text(ctx, s, rtl ? 8 + colW - 15 : 17, sy, { size: 7.5, color: C.text, align: ta, rtl, maxWidth: colW - 22 });
  });

  const rx3 = 10 + colW + 2;
  rect(ctx, rx3, y, colW, twoH, C.white, C.border, 4);
  rect(ctx, rtl ? rx3 + colW - 3 : rx3, y, 3, twoH, dClr, null, 1.5);
  text(ctx, tr('التوصيات', 'Recommendations'), rtl ? rx3 + colW - 7 : rx3 + 4, y + 7, { size: 8.5, color: dClr, bold: true, align: ta, rtl });
  rec.slice(0, 3).forEach((r, ri) => {
    const ry = y + 14.5 + ri * 9;
    circle(ctx, rtl ? rx3 + colW - 10 : rx3 + 6, ry, 2, dClr, null);
    text(ctx, r, rtl ? rx3 + colW - 15 : rx3 + 11, ry, { size: 7.5, color: C.text, align: ta, rtl, maxWidth: colW - 22 });
  });
  y += twoH + 5;

  // 3-phase goals
  if (content.goals && y < H - 40) {
    const phases = [
      { k: 'short', ar: '٠–٣٠ يوم', en: '0–30 Days', c: '#B52020', bg: '#FEF2F2' },
      { k: 'mid', ar: '٣٠–٩٠ يوم', en: '30–90 Days', c: '#B87000', bg: '#FFFBEB' },
      { k: 'long', ar: '٩٠+ يوم', en: '90+ Days', c: '#1A7A4A', bg: '#ECFDF5' },
    ];
    const pw2 = (W - 20) / 3;
    phases.forEach((ph, pi) => {
      const px2 = 8 + pi * (pw2 + 2), pH = 34;
      rect(ctx, px2, y, pw2, pH, ph.bg, ph.c + '55', 4, 0.35);
      rect(ctx, px2, y, pw2, 8.5, ph.c, null, 4);
      text(ctx, rtl ? ph.ar : ph.en, px2 + pw2 / 2, y + 4.5, { size: 7, color: C.white, bold: true, align: 'center' });
      wrapText(ctx, content.goals[ph.k] || '', rtl ? px2 + pw2 - 5 : px2 + 5, y + 16, pw2 - 10, 4.5, { size: 7.5, color: C.text, rtl });
    });
  }

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 11 — PERSONAL DEVELOPMENT PLAN
// ═══════════════════════════════════════════════════════════════════════════════
function buildDevPlan(rpt, lang) {
  const { canvas, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (ar, en) => rtl ? ar : en;
  const ta = rtl ? 'right' : 'left', tx = rtl ? W - 12 : 12;
  const ds = rpt.domain_scores || {};
  const ov = rpt.overall || { score: 0, band: 'Moderate' };
  const band = ov.band || scoreBand(ov.score);

  pageHeader(ctx, rpt, 11, lang, -1);
  pageFooter(ctx, 11);

  let y = 20;

  // Top summary bar
  rect(ctx, 8, y, W - 16, 16, C.white, C.border, 4);
  scoreArc(ctx, rtl ? W - 20 : 20, y + 8, 6.5, ov.score, bColor(band));
  text(ctx, ov.score + '%', rtl ? W - 20 : 20, y + 7.5, { size: 8, color: bColor(band), bold: true, align: 'center' });
  text(ctx, tr(`أُعدّت لـ: ${rpt.user?.preferred_name || rpt.user?.name || '—'}`, `Prepared for: ${rpt.user?.preferred_name || rpt.user?.name || '—'}`),
    rtl ? W - 32 : 32, y + 7, { size: 9, color: C.blue, bold: true, align: ta, rtl });
  text(ctx, tr(`النتيجة: ${bLabel(band, lang)} (${ov.score}%)`, `Score: ${bLabel(band, lang)} (${ov.score}%)`),
    rtl ? W - 32 : 32, y + 13.5, { size: 7.5, color: bColor(band), align: ta, rtl });
  y += 20;

  sectionHeading(ctx, tr('أولويات التطوير المقترحة', 'Suggested Development Priorities'), tx, y + 5, rtl);
  y += 14;

  const sorted = DOMAINS.map((d, i) => ({ ...d, i, score: ds[d.id]?.score || 0, band: ds[d.id]?.band || 'Critical' }))
    .sort((a, b) => a.score - b.score).slice(0, 3);

  sorted.forEach((d, pi) => {
    const dClr = DOMAIN_COLORS[d.i];
    const content = d.content[d.band]?.[lang] || {};
    const goals = content.goals || {};
    const rH = 52;
    rect(ctx, 8, y, W - 16, rH, C.white, C.border, 4);
    rect(ctx, rtl ? W - 11 : 8, y, 3, rH, dClr, null, 1.5);
    // Priority badge
    rect(ctx, rtl ? 14 : W - 24, y + 3, 18, 7, dClr + '22', dClr, 3.5, 0.4);
    text(ctx, tr(`أولوية ${pi + 1}`, `Priority ${pi + 1}`), rtl ? 23 : W - 15, y + 6.5, { size: 6.5, color: dClr, bold: true, align: 'center' });
    // Name + score
    text(ctx, d.name[lang], rtl ? W - 35 : 35, y + 8, { size: 9.5, color: C.blue, bold: true, align: ta, rtl });
    text(ctx, d.score + '%', rtl ? W - 35 : 35, y + 15, { size: 8, color: dClr, align: ta, rtl });
    // Score bar
    hBar(ctx, 34, y + 18, W - 48, 4, d.score, dClr);
    // 3 goals
    const gw = (W - 52) / 3;
    [{ k: 'short', l: tr('٠–٣٠', '0–30'), c: '#B52020' }, { k: 'mid', l: tr('٣٠–٩٠', '30–90'), c: '#B87000' }, { k: 'long', l: tr('٩٠+', '90+'), c: '#1A7A4A' }]
      .forEach((ph, gi) => {
        const gx = 34 + gi * (gw + 3);
        rect(ctx, gx, y + 25, gw, 24, C.bg, C.border, 3);
        rect(ctx, gx, y + 25, gw, 7, ph.c, null, 3);
        text(ctx, ph.l, gx + gw / 2, y + 28.5, { size: 6, color: C.white, bold: true, align: 'center' });
        wrapText(ctx, goals[ph.k] || '', gx + 3, y + 37, gw - 6, 4, { size: 7, color: C.text, rtl });
      });
    y += rH + 4;
  });

  // Monthly reflection
  if (y < H - 52) {
    sectionHeading(ctx, tr('قالب التأمل الشهري', 'Monthly Reflection Template'), tx, y + 5, rtl);
    y += 14;
    const qw = (W - 20) / 2;
    [tr('ما الذي تحسّن هذا الشهر؟', 'What improved this month?'),
      tr('ما التحديات التي واجهتها؟', 'What challenges did I face?'),
      tr('ما الذي سأعدّل في خطتي؟', 'What will I adjust?'),
      tr('ما تركيزي للشهر القادم؟', 'What is my next month focus?'),
    ].forEach((q, qi) => {
      const qx = 8 + (qi % 2) * (qw + 4), qy = y + Math.floor(qi / 2) * 22;
      rect(ctx, qx, qy, qw, 20, C.white, C.border, 3);
      text(ctx, q, rtl ? qx + qw - 5 : qx + 5, qy + 6, { size: 7.5, color: C.blue, bold: true, align: ta, rtl, maxWidth: qw - 10 });
      line(ctx, qx + 5, qy + 13, qx + qw - 5, qy + 13, C.border, 0.3);
      line(ctx, qx + 5, qy + 17, qx + qw - 5, qy + 17, C.border, 0.3);
    });
  }

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 12 — BACK COVER
// ═══════════════════════════════════════════════════════════════════════════════
function buildBackCover(rpt, lang) {
  const { canvas, ctx } = newPage();
  const rtl = lang === 'ar', tr = (ar, en) => rtl ? ar : en;
  const ov = rpt.overall || { score: 0, band: 'Moderate' };
  const band = ov.band || scoreBand(ov.score);

  // Dark gradient BG
  const bg = ctx.createLinearGradient(0, 0, 0, CH);
  bg.addColorStop(0, '#0B1E30'); bg.addColorStop(1, '#060F18');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);
  ctx.save(); ctx.globalAlpha = 0.04; ctx.fillStyle = C.teal;
  for (let xi = 0; xi < CW; xi += PX(9))
    for (let yi = 0; yi < CH; yi += PX(9)) {
      ctx.beginPath(); ctx.arc(xi, yi, PX(0.4), 0, Math.PI * 2); ctx.fill();
    }
  ctx.restore();

  // Color strip top
  domainStrip(ctx, -1);

  text(ctx, tr('خطواتك القادمة', 'Your Next Steps'), W / 2, 18, { size: 14, color: C.teal, bold: true, align: 'center', rtl });
  text(ctx, tr('كيف تواصل رحلة نموك مع Optivance', 'How to continue your growth journey with Optivance'),
    W / 2, 26, { size: 8, color: C.white + '55', align: 'center', rtl });
  line(ctx, 20, 31, W - 20, 31, C.white + '15', 0.35);

  const steps = [
    { n: '01', c: '#1558A0', ar: 'راجع تقريرك بعمق', en: 'Deep-Review Your Report', da: 'اقرأ تحليل كل مجال وافهم ما تعنيه نتيجتك', de: 'Read each domain and understand your score.' },
    { n: '02', c: '#1A7A4A', ar: 'حدد هدفين فوريين', en: 'Set Two Immediate Goals', da: 'اختر هدفين من قسم ٠–٣٠ يومًا وابدأ بهما', de: 'Pick two 0–30 day goals and start today.' },
    { n: '03', c: '#B87000', ar: 'شاركه مع مشرفك', en: 'Share With Your Manager', da: 'ناقش التقرير مع مشرفك أو مرشدك المهني', de: 'Discuss with your direct manager or mentor.' },
    { n: '04', c: '#6B21A8', ar: 'تابع تقدمك شهريًا', en: 'Track Progress Monthly', da: 'استخدم قالب التأمل مرة كل ٣٠ يومًا', de: 'Use the reflection template every 30 days.' },
    { n: '05', c: C.teal, ar: 'استكشف حلول Optivance', en: 'Explore Optivance Solutions', da: 'تصفح متجرنا للأدوات والتدريبات', de: 'Browse our store for tools and training.' },
  ];
  let sy = 36;
  steps.forEach((s) => {
    rect(ctx, 8, sy, W - 16, 17, C.white + '08', C.white + '14', 4);
    circle(ctx, rtl ? W - 20 : 20, sy + 8.5, 7, s.c + '25', s.c, 0.6);
    text(ctx, s.n, rtl ? W - 20 : 20, sy + 8.5, { size: 7.5, color: s.c, bold: true, align: 'center' });
    text(ctx, rtl ? s.ar : s.en, rtl ? W - 31 : 31, sy + 5.5, { size: 9, color: C.white, bold: true, align: rtl ? 'right' : 'left', rtl });
    text(ctx, rtl ? s.da : s.de, rtl ? W - 31 : 31, sy + 12, { size: 7.5, color: C.white + '66', align: rtl ? 'right' : 'left', rtl, maxWidth: W - 44 });
    sy += 19;
  });

  line(ctx, 16, sy + 5, W - 16, sy + 5, C.white + '15', 0.35);
  sy += 12;

  // About
  text(ctx, tr('عن Optivance', 'About Optivance'), W / 2, sy, { size: 12, color: C.teal, bold: true, align: 'center', rtl });
  sy += 8;
  wrapText(ctx,
    tr('Optivance شركة استشارية متخصصة في تطوير المواهب وبناء القدرات. نساعد الأفراد والمنظمات على تحويل نتائج التقييم إلى نمو حقيقي وقابل للقياس.',
      'Optivance is a specialized consultancy in talent development and organizational capability. We help individuals and organizations transform assessment results into real, measurable professional growth.'),
    18, sy, W - 36, 5.5, { size: 8, color: C.white + '88', rtl });
  sy += 16;

  text(ctx, 'www.optivance.com  ·  info@optivance.com', W / 2, sy, { size: 8, color: C.teal + '88', align: 'center' });
  sy += 12;

  // Big score
  scoreArc(ctx, W / 2, sy + 18, 20, ov.score, bColor(band));
  text(ctx, ov.score + '%', W / 2, sy + 17, { size: 20, color: bColor(band), bold: true, align: 'center' });
  text(ctx, bLabel(band, lang), W / 2, sy + 32, { size: 9, color: bColor(band), bold: true, align: 'center', rtl });
  text(ctx, rpt.user?.name || '', W / 2, sy + 40, { size: 11, color: C.white, bold: true, align: 'center', rtl });
  sy += 48;

  line(ctx, 30, sy, W - 30, sy, C.white + '12', 0.35);
  text(ctx, 'OPTIVANCE', W / 2, sy + 9, { size: 18, color: C.teal, bold: true, align: 'center' });
  text(ctx, tr('بناء المهنيين المتميزين', 'Building Distinguished Professionals'), W / 2, sy + 17, { size: 8, color: C.white + '44', align: 'center', rtl });
  text(ctx, tr(`رقم التقرير: ${rpt.report_id || '—'}`, `Report ID: ${rpt.report_id || '—'}`), W / 2, H - 12, { size: 7, color: C.white + '30', align: 'center' });
  text(ctx, '© 2025 OPTIVANCE — All Rights Reserved', W / 2, H - 7, { size: 6, color: C.white + '20', align: 'center' });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateCompetencyPDF(reportData, attemptId) {
  const lang = reportData.language || 'ar';
  const pages = [
    buildCover(reportData, lang),
    buildWelcome(reportData, lang),
    buildAbout(reportData, lang),
    buildSnapshot(reportData, lang),
    ...DOMAINS.map((_, i) => buildDomain(reportData, lang, i, i + 5)),
    buildDevPlan(reportData, lang),
    buildBackCover(reportData, lang),
  ];
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pages.forEach((cv, i) => {
    if (i > 0) pdf.addPage();
    pdf.addImage(cv.toDataURL('image/png', 1.0), 'PNG', 0, 0, W, H, '', 'FAST');
  });
  const name = `optivance-competency-${reportData.report_id || attemptId || 'report'}.pdf`;
  pdf.save(name);
  return name;
}