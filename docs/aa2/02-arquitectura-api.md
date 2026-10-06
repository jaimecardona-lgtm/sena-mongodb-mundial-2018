# Arquitectura de la API

**AA2-EV01:** Código fuente API RESTful

---

## Diagrama de Flujo

```
Cliente HTTP
    ↓
Express Middleware (JSON parser)
    ↓
Routes
    ↓
Controllers (Lógica de negocio)
    ↓
Models (Mongoose)
    ↓
MongoDB
    ↓
Respuesta JSON
```

---

## Componentes Principales

### 1. **Capa de Servidor** (`src/server.js`)

**Responsabilidades:**
- Cargar variables de entorno
- Conectar a MongoDB
- Iniciar Express app
- Manejar interrupciones gracefully

**Punto de entrada:** `npm start`

### 2. **Capa de Configuración** (`src/config/database.js`)

**Responsabilidades:**
- Crear y gestionar conexión Mongoose
- Validar MONGODB_URI
- Reportar estado de conexión

**Función reutilizable:** `connectDatabase()`

### 3. **Capa de Aplicación** (`src/app.js`)

**Responsabilidades:**
- Configurar Express
- Registrar middleware
- Registrar rutas
- Manejo de 404

**Función reutilizable:** `createApp()`

### 4. **Capa de Rutas** (`src/routes/`) — PENDIENTE

**Responsabilidades:**
- Mapear rutas HTTP a controladores
- Definir métodos (GET, POST, PUT, DELETE)
- Parámetros y validación inicial

**Rutas futuras:**
- GET `/api/equipos` — Listar todos
- GET `/api/equipos/:id` — Obtener uno
- GET `/api/jugadores` — Listar todos
- POST `/api/partidos` — Crear partido

### 5. **Capa de Controladores** (`src/controllers/`) — PENDIENTE

**Responsabilidades:**
- Lógica de negocio
- Llamar modelos
- Formatear respuestas
- Manejo de errores

**Controladores futuros:**
- `equiposController` — CRUD de equipos
- `jugadoresController` — CRUD de jugadores
- `partidosController` — CRUD de partidos

### 6. **Capa de Modelos** (`src/models/`) — PENDIENTE

**Responsabilidades:**
- Esquemas Mongoose
- Validaciones de documento
- Métodos personalizados

**Modelos futuros:**
- `Equipo` — equipos collection
- `Jugador` — jugadores collection
- `Partido` — partidos collection

---

## Flujo de Requesteo

### Ejemplo: GET /api/jugadores?team=Colombia

```
1. Cliente: GET /api/jugadores?team=Colombia
   ↓
2. Express Router: Match ruta, extraer params
   ↓
3. Middleware: JSON parser
   ↓
4. Controlador: jugadoresController.list({ team: "Colombia" })
   ↓
5. Modelo: Jugador.find({ team: "Colombia" })
   ↓
6. MongoDB: Query colección jugadores
   ↓
7. Respuesta: JSON array de jugadores
   ↓
8. Cliente: Array JSON [{ nombre, ... }, ...]
```

---

## Responsabilidades por Capa

| Capa | Responsabilidad | NO Responsabilidad |
|---|---|---|
| **Server** | Iniciar, conectar | Lógica de negocio |
| **Config** | Conexión DB | Operaciones CRUD |
| **Routes** | Mapear URLs | Validar datos |
| **Controllers** | Orquestar CRUD | Detalles DB |
| **Models** | Esquemas, métodos | Lógica HTTP |
| **MongoDB** | Almacenar datos | Validación HTTP |

---

## Patrones de Respuesta

### Respuesta Exitosa

```json
{
  "status": "ok",
  "data": { ... },
  "timestamp": "2026-10-06T10:30:00Z"
}
```

### Respuesta de Error

```json
{
  "status": "error",
  "message": "Descripción del error",
  "code": "ERROR_CODE",
  "timestamp": "2026-10-06T10:30:00Z"
}
```

---

## Próximos Pasos

1. Crear modelos Mongoose en `src/models/`
2. Implementar controladores en `src/controllers/`
3. Definir rutas en `src/routes/`
4. Agregar validación de entrada
5. Tests de endpoints

---

**Versión:** 1.0  
**Fecha:** 2026-10-06  
**Estado:** Arquitectura definida, implementación pendiente
