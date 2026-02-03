<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/CampestresCyL.css">
    <link rel="stylesheet" href="./css/Consejos.css">
    <title>Consejos para Camping - CampestresCyL</title>
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
            <a href="index.php?action=favoritos">
                <button class="boton-estilo">⭐ Favoritos</button>
            </a>
        </div>
    </div>
</header>

<main class="contenedor-consejos">
    <div class="titulo-seccion">
        <h2>💡 Consejos para tu Aventura de Camping</h2>
        <p>Todo lo que necesitas saber para disfrutar al máximo de tu experiencia en la naturaleza</p>
    </div>

    <div class="grid-consejos">
        <!-- Preparación -->
        <section class="categoria-consejo">
            <div class="icono-categoria">🎒</div>
            <h3>Preparación y Equipamiento</h3>
            <div class="consejos-lista">
                <div class="consejo-item">
                    <h4>🏕️ Tienda de campaña</h4>
                    <p>Elige una tienda resistente al agua y fácil de montar. Practica montarla en casa antes del viaje.</p>
                </div>
                <div class="consejo-item">
                    <h4>🛏️ Saco de dormir</h4>
                    <p>Selecciona según la temperatura esperada. Un saco demasiado caliente es mejor que uno insuficiente.</p>
                </div>
                <div class="consejo-item">
                    <h4>🔦 Iluminación</h4>
                    <p>Lleva linternas, frontales y lámparas de camping. No olvides pilas de repuesto.</p>
                </div>
                <div class="consejo-item">
                    <h4>🍳 Cocina portátil</h4>
                    <p>Hornillo de gas, utensilios básicos y recipientes ligeros. Planifica menús sencillos.</p>
                </div>
            </div>
        </section>

        <!-- Seguridad -->
        <section class="categoria-consejo">
            <div class="icono-categoria">🛡️</div>
            <h3>Seguridad y Primeros Auxilios</h3>
            <div class="consejos-lista">
                <div class="consejo-item">
                    <h4>🚨 Botiquín básico</h4>
                    <p>Tiritas, antiséptico, analgésicos, vendas y medicamentos personales.</p>
                </div>
                <div class="consejo-item">
                    <h4>📱 Comunicación</h4>
                    <p>Informa tu ubicación a familiares. Lleva batería externa y considera un silbato de emergencia.</p>
                </div>
                <div class="consejo-item">
                    <h4>🔥 Fuego seguro</h4>
                    <p>Respeta las normativas locales. Apaga completamente las hogueras y nunca las dejes desatendidas.</p>
                </div>
                <div class="consejo-item">
                    <h4>🌦️ Clima</h4>
                    <p>Consulta la previsión meteorológica y prepárate para cambios inesperados.</p>
                </div>
            </div>
        </section>

        <!-- Ubicación -->
        <section class="categoria-consejo">
            <div class="icono-categoria">📍</div>
            <h3>Elección del Lugar</h3>
            <div class="consejos-lista">
                <div class="consejo-item">
                    <h4>🏞️ Terreno adecuado</h4>
                    <p>Busca superficies planas, alejadas de ríos y protegidas del viento fuerte.</p>
                </div>
                <div class="consejo-item">
                    <h4>💧 Acceso al agua</h4>
                    <p>Verifica la disponibilidad de agua potable o lleva suficiente cantidad.</p>
                </div>
                <div class="consejo-item">
                    <h4>🚻 Servicios</h4>
                    <p>Confirma la disponibilidad de baños, duchas y puntos de recogida de basura.</p>
                </div>
                <div class="consejo-item">
                    <h4>📋 Permisos</h4>
                    <p>Asegúrate de que el camping esté permitido en la zona elegida.</p>
                </div>
            </div>
        </section>

        <!-- Respeto ambiental -->
        <section class="categoria-consejo">
            <div class="icono-categoria">🌱</div>
            <h3>Respeto por la Naturaleza</h3>
            <div class="consejos-lista">
                <div class="consejo-item">
                    <h4>🗑️ No dejes rastro</h4>
                    <p>Recoge toda tu basura y déjala en contenedores apropiados. La naturaleza no es un basurero.</p>
                </div>
                <div class="consejo-item">
                    <h4>🌿 Flora y fauna</h4>
                    <p>No dañes plantas ni molestes a los animales. Observa desde la distancia.</p>
                </div>
                <div class="consejo-item">
                    <h4>🔇 Ruido</h4>
                    <p>Mantén un volumen bajo, especialmente por la noche. Respeta el descanso de otros.</p>
                </div>
                <div class="consejo-item">
                    <h4>🚰 Agua</h4>
                    <p>No contamines fuentes de agua. Usa jabones biodegradables lejos de ríos y lagos.</p>
                </div>
            </div>
        </section>

        <!-- Comodidad -->
        <section class="categoria-consejo">
            <div class="icono-categoria">😌</div>
            <h3>Comodidad y Bienestar</h3>
            <div class="consejos-lista">
                <div class="consejo-item">
                    <h4>👕 Ropa adecuada</h4>
                    <p>Viste por capas, lleva ropa de repuesto y calzado cómodo e impermeable.</p>
                </div>
                <div class="consejo-item">
                    <h4>🧴 Higiene personal</h4>
                    <p>Productos básicos de aseo, toallas de secado rápido y papel higiénico.</p>
                </div>
                <div class="consejo-item">
                    <h4>🎯 Entretenimiento</h4>
                    <p>Juegos de cartas, libros, instrumentos musicales para momentos de relax.</p>
                </div>
                <div class="consejo-item">
                    <h4>🍽️ Alimentación</h4>
                    <p>Planifica comidas nutritivas y fáciles de preparar. No olvides snacks energéticos.</p>
                </div>
            </div>
        </section>

        <!-- Planificación -->
        <section class="categoria-consejo">
            <div class="icono-categoria">📋</div>
            <h3>Planificación del Viaje</h3>
            <div class="consejos-lista">
                <div class="consejo-item">
                    <h4>🗓️ Reservas anticipadas</h4>
                    <p>Reserva tu camping con antelación, especialmente en temporada alta y fines de semana.</p>
                </div>
                <div class="consejo-item">
                    <h4>🛣️ Ruta planificada</h4>
                    <p>Estudia el camino, puntos de interés cercanos y alternativas en caso de imprevistos.</p>
                </div>
                <div class="consejo-item">
                    <h4>💰 Presupuesto</h4>
                    <p>Calcula gastos de camping, combustible, comida y actividades extras.</p>
                </div>
                <div class="consejo-item">
                    <h4>📄 Documentación</h4>
                    <p>Lleva DNI, seguro del vehículo, tarjeta sanitaria y contactos de emergencia.</p>
                </div>
            </div>
        </section>

        <!-- Actividades -->
        <section class="categoria-consejo">
            <div class="icono-categoria">🏃</div>
            <h3>Actividades y Ocio</h3>
            <div class="consejos-lista">
                <div class="consejo-item">
                    <h4>🥾 Senderismo</h4>
                    <p>Lleva calzado adecuado, mapa de rutas y agua suficiente para las caminatas.</p>
                </div>
                <div class="consejo-item">
                    <h4>🎣 Pesca</h4>
                    <p>Verifica si necesitas licencia de pesca y respeta las vedas y tallas mínimas.</p>
                </div>
                <div class="consejo-item">
                    <h4>📸 Fotografía</h4>
                    <p>Captura los mejores momentos. Lleva baterías extra y protege el equipo de la humedad.</p>
                </div>
                <div class="consejo-item">
                    <h4>🌟 Observación nocturna</h4>
                    <p>Aprovecha la ausencia de contaminación lumínica para observar las estrellas.</p>
                </div>
            </div>
        </section>

        <!-- Consejos específicos Castilla y León -->
        <section class="categoria-consejo especial">
            <div class="icono-categoria">🏰</div>
            <h3>Especial Castilla y León</h3>
            <div class="consejos-lista">
                <div class="consejo-item">
                    <h4>🌡️ Clima continental</h4>
                    <p>Prepárate para grandes diferencias de temperatura entre día y noche, especialmente en montaña.</p>
                </div>
                <div class="consejo-item">
                    <h4>🏔️ Montañas y valles</h4>
                    <p>Las zonas de León, Palencia y Burgos pueden tener clima más fresco. Lleva ropa de abrigo.</p>
                </div>
                <div class="consejo-item">
                    <h4>🍷 Gastronomía local</h4>
                    <p>Aprovecha para probar productos locales: quesos, embutidos y vinos de la región.</p>
                </div>
                <div class="consejo-item">
                    <h4>🏛️ Patrimonio cercano</h4>
                    <p>Muchos campings están cerca de monumentos históricos. Planifica visitas culturales.</p>
                </div>
            </div>
        </section>
    </div>

    <div class="cta-final">
        <h3>¿Listo para tu aventura?</h3>
        <p>Explora nuestros campings recomendados en Castilla y León</p>
        <a href="index.php">
            <button class="boton-estilo boton-grande">🗺️ Ver Mapa de Campings</button>
        </a>
    </div>
</main>

<footer class="pie-de-pagina">
    <p>&copy; 2026 CampestresCyL. Todos los derechos reservados.</p>
</footer>

</body>
</html>