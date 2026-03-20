// StoreSearch Component - Includes filter logic
export function StoreSearch() {
  return `
    <div class="hero-stores">
      <div class="header-text">
        <div class="search-container">
          <h1 id="main-title">Busca tu <span class="green-text">tienda preferida</span></h1>

          <div class="search-box-wrapper">
            <div id="text" class="search-mode active" style="display:flex;">
              <input type="text" id="main-input" placeholder="¿Qué buscas en esta tienda?">
              <button class="btn-go" id="btn-search">Buscar</button>
              <button class="btn-clear" id="btn-clear" style="margin-left: 10px;">Limpiar</button>
            </div>      
          </div>
        </div>
      </div>
    </div>
  `;
}

// Filter logic (called after grid rendered)
export function initStoreSearchEvents() {
  const normalizarTexto = (texto) => {
    return texto ? texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
  };

  document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-search' || e.target.closest('#btn-search')) {
      console.log("¡Clic en Buscar detectado!");
      const inputBusqueda = document.getElementById('main-input');
      const todasLasCards = document.querySelectorAll('.store-card');
      const terminoUsuario = normalizarTexto(inputBusqueda.value);

      if (terminoUsuario === "") {
        todasLasCards.forEach(card => card.style.display = "block");
        return;
      }

      todasLasCards.forEach(card => {
        const h3 = card.querySelector('h3');
        if (h3) {
          const nombreTienda = normalizarTexto(h3.textContent);
          card.style.display = nombreTienda.includes(terminoUsuario) ? "block" : "none";
        }
      });
    }

    if (e.target.id === 'btn-clear' || e.target.closest('#btn-clear')) {
      console.log("¡Clic en Limpiar detectado!");
      const inputBusqueda = document.getElementById('main-input');
      const todasLasCards = document.querySelectorAll('.store-card');
      
      if(inputBusqueda) inputBusqueda.value = "";
      todasLasCards.forEach(card => card.style.display = "block");
    }
  });
}

