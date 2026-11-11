import Nav from './Nav.jsx'

function Cup({ berry = false }) {
  return <div className={`drink-cup ${berry ? 'berry-cup' : ''}`} aria-label={berry ? 'Strawberry matcha drink' : 'Hazelnut matcha drink'}><span className="cup-ice ice-one" /><span className="cup-ice ice-two" /><span className="cup-foam" /><span className="cup-layer cup-matcha" /><span className="cup-layer cup-milk" /><span className="cup-layer cup-fruit" /></div>
}

export default function Hero() {
  return <section className="hero" id="home"><div className="sky-grain" /><Nav /><p className="hero-eyebrow">A little ritual, a lot of green</p><h1 className="hero-word"><span>Mat</span><em>cha</em></h1><div className="hero-cups"><Cup /><Cup berry /></div><div className="hero-hill"><span>✳</span><span>✳</span><span>✳</span></div><a href="#about" className="scroll-cue"><span className="mouse-shape" />SCROLL FOR<br />EXPERIENCE</a><span className="hero-stamp">GOOD<br />MOOD<br /><b>↑</b></span></section>
}
