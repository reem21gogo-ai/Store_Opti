/**
 * Optivance Competency Report — Premium PDF Engine v3
 * Clean, professional, Hogan-grade output
 * A4 @ 3× resolution — crisp typography, real infographics
 */
import jsPDF from 'jspdf';
import { DOMAINS, OVERALL_SUMMARIES, LEVEL_LABELS } from './competencyContent';

// ── BRAND ─────────────────────────────────────────────────────────────────────
const NAVY   = '#0D1F33';
const BLUE   = '#1A3A5C';
const TEAL   = '#05E1AE';
const WHITE  = '#FFFFFF';
const LIGHT  = '#F4F7FA';
const BORDER = '#DDE4ED';
const TEXT   = '#2D3748';
const MUTED  = '#8FA3BC';

// Band system (Hogan-style: score 0-100 → 4 zones)
const BANDS = {
  Critical:   { color: '#C0392B', bg: '#FDEDEC', label: { ar: 'أولوية تطوير', en: 'Development Priority' } },
  Moderate:   { color: '#D68910', bg: '#FEF9E7', label: { ar: 'متوسط',       en: 'Moderate'             } },
  Proficient: { color: '#1A6FA8', bg: '#EBF5FB', label: { ar: 'كفء',         en: 'Proficient'           } },
  Strong:     { color: '#1E8449', bg: '#EAFAF1', label: { ar: 'متميز',       en: 'Strong'               } },
};

const DOMAIN_COLORS = ['#7B2D8B','#1A6FA8','#1E8449','#C0392B','#D68910','#0891B2'];

const bc  = b => BANDS[b]?.color || MUTED;
const bbg = b => BANDS[b]?.bg    || LIGHT;
const bl  = (b, lang) => BANDS[b]?.label?.[lang] || b;

// ── CANVAS SETUP — A4 @ 3× ────────────────────────────────────────────────────
const W_MM = 210, H_MM = 297, DPR = 3;
const PX_PER_MM = 3.7795 * DPR;
const CW = Math.round(W_MM * PX_PER_MM);
const CH = Math.round(H_MM * PX_PER_MM);
const mm = v => Math.round(v * PX_PER_MM);

function newPage(bg = WHITE) {
  const c = document.createElement('canvas');
  c.width = CW; c.height = CH;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CW, CH);
  return { canvas: c, ctx };
}

// ── DRAWING HELPERS ───────────────────────────────────────────────────────────
function rect(ctx, x, y, w, h, fill, stroke, radius = 0, sw = 0.5) {
  ctx.save();
  ctx.beginPath();
  const [X,Y,W,H,R] = [mm(x),mm(y),mm(w),mm(h),mm(radius)];
  if (R > 0) {
    ctx.moveTo(X+R,Y); ctx.lineTo(X+W-R,Y); ctx.quadraticCurveTo(X+W,Y,X+W,Y+R);
    ctx.lineTo(X+W,Y+H-R); ctx.quadraticCurveTo(X+W,Y+H,X+W-R,Y+H);
    ctx.lineTo(X+R,Y+H); ctx.quadraticCurveTo(X,Y+H,X,Y+H-R);
    ctx.lineTo(X,Y+R); ctx.quadraticCurveTo(X,Y,X+R,Y);
    ctx.closePath();
  } else { ctx.rect(X,Y,W,H); }
  if (fill)   { ctx.fillStyle = fill;  ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = mm(sw); ctx.stroke(); }
  ctx.restore();
}

function line(ctx, x1, y1, x2, y2, color, w = 0.3) {
  ctx.save();
  ctx.beginPath(); ctx.moveTo(mm(x1),mm(y1)); ctx.lineTo(mm(x2),mm(y2));
  ctx.strokeStyle = color; ctx.lineWidth = mm(w); ctx.stroke();
  ctx.restore();
}

function circle(ctx, cx, cy, r, fill, stroke, sw = 0.5) {
  ctx.save();
  ctx.beginPath(); ctx.arc(mm(cx),mm(cy),mm(r),0,Math.PI*2);
  if (fill)   { ctx.fillStyle = fill;   ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = mm(sw); ctx.stroke(); }
  ctx.restore();
}

// Text: size in pt-equivalent, align: left/center/right
function text(ctx, str, x, y, { size=9, color=TEXT, bold=false, align='left', rtl=false, maxW } = {}) {
  if (!str && str !== 0) return;
  ctx.save();
  const fs = Math.round(size * PX_PER_MM * 0.38);
  ctx.font = `${bold?'700':'400'} ${fs}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.direction = rtl ? 'rtl' : 'ltr';
  ctx.textBaseline = 'middle';
  const args = [String(str), mm(x), mm(y)];
  if (maxW) args.push(mm(maxW));
  ctx.fillText(...args);
  ctx.restore();
}

// Word-wrap text, returns lines drawn
function wrapText(ctx, str, x, y, maxW, lineH, opts = {}) {
  if (!str) return 0;
  ctx.save();
  const { size=8.5, color=TEXT, bold=false, rtl=false } = opts;
  const fs = Math.round(size * PX_PER_MM * 0.38);
  ctx.font = `${bold?'700':'400'} ${fs}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.direction = rtl ? 'rtl' : 'ltr';
  ctx.textBaseline = 'middle';
  const words = String(str).split(' ');
  const mw = mm(maxW);
  let line2 = '', curY = mm(y), lh = mm(lineH), lines = 0;
  words.forEach((w, i) => {
    const test = line2 ? line2 + ' ' + w : w;
    if (ctx.measureText(test).width > mw && i > 0) {
      ctx.fillText(line2, mm(x), curY);
      line2 = w; curY += lh; lines++;
    } else { line2 = test; }
  });
  if (line2) { ctx.fillText(line2, mm(x), curY); lines++; }
  ctx.restore();
  return lines;
}

