import logging, re
from scrapers.base import BaseScraper
from utils.http_client import DynamicClient
from utils.models import Product
from utils.parsers import clean_text
logger = logging.getLogger(__name__)
BASE_URL = "https://www.gef.com.co"
class GefScraper(BaseScraper):
    STORE_NAME = "gef"
    REQUIRES_JS = True
    async def search(self, query: str, max_results: int = 10) -> list[Product]:
        url = f"{BASE_URL}/search?q={query}"
        async with DynamicClient() as browser:
            try:
                page = await browser._context.new_page()
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(3000)
                html = await page.content()
                await page.close()
            except Exception as exc:
                logger.error(self._tag(f"Error: {exc}")); return []
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "lxml")
        products = []
        for card in soup.select("[class*='product'], [class*='item']")[:max_results]:
            try:
                name_el  = card.select_one("[class*='name'], [class*='title'], h2, h3")
                price_el = card.select_one("[class*='price']")
                link_el  = card.select_one("a[href]")
                img_el   = card.select_one("img")
                name = clean_text(name_el.get_text()) if name_el else ""
                if not name or len(name) < 3: continue
                price_text = price_el.get_text() if price_el else "0"
                price = float(re.sub(r"[^\d]", "", price_text) or 0)
                link  = link_el["href"] if link_el else ""
                if link and not link.startswith("http"): link = BASE_URL + link
                image = img_el.get("src", img_el.get("data-src", "")) if img_el else ""
                products.append(Product(store=self.STORE_NAME, name=name, price=price, url=link, image_url=image))
            except Exception as exc:
                logger.warning(self._tag(f"Error: {exc}"))
        return products
