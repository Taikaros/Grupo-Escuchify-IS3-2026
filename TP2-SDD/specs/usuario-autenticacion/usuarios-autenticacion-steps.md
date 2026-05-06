# Steps - Módulo Usuarios y Autenticación

- **Specs**: `./TP2-SDD/specs/usuario-autenticacion/usuarios-autenticacion.md`
- **Contract**: `./TP2-SDD/Contract.md` (Módulo 1)
- **Stack**: React (Frontend), Node.js/Express (Backend), PostgreSQL (BD)

---

## 1. Diseño y documentación de entidades y endpoints (3 días)

| Step | Descripción | Archivos afectados | Detalles técnicos | Criterio de completitud |
|------|-------------|-------------------|-------------------|----------------------|
| 1.1 | Crear tabla Usuario en PostgreSQL | `src/backend/migrations/001_create_usuarios.sql` | `CREATE TABLE Usuario (id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, nombre VARCHAR(100) NOT NULL, apellido VARCHAR(100) NOT NULL, fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, activo BOOLEAN NOT NULL DEFAULT TRUE);` | Tabla creada con todas las restricciones, verificado vía `psql` |
| 1.2 | Crear índice en Usuario.email | `src/backend/migrations/002_create_usuario_index.sql` | `CREATE INDEX idx_usuario_email ON Usuario(email);` | Índice creado, verificado con `\d Usuario` en psql |
| 1.3 | Documentar endpoints en formato Contract.md | `./TP2-SDD/Contract.md` | Validar endpoints: POST `/api/v1/usuarios/registro`, POST `/api/v1/usuarios/login`, GET `/api/v1/usuarios/{id_usuario}`, PUT `/api/v1/usuarios/{id_usuario}` | Endpoints documentados con request/response JSON y códigos HTTP |
| 1.4 | Definir esquemas de validación | `src/backend/validators/usuarioValidator.js` | Registro: email único, password (mín 8 chars, mayús/minús/núms). Login: email/password requeridos. Edición: nombre/apellido requeridos, password opcional | Esquemas validan todos los campos según RF y RN (RN1: email único) |

---

## 2. Desarrollo de registro de usuarios (2 días)

| Step | Descripción | Archivos afectados | Detalles técnicos | Criterio de completitud |
|------|-------------|-------------------|-------------------|----------------------|
| 2.1 | Endpoint POST /api/v1/usuarios/registro | `src/backend/routes/usuarioRoutes.js`, `src/backend/controllers/usuarioController.js` | Validar request con esquema 1.4, verificar email único (RN1), hashear password con bcrypt costo 10 (RN3), insertar en BD | Retorna 201 con `{id_usuario, email}`, 400 si falla validación, 409 si email duplicado ("EMAIL_DUPLICADO") |
| 2.2 | Formulario de registro en React | `src/frontend/src/components/Auth/Registro.jsx`, `src/frontend/src/context/AuthContext.js` | Campos: email, password, nombre, apellido. Validación cliente antes de request. Context API para estado de autenticación | Formulario muestra errores, registra usuario exitosamente y redirige a login |

---

## 3. Desarrollo de inicio de sesión y generación de tokens (2 días)

| Step | Descripción | Archivos afectados | Detalles técnicos | Criterio de completitud |
|------|-------------|-------------------|-------------------|----------------------|
| 3.1 | Endpoint POST /api/v1/usuarios/login | `src/backend/routes/usuarioRoutes.js`, `src/backend/controllers/usuarioController.js` | Validar email y password, buscar usuario por email, verificar password hash con bcrypt, generar JWT token con id_usuario y email | Retorna 200 con `{token, id_usuario}`, 401 si credenciales inválidas ("CREDENCIALES_INVALIDAS") |
| 3.2 | Frontend: Login y persistencia de token | `src/frontend/src/components/Auth/Login.jsx`, `src/frontend/src/context/AuthContext.js` | Almacenar token en localStorage tras login, configurar Interceptor para enviar token en headers, redirigir a dashboard tras login (HU2) | Login exitoso guarda token, redirige a dashboard; login fallido muestra error |

---

## 4. Desarrollo de edición de perfil (1 día)

| Step | Descripción | Archivos afectados | Detalles técnicos | Criterio de completitud |
|------|-------------|-------------------|-------------------|----------------------|
| 4.1 | Endpoint GET /api/v1/usuarios/{id_usuario} | `src/backend/routes/usuarioRoutes.js`, `src/backend/controllers/usuarioController.js` | Validar que usuario existe, retornar `{id_usuario, email, nombre, apellido, fecha_registro}` (sin password_hash) | Retorna 200 con datos de perfil, 404 si usuario no existe |
| 4.2 | Endpoint PUT /api/v1/usuarios/{id_usuario} | `src/backend/routes/usuarioRoutes.js`, `src/backend/controllers/usuarioController.js` | Validar que id_usuario del token coincide con el de la ruta, si se proporciona password validar y hashear con bcrypt, actualizar datos en BD | Retorna 200 con `{mensaje: "Perfil actualizado"}`, 400 si validación falla, 404 si no existe |
| 4.3 | Frontend: Formulario de edición de perfil | `src/frontend/src/components/Auth/EditarPerfil.jsx` | Pre-cargar datos actuales del usuario, validar nueva contraseña si se cambia (mín 8 chars, mayús/minús/núms), Context API para datos de usuario autenticado | Formulario permite editar datos, valida contraseña, guarda cambios exitosamente |

---

## 5. Pruebas unitarias y de integración (2 días)

| Step | Descripción | Casos de Prueba | Archivos afectados | Criterio de completitud |
|------|-------------|-----------------|-------------------|----------------------|
| 5.1 | Pruebas unitarias - Registro | 1. Registrar con email duplicado → 400 "EMAIL_DUPLICADO"<br>2. Registrar con contraseña de 6 caracteres → 400 "CONTRASEÑA_INVALIDA"<br>3. Registro exitoso → 201 con id_usuario y email | `src/backend/tests/usuarioRegistro.test.js` | Todos los casos pasan, cobertura > 80% |
| 5.2 | Pruebas unitarias - Login | 1. Login con credenciales incorrectas → 401 "CREDENCIALES_INVALIDAS"<br>2. Login con usuario no existente → 401 "CREDENCIALES_INVALIDAS"<br>3. Login exitoso → 200 con token y id_usuario | `src/backend/tests/usuarioLogin.test.js` | Todos los casos pasan, token JWT válido generado |
| 5.3 | Pruebas de integración - BD | 1. Usuario insertado tiene password hasheado (no texto plano, RN3)<br>2. Email único se respeta en BD (RN1)<br>3. Edición de perfil actualiza datos correctamente | `src/backend/tests/usuarioIntegracion.test.js` | Todas las operaciones BD funcionan según RF y RN |
| 5.4 | Pruebas de edición de perfil | 1. Editar con contraseña de 6 caracteres → 400 "CONTRASEÑA_INVALIDA"<br>2. Editar perfil de otro usuario → 403 (no autorizado)<br>3. Edición exitosa → 200 "Perfil actualizado" | `src/backend/tests/usuarioEdicion.test.js` | Todos los casos pasan, permisos validados correctamente |
| 5.5 | Verificación de criterios de aceptación (HU1, HU2, HU3) | - HU1: Registro con email válido y contraseña segura, email único ✓<br>- HU2: Login genera token, redirige a dashboard ✓<br>- HU3: Edición de nombre, apellido y contraseña validada ✓ | `src/backend/tests/usuarioAceptacion.test.js` | Todas las HU cumplen con sus criterios de aceptación según specs sección 2 |
