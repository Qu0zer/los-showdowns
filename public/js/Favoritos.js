/**
 * Favoritos.js - Sistema de Gestión de Favoritos
 * 
 * Gestiona la visualización y eliminación de campings favoritos del usuario.
 * Funcionalidades principales:
 * - Carga de favoritos desde API REST
 * - Renderizado dinámico de tarjetas de campings
 * - Eliminación de favoritos con animación
 * - Sistema de notificaciones visuales
 * 
 * Requiere: Sesión de usuario activa
 * 
 * @author Asier Sanz, Jorge Toribio
 * @version 1.0.0
 */

// 1. CARGAR FAVORITOS DESDE API
/**
 * Carga los campings favoritos del usuario desde la API
 * 
 * Realiza petición GET a la API, procesa la respuesta y renderiza
 * las tarjetas de campings o muestra mensaje si no hay favoritos.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function cargarFavoritos() {
    console.log('🔄 Cargando favoritos desde API...');
    
    try {
        const response = await fetch('index.php?action=mostrarFavoritos');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 API Response:', data);
        
        if (data.success && data.data && data.data.length > 0) {
            console.log(`✅ ${data.data.length} favoritos encontrados`);
            
            // Ocultar mensaje vacío
            const mensajeVacio = document.querySelector('.mensaje-vacio');
            if (mensajeVacio) {
                mensajeVacio.style.display = 'none';
            }
            
            // Crear o limpiar contenedor de lista
            let container = document.querySelector('.lista-favoritos');
            if (!container) {
                container = document.createElement('div');
                container.className = 'lista-favoritos';
                const contenedorPrincipal = document.querySelector('.contenedor-favoritos');
                const tituloSeccion = document.querySelector('.titulo-seccion');
                if (tituloSeccion && contenedorPrincipal) {
                    tituloSeccion.insertAdjacentElement('afterend', container);
                }
            } else {
                container.innerHTML = '';
            }
            
            // Renderizar cada camping
            data.data.forEach(camping => {
                const card = crearTarjetaCamping(camping);
                container.appendChild(card);
            });
            
        } else if (data.success && data.data && data.data.length === 0) {
            console.log('ℹ️ No hay favoritos');
            
            // Mostrar mensaje vacío
            const mensajeVacio = document.querySelector('.mensaje-vacio');
            if (mensajeVacio) {
                mensajeVacio.style.display = 'block';
            }
            
            // Ocultar o limpiar lista
            const container = document.querySelector('.lista-favoritos');
            if (container) {
                container.innerHTML = '';
            }
            
        } else {
            console.error('❌ Error en respuesta de API:', data);
            mostrarNotificacion(data.message || 'Error al cargar favoritos', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error cargando favoritos:', error);
        mostrarNotificacion('Error de conexión al cargar favoritos', 'error');
    }
}

// 2. CREAR TARJETA DE CAMPING

/**
 * Crea una tarjeta HTML con la información completa de un camping
 * 
 * Genera dinámicamente todos los elementos DOM necesarios para mostrar
 * los datos del camping y el botón de eliminación.
 * 
 * @param {Object} camping - Objeto con datos del camping
 * @param {string} camping.nombre_camping - Nombre del camping
 * @param {string} camping.n_registro - Número de registro único
 * @param {string} camping.direccion - Dirección completa
 * @param {string} camping.provincia - Provincia
 * @param {string} camping.municipio - Municipio
 * @param {string} camping.telefono - Teléfono de contacto
 * @param {string} camping.email - Email de contacto
 * @param {string} camping.web - Sitio web
 * @param {string} camping.plazas - Número de plazas disponibles
 * @returns {HTMLElement} Elemento div con la tarjeta completa
 */
