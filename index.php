<?php
    // **Iniciar la sesión**
    session_start();

    // **Verificar si el usuario ya ha iniciado sesión**
    // Si existe la variable de sesión 'usuario', significa que el usuario ya está autenticado.
    if(isset($_SESSION['usuario'])){
        // Redirigir al usuario a la página principal
        header('Location: principal.php');
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Metadatos del documento HTML -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login y Registro - GyroZeppeli</title>

    <!-- Preconexión a Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- Fuente "Roboto" desde Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    
    <!-- Enlace al archivo CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- **Estructura Principal** -->
    <main>
        <div class="contenedor__todo">
            <!-- **Caja Trasera (Decorativa)** -->
            <div class="caja__trasera">
                <!-- Sección para usuarios con cuenta -->
                <div class="caja__trasera-login">
                    <h3>¿Ya tienes una cuenta?</h3>
                    <p>Inicia sesión para entrar a la página</p>
                    <button id="btn__iniciar-sesion">Iniciar Sesión</button>
                </div>
                <!-- Sección para usuarios sin cuenta -->
                <div class="caja__trasera-register">
                    <h3>¿Aún no tienes una cuenta?</h3>
                    <p>Regístrate para que puedas iniciar sesión</p>
                    <button id="btn__registrarse">Registrarse</button>
                </div>
            </div>

            <!-- **Formularios de login y registro** -->
            <div class="contenedor__login-register">
                <!-- **Formulario de inicio de sesión** -->
                <form action="php/login_usuario_be.php" method="POST" class="formulario__login">
                    <h2>Iniciar Sesión</h2>
                    <!-- Campos para correo y contraseña -->
                    <input type="text" placeholder="Correo Electrónico" name="correo">
                    <input type="password" placeholder="Contraseña" name="contrasena">
                    <!-- Botón de inicio de sesión -->
                    <button>Iniciar Sesión</button>
                </form>

                <!-- **Formulario de registro** -->
                <form action="php/registro_usuario_be.php" method="POST" class="formulario__register">
                    <h2>Registrarse</h2>
                    <!-- Campos para registro: nombre completo, correo, usuario, contraseña -->
                    <input type="text" placeholder="Nombre Completo" name="nombre_completo">
                    <input type="text" placeholder="Correo Electrónico" name="correo">
                    <input type="text" placeholder="Usuario" name="usuario">
                    <input type="password" placeholder="Contraseña" name="contrasena">
                    <!-- Botón de registro -->
                    <button>Registrarse</button>
                </form>
            </div>
        </div>
    </main>

    <!-- **Enlace al archivo JavaScript** -->
    <script src="assets/js/script.js"></script>
</body>
</html>
