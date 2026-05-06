# Project.md - Software de organización y gestión de eventos académicos

## Lista de Módulos del Proyecto
1. **Usuarios y Autenticación**: Gestión de registro, inicio de sesión y perfiles de usuarios. Entidad original: `Usuario`.
2. **Gestión de Eventos**: Creación, edición y administración de eventos académicos (cursos, jornadas, congresos, charlas). Entidades originales: `Evento`, `TipoEvento`.
3. **Inscripciones**: Registro de participantes a eventos (autónomo y por personal del evento). Entidad original: `Inscripción`.
4. **Roles y Acreditación**: Gestión de roles (organizador/participante/disertante) y acreditación de participantes. Entidades originales: `Rol`, `Acreditación`.
5. **Encuestas**: Gestión de comentarios y encuestas de satisfacción post-evento. Entidades originales: `Encuesta`, `PreguntaEncuesta`, `RespuestaEncuesta`.
6. **Certificados**: Generación de certificados (asistencia, aprobación, participación en calidad de autor/expositor). Entidades originales: `Certificado`, `TipoCertificado`.
7. **Informes y Agendas**: Generación de informes y agendas del evento. Entidades originales: `Informe`, `AgendaEvento`.
8. **Catálogo Público**: Visualización pública de eventos con filtros (futuros/pasados). No tiene entidades originales (consulta a `Evento` de Gestión de Eventos).

---

## 1. Objetivo y Contexto
Escenario del producto a desarrollar: Software de organización y gestión de eventos académicos. La idea es desarrollar una aplicación web para que grupos de personas puedan organizar eventos de tipo académico (cursos, jornadas, congresos, charlas, etc). Se requiere contar con una interfaz accesible desde la web para facilitar su uso desde cualquier dispositivo.

Características o funcionalidades principales determinadas por el negocio:
- Gestión de eventos
- Inscripción de participantes (autónoma y por el personal del evento)
- Gestión de roles (organizador/participante/disertante)
- Acreditación de participantes
- Posibilidad de comentarios o encuestas de satisfacción post-evento
- Generación de certificados (asistencia, aprobación, participación en calidad de autor / expositor)
- Generación de informes (incluyendo una agenda del evento si corresponde)

Algunos detalles:
- Los participantes pueden generar un usuario en la plataforma y hacer la inscripción a un evento.
- El listado de eventos es público, cada uno deberá tener su tipo y fecha de realización particular. Se podría establecer un filtro de eventos a futuro y para ver los que ya han pasado.
- Podría haber eventos que tengan un cupo mínimo y máximo. Igualmente con las fechas límite para inscripción.

---

## 2. Historias de Usuario y Criterios de Aceptación

### Módulo 2: Gestión de Eventos
1. Como organizador, quiero crear un nuevo evento académico, para publicarlo en la plataforma.
   - Criterio de aceptación: El evento se crea con título, tipo, fechas de inicio/fin, cupos (mínimo/máximo) y fecha límite de inscripción; se asigna estado "ACTIVO" por defecto.
2. Como organizador, quiero editar un evento existente, para modificar sus detalles o fechas.
   - Criterio de aceptación: Solo el organizador del evento puede editar sus datos; no se permite modificar fechas si ya hay inscripciones confirmadas.
3. Como organizador, quiero cancelar un evento, para informar a los participantes.
   - Criterio de aceptación: El evento cambia a estado "CANCELADO"; se notifica a todos los participantes inscritos.

### Módulo 3: Inscripciones
1. Como usuario autenticado, quiero inscribirme de forma autónoma a un evento, para participar en él.
   - Criterio de aceptación: La inscripción se registra si hay cupo disponible y no ha pasado la fecha límite; se genera confirmación automática.
2. Como personal del evento, quiero inscribir a un participante manualmente, para casos de registro fuera de la plataforma.
   - Criterio de aceptación: El personal puede buscar usuarios existentes o crear registros temporales; se validan cupos y fechas límite.
