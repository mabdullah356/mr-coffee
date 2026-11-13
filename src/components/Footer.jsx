import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BRAND_NAME, footerLinks } from '../config.js'
import { matchaPowder, iconFacebook, iconInstagram, iconYoutube, iconX } from '../assets/index.js'

gsap.registerPlugin(ScrollTrigger)

const socials = [
  { name: 'Facebook', icon: iconFacebook, href: '#contact' },
  { name: 'Instagram', icon: iconInstagram, href: '#contact' },
  { name: 'YouTube', icon: iconYoutube, href: '#contact' },
  { name: 'X', icon: iconX, href: '#contact' },
]

export default function Footer({ reducedMotion }) {
  const rootRef = useRef(null)
  const letters = [...BRAND_NAME]

  useEffect(() => {
    if (reducedMotion) return undefined
    const root = rootRef.current
    if (!root) return undefined
    const tweens = []

    tweens.push(gsap.fromTo(root.querySelectorAll('.footer-letter'),
      { yPercent: 112 },
      {
        yPercent: 0,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: {
          trigger: root,
          start: 'top 90%',
          end: 'bottom bottom',
          scrub: 1,
        },
      },
    ))
    tweens.push(gsap.fromTo(root.querySelector('.footer-dot'), { scale: 0 }, {
      scale: 1,
      duration: 0.9,
      ease: 'back.out(3)',
      scrollTrigger: { trigger: root, start: 'top 58%', once: true },
    }))
    tweens.push(gsap.fromTo(root.querySelector('.footer-powder'), { yPercent: 6 }, {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
    }))
    tweens.push(gsap.fromTo(root.querySelectorAll('.footer-reveal'),
      { y: 38, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      },
    ))

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill()
        tween.kill()
      })
    }
  }, [reducedMotion])

  return (
    <footer className="footer" id="contact" ref={rootRef}>
      <img className="footer-powder" src={matchaPowder} alt="" width="1500" height="950" decoding="async" />
      <div className="footer-top">
        <div className="footer-lead footer-reveal">
          <p className="footer-kicker">A better daily ritual</p>
          <h2>Get your matcha<br />from {BRAND_NAME}.</h2>
          <p className="footer-contact-line">Email us at: <a href="mailto:abc@gmail.com">abc@gmail.com</a></p>
          <p className="footer-contact-line">Call us at: <a href="tel:9883246349">9883246349</a></p>
        </div>
        <div className="footer-links footer-reveal">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <b>{column.title}</b>
              {column.links.map(([label, href], index) => (
                <a href={href} key={`${label}-${index}`}>{label}</a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-meta footer-reveal">
        <div>
          <b>Location</b>
          <p>2401 Utah Ave S, Seattle, WA 98134</p>
        </div>
        <div className="footer-social">
          <b>Follow us on socials</b>
          <div className="social-row">
            {socials.map((social) => (
              <a className="social-button" href={social.href} key={social.name} aria-label={social.name}>
                <img src={social.icon} alt="" width="20" height="20" decoding="async" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-word-wrap">
        <h2 className="footer-word" aria-label={BRAND_NAME}>
          {letters.map((letter, index) => (
            <span className="footer-letter-mask" key={`${letter}-${index}`} aria-hidden="true">
              <span className="footer-letter">{letter}</span>
            </span>
          ))}
          <span className="footer-dot" aria-hidden="true" />
        </h2>
        <small>© 2026 {BRAND_NAME} Matcha Co.</small>
      </div>
    </footer>
  )
}
