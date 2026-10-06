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

## Jugadores

**Nota:** Jugadores NO posee un campo `id` funcional. Se usa MongoDB `_id` (ObjectId) como identificador. La unicidad funcional está garantizada por `team + numero`.

### GET /api/jugadores

**Propósito:** Listar todos los jugadores con filtros opcionales

**Método HTTP:** GET

**Parámetros de query (opcionales):**
- `team` (string): Filtrar por equipo (ej: "Colombia")
- `numero` (number): Filtrar por número de camiseta (ej: 10)
- `posicion` (string): Filtrar por posición (ej: "GK")
- `estaturaMin` (number): Altura mínima en cm
- `estaturaMax` (number): Altura máxima en cm

Los filtros pueden combinarse: `?team=Colombia&numero=10&estaturaMin=175`

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "count": 23,
  "data": [
    {
      "_id": "6ab9e8be727d291b5689f893",
      "team": "Colombia",
      "numero": 1,
      "posicion": "GK",
      "nombre": "OSPINA David",
      "fechaNacimiento": "31.08.1988",
      "nombreCamiseta": "OSPINA",
      "club": "Arsenal FC (ENG)",
      "estatura": 183,
      "peso": 80
    }
  ]
}
```

**Respuesta - Sin resultados (200):**
```json
{
  "status": "success",
  "count": 0,
  "data": []
}
```

**Respuesta - Validación fallida (400):**
```json
{
  "status": "error",
  "message": "El número debe ser un entero positivo"
}
```

**Ejemplo:**
```bash
curl "http://localhost:3000/api/jugadores?team=Colombia&estaturaMin=180"
```

---

### GET /api/jugadores/:id

**Propósito:** Obtener un jugador específico por MongoDB ObjectId

**Método HTTP:** GET

**Parámetros:**
- `id` (path, requerido): MongoDB ObjectId del jugador (24 caracteres hexadecimales)

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "6ab9e8be727d291b5689f893",
    "team": "Colombia",
    "numero": 1,
    "posicion": "GK",
    "nombre": "OSPINA David",
    "fechaNacimiento": "31.08.1988",
    "nombreCamiseta": "OSPINA",
    "club": "Arsenal FC (ENG)",
    "estatura": 183,
    "peso": 80
  }
}
```

**Respuesta - ObjectId inválido (400):**
```json
{
  "status": "error",
  "message": "El id del jugador no es válido"
}
```

**Respuesta - No encontrado (404):**
```json
{
  "status": "error",
  "message": "Jugador no encontrado"
}
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/jugadores/6ab9e8be727d291b5689f893
```

---

### POST /api/jugadores

**Propósito:** Crear un nuevo jugador

**Método HTTP:** POST

**Body requerido:**
```json
{
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

**Validaciones:**
- Todos los campos requeridos
- `numero`: entero positivo
- `estatura`, `peso`: enteros positivos
- `fechaNacimiento`: formato DD.MM.YYYY
- `team`: debe corresponder a un equipo existente
- `team + numero`: combinación única

**Respuesta exitosa (201):**
```json
{
  "status": "success",
  "message": "Jugador creado correctamente",
  "data": {
    "_id": "6ab9e8be727d291b5689f894",
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
}
```

**Respuesta - Validación fallida (400):**
```json
{
  "status": "error",
  "message": "El equipo indicado no existe"
}
```

**Respuesta - Duplicado (409):**
```json
{
  "status": "error",
  "message": "Ya existe un jugador con ese número en el equipo indicado"
}
```

---

### PUT /api/jugadores/:id

**Propósito:** Actualizar un jugador (reemplazo completo)

**Método HTTP:** PUT

**Parámetros:**
- `id` (path, requerido): MongoDB ObjectId del jugador

**Body requerido:**
```json
{
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

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Jugador actualizado correctamente",
  "data": { ... }
}
```

**Respuesta - ObjectId inválido (400):**
```json
{
  "status": "error",
  "message": "El id del jugador no es válido"
}
```

**Respuesta - No encontrado (404):**
```json
{
  "status": "error",
  "message": "Jugador no encontrado"
}
```

**Respuesta - Duplicado (409):**
```json
{
  "status": "error",
  "message": "Ya existe un jugador con ese número en el equipo indicado"
}
```

---

### DELETE /api/jugadores/:id

**Propósito:** Eliminar un jugador

**Método HTTP:** DELETE

**Parámetros:**
- `id` (path, requerido): MongoDB ObjectId del jugador

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Jugador eliminado correctamente",
  "data": { ... }
}
```

**Respuesta - ObjectId inválido (400):**
```json
{
  "status": "error",
  "message": "El id del jugador no es válido"
}
```

**Respuesta - No encontrado (404):**
```json
{
  "status": "error",
  "message": "Jugador no encontrado"
}
```

---

## Endpoints PENDIENTES

Los siguientes endpoints se especificarán en fases posteriores:

---

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
