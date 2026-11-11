import { useEffect } from 'react'
import Preloader from './components/Preloader.jsx'
import Hero from './components/Hero.jsx'
import Intro from './components/Intro.jsx'
import ProductStack from './components/ProductStack.jsx'
import Footer from './components/Footer.jsx'
import './App.css'
import './motion.css'

function SmoothScroll() {
  useEffect(() => {
    const targets = document.querySelectorAll('.intro h2, .intro-bottom, .product-card, .footer-word')
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.14 })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])
  return null
}

export default function App() {
  return <><Preloader /><SmoothScroll /><main><Hero /><Intro /><ProductStack /><Footer /></main></>
}
