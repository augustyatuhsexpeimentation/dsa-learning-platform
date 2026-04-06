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
          className={`w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-brand-400`}
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
