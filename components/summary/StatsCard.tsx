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
    { icon: Target, label: "First-try accuracy", value: `${correctFirst}/${totalQuestions}`, color: "text-emerald-400" },
    { icon: Lightbulb, label: "Hints used", value: String(hintsUsed), color: "text-amber-400" },
    { icon: Clock, label: "Time taken", value: `${mins}m ${secs}s`, color: "text-blue-400" },
    { icon: Layers, label: "Assembly attempts", value: String(assemblyAttempts), color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="text-center">
          <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
          <div className="text-xl font-bold text-[var(--text-primary)]">{s.value}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">{s.label}</div>
        </Card>
      ))}
    </div>
  );
}