3. Como usuario, quiero cancelar mi inscripción a un evento, para liberar cupo.
   - Criterio de aceptación: La cancelación es posible hasta 24 horas antes del evento; se libera el cupo ocupado.

### Módulo 4: Roles y Acreditación
1. Como organizador, quiero asignar roles a los participantes de un evento, para definir sus permisos.
   - Criterio de aceptación: Se pueden asignar roles de organizador, participante o disertante; un usuario puede tener múltiples roles en diferentes eventos.
2. Como personal del evento, quiero acreditar a un participante en la entrada del evento, para validar su asistencia.
   - Criterio de aceptación: La acreditación marca al participante como presente; se valida que el usuario esté inscrito y el evento esté en curso.
3. Como disertante, quiero ver la lista de participantes acreditados, para conocer mi audiencia.
   - Criterio de aceptación: Solo los disertantes y organizadores del evento pueden acceder a la lista de acreditados.

### Módulo 5: Encuestas
1. Como organizador, quiero crear una encuesta de satisfacción para un evento finalizado, para recibir feedback.
   - Criterio de aceptación: La encuesta se asocia al evento; se pueden agregar preguntas de opción múltiple o abiertas.
2. Como participante, quiero responder la encuesta de un evento al que asistí, para dar mi opinión.
   - Criterio de aceptación: Solo participantes acreditados pueden responder la encuesta; se permite una sola respuesta por usuario por evento.
3. Como organizador, quiero ver los resultados de la encuesta, para evaluar la satisfacción del evento.
   - Criterio de aceptación: Los resultados se muestran de forma agregada; se exportan a formato CSV si se solicita.

### Módulo 6: Certificados
1. Como organizador, quiero generar certificados de asistencia para participantes acreditados, para validar su participación.
   - Criterio de aceptación: El certificado se genera en formato PDF; incluye nombre del participante, evento, fecha y tipo de certificado.
2. Como disertante, quiero generar un certificado de participación como expositor, para mi currículum.
   - Criterio de aceptación: El certificado se genera automáticamente para usuarios con rol de disertante en el evento.
3. Como organizador, quiero generar certificados de aprobación para participantes que cumplan con requisitos, para validar su evaluación.
   - Criterio de aceptación: Se generan certificados solo para participantes que aprueben la evaluación del evento; se registra la calificación obtenida.

### Módulo 7: Informes y Agendas
1. Como organizador, quiero generar un informe de inscripciones de un evento, para conocer la demanda.
   - Criterio de aceptación: El informe incluye total de inscritos, acreditados, cancelados y lista detallada; se exporta a PDF/Excel.
2. Como participante, quiero ver la agenda de un evento, para conocer el cronograma de actividades.
   - Criterio de aceptación: La agenda se muestra públicamente para eventos activos; incluye horarios, títulos de charlas y disertantes.
3. Como organizador, quiero generar un informe de resultados de encuestas, para evaluar el evento.
   - Criterio de aceptación: El informe incluye promedios de satisfacción y comentarios destacados; se genera solo para eventos finalizados.


---

## 3. Requisitos Funcionales y Reglas de Negocio
### Módulo 2: Gestión de Eventos
#### Requisitos Funcionales
- RF1: El sistema debe permitir el CRUD de eventos académicos.
- RF2: El sistema debe asociar un tipo de evento a cada evento creado.
- RF3: El sistema debe permitir configurar cupos mínimo y máximo por evento.
- RF4: El sistema debe establecer fecha límite de inscripción por evento.

#### Reglas de Negocio
- RN1: La fecha de inicio del evento debe ser posterior a la fecha de creación.
- RN2: La fecha límite de inscripción debe ser anterior a la fecha de inicio del evento.
- RN3: El cupo máximo no puede ser menor al cupo mínimo (si se definen ambos).
- RN4: Solo el organizador creador del evento puede editarlo o cancelarlo.

