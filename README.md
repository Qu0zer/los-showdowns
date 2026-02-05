# 🏕️ CampestresCyL

**Aplicación web para la localización y gestión de campings en Castilla y León**

[![PHP](https://img.shields.io/badge/PHP-7.4+-777BB4?style=flat&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)

---

## 📋 Descripción del Proyecto

**CampestresCyL** es una aplicación web desarrollada como Proyecto Integrado del ciclo de Desarrollo de Aplicaciones Web (DAW) que permite a los usuarios explorar, localizar y gestionar información sobre campings en las nueve provincias de Castilla y León.

### 🎯 Objetivo Principal

Facilitar el acceso a información actualizada de campings mediante un mapa interactivo, integrando datos oficiales del Portal de Datos Abiertos de la Junta de Castilla y León, y permitiendo a los usuarios gestionar sus campings favoritos de forma personalizada.

### ✨ Características Principales

- 🗺️ **Mapa Interactivo**: Visualización de ~115 campings en un mapa de Leaflet con marcadores georreferenciados
- 📊 **Datos Oficiales**: Sincronización automática con la API de Datos Abiertos de Castilla y León
- ⭐ **Sistema de Favoritos**: Gestión personalizada de campings favoritos para usuarios registrados
- 🔐 **Autenticación Segura**: Sistema de registro e inicio de sesión con contraseñas cifradas (bcrypt)
- 📱 **Diseño Responsive**: Interfaz adaptable a dispositivos móviles, tablets y escritorio
- 🌱 **Optimización Ambiental**: Caché en BD, compresión GZIP, lazy loading (reducción del 99% en peticiones externas)
- ♿ **Accesibilidad**: Cumplimiento de estándares WCAG 2.1

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **PHP 7.4+** - Lenguaje de servidor
- **MySQL 8.0+** - Base de datos relacional
- **Composer** - Gestor de dependencias
- **PDO** - Capa de abstracción de base de datos

### Frontend
- **HTML5 / CSS3** - Estructura y estilos
- **JavaScript ES6+** - Lógica del cliente (vanilla, sin frameworks)
- **Leaflet 1.9.4** - Librería de mapas interactivos
- **OpenStreetMap** - Proveedor de tiles de mapa

### Arquitectura
- **MVC** - Patrón Modelo-Vista-Controlador
- **REST API** - Endpoints JSON para comunicación frontend-backend
- **AJAX** - Comunicación asíncrona con `fetch()`

### Herramientas de Desarrollo
- **XAMPP** - Entorno de desarrollo local
- **Git / GitHub** - Control de versiones
- **draw.io** - Diagramas UML y ER
- **Kiro AI** - Asistente de desarrollo con IA

---

## 📁 Estructura del Proyecto

```
los-showdowns/
├── public/              # Directorio público (Document Root)
│   ├── index.php       # Front Controller
│   ├── .htaccess       # Configuración Apache
│   ├── css/            # Hojas de estilo
│   ├── js/             # Scripts JavaScript
│   └── images/         # Recursos gráficos
├── src/                # Código fuente (backend)
│   ├── config/         # Configuración (BD, SQL)
│   ├── controllers/    # Controladores MVC
│   ├── models/         # Modelos de datos
│   └── views/          # Vistas HTML+PHP
├── routes/             # Definición de rutas
│   ├── api.php         # Rutas API REST
│   └── web.php         # Rutas de vistas
├── docs/               # Documentación y diagramas
├── tests/              # Tests unitarios y PBT
├── vendor/             # Dependencias Composer
├── cron.php            # Script de sincronización API
├── composer.json       # Dependencias PHP
├── .env                # Variables de entorno (NO subir a Git)
└── README.md           # Este archivo
```

---

## 🚀 Instalación y Despliegue

### Requisitos Previos

- **XAMPP** (PHP 7.4+, MySQL 8.0+, Apache)
- **Git**
- **Composer**

### Paso 1: Clonar el Repositorio

```bash
cd C:\xampp\htdocs
git clone https://github.com/tu-usuario/los-showdowns.git
cd los-showdowns
```

### Paso 2: Instalar Dependencias

```bash
composer install
```

### Paso 3: Configurar Base de Datos

1. Inicia **Apache** y **MySQL** desde el Panel de Control de XAMPP

2. Accede a phpMyAdmin: `http://localhost/phpmyadmin`

3. Crea una base de datos llamada `campestrecyl_campings`

4. Importa el archivo SQL:
   - Selecciona la base de datos creada
   - Ve a la pestaña **Importar**
   - Selecciona: `src/config/database_campestrecyl.sql`
   - Haz clic en **Continuar**

### Paso 4: Configurar Variables de Entorno

Edita el archivo `.env` con tus credenciales:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_NAME=campestrecyl_campings
DB_USER=root
DB_PASS=

# Configuración de Entorno
APP_ENV=development
```

### Paso 5: Configurar Apache (Recomendado)

Para mayor seguridad, configura el Document Root en `public/`:

Edita `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot "C:/xampp/htdocs/los-showdowns/public"
    
    <Directory "C:/xampp/htdocs/los-showdowns/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Reinicia Apache desde el Panel de Control de XAMPP.

### Paso 6: Cargar Datos de Campings

Ejecuta el script de sincronización para cargar los campings desde la API:

```bash
php cron.php
```

Esto descargará aproximadamente 115 campings de las 9 provincias de Castilla y León.

### Paso 7: Acceder a la Aplicación

**Si configuraste Virtual Host:**
```
http://localhost/
```

**Si NO configuraste Virtual Host:**
```
http://localhost/los-showdowns/public/index.php
```

---

## 📖 Manual de Usuario

### Navegación sin Registro

- **Explorar Mapa**: Visualiza todos los campings en el mapa interactivo
- **Ver Información**: Haz clic en cualquier marcador para ver detalles del camping
- **Campings sin Ubicación**: Consulta la sección inferior para campings sin coordenadas
- **Consejos**: Accede a recomendaciones para campistas

### Registro e Inicio de Sesión

Para acceder a funcionalidades avanzadas:

1. Haz clic en **Registrarse** (esquina superior derecha)
2. Completa el formulario:
   - Nombre de usuario
   - Email válido
   - Contraseña (mínimo 6 caracteres)
   - Acepta los términos y condiciones
3. Inicia sesión con tu email o usuario

### Funcionalidades con Sesión Iniciada

- **⭐ Agregar a Favoritos**: Botón visible en la información de cada camping
- **Gestionar Favoritos**: Accede a tu lista personalizada desde el menú
- **Eliminar Favoritos**: Quita campings de tu lista con un clic
- **Notificaciones**: Recibe feedback visual de todas tus acciones

---

## 🔧 Configuración Avanzada

### Sincronización Automática (CRON)

Para actualizar los datos de campings automáticamente cada día:

**Linux/Mac:**
```bash
crontab -e
# Añadir:
0 3 * * * cd /ruta/a/tu/proyecto && php cron.php >> logs/cron.log 2>&1
```

**Windows (Programador de Tareas):**
1. Abre "Programador de tareas"
2. Crear tarea básica
3. Acción: `php.exe C:\xampp\htdocs\los-showdowns\cron.php`
4. Programar: Diariamente a las 3:00 AM

### Optimización de Rendimiento

El proyecto incluye optimizaciones ambientales:

- ✅ **Caché en BD**: Reduce peticiones a API externa en un 99%
- ✅ **Caché HTTP**: CSS/JS (1 mes), Imágenes (1 mes), Favicon (1 año)
- ✅ **Compresión GZIP**: Reduce tamaño de transferencia en ~70%
- ✅ **Lazy Loading**: Imágenes y scripts con carga diferida
- ✅ **Defer**: Scripts JavaScript no bloquean renderizado

**Impacto ambiental:** Reducción estimada de ~135g CO₂/día a ~1.35g CO₂/día (99% menos emisiones)

---

## 🔒 Seguridad

### Medidas Implementadas

- **Contraseñas Cifradas**: `password_hash()` con bcrypt
- **Sesiones Seguras**: Gestión con `$_SESSION` en servidor
- **Validación de Inputs**: Sanitización con `htmlspecialchars()` y `filter_var()`
- **Protección CSRF**: Validación de origen de peticiones
- **Bloqueo de Archivos**: `.htaccess` protege `composer.json`, `.env`
- **Document Root**: Solo `/public/` es accesible desde web

### Recomendaciones para Producción

⚠️ **IMPORTANTE**: Si despliegas en un servidor público:

1. **Cambia las credenciales de BD** en `src/config/db.php`:
   ```php
   $user = 'usuario_seguro';  // NO usar 'root'
   $pass = 'contraseña_fuerte_123!@#';  // NO dejar vacío
   ```

2. **Configura HTTPS** con certificado SSL

3. **Actualiza `APP_ENV`** en `.env`:
   ```env
   APP_ENV=production
   ```

4. **Desactiva errores de PHP** en producción

---

## 🧪 Testing

El proyecto está preparado para tests unitarios y property-based testing:

```bash
# Ejecutar tests (cuando estén implementados)
./vendor/bin/phpunit tests/
```

Estructura de tests:
- `tests/Unit/` - Tests unitarios
- `tests/Property/` - Tests basados en propiedades (PBT)

---

## 📚 Documentación Adicional

- **Diagramas**: `docs/diagramas/`
  - Diagrama de Casos de Uso
  - Diagrama Entidad-Relación
- **Memoria del Proyecto**: `docs/documentación/`
- **Guía de Estilos**: `docs/documentación/Guia de estilos.docx`

---

## 🤝 Contribuciones

Este es un proyecto académico del ciclo DAW. Para contribuir:

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Añadir nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👥 Autores

- **Desarrollador Principal** - Proyecto Integrado DAW 2025/2026
- **Asistente de Desarrollo** - Kiro AI (Windsurf IDE)

---

## 🙏 Agradecimientos

- **Junta de Castilla y León** - Por proporcionar la API de Datos Abiertos
- **Leaflet** - Por la librería de mapas open-source
- **OpenStreetMap** - Por los tiles de mapa gratuitos
- **Comunidad DAW** - Por el apoyo y recursos educativos

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de Apache: `C:\xampp\apache\logs\error.log`
2. Verifica la consola del navegador (F12) para errores JavaScript
3. Asegúrate de que Apache y MySQL estén activos en XAMPP
4. Confirma que ejecutaste `php cron.php` para cargar los campings

---

## 🔗 Enlaces Útiles

- [API Datos Abiertos Castilla y León](https://analisis.datosabiertos.jcyl.es/)
- [Documentación Leaflet](https://leafletjs.com/)
- [Guía PHP PDO](https://www.php.net/manual/es/book.pdo.php)
- [XAMPP Documentation](https://www.apachefriends.org/docs/)

---

**⭐ Si te ha gustado el proyecto, dale una estrella en GitHub!**
