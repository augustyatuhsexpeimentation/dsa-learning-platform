"use client";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ExplanationPanelProps {
  correct: boolean;
  explanation: string;
  wrongExplanation?: string;
}

export default function ExplanationPanel({ correct, explanation, wrongExplanation }: ExplanationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-lg border p-4 mt-4 ${
        correct
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-red-500/5 border-red-500/20"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {correct ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
        <span className={`font-semibold text-sm ${correct ? "text-emerald-400" : "text-red-400"}`}>
          {correct ? "Correct!" : "Not quite right"}
        </span>
      </div>
      {wrongExplanation && (
        <div className="text-sm text-red-300/80 mb-2 pl-7">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{wrongExplanation}</ReactMarkdown>
        </div>
      )}
      <div className="text-sm text-[var(--text-secondary)] pl-7 prose prose-sm prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
