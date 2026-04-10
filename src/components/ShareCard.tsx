import { useRef, useState, useCallback } from 'react'
import { RadarChart } from './RadarChart'
import { exportToImage } from '../utils/canvas-export'
import type { DimensionId, Personality } from '../types'
import { DIMENSION_ORDER } from '../utils/scoring'
import { useI18n, useLocalizedPersonalities } from '../i18n'
import { personalities } from '../data/personalities'

interface ShareCardProps {
  personality: Personality
  scores: Record<DimensionId, number>
}

const RARITY_COLORS: Record<string, string> = {
  SSR: '#ffee00',
  SR: '#b000ff',
  R: '#00f0ff',
  N: '#8888a0',
}

export function ShareCard({ personality, scores }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const { t } = useI18n()
  const localized = useLocalizedPersonalities(personalities)
  const displayPersonality = localized.find((p) => p.code === personality.code) ?? personality

  const handleExport = useCallback(async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      await exportToImage(cardRef.current, `sbti-${personality.code}.png`)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [personality.code, exporting])

  const color = RARITY_COLORS[personality.rarity] || '#00f0ff'

  return (
    <div className="space-y-3">
      <button
        onClick={handleExport}
        disabled={exporting}
        className="cyber-btn w-full px-4 py-2.5 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan rounded-lg
                   hover:bg-neon-cyan/20 transition-all cursor-pointer text-sm disabled:opacity-50"
      >
        {exporting ? t('app.exporting') : t('app.saveCard')}
      </button>

      <div
        ref={cardRef}
        className="w-full max-w-[360px] mx-auto rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #1a1a2e 100%)',
          aspectRatio: '360/640',
        }}
      >
        <div className="p-5 space-y-4 h-full flex flex-col">
          <div className="text-center space-y-1.5">
            <p className="text-xs font-bold tracking-[0.15em]" style={{ color }}>
              {t(`rarity.${personality.rarity}`)} · {personality.rarity}
            </p>
            <h2 className="text-2xl font-bold" style={{ color }}>
              {displayPersonality.name}
            </h2>
            <p className="text-gray-500 text-sm font-mono">{displayPersonality.code}</p>
            <p className="text-gray-400 italic text-sm leading-relaxed">
              &ldquo;{displayPersonality.intro}&rdquo;
            </p>
          </div>

          <div className="flex justify-center flex-shrink-0">
            <RadarChart scores={scores} size={240} />
          </div>

          <div className="space-y-1 flex-1 min-h-0">
            {DIMENSION_ORDER.map((dim) => {
              const val = scores[dim] ?? 2
              const pct = ((val - 1) / 2) * 100
              const barColor =
                val >= 2.5 ? '#00f0ff' : val >= 1.5 ? '#ffee00' : '#2a2a3e'
              return (
                <div key={dim} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 w-5 font-mono shrink-0">{dim}</span>
                  <div className="flex-1 h-1 bg-gray-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: barColor }}
                    />
                  </div>
                  <span className="text-gray-600 w-5 text-right font-mono shrink-0">{val.toFixed(1)}</span>
                </div>
              )
            })}
          </div>

          <div className="text-center pt-2 border-t border-gray-800/60 flex-shrink-0">
            <p className="text-gray-600 text-[10px] font-mono tracking-wider">
              {t('app.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
