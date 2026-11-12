import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WaveTransition from './WaveTransition.jsx'
import { heroSky, heroCups, heroHill } from '../assets/index.js'

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ ready, reducedMotion }) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const heroRef = useRef(null)
  const skyRef = useRef(null)
  const wordWrapRef = useRef(null)
  const wordRef = useRef(null)
  const cupsLayerRef = useRef(null)
  const cupsRef = useRef(null)
  const cupsInnerRef = useRef(null)
  const cupsImgRef = useRef(null)
  const hillRef = useRef(null)
  const waveRef = useRef(null)

  useGSAP(() => {
    if (!ready || reducedMotion) return
    const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } })
    timeline
      .to(skyRef.current, { scale: 1, duration: 2 }, 0)
      .to(wordRef.current, { scale: 1, opacity: 1, duration: 1.5 }, 0.08)
      .to(cupsInnerRef.current, { scale: 1, y: 0, opacity: 1, duration: 1.6 }, 0.16)
      .to(hillRef.current, { y: 0, opacity: 1, duration: 1 }, 0.65)
      .to('.scroll-cue', { y: 0, opacity: 1, duration: 0.75 }, 0.92)
      .to('.hero-stamp', { y: 0, opacity: 1, duration: 0.75 }, 1.02)
  }, { scope: rootRef, dependencies: [ready, reducedMotion] })

  useGSAP(() => {
    if (!ready || reducedMotion) return
    gsap.to(cupsImgRef.current, {
      y: 8,
      rotate: 1.2,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.7,
    })
  }, { scope: rootRef, dependencies: [ready, reducedMotion] })

  useGSAP(() => {
    if (reducedMotion) return
    gsap.to('.wave-track', { xPercent: -100 / 3, duration: 8, ease: 'none', repeat: -1 })
  }, { scope: rootRef, dependencies: [reducedMotion] })

  useGSAP(() => {
    if (reducedMotion) return
    const mm = gsap.matchMedia()
    const build = (end) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end,
          scrub: 1,
          pin: heroRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      timeline
        .to(waveRef.current, { yPercent: -8, ease: 'none' }, 0)
        .to(skyRef.current, { scale: 1.1, ease: 'none' }, 0)
        .to(wordWrapRef.current, { yPercent: -20, ease: 'none' }, 0)
        .to(cupsLayerRef.current, { yPercent: -12, ease: 'none' }, 0)
    }
    mm.add('(min-width: 1024px)', () => build('+=180%'))
    mm.add('(max-width: 1023px)', () => build('+=125%'))
    return () => mm.revert()
  }, { scope: rootRef, dependencies: [reducedMotion] })

  useGSAP(() => {
    if (reducedMotion) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const cupsX = gsap.quickTo(cupsRef.current, 'x', { duration: 0.6, ease: 'power3.out' })
    const cupsY = gsap.quickTo(cupsRef.current, 'y', { duration: 0.6, ease: 'power3.out' })
    const wordX = gsap.quickTo(wordWrapRef.current, 'x', { duration: 0.7, ease: 'power3.out' })
    const move = (event) => {
      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5
      cupsX(nx * 28)
      cupsY(ny * 16)
      wordX(nx * -16)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, { scope: rootRef, dependencies: [reducedMotion] })

  return (
    <div className="hero-stage" id="home" ref={stageRef}>
      <section className="hero" ref={heroRef}>
        <img className="hero-sky" src={heroSky} alt="" ref={skyRef} width="2560" height="1440" fetchPriority="high" />
        <div className="hero-shade" aria-hidden="true" />
        <p className="hero-eyebrow">A little ritual, a lot of green</p>

        <div className="hero-word-wrap" ref={wordWrapRef}>
          <h1 className="hero-word" ref={wordRef}><span>Mat</span><em>cha</em></h1>
        </div>

        <div className="hero-cups-layer" ref={cupsLayerRef}>
          <div className="hero-cups" ref={cupsRef}>
            <div className="hero-cups-inner" ref={cupsInnerRef}>
              <img className="hero-cups-img" ref={cupsImgRef} src={heroCups} alt="Two hands clinking iced matcha lattes" width="1800" height="1227" />
            </div>
          </div>
        </div>

        <div className="hero-hill" ref={hillRef} aria-hidden="true">
          <img src={heroHill} alt="" width="2560" height="700" />
        </div>

        <WaveTransition ref={waveRef} />

        <a href="#about" className="scroll-cue">
          <span className="mouse-shape" aria-hidden="true" />
          <span>Scroll For<br />Experience</span>
        </a>

        <span className="hero-stamp" aria-hidden="true">GOOD<br />MOOD<br /><b>↑</b></span>
      </section>
    </div>
  )
}
