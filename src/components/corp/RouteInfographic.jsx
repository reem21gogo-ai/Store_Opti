import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function RouteInfographic({ steps, colors, lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="mb-12">

      {/* ── DESKTOP: horizontal timeline ── */}
      <div className="hidden md:block relative">

        {/* Animated connecting track */}
        <div className="absolute top-[72px] left-0 right-0 h-[2px] mx-16" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div className="h-full origin-left"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ background: 'linear-gradient(90deg, #05E1AE, #3a9abf, #336fa3, #5bbdd6, #2ec9a0)' }}
          />
        </div>

        {/* Steps row */}
        <div className="flex items-start gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const color = colors[i];
            const isLast = i === steps.length - 1;

            return (
              <div key={i} className="flex-1 flex flex-col items-center relative">

                {/* Arrow connector (between cards) */}
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.2 }}
                    className="absolute top-[60px] right-0 translate-x-1/2 z-10"
                    style={{ color: colors[i + 1] }}>
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                      <path d="M13 1L19 7L13 13" stroke={colors[i + 1]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                )}

                {/* Icon circle on the track */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 + i * 0.15 }}
                  className="relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-lg mb-5"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color}88)`,
                    boxShadow: `0 0 0 4px #0D1F33, 0 0 0 6px ${color}40, 0 8px 24px ${color}44`,
                  }}>
                  <Icon size={20} color="#0D1F33" strokeWidth={2.5} />
                </motion.div>

                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.3 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, boxShadow: `0 20px 48px ${color}22` }}
                  className="w-full mx-1 rounded-2xl px-4 py-5 text-center cursor-default relative overflow-hidden"
                  style={{ background: '#161f2e', border: `1px solid ${color}30` }}>

                  {/* Glow spot */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                    style={{ background: `${color}18` }} />

                  {/* Big letter */}
                  <div className="font-heading font-black leading-none mb-1" style={{ fontSize: '3.2rem', color, opacity: 0.15 }}>
                    {step.letter}
                  </div>
                  <div className="font-heading font-black text-white text-base -mt-3 mb-1">{step.word}</div>
                  <div className="text-xs leading-snug px-1" style={{ color: `${color}bb` }}>{step[lang]}</div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
                </motion.div>

                {/* Step index badge */}
                <motion.div
                  initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.13 }}
                  className="mt-3 text-xs font-black tabular-nums"
                  style={{ color: `${color}55` }}>
                  0{i + 1}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE: vertical timeline ── */}
      <div className="md:hidden flex flex-col gap-0 relative">
        {/* Vertical track */}
        <div className="absolute top-6 bottom-6 left-[25px] w-[2px]" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div className="w-full origin-top"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ height: '100%', background: 'linear-gradient(180deg, #05E1AE, #336fa3, #2ec9a0)' }}
          />
        </div>

        {steps.map((step, i) => {
          const Icon = step.icon;
          const color = colors[i];
          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-5 pb-6 relative">

              {/* Circle on track */}
              <motion.div
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                transition={{ type: 'spring', delay: 0.3 + i * 0.12 }}
                className="flex-shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center z-10 shadow-md"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color}88)`,
                  boxShadow: `0 0 0 3px #0D1F33, 0 0 0 5px ${color}40`,
                }}>
                <Icon size={20} color="#0D1F33" strokeWidth={2.5} />
              </motion.div>

              {/* Content */}
              <div className="flex-1 rounded-2xl px-4 py-4 relative overflow-hidden"
                style={{ background: '#161f2e', border: `1px solid ${color}30` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-heading font-black text-xl" style={{ color, opacity: 0.2 }}>{step.letter}</span>
                  <span className="font-heading font-bold text-white text-sm">{step.word}</span>
                  <span className="text-xs font-black ms-auto" style={{ color: `${color}55` }}>0{i + 1}</span>
                </div>
                <p className="text-xs leading-snug" style={{ color: `${color}bb` }}>{step[lang]}</p>
                <div className="absolute bottom-0 left-3 right-3 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}