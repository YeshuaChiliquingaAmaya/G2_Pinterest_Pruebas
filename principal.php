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
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido</title>
    <link rel="stylesheet" href="assets/css/stylesDashBoard.css">
</head>
<body>
                <div class="mensaje_bienvenida">
                <h1>Bienvenido a la página principal</h1>
            </div>
    <div class="main-container">
        <!-- Barra lateral (Dashboard) -->
        <div class="sidebar">
            <div class="user-info">
                <p><strong>Nombre:</strong> <?php echo $_SESSION['usuario']; ?></p>
                <button class="btn">Perfil</button>
                <a href="php/cerrar_sesion.php" class="btn">Salir</a>
            </div>
            <div class="php-version">
                <p><strong>Versión PHP:</strong> <?php echo phpversion(); ?></p>
            </div>
        </div>
        <!-- Contenido principal -->
        <div class="content">

            <div class="pin_container">
                <!-- Aquí las tarjetas -->
                <div class="card card_small"></div>
                <div class="card card_medium"></div>
                <div class="card card_large"></div>
                <div class="card card_small"></div>
                <div class="card card_medium"></div>
                <div class="card card_large"></div>
                <div class="card card_small"></div>
                <div class="card card_medium"></div>
                <div class="card card_large"></div>
                <div class="card card_small"></div>
                <div class="card card_medium"></div>
                <div class="card card_large"></div>
                <div class="card card_small"></div>
                <div class="card card_medium"></div>
                <div class="card card_large"></div>
                <div class="card card_small"></div>
                <div class="card card_medium"></div>
                <div class="card card_large"></div>
            </div>
        </div>
    </div>
</body>
</html>
