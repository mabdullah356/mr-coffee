import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { brandMark, arrowDark } from '../assets/index.js'

const sectionOrder = ['home', 'about', 'drinks', 'contact']

export default function Nav({ ready, reducedMotion }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const header = rootRef.current
    if (!header) return undefined
    const links = [...header.querySelectorAll('.nav-links a')]
    let frame = 0
    let solid = null
    let active = null

    const update = () => {
      frame = 0
      const nextSolid = window.scrollY > window.innerHeight * 0.6
      if (nextSolid !== solid) {
        solid = nextSolid
        header.classList.toggle('is-solid', solid)
      }
      const mid = window.innerHeight * 0.5
      let current = 'home'
      sectionOrder.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= mid) current = id
      })
      if (current !== active) {
        active = current
        links.forEach((link) => {
          const on = link.getAttribute('href') === `#${current}`
          link.classList.toggle('active', on)
          if (on) link.setAttribute('aria-current', 'page')
          else link.removeAttribute('aria-current')
        })
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    const children = rootRef.current ? [...rootRef.current.children] : []
    if (!children.length) return undefined
    if (reducedMotion) {
      gsap.set(children, { y: 0, opacity: 1 })
      return undefined
    }
    const tween = gsap.fromTo(children,
      { y: -14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.09, delay: 0.3, overwrite: true },
    )
    return () => tween.kill()
  }, [ready, reducedMotion])

  return (
    <header className="site-nav" ref={rootRef}>
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
        <i aria-hidden="true"><img src={arrowDark} alt="" width="14" height="14" /></i>
      </a>
    </header>
  )
}
