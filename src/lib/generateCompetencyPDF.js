/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OPTIVANCE — Premium Competency Report Engine  v4                          ║
 * ║  A4 @ 3× DPI  ·  12 pages  ·  Bilingual AR/EN                              ║
 * ║                                                                              ║
 * ║  DATA ANATOMY — every piece of data is one of:                              ║
 * ║   [STATIC]   Fixed text / brand elements — same for all reports             ║
 * ║   [USER]     From intake form  (rpt.user.*)                                 ║
 * ║   [SCORE]    Computed from answers (rpt.domain_scores / overall)            ║
 * ║   [CONTENT]  Band-driven text from competencyContent.js                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
import jsPDF from 'jspdf';
import { DOMAINS, OVERALL_SUMMARIES, LEVEL_LABELS } from './competencyContent';

// ─── BRAND TOKENS ────────────────────────────────────────────────────────────
const C = {
  navy:    '#0D1F33',
  blue:    '#1A3A5C',
  teal:    '#05E1AE',
  tealD:   '#04C49A',
  white:   '#FFFFFF',
  light:   '#F4F7FA',
  border:  '#DDE4ED',
  text:    '#2D3748',
  muted:   '#8FA3BC',
  // Band colours
  strong:     '#1E8449',
  proficient: '#1A6FA8',
  moderate:   '#D68910',
  critical:   '#C0392B',
};
const BAND_META = {
  Strong:     { color: C.strong,     bg: '#EAFAF1', border: '#A9DFBF', label: { ar: 'متميز',          en: 'Strong'               } },
  Proficient: { color: C.proficient, bg: '#EBF5FB', border: '#AED6F1', label: { ar: 'كفء',            en: 'Proficient'           } },
  Moderate:   { color: C.moderate,   bg: '#FEF9E7', border: '#FAD7A0', label: { ar: 'متوسط',          en: 'Moderate'             } },
  Critical:   { color: C.critical,   bg: '#FDEDEC', border: '#F1948A', label: { ar: 'أولوية تطوير',   en: 'Development Priority' } },
};
// Fixed unique colour per domain [STATIC]
const D_COLOR = ['#7B2D8B','#1A6FA8','#1E8449','#C0392B','#D68910','#0891B2'];

const bc  = b  => BAND_META[b]?.color  || C.muted;
const bbg = b  => BAND_META[b]?.bg     || C.light;
const bbd = b  => BAND_META[b]?.border || C.border;
const bl  = (b, l) => BAND_META[b]?.label?.[l] || b;
const sb  = s  => s >= 80 ? 'Strong' : s >= 60 ? 'Proficient' : s >= 40 ? 'Moderate' : 'Critical';

// ─── CANVAS / COORDINATE SYSTEM ──────────────────────────────────────────────
const W = 210, H = 297, DPR = 3;
const PPM = 3.7795 * DPR;           // pixels per mm
const CW = Math.round(W * PPM);
const CH = Math.round(H * PPM);
const p  = v => Math.round(v * PPM); // mm → px

function mkPage(bg = C.white) {
  const c = document.createElement('canvas');
  c.width = CW; c.height = CH;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CW, CH);
  return { canvas: c, ctx };
}

// ─── PRIMITIVE DRAWING ────────────────────────────────────────────────────────
function rrect(ctx, x, y, w, h, fill, stroke, r = 0, sw = 0.4) {
  ctx.save();
  const [X,Y,W2,H2,R] = [p(x),p(y),p(w),p(h),p(r)];
  ctx.beginPath();
  if (R > 0) {
    ctx.moveTo(X+R,Y); ctx.lineTo(X+W2-R,Y); ctx.quadraticCurveTo(X+W2,Y,X+W2,Y+R);
    ctx.lineTo(X+W2,Y+H2-R); ctx.quadraticCurveTo(X+W2,Y+H2,X+W2-R,Y+H2);
    ctx.lineTo(X+R,Y+H2); ctx.quadraticCurveTo(X,Y+H2,X,Y+H2-R);
    ctx.lineTo(X,Y+R); ctx.quadraticCurveTo(X,Y,X+R,Y);
    ctx.closePath();
  } else { ctx.rect(X,Y,W2,H2); }
  if (fill)   { ctx.fillStyle   = fill;         ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = p(sw); ctx.stroke(); }
  ctx.restore();
}

function ln(ctx, x1, y1, x2, y2, color, w = 0.3) {
  ctx.save();
  ctx.beginPath(); ctx.moveTo(p(x1),p(y1)); ctx.lineTo(p(x2),p(y2));
  ctx.strokeStyle = color; ctx.lineWidth = p(w); ctx.stroke();
  ctx.restore();
}

function circ(ctx, cx, cy, r, fill, stroke, sw = 0.4) {
  ctx.save();
  ctx.beginPath(); ctx.arc(p(cx),p(cy),p(r),0,Math.PI*2);
  if (fill)   { ctx.fillStyle = fill;           ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = p(sw); ctx.stroke(); }
  ctx.restore();
}

function gradH(ctx, x, y, w, h, c1, c2, r = 0) {
  const g = ctx.createLinearGradient(p(x),p(y),p(x+w),p(y));
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  rrect(ctx, x, y, w, h, g, null, r);
}
function gradV(ctx, x, y, w, h, c1, c2) {
  const g = ctx.createLinearGradient(p(x),p(y),p(x),p(y+h));
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  rrect(ctx, x, y, w, h, g, null, 0);
}

function txt(ctx, str, x, y, { sz=9, clr=C.text, bold=false, align='left', rtl=false, mw } = {}) {
  if (str === null || str === undefined) return;
  ctx.save();
  ctx.font = `${bold?700:400} ${Math.round(sz*PPM*0.38)}px Arial,sans-serif`;
  ctx.fillStyle = clr; ctx.textAlign = align;
  ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.textBaseline = 'middle';
  const a = [String(str), p(x), p(y)];
  if (mw) a.push(p(mw));
  ctx.fillText(...a);
  ctx.restore();
}

function wrap(ctx, str, x, y, mw, lh, opts = {}) {
  if (!str) return;
  ctx.save();
  const { sz=8.5, clr=C.text, bold=false, rtl=false } = opts;
  ctx.font = `${bold?700:400} ${Math.round(sz*PPM*0.38)}px Arial,sans-serif`;
  ctx.fillStyle = clr; ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.textBaseline = 'middle';
  const words = String(str).split(' ');
  const mwPx = p(mw), lhPx = p(lh);
  let line = '', cy = p(y);
  words.forEach((w2, i) => {
    const t = line ? line+' '+w2 : w2;
    if (ctx.measureText(t).width > mwPx && i > 0) {
      ctx.fillText(line, p(x), cy); line = w2; cy += lhPx;
    } else { line = t; }
  });
  if (line) ctx.fillText(line, p(x), cy);
  ctx.restore();
}