### Módulo 3: Inscripciones
#### Requisitos Funcionales
- RF1: El sistema debe permitir inscripciones autónomas para usuarios autenticados.
- RF2: El sistema debe permitir inscripciones manuales por personal del evento.
- RF3: El sistema debe validar cupo disponible y fecha límite antes de confirmar inscripción.
- RF4: El sistema debe permitir la cancelación de inscripciones por parte del usuario.

#### Reglas de Negocio
- RN1: No se permiten inscripciones si se alcanzó el cupo máximo del evento.
- RN2: No se permiten inscripciones después de la fecha límite establecida.
- RN3: Solo se puede cancelar una inscripción hasta 24 horas antes del inicio del evento.
- RN4: Un usuario no puede inscribirse dos veces al mismo evento.

### Módulo 4: Roles y Acreditación
#### Requisitos Funcionales
- RF1: El sistema debe permitir asignar roles (organizador/participante/disertante) a usuarios por evento.
- RF2: El sistema debe permitir la acreditación de participantes en el evento.
- RF3: El sistema debe listar participantes acreditados por evento.

#### Reglas de Negocio
- RN1: Un usuario puede tener diferentes roles en diferentes eventos.
- RN2: Solo personal autorizado (organizadores) puede realizar acreditaciones.
- RN3: La acreditación solo es válida para usuarios con inscripción confirmada.

### Módulo 5: Encuestas
#### Requisitos Funcionales
- RF1: El sistema debe permitir crear encuestas asociadas a eventos finalizados.
- RF2: El sistema debe permitir agregar preguntas de opción múltiple y abiertas a las encuestas.
- RF3: El sistema debe permitir a participantes acreditados responder encuestas.

#### Reglas de Negocio
- RN1: Solo participantes acreditados pueden responder encuestas del evento.
- RN2: Un participante solo puede responder una vez por evento.
- RN3: Las encuestas solo se habilitan después de la finalización del evento.

### Módulo 6: Certificados
#### Requisitos Funcionales
- RF1: El sistema debe generar certificados de asistencia para participantes acreditados.
- RF2: El sistema debe generar certificados de aprobación para participantes que cumplan requisitos.
- RF3: El sistema debe generar certificados de participación para disertantes.

#### Reglas de Negocio
- RN1: Los certificados de asistencia solo se generan para participantes con acreditación confirmada.
- RN2: Los certificados de aprobación requieren una calificación mínima definida por el organizador.
- RN3: Los certificados de participación (expositor/autor) se generan automáticamente para usuarios con rol de disertante.

### Módulo 7: Informes y Agendas
#### Requisitos Funcionales
- RF1: El sistema debe generar informes de inscripciones por evento.
- RF2: El sistema debe generar agendas de eventos con cronograma de actividades.
- RF3: El sistema debe generar informes de resultados de encuestas.

#### Reglas de Negocio
- RN1: Los informes de inscripciones solo son accesibles para organizadores del evento.
- RN2: Las agendas se muestran públicamente para eventos activos o finalizados.
- RN3: Los informes de encuestas solo se generan para eventos con encuestas cerradas.

---

## 4. Restricciones técnicas generales del proyecto
### 4.1 Stack Tecnológico
- **Frontend**: React, diseño responsive para compatibilidad con cualquier dispositivo (móvil, tablet, escritorio), cumplimiento de norma WCAG 2.1 Nivel AA para accesibilidad web (según requerimiento de interfaz accesible del escenario).
- **Backend**: Node.js con Express.js, implementación de APIs REST bajo el estándar definido en Contract.md.
- **Base de Datos**: PostgreSQL, modelado según las entidades y relaciones definidas en la sección 5.

