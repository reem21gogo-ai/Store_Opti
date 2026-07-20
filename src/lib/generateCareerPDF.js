/**
 * OPTIVANCE — Career Orientation Report PDF Engine
 * 9-page A4 RTL bilingual report
 */
import jsPDF from 'jspdf';
import {
  RIASEC_TYPES, WORK_VALUES, SKILLS, PERSONALITY_AXES, STRENGTHS, ENVIRONMENT_AXES,
  OCCUPATIONS, ACTION_PLAN_PHASES, USER_STATUSES, DISCLAIMER, PRODUCT_INFO
} from './careerContent';

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  navy: '#0D1E30', blue: '#336fa3', teal: '#05e1ae', accent: '#4ca9fa',
  white: '#FFFFFF', bg: '#F8FAFC', border: '#E2EAF2',
  text: '#1E2D3D', sub: '#4A6080', muted: '#8EA5BF', light: '#EEF3FA',
};

const RIASEC_COLORS = { R: '#336fa3', I: '#05e1ae', A: '#4ca9fa', S: '#e8704a', E: '#d4a017', C: '#6b7280' };

// ─── CANVAS ───────────────────────────────────────────────────────────────────
const W = 210, H = 297, DPR = 3;
const PX = v => Math.round(v * 3.7795 * DPR);
const CW = PX(W), CH = PX(H);

function newPage(bg = C.white) {
  const cv = document.createElement('canvas');
  cv.width = CW; cv.height = CH;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);
  return { cv, ctx };
}

function rect(ctx, x, y, w, h, fill, stroke, r = 0, sw = 0.3) {
  ctx.save(); ctx.beginPath();
  const [X, Y, W2, H2, R] = [PX(x), PX(y), PX(w), PX(h), PX(r)];
  if (R > 0) {
    ctx.moveTo(X + R, Y); ctx.lineTo(X + W2 - R, Y); ctx.arcTo(X + W2, Y, X + W2, Y + R, R);
    ctx.lineTo(X + W2, Y + H2 - R); ctx.arcTo(X + W2, Y + H2, X + W2 - R, Y + H2, R);
    ctx.lineTo(X + R, Y + H2); ctx.arcTo(X, Y + H2, X, Y + H2 - R, R);
    ctx.lineTo(X, Y + R); ctx.arcTo(X, Y, X + R, Y, R); ctx.closePath();
  } else ctx.rect(X, Y, W2, H2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = PX(sw); ctx.stroke(); }
  ctx.restore();
}

function line(ctx, x1, y1, x2, y2, color, w = 0.25) {
  ctx.save(); ctx.beginPath();
  ctx.moveTo(PX(x1), PX(y1)); ctx.lineTo(PX(x2), PX(y2));
  ctx.strokeStyle = color; ctx.lineWidth = PX(w); ctx.stroke(); ctx.restore();
}

