"use client";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max: number;
  segments?: { label: string; count: number }[];
  className?: string;
}

export default function ProgressBar({ value, max, segments, className }: ProgressBarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  if (segments) {
    let accum = 0;
    return (
      <div className={`h-1.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden flex ${className || ""}`}>
        {segments.map((seg, i) => {
          const segPct = (seg.count / max) * 100;
          const filled = Math.min(Math.max(value - accum, 0), seg.count);
          const fillPct = seg.count > 0 ? (filled / seg.count) * 100 : 0;
          accum += seg.count;
          return (
            <div key={i} className="relative" style={{ width: `${segPct}%` }}>
              {i > 0 && <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--border-color)]" />}
              <motion.div
                className="h-full gradient-brand rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${fillPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`h-1.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden ${className || ""}`}>
      <motion.div
        className="h-full gradient-brand rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