### 4.2 Prácticas Estándar por Tecnología
#### Frontend
- Uso de componentes funcionales y hooks de React.
- Gestión de estado de autenticación mediante Context API.
- Validación de formularios en cliente antes de realizar peticiones a APIs.
- Soporte para navegadores modernos: Chrome, Firefox, Edge y Safari (últimas 2 versiones).

#### Backend
- Validación de todos los parámetros de request (tipos de datos, campos requeridos, reglas de negocio).
- Manejo de errores unificado siguiendo el formato definido en Contract.md.
- Uso de consultas parametrizadas para prevenir inyección SQL.

#### Base de Datos
- Uso de transacciones para operaciones que modifiquen múltiples tablas (ej: inscripción de participante + actualización de cupo).
- Creación de índices en columnas de búsqueda frecuente: `Usuario.email`, `Evento.fecha_inicio`, `Inscripción.id_evento`.

### 4.3 Seguridad
- Almacenamiento de contraseñas con algoritmo bcrypt (costo mínimo 10).
- Todas las comunicaciones entre cliente y servidor vía HTTPS (TLS 1.2 o superior).
- Validación de permisos por rol en todos los endpoints protegidos.

### 4.4 Rendimiento
- Tiempo de respuesta de endpoints API (excepto generación de informes) < 500 milisegundos.
- Paginación en listados que superen los 20 registros (eventos, inscripciones).

---

## 5. Modelo de datos por módulo
### Módulo 2: Gestión de Eventos
#### Entidad: TipoEvento
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_tipo_evento | INT | NOT NULL AUTO_INCREMENT | PK |
| nombre | VARCHAR(50) | NOT NULL UNIQUE | |
| descripcion | TEXT | | |

#### Entidad: Evento
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_evento | INT | NOT NULL AUTO_INCREMENT | PK |
| id_tipo_evento | INT | NOT NULL | FK (TipoEvento.id_tipo_evento) |
| titulo | VARCHAR(255) | NOT NULL | |
| descripcion | TEXT | | |
| fecha_inicio | DATETIME | NOT NULL | |
| fecha_fin | DATETIME | NOT NULL | |
| cupo_minimo | INT | | |
| cupo_maximo | INT | | |
| fecha_limite_inscripcion | DATETIME | NOT NULL | |
| estado | VARCHAR(20) | NOT NULL DEFAULT 'ACTIVO' | |

Relaciones:
- 1:N TipoEvento -> Evento (Referencia: Evento.id_tipo_evento FK)
- 1:N Evento -> Inscripción (Referencia: Inscripción.id_evento FK)
- 1:N Evento -> Encuesta (Referencia: Encuesta.id_evento FK)
- 1:N Evento -> Certificado (Referencia: Certificado.id_evento FK)
- 1:N Evento -> Informe (Referencia: Informe.id_evento FK)
- 1:N Evento -> AgendaEvento (Referencia: AgendaEvento.id_evento FK)

### Módulo 3: Inscripciones
#### Entidad: Inscripción
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_inscripcion | INT | NOT NULL AUTO_INCREMENT | PK |
| id_usuario | INT | NOT NULL | FK (Usuario.id_usuario) |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) |
| fecha_inscripcion | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| estado | VARCHAR(20) | NOT NULL DEFAULT 'CONFIRMADA' | |

Relaciones:
- N:1 Inscripción -> Usuario (Referencia: Usuario.id_usuario PK)
- N:1 Inscripción -> Evento (Referencia: Evento.id_evento PK)
- 1:N Inscripción -> Acreditación (Referencia: Acreditación.id_inscripcion FK)
- 1:N Inscripción -> Certificado (Referencia: Certificado.id_inscripcion FK)

### Módulo 4: Roles y Acreditación
#### Entidad: Rol
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_rol | INT | NOT NULL AUTO_INCREMENT | PK |
| nombre | VARCHAR(50) | NOT NULL UNIQUE | |

