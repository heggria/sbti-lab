import { useState, useEffect, useRef, useMemo, useCallback, useSyncExternalStore } from 'react'
import type { DimensionId, DimensionLevel } from '../types'
import type { InterpretationStyle } from '../data/interpretations'
import { getRandomInterpretation, replaceDimensionPlaceholders } from '../data/interpretations'
import { DIMENSION_ORDER } from '../utils/scoring'

const STYLE_CONFIG: Record<InterpretationStyle, { label: string; emoji: string; colorClass: string; activeColorClass: string }> = {
  roast: {
    label: '毒舌',
    emoji: '🔥',
    colorClass: 'border-neon-pink/30 text-neon-pink',
    activeColorClass: 'bg-neon-pink/20 border-neon-pink',
  },
  gentle: {
    label: '温柔',
    emoji: '🌸',
    colorClass: 'border-neon-green/30 text-neon-green',
    activeColorClass: 'bg-neon-green/20 border-neon-green',
  },
  philosophy: {
    label: '哲学',
    emoji: '🔮',
    colorClass: 'border-neon-purple/30 text-neon-purple',
    activeColorClass: 'bg-neon-purple/20 border-neon-purple',
  },
  cyberpunk: {
    label: '赛博',
    emoji: '⚡',
    colorClass: 'border-neon-cyan/30 text-neon-cyan',
    activeColorClass: 'bg-neon-cyan/20 border-neon-cyan',
  },
  mixed: {
    label: '混合',
    emoji: '🎲',
    colorClass: 'border-neon-yellow/30 text-neon-yellow',
    activeColorClass: 'bg-neon-yellow/20 border-neon-yellow',
  },
}

const TYPING_SPEED = 30

interface TypingState {
  displayText: string
  isTyping: boolean
  isComplete: boolean
}

class TypingController {
  private rafId: number | null = null
  private _state: TypingState = { displayText: '', isTyping: false, isComplete: false }
  private listeners = new Set<() => void>()
  private fullText = ''
  private startTime = 0

  get snapshot(): TypingState {
    return this._state
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getSnapshot = (): TypingState => {
    return this._state
  }

  private emit() {
    for (const fn of this.listeners) fn()
  }

  start(text: string) {
    this.stop()
    this.fullText = text
    this.startTime = performance.now()
    this._state = { displayText: '', isTyping: true, isComplete: false }
    this.emit()
    this.rafId = requestAnimationFrame(this.tick)
  }

  private tick = (now: number) => {
    const elapsed = now - this.startTime
    const targetIndex = Math.floor(elapsed / TYPING_SPEED)

    if (targetIndex >= this.fullText.length) {
      this._state = { displayText: this.fullText, isTyping: false, isComplete: true }
      this.emit()
      return
    }

    this._state = { displayText: this.fullText.slice(0, targetIndex + 1), isTyping: true, isComplete: false }
    this.emit()
    this.rafId = requestAnimationFrame(this.tick)
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  destroy() {
    this.stop()
    this.listeners.clear()
  }
}

function useTypingAnimation(text: string) {
  const controllerRef = useMemo(() => new TypingController(), [])

  const typingState = useSyncExternalStore(
    controllerRef.subscribe,
    controllerRef.getSnapshot,
  )

  useEffect(() => {
    controllerRef.start(text)
    return () => controllerRef.stop()
  }, [text, controllerRef])

  return typingState
}

interface AIInterpreterProps {
  personalityCode: string
  dimensionVector: Record<DimensionId, DimensionLevel>
}

export function AIInterpreter({ personalityCode, dimensionVector }: AIInterpreterProps) {
  const [activeStyle, setActiveStyle] = useState<InterpretationStyle>('cyberpunk')
  const regenerateRef = useRef(0)
  const [, forceUpdate] = useState(0)

  const dimensionValues = useMemo(
    () =>
      DIMENSION_ORDER.reduce<Record<string, string>>((acc, dim) => {
        acc[dim] = dimensionVector[dim]
        return acc
      }, {}),
    [dimensionVector],
  )

  const textContent = useMemo(() => {
    void regenerateRef.current
    const interpretation = getRandomInterpretation(personalityCode, activeStyle)
    return replaceDimensionPlaceholders(interpretation.template, dimensionValues)
  }, [personalityCode, activeStyle, dimensionValues])

  const { displayText, isTyping, isComplete } = useTypingAnimation(textContent)

  const handleStyleChange = useCallback((style: InterpretationStyle) => {
    if (style === activeStyle || isTyping) return
    setActiveStyle(style)
  }, [activeStyle, isTyping])

  const handleRegenerate = useCallback(() => {
    regenerateRef.current += 1
    forceUpdate((n) => n + 1)
  }, [])

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-neon-cyan font-bold text-sm">
          <span className="neon-text-cyan">AI</span> 解读
        </h3>
        {isTyping && (
          <span className="text-xs text-cyber-muted animate-pulse">生成中...</span>
        )}
        {isComplete && (
          <button
            onClick={handleRegenerate}
            className="text-xs text-neon-yellow hover:text-neon-yellow/80 transition-colors cursor-pointer"
          >
            [ 重新生成 ]
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="解读风格切换">
        {(Object.entries(STYLE_CONFIG) as [InterpretationStyle, typeof STYLE_CONFIG[InterpretationStyle]][]).map(
          ([style, config]) => (
            <button
              key={style}
              role="tab"
              aria-selected={activeStyle === style}
              onClick={() => handleStyleChange(style)}
              disabled={isTyping}
              className={`
                px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 cursor-pointer
                ${activeStyle === style ? config.activeColorClass : `${config.colorClass} opacity-50 hover:opacity-80`}
                ${isTyping && activeStyle !== style ? 'pointer-events-none' : ''}
              `}
            >
              {config.emoji} {config.label}
            </button>
          ),
        )}
      </div>

      <div
        className="min-h-[120px] p-4 bg-cyber-surface/50 rounded-lg border border-cyber-border/50
                   text-sm text-cyber-text leading-relaxed font-mono"
        aria-live="polite"
        aria-label="AI 解读内容"
      >
        <span>{displayText}</span>
        {isTyping && (
          <span className="inline-block w-2 h-4 bg-neon-cyan ml-0.5 animate-pulse align-middle" />
        )}
      </div>
    </div>
  )
}
