import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart());
  console.log(`✅ ${path}`);
}

// ─── UI COMPONENTS ───

w('components/ui/Button.tsx', `
"use client";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variants = {
  primary: "gradient-brand text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40",
  secondary: "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-brand-400",
  ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({ variant = "primary", size = "md", className, children, disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(
        "rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
`);

w('components/ui/Badge.tsx', `
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
`);

w('components/ui/Card.tsx', `
import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className, onClick, hover }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5",
        hover && "cursor-pointer hover:border-brand-400/50 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}
`);

w('components/ui/ProgressBar.tsx', `
"use client";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max: number;
  segments?: { label: string; count: number }[];
  className?: string;
}

export default function ProgressBar({ value, max, segments, className }: ProgressBarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  if (segments) {
    let accum = 0;
    return (
      <div className={\`h-1.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden flex \${className || ""}\`}>
        {segments.map((seg, i) => {
          const segPct = (seg.count / max) * 100;
          const filled = Math.min(Math.max(value - accum, 0), seg.count);
          const fillPct = seg.count > 0 ? (filled / seg.count) * 100 : 0;
          accum += seg.count;
          return (
            <div key={i} className="relative" style={{ width: \`\${segPct}%\` }}>
              {i > 0 && <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--border-color)]" />}
              <motion.div
                className="h-full gradient-brand rounded-full"
                initial={{ width: 0 }}
                animate={{ width: \`\${fillPct}%\` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={\`h-1.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden \${className || ""}\`}>
      <motion.div
        className="h-full gradient-brand rounded-full"
        initial={{ width: 0 }}
        animate={{ width: \`\${pct}%\` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
`);

// ─── LAYOUT COMPONENTS ───

w('components/layout/Header.tsx', `
"use client";
import { useTheme } from "@/lib/hooks/useTheme";
import { Sun, Moon, Code2 } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { dark, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border-color)]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
          <Code2 className="w-5 h-5 text-brand-400" />
          <span>DSA Explorer</span>
        </Link>
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
`);

w('components/layout/BackButton.tsx', `
"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ href, label }: { href?: string; label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => (href ? router.push(href) : router.back())}
      className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label || "Back"}
    </button>
  );
}
`);

// ─── PROBLEM LIST COMPONENTS ───

w('components/problem-list/ProblemCard.tsx', `
"use client";
import { Problem, UserProgress } from "@/data/schema";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Clock, CheckCircle2, PlayCircle, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <Card hover onClick={() => router.push(\`/problem/\${problem.id}\`)}>
      <div className="flex items-start justify-between mb-3">
        <Badge variant={problem.difficulty}>
          {problem.difficulty}
        </Badge>
        {statusIcon[status]}
      </div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">{problem.title}</h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {problem.tags.map((tag) => (
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
    </Card>
  );
}
`);

w('components/problem-list/FilterBar.tsx', `
"use client";
import { Search } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  difficulty: string;
  onDifficultyChange: (v: string) => void;
  tag: string;
  onTagChange: (v: string) => void;
  allTags: string[];
  sortBy: string;
  onSortChange: (v: string) => void;
}

export default function FilterBar({
  search, onSearchChange, difficulty, onDifficultyChange,
  tag, onTagChange, allTags, sortBy, onSortChange
}: FilterBarProps) {
  const sel = "bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-400";
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={\`w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-brand-400\`}
        />
      </div>
      <select value={difficulty} onChange={(e) => onDifficultyChange(e.target.value)} className={sel}>
        <option value="">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="hard">Hard</option>
      </select>
      <select value={tag} onChange={(e) => onTagChange(e.target.value)} className={sel}>
        <option value="">All Tags</option>
        {allTags.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className={sel}>
        <option value="difficulty">Sort: Difficulty</option>
        <option value="title">Sort: Title</option>
        <option value="time">Sort: Time</option>
      </select>
    </div>
  );
}
`);

console.log("\\n✅ Part 2 complete (UI & layout components)");
console.log("Now run: node write-files-3.mjs");
