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
      className={`flex items-stretch rounded-lg border-2 transition-colors ${
        isDragging ? "opacity-50 border-brand-400" :
        status === "correct" ? "border-emerald-400 bg-emerald-500/5" :
        status === "wrong" ? "border-red-400 bg-red-500/5" :
        "border-[var(--border-color)]"
      } bg-[var(--bg-card)]`}
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
    const ids = snippets.map((_, i) => `snippet-${i}`);
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
    setOrder(snippets.map((_, i) => `snippet-${i}`));
    const s: Record<string, "correct" | "wrong"> = {};
    snippets.forEach((_, i) => { s[`snippet-${i}`] = "correct"; });
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
            {snippets.join("\n")}
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