function crearTarjetaCamping(camping) {
    console.log('🏕️ Creando tarjeta para:', camping.nombre_camping);
    
    // Crear contenedor de tarjeta
    const card = document.createElement('div');
    card.className = 'camping-card';
    card.setAttribute('data-camping-id', camping.n_registro);
    
    // Crear título
    const title = document.createElement('h3');
    title.textContent = `🏕️ ${camping.nombre_camping}`;
    card.appendChild(title);
    
    // Datos de información
    const infoData = [
        { icon: '📍', label: 'Dirección', value: camping.direccion },
        { icon: '🏛️', label: 'Provincia', value: camping.provincia },
        { icon: '🏘️', label: 'Municipio', value: camping.municipio },
        { icon: '📞', label: 'Teléfono', value: camping.telefono },
        { icon: '📧', label: 'Email', value: camping.email },
        { icon: '🌐', label: 'Web', value: camping.web },
        { icon: '🏕️', label: 'Plazas', value: camping.plazas }
    ];
    
    // Crear items de información
    infoData.forEach(info => {
        const item = document.createElement('div');
        item.className = 'info-item';
        
        const icon = document.createElement('span');
        icon.textContent = info.icon;
        item.appendChild(icon);
        
        const label = document.createElement('strong');
        label.textContent = info.label + ': ';
        item.appendChild(label);
        
        const value = document.createElement('span');
        value.textContent = info.value;
        item.appendChild(value);
        
        card.appendChild(item);
    });
    
    // Crear botón de eliminar
    const removeBtn = document.createElement('button');
    removeBtn.className = 'boton-estilo boton-eliminar';
    removeBtn.textContent = '🗑️ Quitar de Favoritos';
    removeBtn.onclick = () => eliminarFavorito(camping.n_registro, removeBtn);
    card.appendChild(removeBtn);
    
    return card;
}

// 3. ELIMINAR FAVORITO

/**
 * Elimina un camping de la lista de favoritos del usuario
 * 
 * Realiza petición DELETE a la API, anima la eliminación de la tarjeta
 * y actualiza la interfaz mostrando mensaje vacío si es necesario.
 * 
 * @async
 * @param {string} campingId - ID del camping a eliminar
 * @param {HTMLButtonElement} button - Botón que disparó la acción
 * @returns {Promise<void>}
 */
async function eliminarFavorito(campingId, button) {
    console.log('🗑️ Eliminando favorito:', campingId);
    
    // Deshabilitar botón y cambiar texto
    button.disabled = true;
    const textoOriginal = button.textContent;
    button.textContent = '⏳ Eliminando...';
    
    try {
        const response = await fetch('index.php?action=deleteFavoritos', {
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
        console.log('📦 Delete Response:', data);
        
        if (data.success) {
            console.log('✅ Favorito eliminado correctamente');
            
            // Encontrar y animar la tarjeta
            const card = button.closest('.camping-card');
            if (card) {
                card.classList.add('fade-out');
                
                // Esperar a que termine la animación
                setTimeout(() => {
                    card.remove();
                    
                    // Verificar si la lista está vacía
                    const container = document.querySelector('.lista-favoritos');
                    if (container && container.children.length === 0) {
                        const mensajeVacio = document.querySelector('.mensaje-vacio');
                        if (mensajeVacio) {
                            mensajeVacio.style.display = 'block';
                        }
                    }
                }, 300);
            }
            
            mostrarNotificacion('Camping eliminado de favoritos', 'success');
            
        } else {
            console.error('❌ Error al eliminar:', data);
            button.disabled = false;
            button.textContent = textoOriginal;
            mostrarNotificacion(data.message || 'Error al eliminar favorito', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error eliminando favorito:', error);
        button.disabled = false;
        button.textContent = textoOriginal;
        mostrarNotificacion('Error de conexión al eliminar', 'error');
    }
}

// 4. MOSTRAR NOTIFICACIÓN

/**
 * Muestra una notificación temporal en pantalla
 * 
 * Crea un elemento de notificación con estilo según el tipo (success/error),
 * lo añade al DOM y lo elimina automáticamente después de 3 segundos.
 * 
 * @param {string} mensaje - Texto a mostrar en la notificación
 * @param {string} tipo - Tipo de notificación ('success' o 'error')
 * @returns {void}
 */
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

// 5. INICIALIZACIÓN
console.log('🚀 Favoritos.js inicializado');
cargarFavoritos();
