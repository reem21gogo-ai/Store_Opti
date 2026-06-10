/**
 * OPTIVANCE — Competency Report PDF Engine  v5
 * Reference: competency-report-landing.html
 * A4 @ 3× · 12 pages · Bilingual AR/EN
 *
 * PAGES:
 *  1  — Front Cover
 *  2  — Welcome + Profile + How to Read
 *  3  — About the Assessment
 *  4  — Overall Snapshot (score + radar + 6 domain bars)
 *  5–10 — One page per domain (deep-dive)
 *  11 — Personal Development Plan
 *  12 — Back Cover (Next Steps + About)
 */
import jsPDF from 'jspdf';
import { DOMAINS, OVERALL_SUMMARIES, LEVEL_LABELS } from './competencyContent';

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const P = {
  navy:   '#0B1E30',
  blue:   '#1A3A5C',
  teal:   '#05E1AE',
  white:  '#FFFFFF',
  offwht: '#F7F9FC',
  light:  '#EEF2F7',
  border: '#D8E2EE',
  text:   '#1E2D3D',
  sub:    '#4A6080',
  muted:  '#8EA5BF',
};
const BAND = {
  Strong:     { c:'#1A7A4A', bg:'#E8F8EF', bdr:'#A8DFC0', ar:'متميز',          en:'Strong'               },
  Proficient: { c:'#1558A0', bg:'#E6F0FB', bdr:'#A4C4ED', ar:'كفء',            en:'Proficient'           },
  Moderate:   { c:'#B87000', bg:'#FDF3E0', bdr:'#F5C97A', ar:'متوسط',          en:'Moderate'             },
  Critical:   { c:'#B52020', bg:'#FDEAEA', bdr:'#F0A0A0', ar:'أولوية تطوير',   en:'Development Priority' },
};
const DC = ['#6B21A8','#1558A0','#1A7A4A','#B52020','#B87000','#0E7490']; // per domain
const bc  = b => BAND[b]?.c   || P.muted;
const bbg = b => BAND[b]?.bg  || P.light;
const bbd = b => BAND[b]?.bdr || P.border;
const bl  = (b,l) => BAND[b]?.[l==='ar'?'ar':'en'] || b;
const sb  = s => s>=80?'Strong':s>=60?'Proficient':s>=40?'Moderate':'Critical';

// ─── CANVAS ───────────────────────────────────────────────────────────────────
const W=210, H=297, DPR=3, PPM=3.7795*DPR;
const CW=Math.round(W*PPM), CH=Math.round(H*PPM);
const mm=v=>Math.round(v*PPM);

