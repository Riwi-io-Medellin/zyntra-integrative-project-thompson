import logging
import re
from urllib.parse import quote_plus
from scrapers.base import BaseScraper
from utils.http_client import StaticClient
from utils.models import Product
from utils.parsers import clean_text

logger = logging.getLogger(__name__)
BASE_URL = "https://www.velez.com.co"
SEARCH_API = f"{BASE_URL}/api/catalog_system/pub/products/search"

class VelezScraper(BaseScraper):
    STORE_NAME = "velez"
    REQUIRES_JS = False

    async def search(self, query: str, max_results: int = 10) -> list[Product]:
        params = f"ft={quote_plus(query)}&_from=0&_to={max_results - 1}&O=OrderByScoreDESC"
        async with StaticClient() as client:
            try:
                resp = await client.get(f"{SEARCH_API}?{params}")
                data = resp.json()
            except Exception as exc:
                logger.error(self._tag(f"Error: {exc}"))
                return []

        products = []
        for item in data[:max_results]:
            try:
                sku = item.get("items", [{}])[0]
                offer = sku.get("sellers", [{}])[0].get("commertialOffer", {})
                price = float(offer.get("Price", 0))
                name = clean_text(item.get("productName", ""))
                if not name:
                    continue
                images = sku.get("images", [{}])
                products.append(Product(
                    store=self.STORE_NAME, name=name, price=price,
                    original_price=float(offer.get("ListPrice", 0)) or None,
                    url=BASE_URL + "/" + item.get("linkText", ""),
                    image_url=images[0].get("imageUrl", "") if images else "",
                    sku=item.get("productId", ""),
                    brand=clean_text(item.get("brand", "")),
                    in_stock=offer.get("AvailableQuantity", 0) > 0
                ))
            except Exception as exc:
                logger.warning(self._tag(f"Error: {exc}"))

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