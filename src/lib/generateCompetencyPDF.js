/**
 * generateCompetencyPDF
 * Premium McKinsey-style bilingual PDF report engine
 * Canvas-based, 3× resolution, RTL/LTR aware
 */
import jsPDF from 'jspdf';
import { DOMAINS, BAND_CONFIG, OVERALL_SUMMARIES, LEVEL_LABELS } from './competencyContent';

// ── Brand ────────────────────────────────────────────────────────────────────
const B = {
  navy:    '#0D2137',
  primary: '#1A3A5C',
  mid:     '#2A5280',
  accent:  '#05E1AE',
  teal:    '#04C49A',
  ice:     '#E8FBF7',
  white:   '#FFFFFF',
  s50:     '#F8FAFC',
  s100:    '#F1F5F9',
  s200:    '#E2E8F0',
  s300:    '#CBD5E1',
  s400:    '#94A3B8',
  s500:    '#64748B',
  s600:    '#475569',
  s700:    '#334155',
  strong:    '#05E1AE',
  proficient:'#2E9DB8',
  moderate:  '#F59E0B',
  critical:  '#EF4444',
};
const BAND_CLR = { Strong: B.strong, Proficient: B.proficient, Moderate: B.moderate, Critical: B.critical };
const bc  = (band) => BAND_CLR[band] || B.s500;
const bl  = (band, lang) => BAND_CONFIG[band]?.label?.[lang] || band;

// ── Canvas dimensions (A4 @ 3× 96dpi) ────────────────────────────────────────
const W = 210, H = 297;           // mm
const SC = 3;                      // scale factor
const R  = 3.7795 * SC;           // 1 mm → canvas px

const px = (mm)  => Math.round(mm * R);
const cW = px(W);
const cH = px(H);

// ── Page factory ─────────────────────────────────────────────────────────────
function mkPage() {
  const canvas    = document.createElement('canvas');
  canvas.width    = cW;
  canvas.height   = cH;
  const ctx       = canvas.getContext('2d');
  ctx.fillStyle   = B.white;
  ctx.fillRect(0, 0, cW, cH);
  return { canvas, ctx };
}

// ── Drawing helpers ───────────────────────────────────────────────────────────
function fillRect(ctx, x, y, w, h, color) {
  ctx.save(); ctx.fillStyle = color;
  ctx.fillRect(px(x), px(y), px(w), px(h));
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, fill, stroke, r = 0, sw = 0.4) {
  ctx.save();
  const [X,Y,W2,H2,R2] = [px(x),px(y),px(w),px(h),px(r)];
  ctx.beginPath();
  if (R2) {
    ctx.moveTo(X+R2,Y); ctx.lineTo(X+W2-R2,Y);
    ctx.quadraticCurveTo(X+W2,Y,X+W2,Y+R2);
    ctx.lineTo(X+W2,Y+H2-R2);
    ctx.quadraticCurveTo(X+W2,Y+H2,X+W2-R2,Y+H2);
    ctx.lineTo(X+R2,Y+H2);
    ctx.quadraticCurveTo(X,Y+H2,X,Y+H2-R2);
    ctx.lineTo(X,Y+R2);
    ctx.quadraticCurveTo(X,Y,X+R2,Y);
    ctx.closePath();
  } else { ctx.rect(X,Y,W2,H2); }
  if (fill)   { ctx.fillStyle   = fill;         ctx.fill();   }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = px(sw); ctx.stroke(); }
  ctx.restore();
}

function linGrad(ctx, x, y, w, h, c1, c2, dir = 'h') {
  const g = dir === 'h'
    ? ctx.createLinearGradient(px(x), px(y), px(x+w), px(y))
    : ctx.createLinearGradient(px(x), px(y), px(x), px(y+h));
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

function gradRect(ctx, x, y, w, h, c1, c2, dir = 'h', r = 0) {
  const g = linGrad(ctx, x, y, w, h, c1, c2, dir);
  roundRect(ctx, x, y, w, h, g, null, r);
}

function circle(ctx, cx, cy, r, fill, stroke, sw = 0.5) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(px(cx), px(cy), px(r), 0, Math.PI*2);
  if (fill)   { ctx.fillStyle   = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = px(sw); ctx.stroke(); }
  ctx.restore();
}

function progressArc(ctx, cx, cy, r, pct, trackClr, fgClr, sw = 4) {
  const [X,Y,R2,LW] = [px(cx),px(cy),px(r),px(sw)];
  // track
  ctx.save(); ctx.beginPath(); ctx.arc(X,Y,R2,0,Math.PI*2);
  ctx.strokeStyle = trackClr; ctx.lineWidth = LW; ctx.stroke(); ctx.restore();
  if (pct <= 0) return;
  const end = -Math.PI/2 + (pct/100) * Math.PI*2;
  ctx.save(); ctx.beginPath(); ctx.arc(X,Y,R2,-Math.PI/2,end);
  ctx.strokeStyle = fgClr; ctx.lineWidth = LW; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}

function bar(ctx, x, y, w, h, pct, fg, bg = B.s100, r = 1) {
  roundRect(ctx, x, y, w, h, bg, null, r);
  if (pct > 0) {
    const fw = Math.max(w * pct / 100, r*2);
    roundRect(ctx, x, y, fw, h, fg, null, r);
  }
}

function gBar(ctx, x, y, w, h, pct, c1, c2, bg = B.s100, r = 1) {
  roundRect(ctx, x, y, w, h, bg, null, r);
  if (pct > 0) {
    const fw = Math.max(w * pct / 100, r*2);
    gradRect(ctx, x, y, fw, h, c1, c2, 'h', r);
  }
}

function hline(ctx, x1, y, x2, color, w = 0.3) {
  ctx.save(); ctx.beginPath();
  ctx.moveTo(px(x1), px(y)); ctx.lineTo(px(x2), px(y));
  ctx.strokeStyle = color; ctx.lineWidth = px(w); ctx.stroke(); ctx.restore();
}

