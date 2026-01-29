<?php
    require_once dirname(__DIR__) . '/vendor/autoload.php';
    session_start();

    require_once dirname(__DIR__) . '/src/config/db.php'; // Conexión a la base de datos
    $pdo = Database::connect();
    /*if($pdo){
        echo 'Conexión exitosa!';
    } else {
        echo 'La conexión ha fallado';
    }*/
    $uri = $_SERVER['REQUEST_URI'];
    // Dirigir al tipo de enrutamiento en función de la URL asignada
    if(strpos($uri, '/api/') === 0){
        require_once dirname(__DIR__) . '/routes/api.php';
    } else {
        require_once dirname(__DIR__) . '/routes/web.php';
    }

?>