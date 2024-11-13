<?php
use app\Ngorei;
class Autoload {
    protected $currentController = 'Routing'; // Pengendali default
    protected $currentMethod = 'index'; // Metode default
    protected $params = []; // Array parameter yang kosong
    protected $tatiyeNet; // Properti kelas untuk instance Ngorei

    public function __construct() {
        $this->tatiyeNet = new Ngorei();
        $url = $this->getUrl();
        // Memeriksa dan memuat pengendali
        if (isset($url[0])) {
            $controllerFile = APP . '/' . ucwords($url[0]) . '.php'; // Menggunakan APP untuk path file
            if (file_exists($controllerFile)) {
                $this->currentController = ucwords($url[0]);
                unset($url[0]);
            } else {
                // Jika pengendali tidak ditemukan, arahkan ke halaman kesalahan
                $this->notPage();
                return; // Menghentikan eksekusi lebih lanjut
            }
        }
        // Memuat pengendali saat ini
        require_once(APP . '/' . $this->currentController . '.php');

        // Menginstansiasi pengendali saat ini
        if (class_exists($this->currentController)) {
            $this->currentController = new $this->currentController;
        } else {
            // Jika kelas pengendali tidak ditemukan, tampilkan pesan kesalahan
            die();
        }

        // Memeriksa dan mengatur metode
        if (isset($url[1]) && method_exists($this->currentController, $url[1])) {
            $this->currentMethod = $url[1];
            unset($url[1]);
        } else {
            // Jika metode tidak ditemukan, gunakan metode default
            $this->currentMethod = 'index';
        }

        // Mendapatkan parameter - Nilai yang tersisa dalam URL adalah parameter
        $this->params = $url ? array_values($url) : [];

        // Memanggil metode dengan parameter
        call_user_func_array([$this->currentController, $this->currentMethod], $this->params);
    }

    // Membuat URL dari $_GET['url']
    public function getUrl() {
        if (isset($_GET['url'])) {
            // Menghapus trailing slash dan membersihkan URL
            $url = rtrim($_GET['url'], '/');
            $url = filter_var($url, FILTER_SANITIZE_URL);
            $url = explode('/', $url);
            return $url;
        }
        return [];
    }

    public function notPage() {
        echo $this->tatiyeNet->SDK(DIR . '/404.html');
        exit(); // Menghentikan eksekusi lebih lanjut
    }
    
    // Menulis kesalahan ke file log
    private function logError($message) {
        $logFile = APP . '/error_log.txt'; // Menggunakan APP untuk path file
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
    }
}
?>
