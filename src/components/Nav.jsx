import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { brandMark } from '../assets/index.js'

export default function Nav({ ready, reducedMotion }) {
  const rootRef = useRef(null)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setSolid(window.scrollY > window.innerHeight * 0.55))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useGSAP(() => {
    if (!ready || reducedMotion) return
    gsap.to('.site-nav > *', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'expo.out',
      stagger: 0.09,
      delay: 0.35,
    })
  }, { scope: rootRef, dependencies: [ready, reducedMotion] })

  return (
    <header className={`site-nav ${solid ? 'is-solid' : ''}`} ref={rootRef}>
      <a className="brand-symbol" href="#home" aria-label="Greenleaf home">
        <img src={brandMark} alt="" width="34" height="34" />
      </a>
      <nav className="nav-links" aria-label="Main navigation">
        <a className="active" href="#home" aria-current="page">Home</a>
        <a href="#drinks">Drinks</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="nav-cta" href="#drinks">
        <span>Get a Drink</span>
        <i aria-hidden="true">↗</i>
      </a>
    </header>
  )
}
