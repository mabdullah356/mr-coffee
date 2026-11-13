import { useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader.jsx'
import Nav from './components/Nav.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import Hero from './components/Hero.jsx'
import Intro from './components/Intro.jsx'
import ProductStack from './components/ProductStack.jsx'
import CoffeeRitual from './components/CoffeeRitual.jsx'
import Footer from './components/Footer.jsx'
import useSmoothScroll from './hooks/useSmoothScroll.js'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const lenisRef = useSmoothScroll(!reducedMotion)
  const [revealed, setRevealed] = useState(false)
  const [ready, setReady] = useState(false)

  const handleReveal = useCallback(() => setRevealed(true), [])
  const handleReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    document.documentElement.classList.add('is-loading')
    return () => document.documentElement.classList.remove('is-loading')
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    document.documentElement.classList.remove('is-loading')
    window.scrollTo(0, 0)
    lenisRef.current?.start()
    lenisRef.current?.scrollTo(0, { immediate: true })

    let frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    const handleFonts = () => ScrollTrigger.refresh()
    document.fonts?.ready?.then(handleFonts)
    return () => cancelAnimationFrame(frame)
  }, [ready, lenisRef])

  return (
    <>
      <Preloader onReveal={handleReveal} onComplete={handleReady} reducedMotion={reducedMotion} />
      <Nav ready={revealed} reducedMotion={reducedMotion} />
      <CustomCursor enabled={!reducedMotion} />
      <main className={ready ? 'page-ready' : ''}>
        <Hero ready={revealed} reducedMotion={reducedMotion} />
        <Intro reducedMotion={reducedMotion} />
        <ProductStack reducedMotion={reducedMotion} />
        <CoffeeRitual reducedMotion={reducedMotion} />
        <Footer reducedMotion={reducedMotion} />
      </main>
    </>
  )
}
