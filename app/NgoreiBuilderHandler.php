<?php
namespace app;

class NgoreiBuilderHandler {
    private $query = '';
    private $table = '';
    private $selects = [];
    private $wheres = [];
    private $joins = [];
    private $orderBy = '';
    private $orderDirection = '';
    private $limit = null;
    private $offset = null;
    private $groupBy = [];
    private $having = [];
    private $joinHandler;
    private $insertColumns = [];
    private $insertValues = [];

    public function __construct() {
        $this->joinHandler = new NgoreiBuilderHandlerJoin();
    }

    /**
     * Mengkonversi SQL ke format Builder
     */
    public function convertToBuilder(string $sql): string {
        try {
            // Bersihkan query
            $sql = trim($sql);
            
            // Cek tipe query
            if (preg_match('/^INSERT/i', $sql)) {
                return $this->handleInsertQuery($sql);
            } elseif (preg_match('/^SELECT/i', $sql)) {
                return $this->handleSelectQuery($sql);
            } elseif (preg_match('/^UPDATE/i', $sql)) {
                return $this->handleUpdateQuery($sql);
            } elseif (preg_match('/^DELETE/i', $sql)) {
                return $this->handleDeleteQuery($sql);
            } elseif (preg_match('/^WITH/i', $sql)) {
                return $this->handleWithQuery($sql);
            }

            throw new \Exception('Query type tidak didukung');

        } catch (\Exception $e) {
            throw new \Exception('Error konversi query: ' . $e->getMessage());
        }
    }

    /**
     * Handle query INSERT
     */
    private function handleInsertQuery(string $sql): string {
        // Parse table name dan columns
        if (!preg_match('/INSERT\s+INTO\s+`?(\w+)`?\s*\((.*?)\)\s*VALUES/is', $sql, $matches)) {
            throw new \Exception('Format query INSERT tidak valid');
        }

        $table = $matches[1];
        $columns = array_map('trim', explode(',', $matches[2]));
        
        // Parse semua VALUES
        // Ambil semua yang ada di dalam kurung setelah VALUES
        preg_match_all('/\((.*?)\)/s', $sql, $valueMatches, PREG_SET_ORDER);
        
        // Skip match pertama karena itu adalah kolom
        array_shift($valueMatches);
        
        $allValues = [];
        foreach ($valueMatches as $match) {
            $values = array_map('trim', explode(',', $match[1]));
            
            if (count($columns) !== count($values)) {
                throw new \Exception('Jumlah kolom dan nilai tidak sama');
            }
            
            // Buat array data untuk setiap baris
            $rowData = [];
            foreach ($columns as $i => $column) {
                $column = trim($column, '`');
                $value = trim($values[$i], "'\"");
                if (is_numeric($value) || strtolower($value) === 'null') {
                    $rowData[$column] = $value;
                } else {
                    $rowData[$column] = "'" . $value . "'";
                }
            }
            $allValues[] = $rowData;
        }

        // Generate kode builder untuk INSERT
        $code = [];
        $code[] = "\$Tds = new Ngorei();";
        $code[] = "\$Tds->Network->Brief('{$table}')";

        if (count($allValues) === 1) {
            // Single row insert
            $dataStr = [];
            foreach ($allValues[0] as $key => $val) {
                $dataStr[] = "    '{$key}' => {$val}";
            }

            $code[] = "    ->insert([";
            $code[] = implode(",\n", $dataStr);
            $code[] = "    ])";
        } else {
            // Multiple rows insert (batch)
            $code[] = "    ->insertBatch([";
            
            foreach ($allValues as $index => $rowData) {
                $dataStr = [];
                foreach ($rowData as $key => $val) {
                    $dataStr[] = "        '{$key}' => {$val}";
                }
                
                $code[] = "        [";
                $code[] = implode(",\n", $dataStr);
                $code[] = "        ]" . ($index < count($allValues) - 1 ? "," : "");
            }
            
            $code[] = "    ])";
        }

        $code[] = "    ->execute();";

        return implode("\n", $code);
    }

