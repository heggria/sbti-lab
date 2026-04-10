import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { IntroPage } from './components/IntroPage'
import { Quiz } from './components/Quiz'
import { ResultPage } from './components/ResultPage'
import { SplashScreen } from './components/SplashScreen'
import { useQuizStore } from './store/quizStore'
import { PageTransition } from './components/PageTransition'

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
    default:
      return (
        <PageTransition>
          <IntroPage />
        </PageTransition>
      )
  }
}

export default function App() {
  return (
    <>
      <SplashScreen />
      <Layout>
        <Routes>
          <Route path="*" element={<PhaseRouter />} />
        </Routes>
      </Layout>
    </>
  )
}
