# Riesgo 5: Pérdida de respuestas de encuestas

## Datos del Riesgo

| Campo | Valor |
|---|---|
| **Identificador** | R5 |
| **Módulo** | Encuestas |
| **Elemento** | Encuestas |
| **Probabilidad** | 18% (Poco probable — valor 2) |
| **Impacto** | Marginal (2) |
| **Exposición** | 4 (bajo) |
| **Responsable** | Líder técnico |

---

## 1. Declaración del Riesgo

| Aspecto | Descripción |
|---|---|
| **Condición** | Fallo en la conexión a la base de datos durante el envío de respuestas sin usar transacciones atómicas |
| **Consecuencia** | Respuestas de encuestas parcialmente almacenadas o perdidas |
| **Efecto** | Resultados de encuestas incompletos, decisiones basadas en datos erróneos, feedback inválido |

---

## 2. Historia de Usuario Vinculada

**HU2: Responder Encuesta** (extraída de `TP2-SDD/specs/Encuestas/encuestas.md`)

> **Como** participante,
> **Quiero** responder la encuesta de un evento al que asistí,
> **Para** dar mi opinión.

**Criterios de aceptación de la HU:**
- Solo participantes acreditados pueden responder la encuesta.
- Se permite una sola respuesta por usuario por evento.

**Vinculación con R5:** Esta HU requiere integridad transaccional: si falla la conexión a la BD durante el envío de respuestas y no se usan transacciones atómicas, las respuestas se perderán parcialmente. Además, la restricción de "una respuesta por usuario" exige un correcto control de concurrencia para evitar respuestas duplicadas.

---

## 3. Controles Derivados de OWASP

Los siguientes controles se derivan del estándar **OWASP ASVS (Application Security Verification Standard) v4.0** y se aplican al riesgo R5 para mitigar la pérdida de respuestas de encuestas.

### 3.1 Control OWASP ASVS V6 — Data Integrity (V6.2.1)

| Aspecto | Detalle |
|---|---|
| **Control** | Transacciones atómicas en el envío de respuestas |
| **Implementación** | Envolver la inserción en `RespuestaEncuesta` dentro de una transacción explícita (`BEGIN` / `COMMIT` / `ROLLBACK`). Si ocurre un fallo de conexión a PostgreSQL durante la operación, la transacción se revierte automáticamente, evitando datos parciales. |
| **Endpoint afectado** | `POST /api/encuestas/{idEncuesta}/respuestas` |
| **Verificación** | Test de integración que fuerza un corte de conexión a BD durante el envío y verifica que ninguna respuesta quede almacenada aisladamente. |

### 3.2 Control OWASP ASVS V7 — Error Handling (V7.1.1, V7.1.4)

| Aspecto | Detalle |
|---|---|
| **Control** | Manejo de errores con reintentos ante fallos transitorios |
| **Implementación** | Implementar retry logic con backoff exponencial (máximo 3 reintentos) para fallos de conexión transitorios. Si se agotan los reintentos, devolver `503 SERVICE_UNAVAILABLE` con mensaje `"BD_NO_DISPONIBLE"` y registrar el error en logs estructurados. |
| **Endpoint afectado** | `POST /api/encuestas/{idEncuesta}/respuestas` |
| **Verificación** | Test que simula una caída temporal de BD (3 segundos) y verifica que la respuesta se complete exitosamente tras el reintento. |

### 3.3 Control OWASP ASVS V9 — Availability (V9.1.2)

| Aspecto | Detalle |
|---|---|
| **Control** | Circuit breaker en el pool de conexiones a BD |
| **Implementación** | Configurar un circuit breaker en el pool de conexiones a PostgreSQL (ej. con `opossum` o `cockatiel` en Node.js). Si la BD está caída por más de 5 segundos consecutivos, el circuito se abre y se rechazan solicitudes inmediatamente con `503 SERVICE_UNAVAILABLE`, evitando saturación del pool. Monitorear el estado del circuito con métricas exportables a Prometheus. |
| **Endpoint afectado** | Todos los endpoints del módulo Encuestas |
| **Verificación** | Test que desconecta la BD y verifica que las solicitudes sean rechazadas con `503` en lugar de quedar bloqueadas en timeout. |

### 3.4 Control OWASP ASVS V2 — Authentication Verification (V2.1.1)

