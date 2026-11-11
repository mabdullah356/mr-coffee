import { BRAND_NAME } from '../config.js'

export default function Footer() {
  return <footer className="footer" id="contact"><div className="footer-top"><div><p className="footer-kicker">A BETTER DAILY RITUAL</p><h2>Get your matcha<br />from {BRAND_NAME}.</h2><a className="footer-email" href="mailto:hello@greenleaf.matcha">hello@greenleaf.matcha ↗</a></div><div className="footer-links"><div><b>Explore</b><a href="#about">Our story</a><a href="#drinks">The menu</a><a href="#contact">Find us</a></div><div><b>Say hello</b><a href="#contact">Instagram ↗</a><a href="mailto:hello@greenleaf.matcha">Email us ↗</a><a href="#home">Back to top ↑</a></div></div></div><div className="footer-bottom"><span>GOOD TEA. GOOD COMPANY.</span><div className="footer-word">{BRAND_NAME}<i /></div><small>© 2026 {BRAND_NAME} MATCHA CO.</small></div></footer>
}
