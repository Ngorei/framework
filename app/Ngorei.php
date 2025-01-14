<?php
namespace app;
use Exception;
use app\tatiye;
class Ngorei {
    private NgoreiBuilder $builder;
    private NgoreiQueue $queue;
    private NgoreiFlot $flot;
    private string $activeTable = '';
    private string $activeDatabase =DB_NAME; // Tambahkan ini
    private ?\PDO $pdo = null;

    public function __construct() {
        $this->builder = new NgoreiBuilder('');
        $this->queue = new NgoreiQueue();
        $this->flot = new NgoreiFlot();
    }

    /**
     * Magic method untuk mendukung property chaining
     */
    public function __get(string $name): self {
        if ($name === 'Network' || $name === 'Queue' || $name === 'Float') {
            return $this;
        }
        throw new \RuntimeException("Property {$name} tidak ditemukan");
    }

    /**
     * Method Brief untuk menentukan tabel
     */
    public function Brief(string $table): NgoreiBuilder {
        try {
             if (empty($this->activeDatabase)) {
                 throw new \RuntimeException("Database belum dipilih");
             }


            $builder = new NgoreiBuilder($table);
            $this->activeTable = $table;
            $this->builder = $builder;

            
            return $builder;
        } catch (\Exception $e) {
            error_log("Error in Brief(): " . $e->getMessage());
            throw new \RuntimeException($e->getMessage());
        }
    }

    /**
     * Method Queue untuk mengakses fitur antrian
     */
    public function Queue(string $table = 'queues'): NgoreiQueue {
        $this->queue = new NgoreiQueue($table);
        return $this->queue;
    }

    /**
     * Method Float untuk mengakses fitur grafik
     */
    public function Float(string $table = ''): NgoreiFlot {
        if (!empty($table)) {
            $this->flot->table($table);
        }
        return $this->flot;
    }

    /**
     * Static method untuk membuat instance baru
     */
    public static function init(): self {
        return new self();
    }

    /**
     * Magic method untuk memanggil method dari NgoreiBuilder
     */
    public function __call(string $name, array $arguments): NgoreiBuilder {
        if (empty($this->activeTable)) {
            throw new \RuntimeException("Harap panggil Brief() terlebih dahulu untuk menentukan tabel");
        }

        if (method_exists($this->builder, $name)) {
            call_user_func_array([$this->builder, $name], $arguments);
            return $this->builder;
        }
        
        throw new \RuntimeException("Method {$name} tidak ditemukan");
    }

