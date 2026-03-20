import './StoreCard.css'

export function StoreCard({ imgSrc, name, desc }) {
  return `
    <div class="store-card">
      <div class="icon-circle">
        <img src="${imgSrc}" alt="${name}">
      </div>
      <h3>${name}</h3>
      <p>${desc}</p>
      <button class="btn-select">Explorar</button>
    </div>
  `;
}

