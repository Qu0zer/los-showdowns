<?php
    namespace Controllers;

    class WebController{
      
    // Función con la que mostrar la página inicial 
    public function inicio($pdo){
        require dirname(__DIR__) . '/views/CampestresCyL.php';
    }

    // Función con la que mostrar el menú con sus opciones
    public function favoritos($pdo){
        if(isset($_SESSION['usuario'])){
            $usuario = $_SESSION['usuario'];
            require dirname(__DIR__) . '/views/web/Favoritos.php';
        } else {
            header('Location: index.php?action=login');
            exit();
        }
    }

    // Función con la que muestra la página del login
    public function login($pdo) {
        if(isset($_SESSION['usuario'])){
            header('Location: index.php?action=inicio');
            exit();
        } else {
            require_once dirname(__DIR__) . '/views/Inicio-Sesión.php';
        }
    }

    // Función con la que muestra la página del registro
    public function registro($pdo) {
        require_once dirname(__DIR__) . '/views/Registro.php';
    }

    // Función para cerrar sesión
    public function logout() { 
        session_start();
        session_destroy();
        header('Location: index.php');
        exit();
    }
    }
?>