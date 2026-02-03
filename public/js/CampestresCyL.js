// ============================================
// VARIABLES GLOBALES
// ============================================
let map;
let marcadores = [];
let campingsGlobal = []; // Array global con todos los campings

// ============================================
// 1. INICIALIZAR MAPA
// ============================================
function inicializarMapa() {
    console.log('🗺️ Inicializando mapa...');
    
    map = L.map('mapa-interactivo').setView([41.8, -4.5], 8);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    // Establecer límites
    const bounds = L.latLngBounds(
        [40.0, -7.5],
        [43.5, -1.5]
    );
    map.setMaxBounds(bounds);
    map.setMinZoom(7);
    map.setMaxZoom(15);
    
    console.log('✅ Mapa inicializado');
}

// ============================================
// 2. CARGAR CAMPINGS DESDE BACKEND (BD)
// ============================================
async function cargarCampingsDesdeBackend() {
    console.log('🔄 Cargando campings desde backend (BD)...');
    
    try {
        const response = await fetch('index.php?action=cargarCampings');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const campings = await response.json();
        
        if (Array.isArray(campings)) {
            console.log(`✅ ${campings.length} campings cargados desde BD`);
            return campings;
        } else {
            console.error('❌ Formato de respuesta inválido');
            return [];
        }
    } catch (error) {
        console.error('❌ Error cargando campings desde backend:', error);
        return [];
    }
}

// ============================================
// 3. VISUALIZAR CAMPINGS EN EL MAPA
// ============================================
function visualizarCampingsEnMapa(campings) {
    console.log('📍 Visualizando campings en el mapa...');
    
    campings.forEach((camping) => {
        try {
            // Los datos vienen de BD con nombres de columna diferentes
            const lat = parseFloat(camping.latitud);
            const lon = parseFloat(camping.longitud);
            
            if (isNaN(lat) || isNaN(lon)) {
                console.warn(`⚠️ Coordenadas inválidas para ${camping.nombre_camping}`);
                return;
            }
            
            const marker = L.marker([lat, lon]).addTo(map);
            
            // Adaptar estructura para mostrarInformacionEnContenedor
            const campingAdaptado = {
                nombre: camping.nombre_camping,
                provincia: camping.provincia,
                municipio: camping.municipio,
                localidad: camping.localidad,
                direccion: camping.direccion,
                telefono: camping.telefono,
                email: camping.email,
                web: camping.web,
                plazas: camping.plazas,
                n_registro: camping.n_registro,
                latitud: lat,
                longitud: lon
            };
            
            // Al hacer click en el marcador, mostrar información en el contenedor
            marker.on('click', function() {
                mostrarInformacionEnContenedor(campingAdaptado);
            });
            
            // Guardar referencia del marcador
            marcadores.push({
                marker: marker,
                camping: campingAdaptado
            });
        } catch (error) {
            console.error(`❌ Error creando marcador para ${camping.nombre_camping}:`, error);
        }
    });
    
    console.log(`✅ ${marcadores.length} marcadores creados en el mapa`);
    actualizarPanelInfo(campings.length);
}

