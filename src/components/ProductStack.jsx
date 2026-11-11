import { products } from '../config.js'
import hazelnutDrink from '../assets/images/products/drink-hazelnut.png'
import strawberryDrink from '../assets/images/products/drink-strawberry.png'
import leafBranch from '../assets/images/leaves/leaf-branch.png'

function Cup({ berry }) {
  return <img className={`product-cup-img ${berry ? 'product-cup-berry' : ''}`} src={berry ? strawberryDrink : hazelnutDrink} alt={berry ? 'Strawberry matcha with milk and fruit' : 'Iced hazelnut matcha with oat milk'} />
}

function ProductCard({ product, index }) {
  const berry = product.tone === 'berry'
  return <article className={`product-card ${product.tone} ${berry ? 'reverse' : ''}`}><div className="product-art"><img className="art-leaf leaf-one" src={leafBranch} alt="" /><img className="art-leaf leaf-two" src={leafBranch} alt="" /><Cup berry={berry} /></div><div className="product-copy"><p className="product-index">0{index + 1} / SIGNATURE SIPS</p><h3>{product.name}</h3><p>{product.description}</p><p>{product.detail}</p><div className="product-actions"><a className="more-button" href="#contact">See More <span>↗</span></a><a className="drink-button" href="#contact">Get a Drink <span>↗</span></a></div><span className="product-note">CRAFTED FOR YOUR EVERYDAY</span></div></article>
}

export default function ProductStack() {
  return <section className="products" id="drinks"><div className="section-heading"><p>THE HOUSE FAVOURITES</p><h2>Find your <em>green</em>.</h2></div><div className="product-grid">{products.map((product, index) => <ProductCard key={product.name} product={product} index={index} />)}</div><div className="product-footnote">GOOD THINGS, GROWN SLOWLY <span>✳</span></div></section>
}
