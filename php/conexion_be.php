<?php
    // Datos de conexión a la base de datos en la nube

    // Nombre del host o dirección del servidor donde se encuentra la base de datos
    $host = "biokskqzeaoic27nghad-mysql.services.clever-cloud.com";

    // Nombre de usuario para acceder a la base de datos
    $username = "u4djfg6dudvl6mmr";

    // Contraseña asociada al usuario de la base de datos
    $password = "uxC0t0MCa0RyNKRoew80";

    // Nombre de la base de datos a la que se desea conectar
    $database = "biokskqzeaoic27nghad";

    // Puerto que utiliza el servidor de la base de datos (por defecto para MySQL es 3306)
    $port = 3306;

    // Crear la conexión

    // Se instancia un objeto de la clase `mysqli` para establecer la conexión a la base de datos.
    // Se pasan los datos de conexión como parámetros (host, username, password, database, port).
    $conexion = new mysqli($host, $username, $password, $database, $port);

    /* 
    // Verificar la conexión 
    // Este bloque está comentado, pero su función es verificar si la conexión fue exitosa.

    if ($conexion->connect_error) {
        // Si ocurre un error, termina la ejecución y muestra un mensaje detallando el problema.
        die("Conexión fallida: " . $conexion->connect_error);
    } else {
        // Si no hay errores, indica que la conexión se estableció correctamente.
        echo "Conexión exitosa a la base de datos en la nube.";
    }
    */
?>
