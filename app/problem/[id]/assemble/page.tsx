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
        <BackButton href={`/problem/${problem.id}`} label="Back to questions" />
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
            <Button onClick={() => router.push(`/problem/${problem.id}/summary`)}>
              Continue to Summary →
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
