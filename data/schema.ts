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