// ============================================
// 4. MOSTRAR INFORMACIÓN EN CONTENEDOR
// ============================================
function mostrarInformacionEnContenedor(camping) {
    console.log('📋 Mostrando información de:', camping.nombre);
    
    const contenedor = document.querySelector('.informaion');
    
    if (!contenedor) {
        console.error('❌ No se encontró el contenedor .informaion');
        return;
    }
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Crear contenedor principal
    const mainContainer = document.createElement('div');
    mainContainer.className = 'camping-info-container';
    
    // Título
    const titulo = document.createElement('h3');
    titulo.className = 'camping-titulo';
    titulo.textContent = `🏕️ ${camping.nombre}`;
    mainContainer.appendChild(titulo);
    
    // Grid de información
    const grid = document.createElement('div');
    grid.className = 'camping-grid';
    
    // Columna izquierda
    const columnaIzq = document.createElement('div');
    columnaIzq.className = 'camping-columna';
    
    const provincia = document.createElement('p');
    provincia.innerHTML = '<strong>Provincia:</strong> ' + camping.provincia;
    columnaIzq.appendChild(provincia);
    
    const municipio = document.createElement('p');
    municipio.innerHTML = '<strong>Municipio:</strong> ' + camping.municipio;
    columnaIzq.appendChild(municipio);
    
    const localidad = document.createElement('p');
    localidad.innerHTML = '<strong>Localidad:</strong> ' + camping.localidad;
    columnaIzq.appendChild(localidad);
    
    grid.appendChild(columnaIzq);
    
    // Columna derecha
    const columnaDer = document.createElement('div');
    columnaDer.className = 'camping-columna';
    
    const plazas = document.createElement('p');
    plazas.innerHTML = '<strong>Plazas:</strong> ' + camping.plazas;
    columnaDer.appendChild(plazas);
    
    const registro = document.createElement('p');
    registro.innerHTML = '<strong>Registro:</strong> ' + camping.n_registro;
    columnaDer.appendChild(registro);
    
    grid.appendChild(columnaDer);
    mainContainer.appendChild(grid);
    
    // Separador
    const separador1 = document.createElement('hr');
    separador1.className = 'camping-separador';
    mainContainer.appendChild(separador1);
    
    // Dirección
    const direccion = document.createElement('p');
    direccion.innerHTML = '<strong>📍 Dirección:</strong> ' + camping.direccion;
    mainContainer.appendChild(direccion);
    
    // Teléfono
    const telefono = document.createElement('p');
    telefono.innerHTML = '<strong>📞 Teléfono:</strong> ' + camping.telefono;
    mainContainer.appendChild(telefono);
    
    // Email
    const email = document.createElement('p');
    email.innerHTML = '<strong>📧 Email:</strong> ' + camping.email;
    mainContainer.appendChild(email);
    
    // Web
    const webP = document.createElement('p');
    const webStrong = document.createElement('strong');
    webStrong.textContent = '🌐 Web: ';
    webP.appendChild(webStrong);
    
    const webLink = document.createElement('a');
    webLink.href = 'http://' + camping.web;
    webLink.target = '_blank';
    webLink.className = 'camping-link';
    webLink.textContent = camping.web;
    webP.appendChild(webLink);
    mainContainer.appendChild(webP);
    
    // Separador
    const separador2 = document.createElement('hr');
    separador2.className = 'camping-separador';
    mainContainer.appendChild(separador2);
    
    // Coordenadas
    const coordenadas = document.createElement('p');
    coordenadas.className = 'camping-coordenadas';
    coordenadas.textContent = `📍 Coordenadas: ${camping.latitud.toFixed(4)}, ${camping.longitud.toFixed(4)}`;
    mainContainer.appendChild(coordenadas);
    
    // Añadir al contenedor
    contenedor.appendChild(mainContainer);
}

// ============================================
// 5. ACTUALIZAR PANEL DE INFORMACIÓN
// ============================================
function actualizarPanelInfo(cantidad) {
    const panel = document.querySelector('.informaion');
    if (!panel) return;
    
    // Limpiar panel
    panel.innerHTML = '';
    
    // Crear contenedor
    const container = document.createElement('div');
    container.className = 'panel-info-container';
    
    // Título principal
    const titulo = document.createElement('p');
    titulo.className = 'panel-info-titulo';
    
    const tituloDestacado = document.createElement('strong');
    tituloDestacado.className = 'panel-info-titulo-destacado';
    tituloDestacado.textContent = `🏕️ ${cantidad} campings cargados`;
    
    titulo.appendChild(tituloDestacado);
    container.appendChild(titulo);
    
    // Subtítulo
    const subtitulo = document.createElement('p');
    subtitulo.className = 'panel-info-subtitulo';
    subtitulo.textContent = 'Haz click en un marcador del mapa para ver la información';
    container.appendChild(subtitulo);
    
    // Añadir al panel
    panel.appendChild(container);
}

// ============================================
// 6. FLUJO PRINCIPAL
// ============================================
async function iniciarAplicacion() {
    console.log('🚀 === INICIANDO APLICACIÓN ===');
    
    try {
        // 1. Inicializar mapa
        inicializarMapa();
        
        // 2. Obtener clima actual (en paralelo)
        obtenerClimaActual();
        
        // 3. Cargar campings desde backend (BD)
        const campings = await cargarCampingsDesdeBackend();
        
        if (campings.length === 0) {
            console.warn('⚠️ No se cargaron campings');
            return;
        }
        
        // 4. Visualizar en mapa
        visualizarCampingsEnMapa(campings);
        
        console.log('✅ === APLICACIÓN INICIADA CORRECTAMENTE ===');
    } catch (error) {
        console.error('❌ Error en iniciarAplicación:', error);
    }
}

