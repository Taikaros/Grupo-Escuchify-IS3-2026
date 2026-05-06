# Especificación de Módulo: Catálogo Público

## 1. Descripción del Módulo
Visualización pública de eventos con filtros (futuros/pasados). No tiene entidades originales, consulta la entidad `Evento` del módulo Gestión de Eventos vía endpoints REST.

## 2. Historias de Usuario y Criterios de Aceptación

### HU1: Listado de Eventos Públicos
**Como** usuario no autenticado,  
**Quiero** ver el listado de eventos públicos,  
**Para** encontrar eventos de interés.

**Criterio de aceptación**: El listado muestra todos los eventos activos con título, tipo, fecha y descripción breve.

### HU2: Filtro por Fecha
**Como** usuario,  
**Quiero** filtrar eventos por fecha (futuros/pasados),  
**Para** encontrar eventos según mi disponibilidad.

**Criterio de aceptación**: El filtro muestra solo eventos con fecha de inicio mayor o igual a hoy (futuros) o menor a hoy (pasados).

### HU3: Búsqueda por Tipo
**Como** usuario,  
**Quiero** buscar eventos por tipo,  
**Para** encontrar eventos de una categoría específica.

**Criterio de aceptación**: El buscador filtra eventos por el tipo seleccionado (curso, jornada, congreso, etc).

## 3. Requisitos Funcionales

| ID | Descripción |
|----|-------------|
| RF1 | El sistema debe mostrar listado público de todos los eventos activos. |
| RF2 | El sistema debe permitir filtrar eventos por fecha (futuros/pasados). |
| RF3 | El sistema debe permitir filtrar eventos por tipo. |

## 4. Reglas de Negocio

| ID | Regla |
|----|-------|
| RN1 | Solo se muestran eventos con estado "ACTIVO" o "FINALIZADO" en el catálogo. |
| RN2 | Los eventos cancelados no aparecen en el catálogo público. |
| RN3 | El filtro de eventos futuros muestra eventos con fecha de inicio >= fecha actual. |

## 5. Modelo de Datos

### Entidad: Catálogo Público
No tiene entidades originales. Consulta la entidad `Evento` del módulo Gestión de Eventos vía endpoints REST definidos en Contract.md.

**Campos mostrados del Evento**:
- id_evento
- titulo
- tipo (TipoEvento.nombre)
- fecha_inicio
- descripcion (breve)

## 6. Plan de Tareas (Total: 5 días hábiles)

| # | Tarea | Días estimados |
|---|-------|----------------|
| 1 | Diseño y documentación de endpoints | 1 día |
| 2 | Desarrollo de listado público de eventos | 2 días |
| 3 | Desarrollo de filtros (fecha, tipo) | 1 día |
| 4 | Pruebas unitarias y de integración | 1 día |

## 7. Estrategia de Verificación

- **Tipo de Prueba**: Unitarias (filtros), Integración (consulta a Gestión de Eventos), Aceptación (usuario no autenticado)
- **Alcance**: Listado público, filtros por fecha/tipo

### Criterios
- **Aceptación**: Listado muestra solo eventos activos/finalizados; filtros funcionan correctamente.
- **Rechazo**: Muestra eventos cancelados; filtro de futuros muestra eventos pasados.

### Casos de Prueba de Ejemplo

| # | Caso de Prueba | Resultado Esperado |
|---|----------------|--------------------|
| 1 | Ver catálogo | Lista sin eventos cancelados |
| 2 | Filtrar eventos futuros | Solo eventos con fecha inicio >= hoy |
| 3 | Filtrar por tipo "Congreso" | Solo eventos de tipo Congreso |

## 8. Restricciones Técnicas

### Rendimiento
- Tiempo de carga de la página de catálogo público < 2 segundos (especificado en Project.md sección 4.4).
- Tiempo de respuesta de endpoints API < 500 milisegundos.
- Paginación en listados que superen los 20 registros.

### Frontend
- Uso de componentes funcionales y hooks de React.
- Diseño responsive para compatibilidad con cualquier dispositivo (móvil, tablet, escritorio).
- Cumplimiento de norma WCAG 2.1 Nivel AA para accesibilidad web.
- Soporte para navegadores modernos: Chrome, Firefox, Edge y Safari (últimas 2 versiones).

### Dependencias
- **Gestión de Eventos**: Consulta de eventos activos/finalizados vía endpoints REST.
- No tiene acceso directo a base de datos de otros módulos.

### Endpoints (según Contract.md)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/v1/catalogo/eventos | Listar eventos públicos |
| GET | /api/v1/catalogo/eventos?filtro=futuros | Filtrar eventos futuros |
| GET | /api/v1/catalogo/eventos?filtro=pasados | Filtrar eventos pasados |
| GET | /api/v1/catalogo/eventos?tipo={id_tipo_evento} | Filtrar por tipo |

### Manejo de Errores
- Todos los errores devuelven un objeto JSON: `{"error": "{{CODIGO_ERROR}}", "message": "{{DESCRIPCION}}"}`
- Códigos HTTP: 200 (OK)
