import './VoiceSearch.css'
import { getSpeechRecognition } from './SearchUtils.js';

export function VoiceSearch() {
    return `
    <div id="voice" class="search-mode voice-search-bar" role="search" style="display:none;" aria-label="Búsqueda por voz">
        <button class="btn-icon-back" id="btn-back-search" title="Volver al texto" aria-label="Volver a búsqueda de texto">
            <i class="fas fa-keyboard"></i>
        </button>
        
        <div class="voice-input-mimic">
            <div class="voice-indicator">
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
            </div>
            <span id="voice-status">Toca el micro para hablar...</span>
        </div>

        <div class="voice-controls-compact">
            <button class="btn-voice-round test-support" id="btn-test-support" title="Probar soporte voz" aria-label="Probar reconocimiento de voz">
                <i class="fas fa-flask"></i>
            </button>
            <button class="btn-voice-round start" id="btn-start-listening" title="Empezar a hablar" aria-label="Iniciar grabación de voz">
                <i class="fas fa-microphone"></i>
            </button>
            <button class="btn-voice-round stop" id="btn-stop-search" disabled title="Enviar búsqueda" aria-label="Enviar búsqueda por voz">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>
    `;
}

export function initVoiceSearch(container, onSearch, onBack) {
    const recognition = getSpeechRecognition();
    let isListening = false; // Declaración de variable de estado
    let finalTranscript = "";

    if (!recognition) {
        const statusText = container.querySelector('#voice-status');
        if (statusText) {
            statusText.innerText = ' Voz NO soportada (Chrome/Edge + HTTPS). Usa texto.';
            statusText.style.color = '#cc0000';
        }
        console.error(' SpeechRecognition NO disponible.');
        return;
    }

    // Referencias al DOM
    const statusText = container.querySelector('#voice-status');
    const btnStart = container.querySelector('#btn-start-listening');
    const btnStop = container.querySelector('#btn-stop-search');
    const btnBack = container.querySelector('#btn-back-search');
    const btnTest = container.querySelector('#btn-test-support'); // Corregido el ID
    const waves = container.querySelectorAll('.wave');

    if (!statusText || !btnStart || !btnStop || !btnBack || !btnTest) {
        console.error(' Elementos de VoiceSearch no encontrados en el contenedor');
        return;
    }

    console.log(' VoiceSearch init OK');

    // Configuración del Reconocimiento
    recognition.lang = 'es-CO';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        waves.forEach(w => w.classList.add('active'));
        btnStart.classList.add('recording');
        btnStart.disabled = true;
        btnStop.disabled = false;
        statusText.innerText = "Escuchando...";
        statusText.style.color = "#cc0000";
    };

    recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        const displayText = finalTranscript + interimTranscript;
        statusText.innerText = displayText || 'Escuchando...';
        statusText.style.color = "#333";
    };

    recognition.onerror = (event) => {
        console.error(' Voice ERROR:', event.error);
        waves.forEach(w => w.classList.remove('active'));
        btnStart.classList.remove('recording');
        btnStart.disabled = false;
        btnStop.disabled = true;
        isListening = false;
        
        const errorMessages = {
            'no-speech': ' No se detectó voz. Habla más fuerte.',
            'audio-capture': ' Error micrófono. Verifica conexión.',
            'not-allowed': ' Permiso denegado. Permite el micrófono.',
            'network': ' Error de red.',
            'aborted': 'Reconocimiento abortado.',
            '': ' Error desconocido'
        };
        statusText.innerText = errorMessages[event.error] || `Error: ${event.error}`;
        statusText.style.color = '#cc0000';
    };

    recognition.onend = () => {
    waves.forEach(w => w.classList.remove('active'));
    btnStart.classList.remove('recording');
    btnStart.disabled = false;
    btnStop.disabled = true;

    if (isListening && finalTranscript) {
        setTimeout(() => {
            if (isListening) recognition.start();
        }, 800);
    } else {
        // Si se detuvo por error o silencio, resetear estado
        isListening = false; 
        if (!finalTranscript) {
            statusText.innerText = 'No te escuché, toca el micro para reintentar';
            statusText.style.color = '#ff8800';
        }
    }
};

    // Eventos de los botones
    btnTest.onclick = () => {
        console.log(' Test support clicked');
        statusText.innerText = ' Voz soportada. Pulsa el micrófono para iniciar.';
        statusText.style.color = '#28a745';
    };

    btnStart.onclick = () => {
        if (isListening) return;
        isListening = true;
        finalTranscript = "";
        recognition.start();
    };

    btnStop.onclick = () => {
        isListening = false;
        recognition.stop();
        const query = finalTranscript.trim();
        if (onSearch && query.length > 2) {
            onSearch(query);
        } else {
            statusText.innerText = 'Texto muy corto, intenta de nuevo.';
            statusText.style.color = '#cc0000';
        }
    };

    btnBack.onclick = () => {
        isListening = false;
        recognition.stop();
        if (onBack) onBack();
    };
}