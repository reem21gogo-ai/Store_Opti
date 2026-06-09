import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const ANGLES = [90, 18, -54, -126, -198];

function polarToXY(angleDeg, r) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: 50 + r * Math.cos(rad), y: 50 - r * Math.sin(rad) };
}

// Pulsing ring around active node
function PulseRing({ color }) {
  return (
    <>
      {[0, 0.4, 0.8].map((delay, i) => (
        <motion.div key={i}
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.2, delay, repeat: Infinity, ease: 'easeOut' }}
          style={{ background: color, borderRadius: '10px' }}
        />
      ))}
    </>
  );
}

export default function RouteInfographic({ steps, colors, lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(null);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const orbitRef = useRef(null);

  // Slow auto-rotation of the orbit when nothing is hovered
  useEffect(() => {
    if (active !== null) return;
    const id = setInterval(() => {
      setOrbitAngle(a => (a + 0.15) % 360);
    }, 30);
    return () => clearInterval(id);
  }, [active]);

  const R = 36;
  const dotR = 43;
  const decorDots = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 360) / 24 + orbitAngle;
    return { ...polarToXY(a, dotR), bright: i % 4 === 0 };
  });

  return (
    <div ref={ref} className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* ── LEFT: step list ── */}
        <div className="flex flex-col gap-2.5">
          {steps.map((step, i) => {
            const color = colors[i];
            const isActive = active === i;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-default relative overflow-hidden"
                style={{
                  background: isActive ? `${color}12` : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isActive ? color + '45' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                }}>

                {/* Animated left accent bar */}
                <motion.div
                  animate={{ scaleY: isActive ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute start-0 top-3 bottom-3 w-[3px] rounded-full origin-center"
                  style={{ background: color }}
                />

                {/* Shimmer sweep on hover */}
                {isActive && (
                  <motion.div
                    initial={{ x: '-100%' }} animate={{ x: '200%' }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}10, transparent)` }}
                  />
                )}

                {/* Letter badge */}
                <motion.div
                  animate={isActive ? { scale: 1.1, rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-black text-sm"
                  style={{
                    background: isActive ? color : `${color}18`,
                    color: isActive ? '#0D1F33' : color,
                    boxShadow: isActive ? `0 4px 20px ${color}55` : 'none',
                    transition: 'background 0.3s, box-shadow 0.3s',
                  }}>
                  {step.letter}
                </motion.div>

                <div className="flex-1">
                  <motion.div
                    animate={{ x: isActive ? 4 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-heading font-bold text-white text-sm leading-snug">
                    {step.word}
                  </motion.div>
                  <div className="text-xs mt-0.5 transition-colors duration-300"
                    style={{ color: isActive ? `${color}bb` : 'rgba(255,255,255,0.35)' }}>
                    {step[lang]}
                  </div>
                </div>

                {/* Step number */}
                <span className="font-heading font-black text-xs tabular-nums flex-shrink-0"
                  style={{ color: isActive ? `${color}99` : 'rgba(255,255,255,0.1)', transition: 'color 0.3s' }}>
                  0{i + 1}
                </span>
              </motion.div>
            );
          })}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.85 }}
            className="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-xl self-start"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Star size={11} style={{ color: '#05E1AE' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {lang === 'ar' ? 'إطار حصري مُسجَّل' : 'Exclusive Registered Framework'}
            </span>
          </motion.div>
        </div>

        {/* ── RIGHT: orbital diagram ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center select-none"
          style={{ aspectRatio: '1', maxWidth: '420px', margin: '0 auto', width: '100%' }}>

          {/* SVG orbit layer */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>

            {/* Outer faint ring */}
            <circle cx="50" cy="50" r={dotR - 1} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

            {/* Dashed orbit ring — animated draw */}
            <motion.circle cx="50" cy="50" r={R}
              fill="none" stroke="#05E1AE" strokeWidth="0.45" strokeDasharray="2.5 2.8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.4 } : {}}
              transition={{ duration: 1.5, delay: 0.35, ease: 'easeInOut' }}
            />

            {/* Rotating decorative dots */}
            {decorDots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.bright ? '0.7' : '0.4'}
                fill="#05E1AE" opacity={d.bright ? 0.7 : 0.2} />
            ))}

            {/* Connector lines center → nodes */}
            {steps.map((_, i) => {
              const pos = polarToXY(ANGLES[i], R);
              const isAct = active === i;
              return (
                <motion.line key={i}
                  x1="50" y1="50" x2={pos.x} y2={pos.y}
                  stroke={colors[i]}
                  strokeWidth={isAct ? 0.7 : 0.25}
                  strokeDasharray="1.8 1.8"
                  opacity={isAct ? 0.8 : 0.18}
                  style={{ transition: 'all 0.35s' }}
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.12 }}
                />
              );
            })}

            {/* Arc highlight for active step */}
            {active !== null && (() => {
              const a1 = ANGLES[active] + 25;
              const a2 = ANGLES[active] - 25;
              const p1 = polarToXY(a1, R);
              const p2 = polarToXY(a2, R);
              return (
                <motion.path
                  key={active}
                  d={`M ${p1.x} ${p1.y} A ${R} ${R} 0 0 1 ${p2.x} ${p2.y}`}
                  fill="none" stroke={colors[active]} strokeWidth="1.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })()}
          </svg>

          {/* Center circle */}
          <motion.div
            initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.45 }}
            whileHover={{ scale: 1.07 }}
            className="absolute flex flex-col items-center justify-center rounded-full z-10"
            style={{
              width: '26%', height: '26%',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #1e2f48 0%, #0e1c2e 100%)',
              border: '1.5px solid rgba(5,225,174,0.35)',
              boxShadow: '0 0 32px rgba(5,225,174,0.14), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
            {/* Inner glow */}
            <motion.div className="absolute inset-0 rounded-full"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: 'radial-gradient(circle, rgba(5,225,174,0.12) 0%, transparent 70%)' }}
            />
            <span className="font-heading font-black text-white relative z-10 leading-none"
              style={{ fontSize: 'clamp(0.65rem, 1.8vw, 1rem)' }}>ROUTE°</span>
            <span className="relative z-10" style={{ fontSize: 'clamp(0.38rem, 0.9vw, 0.55rem)', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.18em' }}>METHOD</span>
          </motion.div>

          {/* Step nodes */}
          {steps.map((step, i) => {
            const pos = polarToXY(ANGLES[i], R);
            const color = colors[i];
            const isAct = active === i;

            return (
              <motion.div key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 + i * 0.12 }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="absolute flex flex-col items-center cursor-pointer z-20"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}>

                {/* Pulse rings when active */}
                <div className="relative">
                  {isAct && <PulseRing color={color} />}

                  <motion.div
                    animate={isAct
                      ? { scale: 1.2, boxShadow: `0 0 0 2px ${color}60, 0 8px 28px ${color}55` }
                      : { scale: 1,   boxShadow: `0 2px 8px rgba(0,0,0,0.5)` }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                    className="rounded-xl flex items-center justify-center font-heading font-black relative z-10"
                    style={{
                      width: 'clamp(28px, 5.5vw, 36px)',
                      height: 'clamp(28px, 5.5vw, 36px)',
                      fontSize: 'clamp(0.7rem, 1.7vw, 0.95rem)',
                      background: isAct
                        ? `linear-gradient(135deg, ${color}, ${color}cc)`
                        : 'linear-gradient(135deg, #1e3050, #162538)',
                      color: isAct ? '#0D1F33' : color,
                      border: `1.5px solid ${color}${isAct ? 'ff' : '55'}`,
                    }}>
                    {step.letter}
                  </motion.div>
                </div>

                {/* Node label */}
                <motion.div
                  animate={{ opacity: isAct ? 1 : 0.45, y: isAct ? 2 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 font-heading font-bold text-center whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(0.42rem, 1vw, 0.58rem)',
                    color: isAct ? color : 'rgba(255,255,255,0.38)',
                  }}>
                  {step.word}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}