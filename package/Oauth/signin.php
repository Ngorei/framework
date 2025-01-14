<?php
namespace package\Oauth;
use app\tatiye;
use Exception;
use app\NgoreiCrypto;

class Signin extends NgoreiCrypto {
    protected function validateCredentials($data) {
        // Hapus semua session yang ada
        @session_unset();
        @session_destroy();
        
        // Deteksi environment
        $isCliServer = php_sapi_name() === 'cli-server';
        $sessionOptions = [
            'cookie_lifetime' => 31536000,
            'gc_maxlifetime' => 31536000
        ];
        
        // Tambahkan opsi khusus untuk web server
        if (!$isCliServer) {
            $sessionOptions = array_merge($sessionOptions, [
                'cookie_secure' => isset($_SERVER['HTTPS']),
                'cookie_httponly' => true,
                'use_strict_mode' => true
            ]);
        }
        
        // Mulai session dengan error handling
        if (@session_start($sessionOptions) === false) {
            error_log('Gagal memulai session di ' . php_sapi_name());
        }
        
        // Regenerate session ID
        @session_regenerate_id(true);
        
        $uid = tatiye::fetch('appuser', '*', 'email="'.htmlspecialchars($data['email']).'" AND password="'.htmlspecialchars($data['password']).'"');
        
        if (isset($data['email']) && 
            isset($data['password']) && 
            $uid && 
            $data['email'] == $uid['email'] && 
            $data['password'] == $uid['password']) {
            
            // Set session dengan multiple fallback
            $_SESSION['userid'] = $uid['id'];
            $_SESSION['last_access'] = time();
            
            // Force write dan verifikasi
            @session_write_close();
            @session_start($sessionOptions);
            
            if (isset($_SESSION['userid'])) {
                // Set cookie sebagai backup
                if (!$isCliServer) {
                    setcookie(
                        'user_backup', 
                        base64_encode($uid['id']), 
                        [
                            'expires' => time() + 31536000,
                            'path' => '/',
                            'secure' => isset($_SERVER['HTTPS']),
                            'httponly' => true,
                            'samesite' => 'Strict'
                        ]
                    );
                }
                return $uid;
            }
            
            return $uid; // fallback return
        }
        return false;
    }
}

// Suppress warnings di CLI
if (php_sapi_name() === 'cli') {
    error_reporting(E_ERROR | E_PARSE);
} else {
    error_reporting(E_ALL);
}

// Penggunaan
$val = json_decode(file_get_contents("php://input"), true);
$signin = new Signin($val['endpoint']);
return $signin->authenticate($val);
