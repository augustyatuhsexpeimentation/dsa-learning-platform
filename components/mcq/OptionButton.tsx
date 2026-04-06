"use client";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { MCQOption } from "@/data/schema";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface OptionButtonProps {
  option: MCQOption;
  index: number;
  selected: boolean;
  state: "idle" | "correct" | "wrong" | "missed";
  disabled: boolean;
  onClick: () => void;
  language?: string;
}

const letters = ["A", "B", "C", "D"];

export default function OptionButton({ option, index, selected, state, disabled, onClick, language }: OptionButtonProps) {
  const stateStyles = {
    idle: selected
      ? "border-brand-400 bg-brand-500/10"
      : "border-[var(--border-color)] hover:border-brand-400/50",
    correct: "border-emerald-400 bg-emerald-500/10",
    wrong: "border-red-400 bg-red-500/10",
    missed: "border-emerald-400/50 bg-emerald-500/5",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-colors duration-200",
        stateStyles[state],
        disabled && state === "idle" && "opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex gap-3">
        <span className={cn(
          "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border",
          state === "correct" ? "border-emerald-400 text-emerald-400" :
          state === "wrong" ? "border-red-400 text-red-400" :
          selected ? "border-brand-400 text-brand-400 bg-brand-500/20" :
          "border-[var(--border-color)] text-[var(--text-secondary)]"
        )}>
          {letters[index]}
        </span>
        <div className="flex-1 min-w-0">
          {option.isCode ? (
            <SyntaxHighlighter
              language={language || "python"}
              style={vscDarkPlus}
              customStyle={{ margin: 0, padding: "0.5rem", borderRadius: "0.375rem", fontSize: "0.8rem", background: "transparent" }}
              wrapLongLines
            >
              {option.label}
            </SyntaxHighlighter>
          ) : (
            <span className="text-sm text-[var(--text-primary)]">{option.label}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