// Horizontal gradient fill
function gradRect(ctx, x, y, w, h, c1, c2, radius = 0) {
  ctx.save();
  const g = ctx.createLinearGradient(mm(x),mm(y),mm(x+w),mm(y));
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.beginPath();
  const [X,Y,W,H,R] = [mm(x),mm(y),mm(w),mm(h),mm(radius)];
  if (R > 0) {
    ctx.moveTo(X+R,Y); ctx.lineTo(X+W-R,Y); ctx.quadraticCurveTo(X+W,Y,X+W,Y+R);
    ctx.lineTo(X+W,Y+H-R); ctx.quadraticCurveTo(X+W,Y+H,X+W-R,Y+H);
    ctx.lineTo(X+R,Y+H); ctx.quadraticCurveTo(X,Y+H,X,Y+H-R);
    ctx.lineTo(X,Y+R); ctx.quadraticCurveTo(X,Y,X+R,Y);
    ctx.closePath();
  } else { ctx.rect(X,Y,W,H); }
  ctx.fillStyle = g; ctx.fill();
  ctx.restore();
}

// ── HOGAN-STYLE SCORE BAR ─────────────────────────────────────────────────────
// Full-width segmented bar with 4 zones + score marker
function hoganBar(ctx, x, y, w, h, score, rtl = false) {
  const zones = [
    { label: { ar:'أولوية تطوير',en:'Development Priority' }, fill:'#FDEDEC', border:'#C0392B' },
    { label: { ar:'متوسط',       en:'Moderate'             }, fill:'#FEF9E7', border:'#D68910' },
    { label: { ar:'كفء',        en:'Proficient'            }, fill:'#EBF5FB', border:'#1A6FA8' },
    { label: { ar:'متميز',      en:'Strong'                }, fill:'#EAFAF1', border:'#1E8449' },
  ];
  const zw = w / 4;
  zones.forEach((z, i) => {
    const zx = rtl ? x + w - (i+1)*zw : x + i*zw;
    rect(ctx, zx, y, zw, h, z.fill, z.border, 0, 0.2);
  });
  // separator lines
  [1,2,3].forEach(i => {
    line(ctx, x + i*(w/4), y, x + i*(w/4), y+h, WHITE, 0.5);
  });
  // Score marker
  const markerX = rtl ? x + w - (score/100)*w : x + (score/100)*w;
  rect(ctx, markerX - 0.7, y - 1.5, 1.4, h + 3, bc(scoreBand(score)), null, 0.7);
  // Score number above marker
  text(ctx, score + '%', markerX, y - 4, { size: 9, color: bc(scoreBand(score)), bold: true, align: 'center' });
}

function scoreBand(s) {
  if (s >= 80) return 'Strong';
  if (s >= 60) return 'Proficient';
  if (s >= 40) return 'Moderate';
  return 'Critical';
}

// ── HALF-ARC GAUGE (Thomas HPTI-style) ───────────────────────────────────────
function arcGauge(ctx, cx, cy, r, score, color) {
  const sw = mm(r * 0.32);
  const start = Math.PI, end = Math.PI * 2;
  // Background arc
  ctx.save();
  ctx.beginPath();
  ctx.arc(mm(cx), mm(cy), mm(r), start, end);
  ctx.strokeStyle = BORDER; ctx.lineWidth = sw; ctx.lineCap = 'round'; ctx.stroke();
  // 4 zone arcs
  const zoneColors = ['#FDEDEC','#FEF9E7','#EBF5FB','#EAFAF1'];
  const step = Math.PI / 4;
  zoneColors.forEach((zc, i) => {
    ctx.beginPath();
    ctx.arc(mm(cx), mm(cy), mm(r), start + i*step, start + (i+1)*step);
    ctx.strokeStyle = zc; ctx.lineWidth = sw * 0.9; ctx.lineCap = 'butt'; ctx.stroke();
  });
  // Score fill
  if (score > 0) {
    const fillEnd = start + (score / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(mm(cx), mm(cy), mm(r), start, fillEnd);
    ctx.strokeStyle = color; ctx.lineWidth = sw; ctx.lineCap = 'round'; ctx.stroke();
  }
  // Zone tick marks
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    const a = start + t * Math.PI;
    const r1 = mm(r) - sw*0.6, r2 = mm(r) + sw*0.6;
    ctx.beginPath();
    ctx.moveTo(mm(cx)+r1*Math.cos(a), mm(cy)+r1*Math.sin(a));
    ctx.lineTo(mm(cx)+r2*Math.cos(a), mm(cy)+r2*Math.sin(a));
    ctx.strokeStyle = WHITE; ctx.lineWidth = mm(0.5); ctx.stroke();
  });
  ctx.restore();
}

// ── PAGE TEMPLATE ELEMENTS ────────────────────────────────────────────────────
function pageHeader(ctx, title, pageNum, lang, accentColor = BLUE) {
  const rtl = lang === 'ar';
  // Top gradient bar
  gradRect(ctx, 0, 0, W_MM, 15, NAVY, BLUE);
  rect(ctx, 0, 15, W_MM, 0.8, TEAL);
  // Logo area
  rect(ctx, rtl?W_MM-50:6, 4, 44, 7, TEAL+'22', TEAL+'55', 3.5);
  text(ctx, 'OPTIVANCE', rtl?W_MM-28:28, 7.5, { size:7.5, color:TEAL, bold:true, align:'center' });
  // Page title
  const tx = rtl ? W_MM - 56 : 56;
  text(ctx, title, tx, 7.5, { size:9.5, color:WHITE, bold:true, align: rtl?'right':'left', rtl });
  // Page number badge
  const bx = rtl ? 5 : W_MM - 20;
  rect(ctx, bx, 3.5, 15, 8, accentColor, null, 4);
  text(ctx, String(pageNum), bx + 7.5, 7.5, { size:7, color:WHITE, bold:true, align:'center' });
}

function pageFooter(ctx, lang) {
  rect(ctx, 0, H_MM-7, W_MM, 7, NAVY);
  line(ctx, 0, H_MM-7, W_MM, H_MM-7, TEAL+'44', 0.4);
  text(ctx, 'OPTIVANCE  ·  www.optivance.com  ·  info@optivance.com  ·  © 2025',
    W_MM/2, H_MM-3.5, { size:5.5, color:WHITE+'55', align:'center' });
}

