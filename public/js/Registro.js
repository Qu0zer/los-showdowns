/**
 * Registro.js - Sistema de Registro de Usuarios
 * 
 * Gestiona el formulario de registro con validación en tiempo real.
 * Funcionalidades principales:
 * - Validación de campos (email, contraseña, términos)
 * - Verificación de coincidencia de contraseñas
 * - Registro mediante API REST
 * - Feedback visual en tiempo real
 * 
 * @author Asier Sanz, Jorge Toribio
 * @version 1.0.0
 */

// 1. MANEJO DEL FORMULARIO DE REGISTRO

/**
 * Event listener principal del formulario de registro
 * 
 * Captura el submit, valida todos los campos y envía los datos
 * a la API si las validaciones son correctas.
 */
const formRegistro = document.getElementById('formRegistro');

if (formRegistro) {
    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores de los campos
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terminos = document.getElementById('terminos').checked;
        
        // Elementos de mensajes
        const mensajeError = document.getElementById('mensajeError');
        const mensajeExito = document.getElementById('mensajeExito');
        
        // Ocultar mensajes previos
        mensajeError.style.display = 'none';
        mensajeExito.style.display = 'none';
        
        // Validaciones
        if (!validarFormulario(nombre, email, password, confirmPassword, terminos)) {
            mostrarError(mensajeError, 'Por favor, completa todos los campos correctamente');
            return;
        }
        
        // Validar email
        if (!validarEmail(email)) {
            mostrarError(mensajeError, 'Por favor, ingresa un email válido');
            return;
        }
        
        // Validar contraseña
        if (password.length < 6) {
            mostrarError(mensajeError, 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            mostrarError(mensajeError, 'Las contraseñas no coinciden');
            return;
        }
        
        // Validar términos y condiciones
        if (!terminos) {
            mostrarError(mensajeError, 'Debes aceptar los términos y condiciones');
            return;
        }
        
        // Simulación de registro exitoso
        registrarUsuario(nombre, email, password, mensajeExito);
    });
}

/**
 * Valida que todos los campos del formulario estén completos
 * 
 * @param {string} nombre - Nombre de usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 * @param {boolean} terminos - Aceptación de términos y condiciones
 * @returns {boolean} true si todos los campos están completos
 */
function validarFormulario(nombre, email, password, confirmPassword, terminos) {
    return nombre && email && password && confirmPassword && terminos;
}

/**
 * Valida el formato de un email usando expresión regular
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} true si el formato es válido
 */
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Muestra un mensaje de error en el elemento especificado
 * 
 * El mensaje se oculta automáticamente después de 5 segundos.
 * 
 * @param {HTMLElement} elemento - Elemento donde mostrar el error
 * @param {string} mensaje - Texto del mensaje de error
 * @returns {void}
 */
function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}

/**
 * Registra un nuevo usuario mediante la API REST
 * 
 * Envía los datos del usuario a la API, procesa la respuesta y
 * redirige al login si el registro es exitoso.
 * 
 * @async
 * @param {string} nombre - Nombre de usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {HTMLElement} mensajeExito - Elemento para mostrar mensaje de éxito
 * @returns {Promise<void>}
 */
async function registrarUsuario(nombre, email, password, mensajeExito) {
    const mensajeError = document.getElementById('mensajeError');
    
    try {
        const response = await fetch('index.php?action=procesarRegistro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            mensajeExito.textContent = data.message;
            mensajeExito.style.display = 'block';
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = 'index.php?action=login';
            }, 2000);
        } else {
            mostrarError(mensajeError, data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError(mensajeError, 'Error de conexión. Por favor, intenta de nuevo.');
    }
}

// 2. VALIDACIÓN EN TIEMPO REAL

/**
 * Validación visual en tiempo real de confirmación de contraseña
 * 
 * Cambia el color del borde del campo según si las contraseñas coinciden.
 * Verde si coinciden, rojo si no coinciden.
 */
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

if (password && confirmPassword) {
    confirmPassword.addEventListener('input', function() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.style.borderColor = '#c62828';
        } else {
            confirmPassword.style.borderColor = '#4CAF50';
        }
    });
}