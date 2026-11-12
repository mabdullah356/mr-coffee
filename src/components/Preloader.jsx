import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { preloadImages, whiskBowl } from '../assets/index.js'
import useImagePreload from '../hooks/useImagePreload.js'

export default function Preloader({ onComplete, reducedMotion = false }) {
  const rootRef = useRef(null)
  const markRef = useRef(null)
  const countRef = useRef(null)
  const [visible, setVisible] = useState(true)
  const [display, setDisplay] = useState(0)
  const shown = useRef(0)
  const leaving = useRef(false)
  const started = useRef(0)
  const { progress, done } = useImagePreload(preloadImages)
  const minimum = reducedMotion ? 650 : 2800

  useEffect(() => { started.current = performance.now() }, [])

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const elapsed = performance.now() - started.current
      let goal = done ? 100 : Math.min(96, progress * 100)
      if (elapsed < minimum) goal = Math.min(goal, 94)
      const step = done ? 0.18 : 0.1
      shown.current += (goal - shown.current) * step
      if (goal - shown.current < 0.15) shown.current = goal
      setDisplay(shown.current)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [done, progress, minimum])

  useGSAP(() => {
    if (!markRef.current) return
    gsap.to(markRef.current, {
      rotate: 6,
      y: -3,
      duration: 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }, { scope: rootRef })

  useEffect(() => {
    const elapsed = performance.now() - started.current
    if (!done || display < 99.4 || elapsed < minimum || leaving.current) return
    leaving.current = true
    setDisplay(100)
    const timeline = gsap.timeline({
      onComplete: () => {
        setVisible(false)
        onComplete?.()
        document.documentElement.classList.remove('is-loading')
      },
    })
    if (reducedMotion) {
      timeline.to(rootRef.current, { opacity: 0, duration: 0.35, ease: 'power1.out' })
    } else {
      timeline
        .to(markRef.current, { scale: 0.85, opacity: 0, duration: 0.45, ease: 'power2.in' })
        .to(countRef.current, { filter: 'blur(8px)', opacity: 0.75, duration: 0.5, ease: 'power2.in' }, 0)
        .to(rootRef.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, 0.08)
    }
  }, [display, done, minimum, onComplete, reducedMotion])

  if (!visible) return null
  const value = Math.min(100, Math.round(display))

  return (
    <div className="preloader" ref={rootRef} role="progressbar" aria-label="Loading page assets" aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}>
      <div className="preloader-mark" aria-hidden="true">
        <img src={whiskBowl} alt="" ref={markRef} width="72" height="72" />
        <i className="preloader-dot" />
      </div>
      <div className="preloader-count" ref={countRef}>
        <span>{value}</span><b>%</b>
      </div>
    </div>
  )
}
