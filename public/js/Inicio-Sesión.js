/**
 * Inicio-Sesión.js - Sistema de Autenticación
 * 
 * Gestiona el formulario de inicio de sesión con validación y autenticación.
 * Funcionalidades principales:
 * - Validación de campos de login
 * - Autenticación mediante API REST
 * - Manejo de errores y feedback visual
 * - Redirección automática tras login exitoso
 * 
 * @author Asier Sanz, Jorge Toribio
 * @version 1.0.0
 */

// 1. MANEJO DEL FORMULARIO DE LOGIN

/**
 * Event listener principal del formulario de inicio de sesión
 * 
 * Captura el submit, valida campos y envía credenciales a la API.
 * Redirige a la página principal si el login es exitoso.
 */
const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const identifier = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const mensajeError = document.getElementById('mensajeError');
        
        // Ocultar mensajes previos
        mensajeError.style.display = 'none';
        
        // Validación básica
        if (!identifier || !password) {
            mensajeError.textContent = 'Por favor, completa todos los campos';
            mensajeError.style.display = 'block';
            setTimeout(() => {
                mensajeError.style.display = 'none';
            }, 5000);
            return;
        }
        
        try {
            const response = await fetch('index.php?action=procesarLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier: identifier,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Login exitoso - redirigir al inicio
                window.location.href = 'index.php?action=inicio';
            } else {
                // Mostrar error del servidor
                mensajeError.textContent = data.message;
                mensajeError.style.display = 'block';
                setTimeout(() => {
                    mensajeError.style.display = 'none';
                }, 5000);
            }
        } catch (error) {
            console.error('Error:', error);
            mensajeError.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
            mensajeError.style.display = 'block';
            setTimeout(() => {
                mensajeError.style.display = 'none';
            }, 5000);
        }
    });
}
