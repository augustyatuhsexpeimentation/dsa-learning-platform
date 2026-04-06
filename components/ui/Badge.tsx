import { cn } from "@/lib/utils/cn";

const difficultyColors = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "beginner" | "intermediate" | "hard";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  const color = variant === "default"
    ? "bg-brand-500/10 text-brand-400 border-brand-500/20"
    : difficultyColors[variant];
  return (
    <span className={cn("px-2.5 py-0.5 text-xs font-medium rounded-full border", color, className)}>
      {children}
    </span>
  );
}
