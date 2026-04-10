import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { IntroPage } from './components/IntroPage'
import { Quiz } from './components/Quiz'
import { ResultPage } from './components/ResultPage'
import { SplashScreen } from './components/SplashScreen'
import { useQuizStore } from './store/quizStore'
import { PageTransition } from './components/PageTransition'
import { decodePKChallenge } from './utils/pk-encoding'

const PKWaiting = lazy(() => import('./components/PKWaiting').then(m => ({ default: m.PKWaiting })))
const PKCompare = lazy(() => import('./components/PKCompare').then(m => ({ default: m.PKCompare })))

function LazyFallback() {
  return <div className="flex items-center justify-center min-h-[50vh] text-cyber-muted">Loading...</div>
}

function PhaseRouter() {
  const phase = useQuizStore((s) => s.phase)
  switch (phase) {
    case 'quiz':
      return (
        <PageTransition>
          <Quiz />
        </PageTransition>
      )
    case 'result':
      return (
        <PageTransition>
          <ResultPage />
        </PageTransition>
      )
    case 'pk-waiting':
      return (
        <Suspense fallback={<LazyFallback />}>
          <PageTransition>
            <PKWaiting />
          </PageTransition>
        </Suspense>
      )
    case 'pk-compare':
      return (
        <Suspense fallback={<LazyFallback />}>
          <PageTransition>
            <PKCompare />
          </PageTransition>
        </Suspense>
      )
    default:
      return (
        <PageTransition>
          <IntroPage />
        </PageTransition>
      )
  }
}

function PKRoute({ encoded }: { encoded: string }) {
  const setPKChallenge = useQuizStore((s) => s.setPKChallenge)
  const setPhase = useQuizStore((s) => s.setPhase)
  const phase = useQuizStore((s) => s.phase)

  useEffect(() => {
    const challenge = decodePKChallenge(encoded)
    if (challenge) {
      setPKChallenge(challenge)
      if (phase !== 'quiz' && phase !== 'result' && phase !== 'pk-compare') {
        setPhase('pk-waiting')
      }
    }
  }, [encoded, setPKChallenge, setPhase, phase])

  return <PhaseRouter />
}

export default function App() {
  return (
    <>
      <SplashScreen />
      <Layout>
        <Routes>
          <Route path="/pk/:encoded" element={<PKRouteWrapper />} />
          <Route path="*" element={<PhaseRouter />} />
        </Routes>
      </Layout>
    </>
  )
}

function PKRouteWrapper() {
  const path = window.location.hash
  const match = path.match(/#\/pk\/(.+)$/)
  const encoded = match?.[1] ?? ''
  return <PKRoute encoded={encoded} />
}
