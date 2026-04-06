import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart());
  console.log(`✅ ${path}`);
}

// ─── TAILWIND CONFIG ───
w('tailwind.config.ts', `
import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
    },
  },
  plugins: [],
};
export default config;
`);

// ─── GLOBAL CSS ───
w('app/globals.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --border-color: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --accent: #6366f1;
}

.light {
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-card: #ffffff;
  --border-color: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --accent: #4f46e5;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: "Inter", system-ui, sans-serif;
}

.font-mono {
  font-family: "JetBrains Mono", monospace;
}

@layer utilities {
  .gradient-brand {
    @apply bg-gradient-to-r from-brand-500 to-purple-500;
  }
}
`);

// ─── TYPESCRIPT SCHEMA ───
w('data/schema.ts', `
export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface MCQOption {
  label: string;
  isCode?: boolean;
}

export interface MCQuestion {
  id: string;
  phase: string;
  questionText: string;
  diagram?: string;
  options: [MCQOption, MCQOption, MCQOption, MCQOption];
  correctIndex: number;
  explanation: string;
  wrongExplanations?: Record<string, string>;
  isCodeBuilding?: boolean;
  codeSnippet?: string;
  codeLabel?: string;
  hint?: string;
}

export interface ReasoningStep {
  question: string;
  insight: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "hard";
  tags: string[];
  estimatedMinutes: number;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  mcqChain: MCQuestion[];
  finalCodeSnippets: string[];
  reasoningChain: ReasoningStep[];
  language: string;
}

