import { getQueryFromImage } from './SearchUtils.js';

export function PhotoSearch(onSearch) {
    return `
    <div id="photo" class="search-mode" style="display:none;" data-component="photo-search">
        <div class="photo-box">
            <div id="upload-ui">
                <label for="file-upload" class="upload-label">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>Sube foto del producto</span>
                </label>
                <input id="file-upload" type="file" accept="image/*" hidden />
            </div>

            <div id="result-ui" style="display:none; flex-direction:column; align-items:center;">
                <img id="photo-preview" style="max-width: 150px; border-radius: 10px; margin-bottom: 10px;"/>
                <p class="success-text">¡IMAGEN PROCESADA!</p>
                <button class="btn-clear-photo" id="clear-photo">Cambiar imagen</button>
            </div>
        </div>
    </div>
    `;
}

export function initPhotoSearch(container, onSearch) {
    const fileInput = container.querySelector('#file-upload');
    const uploadUi = container.querySelector('#upload-ui');
    const resultUi = container.querySelector('#result-ui');
    const mainInput = container.querySelector('#main-input');
    
    if (fileInput) {
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file || !uploadUi || !resultUi || !mainInput) return;

            uploadUi.style.display = 'none';
            resultUi.style.display = 'flex';
            const preview = container.querySelector('#photo-preview');
            if (preview) preview.src = URL.createObjectURL(file);

            mainInput.placeholder = "Analizando imagen... 🔍";
            const textoImagen = await getQueryFromImage(file);
            const cleanedText = textoImagen.replace(/[^a-zA-Z0-9 ]/g, "");
            if (cleanedText) onSearch(cleanedText);
            mainInput.placeholder = "¿Qué producto buscas?";
        };
    }
}

