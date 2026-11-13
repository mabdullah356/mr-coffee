import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WaveTransition from './WaveTransition.jsx'
import { heroPhoto, heroHill, arrowLime } from '../assets/index.js'

gsap.registerPlugin(ScrollTrigger)

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

export default function Hero({ ready, reducedMotion }) {
  const stageRef = useRef(null)
  const heroRef = useRef(null)
  const skyWrapRef = useRef(null)
  const skyRef = useRef(null)
  const wordWrapRef = useRef(null)
  const wordRef = useRef(null)
  const hillRef = useRef(null)
  const waveRef = useRef(null)
  const waveTrackRef = useRef(null)

  useEffect(() => {
    if (!ready) return undefined
    const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } })
    if (reducedMotion) {
      gsap.set([skyRef.current, wordRef.current, hillRef.current], {
        clearProps: 'transform,opacity',
      })
      gsap.set('.hero-eyebrow, .scroll-cue, .hero-stamp', { opacity: 1, y: 0 })
      return undefined
    }
    timeline
      .fromTo(skyRef.current, { scale: 1.25 }, { scale: 1, duration: 2.1 }, 0)
      .fromTo(wordRef.current,
        { scale: 0.12, y: 14, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 1.55, ease: 'expo.out' }, 0.08)
      .fromTo(hillRef.current,
        { yPercent: 35, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, 0.62)
      .fromTo('.hero-eyebrow',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 0.9, duration: 0.8 }, 0.5)
      .fromTo('.scroll-cue',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 }, 0.95)
      .fromTo('.hero-stamp',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 }, 1.05)
    return () => timeline.kill()
  }, [ready, reducedMotion])

  useEffect(() => {
    if (!ready || reducedMotion) return undefined
    const drift = gsap.to(skyRef.current, {
      y: 5,
      duration: 7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.65,
    })
    return () => drift.kill()
  }, [ready, reducedMotion])

  useEffect(() => {
    if (!ready || reducedMotion) return undefined
    const build = (end) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end,
          scrub: 1,
          pin: stageRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 3,
          invalidateOnRefresh: true,
        },
      })
      timeline
        .fromTo(waveRef.current, { yPercent: 100 }, { yPercent: -8, ease: 'none' }, 0)
        .to(waveTrackRef.current, { xPercent: -100 / 3, ease: 'none' }, 0)
        .fromTo(skyWrapRef.current, { scale: 1 }, { scale: 1.12, ease: 'none' }, 0)
        .fromTo(wordWrapRef.current, { yPercent: 0, scale: 1 }, { yPercent: -18, scale: 1.05, ease: 'none' }, 0)
      return () => {
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    }
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => build('+=180%'))
    mm.add('(max-width: 1023px)', () => build('+=130%'))
    return () => mm.revert()
  }, [ready, reducedMotion])

  useEffect(() => {
    if (!ready || reducedMotion || !finePointer()) return undefined
    const photoX = gsap.quickTo(skyWrapRef.current, 'x', { duration: 0.6, ease: 'power3.out' })
    const photoY = gsap.quickTo(skyWrapRef.current, 'y', { duration: 0.6, ease: 'power3.out' })
    const wordX = gsap.quickTo(wordWrapRef.current, 'x', { duration: 0.7, ease: 'power3.out' })
    let frame = 0
    let px = 0
    let py = 0
    const apply = () => {
      frame = 0
      photoX(px * 10)
      photoY(py * 8)
      wordX(px * -16)
    }
    const move = (event) => {
      px = event.clientX / window.innerWidth - 0.5
      py = event.clientY / window.innerHeight - 0.5
      if (!frame) frame = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
    }
  }, [ready, reducedMotion])

  return (
    <div className="hero-stage" id="home" ref={stageRef}>
      <section className="hero" ref={heroRef}>
        <div className="hero-sky-wrap" ref={skyWrapRef} aria-hidden="true">
          <img className="hero-sky" src={heroPhoto} alt="" ref={skyRef} width="1800" height="1200" fetchPriority="high" decoding="async" />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <p className="hero-eyebrow">A little ritual, a lot of green</p>

        <div className="hero-word-wrap" ref={wordWrapRef}>
          <h1 className="hero-word" ref={wordRef}><span>Mat</span><em>cha</em></h1>
        </div>

        <div className="hero-hill" ref={hillRef} aria-hidden="true">
          <img src={heroHill} alt="" width="2560" height="700" decoding="async" />
        </div>

        <WaveTransition ref={waveRef} trackRef={waveTrackRef} />

        <a href="#about" className="scroll-cue">
          <span className="mouse-shape" aria-hidden="true" />
          <span>Scroll For<br />Experience</span>
        </a>

        <span className="hero-stamp" aria-hidden="true">
          GOOD<br />MOOD<br />
          <img className="stamp-arrow" src={arrowLime} alt="" width="18" height="18" />
        </span>
      </section>
    </div>
  )
}
