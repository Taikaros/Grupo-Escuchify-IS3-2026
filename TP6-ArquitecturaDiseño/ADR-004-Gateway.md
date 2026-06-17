Título: ADR-004 Implementación de API Gateway para Catálogo Público

Estado: Propuesto — Fecha: 2026-06-16
Decisores: Grupo Escuchify
Relacionado: TP2-SDD/Contract.md, TP5-Docker/docker-compose.yml, TP4-Riesgo/Gestion-Riesgo.md (riesgo R1)

Contexto

- Escuchify es un monolito Node.js/Express con 8 módulos en un solo proceso.
- El módulo Catálogo Público es el único con acceso público sin autenticación y se espera que reciba alta carga de consultas (listado y filtrado de eventos).
- Actualmente no hay separación: todas las rutas (/api/v1/*) se sirven desde el mismo Express, sin rate limiting, sin caché y sin posibilidad de escalar el catálogo independientemente.
- El middleware de autenticación JWT (verificarToken.js) está acoplado en cada módulo privado, pero no hay un punto central de enforcement.
- El análisis de riesgo (TP4) identificó la falta de rate limiting como riesgo (R1).

Decisión

- Implementar un API Gateway (NGINX) como punto de entrada único que centralice enrutamiento, autenticación, autorización y rate limiting.
- Alcance: cubre el enrutamiento hacia todos los módulos, la validación centralizada de JWT y rate limiting diferenciado (público vs autenticado). No cubre descubrimiento de servicios ni balanceo de carga avanzado.

Alternativas consideradas

- Opción A (NGINX reverse proxy): liviano, alto rendimiento, fácil configuración, gran ecosistema. Contras: configuración declarativa, requiere reinicio para algunos cambios.
- Opción B (Express Gateway): basado en Node.js (mismo stack), plugins de rate limiting y auth. Contras: menor rendimiento que NGINX, comunidad más pequeña.
- Opción C (Kong Gateway): muy completo (rate limiting, auth, logging, analytics). Contras: sobredimensionado para el proyecto, requiere PostgreSQL adicional.
- Opción D (Service Mesh - Istio): control granular de tráfico, mTLS. Contras: sobreingeniería total para el alcance académico.

Consecuencias

- Beneficios esperados: Catálogo Público escalable horizontalmente; seguridad centralizada (auth + rate limiting); desacoplamiento de módulos; facilita migración futura a microservicios.
- Costos o riesgos que se aceptan: latencia adicional de red (~1-5ms); nuevo componente a configurar y mantener; los módulos deben extraerse a procesos/servicios independientes.
- Impacto en operación y equipo: el docker-compose.yml debe modificarse para incluir NGINX como servicio y cada módulo como servicio separado; los tests de integración deben considerar el gateway.

Plan de implementación

- Pasos mínimos:
  1. Extraer el módulo Catálogo Público a un servicio Express independiente con su propio Dockerfile.
  2. Configurar NGINX con enrutamiento (/api/v1/catalogo/* → catalogo:3001), rate limiting (100 req/min público, 1000 req/min autenticado) y validación JWT.
  3. Actualizar docker-compose.yml con servicios: nginx, catalogo, app (resto de módulos), db.
  4. Verificar que las rutas existentes funcionan a través del gateway.
  5. Agregar pruebas de integración contra el gateway.
- Dependencias: Docker, NGINX (imagen oficial nginx:alpine).
- Métrica de éxito: el Catálogo Público puede escalarse a 3+ réplicas sin impacto en los demás módulos; el gateway responde con <10ms de overhead.

Triggers de revisión

- Cuando otro módulo requiera escalado independiente.
- Si el rendimiento del gateway se vuelve cuello de botella.
- Si se adopta un enfoque de microservicios completo.
- Fecha sugerida de revisión: 2026-08-16.
