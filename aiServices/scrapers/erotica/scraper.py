import logging
from scrapers.base import BaseScraper
from utils.models import Product
logger = logging.getLogger(__name__)
class EroticaScraper(BaseScraper):
    STORE_NAME = "erotica"
    async def search(self, query: str, max_results: int = 10) -> list[Product]:
        logger.info(f"Scraper Erotica pendiente")
        return []
