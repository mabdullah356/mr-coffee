import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { cursorMatcha } from '../assets/index.js'

export default function CustomCursor({ enabled }) {
  const rootRef = useRef(null)
  const bubbleRef = useRef(null)
  const [hot, setHot] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return undefined

    document.documentElement.classList.add('has-custom-cursor')
    const root = rootRef.current
    gsap.set(root, { x: window.innerWidth * 0.74, y: window.innerHeight * 0.42, opacity: 1 })
    const xTo = gsap.quickTo(root, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(root, 'y', { duration: 0.5, ease: 'power3.out' })

    const move = (event) => {
      xTo(event.clientX)
      yTo(event.clientY)
    }
    const over = (event) => setHot(Boolean(event.target.closest('a, button, [data-cursor="text"]')))
    const leave = () => gsap.to(root, { opacity: 0, duration: 0.3 })
    const enter = () => gsap.to(root, { opacity: 1, duration: 0.3 })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
      gsap.killTweensOf(root)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || !bubbleRef.current) return
    gsap.to(bubbleRef.current, { scale: hot ? 0.34 : 1, duration: 0.35, ease: 'power3.out' })
  }, [hot, enabled])

  if (!enabled) return null
  return (
    <div className="cursor" ref={rootRef} aria-hidden="true">
      <div className={`cursor-bubble ${hot ? 'is-hot' : ''}`} ref={bubbleRef}>
        <img src={cursorMatcha} alt="" width="56" height="56" />
      </div>
    </div>
  )
}