function text(ctx, str, x, y, { size = 9, color = C.text, bold = false, align = 'left', rtl = false, mw } = {}) {
  if (str == null) return;
  ctx.save();
  ctx.font = `${bold ? 700 : 400} ${Math.round(size * PX(1) * 0.37)}px Arial,sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.textBaseline = 'middle';
  const args = [String(str), PX(x), PX(y)];
  if (mw) args.push(PX(mw));
  ctx.fillText(...args); ctx.restore();
}

function wrap(ctx, str, x, y, mw, lh, opts = {}) {
  if (!str) return y;
  const { size = 8, color = C.sub, bold = false, rtl = false } = opts;
  ctx.save();
  ctx.font = `${bold ? 700 : 400} ${Math.round(size * PX(1) * 0.37)}px Arial,sans-serif`;
  ctx.fillStyle = color; ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.textBaseline = 'middle';
  const words = String(str).split(' '), mwPx = PX(mw);
  let line2 = '', cy = PX(y);
  words.forEach((w, i) => {
    const t = line2 ? line2 + ' ' + w : w;
    if (ctx.measureText(t).width > mwPx && i > 0) { ctx.fillText(line2, PX(x), cy); line2 = w; cy += PX(lh); }
    else line2 = t;
  });
  if (line2) ctx.fillText(line2, PX(x), cy);
  ctx.restore();
  return (cy / PX(1)) + lh;
}

function grad(ctx, x, y, w, h, c1, c2, dir = 'h', r = 0) {
  ctx.save();
  const g = dir === 'h' ? ctx.createLinearGradient(PX(x), 0, PX(x + w), 0) : ctx.createLinearGradient(0, PX(y), 0, PX(y + h));
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.beginPath();
  const [X, Y, W2, H2, R] = [PX(x), PX(y), PX(w), PX(h), PX(r)];
  if (R > 0) {
    ctx.moveTo(X + R, Y); ctx.lineTo(X + W2 - R, Y); ctx.arcTo(X + W2, Y, X + W2, Y + R, R);
    ctx.lineTo(X + W2, Y + H2 - R); ctx.arcTo(X + W2, Y + H2, X + W2 - R, Y + H2, R);
    ctx.lineTo(X + R, Y + H2); ctx.arcTo(X, Y + H2, X, Y + H2 - R, R);
    ctx.lineTo(X, Y + R); ctx.arcTo(X, Y, X + R, Y, R); ctx.closePath();
  } else ctx.rect(X, Y, W2, H2);
  ctx.fillStyle = g; ctx.fill(); ctx.restore();
}

function hBar(ctx, x, y, w, h, score, color) {
  rect(ctx, x, y, w, h, C.light, C.border, h / 2, 0.2);
  if (score > 0) { const fw = Math.max((score / 100) * w, h); grad(ctx, x, y, fw, h, color, color + 'AA', 'h', h / 2); }
}

function header(ctx, rpt, pg, lang) {
  const rtl = lang === 'ar';
  const user = rpt.user || {};
  rect(ctx, 0, 0, W, 2.5, C.blue);
  rect(ctx, 0, 2.5, W, 12, C.white);
  line(ctx, 0, 14.5, W, 14.5, C.border, 0.3);
  text(ctx, 'OPTIVANCE', rtl ? W - 12 : 12, 9, { size: 8, color: C.navy, bold: true, align: rtl ? 'right' : 'left' });
  text(ctx, [user.name, user.completion_date].filter(Boolean).join('  ·  '), rtl ? 12 : W - 12, 9, { size: 7, color: C.muted, align: rtl ? 'left' : 'right' });
}

function footer(ctx, pg, rpt, lang) {
  const rtl = lang === 'ar';
  line(ctx, 0, H - 9, W, H - 9, C.border, 0.25);
  text(ctx, 'OPTIVANCE  ·  www.optivance.com', 12, H - 5, { size: 6, color: C.muted });
  text(ctx, String(pg), W - 12, H - 5, { size: 6.5, color: C.sub, bold: true, align: 'right' });
}

function secTitle(ctx, title, x, y, rtl, color = C.blue) {
  text(ctx, title, x, y, { size: 10.5, color, bold: true, align: rtl ? 'right' : 'left', rtl });
  line(ctx, rtl ? x - 50 : x, y + 5, rtl ? x : x + 50, y + 5, C.teal, 1.2);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ═══════════════════════════════════════════════════════════════════════════════
function p1_cover(rpt, lang) {
  const { cv, ctx } = newPage();
  const rtl = lang === 'ar', tr = (a, e) => rtl ? a : e;
  const user = rpt.user || {};
  const holland = rpt.holland || { hollandCode: '---' };

  const bg = ctx.createLinearGradient(0, 0, 0, CH);
  bg.addColorStop(0, '#0B1E30'); bg.addColorStop(0.7, '#102540'); bg.addColorStop(1, '#060F18');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);

  // dot texture
  ctx.save(); ctx.globalAlpha = 0.04; ctx.fillStyle = C.teal;
  for (let xi = 0; xi < CW; xi += PX(9)) for (let yi = 0; yi < CH; yi += PX(9)) { ctx.beginPath(); ctx.arc(xi, yi, PX(0.4), 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();

  // color strip
  rect(ctx, 0, 0, W, 2.5, C.teal);

  const bx = rtl ? W - 12 : 12, ba = rtl ? 'right' : 'left';
  text(ctx, 'OPTIVANCE', bx, 14, { size: 10, color: C.teal, bold: true, align: ba });
  text(ctx, tr('مقياس الميول والتوجّه المهني', 'Career Orientation & Work Environment Fit'), bx, 21, { size: 7, color: C.white + '55', align: ba, rtl });

  // Title
  text(ctx, tr('تقرير', 'Career'), bx, 50, { size: 36, color: C.white, bold: true, align: ba, rtl });
  text(ctx, tr('التوجّه المهني', 'Orientation Report'), bx, 72, { size: 28, color: C.teal, bold: true, align: ba, rtl });
  line(ctx, 12, 82, W - 12, 82, C.white + '18', 0.4);

  // Holland code
  text(ctx, tr('رمز هولاند', 'HOLLAND CODE'), W / 2, 95, { size: 8, color: C.white + '55', align: 'center' });
  text(ctx, holland.hollandCode, W / 2, 112, { size: 42, color: C.teal, bold: true, align: 'center' });

  // Top 3
  if (holland.top3) {
    const tw = W / 3;
    holland.top3.forEach((t, i) => {
      const tx = i * tw + tw / 2;
      const type = RIASEC_TYPES[t.code];
      text(ctx, `${t.code} — ${type?.name[lang] || ''}`, tx, 128, { size: 8, color: C.white, bold: true, align: 'center' });
      text(ctx, t.score + '%', tx, 136, { size: 10, color: C.teal, bold: true, align: 'center' });
    });
  }

  // Profile card
  const cY = 145;
  rect(ctx, 12, cY, W - 24, 70, C.white + '08', C.white + '14', 5);
  text(ctx, tr('بيانات المشارك', 'Participant Profile'), rtl ? W - 18 : 18, cY + 9, { size: 9, color: C.teal, bold: true, align: rtl ? 'right' : 'left', rtl });
  line(ctx, 16, cY + 15, W - 16, cY + 15, C.white + '15', 0.3);

  const fields = [
    [tr('الاسم', 'Name'), user.name || '—'],
    [tr('الوضع الحالي', 'Current Status'), USER_STATUSES[user.status]?.[lang] || '—'],
    [tr('تاريخ الإكمال', 'Date'), user.completion_date || '—'],
    [tr('إصدار المقياس', 'Version'), '1.0'],
  ];
  const cw = (W - 28) / 2;
  fields.forEach(([l, v], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const fx = 14 + col * (cw + 4), fy = cY + 19 + row * 20;
    rect(ctx, fx, fy, cw, 17, C.white + '08', C.white + '15', 3);
    text(ctx, l, rtl ? fx + cw - 5 : fx + 5, fy + 5.5, { size: 6.5, color: C.teal + 'AA', align: rtl ? 'right' : 'left', rtl });
    text(ctx, v, rtl ? fx + cw - 5 : fx + 5, fy + 12, { size: 8.5, color: C.white + 'DD', bold: true, align: rtl ? 'right' : 'left', rtl, mw: cw - 10 });
  });

  // Top careers preview
  const mY = cY + 75;
  rect(ctx, 12, mY, W - 24, 40, C.white + '08', C.white + '14', 5);
  text(ctx, tr('أفضل 3 مسارات مهنية', 'Top 3 Career Matches'), rtl ? W - 18 : 18, mY + 9, { size: 9, color: C.teal, bold: true, align: rtl ? 'right' : 'left', rtl });
  line(ctx, 16, mY + 15, W - 16, mY + 15, C.white + '15', 0.3);
  (rpt.top3Careers || []).forEach((m, i) => {
    const my = mY + 22 + i * 6;
    text(ctx, `${i + 1}. ${tr(m.occupation.title_ar, m.occupation.title_en)}`, rtl ? W - 20 : 20, my, { size: 7.5, color: C.white + 'CC', align: rtl ? 'right' : 'left', rtl });
    text(ctx, m.fitScore + '%', rtl ? 20 : W - 20, my, { size: 7.5, color: C.teal, bold: true, align: rtl ? 'left' : 'right' });
  });

  // Footer
  text(ctx, 'www.optivance.com', W / 2, H - 12, { size: 7, color: C.teal + '44', align: 'center' });
  text(ctx, '© 2025 OPTIVANCE — All Rights Reserved', W / 2, H - 7, { size: 6, color: C.white + '25', align: 'center' });

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — RIASEC
// ═══════════════════════════════════════════════════════════════════════════════
function p2_riasec(rpt, lang) {
  const { cv, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (a, e) => rtl ? a : e;
  const riasec = rpt.riasec || {};
  const holland = rpt.holland || {};

  header(ctx, rpt, 2, lang);
  footer(ctx, 2, rpt, lang);

  let y = 20;
  secTitle(ctx, tr('ملف الميول المهنية (RIASEC)', 'RIASEC Interest Profile'), rtl ? W - 12 : 12, y, rtl);
  y += 8;

  // Holland code badge
  rect(ctx, 8, y, W - 16, 16, C.white, C.border, 4);
  text(ctx, tr('رمز هولاند: ', 'Holland Code: '), rtl ? W - 14 : 14, y + 8, { size: 9, color: C.sub, align: rtl ? 'right' : 'left', rtl });
  text(ctx, holland.hollandCode || '---', rtl ? W - 42 : 42, y + 8, { size: 12, color: C.blue, bold: true, align: rtl ? 'right' : 'left' });
  y += 20;

  // 6 bars
  rect(ctx, 8, y, W - 16, 50, C.white, C.border, 4);
  const sorted = Object.entries(riasec).sort((a, b) => b[1].normalized - a[1].normalized);
  sorted.forEach(([code, data], i) => {
    const type = RIASEC_TYPES[code];
    const by = y + 8 + i * 7.5;
    text(ctx, `${code} — ${type?.name[lang] || ''}`, rtl ? W - 14 : 14, by, { size: 7.5, color: C.text, bold: true, align: rtl ? 'right' : 'left', rtl });
    text(ctx, data.normalized + '%', rtl ? 14 : W - 14, by, { size: 7.5, color: RIASEC_COLORS[code], bold: true, align: rtl ? 'left' : 'right' });
    hBar(ctx, rtl ? 42 : 14, by + 3, W - 56, 3, data.normalized, RIASEC_COLORS[code]);
  });
  y += 54;

  // Top 3 detailed
  if (holland.top3) {
    holland.top3.forEach((t, i) => {
      const type = RIASEC_TYPES[t.code];
      if (!type) return;
      const cH = 38;
      rect(ctx, 8, y, W - 16, cH, C.white, C.border, 4);
      rect(ctx, rtl ? W - 11 : 8, y, 3, cH, RIASEC_COLORS[t.code], null, 1.5);
      text(ctx, `${t.code} — ${type.name[lang]}`, rtl ? W - 14 : 14, y + 7, { size: 9.5, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
      text(ctx, t.score + '%', rtl ? 14 : W - 14, y + 7, { size: 9, color: RIASEC_COLORS[t.code], bold: true, align: rtl ? 'left' : 'right' });
      wrap(ctx, type.description[lang], rtl ? W - 14 : 14, y + 14, W - 28, 4.5, { size: 7.5, color: C.sub, rtl });
      // activities
      text(ctx, tr('الأنشطة: ', 'Activities: ') + type.activities[lang].slice(0, 3).join('، '), rtl ? W - 14 : 14, y + 30, { size: 7, color: C.muted, align: rtl ? 'right' : 'left', rtl, mw: W - 28 });
      y += cH + 3;
    });
  }

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — WORK VALUES
// ═══════════════════════════════════════════════════════════════════════════════
function p3_values(rpt, lang) {
  const { cv, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (a, e) => rtl ? a : e;
  const wv = rpt.workValues || {};

  header(ctx, rpt, 3, lang);
  footer(ctx, 3, rpt, lang);

  let y = 20;
  secTitle(ctx, tr('قيم العمل والتحفيزات', 'Work Values & Motivations'), rtl ? W - 12 : 12, y, rtl);
  y += 8;

  const sorted = Object.entries(wv).sort((a, b) => b[1].normalized - a[1].normalized);
  sorted.forEach(([k, data]) => {
    const val = WORK_VALUES[k];
    const cH = 22;
    rect(ctx, 8, y, W - 16, cH, C.white, C.border, 4);
    rect(ctx, rtl ? W - 11 : 8, y, 3, cH, C.blue, null, 1.5);
    text(ctx, val?.name[lang], rtl ? W - 14 : 14, y + 6, { size: 9, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
    text(ctx, data.normalized + '%', rtl ? 14 : W - 14, y + 6, { size: 9, color: C.blue, bold: true, align: rtl ? 'left' : 'right' });
    hBar(ctx, rtl ? 42 : 14, y + 10, W - 56, 3, data.normalized, C.blue);
    wrap(ctx, val?.description[lang], rtl ? W - 14 : 14, y + 15, W - 28, 4, { size: 7, color: C.muted, rtl });
    y += cH + 2.5;
  });

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — SKILLS
// ═══════════════════════════════════════════════════════════════════════════════
function p4_skills(rpt, lang) {
  const { cv, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (a, e) => rtl ? a : e;
  const skills = rpt.skills || {};

  header(ctx, rpt, 4, lang);
  footer(ctx, 4, rpt, lang);

  let y = 20;
  secTitle(ctx, tr('المهارات والقدرات', 'Skills & Abilities'), rtl ? W - 12 : 12, y, rtl);
  y += 8;

  const sorted = Object.entries(skills).sort((a, b) => b[1].normalized - a[1].normalized);
  const half = Math.ceil(sorted.length / 2);
  const colW = (W - 20) / 2;

  sorted.forEach(([k, data], i) => {
    const skill = SKILLS[k];
    const col = i < half ? 0 : 1;
    const row = i % half;
    const dx = 8 + col * (colW + 4);
    const dy = y + row * 28;
    rect(ctx, dx, dy, colW, 25, C.white, C.border, 4);
    rect(ctx, rtl ? dx + colW - 3 : dx, dy, 3, 25, C.teal, null, 1.5);
    text(ctx, skill?.name[lang], rtl ? dx + colW - 7 : dx + 7, dy + 6, { size: 8.5, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
    text(ctx, data.normalized + '%', rtl ? dx + 7 : dx + colW - 7, dy + 6, { size: 8.5, color: C.teal, bold: true, align: rtl ? 'left' : 'right' });
    hBar(ctx, rtl ? dx + 7 : dx + 7, dy + 11, colW - 14, 3, data.normalized, C.teal);
    wrap(ctx, skill?.description[lang], rtl ? dx + colW - 7 : dx + 7, dy + 16, colW - 14, 3.5, { size: 6.5, color: C.muted, rtl });
  });

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 5 — PERSONALITY + ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════════════════
function p5_personality(rpt, lang) {
  const { cv, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (a, e) => rtl ? a : e;
  const personality = rpt.personality || {};
  const environment = rpt.environment || {};

  header(ctx, rpt, 5, lang);
  footer(ctx, 5, rpt, lang);

  let y = 20;
  secTitle(ctx, tr('الشخصية وأسلوب العمل', 'Personality & Work Style'), rtl ? W - 12 : 12, y, rtl);
  y += 8;

  rect(ctx, 8, y, W - 16, 48, C.white, C.border, 4);
  Object.entries(personality).forEach(([k, v], i) => {
    const axis = PERSONALITY_AXES[k];
    const ay = y + 8 + i * 8;
    text(ctx, axis?.left[lang], rtl ? W - 14 : 14, ay, { size: 6.5, color: C.muted, align: rtl ? 'right' : 'left' });
    text(ctx, axis?.right[lang], rtl ? 14 : W - 14, ay, { size: 6.5, color: C.muted, align: rtl ? 'left' : 'right' });
    // bar
    rect(ctx, 40, ay + 2, W - 80, 3, C.light, C.border, 1.5, 0.2);
    const nx = 40 + (v.normalized / 100) * (W - 80);
    rect(ctx, nx - 1, ay, 2, 7, C.blue, null, 1);
  });
  y += 52;

  secTitle(ctx, tr('تفضيلات بيئة العمل', 'Work Environment Preferences'), rtl ? W - 12 : 12, y, rtl);
  y += 8;

  rect(ctx, 8, y, W - 16, 72, C.white, C.border, 4);
  Object.entries(environment).forEach(([k, v], i) => {
    const axis = ENVIRONMENT_AXES[k];
    const col = i % 2, row = Math.floor(i / 2);
    const dx = 10 + col * ((W - 20) / 2);
    const dy = y + 8 + row * 16;
    text(ctx, axis?.name[lang], rtl ? dx + (W - 20) / 2 - 3 : dx + 3, dy, { size: 7, color: C.sub, bold: true, align: rtl ? 'right' : 'left', rtl });
    text(ctx, v.normalized > 50 ? axis?.right[lang] : axis?.left[lang], rtl ? dx + 3 : dx + (W - 20) / 2 - 3, dy + 5, { size: 6.5, color: C.accent, bold: true, align: rtl ? 'left' : 'right' });
    hBar(ctx, rtl ? dx + 3 : dx + 3, dy + 9, (W - 20) / 2 - 6, 2.5, v.normalized, C.accent);
  });

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 6 — STRENGTHS
// ═══════════════════════════════════════════════════════════════════════════════
function p6_strengths(rpt, lang) {
  const { cv, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (a, e) => rtl ? a : e;
  const strengths = rpt.strengths || {};

  header(ctx, rpt, 6, lang);
  footer(ctx, 6, rpt, lang);

  let y = 20;
  secTitle(ctx, tr('نقاط القوة المهنية', 'Natural Professional Strengths'), rtl ? W - 12 : 12, y, rtl);
  y += 8;

  const sorted = Object.entries(strengths).sort((a, b) => b[1].normalized - a[1].normalized);
  sorted.forEach(([k, data]) => {
    const str = STRENGTHS[k];
    const cH = 24;
    rect(ctx, 8, y, W - 16, cH, C.white, C.border, 4);
    rect(ctx, rtl ? W - 11 : 8, y, 3, cH, C.teal, null, 1.5);
    text(ctx, str?.name[lang], rtl ? W - 14 : 14, y + 6, { size: 9, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
    text(ctx, data.normalized + '%', rtl ? 14 : W - 14, y + 6, { size: 9, color: C.teal, bold: true, align: rtl ? 'left' : 'right' });
    hBar(ctx, rtl ? 42 : 14, y + 10, W - 56, 3, data.normalized, C.teal);
    wrap(ctx, str?.description[lang], rtl ? W - 14 : 14, y + 16, W - 28, 4, { size: 7, color: C.muted, rtl });
    y += cH + 2.5;
  });

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 7 — CAREERS
// ═══════════════════════════════════════════════════════════════════════════════
function p7_careers(rpt, lang) {
  const { cv, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (a, e) => rtl ? a : e;
  const top6 = rpt.top6Careers || (rpt.careerMatches || []).slice(0, 6);
  const alt = rpt.alternativeCareers || (rpt.careerMatches || []).slice(6, 9);

  header(ctx, rpt, 7, lang);
  footer(ctx, 7, rpt, lang);

  let y = 20;
  secTitle(ctx, tr('المسارات المهنية المطابقة', 'Matching Career Paths'), rtl ? W - 12 : 12, y, rtl);
  y += 8;

  // Top families
  if (rpt.topFamilies?.length) {
    rect(ctx, 8, y, W - 16, 10, C.white, C.border, 4);
    text(ctx, tr('أفضل العائلات المهنية: ', 'Top Career Families: ') + rpt.topFamilies.join('، '), rtl ? W - 14 : 14, y + 5, { size: 7.5, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
    y += 13;
  }

  // Top 6
  top6.forEach((m, i) => {
    const cH = 20;
    rect(ctx, 8, y, W - 16, cH, C.white, C.border, 4);
    text(ctx, `${i + 1}. ${tr(m.occupation.title_ar, m.occupation.title_en)}`, rtl ? W - 14 : 14, y + 5, { size: 8.5, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
    text(ctx, m.fitScore + '%', rtl ? 14 : W - 14, y + 5, { size: 10, color: C.blue, bold: true, align: rtl ? 'left' : 'right' });
    // components
    const comps = [
      tr('ميول', 'Int') + ': ' + m.components.riasec + '%',
      tr('مهارات', 'Skl') + ': ' + m.components.skills + '%',
      tr('قيم', 'Val') + ': ' + m.components.values + '%',
      tr('قوة', 'Str') + ': ' + m.components.strengths + '%',
    ];
    text(ctx, comps.join('  ·  '), rtl ? W - 14 : 14, y + 12, { size: 6.5, color: C.muted, align: rtl ? 'right' : 'left', rtl });
    text(ctx, tr(m.occupation.family_ar, m.occupation.family_en), rtl ? W - 14 : 14, y + 16, { size: 6.5, color: C.sub, align: rtl ? 'right' : 'left', rtl });
    y += cH + 2;
  });

  // Alternatives
  if (alt.length) {
    y += 2;
    secTitle(ctx, tr('مسارات بديلة', 'Alternative Careers'), rtl ? W - 12 : 12, y, rtl);
    y += 8;
    const cw = (W - 20) / 3;
    alt.forEach((m, i) => {
      const dx = 8 + i * (cw + 2);
      rect(ctx, dx, y, cw, 22, C.white, C.border, 4);
      text(ctx, tr(m.occupation.title_ar, m.occupation.title_en), dx + cw / 2, y + 6, { size: 7.5, color: C.blue, bold: true, align: 'center', mw: cw - 6 });
      text(ctx, m.fitScore + '%', dx + cw / 2, y + 13, { size: 9, color: C.teal, bold: true, align: 'center' });
      text(ctx, tr(m.occupation.family_ar, m.occupation.family_en), dx + cw / 2, y + 18, { size: 6, color: C.muted, align: 'center', mw: cw - 6 });
    });
  }

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 8 — DEVELOPMENT GAPS
// ═══════════════════════════════════════════════════════════════════════════════
function p8_gaps(rpt, lang) {
  const { cv, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (a, e) => rtl ? a : e;
  const skills = rpt.skills || {};
  const strengths = rpt.strengths || {};
  const top3 = rpt.top3Careers || [];

  header(ctx, rpt, 8, lang);
  footer(ctx, 8, rpt, lang);

  let y = 20;
  secTitle(ctx, tr('فجوات التطوير والتوصيات', 'Development Gaps & Recommendations'), rtl ? W - 12 : 12, y, rtl);
  y += 8;

  // Lowest skills
  rect(ctx, 8, y, W - 16, 40, C.white, C.border, 4);
  text(ctx, tr('مهارات تحتاج تطوير', 'Skills Needing Development'), rtl ? W - 14 : 14, y + 7, { size: 9, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
  line(ctx, 12, y + 12, W - 12, y + 12, C.border, 0.3);
  const lowSkills = Object.entries(skills).sort((a, b) => a[1].normalized - b[1].normalized).slice(0, 3);
  lowSkills.forEach(([k, data], i) => {
    const sy = y + 18 + i * 7;
    text(ctx, `• ${SKILLS[k]?.name[lang]} — ${data.normalized}%`, rtl ? W - 16 : 16, sy, { size: 7.5, color: C.sub, align: rtl ? 'right' : 'left', rtl });
  });
  y += 44;

  // Lowest strengths
  rect(ctx, 8, y, W - 16, 32, C.white, C.border, 4);
  text(ctx, tr('نقاط قوة تحتاج تعزيز', 'Strengths to Reinforce'), rtl ? W - 14 : 14, y + 7, { size: 9, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
  line(ctx, 12, y + 12, W - 12, y + 12, C.border, 0.3);
  const lowStr = Object.entries(strengths).sort((a, b) => a[1].normalized - b[1].normalized).slice(0, 2);
  lowStr.forEach(([k, data], i) => {
    const sy = y + 18 + i * 6;
    text(ctx, `• ${STRENGTHS[k]?.name[lang]} — ${data.normalized}%`, rtl ? W - 16 : 16, sy, { size: 7.5, color: C.sub, align: rtl ? 'right' : 'left', rtl });
  });
  y += 36;

  // Career-specific gaps
  if (top3[0]) {
    const m = top3[0];
    rect(ctx, 8, y, W - 16, 50, C.white, C.border, 4);
    text(ctx, tr('فجوة التطوير للمسار الأفضل', 'Development Gap for Top Career'), rtl ? W - 14 : 14, y + 7, { size: 9, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
    line(ctx, 12, y + 12, W - 12, y + 12, C.border, 0.3);
    text(ctx, tr(m.occupation.title_ar, m.occupation.title_en), rtl ? W - 14 : 14, y + 18, { size: 8.5, color: C.blue, bold: true, align: rtl ? 'right' : 'left', rtl });
    wrap(ctx, tr('المؤهل المطلوب: ' + m.occupation.education_ar, 'Required: ' + m.occupation.education_en), rtl ? W - 14 : 14, y + 25, W - 28, 4.5, { size: 7.5, color: C.sub, rtl });
    text(ctx, tr('الخطوة التالية: ', 'Next Step: '), rtl ? W - 14 : 14, y + 36, { size: 7.5, color: C.teal, bold: true, align: rtl ? 'right' : 'left', rtl });
    wrap(ctx, tr(m.occupation.pathways_ar[0], m.occupation.pathways_en[0]), rtl ? W - 28 : 28, y + 36, W - 42, 4.5, { size: 7.5, color: C.sub, rtl });
  }

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 9 — ACTION PLAN + DISCLAIMER
// ═══════════════════════════════════════════════════════════════════════════════
function p9_plan(rpt, lang) {
  const { cv, ctx } = newPage(C.bg);
  const rtl = lang === 'ar', tr = (a, e) => rtl ? a : e;
  const user = rpt.user || {};
  const status = user.status || 'job_seeker';

  header(ctx, rpt, 9, lang);
  footer(ctx, 9, rpt, lang);

  let y = 20;
  secTitle(ctx, tr('خطة 90 يومًا', '90-Day Action Plan'), rtl ? W - 12 : 12, y, rtl);
  text(ctx, tr('مخصصة لـ: ', 'Personalized for: ') + (USER_STATUSES[status]?.[lang] || ''), rtl ? W - 12 : 12, y + 6, { size: 7.5, color: C.muted, align: rtl ? 'right' : 'left', rtl });
  y += 12;

  ACTION_PLAN_PHASES.forEach((phase, pi) => {
    const tasks = phase.tasks[status] || phase.tasks.job_seeker;
    const pH = 14 + tasks.length * 6 + 4;
    rect(ctx, 8, y, W - 16, pH, C.white, C.border, 4);
    rect(ctx, rtl ? W - 11 : 8, y, 3, pH, phase.color, null, 1.5);
    text(ctx, `${tr(phase.name.ar, phase.name.en)} — ${tr(phase.days.ar, phase.days.en)}`, rtl ? W - 14 : 14, y + 7, { size: 9, color: phase.color, bold: true, align: rtl ? 'right' : 'left', rtl });
    line(ctx, 12, y + 11, W - 12, y + 11, C.border, 0.3);
    tasks.forEach((task, ti) => {
      const ty = y + 16 + ti * 6;
      text(ctx, '•', rtl ? W - 16 : 16, ty, { size: 8, color: phase.color, bold: true, align: 'center' });
      text(ctx, tr(task.ar || task, task.en || task), rtl ? W - 20 : 20, ty, { size: 7.5, color: C.sub, align: rtl ? 'right' : 'left', rtl, mw: W - 36 });
    });
    y += pH + 3;
  });

  // Methodology + disclaimer
  y += 2;
  rect(ctx, 8, y, W - 16, 28, C.navy, null, 4);
  text(ctx, tr('المنهجية وإخلاء المسؤولية', 'Methodology & Disclaimer'), W / 2, y + 7, { size: 8.5, color: C.teal, bold: true, align: 'center', rtl });
  wrap(ctx, DISCLAIMER[lang], 14, y + 13, W - 28, 4.5, { size: 7, color: C.white + '88', rtl });
  text(ctx, 'Powered by Optivance  ·  www.optivance.com', W / 2, y + 24, { size: 6.5, color: C.teal + '88', align: 'center' });

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateCareerPDF(reportData, attemptId) {
  const lang = reportData.user?.language || 'ar';
  const pages = [
    p1_cover(reportData, lang),
    p2_riasec(reportData, lang),
    p3_values(reportData, lang),
    p4_skills(reportData, lang),
    p5_personality(reportData, lang),
    p6_strengths(reportData, lang),
    p7_careers(reportData, lang),
    p8_gaps(reportData, lang),
    p9_plan(reportData, lang),
  ];
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pages.forEach((cv, i) => {
    if (i > 0) pdf.addPage();
    pdf.addImage(cv.toDataURL('image/png', 1.0), 'PNG', 0, 0, W, H, '', 'FAST');
  });
  const name = `optivance-career-${reportData.user?.name || attemptId || 'report'}.pdf`;
  pdf.save(name);
  return name;
}