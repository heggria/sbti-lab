import { useRef, useEffect, useCallback } from 'react'
import type { DimensionId } from '../types'
import { DIMENSION_ORDER } from '../utils/scoring'
import { getLocale } from '../i18n'

interface RadarChartProps {
  scores: Record<DimensionId, number>
  size?: number
  className?: string
}

const DIMENSION_LABELS_ZH: Record<DimensionId, string> = {
  S1: '自我认知', S2: '自我定位', S3: '自我驱动',
  E1: '情感安全', E2: '情感投入', E3: '情感独立',
  A1: '信任他人', A2: '规则态度', A3: '目标感',
  Ac1: '成就追求', Ac2: '果断性', Ac3: '执行力',
  So1: '社交开放', So2: '亲密度', So3: '社交面具',
}

const DIMENSION_LABELS_EN: Record<DimensionId, string> = {
  S1: 'Self-aware', S2: 'Self-pos', S3: 'Drive',
  E1: 'Emo-safe', E2: 'Emo-invest', E3: 'Emo-indep',
  A1: 'Trust', A2: 'Rules', A3: 'Purpose',
  Ac1: 'Achieve', Ac2: 'Decisive', Ac3: 'Execute',
  So1: 'Social', So2: 'Intimacy', So3: 'Mask',
}

const NUM_DIMS = DIMENSION_ORDER.length
const ANGLE_STEP = (Math.PI * 2) / NUM_DIMS
const LEVELS = 4

export function RadarChart({ scores, size = 320, className = '' }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1

  const locale = getLocale()
  const labels = locale === 'en' ? DIMENSION_LABELS_EN : DIMENSION_LABELS_ZH

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const maxR = size / 2 - 36

    ctx.clearRect(0, 0, size, size)

    for (let lv = 1; lv <= LEVELS; lv++) {
      const r = (maxR * lv) / LEVELS
      ctx.beginPath()
      for (let i = 0; i <= NUM_DIMS; i++) {
        const angle = ANGLE_STEP * i - Math.PI / 2
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      if (lv === LEVELS) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)'
        ctx.lineWidth = 1.5
      } else {
        ctx.strokeStyle = `rgba(42, 42, 62, ${0.25 + lv * 0.1})`
        ctx.lineWidth = 0.5
      }
      ctx.stroke()
    }

    for (let i = 0; i < NUM_DIMS; i++) {
      const angle = ANGLE_STEP * i - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle))
      ctx.strokeStyle = 'rgba(42, 42, 62, 0.25)'
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    const values = DIMENSION_ORDER.map((dim) => {
      const raw = scores[dim] ?? 2
      return Math.max(0, Math.min(1, (raw - 1) / 2))
    })

    ctx.beginPath()
    for (let i = 0; i <= NUM_DIMS; i++) {
      const idx = i % NUM_DIMS
      const angle = ANGLE_STEP * idx - Math.PI / 2
      const r = maxR * values[idx]
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.12)')
    gradient.addColorStop(0.5, 'rgba(176, 0, 255, 0.12)')
    gradient.addColorStop(1, 'rgba(255, 0, 128, 0.12)')
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    for (let i = 0; i < NUM_DIMS; i++) {
      const angle = ANGLE_STEP * i - Math.PI / 2
      const r = maxR * values[i]
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(x, y, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#00f0ff'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)'
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    const fontSize = size < 260 ? 8 : 9
    ctx.font = `${fontSize}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let i = 0; i < NUM_DIMS; i++) {
      const dim = DIMENSION_ORDER[i]
      const angle = ANGLE_STEP * i - Math.PI / 2
      const labelR = maxR + 20
      const x = cx + labelR * Math.cos(angle)
      const y = cy + labelR * Math.sin(angle)

      const scoreVal = scores[dim]?.toFixed(1) ?? '2.0'
      const label = labels[dim]
      const fullLabel = `${label} ${scoreVal}`

      const val = values[i]
      ctx.fillStyle = val >= 0.75
        ? 'rgba(0, 240, 255, 0.9)'
        : val >= 0.25
          ? 'rgba(136, 136, 160, 0.8)'
          : 'rgba(136, 136, 160, 0.5)'
      ctx.fillText(fullLabel, x, y)
    }
  }, [scores, size, dpr, labels])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
    />
  )
}
