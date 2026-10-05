import React from 'react';
import { motion } from 'framer-motion';

/**
 * QuickProgress — subtle "3 / 6" progress indicator with a thin bar.
 */
export default function QuickProgress({ current = 1, total = 6 }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #1A3A5C, #05E1AE)' }}
          initial={false}
          animate={{ width: `${Math.round((current / total) * 100)}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-bold text-slate-400 tabular-nums flex-shrink-0">
        {current} / {total}
      </span>
    </div>
  );
}