import { useEffect, useState } from 'react'
import Preloader from './components/Preloader.jsx'
import Hero from './components/Hero.jsx'
import Intro from './components/Intro.jsx'
import ProductStack from './components/ProductStack.jsx'
import Footer from './components/Footer.jsx'
import './App.css'
import './motion.css'
import './stack.css'

function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = document.querySelectorAll('.intro h2, .intro-bottom, .product-card, .footer-word')
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.14 })
    targets.forEach((target) => observer.observe(target))
    let frame = 0
    const stage = document.querySelector('.hero-stage')
    const productCards = [...document.querySelectorAll('.product-card')]
    const updateScrollMotion = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!stage) return
        const distance = Math.max(1, stage.offsetHeight - window.innerHeight)
        const progress = Math.max(0, Math.min(1, (window.scrollY - stage.offsetTop) / distance))
        stage.style.setProperty('--scroll-progress', progress.toFixed(4))
        if (!reducedMotion) {
          stage.style.setProperty('--cover-y', `${100 - progress * 100}%`)
          stage.style.setProperty('--word-y', `${-progress * 20}%`)
          stage.style.setProperty('--cups-y', `${-progress * 12}%`)
          stage.style.setProperty('--sky-scale', `${1 + progress * 0.1}`)
        }
        if (productCards.length > 1 && window.innerWidth > 760 && !reducedMotion) {
          const incoming = productCards[1].getBoundingClientRect().top
          const stackProgress = Math.max(0, Math.min(1, (window.innerHeight * 0.86 - incoming) / (window.innerHeight * 0.72)))
          productCards[0].style.setProperty('--stack-scale', (1 - stackProgress * 0.06).toFixed(4))
          productCards[0].style.setProperty('--stack-opacity', (1 - stackProgress * 0.4).toFixed(4))
        }
      })
    }
    updateScrollMotion()
    window.addEventListener('scroll', updateScrollMotion, { passive: true })
    window.addEventListener('resize', updateScrollMotion)
    const handlePointer = (event) => {
      if (event.pointerType === 'touch' || reducedMotion) return
      const rect = stage?.getBoundingClientRect()
      if (!rect || event.clientY < rect.top || event.clientY > rect.bottom) return
      const x = (event.clientX / window.innerWidth - 0.5) * 28
      const y = (event.clientY / window.innerHeight - 0.5) * 16
      stage.style.setProperty('--mouse-x', `${x.toFixed(1)}px`)
      stage.style.setProperty('--mouse-y', `${y.toFixed(1)}px`)
    }
    const resetPointer = () => { stage?.style.setProperty('--mouse-x', '0px'); stage?.style.setProperty('--mouse-y', '0px') }
    window.addEventListener('pointermove', handlePointer, { passive: true })
    stage?.addEventListener('pointerleave', resetPointer)
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', updateScrollMotion); window.removeEventListener('resize', updateScrollMotion); window.removeEventListener('pointermove', handlePointer); stage?.removeEventListener('pointerleave', resetPointer) }
  }, [])
  return null
}

export default function App() {
  const [ready, setReady] = useState(false)
  return <><Preloader onComplete={() => setReady(true)} /><SmoothScroll /><main className={ready ? 'page-ready' : ''}><Hero /><Intro /><ProductStack /><Footer /></main></>
}
