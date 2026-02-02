# Página 404 - CampestresCyL

## Descripción
Página de error personalizada que se muestra cuando un usuario intenta acceder a una URL que no existe en el sitio web.

## Características

### Diseño Visual
- **Coherencia**: Mantiene el mismo estilo visual que el resto del sitio
- **Colores**: Utiliza la paleta de colores definida en las variables CSS
- **Tipografía**: Usa la fuente 'Chiller' para títulos, manteniendo la identidad visual
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### Elementos Interactivos
- **Animaciones CSS**: 
  - Aparición gradual de elementos
  - Balanceo del número 404
  - Efectos de hover en botones
  - Flotación de la ilustración de camping

- **JavaScript**:
  - Animación secuencial de elementos
  - Efectos interactivos en emojis
  - Partículas de fondo (estrellas)
  - Mensajes motivacionales aleatorios

### Funcionalidad
- **Navegación**: Botones para volver al inicio y acceder a favoritos
- **Sugerencias**: Lista de acciones que el usuario puede realizar
- **Ilustración temática**: Emojis relacionados con camping y naturaleza
- **Código de estado HTTP**: Retorna correctamente el código 404

## Archivos Involucrados

### Vista
- `src/views/404.php` - Estructura HTML de la página

### Estilos
- `public/css/404.css` - Estilos específicos para la página 404
- `public/css/CampestresCyL.css` - Estilos base del sitio

### JavaScript
- `public/js/404.js` - Interactividad y animaciones

### Controlador
- `src/controllers/WebController.php` - Método `error404()` para manejar la página

### Configuración
- `routes/web.php` - Enrutamiento para páginas no encontradas
- `public/.htaccess` - Configuración del servidor para manejar errores 404

## Cómo Funciona

1. **Detección**: Cuando se accede a una URL no válida, el archivo `.htaccess` redirige a `index.php?action=404`

2. **Enrutamiento**: El sistema de rutas detecta la acción '404' y llama al método correspondiente del controlador

3. **Respuesta**: El controlador establece el código de estado HTTP 404 y carga la vista

4. **Renderizado**: Se muestra la página con todos sus elementos visuales e interactivos

## Personalización

Para personalizar la página 404:

1. **Mensajes**: Editar los textos en `src/views/404.php`
2. **Estilos**: Modificar `public/css/404.css`
3. **Interactividad**: Ajustar `public/js/404.js`
4. **Mensajes aleatorios**: Cambiar el array de mensajes en el JavaScript

## SEO y Usabilidad

- **Código 404**: Retorna el código de estado correcto para SEO
- **Navegación clara**: Botones prominentes para volver al contenido principal
- **Información útil**: Sugerencias de qué hacer a continuación
- **Diseño amigable**: Tono positivo y visual atractivo para reducir la frustración del usuario