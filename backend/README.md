# Backend - Zyntra

API construida con Express para busqueda de productos por texto, imagen y voz.

## Stack

- Node.js (ES Modules)
- Express 5
- MongoDB con Mongoose
- MySQL con `mysql2/promise`
- Multer para carga de archivos

## Scripts

- `npm run dev`: corre el servidor con `nodemon`
- `npm start`: corre el servidor con `node`
- `npm test`: placeholder (no hay tests implementados)

## Variables de entorno

Configura `backend/.env` con:

```env
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=tu_usuario
MYSQL_PASSWORD=tu_password
MYSQL_DB=zyntra
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tu_db
```

## Instalacion y ejecucion

```bash
cd backend
npm install
npm run dev
```

Servidor por defecto: `http://localhost:3000`

## Flujo general de la API

1. `src/server.js` inicia el backend.
2. Antes de escuchar peticiones:
- valida conexion a MySQL (`db.getConnection()`).
- intenta conectar MongoDB (`connectMongo()`).
3. `src/app.js` monta middlewares globales y rutas bajo `/api`.
4. `src/routes/searchRoutes.js` dirige cada endpoint a su controlador.
5. Los controladores llaman servicios y responden JSON.

## Endpoints actuales

Base URL: `http://localhost:3000/api`

### `POST /search`

Busqueda por texto.

Body:

```json
{
  "query": "iphone 15"
}
```

Respuesta: mock de precios ordenados por menor precio.

### `POST /search/image`

Busqueda por imagen.

- `form-data`, campo: `image`
- acepta: `image/jpeg`, `image/png`, `image/webp`
- maximo: 5 MB

Respuesta: mock con metadatos del archivo recibido.

### `POST /search/voice`

Busqueda por voz.

- `form-data`, campo: `voice`

Respuesta: mock basico.

Nota: actualmente usa el mismo `fileFilter` de `multer` (solo tipos de imagen), por lo que archivos de audio pueden ser rechazados hasta ajustar ese middleware.

## Estructura del backend (explicada)

```text
backend/
|- package.json
|- package-lock.json
|- .env
|- README.md
|- src/
   |- app.js
   |- server.js
   |- config/
   |- controllers/
   |- database/
   |- integrations/
   |- middleware/
   |- models/
   |- routes/
   |- services/
   |- utils/
```

### Archivos raiz

- `package.json`: scripts, dependencias y modo ESM (`"type": "module"`).
- `package-lock.json`: lockfile de npm.
- `.env`: credenciales y configuracion sensible de entorno.
- `README.md`: esta documentacion del backend.

### `src/app.js`

- Crea instancia de Express.
- Activa parser JSON con `express.json()`.
- Monta rutas en `/api`.
- Registra `errorMiddleware` al final.

### `src/server.js`

- Importa la app y conexiones.
- Define `PORT`.
- En `startServer()`:
- prueba conexion MySQL.
- conecta a MongoDB.
- levanta `app.listen(...)`.

### `src/config/`

- `dbConfig.js`: conexion a MongoDB via `mongoose.connect(process.env.MONGO_URI)`.
- `mysql.js`: crea pool MySQL con variables `MYSQL_*`.
- `envConfig.js`: archivo vacio (reservado).
- `aiConfig.js`: archivo vacio (reservado).

### `src/routes/`

- `index.js`: router principal; monta `searchRoutes` en `/search`.
- `searchRoutes.js`: define:
- `POST /` (texto)
- `POST /image` (imagen)
- `POST /voice` (voz)

### `src/controllers/`

- `searchController.js`:
- `searchProduct`: usa `searchService(query)`.
- `searchByImage`: usa `searchImageService(req.file)`.
- `searchVoice`: usa `searchVoiceServices(req.file)`.

### `src/services/`

- `searchService.js`:
- `searchService`: mock de comparacion entre Amazon, MercadoLibre y eBay.
- `searchImageService`: mock de respuesta para imagen.
- `searchVoiceServices`: mock de respuesta para voz.
- `aiServices.js`: archivo vacio (reservado).
- `comparatorService.js`: archivo vacio (reservado).

### `src/middleware/`

- `validationMidleware.js`:
- valida `query` para texto.
- valida presencia de `req.file` para imagen/voz.
- `upLoaderMiddleware.js`:
- configura Multer en memoria (`memoryStorage`).
- limita tamano de archivo a 5 MB.
- filtra MIME types (solo imagen).
- `errorMiddleware.js`:
- captura errores y responde `500` con `err.message`.

### `src/integrations/`

Archivos reservados para integrar APIs externas:

- `amazonApi.js` (vacio)
- `mercadoLibreApi.js` (vacio)
- `speechAi.js` (vacio)
- `visionAi.js` (vacio)

### `src/database/`

- `connection.js`: archivo vacio (reservado para capa de conexion unificada o helpers).

### `src/models/`

- `productModels.js`: archivo vacio (reservado para esquema/modelos).

### `src/utils/`

- `formatter.js`: archivo vacio (reservado para utilidades de formato).

## Comportamiento actual y pendientes

- El backend ya levanta y expone rutas funcionales.
- La logica de negocio es mock en servicios.
- Varias capas estan preparadas pero sin implementar (integrations, models, utils, etc.).
- La ruta de voz necesita ajuste en `upLoaderMiddleware.js` para aceptar audio MIME types.

## Seguridad

- No subas credenciales reales al repositorio.
- Si un `.env` con datos reales fue compartido, rota esas credenciales.

