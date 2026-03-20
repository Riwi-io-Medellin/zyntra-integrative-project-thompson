import logging
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config.settings import OPENAI_API_KEY, OPENAI_MODEL
from ai.agent import ShoppingAgent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

app = FastAPI(
    title="Store Scraper API",
    description="Búsqueda de productos en tiendas colombianas con IA",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = ShoppingAgent()


# ── Schemas ───────────────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    query:                  str
    max_results_per_store:  int = 8
    stores:                 Optional[list[str]] = None


class SearchResponse(BaseModel):
    query:       str
    search_term: str
    intent:      Optional[str] = None        # ← CORREGIDO: era requerido, faltaba en la respuesta
    products:    list[dict]
    total:       int
    errors:      dict = Field(default_factory=dict)   # ← CORREGIDO: valor por defecto
    analysis:    dict = Field(default_factory=dict)   # ← CORREGIDO: valor por defecto


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/search", response_model=SearchResponse)
async def search(body: SearchRequest):
    if not body.query.strip():
        raise HTTPException(status_code=400, detail="El campo 'query' es requerido")

    result = await agent.search(
        user_query            = body.query,
        max_results_per_store = body.max_results_per_store,
        stores                = body.stores,
    )

    # Rellenar campos que el agente puede no retornar
    result.setdefault("intent",      "")
    result.setdefault("search_term", body.query)
    result.setdefault("errors",      {})
    result.setdefault("analysis",    {})

    return result


@app.get("/search/simple")
async def search_simple(
    q:      str = Query(..., description="Término de búsqueda"),
    stores: str = Query("exito,alkosto,ktronix,d1", description="Tiendas separadas por coma"),
    limit:  int = Query(5, description="Resultados por tienda"),
):
    """Búsqueda directa sin procesamiento IA (útil para pruebas)."""
    store_list = [s.strip() for s in stores.split(",") if s.strip()]
    result = await agent.search(q, max_results_per_store=limit, stores=store_list)
    return result


class VisionRequest(BaseModel):
    image_base64: str

@app.post("/vision")
async def vision(body: VisionRequest):
    """Usa GPT-4 Vision para identificar el producto en una imagen."""
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    try:
        resp = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{body.image_base64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": "Identifica el producto principal en esta imagen. Responde SOLO con el nombre del producto para buscar en tiendas colombianas, máximo 4 palabras. Ejemplo: 'celular motorola edge' o 'televisor samsung 55 pulgadas'. Sin explicaciones, solo el término de búsqueda."
                        }
                    ]
                }
            ],
            max_tokens=50
        )
        query = resp.choices[0].message.content.strip()
        return {"query": query}
    except Exception as e:
        return {"query": "", "error": str(e)}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "store-scraper"}