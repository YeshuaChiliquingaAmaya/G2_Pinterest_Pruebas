<?php
session_start();

// 1) Autoload de Composer
require_once __DIR__ . '/vendor/autoload.php';

// 2) Configuración de Cloudinary
require_once __DIR__ . '/config/cloudinary.php';

// 3) Conexión a BD
require_once __DIR__ . '/php/conexion_be.php';

// Verifica que $conexion exista
if (!isset($conexion) || !($conexion instanceof mysqli)) {
    die("Error: no existe la conexión a la base de datos.");
}

// Verifica si el usuario está logueado
if (!isset($_SESSION['usuario'])) {
    echo '<script>
            alert("Por favor debes iniciar sesión");
            window.location = "index.php";
          </script>';
    session_destroy();
    exit;
}

// Recupera imágenes del usuario
$stmt = $conexion->prepare("
  SELECT url, size
  FROM imagenes
  WHERE user_id = ?
  ORDER BY uploaded_at DESC
");
$stmt->bind_param("i", $_SESSION['usuario']['id']);
$stmt->execute();
$result   = $stmt->get_result();
$imagenes = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bienvenido</title>
  <link rel="stylesheet" href="assets/css/styleDashBoard.css">
  <link rel="stylesheet" href="assets/css/perfil.css">
</head>
<body>
  <!-- Mensaje de bienvenida -->
  <div class="mensaje_bienvenida">
    <h1>Bienvenido a la página principal</h1>
  </div>

  <div class="main-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="user-info">
        <?php include 'componentes/perfil_sideba.php'; ?>

        <!-- Botón de salir -->
        <a href="php/cerrar_sesion.php" class="btn">Salir</a>

        <!-- Formulario para subir imagen -->
        <form action="php/subir_imagenes.php"
              method="POST"
              enctype="multipart/form-data">
          <input type="file" name="imagen" accept="image/*" required>
          <button type="submit" class="btn">📤 Subir Imagen</button>
        </form>
      </div>

      <!-- Versión de PHP -->
      <div class="php-version">
        Versión de PHP: <?= phpversion() ?>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="content">
      <div class="pin_container">
        <?php foreach ($imagenes as $img): ?>
          <div class="card <?= htmlspecialchars($img['size']) ?>">
            <img src="<?= htmlspecialchars($img['url']) ?>" alt="Foto subida">
          </div>
        <?php endforeach; ?>

        <?php
          // Placeholders si hay menos de 12 tarjetas
          $minCards = 12;
          $missing  = max(0, $minCards - count($imagenes));
          for ($i = 0; $i < $missing; $i++): ?>
            <div class="card placeholder"></div>
        <?php endfor; ?>
      </div>
    </main>
  </div>
</body>
</html>
