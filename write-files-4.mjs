import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart());
  console.log(`✅ ${path}`);
}

// ─── ASSEMBLY COMPONENTS ───

w('components/assembly/AssemblyZone.tsx', `
"use client";
import { useState, useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { shuffle } from "@/lib/utils/shuffle";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, CheckCircle2, XCircle, PartyPopper } from "lucide-react";

interface AssemblyZoneProps {
  snippets: string[];
  labels: string[];
  language: string;
  attempts: number;
  onSuccess: () => void;
  onAttempt: () => void;
}

function SortableSnippet({ id, code, language, status }: { id: string; code: string; language: string; status?: "correct" | "wrong" }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={\`flex items-stretch rounded-lg border-2 transition-colors \${
        isDragging ? "opacity-50 border-brand-400" :
        status === "correct" ? "border-emerald-400 bg-emerald-500/5" :
        status === "wrong" ? "border-red-400 bg-red-500/5" :
        "border-[var(--border-color)]"
      } bg-[var(--bg-card)]\`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center px-2 cursor-grab active:cursor-grabbing text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="flex-1 overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: "0.75rem", borderRadius: 0, fontSize: "0.8rem", background: "transparent" }}
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {status && (
        <div className="flex items-center px-3">
          {status === "correct" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
        </div>
      )}
    </div>
  );
}

export default function AssemblyZone({ snippets, labels, language, attempts, onSuccess, onAttempt }: AssemblyZoneProps) {
  const [order, setOrder] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Record<string, "correct" | "wrong">>({});
  const [solved, setSolved] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const ids = snippets.map((_, i) => \`snippet-\${i}\`);
    setOrder(shuffle(ids));
  }, [snippets]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder((prev) => {
        const oldIdx = prev.indexOf(active.id as string);
        const newIdx = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIdx, newIdx);
      });
      setStatuses({});
    }
  };

  const checkSolution = () => {
    onAttempt();
    const newStatuses: Record<string, "correct" | "wrong"> = {};
    let allCorrect = true;
    order.forEach((id, idx) => {
      const snippetIdx = parseInt(id.split("-")[1]);
      if (snippetIdx === idx) {
        newStatuses[id] = "correct";
      } else {
        newStatuses[id] = "wrong";
        allCorrect = false;
      }
    });
    setStatuses(newStatuses);
    if (allCorrect) {
      setSolved(true);
      onSuccess();
    }
  };

  const revealAnswer = () => {
    setShowAnswer(true);
    setOrder(snippets.map((_, i) => \`snippet-\${i}\`));
    const s: Record<string, "correct" | "wrong"> = {};
    snippets.forEach((_, i) => { s[\`snippet-\${i}\`] = "correct"; });
    setStatuses(s);
    setSolved(true);
    onSuccess();
  };

  if (showAnswer || solved) {
    return (
      <div>
        {solved && !showAnswer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <PartyPopper className="w-12 h-12 text-amber-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Solution Assembled!</h3>
            <p className="text-sm text-[var(--text-secondary)]">You got it in {attempts + 1} attempt{attempts > 0 ? "s" : ""}!</p>
          </motion.div>
        )}
        <div className="rounded-lg border border-[var(--border-color)] overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: "1rem", fontSize: "0.85rem" }}
            showLineNumbers
          >
            {snippets.join("\\n")}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        Drag and drop the code snippets into the correct order to build the solution.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 mb-6">
            {order.map((id) => {
              const idx = parseInt(id.split("-")[1]);
              return (
                <SortableSnippet
                  key={id}
                  id={id}
                  code={snippets[idx]}
                  language={language}
                  status={statuses[id]}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex items-center gap-3">
        <Button onClick={checkSolution}>Check Solution</Button>
        {attempts >= 3 && (
          <Button variant="ghost" onClick={revealAnswer}>Show correct order</Button>
        )}
      </div>
    </div>
  );
}
`);

// ─── SUMMARY COMPONENTS ───

w('components/summary/StatsCard.tsx', `
import Card from "@/components/ui/Card";
import { Target, Lightbulb, Clock, Layers } from "lucide-react";

interface StatsCardProps {
  totalQuestions: number;
  correctFirst: number;
  hintsUsed: number;
  timeSpent: number;
  assemblyAttempts: number;
}

export default function StatsCard({ totalQuestions, correctFirst, hintsUsed, timeSpent, assemblyAttempts }: StatsCardProps) {
  const mins = Math.floor(timeSpent / 60);
  const secs = timeSpent % 60;
  const stats = [
    { icon: Target, label: "First-try accuracy", value: \`\${correctFirst}/\${totalQuestions}\`, color: "text-emerald-400" },
    { icon: Lightbulb, label: "Hints used", value: String(hintsUsed), color: "text-amber-400" },
    { icon: Clock, label: "Time taken", value: \`\${mins}m \${secs}s\`, color: "text-blue-400" },
    { icon: Layers, label: "Assembly attempts", value: String(assemblyAttempts), color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="text-center">
          <s.icon className={\`w-5 h-5 mx-auto mb-2 \${s.color}\`} />
          <div className="text-xl font-bold text-[var(--text-primary)]">{s.value}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">{s.label}</div>
        </Card>
      ))}
    </div>
  );
}
`);

w('components/summary/ReasoningChain.tsx', `
import { ReasoningStep } from "@/data/schema";
import { ArrowRight } from "lucide-react";

export default function ReasoningChain({ steps }: { steps: ReasoningStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-4 relative">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 h-full bg-[var(--border-color)] min-h-[2rem]" />}
          </div>
          <div className="pb-6 flex-1">
            <div className="text-sm font-medium text-[var(--text-primary)] mb-1">{step.question}</div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <ArrowRight className="w-3 h-3 text-brand-400 shrink-0" />
              <span>{step.insight}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
`);

w('components/summary/FinalCode.tsx', `
"use client";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

export default function FinalCode({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border border-[var(--border-color)] overflow-hidden">
      <button
        onClick={copy}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors text-[var(--text-secondary)]"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: "1rem", fontSize: "0.85rem" }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
`);

// ─── PROBLEM STATEMENT COMPONENT ───

w('components/mcq/ProblemStatement.tsx', `
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
`);

console.log("\\n✅ Part 4 complete (assembly, summary, problem statement components)");
console.log("Now run: node write-files-5.mjs");
