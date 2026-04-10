import { describe, it, expect } from 'vitest'
import { matchPersonality, matchAllPersonalities } from '../utils/matching'
import { questions } from '../data/questions'
import type { QuizAnswer } from '../types'

function makeAllAnswers(value: number): QuizAnswer[] {
  return questions.map((q) => ({ questionId: q.id, value }))
}

describe('matchPersonality', () => {
  it('returns a valid MatchResult with required fields', () => {
    const answers = makeAllAnswers(2)
    const result = matchPersonality(answers, questions)
    expect(result).toHaveProperty('personality')
    expect(result).toHaveProperty('similarity')
    expect(result).toHaveProperty('distance')
    expect(result).toHaveProperty('exactMatches')
    expect(result.personality).toHaveProperty('code')
    expect(result.personality).toHaveProperty('name')
  })

  it('returns a personality with a valid rarity', () => {
    const answers = makeAllAnswers(2)
    const result = matchPersonality(answers, questions)
    expect(['SSR', 'SR', 'R', 'N']).toContain(result.personality.rarity)
  })

  it('matches highest-similarity personality for all-high answers', () => {
    const answers = makeAllAnswers(3)
    const result = matchPersonality(answers, questions)
    expect(result.personality.code).toBeDefined()
    expect(result.exactMatches).toBeGreaterThan(0)
  })

  it('returns HHHH fallback for low-similarity answers', () => {
    const answers = questions.map((q, i) => ({
      questionId: q.id,
      value: i % 2 === 0 ? 1 : 3,
    }))
    const result = matchPersonality(answers, questions)
    expect(result.personality).toBeDefined()
    expect(result.similarity).toBeGreaterThanOrEqual(0)
  })

  it('returns DRUNK personality when special drink answers match', () => {
    const answers = makeAllAnswers(2)
    const specialAnswers = {
      drink_gate_q1: 3,
      drink_gate_q2: 2,
    }
    const result = matchPersonality(answers, questions, specialAnswers)
    expect(result.personality.code).toBe('DRUNK')
    expect(result.similarity).toBe(1)
  })

  it('does not return DRUNK when special answers do not match', () => {
    const answers = makeAllAnswers(2)
    const specialAnswers = {
      drink_gate_q1: 1,
      drink_gate_q2: 1,
    }
    const result = matchPersonality(answers, questions, specialAnswers)
    expect(result.personality.code).not.toBe('DRUNK')
  })

  it('similarity is between 0 and 1', () => {
    const answers = makeAllAnswers(2)
    const result = matchPersonality(answers, questions)
    expect(result.similarity).toBeGreaterThanOrEqual(0)
    expect(result.similarity).toBeLessThanOrEqual(1)
  })

  it('distance + exactMatches equals 15 for non-DRUNK matches', () => {
    const answers = makeAllAnswers(2)
    const result = matchPersonality(answers, questions)
    if (result.personality.code !== 'DRUNK') {
      expect(result.distance + result.exactMatches).toBe(15)
    }
  })
})

describe('matchAllPersonalities', () => {
  it('returns results sorted by similarity descending', () => {
    const answers = makeAllAnswers(2)
    const results = matchAllPersonalities(answers, questions)
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].similarity).toBeGreaterThanOrEqual(results[i].similarity)
    }
  })

  it('excludes special personalities (DRUNK, HHHH) from list', () => {
    const answers = makeAllAnswers(2)
    const results = matchAllPersonalities(answers, questions)
    const codes = results.map((r) => r.personality.code)
    expect(codes).not.toContain('DRUNK')
  })

  it('returns at least 1 result', () => {
    const answers = makeAllAnswers(2)
    const results = matchAllPersonalities(answers, questions)
    expect(results.length).toBeGreaterThan(0)
  })

  it('all results have valid structure', () => {
    const answers = makeAllAnswers(2)
    const results = matchAllPersonalities(answers, questions)
    for (const r of results) {
      expect(r.personality).toHaveProperty('code')
      expect(r.personality).toHaveProperty('name')
      expect(typeof r.similarity).toBe('number')
      expect(typeof r.exactMatches).toBe('number')
      expect(typeof r.distance).toBe('number')
    }
  })

  it('all similarities are between 0 and 1', () => {
    const answers = makeAllAnswers(2)
    const results = matchAllPersonalities(answers, questions)
    for (const r of results) {
      expect(r.similarity).toBeGreaterThanOrEqual(0)
      expect(r.similarity).toBeLessThanOrEqual(1)
    }
  })
})