// ─── CHART PRIMITIVES ─────────────────────────────────────────────────────────

/**
 * RADAR / SPIDER CHART  [SCORE-driven visualisation]
 * cx,cy = centre mm  |  r = radius mm  |  scores = array 0–100 (6 items)
 * colors = array of hex per axis
 */
function radarChart(ctx, cx, cy, r, scores, colors, lang) {
  const N = scores.length;
  const step = (Math.PI * 2) / N;
  // offset so first axis points up
  const offset = -Math.PI / 2;
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Grid rings
  levels.forEach(f => {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const a = offset + i * step;
      const x2 = p(cx) + p(r) * f * Math.cos(a);
      const y2 = p(cy) + p(r) * f * Math.sin(a);
      i === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.strokeStyle = f === 1 ? C.border : C.border+'88';
    ctx.lineWidth = p(f === 1 ? 0.4 : 0.25);
    ctx.stroke();
    ctx.restore();
  });

  // Axis lines
  for (let i = 0; i < N; i++) {
    const a = offset + i * step;
    ln(ctx, cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a), C.border+'aa', 0.3);
  }

  // Filled area [SCORE-driven]
  ctx.save();
  ctx.beginPath();
  scores.forEach((s, i) => {
    const a = offset + i * step;
    const f = s / 100;
    const x2 = p(cx) + p(r) * f * Math.cos(a);
    const y2 = p(cy) + p(r) * f * Math.sin(a);
    i === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
  });
  ctx.closePath();
  ctx.fillStyle = C.teal + '30';
  ctx.fill();
  ctx.strokeStyle = C.teal;
  ctx.lineWidth = p(0.7);
  ctx.stroke();
  ctx.restore();

  // Data points [SCORE-driven]
  scores.forEach((s, i) => {
    const a = offset + i * step;
    const f = s / 100;
    const x2 = p(cx) + p(r) * f * Math.cos(a);
    const y2 = p(cy) + p(r) * f * Math.sin(a);
    circ(ctx, cx + r * f * Math.cos(a), cy + r * f * Math.sin(a), 1.5, colors[i], C.white, 0.4);
  });

  // Zone % labels on axes
  [25, 50, 75].forEach(pct => {
    const f = pct / 100;
    const a = offset + 0 * step;
    const lx = p(cx) + p(r) * f * Math.cos(a) + p(2);
    const ly = p(cy) + p(r) * f * Math.sin(a);
    ctx.save();
    ctx.font = `400 ${Math.round(5.5*PPM*0.38)}px Arial`;
    ctx.fillStyle = C.muted; ctx.textBaseline = 'middle';
    ctx.fillText(pct+'%', lx, ly);
    ctx.restore();
  });
}

/**
 * HORIZONTAL BAR [SCORE-driven]
 * Segmented 4-zone Hogan-style + marker needle
 */
function hoganBar(ctx, x, y, w, h, score) {
  const zones = [
    { fill: '#FDEDEC', bdr: C.critical   },
    { fill: '#FEF9E7', bdr: C.moderate   },
    { fill: '#EBF5FB', bdr: C.proficient },
    { fill: '#EAFAF1', bdr: C.strong     },
  ];
  const zw = w / 4;
  zones.forEach((z, i) => {
    rrect(ctx, x+i*zw, y, zw, h, z.fill, z.bdr+'44', 0, 0.2);
  });
  [1,2,3].forEach(i => ln(ctx, x+i*zw, y, x+i*zw, y+h, C.white+'cc', 0.5));

  // Needle [SCORE]
  const nx = x + (score/100) * w;
  rrect(ctx, nx-0.6, y-2, 1.2, h+4, bc(sb(score)), null, 0.6);
  // Score label above needle
  txt(ctx, score+'%', nx, y-5, { sz:8.5, clr:bc(sb(score)), bold:true, align:'center' });
}

/**
 * DONUT / RING GAUGE [SCORE-driven]
 * Half-arc, bottom-flat, 4 zones coloured
 */
function donutGauge(ctx, cx, cy, r, score, trackClr = C.border) {
  const SW = p(r * 0.3);
  const START = Math.PI, END = Math.PI * 2;
  const zoneArcs = [
    { from: Math.PI,       to: Math.PI*1.25, c: '#FDEDEC' },
    { from: Math.PI*1.25,  to: Math.PI*1.5,  c: '#FEF9E7' },
    { from: Math.PI*1.5,   to: Math.PI*1.75, c: '#EBF5FB' },
    { from: Math.PI*1.75,  to: Math.PI*2,    c: '#EAFAF1' },
  ];
  // Background arc
  ctx.save();
  ctx.beginPath(); ctx.arc(p(cx),p(cy),p(r),START,END);
  ctx.strokeStyle = trackClr; ctx.lineWidth = SW; ctx.lineCap = 'round'; ctx.stroke();
  // Zone colouring
  zoneArcs.forEach(z => {
    ctx.beginPath(); ctx.arc(p(cx),p(cy),p(r),z.from,z.to);
    ctx.strokeStyle = z.c; ctx.lineWidth = SW*0.85; ctx.lineCap='butt'; ctx.stroke();
  });
  // Score fill [SCORE]
  if (score > 0) {
    const fillTo = START + (score / 100) * Math.PI;
    ctx.beginPath(); ctx.arc(p(cx),p(cy),p(r),START,fillTo);
    ctx.strokeStyle = bc(sb(score));
    ctx.lineWidth = SW; ctx.lineCap = 'round'; ctx.stroke();
  }
  // Tick marks at zone boundaries
  [0, .25, .5, .75, 1].forEach(t => {
    const a = START + t * Math.PI;
    const r1 = p(r) - SW*.55, r2 = p(r) + SW*.55;
    ctx.beginPath();
    ctx.moveTo(p(cx)+r1*Math.cos(a), p(cy)+r1*Math.sin(a));
    ctx.lineTo(p(cx)+r2*Math.cos(a), p(cy)+r2*Math.sin(a));
    ctx.strokeStyle = C.white; ctx.lineWidth = p(0.5); ctx.stroke();
  });
  ctx.restore();
}

/**
 * VERTICAL BAR CHART — for comparing all 6 domain scores [SCORE-driven]
 * bx,by = bottom-left corner  |  bw,bh = chart box  |  scores[] of 6
 */
