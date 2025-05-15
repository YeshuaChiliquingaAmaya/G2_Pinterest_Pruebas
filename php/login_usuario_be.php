<?php

    // Iniciar la sesión
    session_start();

    // Incluir el archivo de conexión a la base de datos
    include 'conexion_be.php';

    // **Recibir los datos del formulario de inicio de sesión**
    // Estos datos se envían mediante el método POST desde un formulario.
    $correo = $_POST['correo'];           // Correo ingresado por el usuario
    $contrasena = $_POST['contrasena'];   // Contraseña ingresada por el usuario

    // **Encriptar la contraseña**
    // Se encripta la contraseña ingresada usando el algoritmo `sha512` para compararla con la contraseña almacenada en la base de datos.
    $contrasena = hash('sha512', $contrasena);

    // **Validar las credenciales del usuario**
    // Se ejecuta una consulta SQL para buscar un usuario que coincida con el correo y la contraseña proporcionados.
    $validar_login = mysqli_query($conexion, "SELECT * FROM usuarios WHERE correo = '$correo' AND contrasena = '$contrasena'");

    // **Verificar si la consulta encontró un resultado**
    if(mysqli_num_rows($validar_login) > 0) {
        // Si se encuentra un usuario que coincida:
        $_SESSION['usuario'] = $correo; // Se guarda el correo del usuario en la sesión para futuras operaciones.
        header("location:../principal.php"); // Redirige al usuario a la página principal.
        exit(); // Detiene la ejecución del script.
    } else {
        // Si no se encuentra ningún usuario que coincida:
        echo '
            <script>
                alert("Usuario no encontrado, por favor verifique los datos introducidos");
                window.location = "../index.php"; // Redirige al formulario de inicio de sesión.
            </script>
        ';
        exit(); // Detiene la ejecución del script.
    }

?>
