// SearchUtils.js
import Tesseract from 'tesseract.js';

// Ahora solo exportamos la configuración básica para que el componente la use
export function getSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn('⚠️ SpeechRecognition NO soportado. Usa Chrome/Edge. HTTPS requerido en prod.');
        return null;
    }
    return new SpeechRecognition();
}

export async function getQueryFromImage(file) {
    try {
        const { data: { text } } = await Tesseract.recognize(file, 'spa');
        return text.trim();
    } catch (err) {
        console.error("Error en OCR:", err);
        return "";
    }
}