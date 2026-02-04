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
    
    // Verificar si el usuario está autenticado
    const userInfo = document.querySelector('.user-info');
    const isAuthenticated = userInfo !== null;
    console.log('🔐 Usuario autenticado:', isAuthenticated);
    
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
    
    // Coordenadas (solo si son válidas)
    if (camping.latitud && camping.longitud && camping.latitud !== 0 && camping.longitud !== 0) {
        const coordenadas = document.createElement('p');
        coordenadas.className = 'camping-coordenadas';
        coordenadas.textContent = `📍 Coordenadas: ${camping.latitud.toFixed(4)}, ${camping.longitud.toFixed(4)}`;
        mainContainer.appendChild(coordenadas);
    } else {
        const sinCoordenadas = document.createElement('p');
        sinCoordenadas.className = 'camping-sin-coordenadas-info';
        sinCoordenadas.textContent = '📍 Este camping no tiene coordenadas disponibles';
        mainContainer.appendChild(sinCoordenadas);
    }
    
    // Botón de favoritos (solo si está autenticado)
    if (isAuthenticated) {
        const favButton = document.createElement('button');
        favButton.className = 'boton-estilo boton-favorito';
        favButton.textContent = '⭐ Agregar a Favoritos';
        favButton.style.marginTop = '15px';
        favButton.onclick = () => agregarAFavoritos(camping.n_registro, favButton);
        mainContainer.appendChild(favButton);
    }
    
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
        
        // 2. Cargar campings desde backend (BD)
        const campings = await cargarCampingsDesdeBackend();
        
        if (campings.length === 0) {
            console.warn('⚠️ No se cargaron campings');
            return;
        }
        
        // 3. Visualizar en mapa (solo con coordenadas)
        visualizarCampingsEnMapa(campings);
        
        // 4. Cargar campings sin coordenadas en sección inferior
        cargarCampingsSinCoordenadas(campings);
        
        console.log('✅ === APLICACIÓN INICIADA CORRECTAMENTE ===');
    } catch (error) {
        console.error('❌ Error en iniciarAplicación:', error);
    }
}

// ============================================
// 7. CAMPINGS SIN COORDENADAS
// ============================================
function cargarCampingsSinCoordenadas(todosCampings) {
    console.log('🔄 Filtrando campings sin coordenadas...');
    console.log('📊 Total de campings recibidos:', todosCampings.length);
    
    // Filtrar campings sin coordenadas válidas
    const sinCoords = todosCampings.filter(c => {
        const lat = c.latitud;
        const lon = c.longitud;
        
        // Verificar si las coordenadas son null, undefined, vacías, 0, o NaN
        const latInvalida = lat === null || lat === undefined || lat === '' || lat === 0 || lat === '0' || isNaN(parseFloat(lat));
        const lonInvalida = lon === null || lon === undefined || lon === '' || lon === 0 || lon === '0' || isNaN(parseFloat(lon));
        
        return latInvalida || lonInvalida;
    });
    
    console.log(`✅ ${sinCoords.length} campings sin coordenadas encontrados`);
    
    // Mostrar los campings sin coordenadas en consola
    if (sinCoords.length > 0) {
        console.log('📋 Lista de campings sin coordenadas:');
        sinCoords.forEach((c, index) => {
            console.log(`  ${index + 1}. ${c.nombre_camping} - lat: ${c.latitud}, lon: ${c.longitud}`);
        });
    }
    
    renderizarTarjetasCampings(sinCoords);
}

