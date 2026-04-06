import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart());
  console.log(`✅ ${path}`);
}

// ─── ROOT LAYOUT ───
w('app/layout.tsx', `
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA Explorer — Learn Data Structures & Algorithms Interactively",
  description: "Discover DSA solutions through guided MCQ chains and interactive code assembly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
`);

// ─── HOME PAGE ───
w('app/page.tsx', `
"use client";
import { useState, useMemo, useEffect } from "react";
import { getAllProblems } from "@/lib/utils/problems";
import { getAllProgress } from "@/lib/utils/storage";
import { UserProgress } from "@/data/schema";
import Header from "@/components/layout/Header";
import FilterBar from "@/components/problem-list/FilterBar";
import ProblemCard from "@/components/problem-list/ProblemCard";
import { Code2 } from "lucide-react";

export default function HomePage() {
  const problems = getAllProblems();
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [sortBy, setSortBy] = useState("difficulty");

  useEffect(() => {
    setProgress(getAllProgress());
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    problems.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [problems]);

  const diffOrder = { beginner: 0, intermediate: 1, hard: 2 };

  const filtered = useMemo(() => {
    let list = [...problems];
    if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    if (difficulty) list = list.filter((p) => p.difficulty === difficulty);
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    list.sort((a, b) => {
      if (sortBy === "difficulty") return diffOrder[a.difficulty] - diffOrder[b.difficulty];
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return a.estimatedMinutes - b.estimatedMinutes;
    });
    return list;
  }, [problems, search, difficulty, tag, sortBy]);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium">
            <Code2 className="w-4 h-4" />
            Interactive DSA Learning
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Discover Solutions, Don&apos;t Memorize Them
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Solve DSA problems through guided questions. Build understanding step by step, then assemble the code yourself.
          </p>
        </div>

        <FilterBar
          search={search} onSearchChange={setSearch}
          difficulty={difficulty} onDifficultyChange={setDifficulty}
          tag={tag} onTagChange={setTag}
          allTags={allTags}
          sortBy={sortBy} onSortChange={setSortBy}
        />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            No problems match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProblemCard key={p.id} problem={p} progress={progress[p.id]} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
`);

// ─── PROBLEM MCQ PAGE ───
w('app/problem/[id]/page.tsx', `
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
      router.push(\`/problem/\${problem.id}/assemble\`);
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
`);

// ─── ASSEMBLY PAGE ───
w('app/problem/[id]/assemble/page.tsx', `
"use client";
import { useParams, useRouter } from "next/navigation";
import { getProblem } from "@/lib/utils/problems";
import { useProgress } from "@/lib/hooks/useProgress";
import Header from "@/components/layout/Header";
import BackButton from "@/components/layout/BackButton";
import AssemblyZone from "@/components/assembly/AssemblyZone";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function AssemblePage() {
  const params = useParams();
  const router = useRouter();
  const problem = getProblem(params.id as string);
  const { progress, update } = useProgress(problem!);
  const [solved, setSolved] = useState(false);

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

  const snippets = problem.finalCodeSnippets;
  const labels = progress.collectedSnippets.map((s) => s.label);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <BackButton href={\`/problem/\${problem.id}\`} label="Back to questions" />
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-4 mb-2">Assemble the Solution</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Arrange the code snippets you collected into the correct order.
        </p>

        <AssemblyZone
          snippets={snippets}
          labels={labels}
          language={problem.language}
          attempts={progress.assemblyAttempts}
          onSuccess={() => {
            setSolved(true);
            update((p) => ({ ...p, status: "completed" }));
          }}
          onAttempt={() => {
            update((p) => ({ ...p, assemblyAttempts: p.assemblyAttempts + 1 }));
          }}
        />

        {solved && (
          <div className="mt-6 text-center">
            <Button onClick={() => router.push(\`/problem/\${problem.id}/summary\`)}>
              Continue to Summary →
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
`);

// ─── SUMMARY PAGE ───
w('app/problem/[id]/summary/page.tsx', `
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
    router.push(\`/problem/\${problem.id}\`);
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
          <FinalCode code={problem.finalCodeSnippets.join("\\n")} language={problem.language} />
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
`);

// ─── NEXT.CONFIG ───
w('next.config.ts', `
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`);

console.log("\\n🎉 All files written successfully!");
console.log("\\nRun: npm run dev");
