<?php
 // error_reporting(0);
 // ini_set('display_errors', 0);
// Router untuk mengemulasi .htaccess
$url = parse_url($_SERVER["REQUEST_URI"]);
$path = $url["path"];
$query = isset($url["query"]) ? $url["query"] : '';

// Hapus trailing slash dan split path
$path = trim($path, '/');
$_GET['url'] = $path;

// Load .env file
$env_path = dirname(__DIR__, 3) . '/.env';
$env_lines = file($env_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$env_vars = [];
foreach ($env_lines as $line) {
    if (strpos($line, '#') === 0) continue;
    list($name, $value) = explode('=', $line, 2);
    $env_vars[trim($name)] = trim($value);
}

// Cek status PHPMYADMIN terlebih dahulu
if (!isset($env_vars['PHPMYADMIN']) || strtolower($env_vars['PHPMYADMIN']) === 'false') {
    // Bypass Autoload untuk phpMyAdmin requests
    if (strpos($path, 'phpmyadmin') === 0) {
        header("HTTP/1.0 404 Not Found");
        exit("phpMyAdmin is disabled");
    }
    require dirname(__DIR__, 3) . "/app/index.php";
    return true;
}

// Content types untuk file statis
$content_types = [
    'js' => 'application/javascript',
    'css' => 'text/css',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'php' => 'text/html'
];

// Implementasi aturan .htaccess:
if (empty($path)) {
    require dirname(__DIR__, 3) . "/app/index.php";
    return true;
} else {
    // Cek untuk akses phpMyAdmin dan asset-nya
    if (strpos($path, 'phpmyadmin') === 0 || 
        strpos($path, 'js/') === 0 || 
        strpos($path, 'themes/') === 0 ||
        strpos($path, 'index.php') === 0) {
        
        // Normalisasi path untuk konsistensi
        $phpmyadmin_path = rtrim(str_replace(['\\', '/'], DIRECTORY_SEPARATOR, $env_vars['PHPMYADMIN']), DIRECTORY_SEPARATOR);
        
        // Validasi path phpMyAdmin
        if (!is_dir($phpmyadmin_path)) {
            error_log("phpMyAdmin path tidak valid: " . $phpmyadmin_path);
            require dirname(__DIR__, 3) . "/app/index.php";
            return true;
        }

        // Set PMA absolute URI untuk asset
        if (!defined('PMA_ABSOLUTE_URI')) {
            define('PMA_ABSOLUTE_URI', 'http://' . $_SERVER['HTTP_HOST'] . '/');
        }

        // Define constants yang dibutuhkan phpMyAdmin
        if (!defined('PHPMYADMIN')) {
            define('PHPMYADMIN', true);
        }
        
        // Set include path untuk phpMyAdmin
        set_include_path(get_include_path() . PATH_SEPARATOR . $phpmyadmin_path);

        // Tangani request asset statis phpMyAdmin
        $request_file = str_replace('phpmyadmin/', '', $path);
        $file_path = $phpmyadmin_path . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $request_file);
        
        if (is_file($file_path)) {
            $ext = pathinfo($file_path, PATHINFO_EXTENSION);
            
            // Set content type jika ada
            if (isset($content_types[$ext])) {
                header('Content-Type: ' . $content_types[$ext]);
                // Tambah cache header untuk asset statis
                if ($ext !== 'php') {
                    header('Cache-Control: public, max-age=3600');
                    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT');
                }
            }
            
            // Handle PHP files
            if ($ext === 'php') {
                if (!empty($query)) {
                    parse_str($query, $queryParams);
                    $_GET = array_merge($_GET, $queryParams);
                }
                
                chdir($phpmyadmin_path);
                require $file_path;
            } else {
                readfile($file_path);
            }
            return true;
        }
        
        // Jika file tidak ditemukan tapi ini request phpMyAdmin, load index.php
        if (strpos($path, 'phpmyadmin') === 0) {
            chdir($phpmyadmin_path);
            $index_file = $phpmyadmin_path . DIRECTORY_SEPARATOR . 'index.php';
            if (!is_file($index_file)) {
                error_log("File index.php phpMyAdmin tidak ditemukan di: " . $index_file);
                require dirname(__DIR__, 3) . "/app/index.php";
                return true;
            }
            require $index_file;
            return true;
        }
    }
    
    $file = __DIR__ . $url["path"];
    
    // Cek apakah ini file statis
    if (is_file($file)) {
        return false; // Serve file statis langsung
    }
    
    // Redirect semua request ke app/
    require dirname(__DIR__, 3) . "/app/index.php";
    return true;
}