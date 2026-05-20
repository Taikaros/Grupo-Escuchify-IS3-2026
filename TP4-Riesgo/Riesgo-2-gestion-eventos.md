### Riesgo-2: Inconsistencia de datos por modificación concurrente — Gestión de Eventos

**Módulo:** Gestión de Eventos
**Riesgo asociado:** R2 — Inconsistencia de datos por modificación concurrente de eventos sin control de concurrencia
**HU vinculada:** HU-2 — Editar Evento Existente (TP2-SDD/specs/gestion-eventos/gestion-eventos.md)
**Exposición:** 9 (Medio)

---

## 1. Declaración del Riesgo (R2)

| R2 - Inconsistencia de datos por modificación concurrente |
| :---- | :---- |
| **Condición** | Múltiples usuarios (organizadores) modifican el mismo evento simultáneamente sin control de concurrencia (locks o versionado) |
| **Consecuencia** | Datos sobrescritos o inconsistentes en la base de datos (cupos, fechas, estado) |
| **Efecto** | Eventos con información incorrecta, cancelaciones indebidas, pérdida de confianza |
| **Exposición** | 9 (Impacto: Medio 3 × Probabilidad: 40% = 9) |

---

## 2. Historia de Usuario Vinculada (HU-2)

**Fuente:** `TP2-SDD/specs/gestion-eventos/gestion-eventos.md` — HU-2: Editar Evento Existente

> **Como** organizador,
> **Quiero** editar un evento existente,
> **Para** modificar sus detalles o fechas.

**Criterios de Aceptación relevantes:**
- Solo el organizador del evento puede editar sus datos
- No se permite modificar fechas si ya hay inscripciones confirmadas
- Se validan las nuevas fechas y cupos
- Se registra la auditoría del cambio
- Se retorna confirmación de actualización

**Vinculación con el riesgo:**  
HU-2 expone el endpoint `PUT /eventos/{id_evento}` a ediciones concurrentes. Sin control de concurrencia, dos organizadores que editen el mismo evento simultáneamente pueden sobrescribir los cambios del otro, resultando en datos inconsistentes. La auditoría registra el cambio pero no previene la condición de carrera.

---

## 3. Controles derivados de OWASP

A continuación se mapean controles del **OWASP Application Security Verification Standard (ASVS)** y guías **OWASP Race Condition Prevention** aplicables al R2.

### 3.1 Mapeo de controles OWASP

| Control OWASP | Descripción | Aplicación al R2 |
|:---|:---|:---|
| **ASVS V8.3 — Concurrency Protection** | El sistema debe usar mecanismos de concurrencia optimista (versionado) o pesimista (bloqueos) para prevenir condiciones de carrera en actualizaciones concurrentes | Agregar columna `version` (INT) a la entidad `Evento` para optimistic locking. Cada `UPDATE` incluye `WHERE version = :version_leida` e incrementa `version`. |
| **ASVS V4.2 — Access Control** | Verificar que el usuario autenticado sea propietario o tenga permiso explícito sobre el recurso antes de cualquier operación de escritura | Validar dentro de la misma transacción que el usuario autenticado sea el organizador del evento (`Usuario_Evento_Rol` con rol `ORGANIZADOR`), no como paso previo separado. |
| **ASVS V2.5 — Session Management** | Mantener identidad de sesión única por usuario para vincular cada operación a un sujeto responsable | Cada request a `PUT /eventos/{id_evento}` debe incluir JWT válido del cual se extrae `id_usuario` para la verificación de propiedad y registro de auditoría. |
| **OWASP — Race Condition Prevention** | Usar transacciones con nivel de aislamiento `REPEATABLE READ` o `SERIALIZABLE`, y bloqueos de fila (`SELECT ... FOR UPDATE`) para serializar modificaciones concurrentes sobre el mismo recurso | Envolver la lógica de `PUT /eventos/{id_evento}` en una transacción que ejecute `SELECT ... FOR UPDATE` sobre la fila `Evento.id_evento` antes de leer los datos actuales y aplicar la actualización. |
| **ASVS V7.1 — Logging and Auditing** | Registrar eventos de seguridad con suficiente contexto para reconstruir la secuencia de operaciones | Incluir en el log de auditoría: `id_usuario`, `id_evento`, `version_anterior`, `version_nueva`, `timestamp`, y los campos modificados (antes/después). |

### 3.2 Diagrama de flujo con controles OWASP