function barChart(ctx, bx, by, bw, bh, scores, colors, labels, rtl) {
  const N = scores.length;
  const barW = (bw - 4) / N;
  const maxH = bh - 14; // leave room for labels at bottom

  // X-axis
  ln(ctx, bx, by, bx+bw, by, C.border, 0.4);
  // Y gridlines + labels
  [0,25,50,75,100].forEach(pct => {
    const gy = by - (pct/100)*maxH;
    ln(ctx, bx, gy, bx+bw, gy, C.border+'55', 0.25);
    txt(ctx, pct+'%', bx-1, gy, { sz:5.5, clr:C.muted, align:'right' });
  });

  scores.forEach((s, i) => {
    const barH = (s / 100) * maxH;
    const bx2 = bx + i*barW + 1;
    const by2 = by - barH;
    // Bar background
    rrect(ctx, bx2, by - maxH, barW-2, maxH, C.light, null, 1);
    // Score fill [SCORE]
    if (s > 0) {
      const g = ctx.createLinearGradient(0, p(by2), 0, p(by));
      g.addColorStop(0, colors[i]); g.addColorStop(1, colors[i]+'88');
      rrect(ctx, bx2, by2, barW-2, barH, g, null, 1.5);
    }
    // Score label
    txt(ctx, s+'%', bx2+(barW-2)/2, by2-4, { sz:6.5, clr:colors[i], bold:true, align:'center' });
    // Domain number label at bottom
    txt(ctx, labels[i], bx2+(barW-2)/2, by+7, { sz:6, clr:C.muted, align:'center' });
  });
}

/**
 * MINI SCORE PROGRESS BAR [SCORE-driven]
 */
function miniBar(ctx, x, y, w, h, score, color) {
  rrect(ctx, x, y, w, h, C.light, C.border, h/2, 0.2);
  if (score > 0) {
    const fw = Math.max((score/100)*w, h);
    rrect(ctx, x, y, fw, h, color, null, h/2);
  }
}

// ─── PAGE CHROME ──────────────────────────────────────────────────────────────
function header(ctx, title, pgNum, lang, accent = C.blue) {
  const rtl = lang === 'ar';
  gradH(ctx, 0, 0, W, 15, C.navy, C.blue);
  rrect(ctx, 0, 15, W, 0.9, C.teal);
  // Brand pill [STATIC]
  rrect(ctx, rtl?W-50:6, 3.5, 44, 8, C.teal+'22', C.teal+'55', 4);
  txt(ctx, 'OPTIVANCE', rtl?W-28:28, 7.5, { sz:7.5, clr:C.teal, bold:true, align:'center' });
  // Page title [STATIC / page-specific]
  txt(ctx, title, rtl?W-56:56, 7.5, { sz:9.5, clr:C.white, bold:true, align:rtl?'right':'left', rtl });
  // Page number [STATIC]
  const bx = rtl ? 5 : W-20;
  rrect(ctx, bx, 3.5, 15, 8, accent, null, 4);
  txt(ctx, String(pgNum), bx+7.5, 7.5, { sz:7, clr:C.white, bold:true, align:'center' });
}

function footer(ctx) {
  // [STATIC]
  rrect(ctx, 0, H-7, W, 7, C.navy);
  ln(ctx, 0, H-7, W, H-7, C.teal+'44', 0.4);
  txt(ctx, 'OPTIVANCE  ·  www.optivance.com  ·  info@optivance.com  ·  © 2025',
    W/2, H-3.5, { sz:5.5, clr:C.white+'44', align:'center' });
}