function renderizarTarjetasCampings(campings) {
    console.log('🎨 Renderizando tarjetas...');
    console.log('📊 Campings a renderizar:', campings.length);
    
    const contenedor = document.querySelector('.lista-campings-sin-coords');
    console.log('📦 Contenedor encontrado:', contenedor !== null);
    
    if (!contenedor) {
        console.error('❌ No se encontró el contenedor .lista-campings-sin-coords');
        return;
    }
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    console.log('🧹 Contenedor limpiado');
    
    if (campings.length === 0) {
        console.log('⚠️ No hay campings para renderizar');
        const mensaje = document.createElement('p');
        mensaje.className = 'mensaje-vacio';
        mensaje.textContent = 'No hay campings sin coordenadas';
        contenedor.appendChild(mensaje);
        return;
    }
    
    // Crear tarjeta para cada camping
    console.log('🔨 Creando tarjetas...');
    campings.forEach((camping, index) => {
        console.log(`  Creando tarjeta ${index + 1}/${campings.length}: ${camping.nombre_camping}`);
        const tarjeta = crearTarjetaCampingSinCoords(camping);
        contenedor.appendChild(tarjeta);
    });
    
    console.log(`✅ ${campings.length} tarjetas renderizadas en el DOM`);
    console.log('📊 Hijos del contenedor:', contenedor.children.length);
}

function crearTarjetaCampingSinCoords(camping) {
    console.log('🏗️ Creando tarjeta para:', camping.nombre_camping);
    
    // Crear tarjeta
    const tarjeta = document.createElement('div');
    tarjeta.className = 'camping-card-sin-coords';
    
    // Icono
    const icono = document.createElement('div');
    icono.className = 'camping-icono-sin-ubicacion';
    icono.textContent = '📍❌';
    tarjeta.appendChild(icono);
    
    // Nombre
    const nombre = document.createElement('h4');
    nombre.className = 'camping-nombre';
    nombre.textContent = camping.nombre_camping;
    tarjeta.appendChild(nombre);
    
    // Provincia
    const provincia = document.createElement('p');
    provincia.className = 'camping-provincia';
    const provinciaStrong = document.createElement('strong');
    provinciaStrong.textContent = 'Provincia: ';
    provincia.appendChild(provinciaStrong);
    provincia.appendChild(document.createTextNode(camping.provincia));
    tarjeta.appendChild(provincia);
    
    // Municipio
    const municipio = document.createElement('p');
    municipio.className = 'camping-municipio';
    const municipioStrong = document.createElement('strong');
    municipioStrong.textContent = 'Municipio: ';
    municipio.appendChild(municipioStrong);
    municipio.appendChild(document.createTextNode(camping.municipio));
    tarjeta.appendChild(municipio);
    
    // Click handler - adaptar estructura para mostrarInformacionEnContenedor
    tarjeta.addEventListener('click', () => {
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
            latitud: 0,
            longitud: 0
        };
        mostrarInformacionEnContenedor(campingAdaptado);
    });
    
    console.log('✅ Tarjeta creada correctamente');
    return tarjeta;
}

// ============================================
// 8. SISTEMA DE FAVORITOS
// ============================================
async function agregarAFavoritos(campingId, button) {
    console.log('⭐ Agregando a favoritos:', campingId);
    
    // Deshabilitar botón y cambiar texto
    button.disabled = true;
    const textoOriginal = button.textContent;
    button.textContent = '⏳ Procesando...';
    
    try {
        const response = await fetch('index.php?action=addFavoritos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_camping: campingId })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Add Favorite Response:', data);
        
        if (data.success) {
            console.log('✅ Favorito agregado correctamente');
            button.textContent = '✅ Agregado a Favoritos';
            mostrarNotificacion('Camping agregado a favoritos', 'success');
            
            // Restaurar botón después de 2 segundos
            setTimeout(() => {
                button.disabled = false;
                button.textContent = textoOriginal;
            }, 2000);
            
        } else {
            console.error('❌ Error al agregar:', data);
            button.disabled = false;
            button.textContent = textoOriginal;
            mostrarNotificacion(data.message || 'Error al agregar favorito', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error agregando favorito:', error);
        button.disabled = false;
        button.textContent = textoOriginal;
        mostrarNotificacion('Error de conexión al agregar', 'error');
    }
}

function mostrarNotificacion(mensaje, tipo) {
    console.log(`📢 Notificación [${tipo}]:`, mensaje);
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    
    // Añadir icono según tipo
    const icono = tipo === 'success' ? '✅ ' : '❌ ';
    notification.textContent = icono + mensaje;
    
    // Añadir al body
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// 9. EJECUTAR AL CARGAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', iniciarAplicacion);