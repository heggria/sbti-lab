import { useRef, useEffect, useCallback } from 'react'
import type { DimensionId } from '../types'
import { DIMENSION_ORDER } from '../utils/scoring'

interface PKRadarProps {
  scoresA: Record<DimensionId, number>
  scoresB: Record<DimensionId, number>
  size?: number
}

const NUM_DIMS = DIMENSION_ORDER.length
const ANGLE_STEP = (Math.PI * 2) / NUM_DIMS
const LEVELS = 4

export function PKRadar({ scoresA, scoresB, size = 320 }: PKRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1

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
      ctx.strokeStyle = lv === LEVELS ? 'rgba(0, 240, 255, 0.12)' : `rgba(42, 42, 62, ${0.25 + lv * 0.1})`
      ctx.lineWidth = lv === LEVELS ? 1.5 : 0.5
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

    function drawPlayer(scores: Record<DimensionId, number>, strokeColor: string, fillColor: string, dotColor: string) {
      if (!ctx) return
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
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 1.5
      ctx.stroke()

      for (let i = 0; i < NUM_DIMS; i++) {
        const angle = ANGLE_STEP * i - Math.PI / 2
        const r = maxR * values[i]
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = dotColor
        ctx.fill()
      }
    }

    drawPlayer(scoresA, 'rgba(0, 240, 255, 0.8)', 'rgba(0, 240, 255, 0.08)', '#00f0ff')
    drawPlayer(scoresB, 'rgba(255, 0, 128, 0.8)', 'rgba(255, 0, 128, 0.08)', '#ff0080')

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
      ctx.fillStyle = 'rgba(136, 136, 160, 0.7)'
      ctx.fillText(dim, x, y)
    }
  }, [scoresA, scoresB, size, dpr])

  useEffect(() => {
    draw()
  }, [draw])

  return <canvas ref={canvasRef} style={{ width: size, height: size }} />
}
