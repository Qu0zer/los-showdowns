<?php
namespace Models;

use PDO;
use PDOException;

class Imagenes {
    private $id;
    private $nombre_fichero;
    private $titulo;
  

    public function __construct($id, $nombre_fichero, $titulo){
        $this->id = $id;
        $this->nombre_fichero = $nombre_fichero;
        $this->titulo = $titulo;
    }

    public function getId() { return $this->id; }
    public function getFichero() { return $this->nombre_fichero; }
    public function getTitulo() { return $this->titulo; }  
    public function getDescripcion(){ return $this->descripcion; }

    // método estático para obtener todas las imágenes de la base de datos
    public static function allImages($pdo){
        try{
            $sql = 'SELECT * FROM imagenes';
            $sentence = $pdo->prepare($sql);
            $sentence->execute();
            $allImages = $sentence->fetchAll(\PDO::FETCH_ASSOC);
            return $allImages;

        } catch(PDOException $e){
            return false;
        }
    }

    
}
?>