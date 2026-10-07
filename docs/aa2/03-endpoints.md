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

## Partidos

**Nota:** Partidos NO posee un campo `id` funcional. Se usa MongoDB `_id` (ObjectId) como identificador. Los duplicados se validan por fecha + hora + equipos (considerando orden inverso).

### GET /api/partidos

**Propósito:** Listar todos los partidos con filtros opcionales

**Método HTTP:** GET

**Parámetros de query (opcionales):**
- `equipo` (string): Filtrar partidos donde equipo1 o equipo2 coincida (ej: "Colombia")
- `fecha` (string): Filtrar por fecha exacta en formato DD/MM/YY (ej: "11/07/18")

Los filtros pueden combinarse: `?equipo=Colombia&fecha=11/07/18`

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "_id": "6ab9e8bf727d291b5689f8c1",
      "equipo1": "Colombia",
      "equipo2": "Japan",
      "fecha": "11/07/18",
      "hora": "12:00:00 p. m."
    },
    {
      "_id": "6ab9e8bf727d291b5689f8c2",
      "equipo1": "Poland",
      "equipo2": "Colombia",
      "fecha": "26/07/18",
      "hora": "7:30:00 p. m."
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
  "message": "La fecha debe estar en formato DD/MM/YY"
}
```

**Ejemplo:**
```bash
curl "http://localhost:3000/api/partidos?equipo=Colombia"
curl "http://localhost:3000/api/partidos?fecha=11/07/18"
curl "http://localhost:3000/api/partidos?equipo=Colombia&fecha=11/07/18"
```

---

### GET /api/partidos/:id

**Propósito:** Obtener un partido específico por MongoDB ObjectId

**Método HTTP:** GET

**Parámetros:**
- `id` (path, requerido): MongoDB ObjectId del partido (24 caracteres hexadecimales)

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "6ab9e8bf727d291b5689f8c1",
    "equipo1": "Colombia",
    "equipo2": "Japan",
    "fecha": "11/07/18",
    "hora": "12:00:00 p. m."
  }
}
```

**Respuesta - ObjectId inválido (400):**
```json
{
  "status": "error",
  "message": "El id del partido no es válido"
}
```

**Respuesta - No encontrado (404):**
```json
{
  "status": "error",
  "message": "Partido no encontrado"
}
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/partidos/6ab9e8bf727d291b5689f8c1
```

---

### POST /api/partidos

**Propósito:** Crear un nuevo partido

**Método HTTP:** POST

**Body requerido:**
```json
{
  "equipo1": "Brazil",
  "equipo2": "Germany",
  "fecha": "07/07/18",
  "hora": "2:00:00 p. m."
}
```

**Validaciones:**
- Todos los campos requeridos
- `equipo1` y `equipo2`: no vacíos, diferentes entre sí
- `fecha`: formato DD/MM/YY
- `hora`: string (formato esperado: "HH:MM:SS a. m." o "HH:MM:SS p. m.")
- Duplicados: se considera duplicado si coinciden fecha + hora + (equipo1/equipo2 en cualquier orden)

**Respuesta exitosa (201):**
```json
{
  "status": "success",
  "message": "Partido creado correctamente",
  "data": {
    "_id": "6ab9e8bf727d291b5689f8c3",
    "equipo1": "Brazil",
    "equipo2": "Germany",
    "fecha": "07/07/18",
    "hora": "2:00:00 p. m."
  }
}
```

**Respuesta - Validación fallida (400):**
```json
{
  "status": "error",
  "message": "Un equipo no puede jugar contra sí mismo"
}
```

**Respuesta - Duplicado (409):**
```json
{
  "status": "error",
  "message": "El partido ya existe"
}
```

**Ejemplo:**
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

### PUT /api/partidos/:id

**Propósito:** Actualizar un partido (reemplazo completo)

**Método HTTP:** PUT

**Parámetros:**
- `id` (path, requerido): MongoDB ObjectId del partido

**Body requerido:**
```json
{
  "equipo1": "Brazil",
  "equipo2": "Germany",
  "fecha": "07/07/18",
  "hora": "2:00:00 p. m."
}
```

**Notas:**
- Todos los campos del body son requeridos
- Operación idempotente: ejecutar dos veces produce el mismo resultado
- Los mismos equipos no pueden jugar entre sí

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Partido actualizado correctamente",
  "data": {
    "_id": "6ab9e8bf727d291b5689f8c1",
    "equipo1": "Brazil",
    "equipo2": "Germany",
    "fecha": "07/07/18",
    "hora": "2:00:00 p. m."
  }
}
```

**Respuesta - ObjectId inválido (400):**
```json
{
  "status": "error",
  "message": "El id del partido no es válido"
}
```

**Respuesta - No encontrado (404):**
```json
{
  "status": "error",
  "message": "Partido no encontrado"
}
```

**Respuesta - Duplicado (409):**
```json
{
  "status": "error",
  "message": "El partido ya existe"
}
```

**Ejemplo:**
```bash
curl -X PUT http://localhost:3000/api/partidos/6ab9e8bf727d291b5689f8c1 \
  -H "Content-Type: application/json" \
  -d '{
    "equipo1": "Brazil",
    "equipo2": "Germany",
    "fecha": "07/07/18",
    "hora": "2:00:00 p. m."
  }'
```

---

### DELETE /api/partidos/:id

**Propósito:** Eliminar un partido

**Método HTTP:** DELETE

**Parámetros:**
- `id` (path, requerido): MongoDB ObjectId del partido

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Partido eliminado correctamente",
  "data": {
    "_id": "6ab9e8bf727d291b5689f8c1",
    "equipo1": "Colombia",
    "equipo2": "Japan",
    "fecha": "11/07/18",
    "hora": "12:00:00 p. m."
  }
}
```

**Respuesta - ObjectId inválido (400):**
```json
{
  "status": "error",
  "message": "El id del partido no es válido"
}
```

**Respuesta - No encontrado (404):**
```json
{
  "status": "error",
  "message": "Partido no encontrado"
}
```

**Ejemplo:**
```bash
curl -X DELETE http://localhost:3000/api/partidos/6ab9e8bf727d291b5689f8c1
```

---

## Endpoints PENDIENTES

Ninguno. CRUD completo implementado (Health, Equipos, Jugadores, Partidos).

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

**Versión:** 3.0
**Fecha:** 2026-10-06
**Estado:** Health y CRUD (Equipos, Jugadores, Partidos) implementados
