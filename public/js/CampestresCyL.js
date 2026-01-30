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
                            
                            // Almacenar datos del camping para el buscador
                            const datoCamping = {
                                nombre: fields.nombre || 'Camping',
                                provincia: fields.provincia || 'No especificado',
                                municipio: fields.municipio || 'No especificado',
                                localidad: fields.localidad || 'No especificado',
                                lat: lat,
                                lon: lon
                            };
                            todosLosCampings.push(datoCamping);
                            
                            // Crear marcador en el mapa
                            const marker = L.marker([lat, lon]).addTo(map);
                            marcadoresEnMapa.push(marker); // Guardar referencia del marcador
                            
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
function actualizarInfoPanel(numCampings, mensajeError = null, mensajeBusqueda = null) {
    const infoPanel = document.querySelector('.informaion p');
    if (infoPanel) {
        if (mensajeError) {
            infoPanel.innerHTML = `<strong style="color: #d32f2f;">❌ ${mensajeError}</strong>`;
        } else if (numCampings === 0) {
            if (mensajeBusqueda) {
                infoPanel.innerHTML = '<strong style="color: #ff9800;">🔍 No se encontraron campings que coincidan con la búsqueda.</strong>';
            } else {
                infoPanel.innerHTML = '<strong style="color: #ff9800;">ℹ️ No se encontraron campings con coordenadas válidas.</strong>';
            }
        } else {
            let mensaje = `<strong style="color: #2e7d32;">🏕️ ${numCampings} camping${numCampings !== 1 ? 's' : ''} encontrado${numCampings !== 1 ? 's' : ''}</strong>`;
            
            if (mensajeBusqueda) {
                mensaje += `<br><span style="color: #666; font-size: 0.9em;">${mensajeBusqueda}</span>`;
            }
            
            mensaje += '<br><span style="color: #666;">Haz clic en los marcadores del mapa para ver más información.</span>';
            
            infoPanel.innerHTML = mensaje;
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

// 7. FUNCIONALIDAD DEL BUSCADOR DEL MAPA
let todosLosCampings = []; // Array para almacenar todos los campings cargados
let marcadoresEnMapa = []; // Array para controlar los marcadores

// Función para inicializar el buscador del mapa
function inicializarBuscadorMapa() {
    const inputBuscador = document.getElementById('buscador-campings');
    const btnLimpiar = document.getElementById('btn-limpiar-mapa');

    if (!inputBuscador || !btnLimpiar) return;

    // Evento de búsqueda en tiempo real
    inputBuscador.addEventListener('input', function() {
        const termino = this.value.trim();
        
        if (termino.length > 0) {
            btnLimpiar.classList.add('visible');
            buscarYFiltrarCampings(termino);
        } else {
            btnLimpiar.classList.remove('visible');
            mostrarTodosLosMarcadores();
            actualizarInfoPanel(marcadoresEnMapa.length);
        }
    });

    // Botón limpiar
    btnLimpiar.addEventListener('click', function() {
        inputBuscador.value = '';
        this.classList.remove('visible');
        mostrarTodosLosMarcadores();
        actualizarInfoPanel(marcadoresEnMapa.length);
        inputBuscador.focus();
    });
}

// Función para buscar y filtrar campings en el mapa
function buscarYFiltrarCampings(termino) {
    const terminoLower = termino.toLowerCase();
    const campingsFiltrados = todosLosCampings.filter(camping => {
        return camping.nombre.toLowerCase().includes(terminoLower) ||
               camping.provincia.toLowerCase().includes(terminoLower) ||
               camping.municipio.toLowerCase().includes(terminoLower) ||
               camping.localidad.toLowerCase().includes(terminoLower);
    });

    filtrarMarcadoresEnMapa(campingsFiltrados);
    actualizarInfoPanel(campingsFiltrados.length, `Resultados para "${termino}"`);
}

// Función para filtrar marcadores en el mapa
function filtrarMarcadoresEnMapa(campingsFiltrados) {
    marcadoresEnMapa.forEach(marcador => {
        const latMarcador = marcador.getLatLng().lat;
        const lonMarcador = marcador.getLatLng().lng;
        
        const estaEnFiltro = campingsFiltrados.some(camping => 
            Math.abs(camping.lat - latMarcador) < 0.0001 && 
            Math.abs(camping.lon - lonMarcador) < 0.0001
        );
        
        if (estaEnFiltro) {
            if (!map.hasLayer(marcador)) {
                marcador.addTo(map);
            }
        } else {
            if (map.hasLayer(marcador)) {
                map.removeLayer(marcador);
            }
        }
    });
}

// Función para mostrar todos los marcadores
function mostrarTodosLosMarcadores() {
    marcadoresEnMapa.forEach(marcador => {
        if (!map.hasLayer(marcador)) {
            marcador.addTo(map);
        }
    });
}

// Inicializar el buscador cuando se carga la página
document.addEventListener('DOMContentLoaded', inicializarBuscadorMapa);