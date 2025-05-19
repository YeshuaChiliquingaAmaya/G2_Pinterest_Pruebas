<?php
// Este archivo ya se llama dentro de una sesión activa desde principal.php

require __DIR__ . '/../php/conexion_be.php';

$stmt = $conexion->prepare("SELECT nombre_completo, usuario, correo FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $_SESSION['usuario']['id']);
$stmt->execute();
$result  = $stmt->get_result();
$usuario = $result->fetch_assoc();
$stmt->close();
?>

<div class="profile-container">
    <!-- Avatar circular -->
    <div class="avatar">
        <?= strtoupper(substr($usuario['nombre_completo'], 0, 1)) ?>
    </div>

    <!-- Nombre completo -->
    <h1><?= htmlspecialchars($usuario['nombre_completo']) ?></h1>

    <!-- Nombre de usuario -->
    <span class="username">
        @<?= htmlspecialchars($usuario['usuario']) ?>
    </span>

    <!-- Correo -->
    <div class="email">
        <?= htmlspecialchars($usuario['correo']) ?>
    </div>

    <!-- Botón de edición -->
    <button class="edit-btn">Editar perfil</button>

    <!-- Estadísticas -->
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