    /**
     * Method untuk menampilkan daftar tabel dalam database
     * @return array Daftar tabel
     */
    public function showTables(): array {
        try {
            // Gunakan NgoreiDb untuk koneksi
            $db = new NgoreiDb();
            $myPdo = $db->connPDO();
            
            // Query untuk mendapatkan daftar tabel
            $sql = "SHOW TABLES";
            $stmt = $myPdo->prepare($sql);
            $stmt->execute();
            
            // Ambil semua hasil dalam bentuk array
            $tables = $stmt->fetchAll(\PDO::FETCH_COLUMN);
            
            // Format hasil
            $result = [];
            foreach ($tables as $table) {
                // Dapatkan informasi tambahan tentang tabel
                $tableInfo = $this->getTableInfo($myPdo, $table);
                
                $result[] = [
                    'tabel' => $table,
                    'created_at' => $tableInfo['created_at'],
                    'rows' => $tableInfo['rows'],
                    'size' => $tableInfo['size']
                ];
            }
            
            return $result;
            
        } catch (\Exception $e) {
            error_log("Error dalam showTables: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Method helper untuk mendapatkan informasi detail tabel
     * @param \PDO $pdo
     * @param string $tableName
     * @return array
     */
    private function getTableInfo(\PDO $pdo, string $tableName): array {
        try {
            // Query untuk mendapatkan informasi tabel
            $sql = "SELECT 
                        CREATE_TIME as created_at,
                        TABLE_ROWS as rows,
                        DATA_LENGTH + INDEX_LENGTH as size
                    FROM information_schema.TABLES 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = ?";
                    
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$tableName]);
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            return [
                'created_at' => $result['created_at'] ?? null,
                'rows' => $result['rows'] ?? 0,
                'size' => $this->formatSize($result['size'] ?? 0)
            ];
            
        } catch (\Exception $e) {
            error_log("Error getting table info: " . $e->getMessage());
            return [
                'created_at' => null,
                'rows' => 0,
                'size' => '0 B'
            ];
        }
    }

    /**
     * Method helper untuk memformat ukuran file
     * @param int $bytes
     * @return string
     */
    private function formatSize(int $bytes): string {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }

    /**
     * Method untuk mendapatkan analisis database dengan cache
     * @param bool $useCache Gunakan cache atau tidak
     * @param int $cacheExpiry Waktu kedaluwarsa cache dalam detik (default 1 jam)
     * @return array Informasi analisis database
     */
    public function analyzeDatabase(bool $useCache = true, int $cacheExpiry = 3600): array {
        try {
            // Cek cache jika useCache = true
            if ($useCache) {
                $cacheKey = 'db_analysis_' . DATABASE;
                $cachedResult = $this->getAnalysisCache($cacheKey);
                
                if ($cachedResult !== false) {
                    return $cachedResult;
                }
            }

            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            $result = [
                'overview' => $this->getDatabaseOverview($pdo),
                'performance' => $this->getPerformanceMetrics($pdo),
                'storage' => $this->getStorageAnalysis($pdo),
                'tables' => $this->getTableAnalysis($pdo)
            ];

            // Simpan ke cache jika useCache = true
            if ($useCache) {
                $this->setAnalysisCache($cacheKey, $result, $cacheExpiry);
            }

            return $result;

        } catch (\Exception $e) {
            error_log("Error dalam analyzeDatabase: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Mengambil data cache analisis
     * @param string $key Kunci cache
     * @return array|false
     */
    private function getAnalysisCache(string $key) {
        try {
            $cacheFile = STORAGE_PATH . '/cache/' . md5($key) . '.cache';
            
            if (!file_exists($cacheFile)) {
                return false;
            }

            $content = file_get_contents($cacheFile);
            $cache = json_decode($content, true);

            // Cek apakah cache masih valid
            if (!isset($cache['expiry']) || $cache['expiry'] < time()) {
                unlink($cacheFile);
                return false;
            }

            return $cache['data'];

        } catch (\Exception $e) {
            error_log("Error membaca cache: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Menyimpan data cache analisis
     * @param string $key Kunci cache
     * @param array $data Data yang akan di-cache
     * @param int $expiry Waktu kedaluwarsa dalam detik
     * @return bool
     */
    private function setAnalysisCache(string $key, array $data, int $expiry): bool {
        try {
            $cacheDir = STORAGE_PATH . '/cache';
            
            // Buat direktori cache jika belum ada
            if (!is_dir($cacheDir)) {
                mkdir($cacheDir, 0755, true);
            }

            $cacheFile = $cacheDir . '/' . md5($key) . '.cache';
            
            $cache = [
                'expiry' => time() + $expiry,
                'data' => $data
            ];

            return file_put_contents($cacheFile, json_encode($cache)) !== false;

        } catch (\Exception $e) {
            error_log("Error menyimpan cache: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Method untuk membersihkan cache analisis
     * @return bool
     */
    public function clearAnalysisCache(): bool {
        try {
            $cacheDir = STORAGE_PATH . '/cache';
            $pattern = $cacheDir . '/db_analysis_*.cache';
            
            foreach (glob($pattern) as $file) {
                unlink($file);
            }
            
            return true;
        } catch (\Exception $e) {
            error_log("Error membersihkan cache: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Mendapatkan overview database
     * @param \PDO $pdo
     * @return array
     */
    private function getDatabaseOverview(\PDO $pdo): array {
        try {
            // Dapatkan informasi database
            $sql = "SELECT 
                        table_schema as 'database',
                        SUM(data_length + index_length) as total_size,
                        COUNT(DISTINCT table_name) as total_tables,
                        SUM(table_rows) as total_rows
                    FROM information_schema.TABLES 
                    WHERE table_schema = DATABASE()
                    GROUP BY table_schema";
            
            $stmt = $pdo->query($sql);
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            return [
                'database_name' => $result['database'] ?? '',
                'total_size' => $this->formatSize($result['total_size'] ?? 0),
                'total_tables' => $result['total_tables'] ?? 0,
                'total_rows' => $result['total_rows'] ?? 0,
                'version' => $pdo->getAttribute(\PDO::ATTR_SERVER_VERSION),
                'charset' => $pdo->query("SELECT @@character_set_database")->fetchColumn()
            ];
        } catch (\Exception $e) {
            error_log("Error in getDatabaseOverview: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Mendapatkan metrik performa database
     * @param \PDO $pdo
     * @return array
     */
    private function getPerformanceMetrics(\PDO $pdo): array {
        try {
            // Dapatkan status variabel penting
            $metrics = [
                'Queries_per_second' => "SHOW GLOBAL STATUS LIKE 'Questions'",
                'Slow_queries' => "SHOW GLOBAL STATUS LIKE 'Slow_queries'",
                'Threads_connected' => "SHOW GLOBAL STATUS LIKE 'Threads_connected'",
                'Max_used_connections' => "SHOW GLOBAL STATUS LIKE 'Max_used_connections'"
            ];
            
            $result = [];
            foreach ($metrics as $key => $sql) {
                $stmt = $pdo->query($sql);
                $row = $stmt->fetch(\PDO::FETCH_ASSOC);
                $result[$key] = $row['Value'] ?? 0;
            }
            
            return $result;
        } catch (\Exception $e) {
            error_log("Error in getPerformanceMetrics: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Analisis penggunaan storage
     * @param \PDO $pdo
     * @return array
     */
    private function getStorageAnalysis(\PDO $pdo): array {
        try {
            $sql = "SELECT 
                        table_name,
                        data_length,
                        index_length,
                        data_free,
                        engine
                    FROM information_schema.TABLES
                    WHERE table_schema = DATABASE()
                    ORDER BY (data_length + index_length) DESC";
            
            $stmt = $pdo->query($sql);
            $tables = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            $result = [];
            foreach ($tables as $table) {
                $result[] = [
                    'table' => $table['table_name'],
                    'data_size' => $this->formatSize($table['data_length']),
                    'index_size' => $this->formatSize($table['index_length']),
                    'free_space' => $this->formatSize($table['data_free']),
                    'engine' => $table['engine'],
                    'total_size' => $this->formatSize($table['data_length'] + $table['index_length'])
                ];
            }
            
            return $result;
        } catch (\Exception $e) {
            error_log("Error in getStorageAnalysis: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Analisis detail setiap tabel
     * @param \PDO $pdo
     * @return array
     */
    private function getTableAnalysis(\PDO $pdo): array {
        try {
            // Dapatkan total ukuran database
            $totalSizeSql = "SELECT SUM(data_length + index_length) as total_size 
                             FROM information_schema.TABLES 
                             WHERE table_schema = DATABASE()";
            $totalSize = $pdo->query($totalSizeSql)->fetch(\PDO::FETCH_ASSOC)['total_size'];

            $sql = "SELECT 
                        t.table_name,
                        t.engine,
                        t.table_rows,
                        t.avg_row_length,
                        t.data_length,
                        t.index_length,
                        t.auto_increment,
                        COUNT(c.column_name) as column_count,
                        SUM(CASE WHEN c.column_key = 'PRI' THEN 1 ELSE 0 END) as primary_keys,
                        SUM(CASE WHEN c.column_key = 'MUL' THEN 1 ELSE 0 END) as indexes,
                        (t.data_length + t.index_length) as table_size
                    FROM information_schema.TABLES t
                    LEFT JOIN information_schema.COLUMNS c 
                        ON t.table_name = c.table_name 
                        AND t.table_schema = c.table_schema
                    WHERE t.table_schema = DATABASE()
                    GROUP BY t.table_name";
            
            $stmt = $pdo->query($sql);
            $tables = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            $result = [];
            foreach ($tables as $table) {
                // Hitung persentase ukuran tabel
                $sizePercentage = ($table['table_size'] / $totalSize) * 100;
                
                // Hitung skor efisiensi
                $efficiencyScore = $this->calculateEfficiencyScore($table);
                
                // Tentukan rating performa berdasarkan skor efisiensi
                $performanceRating = $this->getPerformanceRating($efficiencyScore);
                
                // Analisis dan rekomendasi untuk tabel
                $tableAnalysis = $this->analyzeTableMetrics($table);
                
                $result[] = [
                    'table' => $table['table_name'],
                    'engine' => $table['engine'],
                    'rows' => $table['table_rows'],
                    'avg_row_size' => $this->formatSize($table['avg_row_length']),
                    'data_size' => $this->formatSize($table['data_length']),
                    'index_size' => $this->formatSize($table['index_length']),
                    'total_size' => $this->formatSize($table['table_size']),
                    'size_percentage' => round($sizePercentage, 2),
                    'columns' => $table['column_count'],
                    'primary_keys' => $table['primary_keys'],
                    'indexes' => $table['indexes'],
                    'auto_increment' => $table['auto_increment'],
                    'efficiency_score' => $efficiencyScore,
                    'performance_rating' => $performanceRating,
                    'analysis' => $tableAnalysis['analysis'],
                    'recommendations' => $tableAnalysis['recommendations']
                ];
            }
            
            // Urutkan berdasarkan persentase ukuran (descending)
            usort($result, function($a, $b) {
                return $b['size_percentage'] <=> $a['size_percentage'];
            });
            
            return $result;
        } catch (\Exception $e) {
            error_log("Error in getTableAnalysis: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Menentukan rating performa berdasarkan skor
     * @param int $score
     * @return array
     */
    private function getPerformanceRating(int $score): array {
        $rating = [
            'score' => $score,
            'label' => '',
            'color' => ''
        ];

        if ($score >= 90) {
            $rating['label'] = 'Sangat Baik';
            $rating['color'] = '#28a745'; // hijau
        } elseif ($score >= 70) {
            $rating['label'] = 'Baik';
            $rating['color'] = '#17a2b8'; // biru
        } elseif ($score >= 50) {
            $rating['label'] = 'Cukup';
            $rating['color'] = '#ffc107'; // kuning
        } else {
            $rating['label'] = 'Buruk';
            $rating['color'] = '#dc3545'; // merah
        }

        return $rating;
    }

    /**
     * Analisis metrik tabel dan generate rekomendasi
     * @param array $table
     * @return array
     */
    private function analyzeTableMetrics(array $table): array {
        $analysis = [];
        $recommendations = [];

        // Analisis ukuran data vs index
        $indexRatio = $table['index_length'] / ($table['data_length'] ?: 1);
        if ($indexRatio > 0.5) {
            $analysis[] = "Index menggunakan {$this->formatSize($table['index_length'])} ({$indexRatio}x ukuran data)";
            $recommendations[] = "Pertimbangkan untuk mengoptimasi index karena ukurannya relatif besar";
        }

        // Analisis rata-rata ukuran baris
        if ($table['avg_row_length'] > 8192) { // 8KB
            $analysis[] = "Rata-rata ukuran baris besar ({$this->formatSize($table['avg_row_length'])})";
            $recommendations[] = "Periksa struktur tabel untuk kemungkinan normalisasi atau optimasi tipe data";
        }

        // Analisis jumlah index
        if ($table['indexes'] > 5) {
            $analysis[] = "Jumlah index tinggi ({$table['indexes']})";
            $recommendations[] = "Terlalu banyak index bisa memperlambat operasi INSERT/UPDATE";
        }

        // Analisis auto_increment
        if ($table['auto_increment'] && $table['auto_increment'] > 1000000) {
            $analysis[] = "Nilai auto_increment tinggi ({$table['auto_increment']})";
            $recommendations[] = "Pertimbangkan untuk melakukan maintenance jika banyak data telah dihapus";
        }

        // Analisis efisiensi kolom
        if ($table['column_count'] > 20) {
            $analysis[] = "Jumlah kolom tinggi ({$table['column_count']})";
            $recommendations[] = "Terlalu banyak kolom bisa mempengaruhi performa, pertimbangkan normalisasi";
        }

        // Analisis primary key
        if ($table['primary_keys'] == 0) {
            $analysis[] = "Tidak memiliki primary key";
            $recommendations[] = "Tambahkan primary key untuk optimasi query dan integritas data";
        }

        // Analisis ukuran tabel
        if ($table['table_size'] > 1073741824) { // 1GB
            $analysis[] = "Ukuran tabel besar ({$this->formatSize($table['table_size'])})";
            $recommendations[] = "Pertimbangkan partisi atau arsip data lama untuk tabel besar";
        }

        // Analisis engine
        if ($table['engine'] !== 'InnoDB') {
            $analysis[] = "Menggunakan engine {$table['engine']}";
            $recommendations[] = "Pertimbangkan migrasi ke InnoDB untuk fitur transaksi dan performa lebih baik";
        }

        // Analisis tipe storage engine
        if ($table['engine'] !== 'InnoDB') {
            $analysis[] = "Menggunakan engine {$table['engine']} yang mungkin kurang optimal";
            $recommendations[] = "Pertimbangkan migrasi ke InnoDB untuk fitur transaksi dan performa yang lebih baik";
        }

        // Analisis keberadaan primary key
        if ($table['primary_keys'] == 0) {
            $analysis[] = "Tabel tidak memiliki primary key";
            $recommendations[] = "Tambahkan primary key untuk meningkatkan performa query dan integritas data";
        }

        // Analisis rasio data vs kapasitas
        $dataRatio = ($table['table_rows'] > 0) ? ($table['data_length'] / $table['table_rows']) : 0;
        if ($dataRatio > 1048576) { // 1MB per baris
            $analysis[] = "Rata-rata ukuran data per baris sangat besar";
            $recommendations[] = "Periksa kemungkinan penyimpanan BLOB/TEXT yang bisa dipindahkan ke tabel terpisah";
        }

        // Analisis fragmentasi
        if (isset($table['data_free']) && $table['data_free'] > 1048576) { // > 1MB free space
            $analysis[] = "Terdapat fragmentasi data sebesar " . $this->formatSize($table['data_free']);
            $recommendations[] = "Jalankan OPTIMIZE TABLE untuk mengurangi fragmentasi";
        }

        // Analisis distribusi data
        if ($table['table_rows'] > 1000000) { // > 1 juta baris
            $analysis[] = "Tabel memiliki data yang sangat besar ({$table['table_rows']} baris)";
            $recommendations[] = "Pertimbangkan implementasi partisi tabel atau arsip data lama";
        }

        // Analisis redundansi index
        if ($table['indexes'] > $table['column_count'] / 2) {
            $analysis[] = "Kemungkinan terdapat redundansi index";
            $recommendations[] = "Evaluasi kebutuhan setiap index, hapus yang tidak diperlukan";
        }

        // Analisis kolom timestamp
        if (!$this->hasTimestampColumns($table)) {
            $analysis[] = "Tidak ada kolom timestamp untuk tracking perubahan";
            $recommendations[] = "Tambahkan kolom created_at/updated_at untuk audit trail";
        }

        // Analisis backup dan pemulihan
        if ($table['data_length'] > 1073741824) { // > 1GB
            $analysis[] = "Ukuran tabel besar, perlu strategi backup khusus";
            $recommendations[] = "Implementasikan strategi backup bertahap atau partial backup";
        }

        // Analisis tren pertumbuhan data
        if ($table['table_rows'] > 0) {
            $growthRate = $this->calculateGrowthRate($table);
            if ($growthRate > 30) { // Pertumbuhan > 30% per bulan
                $analysis[] = "Tabel memiliki pertumbuhan data yang tinggi ({$growthRate}% per bulan)";
                $recommendations[] = "Pertimbangkan strategi archiving atau partisi untuk manajemen data";
            }
        }

        // Analisis kualitas index
        $indexQuality = $this->analyzeIndexQuality($table);
        if (!empty($indexQuality['issues'])) {
            $analysis = array_merge($analysis, $indexQuality['issues']);
            $recommendations = array_merge($recommendations, $indexQuality['recommendations']);
        }

        // Analisis tipe data kolom
        $columnIssues = $this->analyzeColumnTypes($table);
        if (!empty($columnIssues)) {
            $analysis = array_merge($analysis, $columnIssues['issues']);
            $recommendations = array_merge($recommendations, $columnIssues['recommendations']);
        }

        // Analisis keamanan
        $securityIssues = $this->analyzeTableSecurity($table);
        if (!empty($securityIssues)) {
            $analysis = array_merge($analysis, $securityIssues['issues']);
            $recommendations = array_merge($recommendations, $securityIssues['recommendations']);
        }

        // Analisis maintenance
        $maintenanceStatus = $this->analyzeMaintenanceStatus($table);
        if (!empty($maintenanceStatus['issues'])) {
            $analysis = array_merge($analysis, $maintenanceStatus['issues']);
            $recommendations = array_merge($recommendations, $maintenanceStatus['recommendations']);
        }

        return [
            'analysis' => $analysis,
            'recommendations' => $recommendations
        ];
    }

    /**
     * Cek keberadaan kolom timestamp
     * @param array $table
     * @return bool
     */
    private function hasTimestampColumns(array $table): bool {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            $sql = "SHOW COLUMNS FROM `{$table['table_name']}` 
                    WHERE FIELD IN ('created_at', 'updated_at', 'timestamp', 'date_created', 'date_modified')
                    OR TYPE LIKE '%timestamp%'";
            
            $stmt = $pdo->query($sql);
            return $stmt->rowCount() > 0;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Menghitung skor efisiensi tabel
     * @param array $tableInfo
     * @return int
     */
    private function calculateEfficiencyScore(array $tableInfo): int {
        $score = 100;
        
        // Penalti untuk terlalu banyak index
        if ($tableInfo['indexes'] > 5) {
            $score -= ($tableInfo['indexes'] - 5) * 5;
        }
        
        // Penalti untuk row size yang terlalu besar
        if ($tableInfo['avg_row_length'] > 8192) { // 8KB
            $score -= 10;
        }
        
        // Penalti untuk tabel tanpa primary key
        if ($tableInfo['primary_keys'] == 0) {
            $score -= 20;
        }
        
        // Penalti untuk engine non-InnoDB
        if ($tableInfo['engine'] !== 'InnoDB') {
            $score -= 15;
        }

        // Penalti untuk fragmentasi
        if (isset($tableInfo['data_free']) && $tableInfo['data_free'] > 1048576) {
            $score -= 10;
        }

        // Penalti untuk rasio index tinggi
        $indexRatio = $tableInfo['index_length'] / ($tableInfo['data_length'] ?: 1);
        if ($indexRatio > 0.7) {
            $score -= 15;
        }

        // Penalti untuk ukuran data per baris yang besar
        $avgRowSize = $tableInfo['data_length'] / ($tableInfo['table_rows'] ?: 1);
        if ($avgRowSize > 1048576) { // > 1MB per baris
            $score -= 20;
        }

        // Penalti untuk tabel tanpa timestamp
        if (!$this->hasTimestampColumns($tableInfo)) {
            $score -= 5;
        }

        return max(0, min(100, $score));
    }

    /**
     * Method untuk membuat tabel baru
     * @param string $tableName Nama tabel
     * @param array $columns Definisi kolom
     * @param array $options Opsi tambahan untuk tabel
     * @return bool
     */
    public function createTable(string $tableName, array $columns, array $options = []): bool {
        try {
            // Validasi nama tabel
            if (!preg_match('/^[a-zA-Z0-9_]+$/', $tableName)) {
                throw new \Exception("Nama tabel tidak valid: {$tableName}");
            }

            // Validasi minimal harus ada 1 kolom
            if (empty($columns)) {
                throw new \Exception("Minimal harus ada 1 kolom");
            }

            $db = new NgoreiDb();
            $pdo = $db->connPDO();

            // Default options
            $defaultOptions = [
                'engine' => 'InnoDB',
                'charset' => 'utf8mb4',
                'collate' => 'utf8mb4_unicode_ci',
                'auto_increment' => 1,
                'comment' => ''
            ];
            
            $options = array_merge($defaultOptions, $options);

            // Bangun SQL untuk kolom
            $columnDefinitions = [];
            $primaryKeys = [];
            $indexes = [];
            $foreignKeys = [];

            foreach ($columns as $column) {
                $columnDef = $this->buildColumnDefinition($column);
                $columnDefinitions[] = $columnDef['definition'];
                
                if (!empty($columnDef['primary'])) {
                    $primaryKeys[] = $columnDef['primary'];
                }
                if (!empty($columnDef['index'])) {
                    $indexes[] = $columnDef['index'];
                }
                if (!empty($columnDef['foreign'])) {
                    $foreignKeys[] = $columnDef['foreign'];
                }
            }

            // Tambahkan primary key jika ada
            if (!empty($primaryKeys)) {
                $columnDefinitions[] = "PRIMARY KEY (" . implode(", ", $primaryKeys) . ")";
            }

            // Tambahkan indexes
            foreach ($indexes as $index) {
                $columnDefinitions[] = $index;
            }

            // Tambahkan foreign keys
            foreach ($foreignKeys as $foreign) {
                $columnDefinitions[] = $foreign;
            }

            // Bangun SQL lengkap
            $sql = "CREATE TABLE IF NOT EXISTS `{$tableName}` (
                " . implode(",\n                ", $columnDefinitions) . "
            ) ENGINE={$options['engine']}
              DEFAULT CHARSET={$options['charset']}
              COLLATE={$options['collate']}"
              . (!empty($options['auto_increment']) ? " AUTO_INCREMENT={$options['auto_increment']}" : "")
              . (!empty($options['comment']) ? " COMMENT='" . addslashes($options['comment']) . "'" : "");

            // Eksekusi SQL
            $pdo->exec($sql);

            return true;

        } catch (\Exception $e) {
            error_log("Error creating table: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Helper method untuk membangun definisi kolom
     * @param array $column Definisi kolom
     * @return array
     */
    private function buildColumnDefinition(array $column): array {
        $required = ['name', 'type'];
        foreach ($required as $field) {
            if (!isset($column[$field])) {
                throw new \Exception("Field {$field} wajib ada dalam definisi kolom");
            }
        }

        $definition = "`{$column['name']}` {$column['type']}";
        
        // Tambahkan length jika ada
        if (!empty($column['length'])) {
            $definition .= "({$column['length']})";
        }

        // Tambahkan atribut lain
        if (!empty($column['unsigned'])) {
            $definition .= " UNSIGNED";
        }
        if (!empty($column['zerofill'])) {
            $definition .= " ZEROFILL";
        }
        if (isset($column['nullable']) && !$column['nullable']) {
            $definition .= " NOT NULL";
        }
        if (isset($column['default'])) {
            $definition .= " DEFAULT " . (is_string($column['default']) ? "'{$column['default']}'" : $column['default']);
        }
        if (!empty($column['auto_increment'])) {
            $definition .= " AUTO_INCREMENT";
        }
        if (!empty($column['comment'])) {
            $definition .= " COMMENT '" . addslashes($column['comment']) . "'";
        }

        $result = ['definition' => $definition];

        // Handle primary key
        if (!empty($column['primary'])) {
            $result['primary'] = $column['name'];
        }

        // Handle indexes
        if (!empty($column['index'])) {
            $indexName = $column['index_name'] ?? "idx_{$column['name']}";
            $result['index'] = "INDEX `{$indexName}` (`{$column['name']}`)";
        }

        // Handle foreign keys
        if (!empty($column['foreign'])) {
            $fk = $column['foreign'];
            $fkName = $fk['name'] ?? "fk_{$column['name']}";
            $result['foreign'] = "CONSTRAINT `{$fkName}` FOREIGN KEY (`{$column['name']}`) " .
                                "REFERENCES `{$fk['reference_table']}`(`{$fk['reference_column']}`) " .
                                (!empty($fk['on_delete']) ? "ON DELETE {$fk['on_delete']} " : "") .
                                (!empty($fk['on_update']) ? "ON UPDATE {$fk['on_update']}" : "");
        }

        return $result;
    }

    /**
     * Method untuk mengoptimasi tabel
     * @param string|null $tableName Nama tabel (opsional)
     * @return array Status optimasi
     */
    public function optimizeTable(?string $tableName = null): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            if ($tableName) {
                // Optimasi satu tabel
                $sql = "OPTIMIZE TABLE `{$tableName}`";
                $pdo->exec($sql);
                return [
                    'status' => 'success',
                    'message' => "Tabel {$tableName} berhasil dioptimasi",
                    'table' => $tableName
                ];
            }
            
            // Optimasi semua tabel
            $tables = $this->showTables();
            $results = [];
            
            foreach ($tables as $table) {
                try {
                    $sql = "OPTIMIZE TABLE `{$table['tabel']}`";
                    $pdo->exec($sql);
                    $results[] = [
                        'table' => $table['tabel'],
                        'status' => 'success'
                    ];
                } catch (\Exception $e) {
                    $results[] = [
                        'table' => $table['tabel'],
                        'status' => 'error',
                        'message' => $e->getMessage()
                    ];
                }
            }
            
            return [
                'status' => 'success',
                'message' => 'Optimasi selesai',
                'results' => $results
            ];
            
        } catch (\Exception $e) {
            error_log("Error dalam optimizeTable: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Method untuk menganalisis struktur tabel
     * @param string $tableName Nama tabel
     * @return array Hasil analisis
     */
    public function analyzeTableStructure(string $tableName): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            // Dapatkan informasi kolom
            $sql = "SHOW FULL COLUMNS FROM `{$tableName}`";
            $stmt = $pdo->query($sql);
            $columns = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            $analysis = [
                'table_name' => $tableName,
                'columns' => [],
                'recommendations' => [],
                'warnings' => []
            ];
            
            foreach ($columns as $column) {
                $columnAnalysis = $this->analyzeColumn($column);
                $analysis['columns'][] = $columnAnalysis['info'];
                
                if (!empty($columnAnalysis['recommendations'])) {
                    $analysis['recommendations'] = array_merge(
                        $analysis['recommendations'],
                        $columnAnalysis['recommendations']
                    );
                }
                
                if (!empty($columnAnalysis['warnings'])) {
                    $analysis['warnings'] = array_merge(
                        $analysis['warnings'],
                        $columnAnalysis['warnings']
                    );
                }
            }
            
            // Analisis index
            $indexAnalysis = $this->analyzeIndexes($pdo, $tableName);
            $analysis['indexes'] = $indexAnalysis['indexes'];
            $analysis['recommendations'] = array_merge(
                $analysis['recommendations'],
                $indexAnalysis['recommendations']
            );
            
            return $analysis;
            
        } catch (\Exception $e) {
            error_log("Error dalam analyzeTableStructure: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Helper method untuk menganalisis kolom
     * @param array $column Informasi kolom
     * @return array
     */
    private function analyzeColumn(array $column): array {
        $analysis = [
            'info' => [
                'name' => $column['Field'],
                'type' => $column['Type'],
                'nullable' => $column['Null'],
                'key' => $column['Key'],
                'default' => $column['Default'],
                'extra' => $column['Extra']
            ],
            'recommendations' => [],
            'warnings' => []
        ];
        
        // Analisis tipe data
        if (strpos($column['Type'], 'varchar') !== false) {
            preg_match('/varchar\((\d+)\)/', $column['Type'], $matches);
            if (!empty($matches[1]) && $matches[1] > 255) {
                $analysis['recommendations'][] = "Kolom {$column['Field']}: Pertimbangkan menggunakan TEXT untuk varchar > 255";
            }
        }
        
        // Analisis index
        if ($column['Key'] === 'MUL') {
            $analysis['recommendations'][] = "Kolom {$column['Field']}: Pastikan index ini benar-benar diperlukan";
        }
        
        // Analisis nullable
        if ($column['Null'] === 'YES' && empty($column['Default'])) {
            $analysis['warnings'][] = "Kolom {$column['Field']}: Nullable tanpa default value bisa menyebabkan masalah";
        }
        
        return $analysis;
    }

    /**
     * Helper method untuk menganalisis index
     * @param \PDO $pdo
     * @param string $tableName
     * @return array
     */
    private function analyzeIndexes(\PDO $pdo, string $tableName): array {
        $sql = "SHOW INDEX FROM `{$tableName}`";
        $stmt = $pdo->query($sql);
        $indexes = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        $analysis = [
            'indexes' => [],
            'recommendations' => []
        ];
        
        $indexCount = 0;
        $duplicateCheck = [];
        
        foreach ($indexes as $index) {
            $indexCount++;
            $key = $index['Column_name'];
            
            $analysis['indexes'][] = [
                'name' => $index['Key_name'],
                'column' => $index['Column_name'],
                'unique' => ($index['Non_unique'] == 0),
                'cardinality' => $index['Cardinality']
            ];
            
            // Cek duplikasi
            if (isset($duplicateCheck[$key])) {
                $analysis['recommendations'][] = "Kemungkinan index duplikat pada kolom {$key}";
            }
            $duplicateCheck[$key] = true;
        }
        
        // Cek jumlah index
        if ($indexCount > 5) {
            $analysis['recommendations'][] = "Terlalu banyak index ({$indexCount}) bisa mempengaruhi performa INSERT/UPDATE";
        }
        
        return $analysis;
    }

    /**
     * Method untuk mendapatkan statistik penggunaan tabel
     * @param string $tableName Nama tabel
     * @return array
     */
    public function getTableStatistics(string $tableName): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            // Dapatkan statistik dasar
            $sql = "SELECT 
                        TABLE_ROWS as total_rows,
                        AVG_ROW_LENGTH as avg_row_length,
                        DATA_LENGTH as data_size,
                        INDEX_LENGTH as index_size,
                        DATA_FREE as free_space,
                        AUTO_INCREMENT as next_auto_increment,
                        UPDATE_TIME as last_update,
                        TABLE_COLLATION as collation
                    FROM information_schema.TABLES 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = ?";
                    
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$tableName]);
            $stats = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            // Format ukuran
            $stats['data_size'] = $this->formatSize($stats['data_size']);
            $stats['index_size'] = $this->formatSize($stats['index_size']);
            $stats['free_space'] = $this->formatSize($stats['free_space']);
            
            // Tambahkan statistik index
            $stats['indexes'] = $this->getIndexStatistics($pdo, $tableName);
            
            // Tambahkan estimasi pertumbuhan
            $stats['growth_estimate'] = $this->estimateTableGrowth($stats);
            
            return $stats;
            
        } catch (\Exception $e) {
            error_log("Error dalam getTableStatistics: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Helper method untuk statistik index
     * @param \PDO $pdo
     * @param string $tableName
     * @return array
     */
    private function getIndexStatistics(\PDO $pdo, string $tableName): array {
        $sql = "SHOW INDEX FROM `{$tableName}`";
        $stmt = $pdo->query($sql);
        $indexes = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        $stats = [];
        foreach ($indexes as $index) {
            $stats[] = [
                'name' => $index['Key_name'],
                'column' => $index['Column_name'],
                'unique' => ($index['Non_unique'] == 0),
                'cardinality' => $index['Cardinality'],
                'nullable' => ($index['Null'] === 'YES'),
                'index_type' => $index['Index_type']
            ];
        }
        
        return $stats;
    }

    /**
     * Helper method untuk estimasi pertumbuhan
     * @param array $stats Statistik tabel
     * @return array
     */
    private function estimateTableGrowth(array $stats): array {
        $rowSize = $stats['avg_row_length'];
        $currentRows = $stats['total_rows'];
        
        return [
            'daily' => $this->formatSize($rowSize * ($currentRows * 0.01)), // Estimasi 1% pertumbuhan per hari
            'weekly' => $this->formatSize($rowSize * ($currentRows * 0.07)), // Estimasi 7% pertumbuhan per minggu
            'monthly' => $this->formatSize($rowSize * ($currentRows * 0.30)) // Estimasi 30% pertumbuhan per bulan
        ];
    }

    /**
     * Method untuk melakukan operasi pada tabel
     * @param string $tableName Nama tabel
     * @param string $operation Jenis operasi
     * @param array $options Opsi tambahan
     * @return array Status operasi
     */
    public function tableOperation(string $tableName, string $operation, array $options = []): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            switch (strtoupper($operation)) {
                case 'TRUNCATE':
                    return $this->truncateTable($pdo, $tableName);
                    
                case 'DROP':
                    return $this->dropTable($pdo, $tableName);
                    
                case 'REPAIR':
                    return $this->repairTable($pdo, $tableName);
                    
                case 'CHECK':
                    return $this->checkTable($pdo, $tableName);
                    
                case 'ALTER':
                    return $this->alterTable($pdo, $tableName, $options);
                    
                case 'RENAME':
                    if (empty($options['new_name'])) {
                        throw new \Exception("Nama baru tabel harus disediakan");
                    }
                    return $this->renameTable($pdo, $tableName, $options['new_name']);
                    
                case 'BACKUP':
                    return $this->backupTable($pdo, $tableName, $options);
                    
                case 'CLONE':
                    if (empty($options['new_name'])) {
                        throw new \Exception("Nama tabel clone harus disediakan");
                    }
                    $withData = $options['with_data'] ?? true; // Default true untuk menyalin data
                    return $this->cloneTable($pdo, $tableName, $options['new_name'], $withData);
                    
                default:
                    throw new \Exception("Operasi tidak valid: {$operation}");
            }
        } catch (\Exception $e) {
            error_log("Error dalam tableOperation: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Mengosongkan tabel
     */
    private function truncateTable(\PDO $pdo, string $tableName): array {
        try {
            $pdo->exec("TRUNCATE TABLE `{$tableName}`");
            return [
                'status' => 'success',
                'message' => "Tabel {$tableName} berhasil dikosongkan"
            ];
        } catch (\Exception $e) {
            throw new \Exception("Gagal mengosongkan tabel: " . $e->getMessage());
        }
    }

    /**
     * Menghapus tabel
     */
    private function dropTable(\PDO $pdo, string $tableName): array {
        try {
            $pdo->exec("DROP TABLE IF EXISTS `{$tableName}`");
            return [
                'status' => 'success',
                'message' => "Tabel {$tableName} berhasil dihapus"
            ];
        } catch (\Exception $e) {
            throw new \Exception("Gagal menghapus tabel: " . $e->getMessage());
        }
    }

    /**
     * Memperbaiki tabel
     */
    private function repairTable(\PDO $pdo, string $tableName): array {
        try {
            $pdo->exec("REPAIR TABLE `{$tableName}`");
            return [
                'status' => 'success',
                'message' => "Tabel {$tableName} berhasil diperbaiki"
            ];
        } catch (\Exception $e) {
            throw new \Exception("Gagal memperbaiki tabel: " . $e->getMessage());
        }
    }

    /**
     * Memeriksa tabel
     */
    private function checkTable(\PDO $pdo, string $tableName): array {
        try {
            $stmt = $pdo->query("CHECK TABLE `{$tableName}`");
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            return [
                'status' => 'success',
                'message' => "Pemeriksaan tabel selesai",
                'result' => $result
            ];
        } catch (\Exception $e) {
            throw new \Exception("Gagal memeriksa tabel: " . $e->getMessage());
        }
    }

    /**
     * Mengubah struktur tabel
     */
    private function alterTable(\PDO $pdo, string $tableName, array $options): array {
        try {
            if (empty($options['alterations'])) {
                throw new \Exception("Daftar perubahan harus disediakan");
            }
            
            $alterations = [];
            foreach ($options['alterations'] as $alteration) {
                if (empty($alteration['type']) || empty($alteration['definition'])) {
                    continue;
                }
                
                $alterations[] = "{$alteration['type']} {$alteration['definition']}";
            }
            
            if (empty($alterations)) {
                throw new \Exception("Tidak ada perubahan valid yang diberikan");
            }
            
            $sql = "ALTER TABLE `{$tableName}` " . implode(", ", $alterations);
            $pdo->exec($sql);
            
            return [
                'status' => 'success',
                'message' => "Struktur tabel berhasil diubah",
                'alterations' => $alterations
            ];
        } catch (\Exception $e) {
            throw new \Exception("Gagal mengubah struktur tabel: " . $e->getMessage());
        }
    }

    /**
     * Mengganti nama tabel
     */
    private function renameTable(\PDO $pdo, string $tableName, string $newName): array {
        try {
            $pdo->exec("RENAME TABLE `{$tableName}` TO `{$newName}`");
            return [
                'status' => 'success',
                'message' => "Tabel {$tableName} berhasil diubah namanya menjadi {$newName}"
            ];
        } catch (\Exception $e) {
            throw new \Exception("Gagal mengganti nama tabel: " . $e->getMessage());
        }
    }

    /**
     * Backup tabel
     */
    private function backupTable(\PDO $pdo, string $tableName, array $options): array {
        try {
            $backupName = $options['backup_name'] ?? $tableName . '_backup_' . date('Ymd_His');
            
            // Create table structure
            $stmt = $pdo->query("SHOW CREATE TABLE `{$tableName}`");
            $createTable = $stmt->fetch(\PDO::FETCH_ASSOC);
            $createSql = str_replace($tableName, $backupName, $createTable['Create Table']);
            
            $pdo->exec($createSql);
            
            // Copy data
            $pdo->exec("INSERT INTO `{$backupName}` SELECT * FROM `{$tableName}`");
            
            return [
                'status' => 'success',
                'message' => "Backup tabel berhasil dibuat",
                'backup_name' => $backupName
            ];
        } catch (\Exception $e) {
            throw new \Exception("Gagal membuat backup tabel: " . $e->getMessage());
        }
    }

    /**
     * Mengkloning tabel
     */
    private function cloneTable(\PDO $pdo, string $tableName, string $newName, bool $withData = true): array {
        try {
            // Cek apakah tabel sumber ada
            $checkSql = "SHOW TABLES LIKE '{$tableName}'";
            $stmt = $pdo->query($checkSql);
            if ($stmt->rowCount() === 0) {
                throw new \Exception("Tabel sumber '{$tableName}' tidak ditemukan");
            }

            // Cek apakah tabel target sudah ada
            $checkSql = "SHOW TABLES LIKE '{$newName}'";
            $stmt = $pdo->query($checkSql);
            if ($stmt->rowCount() > 0) {
                throw new \Exception("Tabel target '{$newName}' sudah ada");
            }

            // Dapatkan struktur tabel sumber
            $createSql = "SHOW CREATE TABLE `{$tableName}`";
            $stmt = $pdo->query($createSql);
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if (!isset($row['Create Table'])) {
                throw new \Exception("Tidak dapat mendapatkan struktur tabel '{$tableName}'");
            }
            
            $createTableSql = $row['Create Table'];

            // Ganti nama tabel di SQL
            $createTableSql = preg_replace(
                "/CREATE TABLE `{$tableName}`/",
                "CREATE TABLE `{$newName}`",
                $createTableSql
            );

            // Buat tabel baru
            $pdo->exec($createTableSql);

            // Salin data jika diminta
            if ($withData) {
                $insertSql = "INSERT INTO `{$newName}` SELECT * FROM `{$tableName}`";
                $pdo->exec($insertSql);
                
                // Dapatkan jumlah baris yang disalin
                $countSql = "SELECT COUNT(*) as total FROM `{$newName}`";
                $rowCount = $pdo->query($countSql)->fetch(\PDO::FETCH_ASSOC)['total'];
            }

            // Dapatkan informasi tabel yang baru dibuat
            $tableSql = "SELECT 
                ENGINE,
                TABLE_ROWS as Rows,
                DATA_LENGTH as DataLength,
                INDEX_LENGTH as IndexLength
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = ?";
            
            $stmt = $pdo->prepare($tableSql);
            $stmt->execute([$newName]);
            $tableInfo = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            return [
                'status' => 'success',
                'message' => "Tabel berhasil dikloning" . ($withData ? " beserta datanya" : ""),
                'clone_name' => $newName,
                'info' => [
                    'engine' => $tableInfo['ENGINE'],
                    'rows' => (int)$tableInfo['Rows'],
                    'data_size' => $this->formatSize($tableInfo['DataLength']),
                    'index_size' => $this->formatSize($tableInfo['IndexLength']),
                    'copied_rows' => $withData ? (int)$rowCount : 0
                ]
            ];

        } catch (\Exception $e) {
            throw new \Exception("Gagal mengkloning tabel: " . $e->getMessage());
        }
    }

    /**
     * Method untuk melakukan maintenance database
     * @param array $options Opsi maintenance
     * @return array Status operasi
     */
    public function databaseMaintenance(array $options = []): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            $results = [
                'status' => 'success',
                'operations' => []
            ];

            // 1. Cek dan perbaiki tabel yang rusak
            if ($options['check_tables'] ?? true) {
                $tables = $this->showTables();
                foreach ($tables as $table) {
                    $checkResult = $pdo->query("CHECK TABLE `{$table['tabel']}`")->fetch();
                    if ($checkResult['Msg_text'] !== 'OK') {
                        $pdo->exec("REPAIR TABLE `{$table['tabel']}`");
                        $results['operations'][] = [
                            'type' => 'repair',
                            'table' => $table['tabel'],
                            'status' => 'fixed'
                        ];
                    }
                }
            }

            // 2. Optimasi tabel
            if ($options['optimize'] ?? true) {
                foreach ($tables as $table) {
                    $pdo->exec("OPTIMIZE TABLE `{$table['tabel']}`");
                    $results['operations'][] = [
                        'type' => 'optimize',
                        'table' => $table['tabel']
                    ];
                }
            }

            // 3. Analisis tabel
            if ($options['analyze'] ?? true) {
                foreach ($tables as $table) {
                    $pdo->exec("ANALYZE TABLE `{$table['tabel']}`");
                    $results['operations'][] = [
                        'type' => 'analyze',
                        'table' => $table['tabel']
                    ];
                }
            }

            // 4. Bersihkan data temporary
            if ($options['clean_temp'] ?? true) {
                $this->cleanTemporaryData($pdo);
                $results['operations'][] = [
                    'type' => 'clean_temp',
                    'status' => 'completed'
                ];
            }

            return $results;
        } catch (\Exception $e) {
            error_log("Error dalam maintenance: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Method untuk membersihkan data temporary
     */
    private function cleanTemporaryData(\PDO $pdo): void {
        // Hapus log lama
        $pdo->exec("DELETE FROM log_table WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
        
        // Hapus session expired
        $pdo->exec("DELETE FROM sessions WHERE last_activity < DATE_SUB(NOW(), INTERVAL 24 HOUR)");
        
        // Hapus file temporary
        $pdo->exec("DELETE FROM temporary_files WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    }

    /**
     * Method untuk monitoring performa database
     * @return array Metrik performa
     */
    public function monitorPerformance(): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            $metrics = [
                'general' => $this->getGeneralMetrics($pdo),
                'queries' => $this->getQueryMetrics($pdo),
                'memory' => $this->getMemoryMetrics($pdo),
                'connections' => $this->getConnectionMetrics($pdo),
                'innodb' => $this->getInnoDBMetrics($pdo)
            ];
            
            // Tambahkan rekomendasi
            $metrics['recommendations'] = $this->generateRecommendations($metrics);
            
            return $metrics;
        } catch (\Exception $e) {
            error_log("Error dalam monitoring: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Method untuk mendapatkan metrik umum
     */
    private function getGeneralMetrics(\PDO $pdo): array {
        $metrics = [];
        
        // Uptime
        $uptime = $pdo->query("SHOW GLOBAL STATUS LIKE 'Uptime'")->fetch();
        $metrics['uptime'] = $this->formatUptime($uptime['Value']);
        
        // Version
        $metrics['version'] = $pdo->getAttribute(\PDO::ATTR_SERVER_VERSION);
        
        // Threads
        $threads = $pdo->query("SHOW GLOBAL STATUS LIKE 'Threads_%'")->fetchAll();
        foreach ($threads as $thread) {
            $metrics['threads'][strtolower(substr($thread['Variable_name'], 8))] = $thread['Value'];
        }
        
        return $metrics;
    }

    /**
     * Method untuk mendapatkan metrik query
     */
    private function getQueryMetrics(\PDO $pdo): array {
        $metrics = [];
        
        // Query statistics
        $queryStats = [
            'Questions',
            'Slow_queries',
            'Com_select',
            'Com_insert',
            'Com_update',
            'Com_delete'
        ];
        
        foreach ($queryStats as $stat) {
            $result = $pdo->query("SHOW GLOBAL STATUS LIKE '$stat'")->fetch();
            $metrics[strtolower($stat)] = $result['Value'];
        }
        
        // Calculate queries per second
        $metrics['queries_per_second'] = round($metrics['questions'] / $metrics['uptime'], 2);
        
        return $metrics;
    }

    /**
     * Method untuk mendapatkan metrik memory
     */
    private function getMemoryMetrics(\PDO $pdo): array {
        $metrics = [];
        
        // Memory variables
        $memoryVars = [
            'innodb_buffer_pool_size',
            'key_buffer_size',
            'query_cache_size',
            'tmp_table_size',
            'max_connections'
        ];
        
        foreach ($memoryVars as $var) {
            $result = $pdo->query("SHOW VARIABLES LIKE '$var'")->fetch();
            $metrics[$var] = $this->formatSize((int)$result['Value']);
        }
        
        return $metrics;
    }

    /**
     * Method untuk mendapatkan metrik koneksi
     */
    private function getConnectionMetrics(\PDO $pdo): array {
        $metrics = [];
        
        // Connection metrics
        $connectionStats = [
            'Max_used_connections',
            'Aborted_connects',
            'Aborted_clients',
            'Threads_connected'
        ];
        
        foreach ($connectionStats as $stat) {
            $result = $pdo->query("SHOW GLOBAL STATUS LIKE '$stat'")->fetch();
            $metrics[strtolower($stat)] = $result['Value'];
        }
        
        // Calculate connection usage percentage
        $maxConnections = $pdo->query("SHOW VARIABLES LIKE 'max_connections'")->fetch();
        $metrics['connection_usage_pct'] = round(
            ($metrics['threads_connected'] / $maxConnections['Value']) * 100,
            2
        );
        
        return $metrics;
    }

    /**
     * Method untuk mendapatkan metrik InnoDB
     */
    private function getInnoDBMetrics(\PDO $pdo): array {
        $metrics = [];
        
        // InnoDB metrics
        $innodbStats = [
            'Innodb_buffer_pool_read_requests',
            'Innodb_buffer_pool_reads',
            'Innodb_row_lock_waits',
            'Innodb_row_lock_time'
        ];
        
        foreach ($innodbStats as $stat) {
            $result = $pdo->query("SHOW GLOBAL STATUS LIKE '$stat'")->fetch();
            $metrics[strtolower($stat)] = $result['Value'];
        }
        
        // Calculate buffer pool hit ratio
        $reads = (int)$metrics['innodb_buffer_pool_reads'];
        $requests = (int)$metrics['innodb_buffer_pool_read_requests'];
        $metrics['buffer_pool_hit_ratio'] = round(
            (($requests - $reads) / $requests) * 100,
            2
        );
        
        return $metrics;
    }

    /**
     * Method untuk menghasilkan rekomendasi
     */
    private function generateRecommendations(array $metrics): array {
        $recommendations = [];
        
        // Check slow queries
        if ($metrics['queries']['slow_queries'] > 0) {
            $recommendations[] = [
                'type' => 'warning',
                'message' => "Terdapat {$metrics['queries']['slow_queries']} query lambat. Pertimbangkan untuk mengoptimasi query."
            ];
        }
        
        // Check connection usage
        if ($metrics['connections']['connection_usage_pct'] > 80) {
            $recommendations[] = [
                'type' => 'critical',
                'message' => "Penggunaan koneksi tinggi ({$metrics['connections']['connection_usage_pct']}%). Pertimbangkan untuk menaikkan max_connections."
            ];
        }
        
        // Check buffer pool hit ratio
        if ($metrics['innodb']['buffer_pool_hit_ratio'] < 95) {
            $recommendations[] = [
                'type' => 'warning',
                'message' => "Buffer pool hit ratio rendah ({$metrics['innodb']['buffer_pool_hit_ratio']}%). Pertimbangkan untuk menaikkan innodb_buffer_pool_size."
            ];
        }
        
        return $recommendations;
    }

    /**
     * Helper method untuk format uptime
     */
    private function formatUptime(int $seconds): string {
        $days = floor($seconds / 86400);
        $hours = floor(($seconds % 86400) / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        
        return "{$days}d {$hours}h {$minutes}m";
    }

    /**
     * Menghitung estimasi pertumbuhan data
     * @param array $table
     * @return float
     */
    private function calculateGrowthRate(array $table): float {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            // Ambil jumlah baris 30 hari yang lalu (jika ada log)
            $sql = "SELECT COUNT(*) as old_count FROM `{$table['table_name']}` 
                    WHERE created_at <= DATE_SUB(NOW(), INTERVAL 30 DAY)";
            
            $stmt = $pdo->query($sql);
            $oldCount = $stmt->fetch(\PDO::FETCH_ASSOC)['old_count'] ?? 0;
            
            if ($oldCount > 0) {
                return (($table['table_rows'] - $oldCount) / $oldCount) * 100;
            }
            
            return 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Analisis kualitas index
     * @param array $table
     * @return array
     */
    private function analyzeIndexQuality(array $table): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            $issues = [];
            $recommendations = [];

            // Cek cardinality index
            $sql = "SHOW INDEX FROM `{$table['table_name']}`";
            $indexes = $pdo->query($sql)->fetchAll(\PDO::FETCH_ASSOC);
            
            foreach ($indexes as $index) {
                $cardinality = $index['Cardinality'] ?? 0;
                $totalRows = $table['table_rows'];
                
                if ($cardinality > 0 && $totalRows > 0) {
                    $selectivity = $cardinality / $totalRows;
                    
                    if ($selectivity < 0.1 && !$index['Non_unique']) {
                        $issues[] = "Index '{$index['Key_name']}' memiliki selektivitas rendah ({$selectivity})";
                        $recommendations[] = "Evaluasi kegunaan index '{$index['Key_name']}'";
                    }
                }
            }

            return [
                'issues' => $issues,
                'recommendations' => $recommendations
            ];
        } catch (\Exception $e) {
            return ['issues' => [], 'recommendations' => []];
        }
    }

    /**
     * Analisis tipe data kolom
     * @param array $table
     * @return array
     */
    private function analyzeColumnTypes(array $table): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            $issues = [];
            $recommendations = [];

            $sql = "SHOW FULL COLUMNS FROM `{$table['table_name']}`";
            $columns = $pdo->query($sql)->fetchAll(\PDO::FETCH_ASSOC);
            
            foreach ($columns as $column) {
                // Cek VARCHAR yang terlalu besar
                if (preg_match('/varchar\((\d+)\)/', $column['Type'], $matches)) {
                    $size = (int)$matches[1];
                    if ($size > 255) {
                        $issues[] = "Kolom '{$column['Field']}' menggunakan VARCHAR($size)";
                        $recommendations[] = "Pertimbangkan menggunakan TEXT untuk '{$column['Field']}'";
                    }
                }
                
                // Cek penggunaan CHAR
                if (strpos($column['Type'], 'char(') === 0) {
                    $issues[] = "Kolom '{$column['Field']}' menggunakan tipe CHAR";
                    $recommendations[] = "Pertimbangkan menggunakan VARCHAR untuk '{$column['Field']}'";
                }
                
                // Cek tipe numerik
                if (strpos($column['Type'], 'int') !== false && $column['Type'] !== 'int') {
                    $issues[] = "Kolom '{$column['Field']}' menggunakan {$column['Type']}";
                    $recommendations[] = "Evaluasi penggunaan tipe data untuk optimasi storage";
                }
            }

            return [
                'issues' => $issues,
                'recommendations' => $recommendations
            ];
        } catch (\Exception $e) {
            return ['issues' => [], 'recommendations' => []];
        }
    }

    /**
     * Analisis keamanan tabel
     * @param array $table
     * @return array
     */
    private function analyzeTableSecurity(array $table): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            $issues = [];
            $recommendations = [];

            // Cek hak akses tabel
            $sql = "SHOW GRANTS FOR CURRENT_USER()";
            $grants = $pdo->query($sql)->fetchAll(\PDO::FETCH_ASSOC);
            
            $hasFullAccess = false;
            foreach ($grants as $grant) {
                if (strpos(current($grant), 'ALL PRIVILEGES') !== false) {
                    $hasFullAccess = true;
                    break;
                }
            }

            if ($hasFullAccess) {
                $issues[] = "Tabel memiliki hak akses penuh untuk user saat ini";
                $recommendations[] = "Terapkan prinsip least privilege untuk keamanan";
            }

            // Cek kolom sensitif
            $sql = "SHOW FULL COLUMNS FROM `{$table['table_name']}`";
            $columns = $pdo->query($sql)->fetchAll(\PDO::FETCH_ASSOC);
            
            $sensitiveColumns = ['password', 'token', 'key', 'secret', 'credit_card'];
            foreach ($columns as $column) {
                foreach ($sensitiveColumns as $sensitive) {
                    if (stripos($column['Field'], $sensitive) !== false) {
                        $issues[] = "Kolom '{$column['Field']}' mungkin berisi data sensitif";
                        $recommendations[] = "Pastikan enkripsi data untuk kolom '{$column['Field']}'";
                    }
                }
            }

            return [
                'issues' => $issues,
                'recommendations' => $recommendations
            ];
        } catch (\Exception $e) {
            return ['issues' => [], 'recommendations' => []];
        }
    }

    /**
     * Analisis status maintenance
     * @param array $table
     * @return array
     */
    private function analyzeMaintenanceStatus(array $table): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            $issues = [];
            $recommendations = [];

            // Cek waktu terakhir maintenance
            $sql = "SELECT UPDATE_TIME, CHECK_TIME, CREATE_TIME 
                    FROM information_schema.TABLES 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = ?";
                    
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$table['table_name']]);
            $maintenance = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($maintenance['UPDATE_TIME']) {
                $lastUpdate = strtotime($maintenance['UPDATE_TIME']);
                $daysSinceUpdate = (time() - $lastUpdate) / (60 * 60 * 24);
                
                if ($daysSinceUpdate > 30) {
                    $issues[] = "Tabel tidak diupdate selama {$daysSinceUpdate} hari";
                    $recommendations[] = "Evaluasi apakah tabel masih aktif digunakan";
                }
            }

            if (!$maintenance['CHECK_TIME']) {
                $issues[] = "Tabel belum pernah di-CHECK";
                $recommendations[] = "Jalankan CHECK TABLE untuk memastikan integritas data";
            }

            return [
                'issues' => $issues,
                'recommendations' => $recommendations
            ];
        } catch (\Exception $e) {
            return ['issues' => [], 'recommendations' => []];
        }
    }

    /**
     * Method untuk membuat database baru
     * @param string $dbName Nama database
     * @param array $options Opsi konfigurasi database
     * @return array Status operasi
     */
    public function createDatabase(string $dbName, array $options = []): array {
        try {
            // Validasi nama database
            if (!preg_match('/^[a-zA-Z0-9_]+$/', $dbName)) {
                throw new \Exception("Nama database tidak valid. Gunakan hanya huruf, angka dan underscore");
            }

            $db = new NgoreiDb();
            $pdo = $db->connPDO();

            // Default options
            $defaultOptions = [
                'charset' => 'utf8mb4',
                'collation' => 'utf8mb4_general_ci',
                'if_not_exists' => true
            ];
            
            $options = array_merge($defaultOptions, $options);

            // Build query
            $sql = "CREATE DATABASE " . 
                   ($options['if_not_exists'] ? "IF NOT EXISTS " : "") . 
                   "`{$dbName}` " .
                   "CHARACTER SET {$options['charset']} " .
                   "COLLATE {$options['collation']}";

            // Eksekusi query
            $pdo->exec($sql);

            // Set hak akses jika diperlukan
            if (isset($options['grant_access'])) {
                $this->grantDatabaseAccess($pdo, $dbName, $options['grant_access']);
            }

            // Dapatkan informasi database yang baru dibuat
            $info = $this->getDatabaseInfo($pdo, $dbName);

            return [
                'status' => 'success',
                'message' => "Database {$dbName} berhasil dibuat",
                'database' => $info
            ];

        } catch (\Exception $e) {
            error_log("Error dalam createDatabase: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Helper method untuk memberikan hak akses database
     */
    private function grantDatabaseAccess(\PDO $pdo, string $dbName, array $access): void {
        $validPrivileges = [
            'ALL', 'SELECT', 'INSERT', 'UPDATE', 'DELETE',
            'CREATE', 'DROP', 'REFERENCES', 'INDEX', 'ALTER'
        ];

        // Validasi privileges
        $privileges = array_intersect(
            array_map('strtoupper', $access['privileges'] ?? ['SELECT']),
            $validPrivileges
        );

        if (empty($privileges)) {
            $privileges = ['SELECT'];
        }

        // Build dan eksekusi query GRANT
        $sql = sprintf(
            "GRANT %s ON `%s`.* TO '%s'@'%s'",
            implode(', ', $privileges),
            $dbName,
            $access['user'] ?? 'root',
            $access['host'] ?? 'localhost'
        );

        $pdo->exec($sql);
        $pdo->exec("FLUSH PRIVILEGES");
    }

    /**
     * Helper method untuk mendapatkan informasi database
     */
    private function getDatabaseInfo(\PDO $pdo, string $dbName): array {
        $sql = "SELECT 
                DEFAULT_CHARACTER_SET_NAME as charset,
                DEFAULT_COLLATION_NAME as collation
            FROM information_schema.SCHEMATA 
            WHERE SCHEMA_NAME = ?";
            
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$dbName]);
        $info = $stmt->fetch(\PDO::FETCH_ASSOC);

        return [
            'name' => $dbName,
            'charset' => $info['charset'],
            'collation' => $info['collation'],
            'created_at' => date('Y-m-d H:i:s')
        ];
    }

    /**
     * Method untuk mendapatkan struktur database dan tabel dalam format tree
     * @param array $options Opsi konfigurasi
     * @return array Struktur database dalam format tree
     */
    public function getDatabaseTree(array $options = []): array {
        try {
            $db = new NgoreiDb();
            $pdo = $db->connPDO();
            
            // Default options
            $defaultOptions = [
                'exclude_tables' => [],
                'include_columns' => true,
                'include_views' => true,
                'max_depth' => 3,
                'show_details' => true
            ];
            
            $options = array_merge($defaultOptions, $options);
            
            // Dapatkan daftar database
            $sql = "SELECT SCHEMA_NAME as name 
                    FROM information_schema.SCHEMATA 
                    WHERE SCHEMA_NAME NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')";
            $stmt = $pdo->query($sql);
            $databases = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            $tree = [];
            
            foreach ($databases as $database) {
                // Dapatkan informasi database
                $dbInfo = $this->getBasicDatabaseInfo($pdo, $database['name']);
                
                $dbNode = [
                    'id' => 'db_' . $database['name'],
                    'text' => $database['name'],
                    'type' => 'database',
                    'icon' => 'fa fa-database',
                    'details' => [
                        'total_tables' => $dbInfo['total_tables'],
                        'size' => $dbInfo['size']
                    ],
                    'children' => []
                ];
                
                // Query untuk mendapatkan tabel spesifik untuk database ini
                $tableSql = "SELECT 
                    TABLE_NAME as tabel,
                    ENGINE as engine,
                    TABLE_ROWS as rows,
                    DATA_LENGTH + INDEX_LENGTH as size,
                    CREATE_TIME as created_at,
                    UPDATE_TIME as updated_at
                FROM information_schema.TABLES 
                WHERE TABLE_SCHEMA = ?
                AND TABLE_TYPE = 'BASE TABLE'";
                
                $tableStmt = $pdo->prepare($tableSql);
                $tableStmt->execute([$database['name']]);
                $tables = $tableStmt->fetchAll(\PDO::FETCH_ASSOC);
                
                foreach ($tables as $table) {
                    // Skip tabel yang dikecualikan
                    if (in_array($table['tabel'], $options['exclude_tables'])) {
                        continue;
                    }
                    
                    $tableNode = [
                        'id' => 'tbl_' . $database['name'] . '_' . $table['tabel'],
                        'text' => $table['tabel'],
                        'type' => 'table',
                        'icon' => 'fa fa-table',
                        'database' => $database['name'],
                        'original' => [
                            'database' => $database['name'],
                            'table' => $table['tabel'],
                            'type' => 'table'
                        ],
                        'details' => [
                            'database' => $database['name'],
                            'engine' => $table['engine'],
                            'rows' => $table['rows'],
                            'size' => $this->formatSize($table['size']),
                            'created_at' => $table['created_at'],
                            'updated_at' => $table['updated_at']
                        ],
                        'children' => []
                    ];
                    
                    // Tambahkan detail tabel jika diminta
                    if ($options['show_details']) {
                        $tableNode['details'] = [
                            'engine' => $table['engine'],
                            'rows' => $table['rows'],
                            'size' => $this->formatSize($table['size']),
                            'created_at' => $table['created_at'],
                            'updated_at' => $table['updated_at']
                        ];
                    }
                    
                    // Tambahkan kolom jika diminta
                    if ($options['include_columns']) {
                        $columnSql = "SELECT 
                            COLUMN_NAME as Field,
                            COLUMN_TYPE as Type,
                            IS_NULLABLE as `Null`,
                            COLUMN_KEY as `Key`,
                            COLUMN_DEFAULT as `Default`,
                            EXTRA as Extra
                        FROM information_schema.COLUMNS 
                        WHERE TABLE_SCHEMA = ? 
                        AND TABLE_NAME = ?
                        ORDER BY ORDINAL_POSITION";
                        
                        $columnStmt = $pdo->prepare($columnSql);
                        $columnStmt->execute([$database['name'], $table['tabel']]);
                        $columns = $columnStmt->fetchAll(\PDO::FETCH_ASSOC);
                        
                        foreach ($columns as $column) {
                            $tableNode['children'][] = [
                                'id' => 'col_' . $database['name'] . '_' . $table['tabel'] . '_' . $column['Field'],
                                'text' => $column['Field'],
                                'type' => 'column',
                                'icon' => 'fa fa-columns',
                                'details' => [
                                    'type' => $column['Type'],
                                    'null' => $column['Null'],
                                    'key' => $column['Key'],
                                    'default' => $column['Default'],
                                    'extra' => $column['Extra']
                                ]
                            ];
                        }
                    }
                    
                    $dbNode['children'][] = $tableNode;
                }
                
                // Tambahkan views jika diminta
                if ($options['include_views']) {
                    $viewSql = "SELECT 
                        TABLE_NAME as name,
                        CREATE_TIME as created_at,
                        UPDATE_TIME as updated_at
                    FROM information_schema.TABLES 
                    WHERE TABLE_SCHEMA = ? 
                    AND TABLE_TYPE = 'VIEW'";
                    
                    $viewStmt = $pdo->prepare($viewSql);
                    $viewStmt->execute([$database['name']]);
                    $views = $viewStmt->fetchAll(\PDO::FETCH_ASSOC);
                    
                    foreach ($views as $view) {
                        $dbNode['children'][] = [
                            'id' => 'view_' . $database['name'] . '_' . $view['name'],
                            'text' => $view['name'],
                            'type' => 'view',
                            'icon' => 'fa fa-eye',
                            'details' => [
                                'created' => $view['created_at'],
                                'updated' => $view['updated_at']
                            ]
                        ];
                    }
                }
                
                $tree[] = $dbNode;
            }
            
            return [
                'status' => 'success',
                'tree' => $tree
            ];
            
        } catch (\Exception $e) {
            error_log("Error dalam getDatabaseTree: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Method untuk mendapatkan data tabel dengan paginasi
     * @param string $tableName Nama tabel
     * @param int $page Halaman yang diminta
     * @param int $limit Jumlah baris per halaman
     * @return array Data tabel dengan paginasi
     */
    public function getTableData(string $tableName, int $page = 1, int $limit = 10): array {
        try {
            if (empty($this->activeDatabase)) {
                throw new \RuntimeException("Database belum dipilih");
            }

            // Gunakan koneksi yang sudah tersimpan
            if (!$this->pdo) {
                $db = new NgoreiDb();
                $this->pdo = $db->connPDO($this->activeDatabase);
            }

            // Optimasi: Gunakan satu query untuk mendapatkan total dan data
            $sql = "SELECT 
                    SQL_CALC_FOUND_ROWS * 
                    FROM `{$tableName}` 
                    LIMIT :offset, :limit";
            
            $offset = ($page - 1) * $limit;
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
            
            // Mulai timing
            $startTime = microtime(true);
            
            // Eksekusi query
            $stmt->execute();
            $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            // Dapatkan total rows
            $totalRows = $this->pdo->query("SELECT FOUND_ROWS()")->fetchColumn();
            
            // Hitung waktu eksekusi
            $executionTime = (microtime(true) - $startTime) * 1000; // dalam milliseconds
            
            error_log("Query executed in {$executionTime}ms for {$this->activeDatabase}.{$tableName}");

            // Optimasi: Batasi kolom yang besar
            $processedData = [];
            foreach ($data as $row) {
                $processedRow = [];
                foreach ($row as $key => $value) {
                    // Truncate text yang terlalu panjang
                    if (is_string($value) && strlen($value) > 1000) {
                        $processedRow[$key] = substr($value, 0, 1000) . '...';
                    } else {
                        $processedRow[$key] = $value;
                    }
                }
                $processedData[] = $processedRow;
            }

            return [
                'status' => 'success',
                'data' => $processedData,
                'total' => (int)$totalRows,
                'page' => $page,
                'limit' => $limit,
                'database' => $this->activeDatabase,
                'table' => $tableName,
                'execution_time' => round($executionTime, 2),
                'memory_usage' => $this->formatMemoryUsage(memory_get_peak_usage())
            ];

        } catch (\Exception $e) {
            error_log("Error in getTableData: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
                'database' => $this->activeDatabase,
                'table' => $tableName
            ];
        }
    }

    /**
     * Helper untuk format memory usage
     */
    private function formatMemoryUsage($bytes): string {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, 2) . ' ' . $units[$pow];
    }

    /**
     * Method untuk set database aktif
     */
    public function setDatabase(string $database): void {
        try {
            error_log("Attempting to set database to: " . $database);
            
            $db = new NgoreiDb();
            $this->pdo = $db->connPDO($database);
            $this->activeDatabase = $database;
            
            // Verifikasi database exists
            $result = $this->pdo->query("SELECT DATABASE() as db");
            $currentDb = $result->fetch(\PDO::FETCH_ASSOC)['db'];
            
            if ($currentDb !== $database) {
                throw new \RuntimeException("Gagal mengubah ke database: {$database}");
            }
            
            error_log("Successfully set database to: " . $database);
        } catch (\Exception $e) {
            error_log("Error setting database: " . $e->getMessage());
            throw new \RuntimeException("Gagal mengatur database: " . $e->getMessage());
        }
    }

    // Tambahkan method ini di class Ngorei
    public function getPdo() {
        if (!$this->pdo) {
            $db = new NgoreiDb();
            $this->pdo = $db->connPDO();
        }
        return $this->pdo;
    }

    /**
     * Method untuk mendapatkan struktur tabel
     * @param string $tableName Nama tabel
     * @return array Struktur tabel
     */
    public function getTableStructure(string $tableName): array {
        try {
            if (empty($this->activeDatabase)) {
                throw new \RuntimeException("Database belum dipilih");
            }

            $pdo = $this->getPdo();
            
            // Dapatkan informasi kolom
            $columnSql = "SELECT 
                COLUMN_NAME as Field,
                COLUMN_TYPE as Type,
                IS_NULLABLE as `Null`,
                COLUMN_KEY as `Key`,
                COLUMN_DEFAULT as `Default`,
                EXTRA as Extra,
                COLUMN_COMMENT as Comment
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION";
            
            $columnStmt = $pdo->prepare($columnSql);
            $columnStmt->execute([$this->activeDatabase, $tableName]);
            $columns = $columnStmt->fetchAll(\PDO::FETCH_ASSOC);

            // Dapatkan informasi index
            $indexSql = "SHOW INDEX FROM `{$tableName}`";
            $indexStmt = $pdo->query($indexSql);
            $indexes = $indexStmt->fetchAll(\PDO::FETCH_ASSOC);

            // Dapatkan informasi tabel
            $tableSql = "SELECT 
                ENGINE,
                TABLE_ROWS as Rows,
                AVG_ROW_LENGTH as AvgRowLength,
                DATA_LENGTH as DataLength,
                INDEX_LENGTH as IndexLength,
                AUTO_INCREMENT,
                TABLE_COLLATION as Collation,
                TABLE_COMMENT as Comment,
                CREATE_TIME as Created,
                UPDATE_TIME as Updated
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = ?";
            
            $tableStmt = $pdo->prepare($tableSql);
            $tableStmt->execute([$this->activeDatabase, $tableName]);
            $tableInfo = $tableStmt->fetch(\PDO::FETCH_ASSOC);

            // Format ukuran data
            $tableInfo['DataLength'] = $this->formatSize($tableInfo['DataLength']);
            $tableInfo['IndexLength'] = $this->formatSize($tableInfo['IndexLength']);
            
            // Susun informasi index berdasarkan nama index
            $indexInfo = [];
            foreach ($indexes as $index) {
                $indexName = $index['Key_name'];
                if (!isset($indexInfo[$indexName])) {
                    $indexInfo[$indexName] = [
                        'name' => $indexName,
                        'type' => $indexName === 'PRIMARY' ? 'PRIMARY KEY' : ($index['Non_unique'] ? 'INDEX' : 'UNIQUE'),
                        'columns' => []
                    ];
                }
                $indexInfo[$indexName]['columns'][] = [
                    'name' => $index['Column_name'],
                    'sub_part' => $index['Sub_part'],
                    'cardinality' => $index['Cardinality']
                ];
            }

            return [
                'status' => 'success',
                'table' => [
                    'name' => $tableName,
                    'database' => $this->activeDatabase,
                    'info' => $tableInfo
                ],
                'columns' => $columns,
                'indexes' => array_values($indexInfo)
            ];

        } catch (\Exception $e) {
            error_log("Error in getTableStructure: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
                'database' => $this->activeDatabase,
                'table' => $tableName
            ];
        }
    }
}

?>

 