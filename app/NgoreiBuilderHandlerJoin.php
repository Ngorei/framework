<?php
namespace app;

class NgoreiBuilderHandlerJoin {
    private $parts = [
        'table' => '',
        'select' => [],
        'joins' => [],
        'alias' => [],
        'groupBy' => null
    ];

    // Handle Simple JOIN
    public function handleSimpleJoin($sql) {
        $this->parseBasicParts($sql);
        return $this->parseJoinCondition($sql, 'JOIN');
    }

    // Handle LEFT JOIN
    public function handleLeftJoin($sql) {
        $this->parseBasicParts($sql);
        return $this->parseJoinCondition($sql, 'LEFT JOIN');
    }

    // Handle RIGHT JOIN
    public function handleRightJoin($sql) {
        $this->parseBasicParts($sql);
        return $this->parseJoinCondition($sql, 'RIGHT JOIN');
    }

    private function parseBasicParts($sql) {
        // Parse SELECT columns
        if (preg_match('/SELECT\s+(.+?)\s+FROM/is', $sql, $matches)) {
            $selectPart = trim($matches[1]);
            $columns = explode(',', $selectPart);
            foreach ($columns as $col) {
                $col = trim($col);
                if (preg_match('/(\w+)\.(\w+)/', $col, $matches)) {
                    $this->parts['select'][] = $matches[1] . '.' . $matches[2];
                }
            }
        }

        // Parse FROM table with alias
        if (preg_match('/FROM\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?/i', $sql, $matches)) {
            $this->parts['table'] = $matches[1];
            if (!empty($matches[2])) {
                $this->parts['alias'][$matches[1]] = $matches[2];
            }
        }
    }

    private function parseJoinCondition($sql, $joinType) {
        $pattern = sprintf('/%s\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/i', 
            preg_quote($joinType));
        
        if (preg_match($pattern, $sql, $matches)) {
            $table = $matches[1];
            $alias = !empty($matches[2]) ? $matches[2] : null;
            
            // Format kondisi join sesuai NgoreiBuilder
            $condition = sprintf('%s.%s = %s.%s',
                $matches[3], $matches[4],
                $matches[5], $matches[6]
            );

            // Format join sesuai format Ngorei
            $joinMethod = strtolower(str_replace(' ', '', $joinType));
            if ($joinMethod === 'join') {
                $joinMethod = 'join'; // INNER JOIN
            }

            // Jika ada alias, tambahkan ke nama tabel
            $tableName = $alias ? $table . ' AS ' . $alias : $table;

            return sprintf("    ->%s('%s', '%s')", 
                $joinMethod,
                $tableName,
                $condition
            );
        }
        return '';
    }
} 