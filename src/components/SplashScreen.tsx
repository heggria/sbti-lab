import { useEffect, useState } from 'react'

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 600)
    const timer2 = setTimeout(() => setVisible(false), 1100)
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-cyber-bg transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.3em] text-neon-cyan neon-text-cyan animate-neon-flicker">
          SBTI LAB
        </h1>
        <div className="flex justify-center gap-1">
          <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
