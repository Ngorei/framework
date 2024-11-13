<?php
use app\Tds;
Tds::headerContent('POST');
$data = json_decode(file_get_contents('php://input'), true);
// Fungsi untuk mendapatkan daftar file dalam direktori
function getFileList($dir) {
    $files = [];
    if (is_dir($dir)) {
        $handle = opendir($dir);
        while (($file = readdir($handle)) !== false) {
            if ($file != "." && $file != "..") {
                $files[] = $file;
            }
        }
        closedir($handle);
    }
    return $files;
}
$dt_clean = ROOT.'/'; // Menghapus '\\app'
$result = [];
// Ambil daftar file dari setiap path yang ada dalam data JSON
foreach ($data['filePath'] as $key => $paths) {
    foreach ($paths as $path) {
        $fullPath =$dt_clean.''.$path; // Path lengkap
        $files = getFileList($fullPath);
        $result[$key][$path] =$files;
    }
}

// Mengembalikan hasil sebagai response JSON
header('Content-Type: application/json');
echo json_encode($result);
?>
