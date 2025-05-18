<?php
session_start();
include 'conexion_be.php';

// Validar datos recibidos
if (empty($_POST['correo']) || empty($_POST['contrasena'])) {
    die("Error: Correo y contraseña son obligatorios");
}

$correo = trim($_POST['correo']);
$contrasena = hash('sha512', $_POST['contrasena']); // Encriptar

// Consulta preparada para evitar SQL Injection
$query = "SELECT id, nombre_completo, usuario FROM usuarios WHERE correo = ? AND contrasena = ?";
$stmt = $conexion->prepare($query);

if (!$stmt) {
    die("Error en la consulta: " . $conexion->error);
}

$stmt->bind_param("ss", $correo, $contrasena);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();
    
    // Guardar datos en sesión
    $_SESSION['usuario'] = [
        'id' => $usuario['id'],
        'nombre' => $usuario['nombre_completo'],
        'usuario' => $usuario['usuario']
    ];
    
    header("Location: ../html/DashBoard.php");
    exit();
} else {
    echo '<script>
        alert("Usuario o contraseña incorrectos");
        window.location = "../index.php";
    </script>';
    exit();
}
?>