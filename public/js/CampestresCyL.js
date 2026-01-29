// 1. INICIALIZACIÓN DEL MAPA:
// Centrado específicamente en Castilla y León con límites más precisos
var map = L.map('mapa-interactivo').setView([41.8, -4.5], 8);

// 2. CAPA DE DISEÑO (Tiles):
// Usamos OpenStreetMap, que es gratuito y de código abierto.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 3. ESTABLECER LÍMITES DEL MAPA PARA CASTILLA Y LEÓN
// Coordenadas aproximadas de los límites de Castilla y León
var bounds = L.latLngBounds(
    [40.0, -7.5], // Esquina suroeste
    [43.5, -1.5]  // Esquina noreste
);
map.setMaxBounds(bounds);
map.setMinZoom(7);
map.setMaxZoom(15);

// 4. FUNCIÓN PARA CARGAR CAMPINGS ESPECÍFICAMENTE
async function cargarCampings() {
    console.log('🏕️ Cargando campings desde la API...');
    
    try {
        // Usar el filtro específico para campings
        const apiUrl = 'https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/registro-de-turismo-de-castilla-y-leon/records';
        const response = await fetch(apiUrl + '?limit=100&refine=establecimiento%3A%22Campings%22');
        
        if (response.ok) {
            const data = await response.json();
            console.log(`📊 Total de campings encontrados: ${data.results.length}`);
            
            let campingsConCoordenadas = 0;
            
            data.results.forEach((record, index) => {
                let fields = null;
                
                // Obtener los campos del registro
                if (record.record && record.record.fields) {
                    fields = record.record.fields;
                } else if (record.fields) {
                    fields = record.fields;
                }
                
                if (fields) {
                    console.log(`🏕️ Camping ${index + 1}:`, {
                        nombre: fields.nombre || 'Sin nombre',
                        establecimiento: fields.establecimiento,
                        coordenadas: fields.coordenadas_geograficas
                    });
                    
                    // Verificar si tiene coordenadas válidas
                    if (fields.coordenadas_geograficas && 
                        fields.coordenadas_geograficas.lat && 
                        fields.coordenadas_geograficas.lon) {
                        
                        const lat = parseFloat(fields.coordenadas_geograficas.lat);
                        const lon = parseFloat(fields.coordenadas_geograficas.lon);
                        
                        // Verificar que las coordenadas están dentro de Castilla y León
                        if (lat >= 40.0 && lat <= 43.5 && lon >= -7.5 && lon <= -1.5) {
                            campingsConCoordenadas++;
                            
                            // Crear marcador en el mapa
                            const marker = L.marker([lat, lon]).addTo(map);
                            marker.bindPopup(`
                                <div style="text-align: center;">
                                    <h3 style="color: #2e7d32; margin: 5px 0;">🏕️ ${fields.nombre || 'Camping'}</h3>
                                    <p style="margin: 3px 0;"><strong>Ubicación:</strong> ${fields.municipio || 'No especificado'}</p>
                                    <p style="margin: 3px 0;"><strong>Provincia:</strong> ${fields.provincia || 'No especificado'}</p>
                                    <p style="margin: 3px 0; font-size: 0.9em; color: #666;">📍 ${lat.toFixed(4)}, ${lon.toFixed(4)}</p>
                                </div>
                            `);
                            
                            console.log(`✅ Marcador creado para: ${fields.nombre} en [${lat}, ${lon}]`);
                        } else {
                            console.log(`⚠️ Coordenadas fuera de Castilla y León: [${lat}, ${lon}]`);
                        }
                    } else {
                        console.log(`❌ Sin coordenadas válidas para: ${fields.nombre || 'Sin nombre'}`);
                    }
                }
            });
            
            actualizarInfoPanel(campingsConCoordenadas);
            
        } else {
            console.log('❌ Error HTTP:', response.status);
            actualizarInfoPanel(0, `Error HTTP: ${response.status}`);
        }
        
    } catch (error) {
        console.log('❌ Error de conexión:', error.message);
        actualizarInfoPanel(0, `Error de conexión: ${error.message}`);
    }
}

// 5. FUNCIÓN PARA ACTUALIZAR EL PANEL DE INFORMACIÓN
function actualizarInfoPanel(numCampings, mensajeError = null) {
    const infoPanel = document.querySelector('.informaion p');
    if (infoPanel) {
        if (mensajeError) {
            infoPanel.innerHTML = `<strong style="color: #d32f2f;">❌ ${mensajeError}</strong>`;
        } else if (numCampings === 0) {
            infoPanel.innerHTML = '<strong style="color: #ff9800;">ℹ️ No se encontraron campings con coordenadas válidas.</strong>';
        } else {
            infoPanel.innerHTML = `
                <strong style="color: #2e7d32;">🏕️ ${numCampings} camping${numCampings !== 1 ? 's' : ''} encontrado${numCampings !== 1 ? 's' : ''}</strong><br>
                <span style="color: #666;">Haz clic en los marcadores del mapa para ver más información.</span>
            `;
        }
    }
}

// 6. INICIALIZACIÓN
setTimeout(function() {
    // Forzar redimensionamiento del mapa
    map.invalidateSize();
    
    // Cargar los campings reales desde la API
    cargarCampings();
}, 100);