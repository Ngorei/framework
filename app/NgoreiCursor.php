<?php
namespace app;
use app\tatiye;
use app\NgoreiDb;
use app\Cache;
class NgoreiCursor {
    private NgoreiDb $db;
    private \mysqli $mysqli;
    private Cache $cache;
    public function __construct() {
        try {
            $this->db = new NgoreiDb();
            $this->mysqli = $this->db->connMysqli();
            if (!$this->mysqli) {
                error_log('Koneksi database gagal dibuat');
                throw new \RuntimeException('Koneksi database gagal dibuat');
            }
            $this->mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 10);
            if (!$this->mysqli->ping()) {
                error_log('Koneksi database terputus');
                throw new \RuntimeException('Koneksi database terputus');
            }
            $this->mysqli->set_charset('utf8mb4');
            $this->cache = new Cache();
        } catch (\Exception $e) {
            error_log('Error koneksi database: ' . $e->getMessage());
            throw new \RuntimeException('Gagal menginisialisasi QueueView: ' . $e->getMessage());
        }
    }
    
    public function fetchLargeData(string $table, array $params = []): array {
        try {
            // Monitoring koneksi
            error_log('Status koneksi: ' . ($this->mysqli->ping() ? 'Connected' : 'Disconnected'));
            
            $table = $this->mysqli->real_escape_string($table);
            
            $page = (int)($params['page'] ?? 1);
            $limit = (int)($params['limit'] ?? 100);
            $offset = ($page - 1) * $limit;
            
            if (!$this->mysqli->ping()) {
                error_log('Mencoba reconnect ke database...');
                $this->mysqli = $this->db->connMysqli();
                if (!$this->mysqli->ping()) {
                    throw new \RuntimeException('Koneksi database terputus');
                }
                error_log('Reconnect berhasil');
            }
            
            // Start monitoring waktu query
            $queryStart = microtime(true);
            
            $cacheKey = "table_{$table}_page_{$page}_limit_{$limit}";
            $cachedResult = $this->cache->get($cacheKey);

            if ($cachedResult !== null) {
                return array_merge($cachedResult, ['cache_hit' => true]);
            }
            
            $whereConditions = [];
            $bindParams = [];
            $types = '';
            
            if (!empty($params['filters'])) {
                foreach ($params['filters'] as $field => $value) {
                    $whereConditions[] = "`$field` = ?";
                    $bindParams[] = $value;
                    $types .= $this->getParamType($value);
                }
            }
            
            $whereClause = !empty($whereConditions) 
                ? 'WHERE ' . implode(' AND ', $whereConditions)
                : 'WHERE 1=1';
            
            $query = "SELECT SQL_CALC_FOUND_ROWS 
                     a.* FROM `{$table}` a 
                     USE INDEX (idx_filters)
                     $whereClause 
                     ORDER BY id DESC
                     LIMIT ?, ?";
                     
            $stmt = $this->mysqli->prepare($query);
            if (!$stmt) {
                throw new \RuntimeException('Gagal mempersiapkan query: ' . $this->mysqli->error);
            }
            
            $bindParams = array_merge($bindParams, [$offset, $limit]);
            $types .= 'ii';
            $stmt->bind_param($types, ...$bindParams);
            
            // Monitor eksekusi query
            $executeStart = microtime(true);
            if (!$stmt->execute()) {
                throw new \RuntimeException('Gagal menjalankan query: ' . $stmt->error);
            }
            $executeTime = microtime(true) - $executeStart;
            error_log("Waktu eksekusi query: {$executeTime} detik");
            
            // Monitor fetch data
            $fetchStart = microtime(true);
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $fetchTime = microtime(true) - $fetchStart;
            error_log("Waktu fetch data: {$fetchTime} detik");
            
            $totalRows = $this->mysqli->query('SELECT FOUND_ROWS()')->fetch_row()[0];
            
            // Total waktu query
            $totalQueryTime = microtime(true) - $queryStart;
            error_log("Total waktu proses query: {$totalQueryTime} detik");
            
            // Monitor penggunaan memory
            $memoryUsage = memory_get_usage(true) / 1024 / 1024; // dalam MB
            error_log("Penggunaan memory: {$memoryUsage} MB");
            
            $finalResult = [
                'payload' => $data,
                'total' => $totalRows,
                'page' => $page,
                'limit' => $limit,
                'cache_hit' => false,
                'performance' => [
                    'query_time' => $totalQueryTime,
                    'execute_time' => $executeTime,
                    'fetch_time' => $fetchTime,
                    'memory_usage' => $memoryUsage,
                    'rows_returned' => count($data)
                ]
            ];
            
            $this->cache->set($cacheKey, $finalResult, 3600); // cache selama 1 jam
            
            return $finalResult;
        } catch (\Exception $e) {
            error_log('Error pada fetchLargeData: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            throw new \RuntimeException('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    private function getParamType($value): string {
        if (is_int($value)) return 'i';
        if (is_double($value)) return 'd';
        if (is_string($value)) return 's';
        return 'b';
    }

    private function processBatch(array $data, int $batchSize = 1000): array {
        $result = [];
        foreach (array_chunk($data, $batchSize) as $batch) {
            // Proses per batch
            $result = array_merge($result, $batch);
        }
        return $result;
    }

    public function setCacheWithCompression($key, $data, $ttl = 3600) {
        $compressed = gzcompress(serialize($data));
        $this->cache->set($key, $compressed, $ttl);
    }

    public function getCacheWithCompression($key) {
        $compressed = $this->cache->get($key);
        if ($compressed === null) return null;
        return unserialize(gzuncompress($compressed));
    }

    public function fetchLargeDataCursor(string $table, array $params = []): array {
        try {
            // Escape table name untuk keamanan
            $table = $this->mysqli->real_escape_string($table);
            
            $limit = (int)($params['limit'] ?? 1000);
            $lastId = (int)($params['last_id'] ?? 0);
            
            $whereConditions = [];
            $bindParams = [];
            $types = '';
            
            // Base where clause dengan cursor
            $whereConditions[] = "id > ?";
            $bindParams[] = $lastId;
            $types .= 'i';
            
            if (!empty($params['filters'])) {
                foreach ($params['filters'] as $field => $value) {
                    $field = $this->mysqli->real_escape_string($field);
                    $whereConditions[] = "`$field` = ?";
                    $bindParams[] = $value;
                    $types .= $this->getParamType($value);
                }
            }
            
            $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
            
            // Tambahkan penanganan kolom yang dipilih
            $selectedColumns = !empty($params['select']) ? $params['select'] : ['*'];
            
            // Validasi dan escape kolom yang dipilih
            if ($selectedColumns !== ['*']) {
                $selectedColumns = array_map(function($col) {
                    return '`' . $this->mysqli->real_escape_string($col) . '`';
                }, $selectedColumns);
            }
            
            $columnsStr = $selectedColumns === ['*'] ? '*' : implode(', ', $selectedColumns);
            
            // Ubah query untuk menggunakan kolom yang dipilih
            $query = "SELECT {$columnsStr} FROM `{$table}` a 
                     $whereClause 
                     ORDER BY a.id ASC
                     LIMIT ?";
            
            $bindParams[] = $limit;
            $types .= 'i';
            
            $stmt = $this->mysqli->prepare($query);
            if ($stmt === false) {
                throw new \RuntimeException('Prepare statement gagal: ' . $this->mysqli->error);
            }
            
            if (!$stmt->bind_param($types, ...$bindParams)) {
                throw new \RuntimeException('Bind parameter gagal: ' . $stmt->error);
            }
            
            if (!$stmt->execute()) {
                throw new \RuntimeException('Execute statement gagal: ' . $stmt->error);
            }
            
            $result = $stmt->get_result();
            if ($result === false) {
                throw new \RuntimeException('Get result gagal: ' . $stmt->error);
            }
            
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            
            // Simpan last_id untuk pagination selanjutnya
            $lastId = !empty($data) ? end($data)['id'] : $lastId;
            
            return [
                'payload' => $data,
                'next_cursor' => $lastId,
                'has_more' => count($data) === $limit
            ];
            
        } catch (\Exception $e) {
            error_log('Error pada fetchLargeDataCursor: ' . $e->getMessage());
            throw new \RuntimeException('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    // Metode untuk memproses data dalam chunks
    public function processMillionRows(string $table, callable $callback): void {
        try {
            $lastId = 0;
            $batchSize = 10000; // Proses 10rb data per batch
            
            do {
                $result = $this->fetchLargeDataCursor($table, [
                    'last_id' => $lastId,
                    'limit' => $batchSize
                ]);
                
                // Proses data dalam memory-efficient way
                foreach ($result['payload'] as $row) {
                    $callback($row);
                }
                
                $lastId = $result['next_cursor'];
                
                // Bersihkan memory setelah setiap batch
                gc_collect_cycles();
                
            } while ($result['has_more']);
        } catch (\Exception $e) {
            error_log('Error pada processMillionRows: ' . $e->getMessage());
            throw new \RuntimeException('Gagal memproses data: ' . $e->getMessage());
        }
    }

    // Metode untuk mengoptimalkan cache untuk data besar
    private function setPartitionedCache(string $key, array $data, int $partitionSize = 1000): void {
        $chunks = array_chunk($data, $partitionSize);
        foreach ($chunks as $index => $chunk) {
            $partitionKey = "{$key}_part_{$index}";
            $this->setCacheWithCompression($partitionKey, $chunk);
        }
        
        // Simpan metadata
        $this->cache->set("{$key}_meta", [
            'total_parts' => count($chunks),
            'updated_at' => time()
        ], 3600);
    }

    public function validateTable(string $table): bool {
        try {
            // Escape table name
            $table = $this->mysqli->real_escape_string($table);
            
            // Cek apakah tabel ada
            $query = "SHOW TABLES LIKE ?";
            $stmt = $this->mysqli->prepare($query);
            
            if ($stmt === false) {
                throw new \RuntimeException('Prepare statement gagal: ' . $this->mysqli->error);
            }
            
            if (!$stmt->bind_param('s', $table)) {
                throw new \RuntimeException('Bind parameter gagal: ' . $stmt->error);
            }
            
            if (!$stmt->execute()) {
                throw new \RuntimeException('Execute statement gagal: ' . $stmt->error);
            }
            
            $result = $stmt->get_result();
            
            if ($result === false) {
                throw new \RuntimeException('Get result gagal: ' . $stmt->error);
            }
            
            // Jika tabel ditemukan, return true
            return $result->num_rows > 0;
            
        } catch (\Exception $e) {
            error_log('Error pada validateTable: ' . $e->getMessage());
            throw new \RuntimeException('Gagal memvalidasi tabel: ' . $e->getMessage());
        }
    }

    public function getPartitionedCache(string $key): ?array {
        try {
            // Ambil metadata
            $meta = $this->cache->get("{$key}_meta");
            if (!$meta) {
                return null;
            }
            
            $result = [];
            // Loop setiap partisi dan gabungkan datanya
            for ($i = 0; $i < $meta['total_parts']; $i++) {
                $partitionKey = "{$key}_part_{$i}";
                $partitionData = $this->getCacheWithCompression($partitionKey);
                if ($partitionData) {
                    $result = array_merge($result, $partitionData);
                }
            }
            
            return $result;
        } catch (\Exception $e) {
            error_log('Error mengambil partitioned cache: ' . $e->getMessage());
            return null;
        }
    }

    public function getTableColumns(string $table): array {
        try {
            $table = $this->mysqli->real_escape_string($table);
            
            $query = "SHOW COLUMNS FROM `{$table}`";
            $result = $this->mysqli->query($query);
            
            if (!$result) {
                throw new \RuntimeException('Gagal mengambil struktur tabel');
            }
            
            $columns = [];
            while ($row = $result->fetch_assoc()) {
                $columns[] = $row['Field'];
            }
            
            return $columns;
        } catch (\Exception $e) {
            error_log('Error pada getTableColumns: ' . $e->getMessage());
            throw new \RuntimeException('Gagal mengambil struktur tabel: ' . $e->getMessage());
        }
    }
}
