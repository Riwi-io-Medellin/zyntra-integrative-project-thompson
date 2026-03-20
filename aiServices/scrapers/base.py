
from abc import ABC, abstractmethod
from utils.models import Product


class BaseScraper(ABC):
    STORE_NAME: str = ""
    REQUIRES_JS: bool = False

    @abstractmethod
    async def search(self, query: str, max_results: int = 10) -> list[Product]:
        ...

    def _tag(self, msg: str) -> str:
        return f"[{self.STORE_NAME}] {msg}"