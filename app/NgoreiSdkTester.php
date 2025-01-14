<?php
namespace app;
use app\tatiye;

class NgoreiSdkTester {
    private $error = null;

    /**
     * Mengkonversi SQL query ke Query Builder
     */
    public function convertToBuilder(string $sql): string {
        try {
            // Validasi SQL dasar
            if (empty(trim($sql))) {
                throw new \Exception("SQL query tidak boleh kosong");
            }

            // Deteksi tipe query dan gunakan handler yang sesuai
            if ($this->isSelectQuery($sql)) {
                return $this->handleSelectQuery($sql);
            } 
            elseif ($this->isJoinQuery($sql)) {
                return $this->handleJoinQuery($sql);
            }
            elseif ($this->isInsertQuery($sql)) {
                return $this->handleInsertQuery($sql);
            }
            elseif ($this->isUpdateQuery($sql)) {
                return $this->handleUpdateQuery($sql);
            }
            elseif ($this->isDeleteQuery($sql)) {
                return $this->handleDeleteQuery($sql);
            }
            else {
                throw new \Exception("Tipe query tidak didukung");
            }
        } catch (\Exception $e) {
            $this->error = $e->getMessage();
            return $this->formatError($e->getMessage(), $sql);
        }
    }

    /**
     * Deteksi tipe query
     */
    private function isSelectQuery(string $sql): bool {
        // Perbaikan regex untuk mendeteksi SELECT dengan fungsi agregat
        return preg_match('/^\s*SELECT\s+(?:[\w\s\.,\(\)\*]+)\s+FROM\s+[`"\w]+/i', $sql);
    }

    /**
     * Deteksi tipe JOIN query
     */
    private function isJoinQuery(string $sql): bool {
        return preg_match('/\b(?:LEFT\s+|RIGHT\s+|INNER\s+)?JOIN\b/i', $sql);
    }

    private function isInsertQuery(string $sql): bool {
        return preg_match('/^\s*INSERT\s+INTO/i', $sql);
    }

    private function isUpdateQuery(string $sql): bool {
        return preg_match('/^\s*UPDATE/i', $sql);
    }

    private function isDeleteQuery(string $sql): bool {
        return preg_match('/^\s*DELETE/i', $sql);
    }

    /**
     * Handle SELECT Query
     */
    private function handleSelectQuery(string $sql): string {
        $parts = $this->parseSelectQuery($sql);
        
        // Deteksi apakah query memerlukan pagination
        $parts['pagination'] = false; // Default tidak menggunakan pagination
        
        // Cek kata kunci yang menandakan perlu pagination
        if (strpos(strtolower($sql), 'paginate') !== false || 
            strpos(strtolower($sql), 'per_page') !== false ||
            strpos(strtolower($sql), 'page') !== false) {
            $parts['pagination'] = true;
        }
        
        return $this->generateSelectBuilder($parts);
    }

