import { Problem } from "@/data/schema";

import apartments from "@/data/questions/apartments.json";
import appleDivision from "@/data/questions/apple-division.json";
import bitStrings from "@/data/questions/bit-strings.json";
import chessboardAndQueens from "@/data/questions/chessboard-and-queens.json";
import coinPiles from "@/data/questions/coin-piles.json";
import concertTickets from "@/data/questions/concert-tickets.json";
import creatingStrings from "@/data/questions/creating-strings.json";
import digitQueries from "@/data/questions/digit-queries.json";
import distinctNumbers from "@/data/questions/distinct-numbers.json";
import ferrisWheel from "@/data/questions/ferris-wheel.json";
import grayCode from "@/data/questions/gray-code.json";
import gridColoringI from "@/data/questions/grid-coloring-i.json";
import gridPathDescription from "@/data/questions/grid-path-description.json";
import increasingArray from "@/data/questions/increasing-array.json";
import knightMovesGrid from "@/data/questions/knight-moves-grid.json";
import mexGridConstruction from "@/data/questions/mex-grid-construction.json";
import missingNumber from "@/data/questions/missing-number.json";
import movieFestival from "@/data/questions/movie-festival.json";
import numberSpiral from "@/data/questions/number-spiral.json";
import palindromeReorder from "@/data/questions/palindrome-reorder.json";
import permutations from "@/data/questions/permutations.json";
import raabGameI from "@/data/questions/raab-game-i.json";
import repetitions from "@/data/questions/repetitions.json";
import restaurantCustomers from "@/data/questions/restaurant-customers.json";
import stringReorder from "@/data/questions/string-reorder.json";
import towerOfHanoi from "@/data/questions/tower-of-hanoi.json";
import trailingZeros from "@/data/questions/trailing-zeros.json";
import twoKnights from "@/data/questions/two-knights.json";
import twoSets from "@/data/questions/two-sets.json";
import twoSum from "@/data/questions/two-sum.json";
import weirdAlgorithm from "@/data/questions/weird-algorithm.json";

const problems: Problem[] = [
  apartments as Problem,
  appleDivision as Problem,
  bitStrings as Problem,
  chessboardAndQueens as Problem,
  coinPiles as Problem,
  concertTickets as Problem,
  creatingStrings as Problem,
  digitQueries as Problem,
  distinctNumbers as Problem,
  ferrisWheel as Problem,
  grayCode as Problem,
  gridColoringI as Problem,
  gridPathDescription as Problem,
  increasingArray as Problem,
  knightMovesGrid as Problem,
  mexGridConstruction as Problem,
  missingNumber as Problem,
  movieFestival as Problem,
  numberSpiral as Problem,
  palindromeReorder as Problem,
  permutations as Problem,
  raabGameI as Problem,
  repetitions as Problem,
  restaurantCustomers as Problem,
  stringReorder as Problem,
  towerOfHanoi as Problem,
  trailingZeros as Problem,
  twoKnights as Problem,
  twoSets as Problem,
  twoSum as Problem,
  weirdAlgorithm as Problem,
];

export function getAllProblems(): Problem[] {
  return problems;
}

export function getProblem(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getAllProblemIds(): string[] {
  return problems.map((p) => p.id);
}
