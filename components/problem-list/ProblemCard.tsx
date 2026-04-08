"use client";
import { Problem, UserProgress } from "@/data/schema";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Clock, CheckCircle2, PlayCircle, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { resetProgress } from "@/lib/utils/storage";
import { RotateCcw } from "lucide-react";

interface ProblemCardProps {
  problem: Problem;
  progress?: UserProgress | null;
}

export default function ProblemCard({ problem, progress }: ProblemCardProps) {
  const router = useRouter();
  const status = progress?.status || "not-started";

  const statusIcon = {
    "not-started": <Circle className="w-4 h-4 text-[var(--text-secondary)]" />,
    "in-progress": <PlayCircle className="w-4 h-4 text-amber-400" />,
    completed: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  };

  return (
    <Card hover onClick={() => router.push(`/problem/${problem.id}`)}>
      <div className="flex items-start justify-between mb-3">
        <Badge variant={problem.difficulty}>
          {problem.difficulty}
        </Badge>
        {statusIcon[status]}
      </div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">{problem.title}</h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(problem.tags ?? []).map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
        <Clock className="w-3.5 h-3.5" />
        <span>{problem.estimatedMinutes} min</span>
        <span className="mx-1">·</span>
        <span>{problem.mcqChain.length} questions</span>
      </div>
      {status !== "not-started" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetProgress(problem.id);
            window.location.reload();
          }}
          className="mt-3 flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-red-400 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset progress
        </button>
      )}
    </Card>
  );
}
