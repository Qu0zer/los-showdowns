<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - CampestresCyL</title>
    <link rel="stylesheet" href="./css/Registro.css">
</head>
<body>
    <a href="index.php?action=inicio" class="btn-volver">← Volver al Mapa</a>
    
    <div class="contenedor-registro">
        <div class="card-registro">
            <img src="./images/CamPiMG/Logo CampestresCyL.jpeg" alt="Logo CampestresCyL" class="logo-registro">
            
            <h1>Crear Cuenta</h1>
            <p>Únete a la comunidad de CampestresCyL</p>
            
            <div class="mensaje-error" id="mensajeError">
                Por favor, completa todos los campos correctamente
            </div>
            
            <div class="mensaje-exito" id="mensajeExito">
                ¡Cuenta creada exitosamente! Redirigiendo...
            </div>
            
            <form id="formRegistro" action="index.php?action=procesarRegistro" method="POST">
                <div class="form-grupo">
                    <label for="nombre">👤 Nombre completo:</label>
                    <input type="text" id="nombre" name="nombre" required placeholder="Tu nombre completo">
                </div>
                
                <div class="form-grupo">
                    <label for="email">📧 Email:</label>
                    <input type="email" id="email" name="email" required placeholder="tu@email.com">
                </div>
                
                <div class="form-grupo">
                    <label for="password">🔒 Contraseña:</label>
                    <input type="password" id="password" name="password" required placeholder="Mínimo 6 caracteres">
                </div>
                
                <div class="form-grupo">
                    <label for="confirmPassword">🔒 Confirmar contraseña:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Repite tu contraseña">
                </div>
                
                <div class="form-grupo checkbox-grupo">
                    <input type="checkbox" id="terminos" name="terminos" required>
                    <label for="terminos" class="label-con-tooltip">
                        Acepto los términos y condiciones
                        <span class="tooltip">¡Acepta ser feliz y disfrutar yendo de camping!</span>
                    </label>
                </div>
                
                <button type="submit" class="btn-registro">📝 Crear Cuenta</button>
            </form>
            
            <div class="enlaces-adicionales">
                <a href="index.php?action=login">¿Ya tienes cuenta? Inicia sesión</a>
            </div>
        </div>
    </div>

    <script src="./js/Registro.js"></script>
</body>
</html>