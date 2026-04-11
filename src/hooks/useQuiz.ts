import { useCallback, useEffect, useMemo, useState } from 'react'
import { questions } from '../data/questions'
import { matchPersonality } from '../utils/matching'
import { computeDimensionVector, vectorToString } from '../utils/scoring'
import { useQuizStore } from '../store/quizStore'

export function useQuiz() {
  const store = useQuizStore()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const currentQuestion = useMemo(
    () => questions[store.currentQuestionIndex] ?? null,
    [store.currentQuestionIndex],
  )

  const progress = useMemo(
    () => store.answers.length / questions.length,
    [store.answers.length],
  )

  const estimatedTimeLeft = useMemo(() => {
    if (!store.startTime) return null
    const elapsed = (now - store.startTime) / 1000
    const answered = store.answers.length
    if (answered === 0) return null
    const avgPerQuestion = elapsed / answered
    const remaining = questions.length - answered
    return Math.ceil(avgPerQuestion * remaining)
  }, [now, store.startTime, store.answers.length])

  const currentAnswer = useMemo(
    () =>
      store.answers.find((a) => a.questionId === currentQuestion?.id)?.value ??
      null,
    [store.answers, currentQuestion],
  )

  const isLastQuestion = store.currentQuestionIndex === questions.length - 1

  const handleAnswer = useCallback(
    (value: number) => {
      if (!currentQuestion) return
      try { navigator.vibrate?.(10) } catch { /* no-op */ }
      const { answerQuestion, setResult, setPhase, nextQuestion } = useQuizStore.getState()
      answerQuestion(currentQuestion.id, value)
      if (isLastQuestion) {
        const fresh = useQuizStore.getState()
        const allAnswers = [
          ...fresh.answers.filter((a) => a.questionId !== currentQuestion.id),
          { questionId: currentQuestion.id, value },
        ]
        const result = matchPersonality(allAnswers, questions, fresh.specialAnswers)
        setResult(result)
        if (fresh.pkChallenge) {
          setPhase('pk-compare')
        } else {
          setPhase('result')
        }
      } else {
        setTimeout(() => nextQuestion(), 300)
      }
    },
    [currentQuestion, isLastQuestion],
  )

  const dimensionVector = useMemo(() => {
    if (store.answers.length === 0) return null
    return computeDimensionVector(store.answers, questions)
  }, [store.answers])

  const vectorString = useMemo(() => {
    if (!dimensionVector) return ''
    return vectorToString(dimensionVector)
  }, [dimensionVector])

  return {
    ...store,
    currentQuestion,
    progress,
    estimatedTimeLeft,
    currentAnswer,
    isLastQuestion,
    handleAnswer,
    dimensionVector,
    vectorString,
    totalQuestions: questions.length,
  }
}
