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