export interface UserProgress {
  problemId: string;
  currentIndex: number;
  answers: Record<string, { selected: number; correct: boolean; hintUsed: boolean }>;
  collectedSnippets: { code: string; label: string }[];
  startedAt: number;
  timeSpent: number;
  status: "not-started" | "in-progress" | "completed";
  assemblyAttempts: number;
}
`);

// ─── SAMPLE PROBLEM JSON ───
w('data/questions/two-sum.json', JSON.stringify({
  id: "two-sum",
  title: "Two Sum",
  difficulty: "beginner",
  tags: ["array", "hash-map"],
  estimatedMinutes: 20,
  description: "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`.\\n\\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.",
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]." },
    { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]." }
  ],
  constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
  language: "python",
  mcqChain: [
    {
      id: "q1", phase: "Understanding the Problem", questionText: "What does the Two Sum problem ask us to find?",
      options: [
        { label: "Two numbers that multiply to give the target" },
        { label: "The indices of two numbers that add up to the target" },
        { label: "The sum of all elements in the array" },
        { label: "The two largest numbers in the array" }
      ],
      correctIndex: 1,
      explanation: "The problem asks for the **indices** (positions) of two numbers whose sum equals the target value.",
      wrongExplanations: { "0": "Multiplication is not involved — we need addition.", "2": "We don't need the total sum, just two specific numbers." },
      hint: "Focus on what the function should return — indices, not the numbers themselves."
    },
    {
      id: "q2", phase: "Understanding the Problem",
      questionText: "Given `nums = [2, 7, 11, 15]` and `target = 9`, what should be returned?",
      diagram: "Index:  0  1   2   3\\nValue:  2  7  11  15\\n\\ntarget = 9\\n2 + 7 = 9  ✓ → indices [0, 1]",
      options: [
        { label: "[2, 7]" },
        { label: "[0, 1]" },
        { label: "[1, 2]" },
        { label: "[0, 2]" }
      ],
      correctIndex: 1,
      explanation: "We return the **indices** [0, 1] because nums[0]=2 and nums[1]=7 add up to 9.",
      wrongExplanations: { "0": "We return indices, not the values themselves." }
    },
    {
      id: "q3", phase: "Understanding the Problem",
      questionText: "Can we use the same element twice? For example, if `nums = [3, 4]` and `target = 6`, can we return `[0, 0]`?",
      options: [
        { label: "Yes, any index can be used twice" },
        { label: "No, we must use two different indices" },
        { label: "Only if no other pair exists" },
        { label: "It depends on the array size" }
      ],
      correctIndex: 1,
      explanation: "The problem states we **may not use the same element twice**. Each index must be different.",
      hint: "Re-read the problem constraints carefully."
    },
    {
      id: "q4", phase: "Exploring Approaches",
      questionText: "What is the **brute force** approach to solve Two Sum?",
      options: [
        { label: "Sort the array and use binary search" },
        { label: "Check every pair of elements using two nested loops" },
        { label: "Use a stack to track elements" },
        { label: "Use recursion to split the array" }
      ],
      correctIndex: 1,
      explanation: "The brute force checks every possible pair (i, j) where i ≠ j to see if nums[i] + nums[j] == target. This takes O(n²) time.",
      wrongExplanations: { "0": "Sorting changes indices, making it harder to return original positions." }
    },
    {
      id: "q5", phase: "Exploring Approaches",
      questionText: "The brute force is O(n²). What data structure lets us find \"does a specific value exist?\" in O(1) average time?",
      options: [
        { label: "Array" },
        { label: "Linked List" },
        { label: "Hash Map (dictionary)" },
        { label: "Binary Search Tree" }
      ],
      correctIndex: 2,
      explanation: "A **hash map** (Python dictionary) provides O(1) average-time lookups. This is the key insight for optimizing Two Sum!",
      hint: "Think about which data structure gives constant-time lookups."
    },
    {
      id: "q6", phase: "Building the Idea",
      questionText: "If we're at index `i` with value `nums[i]`, what value do we need to find to complete the pair?",
      options: [
        { label: "`target * nums[i]`" },
        { label: "`target - nums[i]`" },
        { label: "`target + nums[i]`" },
        { label: "`nums[i] - target`" }
      ],
      correctIndex: 1,
      explanation: "If `nums[i] + x = target`, then `x = target - nums[i]`. This value is called the **complement**.",
      hint: "If one number is nums[i], what must the other be for them to sum to target?"
    },
    {
      id: "q7", phase: "Building the Idea",
      questionText: "What should we store in the hash map?",
      diagram: "As we iterate through nums:\\n\\nFor each nums[i], we want to quickly check:\\n  \"Have I seen (target - nums[i]) before?\"\\n\\nSo the hash map should map: value → index",
      options: [
        { label: "Map each index to its value: {0: 2, 1: 7, ...}" },
        { label: "Map each value to its index: {2: 0, 7: 1, ...}" },
        { label: "Map each value to the target: {2: 9, 7: 9, ...}" },
        { label: "Map each pair sum to indices: {9: [0,1], ...}" }
      ],
      correctIndex: 1,
      explanation: "We map **value → index** so we can quickly look up whether a complement value exists and get its index.",
      wrongExplanations: { "0": "We need to look up by value, not by index." }
    },
    {
      id: "q8", phase: "Building the Idea",
      questionText: "Should we build the hash map first (two passes) or build it as we go (one pass)?",
      options: [
        { label: "Two passes: first build map, then search" },
        { label: "One pass: check and insert simultaneously" },
        { label: "Three passes: build, search, verify" },
        { label: "It doesn't matter" }
      ],
      correctIndex: 1,
      explanation: "One pass is more elegant and efficient. For each element, we first check if its complement exists in the map. If not, we add the current element. This also naturally avoids using the same element twice.",
      hint: "Can you check for the complement and add to the map in the same loop?"
    },
    {
      id: "q9", phase: "Building the Idea",
      questionText: "Walk through the algorithm with `nums = [2, 7, 11, 15]`, `target = 9`. What happens at index 1 (value 7)?",
      diagram: "Step-by-step:\\n\\ni=0: val=2, complement=7, map={} → 7 not found → map={2:0}\\ni=1: val=7, complement=2, map={2:0} → 2 FOUND at index 0!\\n→ return [0, 1]",
      options: [
        { label: "complement=2, not in map, add 7 to map" },
        { label: "complement=2, found in map at index 0, return [0, 1]" },
        { label: "complement=16, not in map, add 7 to map" },
        { label: "complement=7, found in map, return [1, 1]" }
      ],
      correctIndex: 1,
      explanation: "At i=1, complement = 9 - 7 = 2. We check the map: 2 is there (mapped to index 0). So we return [0, 1].",
    },
    {
      id: "q10", phase: "Writing the Code",
      questionText: "What is the correct function signature and initialization?",
      options: [
        { label: "def twoSum(self, nums, target):\\n    seen = {}", isCode: true },
        { label: "def twoSum(self, nums, target):\\n    seen = []", isCode: true },
        { label: "def twoSum(self, nums):\\n    seen = {}", isCode: true },
        { label: "def twoSum(self, target):\\n    seen = {}", isCode: true }
      ],
      correctIndex: 0,
      explanation: "We need both `nums` and `target` as parameters, and initialize an empty dictionary `seen` to use as our hash map.",
      isCodeBuilding: true,
      codeSnippet: "def twoSum(self, nums, target):\n    seen = {}",
      codeLabel: "Function signature & initialization"
    },
    {
      id: "q11", phase: "Writing the Code",
      questionText: "How do we iterate through the array with both index and value?",
      options: [
        { label: "for i in nums:", isCode: true },
        { label: "for i, num in enumerate(nums):", isCode: true },
        { label: "for i in range(len(nums) - 1):", isCode: true },
        { label: "while i < len(nums):", isCode: true }
      ],
      correctIndex: 1,
      explanation: "`enumerate(nums)` gives us both the index `i` and the value `num` in each iteration — exactly what we need.",
      isCodeBuilding: true,
      codeSnippet: "    for i, num in enumerate(nums):",
      codeLabel: "Loop with enumerate"
    },
    {
      id: "q12", phase: "Writing the Code",
      questionText: "How do we calculate the complement?",
      options: [
        { label: "        complement = num - target", isCode: true },
        { label: "        complement = target - num", isCode: true },
        { label: "        complement = target + num", isCode: true },
        { label: "        complement = target // num", isCode: true }
      ],
      correctIndex: 1,
      explanation: "The complement is `target - num`. If this value exists in our map, we've found our pair.",
      isCodeBuilding: true,
      codeSnippet: "        complement = target - num",
      codeLabel: "Calculate complement"
    },
    {
      id: "q13", phase: "Writing the Code",
      questionText: "How do we check if the complement exists and return the result?",
      options: [
        { label: "        if complement in seen:\\n            return [seen[complement], i]", isCode: true },
        { label: "        if complement in seen:\\n            return [complement, num]", isCode: true },
        { label: "        if complement == num:\\n            return [i, i]", isCode: true },
        { label: "        if seen.get(complement):\\n            return [i, complement]", isCode: true }
      ],
      correctIndex: 0,
      explanation: "We check `complement in seen` and return `[seen[complement], i]` — the index stored in the map and the current index.",
      wrongExplanations: { "1": "We need to return indices, not values." },
      isCodeBuilding: true,
      codeSnippet: "        if complement in seen:\n            return [seen[complement], i]",
      codeLabel: "Check complement & return"
    },
    {
      id: "q14", phase: "Writing the Code",
      questionText: "If the complement isn't found, what do we do?",
      options: [
        { label: "        seen[i] = num", isCode: true },
        { label: "        seen[num] = i", isCode: true },
        { label: "        seen.append(num)", isCode: true },
        { label: "        return []", isCode: true }
      ],
      correctIndex: 1,
      explanation: "We store `seen[num] = i` — mapping the value to its index so future iterations can find it as a complement.",
      isCodeBuilding: true,
      codeSnippet: "        seen[num] = i",
      codeLabel: "Store in hash map"
    },
    {
      id: "q15", phase: "Analyzing Complexity",
      questionText: "What is the time and space complexity of our hash map solution?",
      options: [
        { label: "Time: O(n²), Space: O(1)" },
        { label: "Time: O(n), Space: O(n)" },
        { label: "Time: O(n log n), Space: O(n)" },
        { label: "Time: O(n), Space: O(1)" }
      ],
      correctIndex: 1,
      explanation: "**Time: O(n)** — we iterate through the array once, and each hash map operation is O(1).\\n**Space: O(n)** — in the worst case, we store all n elements in the hash map.",
      hint: "Consider: how many times do we visit each element? How much extra memory do we use?"
    }
  ],
  finalCodeSnippets: [
    "def twoSum(self, nums, target):\n    seen = {}",
    "    for i, num in enumerate(nums):",
    "        complement = target - num",
    "        if complement in seen:\n            return [seen[complement], i]",
    "        seen[num] = i"
  ],
  reasoningChain: [
    { question: "What does Two Sum ask for?", insight: "Find indices of two numbers summing to target." },
    { question: "What's the brute force?", insight: "Nested loops checking all pairs — O(n²)." },
    { question: "How to speed up lookups?", insight: "Hash map gives O(1) average lookups." },
    { question: "What to look up?", insight: "The complement: target - current number." },
    { question: "What to store?", insight: "Map value → index for quick complement checks." },
    { question: "One pass or two?", insight: "One pass: check then insert, avoids duplicate index." },
    { question: "Final complexity?", insight: "O(n) time, O(n) space — optimal." }
  ]
}, null, 2));

