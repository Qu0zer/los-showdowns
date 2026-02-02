<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/CampestresCyL.css">
    <title>CampestresCyL</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>
<body> 

<header class="cabecera">
    <div class="contenido-cabecera">
        <h1>CampestresCyL</h1>
        <div class="botones-superiores">
            <a href="index.php?action=login"><button class="boton-estilo">Inicio-sesion</button></a>
            <a href="index.php?action=registro"><button class="boton-estilo">Registrarse</button></a>
        </div>
        <img src="./images/CamPiMG/Logo CampestresCyL.jpeg" class="logo-principal" alt="Logo">
        <div class="acciones">
            <a href="index.php?action=favoritos">
                <button class="boton-estilo">⭐ Favoritos</button>
            </a>
            <a href="index.php?action=consejos">
                <button class="boton-estilo">💡 Consejos</button>
            </a>
        </div>
    </div>
</header>
<main class="contenedor-principal">
    <section class="Mapa-CyL">
        <div class="mapa">
            <h2>Mapa interactivo de Castilla y León</h2>
            <div class="buscador-mapa">
                <input type="text" id="buscador-campings" placeholder="🔍 Buscar campings..." class="input-buscador-mapa">
                <button id="btn-limpiar-mapa" class="btn-limpiar-mapa">✕</button>
            </div>
        </div>
        <div id="mapa-interactivo"></div>
        
        <!-- Sección del clima -->
        <div class="clima-actual">
            <h3>🌤️ Clima en Castilla y León</h3>
            <div id="clima-contenido">
                <p>Cargando información del clima...</p>
            </div>
        </div>
    </section>
    <div class="informaion">
        <h3>Información sobre los campings</h3>
        <p>Cargando campings desde la API oficial...</p>
    </div>
</main>
<footer class="pie-de-pagina">
    <p>&copy; 2026 CampestresCyL. Todos los derechos reservados.</p>
</footer>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="./js/CampestresCyL.js"></script>
</body>
</html>