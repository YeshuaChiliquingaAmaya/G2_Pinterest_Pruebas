<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Cloudinary\Configuration\Configuration;

Configuration::instance([
  'cloud' => [
    'cloud_name' => 'dsfazlofc',
    'api_key'    => '375549546746736',
    'api_secret' => '2pvXZo07QeUjClYKqHgFBoMjoVI',
  ],
  'url' => ['secure' => true],
]);

?>