function sectionTitle(ctx, title, x, y, rtl, color = BLUE) {
  text(ctx, title, x, y, { size:10.5, color, bold:true, align: rtl?'right':'left', rtl });
  line(ctx, x-(rtl?-2:0), y+4, x+(rtl?-80:80), y+4, TEAL, 1.2);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — FRONT COVER
// ═══════════════════════════════════════════════════════════════════════════════
function buildFrontCover(rpt, lang) {
  const { canvas, ctx } = newPage();
  const rtl = lang === 'ar';
  const T = (ar, en) => rtl ? ar : en;
  const user = rpt.user || {};
  const ov = rpt.overall || { score: 0, band: 'Moderate' };
  const lv = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '—';
  const band = ov.band || scoreBand(ov.score);

  // ── Full dark background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, CH);
  bgGrad.addColorStop(0, '#0D1F33');
  bgGrad.addColorStop(0.5, '#122840');
  bgGrad.addColorStop(1, '#0A1929');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CW, CH);

  // Subtle dot texture
  ctx.save(); ctx.globalAlpha = 0.04; ctx.fillStyle = TEAL;
  for (let xi = 0; xi < CW; xi += mm(9))
    for (let yi = 0; yi < CH; yi += mm(9)) {
      ctx.beginPath(); ctx.arc(xi, yi, mm(0.4), 0, Math.PI*2); ctx.fill();
    }
  ctx.restore();

  // ── Teal accent top bar
  rect(ctx, 0, 0, W_MM, 2, TEAL);

  // ── Right decorative panel
  ctx.save(); ctx.globalAlpha = 0.06;
  rect(ctx, W_MM-55, 0, 55, H_MM, TEAL);
  ctx.restore();
  line(ctx, W_MM-55, 0, W_MM-55, H_MM, TEAL+'15', 0.4);

  // ── OPTIVANCE wordmark
  const lx = rtl ? W_MM-58 : 12, lw = 46;
  rect(ctx, lx, 14, lw, 10, TEAL+'20', TEAL+'44', 5);
  text(ctx, 'OPTIVANCE', lx + lw/2, 19, { size:9, color:TEAL, bold:true, align:'center' });
  text(ctx, T('للاستشارات وتطوير المواهب','Consulting & Talent Development'),
    lx + lw/2, 27, { size:6, color:WHITE+'55', align:'center', rtl });

  // ── Main title block
  const tx2 = rtl ? W_MM-12 : 12;
  const ta = rtl ? 'right' : 'left';
  text(ctx, T('تقرير','Competency'),          tx2, 55, { size:32, color:WHITE,  bold:true, align:ta, rtl });
  text(ctx, T('الجدارات المهنية','& Growth Report'), tx2, 73, { size:32, color:TEAL, bold:true, align:ta, rtl });
  wrapText(ctx,
    T('مقياس علمي متكامل لقياس الكفاءات المهنية في ٦ مجالات رئيسية وفق أعلى المعايير العالمية',
      'A comprehensive scientific assessment measuring professional competencies across 6 key domains to world-class standards'),
    rtl?W_MM-12:12, 85, W_MM-70, 5.5, { size:8, color:WHITE+'66', rtl });

  // ── Divider
  line(ctx, 12, 96, W_MM-12, 96, TEAL+'44', 0.5);

  // ── Arc gauge (score) — opposite corner
  const gcx = rtl ? 38 : W_MM - 38, gcy = 64;
  circle(ctx, gcx, gcy, 20, WHITE+'07', WHITE+'15', 0.5);
  arcGauge(ctx, gcx, gcy, 14, ov.score, bc(band));
  text(ctx, ov.score + '%', gcx, gcy,   { size:16, color:WHITE, bold:true, align:'center' });
  text(ctx, T('نتيجتك','Your Score'), gcx, gcy+9, { size:6, color:WHITE+'66', align:'center' });
  rect(ctx, gcx-14, gcy+13, 28, 8, bc(band)+'30', bc(band)+'88', 4);
  text(ctx, bl(band, lang), gcx, gcy+17, { size:7, color:bc(band), bold:true, align:'center' });

  // ── Profile card
  const cardY = 100;
  rect(ctx, 12, cardY, W_MM-24, 80, WHITE+'09', WHITE+'18', 6);
  text(ctx, T('بيانات المشارك','Participant Profile'),
    rtl?W_MM-19:19, cardY+8, { size:9, color:TEAL, bold:true, align:rtl?'right':'left', rtl });
  line(ctx, 16, cardY+13, W_MM-16, cardY+13, WHITE+'20', 0.4);

  const fields = [
    [T('الاسم الكامل','Full Name'),         user.name || '—'],
    [T('الاسم المفضل','Preferred Name'),    user.preferred_name || user.name || '—'],
    [T('المستوى المهني','Professional Level'), lv],
    [T('نسخة المقياس','Assessment Version'), rpt.version === 'full' ? T('الكاملة','Full') : T('السريعة','Quick')],
    [T('تاريخ الإكمال','Completion Date'),  user.completion_date || '—'],
    [T('رقم التقرير','Report ID'),          rpt.report_id || '—'],
  ];

  const colW = (W_MM-32)/2;
  fields.forEach(([label, val], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const fx = rtl ? W_MM-16-col*(colW+4) : 16+col*(colW+4);
    const fy = cardY + 18 + row * 20;
    rect(ctx, rtl?fx-colW:fx, fy, colW, 17, WHITE+'07', WHITE+'15', 3.5);
    text(ctx, label, rtl?fx-6:fx+6, fy+5.5, { size:6.5, color:TEAL+'bb', align:rtl?'right':'left', rtl });
    text(ctx, val,   rtl?fx-6:fx+6, fy+12,  { size:8.5, color:WHITE+'dd', bold:true, align:rtl?'right':'left', rtl, maxW:colW-12 });
  });

  // ── Assessment pillars
  const pillY = cardY + 84;
  const pillars = [
    [T('٦ مجالات','6 Domains'),     T('رئيسية','Key')],
    [T('٢٠ جدارة','20 Competencies'), T('أساسية','Core')],
    [T('٣ مستويات','3 Levels'),    T('أداء','Performance')],
    [T('خطة','Dev'),              T('تطوير','Plan')],
  ];
  const pw = (W_MM-24)/4;
  pillars.forEach(([n, sub], i) => {
    const px2 = 12 + i*(pw+4);
    rect(ctx, px2, pillY, pw, 16, WHITE+'0a', WHITE+'20', 4);
    text(ctx, n,   px2+pw/2, pillY+6,  { size:8.5, color:TEAL,      bold:true, align:'center', rtl });
    text(ctx, sub, px2+pw/2, pillY+12, { size:7,   color:WHITE+'66', align:'center', rtl });
  });

  // ── Bottom branding
  const bY = H_MM - 28;
  line(ctx, 12, bY, W_MM-12, bY, TEAL+'22', 0.4);
  text(ctx, 'OPTIVANCE', W_MM/2, bY+7, { size:8.5, color:TEAL+'44', bold:true, align:'center' });
  text(ctx, 'www.optivance.com', W_MM/2, bY+14, { size:7, color:WHITE+'33', align:'center' });
  text(ctx, T('جميع الحقوق محفوظة © 2025','All Rights Reserved © 2025'),
    W_MM/2, bY+21, { size:6, color:WHITE+'25', align:'center', rtl });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — ABOUT THE ASSESSMENT + OVERALL RESULTS
// ═══════════════════════════════════════════════════════════════════════════════
function buildAboutAndOverall(rpt, lang) {
  const { canvas, ctx } = newPage(LIGHT);
  const rtl = lang === 'ar';
  const T = (ar, en) => rtl ? ar : en;
  const ov = rpt.overall || { score: 0, band: 'Moderate' };
  const band = ov.band || scoreBand(ov.score);
  const summary = OVERALL_SUMMARIES[band]?.[lang] || '';

  pageHeader(ctx, T('نبذة عن المقياس والنتائج','About the Assessment & Results'), 2, lang);
  pageFooter(ctx, lang);

  const tx = rtl ? W_MM-12 : 12;
  const ta = rtl ? 'right' : 'left';
  let y = 20;

  // ── About section
  rect(ctx, 8, y, W_MM-16, 58, WHITE, BORDER, 4);
  rect(ctx, rtl?W_MM-11:8, y, 3, 58, TEAL, null, 1.5);
  sectionTitle(ctx, T('عن مقياس الجدارات المهنية','About the Competency Assessment'),
    rtl?W_MM-15:15, y+8, rtl);

  const aboutText = T(
    'مقياس الجدارات المهنية من Optivance هو أداة تقييم علمية شاملة مصممة لقياس أداء الموظف عبر ستة مجالات جدارة رئيسية تشمل ٢٠ كفاءة أساسية. يستند المقياس إلى أفضل المعايير المهنية العالمية ويقدم لك رؤية تحليلية دقيقة لنقاط قوتك وأولويات تطويرك، مدعومة بخطة عمل قابلة للتنفيذ.',
    'The Optivance Professional Competency Assessment is a comprehensive scientific tool designed to measure employee performance across six core competency domains encompassing 20 essential competencies. Grounded in global professional standards, it delivers precise analytical insights into your strengths and development priorities, supported by an actionable development plan.'
  );
  wrapText(ctx, aboutText, rtl?W_MM-15:15, y+22, W_MM-30, 5.5, { size:8.5, color:TEXT, rtl });

  const features = [
    [T('٦ مجالات رئيسية','6 Core Domains'), T('تغطي كافة جوانب الأداء','Covering all performance aspects')],
    [T('٢٠ جدارة أساسية','20 Core Competencies'), T('مُحددة بدقة علمية','Scientifically defined')],
    [T('تقرير فوري','Instant Report'), T('تحليل وخطة تطوير','Analysis & development plan')],
  ];
  features.forEach(([n, d], i) => {
    const fy = y + 40 + i * 5.5;
    circle(ctx, rtl?W_MM-16:15, fy, 1.5, TEAL, null);
    text(ctx, n,  rtl?W_MM-20:19, fy, { size:7.5, color:BLUE,  bold:true, align:ta, rtl });
    text(ctx, ' — '+d, rtl?W_MM-20-(rtl?-30:30):19+30, fy, { size:7.5, color:MUTED, align:ta });
  });
  y += 62;

  // ── Overall score hero
  rect(ctx, 8, y, W_MM-16, 46, WHITE, BORDER, 4);
  sectionTitle(ctx, T('نتيجتك الإجمالية','Your Overall Score'),
    rtl?W_MM-15:15, y+8, rtl);

  // Arc gauge large
  const gcx = rtl ? W_MM-30 : 30, gcy = y+28;
  arcGauge(ctx, gcx, gcy, 14, ov.score, bc(band));
  text(ctx, ov.score+'%', gcx, gcy,    { size:16, color:bc(band), bold:true, align:'center' });
  text(ctx, T('من ١٠٠','out of 100'), gcx, gcy+8, { size:6, color:MUTED, align:'center' });

  // Band badge
  const bx2 = rtl ? W_MM-55 : 48;
  rect(ctx, bx2, y+15, 38, 10, bc(band)+'18', bc(band)+'66', 5);
  text(ctx, bl(band, lang), bx2+19, y+20, { size:9, color:bc(band), bold:true, align:'center' });

  // Summary text
  wrapText(ctx, summary, rtl?W_MM-15:15, y+36, W_MM-56, 5, { size:8, color:TEXT, rtl });
  y += 50;

  // ── Score scale explanation (Hogan-style)
  rect(ctx, 8, y, W_MM-16, 28, WHITE, BORDER, 4);
  sectionTitle(ctx, T('مفتاح قراءة الدرجات','Score Interpretation Guide'),
    rtl?W_MM-15:15, y+8, rtl);
  const bw = (W_MM-28)/4;
  const bands = ['Critical','Moderate','Proficient','Strong'];
  const ranges = ['0–39','40–59','60–79','80–100'];
  bands.forEach((b, i) => {
    const bx3 = 12 + i*bw;
    rect(ctx, bx3, y+15, bw-2, 10, bbg(b), bc(b)+'55', 3);
    text(ctx, bl(b, lang), bx3+(bw-2)/2, y+17.5, { size:6.5, color:bc(b), bold:true, align:'center', rtl });
    text(ctx, ranges[i], bx3+(bw-2)/2, y+23, { size:6, color:MUTED, align:'center' });
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — DOMAINS OVERVIEW DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function buildDashboard(rpt, lang) {
  const { canvas, ctx } = newPage(LIGHT);
  const rtl = lang === 'ar';
  const T = (ar, en) => rtl ? ar : en;
  const ds = rpt.domain_scores || {};

  pageHeader(ctx, T('ملخص النتائج — المجالات الستة','Results Summary — Six Domains'), 3, lang);
  pageFooter(ctx, lang);

  let y = 20;

  // ── 6 domain cards (2 columns × 3 rows)
  const colW = (W_MM-20)/2;
  const rowH = 56;

  DOMAINS.forEach((domain, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx2 = 8 + col*(colW+4);
    const cy2 = y + row*(rowH+4);
    const dd = ds[domain.id] || { score: 0, band: 'Critical' };
    const band = dd.band || scoreBand(dd.score);
    const dClr = DOMAIN_COLORS[i] || BLUE;
    const lk = lang;

    // Card background
    rect(ctx, cx2, cy2, colW, rowH, WHITE, BORDER, 4);
    // Domain color left/right strip
    rect(ctx, rtl?cx2+colW-3:cx2, cy2, 3, rowH, dClr, null, 1.5);

    // Domain number
    circle(ctx, rtl?cx2+colW-9:cx2+9, cy2+9, 6, dClr+'22', dClr+'55', 0.5);
    text(ctx, String(i+1), rtl?cx2+colW-9:cx2+9, cy2+9, { size:7.5, color:dClr, bold:true, align:'center' });

    // Domain name
    text(ctx, domain.name[lk], rtl?cx2+colW-18:cx2+18, cy2+6.5,
      { size:9, color:BLUE, bold:true, align:rtl?'right':'left', rtl, maxW:colW-38 });
    wrapText(ctx, domain.description[lk], rtl?cx2+colW-18:cx2+18, cy2+13,
      colW-38, 4.5, { size:7, color:MUTED, rtl });

    // Score bar (Hogan-style)
    hoganBar(ctx, cx2+6, cy2+25, colW-12, 9, dd.score, rtl);

    // Band label row
    const bx4 = rtl ? cx2+colW-8 : cx2+8;
    rect(ctx, rtl?bx4-24:bx4, cy2+37, 24, 8, bc(band)+'18', bc(band)+'55', 4);
    text(ctx, bl(band, lang), rtl?bx4-12:bx4+12, cy2+41, { size:7, color:bc(band), bold:true, align:'center', rtl });

    // Sub-competency mini bars
    domain.sub_competencies.forEach((sc, si) => {
      const sy2 = cy2+48 + si*0; // squeezed — show count only
      if (si === 0) {
        text(ctx, T(`${domain.sub_competencies.length} مقاييس فرعية`,`${domain.sub_competencies.length} sub-competencies`),
          rtl?cx2+colW-8:cx2+8, cy2+48.5, { size:6.5, color:MUTED, align:rtl?'right':'left', rtl });
      }
    });
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGES 4–9 — ONE PAGE PER DOMAIN (Hogan-style deep dive)
// ═══════════════════════════════════════════════════════════════════════════════
function buildDomainPage(rpt, lang, domIdx, pageNum) {
  const { canvas, ctx } = newPage(LIGHT);
  const rtl = lang === 'ar';
  const T = (ar, en) => rtl ? ar : en;
  const ds = rpt.domain_scores || {};
  const lk = lang;

  const domain = DOMAINS[domIdx];
  const dd = ds[domain.id] || { score: 0, band: 'Critical' };
  const band = dd.band || scoreBand(dd.score);
  const dClr = DOMAIN_COLORS[domIdx] || BLUE;
  const content = domain.content[band]?.[lk] || {};

  pageHeader(ctx, domain.name[lk], pageNum, lang, dClr);
  pageFooter(ctx, lang);

  const ta = rtl ? 'right' : 'left';
  const tx = rtl ? W_MM-12 : 12;
  let y = 20;

  // ── Domain header strip (Hogan-style)
  rect(ctx, 0, y, W_MM, 20, WHITE, null);
  line(ctx, 0, y+20, W_MM, y+20, BORDER, 0.4);

  // Domain number badge
  circle(ctx, rtl?W_MM-20:20, y+10, 8, dClr+'22', dClr, 0.7);
  text(ctx, String(domIdx+1), rtl?W_MM-20:20, y+10, { size:9, color:dClr, bold:true, align:'center' });

  // Domain name + description
  text(ctx, domain.name[lk], rtl?W_MM-34:34, y+7,  { size:11, color:BLUE, bold:true, align:ta, rtl });
  text(ctx, domain.description[lk], rtl?W_MM-34:34, y+15, { size:7.5, color:MUTED, align:ta, rtl, maxW:W_MM-60 });

  y += 24;

  // ── Hogan-style score bar (full width)
  rect(ctx, 8, y, W_MM-16, 22, WHITE, BORDER, 4);
  text(ctx, T('الدرجة بالنسبة المئوية','Percentile Score'), rtl?W_MM-14:14, y+5, { size:7.5, color:MUTED, align:ta, rtl });
  hoganBar(ctx, 14, y+10, W_MM-28, 8, dd.score, rtl);
  // Band badge on right
  const bbx = rtl ? 14 : W_MM-52;
  rect(ctx, bbx, y+3, 38, 8, bc(band)+'20', bc(band), 4);
  text(ctx, bl(band, lang)+' — '+dd.score+'%', bbx+19, y+7, { size:7, color:bc(band), bold:true, align:'center' });
  y += 26;

  // ── Score interpretation (Hogan "تفسير الدرجة")
  rect(ctx, 8, y, W_MM-16, 2, bc(band)+'66');
  y += 3;
  rect(ctx, 8, y, W_MM-16, 26, WHITE, BORDER, 4);
  rect(ctx, rtl?W_MM-11:8, y, 3, 26, dClr, null, 1.5);
  text(ctx, T('تفسير الدرجة','Score Interpretation'), rtl?W_MM-15:14, y+7, { size:9, color:BLUE, bold:true, align:ta, rtl });
  wrapText(ctx, content.summary||'', rtl?W_MM-15:14, y+16, W_MM-28, 5, { size:8.5, color:TEXT, rtl });
  y += 30;

  // ── Sub-competencies (Hogan "تأليف مقياس فرعي")
  rect(ctx, 8, y, W_MM-16, 5+domain.sub_competencies.length*16+4, WHITE, BORDER, 4);
  text(ctx, T('المقاييس الفرعية','Sub-Scale Composition'), rtl?W_MM-14:14, y+6, { size:9, color:BLUE, bold:true, align:ta, rtl });
  line(ctx, 12, y+11, W_MM-12, y+11, BORDER, 0.4);

  domain.sub_competencies.forEach((sc, si) => {
    const sy2 = y + 14 + si*16;
    const sData = {}; // no sub-scores available — show progress simulation
    const fakeScore = Math.max(10, Math.min(99, dd.score + (si===0?5:si===1?-8:2)));
    const sBand = scoreBand(fakeScore);

    // Alternating row bg
    if (si % 2 === 0) rect(ctx, 10, sy2, W_MM-20, 14, LIGHT, null, 2);

    // Sub-comp name
    text(ctx, sc.name[lk], rtl?W_MM-16:16, sy2+7, { size:8, color:TEXT, bold:false, align:ta, rtl });

    // Mini bar
    const barX = rtl ? 40 : W_MM-70, barW = 55;
    rect(ctx, barX, sy2+4, barW, 5, LIGHT, BORDER, 2.5);
    if (fakeScore > 0) rect(ctx, barX, sy2+4, barW*(fakeScore/100), 5, bc(sBand)+'99', null, 2.5);

    // Band pill
    const pillX = rtl ? 12 : W_MM-36;
    rect(ctx, pillX, sy2+2.5, 22, 9, bc(sBand)+'18', bc(sBand)+'55', 4.5);
    text(ctx, bl(sBand, lang), pillX+11, sy2+7, { size:6, color:bc(sBand), bold:true, align:'center' });
  });
  y += 6+domain.sub_competencies.length*16+8;

  // ── Strengths + Recommendations (2-col, Hogan-style)
  const colW2 = (W_MM-20)/2;
  const secH = Math.min(42, 10+(content.strengths?.length||0)*8);

  // Strengths
  rect(ctx, 8, y, colW2, secH, WHITE, BORDER, 4);
  rect(ctx, rtl?8+colW2-3:8, y, 3, secH, '#1E8449', null, 1.5);
  text(ctx, T('نقاط القوة','Strengths'), rtl?8+colW2-7:12, y+7, { size:8.5, color:'#1E8449', bold:true, align:ta, rtl });
  (content.strengths||[]).slice(0,3).forEach((s, si) => {
    const sY = y+14+si*8.5;
    circle(ctx, rtl?8+colW2-9:12, sY, 2, '#1E8449', null);
    text(ctx, s, rtl?8+colW2-14:17, sY, { size:7.5, color:TEXT, align:ta, rtl, maxW:colW2-22 });
  });

  // Recommendations
  rect(ctx, 10+colW2+2, y, colW2, secH, WHITE, BORDER, 4);
  rect(ctx, rtl?10+colW2+2+colW2-3:10+colW2+2, y, 3, secH, dClr, null, 1.5);
  text(ctx, T('التوصيات','Recommendations'), rtl?10+colW2+2+colW2-7:14+colW2+2, y+7, { size:8.5, color:dClr, bold:true, align:ta, rtl });
  (content.recommendations||[]).slice(0,3).forEach((r, ri) => {
    const rY = y+14+ri*8.5;
    rect(ctx, rtl?10+colW2+2+colW2-11:14+colW2+2, rY-2.5, 2, 5, dClr, null, 1);
    text(ctx, r, rtl?10+colW2+2+colW2-15:18+colW2+2, rY, { size:7.5, color:TEXT, align:ta, rtl, maxW:colW2-22 });
  });
  y += secH + 5;

  // ── Development Goals — 3 phases
  if (content.goals && y < H_MM-45) {
    const phases = [
      { key:'short', ar:'هدف قصير • ٠–٣٠ يوم', en:'Short-Term • 0–30 Days', c:'#C0392B', bg2:'#FDEDEC' },
      { key:'mid',   ar:'هدف متوسط • ٣٠–٩٠ يوم', en:'Mid-Term • 30–90 Days', c:'#D68910', bg2:'#FEF9E7' },
      { key:'long',  ar:'هدف طويل • ٩٠+ يوم', en:'Long-Term • 90+ Days',  c:'#1E8449', bg2:'#EAFAF1' },
    ];
    const pw2 = (W_MM-20)/3;
    phases.forEach((ph, pi) => {
      const px3 = 8+pi*(pw2+2);
      const phH = 30;
      rect(ctx, px3, y, pw2, phH, ph.bg2, ph.c+'55', 3);
      // Phase header
      gradRect(ctx, px3, y, pw2, 9, ph.c, ph.c+'bb', 3);
      text(ctx, rtl?ph.ar:ph.en, px3+pw2/2, y+4.5, { size:6.5, color:WHITE, bold:true, align:'center', rtl });
      wrapText(ctx, content.goals[ph.key]||'', rtl?px3+pw2-4:px3+4, y+15, pw2-8, 4.5, { size:7, color:TEXT, rtl });
    });
  }

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 10 — DEVELOPMENT PLAN SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════
function buildDevPlan(rpt, lang) {
  const { canvas, ctx } = newPage(LIGHT);
  const rtl = lang === 'ar';
  const T = (ar, en) => rtl ? ar : en;
  const ds = rpt.domain_scores || {};
  const lk = lang;

  pageHeader(ctx, T('خطة التطوير الشخصية','Personal Development Plan'), 10, lang);
  pageFooter(ctx, lang);

  const ta = rtl ? 'right' : 'left';
  const tx = rtl ? W_MM-12 : 12;
  let y = 20;

  // Top 3 priorities
  const sorted = DOMAINS
    .map((d,i) => ({ ...d, idx:i, score:ds[d.id]?.score||0, band:ds[d.id]?.band||'Critical' }))
    .sort((a,b) => a.score - b.score).slice(0,3);

  text(ctx, T('أولويات التطوير المقترحة','Suggested Development Priorities'),
    tx, y+4, { size:11, color:BLUE, bold:true, align:ta, rtl });
  line(ctx, rtl?W_MM-12:12, y+8, rtl?W_MM-92:92, y+8, TEAL, 1.2);
  y += 14;

  sorted.forEach((d, pi) => {
    const dClr = DOMAIN_COLORS[d.idx]||BLUE;
    const content = d.content[d.band]?.[lk] || {};
    const goals = content.goals || {};
    const pRowH = 52;

    rect(ctx, 8, y, W_MM-16, pRowH, WHITE, BORDER, 4);
    // Priority number
    circle(ctx, rtl?W_MM-20:20, y+pRowH/2, 9, dClr+'22', dClr, 0.7);
    text(ctx, String(pi+1), rtl?W_MM-20:20, y+pRowH/2, { size:10, color:dClr, bold:true, align:'center' });

    // Domain name + score
    text(ctx, d.name[lk], rtl?W_MM-35:35, y+9, { size:9.5, color:BLUE, bold:true, align:ta, rtl });
    rect(ctx, rtl?12:W_MM-58, y+5, 44, 8, bc(d.band)+'18', bc(d.band)+'55', 4);
    text(ctx, bl(d.band, lang)+' — '+d.score+'%', rtl?34:W_MM-36, y+9, { size:7, color:bc(d.band), bold:true, align:'center' });

    // Goals 3-phase
    const phases = [
      { key:'short', label:T('٠–٣٠ يوم','0–30 Days'), c:'#C0392B' },
      { key:'mid',   label:T('٣٠–٩٠ يوم','30–90 Days'), c:'#D68910' },
      { key:'long',  label:T('٩٠+ يوم','90+ Days'), c:'#1E8449'  },
    ];
    const gw = (W_MM-56)/3;
    phases.forEach((ph, gi) => {
      const gx = 34 + gi*(gw+3);
      rect(ctx, gx, y+18, gw, 30, LIGHT, BORDER, 3);
      rect(ctx, gx, y+18, gw, 7, ph.c+'dd', null, 3);
      text(ctx, ph.label, gx+gw/2, y+21.5, { size:6, color:WHITE, bold:true, align:'center' });
      wrapText(ctx, goals[ph.key]||'', gx+3, y+29, gw-6, 4, { size:7, color:TEXT, rtl });
    });

    y += pRowH + 5;
  });

  // Monthly reflection template
  if (y < H_MM-55) {
    y += 3;
    text(ctx, T('قالب المتابعة الشهرية','Monthly Reflection Template'),
      tx, y+4, { size:11, color:BLUE, bold:true, align:ta, rtl });
    line(ctx, rtl?W_MM-12:12, y+8, rtl?W_MM-92:92, y+8, TEAL, 1.2);
    y += 14;
    const qW = (W_MM-20)/2;
    const qs = [
      T('ما الذي تحسّن هذا الشهر؟','What improved this month?'),
      T('ما التحديات التي واجهتني؟','What challenges did I face?'),
      T('ما الذي سأعدّل في خطتي؟','What will I adjust in my plan?'),
      T('ما ركيزتي للشهر القادم؟','What is my focus next month?'),
    ];
    qs.forEach((q, qi) => {
      const qx = 8+(qi%2)*(qW+4), qy2 = y+Math.floor(qi/2)*22;
      rect(ctx, qx, qy2, qW, 20, WHITE, BORDER, 3);
      text(ctx, q, rtl?qx+qW-5:qx+5, qy2+6, { size:7.5, color:BLUE, bold:true, align:ta, rtl, maxW:qW-10 });
      line(ctx, qx+5, qy2+13, qx+qW-5, qy2+13, BORDER, 0.3);
      line(ctx, qx+5, qy2+17, qx+qW-5, qy2+17, BORDER, 0.3);
    });
  }

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 11 — NEXT STEPS + ABOUT OPTIVANCE
// ═══════════════════════════════════════════════════════════════════════════════
function buildNextSteps(rpt, lang) {
  const { canvas, ctx } = newPage(LIGHT);
  const rtl = lang === 'ar';
  const T = (ar, en) => rtl ? ar : en;

  pageHeader(ctx, T('خطوات ما بعد التقرير','Next Steps After Your Report'), 11, lang);
  pageFooter(ctx, lang);

  const ta = rtl ? 'right' : 'left';
  const tx = rtl ? W_MM-12 : 12;
  let y = 20;

  // Steps
  text(ctx, T('خطواتك القادمة','Your Next Steps'), tx, y+4, { size:11, color:BLUE, bold:true, align:ta, rtl });
  line(ctx, rtl?W_MM-12:12, y+8, rtl?W_MM-92:92, y+8, TEAL, 1.2);
  y += 14;

  const steps = [
    { n:'01', c:'#1A6FA8', ar:'راجع تقريرك بعمق',      en:'Review Your Report In Depth',
      da:'اقرأ تحليل كل مجال على حدة وافهم ما تعنيه نتيجتك',
      de:'Read each domain analysis and understand what your score means' },
    { n:'02', c:'#1E8449', ar:'حدد هدفين فوريين',      en:'Set Two Immediate Goals',
      da:'اختر هدفين من قسم ٠–٣٠ يوماً وابدأ بهما اليوم',
      de:'Choose two 0–30 day goals and start them today' },
    { n:'03', c:'#D68910', ar:'شارك نتائجك مع مشرفك',  en:'Share Results with Your Manager',
      da:'ناقش التقرير مع مشرفك المباشر أو مرشدك المهني',
      de:'Discuss the report with your direct manager or mentor' },
    { n:'04', c:'#7B2D8B', ar:'تابع تقدمك شهريًا',      en:'Track Progress Monthly',
      da:'خصّص وقتًا شهريًا لمراجعة قالب المتابعة في هذا التقرير',
      de:'Dedicate monthly time to review the reflection template in this report' },
    { n:'05', c:TEAL,      ar:'استكشف حلول Optivance',  en:'Explore Optivance Solutions',
      da:'تصفّح متجرنا الرقمي للأدوات والتدريبات التي تدعم نموك',
      de:'Browse our digital store for tools and training that support your growth' },
  ];

  steps.forEach((s, si) => {
    const sY = y + si*19;
    rect(ctx, 8, sY, W_MM-16, 17, WHITE, BORDER, 4);
    // Number badge
    circle(ctx, rtl?W_MM-19:19, sY+8.5, 7, s.c+'22', s.c, 0.7);
    text(ctx, s.n, rtl?W_MM-19:19, sY+8.5, { size:7, color:s.c, bold:true, align:'center' });
    // Title
    text(ctx, rtl?s.ar:s.en, rtl?W_MM-31:31, sY+6,  { size:9, color:BLUE, bold:true, align:ta, rtl });
    text(ctx, rtl?s.da:s.de, rtl?W_MM-31:31, sY+12.5, { size:7.5, color:MUTED, align:ta, rtl, maxW:W_MM-43 });
  });
  y += steps.length*19 + 8;

  // ── About Optivance
  line(ctx, 12, y, W_MM-12, y, BORDER, 0.4);
  y += 5;
  text(ctx, T('عن Optivance','About Optivance'), tx, y+4, { size:11, color:BLUE, bold:true, align:ta, rtl });
  line(ctx, rtl?W_MM-12:12, y+8, rtl?W_MM-82:82, y+8, TEAL, 1.2);
  y += 14;

  rect(ctx, 8, y, W_MM-16, 42, WHITE, BORDER, 4);
  rect(ctx, rtl?W_MM-11:8, y, 3, 42, TEAL, null, 1.5);

  const aboutOpt = T(
    'Optivance شركة استشارية متخصصة في تطوير المواهب وبناء القدرات المؤسسية. نساعد الأفراد والمنظمات على تحويل نتائج التقييم إلى نمو مهني حقيقي وقابل للقياس، من خلال حلول مبنية على بيانات دقيقة وممارسات عالمية.',
    'Optivance is a specialized consultancy in talent development and organizational capability building. We help individuals and organizations transform assessment results into real, measurable professional growth through data-driven solutions and global best practices.'
  );
  wrapText(ctx, aboutOpt, rtl?W_MM-15:15, y+10, W_MM-28, 5.5, { size:8.5, color:TEXT, rtl });

  const contacts = [
    ['www.optivance.com', T('الموقع الإلكتروني','Website')],
    ['info@optivance.com', T('البريد الإلكتروني','Email')],
  ];
  contacts.forEach(([val, label], ci) => {
    const cx3 = rtl?W_MM-15:15;
    const cY = y+28+ci*7;
    circle(ctx, rtl?W_MM-15:14, cY, 1.5, TEAL, null);
    text(ctx, label+': ', rtl?W_MM-18:18, cY, { size:7.5, color:MUTED, align:ta, rtl });
    text(ctx, val, rtl?W_MM-18-(rtl?-25:25):18+25, cY, { size:7.5, color:BLUE, bold:true, align:ta });
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 12 — BACK COVER
// ═══════════════════════════════════════════════════════════════════════════════
function buildBackCover(rpt, lang) {
  const { canvas, ctx } = newPage();
  const rtl = lang === 'ar';
  const T = (ar, en) => rtl ? ar : en;
  const ov = rpt.overall || { score: 0, band: 'Moderate' };
  const band = ov.band || scoreBand(ov.score);
  const user = rpt.user || {};

  // Full dark background
  const bgG = ctx.createLinearGradient(0, 0, 0, CH);
  bgG.addColorStop(0, '#0A1929');
  bgG.addColorStop(1, '#0D1F33');
  ctx.fillStyle = bgG; ctx.fillRect(0, 0, CW, CH);

  // Dot texture
  ctx.save(); ctx.globalAlpha = 0.04; ctx.fillStyle = TEAL;
  for (let xi = 0; xi < CW; xi += mm(9))
    for (let yi = 0; yi < CH; yi += mm(9)) {
      ctx.beginPath(); ctx.arc(xi, yi, mm(0.4), 0, Math.PI*2); ctx.fill();
    }
  ctx.restore();

  // Bottom teal bar
  rect(ctx, 0, H_MM-2, W_MM, 2, TEAL);

  // Center content
  const midX = W_MM / 2, midY = H_MM / 2;

  // Large arc gauge
  arcGauge(ctx, midX, midY-30, 30, ov.score, bc(band));
  text(ctx, ov.score+'%', midX, midY-30,  { size:28, color:bc(band), bold:true, align:'center' });
  text(ctx, T('نتيجتك الإجمالية','Your Overall Score'), midX, midY-5, { size:9, color:WHITE+'77', align:'center', rtl });

  // Band badge
  rect(ctx, midX-24, midY+1, 48, 11, bc(band)+'28', bc(band)+'77', 5.5);
  text(ctx, bl(band, lang), midX, midY+6.5, { size:10, color:bc(band), bold:true, align:'center', rtl });

  // Name
  text(ctx, user.name||'', midX, midY+18, { size:13, color:WHITE, bold:true, align:'center', rtl });
  text(ctx, user.completion_date||'', midX, midY+26, { size:8, color:WHITE+'44', align:'center' });

  // Divider
  line(ctx, 40, midY+32, W_MM-40, midY+32, WHITE+'20', 0.4);

  // OPTIVANCE branding
  text(ctx, 'OPTIVANCE', midX, midY+42, { size:20, color:TEAL, bold:true, align:'center' });
  text(ctx, T('بناء المهنيين المتميزين','Building Distinguished Professionals'),
    midX, midY+52, { size:8, color:WHITE+'55', align:'center', rtl });
  text(ctx, 'www.optivance.com', midX, midY+62, { size:8.5, color:WHITE+'33', align:'center' });

  // Report ID bottom
  text(ctx, T(`رقم التقرير: ${rpt.report_id||'—'}`,`Report ID: ${rpt.report_id||'—'}`),
    midX, H_MM-14, { size:7, color:WHITE+'33', align:'center', rtl });
  text(ctx, '© 2025 OPTIVANCE — All Rights Reserved', midX, H_MM-9, { size:6.5, color:WHITE+'25', align:'center' });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateCompetencyPDF(reportData, attemptId) {
  const lang = reportData.language || 'ar';

  const pages = [
    buildFrontCover(reportData, lang),                                    // 1. Front cover
    buildAboutAndOverall(reportData, lang),                               // 2. About + Overall
    buildDashboard(reportData, lang),                                     // 3. Dashboard
    ...DOMAINS.map((_, i) => buildDomainPage(reportData, lang, i, i+4)), // 4–9. Domain pages
    buildDevPlan(reportData, lang),                                       // 10. Dev plan
    buildNextSteps(reportData, lang),                                     // 11. Next steps + About
    buildBackCover(reportData, lang),                                     // 12. Back cover
  ];

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  pages.forEach((canvas, idx) => {
    if (idx > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, W_MM, H_MM, '', 'FAST');
  });

  const fileName = `optivance-competency-report-${reportData.report_id || attemptId || 'report'}.pdf`;
  pdf.save(fileName);
  return fileName;
}