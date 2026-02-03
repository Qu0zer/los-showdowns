<?php
    namespace Controllers;

    use Models\Usuario;

    class AuthController {
        // Función para procesar el login
        /*public function procesarLogin($pdo) {
            $identifier = trim($_POST['email'] ?? '');
            $password = htmlspecialchars($_POST['password'] ?? '');
            if(!empty($identifier) && !empty($password)){
                $usuario = Usuario::login($pdo, $identifier, $password);
                if($usuario){
                    $_SESSION['usuario'] = $usuario;
                    header('Location: index.php?action=inicio');
                    exit();
                } else {
                    header('Location: index.php?action=login');
                    exit();
                }
            }
        }*/

        // Función para procesar el registro
        /*public function procesarRegistro($pdo) {
            $username = trim($_POST['nombre'] ?? '');
            $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
            $password = $_POST['password'] ?? '';
            if(!empty($username) && !empty($password) && !empty($email)){
                // Llamamos a registro para que se aplique
                if(Usuario::register($pdo, $username, $email, $password)){
                    header('Location: index.php?action=login');
                    exit();
                } else {
                    header('Location: index.php?action=registro');
                    exit();
                } 
            }
        }*/

        // Función para procesar el login mediante API (JSON)
        public function procesarLoginApi($pdo) {
            // Leer JSON input
            $jsonData = json_decode(file_get_contents('php://input'), true);
            $identifier = trim($jsonData['identifier'] ?? '');
            $password = $jsonData['password'] ?? '';
            
            // Sanitizar inputs
            $identifier = htmlspecialchars($identifier);
            $password = htmlspecialchars($password);
            
            // Validar inputs
            if(empty($identifier) || empty($password)){
                return ['success' => false, 'message' => 'Todos los campos son requeridos'];
            }
            
            // Intentar login
            $usuario = Usuario::login($pdo, $identifier, $password);
            
            if($usuario){
                $_SESSION['usuario'] = $usuario;
                return [
                    'success' => true,
                    'message' => 'Login exitoso',
                    'usuario' => [
                        'id' => $usuario->getId(),
                        'username' => $usuario->getUsername(),
                        'email' => $usuario->getEmail()
                    ]
                ];
            } else {
                return ['success' => false, 'message' => 'Credenciales inválidas'];
            }
        }

        // Función para procesar el registro mediante API (JSON)
        public function procesarRegistroApi($pdo) {
            // Leer JSON input
            $jsonData = json_decode(file_get_contents('php://input'), true);
            $username = trim($jsonData['nombre'] ?? '');
            $email = $jsonData['email'] ?? '';
            $password = $jsonData['password'] ?? '';
            
            // Sanitizar inputs
            $username = htmlspecialchars($username);
            $password = htmlspecialchars($password);
            
            // Validar inputs
            if(empty($username) || empty($email) || empty($password)){
                return ['success' => false, 'message' => 'Todos los campos son requeridos'];
            }
            
            // Validar formato de email
            $email = filter_var($email, FILTER_VALIDATE_EMAIL);
            if($email === false){
                return ['success' => false, 'message' => 'Email inválido'];
            }
            
            // Intentar registro
            $result = Usuario::register($pdo, $username, $email, $password);
            
            if($result){
                return ['success' => true, 'message' => 'Usuario registrado exitosamente'];
            } else {
                return ['success' => false, 'message' => 'El usuario ya existe'];
            }
        }
    }
?>