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
    
    // Crear HTML con la información del camping
    const html = `
        <div style="padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
            <h3 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 20px;">🏕️ ${camping.nombre}</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <p style="margin: 8px 0;"><strong>Provincia:</strong> ${camping.provincia}</p>
                    <p style="margin: 8px 0;"><strong>Municipio:</strong> ${camping.municipio}</p>
                    <p style="margin: 8px 0;"><strong>Localidad:</strong> ${camping.localidad}</p>
                </div>
                <div>
                    <p style="margin: 8px 0;"><strong>Plazas:</strong> ${camping.plazas}</p>
                    <p style="margin: 8px 0;"><strong>Registro:</strong> ${camping.n_registro}</p>
                </div>
            </div>
            
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="margin: 8px 0;"><strong>📍 Dirección:</strong> ${camping.direccion}</p>
            <p style="margin: 8px 0;"><strong>📞 Teléfono:</strong> ${camping.telefono}</p>
            <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${camping.email}</p>
            <p style="margin: 8px 0;"><strong>🌐 Web:</strong> <a href="http://${camping.web}" target="_blank" style="color: #2e7d32; text-decoration: none;">${camping.web}</a></p>
            
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="margin: 8px 0; font-size: 12px; color: #666;">📍 Coordenadas: ${camping.latitud.toFixed(4)}, ${camping.longitud.toFixed(4)}</p>
        </div>
    `;
    
    // Reemplazar el contenido del contenedor
    contenedor.innerHTML = html;
}

// ============================================
// 5. ACTUALIZAR PANEL DE INFORMACIÓN
// ============================================
function actualizarPanelInfo(cantidad) {
    const panel = document.querySelector('.informaion');
    if (panel) {
        panel.innerHTML = `
            <div style="padding: 15px; text-align: center; color: #666;">
                <p style="margin: 0; font-size: 14px;">
                    <strong style="color: #2e7d32;">🏕️ ${cantidad} campings cargados</strong>
                </p>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                    Haz click en un marcador del mapa para ver la información
                </p>
            </div>
        `;
    }
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
    
    const html = `
        <div style="font-size: 1.2rem; margin-bottom: 15px;">
            <span style="font-size: 2rem;">${iconoClima}</span>
            <strong style="color: var(--verde-oscuro);">${temperatura}°C</strong>
        </div>
        <p style="margin: 10px 0; color: #666;">${descripcion}</p>
        <div class="clima-info">
            <div class="clima-item">
                <strong>🌡️ Temperatura</strong>
                ${temperatura}°C
            </div>
            <div class="clima-item">
                <strong>💨 Viento</strong>
                ${velocidadViento} km/h
            </div>
        </div>
        <p style="font-size: 0.8rem; color: #999; margin-top: 15px;">
            📍 Datos de Valladolid (referencia regional)
        </p>
    `;
    
    climaContenido.innerHTML = html;
    console.log('✅ Clima mostrado correctamente');
}

function mostrarErrorClima() {
    const climaContenido = document.getElementById('clima-contenido');
    
    if (climaContenido) {
        climaContenido.innerHTML = `
            <div style="color: #666; text-align: center;">
                <p>⚠️ No se pudo cargar el clima</p>
                <p style="font-size: 0.8rem;">Inténtalo más tarde</p>
            </div>
        `;
    }
}

// ============================================
// 8. EJECUTAR AL CARGAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', iniciarAplicacion);