<?php
namespace app;
// use app\NgoreiLogger;
class NgoreiLogger {
    // Fungsi untuk memvalidasi struktur data

    // Fungsi generatePreview
    public static function generatePreview($lines, $errorLine, $errorChar) {
        $preview = [];
        
        // Hitung padding untuk nomor baris
        $maxLineNumber = count($lines);
        $lineNumberWidth = strlen((string)$maxLineNumber);
        
        // Tampilkan baris sebelum error
        if ($errorLine > 0) {
            $preview['before'] = [
                'number' => $errorLine,
                'content' => isset($lines[$errorLine - 1]) ? $lines[$errorLine - 1] : ''
            ];
        }
        
        // Tampilkan baris error dengan pointer
        $preview['error'] = [
            'number' => $errorLine + 1,
            'content' => isset($lines[$errorLine]) ? $lines[$errorLine] : '',
            'pointer' => str_repeat(' ', $errorChar) . '^'  // Pointer ke posisi error
        ];
        
        // Tampilkan baris setelah error
        if (isset($lines[$errorLine + 1])) {
            $preview['after'] = [
                'number' => $errorLine + 2,
                'content' => $lines[$errorLine + 1]
            ];
        }
        
        return [
            'preview' => $preview,
            'lineNumberWidth' => $lineNumberWidth
        ];
    }


