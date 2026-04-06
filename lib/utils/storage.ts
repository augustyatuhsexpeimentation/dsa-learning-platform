import { UserProgress } from "@/data/schema";

const STORAGE_KEY = "dsa-progress";

function getAll(): Record<string, UserProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveAll(data: Record<string, UserProgress>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProgress(problemId: string): UserProgress | null {
  return getAll()[problemId] || null;
}

export function saveProgress(progress: UserProgress) {
  const all = getAll();
  all[progress.problemId] = progress;
  saveAll(all);
}

export function resetProgress(problemId: string) {
  const all = getAll();
  delete all[problemId];
  saveAll(all);
}

export function getAllProgress(): Record<string, UserProgress> {
  return getAll();
}