    /**
     * Parse SELECT Query
     */
    private function parseSelectQuery(string $sql): array {
        $parts = [
            'table' => '',
            'select' => [],
            'where' => [],
            'orderBy' => null,
            'orderDirection' => null,
            'limit' => null,
            'offset' => null,
            'whereIn' => [],
            'groupBy' => [],
            'having' => [],
            'aggregates' => []
        ];

        // Parse SELECT columns
        if (preg_match('/SELECT\s+(.+?)\s+FROM/is', $sql, $matches)) {
            $selectPart = trim($matches[1]);
            
            if ($selectPart === '*') {
                $parts['select'] = ['*'];
            } else {
                // Parse kolom biasa dan fungsi agregat
                $columns = explode(',', $selectPart);
                foreach ($columns as $column) {
                    $column = trim($column);
                    
                    // Parse fungsi agregat
                    if (preg_match('/(COUNT|SUM|AVG|MAX|MIN)\(([^\)]+)\)(?:\s+(?:AS\s+)?(\w+))?/i', $column, $matches)) {
                        $parts['aggregates'][] = [
                            'function' => strtolower($matches[1]),
                            'column' => trim($matches[2]),
                            'alias' => isset($matches[3]) ? trim($matches[3]) : null
                        ];
                    }
                    // Parse kolom biasa
                    else if (preg_match('/(\w+)(?:\.(\w+))?(?:\s+(?:AS\s+)?(\w+))?/i', $column, $matches)) {
                        if (isset($matches[3])) {
                            $parts['select'][] = [
                                'column' => isset($matches[2]) ? "{$matches[1]}.{$matches[2]}" : $matches[1],
                                'alias' => $matches[3]
                            ];
                        } else {
                            $parts['select'][] = isset($matches[2]) ? "{$matches[1]}.{$matches[2]}" : $matches[1];
                        }
                    }
                }
            }
        }

        // Parse FROM table
        if (preg_match('/FROM\s+[`"]?(\w+)[`"]?/i', $sql, $matches)) {
            $parts['table'] = trim($matches[1], '`"');
        }

        // Parse WHERE conditions
        if (preg_match('/WHERE\s+(.+?)(?:GROUP BY|ORDER BY|LIMIT|;|\s*$)/i', $sql, $matches)) {
            $whereClause = trim($matches[1]);
            
            // Handle WHERE IN
            if (preg_match('/(\w+)\s+IN\s*\((.*?)\)/i', $whereClause, $inMatches)) {
                $values = array_map(function($val) {
                    return trim($val, "'\" ");
                }, explode(',', $inMatches[2]));
                
                $parts['whereIn'] = [
                    'column' => trim($inMatches[1], '`"'),
                    'values' => $values
                ];
            } else {
                // Handle normal WHERE conditions
                $conditions = preg_split('/\s+AND\s+/i', $whereClause);
                foreach ($conditions as $condition) {
                    if (preg_match('/[`"]?(\w+)[`"]?\s*(=|>|<|>=|<=)\s*[\'"]*([^\'"\s;]+)[\'"]*/', trim($condition), $m)) {
                        $parts['where'][] = [
                            'column' => trim($m[1], '`"'),
                            'operator' => $m[2],
                            'value' => trim($m[3], "'\"")
                        ];
                    }
                }
            }
        }

        // Parse GROUP BY
        if (preg_match('/GROUP\s+BY\s+(.+?)(?:HAVING|ORDER|LIMIT|$)/is', $sql, $matches)) {
            $groupColumns = array_map('trim', explode(',', $matches[1]));
            $parts['groupBy'] = $groupColumns;
        }

        // Parse HAVING
        if (preg_match('/HAVING\s+(.+?)(?:ORDER|LIMIT|$)/is', $sql, $matches)) {
            if (preg_match('/(\w+)\s*(>|<|=|>=|<=)\s*(\d+)/', $matches[1], $havingMatch)) {
                $parts['having'] = [
                    'column' => $havingMatch[1],
                    'operator' => $havingMatch[2],
                    'value' => $havingMatch[3]
                ];
            }
        }

        // Parse ORDER BY
        if (preg_match('/ORDER\s+BY\s+[`"]?(\w+)[`"]?\s*(ASC|DESC)?/i', $sql, $matches)) {
            $parts['orderBy'] = trim($matches[1], '`"');
            $parts['orderDirection'] = !empty($matches[2]) ? strtoupper($matches[2]) : 'ASC';
        }

        // Parse LIMIT dan OFFSET
        if (preg_match('/LIMIT\s+(\d+)(?:\s+OFFSET\s+(\d+))?/i', $sql, $matches)) {
            $parts['limit'] = (int)$matches[1];
            if (!empty($matches[2])) {
                $parts['offset'] = (int)$matches[2];
            }
        }

        return $parts;
    }

