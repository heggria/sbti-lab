import { useMemo, useState, useCallback, useRef } from 'react'
import { useResult } from '../hooks/useResult'
import { useQuizStore } from '../store/quizStore'
import { useI18n } from '../i18n'
import { PKRadar } from './PKRadar'
import { getChemistry, getMoodEmoji, getMoodGradient } from '../data/chemistry'
import { computePKDifferences } from '../utils/pk-encoding'
import { matchPersonality } from '../utils/matching'
import { questions } from '../data/questions'
import { buildPKShareUrl } from '../utils/pk-encoding'
import { exportToImage } from '../utils/canvas-export'
import { DIMENSION_ORDER } from '../utils/scoring'

export function PKCompare() {
  const { result, scores } = useResult()
  const pkChallenge = useQuizStore((s) => s.pkChallenge)
  const setPhase = useQuizStore((s) => s.setPhase)
  const reset = useQuizStore((s) => s.reset)
  const { t } = useI18n()
  const [showLink, setShowLink] = useState(false)
  const [exporting, setExporting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const challengerResult = useMemo(() => {
    if (!pkChallenge) return null
    const fakeAnswers = DIMENSION_ORDER.map((dim) => ({ questionId: dim, value: pkChallenge.challengerScores[dim] ?? 2 }))
    return matchPersonality(fakeAnswers, questions)
  }, [pkChallenge])

  const chemistry = useMemo(() => {
    if (!result || !challengerResult) return null
    return getChemistry(challengerResult.personality.code, result.personality.code)
  }, [result, challengerResult])

  const pkDiff = useMemo(() => {
    if (!pkChallenge) return null
    return computePKDifferences(pkChallenge.challengerScores, scores)
  }, [pkChallenge, scores])

  const pkLink = useMemo(() => {
    if (!result) return ''
    const baseUrl = window.location.origin + window.location.pathname
    return buildPKShareUrl(baseUrl, result.personality.code, scores)
  }, [result, scores])

  const handleExport = useCallback(async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      await exportToImage(cardRef.current, `sbti-pk-${challengerResult?.personality.code ?? 'x'}-${result?.personality.code ?? 'x'}.png`)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [challengerResult, result, exporting])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pkLink)
      setShowLink(true)
      setTimeout(() => setShowLink(false), 2000)
    } catch {
      setShowLink(true)
      setTimeout(() => setShowLink(false), 2000)
    }
  }, [pkLink])

  const handleRestart = () => {
    reset()
    setPhase('intro')
  }

  if (!result || !pkChallenge || !challengerResult || !chemistry || !pkDiff) {
    return <div className="text-cyber-muted text-center p-8">{t('app.pkLoading')}</div>
  }

  const harmonyLabel = pkDiff.harmony >= 70 ? '🔥 Soulmates' : pkDiff.harmony >= 40 ? '✨ Compatible' : '⚡ Explosive'

  return (
    <div className="max-w-lg w-full space-y-5">
      <div className={`rounded-xl p-6 bg-gradient-to-br ${getMoodGradient(chemistry.mood)} border border-cyber-border space-y-4`}>
        <div className="text-center space-y-2">
          <span className="text-2xl">{getMoodEmoji(chemistry.mood)}</span>
          <h2 className="text-lg font-bold text-neon-cyan">{t('app.pkResult')}</h2>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-bold text-neon-cyan">{challengerResult.personality.name}</span>
            <span className="text-cyber-muted">×</span>
            <span className="text-sm font-bold text-neon-pink">{result.personality.name}</span>
          </div>
          <p className="text-cyber-text/80 text-sm italic leading-relaxed">
            &ldquo;{t('app.locale') === 'en' ? chemistry.textEn : chemistry.text}&rdquo;
          </p>
          <div className="text-xs text-cyber-muted">
            {harmonyLabel} · {t('app.pkHarmony')}: {pkDiff.harmony}%
          </div>
        </div>
      </div>

      <div className="cyber-card rounded-xl p-4">
        <div className="flex justify-center mb-2">
          <PKRadar scoresA={pkChallenge.challengerScores} scoresB={scores} size={300} />
        </div>
        <div className="flex justify-center gap-6 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan" />
            {challengerResult.personality.name}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-pink" />
            {result.personality.name}
          </span>
        </div>
      </div>

      <div className="cyber-card rounded-xl p-5 space-y-3">
        <h3 className="text-neon-purple font-bold text-sm">{t('app.pkDimensions')}</h3>
        <div className="space-y-1.5">
          {DIMENSION_ORDER.map((dim) => {
            const vA = pkChallenge.challengerScores[dim] ?? 2
            const vB = scores[dim] ?? 2
            const isOverlap = pkDiff.overlap.includes(dim)
            const isConflict = pkDiff.conflict.includes(dim)
            const dot = isOverlap ? '🟢' : isConflict ? '🔴' : '⚪'
            return (
              <div key={dim} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-center">{dot}</span>
                <span className="text-cyber-muted w-6 font-mono">{dim}</span>
                <div className="flex-1 flex gap-1">
                  <div className="flex-1 h-1.5 bg-cyber-surface rounded-full overflow-hidden">
                    <div className="h-full bg-neon-cyan rounded-full" style={{ width: `${((vA - 1) / 2) * 100}%` }} />
                  </div>
                  <div className="flex-1 h-1.5 bg-cyber-surface rounded-full overflow-hidden">
                    <div className="h-full bg-neon-pink rounded-full" style={{ width: `${((vB - 1) / 2) * 100}%` }} />
                  </div>
                </div>
                <span className="text-cyber-muted/50 w-10 text-right font-mono">
                  {vA.toFixed(1)}:{vB.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="cyber-card rounded-xl p-4 space-y-3">
        <h3 className="text-neon-purple font-bold text-sm mb-3 text-center">{t('app.pkCard')}</h3>
        <div ref={cardRef} className="w-full max-w-[360px] mx-auto rounded-xl overflow-hidden p-5 space-y-3"
          style={{ background: 'linear-gradient(180deg, #0a0a0f, #12121a, #1a1a2e)' }}>
          <div className="text-center space-y-1">
            <span className="text-xl">{getMoodEmoji(chemistry.mood)}</span>
            <p className="text-xs text-cyber-muted italic leading-relaxed">
              {t('app.locale') === 'en' ? chemistry.textEn : chemistry.text}
            </p>
            <div className="flex justify-center gap-3 text-xs">
              <span className="text-neon-cyan font-bold">{challengerResult.personality.name}</span>
              <span className="text-cyber-muted">×</span>
              <span className="text-neon-pink font-bold">{result.personality.name}</span>
            </div>
          </div>
          <div className="flex justify-center">
            <PKRadar scoresA={pkChallenge.challengerScores} scoresB={scores} size={200} />
          </div>
          <p className="text-center text-gray-600 text-[10px] font-mono">SBTI Lab</p>
        </div>
        <button onClick={handleExport} disabled={exporting}
          className="cyber-btn w-full px-4 py-2.5 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan rounded-lg
                     hover:bg-neon-cyan/20 transition-all cursor-pointer text-sm disabled:opacity-50">
          {exporting ? t('app.exporting') : t('app.savePKCard')}
        </button>
      </div>

      <div className="cyber-card rounded-xl p-4 space-y-3">
        <h3 className="text-neon-purple font-bold text-sm">{t('app.pkInvite')}</h3>
        <div className="flex gap-2">
          <input readOnly value={pkLink}
            className="flex-1 bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-muted font-mono truncate" />
          <button onClick={handleCopyLink}
            className="px-3 py-2 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan rounded-lg text-xs cursor-pointer hover:bg-neon-cyan/20 transition-all">
            {showLink ? '✓' : t('app.copyLink')}
          </button>
        </div>
      </div>

      <div className="text-center pb-4">
        <button onClick={handleRestart}
          className="cyber-btn px-8 py-3 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink rounded-lg
                     hover:bg-neon-pink/20 transition-all cursor-pointer text-sm">
          {t('app.restartBtn')}
        </button>
      </div>
    </div>
  )
}
