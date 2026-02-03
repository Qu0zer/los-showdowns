<?php
/**
 * Script CRON para sincronizar campings desde API externa
 * 
 * Ejecutar manualmente:
 *   php cron.php
 * 
 * Configurar en crontab (ejecutar diariamente a las 3 AM):
 *   0 3 * * * cd /ruta/a/tu/proyecto && php cron.php >> logs/cron.log 2>&1
 */

echo "=== CRON: Sincronización de Campings ===\n";
echo "Fecha: " . date('Y-m-d H:i:s') . "\n\n";

// Cargar autoload y configuración
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/src/config/db.php';

try {
    // Conectar a base de datos
    $pdo = Database::connect();
    echo "✅ Conexión a base de datos establecida\n";
    
    // Crear instancia del controlador
    $apiController = new \Controllers\ApiController();
    echo "✅ ApiController instanciado\n\n";
    
    // Ejecutar sincronización
    echo "🔄 Iniciando sincronización desde API externa...\n";
    $resultado = $apiController->guardarCampings($pdo);
    
    // Mostrar resultados
    echo "\n=== RESULTADOS ===\n";
    if ($resultado['success']) {
        echo "✅ Sincronización completada exitosamente\n";
        echo "   - Total procesados: {$resultado['total']}\n";
        echo "   - Insertados: {$resultado['insertados']}\n";
        echo "   - Actualizados: {$resultado['actualizados']}\n";
        
        if (!empty($resultado['errores'])) {
            echo "   - Errores: " . count($resultado['errores']) . "\n";
            echo "\n⚠️ Detalles de errores:\n";
            foreach ($resultado['errores'] as $error) {
                echo "   - {$error['nombre']}: {$error['error']}\n";
            }
        }
    } else {
        echo "❌ Error en la sincronización\n";
        echo "   Mensaje: {$resultado['message']}\n";
    }
    
    echo "\n=== FIN ===\n";
    echo "Fecha: " . date('Y-m-d H:i:s') . "\n";
    
} catch (Exception $e) {
    echo "❌ ERROR CRÍTICO: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
?>
