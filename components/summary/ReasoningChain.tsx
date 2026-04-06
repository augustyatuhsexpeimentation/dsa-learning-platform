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
