import { useSyncExternalStore } from 'react'
import zh from './zh.json'
import en from './en.json'

export type Locale = 'zh' | 'en'

type TranslationValue = string | { [key: string]: TranslationValue }
type TranslationMap = Record<string, TranslationValue>

const STORAGE_KEY = 'sbti-locale'

const translations: Record<Locale, TranslationMap> = { zh, en }

let currentLocale: Locale = detectLocale()

function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'zh' || stored === 'en') return stored
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('en')) return 'en'
  } catch {
    // SSR or restricted localStorage
  }
  return 'zh'
}

type Listener = () => void
const listeners = new Set<Listener>()

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return currentLocale
}

function getServerSnapshot() {
  return 'zh' as Locale
}

function notify() {
  listeners.forEach((l) => l())
}

export function getLocale(): Locale {
  return currentLocale
}

export function setLocale(locale: Locale) {
  if (locale === currentLocale) return
  currentLocale = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // restricted localStorage
  }
  notify()
}

function resolve(obj: TranslationMap, path: string): string | undefined {
  const keys = path.split('.')
  let current: TranslationValue | undefined = obj
  for (const key of keys) {
    if (current == null || typeof current === 'string') return undefined
    current = current[key]
  }
  return typeof current === 'string' ? current : undefined
}

export function t(key: string, locale?: Locale): string {
  const value = resolve(translations[locale ?? currentLocale], key)
  return value ?? resolve(translations.zh, key) ?? key
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useI18n() {
  const locale = useLocale()
  return {
    locale,
    t: (key: string) => t(key, locale),
    setLocale,
  } as const
}

export function useLocalizedQuestions<T extends { id: string; text: string; options: { label: string; value: number }[] }>(
  questions: T[]
): T[] {
  const { locale } = useI18n()
  if (locale === 'zh') return questions
  return questions.map((q) => ({
    ...q,
    text: t(`question.${q.id}.text`, locale) || q.text,
    options: q.options.map((o) => ({
      ...o,
      label: t(`question.${q.id}.option${o.value}`, locale) || o.label,
    })),
  }))
}

export function useLocalizedPersonalities<T extends { code: string; name: string; intro: string; rarity: string; rarityName: string; desc?: string }>(
  personalities: T[]
): T[] {
  const { locale } = useI18n()
  if (locale === 'zh') return personalities
  return personalities.map((p) => ({
    ...p,
    name: t(`personality.${p.code}.name`, locale) || p.name,
    intro: t(`personality.${p.code}.intro`, locale) || p.intro,
    rarityName: t(`rarity.${p.rarity}`, locale) || p.rarityName,
    ...(p.desc != null && { desc: t(`personality.${p.code}.desc`, locale) || p.desc }),
  }))
}
