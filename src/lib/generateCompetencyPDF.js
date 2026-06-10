/**
 * generateCompetencyPDF — Optivance Premium Report Engine
 * Inspired by Hogan + Thomas HPTI aesthetic
 * - Circular gauge per domain (HPTI-style)
 * - Independent page per domain (Hogan-style)
 * - Sub-competency bars
 * - Overview wheel (Gallup-style)
 * - A4 @ 3× resolution for crisp PDF output
 */
import jsPDF from 'jspdf';
import { DOMAINS, BAND_CONFIG, OVERALL_SUMMARIES, LEVEL_LABELS } from './competencyContent';

// ── Brand palette ─────────────────────────────────────────────────────────────
const B = {
  navy:      '#0D2137',
  primary:   '#1A3A5C',
  teal:      '#05E1AE',
  tealDark:  '#04C49A',
  white:     '#FFFFFF',
  offwhite:  '#F8FAFC',
  light:     '#F1F5F9',
  line:      '#E2E8F0',
  muted:     '#94A3B8',
  text:      '#334155',
  dark:      '#0F172A',
};

// Band colors (Strong → green, Proficient → blue, Moderate → amber, Critical → red)
const BAND = {
  Strong:    { clr:'#059669', light:'#D1FAE5', label:{ar:'متميز',    en:'Strong'}    },
  Proficient:{ clr:'#2563EB', light:'#DBEAFE', label:{ar:'متمكن',    en:'Proficient'} },
  Moderate:  { clr:'#D97706', light:'#FEF3C7', label:{ar:'متوسط',    en:'Moderate'}  },
  Critical:  { clr:'#DC2626', light:'#FEE2E2', label:{ar:'يحتاج تطوير', en:'Developing'} },
};

const bc  = (band) => BAND[band]?.clr   || B.muted;
const bg  = (band) => BAND[band]?.light || '#F1F5F9';
const bl  = (band, lang) => BAND[band]?.label?.[lang] || band;

// Domain colors (fixed identity per domain)
const D_COLORS = ['#7C3AED','#2563EB','#059669','#D97706','#DC2626','#0891B2'];

// ── Canvas setup (A4 @ 3×) ───────────────────────────────────────────────────
const W = 210, H = 297, SC = 3, R = 3.7795 * SC;
const px = v => Math.round(v * R);
const CW = px(W), CH = px(H);

function mkPage() {
  const canvas = document.createElement('canvas');
  canvas.width = CW; canvas.height = CH;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = B.white;
  ctx.fillRect(0, 0, CW, CH);
  return { canvas, ctx };
}

// ── Drawing primitives ────────────────────────────────────────────────────────
function rr(ctx, x, y, w, h, fill, stroke, r=0, sw=0.4) {
  ctx.save();
  const [X,Y,W2,H2,R2]=[px(x),px(y),px(w),px(h),px(r)];
  ctx.beginPath();
  if(R2){
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
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=px(sw);ctx.stroke();}
  ctx.restore();
}

function gr(ctx, x, y, w, h, c1, c2, dir='h', r=0) {
  const g = dir==='h'
    ? ctx.createLinearGradient(px(x),px(y),px(x+w),px(y))
    : ctx.createLinearGradient(px(x),px(y),px(x),px(y+h));
  g.addColorStop(0,c1); g.addColorStop(1,c2);
  rr(ctx,x,y,w,h,g,null,r);
}

function circ(ctx, cx, cy, r, fill, stroke, sw=0.5) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(px(cx),px(cy),px(r),0,Math.PI*2);
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=px(sw);ctx.stroke();}
  ctx.restore();
}

function hline(ctx, x1, y, x2, color, w=0.3) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(px(x1),px(y));ctx.lineTo(px(x2),px(y));
  ctx.strokeStyle=color;ctx.lineWidth=px(w);ctx.stroke();
  ctx.restore();
}

function bar(ctx, x, y, w, h, pct, fg, bg2=B.light, r=1) {
  rr(ctx,x,y,w,h,bg2,null,r);
  if(pct>0) {
    const fw = Math.max(w*(pct/100),r*2);
    rr(ctx,x,y,fw,h,fg,null,r);
  }
}

// ── Text helpers ──────────────────────────────────────────────────────────────
function setF(ctx, size, weight='normal') {
  const fs = Math.round(size*R*0.37);
  ctx.font = `${weight==='bold'?'700':weight==='semi'?'600':'400'} ${fs}px Arial, sans-serif`;
}

function txt(ctx, text, x, y, {size=9,color=B.text,weight='normal',align='left',isRTL=false,maxW}={}) {
  ctx.save();
  setF(ctx,size,weight);
  ctx.fillStyle=color;
  ctx.textAlign=align;
  ctx.direction=isRTL?'rtl':'ltr';
  ctx.textBaseline='middle';
  const args=[String(text),px(x),px(y)];
  if(maxW) args.push(px(maxW));
  ctx.fillText(...args);
  ctx.restore();
}

