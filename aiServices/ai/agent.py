import asyncio
import json
import logging
from typing import Optional

from openai import AsyncOpenAI

from config.settings import OPENAI_API_KEY, OPENAI_MODEL
from utils.models import SearchResult, Product 

# Scrapers
from scrapers.exito.scraper   import ExitoScraper
from scrapers.alkosto.scraper import AlkostoScraper
from scrapers.ktronix.scraper import KtronixScraper
from scrapers.d1.scraper      import D1Scraper
from scrapers.carulla.scraper     import CarullaScraper
from scrapers.jumbo.scraper       import JumboScraper
from scrapers.ara.scraper         import AraScraper
from scrapers.colsubsidio.scraper import ColsubsidioScraper
from scrapers.falabella.scraper   import FalabellaScraper
from scrapers.alkomprar.scraper   import AlkomprarScraper
from scrapers.samsung.scraper     import SamsungScraper
from scrapers.lenovo.scraper      import LenovoScraper
from scrapers.gef.scraper         import GefScraper
from scrapers.pilatos.scraper     import PilatosScraper
from scrapers.dafiti.scraper      import DafitiScraper
from scrapers.koaj.scraper         import KoajScraper
from scrapers.tennis.scraper      import TennisScraper
from scrapers.studio_f.scraper    import StudioFScraper
from scrapers.velez.scraper       import VelezScraper
from scrapers.bata.scraper        import BataScraper
from scrapers.adidas.scraper      import AdidasScraper
from scrapers.nike.scraper        import NikeScraper
from scrapers.arturo_calle.scraper import ArturoCalleScraper
from scrapers.cruz_verde.scraper  import CruzVerdeScraper
from scrapers.drogas_rebaja.scraper import DrogasRebajaScraper
from scrapers.farmatodo.scraper   import FarmatodoScraper
from scrapers.locatel.scraper     import LocatelScraper
from scrapers.lust.scraper        import LustScraper
from scrapers.lovers.scraper      import LoversScraper
from scrapers.erotica.scraper     import EroticaScraper

logger = logging.getLogger(__name__)

SCRAPERS = {
    "exito": ExitoScraper, "d1": D1Scraper, "carulla": CarullaScraper, "jumbo": JumboScraper,
    "ara": AraScraper, "colsubsidio": ColsubsidioScraper, "alkosto": AlkostoScraper,
    "ktronix": KtronixScraper, "falabella": FalabellaScraper, "alkomprar": AlkomprarScraper,
    "samsung": SamsungScraper, "lenovo": LenovoScraper, "gef": GefScraper, "pilatos": PilatosScraper,
    "dafiti": DafitiScraper, "koaj": KoajScraper, "tennis": TennisScraper, "studio_f": StudioFScraper,
    "velez": VelezScraper, "bata": BataScraper, "adidas": AdidasScraper, "nike": NikeScraper,
    "arturo_calle": ArturoCalleScraper, "cruz_verde": CruzVerdeScraper, "drogas_rebaja": DrogasRebajaScraper,
    "farmatodo": FarmatodoScraper, "locatel": LocatelScraper, "lust": LustScraper,
    "lovers": LoversScraper, "erotica": EroticaScraper,
}

# ── Prompts Comparadores ──────────────────────────────────────────────────────

INTENT_SYSTEM = """
Eres un experto en e-commerce colombiano. Tu misión es limpiar la consulta (voz/texto) para obtener el mejor resultado de búsqueda.

REGLAS:
1. Extrae solo el sustantivo principal (ej: de "búscame unos zapatos de cuero negros" extrae "zapatos").
2. Si detectas una categoría (ropa, tecnologia, etc.), incluye las tiendas que pertenezcan a ella.
3. IMPORTANTE: Si el usuario no menciona una tienda, devuelve una lista amplia de tiendas relevantes para la categoría.
4. Responde SIEMPRE en formato JSON.
"""

SYNTHESIS_SYSTEM = """
Eres un experto comparador de precios. Tu tarea es encontrar el MEJOR PRECIO entre todos los resultados.
1. Analiza los precios y destaca el producto más económico.
2. Si el mismo producto está en varias tiendas, indica cuál tiene la mejor oferta.
3. Responde en español colombiano informal, resaltando el ahorro.
"""

class ShoppingAgent:
    def __init__(self):
        self._openai = AsyncOpenAI(api_key=OPENAI_API_KEY)

    async def search(self, user_query: str, max_results_per_store: int = 10, stores: Optional[list[str]] = None) -> dict:
        # 1. Intención (Procesamiento de Voz)
        intent = await self._extract_intent(user_query)
        search_term = intent.get("search_term", user_query)
        
        # CAMBIO CLAVE: Búsqueda masiva. Si el usuario no especifica, buscamos en TODO.
        target_stores = stores if stores else intent.get("stores", list(SCRAPERS.keys()))

        logger.info(f"BÚSQUEDA COMPARATIVA -> '{search_term}' en {len(target_stores)} tiendas.")

        # 2. Scrapers en paralelo
        tasks = {
            store: SCRAPERS[store]().search(search_term, max_results_per_store)
            for store in target_stores if store in SCRAPERS
        }
        
        if not tasks:
            return {"error": "No hay tiendas disponibles para esta búsqueda."}

        raw_results = await asyncio.gather(*tasks.values(), return_exceptions=True)

        all_products: list[Product] = []
        errors: dict[str, str] = {}

        for store, result in zip(tasks.keys(), raw_results):
            if isinstance(result, Exception):
                errors[store] = str(result)
                logger.error(f"Error en {store}: {result}")
            elif result:
                # DEBUG: Ver cuántos trae cada tienda
                logger.info(f"Tienda {store} encontró {len(result)} productos.")
                all_products.extend(result)

        # 3. Ordenar por precio antes de sintetizar
        all_products.sort(key=lambda x: x.price)

        # 4. Síntesis
        analysis = {}
        if all_products:
            analysis = await self._synthesize(user_query, all_products)
        else:
            analysis = {"summary": "No encontré ese producto en ninguna tienda. Prueba con una palabra más sencilla."}

        return {
            "query": user_query,
            "search_term": search_term,
            "products": [p.to_dict() for p in all_products],
            "total": len(all_products),
            "errors": errors,
            "analysis": analysis,
        }

    async def _extract_intent(self, query: str) -> dict:
        try:
            resp = await self._openai.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": INTENT_SYSTEM},
                    {"role": "user", "content": query},
                ],
                temperature=0,
                response_format={"type": "json_object"}
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as exc:
            logger.error(f"Error de intención: {exc}")
            return {"search_term": query, "stores": list(SCRAPERS.keys())}

    async def _synthesize(self, query: str, products: list[Product]) -> dict:
        # Enviamos los 20 más baratos para que la IA decida
        summary_input = [
            {"store": p.store, "name": p.name[:60], "price": p.price, "url": p.url}
            for p in products[:20]
        ]
        try:
            resp = await self._openai.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": SYNTHESIS_SYSTEM},
                    {"role": "user", "content": f"Query: {query}\nData: {json.dumps(summary_input)}"},
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            return json.loads(resp.choices[0].message.content)
        except:
            return {"summary": "Encontré varias opciones. ¡Revisa la lista para ver el mejor precio!"}