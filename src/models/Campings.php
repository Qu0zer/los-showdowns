<?php
namespace Models;

use PDO;
use PDOException;

class Campings{
    private $id;
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
            $this->id = $data['id'] ?? null;
            $this->nombre_camping = $data['nombre_camping'] ?? null;
            $this->direccion = $data['direccion'] ?? null;
            $this->provincia = $data['provincia'] ?? null;
            $this->municipio = $data['municipio'] ?? null;
            $this->localidad = $data['localidad'] ?? null;
            $this->telefono = $data['telefono'] ?? null;
            $this->email = $data['email'] ?? null;
            $this->web = $data['web'] ?? null;
            $this->plazas = $data['plazas'] ?? null;
            $this->latitud = $data['latitud'] ?? null;
            $this->longitud = $data['longitud'] ?? null;
            
        }
    }

    // GETTERS de los campings
    public function getId(){ return $this->id; }

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
                return new self($allCampings);
            }
            return false;
            
        } catch (PDOException $e) {
            return false;
        }
    }

    // Función para guardar todos los datos de los campings de la API
    public function saveCampings($pdo){
        try{
            // En caso de que sea la primera vez que guardamos un camping
            if(!isset($this->id)){
                $sql = "
                INSERT INTO campings (nombre_camping, direccion, provincia, municipio, localidad, telefono, email, web, plazas, latitud, longitud) 
                VALUES (:nombre_camping, :direccion, :provincia, :municipio, :localidad, :telefono, :email, :web, :plazas, :latitud, :longitud)
                ";
                $sentence = $pdo->prepare($sql);
                $sentence->execute([
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
                return true;
            // En caso de que ya exista ese camping sobreescribimos la información actualizada
            } else if(isset($this->id)){
                $sql = 'UPDATE campings SET nombre_camping = :nombre_camping, direccion = :direccion, provincia = :provincia, municipio = :municipio, localidad = :localidad, telefono = :telefono, email = :email, web = :web, plazas = :plazas, latitud = :latitud, longitud = :longitud';
                $sentence = $pdo ->prepare($sql);
                $sentence->execute([
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
                return true;
            } else {
                return false;
            }
        } catch(PDOException $e){
            return false;
        }
        

    }

}
?>