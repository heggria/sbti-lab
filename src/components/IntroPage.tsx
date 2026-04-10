import { useQuizStore } from '../store/quizStore'
import { useI18n } from '../i18n'

export function IntroPage() {
  const setPhase = useQuizStore((s) => s.setPhase)
  const reset = useQuizStore((s) => s.reset)
  const { t } = useI18n()

  const handleStart = () => {
    reset()
    setPhase('quiz')
  }

  return (
    <div className="max-w-md w-full text-center space-y-8">
      <div className="space-y-3 animate-fade-in-up">
        <h1
          className="text-5xl sm:text-6xl font-bold tracking-widest neon-text-cyan animate-neon-flicker"
          data-text="SBTI LAB"
        >
          SBTI LAB
        </h1>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
        <p className="text-cyber-muted text-sm tracking-wide">{t('app.subtitle')}</p>
      </div>

      <p className="text-cyber-text/90 leading-relaxed whitespace-pre-line animate-fade-in-up delay-200">
        {t('app.introDesc')}
      </p>

      <div className="animate-fade-in-up delay-400">
        <button
          onClick={handleStart}
          className="cyber-btn px-10 py-4 bg-neon-cyan/10 border border-neon-cyan/60 text-neon-cyan rounded-lg
                     hover:bg-neon-cyan/20 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]
                     hover:border-neon-cyan active:scale-95
                     transition-all duration-300 text-lg font-bold tracking-widest cursor-pointer neon-border-cyan"
        >
          {t('app.startBtn')}
        </button>
      </div>

      <p className="text-cyber-muted/30 text-xs animate-fade-in delay-500">
        {t('app.introNote')}
      </p>
    </div>
  )
}
