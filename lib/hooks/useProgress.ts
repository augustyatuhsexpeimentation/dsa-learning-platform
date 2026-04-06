"use client";
import { useState, useEffect, useCallback } from "react";
import { Problem, UserProgress } from "@/data/schema";
import { getProgress, saveProgress } from "@/lib/utils/storage";

export function useProgress(problem: Problem) {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const saved = getProgress(problem.id);
    if (saved) {
      setProgress(saved);
    } else {
      const init: UserProgress = {
        problemId: problem.id,
        currentIndex: 0,
        answers: {},
        collectedSnippets: [],
        startedAt: Date.now(),
        timeSpent: 0,
        status: "in-progress",
        assemblyAttempts: 0,
      };
      setProgress(init);
      saveProgress(init);
    }
  }, [problem.id]);

  const update = useCallback((updater: (p: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  return { progress, update };
}
