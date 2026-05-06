# Especificación de Módulo: Usuarios y Autenticación

## 1. Descripción del Módulo
Gestión de registro, inicio de sesión y perfiles de usuarios. Entidad original: `Usuario`.

## 2. Historias de Usuario y Criterios de Aceptación

### HU1: Registro de Usuario
**Como** participante,  
**Quiero** registrarme en la plataforma,  
**Para** poder inscribirme a eventos.

**Criterio de aceptación**: El usuario puede crear una cuenta con email válido y contraseña segura; el email debe ser único.

### HU2: Inicio de Sesión
**Como** usuario,  
**Quiero** iniciar sesión en la plataforma,  
**Para** acceder a mis inscripciones y datos personales.

**Criterio de aceptación**: El login con email y contraseña correctos genera un token de sesión y redirige al dashboard del usuario.

### HU3: Edición de Perfil
**Como** usuario,  
**Quiero** editar mi perfil personal,  
**Para** mantener mis datos actualizados.

**Criterio de aceptación**: El usuario puede modificar su nombre, apellido y contraseña; se valida que la nueva contraseña cumpla con las reglas de seguridad.

## 3. Requisitos Funcionales

| ID | Descripción |
|----|-------------|
| RF1 | El sistema debe permitir el registro de usuarios con email único. |
| RF2 | El sistema debe validar que la contraseña tenga mínimo 8 caracteres, mayúsculas, minúsculas y números. |
| RF3 | El sistema debe permitir el inicio de sesión con email y contraseña. |
| RF4 | El sistema debe permitir la edición de datos personales del usuario. |

## 4. Reglas de Negocio

| ID | Regla |
|----|-------|
| RN1 | El email de usuario debe ser único en todo el sistema. |
| RN2 | Solo usuarios autenticados pueden realizar inscripciones a eventos. |
| RN3 | Las contraseñas se almacenan en formato hash (no texto plano). |

## 5. Modelo de Datos

### Entidad: Usuario

| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_usuario | INT | NOT NULL AUTO_INCREMENT | PK |
| email | VARCHAR(255) | NOT NULL UNIQUE | |
| password_hash | VARCHAR(255) | NOT NULL | |
| nombre | VARCHAR(100) | NOT NULL | |
| apellido | VARCHAR(100) | NOT NULL | |
| fecha_registro | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| activo | BOOLEAN | NOT NULL DEFAULT TRUE | |

**Relaciones**:
- 1:N Usuario -> Inscripción (Referencia: Inscripción.id_usuario FK)

## 6. Plan de Tareas (Total: 10 días hábiles)

| # | Tarea | Días estimados |
|---|-------|----------------|
| 1 | Diseño y documentación de entidades y endpoints | 3 días |
| 2 | Desarrollo de registro de usuarios | 2 días |
| 3 | Desarrollo de inicio de sesión y generación de tokens | 2 días |
| 4 | Desarrollo de edición de perfil | 1 día |
| 5 | Pruebas unitarias y de integración | 2 días |

## 7. Estrategia de Verificación

- **Tipo de Prueba**: Unitarias (lógica de registro/login), Integración (conexión BD), Aceptación (usuario final)
- **Alcance**: Registro, login, edición de perfil, validación de email único

### Criterios
- **Aceptación**: Todas las funcionalidades cumplen con los requisitos definidos; no hay vulnerabilidades de seguridad en contraseñas.
- **Rechazo**: Falla en validación de email único; contraseñas almacenadas en texto plano; login permite credenciales incorrectas.

### Casos de Prueba de Ejemplo

| # | Caso de Prueba | Resultado Esperado |
|---|----------------|--------------------|
| 1 | Registrar usuario con email duplicado | Error 400 con mensaje "EMAIL_DUPLICADO" |
| 2 | Login con contraseña incorrecta | Error 401 con mensaje "CREDENCIALES_INVALIDAS" |
| 3 | Editar perfil con contraseña de 6 caracteres | Error 400 con mensaje "CONTRASEÑA_INVALIDA" |

## 8. Restricciones Técnicas

### Seguridad
- Almacenamiento de contraseñas con algoritmo bcrypt (costo mínimo 10).
- Todas las comunicaciones entre cliente y servidor vía HTTPS (TLS 1.2 o superior).
- Validación de permisos por rol en todos los endpoints protegidos.

### Frontend
- Gestión de estado de autenticación mediante Context API.
- Validación de formularios en cliente antes de realizar peticiones a APIs.

### Backend
- Validación de todos los parámetros de request (tipos de datos, campos requeridos, reglas de negocio).
- Manejo de errores unificado siguiendo el formato definido en Contract.md.
- Uso de consultas parametrizadas para prevenir inyección SQL.

### Base de Datos
- Creación de índices en columnas de búsqueda frecuente: `Usuario.email`.
- Uso de transacciones para operaciones que modifiquen múltiples tablas.
