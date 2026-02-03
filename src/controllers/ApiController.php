<?php
    /*
    Controller de la API pública de Campings del Portal de Datos Abiertos de Castilla y León
    */
    namespace Controllers;

    use Models\Campings;
    use Models\Favoritos;

    class ApiController {
        
        // Función para guardar campings desde API externa de Castilla y León
        public function guardarCampings($pdo){
            error_log("=== GUARDAR CAMPINGS DESDE API EXTERNA ===");
            
            try {
                // 1. Extraer campings desde API pública
                $campingsRaw = $this->extraerCampingsDesdeAPI();
                
                if (empty($campingsRaw)) {
                    return [
                        'success' => false,
                        'message' => 'No se pudieron extraer campings de la API externa'
                    ];
                }
                
                error_log("Total de campings extraídos: " . count($campingsRaw));
                
                // 2. Refactorizar datos
                $campingsRefactorizados = $this->refactorizarCampings($campingsRaw);
                
                error_log("Total de campings refactorizados: " . count($campingsRefactorizados));
                
                // 3. Guardar en base de datos
                $results = [
                    'success' => true,
                    'total' => count($campingsRefactorizados),
                    'insertados' => 0,
                    'actualizados' => 0,
                    'errores' => []
                ];
                
                foreach ($campingsRefactorizados as $index => $campingData) {
                    try {
                        // Crear instancia del modelo Campings
                        $camping = new Campings($campingData);
                        $resultado = $camping->saveCampings($pdo);
                        
                        if ($resultado['success']) {
                            if ($resultado['action'] === 'insert') {
                                $results['insertados']++;
                            } else {
                                $results['actualizados']++;
                            }
                        } else {
                            $results['errores'][] = [
                                'index' => $index,
                                'nombre' => $campingData['nombre'] ?? 'Sin nombre',
                                'error' => $resultado['error'] ?? 'Error desconocido'
                            ];
                        }
                    } catch (Exception $e) {
                        $results['errores'][] = [
                            'index' => $index,
                            'nombre' => $campingData['nombre'] ?? 'Sin nombre',
                            'error' => $e->getMessage()
                        ];
                    }
                }
                
                error_log("Resultado final: Insertados={$results['insertados']}, Actualizados={$results['actualizados']}, Errores=" . count($results['errores']));
                return $results;
                
            } catch (Exception $e) {
                error_log("❌ Excepción general: " . $e->getMessage());
                return [
                    'success' => false,
                    'message' => 'Error al procesar campings: ' . $e->getMessage()
                ];
            }
        }
        
        // Función privada para extraer campings desde API pública
        private function extraerCampingsDesdeAPI(){
            error_log("🔄 Extrayendo campings desde API pública...");
            
            $provincias = ['León', 'Salamanca', 'Burgos', 'Ávila', 'Soria', 'Segovia', 'Palencia', 'Valladolid', 'Zamora'];
            $campingsGlobal = [];
            
            foreach ($provincias as $provincia) {
                try {
                    $apiUrl = "https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/registro-de-turismo-de-castilla-y-leon/records?where=provincia%20%3D%20%27" . urlencode($provincia) . "%27&limit=100&refine=establecimiento%3A%22Campings%22";
                    
                    error_log("📍 Cargando campings de {$provincia}...");
                    
                    // Usar file_get_contents para hacer la petición
                    $response = @file_get_contents($apiUrl);
                    
                    if ($response === false) {
                        error_log("❌ Error al cargar {$provincia}");
                        continue;
                    }
                    
                    $data = json_decode($response, true);
                    
                    if (isset($data['results']) && is_array($data['results'])) {
                        error_log("✅ {$provincia}: " . count($data['results']) . " campings encontrados");
                        $campingsGlobal = array_merge($campingsGlobal, $data['results']);
                    }
                    
                } catch (Exception $e) {
                    error_log("❌ Error al cargar {$provincia}: " . $e->getMessage());
                }
            }
            
            error_log("🏕️ Total de campings extraídos: " . count($campingsGlobal));
            return $campingsGlobal;
        }
        
        // Función privada para refactorizar datos de la API
        private function refactorizarCampings($campingsRaw){
            error_log("🔧 Refactorizando datos...");
            
            $campingsRefactorizados = [];
            $sinCoordenadas = 0;
            
            foreach ($campingsRaw as $camping) {
                try {
                    // Obtener coordenadas
                    $lat = null;
                    $lon = null;
                    
                    if (isset($camping['posicion']) && is_array($camping['posicion'])) {
                        $lat = floatval($camping['posicion']['lat'] ?? 0);
                        $lon = floatval($camping['posicion']['lon'] ?? 0);
                    } elseif (isset($camping['gps_latitud']) && isset($camping['gps_longitud'])) {
                        $lat = floatval($camping['gps_latitud']);
                        $lon = floatval($camping['gps_longitud']);
                    } elseif (isset($camping['latitud']) && isset($camping['longitud'])) {
                        $lat = floatval($camping['latitud']);
                        $lon = floatval($camping['longitud']);
                    }
                    
                    // Validar coordenadas
                    if (empty($lat) || empty($lon) || $lat < 40.0 || $lat > 43.5 || $lon < -7.5 || $lon > -1.5) {
                        $sinCoordenadas++;
                        continue;
                    }
                    
                    // Extraer datos necesarios
                    $campingRefactorizado = [
                        'n_registro' => $camping['n_registro'] ?? null,
                        'nombre' => $camping['nombre'] ?? 'Sin nombre',
                        'provincia' => $camping['provincia'] ?? 'No especificado',
                        'municipio' => $camping['municipio'] ?? 'No especificado',
                        'localidad' => $camping['localidad'] ?? 'No especificado',
                        'direccion' => $camping['direccion'] ?? 'No especificado',
                        'telefono' => $camping['telefono_1'] ?? 'No disponible',
                        'email' => $camping['email'] ?? 'No disponible',
                        'web' => $camping['web'] ?? 'No disponible',
                        'plazas' => $camping['plazas'] ?? 'No especificado',
                        'latitud' => $lat,
                        'longitud' => $lon
                    ];
                    
                    $campingsRefactorizados[] = $campingRefactorizado;
                    
                } catch (Exception $e) {
                    error_log("❌ Error refactorizando camping: " . $e->getMessage());
                }
            }
            
            error_log("✅ {$campingsRefactorizados} campings refactorizados correctamente");
            error_log("⚠️ {$sinCoordenadas} campings sin coordenadas válidas");
            
            return $campingsRefactorizados;
        }
        //función para cargar todos los campings en la base de datos
        public function cargarCampings($pdo){
            // Cargar campings existentes en la BD
            $allCampings = Campings::cargarCampings($pdo);
            
            // Los datos ya vienen en el formato correcto de la BD
            // Solo necesitamos retornarlos directamente
            if($allCampings && !empty($allCampings)){
                return $allCampings;
            }
            
            return [];
        }

        // Función para mostrar favoritos de un usuario
        public function mostrarFavoritos($pdo){
            if(!isset($_SESSION['usuario'])){
                return ['success' => false, 'message' => 'Usuario no autenticado'];
            }
            
            $id_usuario = $_SESSION['usuario']->getId();
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

            $id_usuario = $_SESSION['usuario']->getId();
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

            $id_usuario = $_SESSION['usuario']->getId();
            $id_camping = $input['id_camping'];
            
            return Favoritos::eliminarFavorito($pdo, $id_usuario, $id_camping);
        }
    }
?>