# Zyntra - Plataforma de Búsqueda Inteligente de Productos

[![Status](/imgs/brallamSesion.png)]()  
**E-commerce price comparison & product search platform for Colombian stores, powered by AI scraping and multi-modal search (text, voice, image).**

Repositorio del equipo **Zyntra (RIWI)** - Proyecto integrativo full-stack.

##  Características Principales

- **Búsqueda Multimodal**: Texto, voz e imagen → AI interpreta queries naturales ("quiero una nevera barata de 2 puertas").
- **+25 Tiendas Colombianas**: Éxito, Alkosto, Ktronix, D1, Carulla, Falabella, Nike, y más.
- **AI Agent**: GPT procesa queries complejas y selecciona mejores ofertas.
- **Scraping Inteligente**: API JSON (VTEX) + Playwright para sitios dinámicos (React/Next.js).
- **Full-Stack**: Frontend React → Backend Node/Express → Python microservicio.
- **Databases**: MySQL (transaccional) + MongoDB (logs/búsquedas).

##  Arquitectura

```
[Frontend React/Vite]  <-- HTTP API -->
       |
[Backend Node/Express + MySQL/Mongo]  <-- POST /search -->  
       |
[aiServices Python/FastAPI] <-- Scrapers (Playwright) --> Colombian Stores
```

**Flujo típico**:
1. Usuario busca "zapatillas nike running" (texto/voz/imagen).
2. Frontend → Backend `/api/search`.
3. Backend → aiServices `/search` (query procesada por GPT).
4. Scrapers buscan en paralelo → JSON limpio (precio, stock, URL).
5. Backend ordena por precio/mejor oferta → Frontend muestra cards.

##  Estructura del Proyecto

| Carpeta | Descripción | README |
|---------|-------------|--------|
| `aiServices/` | **Motor de scraping Python** (FastAPI + Playwright + OpenAI). Scrapers específicos por tienda, AI agent para queries. **Inicia aquí**. | [aiServices/README.md](aiServices/README.md) |
| `backend/` | **API Node/Express**. Rutas `/search` (texto/imagen/voz), integra aiServices, auth, history. MySQL/Mongo. | [backend/README.md](backend/README.md) |
| `frontend/` | **UI React/Vite**. Páginas Home/Login/Stores, componentes Search/ProductCard/VoiceSearch. Consume backend API. *(Sin README aún)* | 📝 Pendiente |
| `TODO.md` | Progreso de tareas actuales. | Este archivo |

Cada carpeta tiene su **README detallado** con instalación específica, endpoints, estructura interna.

## Quickstart (Desarrollo Local)

### 1. Prerrequisitos
```bash
git clone <repo>
cd zyntra-integrative-project-thompson
# Python 3.10+, Node 18+, npm/yarn, MySQL 8+, MongoDB
```

### 2. aiServices (Obligatorio primero)
```bash
cd aiServices
python -m venv venv && venv\Scripts\activate  # Windows
pip install -r requirements.txt
playwright install chromium
# Edita .env → OPENAI_API_KEY
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```
http://localhost:8001/docs

### 3. Backend
```bash
cd ../backend
npm install
# Edita .env → MYSQL_*, MONGO_URI
npm run dev
```
 http://localhost:3000/api/search (prueba con mock primero)

### 4. Frontend
```bash
cd ../frontend
npm install
npm run dev
```
 http://localhost:5173 (Vite default)

### 5. Probar End-to-End
```
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "iphone 15 pro max"}'
```

##  Tech Stack

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | React, Vite, Vanilla CSS/JS |
| **Backend** | Node.js, Express, Multer, MySQL2, Mongoose |
| **AI/Scraping** | Python, FastAPI, Playwright, OpenAI GPT, StaticClient |
| **DB** | MySQL (productos), MongoDB (historial) |
| **Dev** | ES Modules, nodemon, pytest, dotenv |

##  Documentación Detallada

- **aiServices**: [Instalación](aiServices/README.md#instalación), [Endpoints](aiServices/README.md#endpoints), [Agregar tienda](aiServices/README.md#agregar-una-nueva-tienda).
- **Backend**: [Endpoints](backend/README.md#endpoints-actuales), [Estructura](backend/README.md#estructura-del-backend-explicada).
- **Frontend**: Componentes Stores/Search/ProductCard → [Explorar src/].

##  Estado Actual & Próximos Pasos

 **Listo**:
- Scrapers funcionales (Éxito/Alkosto/D1/etc.)
- Backend API básica (mocks → reales via aiServices)
- Frontend UI base (search components)

 **En progreso**:
- Integración completa Backend ←→ aiServices
- Frontend autenticación completa
- Búsqueda por imagen/voz real (Vision/Speech AI)

 **Pendientes**:
- Tests end-to-end
- Docker Compose
- Deployment (Vercel/Netlify + Railway/Render)


**Create by:**
Estiven Delgado
Dayron Torres
