import './productCard.css'

export function ProductCard({ store, name, price, url, image, description }) {
  const safeImage = image || './src/components/img/no-image.png';
  const formattedPrice = price ? `$${parseFloat(price).toLocaleString('es-CO')}` : 'Precio no disponible';
  const productUrl = url || '#';
  
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${safeImage}" alt="${name}" loading="lazy">
      </div>
      <div class="product-info">
        <h4 class="store-badge">${store}</h4>
        <h3 class="product-name">${name}</h3>
        ${description ? `<p class="product-desc">${description}</p>` : ''}
        <div class="product-price">${formattedPrice}</div>
        <a href="${productUrl}" target="_blank" class="btn-buy" rel="noopener noreferrer">
          Ver en ${store}
        </a>
      </div>
    </div>
  `;
}

