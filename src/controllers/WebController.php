<?php
/**
 * WebController - Controlador de vistas y navegación
 * 
 * Gestiona el renderizado de todas las vistas HTML de la aplicación.
 * Controla el acceso a páginas protegidas mediante validación de sesión.
 * 
 * @package Controllers
 * @author Asier Sanz, Jorge Toribio
 * @version 1.0.0
 */
namespace Controllers;

class WebController{
      
    /**
     * Renderiza la página principal con el mapa interactivo
     * 
     * Vista pública accesible sin autenticación. Muestra el mapa de Leaflet
     * con todos los campings de Castilla y León.
     * 
     * @param PDO $pdo Conexión a la base de datos
     * @return void
     */
    public function inicio($pdo){
        require dirname(__DIR__) . '/views/CampestresCyL.php';
    }

    /**
     * Renderiza la página de favoritos del usuario
     * 
     * Vista protegida que requiere autenticación. Muestra los campings
     * guardados como favoritos por el usuario actual.
     * 
     * @param PDO $pdo Conexión a la base de datos
     * @return void Redirige a login si no hay sesión activa
     */
    public function favoritos($pdo){
        if(isset($_SESSION['usuario'])){
            $usuario = $_SESSION['usuario'];
            require dirname(__DIR__) . '/views/Favoritos.php';
        } else {
            header('Location: index.php?action=login');
            exit();
        }
    }

    /**
     * Renderiza la página de inicio de sesión
     * 
     * Si el usuario ya tiene sesión activa, redirige automáticamente
     * a la página principal.
     * 
     * @param PDO $pdo Conexión a la base de datos
     * @return void
     */
    public function login($pdo) {
        if(isset($_SESSION['usuario'])){
            header('Location: index.php?action=inicio');
            exit();
        } else {
            require_once dirname(__DIR__) . '/views/Inicio-Sesión.php';
        }
    }

    /**
     * Renderiza la página de registro de nuevos usuarios
     * 
     * Vista pública para crear nuevas cuentas de usuario.
     * 
     * @param PDO $pdo Conexión a la base de datos
     * @return void
     */
    public function registro($pdo) {
        require_once dirname(__DIR__) . '/views/Registro.php';
    }

    /**
     * Cierra la sesión del usuario actual
     * 
     * Destruye la sesión PHP y redirige a la página principal.
     * 
     * @return void
     */
    public function logout() { 
        session_start();
        session_destroy();
        header('Location: index.php');
        exit();
    }

    /**
     * Renderiza la página de error 404
     * 
     * Establece el código HTTP 404 y muestra la vista de error personalizada.
     * 
     * @param PDO $pdo Conexión a la base de datos
     * @return void
     */
    public function error404($pdo) {
        http_response_code(404);
        require dirname(__DIR__) . '/views/404.php';
    }

    /**
     * Renderiza la página de consejos para campistas
     * 
     * Vista pública con información útil y recomendaciones para acampar.
     * 
     * @param PDO $pdo Conexión a la base de datos
     * @return void
     */
    public function consejos($pdo) {
        require dirname(__DIR__) . '/views/Consejos.php';
    }
    }
?>