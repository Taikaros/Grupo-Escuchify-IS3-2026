Título: ADR-002 Nextjs
Estado: Aceptado
Fecha: 2026-06-16
Decisores: Lang Stephan Emmanuel, Cañete Franco Neyen, Garda Morel Lucas Valentino, Sosa Hugo Alberto Gabriel
Relacionado: TP6-ArquitecturaDiseño, decisión de stack frontend
Contexto
- Escuchify requiere una interfaz web moderna, rápida y con buena experiencia de usuario que sirva contenido público (eventos, certificados) con buen posicionamiento SEO.
- Se necesita renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG) para optimizar tiempos de carga y visibilidad en buscadores.
- El equipo posee experiencia previa en JavaScript/TypeScript, lo que reduce la curva de aprendizaje.
- Restricciones: proyecto académico con recursos limitados, necesidad de prototipado rápido, despliegue orientado a contenedores Docker o plataformas serverless.
Decisión
- Adoptar Next.js 14+ (con React) como framework frontend de Escuchify.
- Alcance: desarrollo de interfaz de usuario, enrutamiento (App Router), SSR/SSG, API routes ligeras para integración con el backend.
- No cubre: lógica de negocio del backend principal, persistencia en base de datos, autenticación delegada.
Alternativas consideradas
- React sin Next.js (Vite + React Router): pro—flexibilidad total, ecosistema maduro. contra—requiere configurar SSR, SEO y routing manualmente, mayor esfuerzo de mantenimiento.
- Vue.js + Nuxt: pro—experiencia similar a Next.js, SSR nativo. contra—el equipo tiene menor familiaridad con Vue, comunidad más pequeña en el contexto regional.
- Angular: pro—framework completo y opinionado. contra—sobreingeniería para el alcance del proyecto, curva de aprendizaje alta, tiempos de desarrollo más largos.
- Svelte + SvelteKit: pro—rendimiento excepcional, bundle size reducido. contra—comunidad y ecosistema reducidos, menos recursos educativos y bibliotecas de terceros.
Consecuencias
- Beneficios esperados: SSR/SSG out of the box, App Router moderno con soporte de layouts anidados, React Server Components, tipado nativo con TypeScript, despliegue optimizado en Vercel o Docker, ecosistema maduro de bibliotecas y herramientas.
- Costos o riesgos que se aceptan: dependencia del ecosistema React/Next.js, posibles breaking changes en versiones mayores, build times que pueden incrementarse con el tamaño del proyecto.
- Impacto en operación y equipo: el equipo debe familiarizarse con App Router, Server Components y el modelo de server actions; se requiere formación inicial de 1-2 semanas.
Plan de implementación
- Inicializar proyecto con create-next-app y configuración TypeScript.
- Definir estructura de rutas usando App Router (agrupación por módulos: auth, eventos, certificados, perfil).
- Configurar estrategia de renderizado (SSR para páginas dinámicas, SSG para contenido estático).
- Integrar API backend mediante fetch nativo o axios.
- Configurar variables de entorno para distintos entornos (dev, staging, prod).
- Desplegar en contenedor Docker o Vercel según definición del equipo de infraestructura.
- Métrica de éxito: tiempo de carga inicial < 2s, Lighthouse score > 85, cobertura de rutas implementadas al 100%.
Triggers de revisión
- Cambios breaking en Next.js o React que requieran migración de arquitectura.
- Necesidad de funcionalidades no soportadas por el framework actual (ej: WebSockets nativos, serverless edge avanzado).
- Cambio en los requisitos de SEO o rendimiento que el stack actual no pueda satisfacer.
- Fecha sugerida de revisión: 2026-12-16