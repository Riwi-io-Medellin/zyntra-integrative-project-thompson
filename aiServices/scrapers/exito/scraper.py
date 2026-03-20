"""
Scraper para Éxito (exito.com).
"""
import logging
import re
from urllib.parse import urlencode

from scrapers.base import BaseScraper
from utils.http_client import StaticClient
from utils.models import Product
from utils.parsers import clean_text

logger = logging.getLogger(__name__)

BASE_URL = "https://www.exito.com"
SEARCH_API = f"{BASE_URL}/api/catalog_system/pub/products/search"


class ExitoScraper(BaseScraper):
    STORE_NAME = "exito"
    REQUIRES_JS = False

    async def search(self, query: str, max_results: int = 10) -> list[Product]:
        params = urlencode({
            "ft": query,
            "_from": 0,
            "_to": max_results - 1,
            "O": "OrderByScoreDESC",
        })
        url = f"{SEARCH_API}?{params}"

        async with StaticClient() as client:
            try:
                resp = await client.get(url)
                data = resp.json()
            except Exception as exc:
                logger.error(self._tag(f"Error al consultar API: {exc}"))
                return []

        products: list[Product] = []
        for item in data[:max_results]:
            try:
                sku_data = item.get("items", [{}])[0]
                sellers  = sku_data.get("sellers", [{}])[0]
                offer    = sellers.get("commertialOffer", {})

                price          = float(offer.get("Price", 0))
                original_price = float(offer.get("ListPrice", 0))
                in_stock       = offer.get("AvailableQuantity", 0) > 0

                images    = sku_data.get("images", [{}])
                image_url = images[0].get("imageUrl", "") if images else ""

                link = item.get("link", "")
                if not link.startswith("http"):
                    link = BASE_URL + link

                name = clean_text(item.get("productName", ""))
                if not name:
                    continue

                products.append(Product(
                    store          = self.STORE_NAME,
                    name           = name,
                    price          = price,
                    original_price = original_price if original_price != price else None,
                    url            = link,
                    image_url      = image_url,
                    sku            = item.get("productId", ""),
                    brand          = clean_text(item.get("brand", "")),
                    category       = clean_text(
                        item.get("categories", [""])[0].split("/")[-2]
                        if item.get("categories") else ""
                    ),
                    in_stock = in_stock,
                    rating   = item.get("reviewRating"),
                ))
            except Exception as exc:
                logger.warning(self._tag(f"Error parseando producto: {exc}"))
                continue

        # Filtrar por palabra exacta — evita que "pan" matchee "Pantene"

        # Filtro estricto palabra exacta
        query_words = [w.lower() for w in query.split() if len(w) >= 3]
        if query_words:
            filtered = []
            for p in products:
                name_words = re.split(r"[\s\-\/\(\)\,\.]+", p.name.lower())
                if any(w in name_words for w in query_words):
                    filtered.append(p)
            products = filtered
        return products