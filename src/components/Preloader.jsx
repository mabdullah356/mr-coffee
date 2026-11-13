import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { preloadImages, whiskBowl } from '../assets/index.js'
import useImagePreload from '../hooks/useImagePreload.js'

export default function Preloader({ onReveal, onComplete, reducedMotion = false }) {
  const rootRef = useRef(null)
  const markRef = useRef(null)
  const countRef = useRef(null)
  const digitsRef = useRef(null)
  const [visible, setVisible] = useState(true)
  const shown = useRef(0)
  const leaving = useRef(false)
  const started = useRef(0)
  const revealRef = useRef(onReveal)
  const completeRef = useRef(onComplete)
  const { progress, done } = useImagePreload(preloadImages)
  const progressRef = useRef(progress)
  const doneRef = useRef(done)
  const minimum = reducedMotion ? 500 : 1700

  useEffect(() => { revealRef.current = onReveal }, [onReveal])
  useEffect(() => { completeRef.current = onComplete }, [onComplete])
  useEffect(() => { progressRef.current = progress }, [progress])
  useEffect(() => { doneRef.current = done }, [done])

  useEffect(() => {
    started.current = performance.now()
  }, [])

  useEffect(() => {
    if (!markRef.current) return undefined
    const tween = gsap.to(markRef.current, {
      rotate: 6,
      y: -3,
      duration: 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
    return () => tween.kill()
  }, [])

  useEffect(() => {
    let frame = 0
    const finish = () => {
      if (leaving.current) return
      leaving.current = true
      if (digitsRef.current) digitsRef.current.textContent = '100'
      revealRef.current?.()
      const timeline = gsap.timeline({
        onComplete: () => {
          setVisible(false)
          completeRef.current?.()
          document.documentElement.classList.remove('is-loading')
        },
      })
      if (reducedMotion) {
        timeline.to(rootRef.current, { opacity: 0, duration: 0.35, ease: 'power1.out' })
      } else {
        timeline
          .to(markRef.current, { scale: 0.82, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0)
          .to(countRef.current, { scale: 0.94, duration: 0.9, ease: 'power2.inOut' }, 0)
          .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 0.05)
      }
    }

    const tick = () => {
      const elapsed = performance.now() - started.current
      let goal = doneRef.current ? 100 : Math.min(96, progressRef.current * 100)
      if (elapsed < minimum) goal = Math.min(goal, 94)
      const step = doneRef.current ? 0.18 : 0.1
      shown.current += (goal - shown.current) * step
      if (goal - shown.current < 0.15) shown.current = goal
      const value = Math.min(100, Math.round(shown.current))
      if (digitsRef.current && digitsRef.current.textContent !== String(value)) {
        digitsRef.current.textContent = String(value)
        rootRef.current?.setAttribute('aria-valuenow', String(value))
      }
      if (doneRef.current && shown.current >= 99.4 && elapsed >= minimum) finish()
      if (!leaving.current) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [minimum, reducedMotion])

  if (!visible) return null

  return (
    <div
      className="preloader"
      ref={rootRef}
      role="progressbar"
      aria-label="Loading page assets"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="0"
    >
      <div className="preloader-mark" aria-hidden="true">
        <img src={whiskBowl} alt="" ref={markRef} width="72" height="72" />
        <i className="preloader-dot" />
      </div>
      <div className="preloader-count" ref={countRef} aria-hidden="true">
        <span ref={digitsRef}>0</span><b>%</b>
      </div>
    </div>
  )
}
