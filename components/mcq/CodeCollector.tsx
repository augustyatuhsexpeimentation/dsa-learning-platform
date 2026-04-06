"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Code2 } from "lucide-react";

export default function CodeCollector({ count, justCollected }: { count: number; justCollected: boolean }) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-full shadow-lg"
          >
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">{count} snippet{count !== 1 ? "s" : ""}</span>
            {justCollected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [1.3, 1] }}
                transition={{ duration: 0.3 }}
                className="text-xs"
              >
                +1
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
