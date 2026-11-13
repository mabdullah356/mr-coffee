import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { introLines } from '../config.js'
import { stickerLabel, stickerCat, stickerBow, stickerGummy, stickerMatcha } from '../assets/index.js'

gsap.registerPlugin(ScrollTrigger)

const stickerMap = {
  label: { src: stickerLabel, alt: 'Matcha Girlie label sticker', w: 600, h: 300 },
  cat: { src: stickerCat, alt: 'Grey cat sticker', w: 400, h: 400 },
  bow: { src: stickerBow, alt: 'Gingham bow sticker', w: 400, h: 400 },
  gummy: { src: stickerGummy, alt: 'Gummy bear sticker', w: 400, h: 400 },
  matcha: { src: stickerMatcha, alt: 'Matcha badge sticker', w: 400, h: 400 },
}

export default function Intro({ reducedMotion }) {
  const rootRef = useRef(null)
  const copyRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) return undefined
    const copy = copyRef.current
    if (!copy) return undefined
    const words = copy.querySelectorAll('.word')
    const tween = gsap.fromTo(words,
      { yPercent: 115 },
      {
        yPercent: 0,
        ease: 'none',
        stagger: 0.03,
        scrollTrigger: {
          trigger: copy,
          start: 'top 80%',
          end: 'top 34%',
          scrub: 1,
        },
      },
    )
    const quote = gsap.fromTo('.intro-quote',
      { yPercent: 14 },
      {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      quote.scrollTrigger?.kill()
      quote.kill()
    }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return undefined
    const root = rootRef.current
    if (!root) return undefined
    const stickers = [...root.querySelectorAll('.intro-sticker')]
    const anchors = [...root.querySelectorAll('.sticker-anchor')]
    if (!stickers.length) return undefined

    gsap.set(stickers, { scale: 0, opacity: 0, rotate: () => gsap.utils.random(-25, 25) })

    const floats = []
    const popTrigger = ScrollTrigger.create({
      trigger: root,
      start: 'top 66%',
      once: true,
      onEnter: () => {
        gsap.to(stickers, {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          ease: 'back.out(2)',
          stagger: 0.11,
          overwrite: true,
          onComplete: () => {
            stickers.forEach((sticker, index) => {
              floats.push(gsap.to(sticker, {
                y: gsap.utils.random(4, 7),
                rotate: gsap.utils.random(-5, 5),
                duration: gsap.utils.random(3, 5),
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 0.08,
              }))
            })
          },
        })
      },
    })

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return () => {
        popTrigger.kill()
        floats.forEach((float) => float.kill())
      }
    }

    const movers = anchors.map((anchor) => ({
      el: anchor,
      x: gsap.quickTo(anchor, 'x', { duration: 0.6, ease: 'power3.out' }),
      y: gsap.quickTo(anchor, 'y', { duration: 0.6, ease: 'power3.out' }),
    }))
    let rects = []
    let measuredScroll = -1
    const measure = () => {
      rects = movers.map(({ el }) => el.getBoundingClientRect())
      measuredScroll = window.scrollY
    }
    measure()
    ScrollTrigger.addEventListener('refresh', measure)
    window.addEventListener('resize', measure)

    let frame = 0
    let pointerX = 0
    let pointerY = 0
    const apply = () => {
      frame = 0
      if (measuredScroll !== window.scrollY) measure()
      movers.forEach(({ x, y }, index) => {
        const rect = rects[index]
        if (!rect) return
        const dx = rect.left + rect.width / 2 - pointerX
        const dy = rect.top + rect.height / 2 - pointerY
        const distance = Math.hypot(dx, dy)
        const power = Math.max(0, 1 - distance / 230)
        x(dx * power * 0.16)
        y(dy * power * 0.16)
      })
    }
    const move = (event) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!frame) frame = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', move, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('resize', measure)
      ScrollTrigger.removeEventListener('refresh', measure)
      popTrigger.kill()
      floats.forEach((float) => float.kill())
      gsap.killTweensOf(stickers)
    }
  }, [reducedMotion])

  return (
    <section className="intro" id="about" ref={rootRef}>
      <p className="intro-kicker">Rooted in the everyday</p>
      <div className="intro-copy" ref={copyRef}>
        {introLines.map((line, lineIndex) => (
          <p className="intro-line" key={lineIndex}>
            {line.map((token, tokenIndex) => {
              if (typeof token === 'string') {
                return (
                  <span className="word-mask" key={`${token}-${tokenIndex}`}>
                    <span className="word">{token}</span>
                  </span>
                )
              }
              const sticker = stickerMap[token.sticker]
              return (
                <span className={`word-mask ${token.sticker === 'label' || token.sticker === 'bow' || token.sticker === 'gummy' ? 'is-inline' : ''}`} key={`${token.sticker}-${tokenIndex}`}>
                  <span className="word">
                    <img
                      className={`intro-sticker intro-sticker-${token.sticker}`}
                      src={sticker.src}
                      alt={sticker.alt}
                      width={sticker.w}
                      height={sticker.h}
                      decoding="async"
                    />
                  </span>
                </span>
              )
            })}
          </p>
        ))}

        <span className="sticker-anchor anchor-cat">
          <img className="intro-sticker" src={stickerCat} alt="" width="400" height="400" decoding="async" />
        </span>
        <span className="sticker-anchor anchor-matcha">
          <img className="intro-sticker" src={stickerMatcha} alt="" width="400" height="400" decoding="async" />
        </span>
      </div>
      <div className="intro-quote" aria-hidden="true">“</div>
    </section>
  )
}