#### Entidad: Acreditación
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_acreditacion | INT | NOT NULL AUTO_INCREMENT | PK |
| id_inscripcion | INT | NOT NULL | FK (Inscripción.id_inscripcion) |
| fecha_acreditacion | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| estado | VARCHAR(20) | NOT NULL DEFAULT 'PRESENTE' | |

Relaciones:
- N:1 Acreditación -> Inscripción (Referencia: Inscripción.id_inscripcion PK)
- N:M Usuario_Evento_Rol (tabla intermedia):
  - id_usuario_evento_rol INT PK AUTO_INCREMENT
  - id_usuario INT NOT NULL FK (Usuario.id_usuario)
  - id_evento INT NOT NULL FK (Evento.id_evento)
  - id_rol INT NOT NULL FK (Rol.id_rol)
  - UNIQUE (id_usuario, id_evento, id_rol)

### Módulo 5: Encuestas
#### Entidad: Encuesta
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_encuesta | INT | NOT NULL AUTO_INCREMENT | PK |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) |
| titulo | VARCHAR(255) | NOT NULL | |
| fecha_apertura | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| fecha_cierre | DATETIME | | |

#### Entidad: PreguntaEncuesta
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_pregunta | INT | NOT NULL AUTO_INCREMENT | PK |
| id_encuesta | INT | NOT NULL | FK (Encuesta.id_encuesta) |
| texto_pregunta | TEXT | NOT NULL | |
| tipo_pregunta | VARCHAR(20) | NOT NULL | |

#### Entidad: RespuestaEncuesta
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_respuesta | INT | NOT NULL AUTO_INCREMENT | PK |
| id_pregunta | INT | NOT NULL | FK (PreguntaEncuesta.id_pregunta) |
| id_usuario | INT | NOT NULL | FK (Usuario.id_usuario) |
| respuesta | TEXT | NOT NULL | |
| fecha_respuesta | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |

Relaciones:
- 1:N Encuesta -> PreguntaEncuesta (Referencia: PreguntaEncuesta.id_encuesta FK)
- 1:N PreguntaEncuesta -> RespuestaEncuesta (Referencia: RespuestaEncuesta.id_pregunta FK)
- 1:N Encuesta -> Evento (Referencia: Evento.id_evento FK)
- N:1 RespuestaEncuesta -> Usuario (Referencia: Usuario.id_usuario PK)

### Módulo 6: Certificados
#### Entidad: TipoCertificado
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_tipo_certificado | INT | NOT NULL AUTO_INCREMENT | PK |
| nombre | VARCHAR(50) | NOT NULL UNIQUE | |

#### Entidad: Certificado
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_certificado | INT | NOT NULL AUTO_INCREMENT | PK |
| id_inscripcion | INT | NOT NULL | FK (Inscripción.id_inscripcion) |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) |
| id_tipo_certificado | INT | NOT NULL | FK (TipoCertificado.id_tipo_certificado) |
| fecha_emision | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| calificacion | DECIMAL(5,2) | | |

Relaciones:
- N:1 Certificado -> Inscripción (Referencia: Inscripción.id_inscripcion PK)
- N:1 Certificado -> Evento (Referencia: Evento.id_evento PK)
- N:1 Certificado -> TipoCertificado (Referencia: TipoCertificado.id_tipo_certificado PK)

### Módulo 7: Informes y Agendas
#### Entidad: Informe
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_informe | INT | NOT NULL AUTO_INCREMENT | PK |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) |
| tipo_informe | VARCHAR(50) | NOT NULL | |
| fecha_generacion | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| contenido | TEXT | NOT NULL | |

#### Entidad: AgendaEvento
| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_agenda | INT | NOT NULL AUTO_INCREMENT | PK |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) |
| hora_inicio | TIME | NOT NULL | |
| hora_fin | TIME | NOT NULL | |
| titulo_actividad | VARCHAR(255) | NOT NULL | |
| id_disertante | INT | | FK (Usuario.id_usuario) |

