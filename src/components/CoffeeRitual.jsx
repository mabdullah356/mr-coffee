import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { coffeePour } from '../assets/index.js'

gsap.registerPlugin(ScrollTrigger)

const brewSteps = [
  { number: '01', title: 'Grind fresh', detail: 'Start with whole beans.' },
  { number: '02', title: 'Pour slowly', detail: 'Give every drop a moment.' },
  { number: '03', title: 'Sip easy', detail: 'Let the morning wait.' },
]

export default function CoffeeRitual({ reducedMotion }) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) return undefined
    const root = rootRef.current
    if (!root) return undefined

    const photo = root.querySelector('.coffee-photo')
    const reveals = root.querySelectorAll('.coffee-reveal')
    const context = gsap.context(() => {
      gsap.fromTo(photo,
        { scale: 1.14, yPercent: 5 },
        {
          scale: 1,
          yPercent: -5,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1 },
        },
      )
      gsap.fromTo(reveals,
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      )
    }, root)

    return () => context.revert()
  }, [reducedMotion])

  return (
    <section className="coffee-ritual" id="coffee" ref={rootRef} aria-labelledby="coffee-title">
      <div className="coffee-ritual-inner">
        <div className="coffee-copy">
          <p className="coffee-kicker coffee-reveal">The coffee ritual</p>
          <h2 className="coffee-title coffee-reveal" id="coffee-title">
            Take it<br /><em>slow.</em>
          </h2>
          <p className="coffee-description coffee-reveal">
            Freshly ground beans, a slow pour, and a quiet minute. Make room for a better kind of morning.
          </p>
          <ol className="coffee-steps" aria-label="Three steps for a slower coffee">
            {brewSteps.map((step) => (
              <li className="coffee-step coffee-reveal" key={step.number}>
                <span>{step.number}</span>
                <strong>{step.title}</strong>
                <small>{step.detail}</small>
              </li>
            ))}
          </ol>
        </div>
        <div className="coffee-visual">
          <figure className="coffee-photo-frame coffee-reveal">
            <img
              className="coffee-photo"
              src={coffeePour}
              alt="A barista pouring steamed milk into a cup of coffee"
              width="1200"
              height="801"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="coffee-photo-caption">
              <span>Slow mornings</span>
              <span aria-hidden="true">/</span>
              <span>Poured by hand</span>
            </figcaption>
          </figure>
          <p className="coffee-visual-note coffee-reveal">A good cup is worth taking your time for.</p>
        </div>
      </div>
    </section>
  )
}
