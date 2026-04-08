"use client";
import { useState, useMemo, useEffect } from "react";
import { getAllProblems } from "@/lib/utils/problems";
import { getAllProgress } from "@/lib/utils/storage";
import { UserProgress } from "@/data/schema";
import Header from "@/components/layout/Header";
import FilterBar from "@/components/problem-list/FilterBar";
import ProblemCard from "@/components/problem-list/ProblemCard";
import { Code2 } from "lucide-react";

export default function HomePage() {
  const problems = getAllProblems();
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [sortBy, setSortBy] = useState("difficulty");

  useEffect(() => {
    setProgress(getAllProgress());
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const p of problems) {
      for (const t of p.tags ?? []) {
        s.add(t);
      }
    }
  return Array.from(s).sort();
  }, [problems]);

  const diffOrder = { beginner: 0, intermediate: 1, hard: 2 };

  const filtered = useMemo(() => {
    let list = [...problems];
    if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    if (difficulty) list = list.filter((p) => p.difficulty === difficulty);
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    list.sort((a, b) => {
      if (sortBy === "difficulty") return diffOrder[a.difficulty] - diffOrder[b.difficulty];
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return a.estimatedMinutes - b.estimatedMinutes;
    });
    return list;
  }, [problems, search, difficulty, tag, sortBy]);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium">
            <Code2 className="w-4 h-4" />
            Interactive DSA Learning
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Discover Solutions, Don&apos;t Memorize Them
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Solve DSA problems through guided questions. Build understanding step by step, then assemble the code yourself.
          </p>
        </div>

        <FilterBar
          search={search} onSearchChange={setSearch}
          difficulty={difficulty} onDifficultyChange={setDifficulty}
          tag={tag} onTagChange={setTag}
          allTags={allTags}
          sortBy={sortBy} onSortChange={setSortBy}
        />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            No problems match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered?.map((p) => (
              <ProblemCard key={p.id} problem={p} progress={progress[p.id]} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
