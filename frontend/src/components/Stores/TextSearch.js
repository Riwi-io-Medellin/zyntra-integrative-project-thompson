export function TextSearch(onSearch) {
    return `
    <div id="text" class="search-mode active" style="display:flex;" data-component="text-search">
        <input type="text" id="main-input" placeholder="¿Qué buscas en esta tienda?">
        <div class="actions-group">
            <button class="btn-go">Buscar</button>
            <button id="clear-btn" class="btn-clear" title="Limpiar">
                <i class="fas fa-eraser"></i> Limpiar
            </button>
        </div>
    </div>
    `;
}

export function initTextSearch(container, onSearch) {
    const mainInput = container.querySelector('#main-input');
    const limpiarTodo = () => {
        if (mainInput) mainInput.value = "";
    };

    const clearBtn = container.querySelector('#clear-btn');
    if (clearBtn) clearBtn.onclick = limpiarTodo;
    
    const btnGo = container.querySelector('.btn-go');
    if (btnGo) btnGo.onclick = () => {
      const value = mainInput?.value || '';
      if (value.trim()) onSearch(value);
    };
    mainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') onSearch(mainInput.value);
    });
}

