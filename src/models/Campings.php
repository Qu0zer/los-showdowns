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

    public function getPlazas(){ return $this->plazas; }

    public function getLongitud(){ return $this->longitud; }

    public function getLatitud(){ return $this->latitud; }

    // Función para obtener los datos de un camping
    public static function cargarCamping(){
        try{

        } catch (PDOException $e) {
            return false;
        }
    }

}
?>