function dots(ctx, alpha = 0.03) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = B.accent;
  for (let xi=0; xi<cW; xi+=px(7)) for (let yi=0; yi<cH; yi+=px(7)) {
    ctx.beginPath(); ctx.arc(xi,yi,px(0.5),0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

// ── Text helpers ──────────────────────────────────────────────────────────────
function setFont(ctx, size, weight = 'normal') {
  const fs = Math.round(size * R * 0.37);
  ctx.font = `${weight === 'bold' ? '700' : weight === 'semibold' ? '600' : '400'} ${fs}px Arial, sans-serif`;
}

function txt(ctx, text, x, y, {
  size = 9, color = B.s700, weight = 'normal',
  align = 'left', isRTL = false, maxW
} = {}) {
  ctx.save();
  setFont(ctx, size, weight);
  ctx.fillStyle    = color;
  ctx.textAlign    = align;
  ctx.direction    = isRTL ? 'rtl' : 'ltr';
  ctx.textBaseline = 'middle';
  const args = [String(text), px(x), px(y)];
  if (maxW) args.push(px(maxW));
  ctx.fillText(...args);
  ctx.restore();
}

function wrap(ctx, text, x, y, maxW, lineH, opts = {}) {
  const { size = 8.5, color = B.s600, weight = 'normal', isRTL = false } = opts;
  ctx.save();
  setFont(ctx, size, weight);
  ctx.fillStyle    = color;
  ctx.textBaseline = 'middle';
  ctx.direction    = isRTL ? 'rtl' : 'ltr';
  const words  = String(text).split(' ');
  const maxPx2 = px(maxW);
  let line = '', curY = px(y);
  const lhPx = px(lineH);
  words.forEach((word, i) => {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxPx2 && i > 0) {
      ctx.fillText(line, px(x), curY);
      line  = word; curY += lhPx;
    } else { line = test; }
  });
  if (line) ctx.fillText(line, px(x), curY);
  ctx.restore();
  return ((curY - px(y)) / lhPx + 1) * lineH;
}

// ── Shared header/footer ──────────────────────────────────────────────────────
function header(ctx, title, pageNum, lang) {
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  // gradient bar
  gradRect(ctx, 0, 0, W, 16, B.navy, B.primary, 'h');
  // teal bottom line
  fillRect(ctx, 0, 16, W, 1.2, B.accent);
  // brand
  roundRect(ctx, isRTL ? W-41 : 6, 3.5, 35, 9, B.accent+'25', B.accent+'70', 4.5);
  txt(ctx,'OPTIVANCE', isRTL ? W-23.5 : 23.5, 8, {size:7.5,color:B.accent,weight:'bold',align:'center',isRTL});
  // title
  txt(ctx, title, isRTL ? W-44 : 44, 8, {size:10,color:B.white,weight:'bold',align:isRTL?'right':'left',isRTL});
  // page badge
  const bx = isRTL ? 5 : W-23;
  roundRect(ctx, bx, 3.5, 18, 9, B.accent, null, 4.5);
  txt(ctx, `${pageNum}/10`, bx+9, 8, {size:7,color:B.navy,weight:'bold',align:'center',isRTL:false});
}

function footer(ctx, lang) {
  fillRect(ctx, 0, H-6.5, W, 6.5, B.navy);
  hline(ctx, 0, H-6.5, W, B.accent+'44', 0.4);
  txt(ctx,'OPTIVANCE  •  www.optivance.com  •  info@optivance.com  •  © 2025',
    W/2, H-3.2, {size:5.8,color:B.white+'55',align:'center'});
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 1 — COVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildCover(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const user  = rpt.user || {};
  const ov    = rpt.overall || { score:0, band:'Moderate' };
  const bClr  = bc(ov.band);
  const lbl   = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '—';

  // ── Background ─────────────────────────────────────────────────────────────
  // top half dark navy, bottom slightly lighter
  gradRect(ctx, 0, 0, W, H, B.navy, '#112233', 'v');
  dots(ctx, 0.038);

  // right geometric accent strip
  gradRect(ctx, W-55, 0, 55, H, B.primary+'44', B.accent+'08', 'v');
  hline(ctx, W-55, 0, W-55, H, B.accent+'22', 0.4);

  // top teal bar
  gradRect(ctx, 0, 0, W, 2.5, B.accent, B.teal, 'h');

  // ── Logo area ──────────────────────────────────────────────────────────────
  const logoX = isRTL ? W-50 : 10;
  roundRect(ctx, logoX, 12, 40, 12, B.accent+'22', B.accent+'66', 6);
  txt(ctx,'OPTIVANCE', logoX+20, 18, {size:9,color:B.accent,weight:'bold',align:'center',isRTL});

  // report type tag
  const tagX = isRTL ? W-10-88 : 10;
  roundRect(ctx, tagX, 30, 88, 8, B.white+'12', B.white+'30', 4);
  txt(ctx, t('تقرير الكفاءات والنمو المهني','Professional Competency Report'),
    tagX+44, 34, {size:7,color:B.white+'bb',align:'center',isRTL});

  // ── Hero titles ────────────────────────────────────────────────────────────
  const tx = isRTL ? W-10 : 10;
  const ta = isRTL ? 'right' : 'left';
  txt(ctx, t('تقرير الجدارات','Competency'), tx, 55, {size:28,color:B.white,weight:'bold',align:ta,isRTL});
  txt(ctx, t('والنمو المهني','Growth Report'), tx, 73, {size:28,color:B.accent,weight:'bold',align:ta,isRTL});

  // tagline
  wrap(ctx,
    t('تقييم علمي معمّق يقيس جداراتك في ٦ مجالات رئيسية وعشرين كفاءة أساسية',
      'A science-backed assessment measuring your competencies across 6 key domains and 20 core competencies'),
    isRTL ? W-10 : 10, 86, isRTL ? W-65 : W-65, 5.5, {size:8,color:B.white+'77',isRTL});

  // divider
  gradRect(ctx, 10, 98, W-20, 0.8, B.accent+'77', B.mid+'33', 'h');

  // ── Score circle (right side) ──────────────────────────────────────────────
  const circX = isRTL ? 35 : W-37;
  const circY = 65;
  circle(ctx, circX, circY, 22, B.white+'06');
  circle(ctx, circX, circY, 19, null, B.white+'15', 0.5);
  progressArc(ctx, circX, circY, 16, ov.score, B.white+'15', bClr, 4.5);
  txt(ctx, ov.score+'%', circX, circY-1, {size:17,color:B.white,weight:'bold',align:'center',isRTL:false});
  txt(ctx, t('النتيجة','Score'), circX, circY+7, {size:6.5,color:B.white+'66',align:'center',isRTL:false});
  roundRect(ctx, circX-14, circY+13, 28, 8, bClr+'33', bClr, 4);
  txt(ctx, bl(ov.band,lang), circX, circY+17, {size:7,color:bClr,weight:'bold',align:'center',isRTL:false});

  // ── Profile info grid ──────────────────────────────────────────────────────
  const fields = [
    [t('الاسم الكامل','Full Name'),          user.name||'—'],
    [t('المستوى المهني','Professional Level'), lbl],
    [t('نسخة المقياس','Assessment Version'),  rpt.version==='full'?t('الكاملة','Full'):t('السريعة','Quick')],
    [t('تاريخ الإكمال','Completion Date'),   user.completion_date||'—'],
    [t('رقم التقرير','Report ID'),           rpt.report_id||'—'],
    [t('اللغة','Language'),                  lang==='ar'?'العربية':'English'],
  ];
  const cw2 = (W-24)/2;
  fields.forEach(([lbl2, val], i) => {
    const col = i%2;
    const row = Math.floor(i/2);
    const fx  = 8 + col*(cw2+4);
    const fy  = 103 + row*22;
    roundRect(ctx, fx, fy, cw2, 19, B.white+'0d', B.white+'1d', 3);
    txt(ctx, lbl2, isRTL?fx+cw2-5:fx+5, fy+6.5, {size:6.5,color:B.accent+'cc',align:isRTL?'right':'left',isRTL});
    txt(ctx, val,  isRTL?fx+cw2-5:fx+5, fy+13.5,{size:8.5,color:B.white+'dd',weight:'bold',align:isRTL?'right':'left',isRTL,maxW:cw2-10});
  });

  // ── Bottom strip ───────────────────────────────────────────────────────────
  gradRect(ctx, 0, H-40, W, 40, B.navy, B.navy+'ee', 'v');
  hline(ctx, 10, H-38, W-10, B.accent+'22', 0.4);

  // 3 stat pills
  const pills = [
    t('٢٠ جدارة أساسية','20 Core Competencies'),
    t('٦ مجالات رئيسية','6 Key Domains'),
    t('تقرير فوري PDF','Instant PDF Report'),
  ];
  const pw2 = (W-28)/3;
  pills.forEach((s,i) => {
    const px2 = 8+i*(pw2+4);
    roundRect(ctx, px2, H-34, pw2, 10, B.white+'0a', B.white+'20', 5);
    txt(ctx, s, px2+pw2/2, H-29, {size:6.5,color:B.white+'bb',align:'center',isRTL});
  });

  txt(ctx,
    t('بناء المهنيين المتميزين عبر التقييم الدقيق والتطوير المستهدف',
      'Building distinguished professionals through precise assessment and targeted development'),
    W/2, H-17, {size:7.5,color:B.white+'44',align:'center',isRTL});
  txt(ctx,'www.optivance.com  •  © 2025 OPTIVANCE',
    W/2, H-10, {size:6.5,color:B.accent+'55',align:'center',isRTL:false});

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 2 — PROFILE + REPORT INDEX
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildProfile(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const user  = rpt.user || {};
  const lbl   = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '—';

  header(ctx, t('ملف المستخدم وملخص التقرير','User Profile & Report Summary'), 2, lang);
  footer(ctx, lang);

  let y = 22;

  // Profile cards grid
  const cards = [
    {label:t('الاسم الكامل','Full Name'),         val:user.name||'—'},
    {label:t('الاسم المفضل','Preferred Name'),    val:user.preferred_name||user.name?.split(' ')[0]||'—'},
    {label:t('المستوى المهني','Professional Level'),val:lbl},
    {label:t('المسمى الوظيفي','Job Title'),       val:user.role||'—'},
    {label:t('تاريخ الإكمال','Completion Date'),  val:user.completion_date||'—'},
    {label:t('رقم التقرير','Report ID'),          val:rpt.report_id||'—'},
  ];
  const cw2 = (W-24)/2;
  cards.forEach((c,i) => {
    const col = i%2, row = Math.floor(i/2);
    const fx  = 8+col*(cw2+4), fy = y+row*22;
    roundRect(ctx, fx, fy, cw2, 19, B.s50, B.s200, 3);
    // side accent
    roundRect(ctx, isRTL?fx+cw2-3:fx, fy, 3, 19, B.primary+'bb', null, 1.5);
    txt(ctx, c.label, isRTL?fx+cw2-6:fx+6, fy+6.5, {size:6.5,color:B.s400,align:isRTL?'right':'left',isRTL});
    txt(ctx, c.val,   isRTL?fx+cw2-6:fx+6, fy+13.5,{size:8.5,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:cw2-10});
  });
  y += 72;

  // Motivation
  const motiv = user.customMotivation || user.motivation;
  if (motiv) {
    gradRect(ctx, 8, y, W-16, 20, B.primary+'12', B.accent+'0a', 'h', 3);
    roundRect(ctx, isRTL?W-11:8, y, 3, 20, B.accent, null, 1.5);
    txt(ctx, t('دافع التطوير','Motivation'), isRTL?W-14:14, y+6.5, {size:7,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
    wrap(ctx, motiv, isRTL?W-14:14, y+14, W-28, 4.5, {size:8,color:B.s600,isRTL});
    y += 25;
  }
  y += 3;

  // Section index
  txt(ctx, t('محتويات التقرير','Report Contents'), isRTL?W-8:8, y+3, {size:11,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
  y += 9;
  gradRect(ctx, 8, y, W-16, 1, B.accent, B.primary, 'h');
  y += 5;

  const secs = [
    {n:'03', c:B.accent,     ar:'لمحة النتائج العامة',           en:'Overall Results Snapshot'},
    {n:'04', c:B.proficient, ar:'نظرة عامة على الدرجات',         en:'Competency Scores Overview'},
    {n:'05', c:B.accent,     ar:'تحليل نقاط القوة',              en:'Strengths Analysis'},
    {n:'06', c:B.moderate,   ar:'أولويات التطوير',               en:'Development Priorities'},
    {n:'07', c:B.proficient, ar:'التفصيل الكامل للمجالات',       en:'Full Domain Breakdown'},
    {n:'08', c:B.accent,     ar:'خطة التطوير الشخصية',           en:'Personalized Development Plan'},
    {n:'09', c:B.critical,   ar:'الموارد والخطوات القادمة',      en:'Resources & Next Steps'},
  ];

  secs.forEach((s,i) => {
    const sy = y + i*15;
    roundRect(ctx, 8, sy, W-16, 13, i%2===0?B.s50:B.white, B.s200, 2.5);
    circle(ctx, isRTL?W-18:18, sy+6.5, 5, s.c+'30', s.c, 0.5);
    txt(ctx, s.n, isRTL?W-18:18, sy+6.5, {size:6,color:s.c,weight:'bold',align:'center',isRTL:false});
    txt(ctx, lang==='ar'?s.ar:s.en, isRTL?W-27:27, sy+6.5, {size:8.5,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:W-38});
  });

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 3 — OVERALL SNAPSHOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildSnapshot(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const ov    = rpt.overall || {score:0, band:'Moderate'};
  const ds    = rpt.domain_scores || {};
  const bClr  = bc(ov.band);
  const summary = OVERALL_SUMMARIES[ov.band]?.[lang] || '';
  const lk    = lang;

  header(ctx, t('لمحة النتائج العامة','Overall Results Snapshot'), 3, lang);
  footer(ctx, lang);

  // Hero score section
  fillRect(ctx, 0, 17.2, W, 72, B.s50);
  hline(ctx, 0, 89.2, W, B.s200, 0.4);

  // Big arc
  const cX = W/2, cY = 53;
  circle(ctx, cX, cY, 28, B.white, B.s200, 0.5);
  circle(ctx, cX, cY, 22, null, B.s200, 0.4);
  progressArc(ctx, cX, cY, 22, ov.score, B.s200, bClr, 5.5);
  // inner glow ring
  circle(ctx, cX, cY, 17, B.white);
  txt(ctx, ov.score+'%', cX, cY-1, {size:21,color:B.primary,weight:'bold',align:'center',isRTL:false});
  txt(ctx, t('النتيجة الإجمالية','Overall Score'), cX, cY+8, {size:7,color:B.s400,align:'center',isRTL:false});
  roundRect(ctx, cX-18, cY+14, 36, 9, bClr+'22', bClr, 4.5);
  txt(ctx, bl(ov.band, lang), cX, cY+18.5, {size:8,color:bClr,weight:'bold',align:'center',isRTL:false});

  // 3 quick stats
  const stats = [
    {label:t('المجالات الست','Six Domains'), val:'6'},
    {label:t('الكفاءات الأساسية','Competencies'), val:'20'},
    {label:t('نسخة المقياس','Version'), val: rpt.version==='full'?t('كاملة','Full'):t('سريعة','Quick')},
  ];
  const sw = (W-28)/3;
  stats.forEach((s,i) => {
    const sx = 8+i*(sw+4);
    roundRect(ctx, sx, 27, sw, 18, B.white, B.s200, 3);
    txt(ctx, s.val, sx+sw/2, 33, {size:11,color:B.primary,weight:'bold',align:'center',isRTL:false});
    txt(ctx, s.label, sx+sw/2, 40, {size:6.5,color:B.s400,align:'center',isRTL:false});
  });

  let y = 93;

  // Interpretation box
  roundRect(ctx, 8, y, W-16, 28, B.white, B.s200, 3);
  roundRect(ctx, isRTL?W-11:8, y, 3, 28, bClr, null, 1.5);
  txt(ctx, t('تفسير نتيجتك','Your Score Interpretation'), isRTL?W-14:14, y+7, {size:9,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
  wrap(ctx, summary, isRTL?W-14:14, y+16, W-26, 5, {size:8,color:B.s600,isRTL});
  y += 33;

  // Domain bars (all 6)
  const sorted = DOMAINS.map(d => ({...d, score:ds[d.id]?.score||0, band:ds[d.id]?.band||'Critical'}))
    .sort((a,b) => b.score - a.score);

  txt(ctx, t('نتائج المجالات الستة','Six Domain Results'), isRTL?W-8:8, y+3, {size:10,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
  y += 9;

  sorted.forEach((d,i) => {
    const dbc = bc(d.band);
    const ry  = y + i*17;
    const nameW = W - 65;
    // rank dot
    circle(ctx, isRTL?W-17:17, ry+6, 5, i<2?dbc:B.s100, i<2?null:B.s300, 0.4);
    txt(ctx, String(i+1), isRTL?W-17:17, ry+6, {size:6,color:i<2?B.white:B.s500,weight:'bold',align:'center',isRTL:false});
    // name
    txt(ctx, d.name[lk], isRTL?W-26:26, ry+4, {size:8,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:nameW});
    // score
    txt(ctx, d.score+'%', isRTL?26:W-26, ry+4, {size:9,color:dbc,weight:'bold',align:isRTL?'left':'right',isRTL});
    // badge
    const badgeX = isRTL ? 27 : W-53;
    roundRect(ctx, badgeX, ry+8.5, 26, 5.5, dbc+'20', dbc+'60', 2.8);
    txt(ctx, bl(d.band,lang), badgeX+13, ry+11.2, {size:5.5,color:dbc,weight:'bold',align:'center',isRTL:false});
    // bar
    gBar(ctx, 26, ry+10, W-52, 3.5, d.score, dbc, dbc+'55', B.s100, 2);
  });

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 4 — SCORES OVERVIEW (ranked detailed cards)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildScores(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  header(ctx, t('نظرة عامة على درجات الكفاءات','Competency Scores Overview'), 4, lang);
  footer(ctx, lang);

  const sorted = DOMAINS.map(d => ({...d, score:ds[d.id]?.score||0, band:ds[d.id]?.band||'Critical'}))
    .sort((a,b) => b.score-a.score);

  let y = 22;

  sorted.forEach((d,i) => {
    const dbc  = bc(d.band);
    const isTop = i < 2;
    const cardH = 36;

    // card bg
    roundRect(ctx, 8, y, W-16, cardH, isTop?dbc+'0b':B.white, B.s200, 3);
    if (isTop) roundRect(ctx, 8, y, W-16, cardH, null, dbc+'55', 3, 0.5);

    // rank circle
    const rkX = isRTL?W-20:20;
    circle(ctx, rkX, y+18, 9, isTop?dbc:B.s100, isTop?null:B.s300, 0.5);
    txt(ctx, String(i+1), rkX, y+18, {size:9,color:isTop?B.white:B.s500,weight:'bold',align:'center',isRTL:false});

    // name + desc
    const tX = isRTL?W-33:33;
    const tA = isRTL?'right':'left';
    txt(ctx, d.name[lk], tX, y+11, {size:10,color:B.primary,weight:'bold',align:tA,isRTL,maxW:W-72});
    txt(ctx, d.description[lk], tX, y+19, {size:7,color:B.s400,align:tA,isRTL,maxW:W-72});

    // score big
    const sX = isRTL?30:W-30;
    txt(ctx, d.score+'%', sX, y+13, {size:16,color:dbc,weight:'bold',align:isRTL?'left':'right',isRTL});

    // band badge
    const bdX = isRTL?10:W-48;
    roundRect(ctx, bdX, y+22, 38, 7.5, dbc+'22', dbc+'66', 3.8);
    txt(ctx, bl(d.band,lang), bdX+19, y+25.8, {size:7,color:dbc,weight:'bold',align:'center',isRTL:false});

    // bar
    gBar(ctx, 33, y+28.5, W-66, 5, d.score, dbc, dbc+'55', B.s100, 2.5);

    y += cardH + 4;
  });

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 5 — STRENGTHS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildStrengths(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  header(ctx, t('تحليل نقاط القوة','Strengths Analysis'), 5, lang);
  footer(ctx, lang);

  const top = DOMAINS
    .map(d => ({...d, score:ds[d.id]?.score||0, band:ds[d.id]?.band||'Moderate'}))
    .sort((a,b) => b.score-a.score).slice(0,3);

  let y = 22;

  top.forEach((d,i) => {
    const dbc     = bc(d.band);
    const content = d.content[d.band]?.[lk];
    if (!content) return;

    const cardH = 83;
    // card
    roundRect(ctx, 8, y, W-16, cardH, B.white, B.s200, 3.5);

    // gradient header
    gradRect(ctx, 8, y, W-16, 14, dbc, B.primary, 'h', 3.5);
    // overlap fix for bottom of header
    fillRect(ctx, 8, y+11, W-16, 3, dbc+'bb');

    // header text
    txt(ctx, d.name[lk], isRTL?W-14:14, y+7, {size:9.5,color:B.white,weight:'bold',align:isRTL?'right':'left',isRTL});
    txt(ctx, d.score+'%', isRTL?22:W-22, y+7, {size:11,color:B.white+'cc',weight:'bold',align:isRTL?'left':'right',isRTL});

    // summary
    wrap(ctx, content.summary, isRTL?W-14:14, y+21, W-28, 4.5, {size:8,color:B.s600,isRTL});

    // strengths
    txt(ctx, t('نقاط القوة','Strengths'), isRTL?W-14:14, y+38, {size:7.5,color:dbc,weight:'bold',align:isRTL?'right':'left',isRTL});
    (content.strengths||[]).slice(0,2).forEach((s,j) => {
      const sy2 = y+44+j*7;
      circle(ctx, isRTL?W-18:18, sy2, 2.2, dbc, null);
      txt(ctx, s, isRTL?W-22:22, sy2, {size:7.5,color:B.s600,align:isRTL?'right':'left',isRTL,maxW:W-34});
    });

    // divider
    hline(ctx, 14, y+59, W-14, B.s200, 0.4);

    // recommendations
    txt(ctx, t('التوصيات','Recommendations'), isRTL?W-14:14, y+64, {size:7.5,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
    (content.recommendations||[]).slice(0,2).forEach((r,j) => {
      const ry2 = y+70+j*7;
      roundRect(ctx, isRTL?W-14:13, ry2-2.5, 2.5, 5, B.primary, null, 1.2);
      txt(ctx, r, isRTL?W-18:17.5, ry2, {size:7.5,color:B.s600,align:isRTL?'right':'left',isRTL,maxW:W-30});
    });

    y += cardH + 5;
  });

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 6 — DEVELOPMENT PRIORITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildPriorities(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  header(ctx, t('أولويات التطوير','Development Priorities'), 6, lang);
  footer(ctx, lang);

  const priority = DOMAINS
    .map(d => ({...d, score:ds[d.id]?.score||0, band:ds[d.id]?.band||'Critical'}))
    .sort((a,b) => a.score-b.score).slice(0,3);

  let y = 22;

  priority.forEach((d,i) => {
    const dbc     = bc(d.band);
    const content = d.content[d.band]?.[lk];
    if (!content) return;

    const cardH = 85;
    roundRect(ctx, 8, y, W-16, cardH, B.white, dbc+'66', 3.5, 0.5);

    // gradient header (primary → band color)
    gradRect(ctx, 8, y, W-16, 14, B.primary, dbc, 'h', 3.5);
    fillRect(ctx, 8, y+11, W-16, 3, B.primary+'cc');

    // priority badge
    const bdX = isRTL?12:W-40;
    roundRect(ctx, bdX, y+2.5, 28, 9, B.white+'25', B.white+'50', 4.5);
    txt(ctx, t(`أولوية ${i+1}`,`Priority ${i+1}`), bdX+14, y+7, {size:6.5,color:B.white,weight:'bold',align:'center',isRTL:false});

    txt(ctx, d.name[lk], isRTL?W-14:14, y+7, {size:9.5,color:B.white,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:W-55});
    txt(ctx, d.score+'%', isRTL?44:W-44, y+7, {size:11,color:B.white+'cc',weight:'bold',align:isRTL?'left':'right',isRTL});

    // summary
    wrap(ctx, content.summary, isRTL?W-14:14, y+21, W-28, 4.5, {size:8,color:B.s600,isRTL});

    // progress bar with label
    txt(ctx, t('مستوى الأداء الحالي','Current Performance'), isRTL?W-14:14, y+36, {size:6.5,color:B.s400,align:isRTL?'right':'left',isRTL});
    gBar(ctx, 14, y+40, W-28, 5.5, d.score, dbc, dbc+'44', B.s100, 3);
    txt(ctx, d.score+'%', isRTL?14:W-14, y+42.5, {size:6.5,color:dbc,weight:'bold',align:isRTL?'left':'right',isRTL});

    hline(ctx, 14, y+50, W-14, B.s200, 0.4);

    // recs
    txt(ctx, t('التوصيات العملية','Practical Recommendations'), isRTL?W-14:14, y+56, {size:7.5,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
    (content.recommendations||[]).slice(0,3).forEach((r,j) => {
      const ry2 = y+62+j*7;
      circle(ctx, isRTL?W-18:18, ry2, 2.2, dbc+'aa', null);
      txt(ctx, r, isRTL?W-22:22, ry2, {size:7.5,color:B.s600,align:isRTL?'right':'left',isRTL,maxW:W-32});
    });

    y += cardH + 4;
  });

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 7 — FULL DOMAIN BREAKDOWN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildBreakdown(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const subs  = rpt.sub_competency_scores || {};
  const lk    = lang;

  header(ctx, t('التفصيل الكامل للمجالات','Full Domain Breakdown'), 7, lang);
  footer(ctx, lang);

  let y = 22;

  DOMAINS.forEach((d) => {
    if (y > H-20) return;
    const domData = ds[d.id] || {score:0, band:'Critical'};
    const dbc     = bc(domData.band);

    // domain header
    gradRect(ctx, 8, y, W-16, 13, B.primary, dbc+'cc', 'h', 3);
    txt(ctx, d.name[lk], isRTL?W-14:14, y+6.5, {size:9.5,color:B.white,weight:'bold',align:isRTL?'right':'left',isRTL});
    txt(ctx, domData.score+'%', isRTL?22:W-22, y+6.5, {size:11,color:B.accent,weight:'bold',align:isRTL?'left':'right',isRTL});
    roundRect(ctx, isRTL?30:W-60, y+3, 30, 7, dbc+'33', dbc+'77', 3.5);
    txt(ctx, bl(domData.band,lang), isRTL?45:W-45, y+6.5, {size:6.5,color:dbc,weight:'bold',align:'center',isRTL:false});
    y += 15;

    // sub-competencies
    d.sub_competencies.forEach((sc) => {
      if (y > H-20) return;
      const key   = `${d.id}__${sc.id}`;
      const scData = subs[key] || {score:0, band:'Critical'};
      const sbc   = bc(scData.band);

      roundRect(ctx, 8, y, W-16, 15, B.white, B.s200, 2.5);
      // left/right side accent
      roundRect(ctx, isRTL?W-11:8, y, 3, 15, sbc+'aa', null, 1.5);

      txt(ctx, sc.name[lk], isRTL?W-14:14, y+5.5, {size:8,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:W-58});
      txt(ctx, scData.score+'%', isRTL?30:W-30, y+5.5, {size:9,color:sbc,weight:'bold',align:isRTL?'left':'right',isRTL});

      // small band badge
      const bdX = isRTL?40:W-62;
      roundRect(ctx, bdX, y+1.5, 22, 6, sbc+'1a', sbc+'55', 3);
      txt(ctx, bl(scData.band,lang), bdX+11, y+4.5, {size:5.5,color:sbc,weight:'bold',align:'center',isRTL:false});

      gBar(ctx, 14, y+11, W-28, 3, scData.score, sbc, sbc+'44', B.s100, 1.5);
      y += 17;
    });
    y += 5;
  });

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 8 — DEVELOPMENT PLAN (timeline)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildDevPlan(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  header(ctx, t('خطة التطوير الشخصية','Personalized Development Plan'), 8, lang);
  footer(ctx, lang);

  const priority = DOMAINS
    .map(d => ({...d, score:ds[d.id]?.score||0, band:ds[d.id]?.band||'Critical'}))
    .sort((a,b) => a.score-b.score).slice(0,3);

  const phases = [
    {key:'short', c1:B.critical,   c2:'#ff6b6b', ar:'٠ – ٣٠ يوم',    en:'0 – 30 Days',   desc:{ar:'البداية الفورية',  en:'Immediate Start'}},
    {key:'mid',   c1:B.moderate,   c2:'#fbbf24', ar:'٣٠ – ٩٠ يوم',   en:'30 – 90 Days',  desc:{ar:'بناء المهارة',    en:'Skill Building'}},
    {key:'long',  c1:B.accent,     c2:B.proficient,ar:'٩٠+ يوم',    en:'90+ Days',      desc:{ar:'النمو المستدام',  en:'Sustained Growth'}},
  ];

  // timeline vertical line
  const tlX = isRTL ? W-18 : 18;
  fillRect(ctx, tlX-0.3, 22, 0.6, H-30, B.s200);

  let y = 22;

  phases.forEach((ph,pi) => {
    // phase node
    circle(ctx, tlX, y+7, 7, ph.c1, B.white, 0.7);
    txt(ctx, String(pi+1), tlX, y+7, {size:8,color:B.white,weight:'bold',align:'center',isRTL:false});

    // phase header bar
    const barX = isRTL?8:28, barW = W-barX-8;
    gradRect(ctx, barX, y, barW, 13, ph.c1, ph.c2, 'h', 3);
    const phLabel = lang==='ar'?ph.ar:ph.en;
    const phDesc  = lang==='ar'?ph.desc.ar:ph.desc.en;
    txt(ctx, phLabel, isRTL?barX+barW-5:barX+5, y+6.5, {size:10,color:B.white,weight:'bold',align:isRTL?'right':'left',isRTL});
    txt(ctx, phDesc, isRTL?barX+5:barX+barW-5, y+6.5, {size:7.5,color:B.white+'cc',align:isRTL?'left':'right',isRTL});
    y += 15;

    priority.forEach((d) => {
      const content  = d.content[d.band]?.[lk];
      const goalTxt  = content?.goals?.[ph.key];
      if (!goalTxt) return;

      const dbc  = bc(d.band);
      const gcX  = isRTL?12:30, gcW = W-gcX-8;
      roundRect(ctx, gcX, y, gcW, 19, ph.c1+'0a', ph.c1+'33', 2.5);
      // domain name
      txt(ctx, d.name[lk], isRTL?gcX+gcW-5:gcX+5, y+6, {size:7.5,color:dbc,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:gcW-25});
      txt(ctx, d.score+'%', isRTL?gcX+5:gcX+gcW-5, y+6, {size:7,color:dbc,align:isRTL?'left':'right',isRTL});
      wrap(ctx, goalTxt, isRTL?gcX+gcW-5:gcX+5, y+13.5, gcW-10, 4, {size:7.5,color:B.s600,isRTL});
      y += 23;
    });
    y += 4;
  });

  // reminder banner
  gradRect(ctx, 8, H-22, W-16, 14, B.primary, B.accent, 'h', 4);
  txt(ctx, t('تذكير: راجع خطتك كل ٣٠ يومًا وتعقّب تقدمك باستمرار','Reminder: Review your plan every 30 days and track your progress'),
    W/2, H-17, {size:8,color:B.white,weight:'bold',align:'center',isRTL});
  txt(ctx, t('التطوير المستمر هو مفتاح النجاح','Continuous development is the key to success'),
    W/2, H-11, {size:7,color:B.white+'aa',align:'center',isRTL});

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 9 — RESOURCES & NEXT STEPS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildResources(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const ds    = rpt.domain_scores || {};
  const lk    = lang;

  header(ctx, t('الموارد والخطوات القادمة','Resources & Next Steps'), 9, lang);
  footer(ctx, lang);

  const priority = DOMAINS
    .map(d => ({...d, score:ds[d.id]?.score||0, band:ds[d.id]?.band||'Critical'}))
    .sort((a,b) => a.score-b.score).slice(0,3);

  const resTypes = {
    Strong:    t('دليل متقدم','Advanced Guide'),
    Proficient:t('ورقة عمل','Worksheet'),
    Moderate:  t('برنامج تدريبي','Training Program'),
    Critical:  t('جلسة تدريب فردي','1:1 Coaching Session'),
  };

  let y = 22;

  // Intro box
  roundRect(ctx, 8, y, W-16, 14, B.s50, B.s200, 3);
  roundRect(ctx, isRTL?W-11:8, y, 3, 14, B.accent, null, 1.5);
  wrap(ctx,
    t('اختيار الموارد التالية بناءً على أدنى مجالاتك لدعم تطورك المهني المستهدف بشكل فعّال.',
      'The following resources were selected based on your lowest-scoring domains to effectively support targeted professional growth.'),
    isRTL?W-14:14, y+8, W-26, 5, {size:8,color:B.s600,isRTL});
  y += 18;

  priority.forEach((d,i) => {
    const dbc     = bc(d.band);
    const content = d.content[d.band]?.[lk];
    const recs    = content?.recommendations||[];
    const resType = resTypes[d.band] || t('مورد','Resource');

    const cardH = 60;
    roundRect(ctx, 8, y, W-16, cardH, B.white, B.s200, 3.5);

    // color strip
    gradRect(ctx, isRTL?W-11:8, y, 3, cardH, dbc, dbc+'55', 'v', 1.5);

    // resource type badge
    const bdX = isRTL?14:W-46;
    roundRect(ctx, bdX, y+4, 32, 7.5, dbc+'22', dbc+'66', 3.8);
    txt(ctx, resType, bdX+16, y+7.8, {size:6.5,color:dbc,weight:'bold',align:'center',isRTL:false});

    // domain name & score
    txt(ctx, d.name[lk], isRTL?W-15:15, y+8, {size:10,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:W-68});
    txt(ctx, d.score+'%  •  '+bl(d.band,lang), isRTL?W-15:15, y+16, {size:7.5,color:dbc,align:isRTL?'right':'left',isRTL});

    hline(ctx, 15, y+21, W-15, B.s200, 0.4);

    txt(ctx, t('خطوات التحسين المقترحة','Suggested Improvement Steps'), isRTL?W-15:15, y+27, {size:7.5,color:B.s500,weight:'bold',align:isRTL?'right':'left',isRTL});
    recs.slice(0,3).forEach((rec,ri) => {
      const ry2 = y+33+ri*8;
      circle(ctx, isRTL?W-19:19, ry2, 2.5, dbc+'88', null);
      txt(ctx, rec, isRTL?W-23:23, ry2, {size:7.5,color:B.s600,align:isRTL?'right':'left',isRTL,maxW:W-35});
    });

    // CTA button
    const btnW = 52, btnX = isRTL?14:W-14-btnW;
    gradRect(ctx, btnX, y+cardH-11, btnW, 9, B.primary, B.accent, 'h', 4.5);
    txt(ctx, t('تصفح المتجر ←','→ Browse Store'), btnX+btnW/2, y+cardH-6.5, {size:7,color:B.white,weight:'bold',align:'center',isRTL:false});

    y += cardH + 6;
  });

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE 10 — CLOSING / NEXT STEPS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildClosing(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const isRTL = lang === 'ar';
  const t     = (ar,en) => isRTL ? ar : en;
  const user  = rpt.user || {};
  const ov    = rpt.overall || {score:0, band:'Moderate'};
  const bClr  = bc(ov.band);

  // dark bg
  gradRect(ctx, 0, 0, W, H, B.navy, B.primary+'cc', 'v');
  dots(ctx, 0.033);
  gradRect(ctx, 0, 0, W, 2.5, B.accent, B.teal, 'h');

  // header section
  gradRect(ctx, 0, 2.5, W, 22, B.navy+'cc', B.primary, 'h');
  txt(ctx, t('خطوات رحلتك القادمة','Your Next Steps Roadmap'),
    W/2, 14, {size:14,color:B.white,weight:'bold',align:'center',isRTL});
  const greet = t(
    `أهلًا ${user.preferred_name||user.name||''}، هذه خارطة طريقك نحو التميز`,
    `Welcome ${user.preferred_name||user.name||''} — here is your roadmap to excellence`
  );
  txt(ctx, greet, W/2, 20.5, {size:7.5,color:B.white+'77',align:'center',isRTL});

  let y = 28;

  // Steps
  const steps = [
    {n:'01',c:B.accent,    ar:'راجع تقريرك بعمق',   en:'Review Your Report Deeply',  da:'اقرأ تحليل كل مجال وافهم ما تعنيه نتيجتك', de:'Read each domain analysis and understand what your score means'},
    {n:'02',c:B.proficient,ar:'حدد هدفين فوريين',   en:'Set 2 Immediate Goals',       da:'اختر هدفين من قسم ٠–٣٠ يوم وابدأ اليوم', de:'Choose two goals from the 0–30 day section and start today'},
    {n:'03',c:B.moderate,  ar:'شارك نتائجك',         en:'Share Your Results',          da:'ناقش التقرير مع مشرفك أو مرشدك المهني', de:'Discuss the report with your supervisor or professional mentor'},
    {n:'04',c:B.accent,    ar:'ضع تذكيرًا شهريًا',  en:'Set a Monthly Reminder',     da:'راجع تقدمك في خطة التطوير كل ٣٠ يومًا', de:'Review your development plan progress every 30 days'},
    {n:'05',c:B.proficient,ar:'استكشف الموارد',      en:'Explore Resources',           da:'تصفح متجر Optivance للأدوات والبرامج', de:'Browse Optivance store for personalized tools and programs'},
  ];

  steps.forEach((s,i) => {
    roundRect(ctx, 8, y, W-16, 21, B.white+'0d', B.white+'20', 3.5);
    // node
    circle(ctx, isRTL?W-19:19, y+10.5, 7.5, s.c+'33', s.c, 0.5);
    txt(ctx, s.n, isRTL?W-19:19, y+10.5, {size:7,color:s.c,weight:'bold',align:'center',isRTL:false});
    const tx2 = isRTL?W-31:31;
    txt(ctx, lang==='ar'?s.ar:s.en, tx2, y+7.5, {size:9,color:B.white,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:W-43});
    txt(ctx, lang==='ar'?s.da:s.de, tx2, y+15,  {size:7.5,color:B.white+'77',align:isRTL?'right':'left',isRTL,maxW:W-43});
    y += 24;
  });

  y += 2;
  gradRect(ctx, 10, y, W-20, 0.7, B.accent+'44', B.mid+'22', 'h');
  y += 6;

  // Contact
  txt(ctx, t('للتواصل والاستشارات','Contact & Consulting'), W/2, y, {size:10,color:B.accent,weight:'bold',align:'center',isRTL});
  y += 7;
  txt(ctx, 'info@optivance.com  •  www.optivance.com', W/2, y, {size:8.5,color:B.white+'aa',align:'center',isRTL:false});
  y += 9;

  // Overall score card
  roundRect(ctx, 8, y, W-16, 23, bClr+'18', bClr+'55', 4);
  progressArc(ctx, isRTL?W-30:30, y+11.5, 9, ov.score, B.white+'20', bClr, 2.5);
  txt(ctx, ov.score+'%', isRTL?W-30:30, y+11.5, {size:10,color:bClr,weight:'bold',align:'center',isRTL:false});
  txt(ctx, t('نتيجتك الإجمالية','Your Overall Score'), isRTL?W-14:14, y+8, {size:7.5,color:bClr,weight:'bold',align:isRTL?'right':'left',isRTL});
  txt(ctx, bl(ov.band,lang), isRTL?W-14:14, y+17, {size:10,color:bClr,weight:'bold',align:isRTL?'right':'left',isRTL});
  y += 29;

  // Big CTA
  gradRect(ctx, 8, y, W-16, 14, B.accent, B.teal, 'h', 4.5);
  txt(ctx, t('ابدأ رحلة تطورك مع Optivance اليوم','Start Your Growth Journey with Optivance Today'),
    W/2, y+7, {size:9.5,color:B.navy,weight:'bold',align:'center',isRTL});

  // Watermark
  txt(ctx,'OPTIVANCE', W/2, H-18, {size:22,color:B.accent+'15',weight:'bold',align:'center',isRTL:false});
  txt(ctx, t('بناء المهنيين المتميزين','Building Distinguished Professionals'),
    W/2, H-11, {size:7,color:B.white+'30',align:'center',isRTL:false});

  // footer
  fillRect(ctx, 0, H-6.5, W, 6.5, B.navy);
  hline(ctx, 0, H-6.5, W, B.accent+'44', 0.4);
  txt(ctx,'© 2025 OPTIVANCE  •  www.optivance.com  •  All Rights Reserved',
    W/2, H-3.2, {size:5.8,color:B.white+'44',align:'center',isRTL:false});

  return canvas;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function generateCompetencyPDF(reportData, attemptId) {
  const lang = reportData.language || 'ar';

  const canvases = [
    buildCover(reportData, lang),
    buildProfile(reportData, lang),
    buildSnapshot(reportData, lang),
    buildScores(reportData, lang),
    buildStrengths(reportData, lang),
    buildPriorities(reportData, lang),
    buildBreakdown(reportData, lang),
    buildDevPlan(reportData, lang),
    buildResources(reportData, lang),
    buildClosing(reportData, lang),
  ];

  const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });

  canvases.forEach((canvas, idx) => {
    if (idx > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, W, H, '', 'FAST');
  });

  const fileName = `optivance-competency-report-${reportData.report_id || attemptId || 'report'}.pdf`;
  pdf.save(fileName);
  return fileName;
}