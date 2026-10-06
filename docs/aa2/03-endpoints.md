# Especificación de Endpoints

**AA2-EV01:** API RESTful Copa Mundial FIFA 2018

**Versión:** 1.0 (FOUNDATION)

---

## Health Check

### GET /api/health

**Propósito:** Verificar que la API está disponible

**Método HTTP:** GET

**Parámetros:** Ninguno

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "service": "sena-mundial-2018-api"
}
```

**Respuesta de error:** N/A (siempre 200 si servidor está corriendo)

---

## Equipos

### GET /api/equipos

**Propósito:** Listar todos los equipos

**Método HTTP:** GET

**Parámetros:** Ninguno

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "id": 5,
      "abbreviation": "col",
      "country": "Colombia",
      "confederation": "CONMEBOL"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "id": 15,
      "abbreviation": "jpn",
      "country": "Japan",
      "confederation": "AFC"
    }
  ]
}
```

**Respuesta de error (500):**
```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

---

### GET /api/equipos/:id

**Propósito:** Obtener un equipo específico por su ID funcional

**Método HTTP:** GET

**Parámetros:**
- `id` (path, requerido): ID del equipo (entero positivo, sin decimales: 1, 5, 15, 99, etc.)

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "id": 5,
    "abbreviation": "col",
    "country": "Colombia",
    "confederation": "CONMEBOL"
  }
}
```

**Respuesta - Parámetro inválido (400):**
```json
{
  "status": "error",
  "message": "El id debe ser un entero positivo"
}
```

**Respuesta - No encontrado (404):**
```json
{
  "status": "error",
  "message": "Equipo con id 999 no encontrado"
}
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/equipos/5
```

---

### POST /api/equipos

**Propósito:** Crear un nuevo equipo

**Método HTTP:** POST

**Body requerido:**
```json
{
  "id": 33,
  "abbreviation": "tst",
  "country": "Testland",
  "confederation": "TEST"
}
```

**Validaciones:**
- `id`: entero positivo, único
- `abbreviation`: exactamente 3 caracteres, lowercase, único
- `country`: string no vacío, único
- `confederation`: string no vacío, se normaliza a uppercase

**Respuesta exitosa (201):**
```json
{
  "status": "success",
  "message": "Equipo creado correctamente",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "id": 33,
    "abbreviation": "tst",
    "country": "Testland",
    "confederation": "TEST"
  }
}
```

**Respuesta - Validación fallida (400):**
```json
{
  "status": "error",
  "message": "Todos los campos son requeridos: id, abbreviation, country, confederation"
}
```

**Respuesta - Conflicto de unicidad (409):**
```json
{
  "status": "error",
  "message": "Ya existe un equipo con id 5"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/equipos \
  -H "Content-Type: application/json" \
  -d '{
    "id": 33,
    "abbreviation": "tst",
    "country": "Testland",
    "confederation": "TEST"
  }'
```

---

### PUT /api/equipos/:id

**Propósito:** Actualizar un equipo (reemplazo completo de campos editables)

**Método HTTP:** PUT

**Parámetros:**
- `id` (path, requerido): ID del equipo a actualizar (entero positivo, sin decimales)

**Body requerido:**
```json
{
  "abbreviation": "new",
  "country": "New Country",
  "confederation": "NEW"
}
```

**Notas:**
- El `id` se toma de la URL, no del body
- Todos los campos del body son requeridos
- `abbreviation` se normaliza a lowercase
- `confederation` se normaliza a uppercase
- Operación idempotente: ejecutar dos veces produce el mismo resultado

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Equipo actualizado correctamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "id": 5,
    "abbreviation": "new",
    "country": "New Country",
    "confederation": "NEW"
  }
}
```

**Respuesta - Parámetro inválido (400):**
```json
{
  "status": "error",
  "message": "El id debe ser un entero positivo"
}
```

**Respuesta - No encontrado (404):**
```json
{
  "status": "error",
  "message": "Equipo con id 999 no encontrado"
}
```

**Respuesta - Conflicto de unicidad (409):**
```json
{
  "status": "error",
  "message": "Ya existe un equipo con abreviatura 'jpn'"
}
```

**Ejemplo:**
```bash
curl -X PUT http://localhost:3000/api/equipos/5 \
  -H "Content-Type: application/json" \
  -d '{
    "abbreviation": "col",
    "country": "Colombia",
    "confederation": "CONMEBOL"
  }'
