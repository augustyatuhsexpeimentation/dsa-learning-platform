"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getProblem } from "@/lib/utils/problems";
import { useProgress } from "@/lib/hooks/useProgress";
import { useTimer } from "@/lib/hooks/useTimer";
import Header from "@/components/layout/Header";
import BackButton from "@/components/layout/BackButton";
import ProblemStatement from "@/components/mcq/ProblemStatement";
import QuestionCard from "@/components/mcq/QuestionCard";
import PhaseTransition from "@/components/mcq/PhaseTransition";
import CodeCollector from "@/components/mcq/CodeCollector";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";

export default function ProblemPage() {
  const params = useParams();
  const router = useRouter();
  const problem = getProblem(params.id as string);
  const { progress, update } = useProgress(problem!);
  const { seconds, setSeconds } = useTimer(0);
  const [showPhase, setShowPhase] = useState(false);
  const [justCollected, setJustCollected] = useState(false);

  useEffect(() => {
    if (progress) setSeconds(progress.timeSpent);
  }, [progress?.problemId]);

  useEffect(() => {
    if (progress) {
      const interval = setInterval(() => {
        update((p) => ({ ...p, timeSpent: seconds }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [seconds, progress]);

  const phases = useMemo(() => {
    if (!problem) return [];
    const map = new Map<string, number>();
    problem.mcqChain.forEach((q) => {
      map.set(q.phase, (map.get(q.phase) || 0) + 1);
    });
    return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
  }, [problem]);

  if (!problem || !progress) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </main>
      </>
    );
  }

  const chain = problem.mcqChain;
  const idx = progress.currentIndex;
  const current = chain[idx];
  const prevPhase = idx > 0 ? chain[idx - 1].phase : null;
  const isNewPhase = current && prevPhase !== null && current.phase !== prevPhase && !showPhase;

  const snippetCount = progress.collectedSnippets.length;

  const handleAnswer = (selected: number, correct: boolean, hintUsed: boolean) => {
    update((p) => {
      const next = { ...p };
      next.answers = { ...p.answers, [current.id]: { selected, correct, hintUsed } };
      if (current.isCodeBuilding && correct && current.codeSnippet) {
        const already = p.collectedSnippets.some((s) => s.code === current.codeSnippet);
        if (!already) {
          next.collectedSnippets = [...p.collectedSnippets, { code: current.codeSnippet, label: current.codeLabel || "" }];
          setJustCollected(true);
          setTimeout(() => setJustCollected(false), 1000);
        }
      }
      next.timeSpent = seconds;
      return next;
    });
  };

  const handleNext = () => {
    if (idx >= chain.length - 1) {
      update((p) => ({ ...p, timeSpent: seconds }));
      router.push(`/problem/${problem.id}/assemble`);
      return;
    }
    const nextQ = chain[idx + 1];
    if (nextQ.phase !== current.phase) {
      setShowPhase(true);
    }
    update((p) => ({ ...p, currentIndex: idx + 1, timeSpent: seconds }));
  };

  const handlePrev = () => {
    if (idx > 0) update((p) => ({ ...p, currentIndex: idx - 1 }));
  };

  const answered = Object.keys(progress.answers).length;

  return (
    <>
      <Header />
      <ProgressBar
        value={answered}
        max={chain.length}
        segments={phases}
        className="fixed top-14 left-0 right-0 z-40"
      />
      <main className="max-w-4xl mx-auto px-4 pt-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <BackButton href="/" label="Problems" />
          <div className="flex items-center gap-2">
            <Badge variant={problem.difficulty}>{problem.difficulty}</Badge>
            <span className="text-xs text-[var(--text-secondary)]">
              {idx + 1} / {chain.length}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <ProblemStatement problem={problem} />
        </div>

        {showPhase ? (
          <PhaseTransition phase={current.phase} onDone={() => setShowPhase(false)} />
        ) : (
          <QuestionCard
            question={current}
            questionNumber={idx + 1}
            totalQuestions={chain.length}
            phase={current.phase}
            savedAnswer={progress.answers[current.id]}
            language={problem.language}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            canGoPrev={idx > 0}
            isLast={idx === chain.length - 1}
          />
        )}

        <CodeCollector count={snippetCount} justCollected={justCollected} />
      </main>
    </>
  );
}
