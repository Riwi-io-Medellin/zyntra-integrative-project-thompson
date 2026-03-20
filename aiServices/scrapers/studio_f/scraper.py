import logging
from scrapers.base import BaseScraper
from utils.models import Product
logger = logging.getLogger(__name__)
class StudioFScraper(BaseScraper):
    STORE_NAME = "studio_f"
    async def search(self, query: str, max_results: int = 10) -> list[Product]:
        logger.info(f"Scraper StudioF pendiente")
        return []