    /**
     * Generate SELECT Query Builder
     */
    private function generateSelectBuilder(array $parts): string {
        $code = "\$Tds = new Ngorei();\n";
        $code .= "\$result = \$Tds->Network->Brief('{$parts['table']}')";

        // Add SELECT columns
        if (!empty($parts['select']) && $parts['select'] !== ['*']) {
            $columns = [];
            foreach ($parts['select'] as $col) {
                if (is_array($col)) {
                    $columns[] = isset($col['alias']) ? 
                        "{$col['column']} as {$col['alias']}" : 
                        $col['column'];
                } else {
                    $columns[] = $col;
                }
            }
            $code .= "\n    ->select(['" . implode("', '", $columns) . "'])";
        }

        // Add WHERE conditions
        if (!empty($parts['where'])) {
            foreach ($parts['where'] as $condition) {
                $code .= sprintf("\n    ->where('%s %s ?', ['%s'])",
                    $condition['column'],
                    $condition['operator'],
                    $condition['value']
                );
            }
        }

        // Add WHERE IN
        if (!empty($parts['whereIn'])) {
            $values = "['" . implode("', '", $parts['whereIn']['values']) . "']";
            $code .= sprintf("\n    ->whereIn('%s', %s)",
                $parts['whereIn']['column'],
                $values
            );
        }

        // Add GROUP BY
        if (!empty($parts['groupBy'])) {
            foreach ($parts['groupBy'] as $column) {
                $code .= sprintf("\n    ->groupBy('%s')", trim($column));
            }
        }

        // Add HAVING
        if (!empty($parts['having'])) {
            $code .= sprintf("\n    ->having('%s %s %s')",
                $parts['having']['column'],
                $parts['having']['operator'],
                $parts['having']['value']
            );
        }

        // Add agregat functions
        if (!empty($parts['aggregates'])) {
            foreach ($parts['aggregates'] as $agg) {
                switch ($agg['function']) {
                    case 'count':
                        $code .= sprintf("\n    ->count('%s'%s)", 
                            $agg['column'],
                            $agg['alias'] ? ", '{$agg['alias']}'" : ''
                        );
                        break;
                    case 'sum':
                        $code .= sprintf("\n    ->sum('%s'%s)", 
                            $agg['column'],
                            $agg['alias'] ? ", '{$agg['alias']}'" : ''
                        );
                        break;
                    case 'avg':
                        $code .= sprintf("\n    ->avg('%s'%s)", 
                            $agg['column'],
                            $agg['alias'] ? ", '{$agg['alias']}'" : ''
                        );
                        break;
                    case 'max':
                        $code .= sprintf("\n    ->max('%s'%s)", 
                            $agg['column'],
                            $agg['alias'] ? ", '{$agg['alias']}'" : ''
                        );
                        break;
                    case 'min':
                        $code .= sprintf("\n    ->min('%s'%s)", 
                            $agg['column'],
                            $agg['alias'] ? ", '{$agg['alias']}'" : ''
                        );
                        break;
                }
            }
        }

        // Add ORDER BY
        if (!empty($parts['orderBy'])) {
            $code .= sprintf("\n    ->orderBy('%s', '%s')",
                $parts['orderBy'],
                $parts['orderDirection']
            );
        }

        // Add LIMIT dan OFFSET
        if (!$parts['pagination'] && !empty($parts['limit'])) {
            $code .= sprintf("\n    ->limit(%d)", $parts['limit']);
            if (!empty($parts['offset'])) {
                $code .= sprintf("\n    ->offset(%d)", $parts['offset']);
            }
            $code .= "\n    ->execute();";
        }
        // Add Pagination
        else if ($parts['pagination']) {
            $code .= "\n    ->perPage(10)";
            $code .= "\n    ->page(1)";
            $code .= "\n    ->paginate();";
        }
        // Execute biasa
        else {
            $code .= "\n    ->execute();";
        }

        return $code;
    }

    /**
     * Handle JOIN Query
     */
    private function handleJoinQuery(string $sql): string {
        $joinHandler = new NgoreiJoinHandler();
        return $joinHandler->handle($sql);
    }

    /**
     * Format error message
     */
    private function formatError(string $message, string $sql): string {
        return sprintf("// Error: %s\n// Query: %s", $message, $sql);
    }

    /**
     * Menampilkan hasil konversi
     */
    public function showConversion(string $sql): string {
        $builderCode = $this->convertToBuilder($sql);
        
        if ($this->error) {
            return sprintf(
                "<div class='error-box'>Error: %s</div>",
                htmlspecialchars($this->error)
            );
        }

        return "<pre><code>$builderCode</code></pre>";
    }

    /**
     * Handle INSERT Query
     */
    private function handleInsertQuery(string $sql): string {
        $parts = $this->parseInsertQuery($sql);
        return $this->generateInsertBuilder($parts);
    }

    /**
     * Parse INSERT Query
     */
    private function parseInsertQuery(string $sql): array {
        $parts = [
            'table' => '',
            'columns' => [],
            'values' => []
        ];

        // Parse table dan columns
        if (preg_match('/INSERT\s+INTO\s+`?(\w+)`?\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i', $sql, $matches)) {
            $parts['table'] = trim($matches[1], '`');
            $parts['columns'] = array_map(function($col) {
                return trim($col, '` ');
            }, explode(',', $matches[2]));
            $parts['values'] = array_map(function($val) {
                return trim($val, " '\"");
            }, explode(',', $matches[3]));
        }

        return $parts;
    }

    /**
     * Generate INSERT Query Builder
     */
    private function generateInsertBuilder(array $parts): string {
        $code = "\$Tds = new Ngorei();\n";
        $code .= "\$result = \$Tds->Network->Brief('{$parts['table']}')";
        
        // Format data insert
        $data = array_combine($parts['columns'], $parts['values']);
        $dataStr = "[\n";
        foreach ($data as $key => $value) {
            $dataStr .= sprintf("        '%s' => '%s',\n", $key, $value);
        }
        $dataStr .= "    ]";
        
        $code .= "\n    ->insert({$dataStr});";
        return $code;
    }

