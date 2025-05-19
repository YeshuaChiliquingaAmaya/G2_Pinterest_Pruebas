<?php
session_start();
if (!isset($_SESSION['usuario'])) {
  header('Location: ../index.php');
  exit;
}

// 1) Carga el autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// 2) Conéctate a la BD
require_once __DIR__ . '/conexion_be.php';

use Cloudinary\Cloudinary;

// 3) Instancia Cloudinary PASÁNDOLE las credenciales **directamente**
$cloudinary = new Cloudinary([
  'cloud_name' => 'dsfazlofc',
  'api_key'    => '375549546746736',
  'api_secret' => '2pvXZo07QeUjClYKqHgFBoMjoVI',
  'url'        => ['secure' => true],
]);

// 4) Validaciones básicas de archivo
if (empty($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
  die('Error al subir el archivo.');
}

$allowed = ['image/jpeg','image/png','image/gif'];
if (!in_array($_FILES['imagen']['type'], $allowed) ||
     $_FILES['imagen']['size'] > 5*1024*1024) {
  die('Formato no válido o archivo muy grande.');
}

$userId = $_SESSION['usuario']['id'];

// 5) Sube a Cloudinary
$response = $cloudinary
  ->uploadApi()
  ->upload($_FILES['imagen']['tmp_name'], [
    'folder' => "pinterest_app/user_$userId",
  ]);

// 6) Guarda la URL
$url = $response['secure_url'] ?? null;
if (!$url) {
  die('No se obtuvo URL de Cloudinary.');
}

// 7) Define tamaño aleatorio para grid
$sizes = ['card_small','card_medium','card_large'];
$size = $sizes[array_rand($sizes)];

// 8) Inserta en la BD
$stmt = $conexion->prepare(
  "INSERT INTO imagenes (user_id, url, size) VALUES (?, ?, ?)"
);
$stmt->bind_param("iss", $userId, $url, $size);
$stmt->execute();
$stmt->close();

// 9) Redirige
header('Location: ../principal.php');
exit;

// ?>