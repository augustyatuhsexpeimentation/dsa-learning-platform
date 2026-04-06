import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart());
  console.log(`✅ ${path}`);
}

// ─── MCQ COMPONENTS ───

w('components/mcq/OptionButton.tsx', `
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
`);

w('components/mcq/ExplanationPanel.tsx', `
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
      className={\`rounded-lg border p-4 mt-4 \${
        correct
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-red-500/5 border-red-500/20"
      }\`}
    >
      <div className="flex items-center gap-2 mb-2">
        {correct ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
        <span className={\`font-semibold text-sm \${correct ? "text-emerald-400" : "text-red-400"}\`}>
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
`);

w('components/mcq/HintPanel.tsx', `
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
`);

w('components/mcq/PhaseTransition.tsx', `
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
`);

w('components/mcq/CodeCollector.tsx', `
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
`);

w('components/mcq/Confetti.tsx', `
"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Confetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<{ x: number; y: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    if (show) {
      setParticles(
        Array.from({ length: 20 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * -50,
          color: ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 5)],
          delay: Math.random() * 0.3,
        }))
      );
    } else {
      setParticles([]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: \`\${p.x}vw\`, y: "-10px", opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: 360 }}
          transition={{ duration: 1.5, delay: p.delay, ease: "easeIn" }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
`);

w('components/mcq/QuestionCard.tsx', `
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MCQuestion } from "@/data/schema";
import OptionButton from "./OptionButton";
import ExplanationPanel from "./ExplanationPanel";
import HintPanel from "./HintPanel";
import Confetti from "./Confetti";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Button from "@/components/ui/Button";

interface QuestionCardProps {
  question: MCQuestion;
  questionNumber: number;
  totalQuestions: number;
  phase: string;
  savedAnswer?: { selected: number; correct: boolean };
  language?: string;
  onAnswer: (selected: number, correct: boolean, hintUsed: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  canGoPrev: boolean;
  isLast: boolean;
}

export default function QuestionCard({
  question, questionNumber, totalQuestions, phase,
  savedAnswer, language, onAnswer, onNext, onPrev, canGoPrev, isLast
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(savedAnswer?.selected ?? null);
  const [submitted, setSubmitted] = useState(!!savedAnswer);
  const [isCorrect, setIsCorrect] = useState(savedAnswer?.correct ?? false);
  const [hintUsed, setHintUsed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setSelected(savedAnswer?.selected ?? null);
    setSubmitted(!!savedAnswer);
    setIsCorrect(savedAnswer?.correct ?? false);
    setHintUsed(false);
    setShowConfetti(false);
  }, [question.id, savedAnswer]);

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === question.correctIndex;
    setSubmitted(true);
    setIsCorrect(correct);
    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
    onAnswer(selected, correct, hintUsed);
  };

  const getOptionState = (idx: number): "idle" | "correct" | "wrong" | "missed" => {
    if (!submitted) return "idle";
    if (idx === question.correctIndex) return "correct";
    if (idx === selected && !isCorrect) return "wrong";
    return "idle";
  };

  const wrongKey = selected !== null ? String(selected) : "";
  const wrongExp = !isCorrect && question.wrongExplanations?.[wrongKey];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Confetti show={showConfetti} />

        <div className="mb-2 text-xs font-medium text-brand-400 uppercase tracking-wide">
          {phase} — Question {questionNumber} of {totalQuestions}
        </div>

        <div className="prose prose-sm prose-invert max-w-none mb-4 text-[var(--text-primary)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.questionText}</ReactMarkdown>
        </div>

        {question.diagram && (
          <pre className="text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4 mb-4 overflow-x-auto text-[var(--text-secondary)]">
            {question.diagram}
          </pre>
        )}

        <div className="space-y-3 mb-4">
          {question.options.map((opt, i) => (
            <OptionButton
              key={i}
              option={opt}
              index={i}
              selected={selected === i}
              state={getOptionState(i)}
              disabled={submitted}
              onClick={() => !submitted && setSelected(i)}
              language={language}
            />
          ))}
        </div>

        {question.hint && !submitted && (
          <HintPanel hint={question.hint} onReveal={() => setHintUsed(true)} />
        )}

        {submitted && (
          <ExplanationPanel
            correct={isCorrect}
            explanation={question.explanation}
            wrongExplanation={wrongExp || undefined}
          />
        )}

        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={onPrev} disabled={!canGoPrev}>
            Previous
          </Button>
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={selected === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={onNext}>
              {isLast ? "Go to Code Assembly →" : "Next →"}
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
`);

console.log("\\n✅ Part 3 complete (MCQ components)");
console.log("Now run: node write-files-4.mjs");