function wrap(ctx, text, x, y, maxW, lineH, {size=8.5,color=B.text,weight='normal',isRTL=false}={}) {
  ctx.save();
  setF(ctx,size,weight);
  ctx.fillStyle=color;ctx.textBaseline='middle';ctx.direction=isRTL?'rtl':'ltr';
  const words=String(text).split(' ');
  const mW=px(maxW);
  let line='',curY=px(y),lhPx=px(lineH);
  words.forEach((w2,i)=>{
    const test=line?line+' '+w2:w2;
    if(ctx.measureText(test).width>mW&&i>0){ctx.fillText(line,px(x),curY);line=w2;curY+=lhPx;}
    else{line=test;}
  });
  if(line) ctx.fillText(line,px(x),curY);
  ctx.restore();
  return ((curY-px(y))/lhPx+1)*lineH;
}

// ── Circular gauge (HPTI-style) ───────────────────────────────────────────────
// Draws a half-arc gauge: Low | Moderate | Proficient | Strong
// with needle/fill showing the actual score
function gauge(ctx, cx, cy, r, pct, color, trackColor=B.line) {
  const X=px(cx), Y=px(cy), R=px(r), LW=px(r*0.28);
  // Track (half circle, left to right, bottom flat)
  ctx.save();
  ctx.beginPath();
  ctx.arc(X,Y,R,Math.PI,0);
  ctx.strokeStyle=trackColor;
  ctx.lineWidth=LW;
  ctx.lineCap='round';
  ctx.stroke();
  ctx.restore();
  // 4 zone markers
  const zones=[
    {from:Math.PI,   to:Math.PI*1.25, c:'#FEE2E2'},
    {from:Math.PI*1.25,to:Math.PI*1.5,c:'#FEF3C7'},
    {from:Math.PI*1.5, to:Math.PI*1.75,c:'#DBEAFE'},
    {from:Math.PI*1.75,to:Math.PI*2,  c:'#D1FAE5'},
  ];
  zones.forEach(z=>{
    ctx.save();
    ctx.beginPath();
    ctx.arc(X,Y,R,z.from,z.to);
    ctx.strokeStyle=z.c;
    ctx.lineWidth=LW;
    ctx.lineCap='butt';
    ctx.stroke();
    ctx.restore();
  });
  // Score fill
  if(pct>0){
    const end = Math.PI + (pct/100)*Math.PI;
    ctx.save();
    ctx.beginPath();
    ctx.arc(X,Y,R,Math.PI,end);
    ctx.strokeStyle=color;
    ctx.lineWidth=LW;
    ctx.lineCap='round';
    ctx.stroke();
    ctx.restore();
    // Needle dot at end
    const nx=X+R*Math.cos(end), ny=Y+R*Math.sin(end);
    ctx.save();
    ctx.beginPath();
    ctx.arc(nx,ny,LW*0.55,0,Math.PI*2);
    ctx.fillStyle=color;ctx.fill();
    ctx.restore();
  }
  // Zone labels
  const lSize=px(3.5);
  ctx.save();
  ctx.font=`400 ${lSize}px Arial`;
  ctx.fillStyle=B.muted;ctx.textBaseline='middle';ctx.textAlign='center';
  const labels=[
    {a:Math.PI*1.08,  t:''},
    {a:Math.PI*1.25,  t:''},
    {a:Math.PI*1.375, t:''},
    {a:Math.PI*1.5,   t:''},
    {a:Math.PI*1.625, t:''},
    {a:Math.PI*1.75,  t:''},
    {a:Math.PI*1.92,  t:''},
  ];
  ctx.restore();
  // Tick marks at zone boundaries
  [Math.PI, Math.PI*1.25, Math.PI*1.5, Math.PI*1.75, Math.PI*2].forEach(a=>{
    const OR=R+LW*0.6, IR=R-LW*0.6;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(X+IR*Math.cos(a),Y+IR*Math.sin(a));
    ctx.lineTo(X+OR*Math.cos(a),Y+OR*Math.sin(a));
    ctx.strokeStyle=B.white;ctx.lineWidth=px(0.5);ctx.stroke();
    ctx.restore();
  });
}

// ── Shared header / footer ────────────────────────────────────────────────────
function pageHeader(ctx, title, pageNum, lang, accent=B.primary) {
  const isRTL=lang==='ar';
  const t=(ar,en)=>isRTL?ar:en;
  // Top bar gradient
  gr(ctx,0,0,W,14,B.navy,B.primary,'h');
  rr(ctx,0,14,W,1.2,B.teal);
  // Brand pill
  rr(ctx,isRTL?W-42:6,3,36,8,B.teal+'28',B.teal+'66',4);
  txt(ctx,'OPTIVANCE',isRTL?W-24:24,7,{size:7,color:B.teal,weight:'bold',align:'center'});
  // Title
  txt(ctx,title,isRTL?W-44:44,7,{size:9.5,color:B.white,weight:'bold',align:isRTL?'right':'left',isRTL});
  // Page badge
  const bx=isRTL?4:W-20;
  rr(ctx,bx,3,16,8,accent,null,4);
  txt(ctx,String(pageNum),bx+8,7,{size:7,color:B.white,weight:'bold',align:'center'});
}

