<?php
    /*
    Controller de la API pública de Campings del Portal de Datos Abiertos de Castilla y León
    */
    namespace Controllers;

    use Models\Campings;
    use Models\Favoritos;

    class ApiController {
        
        // Función para guardar campings que vienen desde el frontend (refactorizados)
        public function guardarCampings($pdo){
            try {
                // Obtener los datos del body (array de campings refactorizados)
                $input = json_decode(file_get_contents('php://input'), true);
                
                error_log("=== GUARDAR CAMPINGS ===");
                error_log("Input recibido: " . print_r($input, true));
                error_log("Tipo de input: " . gettype($input));
                
                // Validar que sea un array
                if (!is_array($input)) {
                    error_log("ERROR: Input no es array");
                    return [
                        'success' => false,
                        'message' => 'Los datos recibidos no son válidos',
                        'debug' => [
                            'tipo_recibido' => gettype($input),
                            'contenido' => $input
                        ]
                    ];
                }
                
                $campings = $input;
                error_log("Total de campings a guardar: " . count($campings));
                
                $results = [
                    'success' => true,
                    'total' => count($campings),
                    'insertados' => 0,
                    'actualizados' => 0,
                    'errores' => []
                ];
                
                // Procesar cada camping
                foreach ($campings as $index => $campingData) {
                    try {
                        error_log("Procesando camping $index: " . ($campingData['nombre'] ?? 'Sin nombre'));
                        
                        // Validar que tenga los campos necesarios
                        if (!isset($campingData['n_registro']) || !isset($campingData['nombre'])) {
                            error_log("ERROR: Faltan campos en camping $index");
                            $results['errores'][] = [
                                'index' => $index,
                                'nombre' => $campingData['nombre'] ?? 'Sin nombre',
                                'error' => 'Faltan campos obligatorios (n_registro, nombre)'
                            ];
                            continue;
                        }
                        
                        error_log("Datos del camping: " . print_r($campingData, true));
                        
                        // Crear instancia del modelo Campings
                        $camping = new Campings($campingData);
                        error_log("Modelo Campings creado");
                        
                        $resultado = $camping->saveCampings($pdo);
                        error_log("Resultado de saveCampings: " . print_r($resultado, true));
                        
                        if ($resultado['success']) {
                            if ($resultado['action'] === 'insert') {
                                $results['insertados']++;
                                error_log("✅ Camping insertado: " . $campingData['nombre']);
                            } else {
                                $results['actualizados']++;
                                error_log("✅ Camping actualizado: " . $campingData['nombre']);
                            }
                        } else {
                            error_log("❌ Error guardando camping: " . $resultado['error']);
                            $results['errores'][] = [
                                'index' => $index,
                                'nombre' => $campingData['nombre'] ?? 'Sin nombre',
                                'error' => $resultado['error'] ?? 'Error desconocido'
                            ];
                        }
                    } catch (Exception $e) {
                        error_log("❌ Excepción en camping $index: " . $e->getMessage());
                        $results['errores'][] = [
                            'index' => $index,
                            'nombre' => $campingData['nombre'] ?? 'Sin nombre',
                            'error' => $e->getMessage()
                        ];
                    }
                }
                
                error_log("Resultado final: " . print_r($results, true));
                return $results;
            } catch (Exception $e) {
                error_log("❌ Excepción general: " . $e->getMessage());
                return [
                    'success' => false,
                    'message' => 'Error al procesar campings: ' . $e->getMessage()
                ];
            }
        }
        //función para cargar todos los campings en la base de datos
        public function cargarCampings($pdo){
            // Solo cargar campings existentes en la BD
            $allCampings = Campings::cargarCampings($pdo);
            
            // Formatear la respuesta para que coincida con lo que espera el frontend
            if($allCampings && !empty($allCampings)){
                $formattedCampings = [];
                foreach($allCampings as $camping){
                    $formattedCampings[] = [
                        'record' => [
                            'fields' => [
                                'nombre' => $camping['nombre_camping'],
                                'provincia' => $camping['provincia'],
                                'municipio' => $camping['municipio'],
                                'localidad' => $camping['localidad'],
                                'direccion' => $camping['direccion'],
                                'telefono' => $camping['telefono'],
                                'email' => $camping['email'],
                                'web' => $camping['web'],
                                'plazas' => $camping['plazas'],
                                'establecimiento' => 'Campings',
                                'coordenadas_geograficas' => [
                                    'lat' => $camping['latitud'],
                                    'lon' => $camping['longitud']
                                ]
                            ]
                        ]
                    ];
                }
                return ['results' => $formattedCampings];
            }
            
            return ['results' => []];
        }

        // Función para mostrar favoritos de un usuario
        public function mostrarFavoritos($pdo){
            if(!isset($_SESSION['usuario'])){
                return ['success' => false, 'message' => 'Usuario no autenticado'];
            }
            
            $id_usuario = $_SESSION['usuario']['id'];
            $favoritos = Favoritos::obtenerCampingsPorUsuario($pdo, $id_usuario);
            return ['success' => true, 'data' => $favoritos];
        }

        // Función para agregar camping a favoritos
        public function addFavoritos($pdo){
            if(!isset($_SESSION['usuario'])){
                return ['success' => false, 'message' => 'Usuario no autenticado'];
            }

            $input = json_decode(file_get_contents('php://input'), true);
            if(!isset($input['id_camping'])){
                return ['success' => false, 'message' => 'ID de camping requerido'];
            }

            $id_usuario = $_SESSION['usuario']['id'];
            $id_camping = $input['id_camping'];
            
            return Favoritos::agregarFavorito($pdo, $id_usuario, $id_camping);
        }

        // Función para eliminar camping de favoritos
        public function deleteFavoritos($pdo){
            if(!isset($_SESSION['usuario'])){
                return ['success' => false, 'message' => 'Usuario no autenticado'];
            }

            $input = json_decode(file_get_contents('php://input'), true);
            if(!isset($input['id_camping'])){
                return ['success' => false, 'message' => 'ID de camping requerido'];
            }

            $id_usuario = $_SESSION['usuario']['id'];
            $id_camping = $input['id_camping'];
            
            return Favoritos::eliminarFavorito($pdo, $id_usuario, $id_camping);
        }
    }
?>