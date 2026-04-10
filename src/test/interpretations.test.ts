import { describe, it, expect } from 'vitest'
import {
  interpretations,
  getInterpretationsByPersonality,
  getRandomInterpretation,
  replaceDimensionPlaceholders,
} from '../data/interpretations'
import type { InterpretationStyle } from '../data/interpretations'

const PERSONALITY_CODES = [
  'CTRL', 'ATM-er', 'Dior-s', 'BOSS', 'THAN-K', 'OH-NO',
  'GOGO', 'SEXY', 'LOVE-R', 'MUM', 'FAKE', 'OJBK',
  'MALO', 'JOKE-R', 'WOC!', 'THIN-K', 'SHIT', 'ZZZZ',
  'POOR', 'MONK', 'IMSB', 'SOLO', 'FUCK', 'DEAD',
  'IMFW', 'HHHH', 'DRUNK',
]

const STYLES: InterpretationStyle[] = ['roast', 'gentle', 'philosophy', 'cyberpunk', 'mixed']

describe('interpretations data', () => {
  it('has exactly 135 templates (27 × 5)', () => {
    expect(interpretations).toHaveLength(135)
  })

  it('covers all 27 personalities', () => {
    const codes = new Set(interpretations.map((t) => t.personalityCode))
    for (const code of PERSONALITY_CODES) {
      expect(codes.has(code), `Missing personality: ${code}`).toBe(true)
    }
  })

  it('covers all 5 styles per personality', () => {
    for (const code of PERSONALITY_CODES) {
      const styles = interpretations
        .filter((t) => t.personalityCode === code)
        .map((t) => t.style)
      for (const style of STYLES) {
        expect(styles.includes(style), `Missing style ${style} for ${code}`).toBe(true)
      }
    }
  })

  it('every template is a non-empty string', () => {
    for (const t of interpretations) {
      expect(t.template.length, `Empty template for ${t.personalityCode}/${t.style}`).toBeGreaterThan(0)
    }
  })
})

describe('getInterpretationsByPersonality', () => {
  it('returns 5 templates for a personality without style filter', () => {
    const result = getInterpretationsByPersonality('CTRL')
    expect(result).toHaveLength(5)
  })

  it('returns 1 template for a personality with style filter', () => {
    const result = getInterpretationsByPersonality('CTRL', 'roast')
    expect(result).toHaveLength(1)
    expect(result[0].style).toBe('roast')
  })

  it('returns empty for unknown personality', () => {
    const result = getInterpretationsByPersonality('UNKNOWN')
    expect(result).toHaveLength(0)
  })
})

describe('getRandomInterpretation', () => {
  it('returns a template for a valid personality', () => {
    const result = getRandomInterpretation('BOSS')
    expect(result.personalityCode).toBe('BOSS')
    expect(result.template.length).toBeGreaterThan(0)
  })

  it('returns a template matching the requested style', () => {
    const result = getRandomInterpretation('MUM', 'gentle')
    expect(result.personalityCode).toBe('MUM')
    expect(result.style).toBe('gentle')
  })
})

describe('replaceDimensionPlaceholders', () => {
  it('replaces all dimension placeholders with values', () => {
    const template = 'S1:{S1} E1:{E1} So3:{So3}'
    const values = { S1: 'H', E1: 'M', So3: 'L' } as Record<string, string>
    const result = replaceDimensionPlaceholders(template, values)
    expect(result).toBe('S1:H E1:M So3:L')
  })

  it('leaves unreferenced placeholders as-is', () => {
    const template = 'S1:{S1} unknown:{UNKNOWN}'
    const values = { S1: 'H' } as Record<string, string>
    const result = replaceDimensionPlaceholders(template, values)
    expect(result).toBe('S1:H unknown:{UNKNOWN}')
  })

  it('handles template with no placeholders', () => {
    const template = 'No placeholders here.'
    const values = { S1: 'H' } as Record<string, string>
    const result = replaceDimensionPlaceholders(template, values)
    expect(result).toBe('No placeholders here.')
  })
})