    /**
     * Parse bagian SELECT
     */
    private function parseSelect(string $sql): void {
        if (preg_match('/SELECT(.*?)FROM/is', $sql, $matches)) {
            $selectPart = trim($matches[1]);
            
            // Handle SELECT *
            if ($selectPart === '*') {
                $this->selects = ['*'];
                return;
            }

            // Split columns
            $columns = array_map('trim', explode(',', $selectPart));
            $this->selects = $columns;
        }
    }

    /**
     * Parse bagian FROM
     */
    private function parseFrom(string $sql): void {
        if (preg_match('/FROM\s+`?([a-zA-Z0-9_]+)`?/i', $sql, $matches)) {
            $this->table = $matches[1];
        }
    }

    /**
     * Parse bagian JOIN menggunakan NgoreiJoinHandler
     */
    private function parseJoins(string $sql): void {
        $joinTypes = ['LEFT JOIN', 'RIGHT JOIN', 'JOIN'];
        
        foreach ($joinTypes as $joinType) {
            if (strpos($sql, $joinType) !== false) {
                switch ($joinType) {
                    case 'LEFT JOIN':
                        $this->joins[] = $this->joinHandler->handleLeftJoin($sql);
                        break;
                    case 'RIGHT JOIN':
                        $this->joins[] = $this->joinHandler->handleRightJoin($sql);
                        break;
                    case 'JOIN':
                        $this->joins[] = $this->joinHandler->handleSimpleJoin($sql);
                        break;
                }
            }
        }
    }

    /**
     * Parse bagian WHERE
     */
    private function parseWhere(string $sql): void {
        if (preg_match('/WHERE(.*?)(?:GROUP BY|ORDER BY|LIMIT|$)/is', $sql, $matches)) {
            $wherePart = trim($matches[1]);
            
            // Split multiple conditions
            $conditions = preg_split('/(AND|OR)/i', $wherePart, -1, PREG_SPLIT_NO_EMPTY);
            
            foreach ($conditions as $condition) {
                $this->wheres[] = trim($condition);
            }
        }
    }

    /**
     * Parse bagian GROUP BY
     */
    private function parseGroupBy(string $sql): void {
        if (preg_match('/GROUP BY(.*?)(?:HAVING|ORDER BY|LIMIT|$)/is', $sql, $matches)) {
            $groupByPart = trim($matches[1]);
            $this->groupBy = array_map('trim', explode(',', $groupByPart));
        }
    }

    /**
     * Parse bagian HAVING
     */
    private function parseHaving(string $sql): void {
        if (preg_match('/HAVING(.*?)(?:ORDER BY|LIMIT|$)/is', $sql, $matches)) {
            $this->having = trim($matches[1]);
        }
    }

    /**
     * Parse bagian ORDER BY
     */
    private function parseOrderBy(string $sql): void {
        if (preg_match('/ORDER BY(.*?)(?:LIMIT|$)/is', $sql, $matches)) {
            $orderByPart = trim($matches[1]);
            
            if (preg_match('/([a-zA-Z0-9_`.]+)\s*(ASC|DESC)?/i', $orderByPart, $orderMatches)) {
                $this->orderBy = trim($orderMatches[1], '`');
                $this->orderDirection = isset($orderMatches[2]) ? strtoupper($orderMatches[2]) : 'ASC';
            }
        }
    }

    /**
     * Parse bagian LIMIT
     */
    private function parseLimit(string $sql): void {
        if (preg_match('/LIMIT\s+(\d+)(?:\s*,\s*(\d+))?/i', $sql, $matches)) {
            if (isset($matches[2])) {
                $this->offset = (int)$matches[1];
                $this->limit = (int)$matches[2];
            } else {
                $this->limit = (int)$matches[1];
            }
        }
    }

