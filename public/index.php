<?php
    require_once dirname(__DIR__) . '/vendor/autoload.php';
    session_start();

    require_once dirname(__DIR__) . '/src/config/db.php'; // Conexión a la base de datos
    $pdo = Database::connect();
    
    $action = $_GET['action'] ?? 'inicio';
    
    // Definir acciones que son de API
    $apiActions = ['guardarCampings', 'cargarCampings', 'mostrarFavoritos', 'addFavoritos', 'deleteFavoritos'];
    
    // Detectar si es una llamada a la API
    if(in_array($action, $apiActions)){
        // Es una llamada a la API
        require_once dirname(__DIR__) . '/routes/api.php';
    } else {
        // Es una llamada web normal (inicio, login, registro, favoritos, etc.)
        require_once dirname(__DIR__) . '/routes/web.php';
    }
?>