import { drinkHazelnut, drinkStrawberry, strawberryWhole, strawberryCluster, arrowWhite, arrowDark, arrowBerry } from '../assets/index.js'

export default function ProductCard({ product, index }) {
  const berry = product.tone === 'berry'
  const image = berry ? drinkStrawberry : drinkHazelnut
  const arrow = berry ? arrowBerry : arrowDark
  return (
    <article className={`product-card product-${product.tone}`} data-card={index}>
      <div className="product-art">
        <div className="product-photo-wrap">
          <img
            className="product-photo"
            src={image}
            alt={berry ? 'Photograph of an iced strawberry matcha latte' : 'Photograph of an iced matcha latte'}
            width="1000"
            height="1500"
            decoding="async"
          />
        </div>
        {berry && (
          <>
            <span className="fruit-anchor fruit-one">
              <img className="art-fruit" src={strawberryWhole} alt="" width="700" height="700" decoding="async" />
            </span>
            <span className="fruit-anchor fruit-two">
              <img className="art-fruit" src={strawberryCluster} alt="" width="700" height="700" decoding="async" />
            </span>
          </>
        )}
      </div>
      <div className="product-copy">
        <p className="product-index">0{index + 1} / Signature sips</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>{product.detail}</p>
        <div className="product-actions">
          <a className="pill-button pill-ghost" href="#contact">
            <span>See More</span>
            <img className="icon-arrow" src={arrow} alt="" width="12" height="12" />
          </a>
          <div className="solid-row">
            <a className="pill-button pill-solid" href="#contact">
              <span>Get a Drink</span>
              <img className="icon-arrow" src={arrowWhite} alt="" width="12" height="12" />
            </a>
            <a className="circle-arrow" href="#contact" aria-label={`Get ${product.name}`}>
              <img src={arrowWhite} alt="" width="16" height="16" />
            </a>
          </div>
        </div>
        <span className="product-note">Crafted for your everyday</span>
      </div>
    </article>
  )
}