    /**
     * Generate kode Builder
     */
    private function generateBuilderCode(): string {
        $code = [];
        $code[] = "\$Tds = new Ngorei();";
        $code[] = "\$Tds->Network->Brief('{$this->table}')";
        
        // Select
        if (!empty($this->selects) && $this->selects !== ['*']) {
            $selectStr = implode("', '", $this->selects);
            $code[] = "    ->select(['{$selectStr}'])";
        }
        
        // Joins - Perbaikan format join
        foreach ($this->joins as $joinCode) {
            if (!empty($joinCode)) {
                // Hapus bagian $builder dan ganti dengan arrow
                $joinCode = str_replace(
                    ["\$builder->", "join", "leftJoin", "rightJoin"],
                    ["    ->", "join", "leftJoin", "rightJoin"],
                    $joinCode
                );
                $code[] = $joinCode;
            }
        }
        
        // Where
        foreach ($this->wheres as $where) {
            $code[] = "    ->where('{$where}')";
        }
        
        // Group By
        if (!empty($this->groupBy)) {
            $groupByStr = implode(', ', $this->groupBy);
            $code[] = "    ->groupBy('{$groupByStr}')";
        }
        
        // Having
        if (!empty($this->having)) {
            $code[] = "    ->having('{$this->having}')";
        }
        
        // Order By
        if (!empty($this->orderBy)) {
            $code[] = "    ->orderBy('{$this->orderBy}', '{$this->orderDirection}')";
        }
        
        // Limit & Offset
        if ($this->limit !== null) {
            $code[] = "    ->limit({$this->limit})";
        }
        if ($this->offset !== null) {
            $code[] = "    ->offset({$this->offset})";
        }
        
        // Execute
        $code[] = "    ->execute();";
        
        return implode("\n", $code);
    }

    /**
     * Handle SELECT query
     */
    private function handleSelectQuery(string $sql): string {
        // Cek apakah query untuk pagination
        if (preg_match('/LIMIT\s+(\w+)\s+OFFSET\s+\(\((\w+)\s*-\s*1\)\s*\*\s*(\w+)\)/i', $sql, $matches)) {
            return $this->handlePaginationQuery($sql, $matches[1], $matches[2], $matches[3]);
        }
        
        // Cek apakah query menggunakan fungsi agregat
        if (preg_match('/^SELECT\s+(COUNT|SUM|AVG|MAX|MIN)\((.*?)\)\s+FROM/is', $sql, $matches)) {
            return $this->handleAggregateQuery($sql, $matches[1], $matches[2]);
        }

        // Parse komponen query biasa
        $this->parseSelect($sql);
        $this->parseFrom($sql);
        $this->parseJoins($sql);
        $this->parseWhere($sql);
        $this->parseGroupBy($sql);
        $this->parseHaving($sql);
        $this->parseOrderBy($sql);
        $this->parseLimit($sql);

        return $this->generateBuilderCode();
    }

    /**
     * Handle Aggregate Functions (SUM, COUNT, AVG, MAX, MIN)
     */
    private function handleAggregateQuery(string $sql, string $function, string $column): string {
        // Parse table name
        if (!preg_match('/FROM\s+`?(\w+)`?/i', $sql, $matches)) {
            throw new \Exception('Format query tidak valid');
        }

        $table = $matches[1];
        $column = trim($column, '* `');
        $function = strtolower($function);

        $code = [];
        $code[] = "\$Tds = new Ngorei();";
        $code[] = "\$Tds->Network->Brief('{$table}')";
        
        // Handle different aggregate functions
        switch ($function) {
            case 'sum':
                $code[] = "    ->sum('{$column}')";
                break;
            case 'count':
                if ($column === '*' || empty($column)) {
                    $code[] = "    ->count()";
                } else {
                    $code[] = "    ->count('{$column}')";
                }
                break;
            case 'avg':
                $code[] = "    ->avg('{$column}')";
                break;
            case 'max':
                $code[] = "    ->max('{$column}')";
                break;
            case 'min':
                $code[] = "    ->min('{$column}')";
                break;
        }

        $code[] = "    ->execute();";
        return implode("\n", $code);
    }

