import Nav from './Nav.jsx'
import hazelnutDrink from '../assets/images/products/drink-hazelnut.png'
import strawberryDrink from '../assets/images/products/drink-strawberry.png'

export default function Hero() {
  return <div className="hero-stage" id="home"><section className="hero"><div className="sky-grain" /><Nav /><p className="hero-eyebrow">A little ritual, a lot of green</p><h1 className="hero-word"><span>Mat</span><em>cha</em></h1><div className="hero-cups"><div className="hero-cups-inner"><img className="hero-drink hazel-drink" src={hazelnutDrink} alt="Iced hazelnut matcha" /><img className="hero-drink berry-drink" src={strawberryDrink} alt="Iced strawberry matcha" /></div></div><div className="hero-hill"><span>✳</span><span>✳</span><span>✳</span></div><a href="#about" className="scroll-cue"><span className="mouse-shape" />SCROLL FOR<br />EXPERIENCE</a><span className="hero-stamp">GOOD<br />MOOD<br /><b>↑</b></span><div className="wave-cover" aria-hidden="true" /></section></div>
}