```

---

### DELETE /api/equipos/:id

**Propósito:** Eliminar un equipo

**Método HTTP:** DELETE

**Parámetros:**
- `id` (path, requerido): ID del equipo a eliminar (entero positivo, sin decimales)

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Equipo eliminado correctamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "id": 5,
    "abbreviation": "col",
    "country": "Colombia",
    "confederation": "CONMEBOL"
  }
}
```

**Respuesta - Parámetro inválido (400):**
```json
{
  "status": "error",
  "message": "El id debe ser un entero positivo"
}
```

**Respuesta - No encontrado (404):**
```json
{
  "status": "error",
  "message": "Equipo con id 999 no encontrado"
}
```

**Ejemplo:**
```bash
curl -X DELETE http://localhost:3000/api/equipos/5
```

---

## Endpoints PENDIENTES

Los siguientes endpoints se especificarán en fases posteriores:

---

### Jugadores (GET, POST, PUT, DELETE)
- [ ] GET `/api/jugadores` — Listar todos (con filtros opcionales)
- [ ] GET `/api/jugadores/:id` — Obtener jugador por ID
- [ ] GET `/api/jugadores?team=Colombia` — Filtrar por equipo
- [ ] GET `/api/jugadores?altura_min=180` — Filtrar por altura
- [ ] POST `/api/jugadores` — Crear nuevo jugador
- [ ] PUT `/api/jugadores/:id` — Actualizar jugador
- [ ] DELETE `/api/jugadores/:id` — Eliminar jugador

**Estructura esperada (Jugador):**
```json
{
  "_id": "ObjectId",
  "team": "Colombia",
  "numero": 10,
  "posicion": "CM",
  "nombre": "RODRÍGUEZ James",
  "fechaNacimiento": "12.07.1991",
  "nombreCamiseta": "RODRÍGUEZ",
  "club": "Real Madrid CF (ESP)",
  "estatura": 180,
  "peso": 75
}
```

---

### Partidos (GET, POST, PUT, DELETE)
- [ ] GET `/api/partidos` — Listar todos los partidos
- [ ] GET `/api/partidos/:id` — Obtener partido por ID
- [ ] POST `/api/partidos` — Crear nuevo partido
- [ ] PUT `/api/partidos/:id` — Actualizar partido
- [ ] DELETE `/api/partidos/:id` — Eliminar partido

**Estructura esperada (Partido):**
```json
{
  "_id": "ObjectId",
  "equipo1": "Colombia",
  "equipo2": "England",
  "fecha": "20/08/18",
  "hora": "6:00:00 p. m."
}
```

---

## Códigos HTTP

| Código | Significado |
|---|---|
| 200 | OK — Solicitud exitosa |
| 201 | Created — Recurso creado |
| 400 | Bad Request — Datos inválidos |
| 404 | Not Found — Recurso no existe |
| 500 | Internal Server Error — Error servidor |

---

## Ejemplos de Uso Futuro

### Listar jugadores de Colombia
```bash
curl -X GET http://localhost:3000/api/jugadores?team=Colombia
```

### Crear nuevo partido
```bash
curl -X POST http://localhost:3000/api/partidos \
  -H "Content-Type: application/json" \
  -d '{
    "equipo1": "Brazil",
    "equipo2": "Germany",
    "fecha": "07/07/18",
    "hora": "2:00:00 p. m."
  }'
```

---

## Consideraciones de Seguridad

- [ ] Validar entrada en todos los endpoints
- [ ] Sanitizar datos para evitar inyecciones
- [ ] Implementar rate limiting (futuro)
- [ ] Agregar autenticación (futuro)

---

**Versión:** 2.0
**Fecha:** 2026-10-06
**Estado:** Health y CRUD Equipos implementados, Jugadores y Partidos pendientes
