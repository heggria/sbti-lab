import { useResult } from '../hooks/useResult'
import { useQuizStore } from '../store/quizStore'
import { CATEGORIES } from '../utils/scoring'
import { RadarChart } from './RadarChart'
import { ShareCard } from './ShareCard'
import { lazy, Suspense, useState, useCallback } from 'react'
import { useI18n, useLocalizedPersonalities } from '../i18n'
import { personalities } from '../data/personalities'
import { buildPKShareUrl } from '../utils/pk-encoding'

const AIInterpreter = lazy(() => import('./AIInterpreter').then(m => ({ default: m.AIInterpreter })))

const RARITY_COLORS: Record<string, string> = {
  SSR: 'text-neon-yellow',
  SR: 'text-neon-purple',
  R: 'text-neon-cyan',
  N: 'text-cyber-muted',
}

const RARITY_BG: Record<string, string> = {
  SSR: 'border-neon-yellow/30 bg-neon-yellow/5',
  SR: 'border-neon-purple/30 bg-neon-purple/5',
  R: 'border-neon-cyan/30 bg-neon-cyan/5',
  N: 'border-cyber-border bg-cyber-surface',
}

const RARITY_GLOW: Record<string, string> = {
  SSR: '0 0 30px rgba(255, 238, 0, 0.15), 0 0 60px rgba(255, 238, 0, 0.05)',
  SR: '0 0 30px rgba(176, 0, 255, 0.15), 0 0 60px rgba(176, 0, 255, 0.05)',
  R: '0 0 20px rgba(0, 240, 255, 0.1)',
  N: 'none',
}

