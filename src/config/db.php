<?php
    class Database {
        private static $pdo = null;
        public static function connect() {
            if(self::$pdo === null){
                $host = 'localhost';
                $dbname = 'campestrecyl_campings';
                $user = 'root';
                $pass = '';
                $port = 80;
                try{
                    // Creo una nueva instancia de PDO
                    self::$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8;", $user, $pass);
                    self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                } catch (PDOException $e) {
                    // Si la conexión falla, se muestra un mensaje de error y se termina el script
                    die('Error al conectar con la base de datos: ' . $e->getMessage());
                }
            }
            return self::$pdo;
        }
    }
?>