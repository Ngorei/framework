<?php
use app\Tds;
Tds::headerContent('POST');
$assetsDirectory = ROOT . '/package/'; // Tambahkan separator folder di akhir
function getFileContents($dir) {
    $filesContent = [];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($iterator as $file) {
        if ($file->isFile() && basename($file->getPathname()) !== 'package.json') {
            $filePath = $file->getPathname();
            error_log("Found file: " . $filePath);

            $content = @file_get_contents($filePath);
            if ($content === false) {
                error_log("Error reading file: $filePath");
                continue;
            }

            error_log("Content of file $filePath: " . $content);

            $data = json_decode($content, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("Error decoding JSON from file: $filePath. Error: " . json_last_error_msg());
                continue;
            }

            if (is_array($data)) {
                foreach ($data as $item) {
                    if (isset($item['id'])) {
                        $filesContent[$item['id']] = $item;
                    } else {
                        error_log("ID tidak ditemukan dalam item file: $filePath");
                    }
                }
            } else if (isset($data['id'])) {
                $filesContent[$data['id']] = $data;
            } else {
                error_log("ID tidak ditemukan dalam file: $filePath");
            }
        }
    }
    return $filesContent;
}

// Path ke file JSON
$outputFile = $assetsDirectory . 'package.json';

// Mendapatkan daftar isi file
$fileContents = getFileContents($assetsDirectory);

// Menyimpan daftar isi file dalam file JSON dengan struktur data yang diinginkan
$encodedContent = json_encode($fileContents, JSON_PRETTY_PRINT);
if ($encodedContent === false) {
    error_log("Error encoding JSON data.");
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Error encoding JSON data.']);
    exit;
}

$result = @file_put_contents($outputFile, $encodedContent);
if ($result === false) {
    error_log("Error writing file: $outputFile");
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Error writing file.']);
    exit;
}

error_log("File successfully written: $outputFile");

// Mengatur header untuk JSON response dan memberikan pesan status
header('Content-Type: application/json');
echo json_encode(['message' => 'add package.json success']);
?>
