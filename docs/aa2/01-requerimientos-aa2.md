# AA2-EV01: Requerimientos de la API RESTful

**Programa:** DESARROLLO BACKEND CON NODE.JS Y MONGODB

**Evidencia:** Código fuente API RESTful y Scripts BD. AA2-EV01.

**Rama:** `feature/node-api-aa2-ev01`

---

## Criterios de Evaluación SENA

La rúbrica oficial evalúa los siguientes 9 criterios:

| # | Criterio | Descripción | Peso | Estado |
|---|---|---|---|---|
| 1 | Presentación de documentación | Documentar adecuadamente API, endpoints, parámetros | 10% | FOUNDATION |
| 2 | Necesidad y usuarios objetivo | Describir contexto y quiénes usan la API | 10% | FOUNDATION |
| 3 | Esquema de base de datos | Identificar claramente la estructura MongoDB | 10% | FOUNDATION |
| 4 | Descripción de endpoints | Listar todos los endpoints disponibles | 10% | FOUNDATION |
| 5 | Método HTTP y parámetros | Documentar GET, POST, PUT, DELETE con parámetros | 10% | FOUNDATION |
| 6 | Respuestas HTTP | Documentar estructura de respuestas JSON | 10% | FOUNDATION |
| 7 | Scripts de BD | Entregar scripts MongoDB (R1-R10, ya existentes) | 10% | COMPLETADO ✅ |
| 8 | Código Node.js | Entregar código fuente ejecutable | 10% | FOUNDATION |
| 9 | Ejecución verificable | Poder iniciar API, ejecutar scripts, verificar endpoints | 20% | FOUNDATION |

**Total:** 100%

---

## Fase Actual: FOUNDATION

### Objetivos Completados ✅

- [x] Estructura de directorios `api/` creada
- [x] `package.json` con dependencias iniciales (Express, Mongoose, dotenv)
- [x] `api/.env.example` con variables de configuración
- [x] `api/src/config/database.js` — conexión Mongoose reutilizable
- [x] `api/src/app.js` — aplicación Express con `/api/health`
- [x] `api/src/server.js` — punto de entrada con gestión de errores
- [x] Documentación AA2 base creada en `docs/aa2/`

### Objetivos Pendientes ⏳

- [ ] Instalar dependencias npm (cuando sea autorizado)
- [ ] Modelos Mongoose para Equipos, Jugadores, Partidos
- [ ] Rutas y controladores CRUD
- [ ] Validación de entrada y manejo de errores
- [ ] Tests de endpoints
- [ ] Documentación detallada de endpoints
- [ ] Plan de importación de Datafile.xlsx

---

## Stack Tecnológico

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de datos:** MongoDB con Mongoose
- **Configuración:** dotenv

### Desarrollo

- **Automatización:** nodemon
- **Lenguaje:** JavaScript (módulos ES)
- **Versionamiento:** Git

---

## Estructura API

```
api/
├── src/
│   ├── config/
│   │   └── database.js          # Conexión MongoDB
│   ├── models/                  # Modelos Mongoose (PENDIENTE)
│   ├── controllers/             # Lógica de negocio (PENDIENTE)
│   ├── routes/                  # Rutas Express (PENDIENTE)
│   ├── middleware/              # Middleware personalizado (PENDIENTE)
│   ├── app.js                   # Configuración Express
│   └── server.js                # Punto de entrada
├── tests/                       # Tests (PENDIENTE)
├── postman/                     # Colección Postman (PENDIENTE)
├── scripts/                     # Utilidades (PENDIENTE)
├── .env.example                 # Variables de ejemplo
└── package.json                 # Dependencias
```

---

## Endpoints Especificados

### Health Check

```http
GET /api/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "service": "sena-mundial-2018-api"
}
```

---

## Notas Importantes

1. **MongoDB:** Los scripts R1-R10 ya existen en `mongodb/` y no serán modificados
2. **Datafile.xlsx:** Se mantiene en `data/source/` pero no se importa en esta fase
3. **CRUD:** Se implementará en fases posteriores (no en FOUNDATION)
4. **Ejecución:** La API debe ser ejecutable y verificable mediante `npm start`

---

**Versión:** 1.0  
**Fecha:** 2026-10-06  
**Estado:** FOUNDATION — Estructura base completada
