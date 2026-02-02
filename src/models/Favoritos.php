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
                $sql = 'SELECT c.* FROM campings c 
                        INNER JOIN favoritos f ON c.n_registro = f.id_camping 
                        WHERE f.id_usuario = :id_usuario';
                $sentence = $pdo->prepare($sql);
                $sentence->execute([
                    'id_usuario' => $id_usuario
                ]);
                $campings = $sentence->fetchAll(PDO::FETCH_ASSOC);
                return $campings;

            } catch(PDOException $e){
                return false;
            }
        }

        // Función para agregar un camping a favoritos
        public static function agregarFavorito($pdo, $id_usuario, $id_camping){
            try{
                // Verificar si ya existe
                $sql = 'SELECT id FROM favoritos WHERE id_usuario = :id_usuario AND id_camping = :id_camping';
                $sentence = $pdo->prepare($sql);
                $sentence->execute([
                    'id_usuario' => $id_usuario,
                    'id_camping' => $id_camping
                ]);
                
                if($sentence->fetch()){
                    return ['success' => false, 'message' => 'Ya está en favoritos'];
                }

                // Insertar nuevo favorito
                $sql = 'INSERT INTO favoritos (id_usuario, id_camping) VALUES (:id_usuario, :id_camping)';
                $sentence = $pdo->prepare($sql);
                $result = $sentence->execute([
                    'id_usuario' => $id_usuario,
                    'id_camping' => $id_camping
                ]);

                return ['success' => $result, 'message' => $result ? 'Agregado a favoritos' : 'Error al agregar'];

            } catch(PDOException $e){
                return ['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()];
            }
        }

        // Función para eliminar un camping de favoritos
        public static function eliminarFavorito($pdo, $id_usuario, $id_camping){
            try{
                $sql = 'DELETE FROM favoritos WHERE id_usuario = :id_usuario AND id_camping = :id_camping';
                $sentence = $pdo->prepare($sql);
                $result = $sentence->execute([
                    'id_usuario' => $id_usuario,
                    'id_camping' => $id_camping
                ]);

                return ['success' => $result, 'message' => $result ? 'Eliminado de favoritos' : 'No se encontró en favoritos'];

            } catch(PDOException $e){
                return ['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()];
            }
        }

    }
?>