    /**
     * Handle UPDATE query
     */
    private function handleUpdateQuery(string $sql): string {
        // Parse UPDATE query
        if (!preg_match('/UPDATE\s+`?(\w+)`?\s+SET\s+(.*?)(?:WHERE\s+(.*))?$/is', $sql, $matches)) {
            throw new \Exception('Format query UPDATE tidak valid');
        }

        $table = $matches[1];
        $setParts = explode(',', $matches[2]);
        $where = $matches[3] ?? '';

        $code = [];
        $code[] = "\$Tds = new Ngorei();";
        $code[] = "\$Tds->Network->Brief('{$table}')";

        // Parse SET values
        $setData = [];
        foreach ($setParts as $setPart) {
            if (preg_match('/`?(\w+)`?\s*=\s*(.+)/i', trim($setPart), $setMatch)) {
                $column = $setMatch[1];
                $value = trim($setMatch[2], "'\" ");
                if (is_numeric($value)) {
                    $setData[] = "    '{$column}' => {$value}";
                } else {
                    $setData[] = "    '{$column}' => '{$value}'";
                }
            }
        }

        $code[] = "    ->update([";
        $code[] = implode(",\n", $setData);
        $code[] = "    ])";

        // Add WHERE if exists
        if (!empty($where)) {
            $code[] = "    ->where('{$where}')";
        }

        $code[] = "    ->execute();";
        return implode("\n", $code);
    }

    /**
     * Handle DELETE query
     */
    private function handleDeleteQuery(string $sql): string {
        // Parse DELETE query
        if (!preg_match('/DELETE\s+FROM\s+`?(\w+)`?\s*(?:WHERE\s+(.*))?$/is', $sql, $matches)) {
            throw new \Exception('Format query DELETE tidak valid');
        }

        $table = $matches[1];
        $where = $matches[2] ?? '';

        $code = [];
        $code[] = "\$Tds =new Ngorei();";
        $code[] = "\$Tds->Network->Brief('{$table}')";
        $code[] = "    ->delete()";

        // Add WHERE if exists
        if (!empty($where)) {
            $code[] = "    ->where('{$where}')";
        }

        $code[] = "    ->execute();";
        return implode("\n", $code);
    }

    /**
     * Handle WITH (CTE) query
     */
    private function handleWithQuery(string $sql): string {
        // Parse WITH query
        if (!preg_match('/WITH\s+(\w+)\s+AS\s*\((.*?)\)\s*(SELECT.*)/is', $sql, $matches)) {
            throw new \Exception('Format query WITH tidak valid');
        }

        $cteName = $matches[1];
        $cteQuery = $matches[2];
        $mainQuery = $matches[3];

        $code = [];
        $code[] = "\$Tds = new Ngorei();";
        $code[] = "\$cte = \$Tds->Network->Brief()";
        $code[] = "    ->withCTE('{$cteName}', function(\$query) {";
        $code[] = "        \$query" . $this->handleSelectQuery($cteQuery);
        $code[] = "    })";
        $code[] = $this->handleSelectQuery($mainQuery);

        return implode("\n", $code);
    }

    /**
     * Handle Pagination Query
     */
    private function handlePaginationQuery(string $sql, string $perPage, string $pageNumber, string $perPageCalc): string {
        // Parse table name
        if (!preg_match('/FROM\s+`?(\w+)`?/i', $sql, $matches)) {
            throw new \Exception('Format query tidak valid');
        }

        $table = $matches[1];

        $code = [];
        $code[] = "\$Tds = new Ngorei();";
        $code[] = "\$Tds->Network->Brief('{$table}')";
        $code[] = "    ->page({$pageNumber})";
        $code[] = "    ->perPage({$perPage})";
        $code[] = "    ->paginate()";
        $code[] = "    ->execute();";

        return implode("\n", $code);
    }
} 