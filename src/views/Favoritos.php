<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Favoritos - CampestresCyL</title>
    <link rel="stylesheet" href="./css/CampestresCyL.css">
    <link rel="stylesheet" href="./css/Favoritos.css">
    <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto:wght@300;400&display=swap" rel="stylesheet">
</head>
<body>
    <header class="cabecera">
        <div class="contenido-cabecera">
            <h1>CampestresCyL</h1>
            <img src="./images/CamPiMG/Logo CampestresCyL.jpeg" alt="Logo CampestresCyL" class="logo-principal">
            <?php if(isset($_SESSION['usuario'])): ?>
                <div class="user-info">
                    <div class="user-name">Campista, <?=htmlspecialchars($_SESSION['usuario']->getUsername())?></div>
                    <a href="index.php?action=logout">
                        <button class="boton-estilo" id="boton-logout">💀 Cerrar Sesión</button>
                    </a>
                </div>
            <?php else: ?>
                <div class="botones-superiores">
                    <a href="index.php?action=login"><button class="boton-estilo">Inicio-sesion</button></a>
                    <a href="index.php?action=registro"><button class="boton-estilo">Registrarse</button></a>
                </div>
            <?php endif; ?>
            <div class="acciones">
                <a href="index.php">
                    <button class="boton-estilo">🏠 Inicio</button>
                </a>
                <a href="index.php?action=consejos">
                    <button class="boton-estilo">💡 Consejos</button>
                </a>
            </div>
        </div>
    </header>

    <main class="contenedor-favoritos">
        <div class="titulo-seccion">
            <h2>⭐ Mis Campings Favoritos</h2>
            <p>Aquí encontrarás todos los campings que has marcado como favoritos</p>
        </div>
        
        <!-- Contenedor para tarjetas dinámicas -->
        <div class="lista-favoritos"></div>
        
        <!-- Mensaje vacío (se oculta cuando hay favoritos) -->
        <div class="mensaje-vacio">
            <h3>🏕️ Aún no tienes campings favoritos</h3>
            <p>Explora el mapa y agrega campings a tus favoritos haciendo clic en el botón ⭐ de cada camping.</p>
            <a href="index.php">
                <button class="boton-estilo boton-grande">🗺️ Explorar Campings</button>
            </a>
        </div>
    </main>

    <footer class="pie-de-pagina">
        <p>&copy; 2026 CampestresCyL. Todos los derechos reservados.</p>
    </footer>
    
    <!-- Script de Favoritos -->
    <script src="./js/Favoritos.js"></script>
</body>
</html>