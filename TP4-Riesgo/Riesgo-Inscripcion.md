# Controles derivados del OWASP — Módulo Inscripciones (R3)

---

## Riesgo asociado

| R3 - Condición de carrera en inscripciones |
| :---- | :---- |
| **Módulo** | Inscripciones |
| **Condición** | Múltiples usuarios intentan inscribirse al mismo tiempo en un evento con cupo limitado sin bloqueo transaccional |
| **Consecuencia** | Se excede el cupo máximo del evento por falta de control de concurrencia en la validación de cupo disponible |
| **Efecto** | Evento con más asistentes de los permitidos, conflictos logísticos, sobreventa |
| **Probabilidad** | 68 % (Altamente probable) |
| **Impacto** | Medio (3) |
| **Exposición** | 12 |

---

## Historia de Usuario vinculada

**HU1 — Inscripción Autónoma** (extraída de `TP2-SDD/specs/inscripciones/inscripciones.md`):

> **Como** usuario autenticado,
> **Quiero** inscribirme de forma autónoma a un evento,
> **Para** participar en él.

**Criterio de aceptación:** La inscripción se registra si hay cupo disponible y no ha pasado la fecha límite; se genera confirmación automática.

**Reglas de negocio afectadas:**
- RN1: No se permiten inscripciones si se alcanzó el cupo máximo del evento.
- RN4: Un usuario no puede inscribirse dos veces al mismo evento.

---

## Controles OWASP derivados

Los siguientes controles se derivan del **OWASP Application Security Verification Standard (ASVS) v4.0** y del **OWASP Top 10 2021**, aplicados al riesgo de condición de carrera en inscripciones.

### 1. Control de concurrencia transaccional (ASVS 8.3 Race Conditions)

| Referencia OWASP | Descripción | Aplicación |
| :---- | :---- | :---- |
| **ASVS 8.3.1** | Verificar que la aplicación no sufre condiciones de carrera en operaciones críticas (TOCTOU — Time of Check, Time of Use). | El endpoint `POST /api/inscripciones` debe ejecutar la validación de cupo y el registro de la inscripción dentro de una **misma transacción de base de datos** para evitar que dos solicitudes concurrentes aprueben la validación de cupo antes de que cualquiera de ellas inserte el registro. |
| **ASVS 8.3.2** | Verificar que el sistema soporta solicitudes concurrentes de forma segura sin degradar la integridad de los datos de negocio. | Implementar **bloqueo pesimista** (`SELECT ... FOR UPDATE`) sobre el registro del evento al momento de verificar el cupo disponible, de modo que las transacciones concurrentes esperen en cola y no superen el límite. |
| **ASVS 8.3.3** | Verificar que los mecanismos de bloqueo liberan recursos correctamente incluso ante fallos. | Asegurar que la transacción tenga un `timeout` definido y que el bloqueo se libere mediante `COMMIT` o `ROLLBACK` en todos los escenarios (éxito, error de validación, excepción del servidor). |

### 2. Validación de reglas de negocio en APIs (ASVS 12.x Business Logic)

| Referencia OWASP | Descripción | Aplicación |
| :---- | :---- | :---- |
| **ASVS 12.1.1** | Verificar que el flujo de la lógica de negocio se ejecuta en el orden correcto y no puede ser evadido. | La inscripción debe seguir una secuencia ininterrumpida: `Verificar autenticación → Validar fecha límite → Validar cupo con bloqueo → Insertar inscripción → Confirmar`. No debe existir un endpoint separado que permita insertar inscripciones saltando la validación. |
| **ASVS 12.3.1** | Verificar que la aplicación valida la integridad de las operaciones de negocio críticas (ej. límites cuantitativos no superables). | El cupo máximo del evento debe validarse **dentro de la transacción** y no en una consulta separada previa. La consulta de verificación debe ser: `SELECT COUNT(*) FROM Inscripcion WHERE id_evento = ? FOR UPDATE`, y la comparación debe hacerse inmediatamente antes del `INSERT`. |
| **ASVS 12.4.1** | Verificar que la aplicación protege contra ataques de repetitividad en transacciones sensibles. | Implementar **idempotencia** en la inscripción usando el par `(id_usuario, id_evento)` como clave única (`UNIQUE CONSTRAINT` en BD), lo que también garantiza RN4. |

### 3. Segregación de responsabilidades (OWASP Top 10 2021 — A01 Broken Access Control)

| Referencia OWASP | Descripción | Aplicación |
| :---- | :---- | :---- |
| **A01:2021-BAC** | Los límites cuantitativos de acceso a recursos deben aplicarse en el backend, no en el frontend. | La validación de cupo debe realizarse **exclusivamente en el backend** dentro de la transacción. El frontend puede mostrar el cupo restante a modo informativo, pero nunca debe confiar en ese valor para decidir si permite o no la inscripción. |

---

## Recomendaciones de implementación

### A. Esquema transaccional para `POST /api/inscripciones`

