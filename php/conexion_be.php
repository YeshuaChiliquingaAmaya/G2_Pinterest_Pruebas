<?php
// Datos de conexión a Clever Cloud
$host = "biokskqzeaoic27nghad-mysql.services.clever-cloud.com";
$username = "u4djfg6dudvl6mmr";
$password = "WwCpfcsVcAEsYHuP47Mh";
$database = "biokskqzeaoic27nghad";
$port = 3306;

<<<<<<< HEAD
// Establecer conexión
try {
=======
    // Nombre del host o dirección del servidor donde se encuentra la base de datos
    $host = "biokskqzeaoic27nghad-mysql.services.clever-cloud.com";

    // Nombre de usuario para acceder a la base de datos
    $username = "u4djfg6dudvl6mmr";

    // Contraseña asociada al usuario de la base de datos
    $password = "WwCpfcsVcAEsYHuP47Mh";

    // Nombre de la base de datos a la que se desea conectar
    $database = "biokskqzeaoic27nghad";

    // Puerto que utiliza el servidor de la base de datos (por defecto para MySQL es 3306)
    $port = 3306;

    // Crear la conexión

    // Se instancia un objeto de la clase `mysqli` para establecer la conexión a la base de datos.
    // Se pasan los datos de conexión como parámetros (host, username, password, database, port).
>>>>>>> e40ae112c976d8c76b33dfd17fee942d8e4b48c9
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