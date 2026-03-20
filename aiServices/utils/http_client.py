"""
Cliente HTTP con rotación de User-Agent, delays aleatorios y reintentos.
Usa playwright-stealth para pasar controles anti-bot en sitios dinámicos.
"""
import asyncio
import random
import logging
from typing import Optional

import httpx
from playwright.async_api import async_playwright, Browser, BrowserContext, Page

from config.settings import (
    USER_AGENTS,
    REQUEST_DELAY_MIN,
    REQUEST_DELAY_MAX,
    MAX_RETRIES,
    TIMEOUT,
)

logger = logging.getLogger(__name__)


# ── Cliente estático (sitios que renderizan HTML desde el servidor) ────────────

class StaticClient:
    """Wrapper de httpx con headers humanizados y reintentos."""

    def __init__(self):
        self._client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        self._client = httpx.AsyncClient(
            timeout=TIMEOUT,
            follow_redirects=True,
            http2=True,
        )
        return self

    async def __aexit__(self, *_):
        if self._client:
            await self._client.aclose()

    def _headers(self) -> dict:
        return {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept-Language": "es-CO,es;q=0.9,en;q=0.8",
            "Accept": (
                "text/html,application/xhtml+xml,application/xml;"
                "q=0.9,image/avif,image/webp,*/*;q=0.8"
            ),
            "DNT": "1",
        }

    async def get(self, url: str, **kwargs) -> httpx.Response:
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                await asyncio.sleep(
                    random.uniform(REQUEST_DELAY_MIN, REQUEST_DELAY_MAX)
                )
                resp = await self._client.get(url, headers=self._headers(), **kwargs)
                resp.raise_for_status()
                return resp
            except httpx.HTTPStatusError as exc:
                logger.warning(
                    "HTTP %s en %s (intento %d/%d)",
                    exc.response.status_code, url, attempt, MAX_RETRIES,
                )
                if attempt == MAX_RETRIES:
                    raise
            except httpx.RequestError as exc:
                logger.warning("Error de red en %s: %s (intento %d/%d)", url, exc, attempt, MAX_RETRIES)
                if attempt == MAX_RETRIES:
                    raise
        raise RuntimeError(f"No se pudo obtener {url}")


# ── Cliente dinámico (sitios con JS pesado / React / Angular) ─────────────────

class DynamicClient:
    """
    Controla un navegador Chromium headless con playwright-stealth
    para parecer un usuario real y evadir detección de bots.
    """

    def __init__(self):
        self._playwright = None
        self._browser: Optional[Browser] = None
        self._context: Optional[BrowserContext] = None

    async def __aenter__(self):
        self._playwright = await async_playwright().start()
        self._browser = await self._playwright.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        )
        self._context = await self._browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            locale="es-CO",
            timezone_id="America/Bogota",
            viewport={"width": 1366, "height": 768},
            extra_http_headers={
                "Accept-Language": "es-CO,es;q=0.9",
            },
        )
        # Inyección básica anti-detección
        await self._context.add_init_script(
            """
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
            window.chrome = { runtime: {} };
            """
        )
        return self

    async def __aexit__(self, *_):
        if self._context:
            await self._context.close()
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()

    async def get_page(self, url: str, wait_selector: Optional[str] = None) -> str:
        """
        Navega a la URL y retorna el HTML final (post-JS).
        wait_selector: selector CSS a esperar antes de retornar.
        """
        page: Page = await self._context.new_page()
        try:
            await asyncio.sleep(random.uniform(REQUEST_DELAY_MIN, REQUEST_DELAY_MAX))
            await page.goto(url, wait_until="domcontentloaded", timeout=TIMEOUT * 1000)
            if wait_selector:
                await page.wait_for_selector(wait_selector, timeout=TIMEOUT * 1000)
            # Scroll suave para imitar usuario
            await page.evaluate("window.scrollBy(0, window.innerHeight * 0.6)")
            await asyncio.sleep(random.uniform(0.5, 1.5))
            return await page.content()
        finally:
            await page.close()
