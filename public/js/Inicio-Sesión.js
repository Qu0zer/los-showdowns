// Manejo básico del formulario de inicio de sesión
document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const mensajeError = document.getElementById('mensajeError');
            
            // Simulación de login (aquí conectarías con tu backend)
            if (email && password) {
                // Login exitoso - redirigir al mapa
                alert('¡Bienvenido a CampestresCyL!');
                window.location.href = 'index.php?action=inicio';
            } else {
                // Mostrar error
                mensajeError.style.display = 'block';
                setTimeout(() => {
                    mensajeError.style.display = 'none';
                }, 3000);
            }
        });
    }
});