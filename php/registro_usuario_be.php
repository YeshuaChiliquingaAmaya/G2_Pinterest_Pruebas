<?php

    // Incluir el archivo de conexión a la base de datos
    include 'conexion_be.php';

    // **Recibir datos enviados desde un formulario**
    // Estos datos se envían mediante el método POST desde un formulario en la página web.
    $nombre_completo = $_POST['nombre_completo']; // Nombre completo del usuario
    $correo = $_POST['correo'];                  // Correo electrónico del usuario
    $usuario = $_POST['usuario'];                // Nombre de usuario
    $contrasena = $_POST['contrasena'];          // Contraseña sin encriptar

    // **Encriptar la contraseña**
    // Antes de almacenar la contraseña en la base de datos, se encripta utilizando el algoritmo `sha512`.
    // Esto asegura que la contraseña no se almacene en texto plano, mejorando la seguridad.
    $contrasena = hash('sha512', $contrasena);

    // **Preparar consulta para insertar datos**
    // Se define la consulta SQL para insertar un nuevo registro en la tabla `usuarios`.
    $query = "INSERT INTO usuarios (nombre_completo, correo, usuario, contrasena) 
              VALUES ('$nombre_completo', '$correo', '$usuario', '$contrasena')";

    // **Verificar que el correo no se repita en la base de datos**
    // Se ejecuta una consulta para buscar si ya existe un usuario con el mismo correo.
    $verificar_correo = mysqli_query($conexion, "SELECT * FROM usuarios WHERE correo = '$correo'");

    if(mysqli_num_rows($verificar_correo) > 0) {
        // Si la consulta devuelve más de 0 filas, significa que el correo ya está registrado.
        echo '
            <script>
                alert("Este correo ya está registrado, intenta con otro diferente");
                window.location = "../index.php"; // Redirige al formulario de registro.
            </script>
        ';
        exit(); // Detiene la ejecución del script.
    }

    // **Verificar que el nombre de usuario no se repita**
    // Se ejecuta una consulta para buscar si ya existe un usuario con el mismo nombre de usuario.
    $verificar_usuario = mysqli_query($conexion, "SELECT * FROM usuarios WHERE usuario = '$usuario'");

    if(mysqli_num_rows($verificar_usuario) > 0) {
        // Si la consulta devuelve más de 0 filas, significa que el nombre de usuario ya está registrado.
        echo '
            <script>
                alert("Este usuario ya está registrado, intenta con otro diferente");
                window.location = "../index.php"; // Redirige al formulario de registro.
            </script>
        ';
        exit(); // Detiene la ejecución del script.
    }

    // **Ejecutar la consulta para insertar los datos**
    // Si no hay duplicados en correo o usuario, se ejecuta la consulta de inserción.
    $ejecutar = mysqli_query($conexion, $query);

    if($ejecutar) {
        // Si la consulta se ejecuta correctamente, muestra un mensaje de éxito.
        echo '
            <script>
                alert("Usuario almacenado exitosamente");
                window.location = "../index.php"; // Redirige a la página principal.
            </script>
        ';
    } else {
        // Si ocurre algún error durante la ejecución de la consulta, muestra un mensaje de error.
        echo '
            <script>
                alert("Inténtalo de nuevo, usuario no almacenado");
                window.location = "../index.php"; // Redirige al formulario de registro.
            </script>
        ';
    }

    // **Cerrar la conexión a la base de datos**
    // Es una buena práctica cerrar la conexión después de ejecutar las operaciones necesarias.
    mysqli_close($conexion);
?>
