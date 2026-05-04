**📘 Guía de Ayuda - Trabajo Práctico Nº 2 (SDD)**

¡Hola equipo! Esta guía centraliza toda la información necesaria para trabajar en el Plan de Diseño de Software (SDD) de forma organizada, siguiendo los estándares de la cátedra y las reglas de este repositorio.  

# 🚀 1. Flujo de Trabajo (GitFlow)
Para evitar conflictos y asegurar la calidad de la documentación, aplicaremos este protocolo estrictamente:

**Sincronizar**: Asegúrate de tener lo último de la rama de desarrollo.
```bash
git checkout sdd-development
git pull origin sdd-development
```
2. **Crear Rama Propia:** No trabajes directamente en `sdd-development`. Crea una rama específica para tus tareas.
   ```bash
   git checkout -b feat-specs-[tu-nombre]

**Trabajar y Subir:** Realiza tus cambios en tu rama local, haz el commit y súbela al servidor.
```bash
    git add .
    git commit -m "docs: completar specs del módulo [nombre]"
    git push origin feat-specs-[tu-nombre]
```
**Abrir Pull Request (PR):** En la web de GitHub, abre un PR cuya base sea la rama `sdd-development`.

IMPORTANTE: Asígname como Reviewer (`@Taikaros`).  

 * ***Nota**: No podrás fusionar (merge) los cambios hasta que yo los revise y apruebe personalmente.*  

# 🛠️ 2. Instalación de OpenCode
OpenCode es la herramienta que utilizaremos para estandarizar la generación de documentos técnicos.

## En Windows 🪟
Descarga el instalador oficial desde el sitio de [OpenCode](https://opencode.ai/es) o ejecutar el siguente comando en el `cmd`.
```
curl -fsSL https://opencode.ai/install | bash
```

Ejecuta el archivo .exe y sigue el asistente.

* ***Nota:** asegurate tener instalado el gestor de paquetes npm en windows atraves de nodejs*
## En Arch Linux 🏔️
Puedes instalarlo utilizando un asistente de AUR (como `Paru`) o la version estable(con `pacman`):
 
```bash
paru -S opencode
```

```bash
sudo pacman -S opencode  
```

* ***Nota:** Si tienes alguna duda puedes revisar la [Documentacion](https://opencode.ai/es/download)
# 📂 3. Estructura y Modularización
Cada integrante debe tomar la información de sus módulos asignados en Project.md y moverla a la siguiente estructura de carpetas:

Ruta de la lógica: 
```bash 
TP2-SDD/specs/[tu-nombre]/[nombre-modulo].md
```
Ruta de los pasos: 
```bash
TP2-SDD/specs/[tu-nombre]/[nombre-modulo]-steps.md
```

* ***Nota:** Debes borrar el detalle de esos módulos del archivo Project.md original para que este quede solo como un índice general con links a tus nuevos archivos.*  

# 📋 4. Configuración de los Steps (Pasos)
Los archivos -steps.md definen la secuencia lógica de ejecución del módulo. Sigue este formato estándar:


### Pasos de Ejecución - [Nombre del Módulo]
1. **Entrada:** Detallar los datos que recibe el módulo (ej: Credenciales, ID de evento).
2. **Validación:** Comprobar reglas de negocio (ej: El usuario debe estar activo).
3. **Procesamiento:** 
   - **Paso 1:** [Descripción de la acción inicial].
   - **Paso 2:** [Lógica interna o algoritmo aplicado].
4. **Salida:** Resultado final esperado (ej: Certificado generado, Sesión iniciada).

# 🛡️ Reglas de Seguridad
Ramas Protegidas: Las ramas `main` y `sdd-development` están protegidas. GitHub rechazará cualquier push directo que intentes hacer.  

`Issues`: Consulta la pestaña Issues en GitHub para ver exactamente qué módulos tienes asignados.  

***Dudas:** Si necesitas asistencia técnica o ayuda con la lógica de los módulos, abre un Issue o usa la etiqueta ayuda requerida.*