// ─── LIB: UTILS ───
w('lib/utils/cn.ts', `
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
`);

w('lib/utils/shuffle.ts', `
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
`);

w('lib/utils/storage.ts', `
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
`);

w('lib/utils/problems.ts', `
import { Problem } from "@/data/schema";
import twoSum from "@/data/questions/two-sum.json";

const problems: Problem[] = [twoSum as Problem];

export function getAllProblems(): Problem[] {
  return problems;
}

export function getProblem(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getAllProblemIds(): string[] {
  return problems.map((p) => p.id);
}
`);

// ─── LIB: HOOKS ───
w('lib/hooks/useTheme.ts', `
"use client";
import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("light", !isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("light", !next);
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return { dark, toggle };
}
`);

w('lib/hooks/useTimer.ts', `
"use client";
import { useState, useEffect, useRef } from "react";

export function useTimer(initial: number = 0) {
  const [seconds, setSeconds] = useState(initial);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatted = \`\${Math.floor(seconds / 60)}:\${String(seconds % 60).padStart(2, "0")}\`;

  return { seconds, formatted, setSeconds };
}
`);

w('lib/hooks/useProgress.ts', `
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
`);

console.log("\\n✅ Part 1 complete (schema, data, utils, hooks)");
console.log("Now run: node write-files-2.mjs");
