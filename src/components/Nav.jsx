export default function Nav() {
  return (
    <header className="site-nav">
      <a className="brand-symbol" href="#home" aria-label="Greenleaf home">g</a>
      <nav className="nav-links" aria-label="Main navigation">
        <a className="active" href="#home">Home</a><a href="#drinks">Drinks</a><a href="#about">About</a><a href="#contact">Contact</a>
      </nav>
      <a className="nav-cta" href="#drinks">Get a Drink <span>↗</span></a>
    </header>
  )
}
