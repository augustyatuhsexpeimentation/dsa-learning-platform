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
