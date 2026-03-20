import './Home.css';
import { HeroHeader } from '../../components/HeroHeader/HeroHeader.js';
import { StoreSearch } from '../../components/StoreSearch/StoreSearch.js';
import { StoreGrid } from '../../components/StoreGrid/StoreGrid.js';
import { initStoreSearchEvents } from '../../components/StoreSearch/StoreSearch.js';

export function Home() {
  const html = HeroHeader() + `
    <section class="search-upload-section">
      ` + StoreSearch() + `
      ` + StoreGrid() + `
    </section>
  `;


  setTimeout(() => {
    initStoreSearchEvents();
    initHomeEvents();
  }, 0);
  return html;
}

function initHomeEvents() {
  const redirectStore = document.getElementById("redirect-store");
  const redirectProduct = document.getElementById("redirect-product");
  const sectionObject = document.getElementById("store-section");

  if (redirectStore) {
    redirectStore.addEventListener("click", () => {
      sectionObject.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (redirectProduct) {
    redirectProduct.addEventListener("click", () => {
      window.location.href = "/searchProduct";
    });
  }

  // Image upload logic 
  const fileInput = document.getElementById('file-upload');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleProcessImage(e.target.files[0]);
      }
    });
  }
}

function handleProcessImage(file) {
  if (!file) return;

  const uploadUi = document.getElementById('upload-ui');
  const loaderUi = document.getElementById('loader-ui');
  const resultUi = document.getElementById('result-ui');
  const photoPreview = document.getElementById('photo-preview');

  const reader = new FileReader();
  reader.onload = function(e) {
    if (photoPreview) photoPreview.src = e.target.result;
  };
  reader.readAsDataURL(file);

  if (uploadUi) uploadUi.style.display = 'none';
  if (loaderUi) loaderUi.style.display = 'flex';

  const formData = new FormData();
  formData.append('image', file);

  fetch('http://localhost:3000/api/image', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta del backend:', data);
    if (loaderUi) loaderUi.style.display = 'none';
    if (resultUi) resultUi.style.display = 'flex';
  })
  .catch(error => {
    console.error('Error al enviar la imagen:', error);
    if (loaderUi) loaderUi.style.display = 'none';
    if (uploadUi) uploadUi.style.display = 'flex';
    alert('Error al conectar con el servidor. ¿Está corriendo el backend?');
  });
}

