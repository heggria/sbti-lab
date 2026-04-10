import { describe, it, expect } from 'vitest'
import { computeScores, scoreToLevel, computeDimensionVector, vectorToString, DIMENSION_ORDER, CATEGORIES } from '../utils/scoring'
import type { QuizAnswer, Question } from '../types'

const mockQuestions: Question[] = [
  { id: 'q1', dimension: 'S1', text: 'Q1', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q2', dimension: 'S1', text: 'Q2', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q3', dimension: 'S2', text: 'Q3', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q4', dimension: 'S2', text: 'Q4', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q5', dimension: 'S3', text: 'Q5', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q6', dimension: 'S3', text: 'Q6', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q7', dimension: 'E1', text: 'Q7', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q8', dimension: 'E1', text: 'Q8', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q9', dimension: 'E2', text: 'Q9', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q10', dimension: 'E2', text: 'Q10', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q11', dimension: 'E3', text: 'Q11', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q12', dimension: 'E3', text: 'Q12', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q13', dimension: 'A1', text: 'Q13', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q14', dimension: 'A1', text: 'Q14', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q15', dimension: 'A2', text: 'Q15', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q16', dimension: 'A2', text: 'Q16', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q17', dimension: 'A3', text: 'Q17', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q18', dimension: 'A3', text: 'Q18', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q19', dimension: 'Ac1', text: 'Q19', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q20', dimension: 'Ac1', text: 'Q20', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q21', dimension: 'Ac2', text: 'Q21', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q22', dimension: 'Ac2', text: 'Q22', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q23', dimension: 'Ac3', text: 'Q23', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q24', dimension: 'Ac3', text: 'Q24', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q25', dimension: 'So1', text: 'Q25', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q26', dimension: 'So1', text: 'Q26', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q27', dimension: 'So2', text: 'Q27', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q28', dimension: 'So2', text: 'Q28', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q29', dimension: 'So3', text: 'Q29', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
  { id: 'q30', dimension: 'So3', text: 'Q30', options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }] },
]

describe('DIMENSION_ORDER', () => {
  it('has exactly 15 dimensions', () => {
    expect(DIMENSION_ORDER).toHaveLength(15)
  })

  it('covers all 5 categories with 3 dimensions each', () => {
    for (const cat of CATEGORIES) {
      expect(cat.dimensions).toHaveLength(3)
      for (const dim of cat.dimensions) {
        expect(DIMENSION_ORDER).toContain(dim)
      }
    }
  })
})

describe('computeScores', () => {
  it('returns default score 2 for unanswered dimensions', () => {
    const answers: QuizAnswer[] = []
    const scores = computeScores(answers, mockQuestions)
    for (const dim of DIMENSION_ORDER) {
      expect(scores[dim]).toBe(2)
    }
  })

  it('computes average for a dimension with one answer', () => {
    const answers: QuizAnswer[] = [{ questionId: 'q1', value: 1 }]
    const scores = computeScores(answers, mockQuestions)
    expect(scores['S1']).toBe(1)
  })

  it('computes average for a dimension with two answers', () => {
    const answers: QuizAnswer[] = [
      { questionId: 'q1', value: 1 },
      { questionId: 'q2', value: 3 },
    ]
    const scores = computeScores(answers, mockQuestions)
    expect(scores['S1']).toBe(2)
  })

  it('handles all answers being value 3 (high)', () => {
    const answers: QuizAnswer[] = mockQuestions.map((q) => ({
      questionId: q.id,
      value: 3,
    }))
    const scores = computeScores(answers, mockQuestions)
    for (const dim of DIMENSION_ORDER) {
      expect(scores[dim]).toBe(3)
    }
  })

  it('handles all answers being value 1 (low)', () => {
    const answers: QuizAnswer[] = mockQuestions.map((q) => ({
      questionId: q.id,
      value: 1,
    }))
    const scores = computeScores(answers, mockQuestions)
    for (const dim of DIMENSION_ORDER) {
      expect(scores[dim]).toBe(1)
    }
  })

  it('ignores answers with unknown question IDs', () => {
    const answers: QuizAnswer[] = [
      { questionId: 'nonexistent', value: 3 },
      { questionId: 'q1', value: 2 },
    ]
    const scores = computeScores(answers, mockQuestions)
    expect(scores['S1']).toBe(2)
  })
})

describe('scoreToLevel', () => {
  it('returns L for scores <= 1.5', () => {
    expect(scoreToLevel(0)).toBe('L')
    expect(scoreToLevel(1)).toBe('L')
    expect(scoreToLevel(1.5)).toBe('L')
  })

  it('returns M for scores between 1.5 and 2.5', () => {
    expect(scoreToLevel(1.51)).toBe('M')
    expect(scoreToLevel(2)).toBe('M')
    expect(scoreToLevel(2.5)).toBe('M')
  })

  it('returns H for scores > 2.5', () => {
    expect(scoreToLevel(2.51)).toBe('H')
    expect(scoreToLevel(3)).toBe('H')
  })
})

describe('computeDimensionVector', () => {
  it('returns all L for all-1 answers', () => {
    const answers = mockQuestions.map((q) => ({ questionId: q.id, value: 1 }))
    const vector = computeDimensionVector(answers, mockQuestions)
    for (const dim of DIMENSION_ORDER) {
      expect(vector[dim]).toBe('L')
    }
  })

  it('returns all H for all-3 answers', () => {
    const answers = mockQuestions.map((q) => ({ questionId: q.id, value: 3 }))
    const vector = computeDimensionVector(answers, mockQuestions)
    for (const dim of DIMENSION_ORDER) {
      expect(vector[dim]).toBe('H')
    }
  })

  it('returns all M for all-2 answers', () => {
    const answers = mockQuestions.map((q) => ({ questionId: q.id, value: 2 }))
    const vector = computeDimensionVector(answers, mockQuestions)
    for (const dim of DIMENSION_ORDER) {
      expect(vector[dim]).toBe('M')
    }
  })

  it('produces exactly 15 dimension levels', () => {
    const answers = mockQuestions.map((q) => ({ questionId: q.id, value: 2 }))
    const vector = computeDimensionVector(answers, mockQuestions)
    expect(Object.keys(vector)).toHaveLength(15)
  })
})

describe('vectorToString', () => {
  it('concatenates dimension levels in DIMENSION_ORDER', () => {
    const vector = computeDimensionVector(
      mockQuestions.map((q) => ({ questionId: q.id, value: 1 })),
      mockQuestions,
    )
    const str = vectorToString(vector)
    expect(str).toBe('LLLLLLLLLLLLLLL')
    expect(str).toHaveLength(15)
  })

  it('produces correct string for mixed answers', () => {
    const answers = mockQuestions.map((q, i) => ({
      questionId: q.id,
      value: i % 3 === 0 ? 3 : i % 3 === 1 ? 1 : 2,
    }))
    const vector = computeDimensionVector(answers, mockQuestions)
    const str = vectorToString(vector)
    expect(str).toHaveLength(15)
    for (const ch of str) {
      expect(['L', 'M', 'H']).toContain(ch)
    }
  })
})
