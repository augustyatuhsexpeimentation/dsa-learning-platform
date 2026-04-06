"use client";
import { useState } from "react";
import { Problem } from "@/data/schema";
import { ChevronDown, ChevronUp } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ProblemStatement({ problem }: { problem: Problem }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--bg-card)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-secondary)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-[var(--text-primary)]">{problem.title}</h2>
          <Badge variant={problem.difficulty}>{problem.difficulty}</Badge>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-[var(--border-color)]">
          <div className="prose prose-sm prose-invert max-w-none mt-3 text-[var(--text-secondary)]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
          </div>
          <div className="mt-4 space-y-3">
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] rounded-lg p-3 text-sm">
                <div className="font-medium text-[var(--text-primary)] mb-1">Example {i + 1}</div>
                <div className="font-mono text-xs text-[var(--text-secondary)]">
                  <div><span className="text-brand-400">Input:</span> {ex.input}</div>
                  <div><span className="text-emerald-400">Output:</span> {ex.output}</div>
                  {ex.explanation && <div className="mt-1 text-[var(--text-secondary)]">{ex.explanation}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div className="text-xs font-medium text-[var(--text-secondary)] mb-1">Constraints:</div>
            <div className="text-xs text-[var(--text-secondary)] font-mono space-y-0.5">
              {problem.constraints.map((c, i) => <div key={i}>• {c}</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
