export type DimensionId =
  | 'S1' | 'S2' | 'S3'
  | 'E1' | 'E2' | 'E3'
  | 'A1' | 'A2' | 'A3'
  | 'Ac1' | 'Ac2' | 'Ac3'
  | 'So1' | 'So2' | 'So3'

export type CategoryId = 'S' | 'E' | 'A' | 'Ac' | 'So'

export type DimensionLevel = 'L' | 'M' | 'H'

export type Rarity = 'SSR' | 'SR' | 'R' | 'N'

export interface Category {
  id: CategoryId
  name: string
  description: string
  dimensions: DimensionId[]
}

export interface Dimension {
  id: DimensionId
  category: CategoryId
  name: string
}

export interface QuestionOption {
  label: string
  value: number
}

export interface Question {
  id: string
  dimension: DimensionId
  text: string
  options: QuestionOption[]
  reversed?: boolean
}

export interface Personality {
  rank: number
  code: string
  name: string
  intro: string
  desc?: string
  pattern: string | null
  rarity: Rarity
  rarityName: string
  populationPct: number
  trigger?: string
}

export interface DimensionVector {
  dimensions: Record<DimensionId, DimensionLevel>
  vector: string
  scores: Record<DimensionId, number>
}

export interface MatchResult {
  personality: Personality
  similarity: number
  distance: number
  exactMatches: number
}

export interface QuizAnswer {
  questionId: string
  value: number
}

export type QuizPhase = 'intro' | 'quiz' | 'result' | 'pk-waiting' | 'pk-compare'
