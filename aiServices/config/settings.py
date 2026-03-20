"""
Configuración global del scraper.
Las claves sensibles se leen de variables de entorno (.env).
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ── OpenAI ────────────────────────────────────────────────────────────────────
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL:   str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# ── Comportamiento de scraping ─────────────────────────────────────────────────
REQUEST_DELAY_MIN: float = float(os.getenv("REQUEST_DELAY_MIN", "1.5"))
REQUEST_DELAY_MAX: float = float(os.getenv("REQUEST_DELAY_MAX", "4.0"))
MAX_RETRIES:       int   = int(os.getenv("MAX_RETRIES", "3"))
TIMEOUT:           int   = int(os.getenv("TIMEOUT", "20"))

# ── URLs base de cada tienda ───────────────────────────────────────────────────
STORES = {
    "exito":   "https://www.exito.com",
    "alkosto": "https://www.alkosto.com",
    "ktronix": "https://www.ktronix.com",
    "d1":      "https://domicilios.tiendasd1.com",
}

# ── User-Agents rotativos (anti-bot básico) ────────────────────────────────────
USER_AGENTS: list[str] = [
    (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
        "(KHTML, like Gecko) Version/17.4 Safari/605.1.15"
    ),
    "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
]