```
PUT /eventos/{id_evento}
  │
  ├─ [ASVS V2.5] Validar JWT → extraer id_usuario
  │
  ├─ [ASVS V4.2] Verificar rol ORGANIZADOR del evento
  │
  ├─ [OWASP RCP] INICIAR TRANSACCIÓN (REPEATABLE READ)
  │     │
  │     ├─ SELECT ... FOR UPDATE FROM Evento WHERE id_evento = ?
  │     │     (Bloquea la fila hasta que termine la transacción)
  │     │
  │     ├─ [ASVS V8.3] Verificar version == :version_enviada
  │     │     (Si otra edición modificó la fila, version no coincide → ROLLBACK)
  │     │
  │     ├─ Validar RN6 (si hay inscripciones, no cambiar fechas)
  │     │
  │     ├─ Ejecutar UPDATE Evento SET ... , version = version + 1
  │     │     WHERE id_evento = ? AND version = :version_enviada
  │     │
  │     └─ [ASVS V7.1] INSERT en tabla auditoría_eventos
  │
  └─ COMMIT / ROLLBACK
```

---

## 4. Plan de Acción (Preventivo)

1.  **Agregar columna `version` a la tabla `Evento`:**
    - Tipo: `INT NOT NULL DEFAULT 1`
    - Cada `UPDATE` debe incluir `SET version = version + 1` y cláusula `WHERE version = :version_enviada`
    - Si `ROW_COUNT() = 0` luego del UPDATE, significa que la versión no coincidió → retornar error `409 CONFLICT` con mensaje `"EVENTO_MODIFICADO_POR_OTRO_USUARIO"`

2.  **Implementar transacción con bloqueo pesimista en `PUT /eventos/{id_evento}`:**
    - Nivel de aislamiento: `REPEATABLE READ`
    - Ejecutar `SELECT ... FOR UPDATE` sobre la fila del evento al inicio de la transacción
    - Mantener la verificación de propiedad del organizador (ASVS V4.2) dentro de la misma transacción

3.  **Reforzar la auditoría (ASVS V7.1):**
    - Crear tabla `Auditoria_Evento`:
      - `id_auditoria` (PK, AUTO_INCREMENT)
      - `id_evento` (FK → Evento.id_evento)
      - `id_usuario` (FK → Usuario.id_usuario)
      - `version_previa` (INT)
      - `version_nueva` (INT)
      - `cambios` (JSON) — campos modificados con valores antes/después
      - `timestamp` (DATETIME DEFAULT CURRENT_TIMESTAMP)
    - Insertar un registro en cada `PUT` exitoso

4.  **Escribir tests de concurrencia:**
    - Test que lanza 2 requests `PUT /eventos/{id_evento}` simultáneas (simulando 2 organizadores) y verifica que solo una recibe `200 OK` y la otra recibe `409 CONFLICT`
    - Test que verifica que después del conflicto, los datos del evento corresponden a la edición que ganó
    - Test que verifica que la auditoría registra correctamente la versión previa y nueva

---

## 5. Plan de Contingencia (Reactivo)

1.  **Disparador:** Se detectan datos inconsistentes en un evento (ej: cupo máximo diferente al esperado, fechas que no coinciden con la intención del organizador, o se reporta que cambios de un organizador fueron sobrescritos por otro):
    1.  Bloquear inmediatamente el endpoint `PUT /eventos/{id_evento}` para el evento afectado mediante un flag en base de datos (`evento_bloqueado = TRUE`).
    2.  Consultar la tabla `Auditoria_Evento` para el `id_evento` afectado, ordenando por `timestamp` descendente y `version_nueva` descendente, para reconstruir la secuencia real de cambios.
    3.  Identificar el estado correcto del evento evaluando la última versión confirmada y los campos modificados.
    4.  Ejecutar un script de reparación que actualice el evento al estado identificado como correcto e incremente la `version` en 1.
    5.  Notificar a los organizadores del evento sobre la incidencia y el estado restaurado, solicitando que verifiquen los datos.
    6.  Desbloquear el evento (`evento_bloqueado = FALSE`) y reanudar la operación normal.
    7.  Realizar una revisión post-mortem para ajustar el control de concurrencia si la condición de carrera logró evadirlo.

---

## 6. Resumen

| Elemento | Detalle |
|:---|:---|
| **Riesgo** | R2 — Inconsistencia de datos por modificación concurrente |
| **Módulo** | Gestión de Eventos |
| **HU asociada** | HU-2 — Editar Evento Existente |
| **Exposición** | 9 |
| **Controles OWASP** | ASVS V8.3 (Concurrency), V4.2 (Access Control), V2.5 (Session), V7.1 (Audit), OWASP Race Condition Prevention |
| **Mecanismo principal** | Optimistic locking (versión) + Pessimistic locking (SELECT FOR UPDATE) |
| **Plan de Acción** | ✅ Columnas `version`, transacciones, auditoría mejorada, tests |
| **Plan de Contingencia** | ✅ Bloqueo de endpoint, auditoría forense, reparación, notificación |

---

*Control de riesgos basado en OWASP ASVS v4.0.3 y guías OWASP Race Condition Prevention. Documento derivado del análisis SEI-SRM en Gestion-Riesgo.md.*
