<?php
namespace Models;

use PDO;
use PDOException;

class Usuario {
    private $id;
    private $username;
    private $email;

    public function __construct($id, $username, $email){
        $this->id = $id;
        $this->username = $username;
        $this->email = $email;
    }

    public function getId() { return $this->id; }

    public function getUsername() { return $this->username; }

    public function getEmail() { return $this->email; }

    // Método estático para iniciar sesión
    public static function login($pdo, $email, $password){
        $sql = "SELECT * FROM usuarios WHERE email = :email"; 
        try{
            $sentencia = $pdo->prepare($sql);
            $sentencia->execute([':email' => $email]);
            $datosUsuario = $sentencia->fetch(\PDO::FETCH_ASSOC);

            if($datosUsuario && password_verify($password, $datosUsuario['password'])){
                // ¡Éxito! Devolvemos el objeto Usuario con su ID
                return new self($datosUsuario['id'], $datosUsuario['nombre_usuario'], $datosUsuario['email']);
            } 
            return false; 
        }
        catch (PDOException $e){
            return false;
        }
    }

    public static function register($pdo, $username, $email, $password){
        try {
            // Comprobación si el usuario ya está registrado
            $sql = "SELECT id FROM usuarios WHERE nombre_usuario = :username";
            $sentence = $pdo->prepare($sql);
            $sentence->execute([
                ':username' => $username
            ]);
            $result = $sentence->fetch();
            // Si es null, significa que no está registrado dicho usuario en la base de datos con lo que podemos proceder a insertarlo
            if(empty($result)){
                $hashPassword = password_hash($password, PASSWORD_DEFAULT);
                $sql = "INSERT INTO usuarios (nombre_usuario, email, password) VALUES (:username, :email, :pass)";
                $sentence = $pdo->prepare($sql);
                $sentence->execute([
                    ':username' => $username, 
                    ':email' => $email, 
                    ':pass' => $hashPassword
                ]);
                return true;
            } else {
                return false;
            }
        } catch (PDOException $e) {
            return false;
        }
    }
}