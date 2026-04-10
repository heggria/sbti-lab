import type { DimensionId } from '../types'
import { DIMENSION_ORDER } from './scoring'

export interface PKChallengeData {
  challengerCode: string
  challengerScores: Record<DimensionId, number>
}

export interface PKResultData {
  challengerCode: string
  challengerScores: Record<DimensionId, number>
  defenderCode: string
  defenderScores: Record<DimensionId, number>
}

function scoresToCompact(scores: Record<DimensionId, number>): number[] {
  return DIMENSION_ORDER.map((d) => Math.round((scores[d] ?? 2) * 10))
}

function compactToScores(compact: number[]): Record<DimensionId, number> {
  const scores: Partial<Record<DimensionId, number>> = {}
  DIMENSION_ORDER.forEach((dim, i) => {
    scores[dim] = (compact[i] ?? 20) / 10
  })
  return scores as Record<DimensionId, number>
}

export function encodePKChallenge(
  personalityCode: string,
  scores: Record<DimensionId, number>,
): string {
  const data = {
    c: personalityCode,
    s: scoresToCompact(scores),
  }
  const json = JSON.stringify(data)
  const encoded = btoa(unescape(encodeURIComponent(json)))
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodePKChallenge(encoded: string): PKChallengeData | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4 !== 0) base64 += '='
    const json = decodeURIComponent(escape(atob(base64)))
    const data = JSON.parse(json)
    if (!data.c || !Array.isArray(data.s)) return null
    return {
      challengerCode: data.c,
      challengerScores: compactToScores(data.s),
    }
  } catch {
    return null
  }
}

export function encodePKResult(
  challengerCode: string,
  challengerScores: Record<DimensionId, number>,
  defenderCode: string,
  defenderScores: Record<DimensionId, number>,
): string {
  const data = {
    a: challengerCode,
    as: scoresToCompact(challengerScores),
    b: defenderCode,
    bs: scoresToCompact(defenderScores),
  }
  const json = JSON.stringify(data)
  const encoded = btoa(unescape(encodeURIComponent(json)))
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function computePKDifferences(
  scoresA: Record<DimensionId, number>,
  scoresB: Record<DimensionId, number>,
): { overlap: DimensionId[]; conflict: DimensionId[]; harmony: number } {
  let overlap = 0
  const overlapDims: DimensionId[] = []
  const conflictDims: DimensionId[] = []

  for (const dim of DIMENSION_ORDER) {
    const diff = Math.abs((scoresA[dim] ?? 2) - (scoresB[dim] ?? 2))
    if (diff <= 0.3) {
      overlap++
      overlapDims.push(dim)
    } else if (diff >= 1.0) {
      conflictDims.push(dim)
    }
  }

  return {
    overlap: overlapDims,
    conflict: conflictDims,
    harmony: Math.round((overlap / DIMENSION_ORDER.length) * 100),
  }
}

export function buildPKShareUrl(
  baseUrl: string,
  personalityCode: string,
  scores: Record<DimensionId, number>,
): string {
  const encoded = encodePKChallenge(personalityCode, scores)
  return `${baseUrl}#/pk/${encoded}`
}
