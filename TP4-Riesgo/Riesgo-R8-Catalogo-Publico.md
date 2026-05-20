### R8 — Catálogo Público: Controles derivados del OWASP

**Riesgo asociado:** Exposición de datos sensibles (IDs internos, cupos, fechas no publicables) en endpoints públicos del catálogo.

**HU vinculada:** HU1 — Listado de Eventos Públicos (`TP2-SDD/specs/catalogo-publico/catalogo-publico.md`)

**Módulo:** Catálogo Público

---

#### 1. Clasificación OWASP

| Referencia | Categoría | Descripción |
| :--------- | :-------- | :---------- |
| **OWASP Top 10 — A01:2021** | Broken Access Control | El endpoint público expone campos internos sin filtrar, violando el principio de menor exposición. |
| **OWASP API Security — API3:2019** | Excessive Data Exposure | La API devuelve el modelo completo de la entidad `Evento` en lugar de un DTO con solo los campos necesarios. |
| **OWASP ASVS — V5 (Validation & Encoding)** | V5.1 Input/Output Validation | No se valida ni filtra la salida de datos sensibles en respuestas públicas. |

---

#### 2. Controles de mitigación basados en OWASP

##### 2.1 DTO (Data Transfer Object) para respuestas públicas

Aplicar el patrón DTO para garantizar que solo los campos explícitamente autorizados sean devueltos por el endpoint `GET /api/v1/catalogo/eventos`.

| Campo | ¿Se expone? | Justificación |
| :---- | :---------: | :------------ |
| `id_evento` (PK interna) | **NO** | Expone la secuencia interna de registros; usar en su lugar un UUID público si se necesita identificar un evento. |
| `titulo` | Sí | Requerido por HU1. |
| `tipo` | Sí | Requerido por HU1 y HU3. |
| `fecha_inicio` | Sí | Requerido por HU1 y HU2. |
| `descripcion` | Sí | Requerido por HU1 (descripción breve). |
| `cupo_maximo` | **NO** | Dato interno de capacidad; expone información estratégica. |
| `cupo_actual` | **NO** | Dato interno de ocupación; expone información competitiva. |
| `fecha_limite_inscripcion` | **NO** | Fecha interna de corte; puede ser explotada para evadir controles. |
| `estado` | **NO** | Se filtra en la consulta (solo ACTIVO/FINALIZADO) pero no se expone en respuesta. |
| `id_organizador` | **NO** | Dato interno de asignación. |
| `created_at` / `updated_at` | **NO** | Metadatos internos sin relevancia para el usuario público. |

**Implementación recomendada:**
```typescript
// CatalogoEventoDTO.ts — Backend (Node.js/Express)
interface CatalogoEventoDTO {
  uuid: string;       // Identificador público (no el id_evento interno)
  titulo: string;
  tipo: string;       // TipoEvento.nombre
  fecha_inicio: Date;
  descripcion: string;
}
```

##### 2.2 Control OWASP: Principio de menor exposición (API3:2019)

- El endpoint `GET /api/v1/catalogo/eventos` NO debe exponer el modelo `Evento` directamente desde la capa de datos.
- La capa de servicio debe transformar la entidad a `CatalogoEventoDTO` antes de la serialización JSON.
- Implementar un middleware de saneamiento de respuestas que verifique que ningún campo no listado en el DTO sea devuelto.

```typescript
// Ejemplo de middleware OWASP para filtrado de campos
function sanitizeCatalogoResponse(req, res, next) {
  const allowedFields = ['uuid', 'titulo', 'tipo', 'fecha_inicio', 'descripcion'];
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    if (Array.isArray(body)) {
      body = body.map(item => {
        const sanitized = {};
        for (const field of allowedFields) {
          if (field in item) sanitized[field] = item[field];
        }
        return sanitized;
      });
    }
    return originalJson(body);
  };
  next();
}
```

##### 2.3 Control OWASP: Validación de salida (ASVS V5.1)

- Aplicar validación de salida para garantizar que los campos expuestos no contengan datos sensibles incrustados (HTML, scripts, etc.).
- Escapar caracteres especiales en `titulo` y `descripcion` para prevenir XSS reflejado en el frontend.

##### 2.4 Control OWASP: Rate-limiting en endpoints públicos

- Aplicar rate-limiting al endpoint `GET /api/v1/catalogo/eventos` para prevenir scraping masivo de datos.
- Límite sugerido: 100 requests por minuto por IP (configurable).
- Instrumentar con `express-rate-limit`.

##### 2.5 Pruebas de seguridad (OWASP ASVS V2.1)

Actualizar el plan de pruebas del módulo Catálogo Público para incluir:

| # | Caso de Prueba OWASP | Resultado Esperado |
| :- | :------------------- | :----------------- |
| 1 | Invocar `GET /api/v1/catalogo/eventos` y verificar que NO se expone `id_evento`, `cupo_maximo`, `cupo_actual`, `fecha_limite_inscripcion` | Solo aparecen campos del DTO |
| 2 | Invocar directamente `GET /api/v1/eventos/{id}` (endpoint interno) sin autenticación | Retorna `401 UNAUTHORIZED` |
| 3 | Verificar que el DTO no incluye campos adicionales no declarados | La estructura JSON coincide exactamente con `CatalogoEventoDTO` |
| 4 | Enviar 101 requests en 1 minuto desde una misma IP al endpoint público | La request 101 retorna `429 TOO_MANY_REQUESTS` |

---

#### 3. Corrección necesaria en la especificación actual

El archivo `TP2-SDD/specs/catalogo-publico/catalogo-publico.md` en su sección **5. Modelo de Datos — Campos mostrados del Evento** incluye `id_evento` como campo expuesto. Conforme al análisis OWASH, este campo debe reemplazarse por un identificador público (UUID) o eliminarse si no es necesario para el frontend.

**Cambio requerido:**

| Actual (expone) | Corregido (debe exponer) |
| :-------------- | :------------------------ |
| `id_evento` | `uuid` (identificador público opaco) |
| `titulo` | `titulo` |
| `tipo` | `tipo` |
| `fecha_inicio` | `fecha_inicio` |
| `descripcion` | `descripcion` |

---

*Controles definidos según OWASP Top 10 (2021), OWASP API Security Top 10 (2019) y OWASP ASVS v4.0.3.*
