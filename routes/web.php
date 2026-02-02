<?php
    try{
        $method = $_SERVER['REQUEST_METHOD'];
        $webController = new \Controllers\WebController();
        $authController = new \Controllers\AuthController();
        // URI con WHITELIST accesible
        $allowedViewsWeb = [
            'inicio' => 'inicio',
            'favoritos' => 'favoritos',
            'login' => 'login',
            'registro' => 'registro',
            'logout' => 'logout',
            'consejos' => 'consejos',
            '404' => 'error404'
        ];
        $allowedViewsAuth = [
            'procesarLogin' => 'procesarLogin',
            'procesarRegistro' => 'procesarRegistro'
        ];
        $action = $_GET['action'] ?? 'inicio';
        // Enrutamientos para mostrar las principales vistas
        if(isset($allowedViewsWeb[$action]) && $method === 'GET'){
            $controllerMethod = $allowedViewsWeb[$action];
            $webController->$controllerMethod($pdo);
        } else if(isset($allowedViewsAuth[$action]) && $method === 'POST'){
            $controllerMethod = $allowedViewsAuth[$action];
            $authController->$controllerMethod($pdo);
        } else {
            $webController->error404($pdo);
        }

    } catch (Exception $e){
        http_response_code(500);
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json');
    }
?>