function pageFooter(ctx, lang) {
  rr(ctx,0,H-6,W,6,B.navy);
  hline(ctx,0,H-6,W,B.teal+'44',0.4);
  txt(ctx,'OPTIVANCE  •  www.optivance.com  •  info@optivance.com  •  © 2025',
    W/2,H-3,{size:5.5,color:B.white+'55',align:'center'});
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — PREMIUM COVER
// ═══════════════════════════════════════════════════════════════════════════════
function buildCover(rpt, lang) {
  const {canvas,ctx}=mkPage();
  const isRTL=lang==='ar';
  const t=(ar,en)=>isRTL?ar:en;
  const user=rpt.user||{};
  const ov=rpt.overall||{score:0,band:'Moderate'};
  const bClr=bc(ov.band);
  const lbl=LEVEL_LABELS[user.professional_level]?.[lang]||user.professional_level||'—';

  // Full dark background
  gr(ctx,0,0,W,H,B.navy,'#0A1929','v');

  // Right accent strip
  gr(ctx,W-60,0,60,H,B.primary+'55',B.teal+'05','v');
  hline(ctx,W-60,0,W-60,H,B.teal+'22',0.4);

  // Top teal bar
  gr(ctx,0,0,W,2.5,B.teal,B.tealDark,'h');

  // Dot pattern overlay
  ctx.save();ctx.globalAlpha=0.03;ctx.fillStyle=B.teal;
  for(let xi=0;xi<CW;xi+=px(8)) for(let yi=0;yi<CH;yi+=px(8)){
    ctx.beginPath();ctx.arc(xi,yi,px(0.5),0,Math.PI*2);ctx.fill();
  }
  ctx.restore();

  // Logo
  const lx=isRTL?W-52:8;
  rr(ctx,lx,12,44,12,B.teal+'22',B.teal+'66',6);
  txt(ctx,'OPTIVANCE',lx+22,18,{size:9,color:B.teal,weight:'bold',align:'center'});

  // Subtitle tag
  rr(ctx,isRTL?W-8-90:8,30,90,8,B.white+'12',B.white+'30',4);
  txt(ctx,t('تقرير الكفاءات المهنية','Professional Competency Report'),
    isRTL?W-53:53,34,{size:7,color:B.white+'bb',align:'center',isRTL});

  // Main title
  const tx=isRTL?W-10:10;
  const ta=isRTL?'right':'left';
  txt(ctx,t('تقرير','Competency'),tx,56,{size:30,color:B.white,weight:'bold',align:ta,isRTL});
  txt(ctx,t('الجدارات المهنية','& Growth Report'),tx,75,{size:30,color:B.teal,weight:'bold',align:ta,isRTL});

  // Tagline
  wrap(ctx,
    t('تقييم علمي معمّق • ٢٠ جدارة • ٦ مجالات رئيسية','Scientific assessment • 20 competencies • 6 key domains'),
    isRTL?W-10:10,87,isRTL?W-70:W-70,6,{size:8.5,color:B.white+'66',isRTL});

  // Divider
  gr(ctx,10,97,W-20,0.8,B.teal+'77',B.primary+'22','h');

  // Score gauge large — cover
  const gcx=isRTL?38:W-38, gcy=68;
  circ(ctx,gcx,gcy,20,B.white+'08');
  circ(ctx,gcx,gcy,16,null,B.white+'15',0.5);
  gauge(ctx,gcx,gcy,13,ov.score,bClr,B.white+'20');
  txt(ctx,ov.score+'%',gcx,gcy-1,{size:15,color:B.white,weight:'bold',align:'center'});
  txt(ctx,t('نتيجتك','Your Score'),gcx,gcy+7,{size:6.5,color:B.white+'66',align:'center'});
  rr(ctx,gcx-14,gcy+12,28,8,bClr+'33',bClr,4);
  txt(ctx,bl(ov.band,lang),gcx,gcy+16,{size:7,color:bClr,weight:'bold',align:'center'});

  // Profile grid
  const fields=[
    [t('الاسم الكامل','Full Name'),         user.name||'—'],
    [t('المستوى المهني','Level'),            lbl],
    [t('نسخة المقياس','Version'),           rpt.version==='full'?t('الكاملة','Full'):t('السريعة','Quick')],
    [t('تاريخ الإكمال','Completion Date'),  user.completion_date||'—'],
    [t('رقم التقرير','Report ID'),          rpt.report_id||'—'],
    [t('اللغة','Language'),                 lang==='ar'?'العربية':'English'],
  ];
  const cw2=(W-24)/2;
  fields.forEach(([l2,v],i)=>{
    const col=i%2,row=Math.floor(i/2);
    const fx=8+col*(cw2+4),fy=103+row*23;
    rr(ctx,fx,fy,cw2,20,B.white+'0d',B.white+'1d',3);
    txt(ctx,l2,isRTL?fx+cw2-5:fx+5,fy+7,{size:6.5,color:B.teal+'cc',align:isRTL?'right':'left',isRTL});
    txt(ctx,v, isRTL?fx+cw2-5:fx+5,fy+14.5,{size:8.5,color:B.white+'dd',weight:'bold',align:isRTL?'right':'left',isRTL,maxW:cw2-10});
  });

  // Bottom strip
  gr(ctx,0,H-35,W,35,B.navy+'ee',B.navy,'v');
  hline(ctx,10,H-33,W-10,B.teal+'22',0.4);
  const pills=[t('٢٠ جدارة','20 Competencies'),t('٦ مجالات','6 Domains'),t('نتائج فورية','Instant Results')];
  const pw=(W-28)/3;
  pills.forEach((s,i)=>{
    const px2=8+i*(pw+4);
    rr(ctx,px2,H-29,pw,10,B.white+'0a',B.white+'20',5);
    txt(ctx,s,px2+pw/2,H-24,{size:7,color:B.white+'bb',align:'center',isRTL});
  });
  txt(ctx,'www.optivance.com  •  © 2025 OPTIVANCE',W/2,H-12,{size:6.5,color:B.teal+'55',align:'center'});

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — OVERVIEW DASHBOARD (6 Gauges + Spider summary)
// ═══════════════════════════════════════════════════════════════════════════════
function buildDashboard(rpt, lang) {
  const {canvas,ctx}=mkPage();
  const isRTL=lang==='ar';
  const t=(ar,en)=>isRTL?ar:en;
  const ds=rpt.domain_scores||{};
  const ov=rpt.overall||{score:0,band:'Moderate'};
  const lk=lang;

  pageHeader(ctx,t('لمحة النتائج العامة','Overall Results Dashboard'),2,lang);
  pageFooter(ctx,lang);

  let y=20;

  // Overall score hero band
  gr(ctx,0,y,W,22,B.offwhite,B.light,'v');
  hline(ctx,0,y+22,W,B.line,0.4);

  // Big score circle
  const scx=isRTL?W-28:28;
  circ(ctx,scx,y+11,9,B.white,B.line,0.5);
  gauge(ctx,scx,y+11,7,ov.score,bc(ov.band),B.line);
  txt(ctx,ov.score+'%',scx,y+11,{size:9,color:B.primary,weight:'bold',align:'center'});

  // Overall info
  const ox=isRTL?W-44:44;
  txt(ctx,t('النتيجة الإجمالية','Overall Score'),ox,y+6,{size:8.5,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
  rr(ctx,isRTL?ox-30:ox,y+9,28,7,bc(ov.band)+'22',bc(ov.band),3.5);
  txt(ctx,bl(ov.band,lang),(isRTL?ox-30:ox)+14,y+12.5,{size:7,color:bc(ov.band),weight:'bold',align:'center'});
  txt(ctx,t('مبني على ٢٠ جدارة في ٦ مجالات رئيسية','Based on 20 competencies across 6 key domains'),
    isRTL?W-44:44,y+20,{size:7,color:B.muted,align:isRTL?'right':'left',isRTL});

  // Band legend
  const bands=['Critical','Moderate','Proficient','Strong'];
  const blegW=(W-20)/4;
  bands.forEach((b,i)=>{
    const bx=8+i*blegW+blegW/2;
    rr(ctx,8+i*blegW,y+22,blegW-2,0,null,null);
    // tiny color swatch above line
    // already covered by footer bands
  });

  y+=26;

  // ── 6 Domain Gauges (2×3 grid) ─────────────────────────────────────────────
  txt(ctx,t('نتائج المجالات الستة','Six Domain Results'),isRTL?W-8:8,y+3,
    {size:10,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
  y+=9;

  const gW=(W-24)/2;   // 2 cols
  const gH=55;          // row height
  DOMAINS.forEach((d,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const gx=8+col*(gW+4), gy=y+row*(gH+4);
    const domData=ds[d.id]||{score:0,band:'Critical'};
    const dClr=D_COLORS[i]||B.primary;
    const bClr2=bc(domData.band);

    // Card
    rr(ctx,gx,gy,gW,gH,B.white,B.line,3);
    // Left accent strip (domain color)
    rr(ctx,isRTL?gx+gW-3:gx,gy,3,gH,dClr,null,1.5);

    // Gauge (right/left depending on RTL)
    const gcX=isRTL?gx+14:gx+gW-14, gcY=gy+gH/2-2;
    gauge(ctx,gcX,gcY,10,domData.score,bClr2,B.line);
    txt(ctx,domData.score+'%',gcX,gcY,{size:8,color:bClr2,weight:'bold',align:'center'});

    // Domain name + band
    const tx2=isRTL?gx+gW-8:gx+8;
    txt(ctx,d.name[lk],tx2,gy+10,{size:8.5,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:gW-32});
    txt(ctx,d.description[lk],tx2,gy+17,{size:6.5,color:B.muted,align:isRTL?'right':'left',isRTL,maxW:gW-32});

    rr(ctx,isRTL?gx+gW-8-26:gx+7,gy+22,26,7,bClr2+'22',bClr2+'66',3.5);
    txt(ctx,bl(domData.band,lang),(isRTL?gx+gW-8-26:gx+7)+13,gy+25.5,{size:6.5,color:bClr2,weight:'bold',align:'center'});

    // Progress bar
    bar(ctx,isRTL?gx+5:gx+5,gy+gH-12,gW-10,4,domData.score,bClr2,B.line,2);
    txt(ctx,domData.score+'%',isRTL?gx+8:gx+gW-8,gy+gH-18,{size:6,color:bClr2,weight:'bold',align:isRTL?'left':'right',isRTL});
  });

  y+=3*(gH+4)+4;

  // Band legend row
  const bW=(W-20)/4;
  ['Critical','Moderate','Proficient','Strong'].forEach((b,i)=>{
    const bx=8+i*bW;
    rr(ctx,bx+1,y,bW-2,8,bc(b)+'18',bc(b)+'55',4);
    txt(ctx,bl(b,lang),bx+bW/2,y+4,{size:6.5,color:bc(b),weight:'bold',align:'center'});
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGES 3–8 — ONE PAGE PER DOMAIN (Hogan-style)
// ═══════════════════════════════════════════════════════════════════════════════
function buildDomainPage(rpt, lang, domainIndex, pageNum) {
  const {canvas,ctx}=mkPage();
  const isRTL=lang==='ar';
  const t=(ar,en)=>isRTL?ar:en;
  const ds=rpt.domain_scores||{};
  const subs=rpt.sub_competency_scores||{};
  const lk=lang;

  const domain=DOMAINS[domainIndex];
  const domData=ds[domain.id]||{score:0,band:'Critical'};
  const dClr=D_COLORS[domainIndex]||B.primary;
  const bClr=bc(domData.band);
  const content=domain.content[domData.band]?.[lk];
  const domName=domain.name[lk];

  pageHeader(ctx,domName,pageNum,lang,dClr);
  pageFooter(ctx,lang);

  let y=20;

  // ── Score strip (Hogan-style) ─────────────────────────────────────────────
  rr(ctx,0,y,W,16,B.offwhite,null);
  hline(ctx,0,y+16,W,B.line,0.4);

  // Score number + gauge
  const sX=isRTL?W-20:20;
  gauge(ctx,sX,y+8,7,domData.score,bClr,B.line+'88');
  txt(ctx,domData.score+'%',sX,y+8,{size:8.5,color:bClr,weight:'bold',align:'center'});

  // Hogan-style labeled bar
  const barX=isRTL?8:30, barW=W-barX-(isRTL?30:8);
  const zones2=[
    {label:t('يحتاج تطوير','Developing'), c:'#FEE2E2', w:0.25},
    {label:t('متوسط','Moderate'),  c:'#FEF3C7', w:0.25},
    {label:t('متمكن','Proficient'),c:'#DBEAFE', w:0.25},
    {label:t('متميز','Strong'),    c:'#D1FAE5', w:0.25},
  ];
  let bx2=isRTL?barX+barW:barX;
  zones2.forEach((z,i)=>{
    const zw=barW*z.w;
    const zx=isRTL?bx2-zw:bx2;
    rr(ctx,zx,y+3,zw,7,z.c,B.line+'88',i===0?1:0);
    txt(ctx,z.label,zx+zw/2,y+6.5,{size:5.5,color:B.muted,align:'center'});
    if(isRTL) bx2-=zw; else bx2+=zw;
  });
  // Score marker on bar
  const markerX=isRTL?(barX+barW)-(barW*(domData.score/100)):barX+(barW*(domData.score/100));
  rr(ctx,markerX-0.8,y+1.5,1.6,10,bClr,null,0.8);

  // Band badge right side
  const bdX=isRTL?10:W-44;
  rr(ctx,bdX,y+3,34,7,bClr+'22',bClr,3.5);
  txt(ctx,bl(domData.band,lang),bdX+17,y+6.5,{size:7,color:bClr,weight:'bold',align:'center'});

  y+=20;

  // ── Description card ─────────────────────────────────────────────────────
  rr(ctx,8,y,W-16,14,B.white,B.line,3);
  rr(ctx,isRTL?W-11:8,y,3,14,dClr,null,1.5);
  txt(ctx,t('وصف المجال','Domain Description'),isRTL?W-14:14,y+5.5,{size:7,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
  txt(ctx,domain.description[lk],isRTL?W-14:14,y+11,{size:7.5,color:B.muted,align:isRTL?'right':'left',isRTL,maxW:W-26});
  y+=18;

  // ── Score interpretation (Hogan: "تفسير الدرجة") ─────────────────────────
  if(content){
    txt(ctx,t('تفسير الدرجة','Score Interpretation'),isRTL?W-8:8,y+3,{size:9.5,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
    y+=9;
    rr(ctx,8,y,W-16,22,bClr+'0a',bClr+'33',3);
    wrap(ctx,content.summary,isRTL?W-14:14,y+5,W-28,5,{size:8.5,color:B.text,isRTL});
    y+=26;
  }

  // ── Sub-competencies (Hogan "تأليف مقياس فرعي") ─────────────────────────
  txt(ctx,t('المقاييس الفرعية','Sub-Competencies'),isRTL?W-8:8,y+3,{size:9.5,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
  y+=9;
  hline(ctx,8,y,W-8,B.teal,0.6);
  y+=4;

  domain.sub_competencies.forEach((sc,sci)=>{
    if(y>H-30) return;
    const key=`${domain.id}__${sc.id}`;
    const scData=subs[key]||{score:0,band:'Critical'};
    const sbc=bc(scData.band);
    const sbg2=bg(scData.band);

    rr(ctx,8,y,W-16,14,sci%2===0?B.offwhite:B.white,B.line,2);

    // Sub-comp name + band pill
    txt(ctx,sc.name[lk],isRTL?W-14:14,y+5,{size:8,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:W-60});
    // Mini gauge
    const mgX=isRTL?20:W-20, mgY=y+7;
    gauge(ctx,mgX,mgY,5,scData.score,sbc,B.line);
    txt(ctx,scData.score+'%',mgX,mgY,{size:6.5,color:sbc,weight:'bold',align:'center'});

    // Band pill
    const bpX=isRTL?30:W-52;
    rr(ctx,bpX,y+1.5,22,6,sbc+'22',sbc+'66',3);
    txt(ctx,bl(scData.band,lang),bpX+11,y+4.5,{size:5.5,color:sbc,weight:'bold',align:'center'});

    // Bar
    bar(ctx,14,y+10,W-28,2.5,scData.score,sbc,B.line,1.5);
    y+=16;
  });

  y+=2;

  // ── Strengths & Recommendations ─────────────────────────────────────────
  if(content&&y<H-55){
    const colW=(W-24)/2;
    // Strengths col
    const strX=8;
    rr(ctx,strX,y,colW,42,bc(domData.band)+'0a',bc(domData.band)+'33',3);
    txt(ctx,t('نقاط القوة','Strengths'),isRTL?strX+colW-5:strX+5,y+6,{size:8,color:bClr,weight:'bold',align:isRTL?'right':'left',isRTL});
    (content.strengths||[]).slice(0,3).forEach((s,j)=>{
      const sy=y+13+j*9;
      circ(ctx,isRTL?strX+colW-10:strX+9,sy,2.5,bClr+'44',bClr,0.5);
      txt(ctx,s,isRTL?strX+colW-14:strX+14,sy,{size:7,color:B.text,align:isRTL?'right':'left',isRTL,maxW:colW-20});
    });

    // Recommendations col
    const recX=8+colW+4;
    rr(ctx,recX,y,colW,42,B.offwhite,B.line,3);
    txt(ctx,t('التوصيات','Recommendations'),isRTL?recX+colW-5:recX+5,y+6,{size:8,color:B.primary,weight:'bold',align:isRTL?'right':'left',isRTL});
    (content.recommendations||[]).slice(0,3).forEach((r,j)=>{
      const ry=y+13+j*9;
      rr(ctx,isRTL?recX+colW-11:recX+8,ry-2.5,2.5,5,B.primary+'aa',null,1.2);
      txt(ctx,r,isRTL?recX+colW-15:recX+13,ry,{size:7,color:B.text,align:isRTL?'right':'left',isRTL,maxW:colW-20});
    });
    y+=46;
  }

  // ── Development goals (3 phases) ────────────────────────────────────────
  if(content?.goals&&y<H-35){
    const phases=[
      {key:'short',ar:'٠–٣٠ يوم',en:'0–30 Days',c:'#DC2626'},
      {key:'mid',  ar:'٣٠–٩٠ يوم',en:'30–90 Days',c:'#D97706'},
      {key:'long', ar:'٩٠+ يوم',en:'90+ Days',c:'#059669'},
    ];
    const ph2W=(W-24)/3;
    phases.forEach((ph,i)=>{
      const phX=8+i*(ph2W+4);
      rr(ctx,phX,y,ph2W,28,B.white,B.line,3);
      gr(ctx,phX,y,ph2W,7,ph.c,ph.c+'aa','h',3);
      txt(ctx,lang==='ar'?ph.ar:ph.en,phX+ph2W/2,y+3.5,{size:6.5,color:B.white,weight:'bold',align:'center'});
      wrap(ctx,content.goals[ph.key]||'',isRTL?phX+ph2W-4:phX+4,y+13,ph2W-8,4.5,{size:7,color:B.text,isRTL});
    });
  }

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 9 — DEVELOPMENT PLAN
// ═══════════════════════════════════════════════════════════════════════════════
function buildDevPlan(rpt, lang) {
  const {canvas,ctx}=mkPage();
  const isRTL=lang==='ar';
  const t=(ar,en)=>isRTL?ar:en;
  const ds=rpt.domain_scores||{};
  const lk=lang;

  pageHeader(ctx,t('خطة التطوير الشخصية','Personalized Development Plan'),9,lang);
  pageFooter(ctx,lang);

  const priority=DOMAINS
    .map(d=>({...d,score:ds[d.id]?.score||0,band:ds[d.id]?.band||'Critical'}))
    .sort((a,b)=>a.score-b.score).slice(0,3);

  const phases=[
    {key:'short',ar:'٠–٣٠ يوم • ابدأ الآن',en:'0–30 Days • Start Now',c:'#DC2626',bg2:'#FEE2E2'},
    {key:'mid',  ar:'٣٠–٩٠ يوم • بناء المهارة',en:'30–90 Days • Build Skills',c:'#D97706',bg2:'#FEF3C7'},
    {key:'long', ar:'٩٠+ يوم • نمو مستدام',en:'90+ Days • Sustained Growth',c:'#059669',bg2:'#D1FAE5'},
  ];

  // Timeline line
  const tlX=isRTL?W-16:16;
  rr(ctx,tlX-0.3,22,0.6,H-30,B.line);

  let y=22;
  phases.forEach((ph,pi)=>{
    // Phase node
    circ(ctx,tlX,y+7,7,ph.c,B.white,0.7);
    txt(ctx,String(pi+1),tlX,y+7,{size:8,color:B.white,weight:'bold',align:'center'});

    // Phase header
    const phX=isRTL?8:28, phW=W-phX-8;
    gr(ctx,phX,y,phW,12,ph.c,ph.c+'bb','h',3);
    txt(ctx,lang==='ar'?ph.ar:ph.en,isRTL?phX+phW-5:phX+5,y+6,{size:9,color:B.white,weight:'bold',align:isRTL?'right':'left',isRTL});
    y+=14;

    priority.forEach((d,di)=>{
      const content=d.content[d.band]?.[lk];
      const goalTxt=content?.goals?.[ph.key];
      if(!goalTxt) return;
      const dClr2=D_COLORS[DOMAINS.findIndex(x=>x.id===d.id)]||B.primary;
      const gcX=isRTL?12:30, gcW=W-gcX-8;

      rr(ctx,gcX,y,gcW,20,ph.bg2+'80',ph.c+'33',2.5);
      // Color dot = domain color
      circ(ctx,isRTL?gcX+gcW-8:gcX+8,y+10,3,dClr2,null);
      txt(ctx,d.name[lk],isRTL?gcX+gcW-14:gcX+14,y+7,{size:7.5,color:bc(d.band),weight:'bold',align:isRTL?'right':'left',isRTL,maxW:gcW-25});
      wrap(ctx,goalTxt,isRTL?gcX+gcW-14:gcX+14,y+14,gcW-18,4,{size:7.5,color:B.text,isRTL});
      y+=24;
    });
    y+=3;
  });

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 10 — CLOSING / NEXT STEPS
// ═══════════════════════════════════════════════════════════════════════════════
function buildClosing(rpt, lang) {
  const {canvas,ctx}=mkPage();
  const isRTL=lang==='ar';
  const t=(ar,en)=>isRTL?ar:en;
  const user=rpt.user||{};
  const ov=rpt.overall||{score:0,band:'Moderate'};
  const bClr=bc(ov.band);

  // Dark bg
  gr(ctx,0,0,W,H,B.navy,'#0A1929','v');
  ctx.save();ctx.globalAlpha=0.03;ctx.fillStyle=B.teal;
  for(let xi=0;xi<CW;xi+=px(7)) for(let yi=0;yi<CH;yi+=px(7)){
    ctx.beginPath();ctx.arc(xi,yi,px(0.5),0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  gr(ctx,0,0,W,2.5,B.teal,B.tealDark,'h');
  gr(ctx,0,2.5,W,22,B.navy+'cc',B.primary,'h');

  txt(ctx,t('خطوات رحلتك القادمة','Your Next Steps Roadmap'),W/2,14,{size:14,color:B.white,weight:'bold',align:'center',isRTL});
  const greet=t(`مرحبًا ${user.preferred_name||user.name||''}، هذه خارطة طريقك`,`Welcome ${user.preferred_name||user.name||''} — your roadmap to excellence`);
  txt(ctx,greet,W/2,21,{size:7.5,color:B.white+'77',align:'center',isRTL});

  let y=28;
  const steps=[
    {n:'01',c:B.teal,    ar:'راجع تقريرك بعمق',  en:'Review Your Report',    da:'اقرأ تحليل كل مجال وافهم نتيجتك',de:'Read each domain and understand your score'},
    {n:'02',c:'#2563EB', ar:'حدد هدفين فوريين', en:'Set 2 Immediate Goals',  da:'اختر هدفين من قسم ٠–٣٠ يوم',    de:'Choose two 0–30 day goals and start today'},
    {n:'03',c:'#D97706', ar:'شارك نتائجك',        en:'Share Your Results',    da:'ناقش التقرير مع مشرفك المهني',   de:'Discuss with your supervisor or mentor'},
    {n:'04',c:B.teal,    ar:'ضع تذكيرًا شهريًا', en:'Set a Monthly Reminder',da:'راجع خطة التطوير كل ٣٠ يومًا',  de:'Review your development plan monthly'},
    {n:'05',c:'#059669', ar:'استكشف الموارد',      en:'Explore Resources',    da:'تصفح متجر Optivance للأدوات',    de:'Browse Optivance store for tools'},
  ];

  steps.forEach((s,i)=>{
    rr(ctx,8,y,W-16,22,B.white+'0d',B.white+'20',3.5);
    circ(ctx,isRTL?W-19:19,y+11,7.5,s.c+'33',s.c,0.5);
    txt(ctx,s.n,isRTL?W-19:19,y+11,{size:7,color:s.c,weight:'bold',align:'center'});
    const tx2=isRTL?W-31:31;
    txt(ctx,lang==='ar'?s.ar:s.en,tx2,y+8,{size:9,color:B.white,weight:'bold',align:isRTL?'right':'left',isRTL,maxW:W-43});
    txt(ctx,lang==='ar'?s.da:s.de,tx2,y+15,{size:7.5,color:B.white+'77',align:isRTL?'right':'left',isRTL,maxW:W-43});
    y+=25;
  });

  y+=2;
  gr(ctx,10,y,W-20,0.7,B.teal+'44',B.primary+'22','h');
  y+=6;

  txt(ctx,t('للتواصل والاستشارات','Contact & Consulting'),W/2,y,{size:10,color:B.teal,weight:'bold',align:'center',isRTL});
  y+=7;
  txt(ctx,'info@optivance.com  •  www.optivance.com',W/2,y,{size:8.5,color:B.white+'aa',align:'center'});
  y+=9;

  // Score summary card
  rr(ctx,8,y,W-16,24,bClr+'18',bClr+'55',4);
  gauge(ctx,isRTL?W-28:28,y+12,10,ov.score,bClr,B.white+'20');
  txt(ctx,ov.score+'%',isRTL?W-28:28,y+12,{size:11,color:bClr,weight:'bold',align:'center'});
  txt(ctx,t('نتيجتك الإجمالية','Your Overall Score'),isRTL?W-44:44,y+9,{size:8,color:bClr,weight:'bold',align:isRTL?'right':'left',isRTL});
  txt(ctx,bl(ov.band,lang),isRTL?W-44:44,y+18,{size:10,color:bClr,weight:'bold',align:isRTL?'right':'left',isRTL});
  y+=30;

  gr(ctx,8,y,W-16,14,B.teal,B.tealDark,'h',4.5);
  txt(ctx,t('ابدأ رحلة تطورك مع Optivance اليوم','Start Your Growth Journey with Optivance Today'),
    W/2,y+7,{size:9.5,color:B.navy,weight:'bold',align:'center',isRTL});

  txt(ctx,'OPTIVANCE',W/2,H-18,{size:22,color:B.teal+'15',weight:'bold',align:'center'});
  txt(ctx,t('بناء المهنيين المتميزين','Building Distinguished Professionals'),W/2,H-11,{size:7,color:B.white+'33',align:'center'});

  rr(ctx,0,H-6.5,W,6.5,B.navy);
  hline(ctx,0,H-6.5,W,B.teal+'44',0.4);
  txt(ctx,'© 2025 OPTIVANCE  •  www.optivance.com  •  All Rights Reserved',W/2,H-3.2,{size:5.8,color:B.white+'44',align:'center'});

  return canvas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateCompetencyPDF(reportData, attemptId) {
  const lang = reportData.language || 'ar';

  const canvases = [
    buildCover(reportData, lang),
    buildDashboard(reportData, lang),
    // 6 domain pages (pages 3–8)
    ...DOMAINS.map((d,i) => buildDomainPage(reportData, lang, i, i+3)),
    buildDevPlan(reportData, lang),
    buildClosing(reportData, lang),
  ];

  const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  canvases.forEach((canvas, idx) => {
    if(idx>0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png',1.0),'PNG',0,0,W,H,'','FAST');
  });

  const fileName = `optivance-competency-report-${reportData.report_id||attemptId||'report'}.pdf`;
  pdf.save(fileName);
  return fileName;
}