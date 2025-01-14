<?php
namespace package;
use app\NgoreiBuilderHandler;

try {
    // Bersihkan output buffer
    ob_clean();
    
    // Ambil input JSON
    $input = json_decode(file_get_contents('php://input'), true);
    $sql = $input['sql'] ?? '';

    if (empty($sql)) {
        throw new \Exception('Query SQL tidak boleh kosong');
    }

    // Inisialisasi Builder Tester
    $tester = new NgoreiBuilderHandler();
    
    // Konversi SQL ke Query Builder
    $result = $tester->convertToBuilder($sql);
    
    // Pastikan tidak ada output lain sebelum JSON
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    // Return hasil konversi dengan json_encode
    echo json_encode([
        'success' => true,
        'data' => [
            'builder' => $result
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;

} catch (\Exception $e) {
    http_response_code(400);
    
    // Pastikan tidak ada output lain sebelum JSON error
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
} 