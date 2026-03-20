# store-scraper 

Motor de búsqueda de productos en tiendas colombianas con IA .  
Corre como microservicio Python que tu backend JS consume vía HTTP.

---

## Tiendas soportadas

| Tienda    | Método          | Tecnología web         |
|-----------|-----------------|------------------------|
| Éxito     | API VTEX (JSON) | Next.js                |
| Alkosto   | Scraping HTML   | Salesforce CC (JS)     |
| Ktronix   | Scraping HTML   | Salesforce CC (JS)     |
| D1        | Scraping HTML   | React / Next.js        |

> **Éxito** tiene una API VTEX interna no documentada que devuelve JSON directamente,  
> por lo que no necesita Playwright. Las demás requieren navegador headless.

---

## Arquitectura

```
backend JS (Node/Express)
        │  POST /search  { query: "..." }
        ▼
  store-scraper (FastAPI :8001)
        │
        ├── ai/agent.py  ← GPT interpreta la query
        │
        ├── scrapers/
        │   ├── exito/scraper.py   (API JSON)
        │   ├── alkosto/scraper.py (Playwright)
        │   ├── ktronix/scraper.py (Playwright)
        │   └── d1/scraper.py      (Playwright)
        │
        └── utils/
            ├── http_client.py  (StaticClient + DynamicClient)
            ├── models.py       (Product, SearchResult)
            └── parsers.py      (limpieza de precios y texto)
```

---

## Instalación

```bash
# 1. Entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Dependencias
pip install -r requirements.txt

# 3. Instalar navegadores de Playwright
playwright install chromium

# 4. Variables de entorno
cp .env.example .env
# → aqui hay que editar .env y agregar OPENAI_API_KEY
```

---

## Arrancar el servidor

```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

El servidor queda disponible en `http://localhost:8001`.  
Documentación interactiva: `http://localhost:8001/docs`

---

## Endpoints

### `POST /search`  ← el que usará tu backend JS

```json
// Request body
{
  "query": "quiero una nevera de dos puertas barata",
  "max_results_per_store": 8,
  "stores": null           
}

// Response
{
  "query": "quiero una nevera de dos puertas barata",
  "search_term": "nevera dos puertas",
  "intent": "busca nevera económica de dos puertas",
  "products": [ { "store": "exito", "name": "...", "price": 1299900, ... } ],
  "total": 24,
  "errors": {},
  "analysis": {
    "summary": "...",
    "best_deal": { "store": "alkosto", "name": "...", "price": 1199000 },
    "recommendations": [ ... ]
  }
}
```

### `GET /search/simple?q=arroz&stores=exito,d1&limit=5`

Búsqueda directa sin IA.

### `GET /health`

```json
{ "status": "ok", "service": "store-scraper" }
```

---

## Integración con  backend JS (ejemplo)

```js
// Node.js / Express
const axios = require('axios');

async function searchProducts(userQuery) {
  const { data } = await axios.post('http://localhost:8001/search', {
    query: userQuery,
    max_results_per_store: 8,
  });
  return data;
}
```

---

## Tests

```bash
pytest tests/ -v
```

---

## Agregar una nueva tienda

1. Crea la carpeta `scrapers/nueva_tienda/`
2. Implementa `scraper.py` heredando de `BaseScraper`
3. Registra el scraper en `ai/agent.py → SCRAPERS`
4. Agrega la URL base en `config/settings.py → STORES`
5. Añade tests en `tests/test_scrapers.py`