export function ResultPage() {
  const { result, scores, dimensionVector, vectorString, rankings } = useResult()
  const storeReset = useQuizStore((s) => s.reset)
  const setPhase = useQuizStore((s) => s.setPhase)
  const { t } = useI18n()
  const [pkCopied, setPkCopied] = useState(false)

  const pkLink = result
    ? buildPKShareUrl(
        window.location.origin + window.location.pathname,
        result.personality.code,
        scores,
      )
    : ''

  const handleCopyPK = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pkLink)
    } catch {
      // fallback: select text
    }
    setPkCopied(true)
    setTimeout(() => setPkCopied(false), 2000)
  }, [pkLink])

  const localizedPersonalities = useLocalizedPersonalities(personalities)
  const localizedRankings = useLocalizedPersonalities(rankings.map((r) => r.personality))
    .map((lp, i) => ({ ...rankings[i], personality: lp }))

  if (!result || !dimensionVector) return null

  const handleRestart = () => {
    storeReset()
    setPhase('intro')
  }

  const glow = RARITY_GLOW[result.personality.rarity] ?? 'none'
  const displayPersonality = localizedPersonalities.find(
    (p) => p.code === result.personality.code,
  ) ?? result.personality

  const categoryNames: Record<string, string> = {
    S: t('category.S'),
    E: t('category.E'),
    A: t('category.A'),
    Ac: t('category.Ac'),
    So: t('category.So'),
  }

  return (
    <div className="max-w-lg w-full space-y-5">
      <div
        className={`cyber-card rounded-xl p-6 space-y-4 animate-scale-in ${RARITY_BG[result.personality.rarity]}`}
        style={{ boxShadow: glow }}
      >
        <div className="text-center space-y-2">
          <span
            className={`text-xs font-bold tracking-[0.2em] ${RARITY_COLORS[result.personality.rarity]}`}
          >
            {t(`rarity.${result.personality.rarity}`)} · {result.personality.rarity}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-neon-cyan animate-fade-in-up delay-75">
            {displayPersonality.name}
          </h2>
          <p className="text-cyber-muted text-lg font-mono tracking-wider animate-fade-in delay-150">
            {displayPersonality.code}
          </p>
          <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent animate-fade-in delay-200" />
          <p className="text-cyber-text/80 italic text-lg animate-fade-in-up delay-200">
            &ldquo;{displayPersonality.intro}&rdquo;
          </p>
        </div>

        {displayPersonality.desc && (
          <p className="text-sm text-cyber-text/60 leading-relaxed animate-fade-in delay-300">
            {displayPersonality.desc}
          </p>
        )}

        <div className="text-center text-xs text-cyber-muted/50 animate-fade-in delay-400">
          {t('app.matchRate')}: <span className="text-neon-cyan">{(result.similarity * 100).toFixed(0)}%</span>
          <span className="mx-1.5 text-cyber-border">|</span>
          {t('app.population')}: {result.personality.populationPct}%
        </div>
      </div>

      <div className="cyber-card rounded-xl p-4 animate-fade-in-up delay-300">
        <h3 className="text-neon-cyan font-bold text-sm mb-3 text-center tracking-wide">
          {t('app.radarTitle')}
        </h3>
        <div className="flex justify-center">
          <RadarChart scores={scores} size={300} />
        </div>
      </div>

      <div className="animate-fade-in-up delay-400">
        <Suspense fallback={<div className="h-32 animate-pulse bg-cyber-surface rounded-lg" />}>
          <AIInterpreter
            personalityCode={result.personality.code}
            dimensionVector={dimensionVector}
          />
        </Suspense>
      </div>

      <div className="cyber-card rounded-xl p-5 sm:p-6 space-y-4 animate-fade-in-up delay-500">
        <h3 className="text-neon-purple font-bold text-sm tracking-wide">{t('app.dimensionTitle')}</h3>
        <p className="text-cyber-muted/50 text-xs font-mono bg-cyber-bg/50 rounded px-2 py-1 inline-block">
          {vectorString}
        </p>
        <div className="space-y-3 stagger-children">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-1.5">
              <span className="text-xs text-cyber-muted/70">{categoryNames[cat.id] ?? cat.name}</span>
              <div className="flex gap-2">
                {cat.dimensions.map((dim) => {
                  const level = dimensionVector[dim]
                  const color =
                    level === 'H'
                      ? 'bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.4)]'
                      : level === 'M'
                        ? 'bg-neon-yellow shadow-[0_0_6px_rgba(255,238,0,0.3)]'
                        : 'bg-cyber-border'
                  return (
                    <div key={dim} className="flex-1 space-y-1">
                      <div className="h-2 bg-cyber-surface/80 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
                          style={{
                            width: level === 'H' ? '100%' : level === 'M' ? '60%' : '25%',
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-cyber-muted/50 font-mono text-center block">
                        {dim}:{level}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cyber-card rounded-xl p-4 animate-fade-in-up delay-600">
        <h3 className="text-neon-purple font-bold text-sm mb-3 text-center tracking-wide">
          {t('app.shareCardTitle')}
        </h3>
        <ShareCard personality={result.personality} scores={scores} />
      </div>

      <details className="cyber-card rounded-xl overflow-hidden animate-fade-in-up delay-700">
        <summary className="px-5 py-3 text-sm text-cyber-muted cursor-pointer hover:text-cyber-text transition-colors">
          {t('app.allRankings')}
        </summary>
        <div className="px-5 pb-4 space-y-1 max-h-64 overflow-y-auto">
          {localizedRankings.map((r) => (
            <div
              key={r.personality.code}
              className={`flex justify-between text-xs py-1.5 border-b border-cyber-border/20 last:border-0 ${
                r.personality.code === result.personality.code
                  ? 'text-neon-cyan font-bold'
                  : 'text-cyber-muted/60'
              }`}
            >
              <span>
                <span className="text-cyber-muted/30 mr-1.5">{r.personality.rank}.</span>
                {r.personality.name}
                <span className="text-cyber-muted/30 ml-1.5">({r.personality.code})</span>
              </span>
              <span>{(r.similarity * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </details>

      <div className="cyber-card rounded-xl p-4 animate-fade-in-up delay-[750ms]">
        <h3 className="text-neon-cyan font-bold text-sm mb-3 text-center tracking-wide">
          ⚔️ {t('app.pkInvite')}
        </h3>
        <p className="text-cyber-muted text-xs text-center mb-3">
          {t('app.pkInviteDesc')}
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={pkLink}
            className="flex-1 bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-muted font-mono truncate"
          />
          <button
            onClick={handleCopyPK}
            className="px-3 py-2 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan rounded-lg text-xs cursor-pointer hover:bg-neon-cyan/20 transition-all"
          >
            {pkCopied ? '✓' : t('app.copyLink')}
          </button>
        </div>
      </div>

      <div className="text-center animate-fade-in delay-[800ms] pb-4">
        <button
          onClick={handleRestart}
          className="cyber-btn px-8 py-3 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink rounded-lg
                     hover:bg-neon-pink/20 hover:shadow-[0_0_20px_rgba(255,0,128,0.2)]
                     active:scale-95 transition-all cursor-pointer text-sm"
        >
          {t('app.restartBtn')}
        </button>
      </div>
    </div>
  )
}
