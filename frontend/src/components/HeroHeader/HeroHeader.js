export function HeroHeader() {
  return `
    <header class="hero-wrapper">
      <div class="hero-main">
        <div class="hero-left">
          <span class="badge">AHORRO INTELIGENTE</span>
          <h1>El mejor buscador <br> de productos.</h1>
          <p>Comparamos precios en Medellín con tecnología Scrapy para que siempre ahorres dinero.</p>
          
          <div class="hero-btns">
            <button class="btn-solid" id="redirect-store">By Store</button>
            <button class="btn-outline" id="redirect-product">By Product</button>
          </div>
        </div>

        <div class="hero-right">
          <div class="carousel-wrapper">
            <div class="carousel">
              <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500" alt="Frutas">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" alt="Tecnología">
              <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500" alt="Ropa">
              <img src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500" alt="Tablet">
              <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500" alt="Hogar">
            </div>
          </div>
        </div>
      </div>

      <div class="social-bar">
        <a href="https://www.facebook.com/profile.php?id=61588096483967&locale=es_LA" target="_blank">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com/zyntrariwi/" target="_blank">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="https://x.com/ZyntraRiwi" target="_blank">
          <i class="fa-brands fa-x-twitter"></i>
        </a>
        <a href="https://www.youtube.com/channel/UCki3jZZ4tXnGtPNpFvcEBkQ" target="_blank">
          <i class="fab fa-youtube"></i>
        </a>
      </div>
    </header>
  `;
}

