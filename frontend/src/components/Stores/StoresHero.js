export function StoresHero() {
    return `
    <div class="hero-stores" data-component="stores-hero">
        <div class="header-text">
            <span class="badge">ZYNTRA INTELLIGENCE</span>
            <h1 class="hero-title" id="main-title">
                Busca por <span class="green-text">Tienda</span>
            </h1>

            <div class="mode-switcher">
                <button class="mode-btn active" id="mode-store">
                    <i class="fas fa-store"></i> Por Tienda
                </button>
                <button class="mode-btn" id="mode-product">
                    <i class="fas fa-box-open"></i> Por Producto
                </button>
            </div>

            <p id="mode-desc">Selecciona un producto en especifico para ver sus precios actuales en Medellín.</p>
        </div>
    </div>
    `;
}

export function initStoresHero(container) {
    const toggleMode = (isProduct) => {
        const title = container.querySelector('#main-title');
        const desc = container.querySelector('#mode-desc');
        const mainInput = container.querySelector('#main-input');
        
        title.innerHTML = isProduct ? 'Busca por <span class="green-text">Producto</span>' : 'Busca por <span class="green-text">Tienda</span>';
        desc.innerText = isProduct ? 'Comparamos precios en todos los supermercados.' : 'Selecciona un comercio para ver sus precios actuales.';
        if (mainInput) mainInput.placeholder = isProduct ? 'Busca en TODAS las tiendas...' : '¿Qué buscas en esta tienda?';
        
        const productBtn = container.querySelector('#mode-product');
        const storeBtn = container.querySelector('#mode-store');
        if (productBtn) productBtn.classList.toggle('active', isProduct);
        if (storeBtn) storeBtn.classList.toggle('active', !isProduct);
    };

    const storeBtn = container.querySelector('#mode-store');
    const productBtn = container.querySelector('#mode-product');
    if (storeBtn) storeBtn.onclick = () => toggleMode(false);
    if (productBtn) productBtn.onclick = () => toggleMode(true);
}

