<?php
    try{
        header('Content-Type: application/json');
        
        if(isset($_SERVER['REQUEST_METHOD'])){
            $apiController = new \Controllers\ApiController();
            $api_method = $_SERVER['REQUEST_METHOD'];
            $action = $_GET['action'] ?? '';
            
            $allowedApiActions = [
                'cargarCampings' => 'cargarCampings',
                'mostrarFavoritos' => 'mostrarFavoritos',
                'addFavoritos' => 'addFavoritos',
                'deleteFavoritos' => 'deleteFavoritos',
                'procesarLogin' => 'procesarLogin',
                'procesarRegistro' => 'procesarRegistro'
            ];
            
            if(isset($allowedApiActions[$action])){
                
                switch($allowedApiActions[$action]){
                    case 'cargarCampings':
                        // Cargar campings desde BD (GET)
                        $campings = $apiController->cargarCampings($pdo);
                        echo json_encode($campings);
                        break;
                    case 'mostrarFavoritos':
                        $favoritos = $apiController->mostrarFavoritos($pdo);
                        echo json_encode($favoritos);
                        break;
                    case 'addFavoritos':
                        if($api_method === 'POST'){
                            $resultado = $apiController->addFavoritos($pdo);
                            echo json_encode($resultado);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
                        }
                        break;
                    case 'deleteFavoritos':
                        if($api_method === 'POST'){
                            $resultado = $apiController->deleteFavoritos($pdo);
                            echo json_encode($resultado);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
                        }
                        break;
                    case 'procesarLogin':
                        if($api_method === 'POST'){
                            $authController = new \Controllers\AuthController();
                            $resultado = $authController->procesarLoginApi($pdo);
                            echo json_encode($resultado);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'Método POST requerido']);
                        }
                        break;
                    case 'procesarRegistro':
                        if($api_method === 'POST'){
                            $authController = new \Controllers\AuthController();
                            $resultado = $authController->procesarRegistroApi($pdo);
                            echo json_encode($resultado);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'Método POST requerido']);
                        }
                        break;
                    default:
                        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Acción no permitida']);
            }
        }

    } catch(Exception $e){
        http_response_code(500);
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => 'Error interno del servidor', 'message' => $e->getMessage()]);
    }
?>