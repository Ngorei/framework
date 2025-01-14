<?php
namespace app;
use app\NgoreiDb;

class NgoreiBuilder {
    private \mysqli $mysqli;
    private string $table;
    private array $selects = ['*'];
    private array $wheres = [];
    private array $bindings = [];
    private string $orderBy = '';
    private string $orderDirection = 'ASC';
    private ?int $limit = null;
    private ?int $offset = null;
    private $joins = [];
    private $groupBy = [];
    private $having = [];
    private array $sets = [];
    private array $files = [];
    private string $uploadsPath = 'uploads';
    private int $maxFileSize = 5242880;
    private array $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    private array $imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    private array $documentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    private array $imageSizes = [
        '100x100' => ['width' => 100, 'height' => 100],
        '250x250' => ['width' => 250, 'height' => 250], 
        '600x600' => ['width' => 600, 'height' => 600]
    ];
    private string $baseServerPath;
    private ?int $lastInsertId = null;
    private static array $queryCache = [];
    private static array $preparedStatements = [];
    private int $cacheExpiry = 300; // 5 menit
    private bool $useCache = true;
    private int $batchSize = 1000;
    private int $currentPage = 1;
    private int $perPage = 10;
    private int $totalRows = 0;
    private array $validationErrors = [];

    // Perbaikan pada constructor
    public function __construct(string $table) {
        try {
            $db = new NgoreiDb();
            $this->mysqli = $db->connMysqli();
            
            if (!$this->mysqli) {
                throw new \RuntimeException('Koneksi database gagal: Koneksi mysqli kosong');
            }

            // Tambahkan validasi tabel
            $result = $this->mysqli->query("SHOW TABLES LIKE '{$table}'");
            if (!$result || $result->num_rows === 0) {
                throw new \RuntimeException("Tabel '{$table}' tidak ditemukan dalam database");
            }
            
            $this->table = $table;
            $this->baseServerPath = rtrim(dirname(dirname(__DIR__)), '/');
            
            // Cek apakah mysqli valid sebelum set options
            if ($this->mysqli instanceof \mysqli) {
                // Mengaktifkan persistent connections
                $this->mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 10);
                
                // Mengoptimalkan buffer
                if (defined('MYSQLI_OPT_INT_AND_FLOAT_NATIVE')) {
                    $this->mysqli->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, 1);
                }
            }
            
