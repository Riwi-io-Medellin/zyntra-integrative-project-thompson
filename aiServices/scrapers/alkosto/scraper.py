import logging
from urllib.parse import urlencode
from bs4 import BeautifulSoup
from scrapers.base import BaseScraper
from utils.http_client import DynamicClient
from utils.models import Product
from utils.parsers import clean_price, clean_text, extract_sku_from_url

logger = logging.getLogger(__name__)
BASE_URL = "https://www.alkosto.com"

class AlkostoScraper(BaseScraper):
    STORE_NAME = "alkosto"
    REQUIRES_JS = True

    async def search(self, query: str, max_results: int = 10) -> list[Product]:
        params = urlencode({"q": query, "start": 0, "sz": max_results})
        url = f"{BASE_URL}/search?{params}"

        async with DynamicClient() as browser:
            try:
                html = await browser.get_page(url, wait_selector=".k-product-contenedor")
            except Exception as exc:
                logger.error(self._tag(f"Error: {exc}"))
                return []

        soup = BeautifulSoup(html, "lxml")
        tiles = soup.select(".k-product-contenedor")[:max_results]

        products = []
        for tile in tiles:
            try:
                name_el  = tile.select_one(".product-info--name, [class*='product-info--name']")
                price_el = tile.select_one(".product-info--price-new, [class*='price-new']")
                old_el   = tile.select_one(".product-info--wrapperPrice-old, [class*='price-old']")
                link_el  = tile.select_one("a[href]")
                img_el   = tile.select_one("img")

                name  = clean_text(name_el.get_text()) if name_el else ""
                price = clean_price(price_el.get_text()) if price_el else 0.0
                orig  = clean_price(old_el.get_text()) if old_el else None
                link  = link_el["href"] if link_el else ""
                if link and not link.startswith("http"):
                    link = BASE_URL + link
                image = img_el.get("src", img_el.get("data-src", "")) if img_el else ""

                if not name:
                    continue

                products.append(Product(
                    store=self.STORE_NAME, name=name, price=price,
                    original_price=orig, url=link, image_url=image,
                    sku=extract_sku_from_url(link),
                ))
            except Exception as exc:
                logger.warning(self._tag(f"Error tile: {exc}"))
        return products