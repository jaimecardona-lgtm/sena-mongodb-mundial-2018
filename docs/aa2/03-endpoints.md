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

## Endpoints PENDIENTES

Los siguientes endpoints se especificarán en fases posteriores:

### Equipos (GET, POST, PUT, DELETE)
- [ ] GET `/api/equipos` — Listar todos los equipos
- [ ] GET `/api/equipos/:id` — Obtener equipo por ID
- [ ] POST `/api/equipos` — Crear nuevo equipo
- [ ] PUT `/api/equipos/:id` — Actualizar equipo
- [ ] DELETE `/api/equipos/:id` — Eliminar equipo

**Estructura esperada (Equipo):**
```json
{
  "_id": "ObjectId",
  "id": 5,
  "abbreviation": "col",
  "country": "Colombia",
  "confederation": "CONMEBOL"
}
```

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

**Versión:** 1.0  
**Fecha:** 2026-10-06  
**Estado:** Health endpoint implementado, CRUD pendiente
