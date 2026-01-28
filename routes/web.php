<?php
    try{
        $method = $_SERVER['REQUEST_METHOD'];
        $webController = new \Controllers\WebController();
        // URI con WHITELIST accesible
        $allowedViewsWeb = [
            'mostrarLogin' => 'mostrarLogin',
            'mostrarRegistro' => 'mostrarRegistro',
            'intro' => 'intro',
            'logout' => 'logout'
        ];

        $allowedViewsAuth = [
            'procesarLogin' => 'procesarLogin',
            'procesarRegistro' => 'procesarRegistro',
            
        ];

        $action = $_GET['action'] ?? 'intro';

        // Enrutamientos para mostrar las principales vistas
        
        if(isset($allowedViewsWeb[$action]) && $method === 'GET'){
            $controllerMethod = $allowedViewsWeb[$action];
            $webController->$controllerMethod($pdo);
        } else if(isset($allowedViewsAuth[$action]) && $method === 'POST'){
            $controllerMethod = $allowedViewsAuth[$action];
            $authController->$controllerMethod($pdo);
        } else {
            require dirname(__DIR__) . '/app/Views/404.php';
        }

    } catch (Exception $e){
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json');
    }
?>