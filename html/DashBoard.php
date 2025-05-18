<?php
session_start();

// Redirigir si no hay sesión activa
if (!isset($_SESSION['usuario'])) {
    header("Location: ../index.php");
    exit();
}

// Conexión a la base de datos
require __DIR__ . '/../php/conexion_be.php';

// Verificar conexión
if (!isset($conexion) || $conexion->connect_error) {
    die("Error al conectar con la base de datos");
}

// Obtener datos básicos del usuario
$query = "SELECT nombre_completo, usuario, correo FROM usuarios WHERE id = ?";
$stmt = $conexion->prepare($query);

if (!$stmt) {
    die("Error en la consulta: " . $conexion->error);
}

$stmt->bind_param("i", $_SESSION['usuario']['id']);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

if (!$usuario) {
    die("Usuario no encontrado");
}

$stmt->close();
$conexion->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil de <?= htmlspecialchars($usuario['nombre_completo']) ?></title>
    <link rel="stylesheet" href="../css/perfil.css">
</head>
<body>
    <div class="profile-container">
        <div class="avatar">
            <?= strtoupper(substr($usuario['nombre_completo'], 0, 1)) ?>
        </div>
        
        <h1><?= htmlspecialchars($usuario['nombre_completo']) ?></h1>
        <span class="username">@<?= htmlspecialchars($usuario['usuario']) ?></span>
        <div class="email"><?= htmlspecialchars($usuario['correo']) ?></div>
        <button class="edit-btn">Editar perfil</button>
        <div class="stats">
    <div class="stat-item">
        <strong>90</strong>
        <span>Seguidores</span>
    </div>
    <div class="stat-item">
        <strong>356</strong>
        <span>Seguidos</span>
    </div>
</div>
    </div>
</body>
</html>