function sectionHdr(ctx, title, x, y, rtl, color = C.blue) {
  // [STATIC label, dynamic position]
  txt(ctx, title, x, y, { sz:10.5, clr:color, bold:true, align:rtl?'right':'left', rtl });
  ln(ctx, rtl?x:x, y+4, rtl?x-70:x+70, y+4, C.teal, 1.2);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — FRONT COVER
// ═══════════════════════════════════════════════════════════════════════════════
function pg_FrontCover(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const rtl = lang === 'ar';
  const T   = (ar, en) => rtl ? ar : en;
  // [USER] from intake
  const user = rpt.user || {};
  // [SCORE] from scoring engine
  const ov   = rpt.overall || { score: 0, band: 'Moderate' };
  const band = ov.band || sb(ov.score);
  // [USER] professional level label
  const lv = LEVEL_LABELS[user.professional_level]?.[lang] || user.professional_level || '—';

  // Background
  const bg = ctx.createLinearGradient(0,0,0,CH);
  bg.addColorStop(0,'#0D1F33'); bg.addColorStop(.55,'#122840'); bg.addColorStop(1,'#0A1929');
  ctx.fillStyle = bg; ctx.fillRect(0,0,CW,CH);

  // Dot texture [STATIC]
  ctx.save(); ctx.globalAlpha=.04; ctx.fillStyle=C.teal;
  for (let xi=0; xi<CW; xi+=p(9)) for (let yi=0; yi<CH; yi+=p(9)) {
    ctx.beginPath(); ctx.arc(xi,yi,p(.4),0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  // Teal top accent [STATIC]
  rrect(ctx,0,0,W,2.2,C.teal);

  // Right panel [STATIC]
  ctx.save(); ctx.globalAlpha=.06;
  rrect(ctx,W-56,0,56,H,C.teal);
  ctx.restore();
  ln(ctx,W-56,0,W-56,H,C.teal+'15',.4);

  // Wordmark [STATIC]
  const lx=rtl?W-58:12, lw=46;
  rrect(ctx,lx,14,lw,10,C.teal+'20',C.teal+'44',5);
  txt(ctx,'OPTIVANCE',lx+lw/2,19,{sz:9,clr:C.teal,bold:true,align:'center'});
  txt(ctx,T('للاستشارات وتطوير المواهب','Consulting & Talent Development'),
    lx+lw/2,27,{sz:6,clr:C.white+'55',align:'center',rtl});

  // Title [STATIC]
  const tx=rtl?W-12:12, ta=rtl?'right':'left';
  txt(ctx,T('تقرير','Competency'),    tx,55,{sz:34,clr:C.white,bold:true,align:ta,rtl});
  txt(ctx,T('الجدارات المهنية','& Growth Report'),tx,74,{sz:30,clr:C.teal,bold:true,align:ta,rtl});
  wrap(ctx,
    T('مقياس علمي متكامل لقياس الكفاءات المهنية في ٦ مجالات رئيسية وفق أعلى المعايير العالمية',
      'A comprehensive scientific assessment measuring professional competencies across 6 key domains to world-class standards'),
    rtl?W-12:12, 85, W-68, 5.5, {sz:8, clr:C.white+'66', rtl});

  ln(ctx,12,95,W-12,95,C.teal+'33',.5);

  // Score donut gauge [SCORE]
  const gcx=rtl?38:W-38, gcy=65;
  circ(ctx,gcx,gcy,20,C.white+'07',C.white+'18',.5);
  donutGauge(ctx,gcx,gcy,14,ov.score);
  txt(ctx,ov.score+'%',gcx,gcy,   {sz:16,clr:C.white,bold:true,align:'center'});
  txt(ctx,T('نتيجتك','Your Score'),gcx,gcy+9,{sz:6,clr:C.white+'66',align:'center'});
  rrect(ctx,gcx-14,gcy+13,28,8,bc(band)+'33',bc(band)+'88',4);
  txt(ctx,bl(band,lang),gcx,gcy+17,{sz:7,clr:bc(band),bold:true,align:'center'});

  // Profile card [USER + SCORE]
  const cY=100;
  rrect(ctx,12,cY,W-24,82,C.white+'0c',C.white+'1c',6);
  txt(ctx,T('بيانات المشارك','Participant Profile'),
    rtl?W-18:18, cY+8,{sz:9,clr:C.teal,bold:true,align:rtl?'right':'left',rtl});
  ln(ctx,16,cY+13,W-16,cY+13,C.white+'20',.35);

  const fields=[
    [T('الاسم الكامل','Full Name'),          user.name||'—'],             // [USER]
    [T('الاسم المفضل','Preferred Name'),     user.preferred_name||user.name||'—'], // [USER]
    [T('المستوى المهني','Professional Level'),lv],                         // [USER]
    [T('نسخة المقياس','Version'),           rpt.version==='full'?T('الكاملة','Full'):T('السريعة','Quick')], // [USER]
    [T('تاريخ الإكمال','Completion Date'),   user.completion_date||'—'],   // [USER]
    [T('رقم التقرير','Report ID'),           rpt.report_id||'—'],          // [USER/SYSTEM]
  ];
  const cw=(W-32)/2;
  fields.forEach(([lbl,val],i)=>{
    const col=i%2, row=Math.floor(i/2);
    const fx=rtl?W-16-col*(cw+4):16+col*(cw+4);
    const fy=cY+18+row*20;
    rrect(ctx,rtl?fx-cw:fx,fy,cw,17,C.white+'09',C.white+'18',3.5);
    txt(ctx,lbl,rtl?fx-6:fx+6,fy+5.5,{sz:6.5,clr:C.teal+'cc',align:rtl?'right':'left',rtl});
    txt(ctx,val, rtl?fx-6:fx+6,fy+12, {sz:8.5,clr:C.white+'dd',bold:true,align:rtl?'right':'left',rtl,mw:cw-12});
  });

  // Pillars strip [STATIC]
  const pY=cY+85;
  [[T('٦ مجالات','6 Domains'),T('رئيسية','Key')],[T('٢٠ جدارة','20 Competencies'),T('أساسية','Core')],
   [T('خطة تطوير','Dev Plan'),T('٩٠ يوم','90 Days')],[T('نتائج','Results'),T('فورية','Instant')]
  ].forEach(([n,s],i)=>{
    const pw=(W-24)/4, px=12+i*(pw+4);
    rrect(ctx,px,pY,pw,16,C.white+'0b',C.white+'22',4);
    txt(ctx,n,px+pw/2,pY+6, {sz:8.5,clr:C.teal,bold:true,align:'center',rtl});
    txt(ctx,s,px+pw/2,pY+12,{sz:7,  clr:C.white+'66',align:'center',rtl});
  });

  ln(ctx,12,H-30,W-12,H-30,C.teal+'22',.4);
  txt(ctx,'OPTIVANCE', W/2,H-22,{sz:9,clr:C.teal+'44',bold:true,align:'center'});
  txt(ctx,'www.optivance.com',W/2,H-15,{sz:7,clr:C.white+'33',align:'center'});
  txt(ctx,T('جميع الحقوق محفوظة © 2025','All Rights Reserved © 2025'),W/2,H-9,{sz:6,clr:C.white+'25',align:'center',rtl});

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — ABOUT ASSESSMENT + SCORE GUIDE  [Mostly STATIC]
// ═══════════════════════════════════════════════════════════════════════════════
function pg_About(rpt, lang) {
  const { canvas, ctx } = mkPage(C.light);
  const rtl = lang==='ar';
  const T=(ar,en)=>rtl?ar:en;
  const tx=rtl?W-12:12, ta=rtl?'right':'left';
  let y=20;

  header(ctx,T('نبذة عن المقياس','About the Assessment'),2,lang);
  footer(ctx);

  // About card [STATIC]
  rrect(ctx,8,y,W-16,68,C.white,C.border,4);
  rrect(ctx,rtl?W-11:8,y,3,68,C.teal,null,1.5);
  sectionHdr(ctx,T('مقياس الجدارات المهنية من Optivance','Optivance Professional Competency Assessment'),
    rtl?W-15:15,y+8,rtl);

  wrap(ctx,
    T('مقياس الجدارات المهنية هو أداة تقييم علمية شاملة تقيس أداءك المهني عبر ٦ مجالات جدارة رئيسية تشمل ٢٠ كفاءة أساسية. يستند المقياس إلى أفضل المعايير العالمية في قياس الكفاءات المهنية، ويقدم لك رؤية تحليلية دقيقة مدعومة بخطة عمل قابلة للتنفيذ.',
      'The Professional Competency Assessment is a comprehensive scientific tool measuring your professional performance across 6 core competency domains covering 20 essential competencies. Grounded in global best practices, it delivers precise analytical insights backed by an actionable development plan.'),
    rtl?W-15:15, y+20, W-30, 5.5, {sz:8.5, clr:C.text, rtl});

  // Feature bullets [STATIC]
  const feats=[
    [T('٦ مجالات رئيسية','6 Core Domains'), T('تغطي كافة أبعاد الأداء المهني','Cover every dimension of professional performance')],
    [T('٢٠ جدارة أساسية','20 Core Competencies'), T('مُحددة بدقة علمية وسياقية','Scientifically and contextually defined')],
    [T('تقرير PDF فوري','Instant PDF Report'), T('تحليل متكامل وخطة تطوير شخصية','Full analysis and personal development plan')],
    [T('قياس فرعي','Sub-Scale Analysis'), T('نتائج تفصيلية لكل مقياس فرعي','Detailed scores for every sub-scale')],
  ];
  feats.forEach(([n,d],i)=>{
    const fy=y+38+i*7;
    circ(ctx,rtl?W-16:16,fy,1.5,C.teal,null);
    txt(ctx,n, rtl?W-20:20,fy,{sz:8,clr:C.blue,bold:true,align:ta,rtl});
    txt(ctx,' — '+d,rtl?W-20:20+(rtl?0:28),fy,{sz:8,clr:C.muted,align:ta});
  });
  y+=72;

  // ── Score Guide (Hogan-style) [STATIC]
  rrect(ctx,8,y,W-16,32,C.white,C.border,4);
  sectionHdr(ctx,T('مفتاح قراءة النتائج','Score Interpretation Guide'),rtl?W-15:15,y+7,rtl);
  const bw=(W-28)/4, bandList=['Critical','Moderate','Proficient','Strong'], rangeList=['0–39','40–59','60–79','80–100'];
  bandList.forEach((b,i)=>{
    const bx=12+i*bw;
    rrect(ctx,bx,y+15,bw-2,14,bbg(b),bbd(b),3);
    txt(ctx,bl(b,lang),bx+(bw-2)/2,y+19.5,{sz:7,clr:bc(b),bold:true,align:'center',rtl});
    txt(ctx,rangeList[i],bx+(bw-2)/2,y+27, {sz:6,clr:C.muted,align:'center'});
  });
  y+=36;

  // ── 6 Domains overview [STATIC labels + STATIC descriptions]
  rrect(ctx,8,y,W-16,82,C.white,C.border,4);
  sectionHdr(ctx,T('المجالات الستة للمقياس','The Six Assessment Domains'),rtl?W-15:15,y+7,rtl);
  const dw=(W-20)/3;
  DOMAINS.forEach((d,i)=>{
    const col=i%3, row=Math.floor(i/3);
    const dx=8+col*(dw+2), dy=y+16+row*30;
    rrect(ctx,dx,dy,dw-2,27,C.light,C.border,3);
    // Domain colour strip [STATIC]
    rrect(ctx,rtl?dx+dw-4:dx,dy,4,27,D_COLOR[i],null,1.5);
    circ(ctx,rtl?dx+dw-10:dx+9,dy+8,4.5,D_COLOR[i]+'22',D_COLOR[i]+'55',.5);
    txt(ctx,String(i+1),rtl?dx+dw-10:dx+9,dy+8,{sz:6,clr:D_COLOR[i],bold:true,align:'center'});
    txt(ctx,d.name[lang],rtl?dx+dw-18:dx+17,dy+7,{sz:7.5,clr:C.blue,bold:true,align:ta,rtl,mw:dw-25});
    wrap(ctx,d.description[lang],rtl?dx+dw-18:dx+17,dy+16,dw-28,4.5,{sz:6.5,clr:C.muted,rtl});
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — OVERALL SCORE DASHBOARD  [SCORE-heavy + CONTENT]
// ═══════════════════════════════════════════════════════════════════════════════
function pg_Dashboard(rpt, lang) {
  const { canvas, ctx } = mkPage(C.light);
  const rtl = lang==='ar';
  const T=(ar,en)=>rtl?ar:en;
  const ta=rtl?'right':'left', tx=rtl?W-12:12;
  // [SCORE]
  const ds=rpt.domain_scores||{};
  const ov=rpt.overall||{score:0,band:'Moderate'};
  const band=ov.band||sb(ov.score);
  // [CONTENT] driven by band
  const summary=OVERALL_SUMMARIES[band]?.[lang]||'';

  header(ctx,T('ملخص النتائج الإجمالية','Overall Results Summary'),3,lang);
  footer(ctx);

  let y=20;

  // Hero overall score [SCORE]
  gradH(ctx,0,y,W,28,C.navy,C.blue);
  donutGauge(ctx,rtl?W-28:28,y+14,13,ov.score,C.white+'30');
  txt(ctx,ov.score+'%',rtl?W-28:28,y+14,{sz:14,clr:C.white,bold:true,align:'center'});
  txt(ctx,T('النتيجة الإجمالية','Overall Score'),rtl?W-28:28,y+23,{sz:5.5,clr:C.white+'66',align:'center'});

  rrect(ctx,rtl?16:38,y+8,40,10,bc(band)+'30',bc(band)+'77',5);
  txt(ctx,bl(band,lang),rtl?36:58,y+13,{sz:9,clr:bc(band),bold:true,align:'center'});
  wrap(ctx,summary,rtl?W-12:56,y+9,W-72,5,{sz:7.5,clr:C.white+'bb',rtl});
  y+=32;

  // ── RADAR CHART [SCORE — all 6 domain scores visualised]
  const domScores=DOMAINS.map(d=>ds[d.id]?.score||0);
  const domColors=DOMAINS.map((_,i)=>D_COLOR[i]);

  rrect(ctx,8,y,W-16,76,C.white,C.border,4);
  sectionHdr(ctx,T('مخطط الكفاءات الشبكي','Competency Radar Chart'),rtl?W-15:15,y+7,rtl);

  const rCX=W/2, rCY=y+46, rR=28;
  radarChart(ctx,rCX,rCY,rR,domScores,domColors,lang);

  // Axis labels around radar [SCORE — domain names]
  DOMAINS.forEach((d,i)=>{
    const N=6, step=(Math.PI*2)/N, off=-Math.PI/2;
    const a=off+i*step;
    const lx=rCX+(rR+10)*Math.cos(a), ly=rCY+(rR+10)*Math.sin(a);
    const shorten=d.name[lang].split(' ')[0];
    txt(ctx,shorten,lx,ly,{sz:6.5,clr:D_COLOR[i],bold:true,align:'center',rtl});
  });
  y+=82;

  // ── BAR CHART — 6 domains [SCORE]
  rrect(ctx,8,y,W-16,68,C.white,C.border,4);
  sectionHdr(ctx,T('النتائج حسب المجال','Domain Scores Comparison'),rtl?W-15:15,y+7,rtl);

  const chartLabels=DOMAINS.map((_,i)=>String(i+1));
  barChart(ctx,18,y+60,W-36,50,domScores,domColors,chartLabels,rtl);

  // Legend [SCORE + STATIC domain names]
  DOMAINS.forEach((d,i)=>{
    const col=i%3, row=Math.floor(i/3);
    const lx2=18+col*58, ly2=y+66+row*6.5;
    rrect(ctx,lx2,ly2-2,3,4,D_COLOR[i],null,1);
    txt(ctx,String(i+1)+' '+d.name[lang],lx2+5,ly2,{sz:6,clr:C.text,align:'left',rtl:false,mw:50});
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGES 4–9 — ONE PAGE PER DOMAIN  (Hogan deep-dive + sub-scales)
// ═══════════════════════════════════════════════════════════════════════════════
function pg_Domain(rpt, lang, idx, pgNum) {
  const { canvas, ctx } = mkPage(C.light);
  const rtl = lang==='ar';
  const T=(ar,en)=>rtl?ar:en;
  const ta=rtl?'right':'left', tx=rtl?W-12:12;
  // [SCORE]
  const ds=rpt.domain_scores||{};
  const subs=rpt.sub_competency_scores||{};
  const domain=DOMAINS[idx];
  const dd=ds[domain.id]||{score:0,band:'Critical'};
  const band=dd.band||sb(dd.score);
  const dClr=D_COLOR[idx]||C.blue;
  // [CONTENT] driven by band
  const content=domain.content[band]?.[lang]||{};

  header(ctx,domain.name[lang],pgNum,lang,dClr);
  footer(ctx);

  let y=20;

  // ── Domain identity strip
  rrect(ctx,0,y,W,20,C.white,null);
  ln(ctx,0,y+20,W,y+20,C.border,.4);
  circ(ctx,rtl?W-20:20,y+10,8,dClr+'22',dClr,.7);
  txt(ctx,String(idx+1),rtl?W-20:20,y+10,{sz:9,clr:dClr,bold:true,align:'center'});
  txt(ctx,domain.name[lang],rtl?W-34:34,y+7, {sz:11,clr:C.blue,bold:true,align:ta,rtl});
  txt(ctx,domain.description[lang],rtl?W-34:34,y+15,{sz:7.5,clr:C.muted,align:ta,rtl,mw:W-60});
  y+=24;

  // ── Hogan-style score bar [SCORE]
  rrect(ctx,8,y,W-16,20,C.white,C.border,4);
  txt(ctx,T('الدرجة المئوية','Percentile Score'),rtl?W-14:14,y+5,{sz:7,clr:C.muted,align:ta,rtl});
  hoganBar(ctx,14,y+10,W-28,7,dd.score);
  // Band badge [SCORE + CONTENT]
  const bbx=rtl?14:W-50;
  rrect(ctx,bbx,y+3,36,8,bc(band)+'22',bc(band),4);
  txt(ctx,bl(band,lang)+' — '+dd.score+'%',bbx+18,y+7,{sz:7,clr:bc(band),bold:true,align:'center'});
  y+=24;

  // ── Sub-scale scores — MINI BAR CHART [SCORE]
  const subCount=domain.sub_competencies.length;
  const subH=10+subCount*15+4;
  rrect(ctx,8,y,W-16,subH,C.white,C.border,4);
  rrect(ctx,rtl?W-11:8,y,3,subH,dClr,null,1.5);
  txt(ctx,T('المقاييس الفرعية','Sub-Scale Scores'),rtl?W-15:14,y+7,{sz:9,clr:C.blue,bold:true,align:ta,rtl});
  ln(ctx,12,y+12,W-12,y+12,C.border,.35);

  domain.sub_competencies.forEach((sc,si)=>{
    const sy=y+15+si*15;
    const subKey=`${domain.id}__${sc.id}`;
    // [SCORE] — real sub_competency score
    const sData=subs[subKey]||{score:dd.score,band};
    const sBand=sData.band||sb(sData.score);

    if (si%2===0) rrect(ctx,10,sy,W-20,13,C.light,null,2);

    // Sub-scale name [STATIC from content lib]
    txt(ctx,sc.name[lang],rtl?W-16:16,sy+6.5,{sz:8,clr:C.text,align:ta,rtl,mw:W-75});

    // Mini bar [SCORE]
    miniBar(ctx,rtl?38:W-72,sy+3.5,58,6,sData.score,bc(sBand));

    // Percentage [SCORE]
    txt(ctx,sData.score+'%',rtl?35:W-15,sy+6.5,{sz:7,clr:bc(sBand),bold:true,align:rtl?'right':'left'});
  });
  y+=subH+4;

  // ── Score interpretation [CONTENT driven by SCORE band]
  rrect(ctx,8,y,W-16,28,C.white,C.border,4);
  rrect(ctx,rtl?W-11:8,y,3,28,dClr,null,1.5);
  txt(ctx,T('تفسير الدرجة','Score Interpretation'),rtl?W-15:14,y+7,{sz:9,clr:C.blue,bold:true,align:ta,rtl});
  wrap(ctx,content.summary||'',rtl?W-15:14,y+16,W-26,5,{sz:8.5,clr:C.text,rtl});
  y+=32;

  // ── Strengths + Recommendations  [CONTENT]
  const cw2=(W-20)/2, sStrH=10+(content.strengths?.length||0)*9;
  const sec2H=Math.min(48,sStrH+4);

  // Strengths column
  rrect(ctx,8,y,cw2,sec2H,C.white,C.border,4);
  rrect(ctx,rtl?8+cw2-3:8,y,3,sec2H,C.strong,null,1.5);
  txt(ctx,T('نقاط القوة','Key Strengths'),rtl?8+cw2-7:12,y+7,{sz:8.5,clr:C.strong,bold:true,align:ta,rtl});
  (content.strengths||[]).slice(0,4).forEach((s,si)=>{
    const sY=y+14+si*9;
    circ(ctx,rtl?8+cw2-9:12,sY,2,C.strong,null);
    txt(ctx,s,rtl?8+cw2-14:17,sY,{sz:7.5,clr:C.text,align:ta,rtl,mw:cw2-22});
  });

  // Recommendations column
  const rx=10+cw2+2;
  rrect(ctx,rx,y,cw2,sec2H,C.white,C.border,4);
  rrect(ctx,rtl?rx+cw2-3:rx,y,3,sec2H,dClr,null,1.5);
  txt(ctx,T('التوصيات','Recommendations'),rtl?rx+cw2-7:rx+4,y+7,{sz:8.5,clr:dClr,bold:true,align:ta,rtl});
  (content.recommendations||[]).slice(0,4).forEach((r,ri)=>{
    const rY=y+14+ri*9;
    rrect(ctx,rtl?rx+cw2-11:rx+7,rY-2.5,2,5,dClr,null,1);
    txt(ctx,r,rtl?rx+cw2-15:rx+12,rY,{sz:7.5,clr:C.text,align:ta,rtl,mw:cw2-20});
  });
  y+=sec2H+5;

  // ── Development goals — 3 phases  [CONTENT]
  if (content.goals && y<H-40) {
    const phases=[
      {key:'short',ar:'٠–٣٠ يوم',  en:'0–30 Days',  c:'#C0392B',bg:'#FDEDEC'},
      {key:'mid',  ar:'٣٠–٩٠ يوم', en:'30–90 Days', c:'#D68910',bg:'#FEF9E7'},
      {key:'long', ar:'٩٠+ يوم',   en:'90+ Days',   c:'#1E8449',bg:'#EAFAF1'},
    ];
    const pw=(W-20)/3;
    phases.forEach((ph,pi)=>{
      const px=8+pi*(pw+2), pH=32;
      rrect(ctx,px,y,pw,pH,ph.bg,ph.c+'44',3);
      gradH(ctx,px,y,pw,9,ph.c,ph.c+'bb',3);
      txt(ctx,rtl?ph.ar:ph.en,px+pw/2,y+4.5,{sz:6.5,clr:C.white,bold:true,align:'center',rtl});
      wrap(ctx,content.goals[ph.key]||'',rtl?px+pw-4:px+4,y+16,pw-8,4.5,{sz:7.5,clr:C.text,rtl});
    });
  }

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 10 — DEVELOPMENT PLAN  [SCORE + CONTENT]
// ═══════════════════════════════════════════════════════════════════════════════
function pg_DevPlan(rpt, lang) {
  const { canvas, ctx } = mkPage(C.light);
  const rtl = lang==='ar';
  const T=(ar,en)=>rtl?ar:en;
  const ta=rtl?'right':'left', tx=rtl?W-12:12;
  const ds=rpt.domain_scores||{};

  header(ctx,T('خطة التطوير الشخصية','Personal Development Plan'),10,lang);
  footer(ctx);

  let y=20;

  // [SCORE] — sort domains by score ascending → lowest = highest priority
  const sorted=DOMAINS.map((d,i)=>({...d,idx:i,score:ds[d.id]?.score||0,band:ds[d.id]?.band||'Critical'}))
    .sort((a,b)=>a.score-b.score).slice(0,3);

  // Overall score mini widget [SCORE]
  const ov=rpt.overall||{score:0,band:'Moderate'};
  const band=ov.band||sb(ov.score);
  rrect(ctx,8,y,W-16,18,C.white,C.border,4);
  donutGauge(ctx,rtl?W-20:20,y+9,7,ov.score);
  txt(ctx,ov.score+'%',rtl?W-20:20,y+9,{sz:9,clr:bc(band),bold:true,align:'center'});
  txt(ctx,T(`النتيجة الإجمالية: ${bl(band,lang)}`,`Overall: ${bl(band,lang)}`),
    rtl?W-34:34,y+9,{sz:9,clr:C.blue,bold:true,align:ta,rtl});
  txt(ctx,T(`أعدّت لـ: ${rpt.user?.preferred_name||rpt.user?.name||'—'}`,
            `Prepared for: ${rpt.user?.preferred_name||rpt.user?.name||'—'}`),
    rtl?W-34:34,y+15,{sz:7.5,clr:C.muted,align:ta,rtl});
  y+=22;

  sectionHdr(ctx,T('أولويات التطوير الثلاث','Top 3 Development Priorities'),tx,y+4,rtl);
  y+=13;

  sorted.forEach((d,pi)=>{
    const dClr=D_COLOR[d.idx]||C.blue;
    const content=d.content[d.band]?.[lang]||{};
    const goals=content.goals||{};
    const rowH=52;

    rrect(ctx,8,y,W-16,rowH,C.white,C.border,4);
    // Priority badge [STATIC ordering + SCORE driven sort]
    rrect(ctx,rtl?W-11:8,y,3,rowH,dClr,null,1.5);
    circ(ctx,rtl?W-20:20,y+rowH/2,9,dClr+'22',dClr,.7);
    txt(ctx,String(pi+1),rtl?W-20:20,y+rowH/2,{sz:10,clr:dClr,bold:true,align:'center'});

    // Domain name + score bar [SCORE + CONTENT]
    txt(ctx,d.name[lang],rtl?W-35:35,y+9,{sz:9.5,clr:C.blue,bold:true,align:ta,rtl,mw:W-80});
    // Mini Hogan bar [SCORE]
    hoganBar(ctx,34,y+16,W-48,5,d.score);

    // 3 goal phases [CONTENT driven by band]
    const gw=(W-56)/3;
    [{key:'short',lbl:T('٠–٣٠','0–30'),c:'#C0392B'},
     {key:'mid',  lbl:T('٣٠–٩٠','30–90'),c:'#D68910'},
     {key:'long', lbl:T('٩٠+','90+'),c:'#1E8449'}
    ].forEach((ph,gi)=>{
      const gx=34+gi*(gw+3);
      rrect(ctx,gx,y+24,gw,26,C.light,C.border,3);
      rrect(ctx,gx,y+24,gw,7,ph.c+'cc',null,3);
      txt(ctx,ph.lbl,gx+gw/2,y+27.5,{sz:6,clr:C.white,bold:true,align:'center'});
      wrap(ctx,goals[ph.key]||'',gx+3,y+35,gw-6,4.2,{sz:7,clr:C.text,rtl});
    });

    y+=rowH+5;
  });

  // Monthly reflection template [STATIC]
  if (y<H-52) {
    sectionHdr(ctx,T('قالب المتابعة الشهرية','Monthly Reflection Template'),tx,y+4,rtl);
    y+=13;
    const qW=(W-20)/2;
    [T('ما الذي تحسّن هذا الشهر؟','What improved this month?'),
     T('ما التحديات التي واجهتني؟','What challenges did I face?'),
     T('ما الذي سأعدّل في خطتي؟','What will I adjust?'),
     T('ما ركيزتي للشهر القادم؟','Next month focus?'),
    ].forEach((q,qi)=>{
      const qx=8+(qi%2)*(qW+4), qy=y+Math.floor(qi/2)*22;
      rrect(ctx,qx,qy,qW,20,C.white,C.border,3);
      txt(ctx,q,rtl?qx+qW-5:qx+5,qy+6,{sz:7.5,clr:C.blue,bold:true,align:ta,rtl,mw:qW-10});
      ln(ctx,qx+5,qy+13,qx+qW-5,qy+13,C.border,.3);
      ln(ctx,qx+5,qy+17,qx+qW-5,qy+17,C.border,.3);
    });
  }

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 11 — NEXT STEPS + ABOUT OPTIVANCE  [Mostly STATIC]
// ═══════════════════════════════════════════════════════════════════════════════
function pg_NextSteps(rpt, lang) {
  const { canvas, ctx } = mkPage(C.light);
  const rtl = lang==='ar';
  const T=(ar,en)=>rtl?ar:en;
  const ta=rtl?'right':'left', tx=rtl?W-12:12;

  header(ctx,T('خطوات ما بعد التقرير','Your Next Steps'),11,lang);
  footer(ctx);

  let y=20;

  sectionHdr(ctx,T('خمس خطوات لاستثمار تقريرك','5 Steps to Leverage Your Report'),tx,y+4,rtl);
  y+=13;

  const steps=[
    {n:'01',c:'#1A6FA8',ar:'راجع تقريرك بعمق',      en:'Deep-Review Your Report',
     da:'اقرأ تحليل كل مجال وافهم ما تعنيه نتيجتك', de:'Read each domain and understand your score'},
    {n:'02',c:'#1E8449',ar:'حدد هدفين فوريين',       en:'Set Two Immediate Goals',
     da:'اختر هدفين من قسم ٠–٣٠ يومًا وابدأ بهما اليوم', de:'Pick two 0–30 day goals and start today'},
    {n:'03',c:'#D68910',ar:'شارك نتائجك مع مشرفك',   en:'Share With Your Manager',
     da:'ناقش التقرير مع مشرفك المباشر أو مرشدك المهني',de:'Discuss the report with your manager or mentor'},
    {n:'04',c:'#7B2D8B',ar:'تابع تقدمك شهريًا',       en:'Track Progress Monthly',
     da:'استخدم قالب المتابعة الشهري مرة كل ٣٠ يومًا', de:'Use the monthly reflection template every 30 days'},
    {n:'05',c:C.teal,   ar:'استكشف حلول Optivance',   en:'Explore Optivance Solutions',
     da:'تصفح متجرنا الرقمي للأدوات والتدريبات المتخصصة',de:'Browse our digital store for tools and training'},
  ];

  steps.forEach((s,si)=>{
    const sY=y+si*19;
    rrect(ctx,8,sY,W-16,17,C.white,C.border,4);
    circ(ctx,rtl?W-19:19,sY+8.5,7,s.c+'22',s.c,.7);
    txt(ctx,s.n,rtl?W-19:19,sY+8.5,{sz:7,clr:s.c,bold:true,align:'center'});
    txt(ctx,rtl?s.ar:s.en, rtl?W-31:31,sY+6,  {sz:9,clr:C.blue,bold:true,align:ta,rtl});
    txt(ctx,rtl?s.da:s.de, rtl?W-31:31,sY+12.5,{sz:7.5,clr:C.muted,align:ta,rtl,mw:W-43});
  });
  y+=steps.length*19+8;

  ln(ctx,12,y,W-12,y,C.border,.4);
  y+=5;

  // About Optivance [STATIC]
  sectionHdr(ctx,T('عن Optivance','About Optivance'),tx,y+4,rtl);
  y+=13;

  rrect(ctx,8,y,W-16,48,C.white,C.border,4);
  rrect(ctx,rtl?W-11:8,y,3,48,C.teal,null,1.5);

  wrap(ctx,T(
    'Optivance شركة استشارية متخصصة في تطوير المواهب وبناء القدرات المؤسسية. نساعد الأفراد والمنظمات على تحويل نتائج التقييم إلى نمو مهني حقيقي وقابل للقياس، من خلال حلول مبنية على بيانات دقيقة ومعايير عالمية.',
    'Optivance is a specialized consultancy in talent development and organizational capability building. We help individuals and organizations transform assessment results into real, measurable professional growth through data-driven solutions and global best practices.'),
    rtl?W-15:15,y+9,W-28,5.5,{sz:8.5,clr:C.text,rtl});

  // Contact details [STATIC]
  [{lbl:T('الموقع الإلكتروني','Website'),val:'www.optivance.com'},
   {lbl:T('البريد الإلكتروني','Email'),   val:'info@optivance.com'},
  ].forEach(({lbl,val},ci)=>{
    const cY=y+30+ci*8;
    circ(ctx,rtl?W-16:15,cY,1.5,C.teal,null);
    txt(ctx,lbl+': ',rtl?W-20:19,cY,{sz:7.5,clr:C.muted,align:ta,rtl});
    txt(ctx,val,rtl?W-20:19+(rtl?0:20),cY,{sz:7.5,clr:C.blue,bold:true,align:ta});
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 12 — BACK COVER  [SCORE + USER + STATIC]
// ═══════════════════════════════════════════════════════════════════════════════
function pg_BackCover(rpt, lang) {
  const { canvas, ctx } = mkPage();
  const rtl = lang==='ar';
  const T=(ar,en)=>rtl?ar:en;
  const ov=rpt.overall||{score:0,band:'Moderate'};
  const band=ov.band||sb(ov.score);
  const user=rpt.user||{};

  // Background [STATIC]
  const bg=ctx.createLinearGradient(0,0,0,CH);
  bg.addColorStop(0,'#0A1929'); bg.addColorStop(1,'#0D1F33');
  ctx.fillStyle=bg; ctx.fillRect(0,0,CW,CH);
  ctx.save(); ctx.globalAlpha=.04; ctx.fillStyle=C.teal;
  for (let xi=0;xi<CW;xi+=p(9)) for (let yi=0;yi<CH;yi+=p(9)){
    ctx.beginPath(); ctx.arc(xi,yi,p(.4),0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  rrect(ctx,0,H-2,W,2,C.teal);

  // All 6 domain scores as mini donuts in a row [SCORE]
  DOMAINS.forEach((d,i)=>{
    const ds=rpt.domain_scores||{};
    const dd=ds[d.id]||{score:0,band:'Critical'};
    const dBand=dd.band||sb(dd.score);
    const dx=W/2-((6*20+5*4)/2)+i*24+10;
    donutGauge(ctx,dx,H/2-62,9,dd.score,C.white+'20');
    txt(ctx,dd.score+'%',dx,H/2-62,{sz:7,clr:bc(dBand),bold:true,align:'center'});
    txt(ctx,d.name[lang].split(' ')[0],dx,H/2-50,{sz:5.5,clr:D_COLOR[i],align:'center',rtl});
  });

  // Large overall gauge [SCORE]
  donutGauge(ctx,W/2,H/2-14,28,ov.score,C.white+'25');
  txt(ctx,ov.score+'%',W/2,H/2-14,{sz:26,clr:bc(band),bold:true,align:'center'});
  txt(ctx,T('النتيجة الإجمالية','Your Overall Score'),W/2,H/2+4,{sz:8.5,clr:C.white+'77',align:'center',rtl});

  // Band badge [SCORE]
  rrect(ctx,W/2-24,H/2+9,48,11,bc(band)+'28',bc(band)+'77',5.5);
  txt(ctx,bl(band,lang),W/2,H/2+14.5,{sz:10,clr:bc(band),bold:true,align:'center',rtl});

  // Participant name + date [USER]
  txt(ctx,user.name||'',      W/2,H/2+27,{sz:13,clr:C.white,bold:true,align:'center',rtl});
  txt(ctx,user.completion_date||'',W/2,H/2+36,{sz:8,clr:C.white+'44',align:'center'});

  ln(ctx,40,H/2+42,W-40,H/2+42,C.white+'18',.4);

  // Brand [STATIC]
  txt(ctx,'OPTIVANCE',W/2,H/2+52,{sz:20,clr:C.teal,bold:true,align:'center'});
  txt(ctx,T('بناء المهنيين المتميزين','Building Distinguished Professionals'),W/2,H/2+62,{sz:8,clr:C.white+'55',align:'center',rtl});
  txt(ctx,'www.optivance.com',W/2,H/2+72,{sz:8,clr:C.white+'33',align:'center'});

  // Report ID [USER/SYSTEM]
  txt(ctx,T(`رقم التقرير: ${rpt.report_id||'—'}`,`Report ID: ${rpt.report_id||'—'}`),
    W/2,H-14,{sz:7,clr:C.white+'33',align:'center',rtl});
  txt(ctx,'© 2025 OPTIVANCE — All Rights Reserved',W/2,H-9,{sz:6.5,clr:C.white+'25',align:'center'});

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateCompetencyPDF(reportData, attemptId) {
  const lang = reportData.language || 'ar';

  const pages = [
    pg_FrontCover(reportData, lang),                                         // 1  Front cover
    pg_About(reportData, lang),                                              // 2  About assessment
    pg_Dashboard(reportData, lang),                                          // 3  Radar + Bar chart
    ...DOMAINS.map((_, i) => pg_Domain(reportData, lang, i, i+4)),          // 4–9 Domain deep-dives
    pg_DevPlan(reportData, lang),                                            // 10 Dev plan
    pg_NextSteps(reportData, lang),                                          // 11 Next steps + About
    pg_BackCover(reportData, lang),                                          // 12 Back cover
  ];

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pages.forEach((canvas, i) => {
    if (i > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, W, H, '', 'FAST');
  });

  const name = `optivance-competency-${reportData.report_id || attemptId || 'report'}.pdf`;
  pdf.save(name);
  return name;
}