| Aspecto | Detalle |
|---|---|
| **Control** | Validación de acreditación del participante |
| **Implementación** | Verificar que el JWT del usuario autenticado esté vigente y que el usuario tenga acreditación confirmada en `Usuario_Evento_Rol` para el evento asociado a la encuesta (RN1: "Solo participantes acreditados pueden responder encuestas del evento"). Si no está acreditado, devolver `403 FORBIDDEN` con mensaje `"NO_ACREDITADO"`. |
| **Endpoint afectado** | `POST /api/encuestas/{idEncuesta}/respuestas` |
| **Verificación** | Test que intenta responder una encuesta sin acreditación y verifica error `403` con mensaje `"NO_ACREDITADO"`. |

### 3.5 Control OWASP ASVS V3 — Session Management (V3.2.1)

| Aspecto | Detalle |
|---|---|
| **Control** | Unicidad de respuesta por usuario y evento |
| **Implementación** | Aplicar una restricción `UNIQUE(id_usuario, id_pregunta)` en la tabla `RespuestaEncuesta` a nivel de BD. Además, en la capa de aplicación, realizar una consulta de verificación antes de insertar para evitar duplicados. Si ya existe una respuesta, devolver `409 CONFLICT` con mensaje `"ENCUESTA_YA_RESPONDIDA"` (RN2: "Un participante solo puede responder una vez por evento"). |
| **Endpoint afectado** | `POST /api/encuestas/{idEncuesta}/respuestas` |
| **Verificación** | Test que envía dos respuestas idénticas consecutivas y verifica que la segunda reciba error `409` con mensaje `"ENCUESTA_YA_RESPONDIDA"`. |

---

## 4. Criterios de Aceptación de Seguridad

Para considerar este riesgo como mitigado, deben cumplirse todos los siguientes criterios:

1. **Transaccionalidad:** El endpoint `POST /api/encuestas/{idEncuesta}/respuestas` ejecuta la inserción de respuestas dentro de una transacción atómica; un fallo de BD durante la operación no deja datos parciales.
2. **Manejo de errores:** Fallos transitorios de conexión a BD se resuelven con hasta 3 reintentos con backoff exponencial; si persisten, se responde `503 SERVICE_UNAVAILABLE`.
3. **Control de acceso:** Solo participantes con acreditación confirmada para el evento pueden enviar respuestas; de lo contrario se rechaza con `403 FORBIDDEN`.
4. **Unicidad:** No se permite más de una respuesta por usuario por evento; el sistema rechaza duplicados con `409 CONFLICT`.
5. **Disponibilidad:** El circuito de conexión a BD se abre ante caídas prolongadas, protegiendo el pool de conexiones y respondiendo inmediatamente con `503`.

---

## 5. Plan de Acción

1. Implementar middleware de transaccionalidad atómica en `POST /api/encuestas/{idEncuesta}/respuestas`.
2. Configurar retry logic (3 reintentos, backoff exponencial) en la capa de persistencia del módulo Encuestas.
3. Configurar circuit breaker en el pool de conexiones a PostgreSQL.
4. Agregar validación de acreditación del participante contra `Usuario_Evento_Rol` antes de procesar la respuesta.
5. Agregar restricción `UNIQUE(id_usuario, id_pregunta)` en la tabla `RespuestaEncuesta` y validación en capa de aplicación.
6. Escribir tests de integración que cubran los 5 criterios de aceptación de seguridad.

---

## 6. Plan de Contingencias

**Disparador:** Se detecta pérdida o duplicación de respuestas de encuestas en los logs de auditoría.

1. Bloquear inmediatamente el endpoint `POST /api/encuestas/{idEncuesta}/respuestas` mientras se investiga.
2. Revisar los logs de errores y transacciones para determinar la causa raíz (fallo de conexión, ausencia de transacción, falta de unique constraint).
3. Ejecutar script de reparación que identifique respuestas perdidas mediante reconciliación con la tabla de acreditaciones.
4. Notificar a los organizadores de los eventos afectados sobre la posible pérdida de datos de encuestas.
5. Una vez corregida la causa raíz, reabrir el endpoint y monitorear durante 24 horas.

---

*Documento generado siguiendo la metodología SEI - Software Risk Management (SRM), con controles derivados del estándar OWASP ASVS v4.0.*
