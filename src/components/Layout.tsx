import type { ReactNode } from 'react'
import { useI18n } from '../i18n'
import { CyberEffects } from './CyberEffects'

export function Layout({ children }: { children: ReactNode }) {
  const { locale, t, setLocale } = useI18n()

  return (
    <div className="min-h-dvh bg-cyber-bg text-cyber-text font-mono flex flex-col relative">
      <CyberEffects />
      <header className="border-b border-cyber-border/60 px-4 py-3 flex items-center justify-between shrink-0 relative z-10 backdrop-blur-sm bg-cyber-bg/80 animate-fade-in-down">
        <h1 className="text-neon-cyan text-lg font-bold tracking-wider neon-text-cyan">
          SBTI LAB
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="px-2 py-1 text-xs border border-cyber-border rounded text-cyber-muted
                       hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-[0_0_8px_rgba(0,240,255,0.15)]
                       transition-all duration-300 cursor-pointer"
          >
            {locale === 'zh' ? 'EN' : '中'}
          </button>
          <span className="text-cyber-muted/40 text-xs">v0.1.0</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto relative z-10">
        {children}
      </main>
      <footer className="border-t border-cyber-border/40 px-4 py-2 text-center text-cyber-muted/50 text-xs shrink-0 relative z-10 backdrop-blur-sm bg-cyber-bg/80">
        {t('app.footer')}
      </footer>
    </div>
  )
}
