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
            $results = [
                'total' => $length_data,
                'insertados' => 0,
                'actualizados' => 0,
                'errores' => [],
                'errores_validados' => []
            ];
            for($i = 0; $i < $length_data; $i++){
                // Validamos primero que exista el campo n_registro
                if(!isset($data[$i]['n_registro'])){
                    $results['errores_validados'][] = [
                        'camping' => $data[$i]['nombre'] ?? 'Sin nombre',
                        'razon' => 'Falta el campo n_registro'
                    ];
                    
                }
                if(!isset($data[$i]['posicion']) || !isset($data[$i]['posicion']['lat']) || !isset($data[$i]['posicion']['lon'])){
                     $results['errores_validados'][] = [
                        'n_registro' => $data[$i]['n_registro'],
                        'camping' => $data[$i]['nombre'] ?? 'Sin nombre',
                        'razon' => 'Faltan coordenadas'
                    ];
                }
                //Luego con la información de cada campamento solo extraemos los elementos que queremos guardar en nuestra base de datos
                $dataCamping = [
                    'n_registro' => $data[$i]['n_registro'] ?? null,
                    'nombre_camping' => $data[$i]['nombre'] ?? null,
                    'direccion' => $data[$i]['direccion'] ?? null,
                    'provincia' => $data[$i]['provincia'] ?? null,
                    'municipio' => $data[$i]['municipio'] ?? null,
                    'localidad' => $data[$i]['localidad'] ?? null,
                    'telefono' => $data[$i]['telefono_1'] ?? null,
                    'email' => $data[$i]['email'] ?? null,
                    'web' => $data[$i]['web'] ?? null, 
                    'plazas' => $data[$i]['plazas'] ?? null,
                    'latitud'=> $data[$i]['posicion']['lat'] ?? null,
                    'longitud' => $data[$i]['posicion']['lon'] ?? null
                ];
                $camping = new Campings($dataCamping);
                $resultado = $camping->saveCampings($pdo);
                //var_dump($camping);
                if($resultado['success']){
                    if($resultado['action'] === 'insert'){
                        $results['insertados']++;
                    } else {
                        $results['actualizados']++;
                    }
                } else {
                    $results['errores'][] = [
                        'n_registro' => $resultado['n_registro'],
                        'nombre' => $resultado['nombre'],
                        'razon' => $resultado['error'],
                        'error' => $resultado['error'] ?? null
                    ];
                }
            }
            var_dump($results);    
        }
    }
?>