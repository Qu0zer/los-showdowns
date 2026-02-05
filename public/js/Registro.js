// Manejo del formulario de registro
// Con defer, el script ya se ejecuta después del DOM
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

// Función para validar el formulario
function validarFormulario(nombre, email, password, confirmPassword, terminos) {
    return nombre && email && password && confirmPassword && terminos;
}

// Función para validar email
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar errores
function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}

// Función para registrar usuario mediante API
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

// Validación en tiempo real de confirmación de contraseña
// Con defer, el script ya se ejecuta después del DOM
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