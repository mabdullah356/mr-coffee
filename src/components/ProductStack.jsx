import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products } from '../config.js'
import ProductCard from './ProductCard.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function ProductStack({ reducedMotion }) {
  const rootRef = useRef(null)
  const pinRef = useRef(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray('.product-card', rootRef.current)
    if (!cards.length) return

    if (!reducedMotion) {
      gsap.to('.product-cup-img', { y: 7, rotate: 1.4, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4 })
      gsap.to('.berry .art-fruit', { y: 6, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.35, delay: 1.4 })
    }

    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.set(cards[1], { yPercent: 110 })
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      timeline
        .to(cards[1], { yPercent: 0, duration: 1, ease: 'none' }, 0)
        .to(cards[0], { scale: 0.94, opacity: 0.6, duration: 1, ease: 'none' }, 0)
        .fromTo('.hazel .art-leaf',
          { scale: 0.6, rotate: -12, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 0.78, duration: 0.4, ease: 'power3.out', stagger: 0.15 }, 0.04)
        .to('.hazel .art-leaf', { opacity: 0, duration: 0.22, ease: 'none' }, 0.6)
        .fromTo('.berry .art-fruit',
          { scale: 0, rotate: (i) => (i === 0 ? 25 : -25), opacity: 0 },
          { scale: 1, rotate: (i) => (i === 0 ? 10 : -12), opacity: 1, duration: 0.42, ease: 'back.out(2.2)', stagger: 0.12 }, 0.3)
      return () => gsap.set(cards[1], { clearProps: 'transform' })
    })

    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      cards.forEach((card) => {
        gsap.from(card, {
          y: 64,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: { trigger: card, start: 'top 86%', once: true },
        })
      })
      gsap.from('.hazel .art-leaf, .berry .art-fruit', {
        scale: 0.5,
        rotate: -18,
        opacity: 0,
        duration: 0.9,
        ease: 'back.out(1.7)',
        stagger: 0.12,
        scrollTrigger: { trigger: '.product-stack', start: 'top 78%', once: true },
      })
    })

    return () => mm.revert()
  }, { scope: rootRef, dependencies: [reducedMotion] })

  return (
    <section className="products" id="drinks" ref={rootRef}>
      <div className="section-heading">
        <p>The house favourites</p>
        <h2>Find your <em>green</em>.</h2>
      </div>
      <div className="product-pin" ref={pinRef}>
        <div className="product-stack">
          {products.map((product, index) => (
            <ProductCard key={product.name} product={product} index={index} />
          ))}
        </div>
      </div>
      <p className="product-footnote">Good things, grown slowly <span aria-hidden="true">✳</span></p>
    </section>
  )
}
