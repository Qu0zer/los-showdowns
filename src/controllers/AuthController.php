<?php
    namespace Controllers;

    use Models\Usuario;

    class AuthController {
        // Función para procesar el login
        public function procesarLogin($pdo) {
            $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
            $password = htmlspecialchars($_POST['password'] ?? '');
            if(!empty($email) && !empty($password)){
                $usuario = Usuario::login($pdo, $email, $password);
                if($usuario){
                    $_SESSION['usuario'] = $usuario;
                    header('Location: index.php?action=inicio');
                    exit();
                } else {
                    header('Location: index.php?action=login');
                    exit();
                }
            }
        }

        // Función para procesar el registro
        public function procesarRegistro($pdo) {
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
        }
    }
?>