function page(bg=P.white){
  const c=document.createElement('canvas');
  c.width=CW; c.height=CH;
  const x=c.getContext('2d');
  x.fillStyle=bg; x.fillRect(0,0,CW,CH);
  return {cv:c,cx:x};
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function rr(cx,x,y,w,h,fill,stroke,r=0,sw=0.35){
  cx.save(); cx.beginPath();
  const[X,Y,W2,H2,R]=[mm(x),mm(y),mm(w),mm(h),mm(r)];
  if(R){
    cx.moveTo(X+R,Y);cx.lineTo(X+W2-R,Y);cx.quadraticCurveTo(X+W2,Y,X+W2,Y+R);
    cx.lineTo(X+W2,Y+H2-R);cx.quadraticCurveTo(X+W2,Y+H2,X+W2-R,Y+H2);
    cx.lineTo(X+R,Y+H2);cx.quadraticCurveTo(X,Y+H2,X,Y+H2-R);
    cx.lineTo(X,Y+R);cx.quadraticCurveTo(X,Y,X+R,Y);cx.closePath();
  } else cx.rect(X,Y,W2,H2);
  if(fill){cx.fillStyle=fill;cx.fill();}
  if(stroke){cx.strokeStyle=stroke;cx.lineWidth=mm(sw);cx.stroke();}
  cx.restore();
}
function seg(cx,x,y,w,h,c1,c2,r=0,dir='h'){
  cx.save();
  const g=dir==='h'?cx.createLinearGradient(mm(x),mm(y),mm(x+w),mm(y)):cx.createLinearGradient(mm(x),mm(y),mm(x),mm(y+h));
  g.addColorStop(0,c1);g.addColorStop(1,c2);
  cx.beginPath();
  const[X,Y,W2,H2,R]=[mm(x),mm(y),mm(w),mm(h),mm(r)];
  if(R){
    cx.moveTo(X+R,Y);cx.lineTo(X+W2-R,Y);cx.quadraticCurveTo(X+W2,Y,X+W2,Y+R);
    cx.lineTo(X+W2,Y+H2-R);cx.quadraticCurveTo(X+W2,Y+H2,X+W2-R,Y+H2);
    cx.lineTo(X+R,Y+H2);cx.quadraticCurveTo(X,Y+H2,X,Y+H2-R);
    cx.lineTo(X,Y+R);cx.quadraticCurveTo(X,Y,X+R,Y);cx.closePath();
  } else cx.rect(X,Y,W2,H2);
  cx.fillStyle=g;cx.fill();cx.restore();
}
function ln(cx,x1,y1,x2,y2,c,w=0.3){
  cx.save();cx.beginPath();cx.moveTo(mm(x1),mm(y1));cx.lineTo(mm(x2),mm(y2));
  cx.strokeStyle=c;cx.lineWidth=mm(w);cx.stroke();cx.restore();
}
function dot(cx,x,y,r,fill,stroke,sw=0.4){
  cx.save();cx.beginPath();cx.arc(mm(x),mm(y),mm(r),0,Math.PI*2);
  if(fill){cx.fillStyle=fill;cx.fill();}
  if(stroke){cx.strokeStyle=stroke;cx.lineWidth=mm(sw);cx.stroke();}
  cx.restore();
}
function T(cx,str,x,y,{s=9,c=P.text,b=false,a='left',rtl=false,mw}={}){
  if(str===null||str===undefined)return;
  cx.save();
  cx.font=`${b?700:400} ${Math.round(s*PPM*0.37)}px Arial,sans-serif`;
  cx.fillStyle=c;cx.textAlign=a;cx.direction=rtl?'rtl':'ltr';cx.textBaseline='middle';
  const args=[String(str),mm(x),mm(y)];
  if(mw)args.push(mm(mw));
  cx.fillText(...args);cx.restore();
}
function wrap(cx,str,x,y,mw,lh,opts={}){
  if(!str)return 0;
  cx.save();
  const{s=8.5,c=P.text,b=false,rtl=false}=opts;
  cx.font=`${b?700:400} ${Math.round(s*PPM*0.37)}px Arial,sans-serif`;
  cx.fillStyle=c;cx.direction=rtl?'rtl':'ltr';cx.textBaseline='middle';
  const words=String(str).split(' '),mwpx=mm(mw),lhpx=mm(lh);
  let line='',cy=mm(y),lines=0;
  words.forEach((w2,i)=>{
    const t=line?line+' '+w2:w2;
    if(cx.measureText(t).width>mwpx&&i>0){cx.fillText(line,mm(x),cy);line=w2;cy+=lhpx;lines++;}
    else line=t;
  });
  if(line){cx.fillText(line,mm(x),cy);lines++;}
  cx.restore();return lines;
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────

/* HALF-ARC GAUGE — clean, no zone rings, just track + fill */
function gauge(cx,ox,oy,r,score,color,trackC=P.border){
  const SW=mm(r*0.28),START=Math.PI,S=score;
  cx.save();
  // track
  cx.beginPath();cx.arc(mm(ox),mm(oy),mm(r),START,Math.PI*2);
  cx.strokeStyle=trackC;cx.lineWidth=SW;cx.lineCap='butt';cx.stroke();
  // zone tint (4 segments)
  const segs=[{f:'#FDEAEA',t:'#FDF3E0'},{f:'#FDF3E0',t:'#E6F0FB'},{f:'#E6F0FB',t:'#E8F8EF'},{f:'#E8F8EF',t:'#C8EDD8'}];
  segs.forEach((_,i)=>{
    const a0=START+i*(Math.PI/4), a1=START+(i+1)*(Math.PI/4);
    cx.beginPath();cx.arc(mm(ox),mm(oy),mm(r),a0,a1);
    cx.strokeStyle=segs[i].f;cx.lineWidth=SW*0.88;cx.lineCap='butt';cx.stroke();
  });
  // fill arc
  if(S>0){
    const fillEnd=START+(S/100)*Math.PI;
    cx.beginPath();cx.arc(mm(ox),mm(oy),mm(r),START,fillEnd);
    cx.strokeStyle=color;cx.lineWidth=SW;cx.lineCap='round';cx.stroke();
  }
  // tick marks at 0,25,50,75,100
  [0,.25,.5,.75,1].forEach(t=>{
    const a=START+t*Math.PI;
    const r1=mm(r)-SW*0.65,r2=mm(r)+SW*0.65;
    cx.beginPath();cx.moveTo(mm(ox)+r1*Math.cos(a),mm(oy)+r1*Math.sin(a));
    cx.lineTo(mm(ox)+r2*Math.cos(a),mm(oy)+r2*Math.sin(a));
    cx.strokeStyle=P.white;cx.lineWidth=mm(0.45);cx.stroke();
  });
  cx.restore();
}

/* HORIZONTAL SCORE BAR — 4 zone segments + needle */
function hbar(cx,x,y,w,h,score){
  const zs=[{bg:'#FDEAEA',bd:BAND.Critical.c},{bg:'#FDF3E0',bd:BAND.Moderate.c},{bg:'#E6F0FB',bd:BAND.Proficient.c},{bg:'#E8F8EF',bd:BAND.Strong.c}];
  const zw=w/4;
  zs.forEach((z,i)=>rr(cx,x+i*zw,y,zw,h,z.bg,z.bd+'44',0,0.2));
  [1,2,3].forEach(i=>ln(cx,x+i*zw,y,x+i*zw,y+h,P.white+'dd',0.5));
  // needle
  const nx=x+(score/100)*w;
  rr(cx,nx-0.5,y-1.5,1,h+3,bc(sb(score)),null,0.5);
  T(cx,score+'%',nx,y-5,{s:8,c:bc(sb(score)),b:true,a:'center'});
}

/* RADAR/SPIDER — clean lines, semi-transparent fill */
function radar(cx,ocx,ocy,r,scores,colors){
  const N=6,step=(Math.PI*2)/N,off=-Math.PI/2;
  // rings
  [.25,.5,.75,1].forEach(f=>{
    cx.save();cx.beginPath();
    for(let i=0;i<N;i++){
      const a=off+i*step,x2=mm(ocx)+mm(r)*f*Math.cos(a),y2=mm(ocy)+mm(r)*f*Math.sin(a);
      i===0?cx.moveTo(x2,y2):cx.lineTo(x2,y2);
    }
    cx.closePath();cx.strokeStyle=f===1?P.border:P.border+'66';cx.lineWidth=mm(f===1?.35:.2);cx.stroke();
    cx.restore();
  });
  // axes
  for(let i=0;i<N;i++){
    const a=off+i*step;
    ln(cx,ocx,ocy,ocx+r*Math.cos(a),ocy+r*Math.sin(a),P.border+'88',.28);
  }
  // filled area
  cx.save();cx.beginPath();
  scores.forEach((s,i)=>{
    const a=off+i*step,f=s/100,x2=mm(ocx)+mm(r)*f*Math.cos(a),y2=mm(ocy)+mm(r)*f*Math.sin(a);
    i===0?cx.moveTo(x2,y2):cx.lineTo(x2,y2);
  });
  cx.closePath();cx.fillStyle=P.teal+'28';cx.fill();cx.strokeStyle=P.teal;cx.lineWidth=mm(.7);cx.stroke();cx.restore();
  // dots
  scores.forEach((s,i)=>{
    const a=off+i*step,f=s/100,x2=mm(ocx)+mm(r)*f*Math.cos(a),y2=mm(ocy)+mm(r)*f*Math.sin(a);
    const R2=mm(2);
    cx.save();cx.beginPath();cx.arc(x2,y2,R2,0,Math.PI*2);cx.fillStyle=colors[i];cx.fill();
    cx.strokeStyle=P.white;cx.lineWidth=mm(.4);cx.stroke();cx.restore();
  });
}

/* MINI PROGRESS BAR */
function minibar(cx,x,y,w,h,score,color){
  rr(cx,x,y,w,h,P.light,P.border,h/2,.2);
  if(score>0) rr(cx,x,y,Math.max((score/100)*w,h),h,color,null,h/2);
}

// ─── CHROME ───────────────────────────────────────────────────────────────────
function hdr(cx,title,pg,lang,ac=P.blue){
  const rtl=lang==='ar';
  seg(cx,0,0,W,14,P.navy,P.blue,'h');
  rr(cx,0,14,W,.8,P.teal);
  rr(cx,rtl?W-50:6,3,44,8,P.teal+'22',P.teal+'55',4);
  T(cx,'OPTIVANCE',rtl?W-28:28,7,{s:7.5,c:P.teal,b:true,a:'center'});
  T(cx,title,rtl?W-56:56,7,{s:9.5,c:P.white,b:true,a:rtl?'right':'left',rtl});
  rr(cx,rtl?5:W-20,3.5,15,7,ac,null,4);
  T(cx,String(pg),rtl?12.5:W-12.5,7,{s:7,c:P.white,b:true,a:'center'});
}
function ftr(cx){
  rr(cx,0,H-6,W,6,P.navy);
  ln(cx,0,H-6,W,H-6,P.teal+'33',.35);
  T(cx,'OPTIVANCE  ·  www.optivance.com  ·  info@optivance.com  ·  © 2025',
    W/2,H-3,{s:5.5,c:P.white+'44',a:'center'});
}
function secTitle(cx,title,x,y,rtl,c=P.blue){
  T(cx,title,x,y,{s:10,c,b:true,a:rtl?'right':'left',rtl});
  ln(cx,rtl?x:x,y+4.5,rtl?x-65:x+65,y+4.5,P.teal,1.1);
}
function badge(cx,text,x,y,w,h,bgC,txtC){
  rr(cx,x,y,w,h,bgC,null,h/2);
  T(cx,text,x+w/2,y+h/2,{s:6.5,c:txtC||P.white,b:true,a:'center'});
}
function pill(cx,text,x,y,band){
  const bw=22,bh=7;
  rr(cx,x,y,bw,bh,bbg(band),bbd(band),3.5,.3);
  T(cx,bl(band,'ar'),x+bw/2,y+bh/2,{s:6,c:bc(band),b:true,a:'center'});
}
function pillEn(cx,text,x,y,band){
  const bw=26,bh=7;
  rr(cx,x,y,bw,bh,bbg(band),bbd(band),3.5,.3);
  T(cx,bl(band,'en'),x+bw/2,y+bh/2,{s:6,c:bc(band),b:true,a:'center'});
}

// ═══════════════════════════════════════════════════════════════════════════════
// P1 — FRONT COVER
// ═══════════════════════════════════════════════════════════════════════════════
function p1_cover(rpt,lang){
  const{cv,cx}=page();
  const rtl=lang==='ar',tr=(ar,en)=>rtl?ar:en;
  const user=rpt.user||{},ov=rpt.overall||{score:0,band:'Moderate'};
  const band=ov.band||sb(ov.score);
  const lv=LEVEL_LABELS[user.professional_level]?.[lang]||'—';

  // dark BG
  const bg=cx.createLinearGradient(0,0,0,CH);
  bg.addColorStop(0,'#0B1E30');bg.addColorStop(.6,'#0F2540');bg.addColorStop(1,'#081525');
  cx.fillStyle=bg;cx.fillRect(0,0,CW,CH);

  // dot grid texture
  cx.save();cx.globalAlpha=.035;cx.fillStyle=P.teal;
  for(let xi=0;xi<CW;xi+=mm(8))for(let yi=0;yi<CH;yi+=mm(8)){cx.beginPath();cx.arc(xi,yi,mm(.35),0,Math.PI*2);cx.fill();}
  cx.restore();

  // teal top line
  rr(cx,0,0,W,2.2,P.teal);

  // right accent column
  cx.save();cx.globalAlpha=.055;rr(cx,W-52,0,52,H,P.teal);cx.restore();
  ln(cx,W-52,0,W-52,H,P.teal+'18',.4);

  // OPTIVANCE brand
  const lx=rtl?W-60:12,lw=48;
  rr(cx,lx,15,lw,11,P.teal+'1a',P.teal+'44',5.5);
  T(cx,'OPTIVANCE',lx+lw/2,20.5,{s:9.5,c:P.teal,b:true,a:'center'});
  T(cx,tr('للاستشارات وتطوير المواهب','Consulting & Talent Development'),lx+lw/2,28,{s:6,c:P.white+'55',a:'center',rtl});

  // main title
  const tx=rtl?W-13:13,ta=rtl?'right':'left';
  T(cx,tr('تقرير','Competency'),  tx,58,{s:35,c:P.white,b:true,a:ta,rtl});
  T(cx,tr('الجدارات المهنية','& Growth Report'),tx,78,{s:29,c:P.teal,b:true,a:ta,rtl});
  T(cx,tr('مقياس الكفاءات الأساسية للموظف','Employee Core Competency Assessment'),
    tx,89,{s:9,c:P.white+'66',a:ta,rtl});

  ln(cx,13,96,W-13,96,P.teal+'33',.5);

  // score gauge — corner
  const gcx=rtl?36:W-36,gcy=67;
  dot(cx,gcx,gcy,19,P.white+'07',P.white+'14',.5);
  gauge(cx,gcx,gcy,13,ov.score,bc(band),P.white+'20');
  T(cx,ov.score+'%',gcx,gcy,  {s:15,c:P.white,b:true,a:'center'});
  T(cx,tr('نتيجتك','Score'),   gcx,gcy+9,{s:6,c:P.white+'66',a:'center'});
  rr(cx,gcx-14,gcy+13,28,8,bc(band)+'30',bc(band)+'88',4);
  T(cx,bl(band,lang),gcx,gcy+17,{s:7,c:bc(band),b:true,a:'center'});

  // profile card
  const cY=100;
  rr(cx,13,cY,W-26,78,P.white+'0d',P.white+'1a',6);
  T(cx,tr('بيانات المشارك','Participant Profile'),rtl?W-19:19,cY+8,{s:9,c:P.teal,b:true,a:rtl?'right':'left',rtl});
  ln(cx,17,cY+14,W-17,cY+14,P.white+'1a',.3);

  [
    [tr('الاسم','Full Name'),          user.name||'—'],
    [tr('الاسم المفضل','Preferred Name'),user.preferred_name||user.name||'—'],
    [tr('المستوى المهني','Level'),     lv],
    [tr('نسخة التقييم','Version'),    rpt.version==='full'?tr('كاملة','Full'):tr('سريعة','Quick')],
    [tr('تاريخ الإكمال','Date'),       user.completion_date||'—'],
    [tr('رقم التقرير','Report ID'),    rpt.report_id||'—'],
  ].forEach(([lbl,val],i)=>{
    const col=i%2,row=Math.floor(i/2);
    const cw=(W-32)/2,fx=rtl?W-17-col*(cw+4):17+col*(cw+4);
    const fy=cY+18+row*19;
    rr(cx,rtl?fx-cw:fx,fy,cw,16,P.white+'09',P.white+'18',3.5);
    T(cx,lbl,rtl?fx-6:fx+6,fy+5.5,{s:6.5,c:P.teal+'cc',a:rtl?'right':'left',rtl});
    T(cx,val, rtl?fx-6:fx+6,fy+12, {s:8.5,c:P.white+'dd',b:true,a:rtl?'right':'left',rtl,mw:cw-12});
  });

  // tagline bottom
  const bY=H-26;
  ln(cx,13,bY,W-13,bY,P.teal+'22',.4);
  T(cx,tr('من الوعي إلى النمو المهني المستدام','From awareness to sustainable professional growth.'),W/2,bY+6,{s:8,c:P.white+'55',a:'center',rtl});
  T(cx,'Powered by Optivance – ROUTE™ Methodology',W/2,bY+13,{s:6.5,c:P.teal+'44',a:'center'});
  T(cx,'www.optivance.com',W/2,bY+20,{s:6,c:P.white+'25',a:'center'});

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// P2 — WELCOME + PROFILE + HOW TO READ
// ═══════════════════════════════════════════════════════════════════════════════
function p2_welcome(rpt,lang){
  const{cv,cx}=page(P.offwht);
  const rtl=lang==='ar',tr=(ar,en)=>rtl?ar:en;
  const user=rpt.user||{};
  const lv=LEVEL_LABELS[user.professional_level]?.[lang]||'—';
  const ta=rtl?'right':'left',tx=rtl?W-12:12;

  hdr(cx,tr('مرحباً بك في تقريرك','Welcome to Your Report'),2,lang);
  ftr(cx);

  let y=20;

  // Welcome card
  rr(cx,8,y,W-16,30,P.white,P.border,4);
  rr(cx,rtl?W-11:8,y,3,30,P.teal,null,1.5);
  T(cx,tr('مرحباً بك في تقرير Optivance للجدارات','Welcome to Your Optivance Competency Report'),
    rtl?W-15:14,y+8,{s:10,c:P.blue,b:true,a:ta,rtl});
  wrap(cx,
    tr('شكراً لإكمالك مقياس الجدارات المهنية. هذا التقرير مُعدّ خصيصاً لك. يقدم لك نظرة شاملة على ملفك الكفاءاتي الحالي، ويُبرز نقاط قوتك الرئيسية، ويرسم فرص التطوير.',
       'Thank you for completing the Optivance Employee Core Competency Assessment. This report is designed exclusively for you. It provides a clear overview of your competency profile, highlights your key strengths, and outlines focused development opportunities.'),
    rtl?W-15:14,y+19,W-26,5,{s:8,c:P.sub,rtl});
  y+=34;

  // Profile summary card
  rr(cx,8,y,W-16,28,P.white,P.border,4);
  T(cx,tr('ملفك الشخصي','Your Profile'),rtl?W-14:14,y+7,{s:9,c:P.blue,b:true,a:ta,rtl});
  ln(cx,12,y+13,W-12,y+13,P.border,.35);
  const pf=[
    [tr('الاسم','Name'),         user.name||'—'],
    [tr('المستوى','Level'),      lv],
    [tr('تاريخ التقييم','Assessment Date'),user.completion_date||'—'],
    [tr('رقم التقرير','Report ID'),rpt.report_id||'—'],
  ];
  const pcw=(W-20)/4;
  pf.forEach(([l,v],i)=>{
    const px=8+i*(pcw+1.5);
    T(cx,l,px+pcw/2,y+18,{s:6.5,c:P.muted,a:'center',rtl});
    T(cx,v,px+pcw/2,y+24,{s:8,c:P.blue,b:true,a:'center',mw:pcw-4,rtl});
  });
  y+=32;

  // How to read this report
  rr(cx,8,y,W-16,76,P.white,P.border,4);
  secTitle(cx,tr('كيف تقرأ هذا التقرير','How to Read This Report'),rtl?W-14:14,y+8,rtl);
  const steps=[
    {n:'1',ar:'النظرة العامة',en:'Overall Snapshot',
     da:'نتيجتك الإجمالية ومقارنتك عبر المجالات الستة',de:'Your total score and comparison across the six core domains.'},
    {n:'2',ar:'تحليل المجالات',en:'Domain Insights',
     da:'تحليل تفصيلي لكل مجال مع نقاط القوة والتطوير',de:'Detailed breakdown for each domain with strengths and development opportunities.'},
    {n:'3',ar:'خطة التطوير الشخصية',en:'Personal Development Plan',
     da:'خارطة طريق عملية بأهداف وإجراءات محددة',de:'A simple, practical roadmap with goals and concrete actions.'},
    {n:'4',ar:'الخطوات التالية',en:'Next Steps with Optivance',
     da:'كيف تواصل رحلة نموك مع أدوات إضافية',de:'How you can continue your growth journey with additional tools.'},
  ];
  steps.forEach((s,si)=>{
    const sy=y+20+si*13;
    dot(cx,rtl?W-18:18,sy,6,DC[si]+'22',DC[si],.6);
    T(cx,s.n,rtl?W-18:18,sy,{s:8,c:DC[si],b:true,a:'center'});
    T(cx,rtl?s.ar:s.en,rtl?W-29:29,sy-3.5,{s:8.5,c:P.blue,b:true,a:ta,rtl});
    T(cx,rtl?s.da:s.de,rtl?W-29:29,sy+3.5,{s:7.5,c:P.sub,a:ta,rtl,mw:W-42});
  });
  y+=80;

  // Methodology note
  rr(cx,8,y,W-16,20,P.navy,null,4);
  T(cx,tr('المنهجية: ROUTE™ لتطوير القيادة والكفاءات من Optivance',
          'Methodology: ROUTE™ Leadership & Competency Framework by Optivance'),
    W/2,y+7,{s:8,c:P.teal,b:true,a:'center',rtl});
  T(cx,tr('مبني على أفضل المعايير العالمية وواقع بيئات العمل الإقليمية',
          'Built on global best practices and regional workplace realities.'),
    W/2,y+14,{s:7,c:P.white+'77',a:'center',rtl});

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// P3 — ABOUT THE ASSESSMENT
// ═══════════════════════════════════════════════════════════════════════════════
function p3_about(rpt,lang){
  const{cv,cx}=page(P.offwht);
  const rtl=lang==='ar',tr=(ar,en)=>rtl?ar:en;
  const ta=rtl?'right':'left',tx=rtl?W-12:12;

  hdr(cx,tr('عن المقياس','About This Assessment'),3,lang);
  ftr(cx);

  let y=20;

  // what it measures
  rr(cx,8,y,W-16,58,P.white,P.border,4);
  rr(cx,rtl?W-11:8,y,3,58,P.teal,null,1.5);
  secTitle(cx,tr('ما يقيسه المقياس','What This Assessment Measures'),rtl?W-14:14,y+8,rtl);
  const items=lang==='ar'?[
    'المسؤولية والمساءلة','التعاون ومهارات الأشخاص','التواصل الفعّال','الإنتاجية والتوجه نحو النتائج',
    'إدارة الذات وعقلية النمو','التركيز على العميل وأصحاب المصلحة','الوعي الرقمي والامتثال'
  ]:[
    'Responsibility & Accountability','Collaboration & People Skills','Communication',
    'Productivity & Results Orientation','Self-Management & Growth Mindset',
    'Customer & Stakeholder Focus','Digital Awareness & Compliance'
  ];
  items.forEach((it,i)=>{
    const iy=y+20+i*5.3;
    dot(cx,rtl?W-16:16,iy,1.5,P.teal,null);
    T(cx,it,rtl?W-20:20,iy,{s:8,c:P.text,a:ta,rtl});
  });
  y+=62;

  // how score is calculated
  rr(cx,8,y,W-16,42,P.white,P.border,4);
  secTitle(cx,tr('كيف تُحسب نتيجتك','How Your Score Is Calculated'),rtl?W-14:14,y+8,rtl);
  const calcs=lang==='ar'?[
    'يستخدم المقياس سيناريوهات سلوكية تعكس مواقف عمل حقيقية.',
    'تُحوَّل إجاباتك إلى مؤشرات رقمية مرجّحة لكل كفاءة.',
    'تُجمَّع النتائج في ستة مجالات رئيسية ودرجة إجمالية.',
    'تُعرَض الدرجات على أربعة مستويات ملونة.',
  ]:[
    'The assessment uses behavior-based scenarios reflecting real work situations.',
    'Your responses are converted into weighted indicators for each competency.',
    'Results are grouped into six key domains and a global overall score.',
    'Scores are presented on four color-coded bands.',
  ];
  calcs.forEach((c,i)=>{
    const cy=y+18+i*5.5;
    T(cx,String(i+1),rtl?W-14:14,cy,{s:7.5,c:P.teal,b:true,a:'center'});
    T(cx,c,rtl?W-19:19,cy,{s:8,c:P.sub,a:ta,rtl,mw:W-28});
  });
  y+=46;

  // 6 domains grid
  rr(cx,8,y,W-16,86,P.white,P.border,4);
  secTitle(cx,tr('المجالات الستة الرئيسية','The Six Core Domains'),rtl?W-14:14,y+8,rtl);
  const dw=(W-20)/3;
  DOMAINS.forEach((d,i)=>{
    const col=i%3,row=Math.floor(i/3);
    const dx=8+col*(dw+2),dy=y+18+row*33;
    rr(cx,dx,dy,dw-2,30,P.offwht,P.border,3);
    rr(cx,rtl?dx+dw-5:dx,dy,5,30,DC[i],null,1.5);
    dot(cx,rtl?dx+dw-11:dx+11,dy+10,5,DC[i]+'22',DC[i]+'66',.5);
    T(cx,String(i+1),rtl?dx+dw-11:dx+11,dy+10,{s:7,c:DC[i],b:true,a:'center'});
    T(cx,d.name[lang],rtl?dx+dw-20:dx+20,dy+7,{s:8,c:P.blue,b:true,a:ta,rtl,mw:dw-28});
    wrap(cx,d.description[lang],rtl?dx+dw-20:dx+20,dy+17,dw-28,4.3,{s:6.5,c:P.muted,rtl});
  });
  y+=90;

  // confidentiality note
  rr(cx,8,y,W-16,12,P.navy+'22',P.border,4);
  T(cx,tr('🔒 سرية المعلومات: نتائجك سرية ومعدّة لتطويرك الشخصي فقط.',
          '🔒 Confidentiality: Your results are confidential and intended for your personal development only.'),
    W/2,y+6,{s:7.5,c:P.blue,b:true,a:'center',rtl});

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// P4 — OVERALL SNAPSHOT (score + radar + domain bars)
// ═══════════════════════════════════════════════════════════════════════════════
function p4_snapshot(rpt,lang){
  const{cv,cx}=page(P.offwht);
  const rtl=lang==='ar',tr=(ar,en)=>rtl?ar:en;
  const ta=rtl?'right':'left';
  const ds=rpt.domain_scores||{};
  const ov=rpt.overall||{score:0,band:'Moderate'};
  const band=ov.band||sb(ov.score);
  const summary=OVERALL_SUMMARIES[band]?.[lang]||'';

  hdr(cx,tr('النظرة العامة على نتائجك','Your Overall Competency Snapshot'),4,lang);
  ftr(cx);

  let y=20;

  // score hero bar
  seg(cx,0,y,W,24,P.navy,P.blue,'h');
  // overall gauge
  gauge(cx,rtl?W-25:25,y+12,11,ov.score,bc(band),P.white+'25');
  T(cx,ov.score+'%',rtl?W-25:25,y+12,{s:13,c:P.white,b:true,a:'center'});
  // band badge
  rr(cx,rtl?16:36,y+7,36,9,bc(band)+'33',bc(band)+'88',4.5);
  T(cx,bl(band,lang),rtl?34:54,y+11.5,{s:9,c:bc(band),b:true,a:'center'});
  // label + summary
  T(cx,tr('النتيجة الإجمالية','Overall Score'),rtl?W-26:26,y+3.5,{s:8,c:P.white+'88',a:rtl?'right':'left',rtl});
  wrap(cx,summary,rtl?W-12:58,y+9,W-72,4.8,{s:7.5,c:P.white+'bb',rtl});
  y+=28;

  // left col: radar  |  right col: domain score cards
  const col1W=82,col2W=W-col1W-20;

  // RADAR
  rr(cx,8,y,col1W,col1W+4,P.white,P.border,4);
  T(cx,tr('مخطط الكفاءات','Competency Wheel'),8+col1W/2,y+7,{s:8.5,c:P.blue,b:true,a:'center',rtl});
  const scores6=DOMAINS.map(d=>ds[d.id]?.score||0);
  radar(cx,8+col1W/2,y+14+36,32,scores6,DC);
  // labels
  DOMAINS.forEach((d,i)=>{
    const N=6,step=(Math.PI*2)/N,off=-Math.PI/2;
    const a=off+i*step,lx=(8+col1W/2)+(32+12)*Math.cos(a),ly=(y+14+36)+(32+12)*Math.sin(a);
    T(cx,d.name[lang].split(' ')[0],lx,ly,{s:6,c:DC[i],b:true,a:'center',rtl:false});
  });

  // DOMAIN CARDS — right column
  const rx=8+col1W+4;
  DOMAINS.forEach((d,i)=>{
    const dd=ds[d.id]||{score:0,band:'Critical'};
    const dband=dd.band||sb(dd.score);
    const dy=y+i*(col1W+4)/6;
    const cardH=(col1W+4)/6-1.5;
    rr(cx,rx,y+i*((col1W+4)/6),col2W,cardH,P.white,P.border,3);
    rr(cx,rtl?rx+col2W-3:rx,y+i*((col1W+4)/6),3,cardH,DC[i],null,1.5);
    // score
    T(cx,dd.score+'%',rtl?rx+col2W-8:rx+8,y+i*((col1W+4)/6)+cardH/2-3,{s:9,c:bc(dband),b:true,a:rtl?'right':'left'});
    // name
    T(cx,d.name[lang],rtl?rx+col2W-15:rx+15,y+i*((col1W+4)/6)+cardH/2-3,{s:7.5,c:P.blue,b:true,a:ta,rtl,mw:col2W-42});
    // mini bar
    minibar(cx,rtl?rx+5:rx+5,y+i*((col1W+4)/6)+cardH-5,col2W-10,3,dd.score,bc(dband));
    // band pill
    const pW=lang==='ar'?22:28,pX=rtl?rx+5:rx+col2W-pW-5;
    rr(cx,pX,y+i*((col1W+4)/6)+3.5,pW,5.5,bbg(dband),bbd(dband),2.5,.25);
    T(cx,bl(dband,lang),pX+pW/2,y+i*((col1W+4)/6)+6.2,{s:5.5,c:bc(dband),b:true,a:'center'});
  });
  y+=col1W+8;

  // commentary highlights
  const ov_ds=Object.entries(ds).map(([id,v])=>({id,...v})).sort((a,b)=>b.score-a.score);
  const top2=ov_ds.slice(0,2).map(d=>DOMAINS.find(x=>x.id===d.id)?.name[lang]).filter(Boolean);
  const bot2=ov_ds.slice(-2).map(d=>DOMAINS.find(x=>x.id===d.id)?.name[lang]).filter(Boolean);

  rr(cx,8,y,W-16,24,P.white,P.border,4);
  T(cx,tr('أبرز ملاحظات النتائج','Commentary Highlights'),rtl?W-14:14,y+6,{s:9,c:P.blue,b:true,a:ta,rtl});
  if(top2.length){
    T(cx,tr('أبرز نقاط القوة: ','Strong capability in: ')+top2.join(tr(' و',', ')),
      rtl?W-14:14,y+13.5,{s:7.5,c:BAND.Strong.c,a:ta,rtl,mw:W-28});
  }
  if(bot2.length){
    T(cx,tr('أولويات التطوير: ','Development priorities: ')+bot2.join(tr(' و',', ')),
      rtl?W-14:14,y+20,{s:7.5,c:BAND.Critical.c,a:ta,rtl,mw:W-28});
  }

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// P5–10 — DOMAIN DEEP-DIVE (one page per domain)
// ═══════════════════════════════════════════════════════════════════════════════
function p_domain(rpt,lang,idx,pgNum){
  const{cv,cx}=page(P.offwht);
  const rtl=lang==='ar',tr=(ar,en)=>rtl?ar:en;
  const ta=rtl?'right':'left';
  const ds=rpt.domain_scores||{};
  const subs=rpt.sub_competency_scores||{};
  const domain=DOMAINS[idx];
  const dd=ds[domain.id]||{score:0,band:'Critical'};
  const band=dd.band||sb(dd.score);
  const dClr=DC[idx]||P.blue;
  const content=domain.content[band]?.[lang]||{};

  hdr(cx,domain.name[lang],pgNum,lang,dClr);
  ftr(cx);

  let y=20;

  // domain header band
  rr(cx,0,y,W,22,P.white,null);
  ln(cx,0,y+22,W,y+22,P.border,.4);
  dot(cx,rtl?W-21:21,y+11,9,dClr+'22',dClr,.7);
  T(cx,String(idx+1),rtl?W-21:21,y+11,{s:10,c:dClr,b:true,a:'center'});
  T(cx,domain.name[lang],   rtl?W-35:35,y+7,  {s:11,c:P.blue,b:true,a:ta,rtl});
  T(cx,domain.description[lang],rtl?W-35:35,y+15,{s:7.5,c:P.muted,a:ta,rtl,mw:W-60});
  y+=26;

  // score bar (Hogan)
  rr(cx,8,y,W-16,20,P.white,P.border,4);
  T(cx,tr('الدرجة المئوية','Percentile Score'),rtl?W-14:14,y+5,{s:7,c:P.muted,a:ta,rtl});
  hbar(cx,14,y+10,W-28,7,dd.score);
  const bbxW=lang==='ar'?38:44;
  rr(cx,rtl?13:W-bbxW-7,y+3,bbxW,8,bc(band)+'22',bc(band),4);
  T(cx,bl(band,lang)+' — '+dd.score+'%',rtl?13+bbxW/2:W-bbxW-7+bbxW/2,y+7,{s:7,c:bc(band),b:true,a:'center'});
  y+=24;

  // what this domain covers (reference: "What This Domain Covers" in HTML)
  rr(cx,8,y,W-16,20,P.white,P.border,4);
  rr(cx,rtl?W-11:8,y,3,20,dClr,null,1.5);
  T(cx,tr('ما يغطيه هذا المجال','What This Domain Covers'),rtl?W-15:14,y+6,{s:8.5,c:P.blue,b:true,a:ta,rtl});
  wrap(cx,domain.description[lang],rtl?W-15:14,y+14,W-26,4.5,{s:8,c:P.sub,rtl});
  y+=24;

  // score interpretation (reference: "What Your Score Suggests")
  rr(cx,8,y,W-16,26,P.white,P.border,4);
  rr(cx,rtl?W-11:8,y,3,26,dClr,null,1.5);
  T(cx,tr('ماذا تعني درجتك','What Your Score Suggests'),rtl?W-15:14,y+7,{s:9,c:P.blue,b:true,a:ta,rtl});
  wrap(cx,content.summary||'',rtl?W-15:14,y+16,W-26,4.8,{s:8.5,c:P.text,rtl});
  y+=30;

  // sub-competencies (reference: "Sub-Competencies" section in HTML)
  const subC=domain.sub_competencies;
  const subH=12+subC.length*18+4;
  rr(cx,8,y,W-16,subH,P.white,P.border,4);
  T(cx,tr('المقاييس الفرعية','Sub-Competencies'),rtl?W-14:14,y+7,{s:9,c:P.blue,b:true,a:ta,rtl});
  ln(cx,12,y+12,W-12,y+12,P.border,.35);

  subC.forEach((sc,si)=>{
    const ky=`${domain.id}__${sc.id}`;
    const sData=subs[ky]||{score:dd.score,band};
    const sBand=sData.band||sb(sData.score);
    const sy=y+15+si*18;
    if(si%2===0)rr(cx,10,sy,W-20,17,P.light,null,2.5);

    // sub name
    T(cx,sc.name[lang],rtl?W-16:16,sy+5,{s:8.5,c:P.text,b:true,a:ta,rtl,mw:W-72});
    // score %
    T(cx,sData.score+'%',rtl?33:W-28,sy+5,{s:9,c:bc(sBand),b:true,a:'center'});
    // mini bar
    minibar(cx,rtl?38:W-75,sy+10,58,4.5,sData.score,bc(sBand));
    // band pill
    const pW=lang==='ar'?22:28;
    rr(cx,rtl?12:W-pW-12,sy+1.5,pW,6,bbg(sBand),bbd(sBand),3,.25);
    T(cx,bl(sBand,lang),rtl?12+pW/2:W-pW/2-12,sy+4.5,{s:5.5,c:bc(sBand),b:true,a:'center'});
  });
  y+=subH+4;

  if(y>H-52)return cv; // no room for more

  // strengths + recommendations (2 cols, reference HTML)
  const colW=(W-20)/2;
  const itemsS=content.strengths||[];
  const itemsR=content.recommendations||[];
  const maxItems=Math.max(itemsS.length,itemsR.length,3);
  const twoColH=12+Math.min(maxItems,4)*9+4;

  // strengths
  rr(cx,8,y,colW,twoColH,P.white,P.border,4);
  rr(cx,rtl?8+colW-3:8,y,3,twoColH,BAND.Strong.c,null,1.5);
  T(cx,tr('أنت على الأرجح تتميز في','You Are Likely Doing Well In'),
    rtl?8+colW-7:12,y+7,{s:8,c:BAND.Strong.c,b:true,a:ta,rtl});
  itemsS.slice(0,4).forEach((s,si)=>{
    const sy=y+14+si*9;
    dot(cx,rtl?8+colW-9:12,sy,2,BAND.Strong.c,null);
    T(cx,s,rtl?8+colW-14:17,sy,{s:7.5,c:P.text,a:ta,rtl,mw:colW-22});
  });

  // recommendations
  const rx=10+colW+2;
  rr(cx,rx,y,colW,twoColH,P.white,P.border,4);
  rr(cx,rtl?rx+colW-3:rx,y,3,twoColH,dClr,null,1.5);
  T(cx,tr('للمضي أبعد — نصائح التطوير','Development Tips to Go Further'),
    rtl?rx+colW-7:rx+4,y+7,{s:8,c:dClr,b:true,a:ta,rtl});
  itemsR.slice(0,4).forEach((r,ri)=>{
    const ry=y+14+ri*9;
    rr(cx,rtl?rx+colW-11:rx+7,ry-2,2,4,dClr,null,1);
    T(cx,r,rtl?rx+colW-15:rx+12,ry,{s:7.5,c:P.text,a:ta,rtl,mw:colW-20});
  });
  y+=twoColH+5;

  // development goals 3-phase
  if(content.goals&&y<H-40){
    const phases=[
      {k:'short',ar:'الهدف القصير • ٠–٣٠ يوم',en:'Short-Term • 0–30 Days',c:'#B52020',bg:'#FDEAEA'},
      {k:'mid',  ar:'الهدف المتوسط • ٣٠–٩٠ يوم',en:'Mid-Term • 30–90 Days',c:'#B87000',bg:'#FDF3E0'},
      {k:'long', ar:'الهدف الطويل • ٩٠+ يوم',  en:'Long-Term • 90+ Days', c:'#1A7A4A',bg:'#E8F8EF'},
    ];
    const pw=(W-20)/3;
    phases.forEach((ph,pi)=>{
      const px=8+pi*(pw+2),pH=32;
      rr(cx,px,y,pw,pH,ph.bg,ph.c+'44',3);
      seg(cx,px,y,pw,9,ph.c,ph.c+'cc','h',3);
      T(cx,rtl?ph.ar:ph.en,px+pw/2,y+4.5,{s:6.5,c:P.white,b:true,a:'center',rtl});
      wrap(cx,content.goals[ph.k]||'',rtl?px+pw-4:px+4,y+16,pw-8,4.5,{s:7.5,c:P.text,rtl});
    });
  }

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// P11 — PERSONAL DEVELOPMENT PLAN
// ═══════════════════════════════════════════════════════════════════════════════
function p11_devplan(rpt,lang){
  const{cv,cx}=page(P.offwht);
  const rtl=lang==='ar',tr=(ar,en)=>rtl?ar:en;
  const ta=rtl?'right':'left',tx=rtl?W-12:12;
  const ds=rpt.domain_scores||{};
  const ov=rpt.overall||{score:0,band:'Moderate'};
  const band=ov.band||sb(ov.score);

  hdr(cx,tr('خطة التطوير الشخصية','Personal Development Plan'),11,lang);
  ftr(cx);

  let y=20;

  // profile + overall mini
  rr(cx,8,y,W-16,18,P.white,P.border,4);
  gauge(cx,rtl?W-21:21,y+9,8,ov.score,bc(band),P.border);
  T(cx,ov.score+'%',rtl?W-21:21,y+9,{s:9,c:bc(band),b:true,a:'center'});
  T(cx,tr(`أُعدّت لـ: ${rpt.user?.preferred_name||rpt.user?.name||'—'}`,
          `Prepared for: ${rpt.user?.preferred_name||rpt.user?.name||'—'}`),
    rtl?W-34:34,y+8,{s:9,c:P.blue,b:true,a:ta,rtl});
  T(cx,tr(`النتيجة الإجمالية: ${bl(band,lang)} (${ov.score}%)`,
          `Overall: ${bl(band,lang)} (${ov.score}%)`),
    rtl?W-34:34,y+15,{s:7.5,c:bc(band),a:ta,rtl});
  y+=22;

  // top 3 priorities
  secTitle(cx,tr('أولويات التطوير المقترحة','Suggested Development Priorities'),tx,y+4,rtl);
  y+=13;

  const sorted=DOMAINS.map((d,i)=>({...d,idx:i,score:ds[d.id]?.score||0,band:ds[d.id]?.band||'Critical'}))
    .sort((a,b)=>a.score-b.score).slice(0,3);

  sorted.forEach((d,pi)=>{
    const dClr=DC[d.idx]||P.blue;
    const content=d.content[d.band]?.[lang]||{};
    const goals=content.goals||{};
    const rH=50;

    rr(cx,8,y,W-16,rH,P.white,P.border,4);
    rr(cx,rtl?W-11:8,y,3,rH,dClr,null,1.5);
    dot(cx,rtl?W-21:21,y+rH/2,9,dClr+'22',dClr,.7);
    T(cx,String(pi+1),rtl?W-21:21,y+rH/2,{s:10,c:dClr,b:true,a:'center'});
    T(cx,d.name[lang],rtl?W-35:35,y+9,{s:9.5,c:P.blue,b:true,a:ta,rtl,mw:W-76});
    // score bar
    hbar(cx,34,y+16,W-46,5,d.score);
    // 3 goals
    const gw=(W-56)/3;
    [{k:'short',l:tr('٠–٣٠','0–30'),c:'#B52020'},{k:'mid',l:tr('٣٠–٩٠','30–90'),c:'#B87000'},{k:'long',l:tr('٩٠+','90+'),c:'#1A7A4A'}]
    .forEach((ph,gi)=>{
      const gx=34+gi*(gw+3);
      rr(cx,gx,y+24,gw,24,P.light,P.border,3);
      rr(cx,gx,y+24,gw,7,ph.c+'cc',null,3);
      T(cx,ph.l,gx+gw/2,y+27.5,{s:6,c:P.white,b:true,a:'center'});
      wrap(cx,goals[ph.k]||'',gx+3,y+35,gw-6,4,{s:7,c:P.text,rtl});
    });
    y+=rH+4;
  });

  // monthly reflection
  if(y<H-55){
    secTitle(cx,tr('قالب التأمل الشهري','Monthly Reflection Template'),tx,y+4,rtl);
    y+=13;
    const qW=(W-20)/2;
    [tr('ما الذي تحسّن هذا الشهر؟','What improved this month?'),
     tr('ما التحديات التي واجهتني؟','What challenges did I face?'),
     tr('ما الذي سأعدّل في خطتي؟','What will I adjust in my plan?'),
     tr('ما ركيزتي للشهر القادم؟','What is my next month focus?'),
    ].forEach((q,qi)=>{
      const qx=8+(qi%2)*(qW+4),qy=y+Math.floor(qi/2)*22;
      rr(cx,qx,qy,qW,20,P.white,P.border,3);
      T(cx,q,rtl?qx+qW-5:qx+5,qy+6,{s:7.5,c:P.blue,b:true,a:ta,rtl,mw:qW-10});
      ln(cx,qx+5,qy+13,qx+qW-5,qy+13,P.border,.3);
      ln(cx,qx+5,qy+17,qx+qW-5,qy+17,P.border,.3);
    });
  }

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// P12 — BACK COVER (Next Steps + About Optivance)
// ═══════════════════════════════════════════════════════════════════════════════
function p12_back(rpt,lang){
  const{cv,cx}=page();
  const rtl=lang==='ar',tr=(ar,en)=>rtl?ar:en;
  const ov=rpt.overall||{score:0,band:'Moderate'};
  const band=ov.band||sb(ov.score);
  const user=rpt.user||{};

  // full dark bg
  const bg=cx.createLinearGradient(0,0,0,CH);
  bg.addColorStop(0,'#0B1E30');bg.addColorStop(1,'#081525');
  cx.fillStyle=bg;cx.fillRect(0,0,CW,CH);
  cx.save();cx.globalAlpha=.035;cx.fillStyle=P.teal;
  for(let xi=0;xi<CW;xi+=mm(8))for(let yi=0;yi<CH;yi+=mm(8)){cx.beginPath();cx.arc(xi,yi,mm(.35),0,Math.PI*2);cx.fill();}
  cx.restore();
  rr(cx,0,H-2,W,2,P.teal);

  // next steps
  T(cx,tr('خطواتك القادمة مع Optivance','Your Next Steps with Optivance'),
    W/2,18,{s:13,c:P.teal,b:true,a:'center',rtl});
  T(cx,tr('كيف تواصل رحلة نموك','How you can continue your growth journey'),
    W/2,26,{s:8,c:P.white+'66',a:'center',rtl});
  ln(cx,20,30,W-20,30,P.teal+'33',.4);

  const steps=[
    {n:'01',c:'#1558A0',ar:'راجع تقريرك بعمق',    en:'Deep-Review Your Report',
     da:'اقرأ تحليل كل مجال وافهم ما تعنيه نتيجتك', de:'Read each domain and understand what your score means'},
    {n:'02',c:'#1A7A4A',ar:'حدد هدفين فوريين',    en:'Set Two Immediate Goals',
     da:'اختر هدفين من قسم ٠–٣٠ يومًا وابدأ بهما',   de:'Pick two 0–30 day goals and start today'},
    {n:'03',c:'#B87000',ar:'شاركه مع مشرفك',      en:'Share With Your Manager',
     da:'ناقش التقرير مع مشرفك أو مرشدك المهني',     de:'Discuss with your direct manager or mentor'},
    {n:'04',c:'#6B21A8',ar:'تابع تقدمك شهريًا',    en:'Track Progress Monthly',
     da:'استخدم قالب التأمل مرة كل ٣٠ يومًا',        de:'Use the reflection template every 30 days'},
    {n:'05',c:P.teal,   ar:'استكشف حلول Optivance',en:'Explore Optivance Solutions',
     da:'تصفح متجرنا للأدوات والتدريبات التي تدعم نموك',de:'Browse tools and training that support your growth'},
  ];
  let sy=35;
  steps.forEach((s,si)=>{
    rr(cx,8,sy,W-16,17,P.white+'0d',P.white+'1e',4);
    dot(cx,rtl?W-19:19,sy+8.5,7.5,s.c+'28',s.c,.7);
    T(cx,s.n,rtl?W-19:19,sy+8.5,{s:7.5,c:s.c,b:true,a:'center'});
    T(cx,rtl?s.ar:s.en, rtl?W-31:31,sy+5.5, {s:9,c:P.white,b:true,a:rtl?'right':'left',rtl});
    T(cx,rtl?s.da:s.de, rtl?W-31:31,sy+12.5,{s:7.5,c:P.white+'77',a:rtl?'right':'left',rtl,mw:W-43});
    sy+=19;
  });

  ln(cx,16,sy+4,W-16,sy+4,P.white+'18',.4);
  sy+=9;

  // About Optivance
  T(cx,tr('عن Optivance','About Optivance'),W/2,sy,{s:12,c:P.teal,b:true,a:'center',rtl});
  sy+=8;
  wrap(cx,
    tr('Optivance شركة استشارية متخصصة في تطوير المواهب وبناء القدرات المؤسسية. نساعد الأفراد والمنظمات على تحويل نتائج التقييم إلى نمو مهني حقيقي وقابل للقياس.',
       'Optivance is a specialized consultancy in talent development and organizational capability building. We help individuals and organizations transform assessment results into real, measurable professional growth.'),
    18,sy,W-36,5.5,{s:8,c:P.white+'88',rtl});
  sy+=17;
  T(cx,'www.optivance.com  ·  info@optivance.com',W/2,sy,{s:8,c:P.teal+'88',a:'center'});
  sy+=10;

  // large score gauge
  gauge(cx,W/2,sy+22,22,ov.score,bc(band),P.white+'20');
  T(cx,ov.score+'%', W/2,sy+22,{s:22,c:bc(band),b:true,a:'center'});
  T(cx,bl(band,lang),W/2,sy+36,{s:9,c:bc(band),b:true,a:'center',rtl});
  T(cx,user.name||'',W/2,sy+45,{s:12,c:P.white,b:true,a:'center',rtl});
  sy+=52;

  ln(cx,30,sy,W-30,sy,P.white+'15',.4);
  T(cx,'OPTIVANCE',W/2,sy+8,{s:19,c:P.teal,b:true,a:'center'});
  T(cx,tr('بناء المهنيين المتميزين','Building Distinguished Professionals'),W/2,sy+16,{s:8,c:P.white+'55',a:'center',rtl});
  T(cx,tr(`رقم التقرير: ${rpt.report_id||'—'}`,`Report ID: ${rpt.report_id||'—'}`),
    W/2,H-14,{s:7,c:P.white+'33',a:'center',rtl});
  T(cx,'© 2025 OPTIVANCE — All Rights Reserved',W/2,H-9,{s:6,c:P.white+'25',a:'center'});

  return cv;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateCompetencyPDF(reportData, attemptId) {
  const lang = reportData.language || 'ar';
  const pages = [
    p1_cover(reportData, lang),
    p2_welcome(reportData, lang),
    p3_about(reportData, lang),
    p4_snapshot(reportData, lang),
    ...DOMAINS.map((_, i) => p_domain(reportData, lang, i, i+5)),
    p11_devplan(reportData, lang),
    p12_back(reportData, lang),
  ];
  const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  pages.forEach((cv, i) => {
    if (i > 0) pdf.addPage();
    pdf.addImage(cv.toDataURL('image/png', 1.0), 'PNG', 0, 0, W, H, '', 'FAST');
  });
  const name = `optivance-competency-${reportData.report_id || attemptId || 'report'}.pdf`;
  pdf.save(name);
  return name;
}