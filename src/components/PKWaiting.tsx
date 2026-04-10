import { useQuizStore } from '../store/quizStore'
import { useI18n } from '../i18n'

export function PKWaiting() {
  const setPhase = useQuizStore((s) => s.setPhase)
  const reset = useQuizStore((s) => s.reset)
  const { t } = useI18n()

  const handleStart = () => {
    setPhase('quiz')
  }

  const handleSkip = () => {
    reset()
    setPhase('intro')
  }

  return (
    <div className="max-w-md w-full text-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-neon-cyan">⚔️ PK</h1>
        <p className="text-cyber-muted text-sm">{t('app.pkWaitingTitle')}</p>
      </div>

      <p className="text-cyber-text leading-relaxed">
        {t('app.pkWaitingDesc')}
      </p>

      <button
        onClick={handleStart}
        className="px-8 py-3 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan rounded-lg
                   hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]
                   transition-all duration-300 text-lg font-bold tracking-wider cursor-pointer"
      >
        {t('app.pkStartQuiz')}
      </button>

      <button
        onClick={handleSkip}
        className="text-cyber-muted hover:text-cyber-text transition-colors text-sm cursor-pointer underline"
      >
        {t('app.pkSkip')}
      </button>
    </div>
  )
}
