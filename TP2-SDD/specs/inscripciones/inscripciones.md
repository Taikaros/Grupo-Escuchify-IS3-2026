# Módulo 3: Inscripciones

## Descripción
Registro de participantes a eventos (autónomo y por personal del evento). Entidad original: `Inscripción`.

---

## Historias de Usuario y Criterios de Aceptación

1. Como usuario autenticado, quiero inscribirme de forma autónoma a un evento, para participar en él.
   - Criterio de aceptación: La inscripción se registra si hay cupo disponible y no ha pasado la fecha límite; se genera confirmación automática.
2. Como personal del evento, quiero inscribir a un participante manualmente, para casos de registro fuera de la plataforma.
   - Criterio de aceptación: El personal puede buscar usuarios existentes o crear registros temporales; se validan cupos y fechas límite.
3. Como usuario, quiero cancelar mi inscripción a un evento, para liberar cupo.
   - Criterio de aceptación: La cancelación es posible hasta 24 horas antes del evento; se libera el cupo ocupado.

---

## Requisitos Funcionales y Reglas de Negocio

### Requisitos Funcionales
- RF1: El sistema debe permitir inscripciones autónomas para usuarios autenticados.
- RF2: El sistema debe permitir inscripciones manuales por personal del evento.
- RF3: El sistema debe validar cupo disponible y fecha límite antes de confirmar inscripción.
- RF4: El sistema debe permitir la cancelación de inscripciones por parte del usuario.

### Reglas de Negocio
- RN1: No se permiten inscripciones si se alcanzó el cupo máximo del evento.
- RN2: No se permiten inscripciones después de la fecha límite establecida.
- RN3: Solo se puede cancelar una inscripción hasta 24 horas antes del inicio del evento.
- RN4: Un usuario no puede inscribirse dos veces al mismo evento.

---

## Modelo de Datos

### Entidad: Inscripción

| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_inscripcion | INT | NOT NULL AUTO_INCREMENT | PK |
| id_usuario | INT | NOT NULL | FK (Usuario.id_usuario) |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) |
| fecha_inscripcion | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| estado | VARCHAR(20) | NOT NULL DEFAULT 'CONFIRMADA' | |

### Relaciones
- N:1 Inscripción -> Usuario (Referencia: Usuario.id_usuario PK)
- N:1 Inscripción -> Evento (Referencia: Evento.id_evento PK)
- 1:N Inscripción -> Acreditación (Referencia: Acreditación.id_inscripcion FK)
- 1:N Inscripción -> Certificado (Referencia: Certificado.id_inscripcion FK)

---

## Plan de Tareas

**Total: 9 días hábiles**

1. Diseño y documentación de entidades y endpoints: 2 días
2. Desarrollo de inscripción autónoma: 2 días
3. Desarrollo de inscripción manual por personal: 2 días
4. Desarrollo de cancelación de inscripciones: 1 día
5. Pruebas unitarias y de integración: 2 días

---

## Estrategia de Verificación

- **Tipo de Prueba**: Unitarias (validación de cupos/fechas), Integración (BD), Aceptación (usuario/participante)
- **Alcance**: Inscripción autónoma/manual, cancelación, validación de cupos
- **Criterio de Aceptación**: Inscripciones solo se confirman si hay cupo y dentro de fecha límite; cancelación libera cupo.
- **Criterio de Rechazo**: Permite inscripción con cupo lleno; permite cancelación después de fecha límite.
- **Casos de Prueba de Ejemplo**:
  1. Inscribir a usuario cuando cupo máximo alcanzado → Espera error 400 con mensaje "CUPO_LLENO"
  2. Inscribir después de fecha límite → Espera error 400 con mensaje "FECHA_LIMITE_EXPIRADA"
  3. Cancelar inscripción 12 horas antes del evento → Espera error 400 con mensaje "CANCELACION_NO_PERMITIDA"
