import { drinkHazelnut, drinkStrawberry, leafA, leafB, leafC, strawberryA, strawberryB } from '../assets/index.js'

export default function ProductCard({ product, index }) {
  const berry = product.tone === 'berry'
  const image = berry ? drinkStrawberry : drinkHazelnut
  return (
    <article className={`product-card product-${product.tone}`} data-card={index}>
      <div className="product-art">
        {!berry && (
          <>
            <img className="art-leaf leaf-one" src={leafA} alt="" width="900" height="1100" />
            <img className="art-leaf leaf-two" src={leafB} alt="" width="900" height="1100" />
            <img className="art-leaf leaf-three" src={leafC} alt="" width="900" height="1100" />
          </>
        )}
        {berry && (
          <>
            <img className="art-fruit fruit-one" src={strawberryA} alt="" width="700" height="700" />
            <img className="art-fruit fruit-two" src={strawberryB} alt="" width="700" height="700" />
          </>
        )}
        <img
          className="product-cup-img"
          src={image}
          alt={berry ? 'Iced strawberry matcha with purée and milk' : 'Iced hazelnut matcha with oat milk'}
          width="960"
          height="1560"
        />
        <span className="art-glow" aria-hidden="true" />
      </div>
      <div className="product-copy">
        <p className="product-index">0{index + 1} / Signature sips</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>{product.detail}</p>
        <div className="product-actions">
          <a className="pill-button pill-ghost" href="#contact">
            <span>See More</span>
            <i aria-hidden="true">↗</i>
          </a>
          <div className="solid-row">
            <a className="pill-button pill-solid" href="#contact">
              <span>Get a Drink</span>
              <i aria-hidden="true">↗</i>
            </a>
            <a className="circle-arrow" href="#contact" aria-label={`Get ${product.name}`}>↗</a>
          </div>
        </div>
        <span className="product-note">Crafted for your everyday</span>
      </div>
    </article>
  )
}