    /**
     * Handle UPDATE Query
     */
    private function handleUpdateQuery(string $sql): string {
        $parts = $this->parseUpdateQuery($sql);
        return $this->generateUpdateBuilder($parts);
    }

    /**
     * Parse UPDATE Query
     */
    private function parseUpdateQuery(string $sql): array {
        $parts = [
            'table' => '',
            'set' => [],
            'where' => []
        ];

        // Parse table
        if (preg_match('/UPDATE\s+`?(\w+)`?\s+SET/i', $sql, $matches)) {
            $parts['table'] = trim($matches[1], '`');
        }

        // Parse SET values
        if (preg_match('/SET\s+(.+?)(?:\s+WHERE|$)/i', $sql, $matches)) {
            $setPairs = explode(',', $matches[1]);
            foreach ($setPairs as $pair) {
                if (preg_match('/`?(\w+)`?\s*=\s*[\'"]*([^\'",\s]+)[\'"]*/', trim($pair), $m)) {
                    $parts['set'][] = [
                        'column' => trim($m[1], '`'),
                        'value' => trim($m[2], "'\"")
                    ];
                }
            }
        }

        // Parse WHERE conditions
        if (preg_match('/WHERE\s+(.+?)(?:;|\s*$)/i', $sql, $matches)) {
            $whereClause = trim($matches[1]);
            $conditions = explode(' AND ', $whereClause);
            
            foreach ($conditions as $condition) {
                if (preg_match('/`?(\w+)`?\s*(=|>|<|>=|<=)\s*[\'"]*([^\'"\s;]+)[\'"]*/', trim($condition), $m)) {
                    $parts['where'][] = [
                        'column' => trim($m[1], '`'),
                        'operator' => $m[2],
                        'value' => trim($m[3], "'\"")
                    ];
                }
            }
        }

        return $parts;
    }

    /**
     * Generate UPDATE Query Builder
     */
    private function generateUpdateBuilder(array $parts): string {
        $code = "\$Tds = new Ngorei();\n";
        $code .= "\$result = \$Tds->Network->Brief('{$parts['table']}')";

        // Add WHERE conditions
        if (!empty($parts['where'])) {
            foreach ($parts['where'] as $condition) {
                $code .= sprintf("\n    ->where('%s %s ?', ['%s'])",
                    $condition['column'],
                    $condition['operator'],
                    $condition['value']
                );
            }
        }

        // Format data update
        $updateData = [];
        foreach ($parts['set'] as $set) {
            $updateData[$set['column']] = $set['value'];
        }
        
        $dataStr = "[\n";
        foreach ($updateData as $key => $value) {
            $dataStr .= sprintf("        '%s' => '%s',\n", $key, $value);
        }
        $dataStr .= "    ]";

        $code .= "\n    ->update({$dataStr});";
        return $code;
    }

    /**
     * Handle DELETE Query
     */
    private function handleDeleteQuery(string $sql): string {
        $parts = $this->parseDeleteQuery($sql);
        return $this->generateDeleteBuilder($parts);
    }

    /**
     * Parse DELETE Query
     */
    private function parseDeleteQuery(string $sql): array {
        $parts = [
            'table' => '',
            'where' => []
        ];

        // Parse table
        if (preg_match('/DELETE\s+FROM\s+`?(\w+)`?/i', $sql, $matches)) {
            $parts['table'] = trim($matches[1], '`');
        }

        // Parse WHERE conditions
        if (preg_match('/WHERE\s+(.+?)(?:;|\s*$)/i', $sql, $matches)) {
            $whereClause = trim($matches[1]);
            $conditions = explode(' AND ', $whereClause);
            
            foreach ($conditions as $condition) {
                if (preg_match('/`?(\w+)`?\s*(=|>|<|>=|<=)\s*[\'"]*([^\'"\s;]+)[\'"]*/', trim($condition), $m)) {
                    $parts['where'][] = [
                        'column' => trim($m[1], '`'),
                        'operator' => $m[2],
                        'value' => trim($m[3], "'\"")
                    ];
                }
            }
        }

        return $parts;
    }

    /**
     * Generate DELETE Query Builder
     */
    private function generateDeleteBuilder(array $parts): string {
        $code = "\$Tds = new Ngorei();\n";
        $code .= "\$result = \$Tds->Network->Brief('{$parts['table']}')";

        // Add WHERE conditions
        if (!empty($parts['where'])) {
            foreach ($parts['where'] as $condition) {
                $code .= sprintf("\n    ->where('%s %s ?', ['%s'])",
                    $condition['column'],
                    $condition['operator'],
                    $condition['value']
                );
            }
        }

        $code .= "\n    ->delete();";
        return $code;
    }
}

