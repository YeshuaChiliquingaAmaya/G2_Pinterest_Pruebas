<?php
    // Inicia o reanuda la sesión existente
    session_start();

    // Destruye la sesión activa, eliminando todos los datos almacenados en ella
    session_destroy();

    // Redirige al usuario a la página principal (index.php)
    // La ubicación del archivo es relativa a la ubicación del script actual
    header("location:../index.php");

    // Finaliza la ejecución del script después de la redirección
    exit();
?>
