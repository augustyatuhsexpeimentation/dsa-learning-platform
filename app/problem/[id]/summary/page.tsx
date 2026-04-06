"use client";
import { useParams, useRouter } from "next/navigation";
import { getProblem } from "@/lib/utils/problems";
import { useProgress } from "@/lib/hooks/useProgress";
import { resetProgress } from "@/lib/utils/storage";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/summary/StatsCard";
import ReasoningChain from "@/components/summary/ReasoningChain";
import FinalCode from "@/components/summary/FinalCode";
import Button from "@/components/ui/Button";

export default function SummaryPage() {
  const params = useParams();
  const router = useRouter();
  const problem = getProblem(params.id as string);
  const { progress } = useProgress(problem!);

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

  const answers = Object.values(progress.answers);
  const correctFirst = answers.filter((a) => a.correct).length;
  const hintsUsed = answers.filter((a) => a.hintUsed).length;

  const handleReset = () => {
    resetProgress(problem.id);
    router.push(`/problem/${problem.id}`);
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Problem Complete!</h1>
          <p className="text-[var(--text-secondary)]">{problem.title}</p>
        </div>

        <StatsCard
          totalQuestions={problem.mcqChain.length}
          correctFirst={correctFirst}
          hintsUsed={hintsUsed}
          timeSpent={progress.timeSpent}
          assemblyAttempts={progress.assemblyAttempts}
        />

        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Your Reasoning Chain</h2>
          <ReasoningChain steps={problem.reasoningChain} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Final Solution</h2>
          <FinalCode code={problem.finalCodeSnippets.join("\n")} language={problem.language} />
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button variant="secondary" onClick={() => router.push("/")}>
            Back to Problems
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            Solve Again
          </Button>
        </div>
      </main>
    </>
  );
}
