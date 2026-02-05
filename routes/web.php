<?php
/**
 * Web Routes - Enrutador de vistas HTML
 * 
 * Gestiona todas las rutas públicas de la aplicación mediante un sistema
 * de whitelist. Valida métodos HTTP y acciones permitidas antes de ejecutar
 * los controladores correspondientes.
 * 
 * Arquitectura: Front Controller Pattern
 * - Punto único de entrada: public/index.php
 * - Enrutamiento basado en parámetro GET 'action'
 * - Validación de seguridad mediante whitelist
 * 
 * @author Asier Sanz, Jorge Toribio
 * @version 1.0.0
 */

try{
    $method = $_SERVER['REQUEST_METHOD'];
    $webController = new \Controllers\WebController();
    $authController = new \Controllers\AuthController();
    
    /**
     * Whitelist de vistas accesibles vía GET
     * Mapea acciones a métodos del WebController
     */
    $allowedViewsWeb = [
        'inicio' => 'inicio',
        'favoritos' => 'favoritos',
        'login' => 'login',
        'registro' => 'registro',
        'logout' => 'logout',
        'consejos' => 'consejos',
        '404' => 'error404'
    ];
    
    /**
     * Whitelist de acciones de autenticación vía POST
     * Mapea acciones a métodos del AuthController (actualmente sin uso)
     */
    /*$allowedViewsAuth = [
        'procesarLogin' => 'procesarLogin',
        'procesarRegistro' => 'procesarRegistro'
    ];*/
    
    // Obtener acción solicitada (por defecto: inicio)
    $action = $_GET['action'] ?? 'inicio';
    
    if(isset($allowedViewsWeb[$action]) && $method === 'GET'){
            $controllerMethod = $allowedViewsWeb[$action];
            $webController->$controllerMethod($pdo);
    } else if(isset($allowedViewsAuth[$action]) && $method === 'POST'){
        // Procesar autenticación (legacy, actualmente se usa API REST)
        $controllerMethod = $allowedViewsAuth[$action];
        $authController->$controllerMethod($pdo);
    } else {
        // Ruta no encontrada - mostrar 404
        $webController->error404($pdo);
    }

} catch (Exception $e){
    // Error interno del servidor
    http_response_code(500);
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json');
}
?>