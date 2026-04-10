import { create } from 'zustand'
import type { QuizAnswer, QuizPhase, MatchResult } from '../types'
import type { PKChallengeData } from '../utils/pk-encoding'

interface QuizState {
  phase: QuizPhase
  currentQuestionIndex: number
  answers: QuizAnswer[]
  specialAnswers: Record<string, number>
  result: MatchResult | null
  startTime: number | null
  pkChallenge: PKChallengeData | null

  setPhase: (phase: QuizPhase) => void
  answerQuestion: (questionId: string, value: number) => void
  answerSpecial: (questionId: string, value: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  setResult: (result: MatchResult) => void
  setPKChallenge: (challenge: PKChallengeData) => void
  reset: () => void
}

export const useQuizStore = create<QuizState>((set) => ({
  phase: 'intro',
  currentQuestionIndex: 0,
  answers: [],
  specialAnswers: {},
  result: null,
  startTime: null,
  pkChallenge: null,

  setPhase: (phase) =>
    set({ phase, ...(phase === 'quiz' ? { startTime: Date.now() } : {}) }),

  answerQuestion: (questionId, value) =>
    set((state) => {
      const answers = state.answers.filter((a) => a.questionId !== questionId)
      answers.push({ questionId, value })
      return { answers }
    }),

  answerSpecial: (questionId, value) =>
    set((state) => ({
      specialAnswers: { ...state.specialAnswers, [questionId]: value },
    })),

  nextQuestion: () =>
    set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),

  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
    })),

  setResult: (result) => set({ result }),

  setPKChallenge: (challenge) => set({ pkChallenge: challenge }),

  reset: () =>
    set({
      phase: 'intro',
      currentQuestionIndex: 0,
      answers: [],
      specialAnswers: {},
      result: null,
      startTime: null,
      pkChallenge: null,
    }),
}))
