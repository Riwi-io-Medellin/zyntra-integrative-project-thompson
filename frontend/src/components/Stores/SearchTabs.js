export function SearchTabs() {
    return `
    <div class="search-tabs" data-component="search-tabs">
        <button class="tab-btn active" data-tab="text">
            <i class="fas fa-keyboard"></i> Texto
        </button>
        <button class="tab-btn" data-tab="voice">
            <i class="fas fa-microphone"></i> Voz
        </button>
        <button class="tab-btn" data-tab="photo">
            <i class="fas fa-camera"></i> Foto
        </button>
    </div>
    `;
}

export function initSearchTabs(container) {
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = btn.dataset.tab;
            container.querySelectorAll('.search-mode').forEach(el => el.style.display = 'none');
            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            
            const targetMode = container.querySelector(`#${mode}`);
            if (targetMode) targetMode.style.display = 'flex';
            btn.classList.add('active');
        });
    });
}

