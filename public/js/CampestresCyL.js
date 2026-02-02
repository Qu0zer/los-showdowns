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
// 2. EXTRAER DATOS DE API PÚBLICA
// ============================================
async function extraerCampingsDesdeAPI() {
    console.log('🔄 Extrayendo campings desde API pública...');
    
    const provincias = ['León', 'Salamanca', 'Burgos', 'Ávila', 'Soria', 'Segovia', 'Palencia', 'Valladolid', 'Zamora'];
    let totalCampings = 0;
    
    for (const provincia of provincias) {
        try {
            const apiUrl = `https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/registro-de-turismo-de-castilla-y-leon/records?where=provincia%20%3D%20%27${encodeURIComponent(provincia)}%27&limit=100&refine=establecimiento%3A%22Campings%22`;
            
            console.log(`📍 Cargando campings de ${provincia}...`);
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                console.error(`❌ Error en ${provincia}: HTTP ${response.status}`);
                continue;
            }
            
            const data = await response.json();
            
            if (data.results && Array.isArray(data.results)) {
                console.log(`   ✅ ${data.results.length} campings encontrados en ${provincia}`);
                
                // DEBUG: Mostrar estructura del primer camping
                if (data.results.length > 0) {
                    console.log('🔍 ESTRUCTURA DEL PRIMER CAMPING:', data.results[0]);
                }
                
                campingsGlobal = campingsGlobal.concat(data.results);
                totalCampings += data.results.length;
            }
        } catch (error) {
            console.error(`❌ Error al cargar ${provincia}:`, error);
        }
    }
    
    console.log(`🏕️ Total de campings extraídos: ${totalCampings}`);
    return campingsGlobal;
}

// ============================================
// 3. REFACTORIZAR DATOS (Extraer solo lo que necesitamos)
// ============================================
function refactorizarCampings(campingsRaw) {
    console.log('🔧 Refactorizando datos...');
    
    const campingsRefactorizados = [];
    let sinCoordenadas = 0;
    
    campingsRaw.forEach((camping, index) => {
        try {
            // Los datos vienen directamente en el objeto camping, no en camping.fields
            const data = camping;
            
            // Obtener coordenadas de posicion (que es un objeto con lat y lon)
            let lat, lon;
            
            if (data.posicion && typeof data.posicion === 'object') {
                lat = parseFloat(data.posicion.lat);
                lon = parseFloat(data.posicion.lon);
            } else if (data.gps_latitud && data.gps_longitud) {
                lat = parseFloat(data.gps_latitud);
                lon = parseFloat(data.gps_longitud);
            } else if (data.latitud && data.longitud) {
                lat = parseFloat(data.latitud);
                lon = parseFloat(data.longitud);
            } else {
                sinCoordenadas++;
                return;
            }
            
            // Validar que las coordenadas sean números válidos
            if (isNaN(lat) || isNaN(lon)) {
                sinCoordenadas++;
                return;
            }
            
            // Validar que esté en Castilla y León
            if (lat < 40.0 || lat > 43.5 || lon < -7.5 || lon > -1.5) {
                console.warn(`⚠️ Fuera de límites: ${data.nombre} [${lat}, ${lon}]`);
                return;
            }
            
            // Extraer solo los datos que necesitamos
            const campingRefactorizado = {
                n_registro: data.n_registro || null,
                nombre: data.nombre || 'Sin nombre',
                provincia: data.provincia || 'No especificado',
                municipio: data.municipio || 'No especificado',
                localidad: data.localidad || 'No especificado',
                direccion: data.direccion || 'No especificado',
                telefono: data.telefono_1 || 'No disponible',
                email: data.email || 'No disponible',
                web: data.web || 'No disponible',
                plazas: data.plazas || 'No especificado',
                latitud: lat,
                longitud: lon
            };
            
            campingsRefactorizados.push(campingRefactorizado);
        } catch (error) {
            console.error(`❌ Error refactorizando camping ${index}:`, error);
        }
    });
    
    console.log(`✅ ${campingsRefactorizados.length} campings refactorizados correctamente`);
    console.log(`⚠️ ${sinCoordenadas} campings sin coordenadas válidas`);
    return campingsRefactorizados;
}

// ============================================
// 4. VISUALIZAR CAMPINGS EN EL MAPA
// ============================================
function visualizarCampingsEnMapa(campings) {
    console.log('📍 Visualizando campings en el mapa...');
    
    campings.forEach((camping) => {
        try {
            const marker = L.marker([camping.latitud, camping.longitud]).addTo(map);
            
            // Al hacer click en el marcador, mostrar información en el contenedor
            marker.on('click', function() {
                mostrarInformacionEnContenedor(camping);
            });
            
            // Guardar referencia del marcador
            marcadores.push({
                marker: marker,
                camping: camping
            });
        } catch (error) {
            console.error(`❌ Error creando marcador para ${camping.nombre}:`, error);
        }
    });
    
    console.log(`✅ ${marcadores.length} marcadores creados en el mapa`);
    actualizarPanelInfo(campings.length);
}

// ============================================
// 4.5 MOSTRAR INFORMACIÓN EN CONTENEDOR
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
// 6. GUARDAR CAMPINGS EN BASE DE DATOS
// ============================================
async function guardarCampingsEnBD(campings) {
    console.log('💾 Guardando campings en base de datos...');
    console.log(`📊 Total de campings a guardar: ${campings.length}`);
    console.log('📦 Estructura del primer camping:', campings[0]);
    
    try {
        console.log('🔄 Enviando fetch...');
        const response = await fetch('index.php?action=guardarCampings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campings)
        });
        
        console.log(`📡 Respuesta recibida - Status: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Respuesta no OK:', errorText);
            throw new Error(`HTTP ${response.status}`);
        }
        
        const resultado = await response.json();
        console.log('✅ Respuesta del servidor:', resultado);
        
        if (resultado.success) {
            console.log(`✅ Campings guardados correctamente`);
            console.log(`   - Insertados: ${resultado.insertados}`);
            console.log(`   - Actualizados: ${resultado.actualizados}`);
            if (resultado.errores && resultado.errores.length > 0) {
                console.warn(`   - Errores: ${resultado.errores.length}`);
                console.warn('   Detalles de errores:', resultado.errores);
            }
        } else {
            console.error('❌ Error al guardar:', resultado.message);
            if (resultado.debug) {
                console.error('   Debug info:', resultado.debug);
            }
        }
        
        return resultado;
    } catch (error) {
        console.error('❌ Error en la petición:', error);
        console.error('Stack:', error.stack);
    }
}

// ============================================
// 7. FLUJO PRINCIPAL
// ============================================
async function iniciarAplicacion() {
    console.log('🚀 === INICIANDO APLICACIÓN ===');
    
    try {
        // 1. Inicializar mapa
        inicializarMapa();
        
        // 2. Obtener clima actual (en paralelo)
        obtenerClimaActual();
        
        // 3. Extraer campings desde API pública
        await extraerCampingsDesdeAPI();
        
        // 4. Refactorizar datos
        const campingsRefactorizados = refactorizarCampings(campingsGlobal);
        
        // 5. Visualizar en mapa
        visualizarCampingsEnMapa(campingsRefactorizados);
        
        // 6. Guardar en BD
        await guardarCampingsEnBD(campingsRefactorizados);
        
        console.log('✅ === APLICACIÓN INICIADA CORRECTAMENTE ===');
    } catch (error) {
        console.error('❌ Error en iniciarAplicación:', error);
    }
}

// ============================================
// 8. FUNCIONALIDAD DEL CLIMA
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
// 9. EJECUTAR AL CARGAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', iniciarAplicacion);