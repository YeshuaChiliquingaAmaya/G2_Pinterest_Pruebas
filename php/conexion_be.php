<?php
// Datos de conexión a Clever Cloud
$host = "biokskqzeaoic27nghad-mysql.services.clever-cloud.com";
$username = "u4djfg6dudvl6mmr";
$password = "WwCpfcsVcAEsYHuP47Mh";
$database = "biokskqzeaoic27nghad";
$port = 3306;

// Establecer conexión
try {
    $conexion = new mysqli($host, $username, $password, $database, $port);
    
    // Verificar conexión
    if ($conexion->connect_error) {
        throw new Exception("Conexión fallida: " . $conexion->connect_error);
    }
    
    // Configurar charset
    $conexion->set_charset("utf8mb4");
    
} catch (Exception $e) {
    error_log($e->getMessage());
    die("Error al conectar con la base de datos. Por favor, intente más tarde.");
}
?>