// ============================================
// 7. FUNCIONALIDAD DEL CLIMA
// ============================================
async function obtenerClimaActual() {
    console.log('🌤️ Obteniendo clima actual...');
    
    try {
        // Usamos Valladolid como referencia para Castilla y León
        const lat = 41.6523;
        const lon = -4.7245;
        
        // API gratuita de OpenWeatherMap (sin necesidad de API key para datos básicos)
        // Usaremos una API alternativa gratuita
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Europe%2FMadrid&forecast_days=1`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🌤️ Datos del clima recibidos:', data);
        
        mostrarClimaEnPagina(data);
        
    } catch (error) {
        console.error('❌ Error obteniendo clima:', error);
        mostrarErrorClima();
    }
}

function mostrarClimaEnPagina(data) {
    const climaContenido = document.getElementById('clima-contenido');
    
    if (!climaContenido) {
        console.error('❌ No se encontró el contenedor del clima');
        return;
    }
    
    // Limpiar contenedor
    climaContenido.innerHTML = '';
    
    const clima = data.current_weather;
    const temperatura = Math.round(clima.temperature);
    const velocidadViento = Math.round(clima.windspeed);
    
    // Determinar icono del clima basado en el código
    let iconoClima = '🌤️';
    let descripcion = 'Parcialmente nublado';
    
    if (clima.weathercode === 0) {
        iconoClima = '☀️';
        descripcion = 'Despejado';
    } else if (clima.weathercode <= 3) {
        iconoClima = '⛅';
        descripcion = 'Parcialmente nublado';
    } else if (clima.weathercode <= 48) {
        iconoClima = '☁️';
        descripcion = 'Nublado';
    } else if (clima.weathercode <= 67) {
        iconoClima = '🌧️';
        descripcion = 'Lluvia';
    } else if (clima.weathercode <= 77) {
        iconoClima = '🌨️';
        descripcion = 'Nieve';
    } else {
        iconoClima = '⛈️';
        descripcion = 'Tormenta';
    }
    
    // Contenedor de temperatura
    const tempContainer = document.createElement('div');
    tempContainer.className = 'clima-temperatura-container';
    
    const icono = document.createElement('span');
    icono.className = 'clima-icono';
    icono.textContent = iconoClima;
    tempContainer.appendChild(icono);
    
    const temp = document.createElement('strong');
    temp.className = 'clima-temperatura';
    temp.textContent = ` ${temperatura}°C`;
    tempContainer.appendChild(temp);
    
    climaContenido.appendChild(tempContainer);
    
    // Descripción
    const desc = document.createElement('p');
    desc.className = 'clima-descripcion';
    desc.textContent = descripcion;
    climaContenido.appendChild(desc);
    
    // Info del clima
    const climaInfo = document.createElement('div');
    climaInfo.className = 'clima-info';
    
    // Item temperatura
    const itemTemp = document.createElement('div');
    itemTemp.className = 'clima-item';
    
    const strongTemp = document.createElement('strong');
    strongTemp.textContent = '🌡️ Temperatura';
    itemTemp.appendChild(strongTemp);
    
    const textTemp = document.createTextNode(` ${temperatura}°C`);
    itemTemp.appendChild(textTemp);
    
    climaInfo.appendChild(itemTemp);
    
    // Item viento
    const itemViento = document.createElement('div');
    itemViento.className = 'clima-item';
    
    const strongViento = document.createElement('strong');
    strongViento.textContent = '💨 Viento';
    itemViento.appendChild(strongViento);
    
    const textViento = document.createTextNode(` ${velocidadViento} km/h`);
    itemViento.appendChild(textViento);
    
    climaInfo.appendChild(itemViento);
    climaContenido.appendChild(climaInfo);
    
    // Referencia
    const referencia = document.createElement('p');
    referencia.className = 'clima-referencia';
    referencia.textContent = '📍 Datos de Valladolid (referencia regional)';
    climaContenido.appendChild(referencia);
    
    console.log('✅ Clima mostrado correctamente');
}

function mostrarErrorClima() {
    const climaContenido = document.getElementById('clima-contenido');
    
    if (!climaContenido) return;
    
    // Limpiar contenedor
    climaContenido.innerHTML = '';
    
    // Crear contenedor de error
    const errorContainer = document.createElement('div');
    errorContainer.className = 'clima-error-container';
    
    // Mensaje principal
    const mensaje = document.createElement('p');
    mensaje.className = 'clima-error-mensaje';
    mensaje.textContent = '⚠️ No se pudo cargar el clima';
    errorContainer.appendChild(mensaje);
    
    // Subtítulo
    const subtitulo = document.createElement('p');
    subtitulo.className = 'clima-error-subtitulo';
    subtitulo.textContent = 'Inténtalo más tarde';
    errorContainer.appendChild(subtitulo);
    
    // Añadir al contenedor
    climaContenido.appendChild(errorContainer);
}

// ============================================
// 8. EJECUTAR AL CARGAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', iniciarAplicacion);