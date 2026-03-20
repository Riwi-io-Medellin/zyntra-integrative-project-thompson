import './Stores.css';
import { StoresHero, initStoresHero } from '../../components/Stores/StoresHero.js';
import { SearchTabs, initSearchTabs } from '../../components/Stores/SearchTabs.js';
import { TextSearch, initTextSearch } from '../../components/Stores/TextSearch.js';
import { VoiceSearch, initVoiceSearch } from '../../components/Stores/VoiceSearch.js';
import { PhotoSearch, initPhotoSearch } from '../../components/Stores/PhotoSearch.js';
import { ProductCard } from '../../components/ProductCard/ProductCard.js';


export function Stores() {
    return `
    ${StoresHero()}
    
    <div class="search-container" data-component="search-container">
        <div class="search-box-wrapper" data-component="search-box-wrapper">
            ${SearchTabs()}
            
            ${TextSearch()}
            ${VoiceSearch()}
            ${PhotoSearch()}
        </div>
    </div>
    
    <!-- Store grid/main-content here -->
    <div id="search-results" class="search-results"></div>
    `;
}

// Orchestrator for search
const ejecutarBusqueda = async (termino, container) => {
    if (!termino.trim()) return;
    const mainInput = container.querySelector('#main-input');
    if (mainInput) mainInput.value = termino;
    console.log(`🚀 ZYNTRA buscando: "${termino}"`);

    try {
        const response = await fetch('http://localhost:3000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // For auth cookies
            body: JSON.stringify({ query: termino })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let resultsData;
        try {
          resultsData = await response.json();
        } catch (jsonErr) {
          console.error('JSON parse error:', jsonErr);
          throw new Error('Invalid response format');
        }
        const results = resultsData;
        console.log('🔍 Search results:', results);

        // Display results (add/update UI)
        const searchContainer = container.querySelector('.search-container');
        if (!searchContainer) {
          console.error('No .search-container found');
          throw new Error('Search UI not initialized');
        }
        
        let resultsContainer = container.querySelector('#search-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'search-results';
            resultsContainer.className = 'search-results';
            searchContainer.appendChild(resultsContainer);
        }
        
        // Structured AI response rendering (safe)
        const summary = results?.analysis?.summary || 'Buscando las mejores ofertas...';
        const total = results?.total || 0;
        const products = results?.products || [];
        const errorsObj = results?.errors || {}; 

        // Generate product cards
        const productsHtml = products.map(product => ProductCard({
          store: product.store || product.source || 'N/A',
          name: product.name || product.title || product.product_name || 'Producto',
          price: product.price,
          url: product.url || product.link || product.product_url,
          image: product.image || product.image_url,
          description: product.description || product.details
        })).join('');

        // Generate errors list
        const errorsHtml = Object.entries(errorsObj).filter(([_, error]) => error).map(([store, error]) => 
          `<div class="store-error">
            <strong>${store}:</strong> ${error}
          </div>`
        ).join('');

        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
          <section class="ai-results">
            <div class="results-header">
              <h2>🔍 ${total} resultado${total !== 1 ? 's' : ''} para "${results.query || termino}"</h2>
              <div class="summary">
                ${summary}
              </div>
            </div>

            <div class="products-section">
              <h3>Mejores opciones:</h3>
              <div class="products-grid">
                ${productsHtml || ''}
              </div>
            </div>

            ${errorsHtml ? `
              <div class="errors-section">
                <h4>⚠️ Tiendas sin stock:</h4>
                ${errorsHtml}
              </div>
            ` : ''}
          </section>
        `;
    } catch (error) {
        console.error('❌ Search error:', error);
        // Optional: Show user-friendly error
        alert('Error en la búsqueda. Verifica que el backend esté corriendo.');
    }
};

// Unified init - delegates to components
export function initStores() {
    const container = document.getElementById('app');
    if (!container) return;

    // Insert component CSS if needed (assuming global or imported)
    
    // Init each component, passing container and shared onSearch
    initStoresHero(container);
    initSearchTabs(container);
    initTextSearch(container, (term) => ejecutarBusqueda(term, container));
    initVoiceSearch(container, (term) => ejecutarBusqueda(term, container));
    initPhotoSearch(container, (term) => ejecutarBusqueda(term, container));

    // Global clear handler (affects photo/text)
    const globalClear = () => {
        const mainInput = container.querySelector('#main-input');
        const fileInput = container.querySelector('#file-upload');
        const uploadUi = container.querySelector('#upload-ui');
        const resultUi = container.querySelector('#result-ui');
        if (mainInput) mainInput.value = "";
        if (fileInput) fileInput.value = "";
        if (uploadUi) uploadUi.style.display = 'block';
        if (resultUi) resultUi.style.display = 'none';
    };

    // Re-attach clears if needed
    const clearBtn = container.querySelector('#clear-btn');
    const clearPhoto = container.querySelector('#clear-photo');
    if (clearBtn) clearBtn.onclick = globalClear;
    if (clearPhoto) clearPhoto.onclick = globalClear;
}


