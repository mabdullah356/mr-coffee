import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader.jsx'
import Nav from './components/Nav.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import Hero from './components/Hero.jsx'
import Intro from './components/Intro.jsx'
import ProductStack from './components/ProductStack.jsx'
import Footer from './components/Footer.jsx'
import useSmoothScroll from './hooks/useSmoothScroll.js'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const lenisRef = useSmoothScroll(!reducedMotion)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('is-loading')
    return () => document.documentElement.classList.remove('is-loading')
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    document.documentElement.classList.remove('is-loading')
    lenisRef.current?.start()
    let frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts?.ready?.then(() => {
      ScrollTrigger.refresh()
    })
    return () => cancelAnimationFrame(frame)
  }, [ready, lenisRef])

  return (
    <>
      <Preloader onComplete={() => setReady(true)} reducedMotion={reducedMotion} />
      <Nav ready={ready} reducedMotion={reducedMotion} />
      <CustomCursor enabled={!reducedMotion} />
      <main className={ready ? 'page-ready' : ''}>
        <Hero ready={ready} reducedMotion={reducedMotion} />
        <Intro reducedMotion={reducedMotion} />
        <ProductStack reducedMotion={reducedMotion} />
        <Footer reducedMotion={reducedMotion} />
      </main>
    </>
  )
}
