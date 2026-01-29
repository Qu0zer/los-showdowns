<?php
    /*
    Controller de la API pública de Campings del Portal de Datos Abiertos de Castilla y León
    */
    namespace Controllers;

    use Models\Campings;

    class ApiController {
        // función para guardar todos los campings en la base de datos
        public function registrarCampings($pdo, $data){
            // Contamos el número total de campings asignados
            $length_data = count($data);
            for($i = 0; $i < $length_data; $i++){
                //Luego con la información de cada campamento solo extraemos los elementos que queremos guardar en nuestra base de datos
                $dataCamping = [
                    'n_registro' => $data[$i]['n_registro'],
                    'nombre_camping' => $data[$i]['nombre'],
                    'direccion' => $data[$i]['direccion'],
                    'provincia' => $data[$i]['provincia'],
                    'municipio' => $data[$i]['municipio'],
                    'localidad' => $data[$i]['localidad'],
                    'telefono' => $data[$i]['telefono_1'],
                    'email' => $data[$i]['email'],
                    'web' => $data[$i]['web'],
                    'plazas' => $data[$i]['plazas'],
                    'latitud'=> $data[$i]['posicion']['lat'],
                    'longitud' => $data[$i]['posicion']['lon']
                ];
                $camping = new Campings($dataCamping);
                if($camping){
                    $camping->saveCampings($pdo);
                }
            }
        }

    }
?>