Relaciones:
- N:1 Informe -> Evento (Referencia: Evento.id_evento PK)
- 1:N AgendaEvento -> Evento (Referencia: Evento.id_evento PK)
- N:1 AgendaEvento -> Usuario (Referencia: Usuario.id_usuario PK, para disertante)

---

## 6. Plan de Tareas
### Tiempo Total Estimado del Proyecto
Total de días hábiles sumados de todas las tareas: 69 días hábiles → 13.8 semanas (~14 semanas totales).

### Módulo 2: Gestión de Eventos (Total: 11 días hábiles)
1. Diseño y documentación de entidades y endpoints: 3 días
2. Desarrollo de CRUD de tipos de evento: 1 día
3. Desarrollo de CRUD de eventos: 3 días
4. Validación de reglas de negocio (fechas, cupos): 1 día
5. Pruebas unitarias y de integración: 3 días

### Módulo 3: Inscripciones (Total: 9 días hábiles)
1. Diseño y documentación de entidades y endpoints: 2 días
2. Desarrollo de inscripción autónoma: 2 días
3. Desarrollo de inscripción manual por personal: 2 días
4. Desarrollo de cancelación de inscripciones: 1 día
5. Pruebas unitarias y de integración: 2 días

### Módulo 4: Roles y Acreditación (Total: 8 días hábiles)
1. Diseño y documentación de entidades y endpoints: 2 días
2. Desarrollo de asignación de roles: 2 días
3. Desarrollo de acreditación de participantes: 2 días
4. Pruebas unitarias y de integración: 2 días

### Módulo 5: Encuestas (Total: 8 días hábiles)
1. Diseño y documentación de entidades y endpoints: 2 días
2. Desarrollo de creación de encuestas y preguntas: 2 días
3. Desarrollo de respuestas a encuestas: 2 días
4. Pruebas unitarias y de integración: 2 días

### Módulo 6: Certificados (Total: 9 días hábiles)
1. Diseño y documentación de entidades y endpoints: 2 días
2. Desarrollo de generación de certificados por tipo: 3 días
3. Desarrollo de exportación a PDF: 2 días
4. Pruebas unitarias y de integración: 2 días

### Módulo 7: Informes y Agendas (Total: 9 días hábiles)
1. Diseño y documentación de entidades y endpoints: 2 días
2. Desarrollo de generación de informes: 3 días
3. Desarrollo de creación de agendas: 2 días
4. Pruebas unitarias y de integración: 2 días

---

## 7. Estrategia de Verificación

### Módulo 2: Gestión de Eventos
- **Tipo de Prueba**: Unitarias (validación de fechas/cupos), Integración (CRUD BD), Aceptación (organizador)
- **Alcance**: Creación, edición, cancelación de eventos, configuración de cupos y fechas
- **Criterio de Aceptación**: Eventos se crean con estado "ACTIVO"; reglas de fechas y cupos se validan correctamente.
- **Criterio de Rechazo**: Permite fecha límite de inscripción posterior a fecha de inicio; cupo máximo menor a mínimo.
- **Casos de Prueba de Ejemplo**:
  1. Crear evento con fecha límite > fecha inicio → Espera error 400 con mensaje "FECHA_LIMITE_INVALIDA"
  2. Editar evento con inscripciones confirmadas → Espera error 400 con mensaje "EVENTO_CON_INSCRIPCIONES"
  3. Cancelar evento → Espera estado "CANCELADO" y notificación a inscritos

