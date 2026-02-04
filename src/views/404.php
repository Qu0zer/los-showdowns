<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/CampestresCyL.css">
    <link rel="stylesheet" href="./css/404.css">
    <title>Página no encontrada - CampestresCyL</title>
</head>
<body>

<header class="cabecera">
    <div class="contenido-cabecera">
        <h1>CampestresCyL</h1>
        <div class="botones-superiores">
            <a href="index.php?action=login"><button class="boton-estilo">⭐ Inicio-sesion</button></a>
            <a href="index.php?action=registro"><button class="boton-estilo">⭐ Registrarse</button></a>
        </div>
        <img src="./images/CamPiMG/Logo CampestresCyL.jpeg" class="logo-principal" alt="Logo" loading="lazy">
        <div class="acciones">
            <a href="index.php">
                <button class="boton-estilo">🏠 Volver al inicio</button>
            </a>
        </div>
    </div>
</header>

<main class="contenedor-404">
    <div class="error-container">
        <div class="error-numero">404</div>
        <div class="error-mensaje">
            <h2>¡Oops! Parece que te has perdido en el bosque</h2>
            <p>La página que buscas no existe o ha sido movida.</p>
            <p>Pero no te preocupes, ¡hay muchos campings esperándote!</p>
        </div>
        
        <div class="camping-ilustracion">
            <img src="./images/CamPiMG/Campestre.png" alt="Camping ilustración" class="imagen-camping" loading="lazy">
        </div>
        
        <div class="acciones-404">
            <a href="index.php">
                <button class="boton-estilo boton-principal">🏠 Ir al inicio</button>
            </a>
            <a href="index.php?action=favoritos">
                <button class="boton-estilo">⭐ Ver favoritos</button>
            </a>
            <a href="index.php?action=consejos">
                <button class="boton-estilo">💡 Consejos</button>
            </a>
        </div>
    </div>
</main>

<footer class="pie-de-pagina">
    <p>&copy; 2026 CampestresCyL. Todos los derechos reservados.</p>
</footer>

<script src="./js/404.js" defer></script>
</body>
</html>