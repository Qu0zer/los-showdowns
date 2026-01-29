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

// 4. FUNCIÓN PARA INVESTIGAR QUÉ CAMPOS CONTIENEN CAMPINGS
async function cargarCampings() {
    console.log('🔍 Investigando campos de la API...');
    
    try {
        const apiUrl = 'https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/registro-de-turismo-de-castilla-y-leon/records';
        const response = await fetch(apiUrl + '?limit=20');
        
        if (response.ok) {
            const data = await response.json();
            
            // Mostrar todos los campos del primer registro
            if (data.results.length > 0) {
                const primerRegistro = data.results[0];
                let fields = null;
                
                if (primerRegistro.record && primerRegistro.record.fields) {
                    fields = primerRegistro.record.fields;
                } else if (primerRegistro.fields) {
                    fields = primerRegistro.fields;
                }
                
                console.log('📋 TODOS LOS CAMPOS DISPONIBLES:');
                Object.keys(fields).forEach(campo => {
                    console.log(`  ${campo}: "${fields[campo]}"`);
                });
                
                console.log('\n🔍 BUSCANDO CAMPINGS EN TODOS LOS REGISTROS...');
                
                // Buscar en todos los registros qué valores únicos hay
                const valoresUnicos = {};
                
                data.results.forEach((record, index) => {
                    let recordFields = null;
                    
                    if (record.record && record.record.fields) {
                        recordFields = record.record.fields;
                    } else if (record.fields) {
                        recordFields = record.fields;
                    }
                    
                    if (recordFields) {
                        // Revisar cada campo para ver si contiene "camping"
                        Object.keys(recordFields).forEach(campo => {
                            const valor = String(recordFields[campo] || '').toLowerCase();
                            
                            if (valor.includes('camping')) {
                                console.log(`🏕️ ENCONTRADO! Campo "${campo}": "${recordFields[campo]}" en registro ${index}`);
                                
                                // Si tiene coordenadas, crear marcador
                                if (recordFields.coordenadas_geograficas && 
                                    recordFields.coordenadas_geograficas.lat && 
                                    recordFields.coordenadas_geograficas.lon) {
                                    
                                    const lat = recordFields.coordenadas_geograficas.lat;
                                    const lon = recordFields.coordenadas_geograficas.lon;
                                    
                                    const marker = L.marker([lat, lon]).addTo(map);
                                    marker.bindPopup(`
                                        <div>
                                            <h3>🏕️ ${recordFields.nombre || 'Camping'}</h3>
                                            <p>Campo: ${campo}</p>
                                            <p>Valor: ${recordFields[campo]}</p>
                                            <p>📍 ${lat.toFixed(4)}, ${lon.toFixed(4)}</p>
                                        </div>
                                    `);
                                }
                            }
                            
                            // Recopilar valores únicos de campos que podrían ser importantes
                            if (['establecimiento', 'tipo', 'categoria', 'clasificacion'].includes(campo)) {
                                if (!valoresUnicos[campo]) valoresUnicos[campo] = new Set();
                                valoresUnicos[campo].add(recordFields[campo]);
                            }
                        });
                    }
                });
                
                // Mostrar valores únicos de campos importantes
                console.log('\n📊 VALORES ÚNICOS EN CAMPOS IMPORTANTES:');
                Object.keys(valoresUnicos).forEach(campo => {
                    console.log(`${campo}:`, Array.from(valoresUnicos[campo]));
                });
                
                actualizarInfoPanel(0, 'Revisa la consola para ver los datos');
            }
            
        } else {
            console.log('❌ Error HTTP:', response.status);
        }
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

// 5. FUNCIÓN PARA ACTUALIZAR EL PANEL DE INFORMACIÓN
function actualizarInfoPanel(numCampings, mensajeError = null) {
    const infoPanel = document.querySelector('.informaion p');
    if (infoPanel) {
        if (mensajeError) {
            infoPanel.innerHTML = `<strong style="color: #d32f2f;">❌ ${mensajeError}</strong>`;
        } else if (numCampings === 0) {
            infoPanel.innerHTML = '<strong>ℹ️ No se encontraron campings.</strong>';
        } else {
            infoPanel.innerHTML = `
                <strong style="color: #2e7d32;">🏕️ ${numCampings} registros encontrados</strong><br>
                Revisa la consola para ver los datos.
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