```sql
BEGIN TRANSACTION;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- 1. Bloquear el registro del evento para evitar lecturas concurrentes sucias
SELECT cupo_maximo, fecha_limite
FROM Evento
WHERE id_evento = :idEvento
FOR UPDATE;

-- 2. Validar fecha límite
IF CURRENT_TIMESTAMP > fecha_limite THEN
    ROLLBACK;
    RETURN ERROR 'FECHA_LIMITE_EXPIRADA';
END IF;

-- 3. Validar que el usuario no esté ya inscripto (RN4)
SELECT COUNT(*) FROM Inscripcion
WHERE id_usuario = :idUsuario AND id_evento = :idEvento;
IF count > 0 THEN
    ROLLBACK;
    RETURN ERROR 'USUARIO_YA_INSCRIPTO';
END IF;

-- 4. Validar cupo disponible (RN1)
SELECT COUNT(*) FROM Inscripcion
WHERE id_evento = :idEvento
FOR UPDATE;
IF count >= cupo_maximo THEN
    ROLLBACK;
    RETURN ERROR 'CUPO_LLENO';
END IF;

-- 5. Registrar la inscripción
INSERT INTO Inscripcion (id_usuario, id_evento, estado)
VALUES (:idUsuario, :idEvento, 'CONFIRMADA');

COMMIT;
```

### B. Controles en la capa de aplicación (Node.js)

```javascript
// Middleware de validación
async function inscribir(req, res) {
  const { idEvento } = req.params;
  const idUsuario = req.usuario.id;

  // Usar una transacción gestionada por el ORM (Prisma/Sequelize)
  const resultado = await db.transaction(async (tx) => {
    // Bloqueo pesimista del evento
    const evento = await tx.evento.findByPk(idEvento, {
      lock: tx.LOCK.UPDATE
    });

    if (!evento) throw new AppError(404, 'EVENTO_NO_ENCONTRADO');
    if (new Date() > evento.fecha_limite) throw new AppError(400, 'FECHA_LIMITE_EXPIRADA');

    // Verificar inscripción duplicada
    const existente = await tx.inscripcion.count({
      where: { id_usuario: idUsuario, id_evento: idEvento }
    });
    if (existente > 0) throw new AppError(409, 'USUARIO_YA_INSCRIPTO');

    // Verificar cupo (dentro de la misma transacción con lock)
    const count = await tx.inscripcion.count({
      where: { id_evento: idEvento },
      lock: tx.LOCK.UPDATE
    });
    if (count >= evento.cupo_maximo) throw new AppError(400, 'CUPO_LLENO');

    // Crear inscripción
    return tx.inscripcion.create({
      data: { id_usuario: idUsuario, id_evento: idEvento, estado: 'CONFIRMADA' }
    });
  });

  res.status(201).json({ mensaje: 'Inscripción confirmada', inscripcion: resultado });
}
```

### C. Restricciones a nivel de base de datos

```sql
-- Garantiza RN4: un usuario no puede inscribirse dos veces al mismo evento
ALTER TABLE Inscripcion
ADD CONSTRAINT uq_usuario_evento UNIQUE (id_usuario, id_evento);

-- Garantiza integridad referencial con Evento
ALTER TABLE Inscripcion
ADD CONSTRAINT fk_inscripcion_evento
FOREIGN KEY (id_evento) REFERENCES Evento(id_evento);
```

---

## Estrategia de verificación de los controles

| Control OWASP | Prueba | Resultado esperado |
| :---- | :---- | :---- |
| ASVS 8.3.1 — TOCTOU | Enviar 20 solicitudes concurrentes a `POST /api/inscripciones` para un evento con cupo = 5. | Exactamente 5 inscripciones exitosas; 15 errores `CUPO_LLENO`. |
| ASVS 8.3.2 — Bloqueo pesimista | Medir el tiempo de respuesta bajo concurrencia: 10 solicitudes simultáneas. | Las solicitudes se procesan secuencialmente sin exceder el cupo. |
| ASVS 12.3.1 — Integridad de cupo | Insertar manualmente un registro en la BD (bypass del API) e intentar inscribir hasta llenar el cupo. | La transacción respeta el cupo incluso si hay inscripciones externas. |
| ASVS 12.4.1 — Idempotencia | Enviar dos veces la misma solicitud (mismo usuario, mismo evento). | Primera solicitud: `201` exitosa. Segunda: `409 USUARIO_YA_INSCRIPTO`. |
| A01:2021 — Broken Access Control | Modificar el cupo en el frontend a un valor arbitrario y enviar la solicitud. | El backend rechaza la inscripción si el cupo real está lleno, independientemente del valor enviado desde el frontend. |

---

## Criterios de aceptación de seguridad

- [x] La inscripción se registra en una transacción que incluye validación de cupo con bloqueo pesimista.
- [x] El cupo máximo del evento nunca se supera, incluso bajo concurrencia extrema.
- [x] No existe ruta alternativa que permita registrar inscripciones sin pasar por las validaciones de negocio.
- [x] El endpoint responde con código `400` y mensaje `CUPO_LLENO` cuando se alcanza el límite.
- [x] El endpoint responde con código `400` y mensaje `FECHA_LIMITE_EXPIRADA` cuando la fecha límite pasó.
- [x] El endpoint responde con código `409` y mensaje `USUARIO_YA_INSCRIPTO` para inscripciones duplicadas.

---

*Documento generado siguiendo OWASP Application Security Verification Standard (ASVS) v4.0 y OWASP Top 10 2021. Vinculado al riesgo R3 del análisis SEI en Gestion-Riesgo.md y a la HU1 del módulo Inscripciones en TP2-SDD/specs/inscripciones/inscripciones.md.*
