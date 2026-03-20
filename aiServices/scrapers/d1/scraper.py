import logging
import re
from urllib.parse import quote_plus
from bs4 import BeautifulSoup
from scrapers.base import BaseScraper
from utils.http_client import DynamicClient
from utils.models import Product
from utils.parsers import clean_price, clean_text, extract_sku_from_url

logger = logging.getLogger(__name__)
BASE_URL = "https://domicilios.tiendasd1.com"

class D1Scraper(BaseScraper):
    STORE_NAME = "d1"
    REQUIRES_JS = True

    async def search(self, query: str, max_results: int = 10) -> list[Product]:
        async with DynamicClient() as browser:
            try:
                page = await browser._context.new_page()
                await page.goto(BASE_URL, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(2000)

                # Buscar en el input de búsqueda
                search_input = await page.query_selector("input[type='search'], input[placeholder*='busca'], input[placeholder*='Busca'], .ant-select-selection-search-input")
                if search_input:
                    await search_input.click()
                    await search_input.fill(query)
                    await page.keyboard.press("Enter")
                else:
                    # Navegar directo a la URL de búsqueda
                    await page.goto(f"{BASE_URL}/search?query={quote_plus(query)}", wait_until="domcontentloaded", timeout=30000)

                await page.wait_for_timeout(4000)
                try:
                    await page.wait_for_selector(".card-product-vertical", timeout=10000)
                except:
                    pass
                await page.evaluate("window.scrollBy(0, 800)")
                await page.wait_for_timeout(2000)
                html = await page.content()
                await page.close()
            except Exception as exc:
                logger.error(self._tag(f"Error: {exc}"))
                return []

        soup = BeautifulSoup(html, "lxml")
        tiles = soup.select(".card-product-vertical")[:max_results]
        logger.info(self._tag(f"Tiles encontrados: {len(tiles)}"))

        products = []
        for tile in tiles:
            try:
                name_el  = tile.select_one("[class*='name'], [class*='title'], h3, h2, p")
                price_el = tile.select_one("[class*='price'], [class*='Price']")
                link_el  = tile.select_one("a[href]")
                img_el   = tile.select_one("img")
                name  = clean_text(name_el.get_text()) if name_el else ""
                price = clean_price(price_el.get_text()) if price_el else 0.0
                link  = link_el["href"] if link_el else ""
                if link and not link.startswith("http"):
                    link = BASE_URL + link
                image = img_el.get("src", img_el.get("data-src", "")) if img_el else ""
                if not name:
                    continue
                products.append(Product(
                    store=self.STORE_NAME, name=name, price=price,
                    url=link, image_url=image,
                    sku=extract_sku_from_url(link),
                ))
            except Exception as exc:
                logger.warning(self._tag(f"Error tile: {exc}"))

        # Filtro palabra exacta
        query_words = [w.lower() for w in query.split() if len(w) >= 3]
        if query_words:
            filtered = []
            for p in products:
                name_words = re.split(r"[\s\-\/\(\)\,\.]+", p.name.lower())
                if any(w in name_words for w in query_words):
                    filtered.append(p)
            products = filtered

        logger.info(self._tag(f"{len(products)} productos para '{query}'"))
        return products