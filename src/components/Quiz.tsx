import { useCallback, useRef, useEffect, useState } from 'react'
import { useQuiz } from '../hooks/useQuiz'
import { useLocalizedQuestions } from '../i18n'
import { questions } from '../data/questions'

const SWIPE_THRESHOLD = 50

export function Quiz() {
  const {
    progress,
    estimatedTimeLeft,
    currentAnswer,
    handleAnswer,
    prevQuestion,
    currentQuestionIndex,
  } = useQuiz()

  const localizedQuestions = useLocalizedQuestions(questions)
  const currentQuestion = localizedQuestions[currentQuestionIndex] ?? null
  const totalQuestions = localizedQuestions.length
  const [animatingOption, setAnimatingOption] = useState<number | null>(null)

  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerRef.current?.focus()
  }, [currentQuestion?.id])

  const handleOptionSelect = useCallback(
    (value: number, idx: number) => {
      if (animatingOption !== null) return
      setAnimatingOption(idx)
      setTimeout(() => {
        setAnimatingOption(null)
        handleAnswer(value)
      }, 200)
    },
    [animatingOption, handleAnswer],
  )

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!currentQuestion) return
      const map: Record<string, number> = {
        ArrowLeft: 0,
        ArrowRight: 1,
        ArrowUp: 2,
        a: 0,
        b: 1,
        c: 2,
        '1': 0,
        '2': 1,
        '3': 2,
      }
      const idx = map[e.key]
      if (idx !== undefined && currentQuestion.options[idx]) {
        handleOptionSelect(currentQuestion.options[idx].value, idx)
      } else if (e.key === 'ArrowDown' || e.key === 'Backspace') {
        prevQuestion()
      }
    },
    [currentQuestion, prevQuestion, handleOptionSelect],
  )

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current || !currentQuestion) return
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStart.current.x
      const dy = t.clientY - touchStart.current.y
      touchStart.current = null

      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return

      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy < -SWIPE_THRESHOLD && currentQuestion.options[2]) {
          handleOptionSelect(currentQuestion.options[2].value, 2)
        }
      } else {
        if (dx < -SWIPE_THRESHOLD && currentQuestion.options[0]) {
          handleOptionSelect(currentQuestion.options[0].value, 0)
        } else if (dx > SWIPE_THRESHOLD && currentQuestion.options[1]) {
          handleOptionSelect(currentQuestion.options[1].value, 1)
        }
      }
    },
    [currentQuestion, handleOptionSelect],
  )

  if (!currentQuestion) return null

  const formatTime = (s: number | null) => {
    if (s === null) return ''
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`
  }

  const keyHints = ['← / A / 1', '→ / B / 2', '↑ / C / 3']
  const optionColors = [
    { active: 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_16px_rgba(0,240,255,0.2)]', glow: 'rgba(0,240,255,0.4)' },
    { active: 'border-neon-pink bg-neon-pink/10 text-neon-pink shadow-[0_0_16px_rgba(255,0,128,0.2)]', glow: 'rgba(255,0,128,0.4)' },
    { active: 'border-neon-purple bg-neon-purple/10 text-neon-purple shadow-[0_0_16px_rgba(176,0,255,0.2)]', glow: 'rgba(176,0,255,0.4)' },
  ]

  return (
    <div
      ref={containerRef}
      className="max-w-lg w-full space-y-5 outline-none"
      onKeyDown={handleKey}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      <div className="space-y-2 animate-fade-in">
        <div className="flex justify-between text-xs text-cyber-muted">
          <span className="font-mono">
            <span className="text-neon-cyan">{currentQuestionIndex + 1}</span>
            <span className="text-cyber-muted/40"> / {totalQuestions}</span>
          </span>
          <span>{formatTime(estimatedTimeLeft)}</span>
        </div>
        <div className="h-1.5 bg-cyber-surface/80 rounded-full overflow-hidden border border-cyber-border/30">
          <div
            className="h-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <div className="cyber-card p-5 sm:p-6 space-y-5 animate-fade-in-up delay-75">
        <p className="text-base sm:text-lg leading-relaxed text-cyber-text/90">
          {currentQuestion.text}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const isAnimating = animatingOption === idx
            const isSelected = currentAnswer === opt.value
            const color = optionColors[idx]
            return (
              <button
                key={`${currentQuestion.id}-${idx}`}
                onClick={() => handleOptionSelect(opt.value, idx)}
                disabled={animatingOption !== null}
                className={`w-full text-left px-4 py-3.5 sm:py-4 rounded-lg border transition-all duration-200 cursor-pointer
                  min-h-[52px] sm:min-h-[48px] flex items-center gap-3
                  ${isSelected
                    ? color.active
                    : isAnimating
                      ? color.active
                      : 'border-cyber-border/60 bg-cyber-surface/60 hover:border-neon-cyan/30 hover:bg-cyber-surface/40'
                  }
                  ${animatingOption !== null && animatingOption !== idx ? 'opacity-40' : ''}
                  active:scale-[0.98]
                `}
                style={isSelected || isAnimating ? { boxShadow: `0 0 16px ${color.glow}` } : undefined}
              >
                <span className="text-cyber-muted/60 mr-1 text-xs font-mono shrink-0 w-24 hidden sm:inline">
                  [{keyHints[idx]}]
                </span>
                <span className="text-sm sm:text-base">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-between animate-fade-in delay-200">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="text-cyber-muted hover:text-neon-cyan transition-colors text-sm cursor-pointer
                     disabled:opacity-20 disabled:cursor-default px-2 py-1"
        >
          ← {currentQuestionIndex > 0 ? '上一题' : ''}
        </button>
        <span className="text-cyber-muted/25 text-xs hidden sm:block">
          Swipe: ← A / → B / ↑ C
        </span>
      </div>
    </div>
  )
}
