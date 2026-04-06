"use client";
import { motion } from "framer-motion";

export default function PhaseTransition({ phase, onDone }: { phase: string; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.4 }}
      onAnimationComplete={onDone}
      className="flex items-center justify-center min-h-[300px]"
    >
      <div className="text-center">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "3rem" }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="h-0.5 gradient-brand mx-auto mb-4 rounded-full"
        />
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{phase}</h2>
        <p className="text-sm text-[var(--text-secondary)]">Let&apos;s continue</p>
      </div>
    </motion.div>
  );
}
