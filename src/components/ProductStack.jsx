import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products } from '../config.js'
import ProductCard from './ProductCard.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function ProductStack({ reducedMotion }) {
  const rootRef = useRef(null)
  const pinRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) return undefined
    const root = rootRef.current
    if (!root) return undefined
    const cards = [...root.querySelectorAll('.product-card')]
    if (!cards.length) return undefined

    const floats = [
      gsap.to(root.querySelectorAll('.product-photo-wrap'), {
        y: 7,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.4,
      }),
      gsap.to(root.querySelectorAll('.fruit-anchor'), {
        y: 6,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.35,
        delay: 1.4,
      }),
    ]

    const headingTween = gsap.fromTo(root.querySelector('.section-heading'),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: root.querySelector('.section-heading'), start: 'top 88%', once: true },
      },
    )

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      if (!pinRef.current) return
      gsap.set(cards[1], { yPercent: 112 })
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: '+=260%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 2,
          invalidateOnRefresh: true,
        },
      })
      timeline
        .to(cards[1], { yPercent: 0, duration: 1, ease: 'power2.out' }, 0)
        .to(cards[0], { scale: 0.94, yPercent: -2, opacity: 0.55, duration: 1, ease: 'none' }, 0)
        .fromTo('.product-hazel .product-photo-wrap', { yPercent: 2 }, { yPercent: -2, duration: 1, ease: 'none' }, 0)
        .fromTo('.product-berry .fruit-anchor',
          { scale: 0, rotate: (i) => (i === 0 ? 25 : -25), opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 0.42, ease: 'back.out(2.2)', stagger: 0.12 }, 0.34)
        .fromTo('.product-berry .product-photo-wrap', { yPercent: 2 }, { yPercent: -2, duration: 0.6, ease: 'none' }, 0.3)
        .fromTo('.product-berry .product-copy > *',
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05 }, 0.52)
      return () => timeline.kill()
    })

    mm.add('(max-width: 1023px)', () => {
      cards.forEach((card) => {
        gsap.from(card, {
          y: 64,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        })
      })
      gsap.from('.product-berry .fruit-anchor', {
        scale: 0.5,
        rotate: -18,
        opacity: 0,
        duration: 0.9,
        ease: 'back.out(1.7)',
        stagger: 0.12,
        scrollTrigger: { trigger: '.product-stack', start: 'top 82%', once: true },
      })
    })

    return () => {
      mm.revert()
      floats.forEach((float) => float.kill())
      headingTween.scrollTrigger?.kill()
      headingTween.kill()
    }
  }, [reducedMotion])

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
      <p className="product-footnote">Good things, grown slowly <span aria-hidden="true">✦</span></p>
    </section>
  )
}
