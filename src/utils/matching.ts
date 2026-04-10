import type { MatchResult, QuizAnswer, Question } from '../types'
import { personalities } from '../data/personalities'
import { computeDimensionVector, vectorToString } from './scoring'

function normalizePattern(pattern: string): string {
  return pattern.replace(/\s+/g, '')
}

function computeSimilarity(userVector: string, personalityPattern: string) {
  const pLen = personalityPattern.length
  const len = Math.min(userVector.length, pLen)
  let exactMatches = 0
  for (let i = 0; i < len; i++) {
    if (userVector[i] === personalityPattern[i]) exactMatches++
  }
  return {
    similarity: exactMatches / 15,
    exactMatches,
    distance: 15 - exactMatches,
  }
}

export function matchPersonality(
  answers: QuizAnswer[],
  questions: Question[],
  specialAnswers?: Record<string, number>,
): MatchResult {
  const vector = computeDimensionVector(answers, questions)
  const userStr = vectorToString(vector)

  if (specialAnswers) {
    const drunk = personalities.find((p) => p.code === 'DRUNK')
    if (
      drunk &&
      specialAnswers['drink_gate_q1'] === 3 &&
      specialAnswers['drink_gate_q2'] === 2
    ) {
      return { personality: drunk, similarity: 1, distance: 0, exactMatches: 15 }
    }
  }

  let bestMatch: MatchResult | null = null
  for (const p of personalities) {
    if (p.pattern === null) continue
    const normalized = normalizePattern(p.pattern)
    if (normalized.length < 14) continue
    const result = computeSimilarity(userStr, normalized)
    if (!bestMatch || result.exactMatches > bestMatch.exactMatches) {
      bestMatch = { personality: p, ...result }
    }
  }

  if (!bestMatch || bestMatch.similarity < 0.4) {
    const hhhh = personalities.find((p) => p.code === 'HHHH')!
    return {
      personality: hhhh,
      similarity: bestMatch?.similarity ?? 0,
      distance: 15,
      exactMatches: 0,
    }
  }

  return bestMatch
}

export function matchAllPersonalities(
  answers: QuizAnswer[],
  questions: Question[],
): MatchResult[] {
  const vector = computeDimensionVector(answers, questions)
  const userStr = vectorToString(vector)

  return personalities
    .filter((p) => p.pattern !== null)
    .map((p) => {
      const normalized = normalizePattern(p.pattern!)
      const { similarity, exactMatches, distance } = computeSimilarity(userStr, normalized)
      return { personality: p, similarity, exactMatches, distance } as MatchResult
    })
    .sort((a, b) => b.similarity - a.similarity)
}
