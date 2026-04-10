import type { DimensionId, DimensionLevel, QuizAnswer, Question } from '../types'

export const DIMENSION_ORDER: DimensionId[] = [
  'S1', 'S2', 'S3',
  'E1', 'E2', 'E3',
  'A1', 'A2', 'A3',
  'Ac1', 'Ac2', 'Ac3',
  'So1', 'So2', 'So3',
]

export const CATEGORIES = [
  { id: 'S' as const, name: '自我', dimensions: ['S1', 'S2', 'S3'] as DimensionId[] },
  { id: 'E' as const, name: '情感', dimensions: ['E1', 'E2', 'E3'] as DimensionId[] },
  { id: 'A' as const, name: '态度', dimensions: ['A1', 'A2', 'A3'] as DimensionId[] },
  { id: 'Ac' as const, name: '行动', dimensions: ['Ac1', 'Ac2', 'Ac3'] as DimensionId[] },
  { id: 'So' as const, name: '社交', dimensions: ['So1', 'So2', 'So3'] as DimensionId[] },
]

export function computeScores(
  answers: QuizAnswer[],
  questions: Question[],
): Record<DimensionId, number> {
  const buckets: Partial<Record<DimensionId, number[]>> = {}
  for (const dim of DIMENSION_ORDER) {
    buckets[dim] = []
  }

  for (const answer of answers) {
    const q = questions.find((x) => x.id === answer.questionId)
    if (!q) continue
    buckets[q.dimension]!.push(answer.value)
  }

  const scores: Partial<Record<DimensionId, number>> = {}
  for (const dim of DIMENSION_ORDER) {
    const vals = buckets[dim]!
    scores[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 2
  }

  return scores as Record<DimensionId, number>
}

export function scoreToLevel(avg: number): DimensionLevel {
  if (avg <= 1.5) return 'L'
  if (avg <= 2.5) return 'M'
  return 'H'
}

export function computeDimensionVector(
  answers: QuizAnswer[],
  questions: Question[],
): Record<DimensionId, DimensionLevel> {
  const scores = computeScores(answers, questions)
  const vector: Partial<Record<DimensionId, DimensionLevel>> = {}
  for (const dim of DIMENSION_ORDER) {
    vector[dim] = scoreToLevel(scores[dim])
  }
  return vector as Record<DimensionId, DimensionLevel>
}

export function vectorToString(vector: Record<DimensionId, DimensionLevel>): string {
  return DIMENSION_ORDER.map((dim) => vector[dim]).join('')
}
