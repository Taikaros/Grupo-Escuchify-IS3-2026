# Módulo 6: Certificados

## Descripción
Generación de certificados (asistencia, aprobación, participación en calidad de autor/expositor). Entidades originales: `Certificado`, `TipoCertificado`.

---

## Historias de Usuario y Criterios de Aceptación

1. Como organizador, quiero generar certificados de asistencia para participantes acreditados, para validar su participación.
   - Criterio de aceptación: El certificado se genera en formato PDF; incluye nombre del participante, evento, fecha y tipo de certificado.
2. Como disertante, quiero generar un certificado de participación como expositor, para mi currículum.
   - Criterio de aceptación: El certificado se genera automáticamente para usuarios con rol de disertante en el evento.
3. Como organizador, quiero generar certificados de aprobación para participantes que cumplan con requisitos, para validar su evaluación.
   - Criterio de aceptación: Se generan certificados solo para participantes que aprueben la evaluación del evento; se registra la calificación obtenida.

---

## Requisitos Funcionales y Reglas de Negocio

### Requisitos Funcionales
- RF1: El sistema debe generar certificados de asistencia para participantes acreditados.
- RF2: El sistema debe generar certificados de aprobación para participantes que cumplan requisitos.
- RF3: El sistema debe generar certificados de participación para disertantes.

### Reglas de Negocio
- RN1: Los certificados de asistencia solo se generan para participantes con acreditación confirmada.
- RN2: Los certificados de aprobación requieren una calificación mínima definida por el organizador.
- RN3: Los certificados de participación (expositor/autor) se generan automáticamente para usuarios con rol de disertante.

---

## Modelo de Datos

### Entidad: TipoCertificado

| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_tipo_certificado | INT | NOT NULL AUTO_INCREMENT | PK |
| nombre | VARCHAR(50) | NOT NULL UNIQUE | |

### Entidad: Certificado

| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_certificado | INT | NOT NULL AUTO_INCREMENT | PK |
| id_inscripcion | INT | NOT NULL | FK (Inscripción.id_inscripcion) |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) |
| id_tipo_certificado | INT | NOT NULL | FK (TipoCertificado.id_tipo_certificado) |
| fecha_emision | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| calificacion | DECIMAL(5,2) | | |

### Relaciones
- N:1 Certificado -> Inscripción (Referencia: Inscripción.id_inscripcion PK)
- N:1 Certificado -> Evento (Referencia: Evento.id_evento PK)
- N:1 Certificado -> TipoCertificado (Referencia: TipoCertificado.id_tipo_certificado PK)

---

## Plan de Tareas

**Total: 9 días hábiles**

1. Diseño y documentación de entidades y endpoints: 2 días
2. Desarrollo de generación de certificados por tipo: 3 días
3. Desarrollo de exportación a PDF: 2 días
4. Pruebas unitarias y de integración: 2 días

---

## Estrategia de Verificación

- **Tipo de Prueba**: Unitarias (generación de certificados), Integración (BD), Aceptación (organizador/participante)
- **Alcance**: Generación de certificados por tipo, exportación a PDF
- **Criterio de Aceptación**: Certificados se generan solo para usuarios con requisitos cumplidos; PDF válido.
- **Criterio de Rechazo**: Genera certificado de asistencia para usuario no acreditado; PDF corrupto.
- **Casos de Prueba de Ejemplo**:
  1. Generar certificado de asistencia para usuario no acreditado → Espera error 400 con mensaje "NO_ACREDITADO"
  2. Generar certificado de aprobación sin calificación mínima → Espera error 400 con mensaje "CALIFICACION_INSUFICIENTE"
  3. Descargar certificado en PDF → Espera archivo PDF válido con datos correctos
