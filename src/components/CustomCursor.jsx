import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { cursorMatcha } from '../assets/index.js'

export default function CustomCursor({ enabled }) {
  const rootRef = useRef(null)
  const bubbleRef = useRef(null)
  const [finePointer] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ))
  const available = Boolean(enabled) && finePointer

  useEffect(() => {
    if (!available) return undefined
    const root = rootRef.current
    const bubble = bubbleRef.current
    if (!root || !bubble) return undefined

    document.documentElement.classList.add('has-custom-cursor')
    gsap.set(root, { x: window.innerWidth * 0.74, y: window.innerHeight * 0.42, opacity: 1 })
    const xTo = gsap.quickTo(root, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(root, 'y', { duration: 0.45, ease: 'power3.out' })

    let frame = 0
    let targetX = window.innerWidth * 0.74
    let targetY = window.innerHeight * 0.42
    let scale = 1

    const render = () => {
      frame = 0
      xTo(targetX)
      yTo(targetY)
    }
    const move = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!frame) frame = requestAnimationFrame(render)
    }

    const setScale = (next) => {
      if (next === scale) return
      scale = next
      gsap.to(bubble, { scale: next, duration: 0.35, ease: 'power3.out', overwrite: true })
    }
    const over = (event) => {
      setScale(event.target.closest('a, button, [data-cursor="text"]') ? 0.36 : 1)
    }
    const down = () => gsap.to(bubble, { scale: scale * 0.82, duration: 0.2, ease: 'power2.out' })
    const up = () => gsap.to(bubble, { scale, duration: 0.3, ease: 'power3.out' })
    const leave = () => gsap.to(root, { opacity: 0, duration: 0.3, overwrite: true })
    const enter = () => gsap.to(root, { opacity: 1, duration: 0.3, overwrite: true })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
      gsap.killTweensOf([root, bubble])
    }
  }, [available])

  if (!available) return null
  return (
    <div className="cursor" ref={rootRef} aria-hidden="true">
      <div className="cursor-bubble" ref={bubbleRef}>
        <img src={cursorMatcha} alt="" width="56" height="56" />
      </div>
    </div>
  )
}
