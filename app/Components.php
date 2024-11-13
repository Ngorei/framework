<?php
use app\Tds;
Tds::headerContent('POST');
$directory = ROOT.'/';
$filePath = $directory . 'app/controllers/manifest.json'; // Perbaikan pada penempatan manifest.json
$navigasiFileAssets = $directory . 'app/controllers/assets.json'; // File baru untuk navigasi
$navigasiFilePath = $directory . 'app/controllers/navigasi.json'; // File baru untuk navigasi
$navigasiFilesubfolders = $directory . 'app/controllers/elements.json'; // File baru untuk navigasi
$subfolderList = getAllSubfolders($directory . 'public');
$inputData = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

// Folder yang diizinkan
$allowedFolders = ['public', 'assets/images'];

function getAllSubfolders($dir) {
    $allSubfolders = [];
    if (!is_dir($dir)) {
        return $allSubfolders;
    }

    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            $path = "$dir/$file";
            if (is_dir($path)) {
                $parts = explode('/', $path);
                $lastPart = array_pop($parts);
                $parts2 = explode('public/', $path);
                $lastPart2 = array_pop($parts2);
                $allSubfolders[] = [$lastPart => 'public/' . $lastPart2];
                $subfolders = getAllSubfolders($path);
                $allSubfolders = array_merge($allSubfolders, $subfolders);
            }
        }
    }
    return $allSubfolders;
}

function listFolderFiles($dir, $allowedFolders) {
    $files = [];
    foreach (scandir($dir) as $file) {
        $fullPath = $dir . DIRECTORY_SEPARATOR . $file;
        if (is_dir($fullPath) && in_array($file, $allowedFolders)) {
            $files[$file] = listFolderFiles($fullPath, $allowedFolders);
        }
    }
    $files = array_merge($files, scanDirectory($dir));
    return $files;
}

function scanDirectory($dir) {
    $files = [];
    $fileTypes = ['js' => [], 'css' => []];
    foreach (scandir($dir) as $file) {
        if ($file !== '.' && $file !== '..') {
            $fullPath = $dir . DIRECTORY_SEPARATOR . $file;
            $filename = pathinfo($file, PATHINFO_FILENAME);
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            if (is_dir($fullPath)) {
                $files[$file] = scanDirectory($fullPath);
            } else {
                if ($extension === 'js') {
                    $fileTypes['js'][$filename] = $file;
                } elseif ($extension === 'css') {
                    $fileTypes['css'][$filename] = $file;
                } else {
                    $files[$filename] = $file;
                }
            }
        }
    }
    if (!empty($fileTypes['js'])) {
        $files['js'] = $fileTypes['js'];
    }
    if (!empty($fileTypes['css'])) {
        $files['css'] = $fileTypes['css'];
    }
    return $files;
}

$files = [];
foreach ($allowedFolders as $folder) {
    $files[$folder] = listFolderFiles($directory . DIRECTORY_SEPARATOR . $folder, $allowedFolders);
}

$navigasi = ['navigasi' => $inputData['navigasi'] ?? []];
$assets = ['assets' => $inputData['assets'] ?? []];

file_put_contents($filePath, json_encode($files));
file_put_contents($navigasiFilesubfolders, json_encode($subfolderList));
file_put_contents($navigasiFilePath, json_encode($navigasi));
file_put_contents($navigasiFileAssets, json_encode($assets));

header('Content-Type: application/json');
echo json_encode($files);
?>
