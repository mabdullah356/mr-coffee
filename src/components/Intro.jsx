import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
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

  useGSAP(() => {
    if (reducedMotion) return
    gsap.fromTo('.intro-copy .word',
      { yPercent: 115 },
      {
        yPercent: 0,
        ease: 'none',
        stagger: 0.03,
        scrollTrigger: {
          trigger: copyRef.current,
          start: 'top 78%',
          end: 'top 32%',
          scrub: 1,
        },
      },
    )
  }, { scope: rootRef, dependencies: [reducedMotion] })

  useGSAP(() => {
    if (reducedMotion) return
    const stickers = gsap.utils.toArray('.intro-sticker', rootRef.current)
    gsap.set(stickers, { scale: 0, opacity: 0, rotate: () => gsap.utils.random(-25, 25) })
    const anchors = gsap.utils.toArray('.sticker-anchor', rootRef.current)
    const movers = anchors.map((anchor) => ({
      el: anchor,
      x: gsap.quickTo(anchor, 'x', { duration: 0.6, ease: 'power3.out' }),
      y: gsap.quickTo(anchor, 'y', { duration: 0.6, ease: 'power3.out' }),
    }))

    ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top 62%',
      once: true,
      onEnter: () => {
        gsap.to(stickers, {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          ease: 'back.out(2)',
          stagger: 0.12,
          onComplete: () => {
            stickers.forEach((sticker, index) => {
              gsap.to(sticker, {
                y: gsap.utils.random(4, 7),
                rotate: gsap.utils.random(-5, 5),
                duration: gsap.utils.random(3, 5),
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 0.08,
              })
            })
          },
        })
      },
    })

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (event) => {
      movers.forEach(({ el, x, y }) => {
        const rect = el.getBoundingClientRect()
        const dx = rect.left + rect.width / 2 - event.clientX
        const dy = rect.top + rect.height / 2 - event.clientY
        const distance = Math.hypot(dx, dy)
        const power = Math.max(0, 1 - distance / 230)
        x(dx * power * 0.16)
        y(dy * power * 0.16)
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, { scope: rootRef, dependencies: [reducedMotion] })

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
                    />
                  </span>
                </span>
              )
            })}
          </p>
        ))}

        <span className="sticker-anchor anchor-cat">
          <img className="intro-sticker" src={stickerCat} alt="" width="400" height="400" />
        </span>
        <span className="sticker-anchor anchor-matcha">
          <img className="intro-sticker" src={stickerMatcha} alt="" width="400" height="400" />
        </span>
      </div>
      <div className="intro-quote" aria-hidden="true">“</div>
    </section>
  )
}
