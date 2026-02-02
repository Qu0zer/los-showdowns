<?php
namespace Models;

use PDO;
use PDOException;

class Campings{
    private $n_registro;
    private $nombre_camping;
    private $direccion;
    private $provincia;
    private $municipio;
    private $localidad;
    private $telefono;
    private $email;
    private $web;
    private $plazas;
    private $latitud;
    private $longitud;


    // Constructor de los campings
    public function __construct($data = []){
        if(!empty($data)){
            $this->n_registro = $data['n_registro'] ?? null;
            // Aceptar tanto 'nombre' como 'nombre_camping'
            $this->nombre_camping = $data['nombre'] ?? $data['nombre_camping'] ?? null;
            $this->direccion = $data['direccion'] ?? null;
            $this->provincia = $data['provincia'] ?? null;
            $this->municipio = $data['municipio'] ?? null;
            $this->localidad = $data['localidad'] ?? null;
            // Aceptar tanto 'telefono' como 'telefono_1'
            $this->telefono = $data['telefono'] ?? $data['telefono_1'] ?? null;
            $this->email = $data['email'] ?? null;
            $this->web = $data['web'] ?? null;
            $this->plazas = $data['plazas'] ?? null;
            $this->latitud = $data['latitud'] ?? null;
            $this->longitud = $data['longitud'] ?? null;
            
        }
    }

    // GETTERS de los campings
    public function getRegistro(){ return $this->n_registro; }

    public function getNombre(){ return $this->nombre_camping; }

    public function getDireccion(){ return $this->direccion; }

    public function getProvincia(){ return $this->provincia; }

    public function getMunicipio(){ return $this->municipio; }

    public function getLocalidad(){ return $this->localidad; }

    public function getTelefono(){ return $this->telefono; }

    public function getEmail(){ return $this->email; }

    public function getWeb(){ return $this->web; }

    public function getPlazas(){ return $this->plazas; }

    public function getLongitud(){ return $this->longitud; }

    public function getLatitud(){ return $this->latitud; }

    // Función para obtener los datos de un camping
    public static function cargarCampings($pdo){
        try{
            $sql = 'SELECT * FROM campings';
            $sentence = $pdo->prepare($sql);
            $sentence->execute();
            $allCampings = $sentence->fetchAll(PDO::FETCH_ASSOC);
            if($allCampings){
                return $allCampings;
            }
            return false;
            
        } catch (PDOException $e) {
            return false;
        }
    }

    // Función para guardar todos los datos de los campings de la API
    public function saveCampings($pdo){
        try{
            // Primero verificar si el camping ya existe en la BD
            $sqlCheck = 'SELECT n_registro FROM campings WHERE n_registro = :n_registro';
            $sentenceCheck = $pdo->prepare($sqlCheck);
            $sentenceCheck->execute([':n_registro' => $this->n_registro]);
            $exists = $sentenceCheck->fetch(PDO::FETCH_ASSOC);
            
            // Si NO existe, hacer INSERT
            if(!$exists){
                $sql = 'INSERT INTO campings (n_registro, nombre_camping, direccion, provincia, municipio, localidad, telefono, email, web, plazas, latitud, longitud) 
                VALUES (:n_registro, :nombre_camping, :direccion, :provincia, :municipio, :localidad, :telefono, :email, :web, :plazas, :latitud, :longitud)';
                $sentence = $pdo->prepare($sql);
                $sentence->execute([
                    ':n_registro' => $this->n_registro,
                    ':nombre_camping' => $this->nombre_camping,
                    ':direccion' => $this->direccion,
                    ':provincia' => $this->provincia,
                    ':municipio' => $this->municipio,
                    ':localidad' => $this->localidad,
                    ':telefono' => $this->telefono,
                    ':email' => $this->email,
                    ':web' => $this->web,
                    ':plazas' => $this->plazas,
                    ':latitud' => $this->latitud,
                    ':longitud' => $this->longitud
                ]);
                return [
                    'success' => true,
                    'action' => 'insert',
                    'n_registro' => $this->n_registro,
                    'nombre' => $this->nombre_camping
                ];
            // Si YA existe, hacer UPDATE
            } else {
                $sql = 'UPDATE campings SET nombre_camping = :nombre_camping, direccion = :direccion, provincia = :provincia, municipio = :municipio, localidad = :localidad, telefono = :telefono, email = :email, web = :web, plazas = :plazas, latitud = :latitud, longitud = :longitud
                WHERE n_registro = :n_registro';
                $sentence = $pdo->prepare($sql);
                $sentence->execute([
                    ':n_registro' => $this->n_registro,
                    ':nombre_camping' => $this->nombre_camping,
                    ':direccion' => $this->direccion,
                    ':provincia' => $this->provincia,
                    ':municipio' => $this->municipio,
                    ':localidad' => $this->localidad,
                    ':telefono' => $this->telefono,
                    ':email' => $this->email,
                    ':web' => $this->web,
                    ':plazas' => $this->plazas,
                    ':latitud' => $this->latitud,
                    ':longitud' => $this->longitud
                ]);
                return [
                    'success' => true,
                    'action' => 'update',
                    'n_registro' => $this->n_registro,
                    'nombre' => $this->nombre_camping
                ];
            }
        } catch(PDOException $e){
            return [
                'success' => false,
                'error' => 'Error de la base de datos: ' . $e->getMessage(),
                'error_code' => $e->getCode(),
                'n_registro' => $this->n_registro,
                'nombre' => $this->nombre_camping
            ];
        }
    }

}
?>