# Steps - Módulo Catálogo Público

- **Specs**: `./TP2-SDD/specs/catalogo-publico/catalogo-publico.md`
- **Contract**: `./TP2-SDD/Contract.md` (Módulo 8)
- **Stack**: React (Frontend), Node.js/Express (Backend), PostgreSQL (BD - vía Gestión de Eventos)

---

## 1. Diseño y documentación de endpoints (1 día)

| Step | Descripción | Archivos afectados | Detalles técnicos | Criterio de completitud |
|------|-------------|-------------------|-------------------|----------------------|
| 1.1 | Verificar endpoints en Contract.md | `./TP2-SDD/Contract.md` | Validar endpoints: GET `/api/v1/catalogo/eventos`, `?filtro=futuros`, `?filtro=pasados`, `?tipo={id}` | Endpoints documentados con request/response JSON y códigos HTTP |
| 1.2 | Definir tipos de respuesta JSON | `src/frontend/src/services/catalogoService.js` | Response: `[{"id_evento", "titulo", "tipo", "fecha_inicio"}]` | Respuesta coincide con Contract.md y specs sección 5 |
| 1.3 | Configurar paginación | `src/frontend/src/components/Catalogo/CatalogoList.jsx` | Paginación para >20 registros (specs sección 8) | Lista implementa paginación o scroll infinito |

---

## 2. Desarrollo de listado público de eventos (2 días)

| Step | Descripción | Archivos afectados | Detalles técnicos | Criterio de completitud |
|------|-------------|-------------------|-------------------|----------------------|
| 2.1 | Frontend: Componente Catálogo | `src/frontend/src/components/Catalogo/CatalogoList.jsx`, `src/frontend/src/pages/CatalogoPage.jsx` | React hooks, diseño responsive, WCAG 2.1 AA, navegadores modernos | Componente renderiza lista, diseño responsive validado |
| 2.2 | Consumo de API /api/v1/catalogo/eventos | `src/frontend/src/services/catalogoService.js` | Fetch GET, mostrar solo estados ACTIVO/FINALIZADO (RN1), excluir CANCELADO (RN2) | Lista muestra solo eventos activos/finalizados |
| 2.3 | Validar exclusión de eventos cancelados | `src/frontend/src/services/catalogoService.js` | Validar RN2: eventos cancelados no aparecen | Prueba manual: evento cancelado no aparece en catálogo |
| 2.4 | Mostrar campos requeridos | `src/frontend/src/components/Catalogo/EventoCard.jsx` | id_evento, titulo, tipo, fecha_inicio, descripcion breve (HU1, specs 5) | Cada evento muestra título, tipo, fecha y descripción breve |

---

## 3. Desarrollo de filtros (fecha, tipo) (1 día)

| Step | Descripción | Archivos afectados | Detalles técnicos | Criterio de completitud |
|------|-------------|-------------------|-------------------|----------------------|
| 3.1 | Filtro por fecha (futuros/pasados) | `src/frontend/src/components/Catalogo/FiltrosFecha.jsx`, `src/frontend/src/services/catalogoService.js` | `?filtro=futuros` → fecha_inicio >= hoy (RN3), `?filtro=pasados` → fecha_inicio < hoy (HU2) | Filtro futuros muestra eventos con fecha >= hoy, pasados < hoy |
| 3.2 | Filtro por tipo de evento | `src/frontend/src/components/Catalogo/FiltroTipo.jsx`, `src/frontend/src/services/catalogoService.js` | `?tipo={id_tipo_evento}` (HU3), obtener tipos de GET `/api/v1/tipos-evento` | Select de tipos filtra eventos por tipo seleccionado |
| 3.3 | Frontend: Controles de filtrado | `src/frontend/src/pages/CatalogoPage.jsx` | Select para tipo, botones para fecha, actualización dinámica de lista | Cambios en filtros actualizan lista sin recargar página |

---

## 4. Pruebas unitarias y de integración (1 día)

| Step | Descripción | Casos de Prueba | Archivos afectados | Criterio de completitud |
|------|-------------|-----------------|-------------------|----------------------|
| 4.1 | Pruebas unitarias - Listado | 1. Ver catálogo → lista sin eventos cancelados (RN2)<br>2. Solo ACTIVO/FINALIZADO aparecen (RN1)<br>3. Campos: título, tipo, fecha, descripción (HU1) | `src/frontend/src/tests/catalogoList.test.js` | Todos los casos pasan, cobertura > 80% |
| 4.2 | Pruebas unitarias - Filtro fecha | 1. Filtro futuros → fecha_inicio >= hoy (RN3)<br>2. Filtro pasados → fecha_inicio < hoy (HU2) | `src/frontend/src/tests/catalogoFiltros.test.js` | Filtros de fecha funcionan correctamente |
| 4.3 | Pruebas unitarias - Filtro tipo | 1. Filtro "Congreso" → solo eventos de tipo Congreso (HU3)<br>2. Filtro "Curso" → solo eventos de tipo Curso | `src/frontend/src/tests/catalogoFiltros.test.js` | Filtro por tipo funciona correctamente |
| 4.4 | Pruebas de rendimiento | 1. Tiempo carga < 2 seg (specs 8, Project.md 4.4)<br>2. Tiempo respuesta API < 500ms (specs 8)<br>3. Paginación >20 registros | `src/frontend/src/tests/catalogoPerformance.test.js` | Tiempos dentro de límites establecidos |
| 4.5 | Verificación criterios HU1, HU2, HU3 | - HU1: Listado eventos activos con campos ✓<br>- HU2: Filtro fecha según disponibilidad ✓<br>- HU3: Búsqueda por tipo ✓ | `src/frontend/src/tests/catalogoAceptacion.test.js` | Todas las HU cumplen criterios de aceptación (specs 2) |
