import { describe, it, expect } from 'vitest'
import {
  encodePKChallenge,
  decodePKChallenge,
  computePKDifferences,
} from '../utils/pk-encoding'
import type { DimensionId } from '../types'
import { getChemistry, PAIR_MAP } from '../data/chemistry'

const SAMPLE_SCORES: Record<DimensionId, number> = {
  S1: 1.2, S2: 2.8, S3: 3.0,
  E1: 1.5, E2: 2.0, E3: 2.5,
  A1: 1.0, A2: 3.0, A3: 2.0,
  Ac1: 2.5, Ac2: 1.0, Ac3: 3.0,
  So1: 2.0, So2: 1.0, So3: 2.8,
}

describe('encodePKChallenge / decodePKChallenge', () => {
  it('round-trips data correctly', () => {
    const encoded = encodePKChallenge('CTRL', SAMPLE_SCORES)
    expect(encoded.length).toBeLessThan(500)

    const decoded = decodePKChallenge(encoded)
    expect(decoded).not.toBeNull()
    expect(decoded!.challengerCode).toBe('CTRL')

    for (const dim of Object.keys(SAMPLE_SCORES) as DimensionId[]) {
      expect(decoded!.challengerScores[dim]).toBeCloseTo(SAMPLE_SCORES[dim], 0.1)
    }
  })

  it('handles URL-safe characters', () => {
    const encoded = encodePKChallenge('BOSS', SAMPLE_SCORES)
    expect(encoded).not.toContain('+')
    expect(encoded).not.toContain('/')
    expect(encoded).not.toContain('=')
  })

  it('returns null for invalid input', () => {
    expect(decodePKChallenge('!!!invalid!!!')).toBeNull()
    expect(decodePKChallenge('')).toBeNull()
  })
})

describe('computePKDifferences', () => {
  it('finds overlapping dimensions', () => {
    const identical: Record<DimensionId, number> = {
      ...SAMPLE_SCORES,
    }
    const result = computePKDifferences(SAMPLE_SCORES, identical)
    expect(result.harmony).toBe(100)
    expect(result.overlap.length).toBe(15)
    expect(result.conflict.length).toBe(0)
  })

  it('finds conflicting dimensions', () => {
    const opposite: Record<DimensionId, number> = {
      S1: 3.0, S2: 1.0, S3: 1.0,
      E1: 3.0, E2: 3.0, E3: 1.0,
      A1: 3.0, A2: 1.0, A3: 3.0,
      Ac1: 1.0, Ac2: 3.0, Ac3: 1.0,
      So1: 3.0, So2: 3.0, So3: 1.0,
    }
    const result = computePKDifferences(SAMPLE_SCORES, opposite)
    expect(result.harmony).toBeLessThan(50)
    expect(result.conflict.length).toBeGreaterThan(0)
  })
})

describe('getChemistry', () => {
  it('returns specific template for known pairs', () => {
    const ctrlBoss = getChemistry('CTRL', 'BOSS')
    expect(ctrlBoss.mood).toBe('fire')

    const bossCtrl = getChemistry('BOSS', 'CTRL')
    expect(bossCtrl.mood).toBe('fire')
    expect(bossCtrl.text).toBe(ctrlBoss.text)
  })

  it('handles DRUNK wildcard', () => {
    const result = getChemistry('JOKE-R', 'DRUNK')
    expect(result.mood).toBe('chaos')
  })

  it('returns default for unknown pair', () => {
    const result = getChemistry('XXXXX', 'YYYYY')
    expect(result.mood).toBe('mystery')
  })

  it('has 50+ templates', () => {
    expect(Object.keys(PAIR_MAP).length).toBeGreaterThanOrEqual(50)
  })
})