### Módulo 3: Inscripciones
- **Tipo de Prueba**: Unitarias (validación de cupos/fechas), Integración (BD), Aceptación (usuario/participante)
- **Alcance**: Inscripción autónoma/manual, cancelación, validación de cupos
- **Criterio de Aceptación**: Inscripciones solo se confirman si hay cupo y dentro de fecha límite; cancelación libera cupo.
- **Criterio de Rechazo**: Permite inscripción con cupo lleno; permite cancelación después de fecha límite.
- **Casos de Prueba de Ejemplo**:
  1. Inscribir a usuario cuando cupo máximo alcanzado → Espera error 400 con mensaje "CUPO_LLENO"
  2. Inscribir después de fecha límite → Espera error 400 con mensaje "FECHA_LIMITE_EXPIRADA"
  3. Cancelar inscripción 12 horas antes del evento → Espera error 400 con mensaje "CANCELACION_NO_PERMITIDA"

### Módulo 4: Roles y Acreditación
- **Tipo de Prueba**: Unitarias (asignación de roles), Integración (BD), Aceptación (organizador)
- **Alcance**: Asignación de roles, acreditación de participantes, listado de acreditados
- **Criterio de Aceptación**: Roles se asignan correctamente; acreditación solo para inscritos.
- **Criterio de Rechazo**: Permite asignar rol a usuario no inscrito; acreditación sin inscripción válida.
- **Casos de Prueba de Ejemplo**:
  1. Asignar rol de disertante a usuario no inscrito → Espera error 400 con mensaje "USUARIO_NO_INSCRITO"
  2. Acreditar usuario no inscrito → Espera error 400 con mensaje "INSCRIPCION_NO_VALIDA"
  3. Listar acreditados → Espera lista solo con usuarios con acreditación confirmada

### Módulo 5: Encuestas
- **Tipo de Prueba**: Unitarias (creación de encuestas), Integración (BD), Aceptación (organizador/participante)
- **Alcance**: Creación de encuestas, respuestas, visualización de resultados
- **Criterio de Aceptación**: Encuestas solo para eventos finalizados; respuestas solo para acreditados.
- **Criterio de Rechazo**: Permite responder encuesta sin acreditación; permite múltiples respuestas por usuario.
- **Casos de Prueba de Ejemplo**:
  1. Crear encuesta para evento no finalizado → Espera error 400 con mensaje "EVENTO_NO_FINALIZADO"
  2. Responder encuesta sin acreditación → Espera error 400 con mensaje "NO_ACREDITADO"
  3. Responder encuesta dos veces → Espera error 400 con mensaje "ENCUESTA_YA_RESPONDIDA"

### Módulo 6: Certificados
- **Tipo de Prueba**: Unitarias (generación de certificados), Integración (BD), Aceptación (organizador/participante)
- **Alcance**: Generación de certificados por tipo, exportación a PDF
- **Criterio de Aceptación**: Certificados se generan solo para usuarios con requisitos cumplidos; PDF válido.
- **Criterio de Rechazo**: Genera certificado de asistencia para usuario no acreditado; PDF corrupto.
- **Casos de Prueba de Ejemplo**:
  1. Generar certificado de asistencia para usuario no acreditado → Espera error 400 con mensaje "NO_ACREDITADO"
  2. Generar certificado de aprobación sin calificación mínima → Espera error 400 con mensaje "CALIFICACION_INSUFICIENTE"
  3. Descargar certificado en PDF → Espera archivo PDF válido con datos correctos

### Módulo 7: Informes y Agendas
- **Tipo de Prueba**: Unitarias (generación de informes), Integración (BD), Aceptación (organizador)
- **Alcance**: Generación de informes de inscripciones/encuestas, creación de agendas
- **Criterio de Aceptación**: Informes incluyen todos los datos requeridos; agendas se muestran correctamente.
- **Criterio de Rechazo**: Informe de inscripciones no incluye total de acreditados; agenda muestra eventos cancelados.
- **Casos de Prueba de Ejemplo**:
  1. Generar informe de inscripciones para evento sin inscritos → Espera informe con total 0
  2. Crear agenda para evento cancelado → Espera error 400 con mensaje "EVENTO_CANCELADO"
  3. Exportar informe a Excel → Espera archivo Excel válido con datos correctos

