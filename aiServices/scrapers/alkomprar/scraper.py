import logging
from scrapers.base import BaseScraper
from utils.models import Product
logger = logging.getLogger(__name__)
class AlkomprarScraper(BaseScraper):
    STORE_NAME = "alkomprar"
    async def search(self, query: str, max_results: int = 10) -> list[Product]:
        logger.info(f"Scraper Alkomprar pendiente")
        return []