    // Fungsi untuk menampilkan error alert
    public static function showErrorAlert($error) {
        // Gunakan format UI yang sama untuk semua jenis error
        echo "<div class='ngorei-alert ngorei-alert-danger' style='
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 600px;
            max-width: 800px;
            padding: 20px;
            background: #1F2937;
            color: #E5E7EB;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;
            z-index: 9999;
            animation: slideInRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        '>";

        // Header
        echo "<div style='display:flex;align-items:center;gap:12px;margin-bottom:16px'>
            <div style='width:32px;height:32px;background:#FEE2E2;border-radius:50%;display:flex;align-items:center;justify-content:center'>
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                    <path d='M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z' 
                        stroke='#DC2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                </svg>
            </div>
            <div style='font-weight:500;font-size:16px'>Error Code</div>
        </div>";

        // Close button
        echo "<button onclick='this.parentElement.remove()'style='
            position: absolute;
            top: 12px;
            right: 12px;
            background: #374151;
            border: none;
            color: #9CA3AF;
            cursor: pointer;
            width: 32px;
            height: 32px;
            font-size: 24px;
            line-height: 1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            font-weight: bold;
            padding: 0;
            margin: 0;
        '>×</button>";

        // JSON Content dengan format yang lebih baik
        if (isset($error['content'])) {
            echo "<div style='
                margin-bottom: 16px;
                padding: 16px;
                background: #374151;
                border-radius: 8px;
                font-family: \"Fira Code\", Consolas, Monaco, monospace;
                font-size: 14px;
                line-height: 1.5;
                white-space: pre;
                overflow-x: auto;
                color: #E5E7EB;
            '>";
            
            $lines = explode("\n", $error['content']);
            $errorLine = $error['line'];
            
            // Tampilkan 2 baris sebelum dan 2 baris setelah error
            $startLine = max(0, $errorLine - 2);
            $endLine = min(count($lines) - 1, $errorLine + 2);
            
            for ($i = $startLine; $i <= $endLine; $i++) {
                $lineNum = $i + 1;
                $isErrorLine = ($i == $errorLine);
                $line = $lines[$i];
                
                // Tampilkan nomor baris dan konten
                echo "<div style='" . ($isErrorLine ? "background:rgba(239,68,68,0.1);color:#EF4444;" : "color:#9CA3AF;") . "'>";
                echo str_pad($lineNum, 2, ' ', STR_PAD_LEFT) . " │ " . htmlspecialchars($line);
                echo "</div>";
                
                // Tampilkan pointer error
                if ($isErrorLine) {
                    echo "<div style='color:#EF4444'>";
                    echo "   │ " . str_repeat(' ', $error['char']) . "^";
                    echo "</div>";
                }
            }
            
            echo "</div>";
        }

        // Error info
        echo "<div style='
            padding: 16px;
            background: #374151;
            border-radius: 8px;
            margin-bottom: 16px;
        '>";
        
        // Masalah
        echo "<div style='margin-bottom:12px'>
            <div style='color:#93C5FD;font-weight:500;margin-bottom:4px'>Masalah:</div>
            <div style='color:#E5E7EB'>{$error['error']}</div>
        </div>";
        
        // Saran
        echo "<div>
            <div style='color:#6EE7B7;font-weight:500;margin-bottom:4px'>Saran Perbaikan:</div>
            <div style='color:#E5E7EB'>{$error['detail']}</div>
        </div>";
        
        echo "</div>";
        echo "</div>";

        // CSS Animations
        echo "<style>
            @keyframes slideInRight {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
        </style>";

        // Tambahkan hover effect untuk tombol close
        echo "<style>
            .ngorei-alert button:hover {
                background: #4B5563 !important;
                color: #F3F4F6 !important;
                transform: scale(1.1);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            @keyframes slideInRight {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
        </style>";
    }

    // Tambahkan fungsi helper baru setelah fungsi getVariablePath
    public static function getLineNumber($jsonString, $searchPattern) {
        $lines = explode("\n", $jsonString);
        foreach ($lines as $index => $line) {
            if (strpos($line, $searchPattern) !== false) {
                return $index + 1; // Karena indeks array dimulai dari 0
            }
        }
        return 0;
    }

    // Modifikasi di fungsi detectAssetsErrors
    public static function detectAssetsErrors($jsonString) {
        $errors = [];
        
        // Validasi JSON
        json_decode($jsonString);
        $jsonError = json_last_error();
        
        if ($jsonError !== JSON_ERROR_NONE) {
            $errorInfo = self::findJsonErrorPosition($jsonString);
            
            $errors[] = [
                'line' => $errorInfo['line'],
                'char' => $errorInfo['char'],
                'section' => 'json',
                'error' => 'Invalid JSON format: ' . ($errorInfo['reason'] ?? json_last_error_msg()),
                'detail' => self::getErrorDetail($errorInfo['reason'] ?? ''),
                'content' => $jsonString
            ];
        }
        
        return $errors;
        exit();
    }

    // Modifikasi fungsi findJsonErrorPosition untuk debugging
    private static function findJsonErrorPosition($jsonString) {
        $lines = explode("\n", $jsonString);
        $currentPath = [];
        $inString = false;
        $lastChar = '';
        $currentProperty = '';
        
        // Struktur yang diharapkan
        $expectedStructure = [
            'properti' => [
                'type' => 'object',
                'required' => ['version', 'sitename', 'favicon', 'icon', 'title', 'description']
            ],
            'assets' => [
                'type' => 'object',
                'properties' => [
                    'header' => ['type' => 'array'],
                    'footer' => ['type' => 'array']
                ]
            ]
        ];
        
        for ($i = 0; $i < count($lines); $i++) {
            $line = rtrim($lines[$i]);
            $lineContent = trim($line);
            
            if (empty($lineContent)) continue;
            
            // Deteksi properti saat ini
            if (preg_match('/"([^"]+)"\s*:/', $lineContent, $matches)) {
                $currentProperty = $matches[1];
                
                // Validasi properti berdasarkan path
                $pathStr = implode('.', $currentPath);
                
                // Validasi di root level
                if (empty($currentPath) && !isset($expectedStructure[$currentProperty])) {
                    return [
                        'line' => $i,
                        'char' => strpos($line, $currentProperty),
                        'reason' => "Unexpected property '$currentProperty' at root level",
                        'context' => 'Root structure',
                        'suggestion' => "Hanya 'properti' dan 'assets' yang diizinkan di root level"
                    ];
                }
                
                // Validasi properti dalam objek properti
                if ($pathStr === 'properti' && !in_array($currentProperty, $expectedStructure['properti']['required'])) {
                    return [
                        'line' => $i,
                        'char' => strpos($line, $currentProperty),
                        'reason' => "Invalid property '$currentProperty' in properti object",
                        'context' => 'Properti structure',
                        'suggestion' => "Properti yang valid: " . implode(', ', $expectedStructure['properti']['required'])
                    ];
                }
                
                // Validasi properti dalam objek assets
                if ($pathStr === 'assets' && !isset($expectedStructure['assets']['properties'][$currentProperty])) {
                    return [
                        'line' => $i,
                        'char' => strpos($line, $currentProperty),
                        'reason' => "Invalid property '$currentProperty' in assets object",
                        'context' => 'Assets structure',
                        'suggestion' => "Hanya 'header' dan 'footer' yang diizinkan dalam assets"
                    ];
                }
            }
            
            // Deteksi koma yang hilang
            if ($i > 0) {
                $prevLine = trim($lines[$i - 1]);
                $currentFirstChar = $lineContent[0] ?? '';
                $prevLastChar = substr($prevLine, -1);
                
                // Dalam objek properti
                if (in_array('properti', $currentPath) && 
                    $prevLastChar !== '{' && $prevLastChar !== ',' && 
                    $currentFirstChar === '"') {
                    return [
                        'line' => $i - 1,
                        'char' => strlen($prevLine),
                        'reason' => 'Missing comma between properties',
                        'context' => 'In properti object',
                        'suggestion' => "Tambahkan koma (,) setelah '$prevLine'"
                    ];
                }
                
                // Dalam array header/footer
                if ((in_array('header', $currentPath) || in_array('footer', $currentPath)) && 
                    $prevLastChar !== '[' && $prevLastChar !== ',' && 
                    $currentFirstChar === '"') {
                    return [
                        'line' => $i - 1,
                        'char' => strlen($prevLine),
                        'reason' => 'Missing comma in array',
                        'context' => end($currentPath) . ' array',
                        'suggestion' => "Tambahkan koma (,) setelah '$prevLine'"
                    ];
                }
            }
            
            // Update path berdasarkan struktur
            if (strpos($line, '{') !== false) {
                if (!empty($currentProperty)) {
                    array_push($currentPath, $currentProperty);
                }
            }
            if (strpos($line, '}') !== false) {
                array_pop($currentPath);
            }
            if (strpos($line, '[') !== false) {
                if (!empty($currentProperty)) {
                    array_push($currentPath, $currentProperty);
                }
            }
            if (strpos($line, ']') !== false) {
                array_pop($currentPath);
            }
            
            // Perbaikan validasi trailing comma untuk objek properti
            if (in_array('properti', $currentPath)) {
                $nextLine = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : '';
                
                // Deteksi trailing comma dengan lebih akurat
                if (preg_match('/^"[^"]+"\s*:\s*"[^"]+",\s*$/', $lineContent) && 
                    (strpos($nextLine, '}') === 0 || $nextLine === '}')) {
                    return [
                        'line' => $i,
                        'char' => strlen($lineContent) - 1,
                        'reason' => 'Trailing comma in object',
                        'context' => 'Properti object',
                        'suggestion' => 'Hapus koma terakhir sebelum kurung tutup objek. JSON tidak mengizinkan trailing comma pada objek properti.'
                    ];
                }
            }

            // Validasi trailing comma untuk array di assets
            if (in_array('header', $currentPath) || in_array('footer', $currentPath)) {
                $nextLine = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : '';
                
                if (preg_match('/^"[^"]+",\s*$/', $lineContent) && 
                    (strpos($nextLine, ']') === 0 || $nextLine === ']')) {
                    return [
                        'line' => $i,
                        'char' => strlen($lineContent) - 1,
                        'reason' => 'Trailing comma in array',
                        'context' => end($currentPath) . ' array',
                        'suggestion' => 'Hapus koma terakhir sebelum kurung siku tutup array'
                    ];
                }
            }
        }
        
        return ['line' => 0, 'char' => 0, 'reason' => 'Unknown error'];
    }

    // Helper function untuk menemukan karakter non-space berikutnya
    private static function findNextNonSpace($line, $startPos) {
        for ($i = $startPos; $i < strlen($line); $i++) {
            if (!ctype_space($line[$i])) {
                return $line[$i];
            }
        }
        return false;
    }

    // Tambahkan fungsi helper untuk mendapatkan detail error
    private static function getErrorDetail($reason) {
        $details = [
            'Missing comma in array' => 'Tambahkan koma (,) setelah elemen array',
            'Missing comma between properties' => 'Tambahkan koma (,) antara properti',
            'Unexpected closing bracket' => 'Hapus kurung tutup yang tidak diperlukan',
            'Mismatched brackets' => 'Pastikan pasangan kurung buka dan tutup sesuai',
            'Unexpected colon' => 'Hapus titik dua (:) yang tidak diperlukan',
            'Unexpected comma' => 'Hapus koma (,) yang tidak diperlukan',
            'Unexpected character' => 'Hapus karakter yang tidak valid',
            'Unclosed object' => 'Tambahkan kurung kurawal tutup }',
            'Unclosed array' => 'Tambahkan kurung siku tutup ]',
            'Trailing comma in object' => 'Hapus koma terakhir sebelum kurung tutup objek. Format JSON yang benar tidak mengizinkan trailing comma pada objek properti.',
            'Trailing comma in array' => 'Hapus koma terakhir sebelum kurung siku tutup. Format JSON yang benar tidak mengizinkan trailing comma pada array.',
        ];
        
        return $details[$reason] ?? 'Pastikan format JSON valid dan tidak ada kesalahan sintaks. ' .
               'Periksa tanda koma, kurung kurawal, dan tanda kutip.';
    }

    // Di dalam class NgoreiLogger, tambahkan fungsi helper baru
    private static function hasTrailingComma($line) {
        $trimmedLine = rtrim($line);
        // Periksa apakah baris berakhir dengan koma dan bukan bagian dari string
        $matches = [];
        preg_match('/[^"],$/', $trimmedLine, $matches);
        return !empty($matches);
    }
}


      


 