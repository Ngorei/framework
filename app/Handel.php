<?php
use app\Tds;
use app\Ngorei;
header('Content-Type: application/json');
$tds = new \app\Tds();

function generateSSHKey($email, $keyPath = null, $overwrite = true) {
    // Deteksi sistem operasi dan set default path
    if ($keyPath === null) {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // Untuk Windows
            $keyPath = getenv('USERPROFILE') . '\\.ssh\\id_ed25519';
        } else {
            // Untuk Linux/Unix
            $keyPath = getenv('HOME') . '/.ssh/id_ed25519';
        }
    }
    
    // Cek apakah file sudah ada
    if (file_exists($keyPath) && !$overwrite) {
        return [
            'success' => false,
            'error' => 'SSH key sudah ada. Gunakan parameter overwrite=true untuk menimpa.'
        ];
    }

    // Hapus file lama jika overwrite=true
    if (file_exists($keyPath)) {
        unlink($keyPath);
        if (file_exists($keyPath . '.pub')) {
            unlink($keyPath . '.pub');
        }
    }
    
    // Perintah untuk generate SSH key
    $command = sprintf(
        'ssh-keygen -t ed25519 -C "%s" -f "%s" -N "" -q',
        escapeshellarg($email),
        escapeshellarg($keyPath)
    );
    
    // Eksekusi perintah
    $output = [];
    $returnVar = null;
    exec($command, $output, $returnVar);
    
    // Cek apakah berhasil
    if ($returnVar === 0) {
        return [
            'success' => true,
            'private_key' => $keyPath,
            'public_key' => $keyPath . '.pub'
        ];
    }
    
    return [
        'success' => false,
        'error' => implode("\n", $output)
    ];
}

// Contoh penggunaan
$result = generateSSHKey('ian.obet@gmail.com', null, true);
if ($result['success']) {
    echo "SSH key berhasil dibuat!\n";
    echo "Private key: " . $result['private_key'] . "\n";
    echo "Public key: " . $result['public_key'] . "\n";
} else {
    echo "Gagal membuat SSH key: " . $result['error'];
}
