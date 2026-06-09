import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

const ANGLES = [90, 18, -54, -126, -198]; // R=top, O=right, U=bottom-right, T=bottom-left, E=left

function polarToXY(angleDeg, r) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: 50 + r * Math.cos(rad),
    y: 50 - r * Math.sin(rad),
  };
}

export default function RouteInfographic({ steps, colors, lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(null);

  const R = 36; // orbit radius %
  const dotR = 42; // decorative dots radius

  // Decorative dots around the circle
  const decorDots = Array.from({ length: 18 }, (_, i) => {
    const a = (i * 360) / 18;
    return polarToXY(a, dotR);
  });

  return (
    <div ref={ref} className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* ── LEFT: step list ── */}
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => {
            const color = colors[i];
            const isActive = active === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-default transition-all duration-300"
                style={{
                  background: isActive ? `${color}14` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? color + '40' : 'rgba(255,255,255,0.07)'}`,
                }}>
                {/* Letter badge */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-black text-sm transition-all duration-300"
                  style={{
                    background: isActive ? color : `${color}18`,
                    color: isActive ? '#0D1F33' : color,
                    boxShadow: isActive ? `0 4px 16px ${color}44` : 'none',
                  }}>
                  {step.letter}
                </div>
                <div>
                  <div className="font-heading font-bold text-white text-sm leading-snug">{step.word}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{step[lang]}</div>
                </div>
              </motion.div>
            );
          })}

          {/* Badge bottom */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl self-start"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <Star size={12} style={{ color: '#05E1AE' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {lang === 'ar' ? 'إطار حصري مُسجَّل' : 'Exclusive Registered Framework'}
            </span>
          </motion.div>
        </div>

        {/* ── RIGHT: circular diagram ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
          style={{ aspectRatio: '1', maxWidth: '420px', margin: '0 auto', width: '100%' }}>

          {/* SVG layer */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
            {/* Dashed orbit ring */}
            <motion.circle
              cx="50" cy="50" r={R}
              fill="none"
              stroke="#05E1AE"
              strokeWidth="0.4"
              strokeDasharray="2 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.45 } : {}}
              transition={{ duration: 1.4, delay: 0.3, ease: 'easeInOut' }}
            />

            {/* Decorative dots on outer ring */}
            {decorDots.map((d, i) => (
              <motion.circle key={i} cx={d.x} cy={d.y} r="0.5"
                fill="#05E1AE"
                initial={{ opacity: 0 }} animate={inView ? { opacity: i % 3 === 0 ? 0.7 : 0.25 } : {}}
                transition={{ delay: 0.6 + i * 0.03 }}
              />
            ))}

            {/* Connecting lines from center to each node */}
            {steps.map((step, i) => {
              const pos = polarToXY(ANGLES[i], R);
              const isActive = active === i;
              return (
                <motion.line key={i}
                  x1="50" y1="50"
                  x2={pos.x} y2={pos.y}
                  stroke={colors[i]}
                  strokeWidth={isActive ? "0.6" : "0.3"}
                  strokeDasharray="1.5 1.5"
                  opacity={isActive ? 0.7 : 0.2}
                  style={{ transition: 'all 0.3s' }}
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
                />
              );
            })}
          </svg>

          {/* Center circle */}
          <motion.div
            initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.4 }}
            className="absolute w-[26%] h-[26%] rounded-full flex flex-col items-center justify-center z-10"
            style={{
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #1a2d45 0%, #0D1F33 100%)',
              border: '1px solid rgba(5,225,174,0.3)',
              boxShadow: '0 0 40px rgba(5,225,174,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
            <span className="font-heading font-black text-white leading-none" style={{ fontSize: 'clamp(0.7rem, 2vw, 1.1rem)' }}>ROUTE°</span>
            <span style={{ fontSize: 'clamp(0.4rem, 1vw, 0.6rem)', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em' }}>METHOD</span>
          </motion.div>

          {/* Node buttons for each step */}
          {steps.map((step, i) => {
            const pos = polarToXY(ANGLES[i], R);
            const color = colors[i];
            const isActive = active === i;

            return (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.45 + i * 0.13 }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="absolute flex flex-col items-center cursor-pointer"
                style={{
                  left: `${pos.x}%`, top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                }}>

                {/* Outer glow ring */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute w-full h-full rounded-xl"
                    style={{ background: color }}
                  />
                )}

                {/* Node square */}
                <motion.div
                  animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="rounded-xl flex items-center justify-center font-heading font-black shadow-lg"
                  style={{
                    width: 'clamp(28px, 6vw, 36px)',
                    height: 'clamp(28px, 6vw, 36px)',
                    fontSize: 'clamp(0.75rem, 1.8vw, 1rem)',
                    background: isActive
                      ? `linear-gradient(135deg, ${color}, ${color}aa)`
                      : `linear-gradient(135deg, #1e2f45, #162538)`,
                    color: isActive ? '#0D1F33' : color,
                    border: `1.5px solid ${color}${isActive ? 'ff' : '60'}`,
                    boxShadow: isActive ? `0 6px 24px ${color}55` : `0 2px 8px rgba(0,0,0,0.4)`,
                  }}>
                  {step.letter}
                </motion.div>

                {/* Label below node */}
                <div className="mt-1 font-heading font-bold text-center"
                  style={{
                    fontSize: 'clamp(0.45rem, 1.1vw, 0.6rem)',
                    color: isActive ? color : 'rgba(255,255,255,0.4)',
                    transition: 'color 0.2s',
                    whiteSpace: 'nowrap',
                  }}>
                  {step.word}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}