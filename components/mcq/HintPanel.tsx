"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

export default function HintPanel({ hint, onReveal }: { hint: string; onReveal: () => void }) {
  const [show, setShow] = useState(false);

  return (
    <div className="mt-3">
      {!show ? (
        <button
          onClick={() => { setShow(true); onReveal(); }}
          className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          Need a hint?
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-200/80"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-amber-400">Hint</span>
            </div>
            {hint}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
