<?php
require_once('../vendor/autoload.php'); // Memuat autoloading Composer
$HTTP = isset($_SERVER["HTTPS"]) ? "https" : "http";
$HTTP_HOST = $HTTP."://". $_SERVER["HTTP_HOST"].str_replace("index.php", "", $_SERVER["PHP_SELF"]);
define("TIMEZONE","Asia/Makassar");
define("ROOT"    ,dirname(__DIR__)); 
define("APP"     ,dirname(__DIR__).'/app/');
define("CRTL"     ,dirname(__DIR__).'/app/controllers/');
define("DIR"     ,dirname(__DIR__).'/public/');
define("PCKG"    ,dirname(__DIR__).'/package/');
define("HOST"    ,substr($HTTP_HOST, 0, -5));
 //Mendaftarkan fungsi autoloading kustom
 spl_autoload_register(function ($className) {
     $filePath = $className . '.php';
     if (file_exists($filePath)) {
         require_once $filePath;
     } else {
         echo "Class file not found: " . $filePath;
     }
 });
try {
    // Mencoba membuat instance dari Autoload
    $autoload = new Autoload();
} catch (Exception $e) {
    // Menampilkan pesan kesalahan dari pengecualian
    echo "Error: " . $e->getMessage();
}
?>
