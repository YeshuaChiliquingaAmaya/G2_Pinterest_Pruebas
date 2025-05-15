<?php
    // Inicia una nueva sesión o reanuda la existente
    session_start();

    // Verifica si la sesión no está establecida (es decir, si no hay usuario logueado)
    if(!isset($_SESSION['usuario'])){
        // Si no hay usuario en la sesión, se muestra un mensaje de alerta y se redirige al usuario a "index.php"
        echo '
            <script>
                alert("Por favor debes iniciar sesión");
                window.location = "index.php";
            </script>
        ';

        // Destruye la sesión actual (por si había residuos de sesiones previas)
        session_destroy();

        // Termina la ejecución del script para evitar que el usuario acceda al contenido de la página
        die();
    }

    // **Comentario sobre funcionalidad futura**
    // Si en algún momento quieres permitir que el usuario cierre la sesión automáticamente,
    // puedes descomentar la siguiente línea para destruir la sesión al cargar la página:
    // session_destroy();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Especifica el conjunto de caracteres para el documento -->
    <meta charset="UTF-8">
    <!-- Permite que el diseño sea responsivo, adaptándose a diferentes dispositivos -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Título de la página que aparece en la pestaña del navegador -->
    <title>Bienvenido</title>
    <!-- Vincula un archivo de estilo CSS externo para la personalización de la interfaz -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Mensaje principal de bienvenida en la página -->
    <h1>
        Bienvenido a la página principal
    </h1>
    <!-- Enlace para cerrar sesión, redirige al script encargado de manejar el cierre de sesión -->
    <a href="php/cerrar_sesion.php">Cerrar sesión</a>
</body>
</html>
<?php
    // Imprime la versión de PHP que está ejecutándose en el servidor
    echo 'Versión de PHP: ' . phpversion();
?>