            $uploadsDir = $this->baseServerPath . '/' . $this->uploadsPath;
            if (!file_exists($uploadsDir)) {
                $this->createDirectory($uploadsDir);
            }
            
        } catch (\Exception $e) {
            error_log('Error pada constructor NgoreiBuilder: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            throw new \RuntimeException('Inisialisasi database gagal: ' . $e->getMessage());
        }
    }

    /**
     * Mengatur penggunaan cache
     */
    public function useCache(bool $use = true): self {
        $this->useCache = $use;
        return $this;
    }

    /**
     * Mengatur waktu kedaluwarsa cache
     */
    public function setCacheExpiry(int $seconds): self {
        $this->cacheExpiry = $seconds;
        return $this;
    }

    /**
     * Generate cache key berdasarkan query
     */
    private function generateCacheKey(): string {
        return md5(serialize([
            $this->table,
            $this->selects,
            $this->wheres,
            $this->bindings,
            $this->orderBy,
            $this->orderDirection,
            $this->limit,
            $this->offset,
            $this->joins,
            $this->groupBy,
            $this->having
        ]));
    }

    /**
     * Mengambil data dari cache
     */
    private function getFromCache(string $key): ?array {
        if (isset(self::$queryCache[$key])) {
            $cached = self::$queryCache[$key];
            if ($cached['expires'] > time()) {
                return $cached['data'];
            }
            unset(self::$queryCache[$key]);
        }
        return null;
    }

    /**
     * Menyimpan data ke cache
     */
    private function setCache(string $key, array $data): void {
        self::$queryCache[$key] = [
            'data' => $data,
            'expires' => time() + $this->cacheExpiry
        ];
    }

    /**
     * Optimasi execute dengan prepared statement caching
     */
    public function execute(bool $orderByIdDesc = false): array {
        try {
            // Validasi koneksi mysqli
            if (!$this->mysqli || !($this->mysqli instanceof \mysqli)) {
                throw new \RuntimeException('Koneksi database tidak valid');
            }

            if ($orderByIdDesc) {
                $this->orderBy = 'id';
                $this->orderDirection = 'DESC';
            }

            // Cek cache jika diaktifkan
            if ($this->useCache) {
                $cacheKey = $this->generateCacheKey();
                $cachedResult = $this->getFromCache($cacheKey);
                if ($cachedResult !== null) {
                    return $cachedResult;
                }
            }

            $query = $this->getQuery();
            
            // Validasi query
            if (empty($query)) {
                throw new \RuntimeException('Query tidak boleh kosong');
            }

            // Prepare statement dengan penanganan error
            $stmt = $this->mysqli->prepare($query);
            if ($stmt === false) {
                throw new \RuntimeException('Prepare statement gagal: ' . $this->mysqli->error . ' (Query: ' . $query . ')');
            }

            // Binding parameter jika ada
            if (!empty($this->bindings)) {
                $types = '';
                $params = [];
                
                foreach ($this->bindings as $binding) {
                    if (is_int($binding)) {
                        $types .= 'i';
                    } elseif (is_float($binding)) {
                        $types .= 'd';
                    } elseif (is_string($binding)) {
                        $types .= 's';
                    } else {
                        $types .= 'b';
                    }
                    $params[] = $binding;
                }
                
                if (!$stmt->bind_param($types, ...$params)) {
                    throw new \RuntimeException('Bind parameter gagal: ' . $stmt->error);
                }
            }

            // Execute dengan penanganan error
            if (!$stmt->execute()) {
                throw new \RuntimeException('Execute statement gagal: ' . $stmt->error);
            }

            // Get result dengan penanganan error
            $result = $stmt->get_result();
            if ($result === false) {
                throw new \RuntimeException('Get result gagal: ' . $stmt->error);
            }

            $data = $result->fetch_all(MYSQLI_ASSOC);

            // Simpan ke cache jika diaktifkan
            if ($this->useCache) {
                $this->setCache($cacheKey, $data);
            }

            return $data;

        } catch (\Exception $e) {
            error_log('Error pada execute: ' . $e->getMessage());
            error_log('Query: ' . ($query ?? 'No query'));
            error_log('Stack trace: ' . $e->getTraceAsString());
            throw new \RuntimeException('Gagal mengeksekusi query: ' . $e->getMessage());
        }
    }

    /**
     * Optimasi insertBatch dengan batching
     */
    public function insertBatch(array $rows): int {
        if (empty($rows)) {
            return 0;
        }

        try {
            $totalInserted = 0;
            $chunks = array_chunk($rows, $this->batchSize);

            $this->mysqli->begin_transaction();

            foreach ($chunks as $chunk) {
                $columns = array_keys($chunk[0]);
                $placeholders = '(' . str_repeat('?,', count($columns) - 1) . '?)';
                $allPlaceholders = str_repeat($placeholders . ',', count($chunk) - 1) . $placeholders;
                
                $query = "INSERT INTO `{$this->table}` 
                         (`" . implode('`,`', $columns) . "`) 
                         VALUES " . $allPlaceholders;
                
                $stmt = $this->mysqli->prepare($query);
                
                $values = [];
                $types = '';
                foreach ($chunk as $row) {
                    foreach ($row as $value) {
                        $values[] = $value;
                        if (is_int($value)) $types .= 'i';
                        elseif (is_float($value)) $types .= 'd';
                        elseif (is_string($value)) $types .= 's';
                        else $types .= 'b';
                    }
                }
                
                $stmt->bind_param($types, ...$values);
                $stmt->execute();
                $totalInserted += $stmt->affected_rows;
            }

            $this->mysqli->commit();
            return $totalInserted;

        } catch (\Exception $e) {
            $this->mysqli->rollback();
            error_log('Error pada insertBatch: ' . $e->getMessage());
            throw new \RuntimeException('Gagal batch insert: ' . $e->getMessage());
        }
    }

    /**
     * Optimasi update dengan prepared statement caching
     */
    public function update(array $data): int {
        try {
            // Validasi koneksi
            if (!$this->mysqli) {
                throw new \RuntimeException('Koneksi database tidak valid');
            }

            // Validasi data
            if (empty($data)) {
                throw new \RuntimeException('Data update tidak boleh kosong');
            }

            // Validasi WHERE clause
            if (empty($this->wheres)) {
                throw new \RuntimeException('Update harus menggunakan WHERE clause');
            }

            // Cek apakah data yang akan diupdate ada
            $checkQuery = "SELECT EXISTS (SELECT 1 FROM `{$this->table}` WHERE " . implode(' AND ', $this->wheres) . ") as exist";
            $checkStmt = $this->mysqli->prepare($checkQuery);
            
            if (!empty($this->bindings)) {
                $types = '';
                foreach ($this->bindings as $value) {
                    if (is_int($value)) $types .= 'i';
                    elseif (is_float($value)) $types .= 'd';
                    elseif (is_string($value)) $types .= 's';
                    else $types .= 'b';
                }
                $checkStmt->bind_param($types, ...$this->bindings);
            }
            
            $checkStmt->execute();
            $result = $checkStmt->get_result()->fetch_assoc();
            
            if (!$result['exist']) {
                throw new \RuntimeException('Data yang akan diupdate tidak ditemukan');
            }

            $sets = [];
            $values = [];
            
            foreach ($data as $column => $value) {
                // Validasi nama kolom
                $result = $this->mysqli->query("SHOW COLUMNS FROM `{$this->table}` LIKE '{$column}'");
                if (!$result || $result->num_rows === 0) {
                    throw new \RuntimeException("Kolom '{$column}' tidak ditemukan dalam tabel '{$this->table}'");
                }

                $sets[] = "`{$column}` = ?";
                $values[] = $value;
            }
            
            $values = array_merge($values, $this->bindings);
            
            $query = "UPDATE `{$this->table}` SET " . implode(', ', $sets);
            $query .= " WHERE " . implode(' AND ', $this->wheres);
            
            $stmt = $this->mysqli->prepare($query);
            if (!$stmt) {
                throw new \RuntimeException('Gagal mempersiapkan query: ' . $this->mysqli->error);
            }
            
            $types = '';
            foreach ($values as $value) {
                if (is_int($value)) $types .= 'i';
                elseif (is_float($value)) $types .= 'd';
                elseif (is_string($value)) $types .= 's';
                else $types .= 'b';
            }
            
            if (!$stmt->bind_param($types, ...$values)) {
                throw new \RuntimeException('Gagal binding parameter: ' . $stmt->error);
            }
            
            if (!$stmt->execute()) {
                throw new \RuntimeException('Gagal mengeksekusi query: ' . $stmt->error);
            }
            
            $affectedRows = $stmt->affected_rows;
            
            // Invalidate cache
            if ($this->useCache) {
                array_filter(self::$queryCache, function($key) {
                    return strpos($key, $this->table) === false;
                }, ARRAY_FILTER_USE_KEY);
            }

            $stmt->close();
            $checkStmt->close();
            
            return $affectedRows;
            
        } catch (\Exception $e) {
            error_log('Error pada update: ' . $e->getMessage());
            error_log('Query: ' . ($query ?? 'No query'));
            error_log('Stack trace: ' . $e->getTraceAsString());
            throw new \RuntimeException($e->getMessage());
        }
    }

    /**
     * Menentukan kolom yang akan diselect
     * 
     * @param array|string $columns Array berisi nama-nama kolom atau string kolom yang dipisahkan koma
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function select($columns): self {
        // Jika input adalah string, ubah menjadi array
        if (is_string($columns)) {
            $columns = array_map('trim', explode(',', $columns));
        }
        
        // Pastikan $columns adalah array
        if (!is_array($columns)) {
            throw new \InvalidArgumentException('Parameter select() harus berupa array atau string yang dipisahkan koma');
        }
        
        // Escape setiap kolom untuk mencegah SQL injection
        $this->selects = array_map(function($column) {
            // Jika kolom mengandung alias (contoh: "table.column AS alias")
            if (stripos($column, ' as ') !== false) {
                $parts = array_map('trim', explode(' as ', $column, 2));
                return $this->escapeColumnName($parts[0]) . ' AS ' . $this->mysqli->real_escape_string($parts[1]);
            }
            
            // Jika kolom mengandung fungsi (contoh: "COUNT(*)")
            if (strpos($column, '(') !== false) {
                return $column;
            }
            
            // Kolom biasa
            return $this->escapeColumnName($column);
        }, $columns);
        
        return $this;
    }

    /**
     * Helper method untuk escape nama kolom
     * Mendukung format table.column
     */
    private function escapeColumnName(string $column): string {
        // Jika kolom adalah * atau sudah di-escape
        if ($column === '*' || $column === '`*`') {
            return '*';
        }
        
        // Jika mengandung table.column
        if (strpos($column, '.') !== false) {
            $parts = array_map('trim', explode('.', $column));
            return '`' . $this->mysqli->real_escape_string($parts[0]) . '`.`' . 
                   $this->mysqli->real_escape_string($parts[1]) . '`';
        }
        
        // Kolom biasa
        return '`' . $this->mysqli->real_escape_string($column) . '`';
    }

    /**
     * Menambahkan kondisi WHERE ke query
     * 
     * @param string|array $condition Kondisi WHERE dalam bentuk string atau array [kolom => nilai]
     * @param mixed $bindings Parameter yang akan di-bind ke kondisi (opsional)
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function where($condition, $bindings = []): self {
        // Jika $condition adalah array
        if (is_array($condition)) {
            foreach ($condition as $column => $value) {
                $this->wheres[] = sprintf("`%s` = ?", $column);
                $this->bindings[] = $value;
            }
            return $this;
        }

        // Jika kondisi mengandung operator (contoh: 'row=1' atau 'id=1')
        if (is_string($condition) && strpos($condition, '=') !== false) {
            $this->wheres[] = $condition;
            return $this;
        }
        
        // Format standar where('column', value)
        if (is_string($condition)) {
            $this->wheres[] = sprintf("`%s` = ?", $condition);
            $this->bindings[] = $bindings;
        }
        
        return $this;
    }

    /**
     * Menambahkan kondisi OR WHERE ke query
     * @param string $condition Kondisi WHERE
     * @param array $bindings Parameter binding
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function orWhere(string $condition, array $bindings = []): self {
        if (!empty($this->wheres)) {
            $this->wheres[] = "OR " . $condition;
        } else {
            $this->wheres[] = $condition;
        }
        $this->bindings = array_merge($this->bindings, $bindings);
        return $this;
    }

    /**
     * Menambahkan kondisi BETWEEN ke query
     * @param string $column Nama kolom
     * @param mixed $start Nilai awal
     * @param mixed $end Nilai akhir
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function whereBetween(string $column, $start, $end): self {
        $this->wheres[] = sprintf("`%s` BETWEEN ? AND ?", $column);
        $this->bindings[] = $start;
        $this->bindings[] = $end;
        return $this;
    }

    /**
     * Menambahkan kondisi WHERE IN dengan subquery
     * @param string $column Nama kolom
     * @param callable $callback Fungsi untuk membangun subquery
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function whereIn(string $column, $values): self {
        // Jika $values adalah callable, gunakan implementasi subquery
        if (is_callable($values)) {
            // Buat instance baru untuk subquery
            $subquery = new self('');
            
            // Jalankan callback untuk membangun subquery
            $values($subquery);
            
            // Dapatkan query dari subquery
            $sql = $subquery->getQuery();
            
            // Tambahkan kondisi WHERE IN dengan subquery
            $this->wheres[] = sprintf("`%s` IN (%s)", $column, $sql);
            
            // Gabungkan bindings dari subquery
            $this->bindings = array_merge($this->bindings, $subquery->bindings);
        }
        // Jika $values adalah array, gunakan implementasi IN dengan array values
        else if (is_array($values)) {
            if (empty($values)) {
                // Jika array kosong, gunakan kondisi yang selalu false
                $this->wheres[] = "1 = 0";
            } else {
                // Buat placeholders untuk setiap value
                $placeholders = str_repeat('?,', count($values) - 1) . '?';
                
                // Tambahkan kondisi WHERE IN dengan placeholders
                $this->wheres[] = sprintf("`%s` IN (%s)", $column, $placeholders);
                
                // Tambahkan values ke bindings
                $this->bindings = array_merge($this->bindings, $values);
            }
        } else {
            throw new \InvalidArgumentException('Parameter kedua whereIn harus berupa array atau callable');
        }
        
        return $this;
    }

    /**
     * Menambahkan kondisi WHERE NOT IN dengan subquery atau array
     * @param string $column Nama kolom
     * @param mixed $values Array nilai atau callable untuk subquery
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function whereNotIn(string $column, $values): self {
        // Jika $values adalah callable, gunakan implementasi subquery
        if (is_callable($values)) {
            $subquery = new self('');
            $values($subquery);
            $sql = $subquery->getQuery();
            $this->wheres[] = sprintf("`%s` NOT IN (%s)", $column, $sql);
            $this->bindings = array_merge($this->bindings, $subquery->bindings);
        }
        // Jika $values adalah array, gunakan implementasi NOT IN dengan array values
        else if (is_array($values)) {
            if (empty($values)) {
                // Jika array kosong, gunakan kondisi yang selalu true
                $this->wheres[] = "1 = 1";
            } else {
                // Buat placeholders untuk setiap value
                $placeholders = str_repeat('?,', count($values) - 1) . '?';
                
                // Tambahkan kondisi WHERE NOT IN dengan placeholders
                $this->wheres[] = sprintf("`%s` NOT IN (%s)", $column, $placeholders);
                
                // Tambahkan values ke bindings
                $this->bindings = array_merge($this->bindings, $values);
            }
        } else {
            throw new \InvalidArgumentException('Parameter kedua whereNotIn harus berupa array atau callable');
        }
        
        return $this;
    }

    /**
     * Menambahkan kondisi IS NULL ke query
     * @param string $column Nama kolom
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function whereNull(string $column): self {
        $this->wheres[] = sprintf("`%s` IS NULL", $column);
        return $this;
    }

    /**
     * Menambahkan kondisi IS NOT NULL ke query
     * @param string $column Nama kolom
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function whereNotNull(string $column): self {
        $this->wheres[] = sprintf("`%s` IS NOT NULL", $column);
        return $this;
    }

    /**
     * Menentukan pengurutan hasil query
     * 
     * @param string $column Nama kolom untuk pengurutan
     * @param string $direction Arah pengurutan (ASC/DESC)
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function orderBy(string $column, string $direction = 'ASC'): self {
        $this->orderBy = $this->mysqli->real_escape_string($column);
        $this->orderDirection = in_array(strtoupper($direction), ['ASC', 'DESC']) ? strtoupper($direction) : 'ASC';
        return $this;
    }

    /**
     * Membatasi jumlah baris hasil query
     * 
     * @param int $limit Jumlah maksimum baris
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function limit(int $limit): self {
        $this->limit = $limit;
        return $this;
    }

    /**
     * Menentukan offset hasil query
     * 
     * @param int $offset Jumlah baris yang dilewati
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function offset(int $offset): self {
        $this->offset = max(0, $offset); // Pastikan offset tidak negatif
        return $this;
    }

    /**
     * Menambahkan JOIN ke query
     * 
     * @param string $table Nama tabel yang akan di-join
     * @param string $condition Kondisi join
     * @param string $type Tipe join (INNER/LEFT/RIGHT)
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function join(string $table, string $condition, string $type = 'INNER'): self {
        $this->joins[] = [
            'type' => $type,
            'table' => $table,
            'condition' => $condition
        ];
        return $this;
    }

    /**
     * Menambahkan LEFT JOIN ke query
     * 
     * @param string $table Nama tabel yang akan di-join
     * @param string $condition Kondisi join
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function leftJoin(string $table, string $condition): self {
        return $this->join($table, $condition, 'LEFT');
    }

    /**
     * Menambahkan RIGHT JOIN ke query
     * 
     * @param string $table Nama tabel yang akan di-join
     * @param string $condition Kondisi join
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function rightJoin(string $table, string $condition): self {
        return $this->join($table, $condition, 'RIGHT');
    }

    /**
     * Menambahkan GROUP BY ke query
     * 
     * @param string $columns Kolom-kolom untuk grouping (dipisahkan koma)
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function groupBy(string $columns): self {
        $this->groupBy = explode(',', $columns);
        return $this;
    }

    /**
     * Menambahkan kondisi HAVING ke query
     * 
     * @param string $condition Kondisi HAVING
     * @param array $params Parameter untuk kondisi
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function having(string $condition, array $params = []): self {
        $this->having = [
            'condition' => $condition,
            'params' => $params
        ];
        return $this;
    }

    /**
     * Menghasilkan string query SQL
     * 
     * @return string Query SQL lengkap
     */
    public function getQuery(): string {
        try {
            $query = "SELECT " . implode(', ', $this->selects) . " FROM `{$this->table}`";
            
            // Tambahkan JOIN setelah FROM dan sebelum WHERE
            if (!empty($this->joins)) {
                $query .= $this->buildJoins();
            }
            
            // Tambahkan WHERE jika ada
            if (!empty($this->wheres)) {
                $query .= " WHERE " . implode(' AND ', $this->wheres);
            }
            
            // Tambahkan GROUP BY jika ada
            if (!empty($this->groupBy)) {
                $query .= $this->buildGroupBy();
            }
            
            // Tambahkan HAVING jika ada
            if (!empty($this->having)) {
                $query .= $this->buildHaving();
            }
            
            // Tambahkan ORDER BY jika ada
            if ($this->orderBy) {
                $query .= " ORDER BY `{$this->orderBy}` {$this->orderDirection}";
            }
            
            // Tambahkan LIMIT dan OFFSET di akhir
            if ($this->limit !== null) {
                $query .= " LIMIT {$this->limit}";
                if ($this->offset !== null) {
                    $query .= " OFFSET {$this->offset}";
                }
            }
            
            return $query;
            
        } catch (\Exception $e) {
            error_log('Error pada getQuery: ' . $e->getMessage());
            throw new \RuntimeException('Gagal membuat query: ' . $e->getMessage());
        }
    }

    /**
     * Menyisipkan satu baris data ke database
     * 
     * @param array $data Data yang akan disisipkan (kolom => nilai)
     * @return self Instance QueryBuilder untuk method chaining
     * @throws \RuntimeException Jika insert gagal
     */
    public function insert(array $data): self {
        try {
            // Gabungkan data dari parameter dengan data file yang sudah diupload
            $data = array_merge($this->sets, $data);
            
            $columns = array_keys($data);
            $values = array_values($data);
            $placeholders = str_repeat('?,', count($data) - 1) . '?';
            
            $query = "INSERT INTO `{$this->table}` 
                     (`" . implode('`,`', $columns) . "`) 
                     VALUES ({$placeholders})";
            
            $stmt = $this->mysqli->prepare($query);
            
            if (!$stmt) {
                throw new \RuntimeException('Prepare statement gagal: ' . $this->mysqli->error);
            }
            
            $types = '';
            foreach ($values as $value) {
                if (is_int($value)) $types .= 'i';
                elseif (is_float($value)) $types .= 'd';
                elseif (is_string($value)) $types .= 's';
                else $types .= 'b';
            }
            
            $stmt->bind_param($types, ...$values);
            $stmt->execute();
            
            // Simpan last insert id
            $this->lastInsertId = $this->mysqli->insert_id;
            
            // Reset sets array setelah insert
            $this->sets = [];
            
            return $this;
            
        } catch (\Exception $e) {
            error_log('Error pada insert: ' . $e->getMessage());
            throw new \RuntimeException('Gagal insert data: ' . $e->getMessage());
        }
    }

    /**
     * Mendapatkan data yang baru saja diinsert
     * 
     * @return array|null Data yang baru diinsert atau null jika belum ada insert
     * @throws \RuntimeException jika query gagal
     */
    public function getInsertedData(): ?array {
        if ($this->lastInsertId === null) {
            return null;
        }

        try {
            // Reset kondisi where yang mungkin ada sebelumnya
            $this->wheres = [];
            $this->bindings = [];
            
            // Set kondisi where untuk ID yang baru diinsert
            $this->where('id = ?', [$this->lastInsertId]);
            
            // Eksekusi query
            $result = $this->execute();
            
            return !empty($result) ? $result[0] : null;
            
        } catch (\Exception $e) {
            error_log('Error pada getInsertedData: ' . $e->getMessage());
            throw new \RuntimeException('Gagal mendapatkan data yang diinsert: ' . $e->getMessage());
        }
    }

    /**
     * Mendapatkan ID dari hasil insert terakhir
     * 
     * @return int|null ID dari data yang baru diinsert atau null jika belum ada insert
     */
    public function idFile(): ?int {
        return $this->lastInsertId;
    }

    /**
     * Menghapus data dari tabel yang ditentukan
     */
    public function delete(): int {
        try {
            // Validasi koneksi
            if (!$this->mysqli) {
                throw new \RuntimeException('Koneksi database tidak valid');
            }

            // Validasi WHERE clause
            if (empty($this->wheres)) {
                throw new \RuntimeException('Delete harus menggunakan WHERE clause');
            }

            // Cek apakah data yang akan dihapus ada
            $checkQuery = "SELECT EXISTS (SELECT 1 FROM `{$this->table}` WHERE " . implode(' AND ', $this->wheres) . ") as exist";
            $checkStmt = $this->mysqli->prepare($checkQuery);
            
            if (!empty($this->bindings)) {
                $types = '';
                foreach ($this->bindings as $value) {
                    if (is_int($value)) $types .= 'i';
                    elseif (is_float($value)) $types .= 'd';
                    elseif (is_string($value)) $types .= 's';
                    else $types .= 'b';
                }
                $checkStmt->bind_param($types, ...$this->bindings);
            }
            
            $checkStmt->execute();
            $result = $checkStmt->get_result()->fetch_assoc();
            
            if (!$result['exist']) {
                throw new \RuntimeException('Data yang akan dihapus tidak ditemukan');
            }

            // Lanjutkan dengan proses delete
            $query = "DELETE FROM `{$this->table}`";
            $query .= " WHERE " . implode(' AND ', $this->wheres);
            
            $stmt = $this->mysqli->prepare($query);
            if (!$stmt) {
                throw new \RuntimeException('Gagal mempersiapkan query: ' . $this->mysqli->error);
            }

            // Binding parameter jika ada
            if (!empty($this->bindings)) {
                if (!$stmt->bind_param($types, ...$this->bindings)) {
                    throw new \RuntimeException('Gagal binding parameter: ' . $stmt->error);
                }
            }

            // Execute query
            if (!$stmt->execute()) {
                throw new \RuntimeException('Gagal mengeksekusi query: ' . $stmt->error);
            }

            $affectedRows = $stmt->affected_rows;
            
            // Invalidate cache
            if ($this->useCache) {
                array_filter(self::$queryCache, function($key) {
                    return strpos($key, $this->table) === false;
                }, ARRAY_FILTER_USE_KEY);
            }

            $stmt->close();
            $checkStmt->close();
            
            return $affectedRows;

        } catch (\Exception $e) {
            error_log('Error pada delete: ' . $e->getMessage());
            error_log('Query: ' . ($query ?? 'No query'));
            error_log('Stack trace: ' . $e->getTraceAsString());
            throw new \RuntimeException($e->getMessage());
        }
    }

    /**
     * Mengatur path untuk upload file dengan validasi keamanan
     * 
     * @param string $path Path direktori untuk menyimpan file
     * @return self Instance QueryBuilder untuk method chaining
     * @throws \RuntimeException Jika path tidak valid
     */
    public function setUploadPath(string $path): self {
        // Normalisasi path dengan mengubah backslash ke forward slash
        $path = str_replace('\\', '/', $path);
        
        // Hapus trailing slash
        $path = rtrim($path, '/');
        
        // Validasi path dasar
        if (empty($path)) {
            throw new \RuntimeException('Path upload tidak boleh kosong');
        }
        
        // Jika path adalah absolute path (dimulai dengan C:/ atau /)
        if (preg_match('~^([A-Za-z]:)?/~', $path)) {
            $this->uploadsPath = $path;
        } else {
            // Jika path relatif, gabungkan dengan baseServerPath
            $this->uploadsPath = $this->baseServerPath . '/' . $path;
        }
        
        // Pastikan direktori ada atau bisa dibuat
        if (!is_dir($this->uploadsPath)) {
            if (!mkdir($this->uploadsPath, 0777, true)) {
                throw new \RuntimeException("Tidak dapat membuat direktori {$this->uploadsPath}");
            }
            chmod($this->uploadsPath, 0755);
        }
        
        // Pastikan direktori bisa ditulis
        if (!is_writable($this->uploadsPath)) {
            throw new \RuntimeException('Direktori upload tidak memiliki permission write');
        }
        
        return $this;
    }

    /**
     * Mengatur ukuran maksimum file dalam MB
     * 
     * @param int $sizeMB Ukuran maksimum dalam MB
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function size(int $sizeMB): self {
        $this->maxFileSize = $sizeMB * 1024 * 1024;
        return $this;
    }

    /**
     * Mengatur tipe file yang diizinkan
     * 
     * @param array $types Array dari MIME types yang diizinkan
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function type(array $types): self {
        $this->allowedTypes = $types;
        return $this;
    }
    
    /**
     * Memformat ukuran file ke dalam format yang mudah dibaca (B, KB, MB)
     * 
     * @param int $bytes Ukuran file dalam bytes
     * @return string Ukuran file yang sudah diformat
     */
    private function formatFileSize(int $bytes): string {
        return $bytes < 1024 ? $bytes . ' B' : 
               ($bytes < 1048576 ? round($bytes/1024, 2) . ' KB' : 
               round($bytes/1048576, 2) . ' MB');
    }

    /**
     * Mendapatkan tipe file yang sebenarnya
     * 
     * @param string $path Path ke file
     * @return string Tipe file
     */
    private function getFileType(string $path): string {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $type = finfo_file($finfo, $path);
        finfo_close($finfo);
        
        // Perbaikan pengecekan tipe file berdasarkan ekstensi
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        
        // Mapping ekstensi ke MIME type
        $mimeTypes = [
            'pdf'  => 'application/pdf',
            'doc'  => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls'  => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt'  => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        
        // Kembalikan MIME type yang sesuai jika ekstensi ada dalam mapping
        if (isset($mimeTypes[$extension])) {
            return $mimeTypes[$extension];
        }
        
        return $type;
    }

    /**
     * Membuat thumbnail dari gambar yang diupload
     * 
     * @param string $sourcePath Path file sumber
     * @param string $targetPath Path file tujuan
     * @param array $dimensions Dimensi yang diinginkan
     * @return bool True jika berhasil, false jika gagal
     */
    private function createThumbnail(string $sourcePath, string $targetPath, array $dimensions): bool {
        try {
            // Deteksi tipe gambar
            $imageType = exif_imagetype($sourcePath);
            
            // Buat sumber gambar berdasarkan tipe
            switch ($imageType) {
                case IMAGETYPE_JPEG:
                    $sourceImage = imagecreatefromjpeg($sourcePath);
                    break;
                case IMAGETYPE_PNG:
                    $sourceImage = imagecreatefrompng($sourcePath);
                    break;
                case IMAGETYPE_GIF:
                    $sourceImage = imagecreatefromgif($sourcePath);
                    break;
                default:
                    throw new \RuntimeException('Format gambar tidak didukung');
            }

            if (!$sourceImage) {
                throw new \RuntimeException('Gagal membuat sumber gambar');
            }

            // Dapatkan dimensi sumber
            $sourceWidth = imagesx($sourceImage);
            $sourceHeight = imagesy($sourceImage);

            // Hitung dimensi thumbnail dengan mempertahankan aspek ratio
            $ratio = min($dimensions['width'] / $sourceWidth, $dimensions['height'] / $sourceHeight);
            $targetWidth = round($sourceWidth * $ratio);
            $targetHeight = round($sourceHeight * $ratio);

            // Buat gambar thumbnail
            $thumbnailImage = imagecreatetruecolor($targetWidth, $targetHeight);

            // Handling transparansi untuk PNG
            if ($imageType === IMAGETYPE_PNG) {
                imagealphablending($thumbnailImage, false);
                imagesavealpha($thumbnailImage, true);
                $transparent = imagecolorallocatealpha($thumbnailImage, 255, 255, 255, 127);
                imagefilledrectangle($thumbnailImage, 0, 0, $targetWidth, $targetHeight, $transparent);
            }

            // Resize gambar
            imagecopyresampled(
                $thumbnailImage, $sourceImage,
                0, 0, 0, 0,
                $targetWidth, $targetHeight,
                $sourceWidth, $sourceHeight
            );

            // Simpan thumbnail sesuai format asli
            $result = false;
            switch ($imageType) {
                case IMAGETYPE_JPEG:
                    $result = imagejpeg($thumbnailImage, $targetPath, 90);
                    break;
                case IMAGETYPE_PNG:
                    $result = imagepng($thumbnailImage, $targetPath, 9);
                    break;
                case IMAGETYPE_GIF:
                    $result = imagegif($thumbnailImage, $targetPath);
                    break;
            }

            // Bersihkan memory
            imagedestroy($sourceImage);
            imagedestroy($thumbnailImage);

            return $result;

        } catch (\Exception $e) {
            error_log('Error membuat thumbnail: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Menentukan folder tujuan berdasarkan tipe file dan tanggal
     */
    private function getUploadDestination(string $mimeType, ?string $size = null, bool $fullPath = true): string {
        $year = date('Y');
        $month = date('m');
        
        // Tentukan subfolder berdasarkan tipe file
        if (in_array($mimeType, $this->imageTypes)) {
            $subPath = sprintf('img/%s/%s/%s', 
                $size ?? 'original',
                $year, 
                $month
            );
        } elseif (in_array($mimeType, $this->documentTypes)) {
            $subPath = sprintf('doc/%s/%s', 
                $year, 
                $month
            );
        } else {
            $subPath = sprintf('other/%s/%s', 
                $year, 
                $month
            );
        }

        // Normalisasi base path
        $basePath = str_replace('\\', '/', $this->uploadsPath);
        
        // Gabungkan path
        $fullPathDir = $basePath . '/' . $subPath;
        
        // Buat direktori jika belum ada
        if (!file_exists($fullPathDir)) {
            if (!mkdir($fullPathDir, 0777, true)) {
                throw new \RuntimeException("Gagal membuat direktori upload: {$fullPathDir}");
            }
            chmod($fullPathDir, 0755);
        }
        
        return $fullPath ? $fullPathDir : $subPath;
    }

    /**
     * Membuat direktori rekursif dengan permission yang aman
     * 
     * @param string $path Path direktori yang akan dibuat
     * @throws \RuntimeException jika gagal membuat direktori
     */
    private function createDirectory(string $path): void {
        // Normalisasi path dengan menghapus trailing/leading slashes
        $path = rtrim($path, '/');
        
        if (!file_exists($path)) {
            // Coba buat direktori dengan permission 0755
            if (!@mkdir($path, 0755, true)) {
                $error = error_get_last();
                throw new \RuntimeException("Gagal membuat direktori {$path}: " . ($error['message'] ?? 'Unknown error'));
            }
            
            // Set permission yang aman untuk setiap level direktori
            $parts = explode('/', $path);
            $currentPath = '';
            foreach ($parts as $part) {
                $currentPath .= $part . '/';
                if (is_dir($currentPath)) {
                    chmod($currentPath, 0755);
                }
            }
        }
        
        // Periksa apakah direktori writable
        if (!is_writable($path)) {
            throw new \RuntimeException("Direktori {$path} tidak writable");
        }
    }

    /**
     * Mengupload file dan membuat multiple ukuran untuk gambar
     */
    public function uploadFile(array $file, string $column, ?string $typeColumn = null, ?string $sizeColumn = null): self {
        try {
            // Validasi file array
            if (!isset($file['tmp_name']) || !isset($file['name']) || !isset($file['error'])) {
                throw new \RuntimeException('Format file upload tidak valid');
            }

            // Cek error upload PHP
            if ($file['error'] !== UPLOAD_ERR_OK) {
                switch ($file['error']) {
                    case UPLOAD_ERR_INI_SIZE:
                        throw new \RuntimeException('File melebihi upload_max_filesize di php.ini');
                    case UPLOAD_ERR_FORM_SIZE:
                        throw new \RuntimeException('File melebihi MAX_FILE_SIZE di form HTML');
                    case UPLOAD_ERR_PARTIAL:
                        throw new \RuntimeException('File hanya terupload sebagian');
                    case UPLOAD_ERR_NO_FILE:
                        throw new \RuntimeException('Tidak ada file yang diupload');
                    default:
                        throw new \RuntimeException('Error upload tidak diketahui');
                }
            }

            // Cek tipe file
            $actual_type = $this->getFileType($file['tmp_name']);
            if (!in_array($actual_type, $this->allowedTypes)) {
                throw new \RuntimeException('Tipe file tidak diizinkan: ' . $actual_type);
            }

            // Generate nama file yang aman
            $originalName = pathinfo($file['name'], PATHINFO_FILENAME);
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $safeName = preg_replace('/[^a-z0-9-_]/i', '_', $originalName);
            $filename = sprintf('%s-%s.%s', $safeName, uniqid(), $extension);

            // Upload file original
            $uploadDir = $this->getUploadDestination($actual_type);
            $destination = $uploadDir . '/' . $filename;

            // Debug log
            error_log("Mencoba upload file ke: " . $destination);
            error_log("File type: " . $actual_type);

            // Pindahkan file
            if (!move_uploaded_file($file['tmp_name'], $destination)) {
                throw new \RuntimeException('Gagal memindahkan file yang diupload ke ' . $destination);
            }

            chmod($destination, 0644);

            // Jika file adalah gambar, buat thumbnail
            if (in_array($actual_type, $this->imageTypes)) {
                foreach ($this->imageSizes as $size => $dimensions) {
                    // Buat direktori untuk ukuran thumbnail ini
                    $thumbDir = $this->getUploadDestination($actual_type, $size);
                    $thumbPath = $thumbDir . '/' . $filename;
                    
                    // Buat thumbnail
                    if (!$this->createThumbnail($destination, $thumbPath, $dimensions)) {
                        error_log("Gagal membuat thumbnail {$size} untuk {$filename}");
                    } else {
                        chmod($thumbPath, 0644);
                    }
                }
            }

            // Simpan path relatif ke database
            $relativePath = str_replace($this->uploadsPath . '/', '', $destination);
            $this->sets[$column] = $relativePath;

            // Simpan tipe dan ukuran file jika diminta
            if ($typeColumn !== null) {
                $parts = explode('/', $actual_type);
                $this->sets[$typeColumn] = end($parts);
            }
            if ($sizeColumn !== null) {
                $this->sets[$sizeColumn] = $this->formatFileSize(filesize($destination));
            }

            return $this;

        } catch (\Exception $e) {
            error_log('Error upload file: ' . $e->getMessage());
            throw new \RuntimeException('Gagal upload file: ' . $e->getMessage());
        }
    }

    /**
     * Menghapus file yang diupload
     */
    public function deleteUploadedFile(string $filepath): bool {
        if (file_exists($filepath) && is_file($filepath)) {
            return unlink($filepath);
        }
        return false;
    }

    /**
     * Mengatur base upload path
     * 
     * @param string $path Base upload path
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function setBasePath(string $path): self {
        $this->uploadsPath = rtrim($path, '/') . '/';
        return $this;
    }

    /**
     * Mengatur ukuran thumbnail yang akan dibuat
     * 
     * @param array $sizes Array ukuran thumbnail (contoh: ['100x100', '250x250'])
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function imageSizes(array $sizes): self {
        $this->imageSizes = [];
        
        foreach ($sizes as $size) {
            // Parse format "widthxheight"
            if (preg_match('/^(\d+)x(\d+)$/', $size, $matches)) {
                $width = (int)$matches[1];
                $height = (int)$matches[2];
                
                $this->imageSizes[$size] = [
                    'width' => $width,
                    'height' => $height
                ];
            } else {
                throw new \RuntimeException("Format ukuran tidak valid: $size. Gunakan format: widthxheight");
            }
        }
        
        return $this;
    }

    /**
     * Mendapatkan path upload berdasarkan ID data
     * 
     * @param int $id ID data
     * @param string $column Nama kolom yang menyimpan path file
     * @return string|null Path file atau null jika tidak ditemukan
     * @throws \RuntimeException jika query gagal
     */
    public function getUploadPathById(int $id, string $column): ?string {
        try {
            // Reset kondisi where yang mungkin ada sebelumnya
            $this->wheres = [];
            $this->bindings = [];
            
            // Set kondisi where untuk ID
            $this->where('id = ?', [$id]);
            
            // Select hanya kolom yang dibutuhkan
            $this->select([$column]);
            
            // Eksekusi query
            $result = $this->execute();
            
            if (empty($result)) {
                return null;
            }
            
            $filePath = $result[0][$column] ?? null;
            
            if ($filePath === null) {
                return null;
            }
            
            // Gabungkan dengan base upload path
            return $this->uploadsPath . '/' . $filePath;
            
        } catch (\Exception $e) {
            error_log('Error pada getUploadPathById: ' . $e->getMessage());
            throw new \RuntimeException('Gagal mendapatkan path upload: ' . $e->getMessage());
        }
    }

    /**
     * Mendapatkan semua versi thumbnail untuk gambar berdasarkan ID
     * 
     * @param int $id ID data
     * @param string $column Nama kolom yang menyimpan path file
     * @return array Array berisi path untuk semua ukuran thumbnail
     * @throws \RuntimeException jika query gagal
     */
    public function getImageThumbnailsById(int $id, string $column): array {
        try {
            $originalPath = $this->getUploadPathById($id, $column);
            
            if (!$originalPath) {
                return [];
            }
            
            // Cek apakah file adalah gambar
            $mimeType = $this->getFileType($originalPath);
            if (!in_array($mimeType, $this->imageTypes)) {
                return [];
            }
            
            $thumbnails = [];
            $filename = basename($originalPath);
            
            // Dapatkan path relatif
            $relativePath = str_replace($this->uploadsPath . '/', '', $originalPath);
            $pathInfo = pathinfo($relativePath);
            
            // Tambahkan path original
            $thumbnails['original'] = $originalPath;
            
            // Dapatkan path untuk setiap ukuran thumbnail
            foreach ($this->imageSizes as $size => $dimensions) {
                $thumbPath = sprintf('%s/img/%s/%s/%s/%s',
                    $this->uploadsPath,
                    $size,
                    date('Y', filemtime($originalPath)),
                    date('m', filemtime($originalPath)),
                    $filename
                );
                
                if (file_exists($thumbPath)) {
                    $thumbnails[$size] = $thumbPath;
                }
            }
            
            return $thumbnails;
            
        } catch (\Exception $e) {
            error_log('Error pada getImageThumbnailsById: ' . $e->getMessage());
            throw new \RuntimeException('Gagal mendapatkan thumbnails: ' . $e->getMessage());
        }
    }

    /**
     * Mendapatkan data spesifik berdasarkan ID
     * 
     * @param int $id ID data yang dicari
     * @param array|string $columns Array kolom atau string kolom yang dipisahkan koma
     * @return array|null Data yang ditemukan atau null jika tidak ada
     * @throws \RuntimeException jika query gagal
     */
    public function getDataById(int $id, $columns = ['*']): ?array {
        try {
            // Reset kondisi where yang mungkin ada sebelumnya
            $this->wheres = [];
            $this->bindings = [];
            
            // Set kondisi where untuk ID
            $this->where('id', $id);
            
            // Select kolom yang diinginkan
            $this->select($columns);
            
            // Eksekusi query
            $result = $this->execute();
            
            // Reset selects dan wheres setelah eksekusi
            $this->selects = ['*'];
            $this->wheres = [];
            $this->bindings = [];
            
            return !empty($result) ? $result[0] : null;
            
        } catch (\Exception $e) {
            error_log('Error pada getDataById: ' . $e->getMessage());
            error_log('ID: ' . $id);
            error_log('Columns: ' . (is_array($columns) ? implode(',', $columns) : $columns));
            error_log('Stack trace: ' . $e->getTraceAsString());
            throw new \RuntimeException('Gagal mendapatkan data: ' . $e->getMessage());
        }
    }

    /**
     * Menutup koneksi database
     */
    public function closeConnection(): void {
        if ($this->mysqli) {
            $this->mysqli->close();
        }
    }

    public function __destruct() {
        try {
            // Bersihkan prepared statements yang tidak digunakan
            foreach (self::$preparedStatements as $stmt) {
                if ($stmt && method_exists($stmt, 'close')) {
                    $stmt->close();
                }
            }
            self::$preparedStatements = [];
            
            // Bersihkan cache yang expired
            foreach (self::$queryCache as $key => $cached) {
                if ($cached['expires'] <= time()) {
                    unset(self::$queryCache[$key]);
                }
            }

            // Tutup koneksi mysqli jika masih terbuka
            if ($this->mysqli && $this->mysqli instanceof \mysqli) {
                $this->mysqli->close();
            }
        } catch (\Exception $e) {
            error_log('Error pada destructor: ' . $e->getMessage());
        }
    }

    /**
     * Membangun string JOIN untuk query
     */
    private function buildJoins(): string {
        $joinStr = '';
        foreach ($this->joins as $join) {
            $type = strtoupper($join['type']);
            $table = $this->mysqli->real_escape_string($join['table']);
            $joinStr .= " {$type} JOIN `{$table}` ON {$join['condition']}";
        }
        return $joinStr;
    }

    /**
     * Membangun string GROUP BY untuk query
     */
    private function buildGroupBy(): string {
        if (empty($this->groupBy)) {
            return '';
        }
        
        $columns = array_map(function($column) {
            return $this->mysqli->real_escape_string($column);
        }, $this->groupBy);
        
        return " GROUP BY " . implode(', ', $columns);
    }

    /**
     * Membangun string HAVING untuk query
     */
    private function buildHaving(): string {
        if (empty($this->having)) {
            return '';
        }
        
        $havingStr = " HAVING {$this->having['condition']}";
        
        if (!empty($this->having['params'])) {
            $this->bindings = array_merge($this->bindings, $this->having['params']);
        }
        
        return $havingStr;
    }

    /**
     * Alias untuk method execute()
     * Mengambil hasil query
     * 
     * @param bool $orderByIdDesc Optional parameter untuk mengurutkan berdasarkan ID secara DESC
     * @return array Hasil query dalam bentuk array
     */
    public function get(bool $orderByIdDesc = false): array {
        return $this->execute($orderByIdDesc);
    }

    /**
     * Menguji koneksi database
     * 
     * @return array Status koneksi database
     * @throws \RuntimeException jika koneksi gagal
     */
    public function testConnection(): array {
        try {
            // Cek apakah koneksi mysqli valid
            if (!$this->mysqli || !($this->mysqli instanceof \mysqli)) {
                throw new \RuntimeException('Koneksi database tidak valid');
            }

            // Coba melakukan ping ke server
            if (!$this->mysqli->ping()) {
                throw new \RuntimeException('Tidak dapat terhubung ke server database: ' . $this->mysqli->error);
            }

            // Coba mengambil informasi server
            $serverInfo = $this->mysqli->get_server_info();
            $hostInfo = $this->mysqli->host_info;
            $clientInfo = $this->mysqli->get_client_info();

            // Cek status koneksi
            $threadId = $this->mysqli->thread_id;
            $stats = $this->mysqli->stat();

            return [
                'status' => 'connected',
                'server_info' => $serverInfo,
                'host_info' => $hostInfo,
                'client_info' => $clientInfo,
                'thread_id' => $threadId,
                'statistics' => $stats,
                'character_set' => $this->mysqli->character_set_name(),
                'protocol_version' => $this->mysqli->protocol_version
            ];

        } catch (\Exception $e) {
            error_log('Error pada testConnection: ' . $e->getMessage());
            throw new \RuntimeException('Gagal menguji koneksi database: ' . $e->getMessage());
        }
    }

    /**
     * Mendapatkan data update berdasarkan ID
     * 
     * @param int $id ID data yang akan diupdate
     * @param array|string $columns Kolom yang ingin ditampilkan (opsional)
     * @return array|null Data update atau null jika tidak ditemukan
     * @throws \RuntimeException jika query gagal
     */
    public function getUpdateById(int $id, $columns = ['*']): ?array {
        try {
            // Reset kondisi where yang mungkin ada sebelumnya
            $this->wheres = [];
            $this->bindings = [];
            
            // Set kondisi where untuk ID
            $this->where('id', $id);
            
            // Select kolom yang diinginkan
            $this->select($columns);
            
            // Eksekusi query untuk mendapatkan data
            $result = $this->execute();
            
            // Reset selects dan wheres setelah eksekusi
            $this->selects = ['*'];
            $this->wheres = [];
            $this->bindings = [];
            
            return !empty($result) ? $result[0] : null;
            
        } catch (\Exception $e) {
            throw new \RuntimeException('Gagal mendapatkan data update: ' . $e->getMessage());
        }
    }

    /**
     * Mengatur jumlah item per halaman
     * 
     * @param int $perPage Jumlah item per halaman
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function perPage(int $perPage): self {
        $this->perPage = max(1, $perPage); // Minimal 1 item per halaman
        return $this;
    }

    /**
     * Mengatur halaman saat ini
     * 
     * @param int $page Nomor halaman
     * @return self Instance QueryBuilder untuk method chaining
     */
    public function page(int $page): self {
        $this->currentPage = max(1, $page); // Minimal halaman 1
        $this->offset = ($this->currentPage - 1) * $this->perPage;
        $this->limit = $this->perPage;
        return $this;
    }

    /**
     * Mendapatkan data dengan pagination
     * 
     * @return array Array berisi data dan informasi pagination
     */
    public function paginate(): array {
        try {
            // Hitung total rows terlebih dahulu
            $countQuery = "SELECT COUNT(*) as total FROM `{$this->table}`";
            if (!empty($this->wheres)) {
                $countQuery .= " WHERE " . implode(' AND ', $this->wheres);
            }
            
            $stmt = $this->mysqli->prepare($countQuery);
            if (!empty($this->bindings)) {
                $types = '';
                foreach ($this->bindings as $value) {
                    if (is_int($value)) $types .= 'i';
                    elseif (is_float($value)) $types .= 'd';
                    elseif (is_string($value)) $types .= 's';
                    else $types .= 'b';
                }
                $stmt->bind_param($types, ...$this->bindings);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $this->totalRows = $result->fetch_assoc()['total'];
            
            // Ambil data untuk halaman yang diminta
            $data = $this->execute();
            
            // Hitung total halaman
            $totalPages = ceil($this->totalRows / $this->perPage);
            
            return [
                'data' => $data,
                'pagination' => [
                    'total_rows' => $this->totalRows,
                    'per_page' => $this->perPage,
                    'current_page' => $this->currentPage,
                    'total_pages' => $totalPages,
                    'has_previous' => $this->currentPage > 1,
                    'has_next' => $this->currentPage < $totalPages,
                    'previous_page' => max(1, $this->currentPage - 1),
                    'next_page' => min($totalPages, $this->currentPage + 1),
                    'first_page' => 1,
                    'last_page' => $totalPages,
                ]
            ];
            
        } catch (\Exception $e) {
            error_log('Error pada paginate: ' . $e->getMessage());
            throw new \RuntimeException('Gagal melakukan pagination: ' . $e->getMessage());
        }
    }

    /**
     * Memvalidasi input berdasarkan tipe dan panjang
     * 
     * @param mixed $value Nilai yang akan divalidasi
     * @param string $type Tipe validasi (text/email/password)
     * @param int $maxLength Panjang maksimal karakter
     * @return string|int Nilai yang sudah divalidasi
     */
    public function validasi($value, string $type, int $maxLength = 255) {
        try {
            // Validasi dasar untuk semua tipe
            if ($value === null || $value === '') {
                throw new \RuntimeException('Nilai tidak boleh kosong');
            }

            if (strlen($value) > $maxLength) {
                throw new \RuntimeException("Panjang maksimal adalah {$maxLength} karakter");
            }

            // Validasi berdasarkan tipe
            switch (strtolower($type)) {
                case 'text':
                    // Bersihkan teks dari karakter berbahaya
                    $value = strip_tags($value);
                    $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                    
                    // Validasi karakter yang diperbolehkan
                    if (!preg_match('/^[a-zA-Z0-9\s\-\_\.\,\!\?]+$/', $value)) {
                        throw new \RuntimeException('Teks mengandung karakter yang tidak diperbolehkan');
                    }
                    return $value;

                case 'email':
                    // Validasi format email
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        throw new \RuntimeException('Format email tidak valid');
                    }
                    
                    // Validasi domain email
                    $domain = substr(strrchr($value, "@"), 1);
                    if (!checkdnsrr($domain, "MX")) {
                        throw new \RuntimeException('Domain email tidak valid');
                    }
                    return $value;

                case 'password':
                    // Minimal 8 karakter
                    if (strlen($value) < 8) {
                        throw new \RuntimeException('Password minimal 8 karakter');
                    }
                    
                    // Harus mengandung huruf besar, huruf kecil, dan angka
                    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', $value)) {
                        throw new \RuntimeException('Password harus mengandung huruf besar, huruf kecil, dan angka');
                    }
                    
                    // Hash password sebelum disimpan
                    return password_hash($value, PASSWORD_DEFAULT);

                case 'number':
                    if (!is_numeric($value)) {
                        throw new \RuntimeException('Nilai harus berupa angka');
                    }
                    return (int)$value;

                case 'date':
                    if (!strtotime($value)) {
                        throw new \RuntimeException('Format tanggal tidak valid');
                    }
                    return date('Y-m-d', strtotime($value));

                case 'url':
                    if (!filter_var($value, FILTER_VALIDATE_URL)) {
                        throw new \RuntimeException('Format URL tidak valid');
                    }
                    return $value;

                case 'phone':
                    // Bersihkan nomor telepon dari karakter non-digit
                    $value = preg_replace('/[^0-9]/', '', $value);
                    
                    // Validasi panjang nomor telepon (8-15 digit)
                    if (strlen($value) < 8 || strlen($value) > 15) {
                        throw new \RuntimeException('Nomor telepon harus 8-15 digit');
                    }
                    
                    // Format nomor telepon Indonesia
                    if (substr($value, 0, 2) === '08') {
                        $value = '+62' . substr($value, 1);
                    }
                    return $value;

                case 'username':
                    // Hanya huruf, angka, underscore, min 3 karakter
                    if (!preg_match('/^[a-zA-Z0-9_]{3,}$/', $value)) {
                        throw new \RuntimeException('Username hanya boleh mengandung huruf, angka, dan underscore (min 3 karakter)');
                    }
                    return strtolower($value);

                case 'slug':
                    // Ubah spasi menjadi dash
                    $value = str_replace(' ', '-', $value);
                    // Hanya huruf kecil, angka, dan dash
                    $value = preg_replace('/[^a-z0-9\-]/', '', strtolower($value));
                    // Hilangkan multiple dash
                    $value = preg_replace('/-+/', '-', $value);
                    return trim($value, '-');

                case 'color':
                    // Validasi format warna hex (#FFFFFF atau #FFF)
                    if (!preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $value)) {
                        throw new \RuntimeException('Format warna tidak valid (gunakan format hex: #FFFFFF atau #FFF)');
                    }
                    return strtoupper($value);

                case 'ip':
                    if (!filter_var($value, FILTER_VALIDATE_IP)) {
                        throw new \RuntimeException('Format IP address tidak valid');
                    }
                    return $value;

                case 'json':
                    $decoded = json_decode($value);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        throw new \RuntimeException('Format JSON tidak valid: ' . json_last_error_msg());
                    }
                    return $value;

                case 'array':
                    if (!is_array($value)) {
                        throw new \RuntimeException('Nilai harus berupa array');
                    }
                    return json_encode($value);

                case 'boolean':
                    if (is_string($value)) {
                        $value = strtolower($value);
                        if (in_array($value, ['true', '1', 'yes', 'on'])) return 1;
                        if (in_array($value, ['false', '0', 'no', 'off'])) return 0;
                    }
                    return (int)!!$value;

                case 'currency':
                    // Bersihkan format currency
                    $value = preg_replace('/[^0-9.]/', '', $value);
                    if (!is_numeric($value)) {
                        throw new \RuntimeException('Format mata uang tidak valid');
                    }
                    return number_format((float)$value, 2, '.', '');

                case 'file_extension':
                    $allowed = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
                    $ext = strtolower(pathinfo($value, PATHINFO_EXTENSION));
                    if (!in_array($ext, $allowed)) {
                        throw new \RuntimeException('Ekstensi file tidak diizinkan');
                    }
                    return $value;

                // Default case tetap sama...
            }

        } catch (\Exception $e) {
            $this->validationErrors[] = $e->getMessage();
            throw new \RuntimeException($e->getMessage());
        }
    }

    /**
     * Mendapatkan error validasi
     * 
     * @return array Array berisi pesan error validasi
     */
    public function getValidationErrors(): array {
        return $this->validationErrors;
    }

    /**
     * Menghitung jumlah baris yang memenuhi kondisi query
     * 
     * @param string|null $column Nama kolom yang akan dihitung (opsional)
     * @return int Jumlah baris
     * @throws \RuntimeException jika query gagal
     */
    public function count(?string $column = null): int {
        try {
            $originalSelects = $this->selects;
            
            // Jika kolom tidak ditentukan, hitung semua baris
            if ($column === null) {
                $this->selects = ['COUNT(*) as total'];
            } else {
                // Jika kolom ditentukan, hitung baris dengan nilai non-null
                $this->selects = ["COUNT(`{$column}`) as total"];
            }
            
            $result = $this->execute();
            
            // Kembalikan selects ke nilai semula
            $this->selects = $originalSelects;
            
            return (int)($result[0]['total'] ?? 0);
            
        } catch (\Exception $e) {
            error_log('Error pada count: ' . $e->getMessage());
            throw new \RuntimeException('Gagal menghitung jumlah baris: ' . $e->getMessage());
        }
    }

    /**
     * Menghitung jumlah total dari kolom tertentu
     * 
     * @param string $column Nama kolom yang akan dijumlahkan
     * @return float Total penjumlahan
     * @throws \RuntimeException jika query gagal
     */
    public function sum(string $column): float {
        try {
            $originalSelects = $this->selects;
            
            $this->selects = ["SUM(`{$column}`) as total"];
            $result = $this->execute();
            
            // Kembalikan selects ke nilai semula
            $this->selects = $originalSelects;
            
            return (float)($result[0]['total'] ?? 0);
            
        } catch (\Exception $e) {
            error_log('Error pada sum: ' . $e->getMessage());
            throw new \RuntimeException('Gagal menjumlahkan kolom: ' . $e->getMessage());
        }
    }

    /**
     * Menghitung rata-rata dari kolom tertentu
     * 
     * @param string $column Nama kolom yang akan dihitung rata-ratanya
     * @return float Nilai rata-rata
     * @throws \RuntimeException jika query gagal
     */
    public function avg(string $column): float {
        try {
            $originalSelects = $this->selects;
            
            $this->selects = ["AVG(`{$column}`) as average"];
            $result = $this->execute();
            
            // Kembalikan selects ke nilai semula
            $this->selects = $originalSelects;
            
            return (float)($result[0]['average'] ?? 0);
            
        } catch (\Exception $e) {
            error_log('Error pada avg: ' . $e->getMessage());
            throw new \RuntimeException('Gagal menghitung rata-rata: ' . $e->getMessage());
        }
    }

    /**
     * Mencari nilai maksimum dari kolom tertentu
     * 
     * @param string $column Nama kolom yang akan dicari nilai maksimumnya
     * @return mixed Nilai maksimum
     * @throws \RuntimeException jika query gagal
     */
    public function max(string $column) {
        try {
            $originalSelects = $this->selects;
            
            $this->selects = ["MAX(`{$column}`) as maximum"];
            $result = $this->execute();
            
            // Kembalikan selects ke nilai semula
            $this->selects = $originalSelects;
            
            return $result[0]['maximum'] ?? null;
            
        } catch (\Exception $e) {
            error_log('Error pada max: ' . $e->getMessage());
            throw new \RuntimeException('Gagal mencari nilai maksimum: ' . $e->getMessage());
        }
    }

    /**
     * Mencari nilai minimum dari kolom tertentu
     * 
     * @param string $column Nama kolom yang akan dicari nilai minimumnya
     * @return mixed Nilai minimum
     * @throws \RuntimeException jika query gagal
     */
    public function min(string $column) {
        try {
            $originalSelects = $this->selects;
            
            $this->selects = ["MIN(`{$column}`) as minimum"];
            $result = $this->execute();
            
            // Kembalikan selects ke nilai semula
            $this->selects = $originalSelects;
            
            return $result[0]['minimum'] ?? null;
            
        } catch (\Exception $e) {
            error_log('Error pada min: ' . $e->getMessage());
            throw new \RuntimeException('Gagal mencari nilai minimum: ' . $e->getMessage());
        }
    }
} 