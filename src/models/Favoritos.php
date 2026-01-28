<?php
    namespace Models;

    use PDO;
    use PDOException;

    class Favoritos{
        private $id;
        private $id_usuario;
        private $id_camping;

        public function __construct($id, $id_usuario, $id_camping){
            $this->id = $id;
            $this->id_usuario = $id_usuario;
            $this->id_camping = $id_camping;
        }

        // GETTERS

        public function getId() { return $this->id; }

        public function getIdUsuario() { return $this->id_usuario; }

        public function getIdCamping() { return $this->id_camping; }

        // Función que establece LA CONEXIÓN ENTRE EL USUARIO (id_usuario) y EL NÚMERO DE SUS CAMPINGS (id_campings)

        public static function obtenerCampingsPorUsuario($pdo, $id_usuario){
            try{
                $sql = 'SELECT id_camping FROM favoritos WHERE id_usuario = :id_usuario';
                $sentence = $pdo->prepare($sql);
                $sentence->execute([
                    'id_usuario' => $id_usuario
                ]);
                $campingsPorUsuario = $sentence->fetch(PDO::FETCH_ASSOC);
                if($campingsPorUsuario){
                    return new self($campingsPorUsuario);
                }
                return false;

            } catch(PDOException $e){
                return false;
            }
        }

    }
?>