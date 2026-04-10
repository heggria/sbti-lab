import { useMemo } from 'react'
import type { DimensionId } from '../types'
import { questions } from '../data/questions'
import { matchPersonality, matchAllPersonalities } from '../utils/matching'
import { computeScores, computeDimensionVector, vectorToString } from '../utils/scoring'
import { useQuizStore } from '../store/quizStore'

export function useResult() {
  const answers = useQuizStore((s) => s.answers)
  const specialAnswers = useQuizStore((s) => s.specialAnswers)
  const result = useQuizStore((s) => s.result)

  const scores = useMemo(
    () => computeScores(answers, questions),
    [answers],
  )

  const dimensionVector = useMemo(
    () => computeDimensionVector(answers, questions),
    [answers],
  )

  const vectorString = useMemo(
    () => (dimensionVector ? vectorToString(dimensionVector) : ''),
    [dimensionVector],
  )

  const rankings = useMemo(
    () => matchAllPersonalities(answers, questions),
    [answers],
  )

  const computedResult = useMemo(
    () => matchPersonality(answers, questions, specialAnswers),
    [answers, specialAnswers],
  )

  const topMatch = result ?? computedResult

  return {
    result: topMatch,
    scores: scores as Record<DimensionId, number>,
    dimensionVector,
    vectorString,
    rankings,
    answers,
  }
}
